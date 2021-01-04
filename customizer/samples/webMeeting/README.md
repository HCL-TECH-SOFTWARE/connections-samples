# Using the Web Meeting Customization

## Overview
The web meeting extension allows a meeting icon to be placed on the navigation bar for quick access to a user's own web conference.

By default the script works by looking for a URL link labelled **Meeting** in the link roll of the user's profile and then extracting the URL and associating that with the navigation bar icon.

Once this extension is deployed by the administrator, it is very easy for a user to opt into using this feature; they simply create the **Meeting** link entry in their profile link roll.

Once that link is created, the icon will show up in the navigation bar.

The extension should work unchanged in this case.

This extension will work with **any meeting provider** where the meeting is accessed via a standard **static** URL, for example:

Provider | Typical Meeting URL
-------- | -------------------
Cisco WebEx | `https://site.webex.com/join/meetingName`
Connections Cloud | See (1) below
HCL Sametime | `https://sametime.host.com/meetingName`
Jitsi Meet | `https://meet.jit.si/meetingName`
LogMeIn GotoMeeting | `https://www.gotomeet.me/meetingName`
Microsoft Teams | See (2) below
Zoom | `https://zoom.us/j/meetingName`

Notes:
1) Connections Cloud has a built-in meeting service with links already in the navigation bar, but some users may not have a subscription to host meetings or may just have an alternative meeting provider that they want to use with this extension.

2) Microsoft Teams meetings are typically started in the context of a chat or channel and are thus not defined with a static owner URL. If a user hosts a Teams meeting that can be identified with a static URL, it could be used with this extension.

## Modifying the Extension JS Script
An administrator can choose to reference an existing profile variable instead of the default link roll entry.

In the **webMeeting.js** file, the variable **electedAttribute** is used to determine whether link roll entry or a specific profile attribute should be used.

Variable Name | Purpose
------------- | -------
**LINKROLL** | (default) In this case the script looks for a link named 'Meeting' (spelled exactly as written) in which each user will add the URL of the meeting service of their choice.
**AttributeName** | The name of an existing profile attribute (e.g. *x-groupwareMail* to use the value in that attribute for this purpose instead). Users will have to insert the link to their preferred meeting service by modifying that attribute in their profile. If the attribute to be used is part of the **extended attribute set**, the name must be prefixed with a **$**.

## Modifying the Meeting Icon
The image file is named **webMeeting.png** and is 24x24 pixels. A different image can be used to replace this file keeping the same file name, or the reference to the image file name in the webMeeting.js script can be changed.

## Outline of Web Meeting Extension Process Flow
The provided example uses a mix of Dojo and Javascript to dynamically add the icon element to the navigation bar.

In the default case, when LINKROLL technique is being used:
1. Wait until dojo is initialized.
2. Retrieve the base profile data for the user to identify their unique uuid.
3. Use the uuid to request the profileLinks item from the profile extensions data.
4. Parse the link list to find the link label Meeting.
5. Extract the URL value from the Meeting entry.
6. Insert the icon element in the navigation bar with that URL reference.

If an existing profile attribute is being used, rather than LINKROLL:
1. Wait until dojo is initialized.
2. Retrieve the base profile data for the user.
3. Parse the profile data to get the value for the specified attribute name.
4. Insert the icon element in the navigation bar with that URL reference.


## Registering the Customizer Extension
In order for Customizer to insert this customization:

1. Put the custom JS script files onto the Connections environment in a **/pv-connections/customizations/webMeeting** directory.
2. Launch the appregistry UI at **/appreg/apps** URL (requires admin access).
3. Create a **New App** definition.
4. Go to the **Code Editor** section and remove the JSON outline.
5. Paste in the content of the file [webMeeting.json](./webMeeting.json) file.
6. If necessary, modify the **include-files path and file name** to match the location and name of the JS script file on the environment.
