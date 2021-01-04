require(["dojo/request", "dojo/topic", "dojo/domReady!"], function(request, topic) {
  var waitFor = function(callback, elXpath) {
    var maxInter = 300; // number of intervals before expiring
    var waitTime = 100; // 1000=1 second
    var waitInter = 0; // current interval
    var intId = setInterval( function() {
      if (++waitInter >= maxInter) return;
      if (typeof(dojo) == "undefined") return;
      if (!dojo.query(elXpath, dojo.body()).length) return;
      clearInterval(intId);
      if (waitInter < maxInter) {
        callback();
      }
    }, waitTime);
  };

  var proxyApiCall = function() {
    var editorText = document.getElementsByClassName("cke_wysiwyg_frame")[0].contentDocument.childNodes[1].childNodes[1].childNodes[0].textContent;
    var encodedText = encodeURI(editorText);

    if(editorText && editorText.length > 0) {
      request(`/files/customizer/proxy?reponame=global-samples&proxyFile=proxySample/watsonProxy/.private/watsonToneAnalyzer.json&proxyUrl=https://gateway.watsonplatform.net/tone-analyzer/api/v3/tone?version=2017-09-21&text=${encodedText}`,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          handleAs: 'json',
          method: 'GET'
        }).then((data) => {
          var resultTextBox = dojo.byId("toneResult");
          if (data && data.document_tone && data.document_tone.tones && data.document_tone.tones.length > 0) {
            var toneResultText = "<strong>Tone: </strong>";
            data.document_tone.tones.forEach(function(tone, index) {
              if (index != 0) {
                toneResultText += ", ";
              }
              toneResultText += tone.tone_name;
            });
            resultTextBox.innerHTML = toneResultText;
          } else {
            resultTextBox.innerHTML = "Insufficient data";
          }
      });
    }
  };

  var setupToneAnalyzer = function() {
    //add analyse link
    dojo.place(`<li><a id="analyseTone" role="button" style="cursor: pointer">Analyse</a></li>`, dojo.query(".lotusStream .lotusBoard .lotusActions .lotusLeft")[0], "last");
    dojo.place(`<li><div id="toneResult" style="display: inline-block"></div></li>`, dojo.query(".lotusStream .lotusBoard .lotusActions .lotusLeft")[0], "last");

    // add onclick event listener
    var analyseLink = dojo.query("#analyseTone");
    analyseLink.onclick(function() {
      var resultText = dojo.byId("toneResult");
      resultText.innerHTML = "Loading...";
      proxyApiCall();
    });
  };

  waitFor(setupToneAnalyzer, ".lotusStream .lotusBoard .lotusActions .lotusLeft");

});
