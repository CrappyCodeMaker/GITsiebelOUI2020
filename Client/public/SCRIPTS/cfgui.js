/*****************************************************************************
 *
 * Copyright (C) 2000, Siebel Systems, Inc., All rights reserved.
 *
 * FILE:       cfgui.js
 *  $Revision: 31 $
 *      $Date: 11/04/01 12:07a $
 *    $Author: standrio $ of last update
 *
 * CREATOR:    Setiono Tandriono
 *
 * DESCRIPTION
 *    Client Side UI rendering code
 *
 *****************************************************************************/

// global variable to be turned on for debugging
var bCFG_uiJsDebug = false;

function SubmitWithMainFrame (methodName)
{    
   if (methodName.indexOf("SetTopObj") >= 0 || methodName.indexOf("ChangeCurrentObj") >= 0) {
      top.cfgKeepAnchor = false;
      top.cfgScrollTop = "";
      top.cfgAnchorId = "";
      top.activeElementId = "";
      top.activeElementName = "";
   }
   else {
      top.cfgKeepAnchor = true;
   }

   top.g_cfgMainFrameCsObj.SWEMethod = methodName;
   if (top.g_cfgVisibleAxConfigurator)
   {
      top.g_cfgVisibleAxConfigurator.CfgInvokeMethod(methodName);
   }
   else
      SWESubmitForm (top.g_cfgMainFrameFormObj, top.g_cfgMainFrameCsObj);
}

function SubmitWithHiddenFrame (methodName)
{
   if (methodName.indexOf("SetTopObj") >= 0 || methodName.indexOf("ChangeCurrentObj") >= 0) {
      top.cfgKeepAnchor = false;
      top.cfgScrollTop = "";
      top.cfgAnchorId = "";
      top.activeElementId = "";
      top.activeElementName = "";
   }
   else {
      top.cfgKeepAnchor = true;
   }

   top.g_cfgHiddenFrameCsObj.SWEMethod = methodName;
   // If this is in HI mode, the "SubmitRequest" command should be
   // handled by the Custom Control.
   if (top.g_cfgAxConfigurator && methodName.indexOf("EditField") == -1)
   {
      top.g_cfgAxConfigurator.CfgInvokeMethod(methodName);
   }
   else
   {
      // JW DeferUpdate: this is invoked when pick popup applet
      var bInteract = false;
      if ( methodName.indexOf("InteractMultiSelect") == -1)
      {
         if (m_UIFramework.m_bDeferUpdate && m_UIFramework.m_DirtyItemArray.length > 0)
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
      SWESubmitForm (top.g_cfgHiddenFrameFormObj, top.g_cfgHiddenFrameCsObj);
      if (bInteract)
         m_UIFramework.UnlockRequestQueue ();
   }
}

function SubmitToQueue (str)
{
   if (m_UIFramework.m_bRequestLock == true || (m_UIFramework.m_requestQueue.length - m_UIFramework.m_requestQueueIndex) > 0)
   {
      m_UIFramework.m_requestQueue[m_UIFramework.m_requestQueue.length] = str;
      
      // FR#12-1N31O9Z - logic to reset request queue
      var now = new Date();
      var curTimeStamp = now.getTime();
      
      if (m_UIFramework.m_requestQueueTimeStamp == -(requestQueueTimeOut))
      {
         // not init yet. Just update current time and return
         m_UIFramework.m_requestQueueTimeStamp = curTimeStamp;
         return;
      }	
      
      if ((curTimeStamp - m_UIFramework.m_requestQueueTimeStamp) >= requestQueueTimeOut)
      {
         if (bCFG_uiJsDebug) 
            alert ("Resetting Request queue");
      
         // reset QueueIndex and unlock. Remaining entries in queue will be ignored
	      m_UIFramework.m_requestQueueIndex = m_UIFramework.m_requestQueue.length;
	      m_UIFramework.m_bRequestLock = false;
	      m_UIFramework.m_requestQueueTimeStamp = -(requestQueueTimeOut);
	      SubmitToQueue ("m_UIFramework.RefreshUI ()");
	      SubmitToQueue (str);
      }
   }
   else
   {
      m_UIFramework.m_bRequestLock = true;    
      eval (str);
   }
}

function processInput (id, str, type)
{
   var idInfo        = null;
   var path          = "";
   var portPropSet   = null;
   var prodId        = "";
   var prodPropSet   = null;
   var obj           = null;
   var objType       = "";   
   var quantity      = "";
   var resultPropSet = null;
   var spanId        = "";
   var tableId       = "";
   var tempValue     = ""; // for FR#12-139DIHA
	
   switch (type)
   {
      case "select":
         idInfo = getIdInfo (document.getElementById (id).value);
         
         if (idInfo ["ATTTYPE"] != null && idInfo ["ATTTYPE"] != "")
         {
            // added the following piece of code for FR# 12-1BVCBJR
            tempValue = idInfo["ATTVAL"];
            if (tempValue.length > 0)
               tempValue = tempValue.replace(/\"/g, "\\\""); 
 
            SubmitToQueue ("m_UIFramework.SetAttribute (" +
                           "\"" + idInfo["GRPITEM"] + _underscore + "ATTR" + _pipe + idInfo["ATTR"] + "\"" +
                           ", " +
                           "\"" + tempValue + "\"" + 
                           ", " + 
                           "\"" + idInfo["ATTTYPE"] + "\");");
         }
         else
         {
            SubmitToQueue ("m_UIFramework.AddItem (" + 
                           "\"N\"" + 
                           ", " +
                           "\"" + idInfo["GRPITEM"] + _underscore + "PORT" + _pipe + idInfo["PORT"] + "\"" + 
                           ", " + 
                           "\"" + idInfo["PROD"] + "\"" + 
                           ", " + 
                           "1);");
         }
         break;
			
      case "ComboAddQtyOne":
      	//Get the product info
	      obj = document.getElementById (str);
         idInfo = getIdInfo (obj.value);
         
         //Always select the none option
         tableId = idInfo["GRPITEM"] + _underscore + "PORT" + _pipe + idInfo["PORT"];
         obj = document.getElementById (tableId + _underscore + "PORTDOMAIN" + _pipe + "none");
         obj.selected = true;
                 
         SubmitToQueue ("m_UIFramework.AddItem (" + 
                        "\"Y\"" + 
                        ", " + 
                        "\"" + tableId + "\"" + 
                        ", " + 
                        "\"" + idInfo["PROD"] + "\"" + 
                        ", " + 
                        "1);");   
	      break;

      case "ComboAdd":
         //Get the quantity
	      obj = document.getElementById (id);
	      quantity = obj.value;	      
	      if (quantity == "" || typeof (quantity) == "undefined" || quantity == null)
	         quantity = 0;
	         
	      //To remove decimal quantities   
	      quantity = parseInt (quantity);
	         
         //Clear the quantity box
         obj.value = "";	         
      	
      	//Get the product info
	      obj = document.getElementById (str);
         idInfo = getIdInfo (obj.value);
         
         //Always select the none option
         tableId = idInfo["GRPITEM"] + _underscore + "PORT" + _pipe + idInfo["PORT"];
         obj = document.getElementById (tableId + _underscore + "PORTDOMAIN" + _pipe + "none");
         obj.selected = true;
                 
         //Add item
         if (quantity > 0) //12-HVNXWW: Note that this fix has a side effect: No validation page if qty < 0
         {         
            SubmitToQueue ("m_UIFramework.AddItemMin (" + 
	                        "\"Y\"" + 
	                        ", " + 
	                        "\"" + tableId + "\"" +
	                        ", " +
	                        "\"" + idInfo["PROD"] + "\"" + 
	                        ", " + 
                           "\"" + quantity + "\");");
               
            // this is to make sure that combo add will enforce user to submit 
            if (m_UIFramework.m_bDeferUpdate) // && m_UIFramework.m_DirtyItemArray.length > 0)
            { 
               /*
               var appObj = (window.opener != null) ? window.opener : this;
		
	            //HI mode acccessor	            
	            if (SWEIsHighInteract )	
	               var sString = top.App ().GetLocalString ("IDS_CXP_MULTISELECT_UI_INCOMPLETE"); // for locale
               else
                  var sString = appObj._SWEgetMessage ("IDS_CXP_MULTISELECT_UI_INCOMPLETE");
               */
               //alert ("JAWONG: COMBO ADD, it will call submit implicitly!");

               /*var bConfirmed = confirm("JAWONG: COMBO ADD, it will call submit implicitly!");
               if (!bConfirmed)
               {
                  m_UIFramework.UnlockRequestQueue ();
                  return;
               }*/
            
               // Call implicit submit        
               SubmitToQueue ("m_UIFramework.ProcessInteractPropSet ();");
            }       
	      }      	
	      break;

      case "portitem":    	
         idInfo  = getIdInfo (str);
      
	      quantity = (document.getElementById (id).getElementsByTagName ("input"))[0].value;	      
	      if (quantity == "" || typeof (quantity) == "undefined" || quantity == null)
	         quantity = 0;

         SubmitToQueue ("m_UIFramework.SetItemQuantity (" +
                        "\"" + idInfo["GRPITEM"] + _underscore + "PORTITEM" + _pipe + idInfo ["PORTITEM"] + _underscore + "INTID" + _pipe + idInfo ["INTID"] + "\"" +
                        ", " +
                        "\"" + idInfo["INTID"] + "\"" +
                        ", " + 
                        "\"" + quantity + "\");");   
         break;

      case "Remove":    	
         idInfo  = getIdInfo (str);
      
         SubmitToQueue ("m_UIFramework.SetItemQuantity (" +
                        "\"" + idInfo["GRPITEM"] + _underscore + "PORTITEM" + _pipe + idInfo ["PORTITEM"] + _underscore + "INTID" + _pipe + idInfo ["INTID"] + "\"" +
                        ", " +
                        "\"" + idInfo["INTID"] + "\"" +
                        ", " +
                        "\"" + 0 + "\");");
         break;

      case "comboportitem":       
         idInfo  = getIdInfo (str);
      
	      quantity = (document.getElementById (id).getElementsByTagName ("input"))[0].value;	      
	      if (quantity == "" || typeof (quantity) == "undefined" || quantity == null)
	         quantity = 0;

         SubmitToQueue ("m_UIFramework.SetItemQuantity (" +
                        "\"" + idInfo["GRPITEM"] + _underscore + "PORT" + _pipe + idInfo ["PORT"] + "\"" +
                        ", " +
                        "\"" + idInfo["INTID"] + "\"" +
                        ", " + 
                        "\"" + quantity + "\");");   
         break;         

      case "text":
         idInfo  = getIdInfo (id);
         
         if (idInfo["ATTR"] != "undefined" && idInfo["ATTR"] != "")
            objType = "Attribute";
         else if (idInfo["PORT"] != "undefined" && idInfo["PORT"] != "")
            objType = "Port";
         
         if (objType == "Attribute")
         {           
            // added the following piece of code for FR#12-13O848X
            tempValue = document.getElementById (id).value;
            if (tempValue.length > 0){
               var tempValue1 = tempValue.replace(/\"/g, "\\\""); 
               tempValue = tempValue1;
            }
  
            SubmitToQueue ("m_UIFramework.SetAttribute (" +
                           "\"" + idInfo["GRPITEM"] + _underscore + "ATTR" + _pipe + idInfo["ATTR"] + "\"" + 
                           ", " +
                           "\"" + tempValue + "\"" + 
                           ", " + 
                           "\"" + idInfo["ATTTYPE"] + "\");");
         }
         else if (objType == "Port")
         {    
	         prodId = idInfo["PROD"];
            tableId = idInfo["GRPITEM"] + _underscore + "PORT" + _pipe + idInfo["PORT"];

            resultPropSet = m_UIFramework.m_controlPropSet.GetChildByType (tableId);
            portPropSet = resultPropSet.GetChildByType ("Domain");
            prodPropSet = portPropSet.GetChildByType (prodId);
            path = prodPropSet.GetProperty ("Path");
         
            spanId = tableId + _underscore  + "PROD" + _pipe + prodId + _underscore + "FIELD" + _pipe + "Quantity";

            quantity = (document.getElementById (spanId).getElementsByTagName ("input"))[0].value;            
	         if (quantity == "" || typeof (quantity) == "undefined" || quantity == null)
	            quantity = 0;

            if (path != "" && typeof (path) != "undefined" && path != null)
            {
               SubmitToQueue ("m_UIFramework.SetItemQuantity (" + 
                              "\"" + tableId + "\"" + 
                              ", " + 
                              "\"" + path + "\"" + 
                              ", " + 
                              "\"" + quantity + "\");");
            }
            else
            {
	            SubmitToQueue ("m_UIFramework.AddItem (" + 
	                           "\"Y\"" + 
	                           ", " + 
	                           "\"" + tableId + "\"" + 
	                           ", " + 
	                           "\"" + prodId + "\"" + 
	                           ", " + 
                              "\"" + quantity + "\");");                           
	         }     
         }	
         break;

      case "radio":    
         idInfo  = getIdInfo (id);

         if (idInfo["ATTR"] != "undefined" && idInfo["ATTR"] != "")
            objType = "Attribute";
         else if (idInfo["PORT"] != "undefined" && idInfo["PORT"] != "")
            objType = "Port";

         if (objType == "Port")
         {           
            SubmitToQueue ("m_UIFramework.AddItem (" +
                           "\"N\"" + 
                           ", " + 
                           "\"" + idInfo["GRPITEM"] + _underscore + "PORT" + _pipe + idInfo["PORT"] + "\"" + 
                           ", " + 
                           "\"" + idInfo["PROD"] + "\"" + 
                           ", " +
                           "1);");       
         }
         else if (objType == "Attribute")
         {           
            SubmitToQueue ("m_UIFramework.SetAttribute (" + 
                           "\"" + idInfo["GRPITEM"] + _underscore + "ATTR" + _pipe + idInfo["ATTR"] + "\"" + 
                           ", " + 
                           "\"" + idInfo["ATTVAL"] + "\"" + 
                           ", " + 
                           "\"" + idInfo["ATTTYPE"] + "\");");            
         }
         break;
			
      case "checkbox":           
         idInfo  = getIdInfo (id);
	      prodId = idInfo["PROD"];
         tableId = idInfo["GRPITEM"] + _underscore + "PORT" + _pipe + idInfo["PORT"];
         spanId  = tableId + _underscore  + "PROD" + _pipe + prodId + _underscore + "FIELD" + _pipe + "Quantity";

         if ((document.getElementById (spanId).getElementsByTagName ("input"))[0].checked == true)
         {
            SubmitToQueue ("m_UIFramework.AddItemMin (" + 
                           "\"Y\"" + 
                           ", " + 
                           "\"" + tableId + "\"" + 
                           ", " + 
                           "\"" + prodId + "\"" + 
                           ", " + 
                           "1);");                                         
         }
         else
         {
            SubmitToQueue ("m_UIFramework.RemoveItem (" + 
                           "\"" + tableId + "\"" + 
                           ", " + 
                           "\"" + prodId + "\");");              
         }
         break;      

      case "linkMethod":
         SubmitToQueue ("m_UIFramework.CfgInvokeMethod (" + 
                        "\"" + str + "\"" + 
                        ", " +
                        "\"" + id + "\");");
         break;
         
      case "explanation":
         idInfo = getIdInfo (str);  
         SubmitToQueue ("m_UIFramework.GetExplanation (" + 
                        "\"" + id + "\"" + 
                        ", " +
                        "\"" + idInfo ["PROD"] + "\"" + 
                        ", " + 
                        "\"" + idInfo ["INTID"] + "\");");
         break;
   }
   if(m_UIFramework.m_bCalculateDynamicShowHide)/* ACR418A - Dynamic Show/Hide/ReadOnly/Image. Refresh UI */
   {
	m_UIFramework.m_bCalculateDynamicShowHide = false;
	SubmitToQueue ("m_UIFramework.RefreshUI ()");
   }

}


// BUG-10606183: special handling for the "none" radio control.
function processInputRadioNoneAction(id, str, type)
{
   var idInfo        = null;
   var objType       = null;
   var prodPropSet   = null;
   var domainPropSet = null;
   var noneSelected  = true;

   // check to see if it is None already.  If so, don't do anything...
   idInfo  = getIdInfo (id);

   if (idInfo["ATTR"] != "undefined" && idInfo["ATTR"] != "")
      objType = "Attribute";
   else if (idInfo["PORT"] != "undefined" && idInfo["PORT"] != "")
      objType = "Port";

   if (objType == "Port")
   {
      // if the original value is anything other than "None", at least one of the product would have a "Path" value.
      domainPropSet = m_UIFramework.m_controlPropSet.GetChildByType(idInfo["GRPITEM"] + _underscore + "PORT" + _pipe + idInfo["PORT"]).GetChildByType("Domain");
      if (domainPropSet != null)
      {
         for (i = 0; i < domainPropSet.GetChildCount(); i++)
         {
            prodPropSet = domainPropSet.GetChild(i);
            var path = prodPropSet.GetProperty("Path");
            if (path != "undefined" && path != null)
               noneSelected = false;
         }
      }
   }
   if (objType == "Attribute")
   {
      noneSelected = false;
   }

   if (noneSelected == false)
      processInput(id, str, type);
}


function addPortItem (tableId, instancePropSet)
{  
   var hasGeneric = "";
   var intId      = "";
   var innerHTML  = "";  
   var inputValue = ""; 
   var table      = null;
   var tr         = null;
   var td         = null;
   var prodId     = "";
   var quantity   = 0;
   var NoQtyCtrl  = "";
   var strDynDisable = "N";
   var readOnlyVal = "";
   var strDisplayName ="";   
   
   var fieldListPropSet  = new JSSCfgPropertySet ();
   var strFieldList  = instancePropSet.GetProperty ("FieldList");
   fieldListPropSet.DecodeFromString (strFieldList);       

   prodId = instancePropSet.GetProperty ("Product Id");
   intId  = instancePropSet.GetProperty ("Path");
   quantity = instancePropSet.GetProperty ("Quantity");	
   hasGeneric = instancePropSet.GetProperty ("RequireMoreChild");
   NoQtyCtrl = instancePropSet.GetProperty ("NoQtyCtrl");

   strDynDisable = instancePropSet.GetProperty ("DynDisable");
   
   if (strDynDisable == "Y")
    readOnlyVal = "readonly";
   else
    readOnlyVal = "";

   table = document.getElementById (tableId);

   if (table == null)
      return;
	
   tr = table.insertRow (-1);
   tr.id = tableId + _underscore + "INTID" + _pipe + intId;
   
   //1. Create the quantity box
   if (NoQtyCtrl != "Y")
   {
	if (strDynDisable == "Y")
		inputValue = "<input type=\"text\"" + 
	                    "STYLE= \"background-color:#C0C0C0; width:3.75em\"" + readOnlyVal +
	                    " onchange='processInput(\"" + tableId + _underscore + "INTID" + _pipe + intId + _underscore + "FIELD" + _pipe + "Quantity\", " +
	                                            "\"GRPITEM" + _pipe + tableId + _underscore + "INTID" + _pipe + intId + "\", \"portitem\")' " + 
                       "value=" + quantity + ">";     
   else
    inputValue = "<input type=\"text\"" + 
	                    "STYLE= \"width:3.75em\"" + readOnlyVal +
                    "onchange='processInput(\"" + tableId + _underscore + "INTID" + _pipe + intId + _underscore + "FIELD" + _pipe + "Quantity\", " +
                                            "\"GRPITEM" + _pipe + tableId + _underscore + "INTID" + _pipe + intId + "\", \"portitem\")' " + 
                    "value=" + quantity + ">";   

      createNewField (tr, tableId, _underscore + "INTID" + _pipe, intId, "", "Quantity", inputValue, fieldListPropSet);
   }
   
   //2. Display the name of the instance
   td = tr.insertCell (-1);
   // use display if found otherwise, name
   strDisplayName = instancePropSet.GetProperty ("Display Name");
   if (typeof (strDisplayName) == "undefined" || strDisplayName == "")
      addHtmlAttrib (fieldListPropSet, "Display Name", td);
   else 
      addHtmlAttrib (fieldListPropSet, "Name", td);
        
   if (instancePropSet.GetProperty ("CanDrillDown") == "Y")
   {
      innerHTML += "<a href='javascript:processInput(\"GRPITEM" + _pipe + tableId + _underscore + "PROD" + _pipe + prodId + _underscore + "INTID" + _pipe + intId + "\", \"SetTopObj\", \"linkMethod\")'>";
   }
   
   if (typeof (strDisplayName) == "undefined" || strDisplayName == "")
      innerHTML += instancePropSet.GetProperty ("Name");
   else
      innerHTML += instancePropSet.GetProperty ("Display Name");
      
   if (instancePropSet.GetProperty ("CanDrillDown") == "Y")
      innerHTML += "</a>";
         
   td.innerHTML = innerHTML;
   addGenerics (instancePropSet, td, intId, hasGeneric);
     
   //3. Display the other fields
   displayFieldList (tr, _underscore + "INTID" + _pipe, instancePropSet.GetType (), fieldListPropSet, instancePropSet, "N");
}

function clearPortItems (tableId)
{
   var table = document.getElementById (tableId);
   var len = table.rows.length;
   
   while (len > 0)
   {
      table.deleteRow (0);
   }
}

function deletePortItem (tableId, rowId)
{
   var table         = null;
	
   table = document.getElementById (tableId);
   if (table == null)
      return;
					     
   var arrayLength = table.rows.length;

   for (var i = 0; i < arrayLength; i++)
   {
      if (table.rows[i].id == rowId)
        break;
   }

   if (i >= 0 && i < arrayLength)
   {
      table.deleteRow (i);
   }
}

function createNewField (parent, tableId, rowType, intId, prodId, fieldId, value, fieldListPropSet)
{
	var tdId = "";
	
	if (rowType == (_underscore + "INTID" + _pipe))
	   tdId = tableId + rowType + intId + _underscore + "FIELD" + _pipe + fieldId;
	else if (prodId != "")
	   tdId = tableId + rowType + prodId + _underscore + "FIELD" + _pipe + fieldId;
	   
	var td = null;
	td = document.getElementById (tdId);
	if (td == null)
	{
	   td = parent.insertCell (-1);
	   td.id = tdId;
	}
	   
	td.innerHTML = value;
	
	if (fieldListPropSet != "" && typeof (fieldListPropSet) != "undefined" && fieldListPropSet != null)
	   addHtmlAttrib (fieldListPropSet, fieldId, td);
}

function getIdInfo (id)
{
	var elts       = id.split(_underscore);
	var length     = elts.length;
	var elts2;
	var grpItemId  = "";
   var portId     = "";
   var portItemId = "";
	var prodId     = "";
	var origId     = "";
	var intId      = "";
	var fieldId    = "";
	var attName    = "";
	var attType    = "";
	var attVal     = "";
	var domain     = "";
	var retVal     = new Array();
				
	for (var i = 0; i < length; i++)
	{
	   elts2 = elts[i].split(_pipe);
	   
		if (elts2[0] == "GRPITEM")
			grpItemId = elts2[1];		
		else if (elts2[0] == "PROD")
			prodId = elts2[1];
		else if (elts2[0] == "ORIG")
			origId = elts2[1];		
		else if (elts2[0] == "INTID")
			intId = elts2[1];
		else if (elts2[0] == "FIELD")
			fieldId = elts2[1];	
		else if (elts2[0] == "ATTTYPE")
			attType = elts2[1];		
		else if (elts2[0] == "ATTVAL")
			attVal = elts2[1];	
		else if (elts2[0] == "DOMAIN")
		   domain = "Y";
		else if (elts2[0] == "QUANTITYLIST")
			prodId = elts2[1];		
		else if (elts2[0] == "CHECKBOX")
			prodId = elts2[1];	
		else if (elts2[0] == "COMBOBOX")
			prodId = elts2[1];
      else if (elts2[0] == "RADIO")
			prodId = elts2[1];
      else if (elts2[0] == "PORT")
			portId = elts2[1];
      else if (elts2[0] == "PORTITEM")
			portItemId = elts2[1];			
      else if (elts2[0] == "ATTR")
			attName = elts2[1];			
      else if (elts2[0] == "PORTDOMAIN")
			prodId = elts2[1];							
	}
	 
	retVal["GRPITEM"] = grpItemId;
	retVal["PROD"] = prodId;
	retVal["ORIG"] = origId;
	retVal["INTID"] = intId;
	retVal["FIELD"] = fieldId;
	retVal["ATTTYPE"] = attType;
	retVal["ATTVAL"] = attVal;
	retVal["DOMAIN"] = domain;
   retVal["PORT"] = portId;
   retVal["PORTITEM"] = portItemId;
   retVal["ATTR"] = attName;
	
	return (retVal);
}

function showConflict (strPropSet)
{
   var buttonObj        = null;
   var clearConflict    = "";
   var conflictType     = "";   
   var propSet          = new JSSCfgPropertySet ();
   var errorDivObj      = null;
   var errorSpanObj     = null;
   var iMsgCount        = 0;
   var i                = 0;
   var innerHTML        = "";
   var mainPageDivObj   = null;
   var msgPropSet       = null;
   var spanObj          = null;
   var tr               = null;
   var trArray          = null;
   var td               = null;

   propSet.DecodeFromString (strPropSet);
   clearConflict = propSet.GetProperty ("ClearConflict");
      
   var conflictPropSet = propSet.GetChildByType ("TagErrorStatus");
   if (conflictPropSet != null)
   {
      //clear request queue
      m_UIFramework.m_requestQueue                = new Array ();
      m_UIFramework.m_requestQueueIndex           = 0;
         
      conflictType = conflictPropSet.GetProperty ("Conflict Type");
      iMsgCount = conflictPropSet.GetChildCount ();
      innerHTML = "";
      errorDivObj = document.getElementById ("Conflict Page");
      errorDivObj.style.display = "";        

      spanObj = document.getElementById ("SPAN_CfgErrorMessageSpan");
      spanObj.innerHTML = "<table id=\"" + "CfgErrorMessageSpan" + "\"></table>";
         
      errorSpanObj = document.getElementById ("CfgErrorMessageSpan");
      if (errorSpanObj != null)
      {
         //first deletes the old error messages     					     
         trArray = errorSpanObj.getElementsByTagName ("tr");
         for (i = trArray.length - 1; i >= 0; i--)
            errorSpanObj.deleteRow (i);
               
         for (i = 0; i < iMsgCount; i++)
         {
            msgPropSet = conflictPropSet.GetChild (i);
            
            tr = errorSpanObj.insertRow (-1);
            tr.className = "listRowOff";
            
            td = tr.insertCell (-1);
            td.width = "1%";
            td.className = "row";
            td.vAlign = "top";
            td.innerHTML = m_UIFramework.conflictIcon;
            
            td = tr.insertCell (-1);
            td.className = "Row";
            td.innerHTML = msgPropSet.GetProperty ("Message");
         }   
      }
        
      mainPageDivObj = document.getElementById ("Main Page");
      if (mainPageDivObj != null)
         mainPageDivObj.style.display = "none";

      mainPageDivObj = document.getElementById ("TopLevelButtons1");
      if (mainPageDivObj != null)
         mainPageDivObj.style.display = "none";

      mainPageDivObj = document.getElementById ("TopLevelButtons2");
      if (mainPageDivObj != null)
         mainPageDivObj.style.display = "none";
   }
   else if (clearConflict == "Y")
   {
      errorDivObj = document.getElementById ("Conflict Page");
      if (errorDivObj != null)
         errorDivObj.style.display = "none";

      mainPageDivObj = document.getElementById ("Main Page");
      if (mainPageDivObj != null)
         mainPageDivObj.style.display = "";

      mainPageDivObj = document.getElementById ("TopLevelButtons1");
      if (mainPageDivObj != null)
         mainPageDivObj.style.display = "";

      mainPageDivObj = document.getElementById ("TopLevelButtons2");
      if (mainPageDivObj != null)
         mainPageDivObj.style.display = "";
   }
   
   switch (conflictType)
   {
      case "Conflict":   
         buttonObj = document.getElementById ("RemoveFailedRequests");
         if (buttonObj)
            buttonObj.style.display = "";
            
         buttonObj = document.getElementById ("UndoLast");
         if (buttonObj)
            buttonObj.style.display = "";
                                       
         buttonObj = document.getElementById ("ClearTheStatusUndo");
         if (buttonObj)
            buttonObj.style.display = "none";

         buttonObj = document.getElementById ("ClearTheStatus");
         if (buttonObj)
            buttonObj.style.display = "none"; 
         break;
       
      case "Undo":        
         buttonObj = document.getElementById ("RemoveFailedRequests");
         if (buttonObj)
            buttonObj.style.display = "none";

         buttonObj = document.getElementById ("UndoLast");
         if (buttonObj)
            buttonObj.style.display = "none";

         buttonObj = document.getElementById ("ClearTheStatusUndo");
         if (buttonObj)
            buttonObj.style.display = "";

         buttonObj = document.getElementById ("ClearTheStatus");
         if (buttonObj)
            buttonObj.style.display = "none";         
         break;
         
      case "Info":
         buttonObj = document.getElementById ("RemoveFailedRequests");
         if (buttonObj)
            buttonObj.style.display = "none";
            
         buttonObj = document.getElementById ("UndoLast");
         if (buttonObj)
            buttonObj.style.display = "none";               
               
         buttonObj = document.getElementById ("ClearTheStatusUndo");
         if (buttonObj)
            buttonObj.style.display = "none";

         buttonObj = document.getElementById ("ClearTheStatus");
         if (buttonObj)
            buttonObj.style.display = "";       
         break;  
   }      
}

function showExplanation (strPropSet)
{
   var clearExpl        = "";
   var propSet          = new JSSCfgPropertySet ();
   var explDivObj       = null;
   var explSpanObj      = null;
   var iMsgCount, i;
   var innerHTML        = "";
   var mainPageDivObj   = null;
   var tr               = null;
   var trArray          = null;
   var td               = null;

   propSet.DecodeFromString (strPropSet);
   clearExpl = propSet.GetProperty ("ClearExplanation");
   var explanationPropSet = propSet.GetChildByType ("Explanations");
   if (explanationPropSet != null)
   {
      iMsgCount = explanationPropSet.GetPropertyCount ();
      innerHTML = "";
      explDivObj = document.getElementById ("Explanation Page");
      explDivObj.style.display = "";   
      
      explSpanObj = document.getElementById ("CfgExplanationSpan");
      if (explSpanObj != null)
      {
         //first deletes the old explanations
         trArray = explSpanObj.getElementsByTagName ("tr");
         for (i = trArray.length - 1; i >= 0; i--)
            explSpanObj.deleteRow (i);
               
         for (i = 0; i < iMsgCount; i++)
         {          
            tr = explSpanObj.insertRow (-1);
            tr.className = "listRowOff";
                       
            td = tr.insertCell (-1);
            td.className = "Row";
            td.innerHTML = explanationPropSet.GetProperty ("Expl" + i);            
         }   
      }
        
      mainPageDivObj = document.getElementById ("Main Page");
      if (mainPageDivObj != null)
         mainPageDivObj.style.display = "none";

      mainPageDivObj = document.getElementById ("TopLevelButtons1");
      if (mainPageDivObj != null)
         mainPageDivObj.style.display = "none";

      mainPageDivObj = document.getElementById ("TopLevelButtons2");
      if (mainPageDivObj != null)
         mainPageDivObj.style.display = "none";
   }
   else if (clearExpl == "Y")
   {
      explDivObj = document.getElementById ("Explanation Page");
      if (explDivObj != null)
         explDivObj.style.display = "none";

      mainPageDivObj = document.getElementById ("Main Page");
      if (mainPageDivObj != null)
         mainPageDivObj.style.display = "";

      mainPageDivObj = document.getElementById ("TopLevelButtons1");
      if (mainPageDivObj != null)
         mainPageDivObj.style.display = "";

      mainPageDivObj = document.getElementById ("TopLevelButtons2");
      if (mainPageDivObj != null)
         mainPageDivObj.style.display = "";
   }
}

function showSelectAndOptionsPrice (tableId)
{
   var dispArray = new Array ();
   dispArray[0] = "CxObjName";
   dispArray[1] = "List Price";
   showSelectAndOptionsHelper (tableId, dispArray, "showDomainPrice");
}

function showDomainPrice (dispArrayStr)
{
   var dispArray = new Array ();
   
   CCFMiscUtil_StringToArray (dispArrayStr, dispArray);
   
   var strPrice = (dispArray[1]).toString ();
   var i = strPrice.length;
   
   while (i < 15)
   {
      strPrice += ".";
      i += 1;
   }
   
   var dispValue = strPrice + "   " + dispArray[0];
   return dispValue;
}

function showSelectAndOptions (tableId)
{
   showSelectAndOptionsHelper (tableId, null, null);
}

// This function is used to show comboAdd without quantity box.
function showSelectAndOptionsWithoutQtyCtrl (tableId)
{
   var resultPropSet = m_UIFramework.m_controlPropSet.GetChildByType (tableId);
   resultPropSet.SetProperty ("NoQtyCtrl", "Y");
   showSelectAndOptionsHelper (tableId, null, null);
}

function showSelectAndOptionsHelper (tableId, dispArray, dispFunction)
{
   var buttonHTML             = "";
   var inputId                = "";
   var inputHTML              = "";
   var selectOptionHTML       = "";
   var tableObj               = null;
   var tr                     = null;   
   var resultPropSet          = null;
   var objArray               = null;
   var optionId               = "";
   var portPropSet            = null;
   var portDomainPropSet      = null;
   var portItemId             = "";  
   var portItemSpanId         = ""; 
   var nDomainLen             = 0;
   var i                      = 0;
   var selectId               = "";
   var spanObj                = null;
   var td1                    = null;
   var td2                    = null;
   var td3                    = null;  
   var NoQtyCtrl              = "";
   var readOnlyVal            = "";  
     
   spanObj = document.getElementById ("SPAN_" + tableId);
   spanObj.innerHTML = "<table id=\"" + tableId + "\"></table>";

   tableObj = document.getElementById (tableId);
  
   resultPropSet = m_UIFramework.m_controlPropSet.GetChildByType (tableId);
   resultPropSet.SetProperty ("PortItemCount", "0");
   NoQtyCtrl = resultPropSet.GetProperty ("NoQtyCtrl");
   
   //Title
   tr = tableObj.insertRow (-1);
   
   td1 = tr.insertCell (-1);
   td1.innerHTML = m_UIFramework.GetTemplateVarValue("sComboAddNameLabel");
   td1.width = "250";
   td1.align = "left";
   
   if (NoQtyCtrl != "Y")
   {
      td1 = tr.insertCell (-1);
      td1.innerHTML = m_UIFramework.GetTemplateVarValue("sComboAddQtyLabel");
      td1.width = "50";
      td1.align = "left";
   }

   td1 = null;
           
   portPropSet = resultPropSet.GetChildByType ("Domain");
   nDomainLen = portPropSet.GetChildCount();
   
   var dynReadOnly = portPropSet.GetProperty ("DynDisable");
   if (dynReadOnly == "Y")
    readOnlyVal = "disabled";
   else
    readOnlyVal = "";
    
   nDomainLen = portPropSet.GetChildCount();
   
   var dynChangeImage	= portPropSet.GetProperty ("ChangeImage");
   var dynParentpath	= portPropSet.GetProperty ("Parent Path");
   var dynPortItemId	= portPropSet.GetProperty ("Port Item Id");
	  
   if (dynChangeImage == "Y" )
   {
    var imgId		= "img_" + dynParentpath + "_" + dynPortItemId;
    var newImage	= portPropSet.GetProperty ("DynNewImage");
    var imgObj		= document.getElementById(imgId);
    imgObj.src		= newImage;	
   }

   //Insert an empty option
   portItemId = portPropSet.GetProperty ("Port Item Id");
   optionId = tableId + _underscore + "PORTDOMAIN" + _pipe + "none";   
   selectId = tableId + _underscore + "DOMAINSELECT";  
   selectOptionHTML = "<select id=" + selectId + ">" +    
                      "<option value=\"" + "GRPITEM" + _pipe + tableId + _underscore + "PROD" + _pipe + "none\" " +  
                               "id =\"" + optionId + "\" " +
                               "class=\"" + "eCfgOptionAvailable" + "\" " +
                               "selected>" + 
                       "</option>";
                              
   for (i = 0; i < nDomainLen; i++)
   {
      var prodId              = "";
      var className           = "";
      var displayName         = "";
      var dispValArray        = new Array ();
      var excluded            = "";
      var enable              = "";

      portItemId = "";      
      optionId = "";
      
      portDomainPropSet = portPropSet.GetChild(i);
      excluded = portDomainPropSet.GetProperty ("Excluded");        
      prodId = portDomainPropSet.GetProperty("Product Id");
      portItemId = portDomainPropSet.GetProperty("Port Item Id");
      if (dispArray != null && dispFunction != null)
      {
         for (var iLen = 0; iLen < dispArray.length; iLen++)
         {
            var temp = "";
            temp = portDomainPropSet.GetProperty(dispArray[iLen]);
            
            if (temp == null || typeof (temp) == "undefined")
               dispValArray[iLen] = "";
            else
               dispValArray[iLen] = temp;
         }
         var str = CCFMiscUtil_ArrayToString (dispValArray);
         str = str.replace(/\"/g, "\\\"");
         str = dispFunction + "(\"" + str + "\");";
         displayName = eval (str);
      }
      else
         displayName = portDomainPropSet.GetProperty("CxObjName");
      enable = portDomainPropSet.GetProperty ("CxEnabled");
      
      optionId = tableId + _underscore + "PORTDOMAIN" + _pipe + prodId;
      
      if (enable == "Y")
         className = "eCfgOptionAvailable";
      else
         className = "eCfgOptionExcluded";
         
      if (excluded != "Y" || enable == "Y")         
      {
         selectOptionHTML = selectOptionHTML + 
                            "<option value=\"" + "GRPITEM" + _pipe + tableId + _underscore + "PROD" + _pipe + prodId + "\" " +
                                    "id =\"" + optionId + "\" " +
                                    "class=\"" + className + "\" " + " >" +  
                              displayName + 
                           "</option>";
      }
   }
   
   //end loop
   
   selectOptionHTML += "</select>";
   
   if (NoQtyCtrl != "Y")
   {
      inputId = tableId + _underscore + "DOMAININPUT";
      inputHTML = "<input " + readOnlyVal + " id=\"" + inputId + "\" type=\"text\"/>";
      buttonHTML = "<a href='JavaScript:processInput(\"" + inputId + "\", \"" + selectId + "\", \"ComboAdd\")'>" +
                     m_UIFramework.GetTemplateVarValue("sAddItemLabel") + "</a>";
   }
   else
      buttonHTML = "<a href='JavaScript:processInput(\"\", \"" + selectId + "\", \"ComboAddQtyOne\")'>" +
                     m_UIFramework.GetTemplateVarValue("sAddItemLabel") + "</a>";   
   
   tr = tableObj.insertRow (-1);
   td1 = tr.insertCell (-1);
   if (NoQtyCtrl != "Y")
      td2 = tr.insertCell (-1);
   td3 = tr.insertCell (-1);
   
   td1.innerHTML = selectOptionHTML;
   if (NoQtyCtrl != "Y")
      td2.innerHTML = inputHTML;
   td3.innerHTML = buttonHTML;
   td3.className = "minibuttonOn";
   
   if (dynReadOnly == "Y")
   {
    td2.innerHTML = "<input STYLE= \"background-color:#C0C0C0\"" + readOnlyVal + " id=\"" + inputId + "\" type=\"text\"/>";
    td3.innerHTML = "<SPAN class=minibuttonOff>" + m_UIFramework.GetTemplateVarValue("sAddItemLabel") + "</SPAN>";
   }
   
   //Setup an empty place holder for the Port Items
   
   //It's ashame we need to put the indentation here, instead of in eCfgRelationContentsJS.swt  
   portItemSpanId = tableId.replace (/PORT/, "PORTITEM");
                
   spanObj = document.getElementById ("SPAN_" + portItemSpanId);
   spanObj.innerHTML = "<table border=\"0\" cellpadding=\"0\" cellspacing=\"3\" width=\"100%\"></table>";   
   objArray = spanObj.getElementsByTagName ("table");
   tr = objArray[0].insertRow (-1);
   td1 = tr.insertCell (-1);
   td1.align = "center";
   td1.innerHTML = "<table id=\"" + portItemSpanId + "\"></table>";   
}

function showSelectAndOptionsSpanOnly (tableId)
{
   var buttonHTML             = "";
   var inputId                = "";
   var inputHTML              = "";
   var selectOptionHTML       = "";
   var tableObj               = null;
   var tr                     = null;   
   var resultPropSet          = null;
   var objArray               = null;
   var optionId               = "";
   var portPropSet            = null;
   var portDomainPropSet      = null;
   var portItemId             = "";  
   var portItemSpanId         = ""; 
   var nDomainLen             = 0;
   var i                      = 0;
   var selectId               = "";
   var spanObj                = null;
   var td1                    = null;
   var td2                    = null;
   var td3                    = null;  
     
   spanObj = document.getElementById ("SPAN_" + tableId);
   spanObj.innerHTML = "<table id=\"" + tableId + "\"></table>";

   tableObj = document.getElementById (tableId);
  
   resultPropSet = m_UIFramework.m_controlPropSet.GetChildByType (tableId);
   resultPropSet.SetProperty ("PortItemCount", "0");
      
   //Setup an empty place holder for the Port Items
   
   //It's ashame we need to put the indentation here, instead of in eCfgRelationContentsJS.swt  
   portItemSpanId = tableId.replace (/PORT/, "PORTITEM");
                
   spanObj = document.getElementById ("SPAN_" + portItemSpanId);
   spanObj.innerHTML = "<table border=\"0\" cellpadding=\"0\" cellspacing=\"3\" width=\"100%\"></table>";   
   objArray = spanObj.getElementsByTagName ("table");
   tr = objArray[0].insertRow (-1);
   td1 = tr.insertCell (-1);
   td1.align = "center";
   td1.innerHTML = "<table id=\"" + portItemSpanId + "\"></table>";   
}

//This function is used to show port item list, but not painting the quantity box
function showPortItemsWithoutQtyCtrl (rowId)
{
   var instancePropSet  = m_UIFramework.m_controlPropSet.GetChildByType (rowId);
   instancePropSet.SetProperty ("NoQtyCtrl", "Y");
   showPortItems (rowId);
}

//This function is called for each instance
function showPortItems (rowId)
{
   var comboAddId       = "";
   var i                = 0;
   var j                = 0;
   var nInstanceCount   = 0;
   var portItemCount    = 0;
   var spanObj          = null;
   var tableId          = "";
   var tableObj         = null;
   var trObj            = null;
   var type             = "";
   var strDynDisable	= "N";

   var instancePropSet  = m_UIFramework.m_controlPropSet.GetChildByType (rowId);
   var fieldListPropSet  = new JSSCfgPropertySet ();
   var strFieldList  = instancePropSet.GetProperty ("FieldList");
   fieldListPropSet.DecodeFromString (strFieldList);    
      
   tableId = instancePropSet.GetProperty ("Parent Path") + _underscore + "PORTITEM" + _pipe +
             instancePropSet.GetProperty ("Port Item Id");
   comboAddId = instancePropSet.GetProperty ("Parent Path") + _underscore + "PORT" + _pipe +
                instancePropSet.GetProperty ("Port Item Id"); 
      
   //the table for Port Items are already created.
   tableObj = document.getElementById (tableId);
                   
   comboAddPS = m_UIFramework.m_controlPropSet.GetChildByType (comboAddId);
   portItemCount = comboAddPS.GetProperty ("PortItemCount");
   if (portItemCount == "0")
   {
      //Set up the field headers
      trObj = tableObj.insertRow (-1);
      trObj.id = tableId + _underscore + "FIELDHEADER";
      displayFieldHeader (trObj, fieldListPropSet);    
   }
   portItemCount++;
   comboAddPS.SetProperty ("PortItemCount", portItemCount);             
   
   var domainPropSet = comboAddPS.GetChildByType ("Domain");
   strDynDisable = domainPropSet.GetProperty ("DynDisable");
   
   if(strDynDisable == "Y")
    instancePropSet.SetProperty ("DynDisable", "Y");          

   addPortItem (tableId, instancePropSet);
}

//This function is called for each instance
function showPortItemsNoHeader (rowId)
{
   var comboAddId       = "";
   var i                = 0;
   var j                = 0;
   var nInstanceCount   = 0;
   var portItemCount    = 0;
   var spanObj          = null;
   var tableId          = "";
   var tableObj         = null;
   var trObj            = null;
   var type             = "";
   var strDynDisable    = "N";

   var instancePropSet  = m_UIFramework.m_controlPropSet.GetChildByType (rowId);
   var fieldListPropSet  = new JSSCfgPropertySet ();
   var strFieldList  = instancePropSet.GetProperty ("FieldList");
   fieldListPropSet.DecodeFromString (strFieldList);    
      
   tableId = instancePropSet.GetProperty ("Parent Path") + _underscore + "PORTITEM" + _pipe +
             instancePropSet.GetProperty ("Port Item Id");
   comboAddId = instancePropSet.GetProperty ("Parent Path") + _underscore + "PORT" + _pipe +
                instancePropSet.GetProperty ("Port Item Id"); 
      
   //the table for Port Items are already created.
   tableObj = document.getElementById (tableId);
                   
   comboAddPS = m_UIFramework.m_controlPropSet.GetChildByType (comboAddId);
   portItemCount = comboAddPS.GetProperty ("PortItemCount");
   if (portItemCount == "0")
   {
      //Set up the field headers
      //trObj = tableObj.insertRow (-1);
      //trObj.id = tableId + _underscore + "FIELDHEADER";
      //displayFieldHeader (trObj, fieldListPropSet);    
   }
   portItemCount++;
   comboAddPS.SetProperty ("PortItemCount", portItemCount);             

   var domainPropSet = comboAddPS.GetChildByType ("Domain");
   strDynDisable = domainPropSet.GetProperty ("DynDisable");
   
   if(strDynDisable == "Y")
   instancePropSet.SetProperty ("DynDisable", "Y");             
   
   addPortItem (tableId, instancePropSet);
}

function showCheckBox (grpItemId)
{
   showDomainAndChildrenControl (grpItemId, "checkbox");
}

// This function is designed to show port domain checkbox in grid layout. 
function showCheckBoxGrid (grpItemId)
{
   var resultPropSet = m_UIFramework.m_controlPropSet.GetChildByType (grpItemId);
   resultPropSet.SetProperty ("GridLayout", "Y");
   showDomainAndChildrenControl (grpItemId, "checkbox");
}

function showDomainAndChildrenControl (grpItemId, controlType)
{	
   var noneSelected = "Y";
   var portItemId   = "";
   var rowType      = _underscore + "PROD" + _pipe;
   var tableObj;
   var tr;
   var td;
   var i, j, nDomainLen;
   
   spanObj = document.getElementById ("SPAN_" + grpItemId);
   spanObj.innerHTML = "<table id=\"" + grpItemId + "\"></table>";
 
   tableObj = document.getElementById (grpItemId);

   var resultPropSet = m_UIFramework.m_controlPropSet.GetChildByType (grpItemId);
   var portPropSet = resultPropSet.GetChildByType ("Domain");
   var fieldListPropSet  = new JSSCfgPropertySet ();
   var strFieldList  = resultPropSet.GetProperty ("FieldList");

   // For general layout, each tr represents one domain item. 
   // for gridlayout, we enclose the original tr cell to a table, append the new table object to td, 
   //   and then arrange iCtrlNumofCol number of td to each row to achieve grid layout. 
   var gridLayout       = resultPropSet.GetProperty ("GridLayout");
   var iCtrlNumofCol    = 1; //The number of columns to show domain items in the grid table
   var cellTableObj     = null;
   var gridTR           = null;
   var gridTD           = null;
   var domainCount      = 0;
   
   fieldListPropSet.DecodeFromString (strFieldList);    
   nDomainLen = portPropSet.GetChildCount();
   
   var dynReadOnly = portPropSet.GetProperty ("DynDisable");
   var dynChangeImage = portPropSet.GetProperty ("ChangeImage");
   var dynParentpath = portPropSet.GetProperty ("Parent Path");
   var dynPortItemId = portPropSet.GetProperty ("Port Item Id");
   
   if (dynChangeImage == "Y" )
   {
    var imgId = "img_" + dynParentpath + "_" + dynPortItemId;
    var newImage = portPropSet.GetProperty ("DynNewImage");
    var imgObj = document.getElementById(imgId);
    imgObj.src = newImage;
   }
   
   //Insert the field header
   if (gridLayout != "Y")
   {
      tr = tableObj.insertRow (-1);
      if (controlType != "quantity")
      {
         td = tr.insertCell (-1);
         td.innerHTML = m_UIFramework.whiteImage;
      }
      displayFieldHeader (tr, fieldListPropSet);
   }   
   else
   {
      var sCtrlNumofCol = portPropSet.GetProperty (".CtrlNumofCol");
      iCtrlNumofCol = parseInt (sCtrlNumofCol);
      
      if (isNaN (iCtrlNumofCol) || iCtrlNumofCol < 1)      
         iCtrlNumofCol = 1;
   }
         
   if (controlType == "radio")
   {
      //Add a slot for "none" option
      //I'm only adding the row here.
      //The contents of the row is contructed after the for loop below.
      //The reason is so that we know whether or not to check the "none"
      //I could also do "tableObj.insertRow (-1) at the end, but according to MSDN, this is
      //more expensive
      
      if (gridLayout == "Y")
      {
         gridTR = tableObj.insertRow (-1);
         gridTD = gridTR.insertCell (-1);
         cellTableObj = document.createElement("table");
         gridTD.appendChild (cellTableObj);
         domainCount++;
         
         tr = cellTableObj.insertRow (-1);      
      }
      else
      {
         tr = tableObj.insertRow (-1);
      }
      
      portItemId = portPropSet.GetProperty ("Port Item Id");
      strRowId = grpItemId + rowType + "none";
      tr.id = strRowId;      
   }        
                 
   for (i = 0; i < nDomainLen; i++)
   {
      var className        = "";
      var displayName      = "";   
      var DispStyle        = "";
      var enable           = "";   
      var hasGeneric       = "";  
      var excluded         = ""; 
      var innerHTML        = ""; 
      var isChecked        = "";      
      var quantity         = "";      
      var path             = "";      
      var prodId           = "";
      var selected         = "";
      var strRowId         = "";
      var strSpanId        = "";
      
      //Default values for the Display Style
      if (controlType == "checkbox" ||
          controlType == "quantity")
          DispStyle = 'eCfgSpanAvailable';
      else if (controlType == "radio")
          DispStyle = 'eCfgRadioAvailable';
            
      //These are the possible "default" values that we need to show a port domain/item
      portDomainPropSet = portPropSet.GetChild(i);
      excluded = portDomainPropSet.GetProperty ("Excluded");        
      prodId = portDomainPropSet.GetProperty("Product Id");
      portItemId = portDomainPropSet.GetProperty("Port Item Id");
      displayName = portDomainPropSet.GetProperty("CxObjName");
      enable = portDomainPropSet.GetProperty ("CxEnabled");
      selected = portDomainPropSet.GetProperty ("Selected");
      quantity = portDomainPropSet.GetProperty ("Quantity");
      hasGeneric = portDomainPropSet.GetProperty ("RequireMoreChild");
      //isComplex = portDomainPropSet.GetProperty ("IsComplexProduct");           
      
      var dynReadOnlyAlone = portDomainPropSet.GetProperty ("DynDisable"); 
      var dynDisabled;     
      
      if(dynReadOnly == "Y" || dynReadOnlyAlone == "Y")
       dynDisabled = "disabled";
	  else
	   dynDisabled = "";
       
      if (isNaN (quantity))
         quantity = "";
      path = portDomainPropSet.GetProperty ("Path");

      if (gridLayout == "Y")
      {
         if (domainCount % iCtrlNumofCol == 0)
         {
            gridTR = tableObj.insertRow (-1);
         }

         gridTD = gridTR.insertCell (-1);
         
         cellTableObj = document.createElement("table");         
         gridTD.appendChild (cellTableObj);      
         domainCount++;
         
         tr = cellTableObj.insertRow (-1);      
      }
      else
      {
         tr = tableObj.insertRow (-1);
      }
      
      strRowId = grpItemId + _underscore + "PROD" + _pipe + prodId;
      tr.id = strRowId;
      if (excluded == "Y" && enable == "N" && selected != "Y")
         tr.style.display = "none";
           
      if (selected == "Y" )
      {
         if (controlType == "checkbox" ||
            controlType == "quantity")
            DispStyle = 'eCfgSpanSelected';
         else if (controlType == "radio")
         {
            DispStyle = 'eCfgRadioSelected';
            noneSelected = "N";
         }
      }
      else
      {
         if (enable == "N" )
         {
            if (controlType == "checkbox" ||
               controlType == "quantity")
               DispStyle = 'eCfgSpanExcluded';
            else if (controlType == "radio")
               DispStyle = 'eCfgRadioExcluded';   
         }
      }          
                  
      //1. Display the first column for this control
      //   If it's a radio button: display radio button
      //   If it's a quantity list: display a quantity box
      //   If it's a checkbox: display a checkbox
      td = tr.insertCell (-1);           
      if (controlType == "quantity")
      {
         td.id = strRowId + _underscore + "FIELD" + _pipe + "Quantity";
         addHtmlAttrib (fieldListPropSet, "Quantity", td);    
             
        if(dynReadOnly == "Y" || dynReadOnlyAlone == "Y")
        innerHTML =  innerHTML + 
                    "<input STYLE= \"background-color:#C0C0C0\" type=\"text\" readonly" + " id=" + td.id + "_INPUT" + " TABINDEX=\"99\"" + " STYLE=\"width:3.75em\"" + " value=\"" + quantity +
                    "\" onchange='processInput(\"GRPITEM" + _pipe + grpItemId + _underscore + "PROD" + _pipe + 
				                                    prodId + "\", \"\", \"text\")'>" +
                    "</input>";   
        else
         innerHTML =  innerHTML + 
                      "<input type=\"text\"" + " id=" + td.id + "_INPUT" + " TABINDEX=\"99\"" + " STYLE=\"width:3.75em\"" + " value=\"" + quantity +
                      "\" onchange='processInput(\"GRPITEM" + _pipe + grpItemId + _underscore + "PROD" + _pipe + 
				                                       prodId + "\", \"\", \"text\")'>" +
                      "</input>";   

      }
      else if (controlType == "checkbox" ||
               controlType == "radio")
      {  
         if (selected == "Y")
            isChecked = " checked>";
         else
            isChecked = ">";
            
         td.id = strRowId + _underscore + "FIELD" + _pipe + "Quantity";
         innerHTML = innerHTML + 
                     "<input type=\"" + controlType + "\" name=\"GRPITEM" + _pipe + grpItemId + _underscore + "DOMAIN\"" +
                     " onclick='processInput(\"GRPITEM" + _pipe + grpItemId + _underscore + "PROD" + _pipe + prodId + 
                     "\", \"\", \"" + controlType + "\")'" + dynDisabled +
                     isChecked + "</input>"; 
      }
      
      td.innerHTML = innerHTML;   

      //2. Display the second column in this control.
      //   For all types of controls, this would be the name of the product.     
      td = tr.insertCell (-1);
      addHtmlAttrib (fieldListPropSet, "Name", td);  
      
      strSpanId = grpItemId + _underscore + "PORTDOMAIN" + _pipe + prodId;
      innerHTML = "<span id=\"" + strSpanId + "\" class=\"" + DispStyle + "\">";

      if (selected == "Y" && portDomainPropSet.GetProperty ("CanDrillDown") == "Y")
      {
         innerHTML = innerHTML + "<a id=\"" + strSpanId + _underscore + "CXLINK\" href='javascript:processInput(\"GRPITEM" + _pipe + grpItemId + _underscore + "PROD" + _pipe + prodId + "\", \"SetTopObj\", \"linkMethod\")'>";
      }
      innerHTML += displayName;

      if (selected == "Y" && portDomainPropSet.GetProperty ("CanDrillDown") == "Y")
         innerHTML += "</a>";
      innerHTML += "</span>";

      td.innerHTML = innerHTML;
      addGenerics (resultPropSet, td, path, hasGeneric);      

      //3. Display the field list
      displayFieldList (tr, rowType, resultPropSet.GetType (), fieldListPropSet, portDomainPropSet, false);
   }	
 
   if (controlType == "radio")
   {  
      //Add none option
      portItemId = portPropSet.GetProperty ("Port Item Id"); 
      strRowId = grpItemId + rowType + "none";
      tr = document.getElementById (strRowId);
      var dynDisabled;
      
      if (tr != null || bCFG_uiJsDebug)
      {
         td = tr.insertCell (-1);    
         td.id = strRowId + _underscore + "FIELD" + _pipe + "Quantity";
         
		   if (noneSelected == "Y")
            isChecked = " checked>";  
         else
            isChecked = " >";
                  
         // BUG-10606183: for the "none" radio control, invoke processInputRadioNoneAction instead of processInput
         innerHTML =  "<input type=\"" + controlType 
                     + "\" name=\"GRPITEM" + _pipe + grpItemId + _underscore + "DOMAIN\""
                     + " onclick='processInputRadioNoneAction(\"GRPITEM" + _pipe + grpItemId + _underscore + "PROD" + _pipe 
				         + "none" + "\", \"\", \""
		             + controlType + "\")'" + dynDisabled + isChecked
		               + "</input>";      
         td.innerHTML = innerHTML;
         
         td = tr.insertCell (-1);
         addHtmlAttrib (fieldListPropSet, "Name", td);  
         td.innerHTML = "None";
      }
   } 			  
}


function showQuantityList (grpItemId)
{	  
   showDomainAndChildrenControl (grpItemId, "quantity");				  
}

function showRadio (grpItemId)
{
   var resultPropSet = m_UIFramework.m_controlPropSet.GetChildByType (grpItemId);
   var objType = resultPropSet.GetProperty ("Object Type");
   var gridLayout = resultPropSet.GetProperty ("GridLayout");

   if (objType == "Port")
   { 
      showDomainAndChildrenControl (grpItemId, "radio");
   }
   else if (objType == "Attribute")
   {
      var spanObj          = document.getElementById ("SPAN_" + grpItemId);
      
      spanObj.innerHTML = "<table id=\"" + grpItemId + "\"></table>";
      var tableObj = document.getElementById (grpItemId);

      var attType = resultPropSet.GetProperty ("AttType");
      var attId   = resultPropSet.GetProperty ("XA Id");
      var attName = resultPropSet.GetProperty ("AttName");
      var selectedAtt = resultPropSet.GetProperty ("AttValue");

      var attPropSet = resultPropSet.GetChildByType ("Domain");
      var nDomainLen = attPropSet.GetChildCount();
      
      var dynChangeImage = attPropSet.GetProperty ("ChangeImage");
      var dynReadOnly = attPropSet.GetProperty ("DynDisable");   
      var dynParentpath = attPropSet.GetProperty ("Parent Path");
      var dynPortItemId = attPropSet.GetProperty ("Port Item Id");
      
      if (dynChangeImage == "Y" )
      {
       var dynParentpath = attPropSet.GetProperty ("Parent Path");
       var dynAttId = attPropSet.GetProperty ("AttID");
       var imgId = "img_" + dynParentpath + "_" + dynAttId;
       var newImage = attPropSet.GetProperty ("DynNewImage");
       var imgObj = document.getElementById(imgId);
       imgObj.src = newImage;
       }

      // For general layout, each tr represents one domain item. 
      // for gridlayout, we enclose the original tr cell to a table, append the new table object to td, 
      //   and then arrange iCtrlNumofCol number of td to each row to achieve grid layout.
      var cellTableObj  = null;
      var gridTR        = null;
      var gridTD        = null;
      var iCtrlNumofCol = 1;

      if (gridLayout == "Y")
      {
         var sCtrlNumofCol = resultPropSet.GetProperty (".CtrlNumofCol");
         iCtrlNumofCol = parseInt (sCtrlNumofCol);
         if (isNaN (iCtrlNumofCol) || iCtrlNumofCol < 1)      
            iCtrlNumofCol = 1;            
      }
      
      for (var i = 0; i < nDomainLen; i++)
      {
         var innerHTML = "";
         var isChecked = "";
         var attValue  = "";
         var enable    = "";
         var excluded  = "";
         var selected  = "";
         var DispStyle = 'eCfgRadioAvailable';
         var strSpanId = "";
      
         var attDomainPropSet = attPropSet.GetChild(i);
         var tr               = null;

         attValue = attDomainPropSet.GetProperty("AttValue");
         enable = attDomainPropSet.GetProperty ("CxEnabled");
         selected = attDomainPropSet.GetProperty ("Selected");
         excluded = attDomainPropSet.GetProperty ("Excluded");                
         var dynReadOnlyAlone = attDomainPropSet.GetProperty ("DynDisable"); 
         var dynDisabled;   
         
         if(dynReadOnly == "Y" || dynReadOnlyAlone == "Y")
          dynDisabled = "disabled";
		 else
		  dynDisabled = "";                
   
         if (gridLayout == "Y")
         {
            if (i % iCtrlNumofCol == 0)
               gridTR = tableObj.insertRow (-1);
            
            gridTD = gridTR.insertCell (-1);
            cellTableObj = document.createElement("table");
            gridTD.appendChild (cellTableObj);         
               
            tr = cellTableObj.insertRow (-1);         
         }
         else
         {
            tr = tableObj.insertRow (-1);
         }
                  
         strSpanId = grpItemId + _underscore + "ATTVAL" + _pipe + attValue;
         tr.id = strSpanId;

         if (excluded == "Y" && enable == "N")
            tr.style.display = "none";
                    
         if (selected == "Y" )
         {
            DispStyle = 'eCfgRadioSelected';
         }
         else
         {
            if (enable == "N" )
               DispStyle = 'eCfgRadioExcluded';   
         }                      

         var td = tr.insertCell (-1);
         td.id = strSpanId + _underscore + "FIELD" + _pipe + "Input";
         
         strSpanId = grpItemId + _underscore + "ATTRDOMAIN" + _pipe + attValue;
         if (selected == "Y")
            isChecked += " checked>";
         else
            isChecked += ">";
                     
         innerHTML =  "<input type=\"" + "radio\"" +
                      " onclick='processInput(\"GRPITEM" + _pipe + grpItemId + _underscore + "ATTID" + _pipe + 
				          attId + _underscore + "ATTVAL" + _pipe + attValue + _underscore + "ATTTYPE" + _pipe + attType + 
                      "\", \"\", \"radio\")'" + dynDisabled +
                      isChecked + 
                      "<span id=\"" + strSpanId + "\" class=\"" + DispStyle + "\">" + HtmlEncode(attValue) + "</span></input>";

         td.innerHTML = innerHTML;
      }
   }
}

// This function is designed to show port domain or attribute domain radio button in grid layout. 
function showRadioGrid (grpItemId)
{
   var resultPropSet = m_UIFramework.m_controlPropSet.GetChildByType (grpItemId);
   resultPropSet.SetProperty ("GridLayout", "Y");
   showRadio (grpItemId);
}

// This function is designed to show the text box as a read-only field. 
// It's mainly for attributes with Business Component Domains
function showReadOnlyTextBox (grpItemId)
{
   showTextBox (grpItemId);
   
   var spanObj = document.getElementById (grpItemId);
   (spanObj.getElementsByTagName ("input"))[0].readOnly = true;
   (spanObj.getElementsByTagName ("input"))[0].style.background = "#f0f0f0";
}

function showTextBox (grpItemId)
{
   var spanObj = document.getElementById (grpItemId);
   var textBoxPropSet = m_UIFramework.m_controlPropSet.GetChildByType (grpItemId);
   var objType = textBoxPropSet.GetProperty ("Object Type", objType);
              
   if (objType == "Attribute")
   {      
      var innerHTML;
      var displayValue = textBoxPropSet.GetProperty ("Value");
      var readOnly = textBoxPropSet.GetProperty ("CxReadOnly");      
      var dynReadOnly = textBoxPropSet.GetProperty ("DynDisable");   
      
      // added the following piece of code for FR#12-139DIHA
      if (displayValue.length > 0){
         displayValue = displayValue.replace(/\"/g, "&quot;"); 
      }
  
      var dynChangeImage = textBoxPropSet.GetProperty ("ChangeImage");      
      if (dynChangeImage == "Y" )
      {
       var dynParentpath = textBoxPropSet.GetProperty ("Parent Path");
       var dynAttId = textBoxPropSet.GetProperty ("AttID");
       var imgId = "img_" + dynParentpath + "_" + dynAttId;
       var newImage = textBoxPropSet.GetProperty ("DynNewImage");
       var imgObj = document.getElementById(imgId);
       imgObj.src = newImage;
      }
  
      if (readOnly == "Y")
         innerHTML = displayValue;
      else if(dynReadOnly == "Y")
         innerHTML = "<input STYLE= \"background-color:#C0C0C0\" type=\"text\" readonly " +
                     "value=\"" + displayValue + "\" " +
                     "id=\"GRPITEM" + _pipe + grpItemId +
                     _underscore + "ATTTYPE" + _pipe + "TEXT" +
				     "\"" + " onchange='processInput(\"GRPITEM" + _pipe + grpItemId + 
				     _underscore + "ATTTYPE" + _pipe + "TEXT" +
				     "\", \"\", \"text\")' />";   

      else      
         innerHTML = "<input type=\"text\" " +
                     "value=\"" + displayValue + "\" " +
                     "id=\"GRPITEM" + _pipe + grpItemId +
                     _underscore + "ATTTYPE" + _pipe + "TEXT" +
				     "\"" + " onchange='processInput(\"GRPITEM" + _pipe + grpItemId + 
				     _underscore + "ATTTYPE" + _pipe + "TEXT" +
				     "\", \"\", \"text\")' />";
				     
	   if (textBoxPropSet.GetProperty("EditField") == "Y")
	   {
	      var attId = textBoxPropSet.GetProperty ("AttID");
	      
	      m_UIFramework.InitIconLabel ();
	      
         innerHTML += "<a href='javascript:m_UIFramework.EditField(\"" + grpItemId + "\", \"Attribute\", \"\", \"\")' />" +
                     m_UIFramework.editFieldIcon +
                     "</a>";   
	   }				   
	   spanObj.innerHTML = innerHTML;				     
   }
}

function showCombo (grpItemId)
{      
   var dispStyle     = "";
   var displayValue  = "";   
   var enabled       = "";   
   var nDomainLen    = 0;  
   var selectId      = "select_" + grpItemId; 
   var selectedIndex = -1;
   var selectedTag   = "";   
   var selectOptionHTML = "";
   var spanId        = "";
   var tr            = null;
   var td            = null;

   var id = grpItemId + _underscore + "DOMAINSELECT"; 
   var comboPropSet = m_UIFramework.m_controlPropSet.GetChildByType (grpItemId);
   var objType = comboPropSet.GetProperty ("Object Type", objType);
   var fieldListPropSet  = new JSSCfgPropertySet ();
   var strFieldList  = comboPropSet.GetProperty ("FieldList");
   fieldListPropSet.DecodeFromString (strFieldList);    
   
   var spanObj = document.getElementById ("SPAN_" + grpItemId);
   spanObj.innerHTML = "<table id=\"" + grpItemId + "\"></table>";

   tableObj = document.getElementById (grpItemId);

   if (objType == "Port")
   {
      var portId = (comboPropSet.GetChildByType ("Domain")).GetProperty ("Port Item Id");
      var noneId = grpItemId + _underscore + "PORTDOMAIN" + _pipe + "none";  
      var portPropSet = comboPropSet.GetChildByType ("Domain");
      var dynReadOnly = portPropSet.GetProperty ("DynDisable");
      var readOnlyVal = "";
      nDomainLen = portPropSet.GetChildCount (); 
      
      var dynChangeImage = "N";
      dynChangeImage = portPropSet.GetProperty ("ChangeImage");
         
      if (dynChangeImage == "Y" )
      {
       var dynParentpath = portPropSet.GetProperty ("Parent Path");
       var dynPortItemId = portPropSet.GetProperty ("Port Item Id");
       var imgId = "img_" + dynParentpath + "_" + dynPortItemId;
       var newImage = portPropSet.GetProperty ("DynNewImage");
       var imgObj = document.getElementById(imgId);
       imgObj.src = newImage;
       }
      
      if (dynReadOnly == "Y")
         readOnlyVal = "disabled";
      else
         readOnlyVal = "";         
      
      //1.Insert the combo box control
      
      //Insert the field header
      tr = tableObj.insertRow (-1);
      displayFieldHeader (tr, fieldListPropSet);
      
      tr = tableObj.insertRow (-1);
      tr.id = grpItemId + _underscore + "COMBOBOX";
      td = tr.insertCell (-1);
      td.id = grpItemId + _underscore + "COMBOBOX_TD";
      addHtmlAttrib (fieldListPropSet, "Name", td);
         
      selectOptionHTML = "<select id=\"" + id + "\" onchange='processInput(\"" + id +
						 "\", \"\", \"select\")' " + readOnlyVal + ">" +
                         //Add an empty option        
                         "<option value=" + "\"" + "GRPITEM" + _pipe + grpItemId + _underscore + "PROD" + _pipe + "none" + 
                         "\" id =\"" + noneId + "\" class=\"" + "eCfgOptionAvailable" + "\" >" +  "" + "</option>";
  
      for (var i = 0; i < nDomainLen; i++)
      {
         var excluded            = "";
         var portDomainPropSet   = portPropSet.GetChild (i);   
         var portId              = "";
         var prodId              = "";   
         var selected            = ""; 
         
         excluded = portDomainPropSet.GetProperty ("Excluded");
         displayValue = portDomainPropSet.GetProperty("CxObjName");         
         selected = portDomainPropSet.GetProperty ("Selected");         
         enabled = portDomainPropSet.GetProperty ("CxEnabled");
         prodId = portDomainPropSet.GetProperty("Product Id");
         portId = portDomainPropSet.GetProperty("Port Item Id");         
           
         if (selected == "Y")
         {
            selectedTag = " selected";
            selectedIndex = i;
            dispStyle = "eCfgOptionAvailable";
         }
         else
         {
            selectedTag = "";    
            if (enabled == "Y")
               dispStyle = "eCfgOptionAvailable";
            else
               dispStyle = "eCfgOptionExcluded";   
         }                 
            
         if (excluded != "Y" || enabled == "Y")
         {
            spanId = grpItemId + _underscore + "PORTDOMAIN" + _pipe + prodId;         
            selectOptionHTML = selectOptionHTML +
                               "<option id=\"" + spanId + "\" value=" + "\"" + "GRPITEM" + _pipe + grpItemId + 
		                         _underscore + "PROD" + _pipe + prodId +  
		                         "\" class=\"" + dispStyle + "\" " + selectedTag + ">" + displayValue + "</option>";
         }		                       
      }
      
      selectOptionHTML += "</select>";
      td.innerHTML = selectOptionHTML;
           
      //3. Display Red Star and field lists
           
      if (selectedIndex != -1)
      {
         portDomainPropSet = portPropSet.GetChild (selectedIndex);
         var hasGeneric = portDomainPropSet.GetProperty ("RequireMoreChild");
         var path = portDomainPropSet.GetProperty ("Path");

         addGenerics (comboPropSet, td, path, hasGeneric);      
         displayQtyInCombo (tr, comboPropSet.GetType (), fieldListPropSet, portDomainPropSet,dynReadOnly);
         displayFieldList (tr, _underscore + "PROD" + _pipe, comboPropSet.GetType (), fieldListPropSet, portDomainPropSet, "N"); 
      }  
      else
      {
         addGenerics (comboPropSet, td, path, "N");      
         displayQtyInCombo (tr, comboPropSet.GetType (), fieldListPropSet, null,dynReadOnly);
         displayFieldList (tr, _underscore + "PROD" + _pipe, comboPropSet.GetType (), fieldListPropSet, null, "N");                 
      }
   }
   else if (objType == "Attribute")
   {
      var readOnlyVal   = "";
      var spanId        = "";

      var attType = comboPropSet.GetProperty ("AttType");
      var attId   = comboPropSet.GetProperty ("XA Id");
      var selectedAtt = comboPropSet.GetProperty ("AttValue");
      var readOnly = comboPropSet.GetProperty ("CxReadOnly");
      var attPropSet = comboPropSet.GetChildByType ("Domain");
      var dynReadOnly = comboPropSet.GetProperty ("DynDisable");
      nDomainLen = attPropSet.GetChildCount ();      

      var dynChangeImage = attPropSet.GetProperty ("ChangeImage");
         
      if (dynChangeImage == "Y" )
      {
   	   var dynParentpath = attPropSet.GetProperty ("Parent Path");
   	   var dynAttId = attPropSet.GetProperty ("AttID");
       var imgId = "img_" + dynParentpath + "_" + dynAttId;
       var newImage = attPropSet.GetProperty ("DynNewImage");
       var imgObj = document.getElementById(imgId);
       imgObj.src = newImage;	       
      }     

      tr = tableObj.insertRow (-1);
      tr.id = grpItemId + _underscore + "COMBOBOX";
      td = tr.insertCell (-1);
      td.id = grpItemId + _underscore + "COMBOBOX_TD";

      if (readOnly == "Y" || dynReadOnly == "Y")
         readOnlyVal = "disabled";
      else
         readOnlyVal = "";

      selectOptionHTML = "<select id=\"" + id + "\" onchange='processInput(\"" + id 
							+ "\", \"\", \"select\")' " + readOnlyVal + ">";
      
      for (var i = 0; i < nDomainLen; i++)
      {
         var excluded = "";         
         var attDomainPropSet = attPropSet.GetChild (i);
         // BUG#10604885: create a variable compareValue to perform selected value comparison since the stored value
         // for attrType = Text is the LocValue, but for Number & Integer are LicValue.
         var compareValue = attDomainPropSet.GetProperty ("AttValueLIC");

         displayValue = attDomainPropSet.GetProperty ("AttValue");
         excluded = attDomainPropSet.GetProperty ("Excluded");
       
         // BUG#10604885: If attType is Number or Integer, use the LIC value to perform comparison, otherwise use displayValue
         if (attType != "Number" && attType != "Integer")
            compareValue = displayValue;

         // BUG# 16884325: roll back changes in 10604885, use displayValue instead of LIC
         if (displayValue == selectedAtt)
         //if (compareValue == selectedAtt)
            selectedTag = " selected";
         else
            selectedTag = "";

         enabled = attDomainPropSet.GetProperty ("CxEnabled");

         if (enabled == "Y")
            dispStyle = "eCfgOptionAvailable";
         else
            dispStyle = "eCfgOptionExcluded";

         if (excluded != "Y" || enabled == "Y")
         {          
            // added the following piece of code for FR# 12-1BVCBJR
            var AttrIdDisplay = displayValue;
            if (AttrIdDisplay.length > 0)
               AttrIdDisplay = AttrIdDisplay.replace(/\"/g,"&quot;");
               
            spanId = grpItemId + _underscore + "ATTRDOMAIN" + _pipe + AttrIdDisplay; 
                  
            selectOptionHTML = selectOptionHTML + 
                               "<option id=\"" + spanId + "\" value=" + "\"" + "GRPITEM" + _pipe + grpItemId + 
		                         _underscore + "ATTTYPE" + _pipe + attType + 
		                         _underscore + "ATTVAL" + _pipe + AttrIdDisplay + 
		                         "\" class=\"" + dispStyle + "\" "+ selectedTag + ">" + HtmlEncode(displayValue) + "</option>";
         }		                        
      }
      
      selectOptionHTML += "</select>";
      
      td.innerHTML = selectOptionHTML;
   }    
}

function showReadOnlyText (grpItemId)
{
   var spanObj = document.getElementById ("GRPITEM" + _pipe + grpItemId);  
   spanObj.innerHTML = (m_UIFramework.m_controlPropSet.GetChildByType (grpItemId)).GetProperty ("Value");
}

function canShowCfgTip ()
{
   var ie = (navigator.appName.indexOf ("Microsoft") > -1) && ((parseInt (navigator.appVersion) >= 3) ? true : false );
   
   if (ie)
      return true;
   else 
      return false;
}

function closeCfgTip ()
{
   var tObj = document.getElementById ("CfgTip");
   if (typeof (tObj) != "undefined" && tObj != null)
   {
      tObj.innerHTML = "";
      tObj.style.visibility = "hidden";
   }
}

function cfgDisplayTip ()
{  
   showModelessDialog("cfgDlg.html",window,"status:no;edge:raised;scroll:yes;help:no;resizable:yes;dialogWidth:300px;dialogHeight:150px;unadorned:yes");
}

function showAllMsgDlg ()
{ 
   var table1 = document.getElementById ("CfgMsgSig");
   var table2 = document.getElementById ("CfgMsgEC");
   var table3 = document.getElementById ("CfgMsgCPVE");
   var table4 = document.getElementById ("CfgMsgProceedActions");
   var i = 0;
   
   var tObj = document.getElementById ("CfgTip");  
   var innerHTML = "<table>";
   for (i = 0; typeof (table1) != "undefined" && table1 != null && i < table1.rows.length; i++)
   {
      innerHTML += "<tr>";
      innerHTML += table1.rows[i].innerHTML;
      innerHTML += "</tr>";
   }
   for (i = 0; typeof (table2) != "undefined" && table2 != null && i < table2.rows.length; i++)
   {
      innerHTML += "<tr>";
      innerHTML += table2.rows[i].innerHTML;
      innerHTML += "</tr>";
   }
   for (i = 0; typeof (table3) != "undefined" && table3 != null && i < table3.rows.length; i++)
   {
      innerHTML += "<tr>";
      innerHTML += table3.rows[i].innerHTML;
      innerHTML += "</tr>";
   }      
   for (i = 0; typeof (table4) != "undefined" && table4 != null && i < table4.rows.length; i++)
   {
      innerHTML += "<tr>";
      innerHTML += table4.rows[i].innerHTML;
      innerHTML += "</tr>";
   }      

   innerHTML += "</table>";
   tObj.innerHTML = innerHTML;
   
   cfgDisplayTip (); 
}

function showAllMsg ()
{
   var table1 = document.getElementById ("CfgMsgSig");
   var table2 = document.getElementById ("CfgMsgEC");
   var table3 = document.getElementById ("CfgMsgCPVE");
   var table4 = document.getElementById ("CfgMsgProceedActions");
   var i = 0;

   for (i = 0; typeof (table1) != "undefined" && table1 != null && i < table1.rows.length; i++)
      table1.rows[i].style.display = "";
   for (i = 0; typeof (table2) != "undefined" && table2 != null && i < table2.rows.length; i++)
      table2.rows[i].style.display = "";
   for (i = 0; typeof (table3) != "undefined" && table3 != null && i < table3.rows.length; i++)
      table3.rows[i].style.display = ""; 
   for (i = 0; typeof (table4) != "undefined" && table4 != null && i < table4.rows.length; i++)
      table4.rows[i].style.display = ""; 
   
   var lessBtn = document.getElementById ("CfgLessBtn");
   lessBtn.style.display = "";
}

function showLessMsg ()
{
   var table1 = document.getElementById ("CfgMsgSig");
   var table2 = document.getElementById ("CfgMsgEC");
   var table3 = document.getElementById ("CfgMsgCPVE");
   var table4 = document.getElementById ("CfgMsgProceedActions");
   var i = 0;

   for (i = 0; typeof (table1) != "undefined" && table1 != null && i < table1.rows.length; i++)
      table1.rows[i].style.display = "none";
   for (i = 0; typeof (table2) != "undefined" && table2 != null && i < table2.rows.length; i++)
      table2.rows[i].style.display = "none";
   for (i = 0; typeof (table3) != "undefined" && table3 != null && i < table3.rows.length; i++)
      table3.rows[i].style.display = "none"; 
   for (i = 0; typeof (table4) != "undefined" && table4 != null && i < table4.rows.length; i++)
      table4.rows[i].style.display = "none"; 
      
   m_UIFramework.m_curMsg = 0;
   arrangeMsg (); 
   
   var lessBtn = document.getElementById ("CfgLessBtn");
   lessBtn.style.display = "none";   
}

function showLink (id)
{
   var childPropSet     = null;
   var linkHTML         = "";   
   var spanId           = "GRPITEM" + _pipe + id;   

   var spanObj = document.getElementById (spanId);

   childPropSet = m_UIFramework.m_controlPropSet.GetChildByType (id);
   if (childPropSet != null)
   {
      var type        = childPropSet.GetProperty ("Type");
      var dispValue   = childPropSet.GetProperty ("Value");
      var methodName  = childPropSet.GetProperty ("Method");
      var enabled     = childPropSet.GetProperty ("Enabled");
              
      if (enabled == "Y")
      {
         linkHTML = "<a id=\"" + spanId + _underscore + "LINK" + "\" href='JavaScript:processInput(\"GRPITEM" + _pipe + id + "\", \"" + methodName + "\",\"linkMethod\")'>" +
                  dispValue + "</a>";
                  
         if (type == "MiniButton")
            spanObj.className = "minibuttonOn";                  
      }
      else
      {
         linkHTML = dispValue;
         if (type == "MiniButton")
            spanObj.className = "minibuttonOff";           
      }        
      
      spanObj.innerHTML = linkHTML;
   }   
}

function prevMsg ()
{
   var i             = 0;
   var j             = m_UIFramework.m_curMsg + m_UIFramework.m_maxMsg;
   
   var table1 = document.getElementById ("CfgMsgSig");
   var table2 = document.getElementById ("CfgMsgEC");
   var table3 = document.getElementById ("CfgMsgCPVE");
   var table4 = document.getElementById ("CfgMsgProceedActions");
   var t2OffSet = 0;                   
   var t3OffSet = 0;
   var t4OffSet = 0;
   if (table1 != null)
      t2OffSet = table1.rows.length;
      t3OffSet = t2OffSet;
      t4OffSet = t3OffSet;
   if (table2 != null)
      t3OffSet += table2.rows.length;
      t4OffSet = t3OffSet;
   if (table3 != null)
      t4OffSet += table3.rows.length;
         
   for (i = (m_UIFramework.m_curMsg - m_UIFramework.m_maxMsg); i < m_UIFramework.m_curMsg; i++)
   {
      if (table1 != null && table1.rows.length > i)
         table1.rows[i].style.display = "";
      else if (table2 != null && (table2.rows.length + t2OffSet) > i)
         table2.rows[i-t2OffSet].style.display = "";
      else if (table3 != null && (table3.rows.length + t3OffSet) > i)
         table3.rows[i-t3OffSet].style.display = "";
      else if (table4 != null && (table4.rows.length + t4OffSet) > i)
         table4.rows[i-t4OffSet].style.display = "";
   }  
   
   for (i = m_UIFramework.m_curMsg; i < j; i++)
   {
      if (table1 != null && table1.rows.length > i)
         table1.rows[i].style.display = "none";
      else if (table2 != null && (table2.rows.length + t2OffSet) > i)
         table2.rows[i-t2OffSet].style.display = "none";
      else if (table3 != null && (table3.rows.length + t3OffSet) > i)
         table3.rows[i-t3OffSet].style.display = "none";
      else if (table4 != null && (table4.rows.length + t4OffSet) > i)
         table4.rows[i-t4OffSet].style.display = "none";
   }     
     
   m_UIFramework.m_curMsg = m_UIFramework.m_curMsg - m_UIFramework.m_maxMsg;
   updatePrevNextMsg ();
}

function nextMsg ()
{
   var i             = 0;
   var j             = m_UIFramework.m_curMsg + m_UIFramework.m_maxMsg;
   var k             = m_UIFramework.m_curMsg + 2 * m_UIFramework.m_maxMsg;
   
   var table1 = document.getElementById ("CfgMsgSig");
   var table2 = document.getElementById ("CfgMsgEC");
   var table3 = document.getElementById ("CfgMsgCPVE");
   var table4 = document.getElementById ("CfgMsgProceedActions");
   var t2OffSet = 0;                   
   var t3OffSet = 0;
   var t4OffSet = 0;
   if (table1 != null)
      t2OffSet = table1.rows.length;
      t3OffSet = t2OffSet;
      t4OffSet = t3OffSet;
   if (table2 != null)
      t3OffSet += table2.rows.length;
      t4OffSet = t3OffSet;
   if (table3 != null)
      t4OffSet += table3.rows.length;
      
   for (i = m_UIFramework.m_curMsg; i < j; i++)
   {
      if (table1 != null && table1.rows.length > i)
         table1.rows[i].style.display = "none";
      else if (table2 != null && (table2.rows.length + t2OffSet) > i)
         table2.rows[i-t2OffSet].style.display = "none";
      else if (table3 != null && (table3.rows.length + t3OffSet) > i)
         table3.rows[i-t3OffSet].style.display = "none";
      else if (table4 != null && (table4.rows.length + t4OffSet) > i)
         table4.rows[i-t4OffSet].style.display = "none";
   }        
         
   for (i = j; i < k; i++)
   {
      if (table1 != null && table1.rows.length > i)
         table1.rows[i].style.display = "";
      else if (table2 != null && (table2.rows.length + t2OffSet) > i)
         table2.rows[i-t2OffSet].style.display = "";
      else if (table3 != null && (table3.rows.length + t3OffSet) > i)
         table3.rows[i-t3OffSet].style.display = "";
      else if (table4 != null && (table4.rows.length + t4OffSet) > i)
         table4.rows[i-t4OffSet].style.display = "";
   }  

   m_UIFramework.m_curMsg = m_UIFramework.m_curMsg + m_UIFramework.m_maxMsg;
   updatePrevNextMsg ();
}

function updatePrevNextMsg ()
{
   var tableObj = document.getElementById ("CfgSignal");
   
   var table1 = document.getElementById ("CfgMsgSig");
   var table2 = document.getElementById ("CfgMsgEC");
   var table3 = document.getElementById ("CfgMsgCPVE");   
   var table4 = document.getElementById ("CfgMsgProceedActions");   
   var n1 = 0;
   var n2 = 0;
   var n3 = 0;
   var n4 = 0;
   if (typeof (table1) != "undefined" && table1 != null)
      n1 = table1.rows.length;
   if (typeof (table2) != "undefined" && table2 != null)
      n2 = table2.rows.length;
   if (typeof (table3) != "undefined" && table3 != null)
      n3 = table3.rows.length;       
   if (typeof (table4) != "undefined" && table4 != null)
      n4 = table4.rows.length;       
         
   if (m_UIFramework.m_curMsg > 0)
   {
      var prevObj = document.getElementById ("CfgPrevMsg");
      var innerText;
      if(document.all)
         innerText = prevObj.innerText;
      else
      {
         var nextScript = prevObj.getElementsByTagName ("script");
         if (nextScript.length == 1)
            nextScript[0].parentNode.removeChild(nextScript[0])

         innerText = prevObj.innerHTML.replace(/<[^>]+>/g,"").replace(/\n/g,"");
      } 
      prevObj.innerHTML = "<b><a href='Javascript:prevMsg ()'>" + innerText + "</a></b>";    
   }
   else
   {
      var prevObj = document.getElementById ("CfgPrevMsg");
      var prevA = prevObj.getElementsByTagName ("a");
      if (prevA.length == 1)
         //prevA[0].removeNode (false);
         RemoveNodeCustom ( prevA[0] );    
   }
      
   if ((m_UIFramework.m_curMsg + m_UIFramework.m_maxMsg) < (n1+n2+n3+n4))
   {
      var nextObj = document.getElementById ("CfgNextMsg");
      var innerText;
      if(document.all)
         innerText = nextObj.innerText;
      else
      {
         var nextScript = nextObj.getElementsByTagName ("script");
         if (nextScript.length == 1)
            nextScript[0].parentNode.removeChild(nextScript[0])

         innerText = nextObj.innerHTML.replace(/<[^>]+>/g,"").replace(/\n/g,"");
      }
      nextObj.innerHTML = "<b><a href='Javascript:nextMsg ()'>" + innerText + "</a></b>";    
   }
   else
   {
      var nextObj = document.getElementById ("CfgNextMsg");
      var nextA = nextObj.getElementsByTagName ("a");
      if (nextA.length == 1)
         //nextA[0].removeNode (false); 
         RemoveNodeCustom ( nextA[0] );      
   }
   
   if ((n1+n2+n3+n4) > 0)
   {
      var allObj = document.getElementById ("CfgAllMsg");
      var innerText;
      if(document.all)
         innerText = allObj.innerText;
      else
      {
         var nextScript = allObj.getElementsByTagName ("script");
         if (nextScript.length == 1)
            nextScript[0].parentNode.removeChild(nextScript[0])

         innerText = allObj.innerHTML.replace(/<[^>]+>/g,"").replace(/\n/g,"");
      }
      if (canShowCfgTip ())
         allObj.innerHTML = "<b><a href='JavaScript:showAllMsgDlg()'>" + innerText + "</a></b>";
      else
         allObj.innerHTML = "<b><a href='JavaScript:showAllMsg()'>" + innerText + "</a></b>";
   }
   else
   {
      var allObj = document.getElementById ("CfgAllMsg");
      var allA = allObj.getElementsByTagName ("a");
      if (allA.length == 1)
         //allA[0].removeNode (false);
         RemoveNodeCustom (allA[0]);
   }
}

function showProdDetails ()
{
   var dObj = document.getElementById ("CfgObjDetails");
   var pdObj = document.getElementById ("CfgProdDetails");
   if (canShowCfgTip ())
   {
      var i = 0;   
      var tObj = document.getElementById ("CfgTip");  
      var innerHTML = "<table id=\"CfgProdDetailTable\"></table>";
      tObj.innerHTML = innerHTML; 

      tObj = document.getElementById ("CfgProdDetailTable");
      for (i = 0; typeof (pdObj) != "undefined" && pdObj != null && i < pdObj.rows.length; i++)
      {
         var trObj = tObj.insertRow (-1);
         for (var j = 0; j < pdObj.rows[i].cells.length; j++)
         {
            var tdObj = trObj.insertCell (-1);
            tdObj.innerHTML = pdObj.rows[i].cells[j].innerHTML;
         }
      } 
      cfgDisplayTip ();
   }
   else 
   {
      dObj.style.display = "";
      pdObj.style.display = "";
   }   
}

function closeDetails ()
{
   var dObj = document.getElementById ("CfgObjDetails");
   var pdObj = document.getElementById ("CfgProdDetails");

   dObj.style.display = "none";
   pdObj.style.display = "none";
}

function showSignal (id)
{
   var propSet       = null;
   var expl          = "";
   var iCount        = 0;
   var i             = 0;
   var msgPS         = null;   
   var signalPropSet = null;
   var spanObj       = null;
   var tableObj      = null;
   var tr            = null;
   var trArray       = null;
   var td            = null;
   var x             = 0;
  
   propSet = m_UIFramework.m_controlPropSet.GetChildByType (id);

   spanObj = document.getElementById ("SPAN_CfgSignal");
   if (typeof (spanObj) != "undefined" && spanObj != null)
      spanObj.innerHTML = "<table id=\"" + "CfgSignal" + "\"></table>";
   
   tableObj = document.getElementById ("CfgSignal");  
   tr = tableObj.insertRow (-1);
   td = tr.insertCell (-1);
   td.innerHTML = "<table id=\"" + "CfgMsgSig" + "\"></table>";
   tr = tableObj.insertRow (-1);
   td = tr.insertCell (-1);
   td.innerHTML = "<table id=\"" + "CfgMsgEC" + "\"></table>";
   tr = tableObj.insertRow (-1);
   td = tr.insertCell (-1);
   td.innerHTML = "<table id=\"" + "CfgMsgCPVE" + "\"></table>";   
   tr = tableObj.insertRow (-1);
   td = tr.insertCell (-1);
   td.innerHTML = "<table id=\"" + "CfgMsgProceedActions" + "\"></table>";   

   signalPropSet = propSet.GetChildByType ("Signal");
   
   //Get the signals first
   tableObj = document.getElementById ("CfgMsgSig");
   if (signalPropSet != null && signalPropSet.GetPropertyCount () > 0 && tableObj != null)
   {
      iCount = signalPropSet.GetPropertyCount ();
                     
      for (i = 0; i < iCount; i++)
      {
         expl = "";
         expl = signalPropSet.GetProperty (i.toString ());
                        
         tr = tableObj.insertRow (-1);
         tr.id = expl;
         td = tr.insertCell (-1);
         td.innerHTML = "<img src=\"IMAGES/bullet_green.gif\" width=\"9\" height=\"14\" border=\"0\"/>";
         td.width = "1%";
         td.vAlign = "top";
         td = tr.insertCell (-1);
         td.innerHTML = expl;
         td.width = "99%";
         td.colSpan = "2";   
         tr.style.display = "none";                    
      }
   }
    
   showMessage (signalPropSet); 
}

function showMessage (ps)
{
   var msgArr = new Array ();
   msgArr[0] = "CfgMsgEC";
   msgArr[1] = "EligComp";
   msgArr[2] = "Eligibility Reason";
   msgArr[3] = "CfgMsgCPVE";
   msgArr[4] = "VORD CPVE Validation Service";
   msgArr[5] = "Message";
   msgArr[6] = "CfgMsgProceedActions";
   msgArr[7] = "Proceed Actions";
   msgArr[8] = "Action";
   
   var deferMsgArr = new Array();
   deferMsgArr[0] = "Proceed Actions";
   deferMsgArr[1] = "Cardinality Violations";
   deferMsgArr[2] = "Promotion Violations";
   deferMsgArr[3] = "Other";

   for (var x = 0; x < msgArr.length; x+=3)
   {
      tableObj = msgPS = null;
      tableObj = document.getElementById (msgArr[x]);
      if (tableObj != null)
      {
         for (var y = tableObj.rows.length - 1; y >= 0; y--)
            tableObj.deleteRow (y);    
      }
      var notDeferUpdate = false;
      for (var t = 0; t < deferMsgArr.length && !notDeferUpdate; t++)
      {
         if (msgArr[x] == "CfgMsgProceedActions" && m_UIFramework.m_bDeferUpdate) // DeferUpdate
            msgPS = ps.GetChildByType (deferMsgArr[t]);
         else
         {
            msgPS = ps.GetChildByType (msgArr[x+1]);
            notDeferUpdate = true;
         }     
         if (msgPS != null && msgPS.GetChildCount () > 0 && tableObj != null)
         { 
            iCount = msgPS.GetChildCount ();
                           
            for (i = 0; i < iCount; i++)
            {
               expl = "";
               if (m_UIFramework.m_bDeferUpdate && !notDeferUpdate)  // multiselect, display messages
               {
                  expl = msgPS.GetChild (i).GetProperty ("Message Text");
                  if (undefined == expl)
                  {
                     expl = msgPS.GetChild (i).GetProperty (msgArr[x+2]); // msgArr[x+2] == "Action"
                     notDeferUpdate = true;
                  }
               }
               else   
                  expl = msgPS.GetChild (i).GetProperty (msgArr[x+2]);
                              
               tr = tableObj.insertRow (-1);
               tr.id = expl;
               td = tr.insertCell (-1);
               td.innerHTML = "<img src=\"IMAGES/bullet_green.gif\" width=\"9\" height=\"14\" border=\"0\"/>";
               td.width = "1%";
               td.vAlign = "top";
               td = tr.insertCell (-1);
               td.innerHTML = expl;
               td.width = "99%";
               td.colSpan = "2";   
               tr.style.display = "none";                    
            }
         }
      }     
   }
   arrangeMsg ();  
}

function arrangeMsg ()
{
   var table1 = document.getElementById ("CfgMsgSig");
   var table2 = document.getElementById ("CfgMsgEC");
   var table3 = document.getElementById ("CfgMsgCPVE");
   var table4 = document.getElementById ("CfgMsgProceedActions");
   var t2OffSet = 0;                   
   var t3OffSet = 0;
   var t4OffSet = 0;
   if (table1 != null)
      t2OffSet = table1.rows.length;
   t3OffSet = t2OffSet;
   t4OffSet = t3OffSet;
   if (table2 != null)
      t3OffSet += table2.rows.length;
      t4OffSet = t3OffSet;
   if(table3 != null)
	  t4OffSet += table3.rows.length;
      
   var n1 = 0;
   var n2 = 0;
   var n3 = 0;
   var n4 = 0;
   if (typeof (table1) != "undefined" && table1 != null)
      n1 = table1.rows.length;
   if (typeof (table2) != "undefined" && table2 != null)
      n2 = table2.rows.length;
   if (typeof (table3) != "undefined" && table3 != null)
      n3 = table3.rows.length;          
   if (typeof (table4) != "undefined" && table4 != null)
      n4 = table4.rows.length;          
   if (m_UIFramework.m_curMsg > (n1+n2+n3+n4))
      m_UIFramework.m_curMsg = 0;      
         
   for (i = m_UIFramework.m_curMsg; i < (m_UIFramework.m_curMsg + m_UIFramework.m_maxMsg); i++)
   {
      if (n1 > i)
         table1.rows[i].style.display = "";
      else if ((n2 + t2OffSet) > i)
         table2.rows[i-t2OffSet].style.display = "";
      else if ((n3 + t3OffSet) > i)
         table3.rows[i-t3OffSet].style.display = "";
      else if ((n4 + t4OffSet) > i)
         table4.rows[i-t4OffSet].style.display = "";
   }
   updatePrevNextMsg (); 
}

function addGenerics (resultPropSet, td, intId, hasGeneric)
{
   var image = ""; 
   var fieldPropSet  = new JSSCfgPropertySet ();
   
   if (intId == "" || typeof (intId) == "undefined")
      return;
   
   var strFieldList = resultPropSet.GetProperty ("FieldList");
   fieldPropSet.DecodeFromString (strFieldList); 
   
   var fPS = fieldPropSet.GetChildByType ("RequireMoreChild");
   if (fPS != null)
   {
      //hardcode for now
      if (hasGeneric == "Y")
         image = m_UIFramework.redStar;
      else
         image = m_UIFramework.whiteImage;
         
      td.innerHTML = td.innerHTML + 
                     "<span id=\"GENERICS" + _pipe +
                     intId +
                     "\">" +
                     image +
                     "</span>";   
   }
}

function addHtmlAttrib (fieldListPropSet, fieldName, td)
{
   var i = 0;
   var length = 0;
   
   //var fieldPropSet  = new JSSCfgPropertySet ();
   //var strFieldList  = resultPropSet.GetProperty ("FieldList");
   //fieldPropSet.DecodeFromString (strFieldList); 
   
   var fPS = fieldListPropSet.GetChildByType (fieldName);
   if (fPS != null)
   {
      var htmlAttrib = fPS.GetChildByType ("HtmlAttrib");
      if (htmlAttrib != null)
      { 
         length = htmlAttrib.GetPropertyCount ();
         for (bGetFirst = true, i = 0; i < length; i++, bGetFirst = false)
         {
            var attributes;
            var property;
            var value;
            
            if (bGetFirst)
               property  = htmlAttrib.GetFirstProperty ();
            else
               property  = htmlAttrib.GetNextProperty ();
               
            value     = htmlAttrib.GetProperty (property);
            attributes = "td." + property + "=\"" + value + "\";";
            eval (attributes);
         }
      }
   }
}

/*
input: tr            - The current row to display field list
       resultPropSet - This property set is first child of m_controlPropSet that belongs
                       to this particular port. It contains properties that span across 
                       all domains of this port.
       portDomainPropSet - This property set is one of the grandchildren of resultPropSet.
                           It contains specific domain information, like Product Id, Path, etc.
       refresh       - true/false. 
                       true:  if called after a submitrequest
                       false: if called the first time the page is shown                           
*/                           
function displayFieldList (tr, rowType, grpItemId, fieldListPropSet, portDomainPropSet, refresh)
{
   var fPS           = null;
   var fieldName     = "";
   var needRefresh   = ""; 
   var defaultField  = "";   
   var j             = 0;
   var n             = 0;
   var path          = "";
   var pickApplet    = "";
   var prodId        = "";
   var portItemId    = "";  
   var selected      = "";
   var strParentPath = "";
   var tableId       = "";
   var value         = "";
   
   //first deletes existing fields
   deleteFieldList (tr, fieldListPropSet);
                           
   //Display the field list
   for (j = 0, n = fieldListPropSet.GetChildCount (); j < n; j++)
   {
      value = fieldName = needRefresh = defaultField = prodId = path = portItemId = selected = strParentPath = "";   
      pickApplet = "";
      fPS = null;
      
      fPS = fieldListPropSet.GetChild (j);
      fieldName = fPS.GetProperty ("CfgFieldName");
      needRefresh = fPS.GetProperty ("NeedRefresh"); 
      defaultField = fPS.GetProperty ("Default");
      pickApplet = fPS.GetProperty ("PickApplet");
      
      //Default fields are rendered by the main Show function of the control.
      //So don't need to render them here
      if (defaultField == "Y" || defaultField == "y")
         continue;
         
      //NeedRefresh=N is for fields whose value will never change. 
      //For example: list price.
      //We should render these fields only the first time when the page is loaded,
      //ie. when refresh==false
      if ((needRefresh == "N" || needRefresh == "n") && refresh == true)
         continue;
         
      if (portDomainPropSet == null)
      {
         //insert white images. This is for Combo Box
         createNewField   (tr, 
                           "", 
                           "", 
                           "", 
                           "", 
                           fieldName,
                           m_UIFramework.whiteImage,
                           fieldListPropSet); 
                           
         continue;            
      }
      
      value = portDomainPropSet.GetProperty (fPS.GetType ());
      if (typeof (value) == "undefined" || value == "")
         value = m_UIFramework.whiteImage;
         
      portItemId     = portDomainPropSet.GetProperty ("Port Item Id");  
      selected       = portDomainPropSet.GetProperty ("Selected");   
      strParentPath  = portDomainPropSet.GetProperty ("Parent Path");         
      path           = portDomainPropSet.GetProperty ("Path");  
      prodId         = portDomainPropSet.GetProperty("Product Id");  
                                  
      if (rowType == (_underscore + "INTID" + _pipe))
         tableId = strParentPath + _underscore + "PORTITEM" + _pipe + portItemId;
      else
         tableId = strParentPath + _underscore + "PORT" + _pipe + portItemId;
      
      //Non default and needRefresh fields are only rendered when the product is selected
      if (selected == "Y" || needRefresh == "N")
      {    
         if (fieldName == "Customize" && portDomainPropSet.GetProperty ("CanDrillDown") == "Y")
         {
            createCustomizeIcon (tr, 
                                 tableId,
                                 rowType,
                                 grpItemId,
                                 path,
                                 prodId,
                                 fieldListPropSet);
         }
         else if (fieldName == "Explanation")
         {
            createExplanationIcon (tr, 
                                 tableId,
                                 rowType,
                                 grpItemId,
                                 path,
                                 prodId,
                                 fieldListPropSet);
         }  
         else if (fieldName == "Remove")
         {
            createRemoveIcon (tr, 
                              tableId,
                              rowType,
                              grpItemId,
                              path,
                              prodId,
                              fieldListPropSet);         
         }
         else if (pickApplet != "" && typeof (pickApplet) != "undefined" && pickApplet != null)
         {
            createEditFieldIcon (tr, 
                                 tableId,
                                 rowType,
                                 grpItemId,
                                 path,
                                 prodId,
                                 fieldListPropSet, 
                                 fieldName, 
                                 value);         
         }       
         else
         {          
            createNewField   (tr, 
                              tableId, 
                              rowType,
                              path, 
                              prodId,
                              fieldName, 
                              value,
                              fieldListPropSet);
         }
      }
      else
      {    
         createNewField   (tr, 
                           tableId, 
                           rowType,
                           path, 
                           prodId,
                           fieldName, 
                           m_UIFramework.whiteImage,
                           fieldListPropSet);     
      }
   }
}

/*
input: tr            - The current row to display field header
       resultPropSet - This property set is first child of m_controlPropSet that belongs
                       to this particular port. It contains properties that span across 
                       all domains of this port.                         
*/                           
function displayFieldHeader (tr, fieldPropSet)
{
   var fPS;
   var fieldHeader = "";
   var j;
   var n;
      
   //Display the field header
   for (j = 0, n = fieldPropSet.GetChildCount (); j < n; j++)
   {
      fPS = fieldPropSet.GetChild (j);
      fieldHeader = "";
      fieldHeader = fPS.GetProperty ("CfgUIControl");
      
      if (fieldHeader != "" && typeof (fieldHeader) != "undefined" && fieldHeader != null)
      {        
         createNewField   (tr, 
                           "", 
                           "",
                           "", 
                           "", 
                           "", 
                           "<b>" + fieldHeader + "</b>",
                           fieldPropSet);
      }                           
   }
}

function createCustomizeIcon (trObj, tableId, rowType, grpItemId, path, prodId, fieldListPropSet)
{
   var innerHTML  = "";
   var td         = null;
   var tdId       = "";
   
   m_UIFramework.InitIconLabel ();
        
   if (rowType == (_underscore + "INTID" + _pipe))
	   tdId = tableId + rowType + path + _underscore + "FIELD" + _pipe + "Customize";
   else if (prodId != "")
	   tdId = tableId + rowType + prodId + _underscore + "FIELD" + _pipe + "Customize";   
   	
   td = document.getElementById (tdId);
   if (td == null)
   {
	   td = trObj.insertCell (-1);
	   td.id = tdId;
   }
   
   addHtmlAttrib (fieldListPropSet, "Customize", td);  
   
   innerHTML = "<a href='javascript:processInput(\"GRPITEM" + _pipe + grpItemId + _underscore + "INTID" + _pipe + path + _underscore + "PROD" + _pipe + prodId + "\", \"SetTopObj\", \"linkMethod\")'>" +
               m_UIFramework.customizeIcon +
               "</a>";

   td.innerHTML = innerHTML;
}

function createExplanationIcon (trObj, tableId, rowType, grpItemId, path, prodId, fieldListPropSet)
{
   var innerHTML  = "";
   var td         = null;
   var tdId       = "";
   
   m_UIFramework.InitIconLabel ();
   
   if (rowType == (_underscore + "INTID" + _pipe))
      tdId = tableId + rowType + path + _underscore + "FIELD" + _pipe + "Explanation";
   else if (prodId != "")
      tdId = tableId + rowType + prodId + _underscore + "FIELD" + _pipe + "Explanation";   
	      
   td = document.getElementById (tdId);
   if (td == null)
   {
	   td = trObj.insertCell (-1);
	   td.id = tdId;
   }
		      
   addHtmlAttrib (fieldListPropSet, "Explanation", td);  
   
   innerHTML = "<a href='javascript:processInput(\"" + grpItemId + "\", \"" + _underscore + "PROD" + _pipe + prodId + _underscore + "INTID" + _pipe + path + "\", \"explanation\")'>" +
               m_UIFramework.explanationIcon +
               "</a>";

   td.innerHTML = innerHTML;
}

function createRemoveIcon (trObj, tableId, rowType, grpItemId, path, prodId, fieldListPropSet)
{
   var innerHTML  = "";
   var td         = null;
   var tdId       = "";
   
   m_UIFramework.InitIconLabel ();
   
   if (rowType == (_underscore + "INTID" + _pipe))
      tdId = tableId + rowType + path + _underscore + "FIELD" + _pipe + "Remove";
   else if (prodId != "")
      tdId = tableId + rowType + prodId + _underscore + "FIELD" + _pipe + "Remove";   
	      
   td = document.getElementById (tdId);
   if (td == null)
   {
	   td = trObj.insertCell (-1);
	   td.id = tdId;
   }
		      
   addHtmlAttrib (fieldListPropSet, "Remove", td);  

   innerHTML = "<a href='javascript:processInput(\"" + tableId + _underscore + "INTID" + _pipe + path + _underscore + "FIELD" + _pipe + "Remove\", " +
                  "\"GRPITEM" + _pipe + tableId + _underscore + "INTID" + _pipe + path + "\", \"Remove\")'>" +
                  m_UIFramework.removeIcon +
                  "</a>";
                  
   td.innerHTML = innerHTML;
}


function createEditFieldIcon (trObj, tableId, rowType, grpItemId, path, prodId, fieldListPropSet, fieldName, value)
{
   var innerHTML  = "";
   var td         = null; 
	var tdId       = "";
	
	m_UIFramework.InitIconLabel ();
	
	if (rowType == (_underscore + "INTID" + _pipe))
	   tdId = tableId + rowType + path + _underscore + "FIELD" + _pipe + fieldName;
	else if (prodId != "")
	   tdId = tableId + rowType + prodId + _underscore + "FIELD" + _pipe + fieldName;   	

	td = document.getElementById (tdId);
	if (td == null)
	{
	   td = trObj.insertCell (-1);
	   td.id = tdId;
	}   
      
   addHtmlAttrib (fieldListPropSet, fieldName, td);  
   			                                          
   innerHTML = "<nobr><input onchange='m_UIFramework.SetFieldValue (\"" + grpItemId + "\", \"" + fieldName + "\", \"" + td.id + "\", \"" + path + "\")' value=\"" + value + "\"/>" + 
               "<a href='javascript:m_UIFramework.EditField(\"" + grpItemId + "\", \"CfgFieldList\", \"" + fieldName + "\", \"" + path + "\")'>" +
               m_UIFramework.editFieldIcon +
               "</a></nobr>";   
   td.innerHTML = innerHTML;
}
                        
function deleteFieldList (tr, fieldListPropSet)
{
   var j;
   var tdArray = tr.getElementsByTagName ("td");
     
   for (j = tdArray.length - 1; j >= 0; j--)
   {
      var idInfo = getIdInfo (tdArray[j].id);
      var fPS = fieldListPropSet.GetChildByType (idInfo ["FIELD"]);
      if (fPS != null)
      {
         var needRefresh = fPS.GetProperty ("NeedRefresh");
         var defaultField = fPS.GetProperty ("Default");
         if (needRefresh == "N" || needRefresh == "n" ||
             defaultField == "Y" || defaultField == "y")
            continue;
         else
            tdArray[j].innerHTML = m_UIFramework.whiteImage;
      }
   }
}

function displayQtyInCombo (tr, grpItemId, fieldPropSet, portDomainPropSet,dynReadOnly)
{
   var quantity      = "";
   var path          = "";
   var portItemId    = "";
   var prodId        = "";          
   var strRowId      = "";
   var strParentPath = "";
       
   if (fieldPropSet.GetChildByType ("Quantity") != null)
   {
      if (portDomainPropSet == null)
      {
         td = tr.insertCell (-1);
         addHtmlAttrib (fieldPropSet, "Quantity", td);       
         td.innerHTML = m_UIFramework.whiteImage;
      }
      else
      {
         quantity = portDomainPropSet.GetProperty ("Quantity");
         path = portDomainPropSet.GetProperty ("Path");
         prodId = portDomainPropSet.GetProperty("Product Id");
         portId = portDomainPropSet.GetProperty("Port Item Id");         
         strParentPath = portDomainPropSet.GetProperty("Parent Path");   
         strRowId = strParentPath + _underscore + "PORT" + _pipe + portId + _underscore + "PROD" + _pipe + prodId;
         
         td = tr.insertCell (-1);
         td.id = strRowId + _underscore + "FIELD" + _pipe + "Quantity";
         addHtmlAttrib (fieldPropSet, "Quantity", td);    
         if(dynReadOnly == "Y")
			innerHTML =  "<input type=\"text\"" +
						"STYLE= \"background-color:#C0C0C0; width:3.75em\" readonly" +
						" value=\"" +
						quantity +
						"\" onchange='processInput(\"" +
                           			td.id + "\", \"" + "GRPITEM" + _pipe + grpItemId + _underscore + "INTID" + 
                           			_pipe + path + "\", \"comboportitem\")'>" + 
						"</input>";
        else
               
         innerHTML =  "<input type=\"text\"" +
                      " STYLE=\"width:3.75em\"" +
                      " value=\"" +
                      quantity +
                      "\" onchange='processInput(\"" +
                           	    td.id + "\", \"" + "GRPITEM" + _pipe + grpItemId + _underscore + "INTID" + 
                           	    _pipe + path + "\", \"comboportitem\")'>" + 
                      "</input>";     
         
         td.innerHTML = innerHTML;
      }
   }
}

function updateInstanceInfo (id, strProdId, instancePropSet)
{
   var count = instancePropSet.GetPropertyCount ();
   var resultPropSet = m_UIFramework.m_controlPropSet.GetChildByType (id);            
   var domainPropSet = resultPropSet.GetChildByType ("Domain");            
   var prodPropSet = domainPropSet.GetChildByType (strProdId);
   var y = 0;
   
   // Bug 13033612 - Added the following conidtion
   // When a Hide property with value Y is added under a product structure
   // for a child prodcut; when the Root product loaded this child is product
   // is not part of domain propset but later it is picked by engine then 
   // we can't update this value in m_UIFramework.
   if (prodPropSet != null)
   {   
     //update the properties in m_controlPropSet
     for (y = 0; y < count; y++)
     {
      var prop = "";
      var val  = "";
      
      if (y == 0)
         prop = instancePropSet.GetFirstProperty ();
      else
         prop = instancePropSet.GetNextProperty ();
         
      val  = instancePropSet.GetProperty (prop);
      prodPropSet.SetProperty (prop, val);
     }
   }
}

/* ATTRIBUTE GRID CONTROL */

//The next 4 functions originated from BT's requirement to display Attributes in line with the grandchild Line Item
//In order to use this control, we need to define UI Property on each Attribute we want to display:
//    -Grandchild Enabled  = Y
//    -Grandchild Type     = combo/text/radio
//
//As with other Grandchild template, it is highly recommended to create a new UI Group on the Child Product that
//contains all the attributes we want to display, and set this UI Group as the Default Group
//    -Default Group       = <attr UI Group.
function showPortItemsWithAttr (grpItemId)
{
   showPortItems (grpItemId);
   
   var instancePropSet  = m_UIFramework.m_controlPropSet.GetChildByType (grpItemId);
   
   if (typeof (instancePropSet) == "undefined" || instancePropSet == null)
      return;  
      
   var intId         = instancePropSet.GetProperty ("Path");
   var tableId       = instancePropSet.GetProperty ("Parent Path") + _underscore + "PORTITEM" + _pipe +
                       instancePropSet.GetProperty ("Port Item Id"); 
   var attDispName   = null; 
   var rowId         = "";
   var trObj         = null;
   var tdObj         = null;                                     
                 
   //Set up the Attribute headers
   var trObj = document.getElementById (tableId + _underscore + "FIELDHEADER"); 
   
   var attDispName   = m_UIFramework.m_grandChildAttrArray [instancePropSet.GetProperty ("Port Item Id")]; 
   if (attDispName != null && typeof (attDispName) != 'undefined')
   {  
      for (var i = 0; i < attDispName.length; i++)
      {
         tdObj = null;
         tdObj = document.getElementById (tableId + _underscore + attDispName [i]);
         if (tdObj == null)
         {
            tdObj = trObj.insertCell (-1);
            tdObj.id = tableId + _underscore + attDispName [i];
            tdObj.innerHTML = "<b>" + attDispName [i] + "</b>";
            tdObj.align = "center";
            tdObj.width = "80"; 
         }       
      }  
   }
   
   //Set up placeholders for the attributes
   trObj = null;
   rowId = "";
   rowId = tableId + _underscore + "INTID" + _pipe + intId;
   m_UIFramework.m_grandChildAttrRowIdArray [intId] = rowId;
         
   trObj = document.getElementById (rowId); 
   if (trObj != null || bCFG_uiJsDebug)
   {
      if (attDispName != null && typeof (attDispName) != 'undefined')
      {       
         for (var i = 0; i < attDispName.length; i++)
         {
            var attDispNameId = attDispName [i].replace(/\"/g, "&quot;");         
            tdObj = null;
            tdObj = trObj.insertCell (-1);
            tdObj.innerHTML = "<span id=\"" + rowId + _underscore + attDispNameId + "\"></span>";    
         }  
      }
   }
}

function showTextBoxAttr (grpItemId)
{
   var origSpanObj = document.getElementById (grpItemId); //Original span created by the server
   var textBoxPropSet = m_UIFramework.m_controlPropSet.GetChildByType (grpItemId);
   var parentPath     = textBoxPropSet.GetProperty ("Parent Path");
   var attDispName    = textBoxPropSet.GetProperty ("Attribute Display Name");
   var hasGeneric     = textBoxPropSet.GetProperty ("RequireMoreChild");
   var image = "";
   
   //swap the span created by the server and client
   var newSpanObj  = document.getElementById (m_UIFramework.m_grandChildAttrRowIdArray [parentPath] + _underscore + attDispName);
   if (document.all)
      origSpanObj.removeNode (true);
   else
      origSpanObj.parentNode.removeChild(origSpanObj);
   
   newSpanObj.id = grpItemId;      
   showTextBox (grpItemId);
   
   //CR#12-15ZJKKB: Show the asterisk in each cell for inline none-value required attribute. 
   //   The span id is "GENERICS" + _pipe + path + _underscore + "ATTR" + _pipe + XA Id
   if (hasGeneric == "Y")
      image = m_UIFramework.redStar;
   else
      image = m_UIFramework.whiteImage;
               
   newSpanObj.innerHTML = newSpanObj.innerHTML + 
                           "<span id=\"GENERICS" + _pipe + grpItemId +
                           "\">" + 
                           image + 
                           "</span>";   
}

function showComboAttr (grpItemId)
{  
   var origSpanObj    = document.getElementById ("SPAN_" + grpItemId); //Original span created by the server
   var comboPropSet   = m_UIFramework.m_controlPropSet.GetChildByType (grpItemId);
   var parentPath     = comboPropSet.GetProperty ("Parent Path");
   var attDispName    = comboPropSet.GetProperty ("Attribute Display Name");
   var hasGeneric     = comboPropSet.GetProperty ("RequireMoreChild");
   var image          = "";      
   
   //swap the span created by the server and client
   var newSpanObj  = document.getElementById (m_UIFramework.m_grandChildAttrRowIdArray [parentPath] + _underscore + attDispName);

   if (document.all)
      origSpanObj.removeNode (true);
   else
      origSpanObj.parentNode.removeChild(origSpanObj);
    
   newSpanObj.id = "SPAN_" + grpItemId;
   showCombo (grpItemId);

   //CR#12-15ZJKKB: Show the asterisk in each cell for inline none-value required attribute. 
   //   The span id is "GENERICS" + _pipe + path + _underscore + "ATTR" + _pipe + XA Id   
   if (hasGeneric == "Y")
      image = m_UIFramework.redStar;
   else
      image = m_UIFramework.whiteImage;

   var spanGeneric = "<span id=\"GENERICS" + _pipe + grpItemId + "\">" + image + "</span>";
                  
   newSpanObj.innerHTML = "<table border=\"0\"  cellpadding=\"0\" cellspacing=\"0\"><tr><td>" + 
                           newSpanObj.innerHTML + 
                           "</td><td valign=\"top\" align=\"left\">" + 
                           spanGeneric + 
                           "</td></tr></table>";   
}

function showRadioAttr (grpItemId)
{  
   var origSpanObj    = document.getElementById ("SPAN_" + grpItemId); //Original span created by the server
   var radioPropSet   = m_UIFramework.m_controlPropSet.GetChildByType (grpItemId);
   var parentPath     = radioPropSet.GetProperty ("Parent Path");
   var attDispName    = radioPropSet.GetProperty ("Attribute Display Name");
   var hasGeneric     = radioPropSet.GetProperty ("RequireMoreChild");
   var image          = "";   
   
   //swap the span created by the server and client
   var newSpanObj  = document.getElementById (m_UIFramework.m_grandChildAttrRowIdArray [parentPath] + _underscore + attDispName);

   if (document.all)
      origSpanObj.removeNode (true);
   else
      origSpanObj.parentNode.removeChild(origSpanObj);
      
   newSpanObj.id = "SPAN_" + grpItemId;
   showRadio (grpItemId);

   //CR#12-15ZJKKB: Show the asterisk in each cell for inline none-value required attribute. 
   //   The span id is "GENERICS" + _pipe + path + _underscore + "ATTR" + _pipe + XA Id   
   if (hasGeneric == "Y")
      image = m_UIFramework.redStar;
   else
      image = m_UIFramework.whiteImage;

   var spanGeneric = "<span id=\"GENERICS" + _pipe + grpItemId + "\">" + image + "</span>";
                  
   newSpanObj.innerHTML = "<table border=\"0\"  cellpadding=\"0\" cellspacing=\"0\"><tr><td>" + 
                           newSpanObj.innerHTML + 
                           "</td><td valign=\"top\" align=\"left\">" + 
                           spanGeneric + 
                           "</td></tr></table>";   
}
/* End of ATTRIBUTE GRID CONTROL */

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


/** Account Origination */

function applicantShowSelectAndOptions (tableId)
{
   applicantShowSelectAndOptionsHelper (tableId, null, null);
}

function applicantShowSelectAndOptionsHelper (tableId, dispArray, dispFunction)
{
   var buttonHTML             = "";
   var inputId                = "";
   var inputHTML              = "";
   var selectOptionHTML       = "";
   var tableObj               = null;
   var tr                     = null;   
   var resultPropSet          = null;
   var objArray               = null;
   var optionId               = "";
   var portPropSet            = null;
   var portDomainPropSet      = null;
   var portItemId             = "";  
   var portItemSpanId         = ""; 
   var nDomainLen             = 0;
   var i                      = 0;
   var selectId               = "";
   var simpleSelectId         = "";
   var simpleSelectHTML       = "";
   var spanObj                = null;
   var td1                    = null;
   var td2                    = null;
   var td3                    = null;  
     
   spanObj = document.getElementById ("SPAN_" + tableId);
   spanObj.innerHTML = "<table id=\"" + tableId + "\"></table>";

   tableObj = document.getElementById (tableId);
  
   resultPropSet = m_UIFramework.m_controlPropSet.GetChildByType (tableId);
   resultPropSet.SetProperty ("PortItemCount", "0");
   
   //Title
   tr = tableObj.insertRow (-1);
   
   td1 = tr.insertCell (-1);
   //td1.innerHTML = m_UIFramework.GetTemplateVarValue("sComboAddNameLabel");
   td1.width = "250";
   td1.align = "left";
   
   td1 = tr.insertCell (-1);
   //td1.innerHTML = m_UIFramework.GetTemplateVarValue("sComboAddQtyLabel");
   td1.width = "50";
   td1.align = "left";

   td1 = null;

   portPropSet = resultPropSet.GetChildByType ("Domain");
   nDomainLen = portPropSet.GetChildCount();

   //Insert an empty option
   portItemId = portPropSet.GetProperty ("Port Item Id");
   optionId = tableId + _underscore + "PORTDOMAIN" + _pipe + "none";
   selectId = tableId + _underscore + "DOMAINSELECT";
   selectOptionHTML = "<select id=" + selectId + ">" +
                      "<option value=\"" + "GRPITEM" + _pipe + tableId + _underscore + "PROD" + _pipe + "none\" " +  
                               "id =\"" + optionId + "\" " +
                               "class=\"" + "eCfgOptionAvailable" + "\" " +
                               "selected>" + 
                       "</option>";

   simpleSelectId = "SIMPLE" + selectId;

   for (i = 0; i < nDomainLen; i++)
   {
      var prodId              = "";
      var className           = "";
      var displayName         = "";
      var dispValArray        = new Array ();
      var excluded            = "";
      var enable              = "";

      portItemId = "";      
      optionId = "";
      
      portDomainPropSet = portPropSet.GetChild(i);
      excluded = portDomainPropSet.GetProperty ("Excluded");        
      prodId = portDomainPropSet.GetProperty("Product Id");
      portItemId = portDomainPropSet.GetProperty("Port Item Id");
      if (dispArray != null && dispFunction != null)
      {
         for (var iLen = 0; iLen < dispArray.length; iLen++)
         {
            var temp = "";
            temp = portDomainPropSet.GetProperty(dispArray[iLen]);
            
            if (temp == null || typeof (temp) == "undefined")
               dispValArray[iLen] = "";
            else
               dispValArray[iLen] = temp;
         }
         var str = CCFMiscUtil_ArrayToString (dispValArray);
         str = str.replace(/\"/g, "\\\"");
         str = dispFunction + "(\"" + str + "\");";
         displayName = eval (str);
      }
      else
         displayName = portDomainPropSet.GetProperty("CxObjName");
      enable = portDomainPropSet.GetProperty ("CxEnabled");
      
      optionId = tableId + _underscore + "PORTDOMAIN" + _pipe + prodId;
      
      if (enable == "Y")
         className = "eCfgOptionAvailable";
      else
         className = "eCfgOptionExcluded";
         
      if (excluded != "Y" || enable == "Y")         
      {
         selectOptionHTML = selectOptionHTML + 
                            "<option value=\"" + "GRPITEM" + _pipe + tableId + _underscore + "PROD" + _pipe + prodId + "\" " +
                                    "id =\"" + optionId + "\" " +
                                    "class=\"" + className + "\" " + " >" +  
                              displayName + 
                           "</option>";
      }
      
      if ((displayName == "Applicant") || (displayName == "Applicant 1"))
      {
         simpleSelectHTML = "<input id=\"" + simpleSelectId + "\" type=\"hidden\" value=\"" + "GRPITEM" + _pipe + tableId + _underscore + "PROD" + _pipe + prodId + "\"/>";
      }
   }
   
   //end loop
   
   //selectOptionHTML += "</select>";
   
   inputId = tableId + _underscore + "DOMAININPUT";
   inputHTML = "<input id=\"" + inputId + "\" type=\"hidden\" size=\"1\"/>" + simpleSelectHTML;
   buttonHTML = "<a href='JavaScript:applicantProcessInput(\"" + inputId + "\", \"" + simpleSelectId + "\", \"SimpleAdd\")'>" +
                  m_UIFramework.GetTemplateVarValue("sAddItemLabel") + "</a>";    
   
   tr = tableObj.insertRow (-1);
   td3 = tr.insertCell (-1);
   td1 = tr.insertCell (-1);
   td2 = tr.insertCell (-1);
   
   //td1.innerHTML = selectOptionHTML;
   td2.innerHTML = inputHTML;
   td3.innerHTML = buttonHTML;
   td3.className = "minibuttonOn";
   
   //Setup an empty place holder for the Port Items
   
   //It's ashame we need to put the indentation here, instead of in eCfgRelationContentsJS.swt  
   portItemSpanId = tableId.replace (/PORT/, "PORTITEM");
                
   spanObj = document.getElementById ("SPAN_" + portItemSpanId);
   spanObj.innerHTML = "<table border=\"0\" cellpadding=\"0\" cellspacing=\"3\" width=\"100%\"></table>";   
   objArray = spanObj.getElementsByTagName ("table");
   tr = objArray[0].insertRow (-1);
   td1 = tr.insertCell (-1);
   td1.align = "center";
   td1.innerHTML = "<table id=\"" + portItemSpanId + "\"></table>";   
}

function applicantProcessInput (id, str, type)
{
   var idInfo        = null;
   var path          = "";
   var portPropSet   = null;
   var prodId        = "";
   var prodPropSet   = null;
   var obj           = null;
   var objType       = "";   
   var quantity      = "";
   var resultPropSet = null;
   var spanId        = "";
   var tableId       = "";
   var tempValue     = ""; // for FR#12-139DIHA

   switch (type)
   {
      case "SimpleAdd":
         //Get the quantity
         quantity = 1;
	      //obj = document.getElementById (id);
	      //quantity = obj.value;	      
	      if (quantity == "" || typeof (quantity) == "undefined" || quantity == null)
	         quantity = 0;
	         
	      //To remove decimal quantities   
	      quantity = parseInt (quantity);
	         
         //Clear the quantity box
         //obj.value = "";	         
      	
      	//Get the product info
	      obj = document.getElementById (str);
         idInfo = getIdInfo (obj.value);
         
         //Always select the none option
         tableId = idInfo["GRPITEM"] + _underscore + "PORT" + _pipe + idInfo["PORT"];
         //obj = document.getElementById (tableId + _underscore + "PORTDOMAIN" + _pipe + "none");
         //obj.selected = true;
                 
         //Add item
         if (quantity > 0) //12-HVNXWW: Note that this fix has a side effect: No validation page if qty < 0
         {         
            SubmitToQueue ("m_UIFramework.AddItemMin (" + 
	                        "\"Y\"" + 
	                        ", " + 
	                        "\"" + tableId + "\"" +
	                        ", " +
	                        "\"" + idInfo["PROD"] + "\"" + 
	                        ", " + 
                           "\"" + quantity + "\");");
               
            // this is to make sure that combo add will enforce user to submit 
            if (m_UIFramework.m_bDeferUpdate) // && m_UIFramework.m_DirtyItemArray.length > 0)
            { 
               /*
               var appObj = (window.opener != null) ? window.opener : this;
		
	            //HI mode acccessor	            
	            if (SWEIsHighInteract )	
	               var sString = top.App ().GetLocalString ("IDS_CXP_MULTISELECT_UI_INCOMPLETE"); // for locale
               else
                  var sString = appObj._SWEgetMessage ("IDS_CXP_MULTISELECT_UI_INCOMPLETE");
               */
               //alert ("JAWONG: COMBO ADD, it will call submit implicitly!");

               /*var bConfirmed = confirm("JAWONG: COMBO ADD, it will call submit implicitly!");
               if (!bConfirmed)
               {
                  m_UIFramework.UnlockRequestQueue ();
                  return;
               }*/
            
               // Call implicit submit        
               SubmitToQueue ("m_UIFramework.ProcessInteractPropSet ();");
            }       
	      }      	
	      break;

      case "RemoveApplicant":
         idInfo  = getIdInfo (str);

         SubmitToQueue ("m_UIFramework.SetItemQuantity (" +
                        "\"" + idInfo["GRPITEM"] + _underscore + "PORTITEM" + _pipe + idInfo ["PORTITEM"] + _underscore + "INTID" + _pipe + idInfo ["INTID"] + "\"" +
                        ", " +
                        "\"" + idInfo["INTID"] + "\"" +
                        ", " + 
                        "\"" + 0 + "\");");   
         break;

      default:
         processInput (id, str, type);
   }
}

function applicantShowPortItems (rowId)
{
   var comboAddId       = "";
   var i                = 0;
   var j                = 0;
   var nInstanceCount   = 0;
   var portItemCount    = 0;
   var spanObj          = null;
   var tableId          = "";
   var tableObj         = null;
   var trObj            = null;
   var type             = "";
   var qId              = "";

   var instancePropSet  = m_UIFramework.m_controlPropSet.GetChildByType (rowId);
   var fieldListPropSet  = new JSSCfgPropertySet ();
   var strFieldList  = instancePropSet.GetProperty ("FieldList");
   fieldListPropSet.DecodeFromString (strFieldList);    
      
   tableId = instancePropSet.GetProperty ("Parent Path") + _underscore + "PORTITEM" + _pipe +
             instancePropSet.GetProperty ("Port Item Id");
   comboAddId = instancePropSet.GetProperty ("Parent Path") + _underscore + "PORT" + _pipe +
                instancePropSet.GetProperty ("Port Item Id"); 
      
   //the table for Port Items are already created.
   tableObj = document.getElementById (tableId);
                   
   comboAddPS = m_UIFramework.m_controlPropSet.GetChildByType (comboAddId);
   portItemCount = comboAddPS.GetProperty ("PortItemCount");
   if (portItemCount == "0")
   {
      //Set up the field headers
      trObj = tableObj.insertRow (-1);
      trObj.id = tableId + _underscore + "FIELDHEADER";
      displayFieldHeader (trObj, fieldListPropSet);    
   }
   portItemCount++;
   comboAddPS.SetProperty ("PortItemCount", portItemCount);             

   applicantAddPortItem (tableId, instancePropSet);
}

function applicantAddPortItem (tableId, instancePropSet)
{  
   var hasGeneric = "";
   var intId      = "";
   var innerHTML  = "";  
   var inputValue = ""; 
   var table      = null;
   var tr         = null;
   var td         = null;
   var prodId     = "";
   var quantity   = 0;
   var description = "";
   var deleteIcon = "<img src=\"images/icon_end_process.gif\" border=\"0\" space=\"0\" hspace=\"0\" alt=\"Remove\" title=\"Remove\" />";   

   var fieldListPropSet  = new JSSCfgPropertySet ();
   var strFieldList  = instancePropSet.GetProperty ("FieldList");
   fieldListPropSet.DecodeFromString (strFieldList);       

   prodId = instancePropSet.GetProperty ("Product Id");
   intId  = instancePropSet.GetProperty ("Path");
   quantity = instancePropSet.GetProperty ("Quantity");	
   // BEGIN: Application Origination
   description = instancePropSet.GetProperty ("Description");
   // END: Application Origination
   hasGeneric = instancePropSet.GetProperty ("RequireMoreChild");

   table = document.getElementById (tableId);

   if (table == null)
      return;
	
   tr = table.insertRow (-1);
   tr.id = tableId + _underscore + "INTID" + _pipe + intId;
         	
   //1. Create the quantity box
   // make it hidden
	inputValue = "<input type=\"hidden\" " +
	                    "STYLE=\"width:3.75em\" " + 
	                    "onchange='processInput(\"" + tableId + _underscore + "INTID" + _pipe + intId + _underscore + "FIELD" + _pipe + "Quantity\", " +
	                                            "\"GRPITEM" + _pipe + tableId + _underscore + "INTID" + _pipe + intId + "\", \"portitem\")' " + 
                       "value=" + quantity + ">";   

   createNewField (tr, tableId, _underscore + "INTID" + _pipe, intId, "", "Quantity", inputValue, fieldListPropSet);
   
   //2. Display the name of the instance
//   td = tr.insertCell (-1);
//   addHtmlAttrib (fieldListPropSet, "Name", td);
        
//   if (instancePropSet.GetProperty ("CanDrillDown") == "Y")
//   {
//      innerHTML += "<a href='javascript:processInput(\"GRPITEM" + _pipe + tableId + _underscore + "PROD" + _pipe + prodId + _underscore + "INTID" + _pipe + intId + "\", \"SetTopObj\", \"linkMethod\")'>";
//   }
//   innerHTML += instancePropSet.GetProperty ("Name");
//   if (instancePropSet.GetProperty ("CanDrillDown") == "Y")
//      innerHTML += "</a>";
         
//   td.innerHTML = innerHTML;
//   addGenerics (instancePropSet, td, intId, hasGeneric);

   // BEGIN: Acccount Origination
   //3. Display the name of the instance
	//inputValue = "<input type=\"text\" " +
	//                    "STYLE=\"width:15.75em\" " + 
	//                    "ID='applicantBCDesc'" +
	//                    "onchange='processInput(\"" + tableId + _underscore + "INTID" + _pipe + intId + _underscore + "FIELD" + _pipe + "Description\", " +
	//                                            "\"GRPITEM" + _pipe + tableId + _underscore + "INTID" + _pipe + intId + "\", \"portitem\")' " + 
   //                    "value=" + description + ">";   

   //createNewField (tr, tableId, _underscore + "INTID" + _pipe, intId, "", "Description", inputValue, fieldListPropSet);
   // END: Acccount Origination

   //4. Display the other fields
   displayFieldList (tr, _underscore + "INTID" + _pipe, instancePropSet.GetType (), fieldListPropSet, instancePropSet, "N");

   //5. Display Remove Applicant
   inputValue = "<a href='javascript:applicantProcessInput(\"" + tableId + _underscore + "INTID" + _pipe + intId + _underscore + "FIELD" + _pipe + "Remove\", " +
                  "\"GRPITEM" + _pipe + tableId + _underscore + "INTID" + _pipe + intId + "\", \"RemoveApplicant\")'>" +
                  deleteIcon +
                  "</a>";
	//inputValue = "<input type=\"hidden\" " +
	//                    "STYLE=\"width:3.75em\" " + 
	//                    "onchange='applicantProcessInput(\"" + tableId + _underscore + "INTID" + _pipe + intId + _underscore + "FIELD" + _pipe + "Remove\", " +
	//                                            "\"GRPITEM" + _pipe + tableId + _underscore + "INTID" + _pipe + intId + "\", \"RemoveApplicant\")' " + 
   //                    "value=" + 0 + ">";   

   createNewField (tr, tableId, _underscore + "INTID" + _pipe, intId, "", "Remove", inputValue, fieldListPropSet);
}


function applicantShowPortItemsWithAttr (grpItemId)
{
   applicantShowPortItems (grpItemId);
   
   var instancePropSet  = m_UIFramework.m_controlPropSet.GetChildByType (grpItemId);
   
   if (typeof (instancePropSet) == "undefined" || instancePropSet == null)
      return;  
      
   var intId         = instancePropSet.GetProperty ("Path");
   var tableId       = instancePropSet.GetProperty ("Parent Path") + _underscore + "PORTITEM" + _pipe +
                       instancePropSet.GetProperty ("Port Item Id"); 
   var attDispName   = null; 
   var rowId         = "";
   var trObj         = null;
   var tdObj         = null;
                 
   //Set up the Attribute headers
   var trObj = document.getElementById (tableId + _underscore + "FIELDHEADER");
   var cellIndex = trObj.cells.length - 1;
   
   var attDispName   = m_UIFramework.m_grandChildAttrArray [instancePropSet.GetProperty ("Port Item Id")]; 
   if (attDispName != null && typeof (attDispName) != 'undefined')
   {  
      for (var i = 0; i < attDispName.length; i++)
      {
         tdObj = null;
         tdObj = document.getElementById (tableId + _underscore + attDispName [i]);
         if (tdObj == null)
         {
            tdObj = trObj.insertCell (cellIndex);
            tdObj.id = tableId + _underscore + attDispName [i];
            tdObj.innerHTML = "<b>" + attDispName [i] + "</b>";
            tdObj.align = "center";
            tdObj.width = "80"; 
         }       
      }  
   }
   
   //Set up placeholders for the attributes
   trObj = null;
   rowId = "";
   rowId = tableId + _underscore + "INTID" + _pipe + intId;
   m_UIFramework.m_grandChildAttrRowIdArray [intId] = rowId;
         
   trObj = document.getElementById (rowId); 
   cellIndex = trObj.cells.length - 1;
   if (trObj != null || bCFG_uiJsDebug)
   {
      if (attDispName != null && typeof (attDispName) != 'undefined')
      {       
         for (var i = 0; i < attDispName.length; i++)
         {
            var attDispNameId = attDispName [i].replace(/\"/g, "&quot;");         
            tdObj = null;
            tdObj = trObj.insertCell (cellIndex);
            tdObj.innerHTML = "<span id=\"" + rowId + _underscore + attDispNameId + "\"></span>";    
         }  
      }
   }
}
