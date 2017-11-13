// -----------------------------------------------------------------------------
// @Author : Ashutosh Mishra [nityanarayn44]
// @Desc: Content Script for injection.
// It will calculate the Xpath and Meta of the targeted Element
// -----------------------------------------------------------------------------

(function () {

	//===============================================
	// @Event:Document_start Time Logging
	//===============================================
		// Used to style console.log messages.
		var messageStyle = 'color: green; font-size: 15px; font-weight: lighter; border-color: #C7E4ED; border-style: solid; border-width: 1px; border-radius: 3px;';
		var timeStyle = 'color: green; font-size: 13px';
		// Getting date and time, when this scipt was Injected.
		function getFormattedDate() { var date = new Date(); return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ':' + date.getMilliseconds(); }
		// Logging the initial information about the script.
		console.log('Script Injected.... %cDocument start: %c ' + getFormattedDate(), messageStyle, timeStyle);

	//===============================================
	// @Working: Main purpose/logic_code for this script.
	//===============================================
		//TODO: Code Goes here.
		//QUESTION: Should we adding multiple script injection instead of only one script injection.


})();
