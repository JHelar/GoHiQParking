
/**
 * Created by johnla on 2016-11-18.
 */
function submit(){
    var usernameemail = $('#useremail').val();
    var password = $('#pwd').val();
    var data = {
        usernameemail:usernameemail,
        password:password,
    };
    $.post('/api/user/login',JSON.stringify(data), function(e){
        if(!e.data.error){
            createCookie("skey",e.data.sessionkey,365);
            window.location.href = '/';
        }else{
            document.getElementById('warning').innerHTML = e.data.message;
        }
    },'json');
}

$('#login-form').on('submit', function (e) {
    e.preventDefault();
    submit();
});