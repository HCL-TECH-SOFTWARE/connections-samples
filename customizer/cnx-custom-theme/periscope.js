/*
	 * © Copyright HCL Technologies Limited 2017, 2019
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
//

var repoNameValue = getParams('periscope.js');
//console.log('Repository name is ' + repoNameValue);

function periscope(){
  //Instead of adding in code, all we need to change is the mapping object
  //which tells the function which stylesheet should be applied onto which
  //page.
  var mappings = {
    //global is special case where the empty array applies to all the pages.
    "global":[],
    "files":["/files/"],
    "meetings":["/meetings/"],
    "profiles":["/profiles/",
                "/mycontacts/",
                "/contacts/"],
    "search":["/search/"],
    "communities":["/communities/"],
    "blogs":["/blogs/"],
    "dogear":["/dogear/",
              "/connections/bookmarklet"],
    "activities":["/activities/"],
    "home":["/social/",
            "/homepage/"],
    "forums":["/forums/"],
    "metrics":["/metricssc/",
               "/metrics"],
    "wikis":["/wikis/"],
    "surveys":["/surveys/"],
    "settings":["/manage/account/user/",
                "/manage/account/announcement/",
                "/news/",
                "/manage/subscribers/showInviteGuestDialog/input",
                "/downloads/"],
    "opensocial":["/opensocial/",
                  "/connections/opensocial"]
  };

  //This is the function that applies the style
  var addStyle;
  //We need to determine "how" we will be applying the style.
  if (typeof GM_addStyle == 'undefined' &&
      typeof GM_getResourceText == 'undefined'){
    if(typeof chrome != 'undefined' && chrome.extension){
    //We are in the Chrome Extension so lets use their API.
      console.log('Periscope: Using Chrome extension method.');
      addStyle = function(filename){
        var link = document.createElement("link");
        link.href = chrome.extension.getURL('./css/' + filename + '.css');
        link.id = "periscope-"+filename;
        link.type = "text/css";
        link.rel = "stylesheet";
        document.head.appendChild(link);
        return;
      }
    }
    else{
      // We are using Customizer so lets find the relative path to our files.
      console.log('Periscope: Using Customizer method.');
      addStyle = function(filename){
        var link = document.createElement("link");
        path = "/files/customizer/css/";
        link.href = path+filename+".css?repoName=" + repoNameValue;
        link.type = "text/css";
        link.rel = "stylesheet";
        document.head.appendChild(link);
        return;
      }
    }
  }
  else{
    //We are in Tampermonkey so lets use Tampermonkey API.
    addStyle = function(filename){
      console.log('Periscope: Using Tampermonkey method.');
      console.log(filename);
      GM_addStyle(GM_getResourceText(filename));
      return;
    }
  }
  console.log("Periscope: Launching Visual Styling...");
  Object.keys(mappings).map(function(filename){
    // make sure it's not an error page or a log-in page:
    if ( (!document.URL.includes("error")) && (document.querySelector('#joinBox') == null)) {
      //checking for the empty url matches
      urls = mappings[filename];
      if (!urls.length){
        addStyle(filename);
      }
      //applying the styling to all urls
      else{
        urls.map(function(url){
          if(document.URL.includes(url)){
            console.log(document.URL);
            addStyle(filename);
          }
        });
      }
    }
  });
}
if (!String.prototype.includes) {
  String.prototype.includes = function() {
    'use strict';
    return String.prototype.indexOf.apply(this, arguments) !== -1;
  };
}
console.log('Periscope: periscope.js loaded.');
periscope();

//Get GitHub repoName from script tag url
// Extract "GET" parameters from a JS include querystring
function getParams(script_name) {
  //console.log('getParams function running - find script tags');
  // Find all script tags
  var scripts = document.getElementsByTagName("script");
  // Look through script tags trying to find script_name
  for(var i=0; i<scripts.length; i++) {
    if(scripts[i].src.indexOf("/" + script_name) > -1) {
      // Identifies first instance of script_name
      // Get an array of key=value strings of params
      var pa = scripts[i].src.split("?").pop().split("&");
      // Split each key=value into array, the construct js object
      var p = {};
      for(var j=0; j<pa.length; j++) {
        var kv = pa[j].split("=");
        p[kv[0]] = kv[1];
      }
      return p.repoName;
    }
  }
  // No scripts match
  return {};
}
