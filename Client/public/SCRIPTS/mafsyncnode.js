//function storeSyncNodeId(appName,langCode,userName,syncNodeId,url)
function storeSyncNodeId(isMultiApp,userloc,userName,syncNodeId,url)
{
   adf.mf.api.invokeMethod("com.oracle.determinations.mobile.application.SyncNodes", 
                           "setSyncNodeId", 
                           userloc, 
                           syncNodeId,
                           function(req,res) {                              
                              window.location.replace (url);
                              console.log("Store sync node identity successfully.");
                           },  
                           function (req,res) {
                              
                              var itemName = isMultiApp?userloc + '.' + 'SyncNodeId':'SyncNodeId' ;
                              window.localStorage.removeItem(itemName);
                              
                              itemName = isMultiApp?userloc + '.' + 'BatchMode':'BatchMode';
                              window.localStorage.removeItem(itemName);
                              
                              window.location.replace (url);
                              console.log("Failed to store sync node identity.");           
                           }
                          ); 
}                             