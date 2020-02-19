
//For Sun JVM
var sEmptyStr = " ";
function ReturnStr(sRet)
{
   if (sRet == "")
      return sEmptyStr;
   return sRet;
}
function AlertAxError()
{
   SWEAlert("Communication Agent Component is not initialized; Communications Toolbar might not function correctly.");
}
function CheckAxComm()
{
   var sRet = "OK";
   try
   {
       s_CommAxObj.IsValid();
   }
   catch(e)
   {
      sRet = "NOTOK";
   }
   return ReturnStr(sRet);
}

var hasRegAxPush = false;

function RegAxPush()
{
   if (hasRegAxPush)
      return "OK";
   var sRet = "OK";
   try
   {
      s_CommAxObj.CallBackPoint = this;
      hasRegAxPush = true;
   }
   catch (e)
   {
      sRet = "NOTOK";
   }
   return ReturnStr(sRet);
}

function CallAx(pageURL, queryString, bPush)
{
   var sRet = "OK";
   if (bPush == "1")
   {
      try
      {
         sRet = s_CommAxObj.SendPush(pageURL, queryString, document.cookie, navigator.userAgent);
      }
      catch (e)
      {
         sRet = "NOTOK";
      }
   }
   else
   {
      try
      {
         sRet = s_CommAxObj.SendCmd(pageURL, queryString, document.cookie, navigator.userAgent);
         sRet = decode(sRet);
      }
      catch (e)
      {
         sRet = "NOTOK";
      }
   }
   return ReturnStr(sRet);
}

function AxCallBack(data)
{
   var sRet = "OK";
   try
   {
   //-- Sample Data format --
   //<command name="EnableControl" control="Initiate Work" value="true" />
   //<chat>Chat Data</chat>
   //<command name="EnableControl" control="Not Ready" value="true" />
   //<chat>Chat Data</chat>
   //<chat>Chat Data</chat>
   //<chat>Chat Data</chat>
   //<command name="UpdateMenu" control="#89" value="true" />

      var pushMessage = "";
      var sChatMsg = "";
      var sCTIMsg = "";

      // appending <root> element for DOM operations further

      var str = "<root>" + data + "</root>" ;
      //alert("Start:"+str);

      //If IE
      if (window.ActiveXObject)
      {
         var doc=new ActiveXObject("Microsoft.XMLDOM");
         doc.async="false";
         doc.loadXML(str);
      }

      //If Mozilla, Firefox, Opera, etc
      else
      {
         var parser=new DOMParser();
         var doc=parser.parseFromString(str,"text/xml");
      }

      var xmlData=doc.documentElement;
      var length =xmlData.childNodes.length;
      // Loop over all child nodes for the root element and send chat nodes to the chat ActiveX and
      // other nodes content are appended to sCTIMsg to be sent to the toolbar.
      for (i=0; i < length; i++)
      {
         if(xmlData.childNodes[i].nodeName == "chat")
         {
            processChatMessage(xmlData.childNodes[i]);
         }
         else
         {
            sCTIMsg+= xmlData.childNodes[i].xml;
         }
      }

      // All the CTI data is sent @ once
      //if any escape sequence is present in data like   ->Call From... then the
      //sCTIMsg contains the data like -&gt;Call From...
      //In order to change it to normal sequence character this decode function is used.
      origMessage=decode(sCTIMsg);
      // Fix for FR#12-1V41T11, for Firefox compatibility
      document.getElementById("Communication").SetPushData(origMessage);
      sRet = "OK";
   }
   catch (e)
   {
      sRet = "NOTOK";
   }
   return sRet;
}

//If XML is having any escape sequences like &gt; or &lt; then
//this function will replace it with ">" or "<".
//*****IMPORTANT*********//
//PLEASE DON't CHANGE THE ORDER of REPLACE IN THE BELOW METHOD.//
//Always "&amp" has to be replaced first.
//*****IMPORTANT*********//
// for bug17621285, we move the xml encoding to server side and, only 
// escape '&', '<' and """, so we remove decode for '&apos;' here.
// for '&gt;', still need it, since if there is '>' in the xml attribute value, 
// after getting xml by xmlData.childNodes[i].xml, '>' will become '&gt;'.
// And we should decode '&amp;' at last, since if do it at first, after 
// encoding and decoding, "&lt;" will become "<" but not "&lt;"
function decode(pushMessage)
{   
   pushMessage = pushMessage.replace(new RegExp("&lt;","g"), "<");
   pushMessage = pushMessage.replace(new RegExp("&gt;","g"), ">");
   pushMessage = pushMessage.replace(new RegExp("&quot;","g"), "\\\"");
   pushMessage = pushMessage.replace(new RegExp("&amp;","g"), "&");
   return(pushMessage);
}

//not related to swe
//In Section 508, swe shortcut key triggers toolbar command though this callback function.
//In old SI mode, swe shortcut key couldn't invoke service method directly.
//So Jieping suggested this workaround. We might not need this now.
function RegisterCallbackFunction()
{
   try
   {
      //App().Register(this, InvokeCommand_CTI);
      if (top._swescript.RegisterCTIHandle)
         top._swescript.RegisterCTIHandle(this, InvokeCommand_CTI);
      else
         TimerID = setTimeout("RegisterCallbackFunction()",500)
   }
   catch (e) {}
}
// used to invoke the method of Communication Client
function InvokeCommand_CTI(cmd)
{
   try
   {
      // Fix for FR#12-1V41T11, for Firefox compatibility
      document.getElementById("Communication").InvokeCommandForSI(cmd);
   }
   catch (e) {}
}

function getIEFrameText(f)
{
   var oDoc = null;

   try
   {
     oDoc = f.document;
   }
   catch(e)
   {
     return sEmptyStr;
   }

   if (oDoc!=null)
   {
      var oSel = oDoc.selection;
      if (oSel != null && oSel.type!="None")
      {
         var oRange = oSel.createRange();
         if (oRange!=null)
         {
            if (oRange.text!="")
            return oRange.text;
         }
      }
   }
   for (var i=0; i<f.length; i++)
   {
      var sSelText = getIEFrameText(f.frames[i]);
      if (sSelText!="")
         return sSelText;
   }
   return sEmptyStr;
}
function GetNetScapeFrameText(f)
{
   var oDoc = f.document;
   if (oDoc!=null)
   {
      var oSel = oDoc.getSelection();
      if (oSel != "")
         return oSel;
   }
   for (var i=0; i<f.length; i++)
   {
      var sSelText = GetNetScapeFrameText(f.frames[i]);
      if (sSelText!="")
         return sSelText;
   }
   return sEmptyStr;
}
function getSelText()
{
   var text;
   if (fIsIE() == 1)
   {
      text = getAxSelText();
      if (text == "")
         text = getIEFrameText(top);
   }
   else
   {
      text = GetNetScapeFrameText(top);
   }
   return URLEncode(text);
}

function fIsIE()
{
   var name = navigator.appName;
   if (name == "Microsoft Internet Explorer")
      return 1;

   return 0;
}

function bringToFront()
{
   top.focus();
}

function showCommSrvrAbandonedAlertBox()
{
   // Please replace or change the message below for your language setting.
   // The message is used to notify the end user that Comm. Server is down and
   // the toolbar will be reset. Some of toolbar functions(e.g. make call, accept
   // email and etc.) will be disabled.
   SWEAlert("Connection to communications server is down. Toolbar is reset!");
}

var frameHasMsglayer = -1;
function locate_frameHasMsglayer() {
   var obj;
   try
   {
    if (frameHasMsglayer < 0)
    {
      var frameNumber = top._sweclient.frames.length;
      for (var i=0; i<frameNumber; i++)
      {
         obj = top._sweclient.frames[i].document.getElementById('MsgLayer');
         if (obj!=null)
         {
            frameHasMsglayer = i;
            return;
         }
      }
    }
   }
   catch(e)
   {
   }
}
function getMessageText()
{
   var msg;

   locate_frameHasMsglayer();
   if (frameHasMsglayer < 0)
      return;
   try
   {
      var obj = top._sweclient.frames[frameHasMsglayer].document.getElementById('MsgLayer');
      if (obj!=null)
      {
         msg = obj.innerHTML;

         // remove "<span class='Message'> " and " </span>"
         var len = msg.length;
         if (len > 31)
            msg = msg.substr(20, len-28);
         else
            msg = null;
      }
   }
   catch(e)
   {
   }
   // don't use escape()
   return ReturnStr(msg);
}

var msgTimer;   // global varible to fix 12-F100Y1
function setMessageText(msg, timeout)
{
   clearMessage();

   locate_frameHasMsglayer();
   if (frameHasMsglayer < 0)
      return;
   try
   {
      var obj = top._sweclient.frames[frameHasMsglayer].document.getElementById('MsgLayer');

      if (obj!=null)
      {
         if (msgTimer!=null)
            clearTimeout(msgTimer);
         if(msg.length>75)
         {
            var title = msg;
              msg = msg.substr(0,75) + "...";
           obj.innerHTML = "<span class='Message' + title='" + title + "'> " + " " + msg + " </span>";
         }
         else
         {
            obj.innerHTML = "<span class='Message'> " + msg + " </span>";
         }

         // workaround for Netscape on Solaris
         if (typeof (timeout) == "object")
            timeout = parseInt (timeout);

         msgTimer = setTimeout('clearMessage()',timeout);
      }
   }
   catch(e)
   {
   }
}
function clearMessage()
{
   locate_frameHasMsglayer();
   if (frameHasMsglayer < 0)
      return;
   var obj = top._sweclient.frames[frameHasMsglayer].document.getElementById('MsgLayer');
   if (obj!=null)
   {
      obj.innerHTML="";
   }
}

function getScreenWidth()
{
   return screen.availWidth;
}

function getWindowWidth()
{
   if (navigator.appName == "Netscape") // Netscape
   {
      return innerWidth;
   }
   else // Internet Explorer
   {
      return document.body.offsetWidth;
   }
}

function OnResize()
{
   try
   {
      if (navigator.appName == "Netscape")
			// Fix for FR#12-1V41T11, for Firefox compatibility
         document.getElementById("Communication").OnResize(getWindowWidth());
   }
   catch(e) {}
}

function OnResize_IE()
{
   try
   {
      if (navigator.appName != "Netscape")
			// Fix for FR#12-1V41T11, for Firefox compatibility
         document.getElementById("Communication").OnResize(getWindowWidth());
   }
   catch(e) {}
}

function Resize()
{
   try
   {
      window.resizeBy(0, 0);
   }
   catch(e) {}
}

//Return Code:
// true: implicit save ok
// false: implicit save fail
function implicitSave(bEnabled)
{
   //Check whether we need save
   if(bEnabled == "0")
      return true;
      
   var bLoseFocus = true;
   try
   {
      var view = App().GetMainView();
      if (view != null)
      {
         var applet = view.GetActiveApplet();
         if (applet != null)
         {
            var bVal = applet.InvokeMethod("OnFocus", App().NewPropertySet());
            if(bVal == true)
            {
               bLoseFocus = applet.InvokeMethod("LoseFocus", App().NewPropertySet());
               if (bLoseFocus == true)
               {
                  applet.InvokeMethod("OnFocus", App().NewPropertySet());
               }
            }
            //alert("LoseFocus:" + bLoseFocus);
         }
      }
   }
   catch(e)
   {
      SWEAlert("implicitSave:"+e);
   }
   return bLoseFocus;
}

//done
function getFocusInfo()
{
   var sRet = "NOTOK";
   try
   {
      sRet = s_CommAxObj.GetFocusInfo(App());
   }
   catch(e)
   {//comment out to support SI+ mode.
    //since, there is no s_CommAxObj
      //SWEAlert("getFocusInfo:"+e);
      return false;
   }
   return ReturnStr(sRet);
}

function showPopupBySWE(url, sH, sW)
{
   var sRet = sEmptyStr;
   try
   {
      if (SWEIsHighInteract)
      {
         bringToFront();
         sRet = s_CommAxObj.ShowPopup(App(), url, sH, sW);
      }
      else
      {
         // workaround for Netscape on Solaris
         if (typeof (sH) == "object")
            sH = parseInt (sH);
         if (typeof (sW) == "object")
            sW = parseInt (sW);

         SWEShowPopup(url, sH, sW);
      }
	  
	  bringToFront();
   }
   catch(e)
   {
      SWEAlert("showPopupBySWE:"+e);
   }
   return ReturnStr(sRet);
}

function showDocumentBySWE_GotoView(sURL, target, viewName, bEnabled)
{
   var sRet = sEmptyStr;
   try
   {
      if (implicitSave(bEnabled)==true)
         sRet = s_CommAxObj.GotoView(top, App(), sURL, target, viewName);
   }
   catch(e)
   {
      SWEAlert("showDocumentBySWE_GotoView:"+e);
   }
   return ReturnStr(sRet);
}

//used by pop Search center
function showDocumentBySWE(sURL, target, bEnabled)
{
   var sRet = sEmptyStr;
   try
   {
      if (implicitSave(bEnabled)==true)
         sRet = s_CommAxObj.GotoView(top, App(), sURL, target, "");
   }
   catch(e)
   {
      SWEAlert("showDocumentBySWE:"+e);
   }
   return ReturnStr(sRet);
}

function IsFrameExist(sTarget)
{
   var bExist = false;
   try
   {
      bExist = s_CommAxObj.IsFrameExist(top, sTarget);
   }
   catch(e)
   {
      SWEAlert("IsFrameExist:"+e);
      return bExist;
   }

   return bExist;
}
//done
function getAxSelText()
{
   var sRet = sEmptyStr;
   try
   {
      sRet = s_CommAxObj.GetSelectText(App());
   }
   catch(e)
   {//comment out to support SI+ mode.
    //since, there is no s_CommAxObj
      //SWEAlert("getAxSelText:"+e);
   }
   return ReturnStr(sRet);
}
//need to figure out how to test
function showDocumentBySWECache(inputPropStr, bEnabled)
{
   var sRet = sEmptyStr;
   try
   {
      if (implicitSave(bEnabled)==true)
         sRet = s_CommAxObj.CallSWEAsString(App(), inputPropStr);
   }
   catch(e)
   {
      SWEAlert("showDocumentBySWECache:"+e);
   }
   return ReturnStr(sRet);
}
//done
function CallRPC(pageURL, queryString, bEnabled)
{
   //where is the matched function for SetBusy()
   var sRet = sEmptyStr;
   try
   {
      //FR#12-1OLHNJC
      if (implicitSave(bEnabled)==true)
         sRet = s_CommAxObj.CallRPC(App(), pageURL, queryString);
   }
   catch(e)
   {
      SWEAlert("CallRPC:"+e);
   }
   return ReturnStr(sRet);
}

//swe still support
function isPopupPending ()
{
   var bPopupPending = new Boolean (false);

   try
   {
      if (!SWEPopupGainFocus())
      {
         bPopupPending = false;
      }
      else
      {
         bPopupPending = true;
      }
   }
   catch (e)
   {
      SWEAlert("isPopupPending:"+e);
   }

   return (bPopupPending.toString ());
}

function UpdateCmdMgrMenu(sCmd, sStatus)
{
   var sRet = sEmptyStr;
   try
   {
      sRet = s_CommAxObj.UpdateCmdMgrMenu(App(), sCmd, sStatus);
   }
   catch(e)
   {
      SWEAlert("UpdateCmdMgrMenu:"+e);
   }
   return ReturnStr(sRet);
}

function DoSWEEncodeCmd(sCmd, bEnabled)
{
   var sRet = sEmptyStr;
   try
   {
      if (implicitSave(bEnabled)==true)
         sRet = s_CommAxObj.DoSWEEncodeCmd(App(), sCmd);
   }
   catch(e)
   {
      SWEAlert("DoSWEEncodeCmd:"+e);
   }
   return ReturnStr(sRet);
}

function RecordEvent(eventName, param)
{
   try
   {
      s_CommAxObj.RecordEvent(App(), eventName, param);
   }
   catch(e)
   {
      SWEAlert("Cannot record event! " + eventName);
   }
}

function InvokeAutoRequest(functionName, param)
{
   try
   {      
		// Fix for FR#12-1V41T11, for Firefox compatibility
      document.getElementById("Communication").InvokeAutoRequest(functionName, param);
   }
   catch (e)
   {
      SWEAlert("Cannot InvokeAutoRequest! " + propName);
      return null;
   }
   return "OK";
}

function GetProperty(propName, param)
{
   try
   {
      // Fix for FR#12-1V41T11, for Firefox compatibility
      var result = document.getElementById("Communication").GetProperty(propName, param);
   }
   catch (e)
   {
      SWEAlert("Cannot get property! " + propName);
   }
   return result;
}

function GetAllButtonNames(dummy1, dummy2)
{
   try
   {
      // Fix for FR#12-1V41T11, for Firefox compatibility
      var sRet = document.getElementById("Communication").GetAllButtonNames();
   }
   catch (e)
   {
      SWEAlert("Error in calling GetAllButtonNames! " + e);
   }
   return sRet;
}

function OnLoad()
{
   try
   {
      s_CommAxObj.OnLoad(App());
   }
   catch (e)
   {
      SWEAlert("Error in calling OnLoad! " + e);
   }
   return RegAxPush();
}

// correct the function name, although the function is not used
// it is not OnUnLoad, but OnUnload
function OnUnload()
{
   try
   {
      s_CommAxObj.OnUnload();
   }
   catch (e)
   {
      SWEAlert("Error in calling OnUnload! " + e);
   }
}

function processChatMessage(objChatNode) {

   // Process the chat node and send the notify to the chat ActiveX

   try {
      var targetframe = objChatNode.getAttribute('targetframe');
      var targetobject = objChatNode.getAttribute('targetobject');
      var messagetype = objChatNode.getAttribute('messagetype');
      var chatdata = null;

      var target = findObject(targetframe, targetobject);   // Some caching logic, if feasible.

      if(target != null) {

         // For each chat data found NOTIFY is called
         sChatMsg = objChatNode.xml;
         if (messagetype == "text") {

            chatdata = objChatNode.getElementsByTagName("info")[0].text;

            // no decode for text message. Chat use special encording, and will decode in Ax
            target.Notify(chatdata);
         }
         else {
            chatdata = objChatNode.getElementsByTagName("info")[0].xml;
            target.Notify(decode(chatdata));
         }
      }
   }
   catch (e){
      // if anything wrong delivering chat notification, we still should to be able to do "SetPushData"
               // so just ignore and try next message
  }
}

function findObject(sFrameName, sObjName)
{
   var objFrame = null;
   var objObjectRef = null;

   objFrame = findFrame(top.frames, sFrameName);
   if (objFrame != null)
   {
      // set the value of the object in the found frame.
      objObjectRef = objFrame.document.getElementById(sObjName);
      if (objObjectRef == 'undefined')
      {
         objObjectRef = null;
      }
   }
    // return ref to the object found or null if not found.
    return objObjectRef;
 }

function findFrame(objFrames, sFrameName)
{
   if (objFrames == null || objFrames == 'undefined')
   {
      return null;
   }

   if (objFrames.length < 1)
   {
      return null;
   }

   // loop through this level of frames to see if we can find the one we want
   for (var i = 0; i < objFrames.length; i++)
   {
      if (objFrames[i].name == sFrameName)
      {
         // found it
         return objFrames[i];
      }
   }

   // loop through frames and recurse the frame tree to find the frame.
   var objFrameFound = null;
   for (var i = 0; i < objFrames.length; i++)
   {
      // dive down into the frame
      objFrameFound =  findFrame(objFrames[i], sFrameName);
      if (objFrameFound != null)
      {
         // found it
         return objFrameFound;
      }
   }

   return null;
}


