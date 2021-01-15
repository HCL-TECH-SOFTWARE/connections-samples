// ==UserScript==
// @copyright    Copyright HCL Technologies Limited 2020
// @name         Customize User's Business Card Menu
// @namespace    http://www.hcl.com
// @version      0.1
// @description  Prototype code, sample on how to customize the profiles business card's menu to work on any page
// @author       Saymai Adkins
// @match        *://mtdemo1-orgc.cnx.cwp.pnp-hcl.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
if(typeof(dojo) != "undefined") {
	require(["dojo/dom-construct", "dojo/dom", "dojo/query", "dojo/mouse", "dojo/string", "dojo.NodeList-traverse"], function(domConstruct, dom, query, mouse, string){
        try {
            //
            // utility function to let us wait for a specific element of the page to load...
            var waitFor = function(callback, elXpath, elXpathRoot, maxInter, waitTime) {
                if(!elXpath) return;
                var root = elXpathRoot ? elxpathRoot : dojo.body();
                var maxInterval = maxInter ? maxInter : 10000;  // number of intervals before expiring
                var interval = waitTime ? waitTime : 1;  // 1000=1 second
                var waitInter = 0;  // current interval
                var intId = setInterval( function(){
                    if( ++waitInter<maxInterval && !query(elXpath,root).length) return;

                    clearInterval(intId);
                    if( waitInter >= maxInterval) {
                        console.log("**** WAITFOR ["+elXpath+"] WATCH EXPIRED!!! interval "+waitInter+" (max:"+maxInter+")");
                    } else {
                        console.log("**** WAITFOR ["+elXpath+"] WATCH TRIPPED AT interval "+waitInter+" (max:"+maxInter+")");
                        callback();
                    }
                }, interval);
            };
             // 1) Create submenu under the 'More Actions' on the user business card
            // ulActionsMenu - ul element for actions menu
            // menuId - create a unique submenu id
            // menuTitle - create the submenu title
            // menuLink - create the submenu link, to launch in a separate browser if user clicks on this submenu
            var createSubmenu = function(ulActionsMenu, menuId, menuTitle, menuLink) {
                // create submenu if it doesn't exist by menuId
                if (ulActionsMenu && !query("#" + menuId)[0]) {
                    var templateTD = '<a class="email" href="${menuLink}"><font style="vertical-align: inherit;">${menuTitle}</font></a>';
                    var html = string.substitute(templateTD, { menuTitle, menuLink }, string.escape);
                    return domConstruct.create(
                        "li",
                        {
                            id: menuId,
                            innerHTML: html,
                            class: "lotusMenuSeparator",
                        },
                        ulActionsMenu
                    );
                };
            };
            // 2) Modify submenu
            // ulActionsMenu - ul element for actions menu
            // querySubMenu - submenu text to query and modify
            // newTitle - next submenu text
            // newLink - new submenu link
            // newClass - optional to add your own css class
            var modifyMenu = function(ulActionsMenu, querySubMenu, newText, newLink, newClass) {
              // check if more actions menu is present
              if (ulActionsMenu) {
                  // search for the submenu
                  var submenu = query(`a > font:contains("${querySubMenu}")`, ulActionsMenu)[0];
                  if (submenu) {
                      // if text is provided change the text
                      if (newText) submenu.textContent = newText;
                      // if link is provided change the link
                      if (newLink) dojo.attr(submenu.parentNode, 'href', newLink);
                      // if class is provided add class
                      if (newClass) submenu.parentNode.addClass(newClass);
                  }
              } else {
                  throw new Error("Cannot find More Actions menu to modify submenu: " + querySubMenu);
              }
            };
            // 3) Delete submenu
            // ulActionsMenu - ul element for actions menu
            // querySubMenu - submenu text to query and modify
            var deleteMenu = function(ulActionsMenu, querySubMenu) {
                if (ulActionsMenu) {
                    // search for the submenu
                    var submenu = query(`a > font:contains("${querySubMenu}")`, ulActionsMenu)[0] || query(`a:contains("${querySubMenu}")`, ulActionsMenu)[0];
                    if (submenu) {
                        // delete the li element, li > a > font
                        domConstruct.destroy(submenu.parentNode.parentNode);
                    }
                } else {
                    throw new Error("Cannot find More Actions menu to delete submenu: " + querySubMenu);
                }
            };
            var customizeMenu = function() {
                // get user profile info,
                // examples of the type profile info that you can use with your customized menus
                var vCardProfileName = SemTagSvc._tagTypes[1].tagHandler.currentPerson.fn;
                var vCardProfileId = SemTagSvc._tagTypes[1].tagHandler.currentPerson.uid;
                var vCardProfileEmail = SemTagSvc._tagTypes[1].tagHandler.currentPerson.email.internet;
                var subMenuId = "btn_act__moreaction_submenu1";
                var subMenuText = "New sub menu";
                var subMenuLink = "http://www.example.com";
                var subMenuId2 = "btn_act__moreaction_submenu2";
                // create a customized menu using the user profile name and id
                var firstName = vCardProfileName.split(' ')[0];
                var subMenuText2 = `Chat with ${firstName}`;
                // var subMenuLink2 = `/files/app/person/${vCardProfileId}`;
                var subMenuLink2 = `xmpp://${vCardProfileEmail}`;
                // wait for the dropdown menu to show
                waitFor( function() {
                    var ulElement = query('ul.lotusActionMenu.lotusPlain')[0];
                    //
                    // 1a) create one submenu
                    createSubmenu(ulElement, subMenuId, subMenuText, subMenuLink);
                    // 1b) create another submenu
                    createSubmenu(ulElement, subMenuId2, subMenuText2, subMenuLink2);
                    //
                    // 2) Modify the the first submenu we just added.  Changed menu text to 'Customize Me' and link to google.com.
                    var modifySubMenuText = "Google Me";
                    var modifySubMenuLink = "http://www.google.com/search?q='"+vCardProfileName+"'";
                    modifyMenu(ulElement, subMenuText, modifySubMenuText, modifySubMenuLink);
                    //
                    // 3) Delete the Download vCard submenu
                    var deleteSubmenuText = "Download vCard";
                    deleteMenu(ulElement, deleteSubmenuText);
                }, 'li.lotusMenuSeparator');
            };
            // add event listeners when the user clicks on the 'More Actions'
            document.addEventListener('click', function(event) {
                var target = event.target || event.srcElement;
                // check if user clicked on the text "More Actions"
                // if so, change the target the closest anchor parent
                if (target instanceof HTMLFontElement && target.innerText === "More Actions") {
                    target = query(target).closest("a")[0];
                };
                // if user clicked on the arrow button, change the target to the closes anchor parent
                if (target instanceof HTMLImageElement && target.className && target.className.includes("otherFramework16-TriangleMediumGrayDown12")) {
                    target = query(target).closest("a")[0];
                }
                // get the onclick function
                var onclickFct = target.getAttribute("onclick");
                // if this target is an anchor target, and includes the bizcard function for onClick, proceed to customize the menu
                if (target instanceof HTMLAnchorElement && onclickFct && onclickFct.includes('lconn.profiles.bizCard.bizCardUI.displayMore')) {
                    customizeMenu();
                };
            }, true);
        } catch (e) {
            console.log("error " + e);
            alert("Exception in adding button: " + e);
        }
   });
}
})();