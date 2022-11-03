# Enabling Share to Microsoft Teams for Connections 8.0

HCL Connections Share Dialog feature allows users to share link to connections content not only within Connections but also with other third-party applications, such as Microsoft Teams.
Following steps allow you to enable MS Teams.
## Register the extensions
* Place connections-teams-share-extension-8.0.js to /pv-connections/customizations/share-extensions/ms-teams directory.
## Setup the Appregistry Extension
* Launch the appregistry UI at /appreg/apps URL (requires admin access) or navigate to your Connections URL. Example: https://yourConnectionsUrl.com/appreg/apps.
* In the Apps manager, click New App.
* Copy/Import the content of ms-teams-share-extension.json file in the appreg.
* Click Save to save the imported app.
* A new card should be displayed in the app list; enable or disable, as necessary.
* After enabling the extension, upon clicking ‘Share’ icon, the option ‘MS Teams Share’ will appear in the dropdown. On clicking ‘MS Teams Share’, a pop up will appear and you will be able to share current connection’s page link or respective blog’s/wiki’s/forum’s link to any Team/Channel in MS Teams.
 