function keyup_audio_search(){

	timeout = undefined;
 
	$("#search").keyup(function() {
	    if(timeout != undefined) {
	      clearTimeout(timeout);
	    }
	    var timeout = setTimeout(function() {
	      timeout = undefined;
	  		search = encodeURIComponent($("#search").val());
				$.get("/mumirs/index.js?search=" + encodeURIComponent($("#search").val()),function(){});
	    }, 900);
	});


	/*$('#search').keyup(function() { 
		search = encodeURIComponent($(this).val());
		$.get("/mumirs/index.js?search=" + encodeURIComponent($(this).val()),function(){});
	});*/
};

$(document).ready(function(){
  keyup_audio_search();
})
