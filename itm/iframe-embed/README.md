# IFrame Solution for ITM Runtime Inclusion

## Introduction
The guide is about how to embed ITM web client as an iFrame to any existing Connections based component. The advantages of using an iFrame are as follows:

- Good isolation from consumer's technical implementation, no need to worry about issues like library conflict.
- Good UI style protection, as the CSS in consumer page will not impact the HTML elements in iFrame.
- Cross domain support.
- Easy for consumer to fulfill the integration, all the implementation detail has been enclosed within the solution.

## Assets

- Host page

  The page which needs to embed ITM bar. Usually, it should be the main page of the component. The page is responsible to load ITM bootstrap script and manipulate ITM web component by calling the surfaced functions.

  Note: this is the only place that consumer needs to code for the integration.

- itmBootstrap.js

  The bootstrap javascript file is loaded by host page. It will create the iframe element and pass though the ITM config object created by the host app.

- HTML source for iFrame.

  The HTML page that the iFrame will load which already exists in the Connections environment. It provides the common services like loading ITM bundle file, detecting the locale and fetching the corresponding language resource.

 
## Integration steps

- load itmBootstrap.js in Host page, such as using `<script/>` like: `<script src="../../itmBootstrap.js"></script>` 

- prepare the DOM container in which the ITM bar will render, such as:
    `<div id="itm_root"></div>`

- prepare ITM config object. The object will be passed to creating ITM function as a parameter. A sample config like:
    ```
    var itmConfig = {
      rtl: false,
      appRegistry: true,
      locale: en
    };
    ```
    Full detail of the configuration object will be shown later.

- prepare onLoaded callback function. The function will be passed to creating ITM function as a parameter. It will be invoked once the ITM bar is initialized. Once it happens, an ITM bar reference will be passed in as the callback function's parameter. Keep the reference in Host app as it will be used to manipulate ITM hereafter.

  In addition to receive the ITM bar reference, more initialization work can be done in the onLoaded callback, such as add global entry, add listener on ITM events. Sample of onLoaded callback function:
    ```
    function onLoaded(itmRef) {
      itmBar = itmRef;
      itmBar.callMethod('addStaticHeadEntries', [genGloablEntry()]);
      itmBar.addEventListener('onEntrySelected', onEntrySelected);
      itmBar.addEventListener('onAction', onActionSelected);
    }
    ```
- create ITM bar. Just call the function as it has been provided in itmBootstrap. 
    ```
    lconn.itm.client.itmFacotry.create(config, onLoaded, node);
    //config is the itm configuration object mentioned above.
    //onLoaded is the callback function mentioned above.
    //node is either the DOM node to contain the ITM bar or the id of the container.
    ```

These are the steps to create ITM bar. After that, consumer can use itmRef to manipulate the itm bar according its need, such as get entry list or set hasNew status to an entry.

## ITM Configuration Object
The table below gives details about the ITM config object, including option name, description and default value. Most of the options already have default values. If for testing purpose, it is no need to test all of them, as they are already covered in production testing. 

| Options | Default | Description |
| -------   | -----   | ---- |
| app           | 'OrientMe' | Specify the name of Host app. It must extacly match with the path value in the AppRegistry URL for this host. |
| readOnly      | false      | Whether allow add or remove ITM entries. If true, the tail plus entry will show. |
| hasSuggestion | true       | Whether show suggestions section. |
| hasAction     | true       | Whether show action bubbles. If false, no action bubble will be shown with ITM entries. |
| hasTailPlus   | false      | Whether show plus circle at the tail position. If readOnly is true, the tail plus will be froced to show no matter what the option value is. |
| isMoveable    | true       | Whether support reorder entries by drag&drop. |
| excludeActions| []         | Specify the action bubbles that the Host likes to disable. The value is an array of action type names, eg: ['chat','sharefile'] |
| suggestionsConfig | []     | Provide a chance to override the suggestion configuration that defined in native configuraiton or merged from native config and appRegistry config. But if has appRegistry integrated, should do the customization in appRegistry side, but not here. |
| appRegistry   | false      | Whether appRegistry integration is enabled. |
| hasHoverWarning| true      | Whether to show the warning message on invalid flag when Person state is INACTIVE/DELETED or Community state is DELETED/NOACCESS. Only for Action Center. |
| customJsEnable| true       | Whether to allow ITM to load external JS files that defined in either native or appRegistry side ITM configuration file. If false, the customized handles will lost their function if depend on the external JS(include base64)  |
| locale | NA   | Specify the locale of current context. ITM needs to pass it to Typeahead. |
| typeaheadStores | []       | Specify the data stores of the typeahead. The value is an array of the instances of the data stores or the string values of  'ITM_DEFAULT_PEOPLESTORE’ and ‘ITM_DEFAULT_COMMUNITYSTORE'. ITM has built-in datastore for People and Community, so in most of case, host doesn't need to specify it. |
| smartcloud    | NA         | It should be a boolean value. ITM will first try to figure out by itself about if the host is in a smartcloud depolyment. If cannot, ITM will rely on this option to indicate that. |
| isExternal    | false      | Whether the logged in user is external user. |
| rtl           | false      | Whether to show content in RTL. |


## ITM bar reference object
The object is passed back to host as a paramenter of onLoaded callback function. There are 4 functions assoicated with the object. With them, host app can interact with ITM bar with full supported functions.

- addEventListener
- removeEventListener
- callMethod
- fetchEntries

### 1) addEventListener
The function is used by host to add listener on ITM events, such as an ITM entry is selected. 

`usage: itmRef.addEventListener(eventName, handler)`
- eventName is the name of the event the handler will listener to.
- handler is a callback function defined in the host. It will be called when the listening event happens in ITM side. The handler should bind 'this' well before passing to the function.

The table of the available events and description

| Event Name | Description | callback parameter | 
| ------- | ----- | ----- |
| 'onEntrySelected' | event happens when an ITM entry is selected | entry object |
| 'onEntryAdded' | event happens when a new favority entry is added, no matter from tpyeahead or suggestion section | new entry object |
| 'onEntryDeleted' | event happens when an entry is deleted, could be either favorite or suggested entry  | entry id |
| 'onAction' | event happens when an action bubble of a particular entry is clicked  | entry object, action type |
| 'onMessagePopped' | event happens when ITM wants to raise any messages to host | message text, message type(warning, info,danger, success ) |

### 2) removeEventListener
The function is used to remove the event listener you have registered via addEventListener before.

`usage: itmRef.removeEventListener(eventName, handler)`
- eventName is the name of the event you want to remove the handler from.
- handler is the listener function you registered to the event previously via addEventListener.

### 3) callMethod
A wrapper function to call all ITM component methods. The particular method is specified via parameter of this function.

`usage: itmRef.callMethod(methodName, arguments...)`  
- methodName is the name of ITM component method you want to call.
- arguments... are all the arguments needed by the calling method. So the different arguments should be supplied for the different method.

The table lists all the ITM component methods can be invoked by host app.

| Method Name | Description | Arguments | 
| ------- | ----- | ----- |
| 'addStaticHeadEntries' | Add global entries to ITM bar | an array of global entries |
| 'setHighWaterMark' | Make high watermark(hasNew flag) on ITM entries | an array of entry ids |
| 'clearHighWaterMarks' | Remove high watermarks from ITM entries  | an array of entry ids |
| 'clearAllHighWaterMarks' | Remove all high watermarks on the ITM bar |  |
| 'setEntrySelected' | Make an entry selected and send 'onEntrySelected' even. If do not provide entry id parameter, the method will just unselect the current selecting entry but set nothing | entry id or empty |
| 'markEntrySelected' | Make an entry show the selected appearance, but don't send 'onEntrySelected' event | entry id |
| 'setInvalidMark' | Make an ITM entry to be invalid(show the delete button) | entry id |
| 'changeEntryProperty' | Another way to change entry run-time propery, such as hasNew or invalid | entry id, propertyKey('hasNew','invalid'), value(true,false) |
| 'setActionStatusValue' | set action bubble status for a certain ITM entry. It is designed to deal with the action that has different status. Such as sametime chat action, it will show the person's sametime awareness. It is not really used in current release | entry id, action type, status |

### 4) fetchEntries
A function for Host app to fetch the entry list by type from ITM bar.

`usage: itmRef.fetchEntries(entryType)`
- entryType is to indicate the type of ITM entries you want to get.

| Entry Type | Description | Return Values | 
| ------- | ----- | ----- |
| 'favorites' | Get favorite entry list | an array of favorite entries |
| 'suggestions' | Get suggestion entry list | an array of suggestion entries |
| 'customEntries' | Get custom entry list | an array of custom entries |

## Example

A demo for a mock host page to embed ITM iFrame can be found here [parent.html](./parent.html)

In order to use it:
- place the parent.html and itmBootstrap.js files in a directory on the HTTP server (or other web server of static resources accessible via your https://connections.host.name domain name to minimze cross-site issues)
- go to https://connections.host.name/path/to/parent.html
- the ITM bar should load from Connections in an iFrame at the top of the page