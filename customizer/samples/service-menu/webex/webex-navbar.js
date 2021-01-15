// ==UserScript==
// @copyright    Copyright HCL Technologies Limited 2020
// @name         Customize Navbar Menus
// @namespace    http://hcl.com
// @version      0.1
// @description  Prototype code, sample on how to customize the navbar menu (Create, Modify, and Delete), only tested with English strings, MT environment only
// @author       Saymai Adkins
// @include      *://connmt-orga.cnx.cwp.pnp-hcl.com/*
// @exclude
// @run-at       document-end 
// ==/UserScript==

(function () {
    'use strict';
    if (typeof (dojo) != "undefined") {
        require(["dojo/dom-construct", "dojo/dom", "dojo/query", "dojo/string", "dojo/on", "dojo/mouse"], function (domConstruct, dom, query, string, on, mouse) {
            try {
                let meetingUrl = '';
                // utility function to let us wait for a specific element of the page to load...
                var waitFor = function (callback, elXpath, elXpathRoot, maxInter, waitTime) {
                    if (!elXpath) return;
                    var root = elXpathRoot ? elxpathRoot : dojo.body();
                    var maxInterval = maxInter ? maxInter : 10000; // number of intervals before expiring
                    var interval = waitTime ? waitTime : 1; // 1000=1 second
                    var waitInter = 0; // current interval
                    var intId = setInterval(function () {
                        if (++waitInter < maxInterval && !dojo.query(elXpath, root).length) return;

                        clearInterval(intId);
                        if (waitInter >= maxInterval) {
                            console.log("**** WAITFOR [" + elXpath + "] WATCH EXPIRED!!! interval " + waitInter + " (max:" + maxInter + ")");
                        } else {
                            console.log("**** WAITFOR [" + elXpath + "] WATCH TRIPPED AT interval " + waitInter + " (max:" + maxInter + ")");
                            callback();
                        }
                    }, interval);
                };
                // Create menu wrapper (top level navbar menu with dropdown menu)
                // nodeParent - navbar container element
                // nodeId - unique id for this top navbar menu item
                // menuTitle - navbar menu item text
                // menuLink - navbar menu link, to launch if the user clicks on this menu item
                var createMenuWrapper = function (nodeParent, nodeId, menuTitle) {
                    if (nodeParent && !dojo.query("#" + nodeId)[0]) {
                        var host = '';
                        var template = '<a onmouseover="dojo.require(\'lconn.core.header\');lconn.core.header.menuMouseover(this);" onclick="dojo.require(\'lconn.core.header\');lconn.core.header.menuClick(this); _lconn_menuid="lconnheadermenu-${menuTitle}" aria-label="${menuTitle}">${menuTitle}<img role="presentation" alt="" src="${host}/connections/resources/web/com.ibm.lconn.core.styles.oneui3/images/blank.gif?etag=20200217.221231" class="lotusArrow lotusDropDownSprite"><span class="lotusAltText">▼</span></a>';
                        var html = string.substitute(template, {
                            menuTitle,
                            host
                        }, string.escape);
                        return domConstruct.create(
                            "li", {
                            id: nodeId,
                            innerHTML: html
                        },
                            nodeParent
                        );
                    } else {
                        throw new Error("Error couldn't find the node parent to insert menu wrapper");
                    }
                };
                // Create submenu under the navbar menu
                // topNavMenuText - to query if the div container with aria-label exists in the flyout dialog (drop down menu)
                // menuId - create a unique submenu id
                // menuTitle - create the submenu title
                // menuLink - create the submenu link, to launch in a separate browser if user clicks on this submenu
                var createSubmenu = function (topNavMenuText, menuId, menuTitle, menuLink) {
                    // create submenu if it doesn't exist by menuId
                    if (topNavMenuText && !dojo.query("#" + menuId)[0]) {
                        // query <div data-dojo-attach-point="containerNode" aria-label=<nav_menu_text>
                        var dialogBody = dojo.query(`div[aria-label=\"${topNavMenuText}\"]`)[0];
                        // query if the table exists
                        var tableBody = dojo.query('table > tbody', dialogBody)[0];
                        // if table doesn't exist, create it once
                        if (!tableBody) {
                            var templateTbl = '<table dojotype="dijit._Widget" class="lotusLayout" cellpadding="0" cellspacing="0" role="presentation" id="dijit__Widget_4" widgetid="dijit__Widget_4"><tbody/></table>';
                            var div = domConstruct.create(
                                "div", {
                                role: "document",
                                innerHTML: templateTbl
                            },
                                dialogBody
                            );
                            tableBody = dojo.query('tbody', div)[0];
                        };
                        if (dialogBody && tableBody) {
                            var templateTD = '<td class="lotusNowrap lotusLastCell"><a class="lotusBold" href="${menuLink}" target="_blank">${menuTitle}</a></td>';
                            var html = string.substitute(templateTD, {
                                menuTitle,
                                menuLink
                            }, string.escape);
                            return domConstruct.create(
                                "tr", {
                                id: menuId,
                                innerHTML: html
                            },
                                tableBody
                            );
                        };
                    };
                };

                // Main execution - here we use waitFor page to load
                // before we proceed to customize the navbar for the WebEx menu
                //  First thing. GET THE PROFILE of the current user
                //  Variable "lconn.core.auth.getUser().id" is available from Connections
                //
                try {
                    let userId = lconn.core.auth.getUser().id;
                    console.log('WebEx: Getting profile data for userId: ' + userId);
                    let profilesArgs = {
                        url: "/profiles/atom/profile.do",
                        handleAs: "xml",
                        preventCache: true,
                        content: { userid: userId, format: 'full' }
                    };
                    let deferred = dojo.xhrGet(profilesArgs);
                    deferred.then(function (data) {
                        console.debug('WebEx: Got profile data');
                        if (data !== null) {
                            //
                            //  The REST Call returned succesfully
                            //  Get the HCARD for the user in XML format
                            //
                            dojo.require("dojox.atom.io.model");
                            let feed = new dojox.atom.io.model.Feed();
                            let parser = new DOMParser();
                            feed.buildFromDom(data.documentElement);
                            let hcardXML = parser.parseFromString(feed.entries[0].content.value, "text/html");

                            //
                            //  Linkroll case.
                            //  We need first to fetch the KEY 
                            //
                            console.debug('WebEx: Looking for meeting URL in Linkroll');
                            let theKey = null;
                            let results = hcardXML.evaluate("//div[@class='x-profile-key']", hcardXML.documentElement, null, XPathResult.ANY_TYPE, null);
                            let theNode = results.iterateNext();
                            if (theNode !== null) {
                                theKey = theNode.innerText;
                                //
                                //  Now we got and fetch the Linkroll
                                //
                                profilesArgs = {
                                    url: "/profiles/atom/profileExtension.do",
                                    handleAs: "xml",
                                    preventCache: true,
                                    content: { key: theKey, extensionId: 'profileLinks' }
                                };
                                let deferred2 = dojo.xhrGet(profilesArgs);
                                deferred2.then(function (data) {
                                    if (data !== null) {
                                        //
                                        //  There is a LINKROLL.
                                        //  Check if there is a LINK whose name is "Meeting"
                                        //
                                        for (let i = 0; i < data.documentElement.children.length; i++) {
                                            let theChild = data.documentElement.children[i];
                                            let theNameAttribute = theChild.attributes[0];
                                            let theURLAttribute = theChild.attributes[1];
                                            if (theNameAttribute.value === 'Meeting') {
                                                meetingUrl = theURLAttribute.value;
                                                console.debug('WebEx: Found LINKROLL meeting link : ' + meetingUrl);
                                            }
                                        }
                                        waitFor(function () {
                                            console.log('Webex: Adding custom menu wrapper and links');
                                            if (meetingUrl != '') {
                                                // Construct link to site landing page from meeting url
                                                var meetingHost = (new URL(meetingUrl)).hostname;
                                                var meetingProtocol = (new URL(meetingUrl)).protocol;
                                                var meetingSite = meetingProtocol+'//'+meetingHost;
                                                console.debug(`WebEx: Meeting url=${meetingUrl}`);
                                                console.debug(`WebEx: Site url=${meetingSite}`);
                                                
                                                // 1) get the top navbar <ul>
                                                var navbar = dojo.query("ul.lotusInlinelist.lotusLinks")[0];
                                                //
                                                // 2) create the top link menu wrapper
                                                var topNavMenuId = "btn_actn__add_menu_webex";
                                                var topNavMenuText = "WebEx";
                                                var menuWrapper = createMenuWrapper(navbar, topNavMenuId, topNavMenuText);
                                                //
                                                // 3) create the submenus and links
                                                var subMenuId = "btn_act__add_webex1";
                                                var subMenuText = "WebEx Meetings";
                                                var subMenuLink = meetingSite;
                                                var subMenuId2 = "btn_act__add_webex2";
                                                var subMenuText2 = "Host WebEx Meeting";
                                                var subMenuLink2 = meetingUrl;
                                                // get the anchor element for the navbar menu
                                                var anchor = dojo.query("a", menuWrapper)[0];
                                                // add event when user enters the navbar menu
                                                on(anchor, mouse.enter, function () {
                                                    // wait for the navbar dropdown menu to show
                                                    waitFor(function () {
                                                        // create one submenu
                                                        createSubmenu(topNavMenuText, subMenuId, subMenuText, subMenuLink);
                                                        // create another submenu
                                                        createSubmenu(topNavMenuText, subMenuId2, subMenuText2, subMenuLink2);
                                                    }, `div[aria-label=\"${topNavMenuText}\"]`);
                                                });
                                            }
                                        }, "div.lotusBanner");
                                    } else {
                                        //
                                        //  No LINKROLL
                                        //
                                        console.log('WebEx: LINKROLL property not found in profile');
                                    }
                                },
                                    function (error) {
                                        //
                                        //  deferred2 ERROR
                                        //
                                        console.log('WebEx: Error during profileExtension.do ');
                                        console.dir(error);
                                    });
                            } else {
                                //
                                //  Very strange.. there is NO KEY ....
                                //
                                console.log('WebEx:  profile KEY was not found !');
                            }
                        } else {
                            //
                            //  No response from profile.do api call
                            //
                            console.log('WebEx: NULL response from profile.do api call');
                        }
                    },
                        function (error) {
                            //
                            //  deferred ERROR
                            //
                            console.log('WebEx: Error during profile.do api call');
                            console.dir(error);
                        });
                } catch (ex) {
                    console.log("WebEx: Unable to get userId using lconn.core.auth.getUser().id : " + ex);
                }

            } catch (e) {
                console.log("error " + e);
                alert("Exception adding link item: " + e);
            }
        });
    }
})();