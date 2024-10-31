// Create a simple HTML structure using JavaScript
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Geolocation Example with Map</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            padding: 20px;
            background-color: #f4f4f4;
        }
        button {
            margin: 5px;
            padding: 10px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        button:hover {
            background-color: #0056b3;
        }
        #map {
            height: 400px;
            margin-top: 20px;
        }
    </style>
</head>
<body>

<h2>Your Current Location</h2>
<div id="location"></div>
<div id="distance"></div>
<button id="getLocation">Get Location</button>
<button id="watchLocation">Watch Location</button>
<button id="stopWatch">Stop Watching</button>

<div id="map"></div>

<script>
    let watchId = null;
    const collegeCoordinates = { lat: 50.4501, lng: 30.5234 }; // Example coordinates (Kyiv)

    function displayLocation(position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;

        document.getElementById("location").innerHTML = 
            \`Latitude: \${lat}, Longitude: \${lng}, Accuracy: \${accuracy} meters\`;

        const distance = computeDistance(lat, lng, collegeCoordinates.lat, collegeCoordinates.lng);
        document.getElementById("distance").innerHTML = \`Distance to College: \${distance.toFixed(2)} km\`;

        // Update map
        updateMap(lat, lng);
    }

    function errorHandler(error) {
        console.warn(\`ERROR(\${error.code}): \${error.message}\`);
        document.getElementById("location").innerHTML = \`Unable to retrieve location: \${error.message}\`;
    }

    function computeDistance(lat1, lon1, lat2, lon2) {
        const toRad = (value) => value * Math.PI / 180;
        const R = 6371; // Radius of the Earth in km

        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Distance in km
    }

    document.getElementById("getLocation").onclick = function() {
        navigator.geolocation.getCurrentPosition(displayLocation, errorHandler);
    };

    document.getElementById("watchLocation").onclick = function() {
        watchId = navigator.geolocation.watchPosition(displayLocation, errorHandler);
    };

    document.getElementById("stopWatch").onclick = function() {
        if (watchId !== null) {
            navigator.geolocation.clearWatch(watchId);
            watchId = null;
        }
    };

    // Map initialization
    function initMap() {
        const map = new google.maps.Map(document.getElementById("map"), {
            zoom: 12,
            center: collegeCoordinates,
        });
        // Add a marker for the college location
        new google.maps.Marker({
            position: collegeCoordinates,
            map: map,
            title: "College Location",
        });
    }

    function updateMap(lat, lng) {
        const myLocation = new google.maps.LatLng(lat, lng);
        const map = new google.maps.Map(document.getElementById("map"), {
            zoom: 12,
            center: myLocation,
        });

        const marker = new google.maps.Marker({
            position: myLocation,
            map: map,
            title: "You are here!",
        });

        marker.addListener("click", () => {
            const infoWindow = new google.maps.InfoWindow({
                content: \`Lat: \${lat}, Lng: \${lng}\`,
            });
            infoWindow.open(map, marker);
        });
    }

    // Load Google Maps
    const script = document.createElement("script");
    script.src = "https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap";
    script.async = true;
    document.head.appendChild(script);
</script>

</body>
</html>
`;

// Create a Blob and generate a URL for the HTML content
const blob = new Blob([htmlContent], { type: 'text/html' });
const url = URL.createObjectURL(blob);

// Open the generated URL in a new tab
window.open(url);
