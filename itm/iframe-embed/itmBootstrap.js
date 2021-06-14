/* ***************************************************************** */
/*                                                                   */
/* IBM Confidential                                                  */
/*                                                                   */
/* OCO Source Materials                                              */
/*                                                                   */
/* Copyright IBM Corp. 2017, 2018                                    */
/*                                                                   */
/* The source code for this program is not published or otherwise    */
/* divested of its trade secrets, irrespective of what has been      */
/* deposited with the U.S. Copyright Office.                         */
/*                                                                   */
/* ***************************************************************** */

if (typeof lconn == "undefined") {
   lconn = {};
}

lconn.itm = lconn.itm || {};
lconn.itm.client = lconn.itm.client || {};
lconn.itm.client.itmFactory = lconn.itm.client.itmFactory || {};

(function(itmFactory) {

  var basePath = "/social/apps/itm";
  var containerDomain = document.location.origin;
  var scriptUrl = getCurrentScriptUrl();
  var defaultframeDomain = null;
  var queryObject = null;
  if (scriptUrl) {
    defaultframeDomain = getDomainFromUrl(scriptUrl);
  }

  function getCurrentScriptUrl() {
    var allScripts = document.getElementsByTagName('script');
    var thisScript = allScripts[allScripts.length - 1];
    var url = thisScript.src;
    if (url.search(/\/itmBootstrap.js/i) >= 0) {
       return url;
    }
    return null;
  }

  function getDomainFromUrl(url) {
    var expression = /^(https?\:\/\/[^\/?#]+)/i;
    var match = url.match(expression);
    return match && match[1];
  }

  itmFactory.create = function(config, onloaded, node) {
    var listener = null;
    var dataStore = {};
    config = config || {};
    var eventHandlerStore = {};
    var frameDomain = null;

    if (typeof node === 'string'){
      node = document.getElementById(node);
    }

    if (!node) {
      throw "no container node found for ITM bar";
    }

    var urlParameters = window.location.search;
    config.appRegistry = urlParameters.indexOf('appRegistry') !== -1;
    if (config.itmDomain && config.itmDomain.trim()!=='') {
      frameDomain = config.itmDomain.trim();
    } else if(defaultframeDomain){
      frameDomain = defaultframeDomain;
    } else {
      frameDomain = containerDomain;
    }
    if (document.body == null) 
      return null;

    var configStr = JSON.stringify(config);
    var encodeConfigStr = encodeURI(configStr);
    var frameName = String(Date.now());
    var itmFrame = document.createElement('iframe');
    itmFrame.name = frameName;
    itmFrame.id = frameName;
    itmFrame.src = frameDomain + basePath +'?config='+encodeConfigStr +'&containerOrigin='+containerDomain;
    itmFrame.scrolling = 'no';
    itmFrame.width = '100%';
    itmFrame.height= '86px';
    itmFrame.setAttribute('frameborder', '0');
    var innerContainer = document.createElement('div');
    innerContainer.setAttribute('style','width:100%; height:86px;');
    node.appendChild(innerContainer);
    innerContainer.appendChild(itmFrame);

    listener = function(e){
      if (e.origin == frameDomain) {
        try {
          var data = JSON.parse(e.data);
          if (frameName !== data.frameName) {
            return;
          }
          var command = data.command;
          if (command === "lconn.itm.client.event.Initialized") {
            onloaded(getItmProxy());
          } else if (command === "lconn.itm.client.event.action") {
            processEventHandlers(data.args, data.type);
          } else if (command === "lconn.itm.client.event.datasync") {
            dataSync(data.args, data.type);
          } else if (command === "lconn.itm.client.event.maximum") {
            maximumMode(data.args);
          }
        }catch(err){
          throw err;
        }
      }
    };

    if (window.addEventListener){
       window.addEventListener("message", listener, false);
       window.addEventListener("scroll", onScroll, false);
       window.addEventListener("resize", onResize, false);
    } else {
       window.attachEvent("onmessage", listener);
       window.attachEvent("scroll", onScroll);
       window.attachEvent("resize", onResize);
    }

    function onScroll(e){
      if (isOverflow) {
        itmFrame.style.top = innerContainer.getBoundingClientRect().top +"px";
        itmFrame.style.left = innerContainer.getBoundingClientRect().left +"px";
      }
    }

    function onResize(e){
      if (isOverflow)
        itmFrame.style.width = innerContainer.getBoundingClientRect().width +"px";
    }

    function getItmProxy(){
      return {
        callMethod:callMethod,
        addEventListener:addEventListener,
        removeEventListener:removeEventListener,
        fetchEntries:fetchEntries
      }
    }

    function callMethod(methodName) {
      if (!methodName || typeof methodName !=='string') return;
      var args=[];
      for (var i=1; i<arguments.length; i++){
        args.push(arguments[i]);
      }
      sendMessage('lconn.itm.client.event.function.call', methodName, args);
    };

    function addEventListener(eventName, handler){
      if (eventHandlerStore[eventName]) {
        if (eventHandlerStore[eventName].indexOf(handler)===-1){
          eventHandlerStore[eventName].push(handler);
        }
      }else{
        eventHandlerStore[eventName] = [handler];
      }
    }

    function removeEventListener(eventName, handler){
      var handlers = eventHandlerStore[eventName];
      if (!handlers) return;
      handlers = handlers.filter(function(theHandler) {
        return theHandler===handler?false:true;
      });
      eventHandlerStore[eventName] = handlers;
    }

    function fetchEntries(entryType){
      return dataStore[entryType];
    }

    function processEventHandlers(args,type){
      var handlers = eventHandlerStore[type];
      if (handlers) {
        handlers.forEach(function(handler) {
          handler(args[0],args[1]);
        })
      }
    }

    function dataSync(data, type){
      if (!type) return;
      if (type == "favoritesRefresh") {
        dataStore.favorites = data;
      } else if (type == "suggestionsRefresh") {
        dataStore.suggestions = data;
      } else if (type == "customEntriesRefresh") {
        dataStore.customEntries = data;
      }
    }

    function sendMessage(command, funcName, args) {
      var iframeMessage = new Object();
      iframeMessage.command = command;
      iframeMessage.funcName = funcName;
      iframeMessage.args = args;
      var stringRepresentation = JSON.stringify(iframeMessage);
      itmFrame.contentWindow.postMessage(stringRepresentation, frameDomain);
    }
    var isOverflow = false;

    function maximumMode(max){
      if (max){
        isOverflow = true;
        const clientRect = innerContainer.getBoundingClientRect();
        itmFrame.setAttribute('style',"position:fixed; top:" +
            clientRect.top + "px; left:" +
            clientRect.left + "px; width:" +
            clientRect.width +"px; height:100%; z-index:1000");
      } else {
        isOverflow = false;
        itmFrame.removeAttribute("style");
      }
    }
  }
})(lconn.itm.client.itmFactory);
