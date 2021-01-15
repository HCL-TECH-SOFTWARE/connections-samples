# Using the Business Card Customization

## Overview
The customize-bizcard extension allows you to add, modify, or delete the submenu under 'More Actions' on a user's business card (a.k.a. bizcard).  The bizcard pops up when a user hovers over a user name or user image, and the 'More Actions' menu can be found on the footer area.  This JavaScript code uses the [Dojo Toolkit API](https://dojotoolkit.org/api/?qs=1.9); see online documentation for help.

The following shows an example customization where 2 new links (Google Me, Chat with Bill) have been added:

<img src="/customizer/docs/images/custom-bizcard.png" width="300x"/> 

## Event Listener

The main script adds an event listener to listen for when the user clicks on the 'More Actions' menu wrapper on the bizcard using the `document.addEventListener(...)`. The user could be clicking on the arrow button or the 'More Actions' text and the script will find the nearest 'More Action' menu wrapper anchor element.

In the event function, there is a call to the **CustomizeMenu** function. In that function are examples of how to customize the 'More Actions' menu wrapper.

## Customization Examples
Below is a list of function, parameter, and description use to customize the submenu:

Functions | Parameters | Description
:------------- | :------- | :------------
**customizeMenu** | None | This function calls the waitFor() with these parameters: <ul><li>Callback function - In here you'll find the examples of how to create, modify and delete the submenu under the 'More Actions' menu wrapper.  You don't have to do a create, modify, or delete all at once, i.e. comment out the code you don't need or modify the menu properties here.</li><br><li>The HTML query selector, 'li.lotusMenusSeparator'.  This will wait for the menu wrapper to finish rendering, by querying the HTLM element `<li class='lotusMenuSeparator'>` if it exists, before proceeding to customize the submenu(s).</li></ul>To fetch information about the current user bizcard information, use the `SemTagSvc._tagTypes[1].tagHandler.currentPerson.*` DOM properties.

## Creating a Submenu
Below are details of the function, parameters and description of how it is used to create the submenu:

Functions | Parameters | Description
:------------- | :------- | :------------
**createSubMenu** | <ul><li>*ulActionsMenu*: ul element that contains the 'More Actions' menu wrapper</li><li>*menuId*: provide a unique id for the new submenu</li><li>*menuTitle*: submenu text</li><li>*menuLink*: submenu link</li></ul> | Creates a submenu underneath the 'More Actions' menu wrapper and a menu link.

## Modifying a Submenu
Below are details of the function, parameters and description of how it is used to modify the sub-menu:

Functions | Parameters | Description
:------------- | :------- | :------------
**modifyMenu** | <ul><li>*ulActionsMenu*: ul element that contains the 'More Actions' menu wrapper</li><li>*querySubMenu*: query the submenu by text</li><li>*newText*: menu text to change to</li><li>*newLink*: menu link to change to</li><li>*newClass*: menu class to change to (Optional)</li></ul> | This function will query for the submenu text by, *querySubMenu* parameter and modify the submenu properties (newText, newLink, newClass).

## Delete a Submenu
Below are details of the function, parameters and description of how it is used to delete the sub-menu:

Functions | Parameters | Description
:------------- | :------- | :------------
**deleteMenu** | <ul><li>*ulActionsMenu*: ul element that contains the 'More Actions' menu wrapper</li><li>*querySubMenu*: query the submenu by text</li> | This function will query the submenu by text, *querySubMenu* parameter, and delete the submenu underneath the 'More Actions' menu wrapper.

## Other Utility Function
Below are details of the function, parameters and descriptions of how it is used to wait for an HTML element to load:

Functions | Parameters | Description
:------------- | :------- | :------------
**waitFor** | <ul><li>*callback*: callback function</li><li>*elXpath*: query selector to search for the HTML elements on the page</li><li>*elXpathRoot*: where to start looking in the DOM tree (usually this is the document body)</li><li>*maxInter*: maximum number of intervals before expiring</li><li>*waitTime*: wait time in seconds</li></ul> | This function is used to wait on a DOM element to render on a page before proceeding with your callback function.

## Troubleshooting / Validation
Below are some common troubleshooting issues and how to potentially solve those issues and validate that the custom extension script is working properly. Additional console log statements can be added to the custom JS script to help with debugging.

Errors | Potential Solutions
:------- | :------------------
Cannot find More Actions menu to modify submenu: | Check that the menu wrapper passed in exists or the submenu querying anchor element with a child font element contains the submenu text, returns a element value.
Cannot find More Actions menu to delete submenu:  | Check that the menu wrapper passed in exists or the submenu querying anchor element with a child font element contains the submenu text, returns a element value.

# Using the Profile Customization
## Overview
The customize-profile extension allows you to add, modify, or delete the buttons in the 'My Profile'page. This JavaScript code uses the [Dojo Toolkit API](https://dojotoolkit.org/api/?qs=1.9); see online documentation for help.

The following shows an example customization where a button (Bill's Files) has been added:

<img src="/customizer/docs/images/custom-profile.png" width="300x"/> 

## Customization Examples
The main script uses the waitFor() function as described above in the bizcard customization section to provide examples of how to create a button, modify a button and delete a button.

* In the example for creating a button, the waitFor function waits for the `lotusStreamTopLoading` and `div.loaderMain.lotusHidden` elements to render on the page before proceeding to create a button with a link.
    * In the `domConstruct.create(...)` method, the button text (innerHTML property) and button link (buttonLink parameter) can be changed.

* Following the example for creating a button is an example of how to modify a button that was just created. This is for illustration only for how to change the properties of an existing button. 
  
* In the previous step, the class `lotusBtn newBtn` was added.  After waiting for the new button to be created, the button can be modified.  This can be adjusted to query for an existing button by text to modify the button text, link or class.

* Finally, there is an example of how to delete a button that was just modified. This code is commented out but it shows how to delete a button by button id. It can be used to remove one of the standard buttons on the profile page.

## Troubleshooting / Validation
Below are some common troubleshooting issues and how to potentially solve those issues and validate that the custom extension script is working properly. Additional console log statements can be added to the custom JS script to help with debugging.

Issues | Potential Solutions
:----- | :------------------
Button does not show up | Check that you are on a profile page, that the elements in the waitFor() function exist and the timer waiting for the page to load is not being reached.
Cannot modify button | Check to make sure the button has a unique id or a unique class name(s) to query for in the query selector.

# Registering the Customizer Extension(s) 
In order for Customizer to insert these customizations, extensions should be registered that reference the custom JS script files:

1. Put the custom JS file(s) onto the MSP environment.
2. Launch the appregistry UI at **/appreg/apps** URL (requires admin access).
3. Create a **New App** definition.
4. Go to the **Code Editor** section and remove the JSON outline.
5. Paste in the content of the file [customize-bizcard.json](./customize-bizcard.json) or [customize-profile.json](./customize-profile.json) file.
6. If necessary, modify the **include-files path and file name** to match the location and name of the JS file on the MSP environment.
   
See section [2.5.1 Hosting the Custom JS / CSS Files](/msp/doc/README.md/#251-hosting-the-custom-js--css-files) of the main [Connections Cloud Application Extension Migration](/msp/doc/README.md) documentation for more details about where to host the custom JS/CSS files.


