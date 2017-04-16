window.onpopstate = function(event) {
	if (event.state!=null) {
		$('#content').empty();
		if (event.state.stateVariable.page === 'album') {
			refresh_album(event.state.stateVariable.id);
		}else{
			//if event.state.stateVariable.page==='pic'
			loadPicPage(event.state.stateVariable.id);
		}
	}
}

function pushState (id,page) {
	var stateObj = {stateVariable: {id:id, page:page}};
	var secondURLPrefix = "";
	if (page === 'album') {
		secondURLPrefix = "/album?albumid=";
	}else if (page === 'pic') {
		secondURLPrefix = "/pic?picid=";
	}
	history.pushState(stateObj,"title",urlPrefix+secondURLPrefix+id);
}