
//just simply printing a message.
function showMe(){
	console.log('Hello World from chrome Extension.');
}

//creating an alarm, when extension is loaded completly
chrome.runtime.onInstalled.addListener( function() {
	chrome.alarms.create('printMsg', {periodInMinutes:1});
});

//work as alrm says
function onAlarm(alarm) {
  console.log('Got alarm', alarm);
  // |alarm| can be undefined because onAlarm also gets called from
  // window.setTimeout on old chrome versions.
  if (alarm && alarm.name == 'printMsg') {
    showMe();
  } else {
    console.log('alarm failure');
  }
}

//listening for alarm.
console.log('This is script that runs when alarm is raised.');
if(chrome && chrome.alarms){
	chrome.alarms.onAlarm.addListener(onAlarm);
}else{ console.log('alarm not available'); }

//Whenever usser will click on extension icon on chrome.
/*
chrome.browserAction.onClick.addEventListener(function() {
	console.log('browserAction clicked.');
});
*/