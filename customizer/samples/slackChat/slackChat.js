require(["dojo/request", "dojo/topic", "dojo/domReady!"], function(request, topic) {
    
    let enableSlackChat = function() {

      //API call for fetching token from app registry extension
      async function getAppregData () {
        let token = null;
        const response = await fetch("/appregistry/api/v3/extensions");
        const data = await response.json();
        data.items.forEach(function(item){
          if(item.name==="slack"){
            token = item.description;
          }
        })
        return token;
      }


      //API call for fetching user ID based on users email from slack
      let getSlackUserId = async function(email) {
        const token = await getAppregData();
        const userInfoResponse = await fetch("https://slack.com/api/users.lookupByEmail",
        {
          body : "token="+ token +"&email=" + email,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          method: "post",
        });
        const userInfoData =  await userInfoResponse.json();
        const userId = userInfoData.user.id;
        return "https://slack.com/app_redirect?channel="+userId;
    }

    async function openSlackChatURL(email){
      const chatURL = await getSlackUserId(email);
      window.open(chatURL, '_blank');
    }
    
    //slack chat button in Profile UI
    const item = document.getElementById("btn_actn__personCardAddAsMyColleagues");
    const slackChatBtn = document.createElement("BUTTON");
    const idAtt = document.createAttribute("id");
    idAtt.value = "btn_actn__personCardSlackChat";
    slackChatBtn.setAttributeNode(idAtt);
    slackChatBtn.innerHTML = "Slack";
    slackChatBtn.classList.add("slack-chat-btn");

    item && item.insertAdjacentElement("beforebegin", slackChatBtn);

    //click event for slack chat button in Profile UI
    slackChatBtn && slackChatBtn.addEventListener('click', function(){
      const email = window.profilesData.displayedUser.email;
      openSlackChatURL(email);
    })


    //slack chat link in bizcard
    const li = document.createElement("li");
    li.classList.add("li");
    const slackChatLink = document.createElement("Button");
    const idAttLink = document.createAttribute("id");
    idAttLink.value = "link_action_slackChat";
    slackChatLink.setAttributeNode(idAttLink);
    slackChatLink.innerHTML = "Slack";
    slackChatLink.classList.add("slack-chat-link");
    li.appendChild(slackChatLink);


    //extracting email from bizcard and initiating chat
    function initiateSlackChatFromBizcard() {
      const email = document.querySelector("#cardBody p a").innerHTML;
      openSlackChatURL(email);
    }
   
    //event listerner for adding slack chat icon in bizcard
    function addSlackChatToBizcard(){
        setTimeout(function(){
          let cardFooter = document.querySelector("#cardFooter td ul");
          cardFooter && cardFooter.prepend(li);
          slackChatLink.removeEventListener('click', initiateSlackChatFromBizcard);
          slackChatLink.addEventListener('click', initiateSlackChatFromBizcard);
        }, 1500);
    }

    setTimeout(function(){
    //ul element in home page
    const listElement = document.querySelector("#asPermLinkAnchor");

    //ul element receives mouseenter
    listElement && listElement.addEventListener("mouseenter", function(){
      const bizcardItemDetails = document.querySelectorAll(".vcard");
      bizcardItemDetails && bizcardItemDetails.forEach(function(bizcardDetailsItem){
        bizcardDetailsItem.removeEventListener("mouseenter", addSlackChatToBizcard);
        bizcardDetailsItem.addEventListener("mouseenter", addSlackChatToBizcard);
      })
    })

    }, 3000);
    

    //slack chat link for bizcard of logged in user in profile page
    let bizcardLoggedInUser = document.querySelector("#businessCardContent a");

    bizcardLoggedInUser && bizcardLoggedInUser.addEventListener("mouseenter", function(){
      setTimeout(function(){
        let cardFooter = document.querySelector("#cardFooter td ul");
        cardFooter && cardFooter.prepend(li);
        slackChatLink.removeEventListener('click', initiateSlackChatFromBizcard);
        slackChatLink.addEventListener('click', initiateSlackChatFromBizcard);
      }, 1500);
    });


    //slack chat link for bizcard of displayed user in profile page
    const bizcardDisplayedUser = document.querySelector("#businessCardDetails .vcard a");

    bizcardDisplayedUser && bizcardDisplayedUser.addEventListener("mouseenter", function(){
      setTimeout(function(){
        let cardFooter = document.querySelector("#cardFooter td ul");
        cardFooter && cardFooter.prepend(li);
        slackChatLink.removeEventListener('click', initiateSlackChatFromBizcard);
        slackChatLink.addEventListener('click', initiateSlackChatFromBizcard);
      }, 1500);
    })

    //slack chat icon for social/home page

    //slack chat icon for itm bubble
    function getItmInfoBubble() {
      const bizcardItmBubblesInfo = document.querySelectorAll(".ic-bizcard-actions button.bubblePos7");
      bizcardItmBubblesInfo && bizcardItmBubblesInfo.forEach(function(bizcardItmBubbleInfo){
        bizcardItmBubbleInfo && bizcardItmBubbleInfo.removeEventListener("click", addSlackChatToBizcard);
        bizcardItmBubbleInfo && bizcardItmBubbleInfo.addEventListener("click", addSlackChatToBizcard);
      })
    }


    const socialHomeItmBar = document.querySelector(".setSideBar");
    socialHomeItmBar && socialHomeItmBar.addEventListener("mouseenter", function(){
      const bizcardItmBubbles = document.querySelectorAll(".carousel .ic-bizcard-section1");
      bizcardItmBubbles && bizcardItmBubbles.forEach(function(bizcardItmBubble){
        bizcardItmBubble.removeEventListener("mouseenter", getItmInfoBubble);
        bizcardItmBubble.addEventListener("mouseenter", getItmInfoBubble);
      })
    })

    //slack chat icon for updates panel
    const socialHomePanel = document.getElementById("om_tab_panel");
    socialHomePanel && socialHomePanel.addEventListener("mouseenter", function(){
      const panelItems = document.querySelectorAll(".ic-tile-header .vcard");
      panelItems && panelItems.forEach(function(panelItem){
          panelItem.addEventListener("mouseenter", function(){
          setTimeout(function(){
            let cardFooter = document.querySelector("#cardFooter td ul");
            cardFooter && cardFooter.prepend(li);
            slackChatLink.removeEventListener('click', initiateSlackChatFromBizcard);
            slackChatLink.addEventListener('click', initiateSlackChatFromBizcard);
          }, 1500);
        })
      })
    })


  }

  
  enableSlackChat();
});