// Set debugmode to true and transactions/trades will be
// randomly generated, and no outside connections will be made.
var DEBUG_MODE = false;

var DONATION_ADDRESS;
var SOUND_DONATION_ADDRESS;

var globalMute = false;

var instanceId = 0;
var pageDivId = "pageDiv";

var last_update = 0;

var updateTargets = [];

var transaction_count = 0;

// Preload images
var bubbleImage = new Image();
bubbleImage.src = "images/bubble.png";
var blockImage = new Image();
blockImage.src = "images/block.png";

var debugSpawner;

var updateLayoutWidth = function() {
	$(".chartMask").css("visibility", "visible");
};

var updateLayoutHeight = function() {
	var newHeight = window.innerHeight;
	if ($("#header").css("display") != "none") newHeight -= $("#header").outerHeight();
	$("#pageSplitter").height(newHeight);
};

$(document).ready(function() {

	prevChartWidth = $("#pageSplitter").width() / 2;
	
	$("#chartCell").hide();
	
	DONATION_ADDRESS = $("#donationAddress").html();
	// Because the user has javascript running:
	$("#noJavascript").css("display", "none");

	// Initialize draggable vertical page splitter
	updateLayoutHeight();
	
	StatusBox.init(DEBUG_MODE);

	$(".clickSuppress").click(function() {
		$(".clickSuppress").parent().slideUp(300);
	});


	// Spam the following line into console, it's kind of fun.
	// new Block(228158, 270, 100 * satoshi, 153 * 1024);
	
	switchExchange("bitstamp");
	
	// Attach mouseover qr
	$("#donationAddress").qr();
	
});

// Function for handling interface show/hide
var toggleInterface = function() {
	if ($(".interface:hidden").length === 0) {
		$(".interface").fadeOut(500, updateLayoutHeight);
		$("#hideInterface").html("[ Show ]");
		$("#hideInterface").css("opacity", "0.5");
	} else {
		$(".interface").fadeIn(500);
		$("#hideInterface").html("[ Hide ]");
		$("#hideInterface").css("opacity", "1");
		updateLayoutHeight();
	}
};

var globalUpdate = function(time) {
	window.requestAnimationFrame(globalUpdate);
	var delta = time - last_update;
	last_update = time;
	for (var i = 0; i < updateTargets.length; i++) {
		updateTargets[i].update(delta);
	}
};

$(window).bind("load", function() {
	if (DEBUG_MODE) {
		setInterval(debugSpawner, 100);
	} else {
		if ($("#blockchainCheckBox").prop("checked")) {

			// verify enough time left on jwt (with at least one hour "3600").
			var refreshTime = parseInt(parseInt(new Date().getTime()) / 1000) + 3600; 

			// if we already have a jwt, and its not expiring soon, dont request a new one.
			if(!window.localStorage.getItem('dfuse_jwt') || 
			(refreshTime > parseInt(window.localStorage.getItem('dfuse_expire'))) ) {

				fetch("https://auth.dfuse.io/v1/auth/issue", { 
					method: 'POST',
					body: JSON.stringify({
					  api_key: 'web_85f8cabb2aa548821bc163fa5e509edd'
					})
				  })
				  .then(function(response) { return response.json(); })
				  .then(function(response) {
	  
					console.log("requested new token");
					// save jwt and expiry.
					window.localStorage.setItem('dfuse_jwt', response.token);
					window.localStorage.setItem('dfuse_expire', response.expires_at);
					TransactionSocket.init(response.token);
	   
				  })
				  .catch(function(error) {
						  console.log(error);
					
				  });

			} else {
				console.log("using existing token");
				TransactionSocket.init(window.localStorage.getItem('dfuse_jwt'));
			}

		}
			
		if ($("#mtgoxCheckBox").prop("checked"))
			TradeSocket.init();
	}

	window.requestAnimationFrame(globalUpdate);
	
	Sound.loadup();
	Sound.init();
});

var endResize = function() {
    $(".chartMask").css("visibility", "hidden");
	for (var i = 0; i < updateTargets.length; i++) {
		updateTargets[i].updateContainerSize();
	}
};

var hideChart = function() {
	$("#chartElement").hide();
	$("#showChart").show();
	prevChartWidth = $("#chartCell").width();
	$("#chartCell").width(0);
	$("#chartCell").hide();
	$("#pageSplitter").colResizable({
		disable: true
	});
};

var showChart = function() {
	$("#chartElement").show();
	$("#showChart").hide();
	$("#chartCell").width(prevChartWidth);
	$("#chartCell").show();
	$(window).trigger("resize");
	if ($("#bitcoinChart").length === 0) {
		// Load the iframe
		$("#chartHolder").html('<iframe id="bitcoinChart" scrolling="no" frameBorder="0" src="http://bitcoin.clarkmoody.com/widget/chart/zeroblock/"></iframe>');
	}
	$("#pageSplitter").colResizable({
		liveDrag: true,
		onDrag: updateLayoutWidth,
		onResize: endResize
	});
};

$(window).resize(function() {
    updateLayoutHeight();
});

window.onbeforeunload = function(e) {
	clearInterval(globalUpdate);
	TransactionSocket.close();
	TradeSocket.close();
};

