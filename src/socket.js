
var satoshi = 100000000;
var DELAY_CAP = 20000;
var lastBlockHeight = 0;

// set default value to 1, if none is chosen.
if(!window.globalEOSValueSelected) {
	window.globalEOSValueSelected = 5;
}

var transactionSocketDelay = 1000;

/** @constructor */
function TransactionSocket() {

}

TransactionSocket.init = function() {
	// Terminate previous connection, if any
	if (TransactionSocket.connection)
		TransactionSocket.connection.close();

	var dfusetoken = 'mobile_c6d41c54b990990f7bb81385351a1728';


	if ('WebSocket' in window) {
		var token = 'eyJhbGciOiJLTVNFUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NTgyOTQxNTQsImp0aSI6IjI3NDY1YmFkLTJhYTQtNGZjOC1hMjQ3LWE2MDY2MTgwZDc2OSIsImlhdCI6MTU1ODIwNzc1NCwiaXNzIjoiZGZ1c2UuaW8iLCJzdWIiOiJ1aWQ6MHZpdGE2ZjgwOGM1NmJiNTFjODVlIiwiYWtpIjoiNzZhODAwZWE4NTQ3NTU4ZmIzOTU4N2ZkOWE5ZjVmOTJlNTFhYmMwOWQ4OGI5NWRjMTlmYzUwN2IzNThmMTE0OCIsInRpZXIiOiJmcmVlLXYxIiwic3RibGsiOi0zNjAwLCJ2IjoxfQ.m3wB8MHlWYsRU4_2wqbG-ybpXviCPuV1IuXN5X534fQ46F0Io8W5qoDEdFphV9ozUCDsXhT54pxnD-qygmj3kw';
		var connection = new ReconnectingWebSocket('wss://mainnet.eos.dfuse.io/v1/stream?token='+token);
		TransactionSocket.connection = connection;

		StatusBox.reconnecting("blockchain");

		connection.onopen = function() {
			console.log('Blockchain.info: Connection open!');
			StatusBox.connected("blockchain");
			var newTransactions = {
				"type": "get_action_traces",
				"listen": true,
				"req_id": "your-request-id-1",
				"irreversible_only": false,
				"data": {
				  "accounts": "eosio.token",
				  "action_name": "transfer",
				  "with_dtrxops": true,
				}
			  };

			connection.send(JSON.stringify(newTransactions));
			// Display the latest transaction so the user sees something.
		};

		connection.onclose = function() {
			console.log('Blockchain.info: Connection closed');
			if ($("#blockchainCheckBox").prop("checked"))
				StatusBox.reconnecting("blockchain");
			else
				StatusBox.closed("blockchain");
		};

		connection.onerror = function(error) {
			console.log('Blockchain.info: Connection Error: ' + error);
		};

		connection.onmessage = function(e,msg,another) {

			try {
				var data = JSON.parse(e.data);
				var amount = data.data.trace.act.data.quantity;
				var to = data.data.trace.act.data.to;

				/*
				console.log(amount);
				console.log(parseFloat(amount));
				console.log(data);	
				*/

				var parsedAmt = parseFloat(amount);
				var isDonation = Boolean(to === "actuallyzach" && parsedAmt >= 0.01);

				// only show higher than sleected value and < 25000 EOS.
				// or if a donation
				if( (parsedAmt >= window.globalEOSValueSelected && parsedAmt <= 25000) || isDonation) {
					var from = data.data.trace.act.data.from;
					new Transaction(parseFloat(parsedAmt), isDonation, from);
				}

			} catch(error) {
				// could not parse dfuse data.
			}

		};
	} else {
		//WebSockets are not supported.
		console.log("No websocket support.");
		StatusBox.nosupport("blockchain");
	}
};

TransactionSocket.close = function() {
	if (TransactionSocket.connection)
		TransactionSocket.connection.close();
	StatusBox.closed("blockchain");
};
