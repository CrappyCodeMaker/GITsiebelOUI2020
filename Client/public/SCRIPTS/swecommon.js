//////////////////////////////////////////////////////////////////////////////
//
// Copyright (C) 1998, Siebel Systems, Inc., All rights reserved.
//
// FILE:       swecommon.js
//  $Revision: 145 $
//      $Date: 11/09/01 4:30p $
//    $Author: Wlai $ of last update
//
// CREATOR:    TDiec
//
// DESCRIPTION
//    
// JavaScript Functions used by the Siebel Web Engine.
//
//////////////////////////////////////////////////////////////////////////////
function IsOfflineModeEnabled ()
{
    var result = false;
    if(document.documentElement.hasAttribute && document.documentElement.hasAttribute('manifest') && window && window.localStorage && window.openDatabase)
    {
        result = true;
    }
    return result;
}

if (!IsOpenUI()) {
    document.cookie = '_srn=;expires=Thu, 01 Jan 0000 00:00:00 GMT;';
}
else if (!(/(iPhone|iPod|iPad|Android)/i.test(navigator.userAgent)) && (!IsOfflineModeEnabled() || !(window.localStorage.getItem("WorkOffline") && JSON.parse(window.localStorage.getItem("WorkOffline"))))) {
    document.cookie = '|sameuisession|=;expires=Thu, 01 Jan 0000 00:00:00 GMT;';
}

window.onunload = function(){
    ProcessRefresh.call ();
};

window.onbeforeunload = function(){
    window.unload = null;
    ProcessRefresh.call();
};
                
function IsOpenUI(){
    return typeof(SiebelApp)!="undefined" && typeof(SiebelAppFacade)!="undefined";
}

function ProcessRefresh (){
    var browserUrl = window.location.toString();

    if(IsOpenUI()){
        var suid = SiebelApp.Constants.get("SWE_HIST_PARAM_SUID");
        if (browserUrl.indexOf(suid) > -1){
            browserUrl = browserUrl.substring(0, browserUrl.indexOf(suid)) +
                              ((browserUrl.indexOf("&", browserUrl.indexOf(suid) + 1) < 0) ? "" :
                                    browserUrl.substring(browserUrl.indexOf("&", browserUrl.indexOf(suid) + 1)));
        }
        if (typeof (window.strWindowId) != "undefined") { // to enforce single browser tab access to a particular user session
            var expiry = new Date();
            expiry.setTime( expiry.getTime() + 365 * 86400000 );
            document.cookie = '|sameuisession|=' + window.strWindowId + ";expires=" + expiry.toGMTString() + ";";
        }
    }
    else if(typeof(top.strWindowId) != "undefined"){
        var expiry = new Date(); 
        expiry.setTime(expiry.getTime() + 10000);
        document.cookie='_srn=' + top.strWindowId + ";expires="+expiry.toGMTString()+";"; 
    }
}

if (!IsOpenUI() && top._swe && top._swe._swejssview != null)
   top._swejssview = top._swe._swejssview;

var SWEIsHighInteract = IsOpenUI()? true : false;
var SWEPopupResizeNoHide = false;
var iRefPopup = 0;      //Accessibility: Phase3 
var minutesRemToTimeoutPopup=0;     
var secondsRemToTimeoutPopup=0;      //Accessibility: Phase3

function SWEGetPopupResizeNoHide ()
{
  if(SWEPopupResizeNoHide != "undefined")
  {
    return SWEPopupResizeNoHide;
  }
  return false;    
}

function SWESetPopupResizeNoHide (bValue)
{
  if(SWEPopupResizeNoHide != "undefined")
  {
    return SWEPopupResizeNoHide = bValue ;
  }
  return;    
}
// 12-EBDFCN
function SWEConfirmNExecute(msg, okurl,cancelurl)
{
   var tf = SWEConfirm(msg);

   if (tf && okurl != null && okurl != '')
   {
      SWEGotoURL(okurl);
   }
   else if (cancelurl != null && cancelurl != '')
      SWEGotoURL(cancelurl);
}
//
//Used to goto a view. 
// 
function SWEGotoView(viewname, busObjZone, url, target)
{
   if (SWEIsHighInteract)
   {
      App().GotoView (viewname, busObjZone, url, target);
   }
   else 
   {
      SWETargetGotoURL (url, target, false);
   }
}

//
//Used to goto a url. Will append a time stamp to enable the server to identify a refresh
// 
function SWETargetGotoURL(url, target, bLeaveApplet)
{
   if(typeof(IsSWEPopup) === 'undefined'){
       SWEClearHistoryGotoURL(url, target); 
       return;
   }
   var bFromPopup = IsSWEPopup(this);
   if (pendingChanges(bFromPopup))
   {
      // Prevent data loss warning from kicking in twice, one by focus tracking and one by SWETargetGotoURL.
      // Going to compare SWEApplet against currently selected applet name.
      // If SI focus tracking is turned on, then having pending changes mean the user had clicked on Cancel 
      //    on the first warning.  If he had click Continue, pendingChanges() would return false.
      // If SI focus tracking is not turned on, just go ahead with normal data loss warning.
      // Otherwise if URL request is from currently selected applet, show data loss warning because focus tracking 
      //    wouldn't have displayed the first warning.
      // If URL request is not from currently selected applet, don't show warning because there would have
      //    been a first warning displayed by focus tracking.

      // flag indicating whether to data loss warning, if shown here, would be dup
      var bDupWarning = false; 

      // If focus tracking is turned on, need to check for applet names
      if (typeof(top.SWEApplets) != 'undefined' && typeof(top.SWEApplets[top.CurrentAppletIndex]) != 'undefined')
      {
         // If SWEApplet exists in URL, extract it
         var searchKey = "SWEApplet=";
         var startIdx;
         var endIdx;
         var appletName = null;
         startIdx = url.indexOf(searchKey);
         if (startIdx >= 0)
         {
            endIdx = url.indexOf("&", startIdx);
            if (endIdx >= 0)
               appletName = url.substring(startIdx+searchKey.length, endIdx);
            else
               appletName = url.substring(startIdx+searchKey.length);
         }

         if (typeof(appletName) == "string" && appletName != URLEncode(top.SWEApplets[top.CurrentAppletIndex].Name))
            bDupWarning = true;  // If applet name doesn't match currently selected applet, this would be dup warning if shown.
      }
        
      // Show warning if it wouldn't be redundant 
      if (bDupWarning || (url.indexOf("SkipDataLossWarning") < 0 && StopForSavingData(bFromPopup)))
         return;
   }

   var frameObj;
   var now = new Date();

   if( typeof(target) == "string")
   {
      // PR 12-LFSYYX: Port PR 12-IKA10V
      // Fix for PR#12-IKA10V. This allows the coming response
      // to be targeted to a new window.
      if (target == "_blank")
         frameObj = this.open ();
      else if (target != "")
         frameObj = SWEFindFrame(top, target);
      else
         frameObj = null;
   }
   else 
      frameObj = target;

   if(frameObj == null) 
      frameObj = this;

   //Only add the time stamp if the GotoURL is a SWE URL.
   //If this is an external URL, then we don't want to add the time stamp
   if (url.search("start.swe") != -1)
   {  
      url = SWEAppendArgsToURL (url, "SWETS", now.getTime());
      // Fix for 12-G8DVVA. MSN browser sends file download request twice
      // So we set a URL argument indicating that a refresh should not be
      // attempted for such a case. When the server parses this argument, 
      // it will send the file again instead of doing a refresh. We check 
      // frameObj against top to gaurd against misconfiguration
      if (!SWEIsHighInteract && (frameObj != top) && (url.indexOf("SWEMethod=Drilldown") != -1)
          && (navigator.userAgent.indexOf("MSN") > -1))
      {
         url = SWEAppendArgsToURL (url, "SWENR", 1);
      }
      //always append swecount 
      if (typeof(Top().SWECount) == 'undefined')
         Top().SWECount = -1;
      url = SWEAppendArgsToURL (url, "SWEC", Top().SWECount);
     //FR12-1B9V685 : Append SWENoHttpRedir; 
     if(((typeof(target) == "string") && (target != "_blank")) && (target != "_top"))
          url = SWEAppendArgsToURL (url, "SWENoHttpRedir", true);
   }

   if(IsOpenUI()){
       App().GotoView("", "", url, "");
   }
   else if (SWEIsHighInteract)
   {
        var app = App();
        //var view = app.GetMainView ();
        //if (bLeaveApplet == true && view)
        //{
        //   if (view.SetActiveApplet(null))
        //      app.GotoURL(url, frameObj);
            //else back up original status
        //}
        //else
          app.GotoURL(url, frameObj, bLeaveApplet);
   }
   else 
   {
      if (typeof(top._samePage) != 'undefined' && top._samePage!="")
      {
         //unlikely to have two immediate post changes from the same page
         //otherwise we have to take out the old value and replace with the new one.
         SWEAppendArgsToURL (url, "SWESPa", top._samePage); 
         top._samePage = "";
      }
      
      frameObj.location = url;      
   }
}

function OnPageUnload ()
{
   // cr 12-FU7MEN: Disable select/LOVs during a page refresh in SI   
   // Occurs in IE 5.5 SP2 and up
   var selObjs = document.body.getElementsByTagName("SELECT");
   for(var i=0;i < selObjs.length;i++)
   {
      selObjs[i].disabled = true;
   }
}

function SWEGotoURL(url, bLeaveApplet)
{ 
   SWETargetGotoURL(url, this, bLeaveApplet); 
}

function SWEFindFrame(topWin, frameName)
{
   if (frameName == "_self")
   {
      return this;
   }

   for (var i = 0; i < topWin.frames.length; i ++) 
   {
      var frameObj = topWin.frames[i];

      var theFrame = topWin.frames[frameName];

      if (theFrame != null)
         return theFrame;
            
      frameObj = SWEFindFrame (frameObj, frameName);

      if (frameObj != null)
          return frameObj;
   }

   return null;
}

// PR 12-LFSYYX: Port PR 12-IKA10V
// Fix for PR#12-IKA10V. Add the third argument to handle
// the behavior when cancel is clicked.
function SWEConfirmNCall(msg, jsCall, jsCancelCall)
{
   var tf = SWEConfirm(msg);

   if (tf)
   {
      eval(jsCall);
   }
   // PR 12-LFSYYX: Port PR 12-IKA10V
   else if (jsCancelCall != null)
   {
      eval(jsCancelCall);
   }   
}

var   g_bInitialized = false;

// JAVASCRIPT FUNCTION -- DOES NOTHING (USED FOR THE HREF IN THE CALENDAR and calculator CALL)
function doNothing() {
}

// Deprecated & slow. Kept around for backward compatibility.
// Do not introduce new usage of this function.
function SWEJSSInvokeMethod (
                       appletVar,
                       method, 
                       viewId,
                       view, 
                       applet,                        
                       field,
                       row, 
                       rowIds,
                       reqRowId,
                       inputps,
                       targetView,
                       targetApplet,
                       mode,
                       showPopup,
                       height,
                       width,
                       reqCount,
                       confirmMsg,
                       keepCtx,
                       seqId,
                       resize)
{
   if(confirmMsg != null && confirmMsg != "" )
   {
      var tf = SWEConfirm(confirmMsg);
      if (!tf)
      {
         return;
      }
   }

   var pset = App().NewPropertySet ();
   var bMethod = false;

   if (method != null)
   {
      pset.SetProperty ("SWEMethod", method);
      bMethod = true;
   }

   if (viewId != null)
      pset.SetProperty ("SWEVI", viewId);
   
   if (view != null)
      pset.SetProperty ("SWEView", view);

   if (applet != null)
   {
      pset.SetProperty ("SWEApplet",applet);
      if (bMethod)
         pset.SetProperty ("SWECLK", "1");
   }

   if (seqId != null)
      pset.SetProperty ("SWESeq", seqId);

   if (field != null)
      pset.SetProperty ("SWEField", field);

   if (row != null)
      pset.SetProperty ("SWER", row);

   if (rowIds != null)
      pset.SetProperty ("SWERowIds", rowIds);

   if (reqRowId != null)
      pset.SetProperty ("SWEReqRowId", reqRowId);

   if (inputps != null)
      pset.SetProperty ("SWEIPS", inputps);

   if (targetView != null)
      pset.SetProperty ("SWETargetView", targetView);

   if (targetApplet != null)
      pset.SetProperty ("SWETA", targetApplet);

   if (mode != null)
      pset.SetProperty ("SWEM", mode);

   if (showPopup != null)
      pset.SetProperty ("SWESP", showPopup);

   if (height != null)
      pset.SetProperty ("SWEH", height);

   if (width != null)
      pset.SetProperty ("SWEW", width);

   if (reqCount != null)
      pset.SetProperty ("SWEC", reqCount);

   if (keepCtx != null)
      pset.SetProperty ("SWEKeepContext", keepCtx);

   if (resize != null)
   {
      //method is deprecated so removed the popup code
   }

   return App().GetView("").GetApplet(applet).InvokeMethod(method, pset);
}

//This function is only used for Calendar code, per Anil Mukundan's suggestion
//Please do not use this function for any other purpose.
//Contact Setiono Tandriono or Parthasarathy Ramachandran if you have any questions
//Please keep this function in sync with:
//       SSstring
//       CSSSWEFrame::CreateJSSInvokeMethodCall(CSSMapStringToString& jsArgs,
//                                              LPCTSTR               functionName)
//in framshow.cpp
//
function SWEJSSCalendarInvokeMethod (
                                      appletVar,
                                      method, 
                                      viewId,
                                      view, 
                                      applet, 
                                      field,
                                      row, 
                                      rowIds,
                                      reqRowId,
                                      inputps,
                                      targetView,
                                      targetApplet,
                                      mode,
                                      showPopup,
                                      height,
                                      width,
                                      reqCount,
                                      confirmMsg,
                                      keepCtx,
                                      rowId)
{
   if(confirmMsg != null && confirmMsg != "" )
   {
      var tf = SWEConfirm(confirmMsg);
      if (!tf)
      {
         return;
      }
   }

   var pset = App().NewPropertySet ();

   if (method != null)
      pset.SetProperty ("SWEMethod", method);

   if (viewId != null)
      pset.SetProperty ("SWEVI", viewId);
   else viewId = "";
   
   if (view != null)
      pset.SetProperty ("SWEView", view);

   if (applet != null)
      pset.SetProperty ("SWEApplet",applet);

   if (field != null)
      pset.SetProperty ("SWEField", field);

   if (row != null)
      pset.SetProperty ("SWER", row);

   if (rowIds != null)
      pset.SetProperty ("SWERowIds", rowIds);

   if (rowId != null)
      pset.SetProperty ("SWERowId", rowId);

   if (reqRowId != null)
      pset.SetProperty ("SWEReqRowId", reqRowId);

   if (inputps != null)
      pset.SetProperty ("SWEIPS", inputps);

   if (targetView != null)
      pset.SetProperty ("SWETargetView", targetView);

   if (targetApplet != null)
      pset.SetProperty ("SWETA", targetApplet);

   if (mode != null)
      pset.SetProperty ("SWEM", mode);

   if (showPopup != null)
      pset.SetProperty ("SWESP", showPopup);

   if (height != null)
      pset.SetProperty ("SWEH", height);

   if (width != null)
      pset.SetProperty ("SWEW", width);

   if (reqCount != null)
      pset.SetProperty ("SWEC", reqCount);

   if (keepCtx != null)
      pset.SetProperty ("SWEKeepContext", keepCtx);

   App().InvokeAppletMethod (viewId, applet, method, pset);
}



//
// Please contact Jay Gopalkrishnan before you use / modify this function.
// This is a temporary function that will go away with the view cache changes
//
function SWEJSSInvokeMethod_Temp (
                       appletVar,
                       method, 
                       viewId,
                       view, 
                       applet, 
                       field,
                       row, 
                       rowIds,
                       reqRowId,
                       inputps,
                       targetView,
                       targetApplet,
                       mode,
                       showPopup,
                       height,
                       width,
                       reqCount,
                       confirmMsg,
                       keepCtx)
{
   Top().SetBusy(true);

   if(confirmMsg != null && confirmMsg != "" )
   {
      var tf = SWEConfirm(confirmMsg);
      if (!tf)
      {
         Top().SetBusy(false);
         return;
      }
   }

   var pset = App().NewPropertySet ();

   if (method != null)
      pset.SetProperty ("SWEMethod", method);

   if (viewId != null)
      pset.SetProperty ("SWEVI", viewId);
   
   if (view != null)
      pset.SetProperty ("SWEView", view);

   if (applet != null)
      pset.SetProperty ("SWEApplet",applet);

   if (field != null)
      pset.SetProperty ("SWEField", field);

   if (row != null)
      pset.SetProperty ("SWER", row);

   if (rowIds != null)
      pset.SetProperty ("SWERowIds", rowIds);

   if (reqRowId != null)
      pset.SetProperty ("SWEReqRowId", reqRowId);

   if (inputps != null)
      pset.SetProperty ("SWEIPS", inputps);

   if (targetView != null)
      pset.SetProperty ("SWETargetView", targetView);

   if (targetApplet != null)
      pset.SetProperty ("SWETA", targetApplet);

   if (mode != null)
      pset.SetProperty ("SWEM", mode);

   if (showPopup != null)
      pset.SetProperty ("SWESP", showPopup);

   if (height != null)
      pset.SetProperty ("SWEH", height);

   if (width != null)
      pset.SetProperty ("SWEW", width);

   if (reqCount != null)
      pset.SetProperty ("SWEC", reqCount);

   if (keepCtx != null)
      pset.SetProperty ("SWEKeepContext", keepCtx);

   //CR 12-HXAFMJ removed closepopup
   App().InvokeAppletMethod (viewId, applet, method, pset);
   pset = null;

   Top().SetBusy(false);
}

function SWEJSSBusServiceInvokeMethod (serviceName, methodName, strInPropSet)
{
   var service = App ().GetService (serviceName);
   var inPropSet = App ().NewPropertySet ();
   inPropSet.DecodeFromString (strInPropSet);
   var outPropSet = service.InvokeMethod (methodName, inPropSet);
   var result = outPropSet.EncodeAsString ();
   service = null; 
   inPropSet = null;
   outPropSet = null;
   return (result);   
}

// JAVASCRIPT FUNCTION -- Create Hidden Fields in HTML Forms (J.Huang) 
function c_h (id, inputNames, inputValues) 
{
   var size;
   var text;
   var elem;
  if (inputValues.length != inputNames.length)
  {
      SWEAlert ("error found in writting hidden inputs");
   }
  if (inputValues.length > inputNames.length)
  {
    size = inputNames.length;
  }
  else
  {
    size = inputValues.length;
  }
   
   text = "";
   for (var i = 0; i < size; i++) 
   {
       text += "<input type=\"hidden\" name='" + inputNames[i] + "' value='" + HtmlEncode(inputValues[i]) + "'>";
   }
   elem = document.getElementById(id);
   if (elem)
      elem.innerHTML = text;
}

// SWERefresh(): Called upon closing a popup to refresh the page
// anchor - Used to specify the frame that should be active/anchored to. 
function SWERefresh(targetFrame, url, anchor, targetWindow)
{
   if (url == null || url == "")
   {    
      if (top.opener != null && top.opener.SWEDoRefresh != null)
         top.opener.SWEDoRefresh(anchor);      
      else if (this.SWEDoRefresh != null)
         SWEDoRefresh(anchor);            
   }
   else
   {
      if (targetWindow != "undefined" && targetWindow == "_self")
      {
         SWETargetGotoURL(url, top);
      }
      else if (top.opener != null && top.opener.SWEDoRefresh != null)
         SWETargetGotoURL(url, top.opener);
      else if (targetFrame != null && targetFrame != "")
      {
         var targetFrameObj = eval(targetFrame);
         SWETargetGotoURL(url, targetFrameObj);
      }
    }
}

function SWEJSS_gotoText(id)
{
   var select = document.all[id + "sel"];
   var text = document.all[id + "txt"];
   var button = document.all[id + "btn"];
  
   if (select.style.display != "none")
      text.value = select.options(select.options.selectedIndex).innerText;
   select.style.display = "none";
   text.style.display = "block";
   text.disabled = true;
   button.style.display = "block";
}

// Submit Form when ENTER key pressed on an Input. (For both IE and NS)
// This function is not a generic function to capture 'Enter's. It is specific
// to the password field of the siebel login page. (PageItemName = _SwePassword)
function SWESubmitOnEnter (e)
{
   var keyCode = e ? e.which : window.event.keyCode;
   var formObj = e ? e.target.form : window.event.srcElement.form;

   if (keyCode == 13)
   {
     SWEExecuteLogin(formObj, null, null);
   }
}

var g_sweobj = null;
var g_oInterval = null;
var g_swecmd1 = null;
var g_swecmd2 = null;

function RecurGetJSS ()
{
   eval (g_swecmd2);
   if (g_sweobj != null)
   {
      eval (g_swecmd1);
      clearInterval (g_oInterval);
   }
}

function GetJSSInfo (sweobj, cmd1, cmd2)
{
   g_swecmd1 = cmd1;
   g_swecmd2 = cmd2;  
   if (sweobj == null)
   {
      g_oInterval = window.setInterval ("RecurGetJSS()", 3000);   
   }
   else
   {
      eval (cmd1);
   }
}  


var shutdown = false;
function HandleEvent(event, lparam, rParam) 
{ 
   switch (event)
   {
      // 12-HYGI1Z+F: Port SI busy state cursor from 7.5.x
      case "Disable":
         if (document.all)
         {
            if (lparam)
            {
               if (dvBusy.style.display!="block")
               {
                  dvBusy.style.width = document.body.clientWidth;
                  dvBusy.style.height = document.body.scrollHeight;

                  dvBusy.style.display="block";

                  if (Top().g_menuCursor != null)
                     dvBusy.style.cursor=Top().g_menuCursor;
                  else
                     dvBusy.style.cursor="wait";

                  if (Top().doBusyScroll)
                  {
                     dvScroll.scrollTop = 500;
                     dvScroll.scrollTop = 0;
                  }
               }
            }
            else
            {
               if (dvBusy.style.display!="none")
               {
                  dvBusy.style.display="none";

                  if (Top().g_menuCursor != null)
                     dvBusy.style.cursor=Top().g_menuCursor;
                  else
                     dvBusy.style.cursor="default";

                  if (Top().doBusyScroll)
                  {
                     dvScroll.scrollTop = 500;
                     dvScroll.scrollTop = 0;
                  }
               }
            }
         }
         break;

       case "ShutDown":
         shutdown = true;
         break;

      case "SetScreen":
         //lparam is the screen name
         SWESetScreen(lparam);
         break;
      
      case "UserQuery":
         var elem = document.getElementById("s_pdq");
         if (elem)
         {
            if (elem.options[0].value != "")
            {
               var newOpt = document.createElement("OPTION");
               newOpt.text = "";
               newOpt.value = "";
               elem.options.add(newOpt,0);
            }
            elem.selectedIndex = 0;
         }
         break;

      default:
         break;
   }
}

//This section has to stay in sync with the server side
if (typeof swetop == "undefined") 
{
  var swetop = null;
  // find the topmost window, but make sure it's a valid reference
  var parentWindow;
  var currentWindow;
  if (!IsOpenUI() && typeof window.parent != "undefined")
  {
    parentWindow = window.parent;
    currentWindow = window;
    while (currentWindow.parent != currentWindow ) 
    {
      if (typeof parentWindow.swetop != "unknown" && typeof parentWindow.swetop != "undefined") 
      {
        swetop = parentWindow.swetop;
        break;
      }
      if (typeof currentWindow.parent != "undefined")  
      {
        currentWindow = parentWindow;
        parentWindow = parentWindow.parent;
      } 
      else 
        break;
    }
  }
  
   // find the "top" window" in case swetop was not yet found but is defined in the opener
   // 12-FCIWKO Added support to climb back up the hierarchy tree and find swetop.   
   winOpener = window.opener;   

   // CR 12-KKHFH0 and PR 12-KXD5BK: In NS exception is thrown immediately when window.opener.swetop is accessed
   try
   {
      while(winOpener != null)
      {     
         if (typeof winOpener.swetop != "unknown")
         {
            swetop = winOpener.swetop;
            break;
         }

         if (typeof winOpener.opener != "unknown" && typeof winOpener.opener != "undefined")
         {
            winOpener = winOpener.opener;
         }
         else
         {
            winOpener = null;
         }
      }
   }
   catch (e)
   {
      // Do nothing
   }

   if (swetop == null)
      swetop = window;
}

function Top()
{
   return swetop;
}
   

function App() 
{
    if(IsOpenUI() &&  SiebelAppFacade.InterfaceSI != undefined && SiebelAppFacade.InterfaceSI.App != undefined){
        return SiebelAppFacade.InterfaceSI.App.GetInstance();
    }
    else if(Top()._swe && Top()._swe._sweapp && Top()._swe._sweapp.S_App){
        return Top()._swe._sweapp.S_App;
    }
}

function SWESetScreen(screenTab)
{
   var objFrame = SWEFindFrame(top, "_swescrnbar");
   if (objFrame == null || objFrame != this)      
      return;
   st_scrn(screenTab.name, -1, screenTab);
}

function SWEExecuteCommand(formObj, action, command, bPopup, height, width, target)
{
   if (! g_bInitialized)
      return;

   if (action != null)
      formObj.action = action;

   if (command != null)
      formObj.SWECmd.value = command;

   if (bPopup == "true" || bPopup == "TRUE")
   {
      if(SWEIsHighInteract)
      { 
         App().OpenPopup("", parseInt(height), parseInt(width),false,false,true);
      }
      else
      {
         SWEShowPopup ("", parseInt(height), parseInt(width), "false");
      }
   }
   if (target != null && target != "")
   {
      formObj.target = target;
   }

   //FR : 12-1B9V685: Set SWENoHttpRedir=true 
   if ((formObj.target != "_blank") && 
       (formObj.target != "_top") && 
       (typeof(formObj.SWENoHttpRedir) != 'undefined')
       )       
         formObj.SWENoHttpRedir.value = "true";   
   
   if (SWEIsHighInteract)
   {
      App().SubmitForm(formObj);
   }
   else
   {
      formObj.submit();
   }
}

function SWEPersonalizationDrillDown (viewName, appletName, fieldName, rowId, parentRowIds)
{
   SWEPersonalizationDrillDown_top (viewName, appletName, fieldName, rowId, parentRowIds, this);
}

function HandleFormSubmitBusyCount ()
{
   if (SWEIsHighInteract)
   {
      App().HandleFormSubmitBusyCount(false);
   }
   window.close (); 
}

function updatePopup( htmlStr ){
    if( IsOpenUI() && $( "iframe#ouitemp_iframe" ).length > 0 ){
        $( "div[name=popup]" ).html( htmlStr );
    }
}

function SWESubmitForm (csFormObj, csObj, fieldName, rowId, csFrame)
{
   var bRet      = true;
   var height    = 480;
   var width     = 640;
   var objFrame, obj, formObj;
   //Added attribute to hide the iFrame in RWD
   var style     = SiebelApp.S_App.IsRwd() ? "style=\"display:none\"":"";

   if (IsOpenUI() && csFormObj.name === "SIPopupIEForm") { // File Import Export Form
       csFormObj = $("#" + fieldName).parents("form")[0];
       $("body").find("iframe#ouitemp_iframe").remove();
       var selector = SiebelApp.S_App.IsRwd() ? "body" : "body #_swe";
       $(selector).append("<iframe id='ouitemp_iframe'  name='ouitemp_iframe' "+style+" />");
       csFormObj.target = "ouitemp_iframe";
       csObj.target = "ouitemp_iframe";

        $('#ouitemp_iframe').load(function () {
           if (this.contentDocument.readyState !== "complete") {
               return;
           }

           if (typeof updatePopup == 'function') {
               var str = $('body', this.contentWindow.document).html();
               if (str) {
                   if (str.indexOf("DelayedResetLocation") !== -1 ||
                       str.indexOf("location.replace") !== -1) {

                       str = str
                               .replace("location.replace", "SiebelApp.contentUpdater.Nullify")
                               .replace("location", "ignoreIframeVar");
                   }
                   updatePopup(str);
                   str = null;
                   setTimeout(function () {
                       $('#ouitemp_iframe').find("body").empty();
                   }, 50);
               }
           }
       });

   }

   // adding warning message when waiting for file import
   if (csFormObj.encoding == "multipart/form-data" && 
       typeof document != "unknown" && // added as part of the fix for FR12-Q6P471
       document.getElementById("s_swe_filepop_add") != 'undefined' &&
       Top().SWEIsHighInteract && 
       typeof(csObj) != 'undefined' && csObj != null && 
       csObj.SWEMethod == "WriteRecord")
   {
      var swefile = document.getElementById("s_SweFileName");

      if (swefile.value != "")
      {
         //  insert warning message
         var msg = App().GetLocalString ("IDS_FILE_IMPORT_PROMPT");
         var oText = document.createElement("B");
         document.body.insertBefore(oText);
         oText.innerText = msg;
         
         App().SetPopupVisible(true);
      }
   }

   if (typeof(csFrame) != 'undefined')
   {
      objFrame = csFrame;
      if (objFrame == null)
      {
         SWEAlert("Fail to submit form due to invalid objFrame!");
         return;
      }
      formObj = objFrame[csFormObj];
      obj = objFrame[csObj];
   }
   else
   {
      obj = csObj;
      formObj = csFormObj;
   }

   var bFromPopup = IsSWEPopup(this);
   if (pendingChanges(bFromPopup) && 
       ((typeof(obj.SWEApplet) != 'undefined' && typeof(top.SWEApplets) != 'undefined' && typeof(top.SWEApplets[top.CurrentAppletIndex]) != 'undefined' && obj.SWEApplet != top.SWEApplets[top.CurrentAppletIndex].Name) || 
       (typeof(obj.SkipDataLossWarning) == 'undefined' && StopForSavingData(bFromPopup))))
   {
      return;
   }

   // added as part of QTP bug fix FR:12-J7CY3B_F. parameter 'csobj' will be null 
   // when 'Save' button in 'Columns Displayed' popup clicked.
   if (typeof(obj) != 'undefined' && obj != null)
   {
      SWESubmitForm_top (obj, formObj, fieldName, rowId);
  
      if(!SWEIsHighInteract)
      {
         if (typeof(obj.SWESPNH) != 'undefined')
            SWESetPopupResizeNoHide(true);

         if (typeof(obj.SWEH) != 'undefined')
            height = obj.SWEH;

         if (typeof(obj.SWEW) != 'undefined')
            width = obj.SWEW;

         if (typeof(obj.SWESPNR) != 'undefined')
         {
            Top().SWEPopupResizeNoAuto = true;
            Top().SWEPopupHeight = height;
            Top().SWEPopupWidth = width;
         }
    
         if (typeof(obj.SWESP)  == 'TRUE' || obj.SWESP  == 'true')
         {
            try
            {
               if (formObj.SWETVI.value ==  Top().SWEHtmlPopupName &&
                  formObj.SWETA.value == "" )
                  bRet = SWEShowPopup ("", height, width, "false", "false", "scrollbars");
               else
                  bRet = SWEShowPopup ("", height, width, "false");
            }
            catch (e)
            {
               // Do nothing.
            }    
    
               
         if (typeof (Top().showNSPopup) != "undefined" && Top().showNSPopup == false)
         {
            return;
         }
            
            formObj.target = Top().SWEHtmlPopupName;

            if (typeof(formObj.SWESP) != 'undefined')
               formObj.SWESP.value = obj.SWESP;
      
         }
      }
      else
      {
         if (typeof(obj.SWEH) != 'undefined')
         {
            formObj.SWEH.value = obj.SWEH;
         }
         if (typeof(obj.SWEW) != 'undefined')
         {
            formObj.SWEW.value = obj.SWEW;
         }
         if (typeof(obj.SWESPNR) != 'undefined')
         {
            formObj.SWESPNR.value = true;        
         }
         if (typeof(obj.SWESP)  == 'TRUE' || obj.SWESP  == 'true')
         {
             formObj.SWESP.value = obj.SWESP;

             // in case we are opening the popup from non-main view (e.g. Search), need to set 
             // the opener to the view from which popup was opened.  Otherwise refreshing
             // parent will not work properly
             formObj.SWEWN.value = window.name;
         }
         else
         {
           // 12-H2ODXR: Need to reset the value to false to avoid displaying the contents
           // of the browser in a popup when not needed.
           formObj.SWESP.value = false;
        
           if (typeof(formObj.SWEWN) != 'undefined')
           {
               formObj.SWEWN.value = "";
           }
         }
         if (typeof(obj.SWESPNH) != 'undefined' && typeof(formObj.SWESPNH) != 'undefined')
         {
              // 12-HJKXEX: Passed to AxApp to avoid SI popup disappearing and then reappearing
              formObj.SWESPNH.value = true;
         }
      }
   }

  if (typeof (window._samePage) != 'undefined' && window._samePage != "")
   {
       formObj.SWESPa.value = top._samePage;
       top._samePage = "";
   }
   else if ((formObj.SWEPOC && formObj.SWEPOC.value != "") || (IsOpenUI() && $('[name=SWEPOC]').attr('value')!=""))
      top._samePage = "1";

   //FR : 12-1B9V685: Set SWENoHttpRedir=true 
   if ((formObj.target != "_blank") && 
       (formObj.target != "_top") && 
       (typeof(formObj.SWENoHttpRedir) != 'undefined')
       )
    {
      //VT:Firefox does not recognize the correct input elements of the form. SO manually setting the values for a later clone at the time of form submission
      if(IsOpenUI() && !formObj.SWENoHttpRedir)
      {
         $('[name=SWENoHttpRedir]').attr('value', 'true')
      }
      else
      {
         formObj.SWENoHttpRedir.value = "true";
      }
    }

   // File Import Export Form
   if( IsOpenUI() && formObj.name === "SIPopupIEForm")
   {
      formObj.submit();
   }
   else if (SWEIsHighInteract)
   {
      App().SubmitForm(formObj);

      //FR12-W72LQ3 : For report server pages, added one variable to avoid incrementing busy state when  SWESubmitform() 
      // is called on these pages
      if (typeof (window._incFormSubmitBusyCnt) != 'undefined' && 
            window._incFormSubmitBusyCnt == false)
         App().HandleFormSubmitBusyCount (false);
   }
   else
   {
      formObj.submit();
   }
}

// Wrapper for trackChange_top() in order to determine whether user op is from popup
function trackChange(activeAppletWithChanges, id, frameName)
{
   trackChange_top(activeAppletWithChanges, id, frameName, IsSWEPopup(this));
}

function SweClickAddPopup()
{
  if (typeof(s_swe_filepop_add) != 'undefined')
  {
      s_swe_filepop_add.click();
  }
}

//Pointer to functions in the hidden frame
if (typeof (Top()._swescript) != "undefined")
{
  var hiddenFrame                   = Top()._swescript;
  c_d                               = hiddenFrame.c_d;
  EvalFrame                         = hiddenFrame.EvalFrame;
  HtmlEncode                        = hiddenFrame.HtmlEncode;
  IsSWEPopup                        = hiddenFrame.IsSWEPopup;
  pendingChanges                    = hiddenFrame.pendingChanges;
  ResetCurrentPopupModified         = hiddenFrame.ResetCurrentPopupModified;
  ResetPopupDataLossWarningVars     = hiddenFrame.ResetPopupDataLossWarningVars;
  ResetScreen                       = hiddenFrame.ResetScreen;
  SWEAlert                          = hiddenFrame.SWEAlert;
  SetAppCookie                      = hiddenFrame.SetAppCookie;
  SetScreen                         = hiddenFrame.SetScreen;
        SetDefaultFocus                   = hiddenFrame.SetDefaultFocus;
  StopForSavingData                 = hiddenFrame.StopForSavingData;
  SWEAppendArgsToURL                = hiddenFrame.SWEAppendArgsToURL;
  SWEClosePopup                     = hiddenFrame.SWEClosePopup;
  SWEConfirm                        = hiddenFrame.SWEConfirm;
  SWEFormReset                      = hiddenFrame.SWEFormReset;
  SWEGetAvailScreenHeight           = hiddenFrame.SWEGetAvailScreenHeight;
  SWEGetAvailScreenWidth            = hiddenFrame.SWEGetAvailScreenWidth;
  SWEGetScreenHeight                = hiddenFrame.SWEGetScreenHeight;
  SWEGetScreenWidth                 = hiddenFrame.SWEGetScreenWidth;
  SWEJSSFindAppletFrame             = hiddenFrame.SWEJSSFindAppletFrame;
  SWEJSSGetAppletObj                = hiddenFrame.SWEJSSGetAppletObj;
  SWEJSSGetAppletObjShadow          = hiddenFrame.SWEJSSGetAppletObjShadow;
  SWEPersonalizationDrillDown_top   = hiddenFrame.SWEPersonalizationDrillDown_top;
  SWEPersonalizationGotoScreen      = hiddenFrame.SWEPersonalizationGotoScreen;
  SWEPersonalizationGotoview        = hiddenFrame.SWEPersonalizationGotoview;
  SWEPopupGainFocus                 = hiddenFrame.SWEPopupGainFocus;
  SWEPopupMessage                   = hiddenFrame.SWEPopupMessage;
  SWEPosition                       = hiddenFrame.SWEPosition;
  SWEShowNamedPopup                 = hiddenFrame.SWEShowNamedPopup;
  SWEReloadApp                      = hiddenFrame.SWEReloadApp;
  SWESubmitForm_top                 = hiddenFrame.SWESubmitForm_top;
  SWEUnloadApp                      = hiddenFrame.SWEUnloadApp;
  SweValidateSubmit                 = hiddenFrame.SweValidateSubmit;
  trackChange_top                   = hiddenFrame.trackChange_top;
  URLEncode                         = hiddenFrame.URLEncode;
	SWECloseJannaPopup                = hiddenFrame.SWECloseJannaPopup;
}


function SWEGotoPageRC(PageName,url, target, bLeaveApplet)
{ 
   var pset = top._swescript.CCFMiscUtil_CreatePropSet ();
   pset.SetProperty ("PageItem", PageName);
   App().FireRecorderEvent(App().GetName(), "GoToContainerPageItem", 0, 0, "", pset);
   
   SWETargetGotoURL(url, target, bLeaveApplet); 
}


function SWEIsBrowserBack(pageId)
{
   return ((pageId<Top().SWEServerCount)?true:false);
}


function SWESyncCheck(pageId, errMsg)
{
   if (SWEIsBrowserBack(pageId))
   {
      // client is not in sync with the server
      alert(errMsg);
      if (pageId <= Top().SWECount) // the user is click on back button
         history.back();
      else                          // the user is click on forward button
         history.forward();
   }
}

//12-H63TT7: Hitting back button on browser after logout or session timeout allows user to login back in.
//For logoff and timeout redirect command, we shall use this js function to send out the request
//so that the login request can be removed from the history.
function SWEClearHistoryGotoURL (url, bTimeout)
{
  if(typeof Top() != "undefined")
  {
    Top().location.replace(url);
  }
  else
  {
    window.location.replace(url);
  }
}

//For Visual Style Changes-Changing the minibutton style on mouse events.
function SWEMinibuttonHover(obj)
{
  if (obj.className != 'miniButtonTDFocus')
  {
    obj.className='miniButtonTDHover';
    obj.parentNode.parentNode.parentNode.className='miniButtonTableHover';
  }
}

function SWEMinibuttonOut(obj)
{
  if (obj.className != 'miniButtonTDFocus')
  {
    obj.className='miniButtonTD';
    obj.parentNode.parentNode.parentNode.className='miniButtonTable';
  }
}

function SWEMinibuttonDown(obj)
{
  obj.className='miniButtonTDDown';
  obj.parentNode.parentNode.parentNode.className='miniButtonTableDown';
}

function SWEMinibuttonUp(obj)
{
  obj.className='miniButtonTDHover';
  obj.parentNode.parentNode.parentNode.className='miniButtonTableHover';
}

function SWEMinibuttonFocus(obj)
{
  obj.className='miniButtonTDFocus';
  obj.parentNode.parentNode.parentNode.className='miniButtonTableFocus';
}

function SWEMinibuttonBlur(obj)
{
  obj.className='miniButtonTD';
  obj.parentNode.parentNode.parentNode.className='miniButtonTable';
}


//For Visual Style Changes-Changing the minibutton style on mouse events.
function MinibtnHover(obj)
{
  if (obj.className != 'miniBtnUICFocus')
  {
    obj.className='miniBtnUICHover';
    obj.parentNode.className='miniBtnUICTopHover';
  }
}
function MinibtnOut(obj)
{
  if (obj.className != 'miniBtnUICFocus')
  {
    obj.className='miniBtnUIC';
    obj.parentNode.className='miniBtnUICTop';
  }
  
}

function MinibtnDown(obj)
{
  obj.className='miniBtnUICDown';
  obj.parentNode.className='miniBtnUICTopDown';
}


function MinibtnUp(obj)
{
  obj.className='miniBtnUICHover';
  obj.parentNode.className='miniBtnUICTopHover';
}

//FR# 12-1QMXOQT: Below function will be executed when ENTER is pressed after putting
//the focus on the Mini Button
function MinibtnEnter(obj)
{
  if(event.keyCode == "13")
    MinibtnDown(obj);
}


//Visibility Picker.
function SWEPropChangeForVP()
{
  if ((typeof(event) != "undefined")&& (typeof(event.propertyName) != "undefined") && (event.propertyName == "className"))
  {
    var elem = document.getElementById("s_vis");
    if (typeof(elem) != "undefined")
    {
      elem.selectState = event.srcElement.className;
    }
  }
}

function SetPropChangeHandlerForPar(obj)
{
  var tempObj = obj;
  while(typeof(tempObj) != "undefined")
  {
    var cssStyleName = tempObj.className;
    if (typeof(cssStyleName) != "undefined")
    {
      if ((cssStyleName.toLowerCase() == "selected")||(cssStyleName.toLowerCase() == "notselected"))
      {
        var elem = document.getElementById("s_vis");
        if (typeof(elem) != "undefined")
        {
          elem.selectState = cssStyleName;
          tempObj.onpropertychange=SWEPropChangeForVP;
        }
        break;
      }
    }
    tempObj = tempObj.parentNode;
  }
}
//Visual Style Changes-End


// following 2 functions are added for FR12-1BJOS21 to activate ActiveX Controls
function SWEWriteObjectTag (target, objectTag)
{
   if (typeof(target) != "undefined" && typeof(target.document) != "undefined")
      target.document.write(objectTag);
}

function SWEWriteInnerHTML (target, objectTag)
{
   if (typeof(target) != "undefined")
      target.innerHTML = objectTag;
}


function SWEAccessibilityHelp()
{
    Accessibility_Window = window.open(language + "/help/siebaccessibility.htm", null, "location=0, status=0, scrollbars=1, width=500, height=400, toolbar=0, menubar=0, top=150, left=150, resizable=1");
}

//Accessibility: Phase3 :START
function SessionWarn()
{
    if (Top().iRef == 1)
    {
    var message = _SWEgetMessage("IDS_SWE_SESS_WARN_TIMEOUT");
    var message1 = message.replace("%1", Top().sessExtendMinutes);
    var message2 = message1.replace("%2", Top().sessExtendSeconds);
    var message3 = message2.replace("%3", Top().minutesRemToTimeout);
    var message4 = message3.replace("%4", Top().secondsRemToTimeout);
    var r=confirm(message4);
    var ie=(navigator.appName.indexOf("Microsoft")>-1);
        if (r==true)
        {
            if(ie)
            {
            var WshShell = new ActiveXObject("WScript.Shell");
            WshShell.SendKeys("{F5}");
            }
            else
            {
            window.location.reload(true);
            }
        }
     }
}

function SessionWarnPopup()
{ 
  if (iRefPopup == 1)
  {
  var msg = _SWEgetMessage("IDS_SWE_SESS_WARN_TIMEOUT_POPUP");
  var msg1 = msg.replace("%1", minutesRemToTimeoutPopup);
  var msg2 = msg1.replace("%2", secondsRemToTimeoutPopup);
  var msg3 = msg2.replace("%3", '\n');
  var msg4 = msg3.replace("%4", '\n');
  var msg5 = msg4.replace("%5", '\n');
  alert(msg5);
  }
}

function StartTimer(sessionWarnTimeout,minutesRemToTimeout,secondsRemToTimeout,sessExtendMinutes,sessExtendSeconds)
{
  Top().minutesRemToTimeout = minutesRemToTimeout;
  Top().secondsRemToTimeout = secondsRemToTimeout;
  Top().sessExtendMinutes = sessExtendMinutes;
  Top().sessExtendSeconds = sessExtendSeconds;
  Top().SessWarnTime= setTimeout('SessionWarn()',sessionWarnTimeout);
        Top().iRef = 1;

}

function StartTimerPopup(sessionWarnTimeout,minutesRemToTimeout,secondsRemToTimeout)
{ 
  minutesRemToTimeoutPopup = minutesRemToTimeout;
  secondsRemToTimeoutPopup = secondsRemToTimeout;
  SessWarnTime= setTimeout('SessionWarnPopup()',sessionWarnTimeout);
        iRefPopup = 1;
}

function ClearTimer()
{
     Top().iRef = Top().iRef - 1;
}

function ClearTimerPopup()
{
     iRefPopup = iRefPopup - 1;
}
//Accessibility: Phase3 :END//Accessibility: Phase3 :END

//<------BUG#12876873-------
function GetActiveViewBarIndex (vtCap, svtCap)
{
   var vtIdx;

   if (vtCap != null && vtCap != 'undefined')
   {
      var vtlen = vtCap.length;
      var svtlen = svtCap.length;
      
      for (svtIdx = 0; svtIdx < svtlen; svtIdx++)
      {
         for (vtIdx = 0; vtIdx < vtlen; vtIdx++)
         {
            if (svtCap[svtIdx] != null && svtCap[svtIdx].name == vtCap[vtIdx].name)
               return vtIdx;
         }
      }
   }
   return -1;
}

function ActivateViewBarItem (vtIdx)
{
   if (vtIdx != null && vtIdx != 'undefined' && vtIdx != -1)
   {
      var id = "vb"+(vtIdx);
      var tb =  document.getElementById(id);
      if (tb != null && tb != 'undefined')
         tb.className = "tier3On";
   }
}
//----BUG#12876873-------->

function HandleiOSRefresh() {
    if (/(iPhone|iPod|iPad|Android)/i.test(navigator.userAgent)) {
        var isCookie = false;
        var nameEQ = "|sameuisession|=";
        var checkingCookie;
        var cookieArray = document.cookie.split(';');
        for (var i = 0; i < cookieArray.length; i++) {
            checkingCookie = cookieArray[i];
            while (checkingCookie.charAt(0) == ' ') {
                checkingCookie = checkingCookie.substring(1, checkingCookie.length);
            }
            if (checkingCookie.indexOf(nameEQ) == 0) {
                isCookie = true;
                break;
            }
        }
        if (isCookie) {
            var expDate = new Date();
            expDate.setTime(expDate.getTime() + 2000);     //Reset cookie timeout to 2s from now (minimum increament).
            document.cookie = nameEQ + checkingCookie.split("=")[1] + "; expires=" + expDate.toGMTString();

            location.reload();
        }
    }
}
// Browser Compatibility
var TestBrowserCapability = function () {

    var sp = "&emsp;&emsp;",
        passStr = _SWEgetMessage("IDS_PASS"),
        failStr = _SWEgetMessage("IDS_FAIL"),
        passIco = "<span class='siebui-icon-check-circle'/>",
        failIco = "<span class='siebui-icon-close-circle'/>",
        passDataRow = "<td>" + sp + passIco + "</td><td>" + sp + passStr + "</td></tr>",
        failDataRow = "<td>" + sp + failIco + "</td><td>" + sp + failStr + "</td></tr>",
        compBody = document.getElementById("browserCompatiblity"),
        compHead = document.getElementById("browserCompatiblityHeader"),
        headerString = "<a href='javascript:ToggleBrowserCompatibility()' title='" + _SWEgetMessage("IDS_SWE_APPLET_EXPAND") + "'>"
                        + "<span id='span_iconright' class='siebui-icon-arrowsm-right'></span>"
                        + "<span id='span_icondown' class='siebui-icon-arrowsm-down' style='display:none'></span>&nbsp;&nbsp;"
                        + _SWEgetMessage("IDS_HTML5_FEATURES")
                        + "</a>&emsp;<a target='_blank' alt='" + _SWEgetMessage("IDS_SWE_MAP_MENU_DISPLAY_INFO") + _SWEgetMessage("IDS_SWE_CKEDITOR_TARGET_NEW")
                        + "' href='" + language + "/help/HTML5BrowserCompatiblity.htm'><span class='siebui-icon-help'/></a><br>",
        displayString = "<table tabindex='0'><tbody>";

    if (typeof (Modernizr) !== "undefined") {
        displayString += "<tr><td>" + _SWEgetMessage("IDS_SWE_XHR2") + ":</td>";
        displayString += ((!!window.ProgressEvent && !!window.FormData && window.XMLHttpRequest && ("withCredentials" in new XMLHttpRequest)) ? passDataRow : failDataRow);

        displayString += "<tr><td>" + _SWEgetMessage("IDS_PLACEHOLDER_TEXT") + ":</td>";
        displayString += (Modernizr.input.placeholder ? passDataRow : failDataRow);

        displayString += "<tr><td>" + _SWEgetMessage("IDS_HISTORY") + ":</td>";
        displayString += (Modernizr.history ? passDataRow : failDataRow);

        displayString += "<tr><td>" + _SWEgetMessage("IDS_DRAG_AND_DROP") + ":</td>";
        displayString += (Modernizr.draganddrop ? passDataRow : failDataRow);

        displayString += "<tr><td>" + _SWEgetMessage("IDS_SWE_FORM_VALIDATION") + ":</td>";
        displayString += (Modernizr.input.max ? passDataRow : failDataRow);

        displayString += "<tr><td>" + _SWEgetMessage("IDS_VIDEO") + ":</td>";
        displayString += (Modernizr.video ? passDataRow : failDataRow);

        displayString += "<tr><td>" + _SWEgetMessage("IDS_SWE_ANIMATION") + ":</td>";
        displayString += (Modernizr.cssanimations ? passDataRow : failDataRow);

        displayString += "<tr><td>" + _SWEgetMessage("IDS_TOUCH") + ":</td>";
        displayString += (Modernizr.touchevents ? passDataRow : failDataRow);

        displayString += "<tr><td>" + _SWEgetMessage("IDS_LOCAL_STORAGE") + ":</td>";
        displayString += (Modernizr.localstorage ? passDataRow : failDataRow);

        displayString += "<tr><td>" + _SWEgetMessage("IDS_APPLICATION_CACHE") + ":</td>";
        displayString += (Modernizr.applicationcache ? passDataRow : failDataRow);

        displayString += "<tr><td>" + _SWEgetMessage("IDS_WEB_SQL_DATABASE") + ":</td>";
        displayString += (Modernizr.websqldatabase ? passDataRow : failDataRow);

        displayString += "<tr><td>" + _SWEgetMessage("IDS_WEBSOCKET") + ":</td>";
        displayString += (Modernizr.websockets ? passDataRow : failDataRow);

        displayString += "<tr><td>" + _SWEgetMessage("IDS_WEB_NOTIFICATIONS") + ":</td>";
        displayString += (Modernizr.notification ? passDataRow : failDataRow);

        displayString += "</tbody></table>";

        if (compHead && compBody) {
            compHead.innerHTML += headerString;
            compBody.innerHTML += displayString;
            compBody.setAttribute("style", "display:none");
            compHead.setAttribute("style","font-size:12px");
        }
    }
};
var ToggleBrowserCompatibility = function() {
    var compBody = document.getElementById("browserCompatiblity"),
        isBodyHidden = compBody.getAttribute("style"),
        arrowRight = document.getElementById("span_iconright"),
        arrowDown = document.getElementById("span_icondown");

    if (isBodyHidden) {
        compBody.removeAttribute("style");
        arrowRight.setAttribute("style", "display:none");
        arrowDown.removeAttribute("style");
    } else {
        compBody.setAttribute("style", "display:none");
        arrowRight.removeAttribute("style");
        arrowDown.setAttribute("style", "display:none");
    }
};

var ValidateCurrentUserWithOfflineUser = function(userId, srn) {
    if (IsOfflineModeEnabled()) {
        var ls = window.localStorage,
            offlineUser = ls.getItem("UID"),
            loadedfromcache = JSON.parse(ls.getItem("loadedfromcache"));
        if (!(loadedfromcache)) {
            var winLoc = window.location,
            winStartSweUrl = winLoc.origin.concat(winLoc.pathname);
            if (winLoc.href === winStartSweUrl && JSON.parse(ls.getItem("PackageDownloaded"))) {
                loadedfromcache = true;
            }
        }


        if (userId === offlineUser) {
            if (!loadedfromcache) {
                ls.setItem("SRN", srn);
                ls.setItem("UpSyncInProgress", false);
            }
        } else {
            ls.setItem("SRN", "");
            ls.setItem("WorkOffline", "false");
            ls.setItem("UpSyncInProgress", "false");
        }
        ls.removeItem("loadedfromcache");
    }
};

var AdaptUserInMAF = function(userId, appName, lang) {
  var isAdfmContainer = window.localStorage.getItem("isAdfmContainer");
  var mafversion = window.localStorage.getItem("mafversion");
  if(isAdfmContainer != "1") {
    return;
  }

  document.cookie = "isAdfmContainer=1;path=/";
  document.cookie = "mafversion=" + mafversion + ";path=/";

  var isCompatibility = window.localStorage.getItem("isCompatibility");
  var userloc = appName + lang;
  userloc = userloc.replace(/ /g, '').toLowerCase() + '.' + userId;
  isCompatibility = (isCompatibility == "false")? false:true;

  //alert('AdaptUserInMAF:userloc:' + userloc);

  if(!isCompatibility) {
     window.sessionStorage.setItem('userloc', userloc);
     
     var getItem1 = localStorage.getItem;
     var setItem1 = localStorage.setItem;
     var removeItem1 = localStorage.removeItem;
       
     localStorage.getItem = function (key) {
       var key1 = userloc + '.' + key;
       return getItem1.call(this, key1);
     }
       
     localStorage.removeItem = function (key) {
       var key1 = userloc + '.' + key;
       return removeItem1.call(this, key1);
     }
       
     localStorage.setItem = function (key, value) {
       var key1 = userloc + '.' + key;
       if( userloc )
       {
         return setItem1.call(this, key1, value);
       }
     }
     localStorage.setItem('isAdfmContainer', '1');
     localStorage.setItem('isCompatibility', 'false');
  }
}
