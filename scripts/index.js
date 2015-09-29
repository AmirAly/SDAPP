function showLogin() {
    $('#divRegister').fadeOut(300);
    $('#divLogin').addClass('visible').fadeIn(300);
    $('#txtEmail').val("");
    $('#txtPassword').val("");
}
function showRegisterAccount() {
    $('#divLogin').fadeOut(300);
    $('#divRegister').addClass('visible').fadeIn(300);
    $('#txtRegEmail').val("");
    $('#txtRegPassword').val("");
    $('#txtConfirmPassword').val("");
}
$(document).ready(function () {
    var LoginStatus = JSON.parse(localStorage.getItem("User"));
    console.debug(LoginStatus);
    if (typeof (LoginStatus) != undefined && LoginStatus != null) {
        location.href = "home.html";
    }
    openFB.init({ appId: '1626203094287345' });
    setTimeout(function () {
        $(".welcomeMsg").animate({
            bottom: 5
        }, 2000, function () {
            $("#divLogin").fadeIn(800);
        });
    }, 1000);

});
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
                                if (User.Status == "3")
                                    location.href = "home.html";
                                else
                                    location.href = "profile.html";
                                return false;
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