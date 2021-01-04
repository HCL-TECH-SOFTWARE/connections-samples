require(["dojo/request", "dojo/topic", "dojo/domReady!"], function(request, topic) {
  var proxyApiCall = function() {
    request('https://jsonplaceholder.typicode.com/todos/2',
      {
        headers: {
          'Content-Type': 'application/json'
        },
        handleAs: 'json',
        method: 'GET',
      }).then((response) => {
        dojo.query("span.shareSome-title")[0].textContent=response.title;
    });
  }

  proxyApiCall();
});
