# Enabling Share to Microsoft Teams for Connections 8.0

The HCL Connections Share Dialog feature allows users to share link to connections content within Connections and also to other third-party applications, such as Microsoft Teams, using a share extension.

The following steps allow you to enable MS Teams.

## Register the extensions

* Place the file ``connections-teams-share-extension-8.0.js`` to the directory ``/pv-connections/customizations/share-extensions/ms-teams directory``.

## Setup the Appregistry Extension

* Launch the appregistry UI at ``/appreg/apps`` URL (requires admin access) or navigate to your Connections URL. Example: https://yourConnectionsUrl.com/appreg/apps.
* In the Apps manager, click New App.
* Copy/Import the content of the file ``ms-teams-share-extension.json`` into the code editor section of appreg.
* Click Save to save the imported app.
* A new card should be displayed in the app list; enable or disable, as necessary.
* After enabling the extension, upon clicking ‘Share’ icon in the Connections UI, the option ‘MS Teams Share’ will appear in the dropdown. On clicking ‘MS Teams Share’, a pop up will appear and you will be able to share the current Connection’s page link or respective blog’s/wiki’s/forum’s link to any Team/Channel in MS Teams.
 