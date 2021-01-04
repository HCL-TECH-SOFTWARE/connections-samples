/// ==UserScript==
// @copyright    Copyright IBM Corp. 2016, 2018
// @name         commListCardsFlipStyle
// @version      1.0
// @description  *** PROTOTYPE CODE *** displays community list as cards with flip action for additional info
// @namespace  http://ibm.com
// @author       Tony Estrada, Brian Gleeson
//
// @include      *://apps.*collabserv*.com/communities/service/html/*communities
//
// @run-at       document-end
// ==/UserScript==

if (typeof(dojo) != "undefined") {
  require(["dojo", "dojo/domReady!"], function(dojo) {
    var waitFor = function(callback, elXpath, maxInter, waitTime) {
      if(!maxInter) maxInter = 20; // number of intervals before expiring
      if(!waitTime) waitTime = 100; // 1000=1 second
      if(!elXpath) return;
      var waitInter = 0; // current interval
      var intId = setInterval(function() {
        if (++waitInter < maxInter && !dojo.query(elXpath).length) return;
        clearInterval(intId);
        callback();
      }, waitTime);
    };

    // No var so that it is created as global
    showTable = function() {
      dojo.cookie("commTiles", "0", { expires: -1 });
      dojo.replaceClass("viewControlTable", "lotusDetailsOn", "lotusDetailsOff");
      dojo.replaceClass("viewControlTiles", "lotusTileOff", "lotusTileOn");
      dojo.addClass("commTiles", "lotusHidden");
      dojo.removeClass(dojo.query("#lconn_communities_catalog_widgets_ResultsDisplayWidget_0 table")[0], "lotusHidden");
    };

    // No var so that it is created as global 
    showTiles = function() {
      dojo.cookie("commTiles", "1", { expires: 1000 });
      dojo.replaceClass("viewControlTiles", "lotusTileOn", "lotusTileOff");
      dojo.replaceClass("viewControlTable", "lotusDetailsOff", "lotusDetailsOn");
      createCommTiles();
      dojo.addClass(dojo.query("#lconn_communities_catalog_widgets_ResultsDisplayWidget_0 table")[0], "lotusHidden");
      dojo.removeClass("commTiles", "lotusHidden");
    };

    // No var so that it is created as global
    createCommTiles = function() {
      var commTiles = dojo.byId("commTiles");
      if (commTiles) {
        dojo.destroy(commTiles); // destroy current tiles
      }

      // create tiles
      var tiles = "";
      dojo.query("#lconn_communities_catalog_widgets_ResultsDisplayWidget_0 table tr").forEach(function(n,i) {
        var img = dojo.clone(dojo.query("td.lotusFirstCell img",n)[0] );
        var commAnchor = dojo.query("td a[dojoattachpoint='placeTitleLink']",n)[0];
        var members = dojo.query("td span[dojoattachpoint='numOfMembersPlaceHolder']",n)[0];
        var updatedBy = dojo.query("td span[dojoattachpoint='personPlaceHolder']",n)[0];
        var updatedOn = dojo.query("td span[dojoattachpoint='lastUpdateNode']",n)[0];
        var typeMod = dojo.query("td span[dojoattachpoint='moderatedIconNode']",n)[0];
        var typeRest = dojo.query("td span[dojoattachpoint='restrictedIconNode']",n)[0];
        var trashed = dojo.query("td span[dojoattachpoint='trashedIconNode']",n)[0];
        var src = dojo.query("td span[dojoattachpoint='sourceTypePlaceHolder']",n)[0];
        var tags = dojo.query("td span[dojoattachpoint='tagsSection']",n)[0];

        tiles += `
          <div class="lotusLeft cTile" onclick="location.href=\'${commAnchor.href}\'">
            <div class="flip-container" ontouchstart="this.classList.toggle(\'hover\');">
              <div class="flipper">
                <div id="cardFront" class="front">
                  <div class="cTileImg">${img.outerHTML}</div>
                </div>
                <div id="cardBack" class="back">
                  <div class="cTileTextContainer">
                    <div class="cTileTitle">${commAnchor.outerHTML}</div>
                    <div class="cTileSmallTextDiv">${members.outerHTML}</div>
                    <div class="cTileSmallTextDiv">${updatedBy.outerHTML} | ${updatedOn.outerHTML}</div>
                    <div class="cTileSmallTextDiv">${tags.outerHTML}</div>
                    <div class="cTileType">${typeRest.outerHTML}${typeMod.outerHTML}</div>
                    <div class="cTileTrash">${trashed.outerHTML}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>`;
      });

      var commTilesClass = dojo.hasClass("viewControlTiles","lotusTileOn") ? 'commTiles' : 'commTiles lotusHidden';
      var builtCommTiles = `<div id="commTiles" class="${commTilesClass}">${tiles}</div>`;
      dojo.place(builtCommTiles, dojo.query("#lconn_communities_catalog_widgets_ResultsDisplayWidget_0 table")[0], "before");
    };

    // No var so that it is created as global
    addFlipCardUI = function() {
      // connect sort buttons to recreate the tiles
      // dojo.query("ul li a","lconn_communities_catalog_widgets_SortWidget_0").connect("click", createCommTiles);
      // connect table content changes to recreate the tiles
      dojo.subscribe(lconn.communities.catalog.DISPLAY_RESULTS_TOPIC, function(){ createCommTiles(); });

      // grid vs list selector
      var viewController = `
        <div id="viewControl" class="lotusViewControl lotusRight" style="margin-right: 50px;">
          <a id="viewControlTable" class="lotusSprite lotusView lotusDetailsOn" href="javascript:;" onclick="showTable();"><span class="lotusAltText ">Customizable</span></a>
          <a id="viewControlTiles" class="lotusSprite lotusView lotusTileOff"  href="javascript:;" onclick="showTiles();"><span class="lotusAltText lotusBold">List</span></a>
        </div>`;
      dojo.place(viewController, dojo.query("#mainContentDiv div.lotusActionBar.lotusBtnContainer")[0], "append");

      createCommTiles();
      if (dojo.cookie("commTiles") == "1") {
        showTiles();
      }
    };

    waitFor(addFlipCardUI, "td a[dojoattachpoint='placeTitleLink']");
  });
}
