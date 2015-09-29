var Page = 'Map';
var UserID = localStorage.getItem("UserId");
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var start = JSON.parse(localStorage.getItem('txtStartLocation'));
var end = JSON.parse(localStorage.getItem('txtDestination'));
var MyLocation = JSON.parse(localStorage.getItem('Current'));
var map;
var started = false;
var MyPos;
$(document).ready(function () {
    $.loader({
        className: "blue-with-image",
        content: ''
    });
});
google.maps.event.addDomListener(window, 'load', initialize);
function initialize() {
    console.debug(start);
    navigator.geolocation.getCurrentPosition(function (position) {
        var geolocate = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        directionsDisplay = new google.maps.DirectionsRenderer();
        var mapOptions = {
            center: { lat: latitude, lng: longitude },
            zoom: 15
        };
        map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);
        directionsDisplay.setMap(map);
        calcRoute();
    });
}
function Stop()
{
    $('.inprogress-bar').fadeOut(500);
    $('.stop-bar').fadeIn(500);
}
function noClicked()
{
    $('.inprogress-bar').fadeIn(500);
    $('.stop-bar').fadeOut(500);
}
function showRoute() {
    $('.route-bar').toggle(500);
}
function panToMe() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (pos) {
            var crd = pos.coords;
            var me = new google.maps.LatLng(crd.latitude, crd.longitude);
            map.panTo(me);
        });
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}
function endRouting() {
    location.href = "home.html";
}
function startMoving() {
    setInterval(function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(drawMe);
        } else {
            x.innerHTML = "Geolocation is not supported by this browser.";
        }
    }, 12000);
    $('.inprogress-bar').show();
    $('.start-bar').hide();
    map.setZoom(17);
    var panTo;
    if (MyLocation == null)
        panTo = new google.maps.LatLng(start.geometry.location.A, start.geometry.location.F);
    else
        panTo = start;
    map.panTo(panTo)
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(drawMe);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}
function drawMe(pos)
{
    if (MyPos != null)
    MyPos.setMap(null);
    var crd = pos.coords;
    var me = new google.maps.LatLng(crd.latitude, crd.longitude);
    var populationOptions = {
        strokeColor: '#000066',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#003399',
        fillOpacity: 0.7,
        map: map,
        center: me,
        radius: 5
    };
    console.debug("Drawing: " + MyPos);
    MyPos = new google.maps.Circle(populationOptions);
    // Add the circle for this city to the map.
}
function calcRoute() {
    if (MyLocation != null)
        start = new google.maps.LatLng(MyLocation.A, MyLocation.F);
    var request = {
        origin: start,
        destination: end.formatted_address,
        travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            console.debug(response);
            var instructions = response.routes[0].legs[0];
            $('.route-bar').append('<h2>Distance: ' + instructions.distance.text + '</h2>');
            for (var i = 0 ; i < instructions.steps.length ; i ++)
            {
                $('.route-bar').append('<p' + instructions.steps[i].instructions + '</p>');
                $.loader('close');
            }
        }
        else
        {
            console.debug(response);
        }
    });
}