var urlPrefix = "/4xw1tuqv/p3"
$(function() {
  $("#nav_logout").click(function(e) {
    e.preventDefault();
    $.ajax(urlPrefix+'/api/v1/logout',{
    	type:'POST',
    	success: function(result){
    		console.log('logout success');
    		window.location = urlPrefix+'/';
    	}
    })
  });
});

$(function() {
	$("#home_login").click(function (e) {
		e.preventDefault();
		current_url = window.location;
		window.location.href = urlPrefix+"/login"+ "?url="+current_url;
	})
});

function writeErrorWith (message) {
		var newElement = document.createElement('p');
		newElement.className = "error";
		newElement.innerHTML = message;
		document.getElementById('errors').appendChild(newElement);
		return;
}

urlParam = function(name){
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	if (results != null) {
		return results[1] || 0;
	}
	return null;
}