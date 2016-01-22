var Page = 'StreetReplies';
var ReportID = getParameterByName("reportId"); // ReportID
var FirstTimeReplies = localStorage.getItem("FirstRunTimeReplies");

var UserID = User.Id;
var StreetID = localStorage.getItem('streetId');
var StreetName =localStorage.getItem('streetName');
var StreetStatus = localStorage.getItem('status');
var IsFavourite = localStorage.getItem('isFavourite');

$(function () {
    LoadUserData();

    var _Url = APILink + '/api/Reports/GetReportById';
    var _Type = "get";
    var _Data = { '_Id': ReportID };
    CallAPIInBackground(_Url, _Type, _Data, function (data) {
        console.log(data.Data);
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
                ReportImage = '<a href="javascript:ViewImage(\'' + data.Data.ReportImage + '\');"><img  class="postImg" src="data:image/png;base64,' + data.Data.ReportImage + '" alt="report image" /></a>';
            }
            var EmoticonImageElement = "";
            if (data.Data.StreetExtraInfo == 1 || data.Data.StreetExtraInfo == 2 || data.Data.StreetExtraInfo == 3) {
                EmoticonImageElement = '<img class="MainImg" src="images/' + data.Data.StreetExtraInfo + '.png" />';
            }
            if (data.Data.ReportText == null) {
                data.Data.ReportText = "";
            }

            if (data.Data.UserId == User.Id) {
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
                                        <a class="author" id="postname"  data-toggle="modal" data-target="#blockUserModal' + data.Data.UserId + '">' + ThePosterName + '</a><br><br>\
                                        <span class="muted" id="posttext">' + StreetStatusToAppend + ' ' + data.Data.ReportText + '</span>\
                                        ' + ReportImage + '\
                                    </div>\
                                </div>\
                                <div class="row text-right" >\
                                    <div class="col-md-12 col-sm-12 col-lg-12 col-xs-12">\
                                        <a data-intro="Click here to like this report" data-step="1" data-position="left" href="javascript:FeedBackReport(0,' + ReportID + ');"><i class="fa fa-thumbs-o-up"></i><span class="badge up badge-success" id="feedbacklikescounter"> ' + data.Data.Likes + ' </span></a>\
                                        <a data-intro="Click here to dislike this report" data-step="2" data-position="left" href="javascript:FeedBackReport(1,' + ReportID + ');"><i class="fa fa-thumbs-o-down"></i><span class="badge up badge-danger" id="feedbackdislikescounter"> ' + data.Data.Unlikes + ' </span></a>\
                                        <span data-intro="Click here to flag this report" data-step="3" data-position="left"><i class="fa fa-flag"></i><span class="badge up badge-suspended" id="feedbackflagscounter"> ' + data.Data.Flags + ' </span></span>\
                                    <\div>\
                                </div>\
                            </div>\
                    <div class="modal fade text-center" id="blockUserModal' + data.Data.UserId + '" role="dialog">\
                        <div class="modal-dialog">\
                            <!-- Modal content-->\
                            <div class="modal-content">\
                                <div class="modal-header">\
                                    <h4 class="modal-title">User Info</h4>\
                                </div>\
                                <div class="modal-body">\
                                    <div class="row">\
                                        <div class=" col-lg-12 col-md-12 col-sm-12 col-xs-12">\
                                             <img src="' + PosterImage + '" alt="Image" />\
                                        <div class="clear2">\
                                        </div>\
                                        <div class=" col-lg-12 col-md-12 col-sm-12 col-xs-12">\
                                           <span>' + ThePosterName + '</span>\
                                        </div>\
                                        <div class="clear2"></div>\
                                        <div class=" col-lg-12 col-md-12 col-sm-12 col-xs-12">\
                                        </div>\
                                        <div class="clear3"></div>\
                                    </div>\
                                </div>\
                            </div>\
                            <div class="modal-footer">\
                                <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>\
                            </div>\
                        </div>\
                    </div>');
            }
            else {
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
                                        <a class="author" id="postname"  data-toggle="modal" data-target="#blockUserModal' + data.Data.UserId + '">' + ThePosterName + '</a><br><br>\
                                        <span class="muted" id="posttext">' + StreetStatusToAppend + ' ' + data.Data.ReportText + '</span>\
                                        ' + ReportImage + '\
                                    </div>\
                                </div>\
                                <div class="row text-right" >\
                                    <div class="col-md-12 col-sm-12 col-lg-12 col-xs-12">\
                                        <a data-intro="Click here to like this report" data-step="1" data-position="left" href="javascript:FeedBackReport(0,' + ReportID + ');"><i class="fa fa-thumbs-o-up"></i><span class="badge up badge-success" id="feedbacklikescounter"> ' + data.Data.Likes + ' </span></a>\
                                        <a data-intro="Click here to dislike this report" data-step="2" data-position="left" href="javascript:FeedBackReport(1,' + ReportID + ');"><i class="fa fa-thumbs-o-down"></i><span class="badge up badge-danger" id="feedbackdislikescounter"> ' + data.Data.Unlikes + ' </span></a>\
                                        <a data-intro="Click here to flag this report" data-step="3" data-position="left" href="javascript:FeedBackReport(4,' + ReportID + ');"><i class="fa fa-flag"></i><span class="badge up badge-suspended" id="feedbackflagscounter"> ' + data.Data.Flags + ' </span></a>\
                                    <\div>\
                                </div>\
                            </div>\
                    <div class="modal fade text-center" id="blockUserModal' + data.Data.UserId + '" role="dialog">\
                        <div class="modal-dialog">\
                            <!-- Modal content-->\
                            <div class="modal-content">\
                                <div class="modal-header">\
                                    <h4 class="modal-title">User Info</h4>\
                                </div>\
                                <div class="modal-body">\
                                    <div class="row">\
                                        <div class=" col-lg-12 col-md-12 col-sm-12 col-xs-12">\
                                             <img src="' + PosterImage + '" alt="Image" />\
                                        <div class="clear2">\
                                        </div>\
                                        <div class=" col-lg-12 col-md-12 col-sm-12 col-xs-12">\
                                           <span>' + ThePosterName + '</span>\
                                        </div>\
                                        <div class="clear2"></div>\
                                        <div class=" col-lg-12 col-md-12 col-sm-12 col-xs-12">\
                                           <button id="blockBtn' + data.Data.UserId + '" class="btn-danger btn-block bar" onclick="BlockUser(' + data.Data.UserId + ')">Block ' + ThePosterName + '</button> \
                                        </div>\
                                        <div class="clear3"></div>\
                                    </div>\
                                </div>\
                            </div>\
                            <div class="modal-footer">\
                                <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>\
                            </div>\
                        </div>\
                    </div>');
            }
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
            console.log(data.Data);
            console.log(UserID);
            $.each(data.Data, function (index, reply) {
                
                if (UserID == reply.UserId) {
                    
                    $('#timeline').append('<li class="timeline-event">\
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
                                                                    <a class="author" id="postname" data-toggle="modal" data-target="#blockUserRepModal' + reply.UserId + '">' + reply.Users.DisplayName + '</a><br>\
                                                                    <span class="muted" id="posttext">' + reply.ActionText + '</span>\
                                                                </div>\
                                                            </div>\
                                                        </div>\
                                                    </div>\
                                                </li>\
                                               <div class="modal fade text-center" id="blockUserRepModal' + reply.UserId + '" role="dialog">\
                        <div class="modal-dialog">\
                            <!-- Modal content-->\
                            <div class="modal-content">\
                                <div class="modal-header">\
                                    <h4 class="modal-title">User Info</h4>\
                                </div>\
                                <div class="modal-body">\
                                    <div class="row">\
                                        <div class=" col-lg-12 col-md-12 col-sm-12 col-xs-12">\
                                             <img src="' + reply.Users.Img + '" alt="Image" />\
                                        <div class="clear2">\
                                        </div>\
                                        <div class=" col-lg-12 col-md-12 col-sm-12 col-xs-12">\
                                           <span>' + reply.Users.DisplayName + '</span>\
                                        </div>\
                                        <div class="clear2"></div>\
                                        <div class=" col-lg-12 col-md-12 col-sm-12 col-xs-12">\
                                        </div>\
                                        <div class="clear3"></div>\
                                    </div>\
                                </div>\
                            </div>\
                            <div class="modal-footer">\
                                <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>\
                            </div>\
                        </div>\
                    </div> ');
                }
                else {
                    //alert('else');
                $('#timeline').append('<li class="timeline-event">\
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
                                                                    <a class="author" id="postname" data-toggle="modal" data-target="#blockUserRepModal' + reply.UserId + '">' + reply.Users.DisplayName + '</a><br>\
                                                                    <span class="muted" id="posttext">' + reply.ActionText + '</span>\
                                                                </div>\
                                                            </div>\
                                                        </div>\
                                                    </div>\
                                                </li>\
                                               <div class="modal fade text-center" id="blockUserRepModal' + reply.UserId + '" role="dialog">\
                        <div class="modal-dialog">\
                            <!-- Modal content-->\
                            <div class="modal-content">\
                                <div class="modal-header">\
                                    <h4 class="modal-title">User Info</h4>\
                                </div>\
                                <div class="modal-body">\
                                    <div class="row">\
                                        <div class=" col-lg-12 col-md-12 col-sm-12 col-xs-12">\
                                             <img src="' + reply.Users.Img + '" alt="Image" />\
                                        <div class="clear2">\
                                        </div>\
                                        <div class=" col-lg-12 col-md-12 col-sm-12 col-xs-12">\
                                           <span>' + reply.Users.DisplayName + '</span>\
                                        </div>\
                                        <div class="clear2"></div>\
                                        <div class=" col-lg-12 col-md-12 col-sm-12 col-xs-12">\
                                           <button id="blockBtn' + reply.UserId + '" class="btn-danger btn-block bar" onclick="BlockUser(' + reply.UserId + ')">Block ' + reply.Users.DisplayName + '</button> \
                                        </div>\
                                        <div class="clear3"></div>\
                                    </div>\
                                </div>\
                            </div>\
                            <div class="modal-footer">\
                                <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>\
                            </div>\
                        </div>\
                    </div> ');
                }
            });
        }
        else {
            $('#timeline').empty();
            $('#timeline').append('<div class="alert bg-info" id="empty-streets-msg">\
														<p>There is no replies at this report!</p>\
													</div>');
            $('#timeline').attr('style', 'margin-left:-40px');
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
        $('#timeline').prepend('<li class="timeline-event" id="Reply' + reply.Data.Id + '">\
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
                if (id == 4) {
                    var flagsCount = parseInt($('#feedbackflagscounter').text());
                    flagsCount++;
                    $('#feedbackflagscounter').text(flagsCount.toString());
                    var likesCount = parseInt($('#feedbacklikescounter').text());
                    likesCount--;
                    $('#feedbacklikescounter').text(likesCount.toString());
                    location.href = 'streettimeline.html?streetId=' + StreetID + '&streetName=' + StreetName + '&status=' + status + '&isFavourite=' + IsFavourite + '';
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
                if (id == 4) {
                    var flagsCount = parseInt($('#feedbackflagscounter').text());
                    flagsCount++;
                    $('#feedbackflagscounter').text(flagsCount.toString());
                    var dislikesCount = parseInt($('#feedbackdislikescounter').text());
                    dislikesCount--;
                    $('#feedbackdislikescounter').text(dislikesCount.toString());
                    location.href = 'streettimeline.html?streetId=' + StreetID + '&streetName=' + StreetName + '&status=' + status + '&isFavourite=' + IsFavourite + '';
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
            if (id == 4) {
                var flagsCount = parseInt($('#feedbackflagscounter').text());
                flagsCount++;
                $('#feedbackflagscounter').text(flagsCount.toString());
                location.href = 'streettimeline.html?streetId=' + StreetID + '&streetName=' + StreetName + '&status=' + status + '&isFavourite=' + IsFavourite + '';
            }
        }
    }, false);
}

function BlockUser(_id) {

    var _Url = APILink + 'api/Blocks/Add';
    var _Type = 'post';
    var _Data = { 'UserId': User.Id ,'BlockedId':_id};
    CallAPI(_Url, _Type, _Data, function (data) {
        if (data.Code == 200) {
            location.href = 'streettimeline.html?streetId=' + StreetID + '&streetName=' + StreetName + '&status=' + status + '&isFavourite=' + IsFavourite + '';
        }
        else {
            console.log('else');
            console.log(data);
        }
    }, false);
}