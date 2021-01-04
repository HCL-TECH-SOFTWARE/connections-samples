/*
	 * © Copyright IBM Corp. 2017
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
var x = true;
chrome.tabs.executeScript(null, {file: "./extension/jquery.min.js"});

function disableBrowserAction(){
    chrome.browserAction.setIcon({path:"./extension/inactive.png"});
    chrome.tabs.executeScript(null, {file: "extension/off.js"})
}

function enableBrowserAction(){
    chrome.browserAction.setIcon({path:"./extension/active.png"});
    chrome.tabs.executeScript(null, {file: "periscope.js"});
}

function updateState(){
    if(!x){
        enableBrowserAction();
    }else{
        disableBrowserAction();
    }
    x=!x;
}
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete' && x) {
    enableBrowserAction();
  }
})
chrome.browserAction.onClicked.addListener(updateState);
