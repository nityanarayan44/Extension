/**
 * #Library for Xpath generation includong the Robula Algorithm also.
 * @Written: 10 Nov 2017
 * @By: Ashutosh Mishra
 * @license: MIT License 2017
 */

var nngXPath = (function () {
    // Using resttriction
    'use strict';

    // this function is strict...
    var xpath = {
                //==========================================================
                // Spares function
                //==========================================================
                //
                // generateAbsXPath
                validateEventObjectThenProceed : function (event) {
                    //Validate event object, and if found any problem then throw an exception
                    if (event === undefined) {event = window.event; /* IE hack */} else { throw new Exception('[validateEventObjectThenProceed Module] : passed event object is undefined.'); }

                    //Extract the target, or so called element object
                    var target= 'target' in event ? event.target : event.srcElement; // another IE hack

                    // Send this element to process the xpath.
                    return ((processNodes(target)).indexOf(".//") ? ".//"+ processNodes(target) : processNodes(target));
                },

                //process all the nodes
                processNodes : function(element) {
                    // Iterate through all the element for linear traversal
                    if(element !== undefined){
                        var ix = 0; var siblings= element.parentNode.childNodes;
                        for (var i= 0; i<siblings.length; i++) {
                            var sibling= siblings[i];
                            if (sibling===element) {return getXPath(element.parentNode)+'/'+element.tagName+'['+(ix+1)+']'; }
                            if (sibling.nodeType===1 && sibling.tagName===element.tagName) { ix++; }
                        }// End of for
                    }// End of if
                    else { throw new Exception('[processNodes Module] : passed element object is undefined.'); }
                },

                // Now, calculate the xpath
                absXpathCalculation : function (element) {

                        //When element is body itself.
                        if (element !== undefined && element === document.body) return element.tagName;

                        //Otherwise, iterate through all the element for linear traversal
                        if (element !== undefined) {

                            //Proceed only, when element hace its parent node and child of parent
                            if (element.parentNode && element.parentNode.childNodes) {
                                var ix = 0;
                                var siblings = element.parentNode.childNodes;
                                for (var i = 0; i < siblings.length; i++) {
                                    //console.dir(element);
                                    var sibling = siblings[i];
                                    if (sibling === element) {
                                        if (element.name && element.name !== undefined && element.name !== '' )
                                            return XPath.absXpathCalculation(element.parentNode) + '/' + element.tagName + '[@name="' + element.name + '"]';
                                        else
                                            return XPath.absXpathCalculation(element.parentNode) + '/' + element.tagName + '[' + (ix + 1) + ']';
                                    }
                                    if (sibling.nodeType === 1 && sibling.tagName === element.tagName) ix++;
                                }//End of for
                            }//End of if
                        }// End of if
                }/* End  of function object */,


                //==========================================================
                // Functions for Xpath manupulation
                // XPath algorithm Implementation
                //==========================================================

                // 1: getting absolute XPath.
                getAbsXPath : function(event) {
                    // returning final output
                    return validateEventObjectThenProceed(event);
                },

                // 2: getting XPath, generated from Robula algorithm.
                getRobulaXpath : function (element) { return ''; },

                // 3: getting XPath Suggestions [further xpath possibilities]
                getXPathSuggestion : function (obj) {
                    var sugg = "";
                    if(obj !== undefined && obj !== null ){
                        // Suggestions based on ID
                        sugg += ( obj.id !== "" && obj.id !== undefined) ? ("//*[@id='"+ obj.id +"'] <br/> //*[contains(@id,'"+ obj.id +"')] <br/>") : "" ;

                        // Suggestion based on Name
                        sugg += ( obj.name !== "" && obj.name !== undefined) ? (" //*[@name='"+ obj.name +"'] <br/> //*[contains(@name,'"+ obj.name +"')] <br/>") : "" ;

                        // Suggestion based on className
                        sugg += ( obj.className !== "" && obj.className !== undefined) ? (" //*[@class='"+ obj.className +"'] <br/> //*[contains(@class,'"+ obj.className +"')] <br/>") : "" ;

                        // Suggestion based on innerText
                        sugg += ( obj.text !== "" && obj.text !== undefined) ? (" //*[text()='"+ obj.text +"'] <br/> //*[contains(text(),'"+ obj.text +"')] <br/>") : "" ;

                        // Suggestion based on ID and/or innerText
                        sugg += ( (obj.id !== undefined && obj.id !== "" && obj.id.length !== 0) && (obj.text !== undefined && obj.text !== "" && obj.text.length !== 0)) ? (" //*[@id='"+ obj.id +"' and text()='"+ obj.text +"'] <br/> //*[@id='"+ obj.id +"' and contains(text(),'"+ obj.text +"')] <br/>") : "";

                        // Suggestion based on Class and/or innerText
                        sugg += ( (obj.className !== undefined && obj.className !== "") && (obj.text !== undefined && obj.text !== "") ) ? (" //*[@class='"+ obj.className +"' and contains(text(), '"+ obj.text +"') ] <br/> //*[@class='"+ obj.className +"' and text()='"+ obj.text +"'] <br/>") : "" ;

                        // Suggestion based on dimension
                        sugg += ( obj.dimension !== "" && obj.dimension !== undefined) ? ("<br/> dimension (x, y) can be used in Action Class or Robot class of java.") : "";
                    }
                    if (sugg.length === 0) sugg += "Oopse, No Suggestions at this moment.";

                    // Finally return the Output.
                    return sugg;
                }

                /*------------------------------------------*/
                /*  Further improvement can be added here   */
                /*  THANKS                                  */
                /*------------------------------------------*/

    };

    // Finally return the object to global library object
    return xpath;
}());
