function submit () {
	document.getElementById('errors').innerHTML = "";
	var message = {
		username: $("#login_username_input").val(),
		password: $("#login_password_input").val()
	};

	$.ajax(urlPrefix+"/api/v1/login", {
		type:"POST",
		contentType:"application/json",
		data: JSON.stringify(message),
		success: function (data,status) {
			console.log(status);
			urlTo = urlParam('url');
			if (!(urlTo == null)) {
				// alert(urlTo);
				window.location = urlTo;
			}else{
				window.location = urlPrefix+'/';
			}
		},
		error: function (xhr,status,error) {
			console.log("("+xhr.responseText+")");
			var errors = jQuery.parseJSON(xhr.responseText).errors;
			for (var i = 0; i < errors.length; i++) {
				writeErrorWith(errors[i].message);
			}
		}
	})
}


$(function () {
	$("#login_form").submit(function(e){
		e.preventDefault();
		submit();
	})
});

