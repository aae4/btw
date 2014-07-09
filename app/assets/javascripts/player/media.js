$(document).ready(function () {
	var audio;
	var playlist;
	var tracks;
	var current;

	init();
	function init(){
	    current = 0;
	    audio = $('#audio-player');
	    if (!audio[0]){
	    	return;
	    }
	    playlist = $('#playlist');
	    tracks = playlist.find('li a');
	    len = tracks.length - 1;
	    audio[0].volume = .50;
	    playlist.find('a').click(function(e){
	        e.preventDefault();
	        /*update opentip and text*/
	        $('#audio-title').html($(this).attr('data-title'));
	        $('#audio-title').data('opentips')[0].setContent($(this).attr('data-title'))
	        link = $(this);
	        current = link.parent().index();
	        run(link, audio[0]);
	    });
	    audio[0].addEventListener('ended',function(e){
	        current++;
	        if(current == len){
	            current = 0;
	            link = playlist.find('a')[0];
	        }else{
	            link = playlist.find('a')[current];
	        }
	        run($(link),audio[0]);
	    });
	}

	function run(link, player){
    player.src = link.attr('href');
    /*update opentip*/
    $('#audio-title').html(link.attr('data-title'));
    if (typeof $('#audio-title').data('opentips') != 'undefind'){
	  	$('#audio-title').data('opentips')[0].setContent(link.attr('data-title'))
	  }
    par = link.parent();
    par.addClass('active').siblings().removeClass('active');
    audio[0].load();
    audio[0].play();
	}

	$(function(){
	  $('#audio-player').mediaelementplayer({
	    alwaysShowControls: true,
	    features: ['playpause','progress','volume'],
	    audioVolume: 'horizontal',
	    audioWidth: 450,
	    audioHeight: 70,
	    iPadUseNativeControls: true,
	    iPhoneUseNativeControls: true,
	    AndroidUseNativeControls: true
	  });
	});

});