/*
 * @Author: Ashutosh Mishra, NNG Experiments.
 * @Version 1
 * @XPath Finder
 * @Started 25 AUG 2017
 * @Modified 08 Nov 2017 [Prototype-C]
 * @license : MIT License 2017
 * Use of this source code is open
 **/
 
// The function below is executed in the context of the inspected page.
// var page_getProperties = function() {
//         var data = window.jQuery && $0 ? jQuery.data($0) : {};
//         // Make a shallow copy with a null prototype, so that sidebar does not
//         // expose prototype.
//         var props = Object.getOwnPropertyNames(data);
//         var copy = { __proto__: null };
//         for (var i = 0; i < props.length; ++i)
//         copy[props[i]] = data[props[i]];
//         return copy;
// }
// Sample Object to be shown.
// {
//     title: "XPath for the selected Object",
//     selectedElement: "",
//     elementAttributes: ""
// }

// It will collect all the data.
var dataObj = {
    "tagName": "",
    "innerText": "",
    "attributeKeys": "",
    "attributeData": "",
    "parentNode":"",
    "firstChildNode":"",
    "nextSiblingNode":""
};

var getXPathSuggestionsList = function(eleName, eleAttribs, eleInnerText) {
    var xpList = [];
    // Process the attribs.
    if(eleAttribs.length > 0){
        xpList.push('You could also combine or modify these suggestions to build your own solid XPath.');
        eleAttribs.map(function(attribute){ xpList.push('//*['+attribute+']  or  //'+ eleName+'['+attribute+']'); });
        if(eleInnerText.indexOf("\n") !== -1) { xpList.push("//*[contains(text(), '"+(eleInnerText.replace(/(\r\n\t|\t|\r|\n|)/g,'')).substring(0, ((eleInnerText.length>9)? 9 : (eleInnerText.length/2)+1))+"')]  or  //" + eleName + "[contains(text(), '"+(eleInnerText.replace(/(\r\n\t|\t|\r|\n|)/g,'')).substring(0, ((eleInnerText.length>9)? 9 : eleInnerText.length/2))+"')]") ; }else { xpList.push("//*[text()='"+eleInnerText+"']  or  //"+eleName+"[text()='"+eleInnerText+"']"); }
    }
    else if(eleInnerText.length > 0) {
        xpList.push('You could also combine or modify these suggestions to build your own solid XPath.');
        if(eleInnerText.indexOf("\n") !== -1) { xpList.push("//*[contains(text(), '"+(eleInnerText.replace(/(\r\n\t|\t|\r|\n|)/g,'')).substring(0, ((eleInnerText.length>9)? 9 : (eleInnerText.length/2)+1))+"')]  or  //" + eleName + "[contains(text(), '"+(eleInnerText.replace(/(\r\n\t|\t|\r|\n|)/g,'')).substring(0, ((eleInnerText.length>9)? 9 : eleInnerText.length/2))+"')]") ; }else { xpList.push("//*[text()='"+eleInnerText+"']  or  //"+eleName+"[text()='"+eleInnerText+"']"); }
    }
    else {xpList.push('Found no suggestion based on Element itself');}
    // return the outcome.
    return xpList;
};

var updatePanelWithData = function () {
    return {
        '0_Current': dataObj.tagName,
        '1_Attribs': JSON.stringify(dataObj.attributeKeys),
        '2_ParentNode'      : dataObj.parentNode,
        '3_FirstSiblingNode': dataObj.nextSiblingNode,
        '4_FirstChildNode'  : dataObj.firstChildNode,
        'XPath'             : getXPathSuggestionsList(dataObj.tagName, dataObj.attributeData, dataObj.innerText)
        /*"_dump"    : dataObj*/
    };
};

//===============================================
// Creating Extension panel
//===============================================
chrome.devtools.panels.create("XPath Finder",
  "icon.png",
  "panel.html",
  function(extensionPanel) {
});

//===============================================
// Creating the panel sidebar under elements panel
//===============================================
// sidebar.setExpression("(" + result + ")()"); // Setting some data after evaluation (if evaluation get correctly).
// sidebar.setObject(getObj(result));  // Setting object on the sidebar.
// sidebar.setObject({"data":"No Data Found"});
// sidebar.setPage('pageRelativeAddress'); // Showing a page on this sidebar.

chrome.devtools.panels.elements.createSidebarPane("XPATH FINDER", function(sidebar) {
            // getting a selected element form the elements panel, and evaluate some expression.
            function updateElementProperties() {
                // evaluation of current selected element.
                //chrome.devtools.inspectedWindow.eval("$0.tagName", th)
                chrome.devtools.inspectedWindow.eval("$0.tagName || $0.localName || $0.nodeName", function(result, error){
                    // Pushing the result.
                    console.log(result);
                    dataObj.tagName = result;

                    chrome.devtools.inspectedWindow.eval("$0.innerText", function(result, error){
                        // Pushing the result. JSON.stringify(result);
                        console.log(result);
                        dataObj.innerText = result;

                        chrome.devtools.inspectedWindow.eval("$0.getAttributeNames()", function(result, error){
                            // Pushing the result. JSON.stringify(result);
                            console.log(result);
                            dataObj.attributeKeys = result;

                            chrome.devtools.inspectedWindow.eval("($0.getAttributeNames()).map(function(attrib){ return ('@' + attrib +'=\"'+ $0.getAttribute(attrib) +'\"'); });", function(result, error){
                                // Pushing the result.
                                console.log(result);
                                dataObj.attributeData = result;

                                chrome.devtools.inspectedWindow.eval("if($0.childNodes.length > 0) { $0.firstElementChild.tagName; } else {'No child'}", function(result, error){
                                    // Pushing the result. JSON.stringify(result);
                                    console.log(result);
                                    dataObj.firstChildNode = result;

                                    chrome.devtools.inspectedWindow.eval("if($0.nextElementSibling !== null) { $0.nextElementSibling.tagName; } else {'No Sibling'}", function(result, error){
                                        // Pushing the result. JSON.stringify(result);
                                        console.log(result);
                                        dataObj.nextSiblingNode = result;

                                        chrome.devtools.inspectedWindow.eval("$0.parentElement.tagName", function(result, error){
                                            // Pushing the result. JSON.stringify(result);
                                            console.log(result);
                                            dataObj.parentNode = result;

                                                // Update the data of the side panel.
                                                sidebar.setPage('panel.html'); // Showing a page on this sidebar.
                                                sidebar.setHeight("100px");
                                                sidebar.setObject( updatePanelWithData(), "Extracted Data for the current Selected element" , function(obj){});

                                        });
                                    });
                                });
                            });
                        });
                    });
                });




            }

            // Call once, at start
            updateElementProperties();

            // Registering an event when element selection is changes
            chrome.devtools.panels.elements.onSelectionChanged.addListener(updateElementProperties);
});
