// @author : Ashutosh Mishra
// MIT License 2017.
// Use of this source code is open


/**
 *=============================================
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');
	console.log(typeof url);
    callback(url);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, function(tabs) {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

//Local vars for popup.
var dataObj = { message: '', status: 'off'};

//Extension Status Output
function renderStatus() {
  document.getElementById('status').innerHTML = '<b>STATUS: </b>'+ window.localStorage.getItem('ext_setting_startRec_status');
}
		
//Function that listen for registered 'click' events on button.
	

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
// Listening messages from background.js 
//================================================================================================================
	chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
			
		// Listening msg from background script
			if(msg.from == 'background'){
				dataObj.message = msg.message;
				dataObj.status = msg.data.status;
				getStatusData();
			}
	});

//================================================================================================================
// Functions
//================================================================================================================
	function recordOnClick(e) {
		//Executing a script on current tab window
		chrome.tabs.executeScript(null,	{ code : "console.log('Recording Started'); window.localStorage.setItem('ext_setting_startRec_status','ON');" });
		//Sending this data to background
		chrome.runtime.sendMessage({'from':'popup', 'event':'on-recordbtn-click', 'message':'Sending the recording status.', 'data': {'status':'on'} });
	}
	function getStatusData() {
		document.getElementById('status').innerHTML = 'Status: '+ dataObj.status + '<br/>Message: ' + dataObj.message;
	}
	function loadCurrentStatus(){
		document.getElementById('status').innerHTML = 'Status: '+ dataObj.status + '<br/> Message: ' + dataObj.message;
		//document.getElementById('status').innerHTML   	= '<b>' + window.localStorage.getItem('ext_setting_startRec_status') + '</b>';
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
			loadCurrentStatus();

			// Record Button click event registration.
			document.getElementById('startBtn').addEventListener('click', recordOnClick);
	});