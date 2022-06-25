/**
 * @ Author: Ashutosh Mishra, NNG Experiments.
 * @ Version 1.0.0
 * @ Started 25 AUG 2017
 * @ Modified 08 Nov 2017 [Prototype-1 Ready October-2017][Prototype-2 Ready 08-November-2017]
 * @ Site Step Recorder, Locator XPath Generation
 *
 * @license : MIT License 2017
 * Use of this source code is open
 */

//Local vars for popup.
var data = {
		"message"	: '',
		"status"	: 'off',
		"element"	: '',
		"text"		: '',
		"name"		: '',
		"className"	: '',
		"id"		: '',
		'dimension'	: '',
		"xpath"		: '',
		"xpath_Suggestions"	: ''
};

//================================================================================================================
// Message Passing [popup, injection, background]
//================================================================================================================
	chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
		// Listening msg from background script
			if(msg.from == 'background'){
				console.log("Message from the background.");
				data.message	= msg.message;
				data.element 	= msg.data.element;
				data.id			= msg.data.id;
				data.name		= msg.data.name;
				data.text		= msg.data.text;
				data.xpath		= msg.data.xpath;
				data.className 	= msg.data.className;
				data.dimension 	=  msg.data.dimension;
				data.xpath_Suggestions = msg.data.xpath_Suggestions;
				showData();
			}
	});

	function retrieveStatus(obj, msgTo){
		chrome.runtime.sendMessage({
				from	:	"popup",
				to		:	msgTo,
				message	:	"Sending data",
				data	:	obj
		});
	}

//================================================================================================================
// Functions
//================================================================================================================
	function recordOnClick(e) {
		//Executing a script on current tab window
		//chrome.tabs.executeScript(null,	{ code : "console.log('Recording Started'); window.localStorage.setItem('ext_setting_startRec_status','ON');" });
		//Sending this data to background
		chrome.runtime.sendMessage({'from':'popup', 'event':'on-recordbtn-click', 'message':'Sending the recording status.', 'data': {'status':'on'} });
	}

	//Showing from the data object
	function showData(){
		console.log("popup: Rendering Result.");
		console.dir(data);

		if(data.element !== undefined && data.element !== "" ){
			document.getElementById('noData').innerHTML = '';
			document.getElementById('status').innerHTML = '<table cellspacing="0" border="1" cellpadding="2" title="Always shows the last element data."><thead><tr><th width="150px">Property</th><th align="left">Value</th></tr></thead><tbody>' +
														 '<tr><td width="150px" align="right"> Id: </td><td> ' 		+ data.id 	+ '</td></tr>' +
														 '<tr><td width="150px" align="right"> Name: </td><td> ' 		+ data.name + '</td></tr>' +
														 '<tr><td width="150px" align="right"> ClassName: </td><td> ' + data.className+ '</td></tr>' +
														 '<tr><td width="150px" align="right"> Element: </td><td> ' 	+ data.element 	+ '</td></tr>' +
														 '<tr><td width="150px" align="right"> Dimensions: </td><td> '+ data.dimension+ '</td></tr>' +
														 '<tr><td width="150px" align="right" title="Considered first 10 charecters of innerText."> InnerText: </td><td> ' + data.text + '</td></tr>' +
														 '<tr><td colspan="2" title="These XPath Suggestions are just for the further consideration.">' +
														 	' <u>Default Absolute XPath:</u>  ' + data.xpath + '<br/><br/>' +
															' <u>XPath Suggestions:</u> <br/> ' + data.xpath_Suggestions + '' +
														 '</td></tr>' +
														 '</tbody></table>';
		}else {
			document.getElementById('status').innerHTML = '';
			document.getElementById('noData').innerHTML = '<div class="comp">'+
																'<center>'+
																'<div class="box1">'+
																	'<marquee direction="down" width="100%" height="100%" behavior="alternate" SCROLLAMOUNT="5">'+
																		'<marquee direction="left" behavior="alternate">'+
																				'<marque direction="up">'+
																					'<marque direction="right">'+
																							'<span id="screenText"> No Data </span>'+
																					'</marque>'+
																				'</marquee>'+
																		'</marquee>'+
																	'</marquee>'+
																'</div>'+
																'<div style="width:30px; height:40px; margin-top:-2px; border-style:solid;border-width:2px;border-color:darkred; z-index:2; background-color:transparent;"></div>'+
																'<div class="box1_base" ></div>'+
																'</center>'+
															'</div>';

		}// End of else
	}// End of function

	//Resetting the data
	function clearData(){
		console.log("Data Cleared !!!");
		data = {};
		showData();
	}

	//Whenever extension popup opens
	function cb_script_popup_open(data){
		chrome.runtime.sendMessage({'from':'popup', 'event':'on-popup-open', 'message':'Callback after successful injection.', 'data': {'info':'popup opened'}});
	}

//================================================================================================================
// Once This[Extension UI] POPUP DOM is Ready, then execute this script.
//================================================================================================================
	window.addEventListener('DOMContentLoaded', function () {

			// ...query for the active tab...
			chrome.tabs.query( { active: true, currentWindow: true }, function (tabs) {
					// ...and send a request for the DOM info...
					chrome.tabs.sendMessage( tabs[0].id, {from: 'injection', subject: 'DOMInfo'}, cb_script_popup_open );
			});

			// Load the current data, when popup is open/shown.
			showData();

			// Record Button click event registration.
			document.getElementById('clearDataLink').addEventListener('click', clearData);
	});
