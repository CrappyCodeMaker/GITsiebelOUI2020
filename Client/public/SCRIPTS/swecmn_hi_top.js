///////////////////////////////////////////////////////////////////////////////
//
// Copyright (C) 2002, Siebel Systems, Inc., All rights reserved.
//
// FILE:       swecmn_hi_top.js
//
// CREATOR:    Iannis Hanen
//
// DESCRIPTION
//    
// Common JavaScript Hi Interactivity Functions used only in the hidden frame
//
/////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////
// JMenu Proxy Functions
////////////////////////////////////////////////////////

function _JMenu_Initialize(param1, param2, param3, param4, param5, param6, param7, param8, param9, param10, param11)
{
   top._swe._sweapp._JMenu_Initialize(param1, param2, param3, param4, param5, param6, param7, param8, param9, param10, param11);
}

function _JMenu_HandleEvent(param1, param2)
{
   top._swe._sweapp._JMenu_HandleEvent(param1, param2);
}

// check java applet ready state
function CheckAppletReady (javaApltFullName, callback)
{
    if(IsOpenUI())
        return false;
    // method from base java applet
   var initMethod = "initialize";
   
   if ((eval (javaApltFullName) == null) ||
       (eval (javaApltFullName + ".readyState") != 4) ||       
       App() == null )
   {
      var  str = (callback != null) ? (",'" +callback+ "'") : "";
      setTimeout ("CheckAppletReady ('"+javaApltFullName+ "'" + str + ");", 500);
      return false;
   }
   else
   {
      try
      {
         // accessing the method name as a property will throw an exception if the applet is downloaded
         if (eval (javaApltFullName + "." + initMethod) != null)
         {
            // could be a different type of browser which doesn't cause an exception.
            // looks like the java applet is loaded in any case, so proceed.
            if (callback != null)
               eval (callback);
            return true;
         }
      }
      catch(e)
      {
         //the applet is downloaded & ready
         if (callback != null)
            eval (callback);
         return true;
      }
      
      //user has chosen not to download this applet.
      top._swescript.SWEAlert (App().GetLocalString ("AppErrLocaleAppletNotDownloaded"));
      App().SetPopupVisible(false);
      Top().location.replace("start.swe?SWECmd=Logoff");
      
      return false;
   }      
} 


function HandleAppletClick (appletName)
{
   if (appletName != "" && appletName != null)
   {
      var view = App().GetMainView();  
      if (view != null)
      {
         var applet = view.GetApplet (appletName);
         if (applet != null)
            applet.InvokeMethod ("OnFocus", App().NewPropertySet ());
      }
   }
}


function HandleContextMenu_Top (appletName, eventObj)
{
   if (eventObj && eventObj.ctrlKey && eventObj.altKey)
      return true;

   if (appletName != "" && appletName != null)
   {
      var view = App().GetMainView();
      
      if (view != null)
      {
         var applet = view.GetApplet (appletName);
         if (applet != null)
         {
            var inProp = App().NewPropertySet ();
            inProp.SetProperty ("X", eventObj.screenX);
            inProp.SetProperty ("Y", eventObj.screenY);	
            applet.InvokeMethod ("ShowContextMenu", inProp);
         }
      }
   }

   return false;
}

function SWECenterPopup(w,h)
{	
    var posX = parseInt((SWEGetAvailScreenWidth()-w)/2);
    var posY = parseInt((SWEGetAvailScreenHeight()-h)/2);	
    return ",top=" + posY + ",left=" + posX + ",screenY=" + posY + ",screenX=" + posX; 
}

function SWEChangePDQSelect(frameObj, array, iSelect)
{
   if (frameObj == null || (typeof (frameObj.GetPDQForm) != "function"))
      return;
   var form = frameObj.GetPDQForm();
   if (form == null)
      return;
      
   SWEViewbarRefreshSelect (form.s_pdq, array, iSelect); 
}


function SWEChangeViewbarViewSelect(frameObj, array, iSelect)
{
   if (frameObj == null || (typeof (frameObj.GetViewNavForm) != "function"))
      return;
   var form = frameObj.GetViewNavForm ();
   if (form == null)
      return;
      
   SWEViewbarRefreshSelect (form.s_vs, array, iSelect); 
}


function SWEExecPDQ(url, pdqName)
{
   var viewName;

   if (App().GetMainView()!=null)   //HI view
   {
        if (App().IsRecording() && pdqName != null)
        {
           var pset = top._swescript.CCFMiscUtil_CreatePropSet ();
           pset.SetProperty ("PDQ", pdqName);
           App().FireRecorderEvent(App().GetName (), "ExecutePDQ", 0, 0, "", pset);
        }

        viewName = App().GetMainView().GetName();
        url += "&" + "SWEView" + "=" + URLEncode(viewName);
        return App().GotoView(viewName, "", url, null);
   }
   else  //LI view
      return App().GotoURL(url, App().GetViewFrame ());    
}

function SWEJSSGetAppletObjShadow (viewId, applet)
{
   var appletObj = App().GetView(viewId).GetApplet(applet);
   return (appletObj.shadow);
}

// handle HI toolbar event
function SWEHandleTBEvent(barIdx, itemIdx, evt)
{
   App().GetToolbarAt(barIdx).HandleEvent(itemIdx, evt);
}

function SWEHideBrowserFrame (frameName)
{
   if (SWEIsHighInteract)
   {
      App().HideBrowserFrame (frameName);
   }

   if (typeof (Top()._swescript) != 'undefined' && Top()._swescript != null)
   {
      // restore the focus on the main view to the applet that had focus
      Top()._swescript.SetDefaultApplet (Top()._defaultAppletName);
   }
}

// restore the old selectindex when error out in onchange event
// To support view caching (where we don't want to execute the url but still keep the old value
// so that it is correct when you c omeback to this view later) we want to keep the old value in
// some other cases also.
function SWESelect(ctrl, onchange, oldvalue, bKeepOldValue)
{
   // 12-CIAUPB: Switched order of setting selectedIndex to bypass IE bug when options are changed in the select box in the eval.  Was causing IE crash.
   if (bKeepOldValue == true) {
      ctrl.selectedIndex = oldvalue;
      // 12-FITWY3 we delay GotoView to allow the previous statement to finish
      setTimeout(onchange, 0); 
   } else if (!eval(onchange)) {
      ctrl.selectedIndex = oldvalue;
   }
}

function SWEShowBrowserFrame (frameName, rows, cols)
{
   if (SWEIsHighInteract)
   {
      App().ShowBrowserFrame (frameName, rows, cols);
   }
}

// stub fucntion to phase out the use of JS setbusy calls.
function SetBusy(enableBusy)
{
}