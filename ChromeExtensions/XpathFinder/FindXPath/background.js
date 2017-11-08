/**
 * @ Author: Ashutosh Mishra, NNG Experiments.
 * @ Version 1.0.0
 * @ Started 25 AUG 2017
 * @ Modified 07 Nov 2017
 * @ Site Step Recorder, Locator XPath Generation
 *
 */
//================================================================================================================
// Global vars
//================================================================================================================
var recStatus 	= 'OFF';
var message 	= 'Not Recording !';
var elementArray= [];

// Properties
// tagName, name, className, id, textContext, role, [with previous element]
var data = {
	"element"	: "",
	"name"		: "",
	"className"	: "",
	"text"		: "",
	"xpath"		: "",
	"xpath_Suggestions"	: "",
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
			//console.dir(msg);
			data.element= msg.data.element;
			data.name 	= msg.data.name;
			data.className=msg.data.className;
			data.text 	= msg.data.text;
			data.xpath 	= msg.data.xpath;
			data.id		= msg.data.id;
			data.dimension= msg.data.dimension;
			// XPath suggestions based on the data object.
			data.xpath_Suggestions = suggetionsXPath(data);

			//Output from Background.
			console.dir(data);
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

	function suggetionsXPath(obj){
		var sugg = "";
		if(obj !== undefined && obj !== null ){
			// Suggestion based on ID and/or innerText
			sugg += ( (obj.id !== undefined && obj.id !== "" && obj.id.length !== 0) && (obj.text !== undefined && obj.text !== "")) ? ("//*[@id='"+ obj.id +"'] <br/> //*[@id='"+ obj.id +"' and @text()='"+ obj.text +"'] <br/> //*[@id='"+ obj.id +"' and contains(text(),'"+ obj.text +"')] <br/> ") : "";

			// Suggestion based on Class and/or innerText
			sugg += ( (obj.className !== undefined && obj.className !== "") && (obj.text !== undefined && obj.txt !== "")) ? ("//*[@class='"+ obj.className +"'] <br/> //*[@class='"+ obj.className +"' and contains(text(), '"+ obj.text +"') ] <br/> //*[@class='"+ obj.className +"' and @text()='"+ obj.text +"'] <br/>") : "" ;

			// Suggestion based on innerText
			sugg += ( obj.text !== "" && obj.text !== undefined) ? ("//*[@text()='"+ obj.text +"'] <br/> //*[contains(text(),'"+ obj.text +"')] <br/> ") : "" ;

			// Suggestion based on dimension
			sugg += ( obj.dimension !== "" && obj.dimension !== undefined) ? ("<br/> dimension (x, y) can be used in Action Class or Robot class of java.") : "";
		}
		if (sugg.length === 0) sugg += "Oopse, No Suggestions at this moment.";

		return sugg;
	}
