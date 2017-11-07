/**
 *======================================================
 * @author 	: Ashutosh Mishra [nityanarayan44]
 * @license	: MIT License
 * @desc	: Recording the user activity on browser.
 * @NNG Experiments
 * 25 Aug 2017
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
	var extData = new Array();
	var projectId = "Project_"+parseInt(Math.random() * 100000000);

	//Flag variables
	var recordStatus = false;

	
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
	//listening for document to be fully re/loaded.
	document.addEventListener("DOMContentLoaded", function(event) {
		console.log("DOM fully loaded and parsed");
		dataArr.push({ 'url':parseInt(Math.random() * 100000000), 'actionType':'redirect' });
		// Log the recorded data
		showInfo();
		// No need to call api to send data.
		// makeCall( encodeURIComponent({"step":"1", "timeStamp": getTimeStamp(), "navigatedTo" : getUrl()}) );
	});
	
	//listening for click events.
	window.addEventListener('click', function(event) {
		let url = event.target.baseURI;
		let actionType = "click";
		let elementName = event.target.tagName;
		let elementXPath = generateXpath(event);
		dataArr.push({ 'url':url, 'actionType':actionType, 'elementName': elementName, 'elementXPath': elementXPath });
		// Log the recorded data
		showInfo();
	});
	
	//listening for onchange events.
	window.addEventListener('change', function(event){
		let url = event.target.baseURI;
		let actionType = "change";
		let elementName = event.target.tagName;
		let elementXPath = generateXpath(event);
		let elementValue = event.target.value;
		dataArr.push({ 'url':url, 'actionType':actionType, 'elementName': elementName, 'elementXPath': elementXPath, 'elementValue': elementValue });
		// Log the recorded data
		showInfo();
	});
	
	//listening for blur events.
	window.addEventListener('blur', function(event){
		let url = event.target.baseURI;
		let actionType = "off-focus";
		let elementName = event.target.tagName;
		let elementXPath = generateXpath(event);
		let elementValue = event.target.value;
		dataArr.push({ 'url':url, 'actionType':actionType, 'elementName': elementName, 'elementXPath': elementXPath, 'elementValue': elementValue });
		// Log the recorded data
		showInfo();
	});
	
	//listening for double click events.
	//window.addEventListener('dblclick', onDblClick);
	//listening for keypress events.
	//window.addEventListener('keypress', onKeypress);
	
//================================================================================================================
// Fetching an event and then,
// XPath Evaluation
//================================================================================================================
		
		function generateXpath(event) {
			if (event===undefined) 
				event= window.event; // IE hack
			var target= 'target' in event? 
				event.target : event.srcElement; // another IE hack

			var root= document.compatMode==='CSS1Compat'? 
				document.documentElement : document.body;
			var mxy= [event.clientX+root.scrollLeft, event.clientY+root.scrollTop];

			var path= getPathTo(target);
			return path;
			//var txy= getPageXY(target);
			//alert('Clicked element '+path+' offset '+(mxy[0]-txy[0])+', '+(mxy[1]-txy[1]));
		}

		function getPathTo(element) {
			//When element is having a name.
			if (element.name && element.name!=='' && element.name!==undefined) return './/'+element.tagName+'[@name="'+element.name+'"]';
			
			//When element is body itself.
			if (element===document.body) return element.tagName;

			//Otherwise, iterate through all the element for linear traversal
			if(element !== undefined) {
				var ix= 0;
				var siblings= element.parentNode.childNodes;
				for (var i= 0; i<siblings.length; i++) {
					var sibling= siblings[i];
					if (sibling===element)
						return getPathTo(element.parentNode)+'/'+element.tagName+'['+(ix+1)+']';
					if (sibling.nodeType===1 && sibling.tagName===element.tagName)
						ix++;
				}
			}
		}

//================================================================================================================
// Logging Data, Repeatitive
//================================================================================================================
	//just simply printing a message.
	function showInfo(){
		console.clear();
		console.info( '>>> Loading Data...' );
		//console.log( 'STATUS: ' + window.localStorage.getItem('ext_setting_startRec_status') );
		console.dir(dataArr);
	}

	//repeating on every 10 seconds
	//setInterval(showInfo,10000);

// EOScript