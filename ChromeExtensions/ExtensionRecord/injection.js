/*
	@ Author: Ashutosh Mishra, NNG Experiments.
	@ Version 1
	@ Mindfire Solutions.
	@ Site Step Recorder
	@ 25 AUG 2017
*/

//================================================================================================================
// GLOBAL SETUP
//================================================================================================================
	var serverPort			= '8080';
	var requestMethod		= 'GET';
	var requestContentType	= 'text/plain';
	var serverAPIAddress 	= 'http://127.0.0.1:8080/parameters?foo=';
	
	//Element for holding values.
	var elements			= 'INPUT, TEXTAREA, BUTTON, CHECKBOX, RADIO, OPTION, DIV, SPAN, LI, OL, UL, P';
	var inputType			= "button,checkbox,color,date,datetime-local,email,file,hidden,image,month,number,password,radio,range,reset,search,submit,tel,text,time,url,week";
	var typableElements		= 'INPUT, TEXTAREA';
	var booleanElements		= 'RADIO, CHECKBOX';
	var dropdownElements	= 'OPTION, SELECT';
	var controlElements		= 'BUTTON';
	
	//Gloabal Array for all recorded data.
	var dataArr = new Array();

	
//================================================================================================================
// Initialization
//================================================================================================================	
	window.localStorage.setItem('ext_setting_startRec_status','OFF');//Setting initial recording OFF.
	window.localStorage.setItem('siteData', ''); 					//Setting initial site recorded data blank.


//================================================================================================================
// UTILITY/BROWSERs-API functions
//================================================================================================================
	//Server-Network Call.
	function makeCall(stringObj){
		var xhr 		= new XMLHttpRequest();		 						// OBJECT CREATION
		xhr.onerror 	= function(err)  { console.log('Error Occured'); }; // HANDLE AFTER XHR CALL
		xhr.onsuccess 	= function(data) { console.dir(data); }; 			// HANDLE AFTER XHR CALL
		xhr.open(requestMethod, serverAPIAddress+stringObj); 				// OPENINGN REQUEST CONNECTION
		xhr.setRequestHeader("Content-type", requestContentType); 			// SETTING REQUEST HEADER
		xhr.send(null); 													// MAKING A REQUEST
	}
	//get element data
	function getElementData(eleObj){
		// id, some specific properties
		return {
				"baseURL"		: document.location.hostname+document.location.pathname, 
				"fullURL"		: document.location.href, 
				"ActionType"	: eleObj.type, 
				"ElementName"	: eleObj.target.name, 
				"ElementClass"	: eleObj.target.className
		};
	}
	//getting current tab complete address, url.
	function getUrl(){
		return document.navigation.href;									//RETURNING CURRENT TAB URL
	}
	//insert data into data Array
	function insertData(data){
		dataArr.push(data);													//INSERTING DATA ARRAY.
	}
	//insert into local storage
	function insertToLocalStorage(key, value){
		window.localStorage.setItem('siteData', (JSON.stringify(dataArr)) );	//Setting dataItem to local storage.
	}
	//clear the dataArray
	function clearData(){
		dataArr = dataArr.slice(0,0);										//EMPTYING DATA ARRAY.
	}
	//clear local storage
	function clearLocalStorage(){
		window.localStorage.clear();										//EMPTYING LOCAL STORAGE
	}
	//clear console logs output
	function clearOutput(){
		console.clear();													//CLEARING CONSOLE OUTPUT
	}
	//logging to console.
	function log(obj){
		console.dir(obj);													//LOGGING TO CONSOLE
	}
	//get time stamp
	function getTimeStamp(){
		return parseInt( (new Date()).getHours() +''+ (new Date()).getMinutes() +''+ (new Date()).getSeconds() +''+ (new Date()).getMilliseconds() );
	}
	
//================================================================================================================
// Event-Listener Registrations
//================================================================================================================
	//listening for document to be fully loaded.
	/*document.addEventListener("DOMContentLoaded", function(event) {
		console.log("DOM fully loaded and parsed");
		makeCall( encodeURIComponent({"step":"1", "timeStamp": getTimeStamp(), "navigatedTo" : getUrl()}) );
	});*/
	
	//listening for click events.
	window.addEventListener('click', function(obj) {
		//insertion to local
		//insertData( getElementData(obj) );
		
		//Send to server.
		makeCall( encodeURIComponent( JSON.stringify( getElementData(obj) ) ) );
		
		//clearLocalStorage();
		
		//insertToLocalStorage('site1', (JSON.stringify(dataArr)));
		
		clearOutput();
		
		log( getElementData(obj) );

		// Send this data to background page
		chrome.runtime.sendMessage({
				total	 :	document.querySelectorAll('*').length,
				inputs	 :	document.querySelectorAll('input').length,
				buttons	 :	document.querySelectorAll('button').length,
				recStatus:	window.localStorage.getItem('ext_setting_startRec_status')
		});
	});
	
	//listening for double click events.
	//window.addEventListener('dblclick', onDblClick);
	//listening for keypress events.
	//window.addEventListener('keypress', onKeypress);
	//listening for blur events.
	//window.addEventListener('blur', 	onBlur);
	//listening for onchange events.
	//window.addEventListener('change', 	onChange);
	
//================================================================================================================
// Listening message from popup.js, as well as inform the back ground page.
// sent from popup for some data...
//================================================================================================================
	// Inform the background page that 
	// this tab should have a page-action
	/*chrome.runtime.sendMessage({
	  from:    'injection',
	  subject: 'showPageAction'
	});*/
	
	//listen for message from the popup.
	/*chrome.runtime.onMessage.addListener(function (msg, sender, response) {
		// First, validate the message's structure
		if ((msg.from === 'popup') && (msg.subject === 'DOMInfo')) {
			// Collect the necessary data 
			// (For your specific requirements `document.querySelectorAll(...)`
			//  should be equivalent to jquery's `$(...)`)
			var domInfo = {
				total	 :	document.querySelectorAll('*').length,
				inputs	 :	document.querySelectorAll('input').length,
				buttons	 :	document.querySelectorAll('button').length,
				recStatus:	window.localStorage.getItem('ext_setting_startRec_status')
			};

			// Directly respond to the sender (popup), 
			// through the specified callback 
			response(domInfo);
		}
	});*/
	/* chrome.runtime.sendMessage({
				total	 :	document.querySelectorAll('*').length,
				inputs	 :	document.querySelectorAll('input').length,
				buttons	 :	document.querySelectorAll('button').length,
				recStatus:	window.localStorage.getItem('ext_setting_startRec_status')
	});*/
	
	/*chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
		if (request.greeting == "hello")
			alert("hello background");
	});*/

//================================================================================================================
// Logging Data, Repeatitive
//================================================================================================================
	//just simply printing a message.
	function showInfo(){
		console.clear();
		console.info( '>>> Loading Settings...' );
		console.log( 'STATUS: ' + window.localStorage.getItem('ext_setting_startRec_status') );
	}

	//repeating on every 10 seconds
	setInterval(showInfo,10000);


/**
* TODO LIST
*==============================
* 1# Get the URL first.
* 2# Record the action 
*		- XPATH	| ACTIONTYPE	| VALUE(if any)
* 3# at the end, group all the action by its url.
* 4# 
*/