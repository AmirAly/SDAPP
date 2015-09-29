var UserID = User.Id
var Page = 'Notifications';
function Load() {
    var _Url = APILink + '/api/Notifications/GetAllNotification';
    var _Type = 'get';
    var _Data = { '_userId': UserID };
    CallAPI(_Url, _Type, _Data, function (data) {
        $('#PageNotificationContainer').empty();
            if (data.Code == 200) {
                $.each(data.Data, function (index, noti) {
                    var iconclass;
                    if (noti.Type == 1) {
                        iconclass = "fa-question";
                    }
                    else {
                        iconclass = "fa-comment";
                    }
                    $('#PageNotificationContainer').append('<a href="javascript:SetAsViewed(' + noti.Id + ',\'' + noti.RedirectsTo + '\');" class="tile-button btn btn-primary">\
                                    <div class="tile-content-wrapper">\
                                        <div class="col-sm-1 col-xs-1 text-center">\
                                            <i class="fa ' + iconclass + '"></i>\
                                            <div id="iconNots"></div>\
                                        </div>\
                                        <div class="tile-content" id="noteStatment">\
                                            ' + noti.Statment + '\
                                        </div>\
                                        <small id="noteTime">\
                                            ' + noti.Time + '\
                                        </small>\
                                    </div>\
                                </a>');
                });
            }
            else
            {
                $('#PageNotificationContainer').empty();
                $('#PageNotificationContainer').append('<div class="alert bg-info" id="areaBar">\
														<button type="button" class="close" data-dismiss="alert" aria-hidden="true">x</button>\
														<p><strong>Informations:</strong><br /> No Notifications found</p>\
													</div>');
            }
    }, false);
}

$(function () {
    LoadUserData();
    Load();
});
