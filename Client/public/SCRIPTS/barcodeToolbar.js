/***************************************************************************
 *
 * Copyright (C) 2002, Siebel Systems, Inc., All rights reserved.
 *
 * FILE:       BarcodeToolbar.js
 *
 * CREATOR:    Alan C Hsu
 *
 * DESCRIPTION
 *		Javascript Class Object: JSSBarcodeToolbar
 *
 *****************************************************************************/
 
function JSSBarcodeToolbar ()
{
   // define special parameters here
   this.comboBoxOptionsArray = new Array();
   // this.radioButtonIndexArray = new Array();
   
   this.serviceName           = "HTML FS Barcoding Tool Bar";
   this.processDataMethodName = "ProcessData";
   this.activeMethodName      = "Active";
   this.newMethodName         = "New";
   this.updateMethodName      = "Update";
   this.findMethodName        = "Find";
   this.comboMethodName       = "GetComboBoxOptions"
   this.resetMethodName       = "ResetButton";
   this.getstartkeyMethodName = "GetStartKeyCode";
   this.getendkeyMethodName   = "GetEndKeyCode";

   this.activeButtonIndex     = -1;
   this.newButtonIndex        = -1;
   this.updateButtonIndex     = -1;
   this.findButtonIndex       = -1;
   this.comboBoxIndex         = -1;
   this.optionsChanged        = true;
   this.service               = null;
   this.firstToolbarUpdate    = true;
   this.initialized           = false;
   this.commandCenterActive   = false;
   this.lastUpdateViewName    = null;
   this.errorMessage          = null;
   
   // Defect #12-ECE5IR
   // Adding variables for Start and End Key Sequences
   // This will allow one to be able to configure how to
   // start the barcode and how to end the barcode sequence
   // By default, we'll use 220, which is "\"
   this.startKeyCode          = 220;
   this.endKeyCode            = 220;

   // error reporting flag
   this.errorReport           = false;

   // debug flag for turning on the alerts 
   this.debugMode             = false;
}


function JSSBarcodeToolbar_ResetButton (toolbar)
{
   var items = toolbar.itemArray;

   // first removed checked status
   for (i = 0 ; i < items.length ; i++) 
   {
      switch (items[i].type)
      {
         case "Button":
         case "Link":
            toolbar.items[i].checked = 0;
         break;

         default:
      }
   }
   // reset the enabled status to only Active Button enable
   items[toolbar.newButtonIndex].enabled = 0;
   items[toolbar.updateButtonIndex].enabled = 0;
   items[toolbar.findButtonIndex].enabled = 0;
   toolbar.Update(false);

}



function JSSBarcodeToolbar_InitBarcodeToolbar( toolbar ) 
{
   if (toolbar.initialized)
      return true;

   if (toolbar.debugMode)
      alert ("Start Initialize Barcode Toolbar");

   toolbar.service = toolbar.GetApplication().GetService(toolbar.serviceName);
   
   if (toolbar.service == null) 
   {
      return false;
   }

   for (i = 0 ; i < toolbar.itemArray.length ; i++ )
   {
      switch (toolbar.itemArray[i].name)
      {
         case "New Button":
            toolbar.newButtonIndex = i;
            toolbar.itemArray[i].barcodeMethodName = toolbar.newMethodName;
            break;

         case "Update Button":
            toolbar.updateButtonIndex = i;
            toolbar.itemArray[i].barcodeMethodName = toolbar.updateMethodName;
            break;
   
         case "Find Button":
            toolbar.findButtonIndex = i;
            toolbar.itemArray[i].barcodeMethodName = toolbar.findMethodName;
            break;

         case "Use Combo Box":
            toolbar.comboBoxIndex = i;
            toolbar.itemArray[i].barcodeMethodName = toolbar.comboMethodName;
            break;

         case "Active Button":
            toolbar.activeButtonIndex = i;
            toolbar.itemArray[i].barcodeMethodName = toolbar.activeMethodName;
            break;
      }
   }

   if (toolbar.newButtonIndex       == -1 ||
       toolbar.updateButtonIndex    == -1 ||
       toolbar.findButtonIndex      == -1 ||
       toolbar.comboBoxIndex        == -1 ||
       toolbar.activeButtonIndex    == -1)
      return false;

   App().GetCommandMgr().SetupBarcode ( 0,  0,  0,  0,  0, 0, 0, 0, toolbar, "");   
   toolbar.commandCenterActive = false;

   // invoke the server service reset command
   var outPropSet = toolbar.service.InvokeMethod( toolbar.resetMethodName , null );

   // process the return output property set for the command
   toolbar.ProcessGetUIStateReturn( toolbar , outPropSet );

   // Invoke the Server Service method "GetStartKeyCode"
   var startPropSet = toolbar.service.InvokeMethod( toolbar.getstartkeyMethodName, null );

   // Invoke the Server Service method "GetEndKeyCode"
   var endPropSet = toolbar.service.InvokeMethod( toolbar.getendkeyMethodName, null );

   // Do the actual processing to set the member variables
   toolbar.ProcessConfigurableKeyCodes( toolbar, startPropSet, endPropSet );

   toolbar.initialized = true;
   return true;
}


 
function JSSBarcodeToolbar_DoGetItemStyle (toolbar, idx)
{
   // Need to disable roll over effect to not confuse the user.
   // But need to handle all the even html on the items, due to core.
   return "";
}


 
function JSSBarcodeToolbar_DoGenerateItemHtml (toolbar, idx)
{

   var html;
   var item = toolbar.itemArray[idx];
   var type = item.type;
   var quote = "\"";
   var bitmapEventScript = " ONMOUSEDOWN=\"" + _TB_evt(toolbar.index, idx) + "\"" +
                           " ONMOUSEUP=\""   + _TB_evt(toolbar.index, idx) + "\"" +
                           " ONMOUSEOVER=\"" + _TB_evt(toolbar.index, idx) + "\"" +
                           " ONMOUSEOUT=\""  + _TB_evt(toolbar.index, idx) + "\"" +
                           " ONCLICK=\""     + _TB_evt(toolbar.index, idx) + "\"";

   var textEventScript = " ONCLICK=" + quote + _TB_evt(toolbar.index, idx) + quote;

   switch (type)
   {
      case "Button": // Button
      case "Link": // Link
            if (item.bitmap != null)
            {
               html = "<img id=\"" + item.inEId + "\"" +
                   " src=\"" + ((item.enabled != true && item.offBitmap != null)? item.offBitmap : item.bitmap) +
                   "\" align=\"absmiddle\" ALT=\"" + item.caption + "\"" + bitmapEventScript + ">";
            }
            else
            {
               html = "<span id=\"" + item.inEId + "\"" + textEventScript + ">" + 
                      item.caption + "</span>";
            }
         break;
         break;

      case "Combo Box":
         html = "<select id=" + quote + item.inEId + quote +
                "onchange=" + quote + _TB_evt(toolbar.index, idx) + quote + 
                "></select>";
         break;

      default :
         html = JSSToolbar_DoGenerateItemHtml (toolbar, idx);
         break;
   }

   return html;

}


function JSSBarcodeToolbar_DoUpdate (toolbar)
{

   var enabledNew;
   var item;
   var command;

   //if (toolbar.debugMode)
   //  alert( "JSSBarcodeToolbar_DoUpdate Invoked.");

   // first check if class is properly initialized
   if ( !toolbar.InitBarcodeToolbar( toolbar )) 
      if (toolbar.debugMode)
         alert ("InitBarcodeToolbar failed");
   
   // if (toolbar.firstToolbarUpdate)
   //{
   //   // We have to run the regular update the first time.
   //   // This is how we get the first Activated Buttons
   //   JSSToolbar_DoUpdate( toolbar );
   //   toolbar.firstToolbarUpdate = false;
   //}

   // customized procedure, optimized for performance

   // if the view changed and not in Find mode, need to refresh combo box options
      
   var view = toolbar.GetApplication().GetMainView();
   if (view != null &&
       (toolbar.lastUpdateViewName != view.GetName()) &&
       (toolbar.itemArray[toolbar.findButtonIndex].checked != true))
   {
      // invoke the server service command
      command = toolbar.itemArray[toolbar.comboBoxIndex].barcodeMethodName;
      outPropSet = toolbar.service.InvokeMethod( command , null );

      // process the return output property set for the command
      toolbar.ProcessGetComboBoxOptionsReturn( toolbar , outPropSet );
   }
   
   toolbar.DoUpdateItemUIAll(toolbar);

}



function JSSBarcodeToolbar_DoUpdateItemUIAll ( toolbar )
{
   for (var i = 0 ; i < toolbar.itemArray.length ; i++)
   {     
      if (toolbar.IsUIReady())
         toolbar.DoUpdateItemUI(toolbar, i);
   }
}





function JSSBarcodeToolbar_DoUpdateItemUI (toolbar, idx)
{

   var item          = toolbar.itemArray[idx];
   var htmlInElem    = toolbar.GetHtmlElem(item.inEId);
   var htmlOutElem   = toolbar.GetHtmlElem(item.outEId);
   var i             = 0;
   var value         = null;
   var newOption     = null;

   switch (item.type)
   {
      case "Button":
      case "Link":

         // push state:
         if (item.checked == true) 
         {
            toolbar.GetHtmlElem(item.outEId).className = "TBpush";
         }
         else if (item.checked == false)
         {
            toolbar.GetHtmlElem(item.outEId).className = "TBflat"+this.index;
         }

         // disable/enable state:
         if (item.offBitmap != null)
            toolbar.GetHtmlElem(item.inEId).src = (item.enabled == true) ? item.bitmap : item.offBitmap;
         break;

       case "Combo Box":

         // we only update when the contents have changed.
         if (toolbar.optionsChanged)
         {
            // set the proper bool variable, so that we don't change again.
            toolbar.optionsChanged = false;

            htmlInElem.length = 0;
            if (toolbar.comboBoxOptionsArray != null)
            {
               for (i = 0 ; i < toolbar.comboBoxOptionsArray.length ; i++)
               {
                  value = toolbar.comboBoxOptionsArray[i];
                  newOption = new Option(value);
                  newOption.value = value;
                  htmlInElem.options[i] = newOption;
               }
            }
         }

         break;

      default :
         //var tdElem = toolbar.GetHtmlElem(item.outEId);
         //tdElem.innerHTML = (item.enabled == false) ? item.offText : item.text;
         break;
   }

}

 
 
function JSSBarcodeToolbar_DoHandleEvent (toolbar, idx, evt)
{
   var rVal        = false;
   var outPropSet  = null;
   var command     = "";
   var item        = toolbar.itemArray[idx];
   var oElem       = toolbar.GetHtmlElem(item.outEId);

   // first check if class is properly initialized
   if ( !toolbar.InitBarcodeToolbar( toolbar )) 
      if (toolbar.debugMode)
         alert ("InitBarcodeToolbar failed");


   switch (evt.type) 
   {
      case "click": 
      
         if (toolbar.debugMode)
            alert("Begin handling CLICK event happened on" + 
                  "\r toolbar.index= " + toolbar.index + 
                  "\r item.index= "    + item.index +
                  "\r item.name= "     + item.name + 
                  toolbar.DoGenerateDebugInfo( toolbar ));

         // command = toolbar.GetCommandName( toolbar , item.cmdId );
         command = item.barcodeMethodName;

         // special handing for Active command, need to talk to command center
         if (command == "Active")
         {
            if (toolbar.commandCenterActive)
            {
               // unregister barcode capture method in command center
               App().GetCommandMgr().SetupBarcode (  0,  0,  0,  0,  0, 0, 0, 0, toolbar, "" );   
               toolbar.commandCenterActive = false;
            }
            else
            {
               // register barcode capture method in command center
               // SetupBarcode(Beginkey, bBeginS, bBeginC, bBeginA, Endkey, bEndS, bEndC, bEndA, barcodeMethod) signature
               // key = '\' = 220
               App().GetCommandMgr().SetupBarcode(toolbar.startKeyCode,  0,  1,  0,  toolbar.endKeyCode,  0,  1,  0,  toolbar, "ProcessBarcodeData" );   
               toolbar.commandCenterActive = true;
            }
               
            // invoke the server service command
            outPropSet = toolbar.service.InvokeMethod( command , null );

            // process the return output property set for the command
            toolbar.ProcessGetUIStateReturn( toolbar , outPropSet );

            toolbar.DoUpdate(toolbar);
            rVal = true;
         }
         else // command != "Active"
         {
            // invoke the server service command
            outPropSet = toolbar.service.InvokeMethod( command , null );

            // process the return output property set for the command
            toolbar.ProcessGetUIStateReturn( toolbar , outPropSet );

            toolbar.DoUpdate(toolbar);
            rVal = true;
         }

         if (toolbar.debugMode)
            alert("End handling CLICK event happened on" + 
                  "\r toolbar.index= " + toolbar.index + 
                  "\r item.index= "    + item.index +
                  "\r item.name= "     + item.name + 
                  toolbar.DoGenerateDebugInfo( toolbar ));

         break;

      default:
         // no need to handle other events
   }


   return rVal;

}


function JSSBarcodeToolbar_DoGenerateDebugInfo( toolbar )
{
   var rVal;

   rVal = "\r\r *Barcode UI veriable values*" +
          "\r  initialized=" + toolbar.initialized +
          "\r  serviceName=" + toolbar.serviceName +
          "\r  service=" + ((toolbar.service == null || toolbar.service == 0) ? "null" : "not null") +
          "\r  newButtonIndex=" + toolbar.newButtonIndex +
          "\r  updateButtonIndex=" + toolbar.updateButtonIndex +
          "\r  findButtonIndex=" + toolbar.findButtonIndex +
          "\r  comboBoxIndex=" + toolbar.comboBoxIndex +
          "\r  activeButtonIndex=" + toolbar.activeButtonIndex;

   rVal += "\r\r *Toolbar Items Info*";
   for (i = 0 ; i < toolbar.itemArray.length ; i++) 
   {
      rVal +=  "\r  itemArray[" + i + "]:" + 
               "\tindex="              + toolbar.itemArray[i].index + 
               "\tname="               + toolbar.itemArray[i].name +
               "\ttype="               + toolbar.itemArray[i].type +
               "\tcmdId="              + toolbar.itemArray[i].cmdId +
               "\tbarcodeMethodName="  + toolbar.itemArray[i].barcodeMethodName;
   }

   rVal += "\r\r *ComboBoxOptionsArray Content*" +
            "\r  comboBoxOptionsArray = {";
   for (i = 0 ; i < toolbar.comboBoxOptionsArray.length; i++)
   {
      rVal += toolbar.comboBoxOptionsArray[i] + ",";

   }
   rVal += "}";

   return rVal;
}



/**
 * This method sets the proper toolbar item variable in the toolbar, 
 * based on the inputProp
 */
function JSSBarcodeToolbar_ProcessGetUIStateReturn( toolbar , inputProp ) 
{
   var value               = "";
   var optionNum           = 0;
   var i                   = 0;
   var resultProp;
   var activeBtn           = toolbar.itemArray[toolbar.activeButtonIndex];
   var newBtn              = toolbar.itemArray[toolbar.newButtonIndex];
   var updateBtn           = toolbar.itemArray[toolbar.updateButtonIndex];
   var findBtn             = toolbar.itemArray[toolbar.findButtonIndex];
 
   if (inputProp != null)
   {
      var count = inputProp .GetChildCount ();
      for (var i = 0; i < count; i++)
      {
         resultProp= inputProp .GetChild (i);
         if (resultProp!= null && resultProp.GetType () == "ResultSet")
         {
            break;
         }
      }
   }
    
   if (resultProp == null)
   {
      if (toolbar.debugMode || toolbar.errorReport)
         alert ("Method ProcessGetUIStateReturn \rResultSet is null");
      return;
   }

   // process button enable 
   
   value = resultProp.GetProperty("ACTIVE_ENABLED");
   activeBtn.enabled = ((value == "Y") ? true : false) ;
   
   value = resultProp.GetProperty("NEW_ENABLED");
   newBtn.enabled = ((value == "Y") ? true : false) ;
   
   value = resultProp.GetProperty("UPDATE_ENABLED");
   updateBtn.enabled = ((value == "Y") ? true : false) ;
   
   value = resultProp.GetProperty("FIND_ENABLED");
   findBtn.enabled = ((value == "Y") ? true : false) ;


   // process button check

   value = resultProp.GetProperty("ACTIVE_CHECKED");
   activeBtn.checked = ((value == "Y") ? true : false) ;
   
   value = resultProp.GetProperty("NEW_CHECKED");
   newBtn.checked = ((value == "Y") ? true : false) ;
   
   value = resultProp.GetProperty("UPDATE_CHECKED");
   updateBtn.checked = ((value == "Y") ? true : false) ;
   
   value = resultProp.GetProperty("FIND_CHECKED");
   findBtn.checked = ((value == "Y") ? true : false) ;


   // process comboBox options
 
   toolbar.ProcessGetComboBoxOptionsReturn(toolbar , inputProp);
   
   if (toolbar.debugMode)
      alert ("resultProp:\r" + resultProp.EncodeAsString());

}



/**
 * This method sets the proper options array values based on the inputProp
 */
function JSSBarcodeToolbar_ProcessGetComboBoxOptionsReturn( toolbar , inputProp ) 
{
   var value        = "";
   var optionNum    = 0;
   var i            = 0;
   var resultProp;

   if (inputProp != null)
   {
      var count = inputProp .GetChildCount ();
      for (var i = 0; i < count; i++)
      {
         resultProp= inputProp .GetChild (i);
         if (resultProp!= null && resultProp.GetType () == "ResultSet")
         {
            break;
         }
      }
   }

   // update the last update view name
   var view = toolbar.GetApplication().GetMainView();
   if (view != null)
   {
       toolbar.lastUpdateViewName = view.GetName();
   }
   else
   {
       toolbar.lastUpdateViewName = "";
   }
   toolbar.optionsChanged = true;

   var optionLength = 0;
   if (resultProp!= null)
   {
      optionLength = resultProp.GetProperty("OPTIONS_LENGTH");
   }

   if (optionLength == "" || optionLength == null)
   {
      optionLength = 0;
   }

   toolbar.comboBoxOptionsArray = new Array();
   for (i = 0 ; i < optionLength ; i++)
   {
      value = resultProp.GetProperty("OPTION" + i);

      if (value != null && value != "")
      {
         toolbar.comboBoxOptionsArray[toolbar.comboBoxOptionsArray.length] = value;
      }
   }

   
   // Error Reporting for special mode
   if (toolbar.debugMode || toolbar.errorReport)
   {
      // Set Error Messages if there's one
      toolbar.errorMessage = "";
      toolbar.errorMessage = resultProp.GetProperty("ERROR");
   
      if (toolbar.errorMessage != "" && toolbar.errorMessage != null)
      {
         alert("ERROR REPORT:\r" + toolbar.errorMessage);
      }
   }

}



/*
 * This Method is obsolete.  It was used to get the Method Name
 * from the old style of cmdId.  Now the cmdId stores strings such
 * as #25.  Thus, the method name is no longer in the cmdId.
 * The Method name is harcoded in the constructor this class
 */
function JSSBarcodeToolbar_GetCommandName(toolbar , cmdId)
{
   if (cmdId == null || cmdId == "")
      return null;

   var commandParts = cmdId.split("*");
   var serviceName = commandParts[2];
   var commandName = commandParts[3];
   var print = "cmdId = " + cmdId + "\rcommandParts = { ";

   for (i = 0 ; i < commandParts.length ; i++) 
   {
      print += commandParts[i] + " , ";
   }

   print += " } " + 
            "\rCommand Name = " + commandName + 
            "\rService Name = " + serviceName;

   if (toolbar.debugMode)
      alert( print );

   return commandName;
}



/*
 * Note: This function will be called by the command center.
 *       Therefore, "this" refers to Commanc Center, not toolbar.
 *
 * Argument:
 *       data = the barcode data captured by the command center
 */
function JSSBarcodeToolbar_ProcessBarcodeData (data)
{
   var inPropSet        = null;
   var sucess           = false;
   var optionValue      = null;
   var toolbar          = App().GetToolbarByName("HTML Barcode").jsObj; // using global code
   var comboBoxItem     = toolbar.itemArray[toolbar.comboBoxIndex];
   var comboBoxElement  = toolbar.GetHtmlElem(comboBoxItem.inEId);

   if (toolbar.debugMode)
      alert ("ProcessBarcodeData( " + data + " ) Invoked!");

   switch (data)
   {
      case "active":
      case "ACTIVE":
      case "Active":
         var evt = new Object();
         evt.type = "click";
         toolbar.DoHandleEvent (toolbar, toolbar.activeButtonIndex, evt);
         success = true;
         break;

      case "new":
      case "NEW":
      case "New":
         var evt = new Object();
         evt.type = "click";
         toolbar.DoHandleEvent (toolbar, toolbar.newButtonIndex, evt);
         success = true;
         break;

      case "update":
      case "UPDATE":
      case "Update":
         var evt = new Object();
         evt.type = "click";
         toolbar.DoHandleEvent (toolbar, toolbar.updateButtonIndex, evt);
         success = true;
         break;

      case "find":
      case "FIND":
      case "Find":
         var evt = new Object();
         evt.type = "click";
         toolbar.DoHandleEvent (toolbar, toolbar.findButtonIndex, evt);
         success = true;
         break;

      case "options":
      case "OPTIONS":
      case "Options":

         toolbar.ToggleComboBoxOptions (toolbar);
         success = true;
         break;

      default: // process barcode data
         // Get the option selected
         if (comboBoxElement.length != 0)
         {
            optionValue = comboBoxElement.options[comboBoxElement.selectedIndex].value
         }

         if (optionValue != null && optionValue != "")
         {
            // setup proper input property set
            // BARCODE              any barcode data value
            // OPTION               an valid combo box option
            inPropSet = App().NewPropertySet();
            inPropSet.SetProperty( "BARCODE" , data);
            inPropSet.SetProperty( "OPTION"  , optionValue);

            var outPropSet = toolbar.service.InvokeMethod( toolbar.processDataMethodName , inPropSet );

            // process the return output property set for the command
            // Need to set the focus
            toolbar.ProcessAppletFocus( toolbar , outPropSet );

            success = true;
         }
         else
         {
            if (toolbar.debugMode)
               alert ("ProcessBarcodeData ERROR: option selection not available.");
            success = false;
         }         
   }
   
   if (toolbar.debugMode && !success)
      alert ("ProcessBarcodeData unsuccessful!");

}

/**
 * This method sets the applet focus based on the inputProp
 */
function JSSBarcodeToolbar_ProcessAppletFocus( toolbar , inputProp ) 
{
   var value        = "";
   var resultProp;

   if (inputProp != null)
   {
      var count = inputProp .GetChildCount ();
      for (var i = 0; i < count; i++)
      {
         resultProp= inputProp .GetChild (i);
         if (resultProp!= null && resultProp.GetType () == "ResultSet")
         {
            break;
         }
      }
   }

   var appletName = resultProp.GetProperty ("Applet Name");
   var view = toolbar.GetApplication().GetMainView();
   if (view != null)
   {
      var applet = view.GetApplet (appletName);
      if (applet != null)
      {
         applet.InvokeMethod ("OnFocus", App().NewPropertySet ());
      }
      else
      {
      }
   }
}

/*
 * Description:
 *    When the user click refresh the page, there is 
 *    the possibility that the Server, Toolbar, CommandCenter
 *    are in inconsistent states.
 *    This function Checks for inconsistency between the objects.
 *
 * Note: 
 *    Server state was stored as member variables of the toolbar
 *    when the last DoUpdate was called.
 *
 * Argument:
 *    toolbar = the pointer to the Barcode Toolbar Object
 *
 * Returns: 
 *    true     if state is consistent
 *    false    otherwise
 */
function JSSBarcodeToolbar_IsStateInconsistent ( toolbar )
{

}


/*
 * Description:
 *    Fix the inconsistency in state between the Server, Toolbar,
 *    and CommandCenter.  Since this code is on the browswer,
 *    I will change the CommandCenter and toolbar state, 
 *    according to the server state.  
 * 
 * Note: 
 *    Server state was stored as member variables of the toolbar
 *    when the last DoUpdate was called.
 *
 * Argument:
 *    toolbar = the pointer to the Barcode Toolbar Object
 *
 * Return: 
 *    true     if fix successful
 *    false    otherwise
 */
function JSSBarcodeToolbar_FixStateInconsistent ( toolbar )
{


}

/*
 * Description:
 *    Toggle the selected combo box options in the use combo box
 *
 */
function JSSBarcodeToolbar_ToggleComboBoxOptions( toolbar )
{
   var comboBoxItem     = toolbar.itemArray[toolbar.comboBoxIndex];
   var comboBoxElement  = toolbar.GetHtmlElem(comboBoxItem.inEId);
   
   comboBoxElement.selectedIndex = (comboBoxElement.selectedIndex + 1)%comboBoxElement.options.length;

}

/**
 * This method sets the proper toolbar item variable for both the start
 * and end key codes.
 */
function JSSBarcodeToolbar_ProcessConfigurableKeyCodes( toolbar , startProp, endProp ) 
{ 
   var value = "";
   var resultStartProp;
   var resultEndProp;

   // Loop through the Start Property Set
   if (startProp != null)
   {
      var count = startProp .GetChildCount ();
      for (var i = 0; i < count; i++)
      {
         resultStartProp= startProp .GetChild (i);
         if (resultStartProp!= null && resultStartProp.GetType () == "ResultSet")
         {
            break;
         }
      }
   }

   // Loop through the End Property Set
   if (endProp != null)
   {
      var count = endProp .GetChildCount ();
      for (var i = 0; i < count; i++)
      {
         resultEndProp= endProp .GetChild (i);
         if (resultEndProp!= null && resultEndProp.GetType () == "ResultSet")
         {
            break;
         }
      }
   }
    
   // Make sure that we have good results
   if (resultStartProp == null ||
       resultEndProp == null)
   {
      if (toolbar.debugMode || toolbar.errorReport)
         alert ("Method ProcessConfigurableKeyCodes \rResultSet is null");
      return;
   }

   // Now we have proper Property Sets and we can set the
   // member variables accordingly   
   value = resultStartProp.GetProperty("KeyCode");
   toolbar.startKeyCode = value;
   
   value = resultEndProp.GetProperty("KeyCode");
   toolbar.endKeyCode   = value;
}


 
//new JSSBarcodeToolbar ();
JSSBarcodeToolbar.prototype  = new JSSToolbar ();

JSSBarcodeToolbar.prototype.ResetButton                     = JSSBarcodeToolbar_ResetButton;
JSSBarcodeToolbar.prototype.InitBarcodeToolbar              = JSSBarcodeToolbar_InitBarcodeToolbar;
JSSBarcodeToolbar.prototype.GetCommandName                  = JSSBarcodeToolbar_GetCommandName;
JSSBarcodeToolbar.prototype.DoGetItemStyle                  = JSSBarcodeToolbar_DoGetItemStyle;
JSSBarcodeToolbar.prototype.DoGenerateItemHtml              = JSSBarcodeToolbar_DoGenerateItemHtml;
JSSBarcodeToolbar.prototype.DoUpdate                        = JSSBarcodeToolbar_DoUpdate;
JSSBarcodeToolbar.prototype.DoUpdateItemUI                  = JSSBarcodeToolbar_DoUpdateItemUI;
JSSBarcodeToolbar.prototype.DoUpdateItemUIAll               = JSSBarcodeToolbar_DoUpdateItemUIAll;
JSSBarcodeToolbar.prototype.DoHandleEvent                   = JSSBarcodeToolbar_DoHandleEvent;
JSSBarcodeToolbar.prototype.DoGenerateDebugInfo             = JSSBarcodeToolbar_DoGenerateDebugInfo;
JSSBarcodeToolbar.prototype.ProcessBarcodeData              = JSSBarcodeToolbar_ProcessBarcodeData;
JSSBarcodeToolbar.prototype.ProcessAppletFocus              = JSSBarcodeToolbar_ProcessAppletFocus;
JSSBarcodeToolbar.prototype.ProcessGetComboBoxOptionsReturn = JSSBarcodeToolbar_ProcessGetComboBoxOptionsReturn;
JSSBarcodeToolbar.prototype.ProcessGetUIStateReturn         = JSSBarcodeToolbar_ProcessGetUIStateReturn;
JSSBarcodeToolbar.prototype.IsStateInconsistent             = JSSBarcodeToolbar_IsStateInconsistent;
JSSBarcodeToolbar.prototype.FixStateInconsistent            = JSSBarcodeToolbar_FixStateInconsistent;
JSSBarcodeToolbar.prototype.ToggleComboBoxOptions           = JSSBarcodeToolbar_ToggleComboBoxOptions;
JSSBarcodeToolbar.prototype.ProcessConfigurableKeyCodes     = JSSBarcodeToolbar_ProcessConfigurableKeyCodes;


