// ==UserScript==
// @copyright    Copyright HCL Technologies Limited 2020
// @name         file_menu extension
// @namespace    http://hcl.com
// @version      0.1
// @description  Prototype code, sample on how to customize the More Actions dropdown in files list/preview with file menu extensions.
// @author       Jonathan Marks
// @include      *://*hcl.com/files/*
// @exclude
// @run-at       document-end 
// ==/UserScript==


// ***  Enter Extension information here  *** //
var extension_1 = {
    APP_NAME: "<File Action Label 1>", // Add an extension menu label: "My File Extension"
    APP_ID: "my_file_extension_1", // Add an unique App Id using a format similar to this: "my_file_extension" 
    EXT_URL: "https://<URL Link 1>/${file_id}", // Add the file url and any context data parameters (e.g. file_id, ord_id, user_id, subscriber_id)
    MIME_TYPE: ["pdf", "docx"] // Add the specific MIME Types for the file extension in an array format for example: ["pdf", "docx", "xls"], leave it empty [] for all file extensions
};
var extension_2 = {
    APP_NAME: "<File Action Label 2>",
    APP_ID: "my_file_extension_2",
    EXT_URL: "https://<URL Link 2>/${file_id}?org=${org_id}&subscriber=${subscriber_id}&email=${user_id}",
    MIME_TYPE: []
};
var extensions = [extension_1, extension_2];
// ******************************************** // 


if(typeof(dojo) != "undefined") {
    require(["dojo/on", "dojo/mouse", "dijit/focus", "dojo/keys", "dojo/domReady!"],
        function(on, mouse, keys) {
            console.log('File extension script loaded.');

            var getFileInfo = function(fileEntry) {
                var fileInfo = {};
                var fileHref = fileEntry.attr("href")[0];
                var fileNameParts = fileEntry.attr("title")[0].split('.');
                fileInfo.fileId = fileHref.substring(fileHref.lastIndexOf('/') + 1);
                fileInfo.fileExt = fileNameParts[fileNameParts.length - 1];
                return fileInfo;
            };

            var getFilePreviewInfo = function(fileEntryTarget) {
                var fileInfo = {};
                if(fileEntryTarget.title) {
                    var fileNameParts = fileEntryTarget.title.split('.');
                    fileInfo.fileId = fileEntryTarget.href.substring(fileEntryTarget.href.lastIndexOf('/') + 1);
                    fileInfo.fileExt = fileNameParts[fileNameParts.length - 1];
                    return fileInfo;
                }
                return fileInfo;
            };

            var validFileExtension = function(fileExtension, mimeTypes) {
                if (Array.isArray(mimeTypes) && mimeTypes.includes(fileExtension)){
                    return true;
                }
                else if (!mimeTypes.length) {
                    return true;
                }
                return false;
            };

            var substituteURLParams = function(fileInfo, userInfo, url) {
                var actualUrl = url.replace("${file_id}", encodeURIComponent(fileInfo.fileId));
                var userId = encodeURIComponent(userInfo.id);
                var emailId = encodeURIComponent(userInfo.email);
                var orgId = encodeURIComponent(userInfo.orgId);
                actualUrl = dojo.string.substitute(actualUrl, {
                   "user_id": emailId,
                   "subscriber_id": userId, 
                   "org_id": orgId
                });
                return actualUrl;
            };

            var waitFor = function(callback, elXpath, elXpathRoot, maxInter, waitTime) {
                if(!elXpath) return;
                var root = elXpathRoot ? elxpathRoot : dojo.body();
                var maxInterval = maxInter ? maxInter : 10000;  // number of intervals before expiring
                var interval = waitTime ? waitTime : 1;  // 1000=1 second
                var waitInter = 0;  // current interval
                var intId = setInterval( function(){
                    if( ++waitInter<maxInterval && !dojo.query(elXpath,root).length) return;

                    clearInterval(intId);
                    if( waitInter >= maxInterval) {
                        console.log("**** WAITFOR ["+elXpath+"] WATCH EXPIRED!!! interval "+waitInter+" (max:"+maxInter+")");
                    } else {
                        console.log("**** WAITFOR ["+elXpath+"] WATCH TRIPPED AT interval "+waitInter+" (max:"+maxInter+")");
                        callback();
                    }
                }, interval);
            };

            var userInfo = JSON.parse(dojo.byId("userInfo").innerText);
            var uniqueExtCounter = 0;
            var filePreviewInfo;

            document.addEventListener('click',function(evt){

                // New extension under More Actions dropdown
                if (evt.target.id.includes("lconn_files_action_more_")) {
                    var fileEntry = dojo.query("#"+evt.target.id).closest('tr').prev().children('td:nth-child(3)').children('h4').children('a.entry-title');
                    var fileInfo = getFileInfo(fileEntry);

                    extensions.forEach(function(extension) {
                        var APP_CLASS_SELECTOR = extension.APP_ID+"_"+uniqueExtCounter++;
                        // Get the last action element in the More Actions list
                        if (fileInfo.fileExt && validFileExtension(fileInfo.fileExt, extension.MIME_TYPE)) {
                            var finalUrl = substituteURLParams(fileInfo, userInfo, extension.EXT_URL);

                            // Function to wait for dropdown menu to appear
                            waitFor( function() {
                                var actionListTableBody = dojo.query("#" + evt.target.id + "_dropdown > table > tbody:last-child")[0];
                                var actionListItems = dojo.query("#" + evt.target.id + "_dropdown > table > tbody > tr");

                                // Check if our new extension is already in the action items list under More Actions, if it doesn't exist by "id" then add the new extension link
                                if (!actionListItems.attr("class").some(item => item.includes(extension.APP_ID))) {
                                    var newExtensionItem = dojo.toDom(
                                    "<tr class=\"dijitReset dijitMenuItem customExtEndpoint "+extension.APP_ID+"\" data-dojo-attach-point=\"focusNode\" role=\"menuitem\" tabindex=\"0\" aria-label=\""+extension.APP_NAME+"\" id=\""+APP_CLASS_SELECTOR+"\" widgetid=\""+extension.APP_ID+"\" style=\"user-select: none;\">"+
                                        "<td class=\"dijitReset dijitMenuItemIconCell customExtEndpoint\" role=\"presentation\">"+
                                            "<span role=\"presentation\" class=\"dijitInline dijitIcon dijitMenuItemIcon dijitNoIcon\" data-dojo-attach-point=\"iconNode\"></span>"+
                                        "</td>"+
                                        "<td class=\"dijitReset dijitMenuItemLabel customExtEndpoint "+extension.APP_ID+"\" colspan=\"2\" data-dojo-attach-point=\"containerNode,textDirNode\" role=\"presentation\" id=\""+APP_CLASS_SELECTOR+"_text\">"+extension.APP_NAME+"</td>"+
                                        "<td class=\"dijitReset dijitMenuItemAccelKey customExtEndpoint\" style=\"display: none\" data-dojo-attach-point=\"accelKeyNode\" id=\""+APP_CLASS_SELECTOR+"_accel\"></td>"+
                                        "<td class=\"dijitReset dijitMenuArrowCell customExtEndpoint\" role=\"presentation\"><span data-dojo-attach-point=\"arrowWrapper\" style=\"visibility: hidden\">"+
                                            "<span class=\"dijitInline dijitIcon dijitMenuExpand\"></span>"+
                                            "<span class=\"dijitMenuExpandA11y\">+</span></span>"+
                                        "</td>"+
                                    "</tr>");
                                    // Place the new extension at the end of the existing More Actions list
                                    dojo.place(
                                        newExtensionItem,
                                        actionListTableBody,
                                        "last"
                                    );
                                    console.log('File list menu extension placed.');
            
                                    // Add hover and select class names to the new extension elements
                                    var tableRows = dojo.query("#"+evt.target.id + "_dropdown > table > tbody > tr");
                                    on(tableRows, mouse.enter, function(evt){
                                        var currentRow = dojo.query("#"+evt.target.id).parent();
                                        var previousRow = dojo.query("#"+evt.target.id).parent().prev();
                                        var nextRow = dojo.query("#"+evt.target.id).parent().next();
                                        if(previousRow.length) {
                                            dojo.removeClass(previousRow[0], "dijitHover dijitMenuItemHover dijitMenuItemSelected");
                                        }
                                        if(nextRow.length) {
                                            dojo.removeClass(nextRow[0], "dijitHover dijitMenuItemHover dijitMenuItemSelected");
                                        }
                                        dojo.addClass(currentRow[0], "dijitHover dijitMenuItemHover dijitMenuItemSelected");
                                        dojo.style(dojo.query("#"+evt.target.id)[0], "border-left", "none"); 
                                    });

                                    // Remove hover effects when when element not hovered
                                    on(tableRows, mouse.leave, function(evt){
                                        var currentRow = dojo.query("#"+evt.target.id);
                                        dojo.removeClass(currentRow.parent()[0], "dijitHover dijitMenuItemHover dijitMenuItemSelected");
                                        dojo.style(currentRow.prev()[0], "border-left", "5px solid white"); 
                                    });
            
                                    // Event listener for launching file extension URL
                                    document.querySelectorAll('.customExtEndpoint').forEach(item => {
                                        item.addEventListener('click', event => {
                                            window.open(finalUrl);
                                        })
                                    });
                                }
                            }, "#" + evt.target.id + "_dropdown");
                        }
                    });
                }

                // Check is file link clicked is a file link
                if(evt.target.href && evt.target.href.includes('/app/file/')){
                    filePreviewInfo = getFilePreviewInfo(evt.target);
                }
                var widgetId = '';
                // Grab widgetid for dropdown button that corresponds to dropdown menu
                if(evt.target.parentNode){
                    if (evt.target.parentNode.getAttribute('widgetId') !== null) {
                        widgetId = evt.target.parentNode.getAttribute('widgetId');
                    }
                }
                // New extension under More Actions dropdown in file preview
                if ((evt.target.parentNode && widgetId !== null) && widgetId.includes('dijit_form_DropDownButton')) {

                    extensions.forEach(function(extension) {
                        var APP_CLASS_SELECTOR = extension.APP_ID+"_"+uniqueExtCounter++;
                        // Get the last action element in the More Actions list
                        if (filePreviewInfo.fileExt && validFileExtension(filePreviewInfo.fileExt, extension.MIME_TYPE)) {
                            var finalUrl = substituteURLParams(filePreviewInfo, userInfo, extension.EXT_URL);

                            var actionListTableBody = dojo.query("div[dijitpopupparent="+widgetId+"] > table > tbody:last-child")[0];
                            var actionListItems = dojo.query("div[dijitpopupparent="+widgetId+"] > table > tbody > tr");

                            // Check if our new extension is already in the action items list under More Actions, if it doesn't exist by "id" then add the new extension link
                            if (!actionListItems.attr("class").some(item => item.includes(extension.APP_ID))) {
                                var newExtensionItem = dojo.toDom(
                                "<tr class=\"dijitReset dijitMenuItem customExtEndpoint "+extension.APP_ID+"\" data-dojo-attach-point=\"focusNode\" role=\"menuitem\" tabindex=\"0\" aria-label=\""+extension.APP_NAME+"\" id=\""+APP_CLASS_SELECTOR+"\" widgetid=\""+extension.APP_ID+"\" style=\"user-select: none;\">"+
                                    "<td class=\"dijitReset dijitMenuItemIconCell customExtEndpoint\" role=\"presentation\">"+
                                        "<span role=\"presentation\" class=\"dijitInline dijitIcon dijitMenuItemIcon dijitNoIcon\" data-dojo-attach-point=\"iconNode\"></span>"+
                                    "</td>"+
                                    "<td class=\"dijitReset dijitMenuItemLabel customExtEndpoint "+extension.APP_ID+"\" colspan=\"2\" data-dojo-attach-point=\"containerNode,textDirNode\" role=\"presentation\" id=\""+APP_CLASS_SELECTOR+"_text\">"+extension.APP_NAME+"</td>"+
                                    "<td class=\"dijitReset dijitMenuItemAccelKey customExtEndpoint\" style=\"display: none\" data-dojo-attach-point=\"accelKeyNode\" id=\""+APP_CLASS_SELECTOR+"_accel\"></td>"+
                                    "<td class=\"dijitReset dijitMenuArrowCell customExtEndpoint\" role=\"presentation\"><span data-dojo-attach-point=\"arrowWrapper\" style=\"visibility: hidden\">"+
                                        "<span class=\"dijitInline dijitIcon dijitMenuExpand\"></span>"+
                                        "<span class=\"dijitMenuExpandA11y\">+</span></span>"+
                                    "</td>"+
                                "</tr>");
                                // Place the new extension at the end of the existing More Actions list
                                dojo.place(
                                    newExtensionItem,
                                    actionListTableBody,
                                    "last"
                                );
                                console.log('File preview menu extension placed.');
        
                                // Add hover and select class names to the new extension elements
                                var tableRows = dojo.query("div[dijitpopupparent="+widgetId+"] > table > tbody > tr");
                                on(tableRows, mouse.enter, function(evt){
                                        var currentRow = dojo.query("#"+evt.target.id).parent();
                                        var previousRow = dojo.query("#"+evt.target.id).parent().prev();
                                        var nextRow = dojo.query("#"+evt.target.id).parent().next();
                                        if(previousRow.length) {
                                        dojo.removeClass(previousRow[0], "dijitHover dijitMenuItemHover dijitMenuItemSelected");
                                        }
                                        if(nextRow.length) {
                                        dojo.removeClass(nextRow[0], "dijitHover dijitMenuItemHover dijitMenuItemSelected");
                                        }
                                    dojo.addClass(currentRow[0], "dijitHover dijitMenuItemHover dijitMenuItemSelected");
                                    dojo.style(dojo.query("#"+evt.target.id)[0], "border-left", "none"); 
                                });

                                // Remove hover effects when when element not hovered
                                on(tableRows, mouse.leave, function(evt){
                                        var currentRow = dojo.query("#"+evt.target.id);
                                        dojo.removeClass(currentRow.parent()[0], "dijitHover dijitMenuItemHover dijitMenuItemSelected");
                                        dojo.style(currentRow.prev()[0], "border-left", "5px solid white"); 
                                });
        
                                // Event listener for launching file extension URL
                                document.querySelectorAll('.customExtEndpoint').forEach(item => {
                                    item.addEventListener('click', event => {
                                        window.open(finalUrl);
                                    })
                                });
                            }
                        }
                    });
                }
            }, true);
    });
}