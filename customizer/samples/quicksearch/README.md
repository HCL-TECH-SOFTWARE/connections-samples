# Customizing Quicksearch in Connections 8.0

It is possible connect Quicksearch with an alternate search destination and navigate upon searching to the third party applications.
## Setup the Appregistry Extension
* Launch the appregistry UI at /appreg/apps URL (requires admin access) or navigate to your Connections URL. Example: https://yourConnectionsUrl.com/appreg/apps.
* In the Apps manager, click New App.
* Copy/Import the content of quicksearch-extension-8.0.json file in the appreg (make sure you changed placeholder variables in json provided to point to your target environment).
* Click Save to save the imported app.
* A new card should be displayed in the app list; enable or disable, as necessary.
* Once app registry application for Quicksearch has been enabled, user will be presented with search dropdown options. By clicking on option, new browser tab will be opened with corresponding search results.