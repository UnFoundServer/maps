// script.js
ymaps.ready(init);

function init() {
    var myMap = new ymaps.Map('map', {
        center: [55.751244, 37.618423],
        zoom: 10,
        type: 'yandex#map',
        controls: ['zoomControl', 'searchControl', 'trafficControl']
    });

    var multiRoute;

    // Function to build the route
    window.buildRoute = function() {
        var startAddress = document.getElementById('start').value;
        var finishAddress = document.getElementById('finish').value;

        // Geocode start and finish addresses
        ymaps.geocode(startAddress, { results: 1 }).then(function (res) {
            var startPoint = res.geoObjects.get(0).geometry.getCoordinates();

            ymaps.geocode(finishAddress, { results: 1 }).then(function (res) {
                var finishPoint = res.geoObjects.get(0).geometry.getCoordinates();

                // Remove previous route if exists
                if (multiRoute) {
                    myMap.geoObjects.remove(multiRoute);
                }

                // Create a multi-route object
                multiRoute = new ymaps.multiRouter.MultiRoute({
                    referencePoints: [
                        startPoint,
                        finishPoint
                    ],
                    params: {
                        routingMode: 'auto',
                        avoidTrafficJams: true
                    }
                }, {
                    boundsAutoApply: true
                });

                // Add the multi-route to the map
                myMap.geoObjects.add(multiRoute);

                // Display route information
                multiRoute.model.events.add('requestsuccess', function() {
                    var activeRoute = multiRoute.getActiveRoute();
                    if (activeRoute) {
                        var length = activeRoute.properties.get("distance").text;
                        var duration = activeRoute.properties.get("duration").text;
                        alert('Расстояние: ' + length + '\nВремя: ' + duration);
                    }
                });
            });
        });
    };
}
