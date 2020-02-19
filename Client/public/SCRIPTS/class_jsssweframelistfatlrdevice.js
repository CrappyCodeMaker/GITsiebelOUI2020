var m_bCrdRdr = false;
var m_bPinPad = false;
var m_bJrnPtr = false;
var m_bPasPtr = false;
var m_bRcpPtr = false;
var m_bDeviceEnable = false;
var m_bDeviceControlDefined=false;
var s_teller  = null;
var s_app     = top._swe._sweapp.S_App;
var contactRowID;

function JSSSWEFrameListFATlrDevice_CardInserted (applet, id)
{
   var track1, track2, track3;
   var deviceName;

   //alert ("MESSAGE: Card Inserted!");
   deviceName = "IDC";
   track1 = s_teller.Track1 (deviceName);
   track2 = s_teller.Track2 (deviceName);
   track3 = s_teller.Track3 (deviceName);
   contactRowID = track1;

   s_teller.EjectCard (deviceName);
}

function JSSSWEFrameListFATlrDevice_InitializeSiebelTellerControl (applet, id)
{
  s_teller = applet.GetControlElement("SiebelTellerActiveXControl");
  if (s_teller)
  {
    if (applet.GetUserProp("UseCardReader")=="Y")  s_teller.OpenCardReader("IDC");
    if (applet.GetUserProp("UsePinPad")=="Y")      s_teller.OpenPinPad("PIN");
    if (applet.GetUserProp("UsePrinter")=="Y")     s_teller.OpenPrinter("PTR");
  }
}

function JSSSWEFrameListFATlrDevice_OpenCardReaderFailed (applet, id)
{
   alert ("MESSAGE: Open Card Reader Failed!");
   m_bCrdRdr = false;
}

function JSSSWEFrameListFATlrDevice_OpenCardReaderOK (applet, id)
{
   //alert ("MESSAGE: Open Card Reader OK!");
   m_bCrdRdr = true;
}

function JSSSWEFrameListFATlrDevice_OpenPinPadFailed (applet, id)
{
   alert ("MESSAGE: Open Pin Pad Failed!");
   m_bPinPad = false;
}

function JSSSWEFrameListFATlrDevice_OpenPinPadOK (applet, id)
{
   //alert ("MESSAGE: Open Pin Pad OK!");
   m_bPinPad = true;
}

function JSSSWEFrameListFATlrDevice_OpenPrinterFailed (applet, id)
{
   alert ("MESSAGE: Open Printer Failed!");
   m_bJrnPtr = false;
   m_bPasPtr = false;
   m_bRcpPtr = false;
}

function JSSSWEFrameListFATlrDevice_OpenPrinterOK (applet, id)
{
   //alert ("MESSAGE: Open Printer OK!");
   m_bJrnPtr = true;
   m_bPasPtr = true;
   m_bRcpPtr = true;
}

function JSSSWEFrameListFATlrDevice_PinPadDataRead (applet, id)
{
   //alert ("MESSAGE: Pin Pad Data Read!");
}

function JSSSWEFrameListFATlrDevice_DoCanInvokeMethod (applet, method)
{
  if (!m_bDeviceEnable || !m_bDeviceControlDefined)
    return top._swescript.JSSListApplet_DoCanInvokeMethod (applet, method);

  if (s_teller)
  {
    if (method == "ReadCard")
    {
      return m_bCrdRdr;
    }
    else if (method == "PrintJournal")
    {
      return m_bJrnPtr;
    }
    else if (method == "PrintPassbook")
    {
      return m_bPasPtr;
    }
    else if (method == "PrintReceipt")
    {
      return m_bRcpPtr;
    }
    else if (method == "PrintTellerTicket")
    {
      return m_bRcpPtr;
    }
    else if (method == "ReadPin")
    {
      return m_bPinPad;
    }
    else if (method == "UpdatePassbook")
    {
      return m_bPasPtr;
    }
  }

  return top._swescript.JSSListApplet_DoCanInvokeMethod (applet, method);
}

function JSSSWEFrameListFATlrDevice_DoInitialize (applet)
{
  if (applet.GetUserProp("TellerDeviceEnable")=="Y") {
    m_bDeviceEnable=true;
  }
  if (applet.GetControlElement("SiebelTellerActiveXControl")!=null) {
    m_bDeviceControlDefined=true;
  }

  if (!m_bDeviceEnable) {
    alert ("TellerDeviceEnable is FALSE, do not initialize the ActiveX Control");
    return top._swescript.JSSListApplet_DoInitialize(applet);
  }

  if (!m_bDeviceControlDefined) {
    alert ("ERROR: No SiebelTellerActiveXControl defined.  Applet won't be able to perform Teller Device activities.");
  } else if (s_teller==null) {
    //alert ("Enabling the Control...");
    JSSSWEFrameListFATlrDevice_InitializeSiebelTellerControl(applet);
  }

  return top._swescript.JSSListApplet_DoInitialize (applet);
}

function JSSSWEFrameListFATlrDevice_DoInvokeMethod (applet, method, inputPropSet)
{
  var deviceName, deviceForm, deviceMedia;
  var busComp = applet.GetBusComp();
  var bFirst;
  var field, fieldValue;
  var outputPropSet;
  var rsPropSet;

  if (!m_bDeviceEnable || !m_bDeviceControlDefined)
    return top._swescript.JSSListApplet_DoInvokeMethod (applet, method, inputPropSet);

  if (method=="ReadCard") {
    deviceName = "IDC";
    deviceForm = "T1&2&3";
    if (s_teller && m_bCrdRdr)
    {
      s_teller.WaitForCardReaderInsert (deviceName, deviceForm);

      applet.DoInvokeMethod (applet, "ReadPin", inputPropSet);
      inputPropSet.SetProperty ("Contact Row Id", contactRowID);
      inputPropSet.SetProperty ("ProcessName", "FINS Teller Goto View Workflow");
      var service = top._swe._sweapp.S_App.GetService ("FINS Teller Device Service");
      service.InvokeMethod ("Navigate", inputPropSet);
    }
  } else if (method=="ReadPin") {
    deviceName = "PIN";
    if (s_teller && m_bPinPad)
    {
      s_teller.WaitForPinPadData (deviceName);
    }
  } else if (method=="PrintJournal") {
  } else if (method=="PrintPassbook") {
  } else if (method=="PrintTellerTicket") {
    deviceName = "PTR";
    deviceMedia = "Ticket Media 1";
    deviceForm  = "Ticket Form 1";

    if (s_teller && m_bRcpPtr)
    {

      if (busComp)
      {
        var i;
        var numRows = busComp.GetNumRows();

        // Hack to fake out a list of line items
	if (numRows == 1)
        {
          deviceForm = "Ticket Form 1";
        }
        else if (numRows == 2)
        {
          deviceForm = "Ticket Form 2";
        }
        else if (numRows >= 3)
        {
          deviceForm = "Ticket Form 3";
        }
//	alert(deviceForm);
        s_teller.LoadForm (deviceName, deviceMedia, deviceForm);
        busComp.Home();
        var tmpStr = applet.GetUserProp("PrintFields");
        var tmpStr2 = applet.GetUserProp("GlobalTags");
        var service = top._swe._sweapp.S_App.GetService ("FINS IFX XML Extension");
        var propSet = top._swe._sweapp.S_App.NewPropertySet();
        var tagStr;
        parentBusComp = busComp.GetParentBC();

        for (i=0; i<numRows; i++)
        {
          if (tmpStr == null)
          {
            bFirst = true;
            while (field = busComp.EnumFields (bFirst))
            {
              bFirst = false;
              if (field) 
              {
                s_teller.SetFieldValue (deviceName, field.name, busComp.GetFieldValue(field.name));
              }
            }
          } 
          else 
          {
            var fieldArray = tmpStr.split(',');
            
            var index=0;
            while(index < fieldArray.length)
            {
              var fieldName = fieldArray[index];
              // Split the field spec into bc.fieldname format
              var fieldSpec = fieldName.split('.');
              if (fieldSpec.length == 2 && fieldSpec[0] == "parent")
              {
                fieldValue = parentBusComp.GetFieldValue(fieldSpec[1]);
		// Remove the parent. prefix from the field name
		fieldName = fieldSpec[1];
              }
              else if (fieldSpec.length == 1)
              {
                fieldValue = busComp.GetFieldValue(fieldSpec[0]);
              }
              else
              {
                fieldValue = "";
              }
              if (fieldValue == null)
              {
                fieldValue = "";
              }
              // All the fields have the row number appended - even
              // ones from the parent BC to ensure unique fieldnames
              fieldName = fieldName + i;
//              alert("Buscomp value: " + fieldName + ": " + fieldValue);
              s_teller.SetFieldValue (deviceName, fieldName, fieldValue);
              index++;
            }
          }

        //the following lines are for PNC PoC in terms of printing tickets.
          if (service != null && propSet != null)
          {
            if (tmpStr2 != null)
            {
              var fieldArray2 = tmpStr2.split(',');
              var index2 = 0;
              while (index2 < fieldArray2.length)
              {
                tagStr = fieldArray2[index2]+i;
                propSet.SetProperty("TagName", tagStr);
                outputPropSet = service.InvokeMethod("GetGlobalPCDATA", propSet);
                if ((outputPropSet != null) &&
                    ((rsPropSet = outputPropSet.GetChildByType("ResultSet"))  != null))
                {
                  fieldValue = rsPropSet.GetValue();
                }
                else 
                {
                  fieldValue = "";
                }
//		alert("Tag value: " + tagStr + ": " + fieldValue);
                s_teller.SetFieldValue(deviceName, fieldArray2[index2]+i, fieldValue);
		index2++;
              }
            }
          }
          s_teller.SetFieldValue(deviceName, "Sequence Number" + i, i);
          busComp.NextRecord();
        }
        s_teller.PrintReceipt (deviceName);
      }
    }
  } else if (method=="PrintReceipt") {
    deviceName = "PTR";
    deviceMedia = "Receipt Media 1";
    deviceForm = "Receipt Form 1";
    if (s_teller && m_bRcpPtr)
    {
      s_teller.LoadForm (deviceName, deviceMedia, deviceForm);

      if (busComp)
      {
        if (busComp.GetActiveRow() != -1)
        {
          var tmpStr = applet.GetUserProp("PrintFields");
          if(tmpStr==null) {
            bFirst = true;
            while (field = busComp.EnumFields (bFirst))
            {
              bFirst = false;
              if (field)
              {
                s_teller.SetFieldValue (deviceName, field.name, busComp.GetFieldValue(field.name));
              }
            }
          } else {
            var fieldArray = tmpStr.split(',');
            
            var index=0;
            while(index < fieldArray.length)
            {
              fieldValue = busComp.GetFieldValue(fieldArray[index]);
//		alert("Buscomp: " + fieldValue + " " + fieldArray[index]);
              if (fieldValue)
                s_teller.SetFieldValue(deviceName, fieldArray[index], fieldValue);
              index++;
            }
          }
        }
      }
      s_teller.PrintReceipt (deviceName);
    }
  } else if (method=="UpdatePassbook") {
  } else
    return top._swescript.JSSListApplet_DoInvokeMethod (applet, method, inputPropSet);
}

function JSSSWEFrameListFATlrDevice ()
{
}

new JSSSWEFrameListFATlrDevice ();

JSSSWEFrameListFATlrDevice.prototype = new top._swescript.JSSListApplet ();

JSSSWEFrameListFATlrDevice.prototype.CardInserted = JSSSWEFrameListFATlrDevice_CardInserted;
JSSSWEFrameListFATlrDevice.prototype.InitializeSiebelTellerControl = JSSSWEFrameListFATlrDevice_InitializeSiebelTellerControl;
JSSSWEFrameListFATlrDevice.prototype.OpenCardReaderFailed = JSSSWEFrameListFATlrDevice_OpenCardReaderFailed;
JSSSWEFrameListFATlrDevice.prototype.OpenCardReaderOK = JSSSWEFrameListFATlrDevice_OpenCardReaderOK;
JSSSWEFrameListFATlrDevice.prototype.OpenPinPadFailed = JSSSWEFrameListFATlrDevice_OpenPinPadFailed;
JSSSWEFrameListFATlrDevice.prototype.OpenPinPadOK = JSSSWEFrameListFATlrDevice_OpenPinPadOK;
JSSSWEFrameListFATlrDevice.prototype.OpenPrinterFailed = JSSSWEFrameListFATlrDevice_OpenPrinterFailed;
JSSSWEFrameListFATlrDevice.prototype.OpenPrinterOK = JSSSWEFrameListFATlrDevice_OpenPrinterOK;
JSSSWEFrameListFATlrDevice.prototype.PinPadDataRead = JSSSWEFrameListFATlrDevice_PinPadDataRead;
JSSSWEFrameListFATlrDevice.prototype.DoCanInvokeMethod = JSSSWEFrameListFATlrDevice_DoCanInvokeMethod;
JSSSWEFrameListFATlrDevice.prototype.DoInitialize = JSSSWEFrameListFATlrDevice_DoInitialize;
JSSSWEFrameListFATlrDevice.prototype.DoInvokeMethod = JSSSWEFrameListFATlrDevice_DoInvokeMethod;
