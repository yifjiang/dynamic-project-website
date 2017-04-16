
var albumID = ""


function writeToContent (tag, text) {
	var newElement = document.createElement(tag);
	newElement.innerHTML = text;
	document.getElementById('content').appendChild(newElement);
	return;
}

function goPic (picid) {
	// window.location = urlPrefix + '/pic?picid='+picid;
	document.getElementById('content').innerHTML = "";
	pushState(picid,'pic');
	loadPicPage(picid);
	return;
}

function refresh_album (albumid){
	albumID = albumid;
	$.ajax(urlPrefix+'/api/v1/album/'+albumID, {
		type: 'GET',
		success: function (result) {
			writeToContent('h1', 'title: '+result.title);
			writeToContent('h2', 'owner: '+result.username);
			writeToContent('p','created on:' + result.created);
			writeToContent('p','last updated on:' + result.lastupdated);
			// if (result.username == username) {
			// //TODO: get the user name by user_information_api
				var linkToEdit = document.createElement('a');
				linkToEdit.id = 'album_edit_'+albumID+'_link';
				linkToEdit.href = urlPrefix+'/album/edit?albumid='+albumID;
				linkToEdit.innerHTML = 'Edit';
				document.getElementById('content').appendChild(linkToEdit);
			// }
			var pics = result.pics;
			var newElement = document.createElement('table');
			newElement.id = 'picsTable';
			document.getElementById('content').appendChild(newElement);
			var tableString = "";
			for (var i = 0; i < pics.length; i++) {
				tableString += "<tr><td>";
				// tableString += "<a ";
				// tableString += "href='"+urlPrefix+"/pic?picid="+pics[i].picid+"'>";
				tableString += "<img onclick=\"goPic(\'"+pics[i].picid+"\')\" width='20%' id='pic_"+pics[i].picid+"_link' src='/static/images/"+pics[i].picid+'.'+pics[i].format+"'>";
				// tableString += "</a>"
				tableString += "</td>";
				tableString += "<td>"+pics[i].date+"</td>"
				tableString += "<td>"+pics[i].caption+"</td>"
				tableString += "</tr>"
			}
			$("#picsTable").html(tableString);
		},
		error: function(xhr,status,error){
			console.log("("+xhr.responseText+")");
			var errorsdiv = document.createElement('div');
			errorsdiv.id = 'errors';
			document.getElementById('content').appendChild(errorsdiv);
			var errors = jQuery.parseJSON(xhr.responseText).errors;
			for (var i = 0; i < errors.length; i++) {
				writeErrorWith(errors[i].message);
			}
		}
	})

}