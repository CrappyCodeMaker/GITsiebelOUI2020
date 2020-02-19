
Store your JavaScript customization in this folder.

The migration tool async2sync.pyc changes the Disconnected Mobile client JavaScript files to 
synchronous programming model with the following changes:
  - The $.setReturnValue are replaced with an assigment to "currRetValue"
  - The $.callback are removed and retrieving the value from "currRetValue" Synchronously

Async2Sync Migration Steps:
  1. Install python 2.7 on one server which can be Windows/Linux/etc OS
  2. Copy the folder scripts/siebel/offline/custom to another folder, for example, c:\anotherfolder\custom
  3. Execute the async2sync.pyc to migrate the JavaScript in the custom folder by executing:
     $ python async2sync.pyc -folder c:\anotherfolder\custom
     The ouput files will be put in folder c:\anotherfolder\custom\output
  4. Apply the processed JS files on the Siebel Web Server
    4.1 Backup the scripts/siebel/offline/custom folder for any possible restore
    4.2 Copy the output JS files from c:\anotherfolder\custom\output to scripts/siebel/offline/custom
  5. Launch the application from the browser to test the new JS files

