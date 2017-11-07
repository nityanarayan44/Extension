// @author : Ashutosh Mishra
// MIT License 2017.
// Use of this source code is open

//Local vars for popup.
var data = { 
		"message": '', 
		"status": 'off',
		"element": '',
		"text"	:"",
		"name"	: '',
		"xpath"	: ''
};

//Extension Status Output
function renderStatus() {
  document.getElementById('status').innerHTML = '<b>STATUS: </b>'+ window.localStorage.getItem('ext_setting_startRec_status');
}

// Ready to insert the script, when DOM is loaded.
	/*document.addEventListener('DOMContentLoaded', function() {
		console.log('started...');
		// Set the initial recording status.
		renderStatus();
		
		//getting buttons and then setting/registering click event for them.
		var btns = document.querySelectorAll('button');
		for (var i = 0; i < btns.length; i++) {
			btns[i].addEventListener('click', click);
		}
		
	});*/

//================================================================================================================
// Message Passing [popup, injection, background]
//================================================================================================================
	chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {		
		// Listening msg from background script
			if(msg.from == 'background'){
				data.message = msg.message;
				data.element = msg.data.element;
				data.name	= msg.data.name;
				data.text	= msg.data.text;
				data.xpath	= msg.data.xpath;
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
	
	function showData(){
		document.getElementById('status').innerHTML = '<b><u>ELEMENT:</b></u> ' 		+ data.element
													+ '<br/> <b><u>NAME:</b></u> ' 		+ data.name
													+ '<br/> <b><u>INNERTEXT:</b></u> ' + data.text
													+ '<br/> <b><u>XPATH:</b></u> ' 	+ data.xpath ;
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
			//document.getElementById('startBtn').addEventListener('click', recordOnClick);
	});