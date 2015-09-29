var Page = 'Profile';
var notificationsound = 1;
var Base64
$(document).ready(function () {
    $("#ddlcountry").select2({
        minimumResultsForSearch: Infinity
    });
    LoadingUserData();
    $('#frmsettings').validate({
        rules: {
            txtname: {
                required: true,
                minlength: 3,
                maxlength:20
            },
            txtemail: {
                required: true,
                email: true
            },
            txtpassword: {
                required: true,
                minlength: 5
            },
            ddlcountry: {
                required: true
            }
        },
        messages: {
            txtname: {
                required: "please enter your name",
                minlength: "3 characters as minimum",
                maxlength: "Maximum 20 charachters allowed"
            },
            txtemail: {
                required: "please enter your email",
                email: "please enter a valid email"
            },
            txtpassword: {
                required: "please enter your password",
                minlength: "5 characters as minimum"
            },
            ddlcountry: {
                required: "please choose your country"
            }
        },
        submitHandler: function (form) {
            
            var _Name = $('#txtname').val();
            var _Email = $('#txtemail').val();
            var _Password = $('#txtpassword').val();
            var _Image = $('#userimg').attr('src');
            var _Country = $('#ddlcountry').val();
            var _NotificationCheck;
            if (notificationsound == 0) {
                _NotificationCheck = false;
            }
            else {
                _NotificationCheck = true;
            }
            if (_Image == null || _Image == "NULL")
                _Image = "images/unknown.png"
            var _Url = APILink + '/api/Users/Edit';
            var _Type = 'post';
            var _Data = { 'Password': _Password, 'DisplayName': _Name, 'Email': _Email, 'Img': _Image, 'Id': User.Id, 'Country': _Country, 'NotificationSound': _NotificationCheck,'Status':3 };
            CallAPI(_Url, _Type, _Data, function (data) {
                if (data.Code == 20 || data.Code == 21) {
                    $.gritter.add({
                        title: "operation failed!",
                        text: "Email already exist.",
                        image: "images/blueprint_icon.png",
                        class_name: "bg-danger",
                        sticky: false,
                        time: 2000
                    });
                }
                else {
                    console.debug(data.Data);
                    localStorage.setItem('User', JSON.stringify(data.Data));
                    User = data.Data;
                    $.gritter.add({
                        title: "successfull operation!",
                        text: "your data updated successfully.",
                        image: "images/blueprint_icon.png",
                        class_name: "bg-success",
                        sticky: false,
                        time: 3000
                    });

                    if (User.Img == null) {
                    }
                    else {
                        $('#user-img').attr('src', data.Data.Img);
                    }

                    if (User.DisplayName == null) {
                    }
                    else {
                        $('#user-name').text(data.Data.DisplayName);
                    }
                    location.href = "home.html";
                  
                }

            }, false);
            return false;
        }
    });
});

function Logout() {
    localStorage.clear();
    window.location.href = "index.html";
}
function LoadingUserData() {
    var _Url = APILink + '/api/Users/GetById';
    var _Type = 'get';
    var _Data = { '_Id': User.Id };
    CallAPI(_Url, _Type, _Data, function (data) {
        if (data.Data == null) {
            localStorage.clear();
            location.href = "index.html";
        }
        localStorage.setItem("User",data.Data);
        if (data.Data.Img == null) {
            $('#user-img').attr('src', "images/unknown.png");
        }
        else {
            $('#user-img').attr('src', data.Data.Img);
        }

        if (data.Data.DisplayName == null) {
            $('#user-name').text("");
        }
        else {
            $('#user-name').text(data.Data.DisplayName);
        }
        $('#txtname').val(data.Data.DisplayName);
        $('#txtemail').val(data.Data.Email);
        $('#txtpassword').val(data.Data.Password);
        if (data.Data.NotificationSound == 0) {
            $('#NotificationSoundSwitcher').prop('checked', false);
        }
        else {
            $('#NotificationSoundSwitcher').prop('checked', true);
        }
        if (data.Data.Img == null || data.Data.Img.trim() == "" || data.Data.Img == 'null') {
            $('#user-img').attr('src', "images/unknown.png");
        }
        else {
            $('#userimg').attr('src', data.Data.Img);
        }
        if (data.Data.Country == null) {
        }
        else {
            $('select[name=ddlcountry]').select2('val', data.Data.Country);
        }

    }, false);
}

function ShowFileSelector() {
    navigator.camera.getPicture(uploadPhoto, null, {
        sourceType: 2,
        quality: 80,
        destinationType: Camera.DestinationType.DATA_URL,
        targetWidth: 300, targetHeight: 200,
        correctOrientation: true
    });
}
function uploadPhoto(data) {
    $('#userimg').attr('src', "data:image/png;base64," + data);
}