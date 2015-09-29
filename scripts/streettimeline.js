var UserID = User.Id
var StreetID = getParameterByName("streetId");
var StreetName = getParameterByName("streetName");
var StreetStatus = getParameterByName("status");
var IsFavourite = getParameterByName("isFavourite");
var selectedEmoticon = 0;
var selectedStatus = 0;
var Page = 'Street';

$(document).ready(function () {
    LoadUserData();
    if (IsFavourite == "true" || IsFavourite == true) {
        $('.addFavouriteStart i').removeClass('fa-star-o').addClass('fa-star');
    }
    LoadTimeline();
});
function Post() {
    if (selectedEmoticon == 0 && selectedStatus == 0) {
        $.gritter.add({
            title: "Reporting failed!",
            text: "Please choose an icon for your report.",
            image: "images/blueprint_icon.png",
            class_name: "bg-danger",
            sticky: false
        });
        return false;
    }
    var text = $('#text').val();
    var streetid = StreetID;
    var report = selectedEmoticon;
    var userid = User.Id;
    var extraInfo = selectedStatus;
    var image = $('#UploadedImageSource').val();
    var _Url = APILink + '/api/Reports/ReportStreet';
    var _Type = "post";
    var _Data = { 'ReportText': text, 'StreetId': streetid, 'ReportImage': image, 'UserId': userid, 'StreetExtraInfo': report, 'StreetStatus': selectedStatus, 'AnonymousReport': false };
    CallAPI(_Url, _Type, _Data, function (data) {
        $('#empty-streets-msg').remove();
        var commenttext = "";
        if (data.Data.ReportText == null) {
            commenttext = "";
        }
        else {
            commenttext = data.Data.ReportText;
        }
        var StreetStatusToAppend = "";
        if (data.Data.StreetStatus != null && data.Data.StreetStatus != 0) {
            StreetStatusToAppend = '<img class="radarIcon" src="images/StreetStatus' + data.Data.StreetStatus + '.png" />';
        }

        var ReportImage = "";
        if (data.Data.ReportImage != null) {
            ReportImage = '<a href="javascript:ViewImage(\'' + data.Data.ReportImage + '\');"><img class="postImg" src="data:image/png;base64,' + data.Data.ReportImage + '" alt="report image" /></a>';
        }
        var EmoticonImageElement = "";
        if (data.Data.StreetExtraInfo == 1 || data.Data.StreetExtraInfo == 2 || data.Data.StreetExtraInfo == 3 || data.Data.StreetExtraInfo == 4) {
            EmoticonImageElement = '<img class="MainImg" src="images/' + data.Data.StreetExtraInfo + '.png" class="MainImg" />';
        }
        $('#appendform').prepend('<li class="timeline-event">\
                                        <div class="timeline-event-point"></div>\
                                        <div class="timeline-event-wrap">\
                                            <div class="timeline-event-time" id="posttime">\
                                                Now\
                                            </div>\
                                            <div class="timeline-event-massage no-border">\
                                                <div class="row">\
                                                    <div class="col-md-3 col-sm-3 col-lg-3 col-xs-3">\
                                                        <div class="row">\
                                                           <img src="' + data.Data.Users.Img + '" class="MainImg" >\
                                                        </div>\
                                                        <div class="row">\
                                                            '+ EmoticonImageElement + '\
                                                        </div>\
                                                    </div>\
                                                    <div class="col-md-7 col-sm-7 col-lg-7 col-xs-7">\
                                                        <a class="author" id="postname"><h6> ' + data.Data.Users.DisplayName + '  </h6></a>\
                                                        <span> ' + commenttext + '</span>\
                                                       ' + ReportImage + '\
                                                    </div>\
                                                    <div class="col-md-2 col-sm-2 col-lg-2 col-xs-2">\
                                                       ' + StreetStatusToAppend + '\
                                                    </div>\
                                                </div>\
                                            </div>\
                                        </div>\
                                    </li>');
        $('#UploadedImageSource').val("");
        $('#text').text("");
        $('#text').val("");
        window.scrollTo(0, 500);
    }, false);

    return false;
}
function PostAnonymous() {
    if (selectedEmoticon == 0 && selectedStatus == 0) {
        $.gritter.add({
            title: "Reporting failed!",
            text: "Please choose an icon for your report.",
            image: "images/blueprint_icon.png",
            class_name: "bg-danger",
            sticky: false
        });
        return false;
    }
    var text = $('#text').val();
    var streetid = StreetID;
    var report = selectedEmoticon;
    var userid = User.Id;
    var extraInfo = selectedStatus;
    var image = $('#UploadedImageSource').val();
    var _Url = APILink + '/api/Reports/ReportStreet';
    var _Type = "post";
    var _Data = { 'ReportText': text, 'StreetId': streetid, 'ReportImage': image, 'UserId': userid, 'StreetExtraInfo': report, 'StreetStatus': selectedStatus, 'AnonymousReport': false };
    CallAPI(_Url, _Type, _Data, function (data) {
        $('#empty-streets-msg').remove();
        var commenttext = "";
        if (data.Data.ReportText == null) {
            commenttext = "";
        }
        else {
            commenttext = data.Data.ReportText;
        }
        var StreetStatusToAppend = "";
        if (data.Data.StreetStatus != null && data.Data.StreetStatus != 0) {
            StreetStatusToAppend = '<img class="radarIcon" src="images/StreetStatus' + data.Data.StreetStatus + '.png" />';
        }

        var ReportImage = "";
        if (data.Data.ReportImage != null) {
            ReportImage = '<a href="javascript:ViewImage(\'' + data.Data.ReportImage + '\');"><img class="postImg" src="data:image/png;base64,' + data.Data.ReportImage + '" alt="report image" /></a>';
        }
        var EmoticonImageElement = "";
        if (data.Data.StreetExtraInfo == 1 || data.Data.StreetExtraInfo == 2 || data.Data.StreetExtraInfo == 3 || data.Data.StreetExtraInfo == 4) {
            EmoticonImageElement = '<img class="MainImg" src="images/' + data.Data.StreetExtraInfo + '.png" class="MainImg" />';
        }
        $('#appendform').prepend('<li class="timeline-event">\
                                        <div class="timeline-event-point"></div>\
                                        <div class="timeline-event-wrap">\
                                            <div class="timeline-event-time" id="posttime">\
                                                Now\
                                            </div>\
                                            <div class="timeline-event-massage no-border">\
                                                <div class="row">\
                                                    <div class="col-md-3 col-sm-3 col-lg-3 col-xs-3">\
                                                        <div class="row">\
                                                          <img src="images/unknown.png" class="MainImg" >\
                                                        </div>\
                                                        <div class="row">\
                                                            '+ EmoticonImageElement + '\
                                                        </div>\
                                                    </div>\
                                                    <div class="col-md-7 col-sm-7 col-lg-7 col-xs-7">\
                                                        <a class="author" id="postname"><h6> Anonymouse  </h6></a>\
                                                        <span> ' + commenttext + '</span>\
                                                       ' + ReportImage + '\
                                                    </div>\
                                                    <div class="col-md-2 col-sm-2 col-lg-2 col-xs-2">\
                                                       ' + StreetStatusToAppend + '\
                                                    </div>\
                                                </div>\
                                            </div>\
                                        </div>\
                                    </li>');
        $('#UploadedImageSource').val("");
        $('#text').text("");
        $('#text').val("");
        window.scrollTo(0, 500);
    }, false);

    return false;
}
function LoadTimeline() {
    $('#streetname').text(StreetName);
    $('#CurrentStreetStatusEmoticon').attr('src', 'images/' + StreetStatus + '.png');
    var _Url = APILink + '/api/Streets/GetStreetTimeline';
    var _Type = "get";
    var _Data = { '_streetId': StreetID };
    CallAPI(_Url, _Type, _Data, function (data) {
        console.debug(data);
        if (data.Code == 20) {
            $('#appendform').append('<div class="alert bg-info" id="empty-streets-msg">\
														<button type="button" class="close" data-dismiss="alert" aria-hidden="true">x</button>\
														<p>This street not reported at last 24 hours</p>\
													</div>');
        }
        else {
            $.each(data.Data, function (Index, res) {
                if (res.ReportText == null) {
                    commenttext = "";
                }
                else {
                    commenttext = res.ReportText;
                }
                var StreetStatusToAppend = "";
                if (res.StreetStatus != null && res.StreetStatus != 0) {
                    StreetStatusToAppend = '<img class="radarIcon" src="images/StreetStatus' + res.StreetStatus + '.png" />';
                }
                var ReportImage = "";
                if (res.ReportImage != null) {
                    ReportImage = '<a href="javascript:ViewImage(\'' + res.ReportImage + '\');"><img class="postImg" src="data:image/png;base64,' + res.ReportImage + '" alt="report image" /></a>';
                }
                var EmoticonImageElement = "";
                if (res.StreetExtraInfo == 1 || res.StreetExtraInfo == 2 || res.StreetExtraInfo == 3 || res.StreetExtraInfo == 4) {
                    EmoticonImageElement = '<img class="MainImg" src="images/' + res.StreetExtraInfo + '.png" />';
                }
                if (res.AnonymousReport == false) {
                    $('#appendform').append(' <li class="timeline-event" >\
                                        <div class="timeline-event-point"></div>\
                                        <div class="timeline-event-wrap">\
                                            <div class="timeline-event-time" id="posttime">\
                                              '+ res.HoursAgo.replace("T0", " ") + '\
                                            </div>\
                                            <div class="timeline-event-massage no-border">\
                                                <div class="row">\
                                                    <div class="col-md-3 col-sm-3 col-lg-3 col-xs-3">\
                                                        <div class="row">\
                                                          <img src="' + res.Users.Img + '" class="MainImg" >\
                                                        </div>\
                                                        <div class="row">\
                                                            '+ EmoticonImageElement + '\
                                                        </div>\
                                                    </div>\
                                                    <div onclick="javascript:location.href=\'streetreplies.html?reportId=' + res.Id + '\'" class="col-md-7 col-sm-7 col-lg-7 col-xs-7">\
                                                        <a class="author" id="postname"><h6> ' + res.Users.DisplayName + '  </h6></a>\
                                                        <span> ' + commenttext + '</span>\
                    ' + ReportImage + '\
                    </div>\
                    <div class="col-md-2 col-sm-2 col-lg-2 col-xs-2 text-center">\
                       ' + StreetStatusToAppend + '\
                      </div>\
                </div>\
   <div class="row text-center"><i class="fa fa-2x fa-comment"></i><span class="badge up badge-success">' + res.RepliesCount + '</span>\
                        <i class="fa fa-2x fa-star"></i><span class="badge up badge-success">' + res.FeedbacksCount + '</span></div>\
            </div>\
        </div>\
    </li>');
                }
                else {
                    $('#appendform').append(' <li class="timeline-event">\
                                        <div class="timeline-event-point"></div>\
                                        <div class="timeline-event-wrap">\
                                            <div class="timeline-event-time" id="posttime">\
                                              '+ res.HoursAgo.replace("T0", " ") + '\
                                            </div>\
                                            <div class="timeline-event-massage no-border">\
                                                <div class="row">\
                                                    <div class="col-md-3 col-sm-3 col-lg-3 col-xs-3">\
                                                        <div class="row">\
                                                          <img src="images/unknown.png" class="MainImg" >\
                                                        </div>\
                                                        <div class="row">\
                                                            '+ EmoticonImageElement + '\
                                                        </div>\
                                                    </div>\
                                                    <div class="col-md-7 col-sm-7 col-lg-7 col-xs-7">\
                                                        <a class="author" id="postname"><h6> Anonymouse </h6></a>\
                                                        <span> ' + commenttext + '</span>\
                    ' + ReportImage + '\
                    </div>\
                    <div class="col-md-2 col-sm-2 col-lg-2 col-xs-2">\
                       ' + StreetStatusToAppend + '\
                    </div>\
                </div>\
            </div>\
        </div>\
    </li>');

                }
            });
        }
    }, false);
    var Tut = localStorage.getItem(Page + "_Tut");
    if (Tut != true && Tut != "true") {
        introJs().start();
        localStorage.setItem(Page + "_Tut", true);
    }
}
$('#favBtn').click(function () {
    if (IsFavourite == true || IsFavourite == "true") {
        $('#favIcon').removeClass("fa-star");
        $('#favIcon').addClass("fa-star-o");
        IsFavourite = false;
        var _Url = APILink + '/api/UserFavorites/RemoveFromFavorite';
        var _Type = "get";
        var _Data = { '_streetId': StreetID, '_userId': User.Id };
        CallAPI(_Url, _Type, _Data, function (data) {
        }, false);
    }
    else {
        $('#favIcon').removeClass("fa-star-o");
        $('#favIcon').addClass("fa-star");
        IsFavourite = false;
        var _Url = APILink + '/api/UserFavorites/AddToFavorite';
        var _Type = "get";
        var _Data = { '_streetId': StreetID, '_userId': User.Id };
        CallAPI(_Url, _Type, _Data, function (data) {
        }, false);
    }
});
function SetEmoticon(rep, id) {
    if (selectedEmoticon == rep) {
        $('#' + id).css('border', '0px none #466BAF');
        selectedEmoticon = 0;
    }
    else {
        selectedEmoticon = rep;
        $('#emoticon1').css('border', 'none');
        $('#emoticon2').css('border', 'none');
        $('#emoticon3').css('border', 'none');
        $('#emoticon4').css('border', 'none');
        $('#' + id).css('border', '1px solid #466BAF');
    }
}
function SetStatus(rep, id) {
    if (selectedStatus == rep) {
        $('#' + id).css('border', '0px none #466BAF');
        selectedStatus = 0;
    }
    else {
        selectedStatus = rep;
        $('#emoticonStatus1').css('border', 'none');
        $('#emoticonStatus2').css('border', 'none');
        $('#emoticonStatus3').css('border', 'none');
        $('#' + id).css('border', '1px solid #466BAF');
    }
}



