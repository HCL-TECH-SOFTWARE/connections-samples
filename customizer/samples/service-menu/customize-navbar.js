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
                // modify menu
                // nodeId - menuId to query for
                // textContent - menu text to change
                // link - menu link to change
                var modifyMenu = function (queryTopNavMenu, querySubMenu, newText, newLink, newClass) {
                    // query the top nav menu by text
                    var topNavMenu = dojo.query(`a[aria-label=\"${queryTopNavMenu}\"]`)[0];
                    if (topNavMenu) {
                        // if there's no submenu to query, just modify the top nav menu
                        if (!querySubMenu) {
                            // if text is provided change the text
                            if (newText) {
                                // change the top nav menu text
                                topNavMenu.textContent = newText;
                                // change the top nav menu arial-label
                                dojo.attr(topNavMenu, 'arial-label', newText);
                                // change the dropdown menu container-arial-label
                                var dialogContainer = dojo.query(`div[aria-label=\"${queryTopNavMenu}\"]`)[0];
                                if (dialogContainer) {
                                    dojo.attr(dialogContainer, 'arial-label', newText);
                                }
                            };
                            // if class is provided add class
                            if (newClass) topNavMenu.addClass(newClass);
                        } else {
                            // add event when user enters the navbar menu
                            on(topNavMenu, mouse.enter, function () {
                                // wait for the navbar dropdown menu to show
                                waitFor(function () {
                                    var dialogBody = dojo.query(`div[aria-label=\"${queryTopNavMenu}\"]`)[0];
                                    var submenu = dojo.query(`a:contains("${querySubMenu}")`, dialogBody)[0];
                                    if (submenu) {
                                        // if text is provided change the text
                                        if (newText) submenu.textContent = newText;
                                        // if link is provided change the link
                                        if (newLink) dojo.attr(submenu, 'href', newLink);
                                        // if class is provided add class
                                        if (newClass) submenu.addClass(newClass);
                                    } else {
                                        throw new Error("Cannot find submenu to modify: " + querySubMenu);
                                    }
                                }, `tr > td > a:contains("${querySubMenu}")`);
                            });
                        }
                    } else {
                        throw new Error("Cannot find top nav menu to modify: " + queryTopNavMenu);
                    }
                }
                // 3) Delete Menu
                // topNavMenuText
                // subMenuText - optional, if provided will delete just the submenu, other if null, will delete the top nav menu item
                var deleteMenu = function (queryTopNavMenu, querySubMenu) {
                    // query the top nav menu by text
                    var topNavMenu = dojo.query(`a[aria-label=\"${queryTopNavMenu}\"]`)[0];
                    if (topNavMenu) {
                        if (!querySubMenu) {
                            // delete only the top nav menu, list element
                            domConstruct.destroy(topNavMenu.parentNode);
                        } else {
                            // delete the submenu
                            on(topNavMenu, mouse.enter, function () {
                                // wait for the navbar dropdown menu to show
                                waitFor(function () {
                                    var dialogBody = dojo.query(`div[aria-label=\"${queryTopNavMenu}\"]`)[0];
                                    var submenu = dojo.query(`tr > td > a:contains("${querySubMenu}")`, dialogBody)[0];
                                    if (submenu) {
                                        // delete the table row with the submenu
                                        domConstruct.destroy(submenu.parentNode.parentNode);
                                    } else {
                                        throw new Error("Cannot find submenu to delete: " + querySubMenu);
                                    }
                                }, `tr > td > a:contains("${querySubMenu}")`);
                            });
                        }
                    } else {
                        throw new Error("Cannot find top nav menu to delete: " + queryTopNavMenu);
                    }
                }
                // here we use waitFor page to load
                // before we proceed to customize the navbar for the menu Apps
                waitFor(function () {
                        console.log('loaded');
                        //
                        // 1) get the top navbar <ul>
                        var navbar = dojo.query("ul.lotusInlinelist.lotusLinks")[0];
                        //
                        // 2) create the top link menu wrapper
                        var topNavMenuId = "btn_actn__add_menu_wrapper_1";
                        var topNavMenuText = "<Your Menu Label Here>";
                        var menuWrapper = createMenuWrapper(navbar, topNavMenuId, topNavMenuText);
                        //
                        // 3) create the submenus and links
                        var subMenuId = "btn_act__add_submenu1";
                        var subMenuText = "<Menu Link Label 1>";
                        var subMenuLink = "https://<menu item link 1>";
                        var subMenuId2 = "btn_act__add_submenu2";
                        var subMenuText2 = "<Menu Link Label 2>";
                        var subMenuLink2 = "https://<menu item link 2>";
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
                        //
                        // 4) Modify the menu wrapper text, top nav menu
                        var modifyTopNavMenu = "Communities";
                        var modifyTopNavMenuText = "My Communities";
                        modifyMenu(modifyTopNavMenu, null, modifyTopNavMenuText);
                        // 5) Modify the submenu text and link
                        var modifySubMenu = "Discover";
                        var modifySubMenuText = "Discover 2";
                        var modifySubMenuLink = "http://<menu item link>";
                        modifyMenu(modifyTopNavMenu, modifySubMenu, modifySubMenuText, modifySubMenuLink);
                        // uncomment lines below to delete the menus
                        // 5) delete the menu wrapper (top navbar menu item)
                        // var deleteTopNavMenuByText = "Testing";
                        // deleteMenu(deleteTopNavMenuByText);
                        // delete the submenu item
                        // deleteTopNavMenuByText = "Communities";
                        // var deleteSubMenuByText = "Invited";
                        // deleteMenu(deleteTopNavMenuByText, deleteSubMenuByText);
                    },
                    "div.lotusBanner");
            } catch (e) {
                console.log("customNavbar error " + e);
                alert("Exceptionc customizing menu item: " + e);
            }
        });
    }
})();