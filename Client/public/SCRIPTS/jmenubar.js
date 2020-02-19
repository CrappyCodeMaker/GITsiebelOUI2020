/*****************************************************************************
 *
 * Copyright (C) 2002, Siebel Systems, Inc., All rights reserved.
 *
 * FILE:       
 *  $Revision: $
 *      $Date: $
 *    $Author: $ of last update
 *
 * CREATOR:    Jsu
 *
 * DESCRIPTION:
 *    	This file creates the Javascript application menu bar.
 *       Functional in IE5.5 and IE6.0.
 *****************************************************************************/	

var _JMenuBarObj = null;

var menuFrame = null;
if ((top._swe != null) && (top._swe._sweapp != null))
   menuFrame = top._swe._sweapp;

var MENUBAR_BGCOLOR = "#123783";
var MENUBAR_TEXTCOLOR = "#FFFFFF";
var MENUBAR_HIGHLIGHT_COLOR = "#FFFFFF";
var MENUBAR_SHADOW_COLOR = "black";


function JMenuBar (isRTL, enableDebug)
{
    this.type = "MenuBar";
    this.items = new Array ();
    this.isRTL = isRTL;
    this.enableDebug = enableDebug;
    this.wasOpen = false;
    this.activeIndex = null;
    this.axObj = null;
}

function _JMenuBar_SetColors (span, textcolor, bgcolor)
{
   var p;
   
   // Set foreground (text) color
   for (p = span; p != null; p = p.parentElement)
   {
      MENUBAR_TEXTCOLOR = p.style.color;
      if (MENUBAR_TEXTCOLOR != "")
      {
         break;
      }
   }
   if (MENUBAR_TEXTCOLOR == "")
   {
      MENUBAR_TEXTCOLOR = textcolor;
   }
   
   // Set background color 
   for (p = span; p != null; p = p.parentElement)
   {
      MENUBAR_BGCOLOR = p.currentStyle.backgroundColor;
      if (MENUBAR_BGCOLOR != "transparent")
      {
         break;
      }
   }
   if (MENUBAR_BGCOLOR == "" || MENUBAR_BGCOLOR == "transparent")
   {
      MENUBAR_BGCOLOR = bgcolor;
   }
}

function _JMenuBar_DrawInset (el)
{
   el.style.borderTop = "1px solid " + MENUBAR_HIGHLIGHT_COLOR;
   el.style.borderLeft = "1px solid " + MENUBAR_HIGHLIGHT_COLOR;
   el.style.borderBottom = "1px solid " + MENUBAR_HIGHLIGHT_COLOR;
   el.style.borderRight = "1px solid " + MENUBAR_HIGHLIGHT_COLOR;
}

function _JMenuBar_DrawFlat (el)
{
   el.style.borderTop = "1px solid " + MENUBAR_BGCOLOR;
   el.style.borderLeft = "1px solid " + MENUBAR_BGCOLOR;
   el.style.borderBottom = "1px solid " + MENUBAR_BGCOLOR; 
   el.style.borderRight = "1px solid " + MENUBAR_BGCOLOR;
}

function _JMenuBar_DrawOutset (el)
{
   el.style.borderTop = "1px solid " + MENUBAR_HIGHLIGHT_COLOR;
   el.style.borderLeft = "1px solid " + MENUBAR_HIGHLIGHT_COLOR;
   el.style.borderBottom = "1px solid " + MENUBAR_HIGHLIGHT_COLOR;
   el.style.borderRight = "1px solid " + MENUBAR_HIGHLIGHT_COLOR;
}

function _JMenuBar_InitializeMenuBar ()
{
   // SWEMOD_CLIENT_BEGIN
   if ((top._swe != null) && (top._swe._sweapp != null))
      menuFrame = top._swe._sweapp;

   var i;
   var caption, repname;
   var psMenuItem;
   var psMenu = App().GetCommandMgr().PrepareGlobalMenu ();
   var childCount = psMenu.GetChildCount ();
   // SWEMOD_CLIENT_END

   for (i = 0; i < childCount; i++)
   {
      psMenuItem = psMenu.GetChild (i);
      caption = psMenuItem.GetProperty ("Caption");
      repname = psMenuItem.GetProperty ("Menu");
      
      if (psMenuItem.GetProperty ("Type") == null)
      {
          return;
      }
      if (caption != null && caption != "")
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
         _JMenuBarObj.items[i] = {caption: caption, name: repname};
      }
   }
}

function _JMenuBar_CreateMenuBar (spanId, isRTL, enableDebug, textcolor, bgcolor)
{
   var span = document.getElementById (spanId);
   //_JMenuBar_SetColors(span, textcolor, bgcolor); Removing for UI77 modifications.kbulusu

   if (_JMenuBarObj == null)
   {
       _JMenuBarObj = new JMenuBar (isRTL, enableDebug);
   }
   _JMenuBarObj.isRTL = isRTL;
   _JMenuBar_InitializeMenuBar ();
   
   var obj = _JMenuBarObj.items;
   var i;
   var strItem;
   
   sHTML = "";
   for (i = 0; i < obj.length; i++)
   {
      strItem = "<td id='" + obj[i].caption + "' nowrap=true style='padding:3px 5px 3px 5px;border:1px solid " + MENUBAR_BGCOLOR + " ;background-color:" + MENUBAR_BGCOLOR + "' onmouseover=_JMenuBar_Select(" + i + "," + isRTL + ") onmouseout=_JMenuBar_Unselect(" + i + ") onclick=_JMenuBar_ShowMenu(" + i + "," + isRTL + ")>" + obj[i].caption + "</td>";
      sHTML += strItem;
   }
   var horizPos = (isRTL) ? "right:10px;" : "left:10px;";
   sHTML =  "<table cellspacing=0 height=18 onbeforedeactivate='_JMenuBar_ResetMenuBar();' style='position:absolute;top:1px;" + horizPos + "font-family:arial;font-size:8pt;cursor:hand;color:" + MENUBAR_TEXTCOLOR + "'><tr> " + sHTML + "</tr></table>";
   span.innerHTML += sHTML;
}

function _JMenuBar_Select (index, isRTL)
{
   if (menuFrame._JMenuObj && menuFrame._JMenuObj.Popup.isOpen)
   {
      _JMenuBar_ShowMenu (index, isRTL, false);
   }
   else
   {
      _JMenuBar_DrawOutset (event.srcElement);
   }
}

function _JMenuBar_Unselect (index)
{
   if (!menuFrame._JMenuObj || !menuFrame._JMenuObj.Popup.isOpen)
   {
      _JMenuBar_DrawFlat (event.srcElement);
   }
}

function _JMenuBar_GoToNextItem (bForward /*Forward or Backward*/)
{
   if (_JMenuBarObj.activeIndex != null)
   {
       var index = _JMenuBarObj.activeIndex + (bForward ? 1 : -1);
       if (index == -1) index = _JMenuBarObj.items.length - 1;
       if (index == _JMenuBarObj.items.length) index = 0;
       
      _JMenuBar_ShowMenu(index, _JMenuBarObj.isRTL);
   }
}

function _JMenuBar_ShowMenu (index, isRTL, bNoProcessMenu, bNoShowMenu)
{
   if ( (index == null) || (index == -1) ) 
   {
      index = (_JMenuBarObj.activeIndex == null) ? 0 : ((_JMenuBarObj.activeIndex + 1) % _JMenuBarObj.items.length);
   }
   
   if (_JMenuBarObj.activeEl != null)
   {
      _JMenuBar_DrawFlat (_JMenuBarObj.activeEl);
   }
   var srcElement = event != null ? event.srcElement : window.document.getElementById( _JMenuBarObj.items[index].caption);
   _JMenuBarObj.activeEl = srcElement;
   _JMenuBarObj.activeIndex = index;
   

   _JMenuBar_DrawInset (srcElement);
   
   var x = (isRTL) ? srcElement.offsetWidth : 0;
   var y = srcElement.offsetHeight;
   var addDebug = (_JMenuBarObj.enableDebug && index == _JMenuBarObj.items.length-1);
   
   _JMenu_Initialize (null, _JMenuBarObj.items[index].caption, "Application",  _JMenuBarObj.axObj, isRTL, null,
                                                            x, y, addDebug, bNoProcessMenu, bNoShowMenu, _JMenuBar_GoToNextItem); 
}

function _JMenuBar_ResetMenuBar ()
{
   if (_JMenuBarObj && _JMenuBarObj.activeEl != null && !menuFrame._JMenuObj.Popup.isOpen)
   {
      _JMenuBar_DrawFlat (_JMenuBarObj.activeEl);
      _JMenuBarObj.activeEl = null;
      _JMenuBarObj.activeIndex = null;
   }
}

///////////////////////////////////////////////////////////////////////////////
//
//  METHOD
//    _JMenuBar_BindAXObj
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
//    htmlID     -   [in] html id of the menu object. 
//
//  RETURN VALUE
//    None
//
//  DESCRIPTION
//    Binds the javascript class to the ActiveX wrapper class.
//
///////////////////////////////////////////////////////////////////////////////

function _JMenuBar_BindAXObj (axObj, menuType, menuName, htmlID)
{
   this.axObj = axObj;
   axObj.jsObj = this;
   axObj.SetMenuName (menuType, menuName);
   axObj.SetApplication (App());
   axObj.SetHtmlID (htmlID);
}

///////////////////////////////////////////////////////////////////////////////
//
//  METHOD
//    _JMenuBar_CloseMenu
//
//  METHOD TYPE
//    API Type (External/Module/Private): Module
//    Overridable? (Yes/No)             : No
//    Overrides Virtual? (Yes/No)       : No
//
//  PARAMETERS
//    NONE 
//
//  RETURN VALUE
//    None
//
//  DESCRIPTION
//    Closes the menu.
//
///////////////////////////////////////////////////////////////////////////////

function _JMenuBar_CloseMenu ()
{
    // If the global _JMenuObj is null just return. If the menu is not open
    // no need to close it.
    if (!menuFrame || !menuFrame._JMenuObj || !menuFrame._JMenuObj.Popup.isOpen)
        return;
        
    // close the menu object. 
    menuFrame._JMenuObj.Popup.hide ();   
}

///////////////////////////////////////////////////////////////////////////////
//
//  METHOD
//    _JMenuBar_SelectMenuItem
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
///////////////////////////////////////////////////////////////////////////////
function _JMenuBar_SelectMenuItem (menuitemName)
{
    // If the global _JMenuObj is null just return.
    if (!menuFrame || !menuFrame._JMenuObj)
        return;
        
    // close the menu object. 
    menuFrame._JMenuObj.SelectMenuItem (menuitemName);   
}

///////////////////////////////////////////////////////////////////////////////
//
//  METHOD
//    _JMenuBar_OpenMenu
//
//  METHOD TYPE
//    API Type (External/Module/Private): Module
//    Overridable? (Yes/No)             : No
//    Overrides Virtual? (Yes/No)       : No
//
//  PARAMETERS
//    menu           - [in] display name of a menu item.  
//    bNoShowMenu    - [in] if need to show menu.
//
//  RETURN VALUE
//    BOOL    -  True is successful.
//            -  false if failed.
//
//  DESCRIPTION
//    Opens a application-level popup menu.
//
///////////////////////////////////////////////////////////////////////////////
function _JMenuBar_OpenMenu (menu, bNoShowMenu)
{
   // If the menu object is not yet created, create it.
   if (menuFrame._JMenuObj == null)
      menuFrame._JMenuObj = new menuFrame.JMenu ();
      
   if (_JMenuBarObj.items)
   {
      for (var i = 0; i < _JMenuBarObj.items.length; i++)
      {
         if (_JMenuBarObj.items[i].name == menu)
         {
            _JMenuBar_ShowMenu (i, _JMenuBarObj.isRTL, false, bNoShowMenu);          
            return true;
         }
      }
   }
   return false;
}

///////////////////////////////////////////////////////////////////////////////
//
//  METHOD
//    _JMenuBar_GetMenuItemIndices
//
//  METHOD TYPE
//    API Type (External/Module/Private): Module
//    Overridable? (Yes/No)             : No
//    Overrides Virtual? (Yes/No)       : No
//
//  PARAMETERS
//    dispName  - [in] display name of a menu item. 
//    menu      - [in] menu item object. 
//
//  RETURN VALUE
//    array of indices corresponding to the item and its ancestors.
//
//  DESCRIPTION
//    Takes the display name of a menu item and returns the array
//    of indices corresponding to the item and its ancestors.
//
///////////////////////////////////////////////////////////////////////////////
function _JMenuBar_GetMenuItemIndices (dispName, menu)
{
   if (!menu || !menu.items)
      return null;
      
   for (var i = 0; i < menu.items.length; i++)
   {
      if (menu.items[i].caption)
      {
         var tmp;
         if (typeof(menu.name) != "undefined")
            tmp = menu.name + "\\" + menu.items[i].name;
         else
            tmp = menu.menuName + "\\" + menu.items[i].name;
         if (tmp == dispName)
         {
            return [i];
         }
         var indices = _JMenuBarObj.GetMenuItemIndices (dispName, menu.items[i]);
         if (indices)
         {
            indices[indices.length] = i;
            return indices;
         }
      }
   }
   return null;
}

///////////////////////////////////////////////////////////////////////////////
//
//  METHOD
//    _JMenuBar_GetMenuItemsInfo
//
//  METHOD TYPE
//    API Type (External/Module/Private): Module
//    Overridable? (Yes/No)             : No
//    Overrides Virtual? (Yes/No)       : No
//
//  PARAMETERS
//    menuname      -   [in] name of the menu object (not used in this case). 
//    propertyName  -   [in] name of the requested property. Property names
//                          are: "MenuItemNames", "MenuItemDisplayNames"  
//                          and "MenuItemStates".
//
//  RETURN VALUE
//    None
//
//  DESCRIPTION
//    This routine iterates through the top level application items and for
//    each items invokes _JMenu_Load method on the _JMenuObj object. The
//    _JMenu_Load method calls the command manager to retrieve the menu items.
//    Once the menu items are retrieved they are put into the propertyValues
//    array by _JMenu_GetSubMenuItemsInfo method.
//
///////////////////////////////////////////////////////////////////////////////

function _JMenuBar_GetMenuItemsInfo (menuname, propertyName)
{
   var   index = 0;
   var   sCaptionStr;
   
   // create the array to hold the property values.
   propertyValues = new Array();
  
   // If the menu object is not yet created, create it.
   if (menuFrame._JMenuObj == null)
      menuFrame._JMenuObj = new menuFrame.JMenu ();

   // iterate through top level menu items and generate strings for them.
   for (index = 0; index < _JMenuBarObj.items.length; index++)
   {
      menuFrame._JMenuObj.menuName = _JMenuBarObj.items[index].caption;
      menuFrame._JMenuObj._JMenu_Load("Application", false, false);

      // iterate through menus and sub-menus and insert values 
      // into propertyValues array.
      if (propertyName == "MenuItemNames")
         sCaptionStr = _JMenuBarObj.items[index].name;
      else
         sCaptionStr = _JMenuBarObj.items[index].caption;
      menuFrame._JMenuObj.GetSubMenuItemsInfo ("Application", menuFrame._JMenuObj.psMenu, 
            propertyName, sCaptionStr, propertyValues);
   }
   return propertyValues;
}

// these methods are implemented by JMenuBar class.
JMenuBar.prototype.CreateMenuBar                 = _JMenuBar_CreateMenuBar;
JMenuBar.prototype.BindAXObj                     = _JMenuBar_BindAXObj;
JMenuBar.prototype.GetMenuItemsInfo              = _JMenuBar_GetMenuItemsInfo;
JMenuBar.prototype.CloseMenu                     = _JMenuBar_CloseMenu;
JMenuBar.prototype.OpenMenu                      = _JMenuBar_OpenMenu;
JMenuBar.prototype.GetMenuItemIndices            = _JMenuBar_GetMenuItemIndices;
JMenuBar.prototype.ShowMenu                      = _JMenuBar_ShowMenu;
JMenuBar.prototype.SelectMenuItem                = _JMenuBar_SelectMenuItem;

