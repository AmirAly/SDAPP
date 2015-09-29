
var Page = 'Home';
IsRefreshing = false;
var CurrentCountry = User.Country;
var CountryToChange = User.Country;
var ImageInBase64 = null;
function Ad()
{
    $('#imgAd').fadeIn(3000, function () {
        $('#txt1').fadeIn(1500, function () {
            $("#txt2").fadeIn(1000);
        });
    });
}
$(document).ready(function () {
    //CurrentCountry = User.CurrentCountry;
    //CountryToChange = User.CurrentCountry;
    $("#page-wrapper").attr('style', 'margin-top: 88px !important');
    if (User == null || typeof User == 'undefined' || User.Id < 1) {
        window.location.href = "index.html";
    }
    else {
        loadHome();
        loadUserData();
        Ad();
    }
});
function showGPSBar()
{
    $('.gps-bar').toggle();
}

function toggleAr()
{
    if (AutoReporting == false)
    {
        $('#ARInd').addClass('AREnabled');
        $('#ARInd').removeClass('ARDisabled');
        localStorage.setItem('AutoReporting', true);
        AutoReporting = true;
        ARHandler = setInterval(AR(), 600*1000);
    }
    else
    {
        $('#ARInd').addClass('ARDisabled');
        $('#ARInd').removeClass('AREnabled');
        localStorage.setItem('AutoReporting', false);
        AutoReporting = false;
        ARHandler.clear();
        ARHandler = null;
    }
}
function loadUserData() {
    var _Url = APILink + '/api/Users/GetById';
    var _Type = 'get';
    var _Data = { '_Id': User.Id };
    CallAPI(_Url, _Type, _Data, function (data) {
        console.debug("User: "+data.Data);
            if (data.Data.Img == 'null' || data.Data.Img == null)
                data.Data.Img = 'images/unknown.png';
            $('#user-img').attr('src', data.Data.Img);
            if (data.Data.DisplayName == null) {
                $('#user-name').text("");
            }
            else {
                $('#user-name').text(data.Data.DisplayName);
                $('#user-img').attr('src', data.Data.Img);
                localStorage.setItem('User',JSON.stringify(data.Data));
            }
    },false);
}

function getCurrentStreetLocation() {
    $('.gps-bar').toggle();
    $.loader({
        className: "blue-with-image",
        content: ''
    });
    $('#mobile-nav-bar').removeClass('in');
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showCurrentStreetPosition);
    } else {
        alert("Geo location is not supported by your browser!");
    }
}

function getCurrentCountryLocation() {
    $.loader({
        className: "blue-with-image",
        content: ''
    });
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showCurrentCountryPosition);
    } else {
        $.loader('close');
    }
}

function GetCurrentStreetName(lat, long) {
    $('#mobile-nav-bar').removeClass('in');
    var _Url = 'http://maps.googleapis.com/maps/api/geocode/json';
    var _Type = 'get';
    var _Data = { 'latlng': lat + ',' + long, 'sensor': 'true' };
    CallAPI(_Url, _Type, _Data, function (data) {
        var myAddress = new Array();
        myAddress = data.results[0].formatted_address.split(',');
        var Url = APILink + '/api/Streets/GetNearbyStreets';
        var Type = 'get';
        var Data = { '_StreetName': myAddress[0], '_AreaName': myAddress[1], '_UserId': User.Id };
        CallAPI(Url, Type, Data, function (data) {
            if (data.Code == 200) {
                $('#loadeddata').empty();
                $.each(data.Data, function (index, area) {
                    $('#loadeddata').append('<div class="portlet" id="areaBar">\
                            <a data-toggle="collapse" data-parent="#loadeddata" href="#jq-spark' + collapseNum + '">\
                            <div class="portlet-heading">\
                                <div class="portlet-title">\
                                    <h4><i class="fa fa-location-arrow"></i> ' + area.Areas.Title + '</h4>\
                                </div>\
                                <div class="portlet-widgets">\
                                    <a data-toggle="collapse" data-parent="#loadeddata" href="#jq-spark' + collapseNum + '"><i class="fa fa-chevron-down"></i></a>\
                                </div>\
                                <div class="clearfix"></div>\
                            </div></a>\
                            <div id="jq-spark' + collapseNum + '" class="panel-collapse collapse">\
                                <div class="portlet-body">\
                                    <div class="row">\
                                        <div class="col-lg-12 col-sm-12">\
                                            <div class="row" id="appendHere' + collapseNum + '">\
                                            </div>\
                                        </div>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>');
                    $.each(area.Areas.Streets, function (index, street) {
                        var InUserFavourites = "false";
                        if (street.isFavourit == true) {
                            InUserFavourites = "true";
                        }
                        $('#appendHere' + collapseNum).append('<div class="col-lg-12 col-sm-12">\
                                                    <a id="streetBar" href="streettimeline.html?streetId=' + street.Id + '&streetName=' + street.Title + '&status=' + street.CurrentStatus + '&isFavourite=' + InUserFavourites + '" class="tile-button btn btn-primary">\
                                                        <div class="tile-content-wrapper">\
                                                            <div class="col-sm-1 col-xs-1 text-center">\
                                                                <img id="statusimg" src="images/' + street.CurrentStatus + '.png" />\
                                                            </div>\
                                                            <div class="tile-content" id="sttitle">\
                                                                <span id="titlespan">' + street.Title + '</span>\
                                                            </div>\
                                                            <small id="reporthours">\
                                                                ' + street.HoursAgo + '\
                                                            </small>\
                                                        </div>\
                                                    </a>\
                                                </div>');
                    });
                    collapseNum++;
                });
                $('.clearfix').click(function () {
                    console.log($(this).parent().find('.portlet-title').first());
                    $(this).parent().find('.portlet-title').first().trigger('click');
                });
            }
            else {
                $('#loadeddata').empty();
                $('#loadeddata').append('<div class="alert bg-info" id="areaBar">\
														<button type="button" class="close" data-dismiss="alert" aria-hidden="true">x</button>\
														<p><strong>Information:</strong><br /> No nearby streets</p>\
													</div>');
            }
        },false);
    }, false);
}

function showCurrentStreetPosition(position) {
    GetCurrentStreetName(position.coords.latitude, position.coords.longitude);
}

function showCurrentCountryPosition(position) {
    getCurrentCountry(position.coords.latitude, position.coords.longitude);
}

function getCurrentCountry(lat, long) {
    var _Url = 'http://maps.googleapis.com/maps/api/geocode/json';
    var _Type = 'get';
    var _Data = { 'latlng': lat + ',' + long, 'sensor': 'true' };
    CallAPI(_Url, _Type, _Data, function (data) {
            var myAddress = new Array();
            myAddress = data.results[0].formatted_address.split(',');
            if (myAddress[4] != undefined) {
                if (myAddress[4].toString().toLowerCase().trim() != localStorage.getItem("CurrentCountry")) {
                    CountryToChange = myAddress[4];
                    showCountryPopup();
                }
                else {
                    CurrentCountry = "egypt";
                    loadHome();
                }
            }
            else {
                CurrentCountry = "egypt";
                loadHome();
            }
    }, false);
}

function loadUserFavourits() {
    $('#mobile-nav-bar').removeClass('in');
    var collapseNum = 0;
    var _Url = APILink + '/api/Users/GetFavorites';
    var _Type = 'get';
    var _Data = { '_Id': User.Id };
    CallAPI(_Url, _Type, _Data, function (data) {
            if (data.Code == 200) {
                $('#loadeddata').empty();
                $.each(data.Data, function (index, area) {
                    $('#loadeddata').append('<div class="portlet" id="areaBar">\
                            <a data-toggle="collapse" data-parent="#loadeddata" href="#jq-spark' + collapseNum + '">\
                            <div class="portlet-heading">\
                                <div class="portlet-title">\
                                    <h4><i class="fa fa-location-arrow"></i> ' + area.Areas.Title + '</h4>\
                                </div>\
                                <div class="portlet-widgets">\
                                    <a data-toggle="collapse" data-parent="#loadeddata" href="#jq-spark' + collapseNum + '"><i class="fa fa-chevron-down"></i></a>\
                                </div>\
                                <div class="clearfix"></div>\
                            </div></a>\
                            <div id="jq-spark' + collapseNum + '" class="panel-collapse collapse">\
                                <div class="portlet-body">\
                                    <div class="row">\
                                        <div class="col-lg-12 col-sm-12">\
                                            <div class="row" id="appendHere' + collapseNum + '">\
                                            </div>\
                                        </div>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>');
                    $.each(area.Areas.Streets, function (index, street) {
                        var InUserFavourites = "false";
                        if (street.isFavourit == true) {
                            InUserFavourites = "true";
                        }

                        if (street.Radar == 1 || street.Radar == 2) {
                            $('#appendHere' + collapseNum).append('<div class="col-lg-12 col-sm-12">\
                                                    <a id="streetBar" href="streettimeline.html?streetId=' + street.Id + '&streetName=' + street.Title + '&status=' + street.CurrentStatus + '&isFavourite=' + InUserFavourites + '" class="tile-button btn btn-primary">\
                                                        <div class="tile-content-wrapper">\
                                                            <div class="col-sm-1 col-xs-1 text-center">\
                                                                <img id="statusimg" src="images/' + street.CurrentStatus + '.png" />\
                                                            </div>\
                                                            <div class="tile-content" id="streettitle">\
                                                                <span id="titlespan">' + street.Title + '</span>\
                                                            </div>\
                                                            <small id="reporthours">\
                                                                ' + street.HoursAgo + '\
                                                            </small>\
                                                            <div class="tile-content" id="statusIcons">\
                                                               <img id="radarIcon" src="images/StreetStatus' + street.Radar + '.png" />\
                                                            </div>\
                                                        </div>\
                                                    </a>\
                                                </div>');
                        }
                        else if (street.Radar == 3) {
                            $('#appendHere' + collapseNum).append('<div class="col-lg-12 col-sm-12">\
                                                    <a id="streetBar" href="streettimeline.html?streetId=' + street.Id + '&streetName=' + street.Title + '&status=' + street.CurrentStatus + '&isFavourite=' + InUserFavourites + '" class="tile-button btn btn-primary">\
                                                        <div class="tile-content-wrapper">\
                                                            <div class="col-sm-1 col-xs-1 text-center">\
                                                                <img id="statusimg" src="images/' + street.CurrentStatus + '.png" />\
                                                            </div>\
                                                            <div class="tile-content" id="streettitle">\
                                                                <span id="titlespan">' + street.Title + '</span>\
                                                            </div>\
                                                            <small id="reporthours">\
                                                                ' + street.HoursAgo + '\
                                                            </small>\
                                                            <div class="tile-content" id="statusIcons">\
                                                               <img id="radarIcon" src="images/StreetStatus1.png" />\
                                                               <img id="radarIcon" src="images/StreetStatus2.png" />\
                                                            </div>\
                                                        </div>\
                                                    </a>\
                                                </div>');
                        }
                        else {
                            $('#appendHere' + collapseNum).append('<div class="col-lg-12 col-sm-12">\
                                                    <a id="streetBar" href="streettimeline.html?streetId=' + street.Id + '&streetName=' + street.Title + '&status=' + street.CurrentStatus + '&isFavourite=' + InUserFavourites + '" class="tile-button btn btn-primary">\
                                                        <div class="tile-content-wrapper">\
                                                            <div class="col-sm-1 col-xs-1 text-center">\
                                                                <img id="statusimg" src="images/' + street.CurrentStatus + '.png" />\
                                                            </div>\
                                                            <div class="tile-content" id="streettitle">\
                                                                <span id="titlespan">' + street.Title + '</span>\
                                                            </div>\
                                                            <small id="reporthours">\
                                                                ' + street.HoursAgo + '\
                                                            </small>\
                                                        </div>\
                                                    </a>\
                                                </div>');
                        }
                        });

                    collapseNum++;
                });
                $('.clearfix').click(function () {
                    console.log($(this).parent().find('.portlet-title').first());
                    $(this).parent().find('.portlet-title').first().trigger('click');
                });
            }
            else {
                $('#loadeddata').empty();
                $('#loadeddata').append('<div class="alert bg-info" id="areaBar">\
														<button type="button" class="close" data-dismiss="alert" aria-hidden="true">x</button>\
														<p><strong>Information:</strong><br /> You have no favourits </p>\
													</div>');
            }
    }, true);
}

function loadHome() {
    var collapseNum = 0;
    var _Url = APILink + '/api/Streets/GetStreetsStatus';
    var _Type = 'get';
    var _Data = { '_userId': User.Id, 'CurrentCountry': User.Country };
    CallAPI(_Url, _Type, _Data, function (data) {
            if (data.Code != 20) {
                $('#loadeddata').empty();
                $.each(data.Data, function (indexx, area) {
                    var data_step_for_area_name = "";
                    var data_step_for_expander = "";
                    var first_expander_id = "";
                    if (indexx == 0) {
                        data_step_for_area_name = "7";
                        data_step_for_expander = "8";
                        first_expander_id = "firstStreetExpander";
                    }
                    else {
                        data_step_for_area_name = "";
                        data_step_for_expander = "";
                        first_expander_id = "";
                    }
                    $('#loadeddata').append('<div  class="portlet" id="areaBar">\
                            <a data-toggle="collapse" data-intro="You will find areas and streets to acess from here" data-step="5" data-position="left" data-parent="#loadeddata" href="#jq-spark' + collapseNum + '">\
                            <div class="portlet-heading">\
                                <div class="portlet-title">\
                                    <h4><i class="fa fa-location-arrow"></i> ' + area.Title + '</h4>\
                                </div>\
                                <div class="portlet-widgets">\
                                    <a id="' + first_expander_id + '" data-toggle="collapse" data-parent="#loadeddata" href="#jq-spark' + collapseNum + '"><i class="fa fa-chevron-down"></i></a>\
                                </div>\
                                <div class="clearfix"></div>\
                            </div></a>\
                            <div id="jq-spark' + collapseNum + '" class="panel-collapse collapse">\
                                <div class="portlet-body">\
                                    <div class="row">\
                                        <div class="col-lg-12 col-sm-12">\
                                            <div class="row" id="appendHere' + collapseNum + '">\
                                            </div>\
                                        </div>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>');
                    $.each(area.Streets, function (index, street) {
                        var data_step_for_street_status = "";
                        var data_step_for_street_name = "";
                        var data_step_for_last_street_report = "";
                        var data_step_for_street_tile = "";
                        var First_street_id = "";
                        if (index == 0 && indexx == 0) {
                            data_step_for_street_status = "10";
                            data_step_for_street_name = "9";
                            data_step_for_last_street_report = "11";
                            data_step_for_street_tile = "12";
                            First_street_id = "FirstStreetID";
                        }
                        else {
                            data_step_for_street_status = "";
                            data_step_for_street_name = "";
                            data_step_for_last_street_report = "";
                            data_step_for_street_tile = "";
                            First_street_id = "";
                        }
                        var InUserFavourites = "false";
                        if (street.isFavourit == true) {
                            InUserFavourites = "true";
                        }

                        if (street.Radar == 1 || street.Radar ==2) {
                            $('#appendHere' + collapseNum).append('<div class="col-lg-12 col-sm-12">\
                                                    <a id="streetBar" href="streettimeline.html?streetId=' + street.Id + '&streetName=' + street.Title + '&status=' + street.CurrentStatus + '&isFavourite=' + InUserFavourites + '" class="tile-button btn btn-primary">\
                                                        <div class="tile-content-wrapper">\
                                                            <div class="col-sm-1 col-xs-1 text-center">\
                                                                <img id="statusimg" src="images/' + street.CurrentStatus + '.png" />\
                                                            </div>\
                                                            <div class="tile-content" id="sttitle">\
                                                                <span id="titlespan">' + street.Title + '</span>\
                                                            </div>\
                                                            <small id="reporthours">\
                                                                ' + street.HoursAgo + '\
                                                            </small>\
                                                            <div class="tile-content" id="statusIcons">\
                                                               <img id="radarIcon"  src="images/StreetStatus' + street.Radar + '.png" />\
                                                            </div>\
                                                        </div>\
                                                    </a>\
                                                </div>');
                        }
                      else  if (street.Radar == 3) {
                            $('#appendHere' + collapseNum).append('<div class="col-lg-12 col-sm-12">\
                                                    <a id="streetBar" href="streettimeline.html?streetId=' + street.Id + '&streetName=' + street.Title + '&status=' + street.CurrentStatus + '&isFavourite=' + InUserFavourites + '" class="tile-button btn btn-primary">\
                                                        <div class="tile-content-wrapper">\
                                                            <div class="col-sm-1 col-xs-1 text-center">\
                                                                <img id="statusimg" src="images/' + street.CurrentStatus + '.png" />\
                                                            </div>\
                                                            <div class="tile-content" id="sttitle">\
                                                                <span id="titlespan">' + street.Title + '</span>\
                                                            </div>\
                                                            <small id="reporthours">\
                                                                ' + street.HoursAgo + '\
                                                            </small>\
                                                            <div class="tile-content" id="statusIcons">\
                                                               <img id="radarIcon" src="images/StreetStatus1.png" />\
                                                               <img id="radarIcon" src="images/StreetStatus2.png" />\
                                                            </div>\
                                                        </div>\
                                                    </a>\
                                                </div>');
                        }
                        else {
                            $('#appendHere' + collapseNum).append('<div class="col-lg-12 col-sm-12">\
                                                    <a id="streetBar" href="streettimeline.html?streetId=' + street.Id + '&streetName=' + street.Title + '&status=' + street.CurrentStatus + '&isFavourite=' + InUserFavourites + '" class="tile-button btn btn-primary">\
                                                        <div class="tile-content-wrapper">\
                                                            <div class="col-sm-1 col-xs-1 text-center">\
                                                                <img id="statusimg" src="images/' + street.CurrentStatus + '.png" />\
                                                            </div>\
                                                            <div class="tile-content" id="sttitle">\
                                                                <span id="titlespan">' + street.Title + '</span>\
                                                            </div>\
                                                            <small id="reporthours">\
                                                                ' + street.HoursAgo + '\
                                                            </small>\
                                                        </div>\
                                                    </a>\
                                                </div>');
                        }
                    });
                    $('.clearfix').click(function () {
                        console.log($(this).parent().find('.portlet-title').first());
                        $(this).parent().find('.portlet-title').first().trigger('click');
                    });
                    collapseNum++;
                });
                var Tut = localStorage.getItem(Page + "_Tut");
                if (Tut != true && Tut != "true")
                {
                    introJs().start();
                    localStorage.setItem(Page + "_Tut", true);
                }
            }
            else {
                $('#loadeddata').empty();
                $('#loadeddata').append('<div class="alert bg-info" id="areaBar">\
														<button type="button" class="close" data-dismiss="alert" aria-hidden="true">x</button>\
														<p><strong>Information:</strong><br /> No Areas Found </p>\
													</div>');
                getCurrentCountryLocation();
            }
    }, false);
}
function Refresh() {
    if (CurrentTab == "tab1") {
        loadHome();
    }
    if (CurrentTab == "tab2") {
        getCurrentStreetLocation();
    }
    if (CurrentTab == "tab3") {
        loadUserFavourits();
    }
}

function showCountryPopup() {
    $.blockUI({
        message: '<div class="col-md-12">\
        <div class="panel panel-primary" data-animated="fadeInUp" id="txtaligncenter">\
            <div class="panel-heading">Its seems that your location is not set</div>\
            <div class="panel-body">\
                <form role="form" name="contactform" class="form-horizontal" id="countryPopup_Form" method="post">\
                    <!-- Field 1 -->\
                    <label id="lblcountrytochange">Your current country looks to be ' + CountryToChange + ', Do you want to change to it?</label>\
                    <!-- Button -->\
                    <button class="btn btn-primary" type="button" onclick="changeCurrentCountry()">Yes<i class="flaticon-arrow209"></i></button>\
                    <button class="btn btn-default" type="button" onclick="dontchangeCurrentCountry()">No</button>\
                </form>\
            </div>\
        </div>\
    </div>',
        css: {
            top: ($(window).height() - 250) / 2 + 'px',
            left: '2%',
            cache: false,
            width: '90%',
            backgroundColor: 'rgba(0, 0, 0, 0.00)',
            color: '#FFF',
            border: 'none'
        }
    });
}

function changeCurrentCountry() {
    localStorage.setItem("CurrentCountry", CountryToChange.toLowerCase().trim());
    CurrentCountry = CountryToChange.toLowerCase().trim();
    HidePopup();
    loadHome();
}

function dontchangeCurrentCountry() {
    if (CurrentCountry == null) {
        CurrentCountry = CountryToChange.toLowerCase().trim();
        localStorage.setItem("CurrentCountry", CountryToChange.toLowerCase().trim());
    }
    HidePopup();
    loadHome();
}


