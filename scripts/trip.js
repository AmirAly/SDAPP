var Page = 'Trip';
var UserID = localStorage.getItem("UserId");
$(document).ready(function () {
    if (User == null || typeof User == 'undefined' || User.Id < 1 || User.Email == "guest@superdrive.com") {
        //hide icons
        $('.toggleShow').attr('style', 'display:none !important');
        console.log('not logged');
    }
    else {
        //show icons
        $('.toggleShow').attr('style', 'display:block !important');
        console.log('logged');
    }
    console.debug(User);
    geolocate();
});
function startTrip() {
    location.href = "map.html";
}

var placeSearch, autocomplete, autocomplete2;
function initializeStart(txtFeild) {
    // Create the autocomplete object, restricting the search
    // to geographical location types.
    autocomplete = new google.maps.places.Autocomplete(
        /** @type {HTMLInputElement} */(document.getElementById(txtFeild)),
        { types: ['geocode'] });
    // When the user selects an address from the dropdown,
    // populate the address fields in the form.
    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        var place = autocomplete.getPlace();
        localStorage.setItem(txtFeild, JSON.stringify(place));
    });
}
function initializeEnd(txtFeild) {
    // Create the autocomplete object, restricting the search
    // to geographical location types.
    autocomplete2 = new google.maps.places.Autocomplete(
        /** @type {HTMLInputElement} */(document.getElementById(txtFeild)),
        { types: ['geocode'] });
    // When the user selects an address from the dropdown,
    // populate the address fields in the form.
    google.maps.event.addListener(autocomplete2, 'place_changed', function () {
        var place = autocomplete2.getPlace();
        localStorage.setItem(txtFeild, JSON.stringify(place));
    });
    var Tut = localStorage.getItem(Page + "_Tut");
    if (Tut != true && Tut != "true") {
        introJs().start();
        localStorage.setItem(Page + "_Tut", true);
    }
    LoadUserData();
}
// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
    if (navigator.geolocation) {
        console.log(navigator.geolocation);
        navigator.geolocation.getCurrentPosition(function (position) {
            var geolocation = new google.maps.LatLng(
                position.coords.latitude, position.coords.longitude);
            var circle = new google.maps.Circle({
                center: geolocation,
                radius: position.coords.accuracy
            });
            localStorage.setItem('Current', JSON.stringify(geolocation));
            console.log(position);
            autocomplete.setBounds(circle.getBounds());
            $(".geo").removeAttr("disabled");
        });
        initializeStart('txtStartLocation');
        initializeEnd('txtDestination');
    }
    else {
        $.gritter.add({
            title: 'It seems there is something wrong !',
            text: 'Your GPS looks disabled, Please enable it first',
            sticky: true,
            class_name: 'bg-info',
            time: '400'
        });
    }
}