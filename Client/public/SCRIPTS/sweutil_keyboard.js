// SI keyboard accelorators for 508 compliance

var SWEHTMLFrames      = new Array (); 
var SWEApplets         = new Array ();
var SWECachedFrames    = null;
var ActiveFrameId      = -1;

var CurrentAppletIndex = null;
var FocusState         = null;

var bArraysShouldBeRefreshed = true;
var bFocusShouldBeReset      = false;
var TempFirstApplet          = null; 

var CurrentFrameIndex  = null;

var CTIHandler         = 0;
var Accelerators       = new Object ();
var MaxTag             = 1;
var MaxIndex           = 100000;

var PopupAppletName    = "";
var PopupActiveControlId = null;
var PopupAppletMode    = "";
var PopupAccelerators  = ""
var oldPopupAppletName    = "";
var PopupAppletMode    = "";

var ShortParams        = null;

var ActiveControlId     = null;
var bAccessibleEnhanced = false; 
var bRefreshState       = false;
var SearchCenterApplet  = "Search Selection Applet";
var CustomerDBApplet    = "Persistent Customer Dashboard Applet";
var bIgnoreControlFocus = false;

var ViewNameForViewSummary;
var ViewSummary;

var g_selectediHelpId;              // global variable to have id for selected iHelp Node
var g_iHelpIdArray = new Array();   // global arry to have ids of iHelp Nodes
var selectediHelpIndex = 0;         // variable to have selecteed node id index	
var CurrFocusiHelpIndx = 0;         // variable to have the index of the current focus node id

var TreeNodeIds			= new Array (); // Array to have all Tree Node Control Id's 
var	ActiveTreeNodeId	= null;         // Selected Tree Node Control Id
var sTreeNodeIndx		= 0;            // Selected Tree Node position in array
var CurrFocusNodeIndx	= 0;           // Currently Focussed Tree Node position in array

// The use of separate variables to store browser type is a weak
// design. It would be better to use a single variable, e.g. BrowserType.
var NS6 = false;
var IE = false;
if (navigator.userAgent.indexOf("MSIE") >= 0)
{
   // "MSIE" uniquely identifies Microsoft browsers.
   IE = true;
}
else if (navigator.userAgent.indexOf("Netscape") >= 0)
{
   // "Netscape" uniquely identifies Netscape 6 or later browsers
   NS6 = true;
}
else
{
   // If we reach this block, then one of the following conditions is true:
   //    1) userAgent contains a vendor string not tested above.
   //    2) userAgent does not contain a vendor string. This happens in
   //       two cases:
   //          2a) The browser is Netscape 4 or ealier.
   //          2b) The browser is Mozilla.org.
   // There is no guaranteed way to distinguish condition 1) from 2).
   
   if (navigator.userAgent.indexOf("Mozilla") != -1 ||
       navigator.userAgent.indexOf("Chrome") != -1 || 
       navigator.userAgent.indexOf("compatible") >= 0)
   {
      // If userAgent does not begin with Mozilla, or does contain
      // "compatible", then browser is defintely not Netscape or Mozilla.
      // Do nothing.
   }
   else
   {
      // Browser is most likely (but not guaranteed) to be Netscape4 or Mozilla.
      
      if (parseInt(navigator.appVersion) < 5)
      {
         // The browser is Netscape 4 or earlier.
         // Do nothing.
      }
      else
      {
         // The browser is Mozilla.org.
      
         // Currently this file (sweutil_keyboard.js) does not contain any code
         // that is specific to Mozilla.org. So use the same code as Netscape6.
         NS6 = true;
      }
   }
}

var gCtrl = false; // these two global variables are used to determine the state of ctrl and alt keys for NS6 
var gAlt  = false;

function Test (x)
{
   return (x != null && typeof (x) != 'undefined');
}

function ClearAccelerators ()
{
//   Accelerators = new Object ();
}

function SetAccelerators (Applet, Acceler)
{
   Accelerators[Applet] = Acceler;
}

function FindByProp (arr, field, value)
{
   var i = 0;
   var len =  arr.length;

   while ((i < len) && (arr[i] == null || arr[i][field] != value)) i++;

   if (i >= len) i = -1;
 
   return i;
}

function FindByValue (arr, value)
{
   var i = 0;
   var len =  arr.length;

   while ((i < len) && (arr[i] != value)) i++;

   if (i >= len) i = -1;

   return i;
}

function FindFrameByName (frmarr, frm)
{
   if (typeof(frm.name) == "undefined" || typeof(frm.name) == "unknown")
      return -1;

   var i = 0;
   var len =  frmarr.length;

   while ((i < len) && 
          ((frmarr[i] == null) || 
           (typeof(frmarr[i].name) == "undefined") || 
           (typeof(frmarr[i].name) == "unknown") || 
           (frmarr[i].name != frm.name))) 
   {
      i++;
   }

   if (i >= len)
   {
     i = -1;
   }

   return i;
}

function getElementByIdX (doc, ElementId, ElementName /* For NS4.7 */)
{   
   if (ElementId == "") return null;
   var Res;
   if (Test(doc.getElementById))
   {        
      Res = doc.getElementById (ElementId);       
      
      if (Res != null || !NS6) return Res;
      if (!Test(ElementName)) ElementName = ElementId;
   }
   
   var i =  FindByProp (doc.anchors, "name", ElementId);

   if (i != -1) return doc.anchors[i];

   var j = 0;

   while (j < doc.forms.length && i == -1) 
   {
      i = FindByProp (doc.forms[j].elements, "id", ElementId);
      if (i == -1)
      {
         i = FindByProp (doc.forms[j].elements, "name", ElementName);
      }
      j++;
   }

   if (i != -1) return doc.forms[j-1].elements[i];

   return null;     
}

function CompareApplets (a, b)
{
   return (a.tag - b.tag);
}


function RefreshAppletsArray () 
{
   var i = 0;
   var j = 0;
   var k = 0; 
   
   for (i = 0; i < SWEApplets.length; i++)
   {
      j = null;
      for (k=0; k < SWEHTMLFrames.length; k++)
      {
         if (SWEApplets[i].Target == SWEHTMLFrames[k])
         {
            j = k;
            break;      
         }
      }       

      if (j != null && Test (getElementByIdX (SWEApplets[i].Target.document, SWEApplets[i].Id)))
      {
         SWEApplets[i].tag = j * MaxTag + SWEApplets[i].tag; 
      }
      else
      {
         SWEApplets[i].tag = MaxIndex; // we should delete this applet 
      }
   }

//   var NewCurrentAppletTag = null;
//   if (Test (CurrentAppletIndex)) NewCurrentAppletTag = SWEApplets[CurrentAppletIndex].tag;
   
   SWEApplets.sort (CompareApplets);
   
   i = SWEApplets.length; 
   while (i > 0 && SWEApplets[i - 1].tag == MaxIndex) 
   {
     SWEApplets.length = SWEApplets.length - 1;
     i--;
   }   
  
   for (i = 0; i < SWEApplets.length; i++)
   {
      SWEApplets[i].tag = i;
   }

   MaxTag = SWEApplets.length;

//   var index = FindByProp (SWEApplets, "tag", NewCurrentAppletTag);   
//   if (index == -1) index = null;
//   SetCurrentAppletIndex(index);
}

function RefreshFramesArray()
{
   var NewSWEHTMLFrames = new Array();

   function SortFrames(frm)
   {
      if ((frm.frameElement != null) && (frm.frameElement.Height <= 0 || frm.frameElement.Width <= 0))
      { 
         return; 
      } 

      for (var k = 0; k < frm.length; k++)
      {
         // 12-EISQIY - we removed a try/catch block above since certain versions
         // of Netscape cannot interpret them and instead added the following line
         // for checking whether we have access to a particular frame
         if (typeof(frm[k].frameElement) != "undefined" && typeof(frm[k].frameElement) != "unknown")
            SortFrames(frm[k].frames);
      }
 
      var j = FindByValue(SWEHTMLFrames, frm);
      if (j == -1)
        j = FindFrameByName(SWEHTMLFrames, frm);
      if (j != -1)
         NewSWEHTMLFrames[NewSWEHTMLFrames.length] = frm;
      else if (SWECachedFrames != null && ActiveFrameId >= 0)
      {
         if ((SWECachedFrames[ActiveFrameId].ViewFrames != null) && 
             (j = FindByValue(SWECachedFrames[ActiveFrameId].ViewFrames, frm)) != -1)
         {
            NewSWEHTMLFrames[NewSWEHTMLFrames.length] = frm;
         }
      }
   }

   var CurrentFrame = null;

   if (CurrentFrameIndex != null) CurrentFrame = SWEHTMLFrames[CurrentFrameIndex];
 
   
   // 12-IWF0VK
   // if (SWEIsHighInteract != true)
   {
      SortFrames(frames);
   }
   
   SWEHTMLFrames = NewSWEHTMLFrames; 

   CurrentFrameIndex = FindByValue(SWEHTMLFrames, CurrentFrame);
   if (CurrentFrameIndex == -1) CurrentFrameIndex = null; 
}

function OnFocusControl(control)
{
   var s = control.id;      
   if(s.substring(0,12) == "SWEEndApplet")
	{ 	   
	   if(CurrentAppletIndex ==  SWEApplets.length - 1)
				GoToApplet(0);
		else
				NavigateApplets(false);	
	}
   if (bRefreshState) return;
   if (Test(control.oldOnFocus))
   {
      control.oldOnFocus();
   }
   SetActiveControlId (control);    
   if ((FocusState != null) && (FocusState.eShowMode == 5) /* SWEModeQueryE */)
      UpdateCSQMessage(control);        
}

function OnBlurControl(control)
{
   if (bRefreshState) return;
   if (Test(control.oldOnBlur))
   {
      control.oldOnBlur();
   }
   ActiveControlId = null;
}

function OnPopupFocusControl(control)
{
   if (Test(control.oldOnFocus))
   {
      control.oldOnFocus();
   }
   
   PopupActiveControlId = control.id;     
    
   if (PopupActiveControlId == "" && control.name != "")
   {
      PopupActiveControlId = control.name;
   }
}

var OnFocusFunction = new Function ("OnFocusControl(this)");
var OnBlurFunction = new Function ("OnBlurControl(this)");
var OnPopupFocusFunction = new Function ("OnPopupFocusControl(this)");

function SetFocusEventsForArray(arr, funct)
{
   var i = 0;   
   for (i = 0; i < arr.length; i++)
   {
      if (arr[i].type == "hidden") continue;
      
      if (Test(arr[i].onfocus))
      {
         arr[i].oldOnFocus = arr[i].onfocus;
      }
      
      arr[i].onfocus = funct;
   }
}

function SetBlurEventsForArray(arr, funct)
{
   var i = 0;   
   for (i = 0; i < arr.length; i++)
   {
      if (arr[i].type == "hidden") continue;

      if (Test(arr[i].onblur))
      {
         arr[i].oldOnBlur = arr[i].onblur;
      }

      arr[i].onblur = funct;
   }
}

function SetFocusEvents()
{  
// return for NS4.7 
      
   var i = 0;
   var j = 0;
     
   for (i = 0; i < SWEHTMLFrames.length; i++)
   {
      frame = SWEHTMLFrames[i];
      
      // FR 12-S3KBD9 If frame.SWEDoRefresh is not present, we don't need to
      // call SetFocusEventsForArray because this frame is not for a view.
      // If we do, though it's going to affect the correctness of the 
      // functionalify, the performance could be adversively impact in case 
      // the page is Sitemap which contains thousands of links.
      if (frame["bSWEFocusSet"] == true || 
          !Test(frame.SWEDoRefresh)) continue;
      
      frame["bSWEFocusSet"] = true;
      
      SetFocusEventsForArray(frame.document.getElementsByTagName("A"), OnFocusFunction);
      SetBlurEventsForArray(frame.document.getElementsByTagName("A"), OnBlurFunction);

      for (j =0; j< frame.document.forms.length; j++)
      {
         SetFocusEventsForArray(frame.document.forms[j].elements, OnFocusFunction);
         SetBlurEventsForArray(frame.document.forms[j].elements, OnBlurFunction);
      }
   }
}

function RefreshArrays()
{
   if (bRefreshState) return;
   
   bRefreshState = true;  
   
   while (bArraysShouldBeRefreshed)
   {
      bArraysShouldBeRefreshed = false;   
      RefreshFramesArray (); 
      RefreshAppletsArray ();   
      if (bArraysShouldBeRefreshed) continue;
      SetFocusEvents();
      if (bArraysShouldBeRefreshed) continue;
      
      if (TempFirstApplet == null)
      {
         SetFocus(true, null, null);
      }
      else
      {
         SetFocus(false, TempFirstApplet, null);
         TempFirstApplet = null;
      }               
   }      
      
   bRefreshState = false;
}


function RefreshClient()
{ 
   bFocusShouldBeReset = true;
   // Fix for 12-1OH39ZG The Current Applet was getting lost after the 'Page Load' Dialog.
   // Refreshing the Arrays and setting the focus
   if (bAccessibleEnhanced) 
   {
        bArraysShouldBeRefreshed = true;
   }
   RefreshArrays();
}

function InitMethod (Method, Target, ObjID, URL, JS, ObjName)
{
   if (Method == "GotoAppletMenu")
   {
      var i = FindByProp (SWEApplets, "Id", ObjID.substring(7));
      if (i != -1) SWEApplets[i].Menu = ObjID;
      if (i != -1) SWEApplets[i].MenuName = ObjName;
      
   }
   else if (Method == "ViewList")
   {
      var i = FindByProp (cmdMap, "Method", Method);
      if ((i != -1) && (cmdMap[i].ObjID == null))
      {
         cmdMap[i].Target = Target;
         cmdMap[i].ObjID = ObjID;
         cmdMap[i].ObjName = (Test(ObjName)) ? ObjName : ObjID;
      }
   } // added to have shortcut keys Tree Control and iHelp navigation
   else if(Method == "GotoSelectedTreeNode" || Method == "GotoNextTreeNode" || Method == "GotoPrevTreeNode"
  ||Method == "GotoSelectediHelpNode" || Method == "GotoNextiHelpNode" || Method == "GotoPreviHelpNode")
   {
      var i = FindByProp (cmdMap, "Method", Method);
      if (i == -1)
      {
         cmdMap[cmdMap.length] = {Method: Method};
         i = cmdMap.length - 1;
      }
      if(Method == "GotoSelectedTreeNode")
      {
         ActiveTreeNodeId = ObjID;
      }
      cmdMap[i].Target = Target;
      cmdMap[i].ObjID = ObjID;
      cmdMap[i].ObjName = (Test(ObjName)) ? ObjName : ObjID;
    
   }
   else
   {
      var i = FindByProp (cmdMap, "Method", Method);

      if (i == -1)
      {
         cmdMap[cmdMap.length] = {Method: Method};
         i = cmdMap.length - 1;
      
      }

      cmdMap[i].Target = Target;
      cmdMap[i].URL = URL; 
      cmdMap[i].JS = JS; 
      cmdMap[i].ObjID = ObjID;
      cmdMap[i].ObjName = (Test(ObjName)) ? ObjName : ObjID;
   }
}

function GoToElement (FrameObj, ElementId, ElementName)
{

   if (!Test (FrameObj)) return false;

   FrameObj.focus ();

   var elm = getElementByIdX (FrameObj.document, ElementId, ElementName);

   if (!Test (elm))
   {
      return false;
   } 
   
   // Allow the page to anchor before applying the element focus, otherwise the
   // anchor would override the amount scrolled to bring the element into focus,
   // possibly causing the element to not appear in the active client area. 
   Top().elemToFocus = elm;
   this.window.setTimeout ("if (Top().elemToFocus != null && typeof(Top().elemToFocus) != 'undefined') {Top().elemToFocus.focus (); Top().elemToFocus = null;}", 150);  
   
   return true;  
}

function GoToFirstAnchor(Target)
{
//The following code should be used only in IE and NS6
   if (NS6 || IE)
   {
      var i;
      var A = Target.document.getElementsByTagName("A");  

// This should be done in "eval", because NS4.78 doesn't support try/catch    
      eval(" for (i = 0; i < A.length; i++){try {A[i].focus(); break; } catch(e) {}}");            
   }      
}

function ExecuteMethod (index)
{
   var retCode = true;
   var bSetFocusToFrame = true;
   if ((index >= 0) && (index < cmdMap.length))
   {
      cmd = cmdMap[index];
	  
  // New shortcut keys for iHelp navigation
      if(cmd.Method == "GotoNextiHelpNode" && cmd.Target != null && typeof (cmd.Target) != 'undefined' )
      {
         if(CurrFocusiHelpIndx == (g_iHelpIdArray.length -1))
         {
            cmd.ObjID=g_iHelpIdArray[CurrFocusiHelpIndx];
         }
         else
         {
            CurrFocusiHelpIndx++;
            cmd.ObjID=g_iHelpIdArray[CurrFocusiHelpIndx];
         }
		 bSetFocusToFrame = false;
         OnFocusFrame(cmd.Target);
      }
      else if(cmd.Method == "GotoPreviHelpNode" && cmd.Target != null && typeof (cmd.Target) != 'undefined' )
      {
         if(CurrFocusiHelpIndx==0)
         {
            cmd.ObjID=g_iHelpIdArray[0];
         }
         else
         {
            cmd.ObjID=g_iHelpIdArray[CurrFocusiHelpIndx-1];
            CurrFocusiHelpIndx--;
         }
		 bSetFocusToFrame = false;
         OnFocusFrame(cmd.Target);
      }
      else if(cmd.Method == "GotoSelectediHelpNode" && cmd.Target != null && typeof (cmd.Target) != 'undefined')
      {
         cmd.ObjID=g_selectediHelpId;
         CurrFocusiHelpIndx=selectediHelpIndex;
         OnFocusFrame(cmd.Target);
      }
	  else if(cmd.Method == "GotoNextTreeNode" && cmd.Target != null && typeof (cmd.Target) != 'undefined' )
	  {
			
		if(CurrFocusNodeIndx >= (TreeNodeIds.length -1))
		{
			cmd.ObjID=TreeNodeIds[CurrFocusNodeIndx];
			
		}else
		{
			CurrFocusNodeIndx++;
			cmd.ObjID=TreeNodeIds[CurrFocusNodeIndx];
			
		}
		bSetFocusToFrame = false;
		OnFocusFrame(cmd.Target); 
		
			
	  }
	  else if(cmd.Method == "GotoPrevTreeNode" && cmd.Target != null && typeof (cmd.Target) != 'undefined' )
	  {
		if(CurrFocusNodeIndx<=0)
		{
			cmd.ObjID=TreeNodeIds[CurrFocusNodeIndx];
			
		}else
		{
			cmd.ObjID=TreeNodeIds[CurrFocusNodeIndx-1];
			CurrFocusNodeIndx--;
		}
		bSetFocusToFrame = false;
		OnFocusFrame(cmd.Target);
		
	  }
	  else if(cmd.Method == "GotoSelectedTreeNode" && cmd.Target != null && typeof (cmd.Target) != 'undefined')
	  {
		CurrFocusNodeIndx = sTreeNodeIndx;
		OnFocusFrame(cmd.Target);
		
	  }
	  else if (cmd.Target != null && typeof (cmd.Target) != 'undefined') 
      {
         OnFocusFrame(cmd.Target);
      }         

      if (cmd.URL != null && typeof (cmd.URL) != 'undefined')
      {
         if (Test(cmd.Target))
            cmd.Target.document.location.href = cmd.URL;
         else 
            retCode = false;
      } 
      else if (cmd.JS != null && typeof (cmd.JS) != 'undefined') 
      {
       //  eval (cmd.JS); 
         setTimeout(cmd.JS, 50);         
      } 
      else if (cmd.ObjID != null && typeof (cmd.ObjID) != 'undefined') 
      {
	     if(bSetFocusToFrame)
		 {
            retCode = GoToElement (cmd.Target, cmd.ObjID, cmd.ObjName);
		 }
		 else
		 {
		    retCode = GoToElementWithOutSetFocusOnFrame (cmd.Target, cmd.ObjID, cmd.ObjName);
		 }
      }
      else
      {
         retCode = GoToFrame(CurrentFrameIndex);      
      }
      
      if (/* bAccessibleEnhanced && */
            (cmd.Method == "GotoCTIToolBar" || cmd.Method == "GotoMessageBar" ) && Test(cmd.Target))
      {
         GoToFirstAnchor(cmd.Target);
      }      
   }

   return retCode;
}

function OnFocusAppletEventHandler (Id)
{
   var i = FindByProp (SWEApplets, "Id", Id);
   if (i != -1) SetCurrentAppletIndex(i);
}

function InitApplet (AppletFullName, AppletId, ViewName, eShowMode, Target) 
{
   bArraysShouldBeRefreshed = true; 
   
   ViewNameForViewSummary = ViewName;
   ViewSummary = "";

   var AppIndex = FindByProp(SWEApplets, "Id", AppletId); 

   if (AppIndex != -1)
   {
      SWEApplets[AppIndex].Target = Target; 
      SWEApplets[AppIndex].Name = AppletFullName;
      SWEApplets[AppIndex].ViewName = ViewName;
      SWEApplets[AppIndex].highLightInfo = null;
      SWEApplets[AppIndex].tag = MaxTag++;
      SWEApplets[AppIndex].eShowMode = eShowMode;      
   }
   else
   {
      SWEApplets[SWEApplets.length] = {Id: AppletId, Target: Target, ViewName : ViewName,
                     Name: AppletFullName, highLightInfo: null, tag:MaxTag++, eShowMode: eShowMode,
                     MainControl: null};
      if (AppletFullName == SearchCenterApplet) OnOpenSearchCenter();                     
   }

   var elm = getElementByIdX (Target.document, AppletId);
   if (elm != null)
   {
      elm.onfocus = new Function ("OnFocusAppletEventHandler('" + AppletId + "')"); 
   }
}

function AddAppletProperties (AppletId, AppletForm, AppletMainControl) 
{
   var AppIndex = FindByProp(SWEApplets, "Id", AppletId); 

   if (AppIndex != -1)
   {
      SWEApplets[AppIndex].Form        = AppletForm; 
      SWEApplets[AppIndex].MainControl = AppletMainControl; 
   }
}

function GoToApplet (index, ControlName, bRestorePrevValue)
{   
   if (bArraysShouldBeRefreshed) RefreshArrays ();
   if (!Test(bRestorePrevValue)) bRestorePrevValue = false;
   
   var len = SWEApplets.length;

   if (len == 0) return false;

   index = (index + len) % len;

   with (SWEApplets[index])
   {
      if (!Test (Target)) return "refresh";

      // Show Focus
      SetCurrentAppletIndex(index);   
      
      Target.focus ();
           
// Target.document.location.hash = "#"+Id          
      
      //Goto Default Control
      // * Try to go to ControlName
      // * Try to go to MainName     
      // * Try to go to AppletMenu
      // * Try to go to AppletTitle
      
      var Res = Test(ControlName) && GoToElement(Target, ControlName);

       
      

      if (!Res && (!bAccessibleEnhanced || bRestorePrevValue))
      {
         Res = (MainControl != ""  && GoToElement(Target, MainControl));
      }      
      
      if (!Res && !bAccessibleEnhanced)
      {
         Res = GotoAppletMenu();
      }      


      if (!Res && bAccessibleEnhanced)       //Goto Default control if any, else Goto Applet Title        
      {
	   if ((SWEApplets[index].MainControl != null || SWEApplets[index].MainControl != ""))
       {
         var elm = getElementByIdX (SWEApplets[index].Target.document, SWEApplets[index].MainControl);
         if (elm != null && elm != "")
           elm.focus();
       }
	   else 
	   {	
		 // Target.document.location.hash = "#"+Id;    //scroll to the applet
		 var elm = getElementByIdX (Target.document, Id);
		 if (!Test (elm)) return "refresh";      
		  elm.focus ();
        }
      }             

   }      

}
function NavigateApplets (backward)
{
   var Result;
   var AppletIndex;

   if (CurrentAppletIndex == null)
      AppletIndex = 0; 
   else
      AppletIndex = backward? (CurrentAppletIndex - 1) : (CurrentAppletIndex + 1);

   Result = GoToApplet (AppletIndex); 

   if (Result == "refresh")
   {
      RefreshAppletsArray ();
      GoToApplet (0); 
   }
}

function OnUnloadFrame(Target)
{
   var i = FindByValue(SWEHTMLFrames, Target);
   if (i != -1)
   {
      SWEHTMLFrames[i] = null;
      bArraysShouldBeRefreshed = true;
   } 

   if (SWECachedFrames != null && ActiveFrameId >= 0)
   {
      var Frames = SWECachedFrames[ActiveFrameId].ViewFrames;
      if (Frames != null)
      {
         i = FindByValue(Frames, Target);
         if (i != -1)
         {
            Frames[i] = null;
         }
      }
   }
}

function OnFocusFrame(Target)
{
   var i = FindByValue(SWEHTMLFrames, Target);
   if (i != -1) CurrentFrameIndex = i;
}

var OnUnloadFrameFunction = new Function ("OnUnloadFrame(this)"); 
var OnFocusFrameFunction = new Function ("OnFocusFrame(this)"); 
var OnKeyDown = new Function ("HandleKeyDown(this.parentWindow.event, this)");

function InitFrame (Target)
{
   bArraysShouldBeRefreshed = true; 

   if (SWECachedFrames != null && ActiveFrameId >= 0)
   {
      if(IsContainedIn(Target, SWECachedFrames[ActiveFrameId].name))
      {
         if (SWECachedFrames[ActiveFrameId].ViewFrames == null)
            SWECachedFrames[ActiveFrameId].ViewFrames = new Array();

         var VFsize = SWECachedFrames[ActiveFrameId].ViewFrames.length;
         SWECachedFrames[ActiveFrameId].ViewFrames[VFsize] = Target;
         Target.onunload = OnUnloadFrameFunction;
         Target.onfocus  = OnFocusFrameFunction;
         return;
      }
   }

   if (FindByValue(SWEHTMLFrames, Target) == -1)
   {
      SWEHTMLFrames[SWEHTMLFrames.length] = Target;
      Target.onunload = new Function ("OnUnloadFrame(this)"); 
      Target.onfocus  = new Function ("OnFocusFrame(this)"); 
   }
   
   
   
   if (NS6)
   {  
      Target.document.addEventListener("keydown",HandleKeyDown,true);
      Target.document.addEventListener("keypress",HandleKeyPress,true);
//      Target.document.captureEvents(Event.KEYDOWN);
//      Target.document.onkeydown = HandleKeyDown;   
   }     
   else if (IE)
   {
      Target.document.onkeydown = OnKeyDown;
   }
}

function GoToFrame (index)
{
   if (bArraysShouldBeRefreshed) RefreshArrays();
   
   len = SWEHTMLFrames.length;

   if (len == 0) return true;

   index = (index + len) % len; 

   SWEHTMLFrames[index].focus();
   CurrentFrameIndex = index; 
   return true;
}


function NavigateFrames (backward)
{
   var FrameIndex;

   if (CurrentFrameIndex == null)
      FrameIndex = 0;
   else
      FrameIndex = backward? (CurrentFrameIndex - 1) : (CurrentFrameIndex + 1);

   GoToFrame (FrameIndex);
}

function GotoAppletMenu()
{
   if (bArraysShouldBeRefreshed) RefreshArrays ();
   if (SWEApplets.length > 0)
   {
      if (CurrentAppletIndex == null ||  CurrentAppletIndex > SWEApplets.length || CurrentAppletIndex <0) 
      {
         SetCurrentAppletIndex(0);
      }
      
      // Skipping Netscape because we do not support JAWS for Netscape
      
      if (bAccessibleEnhanced && IE && CurrentAppletIndex != null) 
      {
         // This is a hack for JAWS. 
         // If "PC Cursor" is set to the menu, but the "Virtual Cursor" is not the following code
         // forces JAWS to set the "Virtual Cursor" to the menu      
       
         var elm_menu = getElementByIdX (SWEApplets[CurrentAppletIndex].Target.document, 
                                      SWEApplets[CurrentAppletIndex].Menu,
                                      SWEApplets[CurrentAppletIndex].MenuName);
         if (Test (elm_menu))
         {
            elm_menu.blur ();
         }
         var elm = getElementByIdX (SWEApplets[CurrentAppletIndex].Target.document, 
                                 SWEApplets[CurrentAppletIndex].Id);
         if (Test (elm))
         {
            elm.click ();
         } 
      }         
     
      return GoToElement(SWEApplets[CurrentAppletIndex].Target, SWEApplets[CurrentAppletIndex].Menu,
                                                             SWEApplets[CurrentAppletIndex].MenuName);                                                                  
   }
   else
   {
      SetCurrentAppletIndex(null);
   }
   return false;
}

function NeedPreventDefault(key)
{
   var i = FindByProp (cmdMap, "Key", key); 
   if (i != -1) return true;     
 
   return SendKeyToServer(key, false);
}

function HandleKeyPress(e)
{
   if (NS6)
   {
      var key = GetKey(e, true);
      if (NeedPreventDefault(key))
      {
         e.preventDefault();         
      }         
   } 
}

function HandleKeyDown(e)
{
   if (!Test(e)) return;  
   if (NS6)
   {
      if (e.keyCode == 18)  gAlt = true;  
      if (e.keyCode == 17)  gCtrl = true;  
   }
   
   if (IE)
   {  
      var key = GetKey(e, true);     
   
      if (NeedPreventDefault(key))
      {
         e.cancelBubble = true;
         e.returnValue = false;                  
         return false;            
      }      
   }        
}


function GetKey (e, bDown)
{
   if (document.all)                 // IE
   {
      cc=e.keyCode;
      bS=e.shiftKey;
      bC=e.ctrlKey;
      bA=e.altKey;
   }
   else if (document.getElementById) // Netscape 6
   {
      var CtrlAlt = gCtrl && gAlt; 
      
      cc=e.keyCode;
      if (cc == 61) cc = 187;
      if (cc == 109) cc = 189;
      bS=e.shiftKey;
      bC=e.ctrlKey;
      bA=e.altKey;

      if (bDown != true)
      {
         if (bC) gCtrl = false;
         if (bA) gAlt = false;      
      }         
      
      if (CtrlAlt)
      {
         bC = true;
         bA = true;
      }
         
      if (cc !=0 && cc != 17 && cc != 18) 
      {
        gCtrl =false;
        gAlt = false;
      }
   }
   else if (document.layers)        // Netscape 4
   {
      cc=e.which;
      if ((cc > 0) && (cc < 26)) cc += 64; // we should correctly handle Ctrl key

      bS=e.modifiers&Event.SHIFT_MASK;
      bC=e.modifiers&Event.CONTROL_MASK;
      bA=e.modifiers&Event.ALT_MASK;
   }

   return (bS ? "1" : "0") + (bC ? "1" : "0") + (bA ? "1" : "0") + cc;
}

function ParseString (S, p1, obj)
{
   var k, v;
   var i;
   p2 = S.indexOf(";", p1+1);
   if (p2 == -1) p2 = S.length;

   var Arr = S.substring(p1+1,p2).split("*");
   
   for (i = 1; i < Arr.length; i++)
   {
      var pair = Arr[i].split(":");

      k = pair[0];
      
      if (Test(ShortParams[k]))
      {
         v = ShortParams[k].value;
         k = ShortParams[k].key;
      }
      if (Test(pair[1])) v = pair[1];
      if (k != "") obj[k] = v;
   }
}

function GetURL(csObj)
{
   var i;
   var S = "start.swe?";
   
   for (i in csObj)
   {
     if (csObj.hasOwnProperty(i)) 
     {
        S = S + i + "=" + csObj[i] + "&";	
     }      
   }

   return S;
}

function SendObjToCTIToolbar(csObj)
{
   if (CTIHandler)
   {
      URL = "start.swe?SWECmd=KeyCode&SWEC=1&SWEMethod=" + csObj.SWEMethod;
      CTIHandler (URL);
      return true;
   }
   return false;
}

function SendKeyToServer (key, bInvoke)
{
   function ProcessKey(bAppletAccelerator, bInvoke)
   {
      if (bAppletAccelerator && CurrentAppletIndex == null) return false;

      var AppletName = ""; 
      var CurrentApplet = CurrentAppletIndex == null ? "": SWEApplets[CurrentAppletIndex];
      if ((CurrentApplet != null) && Test(CurrentApplet.Name)) AppletName = CurrentApplet.Name;

      //get a string that contains encoded accelerators for the current applet (if bAppletAccelerator == true),
      //or application (if bAppletAccelerator == false)      
      var AccelStr = bAppletAccelerator ? Accelerators[AppletName] : Accelerators[""]; 
      
      if (!Test(AccelStr)) return; // The applet or the application has no accelerators

      //find key in accelerators
      var p1 = AccelStr.indexOf(";" + key + ";");
      if (p1 == -1) p1 = AccelStr.indexOf(";" + key + "*");
            
      if (!bInvoke)
      {
         return (p1 != -1);
      }
      
      //if the key is found invoke the corresponding method
      if (p1 != -1)
      {
         var csObj = new Object ();
         var SWEViewFrame = null;
         var SWEMenuFrame = null;

         var i = FindByProp (SWEHTMLFrames, "name", "_sweview");
         if (i != -1)
         {
            SWEViewFrame = SWEHTMLFrames[i];
         }

         if (CurrentApplet != null) csObj.action = "start.swe"; 
         if (AppletName != "") csObj.SWEApplet = AppletName; 
         csObj.SWECmd = "KeyCode";
         csObj.SWEMethod = key; 

         //fill out all necessary fields of csObj
         ParseString(AccelStr, p1 + 1, csObj); 

         var form = null;

         if (bAppletAccelerator) 
         {
            if (CurrentApplet.Form != "")
            {
               form = CurrentApplet.Target.frames.document.forms[CurrentApplet.Form];
            }
            SWEViewFrame = CurrentApplet.Target;
         } 
         else
         {
            if (Test(Top()._sweclient._sweappmenu) && Top()._sweclient._sweappmenu.document.forms[0] != null)
            {
              form = Top()._sweclient._sweappmenu.document.forms[0];
            }
            else if ((SWEViewFrame != null) && (SWEViewFrame.document.forms.length > 0))
            {
               form = SWEViewFrame.document.forms[0];               
            }

            if (Test(Top()._sweclient._sweappmenu))
            {
               SWEMenuFrame = Top()._sweclient._sweappmenu;
            }       
         }
         
         if (!Test(form) || typeof (form.SWECmd) == 'undefined')  return false;
         

         if (csObj.SWEService == "Communications Client")
         {
            SendObjToCTIToolbar(csObj);
            return true;
         }


         if (!Test(csObj.SWECT) || SWEConfirm(csObj.SWECT))
         {        
            SetFocusState (CurrentAppletIndex);
            if (bAppletAccelerator && SWEViewFrame != null)
            {
               //submit the form using SWESubmitForm of the main frame
               SWEViewFrame.SWESubmitForm(form, csObj);
            }
            else if (!bAppletAccelerator && SWEMenuFrame != null)
            {
               //submit the form using SWESubmitForm of the menu frame
               SWEMenuFrame.SWESubmitForm(form, csObj);
            }
            else
            {
               SWESubmitForm(form, csObj);
            }
         }

         return true;
      }
      return false;
   }

   return (ProcessKey(true /* Search for the key in the applet accelerators */, bInvoke) ||
           ProcessKey(false /* Search for the key in the application accelerators */, bInvoke));
   
}


function HandleEvent (htmlframe, e)
{
   if (bRefreshState) return;
   if (typeof (e) == 'undefined' || typeof (htmlframe) == 'undefined' || typeof (cmdMap) == 'undefined' ||
      e == null || htmlframe == null || cmdMap == null)
      return;

   OnFocusFrame (htmlframe);

   var key = GetKey (e, false); 
   
   var i = FindByProp (cmdMap, "Key", key); 
    
   
   if (i != -1) 
   {
      if (Test(e.stopPropagation)) e.stopPropagation ();
      if (Test(e.preventDefault))  e.preventDefault ();

      method = cmdMap[i].Method;
/* SWE Commands */
      if      (method == "NextApplet") NavigateApplets (false /*backward*/); 
      else if (method == "PrevApplet") NavigateApplets (true /*backward*/); 
      
      else if (method == "NextFrame") NavigateFrames (false /*backward*/);
      else if (method == "PrevFrame") NavigateFrames (true /*backward*/);
      else if (method == "ViewInfo") DisplayViewInfo (); 
      else if (method == "GotoAppletMenu")
      {
         GotoAppletMenu();
      }
      else if (!ExecuteMethod (i))
      {
/* CTI Commands */
         if (CTIHandler) CTIHandler (cmdMap[i].URL);
      }
   }
   else
   {
      if (bArraysShouldBeRefreshed) RefreshArrays();
      if (SendKeyToServer(key, true))
      {
         e.returnValue = false;
         e.cancelBubble = true;
      }
   }
   return;
}

function InitCachedFrames(size)
{
   var   i;
   
   SWECachedFrames = new Array(size);
   for (i = 0; i < size; i++)
   {
      SWECachedFrames[i] = {name:"",ViewFrames:null};
   }
}

function IsContainedIn(frame, targetName)
{
   var curFrame = frame;

   if (frame.name == targetName)
   {
      return true;
   }
   
   curFrame = curFrame.parent;
   while (curFrame != null && curFrame.parent != curFrame)
   {
      if (curFrame.name == targetName) 
      {
         return true;
      }

      curFrame = curFrame.parent;
   }
   
   return false;
}

function SetAccessibleEnhanced(b)
{
   bAccessibleEnhanced = b;
}

function GetCurrentAppletName()
{
   if (CurrentAppletIndex == null || CurrentAppletIndex < 0 || CurrentAppletIndex >= SWEApplets.length)
   {
      return null;
   }
   else
   {      
      return SWEApplets[CurrentAppletIndex].Name;
   }      
}

function AreFindViews(View1, View2)
{
   return (View1 == "Find Results View" || View1 == "Find View") &&
          (View2 == "Find Results View" || View2 == "Find View");   
}

function OnOpenSearchCenter()
{
   SetDefaultApplet(SearchCenterApplet);
}

function SetFirstApplet(AppletName)
{
   TempFirstApplet = AppletName;
}
/*
function SetDefaultApplet(AppletName)
{
  if (AppletName != "" && AppletName != undefined)
  {
     var AppIndex = FindByProp(SWEApplets, "Name", AppletName);
     if (AppIndex == -1)
     {
       // The active view has changed, so the applet cannot be found on this view, so it needs to be reset
       Top()._defaultAppletName = "";
       return;
     }
     if (SWEApplets[AppIndex].Target.name == "_sweview")
     {
       TempFirstApplet = AppletName;
       Top()._defaultAppletName = AppletName;
     }
   }
}
*/
function SetDefaultApplet(AppletName)
{
  if (AppletName != null && typeof(AppletName) != "undefined")
  {
     var AppIndex = FindByProp(SWEApplets, "Name", AppletName);
     
     if ((AppIndex != -1) && SWEApplets[AppIndex].Target.name == "_sweview")
     {
       Top()._defaultAppletName = AppletName;
     }
     TempFirstApplet = AppletName;
   }
}
function SetFocus (bUsePrevState, AppletName, ControlName)
{
   if (!bFocusShouldBeReset) return;
   oldPopupAppletName = "";   
   bFocusShouldBeReset = false;
   var bRestorePrevValue = bUsePrevState;
   var i = -1;
   
   if (bUsePrevState && FocusState != null)
   {        
      AppletName  = FocusState.AppletName;

      ControlName = ActiveControlId;
      

      i = FindByProp(SWEApplets, "Name", AppletName); 
   
      if (i < 0 || SWEApplets[i].Name != FocusState.AppletName || 
          (
            (SWEApplets[i].ViewName != FocusState.ViewName) && 
            (!AreFindViews(SWEApplets[i].ViewName, FocusState.ViewName))
          ))
      {         
         FocusState  = null; // clear prev. focus state 
         i = -1;             // use the first applet
         AppletName  = null;
         ControlName = null;         
         bRestorePrevValue = false; 
      }
      else if (SWEApplets[i].eShowMode != FocusState.eShowMode || AreFindViews(SWEApplets[i].ViewName, FocusState.ViewName))
      {
         ControlName = null;         
      }     
   }
   else
   {
      FocusState = null;  
      bRestorePrevValue = false; 
   }
   
   
   if (i==-1 && Test(AppletName))
   {
      i = FindByProp(SWEApplets, "Name", AppletName);     
      
      if (i != -1)
      {
         SetFocusState(i);
      }
   }
   
   if (i == -1 && SWEApplets.length > 0) i = 0;    
   
   if (i != -1 && SWEApplets[i].Name != CustomerDBApplet) //FR 12-1CS37W0
   {
      GoToApplet(i, ControlName, bRestorePrevValue);
   }
   else
   {
      SetCurrentAppletIndex (null);
      i = FindByProp (SWEHTMLFrames, "name", "_sweview");
      if (i != -1)
      {
         GoToFirstAnchor(SWEHTMLFrames[i]);
      }      
   }      
}


function SetActiveControlId(Control)
{   
   ActiveControlId = Control.id;
   if (ActiveControlId == "" && Control.name != "")
   {
      ActiveControlId = Control.name;
   }
   
   SetFocusState(CurrentAppletIndex);
 
}

function SetActiveFrameCache(vcache_id, vcache_frameName, bReplaceLayout)
{
   if (SWECachedFrames.length <= vcache_id || SWECachedFrames[vcache_id] == null)
   {
      ActiveFrameId = -1;
      return;
   }

   SWECachedFrames[vcache_id].name = vcache_frameName;

   if (SWECachedFrames[vcache_id].ViewFrames == null || bReplaceLayout)
   {
      SWECachedFrames[vcache_id].ViewFrames  = new Array();
      bArraysShouldBeRefreshed = true;
   }
   else if (ActiveFrameId != vcache_id)
   {
      bArraysShouldBeRefreshed = true;
   }      

   ActiveFrameId = vcache_id; 
}


function RegisterCTIHandle (Obj, Handler)
{
   CTIHandler = Handler;
}

function RefreshFrameList(viewFrame) //for view cache manager
{
   bArraysShouldBeRefreshed = true;
}


function HandleAppletClickSI(anchorName) 
{
   var i = FindByProp(SWEApplets, "Id", anchorName);
   
   if (i != -1)
   {
     // set the default applet Name to the applet that has been clicked on, not focussed on
     bIgnoreControlFocus = false;
     if (ActiveControlId != null)
       bIgnoreControlFocus = true;
     SetCurrentAppletIndex(i);
   }
}

function SetCurrentAppletIndex(index) 
{
   if (index != CurrentAppletIndex && !bRefreshState && CurrentAppletIndex != null && StopForSavingData())
   {
      return;
   }      
      
   // always refreshed since index may be same even though page is different
   if (index != null)
   {
      var elem;
      // clear old active
      if (CurrentAppletIndex != null && typeof SWEApplets[CurrentAppletIndex] != "undefined" && SWEApplets[CurrentAppletIndex].highLightInfo != null && typeof SWEApplets[CurrentAppletIndex].highLightInfo != "undefined") 
      {
         elem = SWEApplets[CurrentAppletIndex].Target.document.getElementById(SWEApplets[CurrentAppletIndex].highLightInfo.ID);
         if (elem != null)
         {
            elem.className = SWEApplets[CurrentAppletIndex].highLightInfo.inactive;
         }
      }
      // set new active
      //18241020 Reverting the fix for the bug 12755595.
      // Accessibility is handled in Open UI for tree applets.
      if (SWEApplets[index] != null && typeof SWEApplets[index] != "undefined" && SWEApplets[index].highLightInfo != null && typeof SWEApplets[index].highLightInfo != "undefined")
      {
         elem = SWEApplets[index].Target.document.getElementById(SWEApplets[index].highLightInfo.ID);
         if (elem != null)
         {
            elem.className = SWEApplets[index].highLightInfo.active;
         }
         
         // Default Focus Project
         // FR# 12-1VASYBV: We don't need this where 12-1P4ZT2P is present. There is certainly a prefocussed element.         
         if (top._swescript!=null && typeof(top._swescript)!='undefined' && (typeof(top.window.shouldRefreshClient)=='undefined' || top.window.shouldRefreshClient!=false))
         {
		    if (!bIgnoreControlFocus && (SWEApplets[index].MainControl != null || SWEApplets[index].MainControl != ""))
			{
			   var elm = getElementByIdX (SWEApplets[index].Target.document, SWEApplets[index].MainControl);
			   if (elm != null && elm != "")
			      elm.focus();
			}
         }            
         // end default Focus
      }
   }
   CurrentAppletIndex = index;
   if (!bRefreshState) SetFocusState(CurrentAppletIndex);   
 }

//var gHighlightClasses = new Object();
// need to clear
function SetBorderHighlightClasses(doc, appletName, elementID, activeClass, inactiveClass)
{
   // find applet and set highlight info
   for (var i = 0; i < SWEApplets.length; i++) 
   {
      if (SWEApplets[i].Name == appletName) 
      {
         SWEApplets[i].highLightInfo = {ID:elementID,active:activeClass, inactive:inactiveClass};
         break;
      }
   }
   if (i == SWEApplets.length) return; // applet not found
}


function SetPopupAccelerators (AppletName, Acceler)
{
   PopupAppletName   = AppletName;
   PopupAccelerators = Acceler;
}

function SetPopupFocus(Target, ControlId, Mode)
{   
   if (PopupAppletMode != Mode || oldPopupAppletName != PopupAppletName)
   {
      PopupActiveControlId = null;
   }
   
   Target.focus();
   var elm = null;
   if (PopupActiveControlId != null)
   {
      elm = getElementByIdX(Target.document, PopupActiveControlId);
   }
   
   if (elm == null)
   {
      elm = getElementByIdX(Target.document, ControlId);
   }         
   
   if (elm != null)
   {
      //elm.focus();
	  //Bug#12706343 : for fire fox, focus() function does not set the focus to element,
      // so we need to use setTimeout functon, it works for all the browser 
      setTimeout(elm.focus(), 50);	  
   }
   else 
   {
      //GoToFirstAnchor(Target);
	  //BUG#12919559 : Putting focus on first control in Popups rather than first Anchor tag.
	  Target.document.forms[0].elements[0].focus();
   }
   
   if (NS6)
   {  
      Target.document.captureEvents(Event.KEYDOWN);
      Target.document.onkeydown = HandleKeyDown;   
   }     
   
   var j = 0;
   SetFocusEventsForArray(Target.document.getElementsByTagName("A"), OnPopupFocusFunction);
   for (j =0; j< Target.document.forms.length; j++)
   {
      SetFocusEventsForArray(Target.document.forms[j].elements, OnPopupFocusFunction);
   }   
   
   oldPopupAppletName = PopupAppletName;
   PopupAppletMode = Mode;
}

function PopupHandleEvent (htmlframe, e)
{
   if (typeof (e) == 'undefined' || e == null) return;
   var key = GetKey (e, false);
     
   var p1 = PopupAccelerators.indexOf(";" + key + ";");
   if (p1 == -1) p1 = PopupAccelerators.indexOf(";" + key + "*");
   if (p1 != -1)
   {
      var csObj = new Object ();

      csObj.action = "start.swe";
      csObj.target = "_self";
      csObj.SWEApplet = PopupAppletName; 
      csObj.SWECmd = "KeyCode";
      csObj.SWEMethod = key; 
      csObj.SWESPNH = true;
      ParseString(PopupAccelerators, p1 + 1, csObj); 

      var form;

      form = htmlframe.forms[0];
                     
      if (!Test(csObj.SWECT) || SWEConfirm(csObj.SWECT))
      {
         SWESubmitForm(form, csObj);
      }

      return true;
   }
   return false;
}

function InitShortParams()
{
   ShortParams = new Array;
   ShortParams["1"] = {key:"SWECT"  , value:""};
   ShortParams["2"] = {key:"SWESP"  , value:"true"};
   ShortParams["3"] = {key:"SWEDIC" , value:"true"};
   ShortParams["4"] = {key:"SWEH"   , value:""};
   ShortParams["5"] = {key:"SWEW"   , value:""};

   ShortParams["6"] = {key:"target"   , value:"_blank"};
   ShortParams["7"] = {key:"target"   , value:"_sweview"};
}

function SetFocusState(index)
{
//   if (bRefreshState) return;
   
   if (index == null || index < 0 || index >= SWEApplets.length)
   {
      FocusState = null;
   }
   else
   {              
      if (FocusState == null)
      {
         FocusState = new Object();
      }
      with (SWEApplets[index]) 
      {
         FocusState.AppletName = Name;
         FocusState.ViewName     = ViewName;         
         FocusState.eShowMode  = eShowMode;
      }
   }      
}

function UpdateCSQMessage(control)
{
   var elm = getElementByIdX (SWEApplets[CurrentAppletIndex].Target.document,
                              SWEApplets[CurrentAppletIndex].Id + "_ctrlmsg");

   if (Test(elm) == false)
      return;

   var msg = "";
   if (Top()._swescript.ctrlCS[control.id] != null)
      msg = Top()._swescript._SWEgetMessage("IDS_SWE_CSQ_MSG");

   elm.innerHTML = msg;
}

function FindCommand (method)
{
   return FindByProp (cmdMap, "Method", method);
}

function SetViewSummary( viewname, summary)
{
    ViewNameForViewSummary    = viewname;
    ViewSummary = summary;
}

function DisplayViewInfo()
{
   var i = 0;
   var infoString;
   var len =  SWEApplets.length;
   var localeViewName = "";
   var localeViewSummary = "";
   var localeAppletName = "";
   
   localeViewName = Top()._swescript._SWEgetMessage("IDS_VIEWNAME");
   localeViewSummary = Top()._swescript._SWEgetMessage("IDS_VIEWSUMMARY");
   localeAppletName = Top()._swescript._SWEgetMessage("IDS_APPLETNAME");
   
   while ( i < len ) 
   {
        if ( i == 0)
        {
            infoString = localeViewName + ViewNameForViewSummary ; 
            infoString = infoString + "\r\n"
            infoString = infoString + localeViewSummary + ViewSummary;
            infoString = infoString + "\r\n"
        }
        infoString = infoString + localeAppletName + SWEApplets[i].Name;
        i++;
        infoString = infoString + "\r\n"
    }
    alert(infoString);
}

function InitTreeNodeIdsArray (treenodeids)
{
	if(treenodeids != null && typeof treenodeids != "undefined" && treenodeids != "")
	{
		TreeNodeIds =treenodeids.split("|");
	}
	for(i=0; i< TreeNodeIds.length;i++)
	{
		if(TreeNodeIds[i]==ActiveTreeNodeId)
		{
		 sTreeNodeIndx=i;
		 CurrFocusNodeIndx = i;
		 break;
		}
	}
	
}
function SetiHelpStepIdSelId(stepIdArray,selectedId)
{
   if(selectedId != null && typeof selectedId != "undefined" && selectedId!="")
   {
      g_selectediHelpId=selectedId;
   }
   if(stepIdArray != null && typeof stepIdArray != "undefined" && stepIdArray.length >= 0 )
   {
      g_iHelpIdArray =stepIdArray;
      for(i=0; i< g_iHelpIdArray.length;i++)
      {
         if(g_iHelpIdArray[i]==g_selectediHelpId)
         {
            selectediHelpIndex =i;
            CurrFocusiHelpIndx = i;
            break;
         }
      }
   }
}

function resetiHelpStepIdSelId(stepIdArray,selectedId)
{
   if(selectedId != null && typeof selectedId != "undefined" && selectedId!="")
   {
      g_selectediHelpId=selectedId;
   }
   if(stepIdArray != null && typeof stepIdArray != "undefined" && stepIdArray.length >= 0 )
   {
      g_iHelpIdArray =stepIdArray;
   }
   
   
}
//Bug #10623898
function GoToElementWithOutSetFocusOnFrame (FrameObj, ElementId, ElementName)
{

   if (!Test (FrameObj)) return false;

   //FrameObj.focus ();

   var elm = getElementByIdX (FrameObj.document, ElementId, ElementName);

   if (!Test (elm))
   {
      return false;
   } 
   
   // Allow the page to anchor before applying the element focus, otherwise the
   // anchor would override the amount scrolled to bring the element into focus,
   // possibly causing the element to not appear in the active client area. 
   Top().elemToFocus = elm;
   this.window.setTimeout ("if (Top().elemToFocus != null && typeof(Top().elemToFocus) != 'undefined') {Top().elemToFocus.focus ();      Top().elemToFocus = null;}", 150);  
   
   return true;  
}


InitShortParams();
if(!IsOpenUI()){
    top.EventHandler = HandleEvent;
    top.PopupEventHandler = PopupHandleEvent;
}
