/*
 * @ Author: Ashutosh Mishra, NNG Experiments.
 * @ Version 1
 * @ XPath Finder/Genearator
 * @Started 25 AUG 2017
 * @ Modified 07 Nov 2017
 **/

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
	var dataArr = [];


//================================================================================================================
// Variable Initialization of injected script
//================================================================================================================
	window.localStorage.setItem('ext_setting_startRec_status','OFF');//Setting initial recording OFF.
	window.localStorage.setItem('siteData', ''); 					//Setting initial site recorded data blank.

//================================================================================================================
// Event-Listener Registrations
//================================================================================================================
	//listening for document to be fully loaded.
	/*document.addEventListener("DOMContentLoaded", function(event) {
		console.log("DOM fully loaded and parsed");
		makeCall( encodeURIComponent({"step":"1", "timeStamp": getTimeStamp(), "navigatedTo" : getUrl()}) );
	});*/

	//listening for click events.
	window.addEventListener('click', function(event) {
		console.log("[Injection] Current Element "+ event.target.tagName);
		broadcastMessage( getElementInfo(event) );
	});



	//get element info
	function getElementInfo(event) {
		// some specific properties
		console.log(">>>> " + typeof event.target.id + ", " + event.target.className+ ", " +event.target.name);
		return {
				"element"		: event.target.tagName,
				"id"			: (event.target.id !== undefined || event.target.id !== "") ? event.target.id : undefined,
				"name"			: (event.target.name !== undefined || event.target.name !== "") ? event.target.name : undefined,
				"className"		: (event.target.className !== undefined || event.target.className !== "") ? event.target.className : undefined,
				"dimension"		: "X = "+ event.target.getBoundingClientRect().x + ", Y = " + event.target.getBoundingClientRect().y,
				"text"			: trimElementInnerTextContent(event.target.innerText),
				"xpath"			: generateXpath(event)
		};
	}
	function trimElementInnerTextContent(text){
		var output = "";
		if(text.length > 10) output = text.substring(0,9);
		output = text.replace(/(\r\n\t|\t|\r|\n|[^a-zA-Z0-9 ])/g,'');
		//console.info(output);
		return output;
	}

//================================================================================================================
// Message Passing between [Popup, injection, background]
//================================================================================================================
	/* Message Broadcast */
	function broadcastMessage(data){
		chrome.runtime.sendMessage({
				"from"		:	"injection",
				"event"		: 	'on-record',
				"message"	:	"Sending element xpath",
				"data"		:	data
		});
	}

	//listen for fired message event
	chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
		// First, validate the message's structure
		if ((msg.from === 'background') && (msg.subject === 'XPath')) {
			// send this message to wherever you want
			broadcastMessage(msg);
			// Directly respond to the sender, through the specified callback
			sendResponse({'from':'injection', "message":"Message recieved."});
		}
	});

//================================================================================================================
// UTILITY/BROWSERs-API functions
//================================================================================================================


	//Server-Network Call.
	//---------------------------------------
	function makeCall(stringObj){
		var xhr 		= new XMLHttpRequest();		 						// OBJECT CREATION
		xhr.onerror 	= function(err)  { console.log('Error Occured'); }; // HANDLE AFTER XHR CALL
		xhr.onsuccess 	= function(data) { console.dir(data); }; 			// HANDLE AFTER XHR CALL
		xhr.open(requestMethod, serverAPIAddress+stringObj); 				// OPENINGN REQUEST CONNECTION
		xhr.setRequestHeader("Content-type", requestContentType); 			// SETTING REQUEST HEADER
		xhr.send(null); 													// MAKING A REQUEST
	}

//================================================================================================================
// XPATH Generation
// Do not touch here ...
//================================================================================================================
			function generateXpath(event) {
				if (event===undefined)
					event= window.event; // IE hack
				var target= 'target' in event?
					event.target : event.srcElement; // another IE hack

				var root= document.compatMode==='CSS1Compat'?
					document.documentElement : document.body;
				var mxy= [event.clientX+root.scrollLeft, event.clientY+root.scrollTop];

				// Return the xpath, and if not contains the .// then add beefore returning.
				return ((getAbsPath(target)).indexOf(".//") ? ".//"+ getAbsPath(target) : getAbsPath(target));
				//return path[0];
				//var txy= getPageXY(target);
				//alert('Clicked element '+path+' offset '+(mxy[0]-txy[0])+', '+(mxy[1]-txy[1]));
			}

			function getAbsPath(element) {
				// Iterate through all the element for linear traversal
				if(element !== undefined){
					var ix = 0;
					var siblings= element.parentNode.childNodes;
					for (var i= 0; i<siblings.length; i++) {
						var sibling= siblings[i];
						if (sibling===element)
							return getXPath(element.parentNode)+'/'+element.tagName+'['+(ix+1)+']';
						if (sibling.nodeType===1 && sibling.tagName===element.tagName)
							ix++;
					}
				}
			}

			function getXPath(element){
				//When element is having a name.
				if (element.name && element.name!=='' && element.name!==undefined) {
					//console.log("found element name");
					return './/'+element.tagName+'[@name="'+element.name+'"]';
				}

				//When element is body itself.
				if (element===document.body) return element.tagName;

				//Otherwise, iterate through all the element for linear traversal
				if(element !== undefined){

					//Proceed only, when element hace its parent node and child of parent
					if(element.parentNode && element.parentNode.childNodes){
						var ix = 0;
						var siblings = element.parentNode.childNodes;
						for (var i = 0; i<siblings.length; i++) {
							//console.dir(element);
							var sibling = siblings[i];
							if (sibling===element) {
								if (element.name && element.name!=='' && element.name!==undefined)
									return getXPath(element.parentNode) + '/' + element.tagName+ '[@name="'+element.name+'"]';
								else
									return getXPath(element.parentNode) + '/' + element.tagName+ '['+(ix+1)+']';
							}
							if (sibling.nodeType===1 && sibling.tagName===element.tagName)
								ix++;
						}
					}
				}
			}
