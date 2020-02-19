/*****************************************************************************
 *
 * Copyright (C) 2000, Siebel Systems, Inc., All rights reserved.
 *
 * FILE:       cfgclient.js
 *  $Revision: 31 $
 *      $Date: 11/04/01 12:07a $
 *    $Author: standrio $ of last update
 *
 * CREATOR:    Setiono Tandriono
 *
 * DESCRIPTION
 *    Client Side Framework for HI Config UI
 *
 *****************************************************************************/

var bCFG_frameworkInitialized	= false;
var bCFG_clientJsDebug = false;
var _pipe                     = "[~^`";
var _underscore               = "`^~[";
window.top.maxLoopBuffer      = 5000;
var requestQueueTimeOut       = 180000; // 3 minutes
window.top.m_collapsedCtrl    = new Array ();
   
function CFG_framework()
{
}

function CFG_framework_Init(objId, rootId, rootIntId, prodId, prodName, version)
{  
   //If not already initialized,
   //Create an instance of the UI Framework object

   if (Top().SWEPopupWin)
      Top().SWEPopupWin.close();

   if (!bCFG_frameworkInitialized)
   {     	
      //Member variables
      this.m_controlPropSet              = new JSSCfgPropertySet ();
    
     /*****************  Added for ACR502 - QuickEdit - START   ***************/
      this.m_bQuickEdit                 = false;  //Flag to determine whether it is quickedit or not   
      this.m_sButtonId					= "";     //Member variable to store the Cfg ON/OFF button id.
      this.m_sQEBtnONText				= "";     //Member variable to store the translated text for 'Cfg ON'
      this.m_sQEBtnOFFText				= "";     //Member variable to store the translated text for 'Cfg OFF'
      this.m_bEngineState				= false;  //Flag to determine whether Cfg engine is in ON or OFF state. 
      this.m_bQuickEditDirtyFlag		= false;  //flag to determine whether product structure is changed and not validated.  
     /*****************  Added for ACR502 - QuickEdit - END     ***************/
     
       // JW DeferUpdate: dirty array
      this.m_DirtyItemArray              = new Array ();
      this.m_DirtyIdLookUp               = new Array ();
      this.m_bDeferUpdate                = false;  //DeferUpdate;
      this.m_bDirtyQueue                 = false;
      this.m_bCalculateDynamicShowHide	 = false; /* ACR418A - Dynamic Show/Hide/ReadOnly/Image */
   
      this.m_grandChildAttrArray         = new Array ();
      this.m_grandChildAttrRowIdArray    = new Array ();
      this.m_preInvokeMethod             = new Array ();
      this.m_bRequestLock                = false;
      this.m_requestQueue                = new Array ();
      this.m_requestQueueIndex           = 0;
      this.m_maxMsg                      = 3;
      this.m_curMsg                      = 0;      
      this.m_requestQueueTimeStamp       = -(requestQueueTimeOut); // FR#12-1N31O9Z - Initial value

      this.m_topRequireMoreChild    = "";
      this.m_missingReqAttrArray    = new Array ();
      this.CFG_frameworkObjId		   = objId;
      this.CFG_frameworkRootIntId	= rootIntId;
      this.CFG_frameworkRootId	   = rootId;
      this.CFG_frameworkProdId      = prodId;
      this.CFG_frameworkProdName    = prodName;
      this.CFG_frameworkVersion     = version;
      
      //hardcode for now
      this.whiteImage = "&nbsp;";
      //CR#12-16VR3K3. Move the icon initialization to CFG_framework_InitIconLabel.
      //this.customizeIcon = "<img src=\"images/icon_configure.gif\" border=\"0\" space=\"0\" hspace=\"0\" alt=\"Customize\" title=\"Customize\" />";
      //this.explanationIcon = "<img src=\"images/icon_explain.gif\" border=\"0\" space=\"0\" hspace=\"0\" alt=\"Explanation\" title=\"Explanation\" />";
      //this.editFieldIcon = "<img src=\"images/icon_pick.gif\" border=\"0\" space=\"0\" hspace=\"0\" alt=\"EditField\" title=\"EditField\" />";
      this.conflictIcon = "<img src=\"images/icon_configure_conflict.gif\" alt=\"\">";
      this.redStar = "<IMG src=\"images/icon_configure_requiredcat.gif\" border=\"0\" space=\"0\" hspace=\"0\" />";

      bCFG_frameworkInitialized = true;
   }
   else
   {
   }

   if ( window.addEventListener ) {
      window.addEventListener( "onload", _resetRefreshState, false);
   }
   else if (window.attachEvent) {
      window.attachEvent( "onload", _resetRefreshState );
   }
}

function  CFG_framework_InitIconLabel ()
{
   //CR#12-16VR3K3: The function is usded to initialize icon images and each icon's translated title/alt text. 
   // In 7.8.x and before, the caption of label is defined in control of Cfg Cx Runtime Instance Frame (JS HI), Cfg Cx Runtime Instance Frame. 
   //    We get the localized string via aux field method.
   // In 8.0, the caption of label is retrieved from javascriptMsg error message string. 
   // The label should be declared in the base template. 
   var CustomizeIconLabel = "";
   var ExplanationIconLabel = "";
   var EditFieldIconLabel = "";
   var RemoveIconLabel = "";
   
   if (this.customizeIcon != null && 
       this.explanationIcon != null && 
       this.editFieldIcon != null &&
       this.removeIcon != null)
      return;
               
   CustomizeIconLabel = m_UIFramework.GetTemplateVarValue("sCustomizeLabel");  
   if (CustomizeIconLabel == "")      
      CustomizeIconLabel ="Customizie";     
   this.customizeIcon = "<img src=\"images/icon_configure.gif\" border=\"0\" space=\"0\" hspace=\"0\" alt=\"" + CustomizeIconLabel + "\" title=\"" + CustomizeIconLabel + "\" />";
   
   ExplanationIconLabel = m_UIFramework.GetTemplateVarValue("sExplanationLabel");
   if (ExplanationIconLabel == "")
      ExplanationIconLabel = "Explanation";
   this.explanationIcon = "<img src=\"images/icon_explain.gif\" border=\"0\" space=\"0\" hspace=\"0\" alt=\"" + ExplanationIconLabel + "\" title=\"" + ExplanationIconLabel + "\" />";      
   
   EditFieldIconLabel = m_UIFramework.GetTemplateVarValue("sEditFieldLabel");
   if (EditFieldIconLabel == "")
      EditFieldIconLabel = "EditField";
   this.editFieldIcon = "<img src=\"images/icon_pick.gif\" border=\"0\" space=\"0\" hspace=\"0\" alt=\"" + EditFieldIconLabel + "\" title=\"" + EditFieldIconLabel + "\" />";
   
   RemoveIconLabel = m_UIFramework.GetTemplateVarValue("sRemoveLabel");
   if (RemoveIconLabel == "")
      RemoveIconLabel = "Remove";
   this.removeIcon = "<img src=\"images/icon_delete.gif\" border=\"0\" space=\"0\" hspace=\"0\" alt=\"" + RemoveIconLabel + "\" title=\"" + RemoveIconLabel + "\" />";
}

function CFG_framework_AddControls (strControlPropSet)
{
   this.m_controlPropSet.DecodeFromString (strControlPropSet);
}

function CFG_framework_ShowExplanation (strPropSet)
{
   eval ("showExplanation (strPropSet);");
}
   
function CFG_framework_ShowControl ()
{
   var i;
   var childPropSet;
        	
   childPropSet = this.m_controlPropSet.EnumChildren (true);
   while (childPropSet != null)
   {
      eval (childPropSet.GetProperty ("Show"));

      childPropSet = null;
      childPropSet = this.m_controlPropSet.EnumChildren (false);
   }
   
    // BUG# 18088648
   if (typeof (top.cfgScrollTop) !== "undefined" && top.cfgScrollTop !== null && top.cfgScrollTop !== "") {
       document.getElementsByTagName("body")[0].scrollTop = top.cfgScrollTop;
   }

   if (typeof (top.cfgAnchorId) != "undefined" && top.cfgAnchorId != null && top.cfgAnchorId != "") {
       if (typeof (top.activeElementName) !== "undefined" && top.activeElementName !== null && top.activeElementName !== "") {
           var elements = document.getElementsByName(top.activeElementName);
           for (var i = 0 ; i < elements.length ; i++) {
               var input = elements[i];

               if (((input.type === "radio" || input.type === "checkbox") && input.checked) ||
                    (input.type === "text"))
                   input.focus();
           }
       }
       else if (typeof (top.activeElementId) !== "undefined" && top.activeElementId !== null && top.activeElementId !== "") {
           var element = document.getElementById(top.activeElementId);
           element.focus();
       }
   }
   top.cfgAnchorId = "";
   top.activeElementName = "";
   top.activeElementId = "";
}

/* ACR418A - Dynamic Show/Hide/ReadOnly/Image
   This function is to change the product header image dynamically */
function CFG_framework_NewHeaderImage (strControlPropSet)
{
	var propSet          = new JSSCfgPropertySet ();
	propSet.DecodeFromString (strControlPropSet);
	var rootProdId = propSet.GetProperty ("RootProdId");
   
	if (rootProdId == m_UIFramework.CFG_frameworkProdId)// Only if the current page is the root product's page
	{
		var imgId = "img_product_header";
		var newImage = propSet.GetProperty ("NewImage");
		var imgObj = document.getElementById(imgId);
		imgObj.src = newImage;
	}   
}

/* ACR418A - Dynamic Show/Hide/ReadOnly/Image
   This function is to refresh UI to incorporate any changes which might come due to change in the value of the calculated Cfg Session Expression */
function CFG_framework_RecalculateDynamicShowHide ()
{
	this.m_bCalculateDynamicShowHide = true;
}

function CFG_framework_UpdateCanInvoke (strControlPropSet)
{
   var addPS            = null;
   var bGetFirst        = true;
   var canInvokePropSet = null;
   var dispValue        = "";
   var j                = 0;
   var method           = "";
   var nPropertyCount   = 0;
   var propSet          = new JSSCfgPropertySet ();
   var spanId           = "";
   var spanObj          = null; 
   
   propSet.DecodeFromString (strControlPropSet);
   canInvokePropSet = propSet.GetChildByType ("CanInvokeMethod");  
   
   if (canInvokePropSet == null)
      return;

   nPropertyCount = canInvokePropSet.GetPropertyCount ();
   for (bGetFirst = true, j = 0; j < nPropertyCount; j++, bGetFirst = false)
   {
      dispValue = "";
      spanId   = "";
      spanObj  = null;
      method   = "";
      
      if (bGetFirst)
         spanId     = canInvokePropSet.GetFirstProperty ();
      else
         spanId     = canInvokePropSet.GetNextProperty (); 

      if (spanId != "")
      {
         method = canInvokePropSet.GetProperty (spanId);
         if (method != "")
         {   
            var linkId        = "";
            var linkHTML      = "";      
                            
            //Need to enable the link
            spanObj =  document.getElementById (spanId);
            if (spanObj != null  || bCFG_clientJsDebug)
            {
               dispValue = spanObj.innerHTML;
               linkId = spanId + _underscore + "LINK";
               linkHTML = "<a id=\"" + linkId + "\" href='JavaScript:processInput(\"" + spanId + "\", \"" + method + "\",\"linkMethod\")'>" +
                        dispValue + "</a>";      
                                                                 
               spanObj.innerHTML = linkHTML;
                     
               if (spanObj.className == "minibuttonOff")
                  spanObj.className = "minibuttonOn";
            }
         }
         else
         {
            //Need to disable the link
            spanObj = document.getElementById (spanId + _underscore + "LINK");
            if (spanObj != null || bCFG_clientJsDebug)
               RemoveNodeCustom (spanObj); 
            
            spanObj = document.getElementById (spanId);    
            if (spanObj.className == "minibuttonOn")
               spanObj.className = "minibuttonOff";            
         }
      }
   }

}

function CFG_framework_UpdateGenerics (strControlPropSet)
{
   var addPS            = null;
   var addPSChildren    = null;
   var bGetFirst        = true;
   var delPS            = null;
   var delPSChildren    = null;
   var genPropSet       = null;
   var j                = 0;
   var nPropertyCount   = 0;
   var propSet          = new JSSCfgPropertySet ();
   var spanId           = "";
   var spanObj          = null; 
   
   propSet.DecodeFromString (strControlPropSet);
   genPropSet = propSet.GetChildByType ("Generic Info");  
   
   if (genPropSet == null)
      return;

   //1. Add
   addPS = genPropSet.GetChildByType ("Add");
   
   if (addPS != null)
   {
      nPropertyCount = addPS.GetPropertyCount ();
      for (bGetFirst = true, spanId = null, j = 0; j < nPropertyCount; j++, bGetFirst = false, spanId = null)
      {
         if (bGetFirst)
            spanId     = addPS.GetFirstProperty ();
         else
            spanId     = addPS.GetNextProperty (); 

         if (spanId != null)
         {
            spanObj = document.getElementById (spanId);
            if (spanObj != null)
            {
               //harcode for now
               spanObj.innerHTML = this.redStar;
            }
         }
      }
   }

   //3. Delete
   delPS = genPropSet.GetChildByType ("Delete");
   
   if (delPS != null)
   {
      nPropertyCount = delPS.GetPropertyCount ();
      for (bGetFirst = true, spanId = null, j = 0; j < nPropertyCount; j++, bGetFirst = false, spanId = null)
      {
         if (bGetFirst)
            spanId     = delPS.GetFirstProperty ();
         else
            spanId     = delPS.GetNextProperty (); 

         if (spanId != null)
         {
            spanObj = document.getElementById (spanId);
            if (spanObj != null)
               spanObj.innerHTML = this.whiteImage;
         }
      }
   }

   //Add HasChildren
   addPSChildren = genPropSet.GetChildByType ("AddChildren");
   
   if (addPSChildren != null)
   {
      nPropertyCount = addPSChildren.GetPropertyCount ();
      for (bGetFirst = true, spanId = null, j = 0; j < nPropertyCount; j++, bGetFirst = false, spanId = null)
      {
         if (bGetFirst)
            spanId     = addPSChildren.GetFirstProperty ();
         else
            spanId     = addPSChildren.GetNextProperty (); 

         if (spanId != null)
         {
            spanObj = document.getElementById ("MENUBUTTON_" + spanId);
            if (spanObj != null)
            {
               //harcode for now
               spanObj.innerHTML = _blackBullet;
            }
         }
      }
   }

   //Delete HasChildren
   delPSChildren = genPropSet.GetChildByType ("DeleteChildren");
   
   if (delPSChildren != null)
   {
      nPropertyCount = delPSChildren.GetPropertyCount ();
      for (bGetFirst = true, spanId = null, j = 0; j < nPropertyCount; j++, bGetFirst = false, spanId = null)
      {
         if (bGetFirst)
            spanId     = delPSChildren.GetFirstProperty ();
         else
            spanId     = delPSChildren.GetNextProperty (); 

         if (spanId != null)
         {
            spanObj = document.getElementById ("MENUBUTTON_" + spanId);
            if (spanObj != null)
            {
               //harcode for now
               spanObj.innerHTML = _greenBullet;
            }
         }
      }
   }

}

function CFG_framework_UpdateSignal (strControlPropSet)
{
   var sigPropSet       = null;
   var k                = 0;
   var nChildCount      = 0;
   var propSet          = new JSSCfgPropertySet ();
   var updateFunction   = "";
   var updateSig        = "";
   
   propSet.DecodeFromString (strControlPropSet);
   nChildCount = propSet.GetChildCount ();
   
   for (k = 0; k < nChildCount; k++)
   {     
      sigPropSet = null;
      sigPropSet = propSet.GetChild (k);  
      
      if (sigPropSet != null)
      {             
         updateFunction = updateSig = "";
         updateSig = sigPropSet.GetProperty ("CfgJSUpdateSignal");
         if (updateSig != "")
         {
            updateFunction = updateSig + " (sigPropSet);";          
            eval (updateFunction);
         }
      }
   }
}

function updateSignal (sigPropSet)
{
   var addPS            = null;
   var bGetFirst        = true;
   var delPS            = null;
   var j                = 0;
   var msgPS            = null;
   var spanId           = "";
   var tdObj            = null;
   var trObj            = null; 
   var tableObj         = null;
   var type             = "";
   
   type = sigPropSet.GetType ();      
   //1. Add
   addPS = sigPropSet.GetChildByType ("Add");
   
   if (addPS != null)
   {
      tableObj = null;

      tableObj = document.getElementById ("CfgMsgSig");
 
      if (tableObj != null)
      {               
         nPropertyCount = addPS.GetPropertyCount ();
         for (bGetFirst = true, spanId = null, j = 0; j < nPropertyCount; j++, bGetFirst = false, spanId = null)
         {
            if (bGetFirst)
               spanId     = addPS.GetFirstProperty ();
            else
               spanId     = addPS.GetNextProperty (); 

            if (spanId != null)
            {
               trObj = tableObj.insertRow (-1);
               trObj.id = spanId;
               tdObj = trObj.insertCell (-1);
               tdObj.innerHTML = "<img src=\"IMAGES/bullet_green.gif\" width=\"9\" height=\"14\" border=\"0\">";
               tdObj.width = "1%";
               tdObj.vAlign = "top";
               tdObj = trObj.insertCell (-1);
               tdObj.innerHTML = spanId;
               tdObj.width = "99%";
               tdObj.colSpan = "2";     
               trObj.style.display = "none";          
            }
         }
      }
   }

   //3. Delete
   delPS = sigPropSet.GetChildByType ("Delete");
   
   if (delPS != null)
   {       
      nPropertyCount = delPS.GetPropertyCount ();
      for (bGetFirst = true, spanId = null, j = 0; j < nPropertyCount; j++, bGetFirst = false, spanId = null)
      {
         if (bGetFirst)
            spanId     = delPS.GetFirstProperty ();
         else
            spanId     = delPS.GetNextProperty (); 

         if (spanId != null)
         {
            trObj = document.getElementById (spanId);
            if (trObj != null)
               if (document.all)
                  trObj.removeNode (true);
               else
                  trObj.parentNode.removeChild(trObj);
         }
      }
   }
   
   msgPS = sigPropSet.GetChildByType ("Message");
   if (typeof (msgPS) != "undefined" && msgPS != null)
      showMessage (msgPS);
}

function CFG_framework_UpdateResources (strControlPropSet)
{
   var bGetFirst        = true;
   var resPropSet       = null;
   var j                = 0;
   var nPropertyCount   = 0;
   var propSet          = new JSSCfgPropertySet ();
   var spanId           = "";
   var spanObj          = null; 
   
   propSet.DecodeFromString (strControlPropSet);
   resPropSet = propSet.GetChildByType ("Resource");  
   
   if (resPropSet == null)
      return;

   nPropertyCount = resPropSet.GetPropertyCount ();
   for (bGetFirst = true, spanId = null, j = 0; j < nPropertyCount; j++, bGetFirst = false, spanId = null)
   {
      if (bGetFirst)
         spanId     = resPropSet.GetFirstProperty ();
      else
         spanId     = resPropSet.GetNextProperty (); 

      if (spanId != null)
      {
         spanObj = document.getElementById ("GRPITEM" + _pipe + spanId);
         if (spanObj != null)
            spanObj.innerHTML = resPropSet.GetProperty (spanId);
      }
   }
}

function CFG_framework_UpdateRootProdInfo (strControlPropSet)
{
   var bGetFirst        = true;
   var resPropSet       = null;
   var j                = 0;
   var nPropertyCount   = 0;
   var propSet          = new JSSCfgPropertySet ();
   var spanId           = "";
   var spanObj          = null; 
   
   propSet.DecodeFromString (strControlPropSet);
   resPropSet = propSet.GetChildByType ("Delta Root");  
   
   if (resPropSet == null)
      return;   

   nPropertyCount = resPropSet.GetPropertyCount ();
   for (bGetFirst = true, spanId = null, j = 0; j < nPropertyCount; j++, bGetFirst = false, spanId = null)
   {
      if (bGetFirst)
         spanId     = resPropSet.GetFirstProperty ();
      else
         spanId     = resPropSet.GetNextProperty (); 

      if (spanId != null)
      {
         spanObj = document.getElementById ("GRPITEM" + _pipe + spanId);
         if (spanObj != null)
            spanObj.innerHTML = resPropSet.GetProperty (spanId);
            
         if (spanId == "Top RequireMoreChild")
            this.m_topRequireMoreChild = resPropSet.GetProperty (spanId);
      }
   }
}

function CFG_framework_UpdateSelectionInfo (strControlPropSet)
{  
   var nSelectInfoCount;
   var i;
   var rowId;
   var selectInfoPS = null;
   var updateSelectionInfoPropSet = new JSSCfgPropertySet ();
   var updateSelection = "";
   var updateFunction  = "";
   
   updateSelectionInfoPropSet.DecodeFromString (strControlPropSet);
   selectInfoPS = updateSelectionInfoPropSet.GetChildByType ("SelectionInfo");
   
   if (selectInfoPS == null) // in the case of conflicts
      return;
      
   nSelectInfoCount = selectInfoPS.GetChildCount();
   
   for (i = 0; i < nSelectInfoCount; i++)
   {
      updateSelection = updateFunction = "";
      var selectInfoPropSet = selectInfoPS.GetChild (i);
      updateSelection = selectInfoPropSet.GetProperty ("CfgJSUpdateSelection");
      
      if (updateSelection != "")
      {
         updateFunction = updateSelection + " (selectInfoPropSet);";     
         eval (updateFunction);
      }
   }
}

function updateSelectionInfoForAttribute (selectInfoPropSet)
{
   var attObj   = null;  
   var attName  = selectInfoPropSet.GetProperty ("AttName");
   var attValue = selectInfoPropSet.GetProperty ("AttValue");
   var attId    = selectInfoPropSet.GetProperty ("XA Id");
   var usage    = selectInfoPropSet.GetProperty ("Usage");
   var attValueOld = selectInfoPropSet.GetProperty ("AttValueOld");
   var strParentPath = selectInfoPropSet.GetProperty ("Parent Path");
   var td       = null;
   var hasGeneric    = selectInfoPropSet.GetProperty ("RequireMoreChild");;   
   var inlineAttObj  = document.getElementById ("GENERICS"+ _pipe + strParentPath + _underscore + "ATTR" + _pipe + attId);
   
   // FR#12-15ZK4MW: Update the asterisk for inline attribute.
   if (inlineAttObj != null)
   {
      if (hasGeneric == "Y")
         inlineAttObj.innerHTML = m_UIFramework.redStar;
      else
         inlineAttObj.innerHTML = m_UIFramework.whiteImage;
   }   
   
   if (usage == "TextBox")
   {
      attObj = document.getElementById ("GRPITEM" + _pipe + strParentPath + _underscore + "ATTR" + _pipe + attId + _underscore + "ATTTYPE" + _pipe + "TEXT");
      if (attObj != null || bCFG_clientJsDebug)
         attObj.value = attValue;
   }
   else if (usage.indexOf("Combo") == 0) //usage == "ComboBox"
   {
      //We don't have an empty option for Attributes.
      //So if the value is empty, we don't do anything
      //Not sure if this is the right thing to do though
      if (attValue != "" && typeof (attValue) != "undefined")
      {
         attObj = document.getElementById (strParentPath + _underscore + "ATTR" + _pipe + attId + _underscore + "ATTRDOMAIN" + _pipe + attValue);
         if (attObj != null || bCFG_clientJsDebug)
            attObj.selected = true;
      }
   } 
   else if (usage == "Radio")
   {
      //We don't have an empty option for Attributes.
      //So if the value is empty, we don't do anything
      //Not sure if this is the right thing to do though
      if (attValue != "" && typeof (attValue) != "undefined")
      {
         td = attObj = null;
         td = document.getElementById (strParentPath + _underscore + "ATTR" + _pipe + attId + _underscore + "ATTVAL" + _pipe + attValue + _underscore + "FIELD" + _pipe + "Input");
         if (td != null || bCFG_clientJsDebug)
         {
            attObj = td.getElementsByTagName ("input");
            if (attObj != null || bCFG_clientJsDebug)
               attObj[0].checked = true;
         }
      }
      
      if (attValueOld != "" && typeof (attValueOld) != "undefined")
      {
         td = attObj = null;
         td = document.getElementById (strParentPath + _underscore + "ATTR" + _pipe + attId + _underscore + "ATTVAL" + _pipe + attValueOld + _underscore + "FIELD" + _pipe + "Input");
         if (td != null || bCFG_clientJsDebug)
         {
            attObj = td.getElementsByTagName ("input");
            if (attObj != null || bCFG_clientJsDebug)
               attObj[0].checked = false;
         }
      }      
   }    
}

function checkForceRefresh (portItemPropSet, onAdd, onDelete)
{
   var addPS                  = null;
   var bRefreshOnAdd          = false;
   var bRefreshOnDel          = false;
   var delPS                  = null;
   var nAddCnt                = 0;
   var nDelCnt                = 0;
   var strForceRefresh        = "";
   
   strForceRefresh = portItemPropSet.GetProperty ("ForceRefresh");
   
   addPS = portItemPropSet.GetChildByType ("Add");
   if (addPS != null)
      nAddCnt = addPS.GetChildCount ();   
   if (nAddCnt > 0 && onAdd)
      bRefreshOnAdd = true;
      
   delPS = portItemPropSet.GetChildByType ("Delete");
   if (delPS != null)
      nDelCnt = delPS.GetChildCount ();  
   if (nDelCnt > 0 && onDelete)
      bRefreshOnDel = true;        
      
   if ((bRefreshOnAdd || bRefreshOnDel) && 
        strForceRefresh != 'undefined' && strForceRefresh != null && strForceRefresh.toUpperCase () == "Y")
      SubmitToQueue ("m_UIFramework.RefreshUI ()");    
}

function updatePortItemsForComboAddWithoutQtyCtrl (portItemPropSet)
{
   portItemPropSet.SetProperty ("NoQtyCtrl", "Y");
   updatePortItemsForComboAdd (portItemPropSet);
}

//This function originated from BT's requirement to display Attributes in line with the grandchild Line Item
//The only difference with this function is that it makes sure the screen does not refresh when user deletes
//a grandchild attribute
function updatePortItemsForComboAddAttr (portItemPropSet)
{
   updatePortItemsForComboAddHelper (portItemPropSet);
   checkForceRefresh (portItemPropSet, true, false); 
}

function updatePortItemsForComboAdd (portItemPropSet)
{ 
   updatePortItemsForComboAddHelper (portItemPropSet);
   checkForceRefresh (portItemPropSet, true, true); 
}

function updatePortItemsForComboAddHelper (portItemPropSet)
{
   var addPS            = null;
   var childPS          = null;
   var comboAddPS       = null;
   var delPS            = null;
   var fieldHeader      = null;
   var fieldListObj     = null;
   var fieldName        = "";
   var fieldValue       = "";
   var idInfo           = null;
   var instancePropSet  = null;
   var j                = 0;
   var modPS            = null;
   var nInstanceCount   = 0;
   var path             = "";
   var portId           = "";
   var portItemCount    = 0;
   var prodId           = "";
   var rowId            = "";
   var strIntId         = "";
   var strPortId        = "";
   var tdObj            = null;
   var tableId          = "";
   var tableObj         = null;
   var tempPropSet      = null; //temp property set to display the field header   
   var NoQtyCtrl        = portItemPropSet.GetProperty ("NoQtyCtrl");
   
   tableId = portItemPropSet.GetType ();
   comboAddPS = m_UIFramework.m_controlPropSet.GetChildByType (tableId);
      
   tableId = tableId.replace (/PORT/, "PORTITEM");

   portItemCount = comboAddPS.GetProperty ("PortItemCount");
   //1. Add
   addPS = portItemPropSet.GetChildByType ("Add");
   if (addPS != null)
   {
      nInstanceCount = addPS.GetChildCount ();
      
      for (j = 0; j < nInstanceCount; j++)
      {           
         strIntId = "";
         instancePropSet = null;
         instancePropSet = new JSSCfgPropertySet ();
         instancePropSet.Copy (addPS.GetChild (j));
         strIntId = instancePropSet.GetProperty ("Path");
         instancePropSet.SetType (tableId + _underscore + "INTID" + _pipe + strIntId);
         m_UIFramework.m_controlPropSet.AddChild (instancePropSet);
         if (NoQtyCtrl == "Y")
            instancePropSet.SetProperty ("NoQtyCtrl", NoQtyCtrl);
         addPortItem (tableId, instancePropSet);
         if (j == 0)
            tempPropSet = instancePropSet;               
         portItemCount++;         
      }
   }  

   //2. Modify
   modPS = portItemPropSet.GetChildByType ("Modify");
   if (modPS != null)
   {
      nInstanceCount = modPS.GetChildCount ();
      for (j = 0; j < nInstanceCount; j++)
      {
         var inputObj    = null;
         instancePropSet = null;
         instancePropSet = modPS.GetChild (j);
         
         fieldName = path = prodId = portId = fieldValue = "";
         tdObj = null;
         
         fieldName = instancePropSet.GetProperty ("Name");
         path = instancePropSet.GetProperty ("Path");
         portId = instancePropSet.GetProperty ("Port Item Id");
         fieldValue = instancePropSet.GetProperty ("Value");
         tdObj = document.getElementById (tableId +
                                          _underscore + "INTID" + _pipe + path + _underscore + "FIELD" + _pipe + fieldName);
                                          
         if (tdObj != null)
         { 
            inputObj = tdObj.getElementsByTagName ("INPUT");
            if (inputObj.length > 0)
               inputObj[0].value = fieldValue;
            else
               tdObj.innerHTML = fieldValue; 
         }      
      }
   }
   
   //3. Delete
   delPS = portItemPropSet.GetChildByType ("Delete");
   if (delPS != null)
   {
      nInstanceCount = delPS.GetChildCount ();
      for (j = 0; j < nInstanceCount; j++)
      {
         rowId = path = portId = "";
         instancePropSet = null;
         var index       = "";
         
         instancePropSet = delPS.GetChild (j);  
         path = instancePropSet.GetProperty ("Path");
         portId = instancePropSet.GetProperty ("Port Item Id");
         rowId = tableId + _underscore + "INTID" + _pipe + path;

         deletePortItem (tableId, rowId);  
         
         index = m_UIFramework.m_controlPropSet.GetChildIndexByType (rowId);
         m_UIFramework.m_controlPropSet.RemoveChild (index); 
         portItemCount--;    
      }
   }
   
   comboAddPS.SetProperty ("PortItemCount", portItemCount);

   if (portItemCount > 0)
   {           
      //display the field header if any items exist
      fieldHeader = document.getElementById (tableId + _underscore + "FIELDHEADER");
      if (fieldHeader == null)
      {
         tableObj = document.getElementById (tableId);
         if (tableObj != null || bCFG_clientJsDebug)
         {
            fieldHeader = tableObj.insertRow (0);
            fieldHeader.id = tableId + _underscore + "FIELDHEADER";
            
            var fieldListPropSet  = new JSSCfgPropertySet ();
            var strFieldList  = tempPropSet.GetProperty ("FieldList");
            fieldListPropSet.DecodeFromString (strFieldList);    
               
            displayFieldHeader (fieldHeader, fieldListPropSet);
         }
      }
      fieldHeader.style.display = "";
   }
   else
   {
      //hide the field header if no items exist
      fieldHeader = document.getElementById (tableId + _underscore + "FIELDHEADER");
      if (fieldHeader != null)
         fieldHeader.style.display = "none";   
   } 
}

function updatePortItemsForComboBox (portItemPropSet)
{
   updatePortItemsForComboBoxHelper (portItemPropSet);
   checkForceRefresh (portItemPropSet, true, true); 
}

function updatePortItemsForCheckBox (portItemPropSet)
{
   updatePortItemsForDomainChildCtrl (portItemPropSet, "CheckBox");
   checkForceRefresh (portItemPropSet, true, true); 
}

function updatePortItemsForRadio (portItemPropSet)
{
   updatePortItemsForDomainChildCtrl (portItemPropSet, "Radio");
   checkForceRefresh (portItemPropSet, true, true); 
}

function updatePortItemsForQuantityList (portItemPropSet)
{
   updatePortItemsForDomainChildCtrl (portItemPropSet, "QuantityList");
   checkForceRefresh (portItemPropSet, true, true); 
}
            
function updatePortItemsForDomainChildCtrl (portItemPropSet, usage)
{
   var addPS            = null;
   var delPS            = null;
   var domainPropSet    = null;
   var fieldListObj     = null;
   var fieldListPropSet = new JSSCfgPropertySet ();
   var fieldName        = "";
   var fieldValue       = "";
   var hasGeneric       = "";
   var innerHTML        = "";
   var innerText        = "";
   var inputObj         = null;
   var instancePropSet  = null;
   var j                = 0;
   var modPS            = null;
   var nInstanceCount   = 0;
   var nPropertyCount   = 0;
   var prodPropSet      = null;   
   var resultPropSet    = null;
   var rowId            = "";
   var rowType          = "";
   var selected         = "";
   var strDrillDownId   = "";
   var strFieldList     = "";
   var strGenericsId    = "";
   var strSpanId        = "";
   var strIntId         = "";
   var strPortId        = "";
   var strProdId        = "";
   var strTdId          = "";
   var strTrId          = "";
   var spanObj          = null;
   var tableId          = ""; 
   var tdObj            = null;
   var trObj            = null;
   var textObjArray     = null;
   var textValue        = "";

   rowType = _underscore + "PROD" + _pipe;
   strSpanId = portItemPropSet.GetType ();
      
   //1. Delete
   delPS = portItemPropSet.GetChildByType ("Delete");  
   if (delPS != null)
   {
      nInstanceCount = delPS.GetChildCount ();
      for (j = 0; j < nInstanceCount; j++)
      {
         rowId = strPortId = strProdId = strPortId = strIntId = "";
         instancePropSet = null;
         instancePropSet = delPS.GetChild (j);  
         strPortId = instancePropSet.GetProperty ("Port Item Id");
         strProdId = instancePropSet.GetProperty ("Product Id");
         strIntId = instancePropSet.GetProperty ("Path");
         rowId = strSpanId + _underscore + "PROD" + _pipe + strProdId;   

         trObj = null;
                
         //Get the row in the control that this instance will reside in.
         trObj = document.getElementById (rowId);
         tdObj = null;
         spanObj = null;
         
         if (trObj != null)
         {
            resultPropSet = m_UIFramework.m_controlPropSet.GetChildByType (strSpanId);            
            domainPropSet = resultPropSet.GetChildByType ("Domain");      
            prodPropSet = domainPropSet.GetChildByType (strProdId);  
            strFieldList  = resultPropSet.GetProperty ("FieldList");
            fieldListPropSet.DecodeFromString (strFieldList);  

	SetExcluded(resultPropSet, strProdId, strSpanId); // Fix for FR#12-1MWR5B3 - Ineligible products selection
               
            //Get rid of the Path in m_controlPropSet.
            //This will affect the way the event handler is handled for a quantity list
            prodPropSet.RemoveProperty ("Path");  
            
            //1. Make sure the control is unchecked. This is important if the product is deleted by the engine (eg. FinishIt)
            if (usage == "QuantityList")
            {
               tdObj = document.getElementById (rowId + _underscore + "FIELD" + _pipe + "Quantity");
               if (tdObj != null || bCFG_clientJsDebug)
               {
                  spanObj = tdObj.getElementsByTagName ("input");
                  if (spanObj != null || bCFG_clientJsDebug)
                     spanObj[0].value = "";
               }
            }
            else if (usage == "CheckBox")
            {
               tdObj = document.getElementById (rowId + _underscore + "FIELD" + _pipe + "Quantity");
               if (tdObj != null || bCFG_clientJsDebug)
               {
                  spanObj = tdObj.getElementsByTagName ("input");
                  if (spanObj != null || bCFG_clientJsDebug)
                     spanObj[0].checked = false;
               }
            }            
            else if (usage == "Radio")
            {
               //We can only uncheck a radio button by checking some other radio button.
               //In this case, we will always check the none button
               tdObj = document.getElementById (strSpanId + _underscore + "PROD" + _pipe + "none" + _underscore + "FIELD" + _pipe + "Quantity");
               if (tdObj != null || bCFG_clientJsDebug)
               {
                  spanObj = tdObj.getElementsByTagName ("input");
                  if (spanObj != null || bCFG_clientJsDebug)
                     spanObj[0].checked = true;
               }
            }
                  
            //2. Get rid of the drilldown object
            strDrillDownId = "";
            strDrillDownId = strSpanId + _underscore + "PORTDOMAIN" + _pipe + strProdId + _underscore + "CXLINK";
            spanObj = document.getElementById (strDrillDownId);
            if (spanObj != null)
               RemoveNodeCustom (spanObj);
               
            //Delete the generics
            strGenericsId = "";
            strGenericsId = "GENERICS" + _pipe + strIntId;
            spanObj = document.getElementById (strGenericsId);
            if (spanObj != null)
            {
               spanObj.innerHTML = "";
               if (document.all)
                  spanObj.removeNode (true);
               else
                  spanObj.parentNode.removeChild(spanObj);
            }
               
            //3. Delete the field list
            deleteFieldList (trObj, fieldListPropSet);  
         }               
      } 
   }     
      
   //2. Add
   addPS = portItemPropSet.GetChildByType ("Add");
   if (addPS != null)
   {
      strPortId = addPS.GetProperty ("Port Item Id");

      nInstanceCount = addPS.GetChildCount ();
      for (j = 0; j < nInstanceCount; j++)
      {
         var k          = 0;
         var y          = 0;
         instancePropSet = null;
         instancePropSet = addPS.GetChild (j);
         trObj      = null;
         tdObj          = null;
         spanObj        = null;
                     
         strProdId = instancePropSet.GetProperty ("Product Id");
         strIntId  = instancePropSet.GetProperty ("Path");
         selected  = instancePropSet.GetProperty ("Selected");
         hasGeneric = instancePropSet.GetProperty ("RequireMoreChild");

         updateInstanceInfo (strSpanId, strProdId, instancePropSet);
               
         //Get the row in the control that this instance will reside in.
         strTrId = strSpanId + _underscore + "PROD" + _pipe + strProdId;
         trObj = document.getElementById (strTrId);

         if (trObj != null)
         {
            resultPropSet = m_UIFramework.m_controlPropSet.GetChildByType (strSpanId);
            strFieldList  = resultPropSet.GetProperty ("FieldList");
            fieldListPropSet.DecodeFromString (strFieldList);                

            //1. Make sure the control is checked. This is important if the product is added by the engine (eg. FinishIt)
            if (usage == "QuantityList")
            {
               tdObj = document.getElementById (strTrId + _underscore + "FIELD" + _pipe + "Quantity");
               if (tdObj != null || bCFG_clientJsDebug)
               {
                  spanObj = tdObj.getElementsByTagName ("input");
                  if (spanObj != null || bCFG_clientJsDebug)
                     spanObj[0].value = instancePropSet.GetProperty ("Quantity");
               }
            }
            else
            {
               tdObj = document.getElementById (strTrId + _underscore + "FIELD" + _pipe + "Quantity");
               if (tdObj != null || bCFG_clientJsDebug)
               {
                  spanObj = tdObj.getElementsByTagName ("input");
                  if (spanObj != null || bCFG_clientJsDebug)
                     spanObj[0].checked = true;
               }               
            }
            
            //2. If it's a complex product, make the object name drillable
            if (instancePropSet.GetProperty ("CanDrillDown") == "Y")
            {
               strDrillDownId = strSpanId + _underscore + "PORTDOMAIN" + _pipe + strProdId;
               spanObj = document.getElementById (strDrillDownId);
               if (spanObj != null || bCFG_clientJsDebug)
               {
                  if(document.all)
                     innerText = spanObj.innerText;
                  else
                     innerText = spanObj.textContent;
                  
                  innerHTML = "<a id=\"" + strDrillDownId + _underscore + "CXLINK\" href='javascript:processInput(\"GRPITEM" + _pipe + strSpanId + _underscore + "PROD" + _pipe + strProdId + "\", \"SetTopObj\", \"linkMethod\")'>";
                  innerHTML += innerText;
                  innerHTML += "</a>";

                  spanObj.innerHTML = innerHTML;
               }
            }
            
            //Update generics
            spanObj = document.getElementById (strSpanId + _underscore + "PORTDOMAIN" + _pipe + strProdId);      
            if (spanObj != null || bCFG_clientJsDebug)
            {
               addGenerics (resultPropSet, spanObj, strIntId, hasGeneric); 
               spanObj.className = "eCfgOptionAvailable"; // Fix for FR#12-1MWR5B3 - Ineligible products selection
            }
                     
            //3. Create new fields as necessary
            displayFieldList (trObj, rowType, resultPropSet.GetType (), fieldListPropSet, instancePropSet, true);    
         }       
      }
   }
   
   //3. Modify
   modPS = portItemPropSet.GetChildByType ("Modify");
   if (modPS != null)
   {
      nInstanceCount = modPS.GetChildCount ();
      for (j = 0; j < nInstanceCount; j++)
      {
         inputObj        = null;
         instancePropSet = null;
         instancePropSet = modPS.GetChild (j);
         
         fieldName = strProdId = strPortId = fieldValue = "";
         tdObj = null;
         
         fieldName = instancePropSet.GetProperty ("Name");
         strProdId = instancePropSet.GetProperty ("Product Id");
         strPortId = instancePropSet.GetProperty ("Port Item Id");
         fieldValue = instancePropSet.GetProperty ("Value");
         tdObj = document.getElementById (strSpanId +
                                          _underscore + "PROD" + _pipe + strProdId + _underscore + "FIELD" + _pipe + fieldName);
                                          
         if (tdObj != null)
         { 
            inputObj = tdObj.getElementsByTagName ("INPUT");
            if (inputObj.length > 0)
            {
               if (usage == "CheckBox")
               {
                  if (fieldValue == "0")
                     inputObj[0].checked = false;
                  else
                     inputObj[0].checked = true;
               }
               else if (usage == "QuantityList")
               {
                  if (fieldValue == "0")
                     fieldValue = "";
                  inputObj[0].value = fieldValue;
               }
               else if (usage == "Radio")
               {
                  if (fieldValue == "0")
                  {
                     //We can only uncheck a radio button by checking some other radio button.
                     //In this case, we will always check the none button
                     tdObj = document.getElementById (strSpanId + rowType + "none" + _underscore + "FIELD" + _pipe + "Quantity");
                     if (tdObj != null || bCFG_clientJsDebug)
                     {
                        inputObj = tdObj.getElementsByTagName ("input");
                        if (inputObj != null || bCFG_clientJsDebug)
                           inputObj[0].checked = true;
                     }
                  } 
                  else
                     inputObj[0].checked = true;            
               }
            }
            else
               tdObj.innerHTML = fieldValue; 
         }      
      }  
   } 
}

function updatePortItemsForComboBoxHelper (portItemPropSet)
{   
   var bGetFirst              = true;
   var addPS                  = null;
   var comboPropSet           = null;   
   var delPS                  = null;
   var fieldName              = "";
   var fieldValue             = "";
   var hasGeneric             = "";
   var idInfo                 = null;
   var inputObj               = null;
   var instancePropSet        = null;
   var nInstanceCount         = 0;
   var j                      = 0;
   var k                      = 0;
   var nPropertyCount         = 0;;
   var optionId               = "";
   var optionObj              = null;
   var path                   = "";
   var portId                 = "";
   var prodId                 = "";  
   var rowId                  = null;
   var spanObj                = null;
   var strGenericsId          = "";
   var strSpanId              = "";
   var td                     = null;
   var tdArray                = null;
   var tr                     = null;
   var trId                   = "";
   
   //1. Delete first before add to ensure we're not deleting the ones we're adding
   delPS = portItemPropSet.GetChildByType ("Delete");
   strSpanId = portItemPropSet.GetType ();
   
   if (delPS != null)
   {        
      nInstanceCount = delPS.GetChildCount ();
      for (j = 0; j < nInstanceCount; j++)
      {
         rowId = strPortId = strProdId = strGenericsId = strPortId = path = "";
         optionId    = "";
         optionObj   = null;
         trId        = "";
         tr          = null;
         tdArray     = null;
         spanObj     = null;
         comboPropSet = null;
              
         instancePropSet = null;
         instancePropSet = delPS.GetChild (j);  
         portId = instancePropSet.GetProperty ("Port Item Id");
         prodId = instancePropSet.GetProperty ("Product Id");
         path = instancePropSet.GetProperty ("Path");
         
         hasGeneric = instancePropSet.GetProperty ("RequireMoreChild");
         comboPropSet = m_UIFramework.m_controlPropSet.GetChildByType (strSpanId);
         var fieldListPropSet  = new JSSCfgPropertySet ();          
         var strFieldList  = comboPropSet.GetProperty ("FieldList");
         fieldListPropSet.DecodeFromString (strFieldList);
                   
         //becareful with the rowId's
         //There could be a case that the server is returning a delta on an item that's not
         //currently shown in the current page.

         // Fix for FR#12-1MWR5B3 - Ineligible products selection
         comboPropSet = m_UIFramework.m_controlPropSet.GetChildByType (strSpanId); 
         SetExcluded(comboPropSet, prodId, strSpanId);
         
         //unselect the option
         optionId = strSpanId + _underscore + "PORTDOMAIN" + _pipe + "none";         
         optionObj = document.getElementById (optionId);
         if (optionObj != null)
	{
            optionObj.selected = true;    
            optionObj.className = "eCfgOptionAvailable"; // Fix for FR#12-1MWR5B3 - Ineligible products selection
         }     
         //Delete the generics
         strGenericsId = "GENERICS" + _pipe + path;
         spanObj = document.getElementById (strGenericsId);
         if (spanObj != null)
         {
            spanObj.innerHTML = "";
            if (document.all)
               spanObj.removeNode (true);
            else
               spanObj.parentNode.removeChild(spanObj);
         }
         
         //delete any existing extra fields
         trId = strSpanId + _underscore + "COMBOBOX";
         tr = document.getElementById (trId);
         if (tr != null)
         {
            //deleteFieldList (tr, fieldListPropSet);
            tdArray = tr.getElementsByTagName ("td");
      
            for (k = tdArray.length - 1; k >= 1 ; k--)
               tr.deleteCell (k);
              
            td = null;
            td = document.getElementById (strSpanId + _underscore + "COMBOBOX_TD"); 
            addGenerics (comboPropSet, td, path, hasGeneric);
            displayQtyInCombo (tr, comboPropSet.GetType (), fieldListPropSet, null);
            displayFieldList (tr, _underscore + "COMBOBOX" + _pipe, comboPropSet.GetType (), fieldListPropSet, null);
         }    
      }
   }  
         
   //2. Add
   addPS = portItemPropSet.GetChildByType ("Add");

   if (addPS != null)
   {
      nInstanceCount = addPS.GetChildCount ();
      for (j = 0; j < nInstanceCount; j++)
      {
         instancePropSet = null;
         portId = "";
         prodId = "";
         comboPropSet = null;
         optionId = "";
         optionObj = null;
         trId = "";
         tr = null;
         tdArray = null;
         
         //There should only be 1 instance to add
         instancePropSet = addPS.GetChild (j);
         portId = addPS.GetProperty ("Port Item Id");
         prodId = instancePropSet.GetProperty ("Product Id");
         hasGeneric = instancePropSet.GetProperty ("RequireMoreChild");
         path = instancePropSet.GetProperty ("Path");
         
         updateInstanceInfo (strSpanId, prodId, instancePropSet);
         
         comboPropSet = m_UIFramework.m_controlPropSet.GetChildByType (strSpanId); 
         var fieldListPropSet  = new JSSCfgPropertySet ();
         var strFieldList  = comboPropSet.GetProperty ("FieldList");
         fieldListPropSet.DecodeFromString (strFieldList);
                                 
         //Get the option tag and set selected=true
         optionId = strSpanId + _underscore + "PORTDOMAIN" + _pipe + prodId;         
         optionObj = document.getElementById (optionId);
         if (optionObj != null)      
            optionObj.selected = true;
         
         //delete any existing extra fields
         trId = strSpanId + _underscore + "COMBOBOX";
         tr = document.getElementById (trId);
         if (tr != null)
         {
            tdArray = tr.getElementsByTagName ("td");
            
            for (k = tdArray.length - 1; k >= 1 ; k--)
               tr.deleteCell (k);
            
            td = null;
            td = document.getElementById (strSpanId + _underscore + "COMBOBOX_TD");
            if (td != null || bCFG_clientJsDebug)
               addGenerics (comboPropSet, td, path, hasGeneric);
            displayQtyInCombo (tr, comboPropSet.GetType (), fieldListPropSet, instancePropSet);
            displayFieldList (tr, _underscore + "COMBOBOX" + _pipe, comboPropSet.GetType (), fieldListPropSet, instancePropSet);
         }       
      }
   }

   //3. Modify
   modPS = portItemPropSet.GetChildByType ("Modify");
   
   if (modPS != null)
   {
      nInstanceCount = modPS.GetChildCount ();
      for (j = 0; j < nInstanceCount; j++)
      {
         inputObj        = null;
         instancePropSet = null;
         instancePropSet = modPS.GetChild (j);
         
         fieldName = prodId = portId = fieldValue = "";
         td = null;
         
         fieldName = instancePropSet.GetProperty ("Name");
         prodId = instancePropSet.GetProperty ("Product Id");
         portId = instancePropSet.GetProperty ("Port Item Id");
         fieldValue = instancePropSet.GetProperty ("Value");
         td = document.getElementById (strSpanId +
                                          _underscore + "COMBOBOX" + _pipe + prodId + _underscore + "FIELD" + _pipe + fieldName);
                                                   
         if (td != null)
         { 
            inputObj = td.getElementsByTagName ("INPUT");
            if (inputObj.length > 0)
            {
               if (fieldValue == "0")
                  fieldValue = "";
               inputObj[0].value = fieldValue;
            }
            else
               td.innerHTML = fieldValue; 
         }      
      }  
   }  
}

function CFG_framework_UpdateExcludedItems (strControlPropSet)
{  
   var nExclItemCount;
   var i;
   var exclItemPS = new JSSCfgPropertySet ();
   var excludedPropSet = null;
   var updateExclusion = "";
   var updateFunction  = "";

   exclItemPS.DecodeFromString (strControlPropSet);
   excludedPropSet = exclItemPS.GetChildByType ("Excluded");
   
   if (excludedPropSet == null) //in the case of conflicts
      return;
      
   nExclItemCount = excludedPropSet.GetChildCount();
   
   for (i = 0; i < nExclItemCount; i++)
   {
      updateFunction = updateExclusion = "";
      var exclItemPropSet = excludedPropSet.GetChild (i);  
      
      updateExclusion = exclItemPropSet.GetProperty ("CfgJSUpdateExclusion");
      if (updateExclusion != "")
      {   
         updateFunction = updateExclusion + " (exclItemPropSet);";     
         eval (updateFunction);
      }
   } 
}

function updateExcludedItemForPortWithPrice (exclItemPropSet)
{
   var dispArray = new Array ();
   dispArray[0] = "CxObjName";
   dispArray[1] = "List Price";
   
   updateExcludedItemForPortOrAttribute (exclItemPropSet, dispArray, "showDomainPrice");
}

function updateExcludedItemForPort (exclItemPropSet)
{
   updateExcludedItemForPortOrAttribute (exclItemPropSet, null, null);
}

function updateExcludedItemForAttribute (exclItemPropSet)
{
   updateExcludedItemForPortOrAttribute (exclItemPropSet, null, null);
}

function updateExcludedItemForPortOrAttribute (exclItemPropSet, dispArray, dispFunction)
{  
   var j                   = 0;  
   var childPS             = null;
   var grpItemId           = "";
   var excluded            = "";
   var excludedElig        = "";
   var excludedModel       = "";
   var id                  = "";
   var objectType          = "";
   var optionId            = "";
   var optionObj           = null;
   var propName            = "";
   var itemDomainPropSet   = null;
   var itemPropSet         = null;
   var resultPropSet       = null;
   var rowId               = "";
   var rowObj              = null;
   var selectId            = "";
   var selectObj           = null;
   var strParentPath       = "";
   var updateType          = "";
   var usage               = "";
   var propValInt          = 0;
   var selectedVal         = "";
   
   nInstanceCount = exclItemPropSet.GetChildCount ();
   id = exclItemPropSet.GetType ();
   objectType = exclItemPropSet.GetProperty ("Type");
   usage = exclItemPropSet.GetProperty ("Usage");
   strParentPath = exclItemPropSet.GetProperty ("Parent Path");
     
   for (j = 0; j < nInstanceCount; j++)
   {
      var bGetFirst        = true;
      var nPropertyCount   = 0;
      var w                = 0;
            
      childPS           = null;
      updateType        = "";         
   
      //Disable/Enable
      childPS = exclItemPropSet.GetChild (j);      
      updateType = childPS.GetType ();
      
      nPropertyCount = childPS.GetPropertyCount ();
      for (bGetFirst = true, w = 0; w < nPropertyCount; w++, bGetFirst = false)
      {
         excluded = excludedElig = excludedModel = "";    
         grpItemId         = "";               
         itemDomainPropSet = null;
         propName = optionId = rowId = propVal = "";
         optionObj         = null;
         rowObj            = null;
         resultPropSet     = null;
         itemPropSet       = null;         
         propValInt        = 0;
         
         if (bGetFirst)
            propName     = childPS.GetFirstProperty ();
         else
            propName     = childPS.GetNextProperty ();       

         propVal = childPS.GetProperty (propName);
         if (propVal != null && propVal != "")
         {
            //try { propValInt = Integer.parseInt(propVal); }
            //catch(NumberFormatException e) { };
            propValInt = parseInt(propVal);
         }

         if (objectType == "Attribute")
         {
            optionId = strParentPath + _underscore + "ATTR" + _pipe + id +
                     _underscore + "ATTRDOMAIN" + _pipe + propName;
            rowId = strParentPath + _underscore + "ATTR" + _pipe + id +
                     _underscore + "ATTVAL" + _pipe + propName; 
         }                  
         else if (objectType == "Port")
         {
            optionId = strParentPath + _underscore + "PORT" + _pipe + id +
                     _underscore + "PORTDOMAIN" + _pipe + propName;  
            rowId = strParentPath + _underscore + "PORT" + _pipe + id +
                     _underscore + "PROD" + _pipe + propName; 
         }
                  
         if (objectType == "Port")
            grpItemId = strParentPath + _underscore + "PORT" + _pipe + id;            
         else if (objectType == "Attribute")
            grpItemId = strParentPath + _underscore + "ATTR" + _pipe + id;            

         resultPropSet = m_UIFramework.m_controlPropSet.GetChildByType (grpItemId);
         itemPropSet = resultPropSet.GetChildByType ("Domain"); 
         itemDomainPropSet = itemPropSet.GetChildByType (propName); 

         //Sometimes, people may screw up the rules to exclude something that doesn't exist
         if (itemDomainPropSet != null)
         {            
            excludedElig = itemDomainPropSet.GetProperty ("ExcludedElig");
            excludedModel = itemDomainPropSet.GetProperty ("ExcludedModel");
            if ((excludedModel == "Y" && (((propValInt & 1) > 0) || ((propValInt & 2) > 0))) ||
                (excludedElig == "Y" && ((propValInt & 4) > 0)))
               excluded = "Y";

            optionObj = document.getElementById (optionId);
            rowObj = document.getElementById (rowId);
            if (optionObj != null)
            {
               if (updateType == "Disable")
               {
                  // Changes added to incorporate workaround for IE7 issue
                  // Copy the value into a temporary variable and 
                  // copy it back into the variable after color change
                  var tempText = optionObj.innerText;
                  optionObj.innerText = "";
                  optionObj.className = "eCfgOptionExcluded";  
                  optionObj.innerText = tempText;     
                  if (excluded == "Y")
                  {
                     if (usage == "CheckBox" || usage == "QuantityList" || usage == "Radio")
                     {
                        if (rowObj != null)
                           rowObj.style.display = "none";   
                     }
                     else if (usage == "ComboBox" || usage == "ComboBoxAdd")
                     {
                        if(optionObj.selected)
                          selectedVal = optionObj.innerText;
                     
                        RemoveNodeCustom (optionObj);
                     }
                  }
               }               
               else if (updateType == "Enable")
               {
                  // Changes added to incorporate workaround for IE7 issue
                  // Copy the value into a temporary variable and 
                  // copy it back into the variable after color change
                  var tempText = optionObj.innerText;
                  optionObj.innerText = "";
                  optionObj.className = "eCfgOptionAvailable";
                  optionObj.innerText = tempText;
                  if (excludedModel == "Y")
                  {
                     if (usage == "CheckBox" || usage == "QuantityList" || usage == "Radio")
                     {            
                        if (rowObj != null)
                           rowObj.style.display = "";  
                     }
                  }
               }          
            }
            else
            {
               //This could happen for ComboBox or ComboBoxAdd that has .Excluded UI Property
               if (updateType == "Enable" && excludedModel == "Y" && (usage == "ComboBox" || usage == "ComboBoxAdd"))
               {
                  if (objectType == "Port")
                  {
                     selectId = strParentPath + _underscore + "PORT" + _pipe + id + _underscore + "DOMAINSELECT";
                     selectObj = document.getElementById (selectId);

                     if (selectObj != null || bCFG_clientJsDebug)
                     {
		                  optionObj = document.createElement ("OPTION"); 
		                  selectObj.options.add (optionObj);              
		                  optionObj.id = optionId;
		                  optionObj.value = "GRPITEM" + _pipe + strParentPath + _underscore + "PORT" + _pipe + id +
		                                    _underscore + "PROD" + _pipe + propName;
                        optionObj.className = "eCfgOptionAvailable";
                           
                        var dispValArray        = new Array ();
                        if (dispArray != null && dispFunction != null)
                        {
                           for (var iLen = 0; iLen < dispArray.length; iLen++)
                           {
                              var temp = "";
                              temp = itemDomainPropSet.GetProperty(dispArray[iLen]);
                              
                              if (temp == null || typeof (temp) == "undefined")
                                 dispValArray[iLen] = "";
                              else
                                 dispValArray[iLen] = temp;
                           }
                           var str = CCFMiscUtil_ArrayToString (dispValArray);
                           str = dispFunction + "(\"" + str + "\");";
                           if(document.all)
                              optionObj.innerText = eval (str);
                           else
                              optionObj.textContent = eval (str);  
                        }
                        else
                        {
                           if(document.all)
                              optionObj.innerText = itemDomainPropSet.GetProperty("CxObjName");
                           else
                              optionObj.textContent = itemDomainPropSet.GetProperty("CxObjName");
                        }
                     }
                  }
                  else if (objectType == "Attribute")
                  {
                     var attType = "";
         
                     selectId = strParentPath + _underscore + "ATTR" + _pipe + id + _underscore + "DOMAINSELECT";
                     selectObj = document.getElementById (selectId);
                     
                     if (selectObj != null || bCFG_clientJsDebug)
                     {
                        attType = resultPropSet.GetProperty ("AttType");               

		                  optionObj = document.createElement ("OPTION"); 
                        selectObj.options.add (optionObj);		                       
		                  optionObj.id = optionId;
		                  optionObj.value = "GRPITEM" + _pipe + strParentPath + _underscore + "ATTR" + _pipe + id +
		                                    _underscore + "ATTTYPE" + _pipe + attType + _underscore + "ATTVAL" + _pipe + propName;
                        optionObj.className = "eCfgOptionAvailable";
                        
                        if(selectedVal == propName)
                           optionObj.selected = true;                        
                        
                        if(document.all)
                           optionObj.innerText = propName;
                        else
                           optionObj.textContent = propName;
                     }
                  }            
               }         
            }
         }
      }
   }
}

/* The following section is the set of functions that
   is called in response to user actions */
function CFG_framework_AddItemMin (bAddItem, grpItemId, prodId, quantity)
{
   this.m_bQuickEditDirtyFlag = true;
   this.AddItemHelper (bAddItem, grpItemId, prodId, quantity, "");
}

function CFG_framework_AddItem (bAddItem, grpItemId, prodId, quantity)
{
   this.m_bQuickEditDirtyFlag = true;					
   this.AddItemHelper (bAddItem, grpItemId, prodId, quantity, "Y");
}

function CFG_framework_AddItemHelper (bAddItem, grpItemId, prodId, quantity, setTypeQty)
{
   var strQuantity = new String (quantity);
   
   if (strQuantity.search (/^\d/))
   {
      //alert ("Invalid Quantity");
      this.UnlockRequestQueue ();
      return;
   }   
   
   // JW DeferUpdate: ADD grpItemId into Dirty Array for Multiselect
     
   if (this.m_bDeferUpdate)
   {  
      var strDirtyId = grpItemId;  
      var dirtyIdInfo;
   	   
	   if (bAddItem == 'Y')    // need to check if bAddItem = Y
	      strDirtyId = grpItemId + "|" + prodId; 

      if (this.m_DirtyIdLookUp  [strDirtyId] == null || typeof (this.m_DirtyIdLookUp  [strDirtyId]) == "undefined")
      {  // doesn't exist in dirty array
            
         dirtyIdInfo = new Array();
         dirtyIdInfo["GRPITEM"] = grpItemId;
         dirtyIdInfo["ADDITEM"] = bAddItem;
         dirtyIdInfo["PROD"] = prodId;
         dirtyIdInfo["QTY"] = quantity;
         dirtyIdInfo["TYPEQTY"] = setTypeQty;
         
         /* //*** set these to empty or leave it undefined?
         dirtyIdInfo["INTID"] = intId;
         dirtyIdInfo["FIELD"] = fieldId;
         dirtyIdInfo["ATTTYPE"] = attType;
         dirtyIdInfo["ATTVAL"] = attVal;
         dirtyIdInfo["DOMAIN"] = domain;
         dirtyIdInfo["PORT"] = portId;
         dirtyIdInfo["PORTITEM"] = portItemId;
         dirtyIdInfo["ATTR"] = attName;
         */ //****
         
         this.m_DirtyIdLookUp [strDirtyId] = dirtyIdInfo;
         this.m_DirtyItemArray [this.m_DirtyItemArray.length] = strDirtyId;       
      }
      else   // update info only if exist
      { 
         dirtyIdInfo = this.m_DirtyIdLookUp [strDirtyId];
         dirtyIdInfo["GRPITEM"] = grpItemId;
         dirtyIdInfo["ADDITEM"] = bAddItem;    // necessary?
         dirtyIdInfo["PROD"] = prodId;
         dirtyIdInfo["QTY"] = quantity;
         dirtyIdInfo["TYPEQTY"] = setTypeQty;  // necessary?
      }
      
      this.UnlockRequestQueue ();
      return; 
   }   
   
   //** end DeferUpdate
   var inputPropSet     = null;
   inputPropSet = this.AddItemPSGenerator (bAddItem, grpItemId, prodId, quantity, setTypeQty, false);

   if (inputPropSet != null)
   {
      var strInputArgs;
      var strInvokeMethod;
           
      strInputArgs = inputPropSet.EncodeAsString ();
      strInvokeMethod = "SubmitRequest_" + strInputArgs;

      SubmitWithHiddenFrame (strInvokeMethod);
      
      //top.cfgAnchorId = parentPath + "_" + portItemId;  
   }
   else
   {
      if (bCFG_clientJsDebug) 
         alert ("Unable to find Cached Info");
      this.UnlockRequestQueue ();
   }
}

function CFG_framework_GetExplanation (grpItemId, prodId, path)
{
   var domainPropSet    = null;
   var prodPropSet      = null;
   
   domainPropSet = (this.m_controlPropSet.GetChildByType (grpItemId)).GetChildByType ("Domain");
   
   if (domainPropSet == null) //this comes from a CfgPortItem
      prodPropSet = this.m_controlPropSet.GetChildByType (grpItemId);
   else
      prodPropSet = domainPropSet.GetChildByType (prodId);
      
   if (prodPropSet != null)
   {
      var strInputArgs;
      var strInvokeMethod;
      
      inputPropSet = new JSSCfgPropertySet();
      inputPropSet.SetProperty ("RequestType", "GetExpl");
      inputPropSet.SetProperty ("Path", prodPropSet.GetProperty("Path"));

      strInputArgs = inputPropSet.EncodeAsString ();
      strInvokeMethod = "SubmitRequest_" + strInputArgs;

      SubmitWithHiddenFrame (strInvokeMethod);
   }
   else
   {
      if (bCFG_clientJsDebug) 
         alert ("Unable to find Cached Info");
      this.UnlockRequestQueue ();
   }
}

function CFG_framework_RefreshUI ()
{
    if (top.cfgKeepAnchor != true) {
        top.cfgAnchorId = "";
        top.activeElementId = "";
        top.activeElementName = "";
    }
    else {
        top.cfgScrollTop = document.getElementsByTagName("body")[0].scrollTop;
        top.activeElementId = document.activeElement.id;        // for COMBO
        top.activeElementName = document.activeElement.name;    // for CHECKBOX, RADIO, TEXT
    }
    top.cfgKeepAnchor = false;
    SubmitWithMainFrame("RefreshUI");
}

function CFG_framework_RemoveItem (grpItemId, prodId)
{
   this.m_bQuickEditDirtyFlag = true;
   // JW DeferUpdate: ADD grpItemId and prodId into Dirty Array
   if (this.m_bDeferUpdate)
   {   
      var strDirtyId = grpItemId + "|" + prodId; 

      if (this.m_DirtyIdLookUp  [strDirtyId] == null || typeof (this.m_DirtyIdLookUp  [strDirtyId]) == "undefined")
      {  // doesn't exist in dirty array
        
         dirtyIdInfo = new Array();
         dirtyIdInfo["GRPITEM"] = grpItemId;
         dirtyIdInfo["PROD"] = prodId;
         dirtyIdInfo["QTY"] = "-1";
   	
         //this.m_DirtyIdLookUp [strDirtyId] = '1';
         this.m_DirtyIdLookUp [strDirtyId] = dirtyIdInfo;
         this.m_DirtyItemArray [this.m_DirtyItemArray.length] = strDirtyId; 
      
      }
      else
      {  // update info only if exist
      
         dirtyIdInfo = this.m_DirtyIdLookUp [strDirtyId];
         dirtyIdInfo["QTY"] = "-1";
         dirtyIdInfo["GRPITEM"] = grpItemId;
         dirtyIdInfo["PROD"] = prodId; 
      }
   
      this.UnlockRequestQueue ();
      return;
   }    
   // ******
   
   var inputPropSet     = null;
   inputPropSet = this.RemoveItemPSGenerator (grpItemId, prodId);
   
   if (inputPropSet != null)
   {
      var strInputArgs;
      var strInvokeMethod;
  
      strInputArgs = inputPropSet.EncodeAsString ();
      strInvokeMethod = "SubmitRequest_" + strInputArgs;

      SubmitWithHiddenFrame (strInvokeMethod); 
      
      //top.cfgAnchorId = prodPropSet.GetProperty("Parent Path") + "_" + prodPropSet.GetProperty("Port Item Id");  
   }
   else
   {
      if (bCFG_clientJsDebug) 
         alert ("Unable to find Cached Info");
      this.UnlockRequestQueue ();
   }
}

function CFG_framework_ReplaceItem (grpItemId, prodId)
{
   var controlPropSet   = null;
   var domainPropSet    = null;
   var prodPropSet      = null;
   var parentPath       = "";
   
   this.m_bQuickEditDirtyFlag = true;
            
   controlPropset = this.m_controlPropSet.GetChildByType (grpItemId);
   domainPropSet = controlPropSet.GetChildByType ("Domain");
   parentPath = domainPropSet.GetProperty ("Parent Path");   
   prodPropSet = domainPropSet.GetChildByType (prodId);
   if (prodPropSet != null)
   {
      var strInputArgs;
      var strInvokeMethod;
            
      inputPropSet = new JSSCfgPropertySet();
      inputPropSet.SetProperty ("RequestType", "ReplaceItem");
      inputPropSet.SetProperty ("Path", prodPropSet.GetProperty("Path"));
      inputPropSet.SetProperty ("Product Id", prodId);  
      inputPropSet.SetProperty ("Prod Item Id", prodPropSet.GetProperty ("Port Item Id"));
      inputPropSet.SetProperty ("Quantity", "1");            
      inputPropSet.SetProperty ("List Price", prodPropSet.GetProperty ("List Price"));
      inputPropSet.SetProperty ("Current Price", "0");
      inputPropSet.SetProperty ("Parent Path", parentPath);
      inputPropSet.SetProperty ("AutoResolve", "");      
      inputPropSet.SetProperty ("Parent Display Name", this.CFG_frameworkProdName);
      inputPropSet.SetProperty ("Port Display Name", prodPropSet.GetProperty ("CxPortName"));            
      inputPropSet.SetProperty ("New Child Display Name", prodPropSet.GetProperty("CxObjName"));            
      inputPropSet.SetProperty ("Version", this.CFG_frameworkVersion);
      inputPropSet.SetProperty ("ObjId", this.CFG_frameworkObjId); 
      inputPropSet.SetProperty ("RootId", this.CFG_frameworkRootId);           
 
      strInputArgs = inputPropSet.EncodeAsString ();
      strInvokeMethod = "SubmitRequest_" + strInputArgs;

      SubmitWithHiddenFrame (strInvokeMethod); 
   }
   else
   {
      if (bCFG_clientJsDebug) 
         alert ("Unable to find Cached Info");
      this.UnlockRequestQueue ();
   }
}

function SWECfgShowPopup (url, height, width, bFull, bFree, extraFeatures)
{
   var position;
   var sFeatures;
   
   Top().SWEHtmlPopupName = "PopupFrame";
   
   // use full toolbars if full
   // 
   if (bFull == true || bFull == "true")
      sFeatures = "scrollbars=yes,resizable,location,toolbar,menubar,status,personalbar,";
   else
      sFeatures = "resizable,scrollbars=yes,";

   // set the size
   //
   if (!Top().SWEPopupResizeNoAuto && 
      (typeof(height) == "undefined" || typeof(width) == "undefined" || 
      height <= 0 || width <= 0 ||
      SWEGetAvailScreenWidth()-width <0 || SWEGetAvailScreenHeight()-height <0))
   {
      height   = 480;	
      width    = 640;
   }
   
   // AOL 6.0 has defect that position is interpreted as position of content
   // in popup window as opposed to position of popup window itself MEK
   //
   if (navigator.userAgent.toUpperCase().indexOf("AOL 6.") > -1)  // 12-ENMO2V
      position = SWEPosition(0,0); 
   else
      position = SWEPosition (parseInt((SWEGetAvailScreenWidth()-width)/2),
                              parseInt((SWEGetAvailScreenHeight()-height)/2));

   sFeatures += ("height=" + height + ",width= " + width);

   if (typeof(extraFeatures)  != 'undefined' && extraFeatures != null && extraFeatures != "")
      sFeatures = sFeatures + "," + extraFeatures;
   
   // open a free window if bFree
   //
   if (bFree == true || bFree == "true")
   {
      if (bFull == true || bFull == "true")
      	open (url, "", sFeatures);
      else
      	open (url, "", sFeatures+position);
      return;
   }

   if (Top().SWEPopupWin != null && 
       typeof(Top().SWEPopupWin.closed) != "unknown" && 
       !Top().SWEPopupWin.closed)
   {
      if (url != "")
         Top().SWEPopupWin.location.replace (url);
   }
   else
   {
      Top().SWEPopupWin = open (url, Top().SWEHtmlPopupName, sFeatures + position);
   }
}

function CFG_framework_EditField (id, fieldType, fieldName, path)
{
   var resultPropSet = m_UIFramework.m_controlPropSet.GetChildByType (id);
   var inputPropSet = new JSSCfgPropertySet();
   this.m_bQuickEditDirtyFlag = true;
   if (fieldType == "Attribute")
   {
      var attID = resultPropSet.GetProperty ("AttID");
      inputPropSet.SetProperty ("AttID", attID);
   }
   else if (fieldType == "CfgFieldList")
   {
      var domainPropSet = null;
      domainPropSet = resultPropSet.GetChildByType ("Domain");
      if (domainPropSet != null && typeof (domainPropSet) != "undefined")
         resultPropSet = domainPropSet;
         
      var portId = resultPropSet.GetProperty ("Port Item Id");
      inputPropSet.SetProperty ("Port Item Id", portId);
      inputPropSet.SetProperty ("Path", path);
      inputPropSet.SetProperty ("CfgFieldName", fieldName);
   }         
   
   var strParentPath = resultPropSet.GetProperty ("Parent Path");   
   var strParentProdId = resultPropSet.GetProperty ("Parent Product Id");
      
   inputPropSet.SetProperty ("Type", fieldType);
   inputPropSet.SetProperty ("Parent Path", strParentPath);
   inputPropSet.SetProperty ("Parent Product Id", strParentProdId);
   
   var strInputArgs = inputPropSet.EncodeAsString ();
   var strInvokeMethod = "EditField_" + strInputArgs;

   top.g_cfgHiddenFrameCsObj.SWEField = "DTYPE_TEXT";
   top.g_cfgHiddenFrameCsObj.SWESP = "true";
   top.g_cfgHiddenFrameCsObj.SWEH  = "100";
   top.g_cfgHiddenFrameCsObj.SWEW  = "300";	
   top.cfgAnchorId = strParentPath + "_" + attID;      

   SubmitWithHiddenFrame (strInvokeMethod);   
   top.g_cfgHiddenFrameCsObj.SWESP = "false";
}

function CFG_framework_SetFieldValue (id, fieldName, inputId, path)
{
   var resultPropSet = m_UIFramework.m_controlPropSet.GetChildByType (id);
   var inputPropSet = new JSSCfgPropertySet();

   var domainPropSet = null;
   domainPropSet = resultPropSet.GetChildByType ("Domain");
   if (domainPropSet != null && typeof (domainPropSet) != "undefined")
      resultPropSet = domainPropSet;

   var strParentPath = resultPropSet.GetProperty ("Parent Path");   
   var strParentProdId = resultPropSet.GetProperty ("Parent Product Id");   

   var fieldValue = (document.getElementById (inputId).getElementsByTagName ("input"))[0].value;    
   var portId = resultPropSet.GetProperty ("Port Item Id");
   inputPropSet.SetProperty ("Port Item Id", portId);
   inputPropSet.SetProperty ("Path", path);
   inputPropSet.SetProperty ("CfgFieldName", fieldName);      
   inputPropSet.SetProperty ("FieldValue", fieldValue);   
   inputPropSet.SetProperty ("RequestType", "SetFieldValue");
   inputPropSet.SetProperty ("Parent Path", strParentPath);
   inputPropSet.SetProperty ("Parent Product Id", strParentProdId);   
   inputPropSet.SetProperty ("Type", "CfgFieldList");

   var strInputArgs = inputPropSet.EncodeAsString ();
   var strInvokeMethod = "SubmitRequest_" + strInputArgs;
	
   this.m_bQuickEditDirtyFlag = true;
	
   SubmitWithHiddenFrame (strInvokeMethod);   
}

function CFG_framework_SetItemQuantity (grpItemId, intId, quantity)
{
   this.SetItemQuantityHelper (grpItemId, intId, quantity, "Y");
}

function CFG_framework_SetItemQuantityMin (grpItemId, intId, quantity)
{
   this.SetItemQuantityHelper (grpItemId, intId, quantity, "");
}

function CFG_framework_SetItemQuantityHelper (grpItemId, intId, quantity, setTypeQty)
{ 
   // JW DeferUpdate: ADD grpItemId into Dirty Array for Multiselect
   if (this.m_bDeferUpdate)
   {  
      var strDirtyId = grpItemId + "|" + intId;
      var dirtyIdInfo;

      if (this.m_DirtyIdLookUp  [strDirtyId] == null || typeof (this.m_DirtyIdLookUp  [strDirtyId]) == "undefined")
      {  // doesn't exist in dirty array
        
         dirtyIdInfo = new Array();
         dirtyIdInfo["GRPITEM"] = grpItemId;
         dirtyIdInfo["QTY"] = quantity;
         dirtyIdInfo["TYPEQTY"] = setTypeQty;
         dirtyIdInfo["INTID"] = intId;
         
         this.m_DirtyIdLookUp [strDirtyId] = dirtyIdInfo;
         this.m_DirtyItemArray [this.m_DirtyItemArray.length] = strDirtyId; 
      }
      else // update info only if exist
      {  
         dirtyIdInfo = this.m_DirtyIdLookUp [strDirtyId];
         dirtyIdInfo["GRPITEM"] = grpItemId;
         dirtyIdInfo["QTY"] = quantity;
         dirtyIdInfo["TYPEQTY"] = setTypeQty; // is this necessary?
         dirtyIdInfo["INTID"] = intId;        // is this necessary?
      }
      
      this.UnlockRequestQueue ();
      return;
   } 
   this.m_bQuickEditDirtyFlag = true;
   
   //** end
   var inputPropSet     = null;
   inputPropSet = this.SetItemQuantityPSGenerator (grpItemId, intId, quantity, setTypeQty);
   
   var strInputArgs = inputPropSet.EncodeAsString ();
   var strInvokeMethod = "SubmitRequest_" + strInputArgs;

   SubmitWithHiddenFrame (strInvokeMethod);                            
   //top.cfgAnchorId = prodPropSet.GetProperty ("Parent Path") + "_" + prodPropSet.GetProperty ("Port Item Id");     
}

function CFG_framework_SetAttribute (grpItemId, value, typeCode)
{  
   var inputPropSet = null;
   // JW DeferUpdate: ADD grpItemId into Dirty Array for Multiselect
   if (this.m_bDeferUpdate)
   {  
      var strDirtyId = grpItemId; 
      if (this.m_DirtyIdLookUp  [strDirtyId] == null || typeof (this.m_DirtyIdLookUp  [strDirtyId]) == "undefined")
      {  // doesn't exist in dirty array
        
         dirtyIdInfo = new Array();
         dirtyIdInfo["GRPITEM"] = grpItemId;
         dirtyIdInfo["TYPECODE"] = typeCode;
         dirtyIdInfo["ATTVAL"] = value;
            
         //this.m_DirtyIdLookUp [strDirtyId] = '1';
         this.m_DirtyIdLookUp [strDirtyId] = dirtyIdInfo;
         this.m_DirtyItemArray [this.m_DirtyItemArray.length] = strDirtyId; 
      
      }
      else
      {  // update info only if exist
      
         dirtyIdInfo = this.m_DirtyIdLookUp [strDirtyId];
         dirtyIdInfo["GRPITEM"] = grpItemId;
         dirtyIdInfo["TYPECODE"] = typeCode;
         dirtyIdInfo["ATTVAL"] = value;
      }
      
      // need to update selection on broswer
      var attPropSet = this.m_controlPropSet.GetChildByType (grpItemId);
      var attName  = attPropSet.GetProperty ("AttName");
      var attOldValue = attPropSet.GetProperty ("AttValue");
      var attId    = attPropSet.GetProperty ("XA Id");
      var usage    = attPropSet.GetProperty ("Type");
      var strParentPath = attPropSet.GetProperty ("Parent Path");
      
      
      inputPropSet = new JSSCfgPropertySet();
      inputPropSet.SetProperty ("AttName", attName);
      inputPropSet.SetProperty ("AttValue", value);
      inputPropSet.SetProperty ("XA Id", attId);
      inputPropSet.SetProperty ("Usage", usage);
      inputPropSet.SetProperty ("AttValueOld", attOldValue);
      inputPropSet.SetProperty ("Parent Path", strParentPath);
   
      updateSelectionInfoForAttribute (inputPropSet);
      attPropSet.SetProperty ("AttValue", value);
      
      this.UnlockRequestQueue ();
      return;
   }   
   //**** end
   
   var strInputArgs        = "";
   var strInvokeMethod     = "";
   var strParentPath       = "";
   
   inputPropSet = this.SetAttributePSGenerator (grpItemId, value, typeCode);
   strInputArgs = inputPropSet.EncodeAsString ();
   strInvokeMethod = "SubmitRequest_" + strInputArgs;
   this.m_bQuickEditDirtyFlag = true;
   SubmitWithHiddenFrame (strInvokeMethod);
}

function CFG_framework_CfgInvokeMethod (name, id)
{
   // JW DeferUpdate: need to check if we need to call Submit/Interact when the user change tab or drilldown
   // TODO: move this to SubmitWithMainFrame
   if (this.m_bDeferUpdate && m_UIFramework.m_DirtyItemArray.length == 0 && 
       (name == "InteractMultiSelect" || name == "ResetMultiSelect") )
   {
      m_UIFramework.UnlockRequestQueue ();
      return;
   }
     
   if (this.m_bDeferUpdate && m_UIFramework.m_DirtyItemArray.length > 0)
   {  
      var inputPropSet        = null;
      
      // Call SubmitRequest Interact
      if (name == "InteractMultiSelect")
      {
         inputPropSet = this.ProcessInteractPropSet ();
         return;
      }
      else if (name == "ResetMultiSelect")
      {
         m_UIFramework.RefreshUI ();
         return;
      }
        
      var appObj = (window.opener != null) ? window.opener : this;

	   //HI mode acccessor
	   if (SWEIsHighInteract )	
	      var sString = top.App ().GetLocalString ("IDS_CXP_MULTISELECT_UI_INCOMPLETE"); // for locale
      else
         var sString = appObj._SWEgetMessage ("IDS_CXP_MULTISELECT_UI_INCOMPLETE");

      alert (sString);
      m_UIFramework.UnlockRequestQueue ();
      return;
   }
   
   /*****************  Added for ACR502 - QuickEdit - START   ***************/ 
   /*if(this.m_bQuickEdit)
   {	
		this.QuickEditHelper (name,id);
		if( (this.m_bQuickEdit) && (name == "DoneConfig") && (this.m_bQuickEditDirtyFlag))
		{	
			return;		
		}
   } */
   //Change the function associated to the toggle button based on whether it is Cfg ON or Cfg OFF
   //If the Cfg ON or Cfg OFF button is clicked
  /* if(id == this.m_sButtonId)
    {
		if(this.m_bQuickEdit) //If it's quickedit.
		{				
			var btnObj = document.getElementById(this.m_sButtonId);  //Get the button object	  	
			var sButtonText = btnObj.innerText;  //Get the button text								
			if(sButtonText == this.m_sQEBtnONText) // If button text is Cfg ON then method invoked is 'EnableEngine'
			{			
				btnObj.innerHTML=btnObj.innerHTML.replace(this.m_sQEBtnONText,this.m_sQEBtnOFFText); //change button text	
				name = "EnableEngine";	//change method invoked				
			}
			else if(sButtonText == this.m_sQEBtnOFFText) // If button text is Cfg ON then method invoked is DisableEngine'
			{
				btnObj.innerHTML=btnObj.innerHTML.replace(this.m_sQEBtnOFFText,this.m_sQEBtnONText); //change button text	
				name = "DisableEngine"; //change method invoked	
			}								
		}  		  
	}  	*/
	  //Change the function associated to the toggle button based on whether it is Cfg ON or Cfg OFF
   //If the Cfg ON or Cfg OFF button is clicked
    if(id == this.m_sButtonId)
    {
		if(this.m_bQuickEdit) //If it's quickedit.
		{				
			var btnObj = document.getElementById(this.m_sButtonId);  //Get the button object	
			if(btnObj)  	
				var sButtonText = btnObj.innerText;  //Get the button text								
			if(sButtonText == this.m_sQEBtnONText) // If button text is Cfg ON then method invoked is 'EnableEngine'
			{			
				btnObj.innerHTML=btnObj.innerHTML.replace(this.m_sQEBtnONText,this.m_sQEBtnOFFText); //change button text	
				name = "EnableEngine";	//change method invoked
				this.m_bQuickEditDirtyFlag = false;	//Set this flag to false here. Instance is validated now.
				this.m_bEngineState = true;			
			}
			else if(sButtonText == this.m_sQEBtnOFFText) // If button text is Cfg ON then method invoked is DisableEngine'
			{
				btnObj.innerHTML=btnObj.innerHTML.replace(this.m_sQEBtnOFFText,this.m_sQEBtnONText); //change button text	
				name = "DisableEngine"; //change method invoked	
				this.m_bEngineState = false;
			}										
		}  		  
	}   	
	
	if( (this.m_bQuickEdit) && (name == "DoneConfig"))
	{
		if(this.m_bQuickEditDirtyFlag && !this.m_bEngineState)
		{
			var appObj = (window.opener != null) ? window.opener : this;
			//HI mode acccessor
			if (SWEIsHighInteract )	
				var sString = top.App ().GetLocalString ("IDS_CXP_QUICKEDIT_UI_INCOMPLETE"); // for locale
			else
				var sString = appObj._SWEgetMessage ("IDS_CXP_QUICKEDIT_UI_INCOMPLETE");

			alert (sString);
			m_UIFramework.UnlockRequestQueue ();
			return;	
		}
	}
   /*****************  Added for ACR502 - QuickEdit - END     ***************/
   
   var grpItemId        = "";
   var inputPropSet;
   var outputPropSet;
   var hiddenFrame;
   var idInfo;
   var methodParam;
   var retVal = true;

   if (this.m_preInvokeMethod [name] != null && typeof (this.m_preInvokeMethod [name]) != "undefined")
   {
      retVal = eval (this.m_preInvokeMethod [name]);
   }
   
   if (retVal == false)
      return;
   
   if (id != null)
   {
      idInfo = getIdInfo (id);
      if (idInfo["PORT"] != "")
         grpItemId = idInfo ["GRPITEM"] + _underscore + "PORT" + _pipe + idInfo ["PORT"];
      else if (idInfo["PORTITEM"] != "")
         grpItemId = idInfo ["GRPITEM"] + _underscore + "PORTITEM" + _pipe + idInfo ["PORTITEM"] + 
                     _underscore + "INTID" + _pipe + idInfo ["INTID"];         
      else if (idInfo ["ATTR"] != "")
         grpItemId = idInfo ["GRPITEM"] + _underscore + "ATTR" + _pipe + idInfo ["ATTR"];
      else
         grpItemId = idInfo ["GRPITEM"];
         
      inputPropSet = this.m_controlPropSet.GetChildByType (grpItemId);

      if (name == "PrevView" && SWEIsHighInteract != true)
      {
         var url = inputPropSet.GetProperty ("URL");
         var vfrm = SWEFindFrame(top, "_sweview");  
         SWETargetGotoURL (url, vfrm);
         return;
      }

      if (name == "UndoLastRequest" ||
          name == "RemoveFailedRequests" ||
          name == "FinishIt" ||
          name == "SyncInstance" ||
          name == "CloseExplanation" ||
          name == "GetDetailExpl" ||
          name == "ClearTheStatus" ||
          name == "CalculatePriceCX" ||
          name == "DoneConfig" ||
          name == "ExternalValidate" ||
          name == "EnableEngine" ||
          name == "DisableEngine" )

      {
         var strInputArgs;
         var inPS;
  
         inPS = new JSSCfgPropertySet();
                
         inPS.SetProperty ("RequestType", name);

         strInputArgs = inPS.EncodeAsString ();
         strInvokeMethod = "SubmitRequest_" + strInputArgs;

         if (name == "UndoLastRequest" || name == "ClearTheStatus")
            SubmitWithMainFrame (strInvokeMethod);
         else
            SubmitWithHiddenFrame (strInvokeMethod);
      }
      else if (name == "SetTopObj")
      {
         var prodPropSet      = null;
         var prodId           = "";
         var path             = "";
         var strInputArgs     = "";
         var inPS             = null;

         //1.This could come from the Thread Bar:
         methodParam = inputPropSet.GetProperty ("MethodParam");
         if (methodParam != "" && typeof (methodParam) != "undefined" && methodParam != null)
         {
            SubmitWithMainFrame (name + "_" + methodParam);
            return;
         }
         else
         {
            //2. This is a drilldown from a Radio button or Quantity List
            var domainPropSet = inputPropSet.GetChildByType ("Domain");
            if (domainPropSet != null && typeof (domainPropSet) != "undefined")
               prodPropSet = domainPropSet.GetChildByType (idInfo ["PROD"]);
            else
               prodPropSet = inputPropSet; //3. This is a drilldown from ComboAdd Port Item
         }

         prodId = path = "";         
         prodId = prodPropSet.GetProperty ("Product Id");
         path = prodPropSet.GetProperty ("Path");

         inPS = new JSSCfgPropertySet();
         inPS.SetProperty ("Product Id", prodId);
         inPS.SetProperty ("Path", path);
         strInputArgs = inPS.EncodeAsString ();
         strInvokeMethod = name + "_" + strInputArgs;

         SubmitWithMainFrame (strInvokeMethod);
      }
      else
      {
         methodParam = inputPropSet.GetProperty ("MethodParam");
         if (methodParam != null)
            SubmitWithMainFrame (name + "_" + methodParam);
         else
            SubmitWithMainFrame (name);

      }
   }
   else
   {
      //currently used by eBiz template
      //This is the case where the parameters of the method is passed in, ie. don't need
      //to look up at either m_controlPropSet
      SubmitWithMainFrame (name);
   }
}

function CFG_framework_CallService (strServiceName, strMethodName, strInputArgs, callBackFunction)
{
   var inputArgs = new JSSCfgPropertySet ();
   inputArgs.DecodeFromString (strInputArgs);
   
   inputArgs.SetProperty ("RequestType", "CallService");
   inputArgs.SetProperty ("ServiceName", strServiceName);
   inputArgs.SetProperty ("ServiceMethod", strMethodName);
   inputArgs.SetProperty ("ServiceCallBackFunction", callBackFunction);
   
   strInputArgs = inputArgs.EncodeAsString ();
   strInvokeMethod = "SubmitRequest_" + strInputArgs;
   SubmitWithHiddenFrame (strInvokeMethod);
}

function CFG_framework_LockRequestQueue ()
{
   this.m_bRequestLock = true;
}

function CFG_framework_UnlockRequestQueue ()
{
   var request = "";
   if (this.m_requestQueue.length - this.m_requestQueueIndex > 0)
   {
      //request = this.m_requestQueue.shift ();
      request = this.m_requestQueue[this.m_requestQueueIndex];
      this.m_requestQueue[this.m_requestQueueIndex] = null;
      this.m_requestQueueIndex++;
      
      // FR# 12-1SWPR9D: set m_bRequestLock = false
      if (this.m_requestQueue.length - this.m_requestQueueIndex <= 0)
      {
         this.m_bRequestLock = false;
      }
      
      eval (request);
   }
   else
   {
      this.m_bRequestLock = false;
   }
   
   // FR#12-1N31O9Z - Reset to initial value
   this.m_requestQueueTimeStamp = -(requestQueueTimeOut);
}

function CFG_framework_ProcessNotify (strPropSet)
{
   var propSet          = new JSSCfgPropertySet ();
   var notifyPropSet    = null;
   propSet.DecodeFromString (strPropSet);
   notifyPropSet = propSet.GetChildByType ("Notify");  
   
   if (notifyPropSet == null)
      return;
      
   var type = notifyPropSet.GetProperty ("Type");
   var msg = notifyPropSet.GetProperty ("Message");
   var onYes = notifyPropSet.GetProperty ("OnYesEval");
   var onNo  = notifyPropSet.GetProperty ("OnNoEval");
   if (type == "alert")
   {
      if (alert (msg))
      {
         SubmitToQueue (onYes);
      }
      else
      {
         SubmitToQueue (onNo);
      }
   }
   else if (type == "confirm")
   {
      if (confirm (msg))
      {
         SubmitToQueue (onYes);
      }
      else
      {
         SubmitToQueue (onNo);
      }   
   }
   else if (type == "eval")
   {
      SubmitToQueue (onYes);
   }
}


function CFG_framework_GetTemplateVarValue (strVarName)
{
   var strVarPath       = "top.g_cfgMainFrame." +  strVarName;
   
   var strVarValue = eval (strVarPath);
   
   if (strVarValue == null && top.g_cfgVisibleAxConfigurator)
   {
	  var bufferFrame = SWEFindFrame(top, "CfgBufferFrame");
	  strVarPath       = "bufferFrame." + strVarName;
	  strVarValue = eval (strVarPath);
   }
      
   return strVarValue;
}


// DefereUpdate function **** start
function CFG_framework_SetAttributePSGenerator (grpItemId, value, typeCode)
{

   var displayName         = "";
   var name                = "";
   var xaId                = "";
   var attId               = "";
   var inputPropSet        = null;
   var outputPropSet       = null;
   var strInputArgs        = "";
   var strInvokeMethod     = "";
   var strParentPath       = "";

   var attPropSet = this.m_controlPropSet.GetChildByType (grpItemId);
   name = attPropSet.GetProperty ("AttName");
   displayName = attPropSet.GetProperty ("Attribute Display Name"); 
   xaId = attPropSet.GetProperty ("XA Id"); 
   attId = attPropSet.GetProperty ("AttID"); 
   strParentPath = attPropSet.GetProperty ("Parent Path");
   
   top.cfgAnchorId = strParentPath + "_" + attId;

   inputPropSet = new JSSCfgPropertySet();
   inputPropSet.SetProperty ("RequestType", "ChangeAttribute");
   inputPropSet.SetProperty ("Name", name);
   inputPropSet.SetProperty ("Id", attId);
   inputPropSet.SetProperty ("ObjId", this.CFG_frameworkObjId);
   inputPropSet.SetProperty ("RootId", this.CFG_frameworkRootId);
   inputPropSet.SetProperty ("Path", strParentPath);
   inputPropSet.SetProperty ("XA Id", xaId);
   inputPropSet.SetProperty ("Value", value);
   inputPropSet.SetProperty ("Version", this.CFG_frameworkVersion);
   inputPropSet.SetProperty ("Property Type Code", typeCode);
   inputPropSet.SetProperty ("Attribute Display Name", displayName);
   inputPropSet.SetProperty ("Parent Display Name", this.CFG_frameworkProdName);

   return inputPropSet;
}

function CFG_framework_SetItemQuantityPSGenerator (grpItemId, intId, quantity, setTypeQty)
{
   var portPropSet      = null;
   var portItemPropSet  = this.m_controlPropSet.GetChildByType (grpItemId);
   var domainPropSet    = null;
   var instancePropSet  = null;
   var j                = 0;
   var name             = "";
   var nInstanceCount   = 0;
   var path             = "";   
   var portName         = "";
   var prodPropSet      = null;
   
   domainPropSet = portItemPropSet.GetChildByType ("Domain");
   if (domainPropSet != null && typeof (domainPropSet) != "undefined")
   {
      portPropSet = domainPropSet;
      nInstanceCount = portPropSet.GetChildCount ();

      for (j = 0; j < nInstanceCount; j++)
      {
         instancePropSet = null;
         path            = "";
         
         instancePropSet = portPropSet.GetChild (j);
         path = instancePropSet.GetProperty ("Path");
         
         if (path == intId)
         {
            prodPropSet = instancePropSet;
            break;
         }
      } 
   }      
   else
      prodPropSet = portItemPropSet;
   
   if (prodPropSet != null)
   {
      portName = prodPropSet.GetProperty ("CxPortName");
      name = prodPropSet.GetProperty ("Name");
   }
      
   var inputPropSet = new JSSCfgPropertySet();
   inputPropSet.SetProperty ("RequestType", "ChangeQuantity");
   inputPropSet.SetProperty ("ObjId", this.CFG_frameworkObjId);
   inputPropSet.SetProperty ("RootId", this.CFG_frameworkRootId);
   inputPropSet.SetProperty ("Path", intId);
   inputPropSet.SetProperty ("Quantity", quantity);
   inputPropSet.SetProperty ("Version", this.CFG_frameworkVersion);
   inputPropSet.SetProperty ("Parent Display Name", this.CFG_frameworkProdName);
   inputPropSet.SetProperty ("Port Display Name", portName);      
   inputPropSet.SetProperty ("New Child Display Name", name);
   inputPropSet.SetProperty ("SetTypeQty", setTypeQty);

   top.cfgAnchorId = prodPropSet.GetProperty ("Parent Path") + "_" + prodPropSet.GetProperty ("Port Item Id");
   return inputPropSet;
}

function CFG_framework_AddItemPSGenerator (bAddItem, grpItemId, prodId, quantity, setTypeQty, bMultiSelect)
{
   var controlPropSet   = null;
   var domainPropSet    = null;
   var prodPropSet      = null;
   var parentPath       = "";
   
   var strQuantity = new String (quantity);
   
   if (strQuantity.search (/^\d/))
   {
      //alert ("Invalid Quantity");
      this.UnlockRequestQueue ();
      return;
   }   
   
   controlPropSet = this.m_controlPropSet.GetChildByType (grpItemId);
   
   domainPropSet = controlPropSet.GetChildByType ("Domain");
   parentPath = domainPropSet.GetProperty ("Parent Path");   
   prodPropSet = domainPropSet.GetChildByType (prodId);
   if (prodPropSet != null || prodId == "none")
   {
      var autoResolve = "";
      var strInputArgs;
      var strInvokeMethod;
      var currentPrice = "";
      var listPrice    = "";
      var name         = "";
      var portItemId   = "";
      var portName     = "";
           
      if (prodId != "none")
      {
         if (bMultiSelect && prodPropSet.GetProperty("Path") != null) // there is integration id
         {
            if (prodPropSet.GetProperty("Quantity") != quantity)
               return this.SetItemQuantityPSGenerator (grpItemId, prodPropSet.GetProperty("Path"), quantity, setTypeQty);
            else   
               return (null);              
         }  
               
         name = prodPropSet.GetProperty("CxObjName");
         portItemId = prodPropSet.GetProperty ("Port Item Id");
         version = prodPropSet.GetProperty("Version");
         listPrice = prodPropSet.GetProperty ("List Price");
         portName = prodPropSet.GetProperty ("CxPortName");
         if (isNaN (listPrice))
            listPrice = "";
         currentPrice = "";
         autoResolve = "";
      }
      else
         portItemId = domainPropSet.GetProperty ("Port Item Id");
      
      inputPropSet = new JSSCfgPropertySet();
      inputPropSet.SetProperty ("RequestType", "AddItem");
      inputPropSet.SetProperty ("Name", name);
      inputPropSet.SetProperty ("Parent Display Name", this.CFG_frameworkProdName);
      inputPropSet.SetProperty ("Port Display Name", portName);      
      inputPropSet.SetProperty ("New Child Display Name", name);        
      inputPropSet.SetProperty ("ObjId", this.CFG_frameworkObjId);
      inputPropSet.SetProperty ("RootId", this.CFG_frameworkRootId);
      inputPropSet.SetProperty ("Parent Path", parentPath);
      inputPropSet.SetProperty ("Prod Item Id", portItemId);
      inputPropSet.SetProperty ("Product Id", prodId);
      inputPropSet.SetProperty ("Port Item Id", portItemId);
      inputPropSet.SetProperty ("Quantity", quantity);
      inputPropSet.SetProperty ("List Price", listPrice);
      inputPropSet.SetProperty ("Current Price", currentPrice);
      inputPropSet.SetProperty ("Version", this.CFG_frameworkVersion);
      inputPropSet.SetProperty ("AutoResolve", autoResolve);
      inputPropSet.SetProperty ("AddItem", bAddItem);
      inputPropSet.SetProperty ("SetTypeQty", setTypeQty);
      
      top.cfgAnchorId = parentPath + "_" + portItemId;
      return inputPropSet;   
   }
   else
   {
      if (bCFG_clientJsDebug) 
         alert ("Unable to find Cached Info");
      this.UnlockRequestQueue ();
      return (null);
   }
}

function CFG_framework_RemoveItemPSGenerator (grpItemId, prodId)
{
   var controlPropSet   = null;
   var domainPropSet    = null;
   var prodPropSet      = null;
   
   controlPropSet = this.m_controlPropSet.GetChildByType (grpItemId);
   domainPropSet = controlPropSet.GetChildByType ("Domain");
   prodPropSet = domainPropSet.GetChildByType (prodId);
   if (prodPropSet != null)
   { 
      if (prodPropSet.GetProperty("Path") == null) // no integration id
         return (null);
      
      inputPropSet = new JSSCfgPropertySet();
      inputPropSet.SetProperty ("RequestType", "RemoveItem");
      inputPropSet.SetProperty ("Path", prodPropSet.GetProperty("Path"));
      inputPropSet.SetProperty ("Parent Display Name", this.CFG_frameworkProdName);
      inputPropSet.SetProperty ("Port Display Name", prodPropSet.GetProperty ("CxPortName"));        
      inputPropSet.SetProperty ("New Child Display Name", prodPropSet.GetProperty("CxObjName"));      
      inputPropSet.SetProperty ("ObjId", this.CFG_frameworkObjId);
      inputPropSet.SetProperty ("Version", this.CFG_frameworkVersion);           
      inputPropSet.SetProperty ("RootId", this.CFG_frameworkRootId);

      top.cfgAnchorId = prodPropSet.GetProperty("Parent Path") + "_" + prodPropSet.GetProperty("Port Item Id");
      return inputPropSet; 
   }
   else
   {
      if (bCFG_clientJsDebug) 
         alert ("Unable to find Cached Info");
      this.UnlockRequestQueue ();
      return (null);
   }
}


function CFG_framework_SetDeferUpdate (bVal)
{
   this.m_bDeferUpdate = bVal;
}

function CFG_framework_ProcessInteractPropSet ()
{
   var strDirtyId;
   var dirtyIdInfo;
   var childPropSet        = null;
 
   if (this.m_DirtyItemArray.length == 0)
      return;
   
   var RequestsPropSet = new JSSCfgPropertySet();
   var inPS            = new JSSCfgPropertySet();
   var InteractPS      = new JSSCfgPropertySet();
                  
   inPS.SetProperty ("RequestType", "InteractMultiSelect");
      
   RequestsPropSet.SetType ("Interact Requests");
   inPS.AddChild (RequestsPropSet);
   
   // this is to be consistent with WebChannel parameter
   InteractPS.SetType ("Requests");
   RequestsPropSet.AddChild (InteractPS);
   
   for (var x=0; x < this.m_DirtyItemArray.length ; x++)
   {
      strDirtyId = this.m_DirtyItemArray[x];
      dirtyIdInfo = this.m_DirtyIdLookUp [strDirtyId];
      
      // Reset
      this.m_DirtyIdLookUp[strDirtyId] = null;
      this.m_DirtyItemArray[x] = null;
      
      /*
      dirtyIdInfo["QTY"] = "0";
      dirtyIdInfo["GRPITEM"] = grpItemId;
      dirtyIdInfo["PROD"] = prodId;
      dirtyIdInfo["QTY"] = "0";
  
      dirtyIdInfo["TYPECODE"] = typeCode;
      dirtyIdInfo["ATTVAL"] = value;
 
      dirtyIdInfo["GRPITEM"] = grpItemId;
      dirtyIdInfo["ADDITEM"] = bAddItem;
      dirtyIdInfo["TYPEQTY"] = setTypeQty;
      dirtyIdInfo["INTID"] = intId;
      */
      
      if (dirtyIdInfo["ATTVAL"] != null && typeof (dirtyIdInfo["ATTVAL"]) != "undefined")
      {
         childPropSet = this.SetAttributePSGenerator (dirtyIdInfo["GRPITEM"], dirtyIdInfo["ATTVAL"], dirtyIdInfo["TYPECODE"]);
      }
      else if (dirtyIdInfo["INTID"] != null && typeof (dirtyIdInfo["INTID"]) != "undefined")
      {
         childPropSet = this.SetItemQuantityPSGenerator (dirtyIdInfo["GRPITEM"], dirtyIdInfo["INTID"], dirtyIdInfo["QTY"], dirtyIdInfo["TYPEQTY"]);
      }
      else if (dirtyIdInfo["QTY"] == "-1")
      {
         childPropSet = this.RemoveItemPSGenerator (dirtyIdInfo["GRPITEM"], dirtyIdInfo["PROD"]);
      }
      else
      {
         childPropSet = this.AddItemPSGenerator (dirtyIdInfo["ADDITEM"], dirtyIdInfo["GRPITEM"], dirtyIdInfo["PROD"], dirtyIdInfo["QTY"], dirtyIdInfo["TYPEQTY"], true);
      }
  
      if (childPropSet != null)
      {
         // add InteractPS into child PS
         childPropSet.SetType ("Request");
         InteractPS.AddChild (childPropSet);
      }
   }
          
   // TODO: reset   this.m_DirtyItemArray and this.m_DirtyIdLookUp;
   this.m_DirtyIdLookUp = this.m_DirtyIdLookUp.splice (0, this.m_DirtyIdLookUp.length);
   this.m_DirtyItemArray = this.m_DirtyItemArray.splice (0,this.m_DirtyItemArray.length);
   this.m_DirtyIdLookUp.length = 0;
   this.m_DirtyItemArray.length = 0;
   
   var strInputArgs = inPS.EncodeAsString ();
   var strInvokeMethod = "SubmitRequest_" + strInputArgs;
   
   var nPropertyCount = InteractPS.GetChildCount ();
   if (nPropertyCount > 0)
      //SubmitWithHiddenFrame (strInvokeMethod);
      SubmitWithMainFrame (strInvokeMethod);
   else   
      this.UnlockRequestQueue ();
   //*** end
   
}
// DefereUpdate **** end

function RemoveNodeCustom (currentDoc)
{
   if (document.all)
      currentDoc.removeNode (false);
   else
   {
      var p = currentDoc.parentNode;
      if (p)
      {
         var df = document.createDocumentFragment ();
         for (var a = 0; a < currentDoc.childNodes.length; a++)
         {
            df.appendChild (currentDoc.childNodes[a]);
         }
         p.insertBefore (df , currentDoc);
         p.removeChild (currentDoc);
      }
   }
}
// Fix for FR#12-1MWR5B3 - Ineligible products selection
function SetExcluded(resultPropSet, strProdId, strSpanId)
{
   var optionObj              = null;
   var optionId               = "";
   var portDomainPropSet      = null;
   var domainProd             = null;  
   var nDomainLen             = 0;

   portDomainPropSet = resultPropSet.GetChildByType ("Domain");
    
   if (null != portDomainPropSet)
   {
       nDomainLen = portDomainPropSet.GetChildCount ();      
       
       for (var nItm = 0; nItm < nDomainLen; nItm++)
       {
          domainProd = portDomainPropSet.GetChild(nItm)
          if (null != domainProd && domainProd.GetProperty("Product Id") == strProdId)
          {
              optionId = strSpanId + _underscore + "PORTDOMAIN" + _pipe + strProdId;         
              optionObj     = null;
              optionObj = document.getElementById (optionId);
              if ((null != optionObj  || bCFG_clientJsDebug) && 
                   "N" == domainProd.GetProperty ("CxEnabled"))
              {
                 optionObj.className = "eCfgOptionExcluded";
              }
          }
       }
   }
}

/*****************  Added for ACR502 - QuickEdit - START   ***************/ 
//set quickedit flag
function CFG_framework_SetQuickEdit (bVal)
{
   this.m_bQuickEdit = bVal;
}
//set the button id for 'Cfg ON' 'Cfg OFF' toggle button
function CFG_framework_SetQuickEditButtonID (strButtonId)
{  
	if(this.m_bQuickEdit)
	{ 
		this.m_sButtonId = strButtonId;	
	}               
}
//Save the translated button text for 'Cfg ON' 'Cfg OFF' toggle button
function CFG_framework_SaveQEButtonText (strButtonTextPS)
{    
	if(this.m_bQuickEdit) //If quickedit mode
	{
		var propSet = new JSSCfgPropertySet ();
		propSet.DecodeFromString (strButtonTextPS);
		var btnONtext = propSet.GetProperty ("Cfg ON");
		var btnOFFtext = propSet.GetProperty ("Cfg OFF");
        //store the translated texts in member variables.
		if (btnONtext)
		{
			this.m_sQEBtnONText = 	btnONtext;		
		}
		if (btnOFFtext)
		{
			this.m_sQEBtnOFFText = 	btnOFFtext;		
		} 	
		delete propSet;
	}
               
}

function CFG_framework_SetEngineState (bFlag)
{
	this.m_bEngineState = bFlag;
}

function CFG_framework_SetDirtyItemFlag (bFlag)
{
	this.m_bQuickEditDirtyFlag = bFlag;
}

/*function CFG_framework_QuickEditHelper (name,id)
{
   //Change the function associated to the toggle button based on whether it is Cfg ON or Cfg OFF
   //If the Cfg ON or Cfg OFF button is clicked
    if(id == this.m_sButtonId)
    {
		if(this.m_bQuickEdit) //If it's quickedit.
		{				
			var btnObj = document.getElementById(this.m_sButtonId);  //Get the button object	  	
			var sButtonText = btnObj.innerText;  //Get the button text								
			if(sButtonText == this.m_sQEBtnONText) // If button text is Cfg ON then method invoked is 'EnableEngine'
			{			
				btnObj.innerHTML=btnObj.innerHTML.replace(this.m_sQEBtnONText,this.m_sQEBtnOFFText); //change button text	
				name = "EnableEngine";	//change method invoked
				this.m_bQuickEditDirtyFlag = false;	//Set this flag to false here. Instance is validated now.
				this.m_bEngineState = true;			
			}
			else if(sButtonText == this.m_sQEBtnOFFText) // If button text is Cfg ON then method invoked is DisableEngine'
			{
				btnObj.innerHTML=btnObj.innerHTML.replace(this.m_sQEBtnOFFText,this.m_sQEBtnONText); //change button text	
				name = "DisableEngine"; //change method invoked	
				this.m_bEngineState = false;
			}										
		}  		  
	}   	
	
	if( (this.m_bQuickEdit) && (name == "DoneConfig"))
	{
		if(this.m_bQuickEditDirtyFlag)
		{
			var appObj = (window.opener != null) ? window.opener : this;
			//HI mode acccessor
			if (SWEIsHighInteract )	
				var sString = top.App ().GetLocalString ("IDS_CXP_MULTISELECT_UI_INCOMPLETE"); // for locale
			else
				var sString = appObj._SWEgetMessage ("IDS_CXP_MULTISELECT_UI_INCOMPLETE");

			alert (sString);
			m_UIFramework.UnlockRequestQueue ();
			return;	
		}
	}
	
   var btnObj = document.getElementById(id);  //Get the button object	  	
   var sButtonText = btnObj.innerText;  //Get the button text											
   if(sButtonText == this.m_sQEBtnONText)
   {
	if ((name == "AddItem") ||
		(name == "AddItemMin") ||
		(name == "RemoveItem") ||
		(name == "ReplaceItem") ||
		(name == "SetItemQuantity") ||
		(name == "SetItemQuantityMin") ||
		(name == "EditField") ||
		(name == "SetFieldValue"))
		{
			this.m_bQuickEditDirtyFlag = true;				
		}
	}   
}*/
/*****************  Added for ACR502 - QuickEdit - END     ***************/


// Account Origination

function applicantUpdatePortItemsForComboAdd (portItemPropSet)
{ 
   applicantUpdatePortItemsForComboAddHelper (portItemPropSet);
   checkForceRefresh (portItemPropSet, true, true);
}

//This function originated from BT's requirement to display Attributes in line with the grandchild Line Item
//The only difference with this function is that it makes sure the screen does not refresh when user deletes
//a grandchild attribute
function applicantUpdatePortItemsForComboAddAttr (portItemPropSet)
{
   applicantUpdatePortItemsForComboAddHelper (portItemPropSet);
   checkForceRefresh (portItemPropSet, true, true); 
}

function applicantUpdatePortItemsForComboAddHelper (portItemPropSet)
{
   var addPS            = null;
   var childPS          = null;
   var comboAddPS       = null;
   var delPS            = null;
   var fieldHeader      = null;
   var fieldListObj     = null;
   var fieldName        = "";
   var fieldValue       = "";
   var idInfo           = null;
   var instancePropSet  = null;
   var j                = 0;
   var modPS            = null;
   var nInstanceCount   = 0;
   var path             = "";
   var portId           = "";
   var portItemCount    = 0;
   var prodId           = "";
   var rowId            = "";
   var strIntId         = "";
   var strPortId        = "";
   var tdObj            = null;
   var tableId          = "";
   var tableObj         = null;
   var tempPropSet      = null; //temp property set to display the field header
   
   tableId = portItemPropSet.GetType ();
   comboAddPS = m_UIFramework.m_controlPropSet.GetChildByType (tableId);
      
   tableId = tableId.replace (/PORT/, "PORTITEM");

   portItemCount = comboAddPS.GetProperty ("PortItemCount");
   //1. Add
   addPS = portItemPropSet.GetChildByType ("Add");
   if (addPS != null)
   {
      nInstanceCount = addPS.GetChildCount ();
      
      for (j = 0; j < nInstanceCount; j++)
      {           
         strIntId = "";
         instancePropSet = null;
         instancePropSet = new JSSCfgPropertySet ();
         instancePropSet.Copy (addPS.GetChild (j));
         strIntId = instancePropSet.GetProperty ("Path");
         instancePropSet.SetType (tableId + _underscore + "INTID" + _pipe + strIntId);
         m_UIFramework.m_controlPropSet.AddChild (instancePropSet);
         applicantAddPortItem (tableId, instancePropSet);   
         if (j == 0)
            tempPropSet = instancePropSet;               
         portItemCount++;         
      }
   }  

   //2. Modify
   modPS = portItemPropSet.GetChildByType ("Modify");
   if (modPS != null)
   {
      nInstanceCount = modPS.GetChildCount ();
      for (j = 0; j < nInstanceCount; j++)
      {
         var inputObj    = null;
         instancePropSet = null;
         instancePropSet = modPS.GetChild (j);
         
         fieldName = path = prodId = portId = fieldValue = "";
         tdObj = null;
         
         fieldName = instancePropSet.GetProperty ("Name");
         path = instancePropSet.GetProperty ("Path");
         portId = instancePropSet.GetProperty ("Port Item Id");
         fieldValue = instancePropSet.GetProperty ("Value");
         tdObj = document.getElementById (tableId +
                                          _underscore + "INTID" + _pipe + path + _underscore + "FIELD" + _pipe + fieldName);
                                          
         if (tdObj != null)
         { 
            inputObj = tdObj.getElementsByTagName ("INPUT");
            if (inputObj.length > 0)
               inputObj[0].value = fieldValue;
            else
               tdObj.innerHTML = fieldValue; 
         }      
      }
   }
   
   //3. Delete
   delPS = portItemPropSet.GetChildByType ("Delete");
   if (delPS != null)
   {
      nInstanceCount = delPS.GetChildCount ();
      for (j = 0; j < nInstanceCount; j++)
      {
         rowId = path = portId = "";
         instancePropSet = null;
         var index       = "";
         
         instancePropSet = delPS.GetChild (j);  
         path = instancePropSet.GetProperty ("Path");
         portId = instancePropSet.GetProperty ("Port Item Id");
         rowId = tableId + _underscore + "INTID" + _pipe + path;

         deletePortItem (tableId, rowId);  
         
         index = m_UIFramework.m_controlPropSet.GetChildIndexByType (rowId);
         m_UIFramework.m_controlPropSet.RemoveChild (index); 
         portItemCount--;    
      }
   }
   
   comboAddPS.SetProperty ("PortItemCount", portItemCount);

   if (portItemCount > 0)
   {           
      //display the field header if any items exist
      fieldHeader = document.getElementById (tableId + _underscore + "FIELDHEADER");
      if (fieldHeader == null)
      {
         tableObj = document.getElementById (tableId);
         if (tableObj != null || bCFG_clientJsDebug)
         {
            fieldHeader = tableObj.insertRow (0);
            fieldHeader.id = tableId + _underscore + "FIELDHEADER";
            
            var fieldListPropSet  = new JSSCfgPropertySet ();
            var strFieldList  = tempPropSet.GetProperty ("FieldList");
            fieldListPropSet.DecodeFromString (strFieldList);    
               
            displayFieldHeader (fieldHeader, fieldListPropSet);
         }
      }
      fieldHeader.style.display = "";
   }
   else
   {
      //hide the field header if no items exist
      fieldHeader = document.getElementById (tableId + _underscore + "FIELDHEADER");
      if (fieldHeader != null)
         fieldHeader.style.display = "none";   
   } 
}

/*****************  Added for ACR502 - QuickEdit - START   ***************/ 
//set quickedit flag
function CFG_framework_SetQuickEdit (bVal)
{
   this.m_bQuickEdit = bVal;
}
//set the button id for 'Cfg ON' 'Cfg OFF' toggle button
function CFG_framework_SetQuickEditButtonID (strButtonId)
{  
	if(this.m_bQuickEdit)
	{ 
		this.m_sButtonId = strButtonId;	
	}               
}
//Save the translated button text for 'Cfg ON' 'Cfg OFF' toggle button
function CFG_framework_SaveQEButtonText (strButtonTextPS)
{    
	if(this.m_bQuickEdit) //If quickedit mode
	{
		var propSet = new JSSCfgPropertySet ();
		propSet.DecodeFromString (strButtonTextPS);
		var btnONtext = propSet.GetProperty ("Cfg ON");
		var btnOFFtext = propSet.GetProperty ("Cfg OFF");
        //store the translated texts in member variables.
		if (btnONtext)
		{
			this.m_sQEBtnONText = 	btnONtext;		
		}
		if (btnOFFtext)
		{
			this.m_sQEBtnOFFText = 	btnOFFtext;		
		} 	
		delete propSet;
	}
               
}

function CFG_framework_SetEngineState (bFlag)
{
	this.m_bEngineState = bFlag;
}

function CFG_framework_SetDirtyItemFlag (bFlag)
{
	this.m_bQuickEditDirtyFlag = bFlag;
}

// BUG-17369824 : set top._swescript.bRefreshState = false after Configurator loaded.
function _resetRefreshState ()
{
   if ( top._swescript.bRefreshState == true )
   {
      top._swescript.bRefreshState = false;

     if ( window.removeEventListener ) 
	    window.removeEventListener ( "onload", _resetRefreshState, false);
	 else if ( window.detachEvent )
	    window.detachEvent ( "onload",_resetRefreshState );
   }
}

/*function CFG_framework_QuickEditHelper (name,id)
{
   //Change the function associated to the toggle button based on whether it is Cfg ON or Cfg OFF
   //If the Cfg ON or Cfg OFF button is clicked
    if(id == this.m_sButtonId)
    {
		if(this.m_bQuickEdit) //If it's quickedit.
		{				
			var btnObj = document.getElementById(this.m_sButtonId);  //Get the button object	  	
			var sButtonText = btnObj.innerText;  //Get the button text								
			if(sButtonText == this.m_sQEBtnONText) // If button text is Cfg ON then method invoked is 'EnableEngine'
			{			
				btnObj.innerHTML=btnObj.innerHTML.replace(this.m_sQEBtnONText,this.m_sQEBtnOFFText); //change button text	
				name = "EnableEngine";	//change method invoked
				this.m_bQuickEditDirtyFlag = false;	//Set this flag to false here. Instance is validated now.
				this.m_bEngineState = true;			
			}
			else if(sButtonText == this.m_sQEBtnOFFText) // If button text is Cfg ON then method invoked is DisableEngine'
			{
				btnObj.innerHTML=btnObj.innerHTML.replace(this.m_sQEBtnOFFText,this.m_sQEBtnONText); //change button text	
				name = "DisableEngine"; //change method invoked	
				this.m_bEngineState = false;
			}										
		}  		  
	}   	
	
	if( (this.m_bQuickEdit) && (name == "DoneConfig"))
	{
		if(this.m_bQuickEditDirtyFlag)
		{
			var appObj = (window.opener != null) ? window.opener : this;
			//HI mode acccessor
			if (SWEIsHighInteract )	
				var sString = top.App ().GetLocalString ("IDS_CXP_MULTISELECT_UI_INCOMPLETE"); // for locale
			else
				var sString = appObj._SWEgetMessage ("IDS_CXP_MULTISELECT_UI_INCOMPLETE");

			alert (sString);
			m_UIFramework.UnlockRequestQueue ();
			return;	
		}
	}
	
   var btnObj = document.getElementById(id);  //Get the button object	  	
   var sButtonText = btnObj.innerText;  //Get the button text											
   if(sButtonText == this.m_sQEBtnONText)
   {
	if ((name == "AddItem") ||
		(name == "AddItemMin") ||
		(name == "RemoveItem") ||
		(name == "ReplaceItem") ||
		(name == "SetItemQuantity") ||
		(name == "SetItemQuantityMin") ||
		(name == "EditField") ||
		(name == "SetFieldValue"))
		{
			this.m_bQuickEditDirtyFlag = true;				
		}
	}   
}*/
/*****************  Added for ACR502 - QuickEdit - END     ***************/

CFG_framework.prototype.Init                                = CFG_framework_Init;
CFG_framework.prototype.InitIconLabel                       = CFG_framework_InitIconLabel;

CFG_framework.prototype.AddControls                         = CFG_framework_AddControls;
CFG_framework.prototype.ShowControl                         = CFG_framework_ShowControl;
CFG_framework.prototype.ShowExplanation                     = CFG_framework_ShowExplanation;
CFG_framework.prototype.UpdateCanInvoke                     = CFG_framework_UpdateCanInvoke;
CFG_framework.prototype.UpdateSelectionInfo                 = CFG_framework_UpdateSelectionInfo;
CFG_framework.prototype.UpdateExcludedItems                 = CFG_framework_UpdateExcludedItems;
CFG_framework.prototype.UpdateGenerics                      = CFG_framework_UpdateGenerics;
CFG_framework.prototype.UpdateRootProdInfo                  = CFG_framework_UpdateRootProdInfo;
CFG_framework.prototype.UpdateResources                     = CFG_framework_UpdateResources;
CFG_framework.prototype.UpdateSignal                        = CFG_framework_UpdateSignal;
CFG_framework.prototype.CfgInvokeMethod                     = CFG_framework_CfgInvokeMethod;
CFG_framework.prototype.CallService                         = CFG_framework_CallService;

CFG_framework.prototype.AddItem                             = CFG_framework_AddItem;
CFG_framework.prototype.AddItemHelper                       = CFG_framework_AddItemHelper;
CFG_framework.prototype.AddItemMin                          = CFG_framework_AddItemMin;
CFG_framework.prototype.GetExplanation                      = CFG_framework_GetExplanation;
CFG_framework.prototype.ProcessNotify                       = CFG_framework_ProcessNotify;
CFG_framework.prototype.RefreshUI                           = CFG_framework_RefreshUI;
CFG_framework.prototype.RemoveItem                          = CFG_framework_RemoveItem;
CFG_framework.prototype.ReplaceItem                         = CFG_framework_ReplaceItem;
CFG_framework.prototype.SetAttribute                        = CFG_framework_SetAttribute;
CFG_framework.prototype.SetFieldValue                       = CFG_framework_SetFieldValue;
CFG_framework.prototype.SetItemQuantity                     = CFG_framework_SetItemQuantity;
CFG_framework.prototype.SetItemQuantityHelper               = CFG_framework_SetItemQuantityHelper;
CFG_framework.prototype.SetItemQuantityMin                  = CFG_framework_SetItemQuantityMin;
CFG_framework.prototype.EditField                           = CFG_framework_EditField;
CFG_framework.prototype.LockRequestQueue                    = CFG_framework_LockRequestQueue;
CFG_framework.prototype.UnlockRequestQueue                  = CFG_framework_UnlockRequestQueue;
CFG_framework.prototype.GetTemplateVarValue                 = CFG_framework_GetTemplateVarValue;

CFG_framework.prototype.AddItemPSGenerator                  = CFG_framework_AddItemPSGenerator;
CFG_framework.prototype.SetAttributePSGenerator             = CFG_framework_SetAttributePSGenerator;
CFG_framework.prototype.SetItemQuantityPSGenerator          = CFG_framework_SetItemQuantityPSGenerator;
CFG_framework.prototype.RemoveItemPSGenerator               = CFG_framework_RemoveItemPSGenerator;
CFG_framework.prototype.ProcessInteractPropSet              = CFG_framework_ProcessInteractPropSet;
CFG_framework.prototype.SetDeferUpdate                      = CFG_framework_SetDeferUpdate;
CFG_framework.prototype.RecalculateDynamicShowHide          = CFG_framework_RecalculateDynamicShowHide;
CFG_framework.prototype.NewHeaderImage                      = CFG_framework_NewHeaderImage;
CFG_framework.prototype.SetQuickEdit                        = CFG_framework_SetQuickEdit;
CFG_framework.prototype.SetQuickEditButtonID                = CFG_framework_SetQuickEditButtonID;
CFG_framework.prototype.SaveQEButtonText                    = CFG_framework_SaveQEButtonText;
CFG_framework.prototype.SetEngineState                      = CFG_framework_SetEngineState;
CFG_framework.prototype.SetDirtyItemFlag                    = CFG_framework_SetDirtyItemFlag;
