//recursively search for the element until its loaded in dom
var waitFor = function () {
    var maxInter = 300; // number of intervals before expiring
    var waitTime = 100; // 1000=1 second
    var waitInter = 0; // current interval
    var intId = setInterval(function () {
        if (++waitInter >= maxInter) return;
        if (typeof (dojo) == "undefined") return;
        if (window.location.pathname.indexOf("/social/home") > -1 && document.querySelector('.ic-itm-bar .displayed-sets .loading-indicator')) {
            return;
        }
        if (window.location.pathname.indexOf("/social/home") > -1 && !document.querySelector('.active-sets')) {
            return;
        }
        if (!document.getElementById('semtagmenu')) {
            return;
        }
        clearInterval(intId);
        if (waitInter < maxInter) {
            proceed();
        }
    }, waitTime);
};


function proceed() {
    // Select the node that will be observed for mutations
    const targetNodeBizcard = document.getElementById('semtagmenu');

    // Options for the observer (which mutations to observe)
    const configTargetNodeBizcard = { attributes: true, childList: false, subtree: false };

    // Callback function to execute when mutations are observed
    const callbackBizcard = function (mutationsList, observer) {
        if (mutationsList[0].target.style.display == 'block') {
            enableSlackChatForBizcard(targetNodeBizcard);
        }
    }

    // Create an observer instance linked to the callback function
    const observerBizcard = new MutationObserver(callbackBizcard);

    // Start observing the target node for configured mutations
    observerBizcard.observe(targetNodeBizcard, configTargetNodeBizcard);

    //API call for fetching auth token from app registry extension
    async function getAppregData() {
        let token = null;
        const response = await fetch("/appregistry/api/v3/extensions");
        const data = await response.json();
        data.items.forEach(function (item) {
            if (item.name === "slack") {
                token = item.description;
            }
        })
        return token;
    }

    //API call for fetching user ID based on users email from slack
    let getSlackUserId = async function (email) {
        try {
            const token = await getAppregData();
            const userInfoResponse = await fetch("https://slack.com/api/users.lookupByEmail", {
                body: "token=" + token + "&email=" + email,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                method: "post",
            });
            const userInfoData = await userInfoResponse.json();
            const userId = userInfoData.user.id;
            return "https://slack.com/app_redirect?channel=" + userId;
        } catch (e) {
        }
    }

    //alert modal for invalid slack users
    const alertModalBox = document.createElement("div");
    alertModalBox.setAttribute('id', 'invalid_user_alert');
    alertModalBox.classList.add("alert-modal-box");
    const alertModalBoxContent = document.createElement("div");
    alertModalBoxContent.classList.add("alert-modal-content");
    const alertModalBoxHeader = document.createElement("div");
    alertModalBoxHeader.classList.add("alert-modal-header");
    const alertModalBoxHeaderText = document.createElement("span");
    alertModalBoxHeaderText.innerHTML = "Alert";
    const modalBoxClose = document.createElement("span");
    modalBoxClose.classList.add('closeSlackAlert');
    modalBoxClose.innerHTML = "&times;";
    modalBoxText = document.createElement("p");
    modalBoxText.innerHTML = "User is not a valid slack user !";
    alertModalBoxHeader.appendChild(alertModalBoxHeaderText);
    alertModalBoxHeader.appendChild(modalBoxClose);
    alertModalBoxContent.appendChild(modalBoxText);
    alertModalBox.appendChild(alertModalBoxHeader);
    alertModalBox.appendChild(alertModalBoxContent);
    document.body.appendChild(alertModalBox);

    //modal close action
    const closeAlertModalBox = document.getElementsByClassName("closeSlackAlert")[0];
    closeAlertModalBox && closeAlertModalBox.addEventListener("click", function () {
        document.getElementById('invalid_user_alert').style.display = "none";
    })

    //action for redirecting to slack chat for valid slack users
    async function openSlackChatURL(email) {
        document.getElementById('invalid_user_alert').style.display = "none";
        const chatURL = await getSlackUserId(email);
        if (chatURL === undefined) {
            document.getElementById('invalid_user_alert').style.display = "block";
        } else {
            document.getElementById('invalid_user_alert').style.display = "none";
            window.open(chatURL, '_blank');
        }
    }

    //enabling slack chat action for bizcard
    function enableSlackChatForBizcard(targetNodeBizcard) {
        //slack chat link in bizcard
        const li = document.createElement("li");
        li.classList.add("li");
        const slackChatLink = document.createElement("Button");
        slackChatLink.setAttribute('id', 'link_action_slackChat');
        slackChatLink.innerHTML = "Slack";
        slackChatLink.classList.add("slack-chat-link");
        li.appendChild(slackChatLink);

        //slack chat link within more options in bizcard
        const moreOptionBizcardListElement = document.createElement("li");
        const moreOptionBizcardSlackLink = document.createElement("Button");
        moreOptionBizcardSlackLink.setAttribute('id', 'more_link_slackChat');
        moreOptionBizcardSlackLink.innerHTML = "Slack";
        moreOptionBizcardSlackLink.classList.add("slack-link-more-option-bizcard");
        moreOptionBizcardListElement.appendChild(moreOptionBizcardSlackLink);

        //API call for fetching userid based on email
        async function getUserIdFromEmail(email) {
            const response = await fetch('/profiles/json/profile.do?email=' + email);
            const data = await response.json();
            const userId = data.X_lconn_userid;
            return userId;
        }

        //extracting email from bizcard and initiating chat
        function initiateSlackChatFromBizcard() {
            const email = document.querySelector("#cardBody p a").innerHTML;
            openSlackChatURL(email);
        }

        //adding slack chat icon within more option in bizcard
        function moreOptionSlackChatLink() {
            const moreOptionsDropdown = document.querySelector(".lotusActionMenu");
            moreOptionsDropdown && moreOptionsDropdown.prepend(moreOptionBizcardListElement);
            moreOptionBizcardListElement.removeEventListener('click', initiateSlackChatFromBizcard);
            moreOptionBizcardListElement.addEventListener('click', initiateSlackChatFromBizcard);
        }

        //adding slack chat icon in bizcard
        function addSlackChatToBizcard(cardTable) {
            const cardFooter = cardTable.querySelector("#cardFooter td ul");
            cardFooter.prepend(li);
            slackChatLink.removeEventListener('click', initiateSlackChatFromBizcard);
            slackChatLink.addEventListener('click', initiateSlackChatFromBizcard);
            const moreOption = cardFooter && cardFooter.children[cardFooter.children.length - 1];
            moreOption && moreOption.removeEventListener('click', moreOptionSlackChatLink, true);
            moreOption && moreOption.addEventListener('click', moreOptionSlackChatLink, true);
        }

        //check if the bizcard user is logged in user
        async function validateBizcardUser(cardTable) {
            const email = cardTable.querySelector("#cardBody p a").innerHTML;
            const userid = await getUserIdFromEmail(email);
            if (window.location.pathname.indexOf("/social/home") > -1) {
                if (userid !== window.user.id) {
                    addSlackChatToBizcard(cardTable);
                }
            } else {
                if (userid !== window.userid) {
                    addSlackChatToBizcard(cardTable);
                }
            }
        }

        validateBizcardUser(targetNodeBizcard.querySelector("#cardTable"));
    }

    //enabling slack chat action for profile
    function enableSlackChatForProfile() {
        //slack chat button for Profile UI
        const slackChatBtn = document.createElement("BUTTON");
        slackChatBtn.setAttribute('id', 'btn_actn__personCardSlackChat');
        slackChatBtn.innerHTML = "Slack";
        slackChatBtn.classList.add("slack-chat-btn");

        //click event for slack chat button in Profile UI
        slackChatBtn && slackChatBtn.addEventListener('click', function () {
            const email = window.profilesData.displayedUser.email;
            openSlackChatURL(email);
        })

        //appending slack chat button on profile 
        const displayedUser = window.widgetUserInfo.email && window.widgetUserInfo.email;
        const businessCardUser = document.querySelector("#businessCardDetails a").innerHTML && document.querySelector("#businessCardDetails a").innerHTML;
        if (displayedUser && businessCardUser && businessCardUser !== displayedUser) {
            const item = document.querySelector("#businessCardActions .lotusActionBar");
            item && item.insertBefore(slackChatBtn, item.firstChild);
        }
    }

    if (window.location.pathname.indexOf("/profiles/html/profileView.do") > -1) {
        enableSlackChatForProfile();
    }

    //slack chat integration for itm bubble
    if (window.location.pathname.indexOf("/social/home") > -1) {
        //observer to observe itm bar
        const targetNodeItm = document.querySelector('.active-sets');
        const configTargetNodeItm = { attributes: false, childList: true, subtree: false };
        const callbackItm = function (mutationsList, observer) {
            if (mutationsList[0].addedNodes.length) {
                const activeElements = document.querySelectorAll(".active-sets .bubblePos6");
                let currentArray = [];
                currentArray.push(activeElements[activeElements.length - 1]);
                addSlackChatBubble(currentArray);
            }
        }

        const observerItm = new MutationObserver(callbackItm);
        observerItm.observe(targetNodeItm, configTargetNodeItm);

        function addSlackChatBubble(activeElements) {
            //slack chat bubble on itm
            activeElements.forEach(function (ele) {
                const parentAction = ele.parentElement.parentElement;
                const div = document.createElement('div');
                const buttonItmBubble = document.createElement('button');
                buttonItmBubble.setAttribute('id', "slack_chat_itm");
                buttonItmBubble.setAttribute('class', 'action bubblePos0');
                buttonItmBubble.setAttribute('aria-label', 'Slack Chat');
                buttonItmBubble.setAttribute('tabindex', '-1');
                buttonItmBubble.setAttribute('title', 'Slack Chat');
                buttonItmBubble.setAttribute('role', 'menuitem');
                buttonItmBubble.innerHTML = '<img src="data:image/svg+xml;utf8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgMjU3LjQ5IDI0My45NCI+PGRlZnM+PHN0eWxlPi5jbHMtMSwuY2xzLTIsLmNscy0ze2ZpbGw6IzQxNzhiZTt9LmNscy0xe2NsaXAtcnVsZTpldmVub2RkO30uY2xzLTN7ZmlsbC1ydWxlOmV2ZW5vZGQ7fS5jbHMtNHtjbGlwLXBhdGg6dXJsKCNjbGlwLXBhdGgpO30uY2xzLTV7aXNvbGF0aW9uOmlzb2xhdGU7fS5jbHMtNntjbGlwLXBhdGg6dXJsKCNjbGlwLXBhdGgtMik7fS5jbHMtN3tjbGlwLXBhdGg6dXJsKCNjbGlwLXBhdGgtMyk7fTwvc3R5bGU+PGNsaXBQYXRoIGlkPSJjbGlwLXBhdGgiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMzLjg4IDMzLjg4KSI+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNDAuNjYsODEuMzFoNjcuNzZWOTQuODZINDAuNjZabTAtNDAuNjVIMTQ5LjA3VjU0LjIxSDQwLjY2Wm02NiwxMzUuNTJMOTQuODYsMTY5LjQsMTIyLDEyMmg0MC42NWExMy41NiwxMy41NiwwLDAsMCwxMy41Ni0xMy41NVYyNy4xYTEzLjU2LDEzLjU2LDAsMCwwLTEzLjU2LTEzLjU1SDI3LjFBMTMuNTUsMTMuNTUsMCwwLDAsMTMuNTUsMjcuMXY4MS4zMkExMy41NSwxMy41NSwwLDAsMCwyNy4xLDEyMmg2MXYxMy41NWgtNjFBMjcuMSwyNy4xLDAsMCwxLDAsMTA4LjQyVjI3LjFBMjcuMSwyNy4xLDAsMCwxLDI3LjEsMEgxNjIuNjJhMjcuMSwyNy4xLDAsMCwxLDI3LjExLDI3LjF2ODEuMzJhMjcuMTEsMjcuMTEsMCwwLDEtMjcuMTEsMjcuMUgxMjkuODNaIi8+PC9jbGlwUGF0aD48Y2xpcFBhdGggaWQ9ImNsaXAtcGF0aC0yIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzMy44OCAzMy44OCkiPjxyZWN0IGNsYXNzPSJjbHMtMiIgeD0iLTMzLjg4IiB5PSItMzMuODgiIHdpZHRoPSIyNTcuNDkiIGhlaWdodD0iMjQzLjk0Ii8+PC9jbGlwUGF0aD48Y2xpcFBhdGggaWQ9ImNsaXAtcGF0aC0zIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzMy44OCAzMy44OCkiPjxyZWN0IGNsYXNzPSJjbHMtMiIgd2lkdGg9IjE4OS43MyIgaGVpZ2h0PSIxNzYuMTgiLz48L2NsaXBQYXRoPjwvZGVmcz48ZyBpZD0iTGF5ZXJfMiIgZGF0YS1uYW1lPSJMYXllciAyIj48ZyBpZD0iTGF5ZXJfMS0yIiBkYXRhLW5hbWU9IkxheWVyIDEiPjxwYXRoIGNsYXNzPSJjbHMtMyIgZD0iTTQwLjY2LDgxLjMxaDY3Ljc2Vjk0Ljg2SDQwLjY2Wm0wLTQwLjY1SDE0OS4wN1Y1NC4yMUg0MC42NlptNjYsMTM1LjUyTDk0Ljg2LDE2OS40LDEyMiwxMjJoNDAuNjVhMTMuNTYsMTMuNTYsMCwwLDAsMTMuNTYtMTMuNTVWMjcuMWExMy41NiwxMy41NiwwLDAsMC0xMy41Ni0xMy41NUgyNy4xQTEzLjU1LDEzLjU1LDAsMCwwLDEzLjU1LDI3LjF2ODEuMzJBMTMuNTUsMTMuNTUsMCwwLDAsMjcuMSwxMjJoNjF2MTMuNTVoLTYxQTI3LjEsMjcuMSwwLDAsMSwwLDEwOC40MlYyNy4xQTI3LjEsMjcuMSwwLDAsMSwyNy4xLDBIMTYyLjYyYTI3LjEsMjcuMSwwLDAsMSwyNy4xMSwyNy4xdjgxLjMyYTI3LjExLDI3LjExLDAsMCwxLTI3LjExLDI3LjFIMTI5LjgzWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzMuODggMzMuODgpIi8+PGcgY2xhc3M9ImNscy00Ij48ZyBjbGFzcz0iY2xzLTUiPjxyZWN0IGNsYXNzPSJjbHMtMiIgd2lkdGg9IjI1Ny40OSIgaGVpZ2h0PSIyNDMuOTQiLz48ZyBjbGFzcz0iY2xzLTYiPjxyZWN0IGNsYXNzPSJjbHMtMiIgeD0iMzMuODgiIHk9IjMzLjg4IiB3aWR0aD0iMTg5LjczIiBoZWlnaHQ9IjE3Ni4xOCIvPjxnIGNsYXNzPSJjbHMtNyI+PHJlY3QgY2xhc3M9ImNscy0yIiB3aWR0aD0iMjU3LjQ5IiBoZWlnaHQ9IjI0My45NCIvPjwvZz48L2c+PC9nPjwvZz48L2c+PC9nPjwvc3ZnPg">';
                div.append(buttonItmBubble);
                parentAction.append(div);

                //extracting userid
                const parentContainer = ele.parentElement.parentElement.parentElement.querySelector(".face").attributes.src.value;
                const itmUserId = parentContainer.substring(parentContainer.lastIndexOf("=") + 1);

                //API call for getting email based on userid
                const getUserEmailForItmBubble = async function () {
                    const response = await fetch('/profiles/json/profile.do?userid=' + itmUserId);
                    const data = await response.json();
                    return data.email.internet;
                }

                //redirection to slact chat for valid users
                async function initiateSlackChatForItmBubble(e) {
                    e.stopPropagation();
                    let itmUserEmail = await getUserEmailForItmBubble();
                    openSlackChatURL(itmUserEmail);
                }

                buttonItmBubble.removeEventListener("click", initiateSlackChatForItmBubble);
                buttonItmBubble.addEventListener("click", initiateSlackChatForItmBubble);
            });
        }

        const activeElements = document.querySelectorAll(".bubblePos6");
        addSlackChatBubble(activeElements);

    }

}

//check for dummy element or else call function waitFor()
function checkforElement() {
    if (document.body.getAttribute('slack_customizer_integration')) {
        return;
    } else {
        document.body.setAttribute('slack_customizer_integration', 'true');
        waitFor();
    }
}

checkforElement();