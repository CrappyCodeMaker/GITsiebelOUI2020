 //////////////////////////////////////////////////////////////////////////////
//
// Copyright (C) 1998, Siebel Systems, Inc., All rights reserved.
//
// FILE:       swecmn_hi.js
//
// CREATOR:    Jay Gopalkrishnan
//
// DESCRIPTION
//    
// Common JavaScript Hi Interactivity Functions.
//
//////////////////////////////////////////////////////////////////////////////


function HandleContextMenu (appletName)
{   
   return Top()._swescript.HandleContextMenu_Top (appletName, event);
}
   
//Refresh only the PDQ select index
function SWEChangePDQSelectIndex(iSelectq)
{
   if (typeof (GetPDQForm) != "function")
      return;

   var form = GetPDQForm();
   if (form == null)
      return;

   var selectObj = form.s_pdq;   
   
   if (!selectObj || !selectObj.options || selectObj.options.selectedIndex<0)
      return;

   var f = selectObj.onchange;
   selectObj.onchange = null;
   
   if (selectObj.options[selectObj.options.selectedIndex].innerText == iSelectq) 
      {
	 selectObj.onchange = f;
         return;
      }

   for(var i=0; i < selectObj.options.length; i++)
      {
         if (selectObj.options[i].innerText == iSelectq) 
	 {
	   selectObj.options.selectedIndex = i;
           break;
	 }
      }

   selectObj.onchange = f;
}


if (!IsOpenUI() && typeof (Top()._swescript) != "undefined")
{
	var hiddenFrame = Top()._swescript;
	_JMenu_Initialize = hiddenFrame._JMenu_Initialize;
	_JMenu_HandleEvent = hiddenFrame._JMenu_HandleEvent;
	CheckAppletReady = hiddenFrame.CheckAppletReady;
	HandleAppletClick = hiddenFrame.HandleAppletClick;
        HandleAppletClickSI = hiddenFrame.HandleAppletClickSI;
	SWECenterPopup = hiddenFrame.SWECenterPopup;
	SWEChangePDQSelect = hiddenFrame.SWEChangePDQSelect;
	SWEChangeViewbarViewSelect = hiddenFrame.SWEChangeViewbarViewSelect;
	SWEJSSGetAppletObj = hiddenFrame.SWEJSSGetAppletObj;
	SWEJSSGetAppletObjShadow = hiddenFrame.SWEJSSGetAppletObjShadow;
	SWEHideBrowserFrame = hiddenFrame.SWEHideBrowserFrame;
	SWESelect = hiddenFrame.SWESelect;
        SWEShowBrowserFrame = hiddenFrame.SWEShowBrowserFrame;
}
