// script.js
ymaps.ready(init);

function init() {
    var myMap = new ymaps.Map('map', {
        center: [55.751244, 37.618423],
        zoom: 10,
        type: 'yandex#map',
        controls: ['zoomControl', 'searchControl', 'trafficControl']
    });

    // Function to build the route
    window.buildRoute = function() {
        var startAddress = document.getElementById('start').value;
        var finishAddress = document.getElementById('finish').value;

        // Geocode start and finish addresses
        ymaps.geocode(startAddress, { results: 1 }).then(function (res) {
            var startPoint = res.geoObjects.get(0).geometry.getCoordinates();

            ymaps.geocode(finishAddress, { results: 1 }).then(function (res) {
                var finishPoint = res.geoObjects.get(0).geometry.getCoordinates();

                // Build route using Yandex Routing API
                buildRouteWithAPI(startPoint, finishPoint);
            });
        });
    };

    function buildRouteWithAPI(startPoint, finishPoint) {
        var startCoords = startPoint.join(',');
        var finishCoords = finishPoint.join(',');

        var apiKey = 'f174ff47-41d0-459b-8b1f-16f0bc134030';  // Replace with your actual API key
        var url = `https://api.routing.yandex.net/v2/route?waypoints=${startCoords}|${finishCoords}&apikey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                var route = data.routes[0];
                var distance = route.legs.reduce((acc, leg) => acc + leg.length.value, 0) / 1000;  // distance in km
                var duration = route.legs.reduce((acc, leg) => acc + leg.duration_in_traffic.value, 0) / 60;  // duration in minutes

                alert(`Расстояние: ${distance.toFixed(2)} км\nВремя в пути: ${Math.round(duration)} минут`);

                // Draw the route on the map
                var coords = route.legs.flatMap(leg => leg.steps.map(step => step.start_location));

                var polyline = new ymaps.Polyline(coords, {}, {
                    strokeColor: "#0000FF",
                    strokeWidth: 4,
                    strokeOpacity: 0.5
                });

                myMap.geoObjects.add(polyline);
                myMap.setBounds(polyline.geometry.getBounds());
            })
            .catch(error => console.error('Ошибка:', error));
    }
}
