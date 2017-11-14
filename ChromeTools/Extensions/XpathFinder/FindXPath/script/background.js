/**
 * @ Author: Ashutosh Mishra, NNG Experiments.
 * @ Version 1.0.0
 * @ Started 25 AUG 2017
 * @ Modified 08 Nov 2017 [Prototype-1 Ready October-2017][Prototype-2 Ready 08-November-2017]
 * @ Site Step Recorder, Locator XPath Generation
 *
 */
//================================================================================================================
// Global vars
//================================================================================================================
var recStatus 	= 'OFF';
var message 	= 'Not Recording !';
var elementArray= [];

// Angular Directives for the filter.
// will be used to extract the property of an element.
var angularDirectives = ["ng-bind","ng-click","ng-if","ng-model","ng-class","ng-href", "ng-submit", "ng-src", "ng-view","ng-show","ng-repeat","ng-checked","ng-change","ng-pattern","ng-required","ng-minlength","ng-maxlength"];

// Properties
// tagName, name, className, id, textContext, role, [with previous element]
var data = {
	"element"	: "",
	"name"		: "",
	"className"	: "",
	"text"		: "",
	"xpath"		: "",
	"id"		: "",
	"dimension"	: "",
	"xpath_Suggestions": ""
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
			data.text 	= msg.data.text;
			data.xpath 	= msg.data.xpath;
			data.id		= msg.data.id;
			data.className = msg.data.className;
			data.dimension = msg.data.dimension;
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

	/*
	 * Workings on XPath suggestion.
	 **/
	function suggetionsXPath(obj){
		var sugg = "";
		//TODO:  ' => \"
		//TODO:
		if(obj !== undefined && obj !== null ){
			// Suggestions based on ID
			sugg += ( obj.id !== "" && obj.id !== undefined) ? ("//*[@id='"+ obj.id +"'] <br/> //*[contains(@id,'"+ obj.id +"')] <br/>") : "" ;

			// Suggestion based on Name
			sugg += ( obj.name !== "" && obj.name !== undefined) ? (" //*[@name='"+ obj.name +"'] <br/> //*[contains(@name,'"+ obj.name +"')] <br/>") : "" ;

			// Suggestion based on className
			sugg += ( obj.className !== "" && obj.className !== undefined) ? (" //*[@class='"+ obj.className +"'] <br/> //*[contains(@class,\""+ obj.className +"\")] <br/>") : "" ;

			// Suggestion based on innerText
			sugg += ( obj.text !== "" && obj.text !== undefined) ? (" //*[text()='"+ obj.text +"'] <br/> //*[contains(text(),'"+ obj.text +"')] <br/>") : "" ;

			// Suggestion based on ID and/or innerText
			sugg += ( (obj.id !== undefined && obj.id !== "" && obj.id.length !== 0) && (obj.text !== undefined && obj.text !== "" && obj.text.length !== 0)) ? (" //*[@id='"+ obj.id +"' and text()='"+ obj.text +"'] <br/> //*[@id='"+ obj.id +"' and contains(text(),'"+ obj.text +"')] <br/>") : "";

			// Suggestion based on Class and/or innerText
			sugg += ( (obj.className !== undefined && obj.className !== "") && (obj.text !== undefined && obj.text !== "") ) ? (" //*[@class='"+ obj.className +"' and contains(text(), '"+ obj.text +"') ] <br/> //*[@class='"+ obj.className +"' and text()='"+ obj.text +"'] <br/>") : "" ;

			// Suggestion based on dimension
			sugg += ( obj.dimension !== "" && obj.dimension !== undefined) ? ("<br/> dimension (x, y) can be used in Action Class or Robot class of java.") : "";
		}
		if (sugg.length === 0) sugg += "Oopse, No Suggestions at this moment.";

		return sugg;
	}
