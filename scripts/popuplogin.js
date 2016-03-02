// popup login & reg 
$('#frmLogin').validate({
    rules: {
        txtEmail: {
            required: true,
            email: true
        },
        txtPassword: {
            required: true,
            minlength: 5
        }
    },
    messages: {
        txtEmail: {
            required: "please enter your email",
            email: "please enter a valid email"
        },
        txtPassword: {
            required: "please enter your password",
            minlength: "5 characters as minimum"
        }
    },
    submitHandler: function (form) {
        $('#linkRegister').addClass('hideLoader');
        $('#linkLogin').addClass('hideLoader');
        var _Url = APILink + '/api/Users/Login';
        var _Type = "post";
        var _email = $('#txtEmail').val();
        var _password = $('#txtPassword').val();
        var _Data = { 'Email': _email, 'Password': _password };
        CallAPI(_Url, _Type, _Data, function (data) {
            if (data.Code == 200) {
                console.log(data.Data);
                localStorage.setItem("User", JSON.stringify(data.Data));
                $.gritter.add({
                    title: 'Thank you, please wait',
                    text: 'You will be redirected now',
                    sticky: false,
                    class_name: 'bg-info',
                    time: '4000'
                });
                User = JSON.parse(localStorage.getItem("User"));
                setTimeout(function () {
                    location.reload();
                }, 2000);
                return false;
            }
            else if (data.Code == 20) {
                $.loader('close');
                $.gritter.add({
                    title: 'It seems there is something wrong !',
                    text: 'You account has been suspended',
                    sticky: 'We think you forgot your login info !',
                    class_name: 'bg-info',
                    time: '400'
                });
                $('#linkRegister').removeClass('hideLoader');
                $('#linkLogin').removeClass('hideLoader');
                return false;
            }
            else {
                $.loader('close');
                $.gritter.add({
                    title: 'It seems there is something wrong !',
                    text: 'Username or password incorrect',
                    sticky: 'We think you forgot your login info !',
                    class_name: 'bg-info',
                    time: '400'
                });
                $('#linkRegister').removeClass('hideLoader');
                $('#linkLogin').removeClass('hideLoader');
                return false;
            }
        }, false);

    }

});

$('#frmRegister').validate({
    rules: {
        txtRegEmail: {
            required: true,
            email: true
        },
        txtRegPassword: {
            required: true,
            minlength: 5
        },
        txtConfirmPassword: {
            required: true,
            minlength: 5,
            equalTo: "#txtRegPassword"
        },
        txtDisplayName: {
            required: true,
            minlength: 3,
            maxlength: 20
        }
    },
    messages: {
        txtRegEmail: {
            required: "please enter your email",
            email: "please enter a valid email"
        },
        txtRegPassword: {
            required: "please enter your password",
            minlength: "5 characters as minimum"
        },
        txtConfirmPassword: {
            required: "please enter your password",
            minlength: "5 characters as minimum",
            equalTo: "Password not matched"
        },
        txtDisplayName: {
            required: "please enter your name",
            minlength: "3 characters as minimum",
            maxlength: "Maximum 20 charachters allowed"
        }
    },
    submitHandler: function (form) {
        $('#linkRegister').addClass('hideLoader');
        $('#linkLogin').addClass('hideLoader');
        var _Url = APILink + '/api/Users/Register';
        var _Type = "post";
        var _email = $('#txtRegEmail').val();
        var _password = $('#txtRegPassword').val();
        var _displayName = $('#txtDisplayName').val();
        var _Data = { 'Email': _email, 'Password': _password, 'DisplayName': _displayName, 'Img': "images/unknown.png", 'Country': 'Uganda', 'Status': 3, 'NotificationSound': 1 };
        CallAPI(_Url, _Type, _Data, function (data) {
            if (data.Code == 200) {
                localStorage.setItem("User", JSON.stringify(data.Data));
                $.gritter.add({
                    title: 'Thank you, please wait',
                    text: 'You will be redirected now',
                    sticky: false,
                    class_name: 'bg-info',
                    time: '400'
                });
                setTimeout(function () {
                    location.reload();
                }, 2000);
                return false;
            }
            else {
                $.gritter.add({
                    title: 'It seems there is something wrong !',
                    text: 'This email is already exist !',
                    sticky: false,
                    class_name: 'bg-info',
                    time: '400'
                });
                $('#linkRegister').removeClass('hideLoader');
                $('#linkLogin').removeClass('hideLoader');
                return false;
            }
        }, false);
    }
});

function showLogin() {
    $('#divRegister').addClass('hide').fadeOut(300);
    $('#divLogin').removeClass('hide').fadeOut(300);
    $('#divLogin').addClass('visible').fadeIn(300);
    $('#txtEmail').val("");
    $('#txtPassword').val("");
}
function showRegisterAccount() {
    $('#divLogin').addClass('hide').fadeOut(300);
    $('#divRegister').removeClass('hide').fadeOut(300);
    $('#divRegister').addClass('visible').fadeIn(300);
    $('#txtRegEmail').val("");
    $('#txtRegPassword').val("");
    $('#txtConfirmPassword').val("");
}
function Facebook() {

    openFB.login(
            function (response) {
                if (response.status === 'connected') {
                    openFB.api({
                        path: '/me', success: function (data) {
                            console.debug(data);
                            var _Url = APILink + '/api/Users/Facebook';
                            var _Type = "post";
                            var _email = data.id;
                            var _password = 'asdqwe2112yaoysajdhas';
                            var _Display = data.first_name + " " + data.last_name;
                            var _Data = { 'Email': _email, 'Password': _password, 'DisplayName': _Display };
                            CallAPI(_Url, _Type, _Data, function (_data) {
                                localStorage.setItem("User", JSON.stringify(_data.Data));
                                User = _data.Data;
                                $.gritter.add({
                                    title: 'Thank you, please wait',
                                    text: 'You will be redirected now',
                                    sticky: false,
                                    class_name: 'bg-info',
                                    time: '4000'
                                });
                                console.log(data);

                                setTimeout(function () {
                                    location.reload();
                                }, 2000);

                            });
                        }, error: null
                    });

                } else {
                    $.gritter.add({
                        title: 'Something went wrong!',
                        text: 'wecan not log you through facebook right now',
                        sticky: false,
                        class_name: 'bg-warning',
                        time: '4000'
                    });
                }
            }, { scope: 'email,read_stream,publish_actions' });

}
