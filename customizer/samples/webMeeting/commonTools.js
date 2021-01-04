/*
 * © Copyright HCL Corp. 2020
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); 
 * you may not use this file except in compliance with the License. 
 * You may obtain a copy of the License at:
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software 
 * distributed under the License is distributed on an "AS IS" BASIS, 
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or 
 * implied. See the License for the specific language governing 
 * permissions and limitations under the License.
 */
if (__cBill_debug !== undefined) {
    __cBill_logger('******** commonTools.js already done. SKIPPING *****************');
} else {
    //
    //  __cBill_debug needs to be declard NOW otherwise the following "__cBill_logger" statement will no work properly
    //
    var __cBill_debug = true;
    //
    //  __cBill_hideNoDestroy is a configuration that determines if the DOM elements needs to be hidden or destroyed fro the UI
    //  It is used to show the possibilities and to provide a late decision point
    //
    var __cBill_hideNoDestroy = false;
    //
    //  Starting ....
    //
    __cBill_logger('******** commonTools.js executed *****************');
    //
    //  These are global functions and classes
    //  ======================================
    //
   //
    //  Class which defines a function that asynchronously returns an ELEMENT by its ID
    //  'onluWhenVisible', 'onlyWhenParentVisible' and 'parentToBeVisible' need to be set manaualy onece the instance has been created
    //
    function __cBill_waitById(label) {
        this.label = '***UNKNOWN***';
        this.onlyWhenVisible = false;    // When set to TRUE, a positive result is returned only if the widget is ALSO VISIBLE
        this.onlyWhenParentVisible = false;  // When set to TRUE, a positive result is returned only if the 'parentToBeVisible' is VISIBLE
        this.parentToBeVisible = ""; // Definition of the parent that needs to be valid for the 'closest' method on a DOM element

        if (label) this.label = label;
        __cBill_logger(this.label + '.__cBill_waitById : initialising !');
        //
        //  Main function of this class
        //  When the related DOM element is found, it executes the 'callback' passing, as parameter, the reference to the element that was found
        //
        this.do = function(callback, elXpath, maxInter, waitTime) {
            var n = this;
            __cBill_logger(this.label + '.__cBill_waitById : executing !');
            if(!maxInter) maxInter = 50;  // number of intervals before expiring
            if(!waitTime) waitTime = 100;  // 1000=1 second
            if(!elXpath) return;

            var waitInter = 0;  // current interval
            var intId = setInterval( function(){
                __cBill_logger(n.label + '.__cBill_waitById.do : waiting ' + elXpath + ' for the ' + waitInter + 'th time...');
                //
                //  Perform the query
                //
                var theWidget = dojo.byId(elXpath);
                //
                //  If results have NOT been found within the allowed range of trials we wait for another timeout to retry
                //
                if (++waitInter < maxInter && !theWidget) return;
                //
                //  If we arrive here, either we had a timeout or we found something....
                //
                if (waitInter >= maxInter) {
                    //
                    //  Timeout..
                    //  Stopping the Interval, logging and finishing....
                    //
                    clearInterval(intId);
                    console.log(n.label + '.__cBill_waitById : TIMEOUT EXPIRED for ' + elXpath + ' !');
                } else {
                    //
                    //  Apparently we found something
                    //  Let's check if there are visible elements and, in that case, return them
                    //
                    if (n.onlyWhenVisible || n.onlyWhenParentVisible) {
                        //
                        //  Now we have to filter ONLY the elemets that are visible
                        //
                        __cBill_logger(n.label + '.__cBill_waitById : checking for visibility of candidate....');
                        let theResult = null;
                        let newElem = theWidget;
                        if (n.onlyWhenParentVisible) {
                            //
                            //  Convolution for InternetExplorer !!!
                            //
                            if ((navigator.appVersion.indexOf("Trident") != -1) || (navigator.appVersion.indexOf("Edge") != -1)) {
                                __cBill_logger(n.label + '.__cBill_waitById : in InternetExplorer');
                                newElem = dojo.query(theWidget).closest(n.parentToBeVisible);
                                newElem = newElem[0];
                            } else {
                                __cBill_logger(n.label + '.__cBill_waitById : NOT in InternetExplorer');
                                newElem = theWidget.closest(n.parentToBeVisible);
                            }
                        }
                        if (newElem) {
                            //
                            //  To check the real visibility, we check the offsetHieight property as described in this article
                            //  https://davidwalsh.name/offsetheight-visibility
                            //
                            __cBill_logger(n.label + '.__cBill_waitById : checking for visibility of ' + newElem);
                            __cBill_logger(n.label + '.__cBill_waitById : visibility is  ' + newElem.offsetHeight);
                            if (newElem.offsetHeight > 0) theResult = theWidget;
                        } else {
                            __cBill_logger(n.label + '.__cBill_waitById : skipping visibility of a NULL element');
                        }
                        if (theResult !== null){
                            //
                            //  We have found the candidates..
                            //  Stopping the Interval, logging and issuing the callback....
                            //
                            clearInterval(intId);
                            __cBill_logger(n.label + '.__cBill_waitById : candidates ' + elXpath + ' retrieved !');
                            //__cBill_logger(theResult);
                            callback(theResult);
                        } else {
                            //
                            //  No visible candidate found
                            //  Maybe we need to continue searching, right ? 
                            //  Thus we do not clear the timer... and we return as if we were still waiting
                            //
                            __cBill_logger(n.label + '.__cBill_waitById : NO VISIBLE element ' + elXpath + ' retrieved ! Continuing');
                            return;
                        }
                    } else {
                        //
                        //  No need to check visibility. The elements were retrieved
                        //  Stopping the Interval, logging and issuing the callback....
                        //
                        clearInterval(intId);
                        __cBill_logger(n.label + '.__cBill_waitById : element ' + elXpath + ' retrieved !');
                        //__cBill_logger(theQuery);
                        callback(theWidget);
                    }
                }
            }, waitTime);
        };        
    }
    //
    //  Class which defines a function that asynchronously returns an ARRAY of ELEMENTS resulting from a dojo QUERY
    //  'onluWhenVisible', 'onlyWhenParentVisible' and 'parentToBeVisible' need to be set manaualy onece the instance has been created
    //
    function __cBill_waitByQuery(label) {
        this.label = '***UNKNOWN***';
        this.onlyWhenVisible = false;    // When set to TRUE, a positive result is returned only if the widget is ALSO VISIBLE
        this.onlyWhenParentVisible = false;  // When set to TRUE, a positive result is returned only if the 'parentToBeVisible' is VISIBLE
        this.parentToBeVisible = ""; // Definition of the parent that needs to be valid for the 'closest' method on a DOM element
        
        if (label) this.label = label;
        __cBill_logger(this.label + '.__cBill_waitByQuery : initialising !');
        //
        //  Main function of this class
        //  When the related DOM elements are found, it executes the 'callback' passing, as parameter, the array containing the elements that were found
        //
        this.do = function(callback, elXpath, maxInter, waitTime) {
            var n = this;
            __cBill_logger(this.label + '.__cBill_waitByQuery : executing !');
            if(!maxInter) maxInter = 50;  // number of intervals before expiring
            if(!waitTime) waitTime = 100;  // 1000=1 second
            if(!elXpath) return;

            var waitInter = 0;  // current interval
            var intId = setInterval( function(){
                __cBill_logger(n.label + '.__cBill_waitByQuery.do : waiting ' + elXpath + ' for the ' + waitInter + 'th time...');
                //
                //  Perform the query
                //
                var theQuery = dojo.query(elXpath);
                //
                //  If results have NOT been found within the allowed range of trials we wait for another timeout to retry
                //
                if (++waitInter < maxInter && !theQuery.length) return;
                //
                //  If we arrive here, either we had a timeout or we found something....
                //
                if (waitInter >= maxInter) {
                    //
                    //  Timeout..
                    //  Stopping the Interval, logging and finishing....
                    //
                    clearInterval(intId);
                    console.log(n.label + '.__cBill_waitByQuery : TIMEOUT EXPIRED for ' + elXpath + ' !');
                } else {
                    //
                    //  Apparently we found something
                    //  Let's check if there are visible elements and, in that case, return them
                    //
                    if (n.onlyWhenVisible || n.onlyWhenParentVisible) {
                        //
                        //  Now we have to filter ONLY the elemets that are visible
                        //
                        __cBill_logger(n.label + '.__cBill_waitByQuery : checking for visibility of ' + theQuery.length + ' candidates....');
                        let theResult = [];
                        theQuery.forEach(function(elem) {
                            let newElem = elem;
                            if (n.onlyWhenParentVisible) {
                                //
                                //  Convolution for InternetExplorer !!!
                                //
                                if ((navigator.appVersion.indexOf("Trident") != -1) || (navigator.appVersion.indexOf("Edge") != -1)) {
                                    __cBill_logger(n.label + '.__cBill_waitByQuery : in InternetExplorer');
                                    newElem = dojo.query(elem).closest(n.parentToBeVisible);
                                    newElem = newElem[0];
                                } else {
                                    __cBill_logger(n.label + '.__cBill_waitByQuery : NOT in InternetExplorer');
                                    newElem = elem.closest(n.parentToBeVisible);
                                }
                            }
                            if (newElem) {
                                //
                                //  To check the real visibility, we check the offsetHieight property as described in this article
                                //  https://davidwalsh.name/offsetheight-visibility
                                //
                                __cBill_logger(n.label + '.__cBill_waitByQuery : checking for visibility of ' + newElem);
                                __cBill_logger(n.label + '.__cBill_waitByQuery : visibility is  ' + newElem.offsetHeight);
                                if (newElem.offsetHeight > 0) theResult.push(elem);
                            } else {
                                __cBill_logger(n.label + '.__cBill_waitByQuery : skipping visibility of a NULL element');
                            }
                        });
                        if (theResult.length > 0){
                            //
                            //  We have found the candidates..
                            //  Stopping the Interval, logging and issuing the callback....
                            //
                            clearInterval(intId);
                            __cBill_logger(n.label + '.__cBill_waitByQuery : candidates ' + elXpath + ' retrieved !');
                            //__cBill_logger(theResult);
                            callback(theResult);
                        } else {
                            //
                            //  No visible candidate found
                            //  Maybe we need to continue searching, right ? 
                            //  Thus we do not clear the timer... and we return as if we were still waiting
                            //
                            __cBill_logger(n.label + '.__cBill_waitByQuery : NO VISIBLE element ' + elXpath + ' retrieved ! Continuing');
                            return;
                        }
                    } else {
                        //
                        //  No need to check visibility. The elements were retrieved
                        //  Stopping the Interval, logging and issuing the callback....
                        //
                        clearInterval(intId);
                        __cBill_logger(n.label + '.__cBill_waitByQuery : element ' + elXpath + ' retrieved !');
                        //__cBill_logger(theQuery);
                        callback(theQuery);
                    }
                }
            }, waitTime);
        };
    }
    //
    //  Class which defines a function that asynchronously returns when DOJO has been loaded on the page (checking the Dojo version also)
    //
    function __cBill_waitForDojo(label) {
        this.label = '***UNKNOWN***';
        if (label) this.label = label;
        __cBill_logger(this.label + '.__cBill_waitForDojo : initialising !');
        //
        //  Main function of this class
        //  When DOJO is loaded on the page, it executes the 'callback' 
        //
        this.do = function(callback, maxInter, waitTime) {
            var n = this;
            __cBill_logger(this.label + '.__cBill_waitForDojo.do : executing !');
            if(!maxInter) maxInter = 50;  // number of intervals before expiring
            if(!waitTime) waitTime = 100;  // 1000=1 second

            var waitInter = 0;  // current interval
            var intId = setInterval(function() {
                __cBill_logger(n.label + '.__cBill_waitForDojo.do : waiting for the ' + waitInter + 'th time...');
                if ((++waitInter < maxInter) && (typeof dojo === "undefined")) return;
                clearInterval(intId);
                if (waitInter >= maxInter) {
                    if (document.body.classList.contains('lotusError')) {
                        //
                        //  If we are on an error page, do not display the alert but simply log the information
                        //
                        __cBill_logger(n.label + '.commonTools.WaitForDojo.do : This is normal : TIMEOUT Expired on Error page !');
                    } else {
                        __cBill_logger(n.label + ' ');
                        __cBill_logger(n.label + '*******************************************');
                        __cBill_logger(n.label + '.__cBill_waitForDojo.do : TIMEOUT EXPIRED !');
                        __cBill_logger(n.label + '*******************************************');
                        __cBill_logger(n.label + ' ');
                    }
                    return;
                } else {
                    __cBill_logger(n.label + '.__cBill_waitForDojo.do : DOJO is defined !');
                    //
                    //  Check the Dojo version (this is in order to keep in cosideration iFrames)
                    //
                    if (dojo.version.major >= 1 && dojo.version.minor >= 10) {
                        __cBill_logger(n.label + '.__cBill_waitForDojo.do : Issuing Dojo/DomReady!... ');
                        dojo.require("dojo.cookie");
                        require(["dojo/domReady!"], callback());
                    } else {
                        __cBill_logger(n.label + ' ');
                        __cBill_logger(n.label + '********************************************');
                        __cBill_logger(n.label + '.__cBill_waitForDojo.do : BAD DOJO version !');
                        __cBill_logger(n.label + '********************************************');
                        __cBill_logger(n.label + ' ');
                    }
                }
            }, waitTime);
        };
    }
    function __cBill_uncheckBox(theWidget) {
        //
        //  Makes sure the checkBox is really UNCHECKED by dispatching all the related events
        //
        if (dojo.getAttr(theWidget, "checked")) {
            __cBill_logger('__cBill_uncheckBox : changing checkbox to UNCHECKED...');
            let ownerDoc = theWidget.ownerDocument;
            let myEvent = ownerDoc.createEvent('MouseEvents');
            myEvent.initEvent('click', true, true);
            myEvent.synthetic = true;
            theWidget.dispatchEvent(myEvent, true);
            __cBill_logger('__cBill_uncheckBox : event dispatched to uncheck...');
            //
            //  The following statements are UNUSEFUL and even create side-effects.
            //  DO NOT USE THEM
            //
            //dojo.setAttr(theWidget, "value", false);
            //dojo.setAttr(theWidget, "checked", false);
            //dojo.removeAttr(theWidget, "disabled");
        } else {
            __cBill_logger('__cBill_uncheckBox : checkbox already UNCHECKED. Nothing to do...');
        }
    }
    function __cBill_uncheckBox2(theWidget) {
        //
        //  Makes sure the checkBox is really UNCHECKED by dispatching all the related events
        //  I think that CHROME and IE11 behave differently when trying to change the checkbox of an
        //  element that is not visible
        //
        if (dojo.getAttr(theWidget, "checked")) {
            __cBill_logger('__cBill_uncheckBox2 : changing checkbox to UNCHECKED...');
            let ownerDoc = theWidget.ownerDocument;
            let myEvent = ownerDoc.createEvent('MouseEvents');
            myEvent.initEvent('click', true, true);
            myEvent.synthetic = true;
            theWidget.dispatchEvent(myEvent, true);
            __cBill_logger('__cBill_uncheckBox2 : event dispatched to uncheck...');
            if (dojo.isChrome || (navigator.appVersion.indexOf("Trident")!= -1)) {
                dojo.setAttr(theWidget, "value", false);
                dojo.setAttr(theWidget, "checked", false);
                dojo.removeAttr(theWidget, "disabled");
                __cBill_logger('__cBill_uncheckBox2 : supplemental code for IE or Chrome executed...');
            }
        } else {
            __cBill_logger('__cBill_uncheckBox2 : checkbox already UNCHECKED. Nothing to do...');
        }
    }
    //
    //
    //
    function __cBill_alert(theString) {
        if (__cBill_debug) alert(theString);
    }
    function __cBill_logger(theString) {
        if (__cBill_debug) console.log(theString);
    }
    function __cBill_getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
}
