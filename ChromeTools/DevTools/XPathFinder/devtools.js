// Create a new panel
chrome.devtools.panels.create("XPath Finder",
  "icon.png",
  "panel.html",
  function (panel) {
      console.log("I was injected. Thats why i showed up");
  }
);
