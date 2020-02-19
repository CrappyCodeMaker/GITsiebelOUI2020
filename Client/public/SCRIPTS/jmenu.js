/*****************************************************************************
 *
 * Copyright (C) 2001, Siebel Systems, Inc., All rights reserved.
 *
 * FILE:       
 *  $Revision: 25 $
 *      $Date: 11/04/01 12:07a $
 *    $Author: Mrfreeze $ of last update
 *
 * CREATOR:    Gtang
 *
 * DESCRIPTION:
 *    	This file creates Javascript menus.
 *       Functional in IE5.5 and IE6.0.
 *****************************************************************************/	

var _JMenuObj = null;
var MENU_BACKGROUND_COLOR  = '#EEEEEE';
var isStandAloneWebClient = "FALSE";

function JMenu ()
{
   this.activeItem = 0;
   this.activeDomIndex = 0;
   this.items = null;
   this.isRTL = false;
   this.Popup = window.createPopup();
   this.type  = null;
   this.axObj = null;
   this.bRecording   = false;
   this.psMenu = null;
}

///////////////////////////////////////////////////////////////////////////////
//
//  METHOD
//    _JMenu_BindAXObj
//
//  METHOD TYPE
//    API Type (External/Module/Private): Module
//    Overridable? (Yes/No)             : No
//    Overrides Virtual? (Yes/No)       : No
//
//  PARAMETERS
//    axObj      -   [in] ActiveX wrapper class.
//    menuType   -   [in] Type of the menu object. 'Application', 'Applet' etc. 
//    menuName   -   [in] Name of the menu object. 
//    img            - [in] image of the applet menu button.
//    htmlID     -   [in] html id of the menu object. 
//
//  RETURN VALUE
//    None
//
//  DESCRIPTION
//    Binds the javascript class to the ActiveX wrapper class.
//
///////////////////////////////////////////////////////////////////////////////

function _JMenu_BindAXObj (axObj, menuType, menuName, img, htmlID)
{
   axObj.jsObj = this;
   axObj.img = img;
   axObj.SetMenuName (menuType, menuName);
   axObj.SetApplication (App());
   axObj.SetHtmlID (htmlID);
}

///////////////////////////////////////////////////////////////////////////////
//
//  METHOD
//    _JMenu_GetMenuItemsInfo
//
//  METHOD TYPE
//    API Type (External/Module/Private): Module
//    Overridable? (Yes/No)             : No
//    Overrides Virtual? (Yes/No)       : No
//
//  PARAMETERS
//    menuname      -   [in] name of the menu object. 
//    propertyName  -   [in] name of the requested property. Property names
//                          are: "MenuItemNames", "MenuItemDisplayNames"  
//                          and "MenuItemStates".
//
//  RETURN VALUE
//    None
//
//  DESCRIPTION
//    This routine invokes _JMenu_Load method on the _JMenuObj object. The
//    _JMenu_Load method calls the command manager to retrieve the menu items.
//    Once the menu items are retrieved they are put into the propertyValues
//    array by _JMenu_GetSubMenuItemsInfo method.
//
///////////////////////////////////////////////////////////////////////////////

function _JMenu_GetMenuItemsInfo (menuname, propertyName)
{
   var   propertyValues = new Array();
  
   if ( (typeof (menuname) == "undefined") || (typeof (propertyName) == "undefined"))
      return null;

   _JMenuObj.menuName = menuname;
   if (menuname == "UtilityLink") 
   {
      _JMenuObj.type = 'UtilityLink';
      _JMenuObj._JMenu_Load(_JMenuObj.type, false, false);
      _JMenuObj.GetSubMenuItemsInfo(_JMenuObj.type, _JMenuObj.psMenu, propertyName, "UtilityLink", propertyValues); 
   }
   else if (menuname == "Reports") 
   {
      _JMenuObj.type = 'Reports';
      _JMenuObj._JMenu_Load(_JMenuObj.type, false, false);
      _JMenuObj.GetSubMenuItemsInfo(_JMenuObj.type, _JMenuObj.psMenu, propertyName, "Reports", propertyValues); 
   }
   else 
   {
      _JMenuObj.type = 'Applet'; 
      _JMenuObj._JMenu_Load(_JMenuObj.type, false, false);
      _JMenuObj.GetSubMenuItemsInfo(_JMenuObj.type, _JMenuObj.psMenu, propertyName, "", propertyValues);
   }
   return propertyValues;
}

///////////////////////////////////////////////////////////////////////////////
//
//  METHOD
//    _JMenu_GetSubMenuItemsInfo
//
//  METHOD TYPE
//    API Type (External/Module/Private): Module
//    Overridable? (Yes/No)             : No
//    Overrides Virtual? (Yes/No)       : No
//
//  PARAMETERS
//    menuObjType   -   [in] Menu object type.
//    psMenu        -   [in] menu item property set. 
//    propertyName  -   [in] name of the requested property. Property names
//                          are: "MenuItemNames", "MenuItemDisplayNames"  
//                          and "MenuItemStates".
//    sCaptionStrIn -   [in] caption string of the menu item. Sub-menu item
//                           cations are append to it separated by '/' char.
//    propertyValues -  [in] Array that is filled in by this method.
//
//  RETURN VALUE
//    None
//
//  DESCRIPTION
//    This routine iterates through the menu items and sub-menu items and
//    inserts values into the propertyValues array. Property names
//    can be: "MenuItemNames", "MenuItemDisplayNames"  
//    and "MenuItemStates". This routine recursively walks through all 
//    sub-menus.
//
///////////////////////////////////////////////////////////////////////////////
function _JMenu_GetSubMenuItemsInfo(menuObjType, psMenu, propertyName, sCaptionStrIn, propertyValues)
{
   var  i = 0;
   var  sCaptionStr;
   var  separator = ((sCaptionStrIn != "") ? "\\" : "");
   var  childCount = psMenu.GetChildCount ();

   for (i = 0; i < childCount; i++)
   {
      var psMenuItem = psMenu.GetChild (i);
      var type       = psMenuItem.GetProperty ("Type");
      var caption;
      var name;
      
      if (menuObjType == "Reports")
      {
         caption = psMenuItem.GetProperty ("Report Name");
         name    = psMenuItem.GetProperty ("Report Executable");
         if (typeof caption == "undefined" || caption == null || caption == "")
         {
            caption = psMenuItem.GetProperty ("My Reports Display Value");
            name    = psMenuItem.GetProperty ("My Reports View Name");
            if (typeof caption == "undefined" || caption == null || caption == "")
            {
               caption = psMenuItem.GetProperty ("Schedule Report Display Value");
               name    = psMenuItem.GetProperty ("Schedule Report");
            }
         }
      }
      else if (menuObjType == "Tasks")
      {
         caption = psMenuItem.GetProperty ("Display Name");
         name    = psMenuItem.GetProperty ("Url");
      }
      else
      {
         caption = psMenuItem.GetProperty ("Caption");
         var iIndex = caption.indexOf ('&');
         if (iIndex != -1)
            caption = caption.substring (0, iIndex) + caption.substring (iIndex + 1);
      
         var pos = caption.indexOf ("[");
         var accelKey = (pos < 0) ? "" : caption.slice (pos+1, caption.length-1);
         if (pos > -1) caption = caption.substring (0, pos); 

         if (menuObjType == "Application" ||
             menuObjType == "UtilityLink")
         {
            name = psMenuItem.GetProperty ("Menu");
         }
         else
         {
            name = "";
            command = psMenuItem.GetProperty ("Command");
            if (command != null && (command != '') && command.indexOf ("#") < 0)
            {
               if (command.indexOf ("*") == 0)
                  name = command.substr (1).split ("*")[2];
            }
            else if (command != null && (command != '') && command.indexOf ("#") == 0)
            {
               name = "CmdMgr" + psMenuItem.GetProperty ("Menu");
            }
         }
      }
      
      if (caption == "")
         continue;
     
      if (propertyName == "MenuItemDisplayNames")
      {
         sCaptionStr = sCaptionStrIn + separator + caption;
         propertyValues[propertyValues.length] = sCaptionStr;
      }
      else if (propertyName == "MenuItemNames")
      {
         sCaptionStr = sCaptionStrIn + separator + name;
         propertyValues[propertyValues.length] = sCaptionStr;
      }
      else
      {
         var enabled = (menuObjType == "Reports" || menuObjType == "Task" || type == "Menu")? true : isTrue (psMenuItem.GetProperty ("Enabled"));
         propertyValues[propertyValues.length] = enabled;
      }
      if (type == "Menu")
         _JMenuObj.GetSubMenuItemsInfo (menuObjType, psMenuItem, propertyName, 
                                        sCaptionStr, propertyValues);                        
   }
}

///////////////////////////////////////////////////////////////////////////////
//
//  METHOD
//    _JMenu_SelectMenuItem
//
//  METHOD TYPE
//    API Type (External/Module/Private): Module
//    Overridable? (Yes/No)             : No
//    Overrides Virtual? (Yes/No)       : No
//
//  PARAMETERS
//    menuitemName       - [in] caption of the applet menu item.
//
//  RETURN VALUE
//    BOOL    -  True is successful.
//            -  false if failed.
//
//  DESCRIPTION
//    invokes corresponding command on the given applet menu item.
//
///////////////////////////////////////////////////////////////////////////////
function _JMenu_SelectMenuItem (menuitemName)
{  
    // If the global _JMenuObj is null just return.
    if (!_JMenuObj || !_JMenuObj.psMenu || _JMenuObj.psMenu.GetChildCount () < 0)
       return false; 
     
    var psMenuItem = _JMenu_FindMenuItem (_JMenuObj.psMenu, menuitemName);
    if (psMenuItem)
    {
       _JMenuObj.DoClick(psMenuItem);
       return true;
    }
    return false;
}

function _JMenu_FindMenuItem (psMenu, menuitemName)
{
   var i = 0;
   var sCaptionStr;

   for (i = 0; i < psMenu.GetChildCount (); i++)
   {
      psMenuItem = psMenu.GetChild (i);

      caption = psMenuItem.GetProperty ("Caption");
      if (caption == "")
         continue;
            
      var type = psMenuItem.GetProperty ("Type");
      if (type == "Menu")
      {
          psMenuItem = _JMenu_FindMenuItem (psMenuItem, menuitemName);
          if (psMenuItem)
             return (psMenuItem);
      }
      else
      {
         sCaptionStr = psMenuItem.GetProperty ("Name");
         if (sCaptionStr == menuitemName)
            return (psMenuItem);
      }
   }
   return null;
}

///////////////////////////////////////////////////////////////////////////////
//
//  METHOD
//    _JMenu_ShowContextMenu
//
//  METHOD TYPE
//    API Type (External/Module/Private): Module
//    Overridable? (Yes/No)             : No
//    Overrides Virtual? (Yes/No)       : No
//
//  PARAMETERS
//    popupX         - [in] X Coordinate of the point where context menu is
//                          going to be displayed.
//    popupY         - [in] Y Coordinate of the point where context menu is
//                          going to be displayed.
//    menuName       - [in] name of the applet menu.
//    bisRTL         - [in] direction. 
//    axObj          - [in] ActiveX wrapper class.
//    bNoShowMenu    - [in] if need to show menu.
//
//  RETURN VALUE
//    BOOL    -  True is successful.
//            -  false if failed.
//
//  DESCRIPTION
//    Displays the context applet menu.
//
///////////////////////////////////////////////////////////////////////////////
function _JMenu_ShowContextMenu (popupX, popupY, menuName, bisRTL, axObj, bNoShowMenu)
{
   var pt = new Object ();
   pt.screenX = popupX;
   pt.screenY = popupY;
   
   return _JMenuObj._JMenu_Initialize (pt, menuName, 'Applet', axObj, bisRTL, true, 0, 0, false, false, bNoShowMenu);
}
///////////////////////////////////////////////////////////////////////////////
//
//  METHOD
//    _JMenu_ShowAppletMenu
//
//  METHOD TYPE
//    API Type (External/Module/Private): Module
//    Overridable? (Yes/No)             : No
//    Overrides Virtual? (Yes/No)       : No
//
//  PARAMETERS
//    img            - [in] image of the applet menu button.
//    menuName       - [in] name of the applet menu.
//    bisRTL         - [in] direction.
//    axObj          - [in] ActiveX wrapper class.
//    bNoShowMenu    - [in] if need to show menu.
//
//  RETURN VALUE
//    BOOL    -  True is successful.
//            -  false if failed.
//
//  DESCRIPTION
//    Displays the applet menu.
//
///////////////////////////////////////////////////////////////////////////////
function _JMenu_ShowAppletMenu (img, menuName, bisRTL, axObj, bNoShowMenu)
{  
   if (menuName == "Reports")
      return _JMenuObj._JMenu_Initialize (img, 'Reports', 'Reports', axObj, bisRTL, false, 0, 0, false, false, bNoShowMenu);
   else
      return _JMenuObj._JMenu_Initialize (img, menuName, 'Applet', axObj, bisRTL, false, 0, 0, false, false, bNoShowMenu);
}

function _JMenu_Show (img, context)
{
   if (!_JMenuObj.psMenu || _JMenuObj.psMenu.GetChildCount () == 0)
      return false;
   
   _JMenuObj.axObj.CreatePopupMenu(MENU_BACKGROUND_COLOR, _JMenuObj.isRTL);
   _JMenuObj.axObj.AddMenuItems(_JMenuObj.type, _JMenuObj.psMenu);
      
   // Automation support.
   // If the menu type is application, use its wrapper class.
   _JMenuObj.bRecording = false;
   if (_JMenuObj.type == "Application")
       _JMenuObj.bRecording = top._sweclient._sweappmenu._JMenuBarObj.axObj.IsRecording(); 
   else if (_JMenuObj.axObj != null)
       _JMenuObj.bRecording = _JMenuObj.axObj.IsRecording(); 

   if (_JMenuObj.bRecording)
   {
      var pset = App().NewPropertySet();
      var menuStr = _JMenuObj.menuName;
      pset.SetProperty ("Depth", _JMenuObj.depth);
      var uiType = _JMenuObj.type;
      
      if (context)
      {
         uiType = "Context";
      }
      else
      {
         if (_JMenuObj.type == "Application")
         {
            // Get the repository name of the menu object.
            var  appmenuItems = top._sweclient._sweappmenu._JMenuBarObj.items;
            for (var i = 0; i < appmenuItems.length; i++)
            {
                if (appmenuItems[i].caption == _JMenuObj.menuName)
                {
                    menuStr = appmenuItems[i].name;
                    break;
                }
            }
         }

         pset.SetProperty ("Menu", menuStr);
         pset.SetProperty ("UIType", uiType);
      }
      // If the menu type is application, use its wrapper class.
      if (_JMenuObj.type == "Application")
         top._sweclient._sweappmenu._JMenuBarObj.axObj.RecordEvent("OpenMenu", pset); 
      else
         _JMenuObj.axObj.RecordEvent("OpenMenu", pset);
   } 

   var actionPane = top._sweclient.document.all("SS_ActionPane");
   var width = (actionPane != null && typeof (actionPane) != "undefined" ? actionPane.clientWidth : 0);

   if (_JMenuObj.type == "Application")
   {
      var e = top._sweclient._sweappmenu.document.all(_JMenuObj.menuName);
      var popupX = e.document.Script.window.screenLeft + width + getOffsetLeft2Screen(e);
      var popupY = e.document.Script.window.screenTop + e.offsetHeight + 4;
      
      _JMenuObj.axObj.ShowMenu (popupX, popupY);
   }
   else
   {
      if (context)
      {
         _JMenuObj.axObj.ShowMenu (img.screenX, img.screenY);
      }
      else
      {
         if (_JMenuObj.type == "Applet")
         {
            var popupX = img.document.Script.window.screenLeft + width + getOffsetLeft2Screen(img) - 2;
            var popupY = img.document.Script.window.screenTop + getOffsetTop2Screen(img) + img.offsetHeight + 4;
            
            _JMenuObj.axObj.ShowMenu (popupX, popupY);
         }
         else if (_JMenuObj.type == "UtilityLink" ||
                  _JMenuObj.type == "Reports")
         {
            var popupX = img.document.Script.window.screenLeft + width + getOffsetLeft2Screen(img);
            var popupY = img.document.Script.window.screenTop + img.offsetHeight + 4;
            
            _JMenuObj.axObj.ShowMenu (popupX, popupY);
         }
      }
   }
}

function getOffsetLeft2Screen (et)
{
   var offsetLeft = 0;
   
   if (et != null)
   {
      offsetLeft += et.offsetLeft;
	   offsetLeft -= et.scrollLeft;
	   
	   var e = et.offsetParent;
	   if (e != null && typeof (e) != "undefined")
	   {
	      offsetLeft += getOffsetLeft2Screen(e);
      }
   }
	return offsetLeft;
}

function getOffsetTop2Screen (et)
{
   var offsetTop = 0;

   if (et != null)
   {
      offsetTop += et.offsetTop;
	   offsetTop -= et.scrollTop;
	   
	   var e = et.offsetParent;
	   if (e != null && typeof (e) != "undefined")
	   {
	      offsetTop += getOffsetTop2Screen(e);
      }
   }
	return offsetTop;
}

function _JMenu_Initialize (img, menuName, type, axObj, isRTL, context,
                            popupX, popupY, addDebug, bNoProcessMenu, bNoShowMenu)
{
   if (_JMenuObj == null)
   {
      _JMenuObj = new JMenu ();
   }

   _JMenuObj.type = type;
   _JMenuObj.isRTL = isRTL;
   _JMenuObj.PopupX = (popupX != null) ? popupX : 0;
   _JMenuObj.PopupY = (popupY != null) ? popupY : 0;
   _JMenuObj.menuName = menuName;
   _JMenuObj.psMenu = null;
   _JMenuObj.axObj = axObj;
   _JMenu_Load (type, addDebug, bNoProcessMenu);
   if (typeof (bNoShowMenu) == "undefined" || !bNoShowMenu)
   {
      return _JMenu_Show (img, context);
   }
   _JMenuObj.axObj = null;
}

function _JMenu_DoClick (item)
{
   var command = item.GetProperty("Command");
   var enabled = item.GetProperty("Enabled");
   if (command != "" && enabled)
   {
      _JMenu_InvokeCommand (command, item);
   }
}

function _JMenu_InvokeCommand (command, item)
{
   var caption = item.GetProperty("caption");
   
   if (_JMenuObj.type == "Tasks")
   {
      var type = item.GetType();
      
      S_App.GetCommandMgr().InvokeTaskCommand(App(), type, command);
   }
   else if (_JMenuObj.type == "Reports")
   {
      var type = item.GetProperty("CommandType");
      
      if (type == "report")
      {
         var inputProps = App().NewPropertySet ();
         inputProps.SetProperty ("ReportExecutableName", command);
         
         //xutan, FR#12-1U5S3EF
         //to detect if 8111FP new features are applied
         var is8111FPApplied = item.GetProperty("8111FPApplied");
         inputProps.SetProperty ("8111FPApplied", is8111FPApplied);
         
         var bipthirdpartypopup = item.GetProperty("BIPThirdPartyPopup");
         inputProps.SetProperty ("BIPThirdPartyPopup", bipthirdpartypopup);
         
         var inpsstr = inputProps.EncodeAsString();
         
         var showpopup = item.GetProperty("ShowParamPopup");
         if (showpopup != "TRUE")
         {
            S_App.GetCommandMgr().InvokeReportCommand(App(), type, command, "");
         }
         else   
         {
            var url = App().GetPageURL() + "?SWECmd=InvokeMethod&SWEService=Report+Menu+Handler+(SWE)&SWEMethod=RunReportFromMenu&ReportExecutableName=";
            url +=URLEncode(command) + "&SWEIPS=" + inpsstr;
            
            S_App.GetCommandMgr().InvokeReportCommand(App(), type, "", url, true);
         }
      }
      if (type == "myReports")
      {
         var url = App().GetPageURL() + "?"+"SWECmd=GotoView&SWEC=" + App().SWECount + "&" + "SWEView" + "=" + URLEncode(command);

         S_App.GetCommandMgr().InvokeReportCommand(App(), type, command, url);
      }
      
      if(type == "myReportsDownload")
      {
         var inputProps = App().NewPropertySet ();
         inputProps.SetProperty ("ReportExecutableName", command);
         
         //xutan, FR#12-1U5S3EF
         //to detect if 8111FP new features are applied
         var rowId = item.GetProperty("Row Id");
         inputProps.SetProperty ("Row Id", rowId);
         
         var bipthirdpartypopup = item.GetProperty("BIPThirdPartyPopup");
         inputProps.SetProperty ("BIPThirdPartyPopup", bipthirdpartypopup);
         
         var inpsstr = inputProps.EncodeAsString();
         
         var showpopup = item.GetProperty("ShowParamPopup");
         if (showpopup != "TRUE")
         {
            S_App.GetCommandMgr().InvokeReportCommand(App(), type, command, "");
         }
         else   
         {
            var url = App().GetPageURL() + "?SWECmd=InvokeMethod&SWEService=Report+Menu+Handler+(SWE)&SWEMethod=RunReportFromMenu&ReportExecutableName=";
            url +=URLEncode(command) + "&SWEIPS=" + inpsstr;
            
            S_App.GetCommandMgr().InvokeReportCommand(App(), type, "", url, true);
         }
        
      }
      if (type == "scheduleReport")
      {
         var url = App().GetPageURL() + "?SWECmd=InvokeMethod&SWEService=Report+Menu+Handler+(SWE)&SWEMethod=ScheduleReport";
         
         //xutan, FR#12-1U5S3EF
         //to detect if 8111FP new features are applied
         var inputProps = App().NewPropertySet ();
         var is8111FPApplied = item.GetProperty("8111FPApplied");         
         inputProps.SetProperty ("8111FPApplied", is8111FPApplied);
         //xutan: porting all changes of 8111 new features to 8008+ACR483
         //the other diff between 8111 and 8008 are ignored
         //distinguishing ScheduleReport from BIP or ACTUATE
         var reportEngineType = item.GetProperty("ReportEngineType");
         inputProps.SetProperty ("ReportEngineType", reportEngineType);
         
         var inpsstr = inputProps.EncodeAsString();
         url += "&SWEIPS=" + inpsstr;
         
         S_App.GetCommandMgr().InvokeReportCommand(App(), type, "", url);
      }
   }
   else if (_JMenuObj.type == "UtilityLink")
   {
      S_App.GetCommandMgr().InvokeUtilityLinkCommand(App(), command);
   }
   else
   {
      try
      {
         S_App.GetCommandMgr().InvokeCommand (command);
      }
      catch (e)
      {
      }
   }
}

function _JMenu_Load (type, addDebug, bNoProcessMenu)
{
   try
   {
      _JMenuObj.type = type;
      var s_cmdmgr = S_App.GetCommandMgr();
      if (type == "Application")
      {
         var s = _JMenu_GetMenu (_JMenuObj.menuName, s_cmdmgr.PrepareGlobalMenu ());
         
         // Enable or disable menu items
         if (!bNoProcessMenu)
         {
            // SWEMOD_CLIENT_BEGIN
            s_cmdmgr.ProcessMenu (s);
            // SWEMOD_CLIENT_END
         }
      }
      else if (type == "Applet")
      {
         var s = s_cmdmgr.PrepareAppletMenu (_JMenuObj.menuName);
      }
      else if (type == "UtilityLink")
      {
         var nIdx = _JMenuObj.menuName.indexOf ('::');
         var toolbar = _JMenuObj.menuName;
         var menu = "";
         var cmd = "";
         
         if (nIdx != -1)
         {
            toolbar = _JMenuObj.menuName.substring (0, nIdx);
            menu    = _JMenuObj.menuName.substring (nIdx+2);
            
            nIdx = menu.indexOf ('::');
            if (nIdx != -1)
            {
               cmd  = menu.substring (nIdx+2);
               menu = menu.substring (0, nIdx);
            }
         }
     
         var s = s_cmdmgr.PrepareLinkMenu (toolbar, menu, cmd);
         // Enable or disable menu items
         if (!bNoProcessMenu)
         {
            s_cmdmgr.ProcessMenu (s);
         }
      }
      else if (type == "Tasks")
      {
         var i;
         var items = new Array ();

         var inputProps = App().NewPropertySet ();
         var outputProps = null;

         var service = App().GetService ("Task Assistant UI Service");

         outputProps = service.InvokeMethod ("GetTaskMenuList", inputProps);

         var list = null;
         for (i = 0 ; i < outputProps.GetChildCount () ; i++)
         {
            list = outputProps.GetChild (i);

            if (list.GetType () == "ResultSet")
               break;
         }
         
         for (i = 0 ; i < list.GetChildCount () ; i++)
         {
            var item = list.GetChild (i);
            if (item.GetType() == "Separator")
            {
               item.SetProperty("Caption", "");
               item.SetProperty("Command", "");
            }
            else if (item.GetType() == "" || 
                     item.GetType() == "View")
            {
               var display = item.GetProperty ("Display Name");
               item.SetProperty("Caption", display);
               
               var url = item.GetProperty ("Url");   // taskId or viewName
               item.SetProperty("Command", url);
               
               item.SetProperty("Type", "Command");
               item.SetProperty("CommandType", item.GetType());
            }
         }
         
         _JMenuObj.psMenu = list;
         return;
      }
            else if (type == "Reports")
      {
         var inputProps = App().NewPropertySet ();
         var service = App().GetService ("Report Menu Handler (SWE)");
         var outputProps = service.InvokeMethod ("GetCombinedMenuItemList", inputProps);
         var list = outputProps.GetChildByType("ResultSet");
         
         if (list != null)
         {
            _JMenuObj.psMenu = App().NewPropertySet();
            
            var nChildCount = list.GetChildCount ();
            var index =0;
            for (index = 0; index < nChildCount; index++)
            {
               var item = list.GetChild (index);
               var display = item.GetProperty ("Report Name");
               
               if (typeof display != "undefined" && display != null && display != "")
               {
                  var menu = App().NewPropertySet ();
                  
                  menu.SetProperty("Caption", display);
                  
                  var url = item.GetProperty ("Report Executable");
         //xutan, FR#12-1U5S3EF
         //to detect if 8111FP new features are applied
         		  var is8111FPApplied = item.GetProperty("8111FPApplied");
         		  menu.SetProperty("8111FPApplied", is8111FPApplied);
         		  
                  var bipthirdpartypopup = item.GetProperty("BIPThirdPartyPopup");
                  menu.SetProperty ("BIPThirdPartyPopup", bipthirdpartypopup);
                           
                  var showPopup = item.GetProperty("ShowParamPopup");
                  
                  menu.SetProperty("Name", url);
                  menu.SetProperty("ShowParamPopup", showPopup);
                  menu.SetProperty("Type", "Command");

                  menu.SetProperty("Command", url);
                  menu.SetProperty("CommandType", "report");
                  menu.SetProperty("Enabled", "TRUE");
                  
                  _JMenuObj.psMenu.AddChild(menu);
               }
               else
               {
				  var menu = App().NewPropertySet ();
                  menu.SetProperty("Caption", "");
                  menu.SetProperty("Command", "");
                  menu.SetProperty("Type", "Separator");
                  _JMenuObj.psMenu.AddChild(menu);
                  
                  var myReportsName = item.GetProperty("My Reports Display Value");                  
                  var childMenuItemCount = item.GetChildCount();
                  var indx;

                  
                  var myReportsName = item.GetProperty("My Reports Display Value");
                  var myReportsValue= item.GetProperty("My Reports View Name") ;
                  var myUINotificationMenu = item.GetProperty ("Reports UI Notification");
                  
                  if (myReportsName != null && myReportsName != "" && 
                      myReportsValue != null)
                  {
                     var menu = App().NewPropertySet ();
                               
                     if(childMenuItemCount > 0)
                     {
						var UImenu = App().NewPropertySet ();
                              
						UImenu.SetProperty("Caption", myUINotificationMenu); 
						UImenu.SetProperty("Name", myReportsValue);
						UImenu.SetProperty("Type", "Menu");
                     
                        UImenu.SetProperty("Command", myReportsValue);
                        UImenu.SetProperty("CommandType", "myReports");
                        UImenu.SetProperty("Enabled", "TRUE");
             
                        for (indx = 0; indx < childMenuItemCount; indx++)
                        {
							var childItem = item.GetChild (indx);
                            var displayName = childItem.GetProperty ("Report Name");
                            var rowId = childItem.GetProperty ("Row Id");
                            if ( displayName != null && displayName != "" )
                            {
                            var childMenu = App().NewPropertySet();
            
                            childMenu.SetProperty ("Caption", displayName);
                            childMenu.SetProperty ("Name",displayName );
                            childMenu.SetProperty ("Type", "Command");
            
                            childMenu.SetProperty ("Command", "DisplayGeneratedReport");
                            childMenu.SetProperty ("Row Id", rowId);
                            childMenu.SetProperty ("CommandType", "myReportsDownload");
                            childMenu.Setproperty ("Enabled", "TRUE");
                    

            
                            UImenu.AddChild ( childMenu);
                            }
                        }
                        _JMenuObj.psMenu.AddChild(UImenu);
                     }
						menu.SetProperty("Caption", myReportsName);
						menu.SetProperty("Name", myReportsValue);
						menu.SetProperty("Type", "Command");
	                                         
						menu.SetProperty("Command", myReportsValue);
						menu.SetProperty("CommandType", "myReports");
						menu.SetProperty("Enabled", "TRUE");
	                          
						_JMenuObj.psMenu.AddChild(menu);
                  }
                  
                  var scheduleReportName = item.GetProperty("Schedule Report Display Value");
                  var scheduleReportValue= item.GetProperty("Schedule Report") ;
                  if (scheduleReportName != null && scheduleReportName != "" && 
                      scheduleReportValue != null)
                  {
                     var menu = App().NewPropertySet ();
                     //xutan: porting all changes of 8111 new features to 8008+ACR483
                     //the other diff between 8111 and 8008 are ignored
                     //distinguishing ScheduleReport from BIP or ACTUATE
                     var reportEngineType = item.GetProperty("ReportEngineType");
                     menu.SetProperty("ReportEngineType", reportEngineType);
                     //xutan, FR#12-1U5S3EF
                     //to detect if 8111FP new features are applied
                     var is8111FPApplied = item.GetProperty("8111FPApplied");
                     menu.SetProperty("8111FPApplied", is8111FPApplied);
                     
                     
                     menu.SetProperty("Caption", scheduleReportName);
                     menu.SetProperty("Name", scheduleReportValue);
                     menu.SetProperty("Type", "Command");

                     menu.SetProperty("Command", scheduleReportValue);
                     menu.SetProperty("CommandType", "scheduleReport");
                     menu.SetProperty("Enabled", "TRUE");
                     _JMenuObj.psMenu.AddChild(menu);
                  }
               }
            }
         }
         return;
      }
      
      _JMenu_InitializeMenuItems (s, _JMenuObj, addDebug, true);
   }
   catch (e)
   {
   }
}

function _JMenu_GetMenu(name, psMenu)
{
   var i;
   var caption;
   var psMenuItem;
   var childCount = psMenu.GetChildCount ();

   for (i = 0; i < childCount; i++)
   {
      psMenuItem = psMenu.GetChild (i);
      caption = psMenuItem.GetProperty ("Caption");
      
      if (psMenuItem.GetProperty ("Type") == null)
      {
          break;
      }
      if (caption != null)
      {
         var iAmp = caption.indexOf ('&');
         if (iAmp != -1)
         {
            caption = caption.substring (0, iAmp) + caption.substring (iAmp + 1);
         }
         var iBracket = caption.indexOf ("[");
         if (iBracket > -1)
         {
            caption = caption.substring (0, iBracket);
         }
      }
      if (caption == name)
      {
         return psMenuItem;
      }
   }
   return App().NewPropertySet();
}

function isTrue (bl)
{
   return (bl == "true") ? true : false;
}

function _JMenu_InitializeMenuItems (psMenuItemDef, menuObj, addDebug, bAssign)
{
   if (typeof (bAssign) != "undefined" && bAssign)
   {
      menuObj.psMenu = psMenuItemDef;
   }
   for (var i = 0; i < psMenuItemDef.GetChildCount (); i++)
   {
      psSubMenuItemDef = psMenuItemDef.GetChild (i);
         
      type    = psSubMenuItemDef.GetProperty ("Type");
      caption = psSubMenuItemDef.GetProperty ("Caption");
      command = psSubMenuItemDef.GetProperty ("Command");
      
      if ((menuObj.type == "Application") || (menuObj.type == "UtilityLink"))
      {
         repName = psSubMenuItemDef.GetProperty ("Menu");
      }
      else
      {
        repName = "";
        if (command != null && (command != '') && command.indexOf ("#") < 0)
        {
            if (command.indexOf ("*") == 0)
                repName = command.substr (1).split ("*")[2];
        }
        else if (command != null && (command != '') && command.indexOf ("#") == 0)
        {
            repName = "CmdMgr" + psSubMenuItemDef.GetProperty ("Menu");
        }
      }
      
      if (type == null)
         break;

      if (caption != null)
      {
         var iIndex = caption.indexOf ('&');
         if (iIndex != -1)
            caption = caption.substring (0, iIndex) + caption.substring (iIndex + 1);
      
         pos = caption.indexOf ("[");
         accelKey = (pos < 0) ? "" : caption.slice (pos+1, caption.length-1);
         if (pos > -1) caption = caption.substring (0, pos); 
      }
      
      if (repName == '')
         repName = caption;
		
		psSubMenuItemDef.SetProperty ("Name", repName);
		
      if (type == "Menu")
      {
         psSubMenuItemDef.SetProperty ("Enabled", "TRUE");
         
         _JMenu_InitializeMenuItems (psSubMenuItemDef, menuObj);
      }
   }
}

// these methods are implemented by JMenu class.
JMenu.prototype.BindAXObj                  = _JMenu_BindAXObj;
JMenu.prototype._JMenu_Initialize          = _JMenu_Initialize;
JMenu.prototype._JMenu_Load                = _JMenu_Load;
JMenu.prototype.GetMenuItemsInfo           = _JMenu_GetMenuItemsInfo;
JMenu.prototype.GetSubMenuItemsInfo        = _JMenu_GetSubMenuItemsInfo;
JMenu.prototype.ShowContextMenu            = _JMenu_ShowContextMenu;
JMenu.prototype.ShowAppletMenu             = _JMenu_ShowAppletMenu;
JMenu.prototype.SelectMenuItem             = _JMenu_SelectMenuItem;
JMenu.prototype.DoClick                    = _JMenu_DoClick;
