# Enable Slack Chat Integration in Connections-  
## SLACK 1-1 CHAT  
The appregistry extension in this folder enable 1-1 chat from the important to me bar, the bizcard and the user profile page in Connections.
The json can either be imported from file or copied / pasted into the code editor of the appregistry client to create the extensions.  

### Important To Me –
#### Start a chat directly from Slack Chat Bubble present in Important to Me:  

![image](https://user-images.githubusercontent.com/82148048/120439259-f0142300-c39f-11eb-94ba-f6aff25d0a76.png)

#### Start a chat directly from bizcard present in Important to Me:  

![image](https://user-images.githubusercontent.com/82148048/120439370-133ed280-c3a0-11eb-96eb-ff31f56828e9.png)

Start a 1-1 chat with user via standard https: web link which will ask the user if they wish to continue in the Slack desktop client or the web browser.  

### Bizcard & Profiles -  

#### Start a chat directly from the bizcard:  

![image](https://user-images.githubusercontent.com/82148048/120439451-28b3fc80-c3a0-11eb-91d3-5a9978d6ff1e.png)

#### Start a chat directly from the profile:  

![image](https://user-images.githubusercontent.com/82148048/120439504-38cbdc00-c3a0-11eb-8da1-0e1238ff4247.png)  

Start a 1-1 chat with user via standard https: web link which will ask the user if they wish to continue in the Slack desktop client or the web browser.  

The json from slackChat.json can either be imported from file or copied / pasted into the code editor of the appregistry client to create the extension. This one extension is used to enable the 1-1 chat for both bizcard, profile page and ITM bubble.



### Procedure for enabling slack chat integration -  

### STEP 1 - Slack Environment 

- Login to Slack –  
  https://slack.com/get-started#/createnew  
  
  ![image](https://user-images.githubusercontent.com/82148048/120439558-48e3bb80-c3a0-11eb-94b4-7810823dd59f.png)
 
- Create a workspace or open any of the workspaces available for you.  
  
  ![image](https://user-images.githubusercontent.com/82148048/120439626-5a2cc800-c3a0-11eb-809e-7176478a085b.png)
  
 - Navigate to following URL - 
   https://api.slack.com/apps/  
  
   ![image](https://user-images.githubusercontent.com/82148048/120439706-6e70c500-c3a0-11eb-9b51-52baf01b136d.png)  
  
 - Create a new App or select any existing app.  
 
   #### For new Apps,  
   - For creating a new App click on the option ‘Create New App’ and provide the ‘App Name’ and select the ‘Development Slack Workspace’ from the dropdown, then click ‘Create App’.  
   
     ![image](https://user-images.githubusercontent.com/82148048/120439744-7d577780-c3a0-11eb-962a-60eade499c8a.png) 
   
   - The newly created app will appear in the app list.  
   
     ![image](https://user-images.githubusercontent.com/82148048/120439791-8f391a80-c3a0-11eb-874f-6e176c2c27a5.png)  
   
   - Click on the newly created App for ex. Test Slack Chat. Within Features Tab on left hand panel, then select ‘OAuth & Permissions’.
   
     ![image](https://user-images.githubusercontent.com/82148048/120439854-9f50fa00-c3a0-11eb-9135-996d5a360970.png)
     
   - Scroll down to section ‘Scopes’ and add following permissions to ‘User Token Scopes’.
     - users:read
     - users:read.email  
     
     ![image](https://user-images.githubusercontent.com/82148048/120439917-b09a0680-c3a0-11eb-8ba9-04e0cc25413e.png) 
     
   - Now scroll up and click on ‘Install to Workspace’ to generate OAuth Tokens. It will ask to grant the permissions. Select ‘Allow’.  
   
     ![image](https://user-images.githubusercontent.com/82148048/120439980-c0194f80-c3a0-11eb-88fd-656067c4a34e.png)  
     
   - Copy the User OAuth Token, we need to provide this OAuth Token within the slack extension in App registry.  
   
     ![image](https://user-images.githubusercontent.com/82148048/120440039-d0312f00-c3a0-11eb-9015-254a4dcef7dc.png)  
     
   #### Or for existing apps,  
   
   - Click on any existing ‘App’ for ex. Test Connection Integration.  
   
     ![image](https://user-images.githubusercontent.com/82148048/120440142-eb03a380-c3a0-11eb-8fe1-c59f313c3f16.png) 
     
   - Within Features Tab on left hand panel, select ‘OAuth & Permissions’.
   
     ![image](https://user-images.githubusercontent.com/82148048/120440222-f787fc00-c3a0-11eb-8da2-5b60b36fd981.png)
     
   - Copy the User OAuth Token, we need to provide this OAuth Token within slack extension in App registry. Make sure to check by scrolling down, that within section ‘Scopes’, following permissions are present within ‘User Token Scopes’.
     - users:read
     - users:read.email  
     
     ![image](https://user-images.githubusercontent.com/82148048/120440280-0078cd80-c3a1-11eb-9f5b-08a1188eccf2.png)  
     
### STEP 2 - Registering the Customizer Extension  

For Customizer to insert this customization:  

Put all the files present in this folder onto the Connections environment in a /pv-connections/customizations/slackChat directory.  

NOTE - The files are present at following location  

       https://github.com/apurvajain168/connections-samples/tree/main/customizer/samples/slackChat
       
### STEP 3 – Appregistry Extension  

1.	Launch the appregistry UI at /appreg/apps URL (requires admin access) or navigate to https://yourConnectionsUrl.com/appreg/apps.
2.	In the apps manager, click New App.
3.	On the Code Editor page, either clear the default outline json that is created by default and then paste in the json (if already copied to clipboard from the appropriate json file) or click Import, browse for the JSON file containing the application, and select the file.
    The code that you import is validated and error messages display in the editing pane, where you can make corrections if needed.  
    
    NOTE - The json is present at following location  
    
           https://github.com/apurvajain168/connections-samples/tree/main/customizer/samples/slackChat 
    
4.	Copy the ‘OAuth Token’ from Step 1 within the ‘description’ in the json.  

    ![image](https://user-images.githubusercontent.com/82148048/120440328-0bcbf900-c3a1-11eb-860a-835b283df3d3.png)

5.	Click Save to save the imported app.
6.	A new card should be displayed in the app list; enable or disable, as necessary.
7.	On enabling the extension, the slack chat icon will appear in profile ui, bizcard ui and bizcard present in itm. On clicking the slack chat icon, it will be re-directed to slack chat if the user is a valid slack chat one.  


NOTE – Connections Slack Chat Integration is not supported in IE as slack does not provide support in IE. For more details, please refer to the link or the screenshot –  

https://slack.com/intl/en-in/help/articles/115002037526-Minimum-requirements-for-using-Slack#:~:text=Note%3A%20Google%20Chrome%20is%20the%20only%20browser%20that%20supports%20Slack%20Calls.  

![image](https://user-images.githubusercontent.com/82148048/120440354-15556100-c3a1-11eb-9bec-024437032e46.png)





   

   
