/*
 * © Copyright HCL Corp. 2020
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
//  *********************************************************************
//  *                                                                   *
//  * ADMINISTRATOR:                                                    *
//  *   You need to set the variable   electedAttribute                 *
//  *   This variable may have the following values:                    *
//  *       - LINKROLL (default)                                        *
//  *         In this case the script looks for a link named 'Meeting'  *
//  *         (spelled exactly as written) in which each user will      *
//  *         add the URL of the meeting service of his choice          *
//  *       - a profile extension attribute                             *
//  *         (for instance, meetingIdentity")                          *
//  *         Users will have to insert the link to their preferred     *
//  *         meeting service by modifying that extension attribute     *
//  *         in their HCL Connections Profile                          *
//  *                                                                   *
//  *********************************************************************
//
var electedAttribute = "LINKROLL";
if (
  document.location.pathname.startsWith("/connections/opensocial/") ||
  document.location.pathname.startsWith("/connections/resources/") ||
  document.location.pathname.startsWith("/touchpoint")
) {
  __cBill_logger(
    "cnxMeetingInjector : ******************* ignoring " +
      document.location.pathname +
      " **********************"
  );
} else {
  __cBill_logger(
    "cnxMeetingInjector : $$$$$$$$$$$$$$$$$$$ treating " +
      document.location.pathname +
      " $$$$$$$$$$$$$$$$$$$$$$"
  );
  var __dojoIsReady = new __cBill_waitForDojo("webMeeting");
  //
  //  Since this script is applied to GLOBAL, there are some pages (mycontacts, mynetwork) which load Dojo very lazily.
  //  So we need to wait until Dojo is fully loaded before testing and using it
  //
  __dojoIsReady.do(function () {
    try {
      let __placeId = "lotusPerson";
      let __repoSuffix = "";
      let __beforeOrAfter = "after";
      let __newFatherTag = "li";
      let showMeetingICON = function (theMeeting) {
        if (theMeeting !== null) {
          //
          //  Build the new visual item
          //
          let __theSibling = new __cBill_waitById("checkNotification");
          __theSibling.do(function (theSibling) {
            //
            //  The Sibling has been found
            //
            let __candidate = null;
            if (theSibling.nextSibling) {
              //
              //  Not Cloud
              //
              if (theSibling.nextSibling.id === "lotusBannerMeeting") {
                __candidate = theSibling.nextSibling;
              }
            } else {
              //
              //  Cloud
              //
              if (theSibling.previousSibling.id === "lotusBannerMeeting") {
                __candidate = theSibling.previousSibling;
              }
            }
            if (__candidate) {
              //
              //  We already added the item.
              //  We do not want to add it again
              //
              __cBill_logger(
                "cnxMeetingInjector : Meeting Icon already added !"
              );
            } else {
              //
              //  OK, let's add the new item
              //
              let newFather = null;
              newFather = dojo.create(__newFatherTag);
              dojo.setAttr(newFather, "id", "lotusBannerMeeting");
              let newA = dojo.create("a");
              dojo.setAttr(newA, "role", "button");
              dojo.setAttr(
                newA,
                "innerHTML",
                '<img src="/files/customizer/webMeeting/webMeeting.png' +
                  __repoSuffix +
                  '"></img>'
              );
              dojo.setStyle(newA, "cursor", "pointer");
              newA.addEventListener("click", function () {
                dojo.stopEvent(event);
                let win = window.open(theMeeting, "_blank");
                win.focus();
              });
              /*
                            dojo.setStyle(newA, "padding-bottom", "7px");
                            dojo.setAttr(newA, 'onmouseover', "dojo.require('lconn.core.header'); lconn.core.header.menuMouseover(this);");
                            dojo.setAttr(newA, 'onclick', "dojo.require('lconn.core.header');lconn.core.header.menuClick(this);");
                            dojo.setAttr(newA, 'onfocus', "dojo.require('lconn.core.header');lconn.core.header.menuFocus(this);");                      
                            newA.addEventListener('mouseover', function() {
                                dojo.require('lconn.core.header');
                                lconn.core.header.menuMouseover(this)
                            });
                            */
              //
              //  then, add the newly created label and HIDE the DIV containg the checkbox
              //
              dojo.place(newA, newFather, "first");
              dojo.place(newFather, __placeId, __beforeOrAfter);
            }
          }, __placeId);
        } else {
          //
          //  Do not do Anything
          //
        }
      };
      //
      // Start of Processing
      //
      __cBill_logger(
        "cnxMeetingInjector : Dojo is defined, injection STARTS NOW !"
      );
      //
      //  First thing. GET THE PROFILE of the current user
      //  Variable "lconn.core.auth.getUser().id" is available from Connections
      //
      try {
        //
        //  Check for cloud or not
        //
        if (document.location.href.startsWith("https://apps.")) {
          __placeId = "bss-usersMenu";
          __repoSuffix = "?repoName=global-samples";
          __beforeOrAfter = "before";
          __newFatherTag = "div";
          __cBill_logger(
            "cnxMeetingInjector : Cloud place <" +
              __newFatherTag +
              "> Id = " +
              __placeId
          );
        } else {
          __cBill_logger(
            "cnxMeetingInjector : Non-cloud place <" +
              __newFatherTag +
              "> Id = " +
              __placeId
          );
        }
        //
        //  Fetch the Profile details
        //
        let __userId = lconn.core.auth.getUser().id;
        let __email = lconn.core.auth.getUser().email;
        
        if (electedAttribute == "LINKROLL") {
            profilesArgs = {
                url: "/profiles/atom/profileExtension.do",
                handleAs: "xml",
                preventCache: true,
                content: { email: __email, extensionId: "profileLinks" },
              };
              let deferred2 = dojo.xhrGet(profilesArgs);
              deferred2.then(
                function (data) {
                  if (data !== null) {
                    //
                    //  There is a LINKROLL.
                    //  Check if there is a LINK whose name is "Meeting"
                    //
                    for (
                      let i = 0;
                      i < data.documentElement.children.length;
                      i++
                    ) {
                      let theChild = data.documentElement.children[i];
                      let theNameAttribute = theChild.attributes[0];
                      let theURLAttribute = theChild.attributes[1];
                      if (theNameAttribute.value === "Meeting") {
                        theMeeting = theURLAttribute.value;
                        __cBill_logger(
                          "cnxMeetingInjector : Found LINKROLL Meeting Link : " +
                            theMeeting
                        );
                        showMeetingICON(theMeeting);
                      }
                    }
                  } else {
                    //
                    //  No LINKROLL
                    //
                    __cBill_logger("cnxMeetingInjector : NO LINKROLL !");
                  }
                },
                function (error) {
                  //
                  //  deferred2 ERROR
                  //
                  __cBill_logger(
                    "cnxMeetingInjector : error during getLINKROLL REST API"
                  );
                  console.dir(error);
                }
              );
        }else {
            let profilesArgs = {
            url: "/profiles/atom/profileExtension.do",
            handleAs: "text",
            preventCache: true,
            content: { email: __email, extensionId: electedAttribute},
          };
          let deferred = dojo.xhrGet(profilesArgs);
          deferred.then(
          function (data) {
            showMeetingICON(data);
          });
        }
      } catch (ex) {
        __cBill_logger(
          "cnxMeetingInjector error: IMPOSSIBLE TO GET UserId using lconn.core.auth.getUser().id : " +
            ex
        );
      }
    } catch (ex) {
      __cBill_logger("cnxMeetingInjector error: MAIN: " + ex);
    }
  });
}

