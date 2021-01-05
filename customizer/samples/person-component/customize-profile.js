// ==UserScript==
// @copyright    Copyright HCL Technologies Limited 2020
// @name         Customize My Profiles Page
// @namespace    http://hcl.com
// @version      0.1
// @description  Prototype code, sample on how to customize the my profiles buttons
// @author       Saymai Adkins
// @include      *://connmt-orga.cnx.cwp.pnp-hcl.com/profiles/html/myProfileView.do*
// @exclude
// @run-at       document-end 
// ==/UserScript==

(function () {
    'use strict';
    if (typeof (dojo) != "undefined") {
        require(["dojo/dom-construct", "dojo/dom", "dojo/query", "dojo.NodeList-traverse"], function (domConstruct, dom, query) {
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

                // 1) Create
                // here we use waitFor to wait on the .lotusStreamTopLoading div.loaderMain.lotusHidden element
                // before we proceed to customize the my profile page...
                waitFor(function () {
                        // create a button with a link
                        console.log('Create new profile button with a link');
                        var node = dom.byId("lconn_profiles_actionBar_ActionBar_0");
                        var buttonPosition = query(".lotusBtn", node)[0].parentNode;
                        var buttonLink = `https://<URL Link>`;  // e.g. 'https:///custom.app.com/uri'
                        domConstruct.create(
                                "button",
                                {
                                    class: "lotusBtn newBtn",
                                    title: "Add button",
                                    id: "btn_actn__add_button",
                                    innerHTML: "<span>Added Button</span>",
                                    onclick: "window.location.href = '" + buttonLink + "';"
                                },
                                buttonPosition
                        );
                    },
                    ".lotusStreamTopLoading div.loaderMain.lotusHidden");
                // 2) Modify
                // wait for the new button to appear
                waitFor(function () {
                        console.log('Modify new button text');
                        // modify the text of the button we just created
                        // replace <Button Label> with the text to show on the button
                        dojo.query("button.lotusBtn.newBtn").children()[0].textContent = "<Button Label>";
                        // modify the class for the next action
                        dojo.query("button.lotusBtn.newBtn").replaceClass("lotusBtn modifyBtn");
                    },
                    "button.lotusBtn.newBtn");
                // 3) Delete 
                // wait for the new button text to be modified
                waitFor(function () {
                        // uncomment below to delete a button
                        // console.log('Delete profile button');
                        // domConstruct.destroy("<id of button to remove>"); // e.g. btn_actn__add_button
                    },
                    "button.lotusBtn.modifyBtn");
            } catch (e) {
                console.log("error " + e);
                alert("Exception in adding button: " + e);
            }
        });
    }
})();