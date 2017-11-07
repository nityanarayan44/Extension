/**
 * @ Author: Ashutosh Mishra, NNG Experiments.
 * @ Version 1.0.0
 * @ Started 25 AUG 2017
 * @ Site Step Recorder, Locator XPath Generation
 * 
 */
//================================================================================================================
// Global vars
//================================================================================================================
var recStatus 	= 'OFF';
var message 	= 'Not Recording !';
var elementArray= new Array();

// Properties
// tagName, name, className, id, textContext, role, [with previous element]
var data = {
	"element"	: "",
	"name"		: "",
	"text"		: "",
	"xpath"		: "",
	"id"		: "",
	"dimension"	: ""
};


//================================================================================================================
// Extension Background Services
// Messages passing [injection, popup]
//================================================================================================================
	chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
		console.log('Message Recieved...');
		//console.log(msg);

		//Message from Popup, on-popup-open 
		if(msg.from == 'popup' && msg.event == 'on-popup-open') {
			//when popup is opened then send the data to popup.
			sendDataToPopup();
		}

		//Message from Popup, on-recordbtn-click 
		if(msg.from == 'popup' && msg.event == 'on-recordbtn-click') {
			recStatus 	= msg.data.status;
			message 	= msg.message;
			console.log(msg.data);
		}

		//Message from injection script
		if(msg.from == 'injection' && msg.event == 'on-record') {
			//Recording the actions through the injected script
			console.dir(msg);
			data.element= msg.data.element;
			data.name 	= msg.data.name;
			data.text 	= msg.data.text;
			data.xpath 	= msg.data.xpath;
			data.id		= msg.data.id;
			data.dimension= msg.data.dimension;
		}

	});

//================================================================================================================
// Functions
//================================================================================================================
	function sendDataToPopup() {
		console.log("Sending Data to Popup ");
		chrome.runtime.sendMessage({
			'from'		:	'background', 
			'event'		:	'on-popup-open-response', 
			'message'	: 	message, 
			'data'		: 	data
		});
	}

