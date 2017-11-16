// Create a new panel
chrome.devtools.panels.create("XPath Finder",
  "icon.png",
  "panel.html",
  function (panel) {
      console.log("I was injected. Thats why i showed up");
  }
);

// Getting last selcted/inspected element.
// E.g. Test if the currently inspected element is the main <body> element
chrome.devtools.inspectedWindow.eval('$0 === document.body', function(result) {
    //alert('$0 is ' + (result ? '' : 'not ') + '<body>');
    // Send to background page.
    chrome.runtime.sendMessage({
				"from"		:	"devtools",
				"event"		: 	'on-selected-elements',
				"message"	:	"Sending selected element",
				"data"		:	result
	});
});
