/**
 * Created by johnla on 2016-11-18.
 */
function submit(){
    var email = $('#email').val();
    console.log(email);
    if(validateEmail(email)){
        console.log(email);
        var username = $('#username').val();
        var password = $('#password').val();
        var data = {
            email:email,
            username:username,
            password:password,
        };
        $.post('/api/user/register',JSON.stringify(data), function(e){
            if(e.success){
                createCookie("skey",e.data.sessionkey);
                window.location.href = '/';
            }else{
                $('#warning').innerHTML = e.data.message;
            }
        },'json');
    }else{
        $('#warning').innerHTML = "Wrong mail format";
    }
    return false;
}

$('#register-form').on('submit', function (e) {
   e.preventDefault();
   submit();
});