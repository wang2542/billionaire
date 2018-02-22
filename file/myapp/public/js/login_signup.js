function navi_bnt_login() {
	//alert("navi_bnt_login()");
	//show login form and its backgroud
	document.getElementById('div_login_signin_back').style.display = 'block';
	document.getElementById('form_login').style.display = 'block';
}

function navi_btn_signup() {
	//alert("navi_btn_signup");
	//show signin form and its backgroud
	document.getElementById('div_login_signin_back').style.display = 'block';
	document.getElementById('form_signup').style.display = 'block';
}

function div_login_signin_back_onclick() {
	//remove backgroup
	document.getElementById('div_login_signin_back').style.display = 'none';

	//remove login division
	document.getElementById('form_login').style.display = 'none';

	//remove signup division
	document.getElementById('form_signup').style.display = 'none';
}

function login_btn_onclick() {
	alert("login_btn_onclick()");
	var email = document.getElementById("login_email").value;
	var password = document.getElementById("login_password").value;
	alert("email: " + email + "\npassword: " + password);
}

function signup_btn_onclick() {
	alert("signup_btn_onclick()");
	var email = document.getElementById("signup_email").value;
	var username = document.getElementById("signup_username").value;
	var password = document.getElementById("signup_password").value;
	var password_2 = document.getElementById("signup_password_2").value;
	alert("username: " + username + "\nemail" + email + "\npassword: " + password + "\npassword_2: " + password_2);
}