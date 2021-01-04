// ==UserScript==
// @copyright    Copyright IBM Corp. 2018
//
// @name         helloREST
// @version      0.1
// @description  *** PROTOTYPE CODE *** demonstrates simple hello world script to customize the Home Page
//
// @namespace  http://ibm.com
//
// @author       Hello World (aka You!)
//
// @include      *://apps.collabservintegration.com/homepage/*
//
// @exclude
//
// @run-at       document-end
//
// ==/UserScript==

if(typeof(dojo) != "undefined") {
	require(["dojo/domReady!"], function(){
        try {
            // utility function to let us wait for a specific element of the page to load...
            var waitFor = function(callback, elXpath, elXpathRoot, maxInter, waitTime) {
                if(!elXpathRoot) var elXpathRoot = dojo.body();
                if(!maxInter) var maxInter = 10000;  // number of intervals before expiring
                if(!waitTime) var waitTime = 1;  // 1000=1 second
                if(!elXpath) return;
                var waitInter = 0;  // current interval
                var intId = setInterval( function(){
                    if( ++waitInter<maxInter && !dojo.query(elXpath,elXpathRoot).length) return;

                    clearInterval(intId);
                    if( waitInter >= maxInter) { 
                        console.log("**** WAITFOR ["+elXpath+"] WATCH EXPIRED!!! interval "+waitInter+" (max:"+maxInter+")");
                    } else {
                        console.log("**** WAITFOR ["+elXpath+"] WATCH TRIPPED AT interval "+waitInter+" (max:"+maxInter+")");
                        callback();
                    }
                }, waitTime);
            };

            // here we use waitFor to wait on the .lotusStreamTopLoading div.loaderMain.lotusHidden element
            // before we proceed to customize the page...
            waitFor( function(){
                var xhrargs = {
                  url: "/connections/opensocial/rest/people/@me/@self",
                  handleAs: "json"
                };
                var deferred = dojo.xhrGet(xhrargs);
                deferred.then(
                  function(results) {
                    console.log('JSON response = ' + JSON.stringify(results, null, 4));
                    dojo.query("span.shareSome-title")[0].textContent="Hello " + results.entry.displayName + " !";
                  }
                );
       	    },
		  ".lotusStreamTopLoading div.loaderMain.lotusHidden");
      } catch(e) {
          alert("Exception occurred in helloWorld: " + e);
      }
   });
}
