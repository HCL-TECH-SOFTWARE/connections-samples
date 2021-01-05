# Using the Navigation Bar Customization

## Overview
The customize-navbar extension allows you to add a top level menu to the navbar, add submenus underneath the top level menu, modify existing top level menu or submenu (text or link), or delete exiting top level menu (which will delete it's submenus) or submenu.  This JavaScript code uses the [Dojo Toolkit API](https://dojotoolkit.org/api/?qs=1.9); see online documentation for help.

The following shows an example customization where a menu and 2 submenu links have been added:

<img src="/customizer/docs/images/custom-nav-menu.png" width="400x"/> 

## Customization Examples

The main script calls the utility function waitFor() with these parameters:

* Callback function - In here you'll find the examples of how to customize the nav bar menu.  You don't have to do a create, modify, or delete all at once, i.e. comment out the code you don't need or modify the menu properties here. The examples are in one place to show  how to use these menu functions to:
   * create a top link menu, and/or submenu, 
   * modify a top link menu or single submenu, or
   * delete a top link menu (and all it's submenus) or a single submenu

* The HTML query selector, `div.lotusBanner`
   * This will wait for the navbar to finish rendering, by querying the HTML element `<div class='lotusBanner'>` if it exists, before proceeding to customize the navbar menu or submenu.  

## Creating a Navbar Menu
Below are details of the functions, parameters and descriptions of how they are used to create the menu:

Functions | Parameters | Description
:-------- | :--------- | :----------
**createMenuWrapper** | <ul><li>*nodeParent*: navbar container element of where to insert the menu</li><li>*nodeId*: provide a unique id for the new menu</li><li>*menuTitle*: menu text</li></ul> | Creates a top level menu on the navbar.  The top level menu is also referred to as the menu wrapper or dropdown menu if there are submenus underneath or it can be a static menu.
**createSubMenu** | <ul><li>*topNavMenuText*: query top nav bar menu item by text and insert the new submenu under</li><li>*nodeId*: provide a unique id for the new submenu</li><li>*menuTitle*: submenu text</li><li>*menuLink*: submenu link</li></ul> | Creates a submenu underneath an existing top level menu.

## Modifying an Existing Navbar Menu or Submenu
Below are details of the function, parameters and description of how it is used to modify the menu:

Functions | Parameters | Description
:-------- | :--------- | :----------
**modifyMenu** | <ul><li>*queryTopNavMenu*: query the top link menu by text</li><li>*querySubMenu*: query the submenu by text</li><li>*newText*: menu text to change to</li><li>*newLink*: menu link to change to</li><li>*newClass*: menu class to change to (Optional)</li></ul> | If you pass in just the *queryTopNavMenu*, this function will modify the top level menu properties (newText, newLink, newClass).  If you pass in the *queryTopNavMenu*, and the *querySubMenu*, this function will query the top level menu by text, and it's submenu by text, and modify the submenu properties (newText, newLink, newClass).

## Delete an Existing Navbar Menu or Submenu
Below are details of the function, parameters and description of how it is used to delete the menu:

Functions | Parameters | Description
:-------- | :--------- | :----------
**deleteMenu** | <ul><li>*queryTopNavMenu*: query the top link menu by text</li><li>*querySubMenu*: query the submenu by text</li></ul> | If you pass in just the *queryTopNavMenu*, this function will query and delete the top link menu by text and any subsequential submenu(s) underneath it. If you pass in the *queryTopNavMenu*, and the *querySubMenu*, this function will query the top level menu by text, and it's submenu by text, and delete just the submenu underneath it.

## Other Utility Function
Below are details of the function, parameters and descriptions of how it is used to wait for an HTML element to load:

Functions | Parameters | Description
:-------- | :--------- | :----------
**waitFor** | <ul><li>*callback*: callback function</li><li>*elXpath*: query selector to search for the HTML elements on the page</li><li>*elXpathRoot*: where to start looking in the DOM tree (usually this is the document body)</li><li>*maxInter*: maximum number of intervals before expiring</li><li>*waitTime*: wait time in seconds</li></ul> | This function is used to wait on a DOM element to render on a page before proceeding with your callback function.


## Registering the Customizer Extension
In order for Customizer to insert this customization:

1. Put the custom JS file onto the MSP environment.
2. Launch the appregistry UI at **/appreg/apps** URL (requires admin access).
3. Create a **New App** definition.
4. Go to the **Code Editor** section and remove the JSON outline.
5. Paste in the content of the file [customize-navbar.json](./customize-navbar.json) file.
6. If necessary, modify the **include-files path and file name** to match the location and name of the JS file on the MSP environment.
   
See section [2.5.1 Hosting the Custom JS / CSS Files](/msp/doc/README.md/#251-hosting-the-custom-js--css-files) of the main [Connections Cloud Application Extension Migration](/msp/doc/README.md) documentation for more details about where to host the custom JS/CSS files.

## Troubleshooting / Validation
Below are some common troubleshooting issues and how to potentially solve those issues and validate that the custom extension script is working properly. Additional console log statements can be added to the custom JS script to help with debugging.

Errors | Potential Solutions
:----- | :------------------
Error couldn't find the node parent to insert menu wrapper | Check nodeParent parameter is not empty or check if the element `dojo.query("ul.lotusInlinelist.lotusLinks")[0]` exists.  You can enter `dojo.query(...)` in the web browser development console.
Cannot find top nav menu to modify | Check that the top nav menu with the `<a arial-label='queryTopNavMenu'>` exists to modify
Cannot find top nav menu to delete | Check that the top nav menu with the `<a arial-label='queryTopNavMenu'>` exists to delete
