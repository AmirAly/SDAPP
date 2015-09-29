var Page = 'StreetReplies';
var ReportID = getParameterByName("reportId"); // ReportID
var FirstTimeReplies = localStorage.getItem("FirstRunTimeReplies");

$(function () {
    LoadUserData();

    var _Url = APILink + '/api/Reports/GetReportById';
    var _Type = "get";
    var _Data = { '_Id': ReportID };
    CallAPIInBackground(_Url, _Type, _Data, function (data) {

        if (data.Code == 200) {
            var ThePosterName = "";
            var PosterImage = "";
            if (data.Data.AnonymousReport == false) {
                PosterImage = data.Data.Users.Img;
                ThePosterName = data.Data.Users.DisplayName;
            }
            else {
                PosterImage = "images/unknown.png";
                ThePosterName = "Anonymouse";
            }
            var StreetStatusToAppend = "";
            if (data.Data.StreetStatus != null && data.Data.StreetStatus != 0) {
                StreetStatusToAppend = '<img class="iconstyle" src="images/StreetStatus' + data.Data.StreetStatus + '.png" />';
            }
            var ReportImage = "";

            if (data.Data.ReportImage != null) {
                ReportImage = '<a href="javascript:ViewImage(\'' + data.Data.ReportImage + '\');"><img  class="PostImg" src="data:image/png;base64,' + data.Data.ReportImage + '" alt="report image" /></a>';
            }
            var EmoticonImageElement = "";
            if (data.Data.StreetExtraInfo == 1 || data.Data.StreetExtraInfo == 2 || data.Data.StreetExtraInfo == 3) {
                EmoticonImageElement = '<img class="MainImg" src="images/' + data.Data.StreetExtraInfo + '.png" />';
            }
            if (data.Data.ReportText == null) {
                data.Data.ReportText = "";
            }
            $('#TheReportCont').append('<div class="timeline-event-massage no-border">\
                                <div class="row">\
                                    <div class="col-md-3 col-sm-3 col-lg-3 col-xs-3" >\
                                        <div>\
                                            <div class="row">\
                                                <img src="' + PosterImage + '" alt="Image" id="postimg" class="MainImg">\
                                            </div>\
                                            <div class="row rowMargin" >\
                                                ' + EmoticonImageElement + '\
                                            </div>\
                                        </div>\
                                    </div>\
                                    <div class="col-md-9 col-sm-9 col-lg-9 col-xs-9">\
                                        <a class="author" id="postname">' + ThePosterName + '</a><br><br>\
                                        <span class="muted" id="posttext">' + StreetStatusToAppend + ' ' + data.Data.ReportText + '</span>\
                                        ' + ReportImage + '\
                                    </div>\
                                </div>\
                                <div class="row text-right" >\
  <div class="col-md-12 col-sm-12 col-lg-12 col-xs-12">\
                                        <a data-intro="Click here to like this report" data-step="1" data-position="left" href="javascript:FeedBackReport(0,' + ReportID + ');"><i class="fa fa-thumbs-o-up"></i><span class="badge up badge-success" id="feedbacklikescounter"> ' + data.Data.Likes + ' </span></a>\
                                          <a data-intro="Click here to dislike this report" data-step="2" data-position="left" href="javascript:FeedBackReport(1,' + ReportID + ');"><i class="fa fa-thumbs-o-down"></i><span class="badge up badge-danger" id="feedbackdislikescounter"> ' + data.Data.Unlikes + ' </span></a>\
<\div>\
                                </div>\
                            </div>');

        }
        else {
            $.gritter.add({
                title: "operation failed!",
                text: "Something went wrong ...",
                image: "images/blueprint_icon.png",
                class_name: "bg-danger",
                sticky: false,
                time: 2000
            });
        }

    }, false);


    var _Url = APILink + '/api/Reports/GetReportReplies';
    var _Type = "get";
    var _Data = { '_Id': ReportID };
    CallAPI(_Url, _Type, _Data, function (data) {
        if (data.Code == 200) {
            $.each(data.Data, function (index, reply) {
                $('.timeline').append('<li class="timeline-event">\
                                                    <div class="timeline-event-point"></div>\
                                                    <div class="timeline-event-wrap">\
                                                        <div class="timeline-event-time" id="posttime">\
                                                            ' + reply.HoursAgo + '\
                                                        </div>\
                                                        <div class="timeline-event-massage no-border">\
                                                            <div class="row">\
                                                                <div class="col-md-4 col-sm-4 col-lg-4 col-xs-4 row-md-4 goToReport" >\
                                                                    <div>\
                                                                        <div class="row">\
                                                                            <img src="' + reply.Users.Img + '" alt="Image" id="postimg" class="postimgWidth">\
                                                                        </div>\
                                                                    </div>\
                                                                </div>\
                                                                <div class="col-md-8 col-sm-8 col-lg-8 col-xs-8 EmoticonImageElementPadding" >\
                                                                    <a class="author" id="postname">' + reply.Users.DisplayName + '</a><br>\
                                                                    <span class="muted" id="posttext">' + reply.ActionText + '</span>\
                                                                </div>\
                                                            </div>\
                                                        </div>\
                                                    </div>\
                                                </li>');
            });
        }
        else {
            $('.timeline').empty();
            $('.timeline').append('<div class="alert bg-info" id="empty-streets-msg">\
														<button type="button" class="close" data-dismiss="alert" aria-hidden="true">x</button>\
														<p>There is no replies at this report!</p>\
													</div>');
        }
    }, false);
});

function ReplyReport(type) {
    if ($('#txtReport').val() == "") {
        return;
    }
    var text = $('#txtReport').val();
    var userid = User.Id;
    var _Url = APILink + '/api/ReportActions/ReportFeedbackAction';
    var _Type = "post";
    var _Data = { 'ActionText': text, 'ReportId': ReportID, 'UserId': userid, 'ActionType': type };
    CallAPI(_Url, _Type, _Data, function (reply) {

        $('#empty-streets-msg').remove();
        $('.timeline').prepend('<li class="timeline-event" id="Reply' + reply.Data.Id + '">\
                                                <div class="timeline-event-point"></div>\
                                                <div class="timeline-event-wrap">\
                                                    <div class="timeline-event-time" id="posttime">\
                                                        ' + reply.Data.Time + '\
                                                    </div>\
                                                    <div class="timeline-event-massage no-border">\
                                                        <div class="row">\
                                                            <div class="col-md-4 col-sm-4 col-lg-4 col-xs-4 row-md-4 goToReport" >\
                                                                <div>\
                                                                    <div class="row">\
                                                                        <img src="' + reply.Data.Users.Img + '" alt="Image" id="postimg" class="postimgWidth">\
                                                                    </div>\
                                                                </div>\
                                                            </div>\
                                                            <div class="col-md-8 col-sm-8 col-lg-8 col-xs-8 EmoticonImageElementPadding" >\
                                                                <a class="author" id="postname">' + reply.Data.Users.DisplayName + '</a><br>\
                                                                <span class="muted" id="posttext">' + reply.Data.ActionText + '</span>\
                                                            </div>\
                                                        </div>\
                                                    </div>\
                                                </div>\
                                            </li>');
        $('#txtReport').val("");
    }, false);
    return;
}

function FeedBackReport(id, ReportID) {
    var userid = User.Id;
    var _Url = APILink + '/api/ReportActions/ReportFeedbackAction';
    var _Type = "post";
    var _Data = { 'ActionType': id, 'ReportId': ReportID, 'UserId': userid };
    CallAPI(_Url, _Type, _Data, function (data) {

        if (data.Data == "Exist like" || data.Data == "Exist dislike" || data.Data == "Exist flag") {
            var PreviouseStatus = data.Data.replace("Exist ", "");
            if (PreviouseStatus == "like") {
                if (id == 1) {
                    var dislikesCount = parseInt($('#feedbackdislikescounter').text());
                    dislikesCount++;
                    $('#feedbackdislikescounter').text(dislikesCount.toString());
                    var likesCount = parseInt($('#feedbacklikescounter').text());
                    likesCount--;
                    $('#feedbacklikescounter').text(likesCount.toString());
                }
                if (id == 2) {
                    var flagsCount = parseInt($('#feedbackflagscounter').text());
                    flagsCount++;
                    $('#feedbackflagscounter').text(flagsCount.toString());
                    var likesCount = parseInt($('#feedbacklikescounter').text());
                    likesCount--;
                    $('#feedbacklikescounter').text(likesCount.toString());
                }
            }
            else if (PreviouseStatus == "dislike") {
                if (id == 0) {
                    var likesCount = parseInt($('#feedbacklikescounter').text());
                    likesCount++;
                    $('#feedbacklikescounter').text(likesCount.toString());
                    var dislikesCount = parseInt($('#feedbackdislikescounter').text());
                    dislikesCount--;
                    $('#feedbackdislikescounter').text(dislikesCount.toString());
                }
                if (id == 2) {
                    var flagsCount = parseInt($('#feedbackflagscounter').text());
                    flagsCount++;
                    $('#feedbackflagscounter').text(flagsCount.toString());
                    var dislikesCount = parseInt($('#feedbackdislikescounter').text());
                    dislikesCount--;
                    $('#feedbackdislikescounter').text(dislikesCount.toString());
                }
            }
            else {
                if (id == 0) {
                    var likesCount = parseInt($('#feedbacklikescounter').text());
                    likesCount++;
                    $('#feedbacklikescounter').text(likesCount.toString());
                    var dislikesCount = parseInt($('#feedbackflagscounter').text());
                    dislikesCount--;
                    $('#feedbackflagscounter').text(dislikesCount.toString());
                }
                if (id == 1) {
                    var dislikesCount = parseInt($('#feedbackdislikescounter').text());
                    dislikesCount++;
                    $('#feedbackdislikescounter').text(dislikesCount.toString());
                    var dislikesCount = parseInt($('#feedbackflagscounter').text());
                    dislikesCount--;
                    $('#feedbackflagscounter').text(dislikesCount.toString());
                }
            }
        }
        else {
            if (id == 0) {
                var likesCount = parseInt($('#feedbacklikescounter').text());
                likesCount++;
                $('#feedbacklikescounter').text(likesCount.toString());
            }
            if (id == 1) {
                var dislikesCount = parseInt($('#feedbackdislikescounter').text());
                dislikesCount++;
                $('#feedbackdislikescounter').text(dislikesCount.toString());
            }
            if (id == 2) {
                var flagsCount = parseInt($('#feedbackflagscounter').text());
                flagsCount++;
                $('#feedbackflagscounter').text(flagsCount.toString());
            }
        }
    }, false);
}

