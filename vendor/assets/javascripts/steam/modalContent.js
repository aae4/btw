
/* handle modal content */
var modalContent = {};
var activeContent;
var bodyClassName = "";
var resizeActiveContentTimer = null;
var g_bModalModifyAnchorTargets = true;
var g_bModalCacheContent = true; // whether or not to reuse old iframes when opening a modal with a previously visited URL

function OnModalContentDismissal()
{
	document.body.style.overflow = '';
	$('modalContentScrollbarHack').hide();
	if ( $('ModalContentContainer') )
		$('ModalContentContainer').className = bodyClassName;
	if ( activeContent.contentWindow.onModalHidden )
	{
		activeContent.contentWindow.onModalHidden();
	}
	// for now, if the window has embedded objects, like YouTube videos,
	// remove the child to stop the video
	if ( activeContent.contentWindow.document.getElementsByTagName( "object" ).length > 0 || activeContent.contentWindow.document.getElementsByTagName( "iframe" ).length > 0 || !g_bModalCacheContent )
	{
		$('modalContentFrameContainer').removeChild( activeContent );
		modalContent[activeContent.src] = null;
	}
	else if ( !modalContent[activeContent.src] )
	{
		$('modalContentFrameContainer').removeChild( activeContent );
	}
	activeContent = null;

	$('modalContent').fire( 'modalContent:dismissed' );
}

function InnerAnchorClickHandler_Deferred()
{
	PollResizeActiveModalContent();
	HookAnchors();
}

function InnerAnchorClickHandler()
{
	setTimeout( InnerAnchorClickHandler_Deferred, 1 );
}

function HookAnchors()
{
	if ( g_bModalModifyAnchorTargets )
	{
		var anchorTags;
		try
		{
			anchorTags = activeContent.contentDocument.getElementsByTagName('a');
		}
		catch( err )
		{
			// We probably navigated off domain and don't have permission. Dang.
			return;
		}

		for( var i = 0; i < anchorTags.length; i++ )
		{
			var anchorTag = anchorTags[i];

			if ( anchorTag.target == "" )
			{
				anchorTag.target = '_top';
			}
		}
	}

	Event.observe( activeContent.contentDocument.body, 'click', InnerAnchorClickHandler );
}

modalContentLoaded = false;
function OnModalContentLoaded()
{
	if ( modalContentLoaded )
		return;

	modalContentLoaded = true;
	HookAnchors();

	$( 'modalContentWait' ).hide();
	modalContent[activeContent.src] = activeContent;
	activeContent.show();
	SizeModalContent( activeContent );
}

function OnModalContentFullyLoaded()
{
	OnModalContentLoaded(); //catch any pages that haven't been updated
	$(activeContent).contentDocument.body.setStyle( { 'overflow-x' : 'hidden' } );
	activeContent.forceResize = true;
	SizeModalContent( activeContent );
	resizeActiveContentTimer = setTimeout( PollResizeActiveModalContent, 100 );
}



function SizeModalContent( activeContent )
{
	if ( activeContent.sizeToFit )
	{
		SizeToFitScreen( activeContent );
		resizeActiveContentTimer = setTimeout( PollResizeActiveModalContent, 200 );
	}
	else
	{
		ResizeModalContent( activeContent );
	}
}

function SizeToFitScreen( elem )
{
	// defer, to give the iframe a chance to figure out its normal size
	SizeToFitScreen_Deferred.bind( null, elem ).defer();
}

// size width until the vertical scrollbar appears
function SizeToFitScreen_Deferred( elem )
{
	var viewport = document.viewport.getDimensions();
	var windowWidth = viewport.width;
	var windowHeight = viewport.height;

	// if we've already calculated the width, we don't need to do this again
	if ( ( !elem.forceResize ) && typeof elem.lastWidth != 'undefined' && typeof elem.lastHeight != 'undefined' && elem.lastWindowWidth == windowWidth && elem.lastWindowHeight == windowHeight )
	{
		$('modalContent').style.width =  elem.lastWidth + 'px';
		$('modalContent').style.height =  elem.lastHeight + 'px';
		modalSizing( $('modalContent') );
		return false;
	}

	elem.forceResize = false;

	var maxWidth = Math.floor( windowWidth * 0.95 );
	var maxHeight = Math.max( 300, Math.floor( windowHeight * 0.95 ) );

	// size up content, but keep aspect ratio
	var contentWidth = $(elem).contentDocument.body.offsetWidth;
	var contentHeight = $(elem).contentDocument.body.offsetHeight;
	var aspectRatio = contentWidth / contentHeight;

	var titleBarHeight = 0;
	if ( $('modalContentTitleBar').visible() )
	{
		titleBarHeight = $('modalContentTitleBar').getHeight();
	}

	// first try to set window at maximum width and figure out what that new height would be, including
	// title bar and borders
	var newWidth = maxWidth;
	var newHeight = Math.floor( newWidth / aspectRatio );// + titleBarHeight + 4;

	if ( newHeight > maxHeight )
	{
		newHeight = maxHeight;
		newWidth = Math.floor( newHeight * aspectRatio );
	}

	// remove borders
	newWidth += 12;	/* some space for scrollbar in firefox */
	$('modalContent').style.width = newWidth + 'px';

	var resized = ResizeModalContent( elem );

	elem.lastWindowWidth = windowWidth;
	elem.lastWindowHeight = windowHeight;
	elem.lastWidth = newWidth;
	elem.lastHeight = $('modalContent').getHeight();

	return resized;
}

function PollResizeActiveModalContent()
{
	if ( !activeContent || !activeContent.visible() )
		return;

	var resized = false;

	if ( activeContent.sizeToFit )
	{
		resized = SizeToFitScreen( activeContent );
	}
	else
	{
		resized = ResizeModalContent( activeContent );
	}

	if ( resized )
	{
		resizeActiveContentTimer = setTimeout( PollResizeActiveModalContent, 100 );
	}
}

function ResizeModalContent( elem )
{
	// the content window should be at most 90% of the usable window height
	var viewport = document.viewport.getDimensions();
	var windowHeight = viewport.height;
	var minHeight = 300;
	var contentHeight = $(elem).contentDocument.body.scrollHeight;
	var desiredHeight = Math.min( contentHeight, Math.max( minHeight, Math.floor( windowHeight * 0.95 ) ) );
	var dialogHeight = desiredHeight;
	var titleBarHeight = 0;
	if ( $('modalContentTitleBar').visible() )
	{
		titleBarHeight = $('modalContentTitleBar').getHeight();
		dialogHeight += titleBarHeight;
	}
	var oldDialogHeight = $( 'modalContent' ).getHeight() - 4; // include the 2px border on top and bottom
	var oldFrameContainerHeight = $( 'modalContentFrameContainer' ).getHeight();
	var oldContentHeight = $( elem ).getHeight();
	if ( oldDialogHeight == dialogHeight && oldFrameContainerHeight == desiredHeight && oldContentHeight == contentHeight )
		return false;

	$( 'modalContent' ).style.height = dialogHeight + 'px';
	$( 'modalContentFrameContainer' ).style.height = desiredHeight + 'px';
	//$( elem ).style.height = contentHeight + 'px';
	$( elem ).style.height = desiredHeight + 'px';
	// re-center
	modalSizing( $('modalContent') );
	return true;
}

function ShowModalContent( url, titleBarText, titleBarURL, sizeToFit )
{
	EnsureModalContentDivExists();

	var params = document.location.toString().toQueryParams();
	if ( typeof params.insideModal != 'undefined' )
	{
		// already inside a modal, go there directly
		window.parent.location.href = url.replace( "insideModal=1", "insideModal=0");
		return;
	}
	if ( typeof window.history.pushState == 'function' )
	{
		history.pushState( { 'url' : url, 'titleBarText' : titleBarText, 'titleBarURL' : titleBarURL, 'sizeToFit' : sizeToFit }, document.title );
	}
	// defer the display of the modal by a frame, so any click event which may have triggered this
	//	has finished propagation
	ShowModalContent_Deferred.bind( null, url, titleBarText, titleBarURL, typeof sizeToFit != 'undefined' && sizeToFit ).defer();
}

Event.observe( document, "dom:loaded", function() { OnPageLoadCheckModalContent(); });
Event.observe( window, "popstate", function() { OnPageLoadCheckModalContent(); });

function OnPageLoadCheckModalContent()
{
	if ( typeof window.history.pushState != 'function' )
	{
		return;
	}
	var currentState = window.history.state;
	if ( currentState && typeof currentState.url != "undefined" )
	{
		ShowModalContent_Deferred( currentState.url, currentState.titleBarText, currentState.titleBarURL, currentState.sizeToFit )
	}
	else
	{
		HideModalContent();
	}
}

function ShowModalContent_Deferred( url, titleBarText, titleBarURL, sizeToFit )
{
	sizeToFit = typeof sizeToFit != 'undefined' && sizeToFit;
	// reset dialog width and height and show it in the waiting state
	$( 'modalContent' ).style.width = '960px';
	$( 'modalContent' ).style.height = '';
	showModal( 'modalContent', false, false );
	$( 'modalContent').OnModalDismissal = OnModalContentDismissal;
	$( 'modalContentFrameContainer' ).childElements().invoke( 'hide' );
	$( 'modalContent' ).childElements().invoke( 'hide' );
	$( 'modalContentWait' ).show();

	// set up the titlebar if applicable
	if ( typeof titleBarText != 'undefined' &&
		 typeof titleBarURL != 'undefined' )
	{
		$('modalContentTitleBar').show();
		$('modalContentTitleBarLink').href = titleBarURL;
		$('modalContentTitleBarImageLink').href = titleBarURL;
		$('modalContentTitleBarLink').innerHTML = titleBarText;
	}
	else
	{
		$('modalContentTitleBar').hide();
	}

	// hide the scrollbar and show our fake scrollbar
	document.body.style.overflow = 'hidden';
	if ( $('ModalContentContainer') )
	{
		bodyClassName = $('ModalContentContainer').className;
		$('ModalContentContainer').className = "modalBody";
	}
	$('modalContentScrollbarHack').show();
	$('modalContentDismiss').show();

	// look up the cached iframe and show it or create a new one
	if ( modalContent[url] )
	{
		$( 'modalContentWait' ).hide();
		modalContent[url].show();
		SizeModalContent( modalContent[url] );
		activeContent = modalContent[url];
		resizeActiveContentTimer = setTimeout( PollResizeActiveModalContent, 100 );
	}
	else
	{
		modalContentLoaded = false;
		iframeContent = new Element( 'iframe', { 'class' : 'modalContent_iFrame', 'onLoad' : 'OnModalContentFullyLoaded()', 'style' : 'display: none;', 'scrolling' : sizeToFit ? 'no' : 'auto' } );
		iframeContent.src = url;
		activeContent = iframeContent;
		activeContent.sizeToFit = sizeToFit;
		$( 'modalContentFrameContainer' ).appendChild( iframeContent );
		$( 'modalContentFrameContainer' ).style.height = 0 + 'px';
	}
	$( 'modalContentFrameContainer' ).show();

	return false;
}

function HideModalContent()
{
	if ( typeof window.history.pushState == 'function' )
	{
		var initialLength = window.history.length;
		while ( window.history.state && typeof window.history.state.url != "undefined" )
		{
			window.history.back();
			if ( window.history.length == initialLength )
			{
				break;
			}
		}
	}
	if ( $( 'modalContent' ) )
	{
		hideModal( 'modalContent' );
	}
}

function EnsureModalContentDivExists()
{
	if ( !$('modalContent') )
	{
				$(document.body).insert( {bottom: "<div id=\"modalContentScrollbarHack\" style=\"display: none\"><\/div>\r\n\r\n<div id=\"modalContent\" class=\"modal_frame\" style=\"display: none\">\r\n\t<div id=\"modalContentTitleBar\">\r\n\t\t<a id=\"modalContentTitleBarLink\" href=\"\" target=\"_blank\">&nbsp;<\/a>\r\n\t\t<a id=\"modalContentTitleBarImageLink\" href=\"\" target=\"_blank\"><img src=\"http:\/\/cdn.steamcommunity.com\/public\/images\/skin_1\/ico_external_link.gif\" alt=\"\"><\/a>\r\n\t\t<div id=\"modalContentDismiss\" class=\"modalContentDismissImage\" onclick=\"HideModalContent();\">\r\n\t\t\t<img src=\"http:\/\/cdn.steamcommunity.com\/public\/images\/x9x9.gif\" width=\"9\" height=\"9\" border=\"0\" alt=\"\u0417\u0430\u043a\u0440\u044b\u0442\u044c\">\r\n\t\t<\/div>\r\n\t<\/div>\r\n\t<div id=\"modalContentWait\"><img src=\"http:\/\/cdn.steamcommunity.com\/public\/images\/login\/throbber.gif\" alt=\"\u0417\u0430\u0433\u0440\u0443\u0437\u043a\u0430\"><\/div>\r\n\t<div id=\"modalContentFrameContainer\"><\/div>\r\n<\/div>" });
	}
}

addEvent(window, "resize", PollResizeActiveModalContent, false);
