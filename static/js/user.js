function writeErrorWith (message) {
		var newElement = document.createElement('p');
		newElement.className = "error";
		newElement.innerHTML = message;
		document.getElementById('errors').appendChild(newElement);
		return;
}

function testTooLong (text, threshold, name) {
	if (text.length > threshold) {
		writeErrorWith(name + " must be no longer than "+threshold+" characters");
		return true;
	}
	return false;
}

function submit() {

	document.getElementById('errors').innerHTML = "";

	var message = {
		username: $("#new_username_input").val(),
		firstname: $("#new_firstname_input").val(),
		lastname: $("#new_lastname_input").val(),
		password1: $("#new_password1_input").val(),
		password2: $("#new_password2_input").val(),
		email: $("#new_email_input").val()
	};

	var isError = false;

	if (message.username.length < 3) {
		writeErrorWith("Usernames must be at least 3 characters long");
		isError = true;
	}

	var reg = new RegExp("^[A-Za-z0-9_-]*$");
	if (!reg.test(message.username)) {
		writeErrorWith("Usernames may only contain letters, digits, and underscores");
		isError = true;
	}

	if (!reg.test(message.password1)) {
		writeErrorWith("Passwords may only contain letters, digits, and underscores");
		isError = true;
	}

	if (message.password1.length < 8) {
		writeErrorWith("Passwords must be at least 8 characters long");
		isError = true;
	}

	reg = new RegExp("[a-zA-Z]");
	var anotherReg = new RegExp("[0-9]");
	if (!(reg.test(message.password1) && anotherReg.test(message.password1))) {
		writeErrorWith("Passwords must contain at least one letter and one number");
		isError = true;
	}

	if (message.password1 != message.password2) {
		writeErrorWith("Passwords do not match");
		isError = true;
	}

	reg = new RegExp("[^@]+@[^@]+\.[^@]+");
	if (!reg.test(message.email)) {
		writeErrorWith("Email address must be valid");
		isError = true;
	}

	if (testTooLong(message.email, 40, "Email")) {
		isError = true;
	}

	if (testTooLong(message.username, 20, "Username")) {
		isError = true;
	}

	if (testTooLong(message.firstname, 20, "Firstname")) {
		isError = true;
	}

	if (testTooLong(message.lastname, 20, "Lastname")) {
		isError = true;
	}

	if (isError) {return;}

	$.ajax(urlPrefix + "/api/v1/user", {
		type:"POST",
		contentType:"application/json",
		data: JSON.stringify(message),
		success: function (data,status) {
			console.log(status);
			window.location = urlPrefix+'/login'
		},
		error: function (xhr,status,error) {
			console.log("("+xhr.responseText+")");
			var errors = jQuery.parseJSON(xhr.responseText).errors;
			for (var i = 0; i < errors.length; i++) {
				writeErrorWith(errors[i].message);
			}
		}
	});
}

$(function() {
  $("#update_form").submit(function(e) {
    e.preventDefault();
    submit();
  });
});