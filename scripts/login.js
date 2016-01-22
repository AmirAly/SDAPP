var Page = 'Login';
$(document).ready(function () {
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
                    localStorage.setItem("User",JSON.stringify(data.Data));
                    $.gritter.add({
                        title: 'Thank you, please wait',
                        text: 'You will be redirected now',
                        sticky: false,
                        class_name: 'bg-info',
                        time: '4000'
                    });
                    User = JSON.parse(localStorage.getItem("User"));
                    if (User.Status == "3")
                        location.href = "home.html";
                    else
                        location.href = "profile.html";
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
            }
        },
        submitHandler: function (form) {
            $('#linkRegister').addClass('hideLoader');
            $('#linkLogin').addClass('hideLoader');
            var _Url = APILink + '/api/Users/Register';
            var _Type = "post";
            var _email = $('#txtRegEmail').val();
            var _password = $('#txtRegPassword').val();
            var _Data = { 'Email': _email, 'Password': _password };
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
                    location.href = "profile.html";
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
});

