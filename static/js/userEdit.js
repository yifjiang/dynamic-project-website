var username;
function completion()
{
	$.ajax('/4xw1tuqv/p3/api/v1/user', {
	    type: 'GET',
	    success: function(result) {
	    	username=result.username;
		    document.getElementById('update_firstname_input').value = result.firstname;
			document.getElementById('update_lastname_input').value = result.lastname;
			document.getElementById('update_email_input').value = result.email;
	    }
	});

}


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


function submit()
{
	$('#errors').empty();
	var message = {
		username: username,
	    firstname: $("#update_firstname_input").val(),
	    lastname: $("#update_lastname_input").val(),
	    password1: $("#update_password1_input").val(),
	    password2: $("#update_password2_input").val(),
	    email: $("#update_email_input").val()
  	};

	var isError = false;


	if (message.password1!="" || message.password2!="")
	{
		var reg = new RegExp("^[A-Za-z0-9_-]*$");
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

	$.ajax("/4xw1tuqv/p3/api/v1/user", {
    	type: "PUT",
    	contentType: "application/json",
    	data: JSON.stringify(message),
  	});

}

$(function() {
  $("#update_form").submit(function(e) {
    e.preventDefault();
    submit();
  });
});
