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
var recStatus = 'OFF';
var message = 'Not Recording !';

//================================================================================================================
// Extension Background Services
// Listening for Messages
//================================================================================================================
	chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
		console.log('Message Recieved...');
		
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
			console.log(msg.data);
		}

	});

//================================================================================================================
// Functions
//================================================================================================================
function sendDataToPopup() {
	chrome.runtime.sendMessage({
		'from':'background', 
		'event':'on-popup-open-response', 
		'message': message, 
		'data': {'status':recStatus} 
	});
}