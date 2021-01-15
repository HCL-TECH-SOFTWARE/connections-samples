**DRAFT - WORK IN PROGRESS**

# Embedding the Navigation Bar
The following information shows how to embed and use the Connections navigation bar on other web pages and applications to assist users in navigating between applications.

## Setting Up the Required Files
The script and CSS files are common to all tenants and only need be set up for the first customer that wishes to make use of embedding the navigation bar.

1. Create a directory under the Customizer persistent volume **/pv-connections/customizations** to host the necessary shared files. Examples used here use the name **embed-navbar** but the directory name can be anything; all orgs wishing to make use of the feature will have to know what it is in order to reference it properly in their `<script src>` tag.

2. Copy the following files into the directory:

    | File Name | Purpose |
    :-------  | :------------------
    embed-nav.css | Additional styling added to navbar
    embed-nav.js | Additional JS added to navbar content
    embed-nav.json | Customizer extension definition
    get-navbar.js | Script to embed navbar in iFrame on web page
    navbar.html	| (Optional) Example / test page

    <img src="/customizer/docs/images/embed-nav-files.png" width="400x"/> 

    The files can be found in this repo directory; there are minified versions of the .js files with .min.js names. Adjust the extension json to use that file name if preferred.

# Including the Navigation Bar
## Creating the Customizer Extension
Connections produces just the re-usable header content via a request to **/homepage/web/pageHeader** but some additional styling and javascript is required and is injected by a Customizer extension. Because Customizer is processing this response like any other, any customizations applied to the navigation bar by Customizer will also appear in the embedded navigation bar.

Each customer must set up their own Customizer extension in the app registry since they cannot be shared across organizations.

1. Using the app registry client `https://<vanityHost>/appreg/apps` create a new app, click on Code Editor link and remove the initial json outine, then paste in the json from the [embed-nav.json](./embed-nav.json) example file (screenshot below).

    Notice that url match rule which indicates that although this is on the /homepage path, it is only actioned by Customizer when the url contains pageHeader, so it will not affect any other /homepage/.... requests.

    <img src="/customizer/docs/images/embed-nav-extension.png" width="300x"/>

2. When the request for **/homepage/web/pageHeader** is made, the response should contain src tags for the two included files and they should be seen to be loaded in the browser network trace:
 
    <img src="/customizer/docs/images/embed-nav-trace.png" width="600x"/>

Manually test this in the browser to make sure the two files are being loaded.

## Adding the Script Tag
The last part of the puzzle is to insert a script source tag into the page(s) where the navigation bar is desired.

To do this, a tag like the following is placed in the html page referencing the **get-navbar.js** script along with some parameters that can be specified; some required and some optional.

```html
<!-- Script source and supported parameters -->
<!-- anchorid       : (Required) element ID to attach iFrame -->
<!-- hostname       : (Required) vanity host name from where to fetch navbar header content -->
<!-- framewidth     : (Optional) width of navbar iframe container (default = 100%) -->
<!-- frameheight    : (Optional) height of navbar iframe container (default = 50px) -->
<!-- maxframeheight : (Optional) maximum height of navbar iframe container (default = 500px) -->
<!-- frameborder    : (Optional) border of navbar iframe container (default = 0) -->
<!-- framepadding   : (Optional) padding of navbar iframe container (default = 0) -->
<!-- framemargin    : (Optional) margin of navbar iframe container (default = 0) -->

<script id="embedCNXNavbar" src="https://mtdemo1-orgc.cnx.cwp.pnp-hcl.com/files/customizer/embed-navbar/get-navbar.js" anchorid="lotusContent" hostname="mtdemo1-orgc.cnx.cwp.pnp-hcl.com" 
frameWidth="100%" frameheight="50px" maxframeheight='500px' frameborder="0" framepadding="0" framemargin="0"></script>
```
The example contains comments that define the allowable parameters but only the `<script>.....</script>` tag content is actually necessary. 

If optional parameters are not specified, the indicated default values will be used, and optional parameters need only be included if the value is required to be different than the default.

Note that the src= url entry should use the vanity host name of the specific customer org and should match the hostName property that is being passed to the script.

Now when this page is loaded, the following process should occur:

1. The **get-navbar.js** script is loaded in the browser and executed.

2. It determines the set of parameters passed or default values - these are output as browser console debug messages to validate the correct default or passed values are being used:
   
   <img src="/customizer/docs/images/embed-nav-debug.png" width="600x"/>

3. It creates an iFrame element, sets the properties based on the parameters, attaches to the current page at the anchor id specified and renders the content - per the example navbar.html it should look something like this:

    <img src="/customizer/docs/images/embed-nav-example-iframe.png" width="900x"/>

Notice in this case that the Customizer extension to modify the navigation bar by adding WebEx links has been maintained.


# Troubleshooting / Validation
Below are some common troubleshooting issues and how to potentially solve those issues and validate that the embedded navbar is working properly. Additional console log statements could be added to the **get-navbar.js** script to help with debugging.

Issue | Potential Solutions
:----- | :------------------
get-navbar.js script not loaded | Script src url incorrect or file not present in /pv-connections/customizations/embed-navbar directory.
iframe content not loaded | Check browser trace for request to /homepage/web/pageHeader is successful. Check script hostName property value - verify in console debug output.
iframe not displayed | Host page does not contain an anchor matching anchorId or anchorId value incorrect - verify anchorId in console debug output.
iframe dimensions incorrect | Verify script property values in console debug output.
embed-nav.js & embed-nav.css not loaded in pageHeader response | 1. Customizer extension does not exist in app registry. 2. Extension exists but include file paths or filenames incorrect. 3. Files are not present in the directory path referenced by the include statements.


