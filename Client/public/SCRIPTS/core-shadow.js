/*****************************************************************************
 *
 * Copyright (C) 2001, Siebel Systems, Inc., All rights reserved.
 *
 * FILE:       rtcEditor.js
 *  $Revision: 12 $Date: 2/22/2001
 *    $Author:
 *
 * CREATOR:    Roy Selig
 *
 * DESCRIPTION:
 *		Creates and maintains Rich Text Control (RTC) instances.
 *		RTC requires IE4.x+;  in Netscape and other browsers the component  
 *		gracegully degrades to a textarea
 *     
 *****************************************************************************/

// browser detect
var rtc_brwsr = -1;
var isNS = 0;
var ns4 = 4;
var ns6 = 5;
var isIE = 100;  
var ie4 = 104;
var ie5 = 105;
var ie5_5 = 105.5;
var ie6 = 106;
var agt = navigator.userAgent.toLowerCase();
var isMac = (agt.indexOf("mac") != -1);
rtc_brwsr = (navigator.appName.indexOf("Microsoft")>-1)?isIE:isNS;
if (navigator.appVersion.indexOf("MSIE 7.")>-1)
{	rtc_brwsr += 7;	}
else if (navigator.appVersion.indexOf("MSIE 6.")>-1)
{	rtc_brwsr += 6;	}
else if (navigator.appVersion.indexOf("MSIE 5.5")>-1)
{	rtc_brwsr += 5.5;	}
else if (navigator.appVersion.indexOf("MSIE 5.")>-1)
{	rtc_brwsr += 5;	}
else{ rtc_brwsr +=  parseInt(navigator.appVersion); }

var rtc_doc = null;

var bNeedFocus = false;
var RTC_MODE_TEXTAREA 	= 0;			//stores the Rich Text Component (RTC) modes
var RTC_MODE_EMBEDDED 	= 1;			//stores the Rich Text Component (RTC) modes
var RTC_MODE_POPUP 		= 2;			//stores the Rich Text Component (RTC) modes
var RTC_MODE_READ_ONLY	= 3;			//stores the Rich Text Component (RTC) modes

var activeSWEField_Obj=null;			//Stores the DOM Object for the SWE field associated with the active RTC
var activeRTC_ID="";					//Stores the DOM id of the active RTC
var activeRTC_Obj="";					//Stores the active RTC object 
var activeRTC_Frame= null;				//Stores the active RTC frame
var activeRTC_Popup= null;				//Stores the active RTC popup
var activeColor="#000000";				//stores the active font color	 

var rtcIndex=0;							//creates a unique index for each RTC
var rtcIsActive = false;				//stores whether or not a RTC is currently being edited
var rtc_sleep = 1000;					//stores the timeout between RTC/SWE Field syncs
var rtcEditor_Frame = null;				//stores iFrame reference where the rtc Editor is loaded
var rtcEditor_Frame_Name = "editFrame";	//stores the name of the iFrame where the rtc Editor is loaded
var rtcMaxChars = 2000;					//stores the number of characters that can be saved into an RTC (includes formatting characters).
var rtcIsLoaded = new Array(100);       //stores the state of the loaded RTCs, 1- loaded, 0-not loaded
var rtcIsOpen = new Array(100);         //stores the state of the open RTCs, 1- open, 0-close
var rtc_arr_indx;

var isRTCSupported = false;				//stores whether we have the correct browser to support the RTC Editor

var allRTC_SWEFields = new Array();		//stores the collection of swe fields related to RTCs on this page

var trange = null;						//global text range object

var SWEFldWrapperSuffix = "sweFldWrapper";

										
var focusX=0;							//used to position cursor
var focusY=0;							//when opening in embedded mode

// Flags for marking inserted links and graphics.
var RTC_LINK_INSERTION_POINT	= "RTCLinkInsertionPoint";      // marks link insertion point.
var RTC_GRAPHIC_INSERTION_POINT	= "RTCGraphicInsertionPoint";   // marks graphic insertion point.

//determine if we are in an RTL language and store the correct HTML tag for use later
var appDir="ltr";
var htmlDIR="<html>";

// Stores whether rtc editor is in Popup mode. Default to false.
//   Do not use "window.opener!=null" to detect rtc Popup, because it can be true for the base window itself.
var isRTCPopup = false;

//modified if-test because DIR structure not supported on Mac IE5
if (rtc_brwsr >= ie5 && !isMac)
{  appDIR	=(isRTCPopup)?window.opener.document.dir.toLowerCase():top.document.dir.toLowerCase();
   htmlDIR = (appDIR=="rtl")?"<html dir='rtl'>":"<html>";	}

//Standard Body treatments to be passed into the iFrames
var HTML_html_open_tag          = htmlDIR;
var HTML_body_open_tag          = "<body style='font-family:arial,helvetica; font-size:x-small; margin:2 2 2 2;'>";
var HTML_body_open_tag_embedded = "<body style='font-family:arial,helvetica; font-size:x-small; margin:2 19 2 2'>";
var HTML_open			= htmlDIR + "<base target='_blank'>" + HTML_body_open_tag;
var HTML_open_embedded		= htmlDIR + "<base target='_blank'>" + HTML_body_open_tag_embedded;
var HTML_open_read_only  	= htmlDIR + "<base target='_blank'><body style='font-family:arial,helvetica; font-size:x-small; margin:2 2 2 2; background-color:#f0f0f0'>";
var HTML_close 			= "</body></html>";

//HTML RTC Initialization strings
var RTC_MODE_READ_ONLY_HTML =	"<table cellpadding='0' cellspacing='0'><tr valign='top'>" +
								"<td><iframe rtcMode='%MODE%' scrolling='auto' class='rtcReadOnly' id='%ID%' unselectable='on' onfocus='rtcIsActive=true' onblur='rtcIsActive=false' frameborder='0'>" + htmlDIR + "<body></body></html></iframe></td>" +
	 							"</tr></table>";

//12-HW4AEH src='%PATH%rtcEditorPopup.html' is removed since it causes busy-state problems.
var RTC_MODE_POPUP_HTML =		"<table cellpadding='0' cellspacing='0'><tr valign='top'>" +
								"<td><iframe rtcMode='%MODE%' scrolling='auto' class='rtcPopup' id='%ID%' name='%ID%' unselectable='on' onfocus='rtcIsActive=true' onblur='rtcIsActive=false'  frameborder='0'>" + htmlDIR + "<body></body></html></iframe></td>" +
								"<td><a href='javascript:openRTCEditorPopup(\"%ID%\");'><img id='%ID%Btn' src='images/icon_rtcStripHTML.gif' border='0' style='display:none;'></a><img src='images/spacer' alt='' width='21' height='1'></td>" +
								"</tr></table>";							

var RTC_MODE_EMBEDDED_HTML =	"<table cellpadding='0' cellspacing='0'><tr valign='top'>" +
								"<td><iframe rtcMode='%MODE%' scrolling='auto' class='rtcEmbedded' id='%ID%' name='%ID%' unselectable='on' onfocus='openRTCEditorEmbedded(\"%ID%\");' onload='openRTCEditorEmbedded(\"%ID%\");' onblur='closeRTCEditorEmbedded(\"%ID%\");' onunload='closeRTCEditorEmbedded(\"%ID%\");' frameborder='1'>" + htmlDIR + "<body></body></html></iframe></td>" +
								"</tr></table>";
							
var RTC_MODE_TEXTAREA_HTML =	"&nbsp;<a href='javascript:stripHTMLTags(\"%ID%\");'>" + 
					  			"<img class='rtcBtn' align='top' src='images/icon_rtcStripHTML.gif' alt='%ALT%' border='0'></a>" +		
				 	  			"<input type='hidden' name='%ID%Hidden'>";		

//Common Regular Expressions to be applied to HTML Initialization strings
var re_ID = new RegExp("%ID%","g");
var re_MODE = new RegExp("%MODE%","g");	
var re_PATH = new RegExp("%PATH%","g");				

var isSIDataLossWarningEnabled = false;
var appletName = "";
var appletId = "";

function handleKeyUp()
{
   HandleEvent(this, this.parentWindow.event);
}


// wraps the unidentified SWEField in a span with a known id
// which enables us to find the SWEField id at runtime 
// context: main window
function createRTC(type,mode,doc,apltName,apltId)
{
   // CR#:12-CBWTAR
   if (type == 0 )
   {
       doCleanup ();
   }

   rtc_doc = doc;
   var bShowPlainText = (rtc_doc.parentWindow.rtc_ShowPlainText != null)? rtc_doc.parentWindow.rtc_ShowPlainText : false;
	
	initRTCStrings();
		
	//NS, IE4 and other browsers cannot support the RTC Editor so create a textarea instead
        //modified if-test because DIR structure not supported on Mac IE5
	if (bShowPlainText==true || mode==RTC_MODE_TEXTAREA || rtc_brwsr<=ie4 || isMac) {mode = RTC_MODE_TEXTAREA; isRTCSupported=false;}
	//due to an onblur bug with iFrame ie5 can only support the RTC Editor as a popup
	else if (rtc_brwsr >= ie5 && rtc_brwsr < ie5_5)	{mode = RTC_MODE_POPUP; isRTCSupported=true;}
	//ie5.5+ 
	else if (rtc_brwsr >= ie5_5)	{isRTCSupported=true;}	

	//create the component	
	switch (type)
	{ 	case 0:	//open SWE Field wrapper
			var sweFldWrapID="rtc" + rtcIndex + SWEFldWrapperSuffix;
			//if RTC is supported displayvalue made none to reduce 2 tabs to 1, to enter the RTC editor 
			var displayValue;
			if ( isRTCSupported == false )
				displayValue=(mode==RTC_MODE_TEXTAREA)?"visible;":"visible;position:absolute;left:-5500";
			else
				displayValue=(mode==RTC_MODE_TEXTAREA)?"none;":"none;position:absolute;left:-5500";
			rtc_doc.write("<span id='" + sweFldWrapID + "' style='display:"+displayValue+";'>");		
			break;
		case 1:	//close SWE Field wrapper
			rtc_doc.write("</span>");
			_createRTC_iFrame(mode);
			rtcIndex++;
			break;
	}
	
	if (apltName != 'undefined' && apltId != 'undefined')
	{
	   isSIDataLossWarningEnabled = true;
	   appletName = apltName;
	   appletId = apltId;
	}
	setDirection ();
	
}

// helper to createRTC() which writes rtc iFrame 
// based upon the mode it has been passed
// context: main window
function _createRTC_iFrame(mode)
{
   var rtc_ID = "rtc"+ rtcIndex;
   var scriptDir = resolveScriptsDir();
	switch (mode)
	{
	   case 1: //RTC_MODE_EMBEDDED:
			rtc_doc.write(	RTC_MODE_EMBEDDED_HTML.replace(re_ID,rtc_ID).replace(re_MODE,mode).replace(re_PATH,scriptDir) );
			setOnPropertyChangeHandlers(rtc_ID,mode);
			break;
		case 2: //RTC_MODE_POPUP:
			rtc_doc.write(	RTC_MODE_POPUP_HTML.replace(re_ID,rtc_ID).replace(re_MODE,mode).replace(re_PATH,scriptDir) );
			setOnPropertyChangeHandlers(rtc_ID,mode);
			break;
		case 3: //RTC_MODE_READ_ONLY:	
			rtc_doc.write(	RTC_MODE_READ_ONLY_HTML.replace(re_ID,rtc_ID).replace(re_MODE,mode) );
			setOnPropertyChangeHandlers(rtc_ID,mode);
			break;	
		default: //RTC_MODE_TEXTAREA:
			rtc_doc.write(	RTC_MODE_TEXTAREA_HTML.replace(re_ID,rtc_ID).replace(re_MODE,mode).replace(/%ALT%/gi,sStripHTML)  );
			break;	
	}
}

/*Sets up synchronization between SWE field and RTC iFrame for IE 5+; 
  uses the onpropertychange event to do it; IE 4 will still use the 
  suboptimal timer method*/
function setOnPropertyChangeHandlers(rtc_ID,mode)
{
	if(rtc_brwsr>=ie5)		
	{	//1. get a handle to the SWE Wrapper Span tag
		var sweFldWrap = rtc_doc.getElementById(rtc_ID + SWEFldWrapperSuffix);		

		//2. read the first child of the wrapper span tag
		//     in hi mode it will be the swe span tag; 
		//		in low mode it will be the swe field or plain text.
		var sweSpan = (sweFldWrap)?sweFldWrap.children[0]:null;
		
		//3. if the sweSpan tag is not a span,input or textarea then the field is read only
		//   so pick up its contents, filter out any script tags and wrap it in a stand-in sweSpan 
		if (String("SPAN,INPUT,TEXTAREA").indexOf(sweSpan.tagName)==-1)
		{	var content = sweFldWrap.innerHTML.replace(/<script[^<]*<\/script>/gi,"");
			content = (content.length==0)?"&nbsp;":content;
			sweFldWrap.innerHTML = "<span id='sweSpan" + rtc_ID + "'>"  + content + "</span>"; 
			sweSpan = sweFldWrap.children[0];	
		}		
		
		//4. get a handle to the RTC iFrame
		var rtcFrame = rtc_doc.getElementById(rtc_ID);
		//5. get SWE span tag id and set it as an expando property on RTC Frame
		rtcFrame.swe_ID = sweSpan.id; 
		//6. get RTC Frame id and set it as an expando property on SWE span tag
		sweSpan.rtc_ID = rtc_ID;
                sweSpan.rtcMode = mode;
		//7. check if swe field has already arrived (lo-mode) or read-only
		sweSpan.rtcFrame=null;	
		sweFldInit(sweSpan);
		//8. attach onPropertyChange event handler to SWE span tag
		sweSpan.onpropertychange=swespan_OnPropertyChange;	
	}
}	

/*captures property changes on the swe span tag;
  these are indicative that the field has initialized or changed state so sweFieldInit is called */
function swespan_OnPropertyChange()
{	var sweSpan = this.document.parentWindow.event.srcElement;
	var prop = this.document.parentWindow.event.propertyName;
	if (prop=="innerHTML")	{	sweFldInit(sweSpan);	}	
}

//traverses the SWE span tag to find the swe field
function sweFldInit(sweSpan)
{	
	if (sweSpan.tagName!="TEXTAREA") //we're in hi mode
	{	var allObj = sweSpan.all.tags("TEXTAREA");
	
		if ( allObj.length==0)	
		//if textarea is not found then read-only text was added to the swe span tag or tag has not been initialized yet
		{	var obj = new Object();	
				sweSpan.sweFld = obj; 
				sweSpan.sweFld.value=sweSpan.innerHTML;	
				sweSpan.sweFld.readOnly=true;	
				sweSpan.sweFld.sweIsBase=false;	
		} 
		else //found text area so store it aa a prop on swepsan
		{	sweSpan.sweFld = allObj[0];
			sweSpan.sweFld.sweIsBase=false;	
			
//			var rtcF = window.frames[ sweSpan.rtc_ID ];
//			if (rtcF!=null)
//			{	if (rtcF.frameElement.rtcMode=='3') //RTC_MODE_READ_ONLY
//				{	var baseId = sweSpan.sweFld.id;
//					baseId = baseId.replace(new RegExp("tx","g"),"dv").replace(new RegExp("Edit","g"),"Base");
//					if (baseId!=sweSpan.sweFld.id) 
//					{	var baseObj = sweSpan.all.item(baseId);
//						if (baseObj!=null)
//						{	sweSpan.sweFld = baseObj;
//							sweSpan.sweFld.value = baseObj.innerHTML;
//							sweSpan.sweFld.readOnly = true;
//							sweSpan.sweFld.sweIsBase = true;
//						}
//					}
//				}
//			}
		}
		
	} else //we're in low mode and the sweSpan is actually our swe field
	{	sweSpan.sweFld = sweSpan;
	 	sweSpan.sweFld.sweIsBase = true;
	}		
		
	sweSpan.sweFld.sweSpan = sweSpan; 
	sweSpan.sweFld.onpropertychange = swefld_OnPropertyChange;
	if (sweSpan.rtcFrame==null)	sweSpan.rtcFrame = GetRTCFrame(sweSpan.rtc_ID); 
	if (sweSpan.rtcFrame!=null)	updateRTCFrame(sweSpan.rtcFrame, sweSpan.sweFld.value);	
	
	//manage visual state of the RTC(read-only or editable look-and-feel)
	var rtcObjBtn = GetRTCDoc(sweSpan.rtc_ID).getElementById(sweSpan.rtc_ID + "Btn");
	if (rtcObjBtn!=null)
	{	rtcObjBtn.style.display = ( sweSpan.sweFld.readOnly==true )?"none":"block";		}
	rtcObj = GetRTCDoc(sweSpan.rtc_ID).getElementById(sweSpan.rtc_ID)
	if (rtcObj!=null)
	{	rtcObj.style.borderColor=( sweSpan.sweFld.readOnly==true )?"#cccccc":"#ccccff" ;	}	
		
}

//catches changes to the swe field and refreshes the RTC display
function swefld_OnPropertyChange()
{	var sweFld = this.document.parentWindow.event.srcElement;	
	var prop = this.document.parentWindow.event.propertyName;
	if (rtcIsActive==false || activeRTC_ID!=sweFld.sweSpan.rtc_ID)
	{	switch (prop)
		{	case "innerHTML":
				if (sweFld.sweIsBase!=true) break;
				sweFld.value = sweFld.innerHTML;
				sweFld.readOnly = true;
			case "value":
				updateRTCFrame(sweFld.sweSpan.rtcFrame, sweFld.value);	
			case "readOnly":
			  	var rtcObjBtn = GetRTCDoc(sweFld.sweSpan.rtc_ID).getElementById(sweFld.sweSpan.rtc_ID + "Btn");
				if (rtcObjBtn!=null)
				{	rtcObjBtn.style.display = ( sweFld.readOnly==true )?"none":"block";		}			
			default:
            if (sweFld.sweSpan.rtcFrame!=null)
            {	
               obj = GetRTCDoc(sweFld.sweSpan.rtc_ID).getElementById(sweFld.sweSpan.rtc_ID);

               if (obj != null)
               {
                  obj.style.borderColor=( sweFld.readOnly==true )?"#cccccc":"#ccccff" ;	
                  obj.style.width  = sweFld.style.width;
                  obj.style.height = sweFld.style.height;					   
               }
            }
      }
	}
	else
	{	switch (prop)
		{	case "innerHTML":
				if (sweFld.sweIsBase!=true) break;
				sweFld.value = sweFld.innerHTML;
				sweFld.readOnly = true;
			case "value":
//				if (sweFld.sweSpan.rtcFrame.frameElement==null) break;
				switch (sweFld.sweSpan.rtcMode) // switch (sweFld.sweSpan.rtcFrame.frameElement.rtcMode)
				{ 	case "0": //RTC_TEXTAREA:
						// do nothing: never active
						break;						
					case "1": //RTC_MODE_EMBEDDED:
						updateRTCEditorEmbedded(sweFld.sweSpan.rtc_ID,sweFld.value);
						break;
					case "2": //RTC_MODE_POPUP:
						if (activeRTC_Popup!=null)
						{	activeRTC_Popup.updateRTCEditorPopup(sweFld.value);
						}
						break;	
					case "3": //RTC_MODE_READ_ONLY:
						updateRTCFrame(sweFld.sweSpan.rtcFrame, sweFld.value, RTC_MODE_READ_ONLY);
						break;	
					default: //indeterminant: do nothing.
						break;							
				}//end switch
				break;
			default:
				break;
		}	
	}
}

function getSWEField(rtc_ID)
{

	var sweFldWrapperID = rtc_ID+SWEFldWrapperSuffix;
	var sweWrapper = GetRTCDoc(rtc_ID).getElementById(sweFldWrapperID);  	
	var sweSpan = sweWrapper.children[0];	
	return sweSpan.sweFld;
}

/*function evalSWEHandler( elt, attr, fn ) : handles special _JGC_sendEvent case*/
function evalSWEHandler( elt, attr, fn )
{
	if (fn!=null)
	{	if (elt.attributes.item(attr)!=null && elt.attributes.item(attr).nodeValue != null &&
		elt.attributes.item(attr).nodeValue.indexOf("_JGC_sendEvent")>-1)
		{	var jgcseValue  = null;
			eval("jgcseValue = " + elt.attributes.item(attr).nodeValue);
			if (jgcseValue!=null && typeof(jgcseValue)=="string" && jgcseValue!="") eval(jgcseValue);
		}
                else if (typeof(fn)=="string")
                {
                   eval(fn)
                }
		else
		{	eval(fn+"anonymous()");
		}
	}
}

function GetRTCDoc (rtc_ID)
{
	//we need to do a test, to see if we have the right rtc_doc
	var sweWrapper;
	try
	{
		sweWrapper = rtc_doc.getElementById(rtc_ID+SWEFldWrapperSuffix);
	}
	catch (e)
	{
	}
	if (sweWrapper == null)
	{
		//then rtc_doc has been lost!  lets get it back!
		//this happens when you REVISIT an rtcEditor
		//after you've ACCESSED A DIFFERENT rtcEdtior
		// (REVIST => not your first time)
		doCleanup();
		rtc_doc = SWEFindFrame(top, rtc_ID).parent.document;
	}
	return rtc_doc;
}

function GetRTCFrame (rtc_ID)
{
   return GetRTCDoc(rtc_ID).getElementById(rtc_ID).contentWindow;
}

function touchSWEField(rtc_ID)
{	var sweFld = getSWEField(rtc_ID)
	sweFld.onpropertychange = null;

	//acquire handle to HI mode prop
	if (this.SWEIsHighInteract==true)
	{	//HI mode handler: fire events manually
		evalSWEHandler( sweFld, "onfocus",  sweFld.onfocus  );
	}
	
	sweFld.onpropertychange = swefld_OnPropertyChange;
}

function setSWEField(rtc_ID,content)
{	var sweFld = getSWEField(rtc_ID)
	sweFld.onpropertychange = null;

	//acquire handle to HI mode prop
	if (this.SWEIsHighInteract==true)
	{	//HI mode handler: fire events manually
		sweFld.value = content;
		evalSWEHandler( sweFld, "onchange", sweFld.onchange ); //if (sweFld.onchange!=null)	eval(sweFld.onchange+"anonymous()");
		evalSWEHandler( sweFld, "onblur",   sweFld.onblur   ); //if (sweFld.onblur!=null)	eval(sweFld.onblur+"anonymous()");
	}
	else
	{	//LI mode handler
	   if (isSIDataLossWarningEnabled && sweFld.value != content)
		{
		   top.trackChange (appletName, appletId);
		}
		sweFld.value = content;
	}
	
	sweFld.onpropertychange = swefld_OnPropertyChange;
}

/*updateRTCFrame(rtcFrame, content, mode): finds the rtc iFrame and updates the value displayed within it*/
function updateRTCFrame(rtcFrame, content, mode)
{	
	var header="";
	
	switch (mode)
	{ 	case 0: //RTC_TEXTAREA:
			header =  HTML_open;
			break;		
		case 1: //RTC_MODE_EMBEDDED:
			header =   HTML_open_embedded;
			break;
		case 2: //RTC_MODE_POPUP:
			header =  HTML_open;
			break;	
		case 3: //RTC_MODE_READ_ONLY:
			header =  HTML_open_read_only;
			break;	
		default: //indeterminant:
			header =  HTML_open;
			break;							
	}//end switch

	rtcFrame.document.open("text/html", "replace"); 
	rtcFrame.document.write(header + securityStrip (content) + HTML_close);
	rtcFrame.document.onkeyup = handleKeyUp;
	rtcFrame.document.close();				

}

/**************************
 RTC Editor Functions
***************************/

//Command Init
var cmdBOLD 		= 10001;
var cmdITALIC 		= 10002;
var cmdUNDERLINE	= 10003;
var cmdUL			= 10004;
var cmdOL			= 10005;
var cmdFONTSIZE 	= 10006;
var cmdFONTNAME 	= 100065;
var cmdFONTCOLOR	= 10007;
var cmdINDENT		= 10008;
var cmdOUTDENT		= 10009;
var cmdCUT			= 10010;
var cmdCOPY			= 10011;
var cmdPASTE		= 10012;
var cmdDELETE		= 10013;
var cmdLEFT			= 100141;
var cmdRIGHT		= 100142;
var cmdCENTER		= 100143;
var cmdFIND			= 10051;
var cmdREPLACE		= 10052;

var cmdIMPORT		= 100701;
var cmdEXPORT		= 100702;

var cmdLINK		= 100801;
var cmdIMAGE		= 100802;

var cmdSAVE			= 10090;
var cmdCANCEL		= 10091;

//Color Picker Init
var allColors = new Array("#000000", "#999999", "#66cc66", "#3399ff", "#cc00ff", "#ff0066", "#ffcc33", "#ff6633", "#66cccc", "#9999ff", "#339933", "#6666cc", "#9900cc", "#cc0066", "#cc9933", "#339999", "#3366cc", "#006666", "#003399", "#660099", "#990066", "#996600", "#666699")

//Font Picker Init
var activeFontIndex = 0;
//Font Picker Init
var activeFontNameIndex = 0;


/*  This script contains 13 translatable strings, found directly below and passed
	in by reference to the local string array found in swemessage_[lang].js	*/

//Translatablte string variables
var sPopup_cancel		="-";
var sPopup_ok			="-";
var sPopup_confirm		="-";
var sPopup_WinTitle		="-";
var sStripHTMLConfirm	="-";
var sFind_EOF			="-";
var sFind_go			="-";
var sFind_find			="-";
var sReplace_count		="-";
var sReplace_all		="-";
var sReplace_go			="-";
var sReplace_replace	="-";
var sReplace_with		="-";
var sCenter				="-";
var sLeft				="-";
var sRight				="-";
var sBold				="-";
var sCopy				="-";
var sCut				="-";
var sExportHTML			="-";
var sFindReplace		="-";
var sItalic				="-";
var sImage				="-";
var sImportHTML			="-";
var sIndent				="-";
var sLink				="-";
var sOrderedList		="-";
var sOutdent			="-";
var sPaste				="-";
var sUnderline			="-";
var sUnorderedList		="-";
var sFontColor			="-";
var sStripHTML	   	="-";

//HTML Editor Component Strings
var HTML_COLOR_PICKER_BTN="";
var HTML_COLOR_PICKER_CHIP="";
var HTML_FIND_POP="";
var HTML_FIND_PANEL="";
var HTML_FINDREPLACE_PANEL="";
var HTML_FONTSIZEPICKER="";
var HTML_BTN_OK="";
var HTML_BTN_CANCEL="";

//string init flag
var rtcStringsInitialized = false;

/* called by the openRTCEditor* functions 
	fetches strings if the rtcStringsInitialized flag is false*/
function initRTCStrings()
{	if (rtcStringsInitialized == false)
	{	
		//acquire handle to translatable string function
		var appObj = (isRTCPopup)?window.opener:this.parent;
		
		//HI mode acccessor
		if (appObj!=null && appObj.SWEIsHighInteract==true)	
		{			
			/*labels and messages*/
			sPopup_cancel		=appObj.App().GetLocalString("RTCPopupCancel");
			sPopup_ok			=appObj.App().GetLocalString("RTCPopupOK");
			sPopup_confirm		=appObj.App().GetLocalString("RTCPopupConfirm");
			sPopup_WinTitle		=appObj.App().GetLocalString("RTCPopupTitle");
			sStripHTMLConfirm	=appObj.App().GetLocalString("RTCStripHtmlConfirm");
			sFind_EOF			=appObj.App().GetLocalString("RTCFindEOF");
			sFind_go			=appObj.App().GetLocalString("RTCFindGo");
			sFind_find			=appObj.App().GetLocalString("RTCFindTxt");
			sReplace_count		=appObj.App().GetLocalString("RTCReplaceCount");
			sReplace_all		=appObj.App().GetLocalString("RTCReplaceAll");
			sReplace_go			=appObj.App().GetLocalString("RTCReplaceGo");
			sReplace_replace	=appObj.App().GetLocalString("RTCReplaceTxt");
			sReplace_with		=appObj.App().GetLocalString("RTCReplaceWith");		
			
			/*alt text*/
			sCenter				=appObj.App().GetLocalString("RTCCenter");
			sLeft				=appObj.App().GetLocalString("RTCLeft");
			sRight				=appObj.App().GetLocalString("RTCRight");
			sBold				=appObj.App().GetLocalString("RTCBold");
			sCopy				=appObj.App().GetLocalString("RTCCopy");
			sCut				=appObj.App().GetLocalString("RTCCut");
			sExportHTML			=appObj.App().GetLocalString("RTCExportHTML");
			sFindReplace		=appObj.App().GetLocalString("RTCFindReplace");
			sItalic				=appObj.App().GetLocalString("RTCItalic");
			sImage				=appObj.App().GetLocalString("RTCImage");
			sImportHTML			=appObj.App().GetLocalString("RTCImportHTML");
			sIndent				=appObj.App().GetLocalString("RTCIndent");
			sLink				=appObj.App().GetLocalString("RTCLink");
			sOrderedList		=appObj.App().GetLocalString("RTCOL");
			sOutdent			=appObj.App().GetLocalString("RTCOutdent");
			sPaste				=appObj.App().GetLocalString("RTCPaste");
			sUnderline			=appObj.App().GetLocalString("RTCUnderline");
			sUnorderedList		=appObj.App().GetLocalString("RTCUL");
			sFontColor			=appObj.App().GetLocalString("RTCFontColor");		
            sStripHTML			=appObj.App().GetLocalString("RTCStripHTML");
            sStripIFRAME        =appObj.App().GetLocalString("RTCStripIFRAME");
		}
		//LI mode accessor
		else 
		{	/*use appObj as-is*/	
		
			/*labels and messages*/
			sPopup_cancel		=appObj._SWEgetMessage("RTCPopupCancel");
			sPopup_ok			=appObj._SWEgetMessage("RTCPopupOK");
			sPopup_confirm		=appObj._SWEgetMessage("RTCPopupConfirm");
			sPopup_WinTitle		=appObj._SWEgetMessage("RTCPopupTitle");
			sStripHTMLConfirm	=appObj._SWEgetMessage("RTCStripHtmlConfirm");
			sFind_EOF			=appObj._SWEgetMessage("RTCFindEOF");
			sFind_go			=appObj._SWEgetMessage("RTCFindGo");
			sFind_find			=appObj._SWEgetMessage("RTCFindTxt");
			sReplace_count		=appObj._SWEgetMessage("RTCReplaceCount");
			sReplace_all		=appObj._SWEgetMessage("RTCReplaceAll");
			sReplace_go			=appObj._SWEgetMessage("RTCReplaceGo");
			sReplace_replace	=appObj._SWEgetMessage("RTCReplaceTxt");
			sReplace_with		=appObj._SWEgetMessage("RTCReplaceWith");
						
			/*alt text*/
			sCenter				=appObj._SWEgetMessage("RTCCenter");
			sLeft				=appObj._SWEgetMessage("RTCLeft");
			sRight				=appObj._SWEgetMessage("RTCRight");
			sBold				=appObj._SWEgetMessage("RTCBold");
			sCopy				=appObj._SWEgetMessage("RTCCopy");
			sCut				=appObj._SWEgetMessage("RTCCut");
			sExportHTML			=appObj._SWEgetMessage("RTCExportHTML");
			sFindReplace		=appObj._SWEgetMessage("RTCFindReplace");
			sItalic				=appObj._SWEgetMessage("RTCItalic");
			sImage				=appObj._SWEgetMessage("RTCImage");
			sImportHTML			=appObj._SWEgetMessage("RTCImportHTML");
			sIndent				=appObj._SWEgetMessage("RTCIndent");
			sLink				=appObj._SWEgetMessage("RTCLink");
			sOrderedList		=appObj._SWEgetMessage("RTCOL");
			sOutdent			=appObj._SWEgetMessage("RTCOutdent");
			sPaste				=appObj._SWEgetMessage("RTCPaste");
			sUnderline			=appObj._SWEgetMessage("RTCUnderline");
			sUnorderedList		=appObj._SWEgetMessage("RTCUL");
			sFontColor			=appObj._SWEgetMessage("RTCFontColor");				
            sStripHTML			=appObj._SWEgetMessage("RTCStripHTML");
            sStripIFRAME        =appObj._SWEgetMessage("RTCStripIFRAME");
		}
		
		
		//compile UI widget definitions
		HTML_MINIBUTTON	=			'<table height="15" border="0" cellspacing="0" cellpadding="0"><tr>' +
									'<td BACKGROUND="../../images/btn_mid.gif" class="minibuttonOn" unselectable="on"><nobr><a href="javascript:void(0)" onclick="parent.execRTCcmd(event)" cmd="%CMD%">%LABEL%</a></nobr></td>' +
									'</tr></table>';		
	
		HTML_COLOR_PICKER_BTN =		'<div class="btnOut">' + 
									'<img id="colorPickerControl" src="../../images/rtc_txtclr.gif" class="btnOut" align="absmiddle"  ' + 
									'onmousedown="parent.BtnDwn(event);" 	onmouseup="parent.execRTCcmd(event);" ' + 
									'onmouseover="parent.BtnOvrParent(event);" 	onmouseout="parent.BtnOutParent(event);" 	cmd="cmdFONTCOLOR" ' +
									'style="background-color:%ACTIVE_COLOR%" alt="%ALT%">' +
									'<img src="../../images/%ARROW%" class="btnOut" align="absmiddle"  ' + 
									'onmousedown="parent.BtnDwn(event);" onmouseup="parent.togglePopoutPanel(this,\'colorPickerPanel\');" ' + 
									'onmouseover="parent.BtnOvrParent(event);" onmouseout="parent.BtnOutParent(event);" alt="%ALT%">' +
									'</div>';
									
		HTML_COLOR_PICKER_CHIP = 	'<td class="btnPopOut"  unselectable="on">' + 
									'<img unselectable="on" class="btnOut" src="../../images/rtc_colors.gif" align="middle" border="0" ' +
									'onmouseup="parent.setActiveColor(this,this.color);parent.execRTCcmd(event);"  ' +
									'onmouseover="parent.BtnPopOvrParent(event);" onmouseout="parent.BtnPopOutParent(event);"  onmousedown="parent.BtnPopDwn(event)" ' +
									'cmd="cmdFONTCOLOR" color="%COLOR%"  style="background-color:%COLOR%">' +
									'</td>'	
									
									
		HTML_FIND_POP =			'<div class="btnOut">' +
									'<img id="findControl" src="../../images/rtc_find.gif" class="btnOut" align="absmiddle" ' + 
									'onmousedown="parent.BtnDwn(event);" onmouseup="parent.togglePopoutPanel(this,\'find\');"  ' +
									'onmouseover="parent.BtnOvrParent(event);" onmouseout="parent.BtnOutParent(event);"  alt="%ALT%">' +
									'<img src="../../images/%ARROW%" class="btnOut" align="absmiddle"  ' + 
									'onmousedown="parent.BtnDwn(event);" onmouseup="parent.togglePopoutPanel(this,\'find\');" ' + 
									'onmouseover="parent.BtnOvrParent(event);" onmouseout="parent.BtnOutParent(event);" alt="%ALT%">' +
									'</div>';			
									
		HTML_FIND_PANEL =			'<table id="find" cellpadding="0" cellspacing="1" style="display:none;"><tr class="btnPop">' +
									'<td>' +
									'<img unselectable="on" src="../../images/spacer.gif" width="2" height="24"><img unselectable="on" src="../../images/rtc_reveal_opn_d.gif" onmousedown="parent.BtnPopDwn(event);" onmouseup="parent.togglePopoutPanel(this,\'findreplace\');" onmouseover="parent.BtnPopOvr(event)" onmouseout="parent.BtnPopOut(event)" align="absmiddle" class="btnPopOut" show="findreplace" hide="find">' +
									'<img  unselectable="on" src="../../images/spacer.gif" width="6" height="24">' +	
									'</td><td  unselectable="on" >' + sFind_find + ':</td>' + 
									'<td><input unselectable="off" id="find1" type="text" size="10" tabindex="0">&nbsp;</td>' + 
									'<td>' +
									HTML_MINIBUTTON.replace(/%LABEL%/gi, sFind_go).replace(/%CMD%/gi,"cmdFIND") +
									'</td></tr></table>';
									
									
		HTML_FINDREPLACE_PANEL =	'<table id="findreplace" cellpadding="0" cellspacing="1" style="display:none;"><tr class="btnPop">' +
									'<td>' +
									'<img  unselectable="on" src="../../images/spacer.gif" width="2" height="24"><img  unselectable="on" src="../../images/rtc_reveal_cls_d.gif" onmouseup="parent.togglePopoutPanel(this,\'find\')" onmousedown="parent.BtnPopDwn(event);" onmouseover="parent.BtnPopOvr(event)" onmouseout="parent.BtnPopOut(event)" align="absmiddle" class="btnPopOut" show="find" hide="findreplace">' +
									'<img  unselectable="on" src="../../images/spacer.gif" width="6" height="24">' +		
									'</td>' + 
									'<td  unselectable="on" >' + sReplace_replace + ':</td>' +
									'<td><input unselectable="off" id="find2" type="text" size="10"></td>' +
									'<td  unselectable="on" >&nbsp;' + sReplace_with + ':</td>' +
									'<td><input unselectable="off" id="replaceWith" type="text" size="10">&nbsp;</td>' +
									'<td>' +	
									HTML_MINIBUTTON.replace(/%LABEL%/gi, sReplace_go).replace(/%CMD%/gi,"cmdREPLACE") +
									'</td><td>&nbsp;&nbsp;&nbsp;</td>' +	 
									'<td><input unselectable="off" id="replaceAll" type="checkbox" ></td>' +	
									'<td unselectable="on" >' + sReplace_all +	'</td>' +
									'</tr></table>';	
									
									
		HTML_FONTSIZEPICKER = 	'' + 
									'<select unselectable="on" class="btn" onchange="parent.execRTCcmd(event);" cmd="cmdFONTSIZE">' +
									'<option value="2">10</option><option value="-1">--</option><option value="1">8</option><option value="2">10</option>' +
									'<option value="3">12</option><option value="4">14</option><option value="5">18</option><option value="6">24</option>' +
									'<option value="7">36</option></select>';	
									
		HTML_FONTNAMEPICKER = 	'' + 
									'<select unselectable="on" class="btn" onchange="parent.execRTCcmd(event);" cmd="cmdFONTNAME">' +
									'<option value="Arial">Arial</option><option value="-1">---------------</option><option value="Arial">Arial</option><option value="Verdana">Verdana</option>' +
									'<option value="Times New Roman">Times New Roman</option><option value="Courier">Courier</option>' +
									'</select>';										
									
		HTML_BTN_OK	=			HTML_MINIBUTTON.replace(/%LABEL%/gi, sPopup_ok).replace(/%CMD%/gi,"cmdSAVE");	
								
		HTML_BTN_CANCEL	=		HTML_MINIBUTTON.replace(/%LABEL%/gi, sPopup_cancel).replace(/%CMD%/gi,"cmdCANCEL");									
		
		HTML_ICON 			= 	'<td><span unselectable="on" class="btn" onmouseover="parent.BtnOvr(event);" onmouseout="parent.BtnOut(event);" onmouseup="parent.execRTCcmd(event);"><img class="btnOut" src="../../images/%IMG%" border="0" cmd="cmd%CMD%" alt="%ALT%"></span></td>';
		HTML_DIV 			= 	'<td><img src="../../images/rtc_div.gif" border="0" alt=""></td>';
		
		//set string init flag to true							
		rtcStringsInitialized = true;
		
	}//END IF
}																			

// Initializes the RTC Editor iFrame
// context: iFrame	
function initEditor(win)
{	
	win.document.dir = appDIR;
	
	rtcEditor_Frame = win.frames[rtcEditor_Frame_Name];
	rtcEditor_Frame.document.designMode="On";
	rtcEditor_Frame.document.open("text/html", "replace"); 	
    rtcEditor_Frame.document.write(HTML_html_open_tag);
    rtcEditor_Frame.document.onkeyup = handleKeyUp;
	
   // calculate base for relative links.
   var loc = "";
        
   if (isRTCPopup) loc = window.opener.location.href;
   else                     loc = window.parent.location.href;

   if (loc.indexOf("?")!=-1) loc = loc.substr(0,loc.indexOf("?"));
   if (loc.indexOf("#")!=-1) loc = loc.substr(0,loc.indexOf("#"));
   if (loc.lastIndexOf("/")!=-1) 
   {       if (loc.lastIndexOf("/")!=(loc.length-1))
           {       loc = loc.substr(0,loc.lastIndexOf("/")+1);        }
   }
   else
   {       loc = loc + "/";
   }
        
   var base = "<base target='_blank' href='" + loc + "'>";
        
   rtcEditor_Frame.document.write(base);

	//init Popup
	if (isRTCPopup)
	{	rtcEditor_Frame.document.write(HTML_body_open_tag);
		rtcEditor_Frame.document.write(securityStrip (window.opener.activeSWEField_Obj.value));	}
	//init Embedded
	else
	{	rtcEditor_Frame.document.write(HTML_body_open_tag_embedded);
		rtcEditor_Frame.document.write(securityStrip (window.parent.activeSWEField_Obj.value));	}
	
	rtcEditor_Frame.document.write(HTML_close);	
	rtcEditor_Frame.document.close();

	//init text range
	trange = rtcEditor_Frame.document.body.createTextRange();	

	//set focus on the edit frame
	rtcEditor_Frame.focus();	
	rtcEditor_Frame.loaded=true;
}


// Shows the embedded RTC controls	
// context: main window		
function openRTCEditorEmbedded(rtc_ID)
{	//only open for editing if this field is editable
	var obj=getSWEField( rtc_ID );
	var i = rtc_ID.substring(3,rtc_ID.length); // i = 0 if rtc_ID is rtc0
	rtc_arr_indx=i*1;
	
	//If the object doesn't exist or is read-only, do nothing.
	if(obj.readOnly==false && obj)
   {
   //If RTC is getting loaded for the first time,create the frame.
	if(rtcIsLoaded[rtc_arr_indx]!=1 && obj.readOnly==false && obj)
	{				
		rtcIsActive = true;
		rtcIsLoaded[rtc_arr_indx]=1; // Rtc is now loaded
		rtcIsOpen[rtc_arr_indx]=1; //Rtc is open
		activeRTC_ID=rtc_ID;
		touchSWEField(activeRTC_ID);
		activeSWEField_Obj = obj;
		
		//set iFrame scrollbars to no by reading the iframe HTML into memory,
		//destroying the iFrame and recomposing it with scrolling="no"
		activeRTC_Obj = rtc_doc.getElementById(rtc_ID);
		var tmp = activeRTC_Obj.outerHTML;
		var re1 = new RegExp("scrolling='auto'","gi");
		var re2 = new RegExp("<iframe ","gi");
		tmp = tmp.replace(re1,"").replace(re2,"<iframe scrolling='no' ");
		activeRTC_Obj.outerHTML=tmp;
		
		activeRTC_Frame = GetRTCFrame(rtc_ID);
		activeRTC_Frame.location = (resolveScriptsDir()+'rtcEditorEmbedded.html');
	} 
	else
	//if the RTC is already loaded, just make it active.
	{
		rtcIsOpen[rtc_arr_indx]=1;
		rtcIsActive = true;
		activeRTC_ID=rtc_ID;
		touchSWEField(activeRTC_ID);
		activeSWEField_Obj = obj;
		activeRTC_Frame = GetRTCFrame(rtc_ID);
		rtcEditor_Frame = GetRTCFrame(rtc_ID).frames[rtcEditor_Frame_Name];
	}
  }
}


// Saves changes back to the SWEField and hides the embedded RTC controls	
// context: main window	
function closeRTCEditorEmbedded(rtc_ID)
{	//only post changes when this field is the active RTC
	var i = rtc_ID.substring(3,rtc_ID.length);; // i = 0 if rtc_ID is rtc0
	var rtc_arr_indx= i*1			   // converting "1" to 1
	if(rtcIsOpen[rtc_arr_indx] && !bNeedFocus) //if rtc has just lost focus, check for data loss and deactivate this RTC. else do nothing.
	{			
		//retrieve new value & set SWE field
		saveRTCEditorEmbedded(rtc_ID);
		rtcIsActive=false;
		rtcIsOpen[rtc_arr_indx]=0;
		doCleanup();
// The close editor method has been altered to allow tabbing to/from the RTC field. As a result of this change
// the editor will not hide on losing focus.
	}
}

// Saves changes back to the SWEField and hides the embedded RTC controls	
// context: main window	
function saveRTCEditorEmbedded(rtc_ID)
{	//only post changes when this field is the active RTC
	if (rtc_ID=="")	rtc_ID = activeRTC_ID;
	if (rtcIsActive==true && activeRTC_ID==rtc_ID)
	{			
		//retrieve new value & set SWE field
		var rtcEditor_Frame = GetRTCFrame(rtc_ID).frames[rtcEditor_Frame_Name];
		if (rtcEditor_Frame!=null)
		{			
			var newSWEField_Value = rtcEditor_Frame.document.body.innerHTML;
		
			setSWEField(rtc_ID, newSWEField_Value);
		}
	}
}

// Saves changes back to the SWEField and hides the embedded RTC controls	
// context: main window	
function updateRTCEditorEmbedded(rtc_ID,value)
{	//only post changes when this field is the active RTC
	if (rtc_ID=="")	rtc_ID = activeRTC_ID;
	if (rtcIsActive==true && activeRTC_ID==rtc_ID)
	{	if (value != activeRTC_Frame.document.body.innerHTML)
		{	activeRTC_Frame.document.body.innerHTML = value;
			activeRTC_Frame.document.selection.empty();
		}
	}
}

// Launches the RTC Editor in popup mode
// context: main window
function openRTCEditorPopup(rtc_ID)
{		
	rtcIsActive = true;
	activeRTC_ID=rtc_ID; 
	touchSWEField(activeRTC_ID);
	activeSWEField_Obj = getSWEField( activeRTC_ID );
	activeRTC_Frame = GetRTCFrame(rtc_ID);	
	var w = window.open("rtcEditorPopup.html", "", "resizable,width=700,height=500");	
}

// Saves change into SWEField in main window and closes popup window
// context: iFrame
function closeRTCEditorPopup() 
{	
	saveRTCEditorPopup();			
	window.opener.doCleanup();			
	this.close();
}

// Saves change into SWEField in main window
// context: iFrame
function saveRTCEditorPopup() 
{	
	var newSWEField_Value = rtcEditor_Frame.document.body.innerHTML;
	window.opener.setSWEField(window.opener.activeRTC_ID, newSWEField_Value);
	window.opener.activeRTC_Frame.document.open("text/html", "replace");
	window.opener.activeRTC_Frame.document.write(HTML_open + securityStrip (newSWEField_Value) + HTML_close);
	window.opener.activeRTC_Frame.document.onkeydown = handleKeyUp;
	window.opener.activeRTC_Frame.document.close();			
}

// Updates into SWEField in main window
// context: iFrame
function updateRTCEditorPopup(value) 
{	
	if (value!=rtcEditor_Frame.document.body.innerHTML)
	{	rtcEditor_Frame.document.body.innerHTML = value;
		rtcEditor_Frame.document.selection.empty();
		saveRTCEditorPopup();
	}
}

// clears pointers to the active RTC
// context: main window
function doCleanup()
{	activeSWEField_Obj = null;	
	activeRTC_Obj = null;	
	activeRTC_Frame = null;	
	activeRTC_Popup = null;	
	activeRTC_ID="";
	rtcIsActive = false;	
	rtcEditor_Frame=null;
	trange=null;
}

// Executes editing commands depending on which button has been pushed
// context: iFrame
function execRTCcmd(et)
{
	// get requested action via the event target's custom property 'cmd'
	var obj = et.srcElement;
	var text = obj.cmd; 				
	var cmd = eval("window." + text);

   switch ( cmd )
   {

      case cmdUL:
      case cmdOL:
      case cmdINDENT:
      case cmdOUTDENT:
      case cmdLEFT:	
      case cmdRIGHT:
      case cmdCENTER:
         if (rtcEditor_Frame.document.selection.type == 'None')
         {   
            var tr = rtcEditor_Frame.document.selection.createRange ();
            if (tr.moveEnd ("character",1)==0)
               tr.moveStart ("character",-1);
            tr.select ();
         }
          
         break;
   }
	
	//perform requested action
	switch ( cmd )
	{	
		//text edit methods
		case 10001: //cmdBOLD:
			rtcEditor_Frame.document.execCommand("Bold");
			break;
		case 10002: //cmdITALIC:
			rtcEditor_Frame.document.execCommand("Italic");
			break;		
		case 10003: //cmdUNDERLINE:
			rtcEditor_Frame.document.execCommand("Underline");
			break;		
		case 10004: //cmdUL:
			rtcEditor_Frame.document.execCommand("InsertUnorderedList");
			break;		
		case 10005: //cmdOL:
			rtcEditor_Frame.document.execCommand("InsertOrderedList");
			break;		
		case 10006: //cmdFONTSIZE:
			//check that selection is a valid choice, not a div
			if (obj.options[obj.selectedIndex].value>-1)
			{	rtcEditor_Frame.document.execCommand("FontSize",false,obj.options[obj.selectedIndex].value);
				//update drop-down to add active font size to the first position of the drop-down
				activeFontIndex = obj.selectedIndex;
				obj.options[0].text = obj.options[activeFontIndex].text;
				obj.options[0].value = obj.options[activeFontIndex].value;
				obj.selectedIndex=0;
			} else //this is a div so return selection to the previously active selection
			{	obj.selectedIndex=activeFontIndex;	}
			break;		
		case 100065: //cmdFONTNAME:
			//check that selection is a valid choice, not a div
			if (obj.options[obj.selectedIndex].value!="-1")
			{	rtcEditor_Frame.document.execCommand("FontName",false,obj.options[obj.selectedIndex].value);
				//update drop-down to add active font name to the first position of the drop-down
				activeFontNameIndex = obj.selectedIndex;				
				obj.options[0].text = obj.options[activeFontNameIndex].text;
				obj.options[0].value = obj.options[activeFontNameIndex].value;
				obj.selectedIndex=0;
			} else //this is a div so return selection to the previously active selection
			{	obj.selectedIndex=activeFontNameIndex;	}
			break;				
		case 10007: //cmdFONTCOLOR:
			rtcEditor_Frame.document.execCommand("ForeColor",false,activeColor);
			break;	
		case 10008: //cmdINDENT:
			rtcEditor_Frame.document.execCommand("Indent");     
			break;
		case 10009: //cmdOUTDENT:
			rtcEditor_Frame.document.execCommand("Outdent");
			break;
		case 10010: //cmdCUT:
			rtcEditor_Frame.document.execCommand("Copy");
			rtcEditor_Frame.document.selection.createRange().pasteHTML("");
			break;
		case 10011: //cmdCOPY:
			rtcEditor_Frame.document.execCommand("Copy");
			break;			
		case 10012: //cmdPASTE:
			rtcEditor_Frame.document.execCommand("Paste");
			break;			
		case 10013: //cmdDELETE:
			rtcEditor_Frame.document.execCommand("Delete");
			break;	
			
		case 100141: //cmdLeft:
			rtcEditor_Frame.document.execCommand("JustifyLeft");
			break;			
		case 100142: //cmdRight:
			rtcEditor_Frame.document.execCommand("JustifyRight");
			break;							
		case 100143: //cmdLeft:
			rtcEditor_Frame.document.execCommand("JustifyCenter");
			break;									
			
		case 10050: //cmdCREATELINK
			rtcEditor_Frame.document.execCommand("CreateLink");
			break;	
				
				
		//Find & Replace Methods			
		case 10051: //cmdFind
                        //qin li, CR#:12-CDJ7U7 
			findText(activeRTC_Frame.find1.value)
			break;
		case 10052: //cmdFindReplace	
			// qin li, CR#:12-CDJ7U7      
			replaceText(activeRTC_Frame.find2.value,activeRTC_Frame.replaceWith.value,activeRTC_Frame.replaceAll.checked)
			break;
			
		//Import & Export Calling Methods			
		case 100701: //cmdImport
			rtc_importHTML();
			break;
		case 100702: //cmdExport	
			rtc_exportHTML();
			break;			

		//Link & Graphics Pick List Methods
		case 100801: //cmdLINK
			rtcMarkSelection(rtcEditor_Frame.document,RTC_LINK_INSERTION_POINT);
			if (isRTCPopup) 
			{	window.opener.saveRTCEditorPopup();
			} else {
				window.parent.saveRTCEditorEmbedded("");
			}
			rtc_doc.parentWindow.rtcSelectLink();
			if (isRTCPopup) 
			{	if (window.opener.activeSWEField_Obj!=null) window.opener.closeRTCEditorPopup();
			} else {
				if (window.parent.activeSWEField_Obj!=null) window.parent.closeRTCEditorEmbedded(window.parent.activeRTC_ID);
			}
			break;
		case 100802: //cmdIMAGE
			rtcMarkSelection(rtcEditor_Frame.document,RTC_GRAPHIC_INSERTION_POINT);
			if (isRTCPopup) 
			{	window.opener.saveRTCEditorPopup();
			} else {
				window.parent.saveRTCEditorEmbedded("");
			}
			rtc_doc.parentWindow.rtcSelectImage();
			if (isRTCPopup) 
			{	if (window.opener.activeSWEField_Obj!=null) window.opener.closeRTCEditorPopup();
			} else {
				if (window.parent.activeSWEField_Obj!=null) window.parent.closeRTCEditorEmbedded(window.parent.activeRTC_ID);
			}
			break;
	
		//Popup commit methods	
		case 10090: //cmdSAVE:
			closeRTCEditorPopup(rtcEditor_Frame);
			break;	
		case 10091: //cmdCANCEL:
			var proceed = SWEConfirm(sPopup_confirm);
			if (proceed) 
			{	window.opener.doCleanup(); window.close();  	}			
			break;							
	}
}

//Non-supported browsers only: strips the HTML tags from the field value
function stripHTMLTags(rtc_ID)
{
// This has already been done in initRTCStrings
//	sStripHTMLConfirm	=this.App().GetLocalString("RTCStripHtmlConfirm");

	var proceed = rtc_doc.parentWindow.confirm(sStripHTMLConfirm,"");
	if (proceed==true)
	{	
		frmLen=rtc_doc.forms.length;
		targetField=null;
		for (var i=0;i<frmLen;i++)
		{	fldLen = rtc_doc.forms[i].elements.length;
			for (var j=0;j<fldLen;j++)
			{
				if(rtc_doc.forms[i].elements[j].name==rtc_ID+"Hidden")
				{	//if we find the rtc hidden field then 
					//the textarea we are interested in is the 
					//one directly before it(j-1)
					sweFld = rtc_doc.forms[i].elements[j-1];
					if (sweFld)
					{	var str = sweFld.value;
					
						var re1 = new RegExp("<>","gi");
						var re2 = new RegExp("<br>","gi");
						var re3 = new RegExp("<p>","gi");
						var re4 = new RegExp("<[^ ][^>]*>","gi");
						var re5 = new RegExp("&lt;&gt;","gi");
						var re6 = new RegExp("&nbsp;","gi");
						var re7 = new RegExp("&amp;","gi");

						
						var strippedStr = str.replace(re1,"&lt;&gt;").replace(re2,"\r\n").replace(re3,"\r\n\r\n").replace(re4,"").replace(re5,"<>").replace(re6," ").replace(re7,"&");
						
						//acquire handle to HI mode prop
						if (this.SWEIsHighInteract  && this.SWEIsHighInteract==true)
						{	//HI mode handler: fire events manually
							evalSWEHandler( sweFld, "onfocus",  sweFld.onfocus  ); //eval(sweFld.onfocus+"anonymous()");
							sweFld.value = strippedStr;
							evalSWEHandler( sweFld, "onchange", sweFld.onchange ); //eval(sweFld.onchange+"anonymous()");
							evalSWEHandler( sweFld, "onblur",   sweFld.onblur   ); //eval(sweFld.onblur+"anonymous()");
						}
						else
						{	//SI mode handler
							sweFld.value = strippedStr;		}
						
						
					}
					//our work is done so break out of both loops	
					break;break; 
				}//end if	
			}//end for j
		}//end for i
	}//end if proceed	
}

// context: iFrame
function BtnDwn(et)	{	et.srcElement.className = "btnDwn";}


// context: iFrame
function BtnUp(et)	{	et.srcElement.className = "btnUp";}

// context: iFrame
function BtnOvr(et) { et.srcElement.className = "btnOvr"; }
function BtnOvrParent(et)
{
   BtnOvr(et);
	et.srcElement.parentElement.className = "btnOvr";
}

// context: iFrame
function BtnOut(et) { et.srcElement.className = "btnOut"; }
function BtnOutParent(et)
{
   BtnOut(et);
	et.srcElement.parentElement.className = "btnOut";
}

// context: iFrame
function BtnPopOvr(et)		{	et.srcElement.className="BtnPopOvr";	}
function BtnPopOvrParent(et)	{	BtnPopOvr(et);
								et.srcElement.parentElement.className="BtnPopOvr";	}

// context: iFrame
function BtnPopOut(et)		{	et.srcElement.className="BtnPopOut";	}
function BtnPopOutParent(et)	{	BtnPopOut(et);
								et.srcElement.parentElement.className="BtnPopOut";	}

// context: iFrame
function BtnPopDwn(et){	et.srcElement.className="BtnPopDwn";	}

//maintains an array of all popout panels
function registerAsPopoutPanel(win,name)	{	win.document.allPopoutPanels[win.document.allPopoutPanels.length] = name;	}

//active panel accessor methods
function setActivePopoutPanel(win,name)		{	win.document.activePopoutPanel = name;		}
function getActivePopoutPanel(win)			{	return	win.document.activePopoutPanel;	}

/*hides or shows the named panel; hides all other panels*/
function togglePopoutPanel(win,panel)
{	var showOurPanel=false;
	//determine if our panel is the active panel; if it is it should be hidden
	if (getActivePopoutPanel(win)==panel)
	{	showOurPanel=false; setActivePopoutPanel(win,"");

		/*give the height of our panel back to the edit frame*/
		var height = win.document.all["editFrame"].offsetHeight + win.document.all[panel].offsetHeight;		
		win.document.all["editFrame"].height = height;
		win.document.all["editFrame"].style.height = height; // necessary in some cases.
	}
	else 
	{	showOurPanel=true;	
		prevPanelH = (getActivePopoutPanel(win)!="")?win.document.all[getActivePopoutPanel(win)].offsetHeight:0;
		setActivePopoutPanel(win,panel);

		win.document.all[ panel ].style.display="block";

		/*make room for our panel by adding back the height of the previous panel to the height of the edit frame and 
			removing the height of our panel from the height of the edit frame	*/
		var height = win.document.all["editFrame"].offsetHeight + prevPanelH - win.document.all[panel].offsetHeight;
		win.document.all["editFrame"].height = height;
		win.document.all["editFrame"].style.height = height; // necessary in some cases.
	}
	
	//hide all panels except our panel
	var len = win.document.allPopoutPanels.length;
	for (var i=0;i<len;i++)
	{	if (win.document.allPopoutPanels[i] != panel || showOurPanel==false)
		{	win.document.all[ win.document.allPopoutPanels[i] ].style.display="none";	}	}
	
}

// generates the rtcEditor font-size drop-down
function createFontSizePicker()		{	return "<td>" + HTML_FONTSIZEPICKER + "</td>";	}

// generates the rtcEditor font-name drop-down
function createFontNamePicker()		{	return "<td>" + HTML_FONTNAMEPICKER + "</td>";	}

function createColorPickerControl(direction)
{	if (direction=="below")	{img="rtc_reveal_dwn.gif";}
	else 					{img="rtc_reveal_up.gif";}				
	return "<td>" + HTML_COLOR_PICKER_BTN.replace(/%ACTIVE_COLOR%/gi,activeColor).replace(/%ARROW%/gi,img).replace(/%ALT%/gi,sFontColor) + "</td>";	
}

function createColorPickerPanel(win,direction)
{
	var HTML = "";
	var len = allColors.length;
	for (var i=0;i<len; i++ )
	{	HTML += HTML_COLOR_PICKER_CHIP.replace(/%COLOR%/gi,allColors[i]); 	}
	
	HTML = '<table align="center" id="colorPickerPanel" style="display:none" cellpadding="2" cellspacing="1"><tr valign="middle" unselectable="on">' + 
			'<td><img src="../../images/spacer.gif" width="1" height="12"></td>' + HTML + '</tr></table>';
			
	registerAsPopoutPanel(win,"colorPickerPanel");		
	
	return HTML;
}

//Once a color is picked this function stores the value and hides the color picker panel
function setActiveColor(win,color)
{	activeColor = color;
	win.document.all['colorPickerControl'].style.backgroundColor=activeColor;
	togglePopoutPanel(win,'colorPickerPanel');	}


/*----------------------*/
/*---Find/Replace Code--*/
/*----------------------*/

//Find & Replace Widget Constructors
function createFindReplaceControl(direction) 
{	if (direction=="below")	{img="rtc_reveal_dwn.gif";}
	else 					{img="rtc_reveal_up.gif";}		
	return "<td>" +	HTML_FIND_POP.replace(/%ARROW%/gi,img).replace(/%ALT%/gi,sFindReplace)	+"</td>";		
}

function createFindReplacePanel(win,direction)
{		
	registerAsPopoutPanel(win,"find");		
	registerAsPopoutPanel(win,"findreplace");	
	return (HTML_FIND_PANEL + HTML_FINDREPLACE_PANEL);
}

/* Find & Replace Functions*/
function findText(str1)
{	if (str1.length==0) return;
	var found=trange.findText(str1);
	if (found==true)	{	trange.select();	trange.collapse(false);	}
	else {	//reset the text range to the full range
			trange.expand("textedit");
                        SWEAlert(sFind_EOF, rtc_doc.parentWindow);        }
}

function replaceText(str1,str2,globalReplace)
{	
	if (str1.length==0) return;	
	var count=0;
	trange.expand("textedit"); //reset text range to the full range
	var found=trange.findText(str1);
	if (trange && found==true)
	{	found=true; trange.select(); trange.text = str2;	count++;	}
	
	while (trange && found==true && globalReplace==true)
	{	found=trange.findText(str1);
		if (found==true)
		{	trange.select(); trange.text = str2; trange.collapse(false); count++;	}
		else
		{	//reset the text range to the full range
			trange.expand("textedit");
                        SWEAlert( sReplace_count.replace("%1",count), rtc_doc.parentWindow ); }
	}
}

function createIcon(img,cmd,alt)
{	return HTML_ICON.replace(/%IMG%/gi,img).replace(/%CMD%/gi,cmd).replace(/%ALT%/gi,alt);		}

function createDiv()
{	return HTML_DIV;		}

function resolveScriptsDir()
{	//resolve scripts directory
		//1. get a handle to the current document's script array
		var scriptDir="";
		var scriptArray = this.document.scripts;
		//2. find the src value of the scripts element that contains rtceditor.js
		for (var i=0;i < scriptArray.length;i++)
		{	var path=scriptArray[i].src;
			if (path.toLowerCase().indexOf("rtceditor.js")>-1)
			{	//3. parse this string to determine the path to the scripts directory
				var pos = path.lastIndexOf("/");
				if (pos>-1)	
				{	scriptDir=path.slice(0,pos+1);
					break; }
			}			
		}		
		return scriptDir;
}


/*--------------------------------------------------------------------------*/
/*---RTC Add-on Functionality: Import & Export------------------------------*/
/*--------------------------------------------------------------------------*/

var launchpadEnabled=false;
function rtc_writeLaunchPad(doc)
{	
	rtc_doc = doc;
	if (launchpadEnabled==false && rtc_brwsr>=ie5 && isMac==false)
	{	var objectTag='<OBJECT id="siebelhtmlEditorLaunch" width="1" height="1" border="0" codeBase="'+resolveAppletDir()+'siebelhtmlEditorLaunch.cab#version=1,0,0,0" classid="CLSID:727BEA23-42BE-4B46-9D2C-11521BF55940"><PARAM NAME="_ExtentX" VALUE="159"><PARAM NAME="_ExtentY" VALUE="159"></OBJECT>';
		rtc_doc.write(objectTag);	
		launchpadEnabled=true;	}
}

function rtc_exportHTML()
{	var appObj = (isRTCPopup)?window.opener:this.parent;
	if (appObj.launchpadEnabled)
	{	var objLaunch = new ActiveXObject("siebelhtmlEditorLaunch.shtmlLnchCtrl"); 
		var rtcEditor_Frame = GetRTCFrame(activeRTC_ID).frames[rtcEditor_Frame_Name];
		var HTML=rtcEditor_Frame.document.body.innerHTML;
		var ret = objLaunch.ExportHTMLAndLaunchEditor(HTML);
		delete objLaunch;	
	}
}

function rtc_importHTML()
{	var appObj = (isRTCPopup)?window.opener:this.parent;
	if (appObj.launchpadEnabled)
	{
		appObj.bNeedFocus=true;
		bNeedFocus=true;	
		var objLaunch = new ActiveXObject("siebelhtmlEditorLaunch.shtmlLnchCtrl");
		var HTML = objLaunch.ImportHTML();
		if (objLaunch.importCancelled != 1)
		{
			var rtcEditor_Frame = GetRTCFrame(activeRTC_ID).frames[rtcEditor_Frame_Name];
			updateRTCFrame(rtcEditor_Frame, HTML, GetRTCFrame(activeRTC_ID).rtcMode); //rtcEditor_Frame.document.body.innerHTML=HTML;

		}
		delete objLaunch;
		appObj.bNeedFocus=false;
		bNeedFocus=false;	
	}
}
	
// determines the path to SWE generated applets directory (for CABs/JARs files)
function resolveAppletDir()
{	//resolve scripts directory
		//1. get a handle to the current document's script array
		var scriptDir="";
		var appletDir="";
		var scriptArray = this.document.scripts;
		//2. find the src value of the scripts element that contains rtceditor.js
		for (var i=0;i < scriptArray.length;i++)
		{	var path=scriptArray[i].src;
			if (path.toLowerCase().indexOf("rtceditor.js")>-1)
			{	//3. parse this string to determine the path to the scripts directory
				var pos = path.lastIndexOf("/");
				if (pos>-1)	
				{	scriptDir=path.slice(0,pos+1);
					appletDir=scriptDir.replace(/SCRIPTS/gi,"applets");
					break;				}
			}			
		}		
		return appletDir;
}

/*--------------------------------------------------------------------------*/
/*---RTC Add-on Functionality: Link & Image Dialogs-------------------------*/
/*--------------------------------------------------------------------------*/
var rtc_link_image_dialogs_Enabled=false;
var rtc_link_dialogs_Available=false;
var rtc_image_dialogs_Available=false;

// makes the RTC link button available if enabled.
function setRTCLinkDialogAvailable()
{	rtc_link_dialogs_Available=true;
}

// makes the RTC image button available if enabled.
function setRTCImageDialogAvailable()
{	rtc_image_dialogs_Available=true;
}

// wraps the unidentified SWEField in a span which 
// enables us to hide the SWEField at runtime 
// context: main window
function createRTCLinkCtl(type,doc)
{
   rtc_doc = doc;
	
	//NS, IE4 and other browsers cannot support the RTC Editor Link Button
        //modified if-test because DIR structure not supported on Mac IE5
	if (rtc_brwsr<=ie4 || isMac) {rtc_link_image_dialogs_Enabled = false;}
	//due to an onblur bug with iFrame ie5 can only support the RTC Editor as a popup
	//since the popup would disappear when the link dialog popup was invoked, 
	//disable the feature with ie5 
	else if (rtc_brwsr >= ie5 && rtc_brwsr < ie5_5)	{rtc_link_image_dialogs_Enabled = false;}
	//ie5.5+ 
	else if (rtc_brwsr >= ie5_5)	{rtc_link_image_dialogs_Enabled = true;}	

	//create the component - do nothing in text mode.	
        if (rtc_link_image_dialogs_Enabled)
	{	switch (type)
		{ 	case 0:	//open SWE Field wrapper
				rtc_doc.write ("<span unselectable='on' style='display:visible;position:absolute;top:-5000;'>");		
				break;
			case 1:	//close SWE Field wrapper
				rtc_doc.write ("</span>");
				break;
		}
	}	
}

function rtcMarkSelection(doc,marker)
{
	var a     = doc.anchors;
	var len   = a.length;
	var i     = 0;
        
	// Filter any old bookmarks.
	for (i = 0; i < len; i++)
	{	if (a[i].name == RTC_LINK_INSERTION_POINT)
		{	a[i].outerHTML = a[i].innerHTML;	}
		else if (a[i].name == RTC_GRAPHIC_INSERTION_POINT)
		{	a[i].outerHTML = a[i].innerHTML;	}
        }
	
	// Insert a bookmark.	
	if (marker==RTC_LINK_INSERTION_POINT)
	{	if (doc.selection.type == 'None')
		{	var tr = doc.selection.createRange ();
			if (tr.moveEnd ("character",1)==0)
				tr.moveStart ("character",-1);
			tr.select ();
		}
		doc.execCommand("CreateBookmark",false,marker);
	} 
	else 
	{	doc.execCommand("InsertImage",false,marker);
		doc.selection.empty();
	}
}

function createEm()
{
   var appObj = (isRTCPopup)?window.opener:this.parent;
	var HTML = 	createFindReplaceControl();						
				
	HTML +=(appObj.launchpadEnabled)?createDiv():"";
	HTML +=(appObj.launchpadEnabled)?createIcon("rtc_import_d.gif",	"IMPORT", sImportHTML):""; 
	HTML +=(appObj.launchpadEnabled)?createIcon("rtc_export_d.gif",	"EXPORT", sExportHTML):"";
														
	HTML +=(appObj.rtc_link_image_dialogs_Enabled && (appObj.rtc_link_dialogs_Available || appObj.rtc_image_dialogs_Available))?createDiv():"";
	HTML +=(appObj.rtc_link_image_dialogs_Enabled && appObj.rtc_link_dialogs_Available)?createIcon("rtc_link.gif", "LINK", sLink):""; 
	HTML +=(appObj.rtc_link_image_dialogs_Enabled && appObj.rtc_image_dialogs_Available)?createIcon("rtc_image.gif", "IMAGE", sImage):"";
					
	HTML += createDiv()+
			createIcon("rtc_cut.gif",		"CUT",	sCut)       +
			createIcon("rtc_copy.gif",		"COPY",	sCopy)      +
			createIcon("rtc_paste.gif",		"PASTE", sPaste)	+												
			createDiv()                                         +
			createFontNamePicker()                              +
			createFontSizePicker()                              +	
			createColorPickerControl()                          +
			createDiv()                                         +
			createIcon("rtc_b.gif",			"BOLD", sBold)           +
			createIcon("rtc_i.gif",			"ITALIC", sItalic)       +
			createIcon("rtc_u.gif",			"UNDERLINE", sUnderline) +
			createDiv()                                         +
			createIcon("rtc_ol_d.gif",		"OL", sOrderedList)      +
			createIcon("rtc_ul_d.gif",		"UL", sUnorderedList)    +
			createIcon("rtc_indent_d.gif",	"INDENT", sIndent)       +
			createIcon("rtc_outdent_d.gif",	"OUTDENT", sOutdent)     +
			createDiv()                                         +
			createIcon("rtc_align_l_d.gif",	"LEFT", sLeft)           +
			createIcon("rtc_align_c.gif",	"CENTER", sCenter)       +
			createIcon("rtc_align_r_d.gif",	"RIGHT", sRight);

	return HTML;
}

function createPop()
{
   var appObj = (isRTCPopup)?window.opener:this.parent;
	var HTML = 	createFindReplaceControl("below");						
				
	HTML +=(appObj.launchpadEnabled)?createDiv():"";
	HTML +=(appObj.launchpadEnabled)?createIcon("rtc_import_d.gif",	"IMPORT", sImportHTML):""; 
	HTML +=(appObj.launchpadEnabled)?createIcon("rtc_export_d.gif",	"EXPORT", sExportHTML):"";
														
	HTML +=(appObj.link_image_dialogs_Enabled)?createDiv():"";
	HTML +=(appObj.link_image_dialogs_Enabled)?createIcon("rtc_link.gif",	"LINK",  sLink):""; 
	HTML +=(appObj.link_image_dialogs_Enabled)?createIcon("rtc_image.gif",	"IMAGE", sImage):"";
					
	HTML += createDiv()+
			createIcon("rtc_cut.gif",		"CUT",	sCut)       +
			createIcon("rtc_copy.gif",		"COPY",	sCopy)      +
			createIcon("rtc_paste.gif",		"PASTE", sPaste)	+												
			createDiv()                                         +
			createFontNamePicker()                              +
			createFontSizePicker()                              +	
			createColorPickerControl("below")                   +
			createDiv()                                         +
			createIcon("rtc_b.gif",			"BOLD", sBold)           +
			createIcon("rtc_i.gif",			"ITALIC", sItalic)       +
			createIcon("rtc_u.gif",			"UNDERLINE", sUnderline) +
			createDiv()                                         +
			createIcon("rtc_ol_d.gif",		"OL", sOrderedList)      +
			createIcon("rtc_ul_d.gif",		"UL", sUnorderedList)    +
			createIcon("rtc_indent_d.gif",	"INDENT", sIndent)       +
			createIcon("rtc_outdent_d.gif",	"OUTDENT", sOutdent)     +
			createDiv()                                         +
			createIcon("rtc_align_l_d.gif",	"LEFT", sLeft)           +
			createIcon("rtc_align_c.gif",	"CENTER", sCenter)       +
			createIcon("rtc_align_r_d.gif",	"RIGHT", sRight);	

   return HTML;
}

// selectively strips content for security purposes.
function securityStrip (HTML)
{
   HTML = stripIFRAME (HTML);
   return HTML;
}
 
// replaces IFRAME tags with HTML special characters
// to display as literal text instead of as a frame.
function stripIFRAME (HTML)
{
   var msg = "<br><br>--- " + sStripIFRAME + " ---<br>"
 
   // $1: IFRAME tag.
   var regexIFRAME = /<(\/?IFRAME(\s[^>]*)?)>/ig;

   if (regexIFRAME.test (HTML))
      HTML = HTML.replace (regexIFRAME, msg + "&lt$1&gt<br><br>");

   return HTML;
}

function setDirection ()
{   
   if (!isMac && rtc_brwsr >= ie5 && rtc_doc.dir.toLowerCase() == "rtl")
   {
      appDIR = 'rtl';
      htmlDIR = '<html dir="rtl">';

      HTML_html_open_tag = htmlDIR;
      HTML_open = htmlDIR + "<base target='_blank'>" + HTML_body_open_tag;
      HTML_open_embedded = htmlDIR + "<base target='_blank'>" + HTML_body_open_tag_embedded;
      HTML_open_read_only = htmlDIR + "<base target='_blank'><body style='font-family:arial,helvetica; font-size:x-small; margin:2 2 2 2; background-color:#f0f0f0'>";

      HTML_FONTSIZEPICKER = '' + 
                            '<select dir="rtl" unselectable="on" class="btn" onchange="parent.execRTCcmd(event);" cmd="cmdFONTSIZE">' +
                            '<option value="2">10</option><option value="-1">--</option><option value="1">8</option><option value="2">10</option>' +
                            '<option value="3">12</option><option value="4">14</option><option value="5">18</option><option value="6">24</option>' +
                            '<option value="7">36</option></select>';	
		     
      HTML_FONTNAMEPICKER = '' + 
                            '<select dir="rtl" unselectable="on" class="btn" onchange="parent.execRTCcmd(event);" cmd="cmdFONTNAME">' +
                            '<option value="Arial">Arial</option><option value="-1">---------------</option><option value="Arial">Arial</option><option value="Verdana">Verdana</option>' +
                            '<option value="Times New Roman">Times New Roman</option><option value="Courier">Courier</option>' +
                            '</select>';										
		
   }
}///////////////////////////////////////////////////////////////////////////////
//
// Copyright (C) 2002, Siebel Systems, Inc., All rights reserved.
//
// FILE:       swecommon_top.js
//
// CREATOR:    Iannis Hanen
//
// DESCRIPTION
//    
// This file contains JavaScript functions included in the hidden frame in HI
// and included in the layout in LI/SI+.
//
/////////////////////////////////////////////////////////////////////////////

var iRef = 0;        //Accessibility: Phase3 
var minutesRemToTimeout = 0;        //Accessibility: Phase3 
var secondsRemToTimeout = 0;
var sessExtendMinutes = 0;          
var sessExtendSeconds = 0;        //Accessibility: Phase3
var _SWEFrameTitleAry = new Array();  //Bug:11671230 : global array to store the frame titles

// function for drilldown from a field
// Expected args for name1 list are SWEField, SWERowId, and SWERowIds
function c_d (name1, value1, name2, value2, target)
{
   var url;
   if (value2.length >= 1) url = value2 [0] + "?";
   if (name1.length == value1.length)
   {
      for (var i = 0; i < name1.length; i++)
      {
         url += name1[i] + "=" + URLEncode(value1[i]);
         if (i < name1.length - 1) url += "&";
      }

      if (name2.length > 0) url += "&";
      if (name2.length == value2.length - 1)
      {
         for (var j = 0; j < name2.length; j++)
         {
            url += name2[j] + "=" + URLEncode(value2[j + 1]);
            if (j < name2.length - 1) url += "&";
         }

       if(IsOpenUI()){
           App().GotoView("", "", url, "");
       }
       else
          SWETargetGotoURL(url, target);
      }
   }
}

function EvalFrame (frameName) 
{
   var aTemp = frameName.split(".");
   var frame = "";

   for (var i = 0; i < aTemp.length; i++) 
   {
      frame += aTemp[i];
      if (typeof(eval(frame)) == 'undefined')
         return false;
      frame += ".";
   }
 
   return true;
}


function HtmlEncode(orig)
{
   if (orig == null)
      return "";

   return orig.replace (/&/g, "&amp;").
               replace (/\'/g, "&#039;").
               replace (/\"/g, "&quot;").
               replace (/>/g, "&gt;").
               replace (/</g, "&lt;");
               
}

function HtmlDecode(orig)
{
   if (orig == null)
      return "";

   return orig.replace (/&amp;/g, "&").
               replace (/&#039;/g, "'").
               replace (/&quot;/g, '"').
               replace (/&gt;/g, ">").
               replace (/&lt;/g, "<");
               
}

function IsSWEPopup(windowObj)
{
   // Not checking for SWEPopupWin because it would not work in HI app,
   // so now basically returns !(mainview).
   if (typeof(windowObj) == "object")
      return (windowObj.top != Top());

   return false;
}

// This function works only for SI since it checks for SWEPopupWin, which is null for HI.
function IsSWEPopupOpen()
{
   return (!Top().IsSWEHighInteract && 
           Top().SWEPopupWin != null && 
           typeof(Top().SWEPopupWin.closed) != "unknown" && 
           !Top().SWEPopupWin.closed);
}

// User operation is from popup window:
//    If current popup has been modified, indicated by bCurrentPopupModified, return true
//    Otherwise return false
// User operation is from main view:
//    If popup flag is not empty, return true
//    If main view flag is not empty, return true
//    Otherwise return false
function pendingChanges(bFromPopup)
{
	// Fix for FR # 12-P2969B
   if (bFromPopup)
      return (Top().bCurrentPopupModified && 
              (typeof(Top().popupAppletWithChanges) != "undefined" && Top().popupAppletWithChanges.length > 0));
   // End of Fix #12-P2969B
   
   // If comes here means user operation is from main view

   // In NS, ResetPopupDataLossWarningVars() won't be triggered when popup is closed by X button,
   // so we need to check that the popup is open before we use generate warning for it.
   // There is no need to check for HI app like in stopForSavingData() because HI popups are modal, 
   // i.e. if it comes here means popups are already closed.

   // Fix for FR # 12-1PBEKY6. Used bCurrentPopupModified flag to make sure that
   // the pending changes is for the current popup applet and not for any parent frame.
   if (IsSWEPopupOpen() && Top().bCurrentPopupModified && 
       typeof(Top().popupAppletWithChanges) != "undefined" && Top().popupAppletWithChanges.length > 0) 
      return true;

   if (typeof(Top().activeAppletWithChanges) != "undefined" && Top().activeAppletWithChanges.length > 0)
      return true;

   return false;
}

function ResetCurrentPopupModified()
{
   Top().bCurrentPopupModified = false;
}

function ResetPopupDataLossWarningVars()
{
   Top().bCurrentPopupModified = false;
   Top().popupAppletWithChanges = "";
}

function ResetScreen()
{
   if (top.bResetScreen == true)
   {
      SetScreen(top.actScreenName);
   }
   else
      top.bResetScreen = false;
}

function SetScreen(screenName, cnt, screenTab)
{
   var objFrame = SWEFindFrame(top, "_swescrnbar");
   if (objFrame == null)   return;
   if (typeof top.bScreenTabLoaded != "undefined")
   {
      objFrame.st_scrn(screenName, cnt, screenTab);
      top.bResetScreen = false;
   }
   else
   {
      top.actScreenName = screenName;
      top.bResetScreen = true;
   }
}

function StopForSavingData(bFromPopup)
{
   // bFromPopup could be undefined, as is the case when StopForSavingData() is called
   // from SetCurrentAppletIndex() (sweutil_keyboard.js, which is in hidden
   // frame whose 'top' is inaccurate).  We want to treat that case as main view
   // operation because SI focus tracking is only on main view.
   if (typeof(bFromPopup) == "undefined")
      bFromPopup = false;

   if (!pendingChanges(bFromPopup))
      return false;

   var message;
   if (Top().SWEIsHighInteract)
      message = App().GetLocalString("SWEDataLossWarning");
   else	
      message = _SWEgetMessage("SWEDataLossWarning");

   var ret;

   // In NS, ResetPopupDataLossWarningVars() won't be triggered when popup is closed by X button,
   // so we need to check that the popup is open before we use generate warning for it.
   // IsSWEPopupOpen() always return false for HI apps, so in HI app we need to
   // check if popup flag is to be used for warning msg (NS problem does no apply for HI).
   if ((IsSWEPopupOpen() || Top().SWEIsHighInteract) &&
       typeof(Top().popupAppletWithChanges) == "string" && Top().popupAppletWithChanges.length > 0)
   {
      ret = SWEConfirm(message.replace(/%1/, Top().popupAppletWithChanges));
   }
   else
   {
      ret = confirm(message.replace(/%1/, Top().activeAppletWithChanges));
   }

   if (ret == true)
   {
      ResetPopupDataLossWarningVars();  // Always clear popup data loss warning flags
      if (!bFromPopup)  // Cleared only if user op is from main view
         Top().activeAppletWithChanges = "";
   }

   return !ret;
}

function SWEAlert (text)
{
   if (Top().SWEIsHighInteract)
   {
      App().ShowMessage("MSGBOX_ALERT", text);
      return;
   }   
   
   if (Top().bEnablePrompt != null)
      Top().errMsg = text;

   if (Top().bEnablePrompt == null || 
      Top().bEnablePrompt == true)
   {
      var popWin  = Top().SWEPopupWin;

      if (top.SWEPopupWin != null && !top.SWEPopupWin.closed)
          popWin.alert(text);
      else {
          if (typeof (SiebelApp) !== "undefined" && SiebelApp && SiebelApp.Utils && typeof (SiebelApp.Utils.Alert) === "function") {
            SiebelApp.Utils.Alert(text);
         }
         else {
            alert(text);
         }
      }
   }
}



function SWEAppendArgsToURL (url, arg, value)
{
   //handle with the anchor tag - we would only allow one # in the argument
   var result = url.split("#");
   if (result != null && result.length == 2)
      url = result[0] + "&" + URLEncode(arg) + "=" + URLEncode(String(value)) + "#" + result[1];
   else
      url += "&" + URLEncode(arg) + "=" + URLEncode(String(value));
   return url;
}

//default focus
function SetDefaultFocus()
{
  if (Top()._swescript != null && typeof (Top()._swescript) != 'undefined')
  {
    Top()._swescript.SetDefaultApplet(Top()._defaultAppletName);
    Top().bFocusShouldBeReset = true;
    Top().bArraysShouldBeRefreshed = true;
    Top()._swescript.RefreshArrays();
  }
  
} 
//default Focus 

function SWEClosePopup()
{
   if (Top().SWEPopupWin != null && 
       typeof(Top().SWEPopupWin.closed) != "unknown" && 
       !Top().SWEPopupWin.closed)
   {
      Top().SWEPopupWin.close();
      Top().SWEPopupWin = null;
   }
   if (Top().SWEPopupWin2 != null && 
       typeof(Top().SWEPopupWin2.closed) != "unknown" && 
       !Top().SWEPopupWin2.closed)
   {
      SWEClosePopup2();
   }
}

function SWEClosePopup2()
{
   if (Top().SWEPopupWin2 != null && Top().SWEPopupWin2.open)
   {
      Top().SWEPopupWin2.close();
      Top().SWEPopupWin2 = null;
   }
}

function SWECloseJannaPopup()
{
   if (Top().SWEJannaPopupWin != null && 
       typeof(Top().SWEJannaPopupWin.closed) != "unknown" && 
       !Top().SWEJannaPopupWin.closed)
   {
      Top().SWEJannaPopupWin.close();
      Top().SWEJannaPopupWin = null;
   }
   
}


function SWEConfirm (confirmMessage)
{
   if (Top().SWEIsHighInteract)
   {
      return (App().ShowMessage ("MSGBOX_CONFIRM", confirmMessage));
   }

   if (Top().bEnablePrompt != null &&
      Top().bEnablePrompt == false)
   {
      //surpress confirm dialog   
      if (Top().bConfirm == null)
         return true;
      else
         return Top().bConfirm;
   }
   else
   {
      var popWin  = Top().SWEPopupWin;

      if (top.SWEPopupWin != null && !top.SWEPopupWin.closed)
         return popWin.confirm(confirmMessage);
      else {
          if (typeof (SiebelApp) !== "undefined" && SiebelApp && SiebelApp.Utils && typeof (SiebelApp.Utils.Confirm) === "function") {
            return (SiebelApp.Utils.Confirm(confirmMessage));
         }
         else {
            return confirm(confirmMessage);
         }
      }
   }
}


function SWEFormReset (formObj)
{
   if (formObj == null)
      return;
      
   if (formObj.elements == null)
      return;
	
	//Reset the whole form
	formObj.reset ();
	
	//Reinit dropdown values	
   for (var i = 0; i < formObj.elements.length; i++) 
   {
      if (formObj.elements[i] == null)
         continue;
      else if (formObj.elements[i].tagName != 'SELECT')
         continue;
      else if (formObj.elements[i].options == null)
         continue;
      else if (formObj.elements[i].options.selectIndexOrigin != null)
         formObj.elements[i].options.selectedIndex = formObj.elements[i].options.selectIndexOrigin;
   }
}


function SWEGetAvailScreenHeight()
{
	if (screen.availHeight) return Math.floor(screen.availHeight*0.9); 
	else return 600;
}

function SWEGetAvailScreenWidth()
{
	if (screen.availWidth) return Math.floor(screen.availWidth*0.9); 
	else return 800;
}

function SWEGetScreenHeight()
{
	if (screen.height) return screen.height; 
	else return 600;
}

function SWEGetScreenWidth()
{
	if (screen.width) return screen.width; 
	else return 800;
}

function SWEPersonalizationDrillDown_top (viewName, appletName, fieldName, rowId, parentRowIds, target)
{
   var cacheId = "";
   
   if (viewName == null || typeof (viewName) != "string")
      viewName = '';
   
   if (appletName == null || typeof (appletName) != "string")
      appletName = '';
   
   if (fieldName == null || typeof (fieldName) != "string")
      fieldName = '';
      
   if (rowId == null || typeof (rowId) != "string")
      rowId = '';
   
   if (parentRowIds == null)
      parentRowIds = '';
      
   if (SWEIsHighInteract)
   {
      cacheId = App().GetViewCacheId ().toString();
   }
      
   viewName = viewName.replace(/\+/g, " ");
   appletName = appletName.replace(/\+/g, " ");
   fieldName = fieldName.replace(/\+/g, " ");
   var c1 = new Array ("SWERowId", "SWEField", "SWERowIds");
   var c2 = new Array (rowId, fieldName, parentRowIds);
   var c3 = new Array ("SWEApplet", "SWEView", "SWECmd", "SWEReqRowId", "SWEMethod", "SWECacheId");
   var c4 = new Array (location.pathname, appletName, viewName, "InvokeMethod", "1", "Drilldown", cacheId);
   c_d (c1, c2, c3, c4, target);
}

function SWEPersonalizationGotoScreen (screenName)
{
   var url = window.location.protocol + "//" + window.location.host + window.location.pathname;
   url += "?SWECmd=GotoPageTab&SWENeedContext=false&SWEScreen=" + screenName;
   SWEGotoURL (url);
}

function SWEPersonalizationGotoview (viewName, extraParams)
{        
   var url = window.location.protocol + "//" + window.location.host + window.location.pathname;
   url += "?SWEEP=1&SWEVI=&SWECmd=GotoView&SWEC=1&SWEView=" + viewName;
   
   if (extraParams != null && 
       (typeof (extraParams) == "string") && 
        extraParams.length > 1)
   {
      if (extraParams.charAt(0) != "&")
         extraParams = "&" + extraParams;
      url += extraParams;
   }
   
   var frameObj = SWEFindFrame (top, "_sweview");
   if (frameObj == null) 
       frameObj = this;
       
   if (!SWEIsHighInteract)
   {
      //frameObj.location = url;   
      SWETargetGotoURL(url, frameObj)
   }
   else
   {
      viewName = IsOpenUI() ? "" : viewName.replace(/\+/g, " ");
      App().GotoView(viewName, "", url, frameObj);
   }
}

var   lmsgWindow, lmsgTimerId, lmsgCur, lmsgTitle;

function SWEPopupHandler()
{
   var      w;
   w = lmsgWindow;
   clearTimeout(lmsgTimerId);

   w.document.writeln('<html><HEAD><TITLE>');
   w.document.writeln(lmsgTitle);
   w.document.writeln('</TITLE></HEAD><body bgcolor="#FFFFFF">');
   w.document.writeln(lmsgCur);
   w.document.writeln('</body></html>');
   w.document.close();
} 


function SWEPopupMessage(title, msg)
{
   lmsgCur = msg;
   lmsgTitle = title;
   lmsgWindow=window.open('','','toolbar=no,scrollbars=yes,resizable=yes,width=400,height=200');
   lmsgTimerId = setTimeout("SWEPopupHandler()", 200);
}

function SWEPosition(posX,posY)
{
	return ",top=" + posY + ",left=" + posX + ",screenY=" + posY + ",screenX=" + posX; 
}

function SWEPopupGainFocus() 
{
   if (Top().SWEIsHighInteract)
   {
      return (App().SetPopupVisible (true));
   }
   else
   {
      return (Top().SWEPopupWin != null &&
              !Top().SWEPopupWin.closed);
   }
}

// For non-Siebel popup to support eCollaboration
function SWEShowFeaturedPopup (url, name, height, width, position, feature)
{  
   // If height or width is non-positive, make the popup disappear from the screen
   if (height <= 0 || width <= 0)
   {
      height = 1;
      width  = 1;
      position = SWEPosition(1, 10000);
   }
   else if (position == null || position == "")
   {
      position = SWECenterPopup (width, height);
   }
   else
   {
      position = "," + position;
   }
   
   var features = "height=" + height + ",width=" + width + position;

   if (feature != null && feature != "")
   {
      features += "," + feature;
   }

   open (url, name, features);
}

function SWESubmitForm_top (obj, formObj, fieldName, rowId)
{
   if(IsOpenUI())
   {
      //VT:Firefox does not recognize the correct input elements of the form. SO manually cloning the input elements as its children.
      //Just checking for one of those input elements
      if(!formObj.SWEView)
       {
          var formChildren = $(formObj).parent().find('input[type=hidden]').clone();
          $(formObj).parent().children('input[type=hidden]').remove();
          $(formObj).append(formChildren);
       }
   }
   // 12-GQWT3E: Need to reset SWEJFN to blank for every form submit
   if (typeof(formObj.SWEJFN) != 'undefined' && formObj.SWEJFN != null)
      formObj.SWEJFN.value = "";

   if (typeof(obj.action) != 'undefined')
      formObj.action = obj.action;

   if (typeof(obj.target)  != 'undefined')
      formObj.target  = obj.target;
   else
      formObj.target = "_self";

   if (typeof(obj.SWECmd) != 'undefined')
      formObj.SWECmd.value = obj.SWECmd;

   if (typeof(obj.SWEMethod) != 'undefined')
      formObj.SWEMethod.value = obj.SWEMethod;

   if (typeof(obj.SWEVI) != 'undefined')
      formObj.SWEVI.value = obj.SWEVI;

   if (typeof(obj.SWEView) != 'undefined')
      formObj.SWEView.value = obj.SWEView;

   if (typeof(obj.SWEApplet) != 'undefined')
      formObj.SWEApplet.value = obj.SWEApplet;

   if (typeof(obj.SWEField) != 'undefined')
      formObj.SWEField.value = obj.SWEField;
   else if (fieldName != null) // for page size reduction
   {
      if (fieldName.length > 0)
      {
         formObj.SWEField.value = fieldName;
      }
   }

   if (!IsSWEPopup())
   {
      if (navigator && navigator.id != null &&
          typeof(formObj.SWEBID) != 'undefined')
         formObj.SWEBID.value = navigator.id;
   }

   if (typeof(obj.SWERowId) != 'undefined')
      formObj.SWERowId.value = obj.SWERowId;
   else if (rowId != null) // for page size reduction
   {
      if (rowId.length > 0 )
      {
         formObj.SWERowId.value = rowId;
      }
   }

   if (typeof(obj.SWERowIds) != 'undefined')
      formObj.SWERowIds.value = obj.SWERowIds;

   if (typeof(obj.SWEReqRowId) != 'undefined')
      formObj.SWEReqRowId.value = obj.SWEReqRowId;

   if (typeof(obj.SWESeq) != 'undefined')
      formObj.SWESeq.value = obj.SWESeq;

   if (typeof(obj.SWETF) != 'undefined')
      formObj.SWETF.value = obj.SWETF;
   else if (typeof(formObj.SWETF) != 'undefined')
      formObj.SWETF.value = "";

   if (typeof(obj.SWETargetView) != 'undefined')
      formObj.SWETargetView.value = obj.SWETargetView;
   else if (typeof(formObj.SWETargetView) != 'undefined')
      formObj.SWETargetView.value = "";

   if (typeof(obj.SWETVI) != 'undefined')
      formObj.SWETVI.value = obj.SWETVI;
   else if (typeof(formObj.SWETVI) != 'undefined')
      formObj.SWETVI.value = "";

   if (typeof(obj.SWETA) != 'undefined')
      formObj.SWETA.value = obj.SWETA;
   else if (typeof(formObj.SWETA) != 'undefined')
      formObj.SWETA.value = "";

   if (typeof(obj.SWEM) != 'undefined')
      formObj.SWEM.value = obj.SWEM;
   else if (typeof(formObj.SWEM) != 'undefined')
      formObj.SWEM.value = "";

   if (typeof(obj.SWEContainer) != 'undefined')
      formObj.SWEContainer.value = obj.SWEContainer;

   if (typeof(obj.SWEPOC) != 'undefined')
      formObj.SWEPOC.value = obj.SWEPOC;

   if (typeof(obj.SWEKeepContext) != 'undefined')
      formObj.SWEKeepContext.value = obj.SWEKeepContext;

   if (typeof(obj.SWENeedContext) != 'undefined')
      formObj.SWENeedContext.value = obj.SWENeedContext;

   if (typeof(obj.SWEDIC) != 'undefined')
      formObj.SWEDIC.value = obj.SWEDIC;

   if (typeof (obj.SWEPMV) != 'undefined')
      formObj.SWEPMV.value = obj.SWEPMV;
   else if (typeof(formObj.SWEPMV) != 'undefined')
      formObj.SWEPMV.value = ""; 
        
   if (typeof(formObj.SWETS) != 'undefined') //always append timestamp
   {
      var now  = new Date();
      formObj.SWETS.value = now.getTime();
   }
   
   // add SWEC
   if (typeof(formObj.SWEC) != 'undefined')
   {
      if (SWEIsHighInteract){
          if(IsOpenUI()) {
              formObj.SWEC.value = App().GetSWECount();          
          }
          else{
              formObj.SWEC.value = App().SWECount;
          }
      }
      else
         formObj.SWEC.value = Top().SWECount;
   }
   
   if (typeof(obj.SWEService)  != 'undefined')
      formObj.SWEService.value = obj.SWEService;
   else if (typeof(formObj.SWEService) != 'undefined')
      formObj.SWEService.value = "";
}

// unload Application by browser OnUnload event with preload:
function SWEUnloadAppQueryPara (pageURL, loginTime, queryPara, SRN)
{
   // UnloadApp does not have to be done and should not be done if we have just
   // logged out.  This detects the logout, and does not issue the UnloadApps
   // command in that case.  Not sure if this works correctly in case of URL
   // session mode.
   var sessionCookie = document.cookie;
   // FR 12-206ENF1: UnloadApp will create an anonymous session in Cookie less mode.
   //   In cookie less mode, we have to pass the _sn in the URL of the SWECmd=UnloadApp
   //   Note that I have added the test: sessionCookie.indexOf("_sn=") == -1 as user can have cookie
   //   enabled but using a Siebel Application in cookie less mode.
   var sSn=null;
   if (sessionCookie == null || sessionCookie.length == 0 || sessionCookie.indexOf("_sn=") == -1)
   {
      var topQuery = top.location.search;
      var posSn=topQuery.indexOf("_sn=");
      if (posSn == -1)
         return;
      // FR 12-206ENF1: Capturing the _sn in the URL
      var endSn= topQuery.indexOf("&",posSn);
      if (endSn == -1)
         sSn=topQuery.substring(posSn);
      else
         sSn=topQuery.substring(posSn,endSn);
   }
      
   var ns6=(navigator.appName.indexOf("Netscape")>-1 && parseInt(navigator.appVersion)>4)?true:false;
   var ie=(navigator.appName.indexOf("Microsoft")>-1 && parseInt(navigator.appVersion)>3)?true:false;

   if (ie || ns6)
   {
      var newWin;
      var actionURL;
      var now = new Date();

      if (loginTime == null)
         loginTime = "";

      // FR 12-206ENF1: UnloadApp will create an anonymous session in Cookie less mode.
      //   If we are in a cookie less mode, then we have to add the _sn in the URL.
      if (sSn == null)
        actionURL = pageURL + "?SWECmd=UnloadApp&SWETS=" + now.getTime() + "&SWELT=" + loginTime + queryPara;
      else
        actionURL = pageURL + "?SWECmd=UnloadApp&SWETS=" + now.getTime() + "&SWELT=" + loginTime + "&"+ sSn + queryPara;

      // from Browser OnUnload event, so we open a hidden window to submit url and then close itself:
      newWin = open ("", "hiddenWin", 'left=10000,top=10000,width=150,height=100');
      newWin.document.write (
         "<title>Logout</title>" +
         "<script>" +
         "this.location = '" + actionURL + "';" +
         "this.close();" +
         "</script>"
      );
   }
}

// unload Application by browser OnUnload event:
function SWEUnloadApp (pageURL, loginTime, SRN)
{
   SWEUnloadAppQueryPara(pageURL, loginTime, "", SRN);   
}

function SWEGetFullFrameName (frame)
{
   if (frame == null || frame.name == "")
      return "";

   var parentFrame = frame.parent;
   var fullFrameName = frame.name;

   while (parentFrame != null 
          && parentFrame.name != ""
          && parentFrame != top)
   {
      fullFrameName = parentFrame.name + "." + fullFrameName;


      parentFrame = parentFrame.parent;
   }


   fullFrameName = "top." + fullFrameName;

   return fullFrameName;
}

function SWEIsContainedInFrame (frame, containerFrameName)
{
   var parentFrame;

   if (frame == null || containerFrameName == null || containerFrameName == "")
      return false;

   parentFrame = frame;

   while (parentFrame != null)
   {
      if (parentFrame.name == containerFrameName)
         return true;

      //to prevent dead loops
      if (parentFrame == parentFrame.parent)
         return false;
      else
         parentFrame = parentFrame.parent;
   }

   return false;
}

function SweValidateSubmit()
{
  if ((typeof(Top().SWEAlreadySubmitted) == 'undefined') || (Top().SWEAlreadySubmitted == false))
  {
    Top().SWEAlreadySubmitted = true;
    return true;
  }
  else // if (Top().SWEAlreadySubmitted == true)
    return false;
}

function trackChange_top(activeAppletWithChanges, id, frameName, bFromPopup)
{
   if (bFromPopup)
   {
      Top().popupAppletWithChanges = activeAppletWithChanges;
      Top().bCurrentPopupModified = true;
   }
   else
   {
      // SI applet focus tracking is for main view only
      // Fix 12-G3KGYN, set active applet with change to be current applet
      if (activeAppletWithChanges != "")
      {
         if (typeof (SWEApplets) != 'undefined' && typeof(id) != 'undefined' && id != null)
         {
            var i ;
            if(Top()._swescript.bAccessibleEnhanced)
            {
               i=FindByProp (SWEApplets, "Id", "_SWEApplet" + id);
            }
            else
            {
               i=FindByProp (SWEApplets, "Id", "SWEApplet" + id);
            }
            if (i != -1)
            {
               SetCurrentAppletIndex(i);
            }
            if (typeof(frameName) != 'undefined' && frameName != null && frameName != "")
            {
               SetFirstApplet (frameName);
            }
         }
      }   
      Top().activeAppletWithChanges = activeAppletWithChanges;
   }
}

function URLEncode (orig) 
{
   var encoded;  
   var i, idx, iLimit;
   var ch;
   
   var str = orig.toString();
 
   encoded = "";

   for (i = 0, idx = 0, iLimit = str.length; i < iLimit; i++)
   {
      ch = str.charAt(i);
      if ('0'<=ch && ch<='9' || 'A'<=ch && ch<='Z' || 'a'<=ch && ch<='z')
      {
         continue;
      }
      else if (ch == '!' || ch == '*' || ch == '\'' || 
               ch == '(' || ch == ')' || ch == ',' || 
               ch == '$' || ch == '-' || ch == '_' || ch == '.')
      {
         continue;
      }
      else if (ch == ' ')
      {
         encoded += str.substring(idx, i) + "+";
         idx = i + 1;
      }
      else
      {
         var charCode = ch.charCodeAt(0);
         var charCodeHex = charCode.toString(16);
         var prefix;
         if (charCode < 16)
         {
            prefix = '%0';
         }
         else if (charCode < 128)
         {
            prefix = '%';
         }
         else if (charCode < 256)
         {
            prefix = '%u00';
         }
         else if (charCode < 4096)
         {
            prefix = '%u0';
         }
         else
         {
            prefix = '%u';
         }
         encoded += str.substring(idx, i) + prefix + charCodeHex;
         idx = i + 1;
      }
   }

   if (idx != i)
      encoded += str.substring(idx, str.length);

   return encoded;
}

function OnAppReady()
{   
   
   //Bug#14110450: Uncommented the below lines 
   //because they were causing problems in QTP-SWE handshaking
   if(!IsOpenUI())
   {
        if (Top()._swe._sweapp.S_CAS != null)
            Top()._swe._sweapp.S_CAS.OnAppReady(App());
   }  
   // FR-12-QBAOE: remove to rollback FR12-LS887Q+F
   /*
   if (Top()._swe._sweapp.S_App != null)
   {
      if (Top()._swe._sweapp.S_CAS != null)
         window.setTimeout("App().SetTopFrameLoaded()",3000);
      else
         App().SetTopFrameLoaded();
   }*/
}

///////////////////////////////////////////////////////////////////////////////
//
//  METHOD NAME
//    SWEReloadApp
//
//  PARAMETERS
//    None
//
//  RETURN VALUE
//    None
//
//  DESCRIPTION
//    For KeyBank ACR075. This function calls DoRefresh method of Coapp to 
//    load login page in top browser.
//
///////////////////////////////////////////////////////////////////////////////
function SWEReloadApp()
{
   if(typeof(Top()._swescript)!='undefined'&&Top()._swescript!=null)
   {
      if(typeof(Top()._swe)!='undefined'&&Top()._swe!=null)
      {	     
    	 if ((typeof(Top()._swe._sweapp)!='undefined')&&(Top()._swe._sweapp!=null))
    	 {
    	    if (App() != null)
    	       App().DoRefresh();
    	 }
      }
    }
}
//Bug#11671230 : it returns the frame title for the given frame
function setFrameNameTitleArray(FrameNameTitleArray)
{
   _SWEFrameTitleAry = FrameNameTitleArray;
}
function _getFrameTitle(key)
{
   ary = _SWEFrameTitleAry;
   return ary[key.toLowerCase()];
   
}//////////////////////////////////////////////////////////////////////////////
//
// Copyright (c) 2003, Siebel Systems, Inc., All rights reserved.
//
// FILE:       navctrl.js
//  $Revision:  $
//      $Date:  $
//    $Author:  $ of last update
//
// CREATOR:    Laxman Chinnakotla
//
//  OWNER HISTORY
//    OWNER                START DATE
//    --------             ----------
//    Laxman Chinnakotla  
// 
// DESCRIPTION
//    
// JavaScript Functions used in screenbr, viewbar and subviewbar
// jumptabs (this script file gets loaded into the SWE container)
//
//  CHANGE LOG <maintained by source control, one-line check-out comment
//              inserted automatically (editable), last N comments listed>
//    AUTHOR      DATE      COMMENT
//    ----------  --------  ---------------------------------------------
//
//////////////////////////////////////////////////////////////////////////////

function JSSNavCtrl ()
{
   this.navtabid = 0;                 // nav control tab id for scrolling purposes.
   this.actvtb = 0;                   // active screen tab only set in Activate and SetScreen            
   this.vbmxtb = 0;                   // variable that contains the max left handside tab id.
   this.sweCnt = 0;
   this.prefix = "";                  // prefix for nav ctrl document objects.
                                      // e.g., "vb" for views and "svb" for sub-views.
   this.htmltbl = null; 
   this.vtbs = null;
   this.navctrlElem = null;           // navctrl element. 
   this.timerID  = "";                // Identifier for timer events.
   this.leftjumptab = null;           // images element for right hand side left scroll.
   this.rightjumptab = null;          // images element for right hand side right scroll.
   this.lastvtb = 0;
   this.docObj = null;                // document object for the layout page.
   this.tabs_width = 0;               // width of the nav tab control.
   this.cntrlType = "";               // type: "ScreenBar", "ViewBar" or "SubViewBar".
   this.commonURL = "";               // common url part of the navigation control.
   this.navCtrlTabs = null;           // array containing nav tab properties.
   this.brecursivescroll  = false;    // controls recursive scrolling.
   this.navTxt = "";                  // The navigation text to be added before Screenbar /Viewbar links.
}

///////////////////////////////////////////////////////////////////////////////
//
//  METHOD
//    JSSNavCtrl_Initialize
//
//  METHOD TYPE
//    API Type (External/Module/Private): Module
//    Overridable? (Yes/No)             : No
//    Overrides Virtual? (Yes/No)       : No
//
//  PARAMETERS
//    cntrlType -   [in] Type of the navigation control. 
//                       Valid values are: "ScreenBar", "ViewBar" and "SubViewBar".
//    common_URL -  [in] This parameter is the URL used by all navigation control tabs. 
//    navCtrlTabs - [in] This array contains control tab pertinent information.
//    docObj -      [in] The "docObj" is the document object for the layout page. 
//
//  RETURN VALUE
//    None
//
//  DESCRIPTION
//    Initializes the JSSNavCtrl object.
//
///////////////////////////////////////////////////////////////////////////////

function JSSNavCtrl_Initialize (cntrlType, common_URL, navCtrlTabs, docObj)
{
   this.cntrlType = cntrlType;
   this.commonURL = common_URL;
   this.navCtrlTabs = navCtrlTabs;
   this.docObj = docObj;

   // for each control type determine the the prefix that is used for the
   // document elements.
   if (cntrlType == "ViewBar")
      this.prefix = "vb";
   else if (cntrlType == "ScreenBar")
      this.prefix = "sb";
   else if (cntrlType == "SubViewBar")
      this.prefix = "svb";
   else
      return;

   this.htmltbl = this.docObj.getElementById("s_" + this.prefix + "_t");
   this.vtbs = this.docObj.getElementById("s_" + this.prefix + "r");
   this.navctrlElem = this.docObj.getElementById("s_" + this.prefix);

   if (cntrlType == "ScreenBar")
      this.tabs_width = this.docObj.body.offsetWidth - 110;
   else
      this.tabs_width = this.navctrlElem.offsetWidth - 110;

   // Initialize the variables relating to left and right jumptabs.
   this.leftjumptab = this.docObj.images["s_" + this.prefix + "_l_2"];
   this.rightjumptab = this.docObj.images["s_" + this.prefix + "_r_2"];

   // The jumptab images are loaded only once in the _swescrnbar frame to reduce
   // the layout size. If the application contains no frames, the images are loaded
   // in the main page. 
   var imgDoc;
   var objFrame = SWEFindFrame(top, "_swescrnbar");
   if (objFrame != null) 
      imgDoc = objFrame.document;
   else
      imgDoc = this.docObj;

   // Initialize images that represent enabled, disabled and blank states of left and right
   // jumptabs. 
   if (cntrlType == "ScreenBar")
   {
      this.imgopn0 = this.docObj.sbIopn0;
      this.imgcls0 = this.docObj.sbIcls0; 
      this.imgopn1 = this.docObj.sbIopn1;
      this.imgcls1 = this.docObj.sbIcls1;
      this.imgopn2 = this.docObj.sbIopn2; 
      this.imgcls2 = this.docObj.sbIcls2; 
   } 
   else if (cntrlType == "ViewBar")
   {
      this.imgopn0 = imgDoc.vbIopn0;
      this.imgcls0 = imgDoc.vbIcls0; 
      this.imgopn1 = imgDoc.vbIopn1;
      this.imgcls1 = imgDoc.vbIcls1;
      this.imgopn2 = imgDoc.vbIopn2; 
      this.imgcls2 = imgDoc.vbIcls2; 
   }
   else if (cntrlType == "SubViewBar")
   {
      this.imgopn0 = imgDoc.svbIopn0;
      this.imgcls0 = imgDoc.svbIcls0; 
      this.imgopn1 = imgDoc.svbIopn1;
      this.imgcls1 = imgDoc.svbIcls1;
      this.imgopn2 = imgDoc.svbIopn2; 
      this.imgcls2 = imgDoc.svbIcls2;
   }

   // initialize the states of jumptabs.
   this.Init();
}

///////////////////////////////////////////////////////////////////////////////
//
//  METHOD
//    JSSNavCtrl_Activate
//
//  METHOD TYPE
//    API Type (External/Module/Private): Module
//    Overridable? (Yes/No)             : No
//    Overrides Virtual? (Yes/No)       : No
//
//  PARAMETERS
//    id -   [in] id of the navigation control tab.
//
//  RETURN VALUE
//    None
//
//  DESCRIPTION
//    This function sends the GotoView command to the server.
//
///////////////////////////////////////////////////////////////////////////////

function JSSNavCtrl_Activate(id)
{   
   var nid;

   // In case of screen bar, we donot use prefix because for floating
   // tabs we use insertCell call to insert the new screen tab. insertCell
   // always returns the new tab index which is just an integer numbr.
   if (this.cntrlType == "ViewBar" || this.cntrlType == "SubViewBar")
      nid = this.prefix + id;
   else
      nid = id;

   var obj = this.docObj.getElementById(nid)

   if (obj == null || this.htmltbl == null) 
      return;
   var tb = this.htmltbl.rows[0].cells;
   if (tb == null) 
      return;

   // view frame.
   var vfrm = SWEFindFrame(top, "_sweview");   
   if (vfrm == null) 
      vfrm = "_self";
   else
      vfrm = "_sweview";

   var loc;
   if (this.cntrlType == "ScreenBar")
   {
      var oldx = this.actvtb;
      // If it is not the same active tab.
      if (this.actvtb != id)
      {
         var tbx = tb[this.actvtb];
         if (tbx && this.navCtrlTabs[this.actvtb]) 
            tbx.className = "tier1Off";         
         obj.className = "tier1On";
         this.actvtb = id;
         if (typeof (Top()._swescript) != "undefined" && Top()._swescript.bAccessibleEnhanced == true)
            AddRemoveScreenText(id,this.docObj,this.navTxt);
      }

      var oldloc = this.commonURL + 
                        URLEncode(this.navCtrlTabs[id].name) + "&SWEVST=-1";
      loc = oldloc.replace(/SWEC=\d*/, "SWEC="+ this.sweCnt);
      SWETargetGotoURL(loc, vfrm);
   }
   else
   {
      loc = this.navCtrlTabs[id].url + URLEncode(this.navCtrlTabs[id].name) + 
            "&SWEVST="+this.navtabid;
      SWETargetGotoURL(loc, vfrm);
   }
}

///////////////////////////////////////////////////////////////////////////////
//
//  METHOD
//    JSSNavCtrl_StopScroll
//
//  METHOD TYPE
//    API Type (External/Module/Private): Module
//    Overridable? (Yes/No)             : No
//    Overrides Virtual? (Yes/No)       : No
//
//  PARAMETERS
//    None.
//
//  RETURN VALUE
//    None
//
//  DESCRIPTION
//    This function handles the "onmouseup" event for jump tabs. 
//    Scrolling of navigation control stops when this method is invoked. 
//
///////////////////////////////////////////////////////////////////////////////
function JSSNavCtrl_StopScroll()
{
   window.clearInterval(this.timerID);
   this.timerID  = "";
   this.brecursivescroll  = false;
}

///////////////////////////////////////////////////////////////////////////////
//
//  METHOD
//    JSSNavCtrl_ScrollRight
//
//  METHOD TYPE
//    API Type (External/Module/Private): Module
//    Overridable? (Yes/No)             : No
//    Overrides Virtual? (Yes/No)       : No
//
//  PARAMETERS
//    None.
//
//  RETURN VALUE
//    None
//
//  DESCRIPTION
//    This function handles the "onmousedown" event for scroll-right jump tab. 
//    This function supports bi-directional scrolling.   
//
///////////////////////////////////////////////////////////////////////////////

function JSSNavCtrl_ScrollRight()
{
   var thisObj = this;

   if (this.docObj.dir == "rtl")
   { 	
      if (--this.navtabid < 0) 
      {
         this.navtabid = 0;  
         return;
      }
	this.htmltbl.style.left = this.Offset(this.navtabid);
   }
   else
   {
      if (this.navtabid < 0) 
         this.navtabid = 0;
      if (this.vtbs.scrollWidth == this.vtbs.scrollLeft + this.vtbs.style.pixelWidth) 
         return;
      this.navtabid += 1;
      var obj = this.htmltbl.rows(0).cells(this.navtabid);
      if (obj != null)  
         this.vtbs.scrollLeft = obj.offsetLeft;
   }

   // Calls SetControls to active/deactivate jumptab images.
   this.SetControls(); 
   // Recursively calls ScrollRight method as long as the mouse is down. When
   // the user releases the mouse, the timer is cleared and the scrolling stops. 
   var tmpFunc = function () { thisObj.ScrollRight() };  // FR 12-R1YBUZ: IE5.0 crash bug
   this.timerID = (this.brecursivescroll) ? 
                  window.setTimeout(tmpFunc, 40) : 
                  window.setTimeout(tmpFunc, 400);
   this.brecursivescroll = true;
}

///////////////////////////////////////////////////////////////////////////////
//
//  METHOD
//    JSSNavCtrl_ScrollLeft
//
//  METHOD TYPE
//    API Type (External/Module/Private): Module
//    Overridable? (Yes/No)             : No
//    Overrides Virtual? (Yes/No)       : No
//
//  PARAMETERS
//    None.
//
//  RETURN VALUE
//    None
//
//  DESCRIPTION
//    This function handles the "onmousedown" event for scroll-left jump tab. 
//    This function supports bi-directional scrolling.    
//
///////////////////////////////////////////////////////////////////////////////

function JSSNavCtrl_ScrollLeft()
{
   var thisObj = this;

   if (this.docObj.dir == "rtl")
   {
      this.navtabid += 1;
      if (this.navtabid > this.vbmxtb)
      {
        this.navtabid = this.vbmxtb; 
        return;
      }
      this.htmltbl.style.left = this.Offset(this.navtabid);
   }
   else
   {
      if (this.navtabid <= 0) 
         return;
      this.navtabid -= 1;
      if (this.navtabid < 0) 
         this.navtabid = 0;
      var obj = this.htmltbl.rows(0).cells(this.navtabid);
      if (obj != null) 
         this.vtbs.scrollLeft = obj.offsetLeft;
   }

   // Calls SetControls to active/deactivate jumptab images.
   this.SetControls(); 
   // Recursively calls ScrollLeft method as long as the mouse is down. When
   // the user releases the mouse, the timer is cleared and the scrolling stops. 
   var tmpFunc = function () { thisObj.ScrollLeft() };  // FR 12-R1YBUZ: IE5.0 crash bug
   this.timerID = (this.brecursivescroll) ? 
                  window.setTimeout(tmpFunc, 40) : 
                  window.setTimeout(tmpFunc, 400);
   this.brecursivescroll = true;
}

///////////////////////////////////////////////////////////////////////////////
//
//  METHOD
//    JSSNavCtrl_Init
//
//  METHOD TYPE
//    API Type (External/Module/Private): Module
//    Overridable? (Yes/No)             : No
//    Overrides Virtual? (Yes/No)       : No
//
//  PARAMETERS
//
//  RETURN VALUE
//    None
//
//  DESCRIPTION
//    This function is called to re-initialize the navigation control.
//
///////////////////////////////////////////////////////////////////////////////
function JSSNavCtrl_Init()
{
   if (this.htmltbl == null || this.vtbs == null) 
      return;
   this.Resize(); 
   this.MaxTab(); 
   this.SetControls();
}

///////////////////////////////////////////////////////////////////////////////
//
//  METHOD
//    JSSNavCtrl_SetControls
//
//  METHOD TYPE
//    API Type (External/Module/Private): Module
//    Overridable? (Yes/No)             : No
//    Overrides Virtual? (Yes/No)       : No
//
//  PARAMETERS
//    None.
//
//  RETURN VALUE
//    None
//
//  DESCRIPTION
//    Determines the states of jump tabs and sets appropriates images to those
//    jump tabs. Valid states are blank, enabled and disabled.     
//
///////////////////////////////////////////////////////////////////////////////

function JSSNavCtrl_SetControls()
{
   if (this.rightjumptab == null)  return;
   if (this.docObj.dir == "rtl")
   {
      if (this.htmltbl.offsetWidth <= this.vtbs.offsetWidth)
      {
         this.rightjumptab.src = this.imgopn2.src;
         this.rightjumptab.style.cursor = "default";
         this.leftjumptab.src = this.imgcls2.src;
         this.leftjumptab.style.cursor = "default";
         return;
      }   	
      if (this.navtabid == this.vbmxtb)
      {
         this.leftjumptab.src = this.imgcls0.src;
         this.leftjumptab.alt = this.imgcls0.alt;
         this.leftjumptab.style.cursor = "default";
      }
      else
      {
         this.leftjumptab.src = this.imgcls1.src;
         this.leftjumptab.alt = this.imgcls1.alt;
         this.leftjumptab.style.cursor = "hand";
      }
      if (this.navtabid<=0)	
      {
         this.rightjumptab.src = this.imgopn0.src;
         this.rightjumptab.alt = this.imgopn0.alt;
         this.rightjumptab.style.cursor = "default";
      }
      else
      {
         this.rightjumptab.src = this.imgopn1.src;
         this.rightjumptab.alt = this.imgopn1.alt;
         this.rightjumptab.style.cursor = "hand";
      }
      return;
   }

   if ((this.htmltbl != null && 
	this.htmltbl.rows[0].cells.length == 0) || 
       (this.vtbs.scrollLeft == 0 && 
        this.vtbs.scrollLeft+this.vtbs.offsetWidth >= this.vtbs.scrollWidth))
   {
      this.leftjumptab.src = this.imgopn2.src;
      this.leftjumptab.style.cursor = "default";
      this.rightjumptab.src = this.imgcls2.src;
      this.rightjumptab.style.cursor = "default";
      return;

   }

   if (this.vtbs.scrollLeft == 0)
   {
      this.leftjumptab.src = this.imgopn0.src;
      this.leftjumptab.alt = this.imgopn0.alt;
      this.leftjumptab.style.cursor = "default";
   }	
   else
   {
      this.leftjumptab.src = this.imgopn1.src;
      this.leftjumptab.alt = this.imgopn1.alt;
      this.leftjumptab.style.cursor = "hand";
   }
   if (this.vtbs.scrollLeft+this.vtbs.offsetWidth == this.vtbs.scrollWidth)
   {
      this.rightjumptab.src = this.imgcls0.src;
      this.rightjumptab.alt = this.imgcls0.alt;
      this.rightjumptab.style.cursor = "default";
   }
   else
   {
      this.rightjumptab.src = this.imgcls1.src;
      this.rightjumptab.alt = this.imgcls1.alt;
      this.rightjumptab.style.cursor = "hand";
   }
}

///////////////////////////////////////////////////////////////////////////////
//
//  METHOD
//    JSSNavCtrl_MaxTab
//
//  METHOD TYPE
//    API Type (External/Module/Private): Module
//    Overridable? (Yes/No)             : No
//    Overrides Virtual? (Yes/No)       : No
//
//  PARAMETERS
//    None.
//
//  RETURN VALUE
//    None
//
//  DESCRIPTION
//    sets the highest left hand side navigation tab id in the control. 
//    The vbmxtb variable contains the highest left hand side tab id when
//    the user has navigated to the righmost tab. 
//    For example:
//    -------------------------------------------------------------------------
//    | LeftScrl|RightScrl|vbmxtb|.....|....|...|RightMost| Leftscrl|RightScrl|
//    |Enabled  |Disabled |                     |Tab      |Enabled  |Disabled |  
//    -------------------------------------------------------------------------
///////////////////////////////////////////////////////////////////////////////

function JSSNavCtrl_MaxTab()
{
   var i;
   var tb = this.htmltbl.rows[0].cells;
   var size = tb.length - 1;

   if (this.docObj.dir != "rtl")
   {
      for(i = size; i>=0; i--)
      {
         if (tb[i].offsetLeft < (tb[size].offsetLeft + tb[size].offsetWidth - this.tabs_width))
            break;
      }
   }
   else
   {
      var os = 0;      
      for (i = size; i>=0; i--)
      {
         os += tb[i].offsetWidth;
         if (os >= this.tabs_width)
         {
            this.lastvtb = os - this.tabs_width;
            break;
         }
      }
   }

   this.vbmxtb = i+1;
   if (this.navtabid > this.vbmxtb)
   {
      this.navtabid = this.vbmxtb;
      if (this.docObj.dir == "rtl")
         this.htmltbl.style.left = this.Offset(this.navtabid);
   }
}

///////////////////////////////////////////////////////////////////////////////
//
//  METHOD
//    JSSNavCtrl_Offset
//
//  METHOD TYPE
//    API Type (External/Module/Private): Module
//    Overridable? (Yes/No)             : No
//    Overrides Virtual? (Yes/No)       : No
//
//  PARAMETERS
//    None.
//
//  RETURN VALUE
//    None
//
//  DESCRIPTION
//    Given the navigation tab id calculates the offsetWidth.     
//
///////////////////////////////////////////////////////////////////////////////
function JSSNavCtrl_Offset(x)
{
   if (x <= 0) 
      return 0;
   var os = 0;
   var add = 0;

   if (x == this.vbmxtb)
   {
      x--;
      add = this.lastvtb;
   }
   for (var i = 0; i < x; i++)
      os += this.htmltbl.rows(0).cells(i).offsetWidth;

   return os + add;
}

///////////////////////////////////////////////////////////////////////////////
//
//  METHOD
//    JSSNavCtrl_Resize
//
//  METHOD TYPE
//    API Type (External/Module/Private): Module
//    Overridable? (Yes/No)             : No
//    Overrides Virtual? (Yes/No)       : No
//
//  PARAMETERS
//    None.
//
//  RETURN VALUE
//    None
//
//  DESCRIPTION
//    This function is called when the frame is resized. 
//    This functions recalculates the navigation control width when the 
//    resize event happens.    
//
///////////////////////////////////////////////////////////////////////////////

function JSSNavCtrl_Resize()
{
   if (this.cntrlType == "ScreenBar")
      this.tabs_width = this.docObj.body.offsetWidth - 99;
   else
      this.tabs_width = this.navctrlElem.offsetWidth - 99;
   this.vtbs.style.pixelWidth = this.tabs_width;
}

///////////////////////////////////////////////////////////////////////////////
//
//  METHOD
//    JSSNavCtrl_ExtendTab
//
//  METHOD TYPE
//    API Type (External/Module/Private): Module
//    Overridable? (Yes/No)             : No
//    Overrides Virtual? (Yes/No)       : No
//
//  PARAMETERS
//    idx       -   [in] floating tabs ID. 
//    screenTab -   [in] tab information of the floating screen tab. 
//
//  RETURN VALUE
//    None
//
//  DESCRIPTION
//    Inserts floating screen into the screen tab navigation control.    
//
///////////////////////////////////////////////////////////////////////////////

function JSSNavCtrl_ExtendTab(idx, screenTab)
{
   this.navCtrlTabs[idx] = screenTab;
   var tb = this.htmltbl.rows[0];
   var ntab = tb.insertCell();
   
   // For the newly added tab, generate html to handle user clicks.
   ntab.noWrap = true;
   ntab.className = 'tier1On';
   ntab.id = idx;
   if(screenTab.icon == '')
   {
    if (Top().SWEIsAutomation)
    {
     ntab.innerHTML = "<a id='s_st" +idx+ "' RN='"+screenTab.name+"' UN='"+screenTab.caption+"' OT='SiebWebPageTab' href='javascript:S_ScreenBar.Activate("+idx+")'>"+screenTab.caption+"</a>";
    }
    else
    {
     ntab.innerHTML = "<a id='s_st" +idx+ "' href='javascript:S_ScreenBar.Activate("+idx+")'>"+screenTab.caption+"</a>";
    }
   }
   else
   {
    if (Top().SWEIsAutomation)
    {
     ntab.innerHTML = "<a id='s_st" +idx+ "' RN='"+screenTab.name+"' UN='"+screenTab.caption+"' OT='SiebWebPageTab' href='javascript:S_ScreenBar.Activate("+idx+")'> <img src="+screenTab.icon+" height='18' width='18' border='0' space='0' hspace='0' align='absMiddle'></img> "+screenTab.caption+"</a>";
    }
    else
    {
     ntab.innerHTML = "<a id='s_st" +idx+ "' href='javascript:S_ScreenBar.Activate("+idx+")'> <img src="+screenTab.icon+" height='18' width='18' border='0' space='0' hspace='0' align='absMiddle'></img> "+screenTab.caption+"</a>";
    }
   }

   if (typeof (Top()._swescript) != "undefined" && Top()._swescript.bAccessibleEnhanced == true)
      AddRemoveScreenText(idx,this.docObj,this.navTxt);
   this.actvtb = idx;
}

///////////////////////////////////////////////////////////////////////////////
//
//  METHOD
//    JSSNavCtrl_SetScreen
//
//  METHOD TYPE
//    API Type (External/Module/Private): Module
//    Overridable? (Yes/No)             : No
//    Overrides Virtual? (Yes/No)       : No
//
//  PARAMETERS
//    screenName - [in]	Name of the screen to highlight.
//    sweCount -   [in]	SWE Count parameter value that is used in the 
//                      URL for screen and view navigations.
//    screenTab - [in]	Screen tab information of the newly activated screen.
//
//
//  RETURN VALUE
//    None
//
//  DESCRIPTION
//    This function highlights the given screen name in the screenbar 
//    navigation control. If the screen is not a part of the navigation 
//    control (floating screen tab), that screen is added to the 
//    navigation control.   
//
///////////////////////////////////////////////////////////////////////////////

function JSSNavCtrl_SetScreen(screenName, cnt, screenTab)
{
   var tbx;
   var tb = this.htmltbl.rows[0].cells;
   this.sweCnt = cnt;
      
   var oldactv = this.actvtb;
   var oldtbx = null;

   if (oldactv >= 0)
      oldtbx = tb[oldactv];

   //same active tab, no need to update
   if (oldtbx && oldtbx.className == "tier1On" && 
         this.navCtrlTabs[oldactv] && this.navCtrlTabs[oldactv].name == screenName)
      return; 

   // iterate through the screen tabs and find the activated screen tab.
   for(x=0; x < tb.length; x++)
   {
      tbx = tb[x];
      if (tbx && this.navCtrlTabs[x] && this.navCtrlTabs[x].name == screenName)
      {
         tbx.className = "tier1On";
         this.actvtb = x;   
         if (typeof (Top()._swescript) != "undefined" && Top()._swescript.bAccessibleEnhanced == true)
            AddRemoveScreenText(x,this.docObj,this.navTxt);
         break;
      }
   }

   // If the screen is not part of the screen bar, we need to add the
   // screen caption (floating screen tab) to the screenbar nav control.
   if (x >= tb.length && screenTab)
   {
      if (oldtbx && this.navCtrlTabs[oldactv])
         oldtbx.className = "tier1Off";   

      // need to extend screen tab
      var caption = screenTab.caption;
      if (caption != "" && caption != null)
      {
         this.ExtendTab(x, screenTab);
         this.MaxTab();   //tabs length changes
      }
   }
   // deactivate the old screen tab.
   else if (oldtbx && this.navCtrlTabs[oldactv] && 
               this.navCtrlTabs[oldactv].name != screenName)
      oldtbx.className = "tier1Off";
 
   if (this.docObj.dir != "rtl")
   {
      // Always make sure navigation happens only upto the
      // maximum allowed left hand side tab. This allows us to 
      // show the entine screen tab width of tabs. 
      tbx = tb[x];
      var tbstId = tb[this.navtabid];
      if (tbx && tbstId &&
            (tbstId.offsetLeft > tbx.offsetLeft || 
               tbx.offsetLeft + tbx.offsetWidth - tbstId.offsetLeft > this.tabs_width))
      {
         this.navtabid = (x > this.vbmxtb) ? this.vbmxtb : x;
         tbstId = tb[this.navtabid];
      }
      if (tbstId)
         this.vtbs.scrollLeft = tbstId.offsetLeft; 
   }
   else
   {
      var stId_os = this.Offset(this.navtabid);
      var x_os = this.Offset(x);
      var xwid = 0;
      if (tb[x]) xwid = tb[x].offsetWidth;
      if (stId_os > x_os || xwid + x_os - stId_os > this.tabs_width)
         this.navtabid = (x > this.vbmxtb) ? this.vbmxtb : x;
      this.htmltbl.style.left = this.Offset(this.navtabid);
   }
   this.Init();
}

///////////////////////////////////////////////////////////////////////////////
//
//  METHOD
//    JSSNavCtrl_SetView
//
//  METHOD TYPE
//    API Type (External/Module/Private): Module
//    Overridable? (Yes/No)             : No
//    Overrides Virtual? (Yes/No)       : No
//
//  PARAMETERS
//    viewName -   [in]	Name of the view to highlight.
//    category -   [in]	type of the view. "Category" if it is a category view.
//
//  RETURN VALUE
//    None
//
//  DESCRIPTION
//    This function highlights the given view name in the viewbar 
//    navigation control. 
///////////////////////////////////////////////////////////////////////////////

function JSSNavCtrl_SetView(viewName, type)
{     
   //initialize a few globals here
   this.navtabid = 0;

   if (this.htmltbl == null || this.vtbs == null) 
      return;

   if (this.navtabid<0) 
   {    
      this.navtabid=0; 
      this.Init(); 
      return; 
   }

   var tb = this.htmltbl.rows[0].cells;
   var size = tb.length - 1;

   // If the view type is a category view.
   if (type == "category")
   {
      for (x = this.navtabid; x <= size; x++)
      {
         if (this.navCtrlTabs[x] != null && this.navCtrlTabs[x].caption == viewName)
         {
            tb[x].className = "tier3On";
            if (typeof (Top()._swescript) != "undefined" && Top()._swescript.bAccessibleEnhanced == true)
               AddRemoveViewText(x,this.docObj,this.navTxt,this.prefix);
            break;
         }
      }
   }
   // Find the view and highlight the view tab.
   else
   {
      for (x = this.navtabid; x <= size; x++)
      {         
         if (this.navCtrlTabs[x] != null && this.navCtrlTabs[x].name == viewName)
         {
            tb[x].className = "tier3On";
            if (typeof (Top()._swescript) != "undefined" && Top()._swescript.bAccessibleEnhanced == true)
               AddRemoveViewText(x,this.docObj,this.navTxt,this.prefix);
            break;
         }
      }
   }

   if (x > size) 
   { 
      this.Init(); 
      return; 
   }

   this.MaxTab();
   if (this.docObj.dir != "rtl")
   {
      // Always make sure navigation happens only upto the
      // maximum allowed left hand side tab. This allows us to 
      // show the entine screen tab width of tabs. 
      if (tb[this.navtabid].offsetLeft > tb[x].offsetLeft || 
            tb[x].offsetLeft - tb[this.navtabid].offsetLeft > this.tabs_width)
         this.navtabid = (x > this.vbmxtb) ? this.vbmxtb : x;
      this.vtbs.scrollLeft = tb[this.navtabid].offsetLeft;
   }

   else
   {
      var tabid_os = this.Offset(this.navtabid);
      var x_os = this.Offset(x);
      if (tabid_os > x_os || x_os - tabid_os > this.tabs_width)
         this.navtabid = (x > this.vbmxtb) ? this.vbmxtb : x;
      
      this.htmltbl.style.left = this.Offset(this.navtabid);
   }
   this.Init();
}
function JSSNavCtrl_SetScreenText (navText)
{
   this.navTxt = navText;
}

function AddRemoveScreenText(id, docObj,navText)
{
    var anchrId;
    var anchObj;
    var oldHTML;
    var newHTML;

    if (id==0)
    anchrId ='s_ScreenBar';
    else
    anchrId ='s_st' + id;
    
    var spObj = docObj.getElementById('sp_scrn');
    if (spObj != null)
    {
        spObj.parentNode.removeChild(spObj);
    }
    anchObj =docObj.getElementById(anchrId);
    if (anchObj != null)
    {
        oldHTML =anchObj.innerHTML;
        newHTML = '<SPAN id="sp_scrn" style="OVERFLOW: hidden; WIDTH: 1px; POSITION: absolute; TOP: 10px; HEIGHT: 1px">' + navText + '</SPAN>' + oldHTML;
        docObj.getElementById(anchrId).innerHTML = newHTML;
    }
}

function AddRemoveViewText(id, docObj,navText, viewType)
{
    var anchrId;
    var anchObj;
    var oldHTML;
    var newHTML;

    var vbAnchorId;
    var vbAnchorDefId;
    var vbSpanTagId;
    var spanTag;
	
    // bug# 12834042 and 12834031
    // if the view is sub view, add the Active text before the sub view text
    // otherwise, add the Active text before the view text
    if (viewType == "svb")
    {
        vbAnchorId = 's_svbt';
        vbAnchorDefId = 's_SubViewBar';
        vbSpanTagId = 'sp_subview';
        spanTag = '<SPAN id="sp_subview" style="OVERFLOW: hidden; WIDTH: 1px; POSITION: absolute; TOP: 10px; HEIGHT: 1px">';
    }
    else
    {
        vbAnchorId = 's_vbt';
        vbAnchorDefId = 's_ViewBar';
        vbSpanTagId = 'sp_view';
        spanTag = '<SPAN id="sp_view" style="OVERFLOW: hidden; WIDTH: 1px; POSITION: absolute; TOP: 10px; HEIGHT: 1px">';
    }
	
    if (id==0)
    anchrId =vbAnchorDefId;
    else
    anchrId =vbAnchorId + id;
    
    var spObj = docObj.getElementById(vbSpanTagId);
    if (spObj != null)
    {
        spObj.parentNode.removeChild(spObj);
    }
    anchObj =docObj.getElementById(anchrId);
    if (anchObj != null)
    {
        oldHTML =anchObj.innerHTML;
        newHTML = spanTag + navText + '</SPAN>' + oldHTML;
        docObj.getElementById(anchrId).innerHTML = newHTML;
    }
}

///////////////////////////////////////////////////////////////////////////////
new JSSNavCtrl ();

// Methods that are implemented by JSSNavCtrl class.
JSSNavCtrl.prototype.Initialize   = JSSNavCtrl_Initialize;
JSSNavCtrl.prototype.Activate     = JSSNavCtrl_Activate;
JSSNavCtrl.prototype.Init         = JSSNavCtrl_Init;
JSSNavCtrl.prototype.StopScroll   = JSSNavCtrl_StopScroll;
JSSNavCtrl.prototype.ScrollLeft   = JSSNavCtrl_ScrollLeft;
JSSNavCtrl.prototype.ScrollRight  = JSSNavCtrl_ScrollRight;
JSSNavCtrl.prototype.Offset       = JSSNavCtrl_Offset;
JSSNavCtrl.prototype.Resize       = JSSNavCtrl_Resize;
JSSNavCtrl.prototype.MaxTab       = JSSNavCtrl_MaxTab;
JSSNavCtrl.prototype.SetControls  = JSSNavCtrl_SetControls;
JSSNavCtrl.prototype.SetView      = JSSNavCtrl_SetView;
JSSNavCtrl.prototype.ExtendTab    = JSSNavCtrl_ExtendTab;
JSSNavCtrl.prototype.st_scrn      = JSSNavCtrl_SetScreen;
JSSNavCtrl.prototype.SetScreenText =JSSNavCtrl_SetScreenText;
///////////////////////////////////////////////////////////////////////////////


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
}/*****************************************************************************
 *
 * Copyright (C) 2000, Siebel Systems, Inc., All rights reserved.
 *
 * FILE:       objbase.js
 *  $Revision: 32 $
 *      $Date: 11/04/01 12:07a $
 *    $Author: Mrfreeze $ of last update
 *
 * CREATOR:    John Coker
 *
 * DESCRIPTION
 *    Base object class for JavaScript browser tier
 *
 *****************************************************************************/

/*
 * JSSObjectBase
 *
 * errorArray
 * errorLock
 */
function JSSObjectBase ()
{
//   this.errorLock = 0;
}

var OK    = "";
var NOTOK = "NOTOK";

function JSSObjectBase_AddErrorMsg (errCode, params, append)
{
   var  i;
   var  errRec;

   if (this.errorLock > 0)
      return (true);

   if (errCode == null || errCode == OK)
      return (false);

   if (this.errorCode == OK)
   {
      SetErrorMsg (errCode, params, null);
      return (true);
   }

   // create the error record
   errRec = new JSSErrorRec ();
   errRec.errorCode = errCode;
   errRec.errorMsg  = this.TranslateError (errCode, params);

   if (this.errorArray == null)
      this.errorArray = new Array ();

   if (append)
   {
      // add to end of array
      this.errorArray[this.errorArray.length] = errRec;
   }
   else
   {
      // insert at beginning of array
      for (i = this.errorArray.length; i > 0; i--)
         this.errorArray[i] = this.errorArray[i - 1];
      this.errorArray[0] = errRec;
   }

   return (true);
}

function JSSObjectBase_AddErrorMsgText (errCode, errMsg, append)
{
   var  i;
   var  errRec;

   if (this.errorLock > 0)
      return (true);

   if (errCode == null || errCode == OK ||
       errMsg  == null || errMsg  == "")
      return (false);

   if (this.errorCode == OK)
   {
      SetErrorMsg (errCode, params, null);
      return (true);
   }

   // create the error record
   errRec = new JSSErrorRec ();
   errRec.errorCode = errCode;
   errRec.errorMsg  = errMsg;

   if (this.errorArray == null)
      this.errorArray = new Array ();

   if (append)
   {
      // add to end of array
      this.errorArray[this.errorArray.length] = errRec;
   }
   else
   {
      // insert at beginning of array
      for (i = this.errorArray.length; i > 0; i--)
         this.errorArray[i] = this.errorArray[i - 1];
      this.errorArray[0] = errRec;
   }

   return (true);
}

// Replaces single and double quote chars
function JSSObjectBase_CheckQuotes(str, bSingleQuote)
{
   if (str.indexOf('"') >= 0 || str.indexOf('\'') >= 0)
   {
      if (bSingleQuote)
         return str.replace(/"/g, escape("\"")).replace(/'/g, "\\'");
      else
         return str.replace(/"/g, "\\\"").replace(/'/g, escape("'"));
   }
   else
      return str;
}

function JSSObjectBase_ClearErrorMsg ()
{
   if (this.errorLock)
   {
      if (this.errorLock > 0)
         return;
   }

   // clear out the error array
   if (this.errorArray)
      this.errorArray = null;
}

function JSSObjectBase_CopyErrorMsg (object)
{
   var  i;
   var  errRec;

   if (this.errorLock > 0)
      return (true);

   if (object == null || typeof (object) != "object")
      return this.ClearErrorMsg ();

   this.ClearErrorMsg ();

   if (!object.HasErrorMsg ())
      return (true);

   this.errorArray = new Array (object.errorArray.length);

   for (i = 0; i < object.errorArray.length; i++)
   {
      errRec = new JSSErrorRec ();

      errRec.errorCode  = object.errorArray[i].errorCode;
      errRec.errorMsg   = object.errorArray[i].errorMsg;
      errRec.errorChild = object.errorArray[i].errorChild;

      this.errorArray[i] = errRec;
   }

   return (true);
}

//Port of CSSSWEUtilHtml::EncodeQuotes so that we can encode quotes
function JSSObjectBase_EncodeQuotes(orig)
{
   var encoded;  
   var i, idx, iLimit;
   var currentchar;
   
   encoded = "";

   for (i = 0, idx = 0, iLimit = orig.length; i < iLimit; i++)
   {
      currentchar = orig.charAt(i);
      switch (currentchar)
      {
      case '"':
         encoded += orig.substr(idx, i-1);
         encoded += "&#34;";
         idx = i + 1;
         break;

      case '\'':
         encoded += orig.substr(idx, i-1);
         encoded += "&#39;";
         idx = i + 1;
         break;

      default:
         break;
      }
   }
   if (idx != i)
      encoded += orig.substr(idx, orig.length-1);

   return encoded;
}

function JSSObjectBase_FormatString (format, params)
{
   var  format;
   var  i;
   var  paramArray;
   var  paramNo;
   var  message;

   // make sure we have a valid format
   if (format == null || format == "")
      return ("");

   // get the parameters as an array
   if (typeof (params) == "object")
   {
      // already passed in an array
      paramArray = params;
   }
   else if (params != null)
   {
      // one parameter passed in
      paramArray = new Array (1);
      paramArray[0] = params + "";
   }

   if (paramArray != null)
   {
      // substitute parameters into the array
      message = "";
      for (i = 0; i < format.length; i++)
      {
         if (format.substr (i, 1) == '%' &&
             i + 1 < format.length)
         {
            paramNo = parseInt (format.substr (i + 1, 1));
            if (isNaN (paramNo) ||
                paramNo < 1 || paramNo > paramArray.length)
            {
               // not a valid substition
               message += format.substr (i, 1);
               i++;
               message += format.substr (i, 1);
            }
            else
            {
               // substitute in the pararameter
               message += paramArray[paramNo - 1];
               i++;
            }
         }
         else
            message += format.substr (i, 1);
      }
   }
   else
   {
      // no parameters to substitute
      message = format;
   }

   return (message);
}

function JSSObjectBase_GetApplication ()
{
   if (this.application)
      return (this.application);

   // find the application object in our special frame
   if (top._swe != null && top._swe._sweapp != null)
   {
      this.application = App();
      return (this.application);
   }
   else
      return (null);
}

function JSSObjectBase_GetErrorCount ()
{
   if (this.errorArray == null)
      return (0);

   return (this.errorArray.length);
}

function JSSObjectBase_GetErrorMsg (index)
{
   if (index == null)
      index = 0;

   if (this.errorArray == null ||
       this.errorArray.length <= index)
      return ("");

   return (this.errorArray[index].errorMsg);
}

function JSSObjectBase_GetErrorCode (index)
{
   if (index == null)
      index = 0;

   if (this.errorArray == null ||
       this.errorArray.length <= index)
      return (OK);

   return (this.errorArray[index].errorCode);
}

function JSSObjectBase_HasErrorMsg ()
{
   if (this.errorArray == null)
      return (false);

   return (this.errorArray.length > 0);
}

function JSSObjectBase_LockErrorMsg ()
{
   if (this.errorLock == null)
      this.errorLock = 1;
   else
      this.errorLock++;

   return (true);
}

function JSSObjectBase_SetErrorMsg (errCode, params, child)
{
   var  errRec;

   if (this.errorLock > 0)
      return (true);

   if (child != null && typeof (child) != "object")
      child = null;

   this.ClearErrorMsg ();
   if (errCode == null || errCode == "OK")
      return (true);

   if (child != null)
   {
      // copy error message from child
      this.CopyErrorMsg (child);

      // insert specific error record if different
      if (errCode != OK &&
          errCode != this.GetErrorCode ())
      {
         // insert our specific error at head
         this.AddErrorMsg (errCode, params, false);
      }
   }
   else
   {
      this.errorArray = new Array (1);

      // set our specific error record
      errRec = new JSSErrorRec ();
      errRec.errorCode  = errCode;
      errRec.errorMsg   = this.TranslateError (errCode, params);

      this.errorArray[0] = errRec;
   }

   return (true);
}

function JSSObjectBase_SetErrorMsgText (errCode, errMsg)
{
   var  errRec;

   if (this.errorLock > 0)
      return (true);

   this.ClearErrorMsg ();
   if (errCode == null || errCode == OK)
      return (true);

   this.errorArray = new Array (1);

   // set our specific error record
   errRec = new JSSErrorRec ();
   errRec.errorCode = errCode;
   errRec.errorMsg  = errMsg;

   this.errorArray[0] = errRec;

   return (true);
}

function JSSObjectBase_TextToHTML (text)
{
   if (text == null || text == "")
      return ("&nbsp;");

   text = text.replace (/&/g, "&amp;");
   text = text.replace (/</g, "&lt;");
   text = text.replace (/>/g, "&gt;");

   return (text);
}

function JSSObjectBase_TranslateError (errCode, params)
{
   var  application;
   var  format;

   // lookup the error code in our translation array
   application = this.GetApplication ();

   if (application == null)
   {
      // no application to do the translation
      message = errCode;
   }
   else
   {
      // translate the error code into a message format
      format = application.GetLocalString (errCode);
      if (format == null || format == "")
      {
         // use the error code
         message = errCode;
      }
      else
      {
         // substitute parameters into the array
         message = this.FormatString (format, params);
      }
   }

   // return the resulting message
   return (message);
}

function JSSObjectBase_UnLockErrorMsg ()
{
   this.errorLock--;

   return (true);
}


new JSSObjectBase ();

JSSObjectBase.prototype.AddErrorMsg     = JSSObjectBase_AddErrorMsg;
JSSObjectBase.prototype.AddErrorMsgText = JSSObjectBase_AddErrorMsgText;
JSSObjectBase.prototype.CheckQuotes     = JSSObjectBase_CheckQuotes;
JSSObjectBase.prototype.ClearErrorMsg   = JSSObjectBase_ClearErrorMsg;
JSSObjectBase.prototype.CopyErrorMsg    = JSSObjectBase_CopyErrorMsg;
JSSObjectBase.prototype.EncodeQuotes    = JSSObjectBase_EncodeQuotes;
JSSObjectBase.prototype.FormatString    = JSSObjectBase_FormatString;
JSSObjectBase.prototype.GetApplication  = JSSObjectBase_GetApplication;
JSSObjectBase.prototype.GetErrorCode    = JSSObjectBase_GetErrorCode;
JSSObjectBase.prototype.GetErrorCount   = JSSObjectBase_GetErrorCount;
JSSObjectBase.prototype.GetErrorMsg     = JSSObjectBase_GetErrorMsg;
JSSObjectBase.prototype.HasErrorMsg     = JSSObjectBase_HasErrorMsg;
JSSObjectBase.prototype.LockErrorMsg    = JSSObjectBase_LockErrorMsg;
JSSObjectBase.prototype.SetErrorMsg     = JSSObjectBase_SetErrorMsg;
JSSObjectBase.prototype.SetErrorMsgText = JSSObjectBase_SetErrorMsgText;
JSSObjectBase.prototype.TextToHTML      = JSSObjectBase_TextToHTML;
JSSObjectBase.prototype.TranslateError  = JSSObjectBase_TranslateError;
JSSObjectBase.prototype.UnLockErrorMsg  = JSSObjectBase_UnLockErrorMsg;


function JSSErrorRec ()
{
   this.errorCode = OK;
   this.errorMsg  = "";
}
/*****************************************************************************
 *
 * Copyright (C) 2000, Siebel Systems, Inc., All rights reserved.
 *
 * FILE:       busobjshadow.js
 *  $Revision: 20 $
 *      $Date: 9/15/01 1:25p $
 *    $Author: Pramacha $ of last update
 *
 * CREATOR:    Michael Flexer
 *
 * DESCRIPTION
 *    BusObj Shadow object for JavaScript browser tier
 *
 *****************************************************************************/

/*
 * JSSBusObjShadow
 *
 * _busobj
 */

function JSSBusObjShadow_FirstBusComp ()
{
   return JSSBusObjShadow_GetBCShadow (this._busobj.EnumBusComps (true));
}

function JSSBusObjShadow_GetBCShadow (buscomp)
{
   if (buscomp == null)
      return (null);

   if (buscomp.shadow == null)
   {
      buscomp.shadow = new JSSBusCompShadow ();
      buscomp.shadow._busComp = buscomp;
   }

   return (buscomp.shadow);
}

function JSSBusObjShadow_GetBusComp (name)
{
   return JSSBusObjShadow_GetBCShadow (this._busobj.GetBusCompByName (name));
}

function JSSBusObjShadow_Name ()
{
   return this._busobj.GetName ();
}

function JSSBusObjShadow_NextBusComp ()
{
   return JSSBusObjShadow_GetBCShadow (this._busobj.EnumBusComps (false));
}

function JSSBusObjShadow ()
{
}

new JSSBusObjShadow ();
JSSBusObjShadow.prototype = new JSSObjectBase ();

JSSBusObjShadow.prototype.FirstBusComp            = JSSBusObjShadow_FirstBusComp;
JSSBusObjShadow.prototype.GetBusComp              = JSSBusObjShadow_GetBusComp;
JSSBusObjShadow.prototype.Name                    = JSSBusObjShadow_Name;
JSSBusObjShadow.prototype.NextBusComp             = JSSBusObjShadow_NextBusComp;
/*****************************************************************************
 *
 * Copyright (C) 2000, Siebel Systems, Inc., All rights reserved.
 *
 * FILE:       buscompshadow.js
 *  $Revision: 23 $
 *      $Date: 8/10/01 2:01p $
 *    $Author: Wlai $ of last update
 *
 * CREATOR:    Michael Flexer
 *
 * DESCRIPTION
 *    Buscomp Shadow object for JavaScript browser tier
 *
 *****************************************************************************/

/*
 * JSSBusCompShadow
 *
 * _busComp
 */

function JSSBusCompShadow_BusObject ()
{
   var busobj;

   busobj = this._busComp.GetBusObj ();

   if (busobj == null)
      return (null);

   if (busobj.shadow == null)
   {
      busobj.shadow = new JSSBusObjShadow ();
      busobj.shadow._busobj = busobj;
   }

   return (busobj.shadow);
}

function JSSBusCompShadow_GetFieldValue (fieldName)
{
   return this._busComp.GetFieldValue (fieldName);
}

function JSSBusCompShadow_GetSearchExpr ()
{
   return this._busComp.GetSearchSpec ();
}

function JSSBusCompShadow_GetSearchSpec (fieldName)
{
   return this._busComp.GetFieldSearchSpec (fieldName);
}

function JSSBusCompShadow_InvokeMethod (name, inputPropSet)
{
   return this._busComp.InvokeMethod (name, inputPropSet);
}

function JSSBusCompShadow_Name ()
{
   return this._busComp.GetName ();
}

function JSSBusCompShadow_SetFieldValue (fieldName, value)
{
   return this._busComp.SetFieldValue (fieldName, value);
}

function JSSBusCompShadow_SetFormattedFieldValue (fieldName, value, format)
{
   return this._busComp.SetFormattedValue (fieldName, value, format);
}

function JSSBusCompShadow_GetFormattedFieldValue (fieldName, value, format)
{
   return this._busComp.GetFormattedValue (fieldName, format);
}

function JSSBusCompShadow_WriteRecord ()
{
   return this._busComp.WriteRecord ();
}

function JSSBusCompShadow ()
{
}

new JSSBusCompShadow ();
JSSBusCompShadow.prototype = new JSSObjectBase ();

JSSBusCompShadow.prototype.BusObject               = JSSBusCompShadow_BusObject;
JSSBusCompShadow.prototype.GetFieldValue           = JSSBusCompShadow_GetFieldValue;
JSSBusCompShadow.prototype.GetSearchExpr           = JSSBusCompShadow_GetSearchExpr;
JSSBusCompShadow.prototype.GetSearchSpec           = JSSBusCompShadow_GetSearchSpec;
JSSBusCompShadow.prototype.InvokeMethod            = JSSBusCompShadow_InvokeMethod;
JSSBusCompShadow.prototype.Name                    = JSSBusCompShadow_Name;
JSSBusCompShadow.prototype.SetFieldValue           = JSSBusCompShadow_SetFieldValue;
JSSBusCompShadow.prototype.SetFormattedFieldValue  = JSSBusCompShadow_SetFormattedFieldValue;
JSSBusCompShadow.prototype.GetFormattedFieldValue  = JSSBusCompShadow_GetFormattedFieldValue;
JSSBusCompShadow.prototype.WriteRecord             = JSSBusCompShadow_WriteRecord;

/*****************************************************************************
 *
 * Copyright (C) 2000, Siebel Systems, Inc., All rights reserved.
 *
 * FILE:       appletshadow.js
 *  $Revision: 30 $
 *      $Date: 9/14/01 6:48p $
 *    $Author: Pramacha $ of last update
 *
 * CREATOR:    Michael Flexer
 *
 * DESCRIPTION
 *    Applet and control shadow objects for JavaScript browser
 *
 *****************************************************************************/

/*
 * JSSAppletShadow
 *
 * _applet
 * _controlShadowArray
 */

function JSSAppletShadow_ActiveMode ()
{
   return this._applet.GetActiveMode ();
}

function JSSAppletShadow_Buscomp ()
{
   
   var buscomp;

   buscomp = this._applet.GetBusComp ();

   if (buscomp == null)
      return (null);

   if (buscomp.shadow == null)
   {
      buscomp.shadow = new JSSBusCompShadow ();
      buscomp.shadow._busComp = buscomp;
   }

   return (buscomp.shadow);
}

function JSSAppletShadow_BusObject ()
{
   var busobj;

   busobj = this._applet.GetBusComp ().GetBusObj ();

   if (busobj == null)
      return (null);

   if (busobj.shadow == null)
   {
      busobj.shadow = new JSSBusObjShadow ();
      busobj.shadow._busobj = busobj;
   }

   return (busobj.shadow);
}

function JSSAppletShadow_FindActiveXControl (controlName)
{
   return this._applet.GetControlElement (controlName);
}

function JSSAppletShadow_FindControl (controlName)
{
   var  i;
   var  controlShadow;
   var  control;
   var bFound;
   if (this._applet == null)
      return (null);

   if (this._controlShadowArray == null)
      this._controlShadowArray = new Array ();

   bFound = false;
   // first, see if this control shadow already exists
   for (i = 0; i < this._controlShadowArray.length; i++)
   {
      controlShadow = this._controlShadowArray[i];

      if (controlShadow._name == controlName)
      {
         if (controlShadow._control != null)
            return (controlShadow);
         else
            break;
         bFound = true;
      }
   }

   if (!bFound)
      controlShadow = null;
   // didn't find it, so create the shadow control

   control = this._applet.GetControl (controlName);
   if (control == null)
   {
      return (null);
   }
	
   if (controlShadow == null)
   {
      controlShadow = new JSSControlShadow ();
      controlShadow._name          = controlName;
      controlShadow._appletShadow  = this;
   }

   controlShadow._control       = control;

   this._controlShadowArray[i] = controlShadow;

   return (controlShadow);
}

function JSSAppletShadow_Name ()
{
   return this._applet.GetName ();
}

function JSSAppletShadow_InvokeMethod (name, inputPropSet)
{
   return this._applet.InvokeMethod (name, inputPropSet);
}

function JSSAppletShadow_ReInit ()
{
   var control;
   var controlName;
   
   if (this._controlShadowArray == null)
      return;

   for (i = 0; i < this._controlShadowArray.length; i++)
   {
      controlShadow = this._controlShadowArray[i];
      controlName = controlShadow._name;
      control = this._applet.GetControl (controlName);
      // but first see if this control really exists
      if (control == null)
         control = this._applet.GetListCol (controlName);
      controlShadow._control = control;
   }
}

function JSSAppletShadow (applet)
{
   if (applet != null)
   {
      this._applet = applet;
      applet.shadow = this;
   }
}

new JSSAppletShadow (null);
JSSAppletShadow.prototype = new JSSObjectBase ();

JSSAppletShadow.prototype.ActiveMode              = JSSAppletShadow_ActiveMode;
JSSAppletShadow.prototype.BusComp                 = JSSAppletShadow_Buscomp;
JSSAppletShadow.prototype.BusObject               = JSSAppletShadow_BusObject;
JSSAppletShadow.prototype.FindActiveXControl      = JSSAppletShadow_FindActiveXControl;
JSSAppletShadow.prototype.FindControl             = JSSAppletShadow_FindControl;
JSSAppletShadow.prototype.Name                    = JSSAppletShadow_Name;
JSSAppletShadow.prototype.ReInit                    = JSSAppletShadow_ReInit;
JSSAppletShadow.prototype.InvokeMethod            = JSSAppletShadow_InvokeMethod;


/*
 * JSSControlShadow
 *
 * _name
 * _appletShadow
 */

function JSSControlShadow_Applet ()
{
   return (this._appletShadow);
}

function JSSControlShadow_Buscomp ()
{
   if (this._appletShadow == null)
      return (null);

   return (this._appletShadow.BusComp ());
}

function JSSControlShadow_GetValue ()
{
   return (this._appletShadow._applet.GetControlValueByName (this._name));
}

function JSSControlShadow_Name ()
{
   return (this._name);
}

function JSSControlShadow_SetValue (value)
{
   this._appletShadow._applet.SetControlValueByName (this._name, value);
}

function JSSControlShadow_SetReadOnly(flag)
{
   this.SetProperty ("ReadOnly", flag);
}

function JSSControlShadow_SetEnabled (flag)
{
   this.SetProperty ("Enabled", flag);
}

function JSSControlShadow_SetVisible (flag)
{
   this.SetProperty ("Visible", flag);
}

function JSSControlShadow_GetLabelProperty (propName)
{
   return this._control.GetLabelProperty(propName);
}

function JSSControlShadow_GetProperty (propName)
{
   return this._control.GetProperty(propName);
}

function JSSControlShadow_SetLabelProperty (propName, value)
{
   this._control.SetLabelProperty(propName, value);
}

function JSSControlShadow_SetProperty (name, value)
{
   switch (name)
   {
      case "Enabled":
      case "ReadOnly":
      {
         if (value == false || value.toLowerCase() == "false")
            value = false;

         else if (value == true || value.toLowerCase() == "true")
            value = "true";
        break;
      }
      case "Visible":
      {
          if(IsOpenUI())
          {
              if (value == false || value.toLowerCase() == "false")
                  value = "none";

              if (value == true || value.toLowerCase() == "true")
                  value = "inline";
          }
          else
          {
              if (value == false || value.toLowerCase() == "false")
                  value = "false";

               if (value == true || value.toLowerCase() == "true")
                  value = "true";
          }
        break;
      }
   }
   this._control.SetProperty(name, value);
}

function JSSControlShadow ()
{
}

new JSSControlShadow ();
JSSControlShadow.prototype = new JSSObjectBase ();

JSSControlShadow.prototype.Applet                 = JSSControlShadow_Applet;
JSSControlShadow.prototype.BusComp                = JSSControlShadow_Buscomp;
JSSControlShadow.prototype.GetValue               = JSSControlShadow_GetValue;
JSSControlShadow.prototype.Name                   = JSSControlShadow_Name;
JSSControlShadow.prototype.SetValue               = JSSControlShadow_SetValue;
JSSControlShadow.prototype.SetReadOnly            = JSSControlShadow_SetReadOnly;
JSSControlShadow.prototype.SetEnabled             = JSSControlShadow_SetEnabled;
JSSControlShadow.prototype.SetVisible             = JSSControlShadow_SetVisible;
JSSControlShadow.prototype.SetProperty            = JSSControlShadow_SetProperty;
JSSControlShadow.prototype.GetLabelProperty       = JSSControlShadow_GetLabelProperty;
JSSControlShadow.prototype.GetProperty            = JSSControlShadow_GetProperty;
JSSControlShadow.prototype.SetLabelProperty       = JSSControlShadow_SetLabelProperty;

/*****************************************************************************
 *
 * Copyright (C) 2002, Siebel Systems, Inc., All rights reserved.
 *
 * FILE:       toolbar.js
 *
 * CREATOR:    Jing Chen
 *
 * DESCRIPTION
 *
 *****************************************************************************/

function JSSToolbar (isRTL)
{
   this.name         = "";
   this.index        = -1;
   this.htmlElem     = null;
   this.itemArray    = new Array();
   this.bRecording   = false;
   this.bRecFlgSet   = false;
   this.isRTL        = (typeof (isRTL) == "undefined" ? 0 : isRTL);
}

///////////////////////////////////////////////////////////////////////////////
//
//  METHOD
//    JSSToolbar_SetName
//
//  METHOD TYPE
//    API Type (External/Module/Private): Module
//    Overridable? (Yes/No)             : No
//    Overrides Virtual? (Yes/No)       : No
//
//  PARAMETERS
//    nameIn     -   [in] name of the toolbar. 
//
//  RETURN VALUE
//    None
//
//  DESCRIPTION
//    sets the name of the toolbar.
//
///////////////////////////////////////////////////////////////////////////////
function JSSToolbar_SetName (nameIn)
{
   this.name = nameIn;
}

///////////////////////////////////////////////////////////////////////////////
//
//  METHOD
//    JSSToolbar_SetIndex
//
//  METHOD TYPE
//    API Type (External/Module/Private): Module
//    Overridable? (Yes/No)             : No
//    Overrides Virtual? (Yes/No)       : No
//
//  PARAMETERS
//    indexIn     -   [in] index of the toolbar. 
//
//  RETURN VALUE
//    None
//
//  DESCRIPTION
//    sets the index of the toolbar.
//
///////////////////////////////////////////////////////////////////////////////

function JSSToolbar_SetIndex (indexIn)
{
   this.index = indexIn;
}

///////////////////////////////////////////////////////////////////////////////
//
//  METHOD
//    JSSToolbar_BindAXObj
//
//  METHOD TYPE
//    API Type (External/Module/Private): Module
//    Overridable? (Yes/No)             : No
//    Overrides Virtual? (Yes/No)       : No
//
//  PARAMETERS
//    axObj      -   [in] ActiveX wrapper class.
//    nameIn     -   [in] name of the toolbar. 
//    htmlID     -   [in] html id of the toolbar object. 
//
//  RETURN VALUE
//    None
//
//  DESCRIPTION
//    Binds the javascript class to the ActiveX wrapper class.
//
///////////////////////////////////////////////////////////////////////////////

function JSSToolbar_BindAXObj (axObj, nameIn, htmlID)
{
   this.axObj = axObj;
   axObj.jsObj = this;
   this.name  = nameIn;
   axObj.SetName(nameIn);
   axObj.SetApplication (App());
   axObj.SetHtmlID (htmlID);
}

///////////////////////////////////////////////////////////////////////////////
//
//  METHOD
//    JSSToolbar_GetToolbarItemNames
//
//  METHOD TYPE
//    API Type (External/Module/Private): Module
//    Overridable? (Yes/No)             : No
//    Overrides Virtual? (Yes/No)       : No
//
//  PARAMETERS
//    propertyName  -   [in] name of the requested property. Property names
//                          are: "ToolbarItemDisplayNames", 
//                          and "ToolbarItemStates".
//
//  RETURN VALUE
//    array containing toolbar item captions.
//
//  DESCRIPTION
//    This routine iterates through toolbar items an returns the array
//    toolbar item captions or item states.
//
///////////////////////////////////////////////////////////////////////////////

function JSSToolbar_GetToolbarItemNames (propertyName)
{   
   // create the array to hold the property values.
   var propertyValues = new Array();

   // iterate through toolbar items and retrieve their captions.
   for (var index = 0; index < this.itemArray.length; index++)
   {
      if (propertyName == "ToolbarItemDisplayNames")
         propertyValues[index] = this.itemArray[index].name;  
      else if (propertyName == "ToolbarItemHtmlIDs")
      {
         switch (this.itemArray[index].type)
         {
            case "UtilityLink":
            case "Button":
            case "Link":
            case "Label":
                propertyValues[index] = this.itemArray[index].inEId; 
                break;
            default:
                propertyValues[index] = this.itemArray[index].outEId; 
                break;
         }
      }
      else    
      {
         if (typeof(this.itemArray[index].enabled) == 'undefined')
            propertyValues[index] = false; 
         else
            propertyValues[index] = this.itemArray[index].enabled;  
      }
   }
   return propertyValues;
}

///////////////////////////////////////////////////////////////////////////////
//
//  METHOD
//    JSSToolbar_GoToItem
//
//  METHOD TYPE
//    API Type (External/Module/Private): Module
//    Overridable? (Yes/No)             : No
//    Overrides Virtual? (Yes/No)       : No
//
//  PARAMETERS
//    name of the toolbar item.
//
//  RETURN VALUE
//    None
//
//  DESCRIPTION
//    Calls the click event on the given toolbar item.
//
///////////////////////////////////////////////////////////////////////////////
function JSSToolbar_GoToItem(name)
{
   var i;
   for (i = 0; i < this.itemArray.length; i ++)
   {
      if (typeof (this.itemArray[i].menu) != "undefined")
      {
         JSSToolbar_LoadMenu (this, i, false);
               
         var psMenuItem = JSSToolbar_FindMenuItem (top._swe._sweapp._JMenuObj.psMenu, name);
         if (psMenuItem)
         {
            // Activate toolbar item.
            var fakeEt = new Object();
            fakeEt.type = "click";
            this.DoHandleEvent(this, i, fakeEt, psMenuItem);
            break;
         }
      }
      else
      {
         if (this.itemArray[i].name == name)
         {
            // Activate toolbar item.
            var fakeEt = new Object();
            fakeEt.type = "click";
            this.DoHandleEvent(this, i, fakeEt);
            break;
         }
      }
   }
}

function JSSToolbar_AddLinkItem (name,
                             cmdId,
                             caption,
                             menu)
{
   var item    = new JSSToolbarItem();
   item.parent = this;

   item.name = name;
   item.type = "UtilityLink";

   if (cmdId != null && cmdId != "")
      item.cmdId = cmdId;
   if (caption != null && caption != "")
      item.caption = caption;
   if (menu != null && menu != "")
   {
      item.menu = menu;
      item.enabled = true;
   }

   item.index = this.itemArray.length;
   this.itemArray[this.itemArray.length] = item;
}

function JSSToolbar_AddLinkItem (name,
                             cmdId,
                             caption,
                             menu)
{
   var item    = new JSSToolbarItem();
   item.parent = this;

   item.name = name;
   item.type = "UtilityLink";

   if (cmdId != null && cmdId != "")
      item.cmdId = cmdId;
   if (caption != null && caption != "")
      item.caption = caption;
   if (menu != null && menu != "")
   {
      item.menu = menu;
      item.enabled = true;
   }

   item.index = this.itemArray.length;
   this.itemArray[this.itemArray.length] = item;
}

function JSSToolbar_AddItem (name,
                             type,
                             cmdId,
                             caption,
                             bitmap,
                             offBitmap)
{
   var item    = new JSSToolbarItem();
   item.parent = this;

   item.name = name;
   item.type = type;

   if (cmdId != null && cmdId != "")
      item.cmdId = cmdId;
   if (caption != null && caption != "")
      item.caption = caption;
   if (bitmap != null && bitmap != "")
      item.bitmap = bitmap;
   if (offBitmap != null && offBitmap != "")
      item.offBitmap = offBitmap;

   item.index = this.itemArray.length;
   this.itemArray[this.itemArray.length] = item;
}

function JSSToolbar_Draw (e, isLink)
{
   var html;
   var i;
   var item;
   var evtScript;

   this.Update (/*bInit*/ true);
   this.PrepareToDraw(e, isLink);

   // draw UI:
   html = "<table style='height:27px;cursor:hand'><tr>";
   for (i = 0; i < this.itemArray.length; i ++)
   {
      item = this.itemArray[i];

      // outer <TD>:
      if (isLink)
         item.outEId = this.name + "::" + item.name;
      else
         item.outEId = e.id+"_out"+i;
   
      if (!isLink)
      {
         if (item.checked==true)
            evtScript = " class=\"TBpush" + this.index + "\"";
         else
            evtScript = " class=\"TBflat" + this.index + "\"";
      }
      else
      {
         evtScript = " class=\"TBLink" + this.index + "\"";
         if (item.enabled == false)
            evtScript += "DISABLED";
      }

      switch (this.GetItemStyle(i))
      {
         case "UtilityLink":
            evtScript += " ONMOUSEOVER=\"" + _TB_evt(this.index, i) + "\"" +
                         " ONMOUSEOUT=\"" + _TB_evt(this.index, i) + "\"" +
                         " ONCLICK=\"" + _TB_evt(this.index, i) + "\"";
            break;
         case "rollover":  // use rollover border
            evtScript += " ONMOUSEDOWN=\"" + _TB_evt(this.index, i) + "\"" +
                         " ONMOUSEUP=\"" + _TB_evt(this.index, i) + "\"" +
                         " ONMOUSEOVER=\"" + _TB_evt(this.index, i) + "\"" +
                         " ONMOUSEOUT=\"" + _TB_evt(this.index, i) + "\"" +
                         " ONCLICK=\"" + _TB_evt(this.index, i) + "\"";
            break;

         default:
            break;
      }
      html += "<td nowrap id=\"" + item.outEId + "\"" + evtScript + ">";

      // inner content:
      item.inEId = e.id+"_in"+i;
      html += this.DoGenerateItemHtml(this, i);
   
      html +=  "</td>";
   }
   html += "</tr></table>";

   e.innerHTML = html;
   this.htmlElem = e;
}

function JSSToolbar_GetHtmlElem (elemId)
{
   return this.htmlElem.document.getElementById(elemId);
}

function JSSToolbar_GetItemStyle (idx)
{
   return this.DoGetItemStyle (this, idx);
}

function JSSToolbar_HandleEvent (idx, evt)
{
   if (this.itemArray[idx].enabled != true)
      return false;

   var item    = this.itemArray[idx];
   var oElem   = this.GetHtmlElem(item.outEId);
   if (this.GetItemStyle(idx) == "rollover") 
   {
      switch (evt.type)
      {
         case "mousedown":
         {
            oElem.className = "TBpush";
            break;
         }
         case "click":
         {
            // Automation support.
            if (!this.bRecFlgSet)
            {
                this.bRecording = this.axObj.IsRecording(); 
                this.bRecFlgSet = true;
            }
            if (this.bRecording)
            {  
               var pset = App().NewPropertySet();;
               pset.SetProperty("ToolbarItemDisplayName", this.itemArray[idx].name);
               this.axObj.RecordEvent("GoToItem", pset);
            }
            break;
         }
         case "mouseover":
         case "mouseup":
            oElem.className = "TBpop";
            break;
         case "mouseout":
            if (item.checked==true)
               oElem.className = "TBpush";
            else
               oElem.className = "TBflat"+this.index;

            break;
      }
   }
   else if (this.GetItemStyle(idx) == "UtilityLink") 
   {
      switch (evt.type)
      {
         case "click":
         {
            // Automation support.
            if (!this.bRecFlgSet)
            {
               this.bRecording = this.axObj.IsRecording(); 
               this.bRecFlgSet = true;
            }
            if (this.bRecording && typeof (this.itemArray[idx].menu) == "undefined")
            {  
               var pset = App().NewPropertySet();;
               pset.SetProperty("ToolbarItemDisplayName", this.itemArray[idx].name);
               this.axObj.RecordEvent("GoToItem", pset);
            }
            oElem.style.textDecorationUnderline = true;
            break;
         }
         case "mouseover":
            oElem.style.textDecorationUnderline = true;
            break;
         case "mouseout":
            oElem.style.textDecorationUnderline = false;
            break;
      }
   }

   return this.DoHandleEvent(this, idx, evt);
}

function JSSToolbar_IsUIReady ()
{
   return this.htmlElem != null && typeof(this.htmlElem.document) != "unknown" && this.htmlElem.document.readyState != "uninitialized";
}

function JSSToolbar_PrepareToDraw (e, isLink)
{
   var bgCol;
   var p;

   if (e.document.styleSheets.length == 0 || e.document.styleSheets[0].title != "_TB_css")
   {
      var ss = e.document.createStyleSheet("", 0);
      ss.title = "_TB_css";
      ss.addRule(".TBdivider",   "border:1px solid #ffffff;border-color:#ffffff #666666 #666666 #ffffff;width:3px;height:19px");
      if (!isLink)
      {
         ss.addRule(".TBpush",      "border:1px solid;color:#000000;border-color:#666666 #ffffff #ffffff #666666;background:transparent");
         ss.addRule(".TBpop",       "border:1px solid;background:#99AED9;color:#ffffff;border-color:#ffffff #000000 #000000 #ffffff");
      }
   }

   for (p = e; p != null; p = p.parentElement)
   {
      bgCol = p.currentStyle.backgroundColor;
      if (bgCol != "transparent")
         break;
   }
   if (!isLink)
      e.document.styleSheets[0].addRule(".TBflat"+this.index,      "color:#000000;border:1px solid " + bgCol);
   else
      e.document.styleSheets[0].addRule(".TBLink"+this.index,      "color:#004784;padding:3px");
}

function JSSToolbar_Update (bInit)
{
   if (bInit != true && !this.IsUIReady())
      return;

   return this.DoUpdate (this);
}

function JSSToolbar_DoGenerateItemHtml(toolbar, idx)
{
   var html;
   var item = toolbar.itemArray[idx];
   switch (item.type)
   {
      case "UtilityLink":
      case "Button":
      case "Link":
         // bitmap or caption:
         if (item.bitmap != null)
            html = "<img id=\"" + item.inEId + "\"" +
                   " src=\"" + ((item.enabled != true && item.offBitmap != null)? item.offBitmap : item.bitmap) +
                   "\" align=\"absmiddle\" ALT=\"" + item.caption + "\">";
         else
            html = "<span id=\"" + item.inEId + "\">" + item.caption + "</span>";
         break;

      case "Label":
         html = "<span id=\"" + item.inEId + "\">" + item.caption + "</span>";
         break;

      case "Separator":
         html = "&nbsp;<span class=\"TBdivider divider\"></span>&nbsp;";
         break;

      default :
         html = "&nbsp;";
         break;
   }

   return html;
}

function JSSToolbar_DoGetItemStyle (toolbar, idx)
{
   var item = toolbar.itemArray[idx];
   switch (item.type)
   {
      case "UtilityLink":
         return "UtilityLink";   // rollover underline, mouseover effect
         
      case "Button":
      case "Link":
      default:
         return "rollover";   // rollover border, mouseover effect

      case "Separator":
      case "Edit":
      case "Combo Box":
      case "Label":
         return "";
   }
}

function JSSToolbar_DoHandleEvent (toolbar, idx, evt, psItem)
{
   var rVal    = false;
   var item    = toolbar.itemArray[idx];

   switch (evt.type)
   { 
      case "click":
         if (typeof (psItem) != "undefined")
         {
            var command = psItem.GetProperty("Command");
            var enabled = psItem.GetProperty("Enabled");
            if (command != "" && enabled)
            {
               rVal = App().GetCommandMgr().InvokeUtilityLinkCommand (App(), command);
            }
         }
         else if (item.type == "UtilityLink" && (item.menu != null && item.menu != ""))
         {
            JSSToolbar_ShowMenu (toolbar, idx, this.isRTL);
            rVal = true;
         }
         else if (item.cmdId != null && item.cmdId != "")
         {
            rVal = App().GetCommandMgr().InvokeCommand (item.cmdId);
         }
         break;
      
   }
   return rVal;
}

function JSSToolbar_DoUpdate (toolbar)
{
   var enabledNew;
   var item;

   for (var i = 0; i<toolbar.itemArray.length; i++)
   {
	  if ( toolbar.name == "XMLP Reports")
       {
			if (toolbar.IsUIReady()) 
				toolbar.DoUpdateItemUI(toolbar, i);
	   }
      if (toolbar.DoUpdateItemState(toolbar, i) == false)
         continue;

      if (toolbar.IsUIReady())
         toolbar.DoUpdateItemUI(toolbar, i);
   }
}

function JSSToolbar_DoUpdateItemState (toolbar, idx)
{
   var bUpdated   = false;
   var enabledNew;
   var sProp;
   var item       = toolbar.itemArray[idx];

   if (item.cmdId == null)
      return bUpdated;

   var s_cmdmgr = App().GetCommandMgr();
   // canInvoke state:
   enabledNew = s_cmdmgr.CanInvokeCommand(item.cmdId);
   if (enabledNew != item.enabled)
   {
      bUpdated = true;
      item.enabled = enabledNew;
   }

   // extended state:
   sProp  = s_cmdmgr.GetCommandState(item.cmdId);
   if (sProp != null && typeof (sProp) == "object")
   {
      var temp = (sProp.GetProperty("Checked") == "true") ? true : false;
      if (temp != item.checked)
      {
         item.checked = temp;
         bUpdated = true;
      }
   }

   return bUpdated;
}

function JSSToolbar_DoUpdateItemUI (toolbar, idx)
{
   var item = toolbar.itemArray[idx];
   var completedRptCount = 0;
   
   switch (item.type)
   {
      case "UtilityLink":
         toolbar.GetHtmlElem(item.outEId).disabled = !item.enabled;
         break;
      case "Button":
      case "Link":
      
		          // link state:
         if (item.checked == true)
            toolbar.GetHtmlElem(item.outEId).className = "TBpush";
         else if (item.checked == false)
            toolbar.GetHtmlElem(item.outEId).className = "TBflat"+this.index;

         // disable/enable state:
         if (item.offBitmap != null)
            toolbar.GetHtmlElem(item.inEId).src = (item.enabled == true) ? item.bitmap : item.offBitmap;

         break;
     case "Label":
         //for UI notification toolbar update info
         if(item.name == "Reports")
         {
            var inputProps = App().NewPropertySet ();         
            var outputProps = App().NewPropertySet ();  
            var notificationLabel = item.caption;
            if ( notificationLabel == "")
            {
                notificationLabel = "Report(s)";	
            }
            var service = App().GetService ("Report Menu Handler (SWE)");
            //var service = top._swe._sweapp.S_App.GetService ("XMLP Report Menu Service");
            inputProps.SetProperty("SWEDIC", "Y");
            //Report Notification issue Bug# 21176624.
            inputProps.SetProperty("SWEBS", "1"); 
            outputProps = service.InvokeMethod ("GetUINotificationReportCount", inputProps );
            if ( outputProps == null)
                break;
            var pResultSet = outputProps.GetChildByType("ResultSet");
            if ( pResultSet == null)
                break;
            var nChildCount = pResultSet.GetChildCount ();
            if( nChildCount != 0 )
            {
                var pUINotifyChildPropSet = pResultSet.GetChildByType("UINotification");
                
                if (pUINotifyChildPropSet != null)
                {
                    completedRptCount = pUINotifyChildPropSet.GetProperty("UINotificationRptCount");
                }
            }
            if ( completedRptCount > 0 )
            {
                toolbar.GetHtmlElem(item.inEId).innerText = completedRptCount +" "+notificationLabel; 
            }
            else
            {	
                toolbar.GetHtmlElem(item.inEId).innerText = "";
            }
            
            toolbar.GetHtmlElem(item.inEId).style.cursor = "auto";
            toolbar.GetHtmlElem(item.outEId).onmousedown = "null";
            toolbar.GetHtmlElem(item.outEId).onmouseout = "null";
            toolbar.GetHtmlElem(item.outEId).onmouseup = "null";
            toolbar.GetHtmlElem(item.outEId).onclick = "null";	
            if ( completedRptCount == 0 )
            {
                toolbar.GetHtmlElem(item.inEId).style.display = "none";
                toolbar.GetHtmlElem(item.outEId).onmouseover = _TB_evt(this.index, idx);	        
            }
            else
            {
                toolbar.GetHtmlElem(item.inEId).style.display = "";
                toolbar.GetHtmlElem(item.outEId).onmouseover = _TB_evt(this.index, idx);
                toolbar.GetHtmlElem(item.outEId).onmousemove = _TB_evt(this.index, idx);
            }
            
         }
         break;         

      default :
         break;
   }
}

function JSSToolbar_ShowMenu (toolbar, idx, isRTL)
{
   // If the menu object is not yet created, create it.
   if (top._swe._sweapp._JMenuObj == null)
      top._swe._sweapp._JMenuObj = new top._swe._sweapp.JMenu ();
      
   var item = toolbar.itemArray[idx];
   var menu = toolbar.name + "::" + item.menu;
   if (item.cmdId != null && item.cmdId != "")
   {
      menu += "::" + item.cmdId;
   }
   
   var srcElement = toolbar.GetHtmlElem(item.outEId)
   var x = (isRTL) ? srcElement.offsetWidth : 0;
   var y = srcElement.offsetHeight;
   
   _JMenu_Initialize (srcElement, menu, "UtilityLink", toolbar.axObj, toolbar.isRTL, false, x, y);
}

function JSSToolbar_LoadMenu (toolbar, idx, isRTL)
{
   // If the menu object is not yet created, create it.
   if (top._swe._sweapp._JMenuObj == null)
      top._swe._sweapp._JMenuObj = new top._swe._sweapp.JMenu ();
      
   var item = toolbar.itemArray[idx];
   var menu = toolbar.name + "::" + item.menu;
   if (item.cmdId != null && item.cmdId != "")
   {
      menu += "::" + item.cmdId;
   }
   
   var srcElement = toolbar.GetHtmlElem(item.outEId)
   var x = (isRTL) ? srcElement.offsetWidth : 0;
   var y = srcElement.offsetHeight;
   
   _JMenu_Initialize (srcElement, menu, "UtilityLink", toolbar.axObj, toolbar.isRTL, false, 0, 0, false, false, true);
}

function JSSToolbar_FindMenuItem (psMenu, menuitemCmd)
{
   var i = 0;

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
         sCmdStr = psMenuItem.GetProperty ("Command");
         if (sCmdStr == menuitemCmd)
            return (psMenuItem);
      }
   }
   return null;
}

new JSSToolbar ();
JSSToolbar.prototype  = new JSSObjectBase ();

// Methods are not to be overridden
JSSToolbar.prototype.AddItem                    = JSSToolbar_AddItem;
JSSToolbar.prototype.AddLinkItem                = JSSToolbar_AddLinkItem;
JSSToolbar.prototype.Draw                       = JSSToolbar_Draw;
JSSToolbar.prototype.GetHtmlElem                = JSSToolbar_GetHtmlElem;
JSSToolbar.prototype.GetItemStyle               = JSSToolbar_GetItemStyle;
JSSToolbar.prototype.HandleEvent                = JSSToolbar_HandleEvent;
JSSToolbar.prototype.IsUIReady                  = JSSToolbar_IsUIReady;
JSSToolbar.prototype.PrepareToDraw              = JSSToolbar_PrepareToDraw;
JSSToolbar.prototype.Update                     = JSSToolbar_Update;
JSSToolbar.prototype.ShowMenu                   = JSSToolbar_ShowMenu;
JSSToolbar.prototype.LoadMenu                   = JSSToolbar_LoadMenu;
JSSToolbar.prototype.FindMenuItem               = JSSToolbar_FindMenuItem;

// Methods can be overriden by derived classes
JSSToolbar.prototype.DoGenerateItemHtml         = JSSToolbar_DoGenerateItemHtml;
JSSToolbar.prototype.DoGetItemStyle             = JSSToolbar_DoGetItemStyle;
JSSToolbar.prototype.DoHandleEvent              = JSSToolbar_DoHandleEvent;
JSSToolbar.prototype.DoUpdate                   = JSSToolbar_DoUpdate;
JSSToolbar.prototype.DoUpdateItemState          = JSSToolbar_DoUpdateItemState;
JSSToolbar.prototype.DoUpdateItemUI             = JSSToolbar_DoUpdateItemUI;
JSSToolbar.prototype.GetToolbarItemNames        = JSSToolbar_GetToolbarItemNames;
JSSToolbar.prototype.SetName                    = JSSToolbar_SetName;
JSSToolbar.prototype.SetIndex                   = JSSToolbar_SetIndex;
JSSToolbar.prototype.BindAXObj                  = JSSToolbar_BindAXObj;
JSSToolbar.prototype.GoToItem                   = JSSToolbar_GoToItem;

/*------------------------------*/
function JSSToolbarItem ()
{
  this.index   = -1;
  this.name    = "";
  this.type    = "";
}

/*----------- utils: -----------*/
function _TB_evt (idx1, idx2)
{
   return "Top()._swescript.SWEHandleTBEvent(" +idx1+ "," +idx2+ ",event)";
}

/*
 * JSSJavaToolbar
 * proxy class for Java Toolbar Applet
 *
 * name
 * itemEnum
 * items
 * application
 */
function JSSJavaToolbar ()
{
	this.ToolbarApplet = null;
}


function JSSJavaToolbar_GetToolbarApplet()
{
   var len = Top()._sweclient.frames.length;
   for(var i = 0; i < len; i++)
   {
      this.ToolbarApplet = Top()._sweclient.frames[i].document.getElementById(this.name);
      if(this.ToolbarApplet != null)
         return;
   }
}

function JSSJavaToolbar_GoToItem (item)
{
    if(this.ToolbarApplet == null)
    {
        this.GetToolbarApplet();
        if(this.ToolbarApplet == null)
            return "Toolbar not found!";
    }

	var propSet = App().NewPropertySet();
    var encodedProp = propSet.EncodeAsString(); 
    return this.ToolbarApplet.handleAutomationRequest(item, encodedProp);
}

function JSSJavaToolbar_IsUIReady ()
{
   return true;
}

JSSJavaToolbar.prototype = new JSSToolbar ();

//Exposed Methods
JSSJavaToolbar.prototype.GoToItem                 =  JSSJavaToolbar_GoToItem;
JSSJavaToolbar.prototype.IsUIReady                =  JSSJavaToolbar_IsUIReady;
JSSJavaToolbar.prototype.GetToolbarApplet         =  JSSJavaToolbar_GetToolbarApplet;

/*
 * JSSJavaToolbar
 * proxy class for Java Toolbar Applet
 *
 * name
 * itemEnum
 * items
 * application
 */
function JSSJavaToolbar ()
{
   this.GetToolbarApplet();
   var itemName;
   if(this.ToolbarApplet != null)
   {
      for(itemName = this.ToolbarApplet.enumItems(true); itemName != null && itemName != ""; itemName = this.ToolbarApplet.enumItems(false))
      {
		 this.AddItem(itemName, "button");
      }
   }
}


function JSSJavaToolbar_GetToolbarApplet()
{
   var len = Top()._sweclient.frames.length;
   for(var i = 0; i < len; i++)
   {
      this.ToolbarApplet = Top()._sweclient.frames[i].document.getElementById("Communication");
      if(this.ToolbarApplet != null)
         return;
   }

//	this.ToolbarApplet = this.getElementById(this.name);
}

function JSSJavaToolbar_GoToItem (item)
{
    if(this.ToolbarApplet == null)
    {
        this.GetToolbarApplet();
        if(this.ToolbarApplet == null)
            return "Toolbar not found!";
    }

	var propSet = App().NewPropertySet();
    var encodedProp = propSet.EncodeAsString(); 
    return this.ToolbarApplet.handleAutomationRequest(item, encodedProp);
}

function JSSJavaToolbar_IsUIReady ()
{
   return true;
}

function JSSJavaToolbar_InvokeMethod (method, inputArgs)
{
   if(method == "Set Number")
   {
      var phNum = inputArgs.GetProperty("PhNumber");
      if(phNum != null)
      {
         var encodedProp = inputArgs.EncodeAsString(); 
         return this.ToolbarApplet.handleAutomationRequest(method, encodedProp);
      }
   }
   else if(method == "Select Item")
   {
      var item = inputArgs.GetProperty("item");
      var pos = inputArgs.GetProperty("Pos");
      if(item != null && pos != null)
      {
         var encodedProp = inputArgs.EncodeAsString(); 
         return this.ToolbarApplet.handleAutomationRequest(method, encodedProp);      
      }
   }
}

JSSJavaToolbar.prototype = new JSSToolbar ();

//Exposed Methods
JSSJavaToolbar.prototype.GoToItem                 =  JSSJavaToolbar_GoToItem;
JSSJavaToolbar.prototype.IsUIReady                =  JSSJavaToolbar_IsUIReady;
JSSJavaToolbar.prototype.GetToolbarApplet         =  JSSJavaToolbar_GetToolbarApplet;
JSSJavaToolbar.prototype.InvokeMethod             =  JSSJavaToolbar_InvokeMethod;


/*****************************************************************************
 *
 * Copyright (C) 2000, Siebel Systems, Inc., All rights reserved.
 *
 * FILE:       serviceshadow.js
 *  $Revision: 21 $
 *      $Date: 10/09/01 6:13p $
 *    $Author: Clu $ of last update
 *
 * CREATOR:    Michael Flexer
 *
 * DESCRIPTION
 *    Service shadow object for JavaScript browser tier
 *
 *****************************************************************************/

/*
 * JSSServiceShadow
 *
 * _service
 */

function JSSServiceShadow_InvokeMethod (name, inputPropSet)
{
   var retVal;
   var childSet;
   
   retVal = this._service.InvokeMethod (name, inputPropSet);   

   var childCount = retVal.GetChildCount();
   childSet = null;
   for (var i=0; i<childCount; i++)
   {
      if (retVal.GetChild(i).GetType() == "ResultSet")
      {
         childSet = retVal.GetChild(i);
         break;
      }
   }

   return ((childSet != null) ? childSet : retVal);
}

function JSSServiceShadow_Name ()
{
   return this._service.GetName ();
}

function JSSServiceShadow ()
{
   this.SeblCOMObjHnd   = 0;
}

function JSSServiceShadow_SetProperty (name, value)
{
   return this._service.SetProperty (name, value);
}

function JSSServiceShadow_PropertyExists (name)
{
   return this._service.PropertyExists (name);
}

function JSSServiceShadow_RemoveProperty (name)
{
   return this._service.RemoveProperty (name);
}

function JSSServiceShadow_GetProperty (name)
{
   return this._service.GetProperty (name);
}

function JSSServiceShadow_GetFirstProperty ()
{
   return this._service.GetFirstProperty ();
}

function JSSServiceShadow_GetNextProperty ()
{
   return this._service.GetNextProperty ();
}

new JSSServiceShadow ();
JSSServiceShadow.prototype = new JSSObjectBase ();

JSSServiceShadow.prototype.InvokeMethod            = JSSServiceShadow_InvokeMethod;
JSSServiceShadow.prototype.Name                    = JSSServiceShadow_Name;
JSSServiceShadow.prototype.SetProperty             = JSSServiceShadow_SetProperty;
JSSServiceShadow.prototype.PropertyExists          = JSSServiceShadow_PropertyExists;
JSSServiceShadow.prototype.RemoveProperty          = JSSServiceShadow_RemoveProperty;
JSSServiceShadow.prototype.GetProperty             = JSSServiceShadow_GetProperty;
JSSServiceShadow.prototype.GetFirstProperty        = JSSServiceShadow_GetFirstProperty;
JSSServiceShadow.prototype.GetNextProperty         = JSSServiceShadow_GetNextProperty;
/****************************************************************
 * Copyright (C) 2000, Siebel Systems, Inc., All rights reserved.
 *  FILE:      alarm.js
 *  $Revision:   0 $
 *  $Date:      02/12/02 2:00pm $
 *  $Author:   ibeliaus $ of last update
 *  CREATOR:    ibeliaus
 *  DESCRIPTION: Alarm Manager 
 *****************************************************************/
var nCurrentItem              = -1;
var alarmGlobalArray          = new Array();
var balarmFired               = false;
var bInitialize               = true;
var strSnoozeTimes            = "";
var defUserSnoozeTime         = 5; 
var PropSetIndx               = 0;
var defaultSnooze             = 5;
var nOptionCount              = 0;
var JSSAlarmMgr_Locale        = null;
var JSSAlarmMgr_dateFormat    = "";
var JSSAlarmMgr_timeFormat    = "";
var JSSAlarmMgr_formatDateIn  = "MM/DD/YYYY";
var JSSAlarmMgr_formatTimeIn  = "HH:mm";
var dAlarmOpenWimdow          = null;
var bmoveAlarmWindow          = false;
var bUIStringsLoaded          = false;
var bIsRTL                    = false;
var startTitle, startLable, endLable, snoozeForLable, snoozeLable, snoozeAllLable;
var dismissLable, dismissAllLable, prevLable, nextLable, closeLable, minutesLable;
var typeLabel, despLabel;

function sortDate(a,b)
{
   if (a.date.valueOf() > b.date.valueOf())
      return 1;
   else if (a.date.valueOf() < b.date.valueOf())
      return -1;
   else
      return 0;
}

function sortTime(a,b)
{
   if (Number(a) > Number(b))
      return 1;
   else if (Number(a) < Number(b))
      return -1;
   else
      return 0;
}

function JSSAlarmMgr_CreateArrayObjects(date, time, desc, id, endDate, endTime, apptType, apptRepAct, leadTime, defSnoozeTime)
{
   var p             = new Object();
   var apptDate      = new String(date);
   var apptTime      = new String(time);
   var apptEndDate   = new String(endDate);
   var apptEndTime   = new String(endTime);
   var description   = new String(desc);
   var apptId        = new String(id);
   var apptType      = new String(apptType);
   var apptRepAct    = new String(apptRepAct);
   var actualDate    = new Date(apptDate.slice(6), (apptDate.slice(0,2) - 1), apptDate.slice(3,5), apptTime.slice(0,2), apptTime.slice(3,5), apptTime.slice(6));
   var enddate       = new Date(apptEndDate.slice(6), (apptEndDate.slice(0,2) - 1), apptEndDate.slice(3,5), apptEndTime.slice(0,2), apptEndTime.slice(3,5), apptEndTime.slice(6));

   p.actualDate = (1 + actualDate.getMonth()) + "/" + actualDate.getDate() + "/" + actualDate.getFullYear();
   p.actualTime =  actualDate.getHours() + ":" + actualDate.getMinutes();
   p.endDate    = (1 + enddate.getMonth()) + "/" + enddate.getDate() + "/" + enddate.getFullYear();
   p.endTime    = enddate.getHours() + ":" + enddate.getMinutes();
   
   p.date = new Date(apptDate.slice(6), (apptDate.slice(0,2) - 1), apptDate.slice(3,5), apptTime.slice(0,2), apptTime.slice(3,5), apptTime.slice(6));
   p.apptDate = new Date(p.date);
   p.date.setTime (p.date.getTime() - (leadTime * 60 * 1000));
   p.lead = leadTime;

   p.description   = description;
   p.apptId        = apptId;
   p.apptType      = apptType;
   p.apptRepAct    = apptRepAct;
   p.SnoozeTimeVal = defSnoozeTime;
   
   return (p);
}

function JSSAlarmMgr_GetAppointments()
{
   var now              = new Date();
   var inputArgs        = App ().NewPropertySet();
   var returnPropSet    = App ().NewPropertySet();
   var resultSetPropSet = App ().NewPropertySet();
   var testInterval     = new String((this.pollInterval / 60 / 1000) + (60 * 24));
   var tempArray;

   //UParthas: For FR 12-15TTHPA *** ROLLED BACK FOR BUG 17353651 ****
   //alarmArray has the list of alarms that are pending to be fired. If one of the
   //alarms from this list is deleted, it is not deleted from the array. In order to 
   //overcome this caching, set the length to be zero. This might result in a slight
   //deterioration of performance, if there are many appointments in a day and all of them
   //have their alarms set.

//   this.alarmArray.length = 0;
   var tempMinutes      = now.getMinutes();
   
   tempMinutes = (tempMinutes <10) ? "0" + tempMinutes : tempMinutes;
   
   inputArgs.SetProperty ("alarmDate", (1 + now.getMonth()) + "/" + now.getDate() + "/" + now.getFullYear());
   inputArgs.SetProperty ("now", now.getHours() + ":" + tempMinutes + ":" + now.getSeconds());
   inputArgs.SetProperty ("interval", testInterval);
   inputArgs.SetProperty ("SWEJI", "false");
   if (!bUIStringsLoaded)
      inputArgs.SetProperty ("packUIStrings", "true");

   returnPropSet = this.alarmService.InvokeMethod ("GetAlarms", inputArgs);

   if (returnPropSet != null)
   { 
      resultSetPropSet = returnPropSet.GetChildByType ("ResultSet");
      
      if (resultSetPropSet != null )
      {
         if (!bUIStringsLoaded) 
         {
            if (resultSetPropSet.GetProperty("strSnoozeTimes") != null) 
               strSnoozeTimes = resultSetPropSet.GetProperty("strSnoozeTimes");
          
            startTitle        = resultSetPropSet.GetProperty("Title");
            startLable        = resultSetPropSet.GetProperty("Start Time Label");
            endLable          = resultSetPropSet.GetProperty("End Time Label");
            snoozeForLable    = resultSetPropSet.GetProperty("Snooze For Label");
            snoozeLable       = resultSetPropSet.GetProperty("Snooze Button");
            snoozeAllLable    = resultSetPropSet.GetProperty("Snooze All Button");
            dismissLable      = resultSetPropSet.GetProperty("Dismiss Button");
            dismissAllLable   = resultSetPropSet.GetProperty("Dismiss All Button");
            prevLable         = resultSetPropSet.GetProperty("Previous Button");
            nextLable         = resultSetPropSet.GetProperty("Next Button");
            closeLable        = resultSetPropSet.GetProperty("Close Button");
            minutesLable      = resultSetPropSet.GetProperty("Minutes Label");
            typeLable         = resultSetPropSet.GetProperty("Type Label");
            despLable         = resultSetPropSet.GetProperty("Description Label");
            PropSetIndx       = 15;
            
            if (typeLable != null && typeLable != "")
               bUIStringsLoaded = true;
         }  
         var nArrayLen = this.alarmArray.length;
         var tmpAlarmArray = this.alarmArray.slice(0);
         this.alarmArray.splice(0,nArrayLen);
           
         var nPropertyCount = resultSetPropSet.GetPropertyCount();
         for (var i = 0; i * 11 < nPropertyCount - PropSetIndx; i++)
         {
            if (resultSetPropSet.GetProperty("apptDate" + i) == null)
               continue;
            var apptDate    = resultSetPropSet.GetProperty("apptDate" + i);
            var apptTime    = resultSetPropSet.GetProperty("apptTime" + i);
            var description = resultSetPropSet.GetProperty("apptDesc" + i);
            var apptId      = resultSetPropSet.GetProperty("apptId"   + i);
            var apptType    = resultSetPropSet.GetProperty("apptType" + i);
            var apptEndDate = resultSetPropSet.GetProperty("apptEndDate" + i);
            var apptEndTime = resultSetPropSet.GetProperty("apptEndTime" + i);
            var apptRepAct  = resultSetPropSet.GetProperty("repAct" + i);
            var AlarmLead   = resultSetPropSet.GetProperty("reminder" + i);
            var defSnoozeTime  = resultSetPropSet.GetProperty("defSnoozeTime" + i);
                     
            tempArray = this.CreateArrayObjects (apptDate, apptTime, description, apptId, apptEndDate, apptEndTime, apptType, apptRepAct, AlarmLead, defSnoozeTime);
            this.alarmArray[i] = tempArray;

            //UParthas: For FR 12-15TTHPA  *** ROLLED BACK FOR BUG 17353651 ****
            //Commented the block of code below. This block is redundant since at the very
            //beginning of this method, we are setting the array length to Zero. Not setting
            //the length to zero was causing caching of the alarms pending list. 
            for (var j = 0; j < nArrayLen; j++)
            {
               // BUG 17353651 detect alarm changes and keep snoozed alarm
               if ((tempArray.apptId.indexOf(tmpAlarmArray[j].apptId) != -1) && 
                   (tempArray.apptDate.getTime() === tmpAlarmArray[j].apptDate.getTime()) && 
                   (tempArray.lead == tmpAlarmArray[j].lead) && 
                   (tempArray.date.getTime() < tmpAlarmArray[j].date.getTime()))
               {   
                  this.alarmArray[i].SnoozeTimeVal = tmpAlarmArray[j].SnoozeTimeVal;
                  this.alarmArray[i].date = tmpAlarmArray[j].date;
                  break;
               }
            }
         }
         if (this.alarmArray.length > 1)
            this.alarmArray.sort(sortDate);
      }
      PropSetIndx = 0;
   } 
}

function JSSAlarmMgr()
{   
}

function JSSAlarmMgr_Init(isRTL, interval, reminderTime, acceptMsg, schedMsg, nowMsg)
{
   bIsRTL = isRTL;
   this.pollInterval    = interval * 60 * 1000;
   this.reminderTime    = reminderTime * 60 * 1000;
   this.nextPoll        = new Date();
   this.alarmArray      = new Array();
   this.initRetries     = 0;
   this.notifyGeneric   = 0;
   this.alarmService    = App().GetService ("Alarm Manager");   
}

function JSSAlarmMgr_NotifyGeneric (args)
{
   var now = new Date();
   this.notifyGeneric = 1;
   this.GetAppointments ();
   this.SettimeToSleep ();
}

function JSSAlarmMgr_Poll ()
{ 
   var firstElement;
   var now = new Date();

   // BUG 17353651 always reload alarms when poll
   if ((this.nextPoll <= now) && (this.notifyGeneric == 0))
   {
      //Make sure RPC is ready
      try {
         this.GetAppointments();
         this.notifyGeneric = 1;
      }
      catch (e) {
         this.initRetries++;
         if (this.initRetries <= 3)
         {
            //try again five seconds later if RPC was not ready
            this.timeoutId = setTimeout ("S_AlarmMgr.Poll()", 5000);
            return;
         } 
         else
         {
            //maximum attempts reached, wait for a longer time
            this.nextPoll.setTime (now.getTime() + this.pollInterval);
            this.timeoutId = setTimeout ("S_AlarmMgr.Poll()", this.pollInterval);
            this.initRetries = 0;
            return;
         }
      }
   }
   else 
   {
      this.notifyGeneric = 0;
      if (this.alarmArray.length != 0)
      { 
         // BUG 17353651 add to alarm array when due
         balarmFired = true;
         while (this.alarmArray[0] != null && this.alarmArray[0].date.getTime() <= now.getTime())
         {
		    firstElement = this.alarmArray[0];
            JSSAlarmMgr_SetAlarmArray (firstElement);
            this.alarmArray = this.alarmArray.slice(1);
         }
         if (!balarmFired)
            JSSAlarmMgr_OpenAlarmWindow();
      }
	  this.nextPoll.setTime (now.getTime() + this.pollInterval);
   }
   this.SettimeToSleep ();
}

function JSSAlarmMgr_SettimeToSleep()
{
   var firstElement;
   var timeToSleep = 0;
   var now         = new Date();


   
   clearTimeout(this.timeoutId);

   firstElement = this.alarmArray[0];
   // BUG 17353651 poll at next interval or appointment whenever is sooner
   timeToSleep = this.nextPoll.getTime() - now.getTime();    

   if (firstElement != null)
   {
      if (timeToSleep > firstElement.date.getTime() - now.getTime())
		 timeToSleep = firstElement.date.getTime() - now.getTime();
   } 
   if (timeToSleep <= 0)
	  timeToSleep = 0;
   else
      JSSAlarmMgr_moveAlarmWindow();

   this.timeoutId = setTimeout ("S_AlarmMgr.Poll()", timeToSleep);

}

function JSSAlarmMgr_SetApplication (app)
{
   this.application = app;
}

function JSSAlarmMgr_FocusAlarm()
{
   if (top.SWEPopupWinAlarm.closed != true)
      top.SWEPopupWinAlarm.focus();
} 

function JSSAlarmMgr_SetAlarmArray (newElement)
{
   var nGlobArrLen = alarmGlobalArray.length;
      
   if (nGlobArrLen != 0) 
   {
      // BUG 17353651 Detect alarm changed and update array
      for (var i = 0; i < nGlobArrLen; i++) 
      {
         if (newElement.apptId.valueOf() == alarmGlobalArray[i].apptId.valueOf())
         {
		 	 if ((newElement.apptDate.getTime() === alarmGlobalArray[i].apptDate.getTime()) && 
                 (newElement.lead === alarmGlobalArray[i].lead) && 
                 (newElement.date.getTime() <= alarmGlobalArray[i].date.getTime()))
	         {
				balarmFired = balarmFired && true;
			 }
			 else
			 {
			    alarmGlobalArray[i] = newElement;
			    balarmFired = false;
			    nCurrentItem = i;
			 }
             return;
	      }
      }
   
      if (i == nGlobArrLen) 
      {
         alarmGlobalArray[nGlobArrLen] = newElement; 
         balarmFired = false;
         nCurrentItem++;
      }  
   }
   else 
   {
      alarmGlobalArray[0] = newElement;
      balarmFired = false;
      nCurrentItem = 0;
   }   
}

function JSSAlarmMgr_OpenAlarmWindow()
{
   var sAlarmBody, oAlarmDocument, body, deltaX, deltaY;
   
   if (!bUIStringsLoaded)
      return;
      
   if (top.SWEPopupWinAlarm == null)
   { 
      // Fix for 12-COWGQ7: Do not put the name of the new window created for alarm since if you open 2
      // applications it wil update the same window.
      top.SWEPopupWinAlarm = window.open('', '', 'toolbar=no,status=no,width=10,height=10,top=10250,left=250');
      sAlarmBody = S_AlarmMgr.BuildAlarmBody(); 
      oAlarmDocument = top.SWEPopupWinAlarm.document;
      oAlarmDocument.write(sAlarmBody);
      body = oAlarmDocument.body;
      deltaX  = body.scrollWidth - body.offsetWidth;
      deltaY  = body.scrollHeight - body.offsetHeight;
      top.SWEPopupWinAlarm.resizeBy(deltaX, deltaY);
      
      JSSAlarmMgr_UpdateSnoozeSelect();
      JSSAlarmMgr_UpdateAlarmWindow();
      dAlarmOpenWimdow = new Date();
   }
   else 
   {
      if (Date.parse(dAlarmOpenWimdow) < Date.parse(alarmGlobalArray[nCurrentItem].date))
         top.SWEPopupWinAlarm.document.write("<bgsound id=oBGSound src='files/ringin.au' volume=0>");
   
      JSSAlarmMgr_UpdateAlarmWindow();
   }
}

function JSSAlarmMgr_moveAlarmWindow()
{
   if (top.SWEPopupWinAlarm != null && !bmoveAlarmWindow)
   {
      bmoveAlarmWindow = true;
      top.SWEPopupWinAlarm.moveBy(0, -10000);
      top.SWEPopupWinAlarm.document.write("<bgsound id=oBGSound src='files/ringin.au' volume=0>");
   }
}

function JSSAlarmMgr_UpdateSnoozeSelect()
{
   var oSelect = top.SWEPopupWinAlarm.document.getElementById("SnoozeTime");
   var aSnoozeTimes = strSnoozeTimes.split("|");
   
   nOptionCount =  aSnoozeTimes.length;   
   aSnoozeTimes.sort(sortTime)
      
   for (var index=0; index < nOptionCount; index++)
   {
      var oOption = top.SWEPopupWinAlarm.document.createElement("OPTION");
      oOption.text = aSnoozeTimes[index] + " " + minutesLable;
      oOption.value = aSnoozeTimes[index];
      oSelect.add(oOption);
   }
}

function SelectSnoozeIndex (snoozeVal)
{
   var oSnoozeSelect = top.SWEPopupWinAlarm.document.getElementById("SnoozeTime");
   
   for (var index=0; index < nOptionCount; index++)
   {
      if (oSnoozeSelect.options[index].value == snoozeVal)
      {   
         oSnoozeSelect.options[index].selected = true;
         return;
      }
   }
}

function JSSAlarmMgr_UpdateAlarmWindow()
{
   var nglobArraylen = alarmGlobalArray.length;
      
   if (nglobArraylen == 0)
   {
      top.SWEPopupWinAlarm.close();
      return;   
   }
   
   if (nCurrentItem >= 0)
   {
      var TargetWindowDocument = top.SWEPopupWinAlarm.document;
      var displayStartDate, displayStartTime, displayEndDate, displayEndTime;
      
      if ( JSSAlarmMgr_Locale == null)
         JSSAlarmMgr_Locale = App().GetLocale ();
      if ( JSSAlarmMgr_dateFormat == "")
         JSSAlarmMgr_dateFormat   = JSSAlarmMgr_Locale.GetProfile (JSSConsts.LOCAL_LONG_DATE_FORMAT);
      if ( JSSAlarmMgr_timeFormat == "")
         JSSAlarmMgr_timeFormat   = JSSAlarmMgr_Locale.GetProfile (JSSConsts.LOCAL_TIME_NOSEC_FORMAT);

      displayStartDate = JSSAlarmMgr_Locale.GetStringFromDateTime(alarmGlobalArray[nCurrentItem].actualDate,  JSSAlarmMgr_formatDateIn, JSSAlarmMgr_dateFormat);
      displayStartTime = JSSAlarmMgr_Locale.GetStringFromDateTime(alarmGlobalArray[nCurrentItem].actualTime,  JSSAlarmMgr_formatTimeIn, JSSAlarmMgr_timeFormat);
      displayEndDate   = JSSAlarmMgr_Locale.GetStringFromDateTime(alarmGlobalArray[nCurrentItem].endDate,  JSSAlarmMgr_formatDateIn, JSSAlarmMgr_dateFormat);
      displayEndTime   = JSSAlarmMgr_Locale.GetStringFromDateTime(alarmGlobalArray[nCurrentItem].endTime,  JSSAlarmMgr_formatTimeIn, JSSAlarmMgr_timeFormat);
            
      TargetWindowDocument.getElementById("IDtype").innerText = alarmGlobalArray[nCurrentItem].apptType;
      TargetWindowDocument.getElementById("IDdesc").innerText = alarmGlobalArray[nCurrentItem].description;
      TargetWindowDocument.getElementById("IDdesc").title = alarmGlobalArray[nCurrentItem].description;
      TargetWindowDocument.getElementById("IDStartTime").innerText = displayStartDate + " " + displayStartTime;
      TargetWindowDocument.getElementById("IDEndTime").innerText = displayEndDate + " " + displayEndTime;
      SelectSnoozeIndex(alarmGlobalArray[nCurrentItem].SnoozeTimeVal);
                    
      if (nglobArraylen == 1)
      {
         JSSAlarmMgr_DisableButton("btnSnoozeAll");
         JSSAlarmMgr_DisableButton("btnDismissAll");
         JSSAlarmMgr_DisableButton("btnPrev");
         JSSAlarmMgr_DisableButton("btnNext");
      }
      else 
      {
         JSSAlarmMgr_EnableButton("btnSnoozeAll");
         JSSAlarmMgr_EnableButton("btnDismissAll");

         if (nCurrentItem == 0)
         {
            JSSAlarmMgr_DisableButton("btnPrev");
            JSSAlarmMgr_EnableButton("btnNext");
         }
         else if ( nCurrentItem == nglobArraylen - 1) 
         {
            JSSAlarmMgr_DisableButton("btnNext");
            JSSAlarmMgr_EnableButton("btnPrev");
         }
         else 
         {
            JSSAlarmMgr_EnableButton("btnPrev");
            JSSAlarmMgr_EnableButton("btnNext");
         }
      }
      JSSAlarmMgr_FocusAlarm();   
   }
}

function JSSAlarmMgr_PrevAlarm()
{
   if (!top.SWEPopupWinAlarm.document.getElementById("btnPrev").disabled)
   {
      if (nCurrentItem != 0) 
      {
         nCurrentItem--;
         JSSAlarmMgr_UpdateAlarmWindow();
      }
   }  
}

function JSSAlarmMgr_NextAlarm()
{
   if (!top.SWEPopupWinAlarm.document.getElementById("btnNext").disabled)
   {
      if (nCurrentItem < alarmGlobalArray.length) 
      {
         nCurrentItem++;
         JSSAlarmMgr_UpdateAlarmWindow();
      }
   }
}

function JSSAlarmMgr_EnableButton(sBtnID)
{
   if (sBtnID == "btnNext" || sBtnID == "btnPrev" )
      top.SWEPopupWinAlarm.document.getElementById(sBtnID).disabled = false; 
   else
      top.SWEPopupWinAlarm.document.getElementById(sBtnID).style.visibility = "visible"; 
}

function JSSAlarmMgr_DisableButton(sBtnID)
{
   if (sBtnID == "btnNext" || sBtnID == "btnPrev" )
      top.SWEPopupWinAlarm.document.getElementById(sBtnID).disabled = true; 
   else
      top.SWEPopupWinAlarm.document.getElementById(sBtnID).style.visibility = "hidden"; 
}

function JSSAlarmMgr_SnoozeAlarm()
{
   var newElement;
   var now      = new Date();
   var oSelect = top.SWEPopupWinAlarm.document.getElementById("SnoozeTime");
   var nSnoozeTime = oSelect.options[oSelect.selectedIndex].value;
      
   alarmGlobalArray[nCurrentItem].date = new Date(now.getFullYear(), now.getMonth(), now.getDate()); 
   alarmGlobalArray[nCurrentItem].date.setTime(now.getTime() + (nSnoozeTime * 60 * 1000));
   newElement = alarmGlobalArray[nCurrentItem];
   
   alarmGlobalArray[nCurrentItem] = null;
   JSSAlarmMgr_RemoveFromGlobalArray();
   S_AlarmMgr.AddToAlarmArray(newElement);
   S_AlarmMgr.alarmArray.sort(sortDate);
   S_AlarmMgr.SettimeToSleep ();
   JSSAlarmMgr_UpdateAlarmWindow();
}

function JSSAlarmMgr_RemoveFromGlobalArray()
{   
   var j          = 0;
   var tempArray  = new Array();
   var nArrlen    = alarmGlobalArray.length;
   
   for (var i = 0; i < nArrlen; i++) 
   {
      if (alarmGlobalArray[i] != null) 
      {
         tempArray[j] = alarmGlobalArray[i];
         j++;
      }
   }
   alarmGlobalArray = tempArray;
   nCurrentItem = alarmGlobalArray.length - 1;
}

function JSSAlarmMgr_AddToAlarmArray (newElement)
{   
   var nArrlen = this.alarmArray.length;
   
   if (nArrlen != 0)
   {
      for (var i = 0; i < nArrlen; i++)
      {
         if (this.alarmArray[i].apptId.indexOf(newElement.apptId) != -1)
            this.alarmArray[i] = newElement; 
      }
     
      if (i == nArrlen)
         this.alarmArray[nArrlen] = newElement; 
   }
   else
     this.alarmArray[0] = newElement;
}

function JSSAlarmMgr_SnoozeAll()
{
   var newElement;
   var now         = new Date();
   var oSelect     = top.SWEPopupWinAlarm.document.getElementById("SnoozeTime");
   var nSnoozeTime = oSelect.options[oSelect.selectedIndex].value;

   if (nSnoozeTime <= 0)
      nSnoozeTime = defaultSnooze;

   while (alarmGlobalArray.length != 0) 
   {
      alarmGlobalArray[0].date = new Date(now.getFullYear(), now.getMonth(), now.getDate()); 
      alarmGlobalArray[0].date.setTime(now.getTime() + (nSnoozeTime * 60 * 1000));
      newElement = alarmGlobalArray[0];
      alarmGlobalArray[0] = null;
      JSSAlarmMgr_RemoveFromGlobalArray ();
      S_AlarmMgr.AddToAlarmArray (newElement);
   }
   
   top.SWEPopupWinAlarm.close ();
   S_AlarmMgr.alarmArray.sort (sortDate);
   S_AlarmMgr.SettimeToSleep ();
}

function JSSAlarmMgr_DismissAlarm()
{
   var newElement = alarmGlobalArray[nCurrentItem];
   var inputArgs  = App().NewPropertySet ();
   
   alarmGlobalArray[nCurrentItem] = null;
   JSSAlarmMgr_RemoveFromGlobalArray();
   JSSAlarmMgr_UpdateAlarmWindow();
   
   if (newElement.apptRepAct == "N") 
   {
      inputArgs.SetProperty("alarmId", newElement.apptId + "|");
      inputArgs.SetProperty("SWEJSXInfo", "false");
      S_AlarmMgr.alarmService.InvokeMethod("DismissAlarm", inputArgs);
   }   
}

function JSSAlarmMgr_DismissAll()
{
   var inputArgs  = App().NewPropertySet ();
   var strTemp    = "";
      
   top.SWEPopupWinAlarm.close();
   
   while (alarmGlobalArray.length != 0)
   {
      var newElement = alarmGlobalArray[0];
      alarmGlobalArray[0] = null;
      JSSAlarmMgr_RemoveFromGlobalArray();
   
      if (newElement.apptRepAct == "N")
         strTemp += newElement.apptId + "|";
      else
         continue;   
   }
   
   if (strTemp != "" )
   {
      inputArgs.SetProperty("alarmId", strTemp);
      inputArgs.SetProperty("SWEJSXInfo", "false");
      S_AlarmMgr.alarmService.InvokeMethod("DismissAlarm", inputArgs);
   }
}

function JSSAlarmMgr_CloseWindow()
{
   top.SWEPopupWinAlarm = null;
   nCurrentItem         = -1;
   dAlarmOpenWimdow     = null;
   bmoveAlarmWindow     = false;
}

function JSSAlarmMgr_Close()
{
   top.SWEPopupWinAlarm.close();
}

function SnoozeTimeChange()
{
   var oSnoozeTime = top.SWEPopupWinAlarm.document.getElementById("SnoozeTime");
   
   alarmGlobalArray[nCurrentItem].SnoozeTimeVal = oSnoozeTime.options[oSnoozeTime.selectedIndex].value;
}

function JSSAlarmMgr_BuildAlarmBody()
{
   //check if this is RTL
   var bodyTag = "";
   if (bIsRTL)
      bodyTag = "<body dir='rtl' topmargin=0 leftmargin=0 marginwidth=0 marginheight=0 onbeforeunload=opener.JSSAlarmMgr_CloseWindow()>";
   else
      bodyTag = "<body topmargin=0 leftmargin=0 marginwidth=0 marginheight=0 onbeforeunload=opener.JSSAlarmMgr_CloseWindow()>"   

   var sScript = "<SCRIPT>function cancelClick(){return false;}document.oncontextmenu=cancelClick;</SCRIPT>"
      
   var AlarmDoc = "<html><head>"+sScript+"<title>"+startTitle+"</title>"+
   "<link href='files/main.css' rel='stylesheet'></head>"+
   bodyTag+
   "<table width=100% height=100% cellSpacing=0 cellPadding=0 align=center border=0>"+
      "<tr><td><table bgcolor=white width=100% cellSpacing=0 cellPadding=0 align=center border=0>"+
         "<tr>" +
            "<td width=80%>"+
               "<table width=100% cellpadding=2 cellspacing=1>"+
                  "<tr valign=top>"+
                     "<td>"+
                        "<div style=width:300;overflow:hidden><table cellpadding=0 cellspacing=0 border=0>"+
                           "<tr style='padding-bottom:5px'>"+
                              "<td>&nbsp;</td>"+
                              "<td class=scLabelRight nowrap>"+typeLable+"</td>"+
                              "<td style='padding-left:5px' id=IDtype nowrap></td>"+
                           "</tr>"+
                           "<tr style='padding-bottom:8px'>"+
                              "<td>&nbsp;</td>"+
                              "<td class=scLabelRight nowrap></td>"+
                              "<td style='padding-left:5px'><textarea id=IDdesc nowrap rows=3 cols=45 readonly></textarea></td>"+
                           "</tr>"+
                           "<tr>"+
                              "<td>&nbsp;</td>"+
                              "<td class=scLabelRight nowrap>"+startLable+"</td>"+
                              "<td style='padding-left:5px' id=IDStartTime nowrap></td>"+
                           "</tr>"+
                           "<tr>"+
                              "<td>&nbsp;</td>"+
                              "<td class=scLabelRight nowrap>"+endLable+"</td>"+
                              "<td style='padding-left:5px' id=IDEndTime nowrap></td>"+
                           "</tr>"+
                        "</table></div>"+
                     "</td></tr>"+
                  "<tr valign=top>"+
                     "<td>"+         
                        "<table border=0 cellpadding=6  cellspacing=0>"+
                           "<tr valign=top>"+
                              "<td valign=center width=45% nowrap>"+snoozeForLable+"</td>"+
                              "<td valign=center width=60%>"+
                                 "<select id=SnoozeTime name='SnoozeTime' onChange=opener.SnoozeTimeChange()></select>"+
                              "</td>"+
                           "</tr>"+
                        "</table>"+
                     "</td>"+
                  "<tr>"+
               "</table>"+
            "</td>"+
            "<td width=20%>"+
               "<table width=100% cellpadding=0 cellspacing=10>"+
                  "<tr><td>"+
                     "<table class=minibutton border=0 cellpadding=0 cellspacing=0 height=10>"+
                             "<tr><td class=minibuttonOn align=center><nobr><A style=cursor:hand;overflow:visible;height:100% onclick=opener.JSSAlarmMgr_SnoozeAlarm()>"+snoozeLable+"</A></nobr></td></tr>"+
                         "</table>"+
                  "</td></tr>"+
                  "<tr><td>"+
                     "<table class=minibutton border=0 cellpadding=0 cellspacing=0 height=10>"+
                         "<tr><td class=minibuttonOn align=center><nobr><A style=cursor:hand;overflow:visible;height:100% onclick=opener.JSSAlarmMgr_DismissAlarm()>"+dismissLable+"</A></nobr></td></tr>"+
                     "</table>"+
                  "</td></tr>"+
                  "<tr>"+
                     "<td>&nbsp;</td>"+
                  "</tr>"+
               "</table>"+
            "</td>"+
         "</tr>"+
      "</table></td></tr>"+
      "<tr><td><table width=100% cellSpacing=10 cellPadding=0 bgcolor=#cccccc>"+
         "<tr>"+
            "<td>"+
            "<table class=minibutton border=0 cellpadding=0 cellspacing=0 height=10>"+
               "<tr id=btnSnoozeAll style=visibility:hidden><td class=minibuttonOn valign=middle><nobr><A style=cursor:hand;overflow:visible;height:100% onclick=opener.JSSAlarmMgr_SnoozeAll()>"+snoozeAllLable+"</A></nobr></td></tr>" +
             "</table></td>" +
            "<td>" +
            "<table class=minibutton border=0 cellpadding=0 cellspacing=0 height=10>" +
               "<tr id=btnDismissAll style=visibility:hidden><td class=minibuttonOn align=center><nobr><A style=cursor:hand;overflow:visible;height:100% onclick=opener.JSSAlarmMgr_DismissAll()>" + dismissAllLable + "</A></nobr></td></tr>"+
             "</table></td>"+
            "<td>"+
            "<table class=minibutton border=0 cellpadding=0 cellspacing=0 height=10>"+
               "<tr id=btnPrev><td class=minibuttonOn align=center><nobr><A style=cursor:hand;overflow:visible;height:100% onclick=opener.JSSAlarmMgr_PrevAlarm()>"+prevLable+"</A></nobr></td></tr>"+
             "</table></td>"+
            "<td>"+
            "<table class=minibutton border=0 cellpadding=0 cellspacing=0 height=10>"+
               "<tr id=btnNext><td class=minibuttonOn align=center><nobr><A style=cursor:hand;overflow:visible;height:100% onclick=opener.JSSAlarmMgr_NextAlarm()>"+nextLable+"</A></nobr></td></tr>"+
             "</table></td>"+
            "<td>"+
            "<table class=minibutton border=0 cellpadding=0 cellspacing=0 height=10>"+
               "<tr><td class=minibuttonOn align=center><nobr><A style=cursor:hand;overflow:visible;height:100% onclick=opener.JSSAlarmMgr_Close()>"+closeLable+"</A></nobr></td></tr>"+
             "</table></td>"+
         "</tr>"+
      "</table></td></tr>"+   
   "</table></body></html>";
   
   return AlarmDoc;
}

JSSAlarmMgr.prototype.CreateArrayObjects  = JSSAlarmMgr_CreateArrayObjects;
JSSAlarmMgr.prototype.GetAppointments     = JSSAlarmMgr_GetAppointments;
JSSAlarmMgr.prototype.Init                = JSSAlarmMgr_Init;
JSSAlarmMgr.prototype.NotifyGeneric       = JSSAlarmMgr_NotifyGeneric;
JSSAlarmMgr.prototype.Poll                = JSSAlarmMgr_Poll;
JSSAlarmMgr.prototype.SetApplication      = JSSAlarmMgr_SetApplication;
JSSAlarmMgr.prototype.BuildAlarmBody      = JSSAlarmMgr_BuildAlarmBody;
JSSAlarmMgr.prototype.AddToAlarmArray     = JSSAlarmMgr_AddToAlarmArray;
JSSAlarmMgr.prototype.SettimeToSleep      = JSSAlarmMgr_SettimeToSleep;

/*****************************************************************************
 *
 * Copyright (C) 2000, Siebel Systems, Inc., All rights reserved.
 *
 * FILE:       applicationshadow.js
 *  $Revision: 25 $
 *      $Date: 8/10/01 2:00p $
 *    $Author: Wlai $ of last update
 *
 * CREATOR:    Michael Flexer
 *
 * DESCRIPTION
 *    Application shadow object for JavaScript browser tier
 *
 *****************************************************************************/

/*
 * JSSApplicationShadow
 *
 * _application
 */

function JSSApplicationShadow_FindApplet (name)
{
   var view;
   var applet;

   view = this._application.GetMainView ();

   if (view == null)
      return (null);

   applet = view.GetApplet (name);

   if (applet == null)
      return (null);

   if (applet.shadow == null)
   {
      applet.shadow = new this.swescriptFrame.JSSAppletShadow (null);
      applet.shadow._applet = applet;
   }

   return (applet.shadow);
}

function JSSApplicationShadow_ActiveViewName ()
{
   var view;

   view = this._application.GetMainView ();

   if (view == null)
      return (null);

   return view.GetName();
}

function JSSApplicationShadow_ActiveBusObject ()
{
   var busobj;
   var view;

   view = this._application.GetMainView ();

   if (view == null)
      return (null);

   busobj = view.GetBusObj();

   if (busobj == null)
      return (null);

   if (busobj.shadow == null)
   {
      busobj.shadow = new this.swescriptFrame.JSSBusObjShadow ();
      busobj.shadow._busobj = busobj;
   }

   return (busobj.shadow);
}

function JSSApplicationShadow_ActiveApplet ()
{
   var view;
   var applet;

   view = this._application.GetMainView ();

   if (view == null)
      return (null);

   applet = view.GetActiveApplet ();

   if (applet == null)
      return (null);

   if (applet.shadow == null)
   {
      applet.shadow = new this.swescriptFrame.JSSAppletShadow (null);
      applet.shadow._applet = applet;
   }

   return (applet.shadow);
}

function JSSApplicationShadow_ActiveBusComp ()
{
   var view;
   var applet;
   var buscomp;

   view = this._application.GetMainView ();

   if (view == null)
      return (null);

   applet = view.GetActiveApplet ();

   if (applet == null)
      return (null);

   buscomp = applet.GetBusComp();

   if (buscomp == null)
      return (null);

   if (buscomp.shadow == null)
   {
      buscomp.shadow = new this.swescriptFrame.JSSBusCompShadow ();
      buscomp.shadow._busComp = buscomp;
   }

   return (buscomp.shadow);
}

function JSSApplicationShadow_FindBusObject (name)
{
   var busobj;

   busobj = this._application.GetBusObj (name);

   if (busobj == null)
      return (null);

   if (busobj.shadow == null)
   {
      busobj.shadow = new this.swescriptFrame.JSSBusObjShadow ();
      busobj.shadow._busobj = busobj;
   }

   return (busobj.shadow);
}

function JSSApplicationShadow_GetProfileAttr (name)
{
   return this._application.GetProfileAttr (name);
}

function JSSApplicationShadow_GetService (name)
{
   var service;

   service = this._application.GetService (name);

   if (service == null)
      return (null);

   if (service.shadow == null)
   {
      service.shadow = new this.swescriptFrame.JSSServiceShadow ();
      service.shadow._service = service;
   }

   return (service.shadow);
}

function JSSApplicationShadow_InvokeMethod (name, inputPropSet)
{
   return this._application.InvokeMethod (name, inputPropSet);
}

function JSSApplicationShadow_IsReady ()
{
   //check if the application is running or not
   return (this._application != null) ? true : false;
}

function JSSApplicationShadow_Name ()
{
   return (this._application.GetName ());
}

function JSSApplicationShadow_NewPropertySet ()
{
   return (this._application.NewPropertySet ());
}

function JSSApplicationShadow_SetProfileAttr (name, value)
{
   return this._application.SetProfileAttr (name, value);
}

function JSSApplicationShadow_SWEAlert (text)
{
   if (IsOpenUI())
   {
     window.SWEAlert (text);
   }
   else if (typeof (top._swescript) != "undefined")
   {
      top._swescript.SWEAlert (text);
   }
}

function JSSApplicationShadow_ShowModalDialog (url, argin, options)
{
   return this._application.ShowModalDialog (url, argin, options);
}
/*
* category 0:TRC_ERROR, 1: TRC_WARNING,2:TRC_INFO, 3:TRC_DETAIL
*/
function JSSApplicationShadow_SeblTrace(category, trcMessage)
{
   this._application.SeblTrace(category,trcMessage);
}

function JSSApplicationShadow_GetSRN ()
{
   return this._application.GetSRN ();
}

function JSSApplicationShadow_TriggerUPTEvent (inputPropSet)
{
   return this._application.TriggerUPTEvent (inputPropSet);
}

function JSSApplicationShadow (application)
{
   if (application != null)
   {
      this._application = application;
      application.shadow = this;
      this._application.SeblTrace(2,"JSSApplicationShadow Initialized");
   }
   if (IsOpenUI())
   {
      this.swescriptFrame = window;
   }
   else
   {
      this.swescriptFrame = top._swescript;
   }
}

new JSSApplicationShadow (null);
JSSApplicationShadow.prototype = new JSSObjectBase ();

JSSApplicationShadow.prototype.FindApplet              = JSSApplicationShadow_FindApplet;
JSSApplicationShadow.prototype.ActiveApplet            = JSSApplicationShadow_ActiveApplet;
JSSApplicationShadow.prototype.ActiveViewName          = JSSApplicationShadow_ActiveViewName;
JSSApplicationShadow.prototype.ActiveBusObject         = JSSApplicationShadow_ActiveBusObject;
JSSApplicationShadow.prototype.ActiveBusComp           = JSSApplicationShadow_ActiveBusComp;
JSSApplicationShadow.prototype.FindBusObject           = JSSApplicationShadow_FindBusObject;
JSSApplicationShadow.prototype.GetProfileAttr          = JSSApplicationShadow_GetProfileAttr;
JSSApplicationShadow.prototype.GetService              = JSSApplicationShadow_GetService;
JSSApplicationShadow.prototype.InvokeMethod            = JSSApplicationShadow_InvokeMethod;
JSSApplicationShadow.prototype.IsReady                 = JSSApplicationShadow_IsReady;
JSSApplicationShadow.prototype.Name                    = JSSApplicationShadow_Name;
JSSApplicationShadow.prototype.NewPropertySet          = JSSApplicationShadow_NewPropertySet;
JSSApplicationShadow.prototype.SetProfileAttr          = JSSApplicationShadow_SetProfileAttr;
JSSApplicationShadow.prototype.SWEAlert                = JSSApplicationShadow_SWEAlert;
JSSApplicationShadow.prototype.ShowModalDialog         = JSSApplicationShadow_ShowModalDialog;
JSSApplicationShadow.prototype.SeblTrace              = JSSApplicationShadow_SeblTrace;
JSSApplicationShadow.prototype.GetSRN                 = JSSApplicationShadow_GetSRN;
JSSApplicationShadow.prototype.TriggerUPTEvent        = JSSApplicationShadow_TriggerUPTEvent;

function theApplication ()
{
   if ( App() == null )
       return null;
      
   if (IsOpenUI())
       return App().GetShadow();
   else
       return App().shadow;
   
}
//////////////////////////////////////////////////////////////////////////////
//
// Copyright (C) 2004 Siebel Systems, Inc., 
// All rights reserved.
//
// FILE:       trainingQueue.js
//
// CREATOR:    ERLEE
//
// DESCRIPTION
//    This file implements the eTraining Training Queue popup. HI-mode only
//
//
//////////////////////////////////////////////////////////////////////////////

// TrainingQueue javascript class
function JSSTrainingQueue()
{
}

function JSSTrainingQueue_Init()
{
   this.trainingQueueSvc = App().GetService("Training Queue");
   
   if (null == this.trainingQueueSvc)
   {
      return;
   }
   
   this.queueUpdateInterval   = 0; 
   var bIsEnabled    = false;
   var inputPropSet  = App().NewPropertySet();
   var returnPropSet = App().NewPropertySet();
   
   returnPropSet = this.trainingQueueSvc.InvokeMethod("SetupTrainingQueue", inputPropSet);
   
   if (null == returnPropSet)
   {
      return;
   }

   var count = returnPropSet.GetChildCount ();
   var tmpString;
   
   for (var i = 0; i < count; i++)
   {
      var returnSetPropSet = returnPropSet.GetChild (i);
      
      if (returnSetPropSet != null && returnSetPropSet.GetType () == "ResultSet")
      {    
         tmpString = returnSetPropSet.GetProperty("IsQueryEnabled");
         bIsEnabled = ("TRUE" == tmpString);
         
         if (bIsEnabled)
         {
            tmpString = returnSetPropSet.GetProperty("QueryInterval");
            this.queueUpdateInterval = tmpString - 0; //explicitly convert to int
         }
      }
   }
   
   if (bIsEnabled && !isNaN(this.queueUpdateInterval))
   {
      this.queueTimeoutId = setTimeout("S_TrainingQ.Query()", this.queueUpdateInterval * 1000);
   }
}   

// Query training queue on server
function JSSTrainingQueue_QueryQueue()
{
   try 
   {          
      if (this.trainingQueueSvc != null)
      {
         var inputPropSet = App().NewPropertySet ();
         this.trainingQueueSvc.InvokeMethod("QueryTrainingQueue", inputPropSet);
      }
   }
   catch(e) {}
   
   //fixme - add error handling: i.e. only reset timer if previous call was ok?      
   this.queueTimeoutId = setTimeout('S_TrainingQ.Query()', this.queueUpdateInterval * 1000); 
}

JSSTrainingQueue.prototype.Init     = JSSTrainingQueue_Init;
JSSTrainingQueue.prototype.Query    = JSSTrainingQueue_QueryQueue;
