///////////////////////////////////////////////////////////////////////////////
//
// Copyright (C) 2002, Siebel Systems, Inc., All rights reserved.
//
// FILE:       swecommon_top.js
//
// CREATOR:    Iannis Hanen
//
// DESCRIPTION
//    
// This file contains JavaScript functions included in the hidden frame in HI
// and included in the layout in LI/SI+.
//
/////////////////////////////////////////////////////////////////////////////

var iRef = 0;        //Accessibility: Phase3 
var minutesRemToTimeout = 0;        //Accessibility: Phase3 
var secondsRemToTimeout = 0;
var sessExtendMinutes = 0;          
var sessExtendSeconds = 0;        //Accessibility: Phase3
var _SWEFrameTitleAry = new Array();  //Bug:11671230 : global array to store the frame titles

// function for drilldown from a field
// Expected args for name1 list are SWEField, SWERowId, and SWERowIds
function c_d (name1, value1, name2, value2, target)
{
   var url;
   if (value2.length >= 1) url = value2 [0] + "?";
   if (name1.length == value1.length)
   {
      for (var i = 0; i < name1.length; i++)
      {
         url += name1[i] + "=" + URLEncode(value1[i]);
         if (i < name1.length - 1) url += "&";
      }

      if (name2.length > 0) url += "&";
      if (name2.length == value2.length - 1)
      {
         for (var j = 0; j < name2.length; j++)
         {
            url += name2[j] + "=" + URLEncode(value2[j + 1]);
            if (j < name2.length - 1) url += "&";
         }

       if(IsOpenUI()){
           App().GotoView("", "", url, "");
       }
       else
          SWETargetGotoURL(url, target);
      }
   }
}

function EvalFrame (frameName) 
{
   var aTemp = frameName.split(".");
   var frame = "";

   for (var i = 0; i < aTemp.length; i++) 
   {
      frame += aTemp[i];
      if (typeof(eval(frame)) == 'undefined')
         return false;
      frame += ".";
   }
 
   return true;
}


function HtmlEncode(orig)
{
   if (orig == null)
      return "";

   return orig.replace (/&/g, "&amp;").
               replace (/\'/g, "&#039;").
               replace (/\"/g, "&quot;").
               replace (/>/g, "&gt;").
               replace (/</g, "&lt;");
               
}

function HtmlDecode(orig)
{
   if (orig == null)
      return "";

   return orig.replace (/&amp;/g, "&").
               replace (/&#039;/g, "'").
               replace (/&quot;/g, '"').
               replace (/&gt;/g, ">").
               replace (/&lt;/g, "<");
               
}

function IsSWEPopup(windowObj)
{
   // Not checking for SWEPopupWin because it would not work in HI app,
   // so now basically returns !(mainview).
   if (typeof(windowObj) == "object")
      return (windowObj.top != Top());

   return false;
}

// This function works only for SI since it checks for SWEPopupWin, which is null for HI.
function IsSWEPopupOpen()
{
   return (!Top().IsSWEHighInteract && 
           Top().SWEPopupWin != null && 
           typeof(Top().SWEPopupWin.closed) != "unknown" && 
           !Top().SWEPopupWin.closed);
}

// User operation is from popup window:
//    If current popup has been modified, indicated by bCurrentPopupModified, return true
//    Otherwise return false
// User operation is from main view:
//    If popup flag is not empty, return true
//    If main view flag is not empty, return true
//    Otherwise return false
function pendingChanges(bFromPopup)
{
	// Fix for FR # 12-P2969B
   if (bFromPopup)
      return (Top().bCurrentPopupModified && 
              (typeof(Top().popupAppletWithChanges) != "undefined" && Top().popupAppletWithChanges.length > 0));
   // End of Fix #12-P2969B
   
   // If comes here means user operation is from main view

   // In NS, ResetPopupDataLossWarningVars() won't be triggered when popup is closed by X button,
   // so we need to check that the popup is open before we use generate warning for it.
   // There is no need to check for HI app like in stopForSavingData() because HI popups are modal, 
   // i.e. if it comes here means popups are already closed.

   // Fix for FR # 12-1PBEKY6. Used bCurrentPopupModified flag to make sure that
   // the pending changes is for the current popup applet and not for any parent frame.
   if (IsSWEPopupOpen() && Top().bCurrentPopupModified && 
       typeof(Top().popupAppletWithChanges) != "undefined" && Top().popupAppletWithChanges.length > 0) 
      return true;

   if (typeof(Top().activeAppletWithChanges) != "undefined" && Top().activeAppletWithChanges.length > 0)
      return true;

   return false;
}

function ResetCurrentPopupModified()
{
   Top().bCurrentPopupModified = false;
}

function ResetPopupDataLossWarningVars()
{
   Top().bCurrentPopupModified = false;
   Top().popupAppletWithChanges = "";
}

function ResetScreen()
{
   if (top.bResetScreen == true)
   {
      SetScreen(top.actScreenName);
   }
   else
      top.bResetScreen = false;
}

function SetScreen(screenName, cnt, screenTab)
{
   var objFrame = SWEFindFrame(top, "_swescrnbar");
   if (objFrame == null)   return;
   if (typeof top.bScreenTabLoaded != "undefined")
   {
      objFrame.st_scrn(screenName, cnt, screenTab);
      top.bResetScreen = false;
   }
   else
   {
      top.actScreenName = screenName;
      top.bResetScreen = true;
   }
}

function StopForSavingData(bFromPopup)
{
   // bFromPopup could be undefined, as is the case when StopForSavingData() is called
   // from SetCurrentAppletIndex() (sweutil_keyboard.js, which is in hidden
   // frame whose 'top' is inaccurate).  We want to treat that case as main view
   // operation because SI focus tracking is only on main view.
   if (typeof(bFromPopup) == "undefined")
      bFromPopup = false;

   if (!pendingChanges(bFromPopup))
      return false;

   var message;
   if (Top().SWEIsHighInteract)
      message = App().GetLocalString("SWEDataLossWarning");
   else	
      message = _SWEgetMessage("SWEDataLossWarning");

   var ret;

   // In NS, ResetPopupDataLossWarningVars() won't be triggered when popup is closed by X button,
   // so we need to check that the popup is open before we use generate warning for it.
   // IsSWEPopupOpen() always return false for HI apps, so in HI app we need to
   // check if popup flag is to be used for warning msg (NS problem does no apply for HI).
   if ((IsSWEPopupOpen() || Top().SWEIsHighInteract) &&
       typeof(Top().popupAppletWithChanges) == "string" && Top().popupAppletWithChanges.length > 0)
   {
      ret = SWEConfirm(message.replace(/%1/, Top().popupAppletWithChanges));
   }
   else
   {
      ret = confirm(message.replace(/%1/, Top().activeAppletWithChanges));
   }

   if (ret == true)
   {
      ResetPopupDataLossWarningVars();  // Always clear popup data loss warning flags
      if (!bFromPopup)  // Cleared only if user op is from main view
         Top().activeAppletWithChanges = "";
   }

   return !ret;
}

function SWEAlert (text)
{
   if (Top().SWEIsHighInteract)
   {
      App().ShowMessage("MSGBOX_ALERT", text);
      return;
   }   
   
   if (Top().bEnablePrompt != null)
      Top().errMsg = text;

   if (Top().bEnablePrompt == null || 
      Top().bEnablePrompt == true)
   {
      var popWin  = Top().SWEPopupWin;

      if (top.SWEPopupWin != null && !top.SWEPopupWin.closed)
          popWin.alert(text);
      else {
          if (typeof (SiebelApp) !== "undefined" && SiebelApp && SiebelApp.Utils && typeof (SiebelApp.Utils.Alert) === "function") {
            SiebelApp.Utils.Alert(text);
         }
         else {
            alert(text);
         }
      }
   }
}



function SWEAppendArgsToURL (url, arg, value)
{
   //handle with the anchor tag - we would only allow one # in the argument
   var result = url.split("#");
   if (result != null && result.length == 2)
      url = result[0] + "&" + URLEncode(arg) + "=" + URLEncode(String(value)) + "#" + result[1];
   else
      url += "&" + URLEncode(arg) + "=" + URLEncode(String(value));
   return url;
}

//default focus
function SetDefaultFocus()
{
  if (Top()._swescript != null && typeof (Top()._swescript) != 'undefined')
  {
    Top()._swescript.SetDefaultApplet(Top()._defaultAppletName);
    Top().bFocusShouldBeReset = true;
    Top().bArraysShouldBeRefreshed = true;
    Top()._swescript.RefreshArrays();
  }
  
} 
//default Focus 

function SWEClosePopup()
{
   if (Top().SWEPopupWin != null && 
       typeof(Top().SWEPopupWin.closed) != "unknown" && 
       !Top().SWEPopupWin.closed)
   {
      Top().SWEPopupWin.close();
      Top().SWEPopupWin = null;
   }
   if (Top().SWEPopupWin2 != null && 
       typeof(Top().SWEPopupWin2.closed) != "unknown" && 
       !Top().SWEPopupWin2.closed)
   {
      SWEClosePopup2();
   }
}

function SWEClosePopup2()
{
   if (Top().SWEPopupWin2 != null && Top().SWEPopupWin2.open)
   {
      Top().SWEPopupWin2.close();
      Top().SWEPopupWin2 = null;
   }
}

function SWECloseJannaPopup()
{
   if (Top().SWEJannaPopupWin != null && 
       typeof(Top().SWEJannaPopupWin.closed) != "unknown" && 
       !Top().SWEJannaPopupWin.closed)
   {
      Top().SWEJannaPopupWin.close();
      Top().SWEJannaPopupWin = null;
   }
   
}


function SWEConfirm (confirmMessage)
{
   if (Top().SWEIsHighInteract)
   {
      return (App().ShowMessage ("MSGBOX_CONFIRM", confirmMessage));
   }

   if (Top().bEnablePrompt != null &&
      Top().bEnablePrompt == false)
   {
      //surpress confirm dialog   
      if (Top().bConfirm == null)
         return true;
      else
         return Top().bConfirm;
   }
   else
   {
      var popWin  = Top().SWEPopupWin;

      if (top.SWEPopupWin != null && !top.SWEPopupWin.closed)
         return popWin.confirm(confirmMessage);
      else {
          if (typeof (SiebelApp) !== "undefined" && SiebelApp && SiebelApp.Utils && typeof (SiebelApp.Utils.Confirm) === "function") {
            return (SiebelApp.Utils.Confirm(confirmMessage));
         }
         else {
            return confirm(confirmMessage);
         }
      }
   }
}


function SWEFormReset (formObj)
{
   if (formObj == null)
      return;
      
   if (formObj.elements == null)
      return;
	
	//Reset the whole form
	formObj.reset ();
	
	//Reinit dropdown values	
   for (var i = 0; i < formObj.elements.length; i++) 
   {
      if (formObj.elements[i] == null)
         continue;
      else if (formObj.elements[i].tagName != 'SELECT')
         continue;
      else if (formObj.elements[i].options == null)
         continue;
      else if (formObj.elements[i].options.selectIndexOrigin != null)
         formObj.elements[i].options.selectedIndex = formObj.elements[i].options.selectIndexOrigin;
   }
}


function SWEGetAvailScreenHeight()
{
	if (screen.availHeight) return Math.floor(screen.availHeight*0.9); 
	else return 600;
}

function SWEGetAvailScreenWidth()
{
	if (screen.availWidth) return Math.floor(screen.availWidth*0.9); 
	else return 800;
}

function SWEGetScreenHeight()
{
	if (screen.height) return screen.height; 
	else return 600;
}

function SWEGetScreenWidth()
{
	if (screen.width) return screen.width; 
	else return 800;
}

function SWEPersonalizationDrillDown_top (viewName, appletName, fieldName, rowId, parentRowIds, target)
{
   var cacheId = "";
   
   if (viewName == null || typeof (viewName) != "string")
      viewName = '';
   
   if (appletName == null || typeof (appletName) != "string")
      appletName = '';
   
   if (fieldName == null || typeof (fieldName) != "string")
      fieldName = '';
      
   if (rowId == null || typeof (rowId) != "string")
      rowId = '';
   
   if (parentRowIds == null)
      parentRowIds = '';
      
   if (SWEIsHighInteract)
   {
      cacheId = App().GetViewCacheId ().toString();
   }
      
   viewName = viewName.replace(/\+/g, " ");
   appletName = appletName.replace(/\+/g, " ");
   fieldName = fieldName.replace(/\+/g, " ");
   var c1 = new Array ("SWERowId", "SWEField", "SWERowIds");
   var c2 = new Array (rowId, fieldName, parentRowIds);
   var c3 = new Array ("SWEApplet", "SWEView", "SWECmd", "SWEReqRowId", "SWEMethod", "SWECacheId");
   var c4 = new Array (location.pathname, appletName, viewName, "InvokeMethod", "1", "Drilldown", cacheId);
   c_d (c1, c2, c3, c4, target);
}

function SWEPersonalizationGotoScreen (screenName)
{
   var url = window.location.protocol + "//" + window.location.host + window.location.pathname;
   url += "?SWECmd=GotoPageTab&SWENeedContext=false&SWEScreen=" + screenName;
   SWEGotoURL (url);
}

function SWEPersonalizationGotoview (viewName, extraParams)
{        
   var url = window.location.protocol + "//" + window.location.host + window.location.pathname;
   url += "?SWEEP=1&SWEVI=&SWECmd=GotoView&SWEC=1&SWEView=" + viewName;
   
   if (extraParams != null && 
       (typeof (extraParams) == "string") && 
        extraParams.length > 1)
   {
      if (extraParams.charAt(0) != "&")
         extraParams = "&" + extraParams;
      url += extraParams;
   }
   
   var frameObj = SWEFindFrame (top, "_sweview");
   if (frameObj == null) 
       frameObj = this;
       
   if (!SWEIsHighInteract)
   {
      //frameObj.location = url;   
      SWETargetGotoURL(url, frameObj)
   }
   else
   {
      viewName = IsOpenUI() ? "" : viewName.replace(/\+/g, " ");
      App().GotoView(viewName, "", url, frameObj);
   }
}

var   lmsgWindow, lmsgTimerId, lmsgCur, lmsgTitle;

function SWEPopupHandler()
{
   var      w;
   w = lmsgWindow;
   clearTimeout(lmsgTimerId);

   w.document.writeln('<html><HEAD><TITLE>');
   w.document.writeln(lmsgTitle);
   w.document.writeln('</TITLE></HEAD><body bgcolor="#FFFFFF">');
   w.document.writeln(lmsgCur);
   w.document.writeln('</body></html>');
   w.document.close();
} 


function SWEPopupMessage(title, msg)
{
   lmsgCur = msg;
   lmsgTitle = title;
   lmsgWindow=window.open('','','toolbar=no,scrollbars=yes,resizable=yes,width=400,height=200');
   lmsgTimerId = setTimeout("SWEPopupHandler()", 200);
}

function SWEPosition(posX,posY)
{
	return ",top=" + posY + ",left=" + posX + ",screenY=" + posY + ",screenX=" + posX; 
}

function SWEPopupGainFocus() 
{
   if (Top().SWEIsHighInteract)
   {
      return (App().SetPopupVisible (true));
   }
   else
   {
      return (Top().SWEPopupWin != null &&
              !Top().SWEPopupWin.closed);
   }
}

// For non-Siebel popup to support eCollaboration
function SWEShowFeaturedPopup (url, name, height, width, position, feature)
{  
   // If height or width is non-positive, make the popup disappear from the screen
   if (height <= 0 || width <= 0)
   {
      height = 1;
      width  = 1;
      position = SWEPosition(1, 10000);
   }
   else if (position == null || position == "")
   {
      position = SWECenterPopup (width, height);
   }
   else
   {
      position = "," + position;
   }
   
   var features = "height=" + height + ",width=" + width + position;

   if (feature != null && feature != "")
   {
      features += "," + feature;
   }

   open (url, name, features);
}

function SWESubmitForm_top (obj, formObj, fieldName, rowId)
{
   if(IsOpenUI())
   {
      //VT:Firefox does not recognize the correct input elements of the form. SO manually cloning the input elements as its children.
      //Just checking for one of those input elements
      if(!formObj.SWEView)
       {
          var formChildren = $(formObj).parent().find('input[type=hidden]').clone();
          $(formObj).parent().children('input[type=hidden]').remove();
          $(formObj).append(formChildren);
       }
   }
   // 12-GQWT3E: Need to reset SWEJFN to blank for every form submit
   if (typeof(formObj.SWEJFN) != 'undefined' && formObj.SWEJFN != null)
      formObj.SWEJFN.value = "";

   if (typeof(obj.action) != 'undefined')
      formObj.action = obj.action;

   if (typeof(obj.target)  != 'undefined')
      formObj.target  = obj.target;
   else
      formObj.target = "_self";

   if (typeof(obj.SWECmd) != 'undefined')
      formObj.SWECmd.value = obj.SWECmd;

   if (typeof(obj.SWEMethod) != 'undefined')
      formObj.SWEMethod.value = obj.SWEMethod;

   if (typeof(obj.SWEVI) != 'undefined')
      formObj.SWEVI.value = obj.SWEVI;

   if (typeof(obj.SWEView) != 'undefined')
      formObj.SWEView.value = obj.SWEView;

   if (typeof(obj.SWEApplet) != 'undefined')
      formObj.SWEApplet.value = obj.SWEApplet;

   if (typeof(obj.SWEField) != 'undefined')
      formObj.SWEField.value = obj.SWEField;
   else if (fieldName != null) // for page size reduction
   {
      if (fieldName.length > 0)
      {
         formObj.SWEField.value = fieldName;
      }
   }

   if (!IsSWEPopup())
   {
      if (navigator && navigator.id != null &&
          typeof(formObj.SWEBID) != 'undefined')
         formObj.SWEBID.value = navigator.id;
   }

   if (typeof(obj.SWERowId) != 'undefined')
      formObj.SWERowId.value = obj.SWERowId;
   else if (rowId != null) // for page size reduction
   {
      if (rowId.length > 0 )
      {
         formObj.SWERowId.value = rowId;
      }
   }

   if (typeof(obj.SWERowIds) != 'undefined')
      formObj.SWERowIds.value = obj.SWERowIds;

   if (typeof(obj.SWEReqRowId) != 'undefined')
      formObj.SWEReqRowId.value = obj.SWEReqRowId;

   if (typeof(obj.SWESeq) != 'undefined')
      formObj.SWESeq.value = obj.SWESeq;

   if (typeof(obj.SWETF) != 'undefined')
      formObj.SWETF.value = obj.SWETF;
   else if (typeof(formObj.SWETF) != 'undefined')
      formObj.SWETF.value = "";

   if (typeof(obj.SWETargetView) != 'undefined')
      formObj.SWETargetView.value = obj.SWETargetView;
   else if (typeof(formObj.SWETargetView) != 'undefined')
      formObj.SWETargetView.value = "";

   if (typeof(obj.SWETVI) != 'undefined')
      formObj.SWETVI.value = obj.SWETVI;
   else if (typeof(formObj.SWETVI) != 'undefined')
      formObj.SWETVI.value = "";

   if (typeof(obj.SWETA) != 'undefined')
      formObj.SWETA.value = obj.SWETA;
   else if (typeof(formObj.SWETA) != 'undefined')
      formObj.SWETA.value = "";

   if (typeof(obj.SWEM) != 'undefined')
      formObj.SWEM.value = obj.SWEM;
   else if (typeof(formObj.SWEM) != 'undefined')
      formObj.SWEM.value = "";

   if (typeof(obj.SWEContainer) != 'undefined')
      formObj.SWEContainer.value = obj.SWEContainer;

   if (typeof(obj.SWEPOC) != 'undefined')
      formObj.SWEPOC.value = obj.SWEPOC;

   if (typeof(obj.SWEKeepContext) != 'undefined')
      formObj.SWEKeepContext.value = obj.SWEKeepContext;

   if (typeof(obj.SWENeedContext) != 'undefined')
      formObj.SWENeedContext.value = obj.SWENeedContext;

   if (typeof(obj.SWEDIC) != 'undefined')
      formObj.SWEDIC.value = obj.SWEDIC;

   if (typeof (obj.SWEPMV) != 'undefined')
      formObj.SWEPMV.value = obj.SWEPMV;
   else if (typeof(formObj.SWEPMV) != 'undefined')
      formObj.SWEPMV.value = ""; 
        
   if (typeof(formObj.SWETS) != 'undefined') //always append timestamp
   {
      var now  = new Date();
      formObj.SWETS.value = now.getTime();
   }
   
   // add SWEC
   if (typeof(formObj.SWEC) != 'undefined')
   {
      if (SWEIsHighInteract){
          if(IsOpenUI()) {
              formObj.SWEC.value = App().GetSWECount();          
          }
          else{
              formObj.SWEC.value = App().SWECount;
          }
      }
      else
         formObj.SWEC.value = Top().SWECount;
   }
   
   if (typeof(obj.SWEService)  != 'undefined')
      formObj.SWEService.value = obj.SWEService;
   else if (typeof(formObj.SWEService) != 'undefined')
      formObj.SWEService.value = "";
}

// unload Application by browser OnUnload event with preload:
function SWEUnloadAppQueryPara (pageURL, loginTime, queryPara, SRN)
{
   // UnloadApp does not have to be done and should not be done if we have just
   // logged out.  This detects the logout, and does not issue the UnloadApps
   // command in that case.  Not sure if this works correctly in case of URL
   // session mode.
   var sessionCookie = document.cookie;
   // FR 12-206ENF1: UnloadApp will create an anonymous session in Cookie less mode.
   //   In cookie less mode, we have to pass the _sn in the URL of the SWECmd=UnloadApp
   //   Note that I have added the test: sessionCookie.indexOf("_sn=") == -1 as user can have cookie
   //   enabled but using a Siebel Application in cookie less mode.
   var sSn=null;
   if (sessionCookie == null || sessionCookie.length == 0 || sessionCookie.indexOf("_sn=") == -1)
   {
      var topQuery = top.location.search;
      var posSn=topQuery.indexOf("_sn=");
      if (posSn == -1)
         return;
      // FR 12-206ENF1: Capturing the _sn in the URL
      var endSn= topQuery.indexOf("&",posSn);
      if (endSn == -1)
         sSn=topQuery.substring(posSn);
      else
         sSn=topQuery.substring(posSn,endSn);
   }
      
   var ns6=(navigator.appName.indexOf("Netscape")>-1 && parseInt(navigator.appVersion)>4)?true:false;
   var ie=(navigator.appName.indexOf("Microsoft")>-1 && parseInt(navigator.appVersion)>3)?true:false;

   if (ie || ns6)
   {
      var newWin;
      var actionURL;
      var now = new Date();

      if (loginTime == null)
         loginTime = "";

      // FR 12-206ENF1: UnloadApp will create an anonymous session in Cookie less mode.
      //   If we are in a cookie less mode, then we have to add the _sn in the URL.
      if (sSn == null)
        actionURL = pageURL + "?SWECmd=UnloadApp&SWETS=" + now.getTime() + "&SWELT=" + loginTime + queryPara;
      else
        actionURL = pageURL + "?SWECmd=UnloadApp&SWETS=" + now.getTime() + "&SWELT=" + loginTime + "&"+ sSn + queryPara;

      // from Browser OnUnload event, so we open a hidden window to submit url and then close itself:
      newWin = open ("", "hiddenWin", 'left=10000,top=10000,width=150,height=100');
      newWin.document.write (
         "<title>Logout</title>" +
         "<script>" +
         "this.location = '" + actionURL + "';" +
         "this.close();" +
         "</script>"
      );
   }
}

// unload Application by browser OnUnload event:
function SWEUnloadApp (pageURL, loginTime, SRN)
{
   SWEUnloadAppQueryPara(pageURL, loginTime, "", SRN);   
}

function SWEGetFullFrameName (frame)
{
   if (frame == null || frame.name == "")
      return "";

   var parentFrame = frame.parent;
   var fullFrameName = frame.name;

   while (parentFrame != null 
          && parentFrame.name != ""
          && parentFrame != top)
   {
      fullFrameName = parentFrame.name + "." + fullFrameName;


      parentFrame = parentFrame.parent;
   }


   fullFrameName = "top." + fullFrameName;

   return fullFrameName;
}

function SWEIsContainedInFrame (frame, containerFrameName)
{
   var parentFrame;

   if (frame == null || containerFrameName == null || containerFrameName == "")
      return false;

   parentFrame = frame;

   while (parentFrame != null)
   {
      if (parentFrame.name == containerFrameName)
         return true;

      //to prevent dead loops
      if (parentFrame == parentFrame.parent)
         return false;
      else
         parentFrame = parentFrame.parent;
   }

   return false;
}

function SweValidateSubmit()
{
  if ((typeof(Top().SWEAlreadySubmitted) == 'undefined') || (Top().SWEAlreadySubmitted == false))
  {
    Top().SWEAlreadySubmitted = true;
    return true;
  }
  else // if (Top().SWEAlreadySubmitted == true)
    return false;
}

function trackChange_top(activeAppletWithChanges, id, frameName, bFromPopup)
{
   if (bFromPopup)
   {
      Top().popupAppletWithChanges = activeAppletWithChanges;
      Top().bCurrentPopupModified = true;
   }
   else
   {
      // SI applet focus tracking is for main view only
      // Fix 12-G3KGYN, set active applet with change to be current applet
      if (activeAppletWithChanges != "")
      {
         if (typeof (SWEApplets) != 'undefined' && typeof(id) != 'undefined' && id != null)
         {
            var i ;
            if(Top()._swescript.bAccessibleEnhanced)
            {
               i=FindByProp (SWEApplets, "Id", "_SWEApplet" + id);
            }
            else
            {
               i=FindByProp (SWEApplets, "Id", "SWEApplet" + id);
            }
            if (i != -1)
            {
               SetCurrentAppletIndex(i);
            }
            if (typeof(frameName) != 'undefined' && frameName != null && frameName != "")
            {
               SetFirstApplet (frameName);
            }
         }
      }   
      Top().activeAppletWithChanges = activeAppletWithChanges;
   }
}

function URLEncode (orig) 
{
   var encoded;  
   var i, idx, iLimit;
   var ch;
   
   var str = orig.toString();
 
   encoded = "";

   for (i = 0, idx = 0, iLimit = str.length; i < iLimit; i++)
   {
      ch = str.charAt(i);
      if ('0'<=ch && ch<='9' || 'A'<=ch && ch<='Z' || 'a'<=ch && ch<='z')
      {
         continue;
      }
      else if (ch == '!' || ch == '*' || ch == '\'' || 
               ch == '(' || ch == ')' || ch == ',' || 
               ch == '$' || ch == '-' || ch == '_' || ch == '.')
      {
         continue;
      }
      else if (ch == ' ')
      {
         encoded += str.substring(idx, i) + "+";
         idx = i + 1;
      }
      else
      {
         var charCode = ch.charCodeAt(0);
         var charCodeHex = charCode.toString(16);
         var prefix;
         if (charCode < 16)
         {
            prefix = '%0';
         }
         else if (charCode < 128)
         {
            prefix = '%';
         }
         else if (charCode < 256)
         {
            prefix = '%u00';
         }
         else if (charCode < 4096)
         {
            prefix = '%u0';
         }
         else
         {
            prefix = '%u';
         }
         encoded += str.substring(idx, i) + prefix + charCodeHex;
         idx = i + 1;
      }
   }

   if (idx != i)
      encoded += str.substring(idx, str.length);

   return encoded;
}

function OnAppReady()
{   
   
   //Bug#14110450: Uncommented the below lines 
   //because they were causing problems in QTP-SWE handshaking
   if(!IsOpenUI())
   {
        if (Top()._swe._sweapp.S_CAS != null)
            Top()._swe._sweapp.S_CAS.OnAppReady(App());
   }  
   // FR-12-QBAOE: remove to rollback FR12-LS887Q+F
   /*
   if (Top()._swe._sweapp.S_App != null)
   {
      if (Top()._swe._sweapp.S_CAS != null)
         window.setTimeout("App().SetTopFrameLoaded()",3000);
      else
         App().SetTopFrameLoaded();
   }*/
}

///////////////////////////////////////////////////////////////////////////////
//
//  METHOD NAME
//    SWEReloadApp
//
//  PARAMETERS
//    None
//
//  RETURN VALUE
//    None
//
//  DESCRIPTION
//    For KeyBank ACR075. This function calls DoRefresh method of Coapp to 
//    load login page in top browser.
//
///////////////////////////////////////////////////////////////////////////////
function SWEReloadApp()
{
   if(typeof(Top()._swescript)!='undefined'&&Top()._swescript!=null)
   {
      if(typeof(Top()._swe)!='undefined'&&Top()._swe!=null)
      {	     
    	 if ((typeof(Top()._swe._sweapp)!='undefined')&&(Top()._swe._sweapp!=null))
    	 {
    	    if (App() != null)
    	       App().DoRefresh();
    	 }
      }
    }
}
//Bug#11671230 : it returns the frame title for the given frame
function setFrameNameTitleArray(FrameNameTitleArray)
{
   _SWEFrameTitleAry = FrameNameTitleArray;
}
function _getFrameTitle(key)
{
   ary = _SWEFrameTitleAry;
   return ary[key.toLowerCase()];
   
}