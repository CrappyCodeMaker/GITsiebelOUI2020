var m_bCrdRdr = false;
var m_bPinPad = false;
var m_bJrnPtr = false;
var m_bPasPtr = false;
var m_bRcpPtr = false;
var s_teller  = null;
var s_app     = top._swe._sweapp.S_App;
var contactRowID;

function JSSSWEFrameFATlrDevice_DoCanInvokeMethod (applet, method)
{
   if (applet.GetUserProp ("SiebelTellerEnable") != true)
      return top._swescript.JSSApplet_DoCanInvokeMethod (applet, method);

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
      else if (method == "ReadPin")
      {
         return m_bPinPad;
      }
      else if (method == "UpdatePassbook")
      {
         return m_bPasPtr;
      }
   }
   return top._swescript.JSSApplet_DoCanInvokeMethod (applet, method);
}

function JSSSWEFrameFATlrDevice_CardInserted (applet, id)
{
   var track1, track2, track3;
   var deviceName;

   alert ("MESSAGE: Card Inserted!");
   //deviceName = applet.GetUserProp("Card Reader Name");
   deviceName = this.GetUserProp("Card Reader Name");
   track1 = s_teller.Track1 (deviceName);
   track2 = s_teller.Track2 (deviceName);
   track3 = s_teller.Track3 (deviceName);
   contactRowID = track1;

   s_teller.EjectCard (deviceName);
   return true;
}

function JSSSWEFrameFATlrDevice_InitializeSiebelTellerControl (applet, id)
{
   //alert ("Initializing Siebel Teller Control...");
   s_teller = applet.GetControlElement("SiebelTellerActiveXControl");
   if (s_teller)
   {
      s_teller.OpenPrinter (applet.GetUserProp("Journal Printer Name"));
      s_teller.OpenCardReader (applet.GetUserProp("Card Reader Name"));
      s_teller.OpenPinPad (applet.GetUserProp("Pin Pad Name"));
   }
}

function JSSSWEFrameFATlrDevice_OpenCardReaderFailed (applet, id)
{
   alert ("MESSAGE: Open Card Reader Failed!");
   m_bCrdRdr = false;
   return true;
}

function JSSSWEFrameFATlrDevice_OpenCardReaderOK (applet, id)
{
   alert ("MESSAGE: Open Card Reader OK!");
   m_bCrdRdr = true;
   return true;
}

function JSSSWEFrameFATlrDevice_OpenPrinterFailed (applet, id)
{
   alert ("MESSAGE: Open Printer Failed!");
   m_bJrnPtr = false;
   m_bPasPtr = false;
   m_bRcpPtr = false;
   return true;
}

function JSSSWEFrameFATlrDevice_OpenPrinterOK (applet, id)
{
   alert ("MESSAGE: Open Printer OK!");
   m_bJrnPtr = true;
   m_bPasPtr = true;
   m_bRcpPtr = true;
   return true;
}


function JSSSWEFrameFATlrDevice_PinPadDataRead (applet, id)
{
   alert ("MESSAGE: Pin Pad Data Read!");
   return true;
}

function JSSSWEFrameFATlrDevice_OpenPinPadFailed (applet, id)
{
   alert ("MESSAGE: Open Pin Pad Failed!");
   m_bPinPad = false;
   return true;
}

function JSSSWEFrameFATlrDevice_DoInitialize (applet)
{
   if (applet.GetUserProp ("SiebelTellerEnable") != true)
      return top._swescript.JSSApplet_DoInitialize (applet);

   if (this.GetControlElement("SiebelTellerActiveXControl")==null)
   {
      alert ("No SiebelTellerActiveXControl defined.  Applet won't be able to perform Teller Device activities.");
   }
   else if (s_teller == null)
   {
      JSSSWEFrameFATlrDevice_InitializeSiebelTellerControl (applet);
   }

   return top._swescript.JSSApplet_DoInitialize (applet);
}

function JSSSWEFrameFATlrDevice_DoInvokeMethod (applet, method, inputPropSet)
{
   var busComp = this.GetBusComp();
   var field, fieldValue;
   var bFirst;
   var deviceName, deviceForm, deviceMedia;

   if (applet.GetUserProp ("SiebelTellerEnable") != true)
      return top._swescript.JSSApplet_DoInvokeMethod (applet, method, inputPropSet);

   if (method == "PrintJournal")
   {
      deviceName = applet.GetUserProp("Journal Printer Name");
      deviceMedia = applet.GetUserProp("Journal Printer Media");
      deviceForm = applet.GetUserProp("Journal Printer Form");
      if (s_teller && m_bJrnPtr)
      {
         s_teller.LoadForm (deviceName, deviceMedia, deviceForm);
         if (busComp)
         {
            if (busComp.GetActiveRow() != -1)
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
         }
         s_teller.PrintJournal (deviceName);
      }
   }
   else if (method == "PrintPassbook")
   {
      deviceName = applet.GetUserProp("Passbook Printer Name");
      deviceMedia = applet.GetUserProp("Passbook Printer Media");
      deviceForm = applet.GetUserProp("Passbook Printer Form");
      if (s_teller && m_bPasPtr)
      {
         s_teller.LoadForm (deviceName, deviceMedia, deviceForm);
         if (busComp)
         {
            if (busComp.GetActiveRow() != -1)
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
         }
         s_teller.PrintPassbook (deviceName);
      }
   }
   else if (method == "PrintReceipt")
   {
      deviceName = applet.GetUserProp("Receipt Printer Name");
      deviceMedia = applet.GetUserProp("Receipt Printer Media");
      deviceForm = applet.GetUserProp("Receipt Printer Form");
      if (s_teller && m_bRcpPtr)
      {
         s_teller.LoadForm (deviceName, deviceMedia, deviceForm);
         if (busComp)
         {
            if (busComp.GetActiveRow() != -1)
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
         }
         s_teller.PrintReceipt (deviceName);
      }
   }
   else if (method == "ReadCard")
   {
      deviceName = applet.GetUserProp("Card Reader Name");
      deviceForm = applet.GetUserProp("Card Reader Form");
      if (s_teller && m_bCrdRdr)
      {
         s_teller.WaitForCardReaderInsert (deviceName, deviceForm);

         this.DoInvokeMethod (applet, "ReadPin", inputPropSet);

         inputPropSet.SetProperty ("Contact Row Id", contactRowID);
         inputPropSet.SetProperty ("ProcessName", "FINS Teller Goto View Workflow");
         var service = top._swe._sweapp.S_App.GetService ("FINS Teller Device Service");
         service.InvokeMethod ("Navigate", inputPropSet);
      }
   }
   else if (method == "ReadPin")
   {
      deviceName = applet.GetUserProp ("Pin Pad Name");
      if (s_teller && m_bPinPad)
      {
         s_teller.WaitForPinPadData (deviceName);
      }
   }
   else if (method == "UpdatePassbook")
   {
      deviceName = applet.GetUserProp("Passbook Printer Name");
      deviceMedia = applet.GetUserProp("Passbook Printer Media");
      deviceForm = applet.GetUserProp("Passbook Printer Form");
      if (s_teller && m_bPasPtr)
      {
      }
   }
   else
      top._swescript.JSSApplet_DoInvokeMethod (applet, method, inputPropSet);
}

function JSSSWEFrameFATlrDevice_OpenPinPadOK (applet, id)
{
   alert ("MESSAGE: Open Pin Pad OK!");
   m_bPinPad = true;
   return true;
}

function JSSSWEFrameFATlrDevice ()
{
}

new JSSSWEFrameFATlrDevice ();

JSSSWEFrameFATlrDevice.prototype = new top._swescript.JSSApplet ();

JSSSWEFrameFATlrDevice.prototype.DoCanInvokeMethod = JSSSWEFrameFATlrDevice_DoCanInvokeMethod;
JSSSWEFrameFATlrDevice.prototype.CardInserted = JSSSWEFrameFATlrDevice_CardInserted;
JSSSWEFrameFATlrDevice.prototype.InitializeSiebelTellerControl = JSSSWEFrameFATlrDevice_InitializeSiebelTellerControl;
JSSSWEFrameFATlrDevice.prototype.OpenCardReaderFailed = JSSSWEFrameFATlrDevice_OpenCardReaderFailed;
JSSSWEFrameFATlrDevice.prototype.OpenCardReaderOK = JSSSWEFrameFATlrDevice_OpenCardReaderOK;
JSSSWEFrameFATlrDevice.prototype.OpenPrinterFailed = JSSSWEFrameFATlrDevice_OpenPrinterFailed;
JSSSWEFrameFATlrDevice.prototype.OpenPrinterOK = JSSSWEFrameFATlrDevice_OpenPrinterOK;
JSSSWEFrameFATlrDevice.prototype.PinPadDataRead = JSSSWEFrameFATlrDevice_PinPadDataRead;
JSSSWEFrameFATlrDevice.prototype.OpenPinPadFailed = JSSSWEFrameFATlrDevice_OpenPinPadFailed;
JSSSWEFrameFATlrDevice.prototype.DoInitialize = JSSSWEFrameFATlrDevice_DoInitialize;
JSSSWEFrameFATlrDevice.prototype.DoInvokeMethod = JSSSWEFrameFATlrDevice_DoInvokeMethod;
JSSSWEFrameFATlrDevice.prototype.OpenPinPadOK = JSSSWEFrameFATlrDevice_OpenPinPadOK;
