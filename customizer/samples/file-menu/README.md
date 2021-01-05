# Using the File Menu Customization

## Overview
The file_menu extension allows a new file menu to be added for a file. This extension can be displayed at the following locations:
1. The More Actions drop down menu in the expanded view of a file on the files list page.
2. The More Actions drop down menu on a file preview view.

More Actions | File Preview
------------ | ------------
<img src="../../doc/images/files-more-actions-custom.png" width="400x"/> | <img src="../../doc/images/files-preview-more-custom.png" width="400x"/>


## Modifying the File Extension Example JS Script
Below is a list of parameters which need to be supplied in the example JS script provided in this repository:

Variable Name | Purpose
------------- | -------
**APP_NAME** | The App name for the file extension for example: "My File Extension".
**APP_ID** | Add a unique App Id using a format similar to this: "my_file_extension".
**EXT_URL** | Add the file extension url and any context data parameters (file_id, org_id, user_id, subscriber_id) that will have real values substituted.
**MIME_TYPE** | Add the specific file extensions to which the menu should apply in an array format for example: ["pdf", "docx", "xls"] or leave it empty [] to be visible for any file type.

The extension varaiable for example **extension_1** should follow a similar JSON format as provided in the example with a unique name/id.

The JSON extension definitions should then be placed in an array as shown in the **extensions** array variable in the example below.

These are the contextual data parameters for the file extension url, as they were in Connections Cloud, that can be passed to the receiving application:

Parameter Name | Value
-------------- | ------
**${file_id}** | The internal UUID of the file.
**${user_id}** | The email address of the current user.
**${subscriber_id}** | The user identifier of the current user. 
**${org_id}** | The organization identifier of the current user.

Here is an example of how to define two file menu extensions using the example JS script and the parameters listed above:
```js
var extension_1 = {
    APP_NAME: "My File Extension 1", 
    APP_ID: "my_file_extension_1", //  
    EXT_URL: "https://www.example.com/${file_id}",
    MIME_TYPE: ["pdf", "docx"]
};
var extension_2 = {
    APP_NAME: "My File Extension 2",
    APP_ID: "my_file_extension_2",
    EXT_URL: "https://www.example.com/${file_id}?org=${org_id}&subscriber=${subscriber_id}&email=${user_id}",
    MIME_TYPE: []
};
var extensions = [extension_1, extension_2];
```

## Outline of File Extension Process Flow
The provided example uses a mix of Dojo and Javascript to dynamically add new extensions points to the existing file dropdown menus.

Define one or more extensions using the details provided above at the top of the example JS script. Try to define the extensions using the example syntax provided as these values are referenced throughout the example JS file.

There is an event listener checking if the target mouse click is one of the dropdown buttons/links corresponding to a location for the file menu extensions, these are the following locations:

1. The More Actions dropdown menu:
    - Get the selected file information for each of the defined extensions and check if the MIME_TYPES provided match the file type.
    - Wait for the file dropdown menu to appear.
    - Grab the dropdown table and last table elements.
    - Append the new extension element with the provided extension information to the existing dropdown table following the last table element.
    - Update the newly added extension with the same hover, active, and selected css effects.
    - Add an on click event to the new extension using the newly constructed file extension url.
  
2. The preview file More Actions dropdown menu:
   - Get the selected file information when clicking the file link to use later.
   - Check that the dropdowm menu element in the file preview view was clicked and for each of the defined extensions check if the MIME_TYPES provided match the file type.
   - Wait for the dropdown menu to appear.
   - Grab the dropdown table and last table elements.
   - Append the new extension element with the provided extension information to the existing dropdown table following the last table element.
   - Update the newly added extension with the same hover, active, and selected css effects.
   - Add an on click event listener to the new extension using the newly constructed file extension url.

## Registering the Customizer Extension
In order for Customizer to insert this customization:

1. Put the custom JS script file onto the MSP environment.
2. Launch the appregistry UI at **/appreg/apps** URL (requires admin access).
3. Create a **New App** definition.
4. Go to the **Code Editor** section and remove the JSON outline.
5. Paste in the content of the file [custom-files-menu.json](./custom-files-menu.json) file.
6. If necessary, modify the **include-files path and file name** to match the location and name of the JS script file on the MSP environment.
   
See section [2.5.1 Hosting the Custom JS / CSS Files](../../doc/README.md/#251-hosting-the-custom-js--css-files) of the main [Connections Cloud Application Extension Migration](../../doc/README.md) documentation for more details about where to host the custom JS/CSS files.

## Troubleshooting / Validation
Below are some common troubleshooting issues and how to potentially solve those issues and validate that the custom extension script is working properly. Addition console log statements can be added to the custom JS script to help with debugging.

Issues | Potential Solutions
------------- | -------
The console message "File extension script loaded." wasn't displayed when accessing the files page and there aren't any errors in the browser console. | Check the browser network trace to see if the custom JS script file was loaded successfully.
The file extension script was loaded successfully but the custom file extensions are not displaying. | The first place to look would be the "on click" event listener. Check that the target elements for the file menu and preview menu dropdowns are correct and can be queried successfully for example: ```dojo.query("#lconn_files_action_more_0");``` this should return and element. Additionally, if you are using another script for the new_file_menu extensions make sure the declared extension variables provided are unique and not using the same names as the file_menu extension variables.
The file extension script "on click" events are working properly but the custom file extensions are not displaying or this is triggering browser console errors. | Try adding some additional console log statements. After clicking the dropdown button link, inspect the dropdown table elements in the DOM using the browser dev tools. Check that the IDs for the generated dropdown list match what the dojo queries in the script are looking for. For example: ```dojo.query("#lconn_files_action_more_0_dropdown");``` this should return an element.
The custom file extensions were successfully added to the file menu dropdown list, but the hover, active, or "on click" events aren't working properly. | Try adding some additional console log statements and check that the target elements for the dropdown list elements are correctly displaying on mouse over and mouse leave events as well as the on click event for the newly added extension. Additionally check that the hover and active classes for the newly added elements are correct along with the additional css styling to match the existing dropdown table elements.