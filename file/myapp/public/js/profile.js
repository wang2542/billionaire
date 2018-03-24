function btn_edit() {
    /*************************
        Show cancel button
        Hide edit button
        Show save button
    **************************/
    document.getElementById("btn_edit").style.display = "none";
    document.getElementById("btn_cancel").style.display = "block";
    document.getElementById("btn_save").style.display = "block";

    //make username, email, password editable
    document.getElementById("profile_email").readOnly = false;
    document.getElementById("profile_password").readOnly = false;
    document.getElementById("profile_passwordConfirm").readOnly = false;
}

function btn_cancel() {
    location.reload();
}