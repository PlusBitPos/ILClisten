var rateboxTimeout;
var currentExchange;
var ratebox_ms = 3000; // 3 second update interval
var globalRate = -1; // set upon first rate received

function setGlobalRate(rate) {
    if (globalRate === -1) {
        var checkbox = $("#showDollarCheckBox");
        checkbox.prop("disabled", false);
        checkbox.parent().removeClass("disabled");
    }
    $("#rate").html(parseFloat(rate).toFixed(2));
    globalRate = rate;
}

rateboxGetRate = function() {
	$.getJSON("https://api.coingecko.com/api/v3/simple/price?ids=eos&vs_currencies=usd", function(data) {
        setGlobalRate(data.eos.usd);
    });
}; 

$(document).ready(function() {
	// Bitstamp websocket API
    rateboxGetRate();
});

switchExchange = function(exchangeName) {
	clearTimeout(rateboxTimeout);
	currentExchange = exchangeName;
	$("#rate").html("---");
	
	if (exchangeName == "bitstamp") {
		$("#bitstampRate").css("color", "white");
		$("#mtgoxRate").css("color", "gray");
	} else if (exchangeName == "mtgox") {
		$("#mtgoxRate").css("color", "white");
		$("#bitstampRate").css("color", "gray");
	}
	
	rateboxGetRate();
};
