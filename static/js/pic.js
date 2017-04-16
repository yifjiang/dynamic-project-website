function loadPicPage(picid)
{

	$('#content').empty();
	var prv, next, caption, format, albumid;

	//picid=window.location.search.substr(1).split('=')[1];
	// document.write("<h1>PIC</h1>");
	var title = document.createElement('h1');
	title.innerHTML='PIC';
	document.getElementById('content').appendChild(title);
	var para=document.createElement("p");
	para.innerHTML="Welcome to "+picid;
	document.getElementById("content").appendChild(para);


	var img = new Image();
	document.getElementById("content").appendChild(img);
	var lineBreak = document.createElement('br')
	document.getElementById('content').appendChild(lineBreak);
	// document.write("<br>");

	//previous and next link creation
	var prvnext_par=document.createElement("p");
	prvnext_par.id="prvnext_par";
	document.getElementById("content").appendChild(prvnext_par);

	var prv_link = document.createElement("a");
	prv_link.id="prev_pic"
	prv_link.innerHTML = "Previous";

	var next_link = document.createElement("a");
	next_link.id="next_pic"
	next_link.innerHTML = "Next";

	var parent_link = document.createElement("a");
	parent_link.id="parent_album"
	parent_link.innerHTML = " Parent Album";
	document.getElementById("content").appendChild(parent_link);
	lineBreak = document.createElement('br')
	document.getElementById('content').appendChild(lineBreak);
	// document.write("<br>");

	refresh();



	//deal with caption
	var caption_par=document.createElement("p");
	caption_par.id="caption_par";
	document.getElementById("content").appendChild(caption_par);
	var caption_input = document.createElement("INPUT");
	caption_input.setAttribute("type", "text");
	caption_input.id="pic_caption_input";
	var caption_par=document.createElement("p");

	function createCaptionInput(owner, current_username, edit)
	{
		$('#caption_par').empty();
		if (edit)
		{
			document.getElementById("caption_par").appendChild(caption_input);
			document.getElementById('pic_caption_input').value = caption;
			$("#pic_caption_input").keypress(function(e){
				if (e.which==13)
				{
					var message={
						albumid: albumid,
						caption: $("#pic_caption_input").val(),
						picid: picid
					}
					$.ajax("/4xw1tuqv/p3/api/v1/pic/"+picid, {
				    	type: "PUT",
				    	contentType: "application/json",
				    	data: JSON.stringify(message),
				    	success: function(result) {}
					});
				}
			});
		}
		else
		{
			caption_par.id="pic_"+picid+"_caption";
			document.getElementById("caption_par").innerHTML=caption;
			document.getElementById("caption_par").appendChild(caption_par);
		}
	}


	function refresh()
	{
			$.ajax("/4xw1tuqv/p3/api/v1/pic/"+picid, {
	    	type: "GET",
	    	success: function(result) {
			  	prv=result.prev;
			  	next=result.next;
			  	caption=result.caption;
			  	format=result.format;
			  	albumid=result.albumid;

			  	para.innerHTML="Welcome to "+picid;
				//prv_link.href = "/4xw1tuqv/p3/pic?picid=" + prv
				//next_link.href = "/4xw1tuqv/p3/pic?picid=" + next
				//document.getElementById("parent_album").href = "/4xw1tuqv/p3/album?albumid=" + albumid
				img.src = '/static/images/'+picid+'.'+format;
				if (document.getElementById("pic_caption_input")) document.getElementById("pic_caption_input").value = caption;
				caption_par.innerHTML=caption;
				
				$("#prvnext_par").empty()
				if (prv!="") 
				{
					document.getElementById("prvnext_par").appendChild(prv_link);
					$("#prev_pic").click(function(e){
						e.preventDefault();
						picid=prv;
						pushState(picid,'pic');
			    		refresh();
					});
				}
				if (next!="")
				{
					document.getElementById("prvnext_par").appendChild(next_link);
					$("#next_pic").click(function(e){
						e.preventDefault();
						picid=next;
						pushState(picid,'pic');
				    	refresh();
					});
				}


			var current_username, owner;
			$.ajax("/4xw1tuqv/p3/api/v1/user", {
			    	type: "GET",
			    	success: function(result) {
			    		current_username=result.username;
				    	$.ajax("/4xw1tuqv/p3/api/v1/album/"+albumid, {
					    	type: "GET",
					    	success: function(result) {
					    		owner=result.username;
								if (owner==current_username) createCaptionInput(owner, current_username, true);
								else createCaptionInput(owner, current_username, false);
						    },
						});
				    },
					error: function(result) {
						createCaptionInput(owner, current_username, false);
					}
			});




		    },
		    error: function (xhr,status,error) {
		    	document.getElementById('content').innerHTML = "";
		    	console.log('error');
		    	var errorsdiv = document.createElement('div');
				errorsdiv.id = 'errors';
				document.getElementById('content').appendChild(errorsdiv);
				var errors = jQuery.parseJSON(xhr.responseText).errors;
				for (var i = 0; i < errors.length; i++) {
					writeErrorWith(errors[i].message);
				}
		    }
	  });
	}

	$(function() {
		$("#parent_album").click(function(e){
			e.preventDefault();
			$('#content').empty();
			pushState(albumid,'album');
			refresh_album(albumid);
		});
	});
}