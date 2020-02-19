// JavaScript Calendar Component 
// Author: Robert W. Husted
// Date:   8/22/1999
// Modified Date: 10/21/00
// Modified By:   Dennis Ferry
// Notes:  Created the UTCDateTime applet

var calDateFormat  = "M/D/YYYY, h:mm:ss p";
var showClock      = false;
var monthLongList  = "January;;February;;March;;April;;May;;June;;July;;August;;September;;October;;November;;December";
var weekList       = "S;;M;;T;;W;;T;;F;;S";
var monthList      = "Jan;;Feb;;Mar;;Apr;;May;;Jun;;Jul;;Aug;;Sep;;Oct;;Nov;;Dec";
var weekLongList   = "Sunday;;Monday;;Tuesday;;Wednesday;;Thursday;;Friday;;Saturday";
var timeOnly       = false;
var timeZones          = "";
var currentTimeZone    = "";
var initialTimeZone    = "";
var datumType      = "";
var timeZone           = "";
var startDay           = 0;    // Start the week on this day - 0 = Sunday, 1 = Monday, etc.
var showTimeZone   = false;
var inDate             = "";
var inTime             = "1:00:00 AM";
var cancelLabel        = "Cancel";
var saveLabel          = "Save";
var bMonthBeforeYear = true;
var b24HourClock     = false;
var tmpHours         = 1;
var tmpAM            = "AM";
var iDayName         = 0;
var startingPos      = 0;
var weekdayArray		= new Array(' ',' ',' ',' ',' ',' ',' ');
var weekdayLongArray = new Array(' ',' ',' ',' ',' ',' ',' ');
var monthArray       = new Array(' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ');
var monthLongArray   = new Array(' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ');
var formatArray      = new Array(30);
var sAM				= "AM"
var sPM				= "PM"
var sDateSeparator   = "/"
var sTimeSeparator   = ":"
var special = false;
var sEndOfFormat = false;
var minuteIndexOffest = 0;
var minutesIn = "";
var bRTL      = false;
var sRTLmarkUp = "";  // "" or " dir='rtl'"
var CalendarModalDialogScript = "";  
var bAppendTimezone = false;
var bIsQueryMode = false;

var topBackground    = "slateblue";    // BG COLOR OF THE TOP FRAME
var bottomBackground = "white";        // BG COLOR OF THE BOTTOM FRAME
var tableBGColor     = "white";        // BG COLOR OF THE BOTTOM FRAME'S TABLE
var cellColor        = "white";        // TABLE CELL BG COLOR OF THE DATE CELLS IN THE BOTTOM FRAME
var currentCellColor = "#F0E68C";      // TABLE CELL BG COLOR OF THE CURRENT DATE CELLS IN THE BOTTOM FRAME
var headingCellColor = "white";        // TABLE CELL BG COLOR OF THE WEEKDAY ABBREVIATIONS
var headingLinkColor = "white";        // TABLE CELL BG COLOR OF THE WEEKDAY ABBREVIATIONS
var headingTextColor = "black";        // TEXT COLOR OF THE WEEKDAY ABBREVIATIONS
var dateColor        = "blue";         // TEXT COLOR OF THE LISTED DATES (1-28+)
var focusColor       = "black"         // TEXT COLOR OF THE SELECTED DATE (OR CURRENT DATE)
var hoverColor       = "darkred";      // TEXT COLOR OF A LINK WHEN YOU HOVER OVER IT
var myFontStyle        = "8pt arial, helvetica";           // TEXT STYLE FOR DATES
var selectedDateStyle = "bold 8pt arial, helvetica";           // TEXT STYLE FOR DATES
var headingFontStyle = "bold 8pt arial, helvetica";      // TEXT STYLE FOR WEEKDAY ABBREVIATIONS
var topButtonColor    = "black";       // BG COLOR OF THE TOP FRAME TEXT
var timeBackground   = "#F0E68C";      // BG color of the Time Frame
var exitFrameBG      = "#C0C0C0";      // BG color of the bottom button frame

// DETERMINE BROWSER BRAND
var isNav = false;
var isIE  = false;
var isMac = false;
var isAOL7orGreater = false;
var isIE50 = false;
var isIE60 = false;
var isIE70 = false;

// Combo box titles
var tDate="";
var tMonth="";
var tYear="";
var tHour="";
var tMinute="";
var tPm="";
var tTimeZone="";

var gTitle ="";
var sPyear="";
var sPmonth="";
var sNyear="";
var sNmonth="";

var bPopulateMessages = false;

//Bug : 11671230 - Declaring variables for frame titles 
var notUsed = "";

// Table inspector issues :  variable for week string
var sWeek = "";

var bAccessibilityOn = false;
if (typeof (Top()._swescript) != "undefined" && Top()._swescript.bAccessibleEnhanced == true)
{
   bAccessibilityOn = true;
}
if (bAccessibilityOn && !bPopulateMessages)
{
	  var appObj = (window.opener != null) ? window.opener : this;
	  tDate = appObj._SWEgetMessage ("IDS_CALENDAR_DATE_COMBOBOX_TITLE");
	  tMonth= appObj._SWEgetMessage ("IDS_CALENDAR_MONTH_COMBOBOX_TITLE");
	  tYear= appObj._SWEgetMessage ("IDS_CALENDAR_YEAR_COMBOBOX_TITLE");
	  tHour= appObj._SWEgetMessage ("IDS_CALENDAR_HOURS_COMBOBOX_TITLE");
	  tMinute= appObj._SWEgetMessage ("IDS_CALENDAR_MINUTES_COMBOBOX_TITLE");
	  tPm= appObj._SWEgetMessage ("IDS_CALENDAR_PMAM_COMBOBOX_TITLE");
	  tTimeZone= appObj._SWEgetMessage ("IDS_CALENDAR_TIMEZONE_COMBOBOX_TITLE");
	  sPyear= appObj._SWEgetMessage ("IDS_CALENDAR_PREVIOUS_YEAR_STRING");
	  sPmonth= appObj._SWEgetMessage ("IDS_CALENDAR_PREVIOUS_MONTH_STRING");
	  sNyear= appObj._SWEgetMessage ("IDS_CALENDAR_NEXT_YEAR_STRING");
	  sNmonth= appObj._SWEgetMessage ("IDS_CALENDAR_NEXT_MONTH_STRING");
	  gTitle= appObj._SWEgetMessage ("IDS_CALENDAR_STRING");
	  notUsed = appObj._SWEgetMessage ("IDS_SWE_DEFAULT_FRAME_TITLE_STRING");  //Bug : 11671230 : by default frame title should be not used
	  sWeek = appObj._SWEgetMessage ("IDS_CALENDAR_WEEK_STRING");  // Table inspector issues :  week column header
	  
	  bPopulateMessages = true;
		  
}
//Bug : 11671230  Declaring frame title variables and populating the same from global frame title array
var topCalFrameTitle = notUsed;
var bottomCalFrameTitle = notUsed;
var timeFrameTitle = notUsed;
var buttonFrameTitle = notUsed;
var timeFrameTitle = notUsed;
if (typeof (Top()._swescript) != "undefined" && bAccessibilityOn  )
{
	
	topCalFrameTitle = Top()._swescript._getFrameTitle("topCalFrame");
	bottomCalFrameTitle = Top()._swescript._getFrameTitle("bottomCalFrame");
	timeFrameTitle = Top()._swescript._getFrameTitle("timeFrame");
	buttonFrameTitle = Top()._swescript._getFrameTitle("buttonFrame");
		
}
if (topCalFrameTitle == undefined)
	topCalFrameTitle = notUsed;
if (bottomCalFrameTitle == undefined)
	bottomCalFrameTitle = notUsed;
if (timeFrameTitle == undefined)
	timeFrameTitle = notUsed;
if (buttonFrameTitle == undefined)
	buttonFrameTitle = notUsed;

if (navigator.appName == "Netscape") {
    isNav = true;
}
else {
    isIE = true;
}

if (navigator.userAgent.toUpperCase().match(/MAC/))
	isMac = true;
if (navigator.userAgent.toUpperCase().indexOf("AOL 7") > -1 || navigator.userAgent.toUpperCase().indexOf("AOL 8") > -1)
    isAOL7orGreater = true;
if (navigator.userAgent.toUpperCase().indexOf("MSIE 5.0") > -1)
   isIE50 = true;
if (navigator.userAgent.toUpperCase().indexOf("MSIE 6.0") > -1) //IE7 Check FR # 12-1V059B0
   isIE60 = true;
if (navigator.userAgent.toUpperCase().indexOf("MSIE 7.0") > -1) //IE7 Check CR # 12-1H09LEB
   isIE70 = true;

function Test (x)
{
 return (x != null && typeof (x) != 'undefined');
}


function SetFocusById(bTopFrame, id)
{
   
   var elm = null;
   if (bTopFrame)
   {
      if (!Test(top.SWEJannaPopupWin.topCalFrame) || !Test(top.SWEJannaPopupWin.topCalFrame.document.getElementById)) return         
      elm = top.SWEJannaPopupWin.topCalFrame.document.getElementById(id);
   }
   else
   {
      if (!Test(top.SWEJannaPopupWin.bottomCalFrame)|| !Test(top.SWEJannaPopupWin.bottomCalFrame.document.getElementById)) return;      
      elm = top.SWEJannaPopupWin.bottomCalFrame.document.getElementById(id);
   }
   if (elm != null)
   {        
      elm.focus();
   }      
}

function SetFocusToFirstElement()
{
   SetFocusById(true, "SetPreviousYearAnchor");   
   window.setTimeout ('SetFocusById(true, "SetPreviousYearAnchor");',50);
}

function SetFocusAfterDays()
{
   if (Test(top.SWEJannaPopupWin.timeFrame))
   {
      top.SWEJannaPopupWin.timeFrame.document.calControl.hour.focus();
   }
   else
   {
      top.SWEJannaPopupWin.buttonFrame.SaveBtn.focus();
   }      
}

function SetKeyDownEventHandler(frame, funct)
{
   if (!Test(frame)) return false;
   if (isNav) frame.document.captureEvents(Event.KEYDOWN);
   frame.document.onkeydown = funct;      
}
function InitKeyHandler()
{   
   SetKeyDownEventHandler (top.SWEJannaPopupWin.bottomCalFrame, HandleKeyDownForBottomFrame);   
   SetKeyDownEventHandler (top.SWEJannaPopupWin.topCalFrame, HandleKeyDown);   
   SetKeyDownEventHandler (top.SWEJannaPopupWin.timeFrame, HandleKeyDown);   
   SetKeyDownEventHandler (top.SWEJannaPopupWin.buttonFrame, HandleKeyDown);     
}

function HandleKeyDown(param)
{
   var e = param;
   if (Test(top.SWEJannaPopupWin.topCalFrame) && Test(top.SWEJannaPopupWin.topCalFrame.event)) e = top.SWEJannaPopupWin.topCalFrame.event;
   if (Test(top.SWEJannaPopupWin.timeFrame)   && Test(top.SWEJannaPopupWin.timeFrame.event))   e = top.SWEJannaPopupWin.timeFrame.event;
   if (Test(top.SWEJannaPopupWin.buttonFrame) && Test(top.SWEJannaPopupWin.buttonFrame.event)) e = top.SWEJannaPopupWin.buttonFrame.event;
   
   if (Test(e) && (e.keyCode == 13 || e.keyCode == 49) && e.ctrlKey == true)
   {
      returnNewDate();
   } 
   if (Test(e) && e.keyCode == 50 && e.ctrlKey == true)
   {
      returnInDate();
   }
}

function HandleKeyDownForBottomFrame(param)
{
   var e =  (!isNav) ? top.SWEJannaPopupWin.bottomCalFrame.event : param;
   var date = calDate.getDate(); 
  
   if (!Test(e)) return true;  
   var cc = null;
  
   if (Test(e.keyCode))
   {
      cc = e.keyCode;
   }
   else if (Test(e.which))
   {
      cc = e.which;
   }  
   
   switch (cc)
   {
      case 9: //Tab
        if (!isNav && !isMac && !isAOL7orGreater)
        {    
           SetFocusAfterDays();                 
           return false;
        }
        return;
      case 13: //Ctrl+Enter
      {
         if (e.ctrlKey)
         {
             returnNewDate();
         }  
         return;            
      }              
      case 37: //left
         if (date > 1) setCalDay(date - 1);
         return; 
      case 39: //right
         if (date <= getDaysInMonth() - 1) setCalDay(date + 1);
         return;
      case 38: //up
         if (date > 7) setCalDay(date - 7);      
         return;
      case 40: //down
         if (date <= getDaysInMonth() - 7) setCalDay(date + 7);
         return;  
      case 49:  //Ctrl+1
      {
         if (e.ctrlKey)
         {
             returnNewDate();
         }  
         return; 
       }
      case 50:  //Ctrl+2
      {
         if (e.ctrlKey)
         {
             returnInDate();
         }  
         return; 
      }    
                
      default:         
         return;
   }   
}


// PRE-BUILD PORTIONS OF THE CALENDAR WHEN THIS JS LIBRARY LOADS INTO THE BROWSER
buildCalParts();

function setMonths(monthNameList, monthLongList, dateSeparator) {
   monthList = monthNameList;
   monthLongList     = monthLongList;
   sDateSeparator = dateSeparator;
}

function setWeekDays(weekdayNameList, weekdayLongList, startOnDay) {
   weekList = weekdayNameList;
   weekLongList = weekdayLongList;
   startDay = startOnDay;
}

function setTimeZones(timeZoneList, timeZone) {
   timeZones = timeZoneList;
   currentTimeZone = timeZone;
   initialTimeZone = timeZone;
   showTimeZone = true;
}

function setQueryMode(isQuery) {
   if (isQuery == "true")
   {
      bIsQueryMode = true;
   }
}

function setCalButtonLabels(sSave, sCancel) {
    cancelLabel       = sCancel;
    saveLabel         = sSave;
    showTimeZone      = false;  
    
    CalendarModalDialogScript = "<SCRIPT LANGUAGE='JavaScript'>" +
        "   var thisCal = self; " + 
        "   var iCalModalTimeout = 500;" +
        "   setTimeout('setCalFocus()',iCalModalTimeout);" +
        "   function setCalFocus() {" +
        "     thisCal.focus(); " +
        "     setTimeout('setCalFocus()',iCalModalTimeout);" +
        "   }" +
        "</SCRIPT>";
}

function setFormats( AMsymobol, PMsymbol, timeSeparator) {
   sAM = AMsymobol;
   sPM = PMsymbol;
   sTimeSeparator = timeSeparator;
}

function setCalRTL( isRTL) {
   if (isRTL == "true")
   {
      bRTL = true;
      sRTLmarkUp = " dir='rtl'";   
   }
   buildCalParts();
}
   
function setDateField(dateField,dType, returnFormat) {
   // set the format of the returned value
   datumType = dType;
   calDateFormat = returnFormat;
   calDateField = dateField;
   inDate = dateField.value;

   // SET calDate TO THE DATE IN THE INCOMING FIELD OR DEFAULT TO TODAY'S DATE
   setInitialDate();

   // THE CALENDAR FRAMESET DOCUMENTS ARE CREATED BY JAVASCRIPT FUNCTIONS
   calDocTop    = buildTopCalFrame();
   calDocBottom = buildBottomCalFrame();
   timeDoc      = buildTimeFrame();
   timeZoneDoc  = buildTimeZoneFrame();
   buttonDoc   =  buildButtonFrame();
}

function setTimeField(dateField,dType, returnFormat) {
   // set the format of the returned value
   calDateFormat = returnFormat;
   datumType = dType;
   timeOnly = true;
   calDateField = dateField;
   inDate = dateField.value;
   setInitialTime();
   timeDoc      = buildTimeFrame();
   buttonDoc =  buildButtonFrame();
}

function setInitialDate() {
   // 1/1/2004 is not chosen randomly. 2004 is a leap year, Jan has all 31 days and 1st is valid for any month.
   // Because of different format, the year, month and date can be set in various orders.  1/1/2004 works for
   // any order.  Originally callDate gets the current date, if today is 1/31/2003 and the month is set first
   // and value is 2, because Feb does not have 31st, the date in the calendar won't show 1/31/2003.
   calDate = new Date(2004, 0, 1);  //fix for bug#10462482
   calDate.setSeconds(0);
   

   parseFormat();
   if (!b24HourClock)
   {
      if (tmpAM == "PM" && tmpHours != 12) {tmpHours = tmpHours + 12;}
      else if (tmpAM =="AM" && tmpHours == 12) {tmpHours = 0;}
   }
   calDate.setHours(tmpHours);

   tmpTimeZone = inDate.substring(inDate.indexOf("[") + 1 ,inDate.lastIndexOf("]") );
       
   if (tmpTimeZone.length > 0) {
      currentTimeZone = tmpTimeZone;
   }

   // IF THE INCOMING DATE IS INVALID, USE THE CURRENT DATE
   if (isNaN(calDate)) {
      calDate = new Date();
      calDate.setSeconds(0);
   }
}

function parseFormat() {
   tmpDate = inDate;
   cChar = "";
   iFormatElement = 0;
   cCurrentElement = "";
   cPrevElement = "";
   sCurrentFormat = "";
   bIsCustomSeparator = false;
   bIsFormat    = false;
   bIsPrevElementFormat = false;
   iLocalIndex = 0;
   
   strDateFormat = calDateFormat.toUpperCase();
   
   if(strDateFormat.length != 0 && (strDateFormat.indexOf("Y") < strDateFormat.indexOf("M"))) 
      bMonthBeforeYear = false;
   
   // read the format character by character and create an array of formatting strings
   for (i = 0 ;  i < calDateFormat.length; i++)
   {
      // read a character from the format
      cChar = calDateFormat.charAt(i);
      bIsFormat = !bIsCustomSeparator && (cChar=="Y" || cChar=="M" || cChar=="D" || cChar=="H" || cChar=="h" || cChar=="m" || cChar=="s" || cChar=="p");
      // check for start of custom separator
      if (cChar == "'" && !bIsCustomSeparator && cPrevElement!="\\")
      {
         bIsCustomSeparator = true;
         formatArray[iFormatElement] = sCurrentFormat;
         // parse the input date/time here
         setFormattedTime(sCurrentFormat, calDateFormat.charAt(i + 1));
         iFormatElement++;
         sCurrentFormat = "";
      }      
      //  check for end of custom separator
      else if (cChar == "'" && bIsCustomSeparator && cPrevElement!="\\")
      {
         bIsCustomSeparator = false
         formatArray[iFormatElement] = sCurrentFormat;
         iLocalIndex = tmpDate.indexOf(sCurrentFormat);
         tmpDate= tmpDate.substring(iLocalIndex + sCurrentFormat.length, tmpDate.length);
         iFormatElement++;
         sCurrentFormat = "";
      }
      // if it is the same as the previous char (and it is a format command) or we are in a custom separator
      else if ((cChar == cCurrentElement && bIsFormat) || bIsCustomSeparator)
      {
         sCurrentFormat = sCurrentFormat + cChar;
      }
      // there is no current format
      else if (sCurrentFormat == "")
      {
         cCurrentElement = cChar;
         sCurrentFormat = cCurrentElement;
      }
      // current element is not a format char 
      else if (cChar != cCurrentElement && !bIsFormat)
      {
         if (bIsPrevElementFormat) //  if the previous element was a formatting char, store the format
         {
            formatArray[iFormatElement] = sCurrentFormat;
            // parse the input date/time here 
            setFormattedTime(sCurrentFormat, cChar);
            cCurrentElement = cChar;
            sCurrentFormat = cCurrentElement;
            iFormatElement++;
         }
         else if (cChar!="\\")  //  otherwise, just append the char
         {
            sCurrentFormat = sCurrentFormat + cChar;
         }
         tmpDate=tmpDate.substring(1,tmpDate.length);
      }
      else if (bIsFormat)
      {
         formatArray[iFormatElement] = sCurrentFormat;
         cCurrentElement = cChar;
         sCurrentFormat = cCurrentElement;
         iFormatElement++;
      }
      else 
      {
         sCurrentFormat = sCurrentFormat + cChar;
      }
      bIsPrevElementFormat = bIsFormat;
      cPrevElement = cCurrentElement;
   }
   sEndOfFormat = true;
   formatArray[iFormatElement] = sCurrentFormat;
   if (bIsFormat) { setFormattedTime(sCurrentFormat, cChar);}
   
   
}

//  set the initial date and/or time per the format string
function setFormattedTime(sFormatPiece, cNextChar)
{
   iIndex = tmpDate.indexOf(cNextChar);
   if (sEndOfFormat == false) {sDateTimePiece = tmpDate.substring(0,iIndex);}
   else {
      if ( tmpDate.indexOf("[") != -1) {
         iIndex = tmpDate.indexOf("[");
         sDateTimePiece = tmpDate.substring(0,iIndex);
      }
      else
         sDateTimePiece = tmpDate;
      }
   tmpDate = tmpDate.substring(iIndex, tmpDate.length);
   if (sFormatPiece.indexOf("Y") >= 0)
   {
      var yr = parseInt(sDateTimePiece, 10);
      if(sDateTimePiece.length <= 2)
      {
         if(yr >= 50)
            yr += 1900;
         else
            yr += 2000;
      }
      setFullYear(yr);
   }
   else if (sFormatPiece.indexOf("MMMM") >= 0)
   {
      for (index1=0;index1<monthLongArray.length;index1++)
      { 
         if (sDateTimePiece == monthLongArray[index1])
         {
            setMonth(index1);
         }
      }
   }
   else if (sFormatPiece.indexOf("MMM") >= 0)
   {  
      monthArray = monthList.split(";;");             //fix for bug#10462482
      for (index2=0;index2<monthArray.length;index2++)//fix for bug#10462482
      { 
         if (sDateTimePiece == monthArray[index2])
         {
            setMonth(index2);
         }
      }
   }
   else if (sFormatPiece.indexOf("MM") >= 0 && sDateTimePiece.indexOf("0") == 0)
   {
      setMonth(parseInt(sDateTimePiece.substring(1,sDateTimePiece.length)) - 1);
   }
   else if (sFormatPiece.indexOf("MM") >= 0 || sFormatPiece.indexOf("M") >= 0)
   {
      setMonth(parseInt(sDateTimePiece)-1);
   }
   // can' set the day using DDDD or DDD since we won't know the day of the month to use
   else if (sFormatPiece.indexOf("DDDD") >= 0)
   {
      for (i1=0;i1<weekdayLongArray.length;i1++)
      { 
         if (sDateTimePiece == weekdayLongArray[i1])
        {
		   iIndex = tmpDate.indexOf(weekdayLongArray[i1]);
		   tmpDate = tmpDate.substring(i1 + weekdayLongArray[i1] - 1 , tmpDate.length);
         }
      }
   }
   else if (sFormatPiece.indexOf("DDD") >= 0)
   {
      for (i2=0;i2<weekdayArray.length;i2++)
      { 
         if (sDateTimePiece == weekdayArray[i2])
         {
		   iIndex = tmpDate.indexOf(weekdayArray[i2]);
		   tmpDate = tmpDate.substring(i2 + weekdayArray[i2] - 1 , tmpDate.length);
         }
      }
   }
   else if (sFormatPiece.indexOf("DD") >= 0 &&sDateTimePiece.indexOf("0") == 0)
   {
      calDate.setDate(parseInt(sDateTimePiece.substring(1,sDateTimePiece.length)));
   }
   else if (sFormatPiece.indexOf("DD") >= 0 || sFormatPiece.indexOf("D") >= 0)
   {
      calDate.setDate(parseInt(sDateTimePiece));
   }
   
   else if (sFormatPiece.indexOf("HH") >= 0 || sFormatPiece.indexOf("H") >= 0)
   {
      tmpHours = parseInt(sDateTimePiece, 10);
      b24HourClock = true;
      bAppendTimezone = true;
   }
   else if (sFormatPiece.indexOf("hh") >= 0 || sFormatPiece.indexOf("h") >= 0)
   {
      tmpHours = parseInt(sDateTimePiece, 10);
      b24HourClock = false;
      bAppendTimezone = true;
   }
   else if (sFormatPiece.indexOf("mm") >= 0 || sFormatPiece.indexOf("m") >= 0)
   {
      calDate.setMinutes(parseInt(sDateTimePiece, 10));
   }
   else if (sFormatPiece.indexOf("ss") >= 0 || sFormatPiece.indexOf("s") >= 0)
   {
      calDate.setSeconds(parseInt(sDateTimePiece, 10));
   }
   else if (sFormatPiece.indexOf("p") >= 0 || sFormatPiece.indexOf("p") >= 0)
   {
      if (sDateTimePiece.indexOf(sAM) >= 0) {tmpAM = "AM";}
      else {tmpAM = "PM";}
   }
}

// SET THE INITIAL TIME TO NOW OR TO THE EXISTING VALUE IN timeField
function setInitialTime() {
   calDate = new Date(2004, 1, 1);  
   calDate.setSeconds(0);
   
   parseFormat();
   if (!b24HourClock)
   {
      if (tmpAM == "PM" && tmpHours != 12) {tmpHours = tmpHours + 12;}
      else if (tmpAM =="AM" && tmpHours == 12) {tmpHours = 0;}
   }
   calDate.setHours(tmpHours);

    // IF THE INCOMING DATE IS INVALID, USE THE CURRENT DATE
    if (isNaN(calDate)) {
        calDate = new Date();
        calDate.setSeconds(0);
    }
}

// POPUP A WINDOW WITH THE CALENDAR IN IT
function createUTCCalendarFrame(s_winTitle) 
{
   if (isCalendarBusy()) 
      return;
    
	SWECalendarFrameset = "<HTML><HEAD><TITLE>" + s_winTitle + "</TITLE></HEAD>";

   SWECalendarFrameset +=
   "<FRAMESET ROWS='37,120,70,*' BORDER='0' FRAMEBORDER='0' " + 
   "onload='topCalFrame.document.open();topCalFrame.document.write(parent.opener.calDocTop);topCalFrame.document.close ();bottomCalFrame.document.open();bottomCalFrame.document.write(parent.opener.calDocBottom);bottomCalFrame.document.close ();timeFrame.document.open();timeFrame.document.write(parent.opener.timeDoc);timeFrame.document.close ();buttonFrame.document.open();buttonFrame.document.write(parent.opener.buttonDoc); buttonFrame.document.close (); parent.opener.InitKeyHandler();  parent.opener.SetFocusToFirstElement();'>\n" + 
//Bug:11671230 :- Adding title to frames   
   "  <FRAME NAME='topCalFrame' marginheight='5' SRC='javascript:\"\"' SCROLLING='no' FRAMEBORDER='0' title='"+topCalFrameTitle+"'>\n" +
   "  <FRAME NAME='bottomCalFrame' marginheight='5' SRC='javascript:\"\"' SCROLLING='auto' FRAMEBORDER='0' title='"+bottomCalFrameTitle+"'>\n" +
   "  <FRAME NAME='timeFrame' marginheight='5' SRC='javascript:\"\"' SCROLLING='no' FRAMEBORDER='0' title='"+timeFrameTitle+"'>\n" +
   "  <FRAME NAME='buttonFrame' marginheight='5' marginwidth='5' SRC='javascript:\"\"' SCROLLING='no' FRAMEBORDER='0' title='"+buttonFrameTitle+"'>";
      
   SWECalendarFrameset += 
      "</FRAMESET></HTML>";
   // Expanding window width 
   if (bAccessibilityOn)
    {  
       displayCalendarPopup (SWECalendarFrameset, 900, 300);	
	}
	else
	{
	   displayCalendarPopup (SWECalendarFrameset, 478, 300);
	}
}


function createTimeCalendarFrame(s_winTitle) 
{
      if (isCalendarBusy()) 
         return;
      
		SWECalendarFrameset = "<HTML><HEAD><TITLE>" + s_winTitle + "</TITLE></HEAD>";

        
        // To lower risk, for .200 added separate if statement. In future, want to combine this 
        // block with the block of code used for Netscape, Mac and AOL 7
        if (isIE50) // 12-EL3MJ8
        {
            SWECalendarFrameset += 
            "<FRAMESET ROWS='37,120,40,*'  BORDER='0' " + 
                   "onload='topCalFrame.document.open();topCalFrame.document.write(parent.opener.calDocTop);topCalFrame.document.close ();bottomCalFrame.document.open();bottomCalFrame.document.write(parent.opener.calDocBottom);bottomCalFrame.document.close (); timeFrame.document.open();timeFrame.document.write(parent.opener.timeDoc);timeFrame.document.close ();buttonFrame.document.open();buttonFrame.document.write(parent.opener.buttonDoc);buttonFrame.document.close ();parent.opener.InitKeyHandler();  parent.opener.SetFocusToFirstElement();'>\n" + 
//Bug:11671230 :- Adding title to frames 				   
            "  <FRAME NAME='topCalFrame' marginheight='5' SCROLLING='no' FRAMEBORDER='0'  title='"+topCalFrameTitle+"'>\n" +
            "  <FRAME NAME='bottomCalFrame' marginheight='5' SCROLLING='auto' FRAMEBORDER='0' title='"+bottomCalFrameTitle+"'>\n" +
            "  <FRAME NAME='timeFrame' marginheight='5' SCROLLING='no' FRAMEBORDER='0' title='"+timeFrameTitle+"'>\n" +
            "  <FRAME NAME='buttonFrame' marginheight='5' marginwidth='5' SCROLLING='no' FRAMEBORDER='0' title='"+buttonFrameTitle+"'>";
        }
        //IE7 Check - CR # 12-1H09LEB & IE6 check for FR# 12-1V059B0
         else if (isIE70 || isIE60)
        {
            SWECalendarFrameset += 
            "<FRAMESET ROWS='37,120,40,*'  BORDER='0' " + 
                   "onload='topCalFrame.document.open();topCalFrame.document.write(parent.opener.calDocTop);topCalFrame.document.close ();bottomCalFrame.document.open();bottomCalFrame.document.write(parent.opener.calDocBottom);bottomCalFrame.document.close (); timeFrame.document.open();timeFrame.document.write(parent.opener.timeDoc);timeFrame.document.close ();buttonFrame.document.open();buttonFrame.document.write(parent.opener.buttonDoc);buttonFrame.document.close ();parent.opener.InitKeyHandler();  parent.opener.SetFocusToFirstElement();'>\n" +
//Bug:11671230 :- Adding title to frames 				   
            "  <FRAME NAME='topCalFrame' marginheight='5' SRC='javascript:\"\"' SCROLLING='no' FRAMEBORDER='0' title='"+topCalFrameTitle+"'>\n" +
            "  <FRAME NAME='bottomCalFrame' marginheight='5' SRC='javascript:\"\"' SCROLLING='auto' FRAMEBORDER='0'  title='"+bottomCalFrameTitle+"'>\n" +
            "  <FRAME NAME='timeFrame' marginheight='5' SRC='javascript:\"\"' SCROLLING='no' FRAMEBORDER='0' title='"+timeFrameTitle+"'>\n" +
            "  <FRAME NAME='buttonFrame' marginheight='5' marginwidth='5' SRC='javascript:\"\"' SCROLLING='no' FRAMEBORDER='0' title='"+buttonFrameTitle+"'>";
        }
        
        else if (!isNav && !isMac && !isAOL7orGreater) 
        {
            SWECalendarFrameset += 
            "<FRAMESET ROWS='37,120,40,*' FRAMEBORDER='0'>\n" +
//Bug:11671230 :- Adding title to frames 
            "  <FRAME NAME='topCalFrame' marginheight='5' SRC='javascript:parent.opener.calDocTop' SCROLLING='no' title='"+topCalFrameTitle+"'>\n" +
            "  <FRAME NAME='bottomCalFrame' marginheight='5' SRC='javascript:parent.opener.calDocBottom' SCROLLING='auto'  title='"+bottomCalFrameTitle+"'>\n" +
            "  <FRAME NAME='timeFrame' marginheight='5' SRC='javascript:parent.opener.timeDoc' SCROLLING='no' title='"+timeFrameTitle+"'>\n" +
            "  <FRAME NAME='buttonFrame' marginheight='5' marginwidth='25' SRC='javascript:parent.opener.buttonDoc' SCROLLING='no' title='"+buttonFrameTitle+"'>\n";
        }
        else
        {
            SWECalendarFrameset += 
            "<FRAMESET ROWS='37,120,40,*'  BORDER='0' " + 
                   "onload='topCalFrame.document.open();topCalFrame.document.write(parent.opener.calDocTop);topCalFrame.document.close ();bottomCalFrame.document.open();bottomCalFrame.document.write(parent.opener.calDocBottom);bottomCalFrame.document.close (); timeFrame.document.open();timeFrame.document.write(parent.opener.timeDoc);timeFrame.document.close ();buttonFrame.document.open();buttonFrame.document.write(parent.opener.buttonDoc);buttonFrame.document.close ();parent.opener.InitKeyHandler();  parent.opener.SetFocusToFirstElement();'>\n" + 
//Bug:11671230 :- Adding title to frames 				   
            "  <FRAME NAME='topCalFrame' marginheight='5' SRC='javascript:\"\"' SCROLLING='no' FRAMEBORDER='0' title='"+topCalFrameTitle+"'>\n" +
            "  <FRAME NAME='bottomCalFrame' marginheight='5' SRC='javascript:\"\"' SCROLLING='auto' FRAMEBORDER='0' title='"+bottomCalFrameTitle+"'>\n" +
            "  <FRAME NAME='timeFrame' marginheight='5' SRC='javascript:\"\"' SCROLLING='no' FRAMEBORDER='0' title='"+timeFrameTitle+"'>\n" +
            "  <FRAME NAME='buttonFrame' marginheight='5' marginwidth='5' SRC='javascript:\"\"' SCROLLING='no' FRAMEBORDER='0' title='"+buttonFrameTitle+"'>";
        }
        
        SWECalendarFrameset += "</FRAMESET></HTML>";

        displayCalendarPopup (SWECalendarFrameset, 478, 300)
 }
 
 function displayCalendarPopup (frameSet, nWidth, nHeight)
 {
    // DISPLAY THE CALENDAR IN A NEW POPUP WINDOW
    if (top.SWEJannaPopupWin && 
       typeof(top.SWEJannaPopupWin.closed) != "unknown" && 
       !top.SWEJannaPopupWin.closed)
    {
       top.SWEJannaPopupWin.close();
    }

    top.SWEJannaPopupWin = window.open("", 'jCalendar' , 'width=' + nWidth + ',height=' + nHeight + ',resizable');
    top.SWEJannaPopupWin.document.charset = document.charset;
    top.SWEJannaPopupWin.document.write(frameSet);
    top.SWEJannaPopupWin.document.close();    
    top.SWEJannaPopupWin.focus();        
    if (!isNav && !isMac && !isAOL7orGreater) 
    {
      InitKeyHandler();
      SetFocusToFirstElement();
   }      
   if (!Top().SWEIsHighInteract && isNav)
      top.CalendarBusy = false;
}

function createCalendarOnlyFrame(s_winTitle) 
{
      if (isCalendarBusy()) 
         return;
        
		SWECalendarFrameset = "<HTML><HEAD><TITLE>" + s_winTitle + "</TITLE></HEAD>";

        
        // To lower risk, for .200 added separate if statement. In future, want to combine this 
        // block with the block of code used for Netscape, Mac and AOL 7
        if (isIE50) // 12-EL3MJ8
        {
        SWECalendarFrameset +=
        "<FRAMESET ROWS='37,120,*' BORDER='0' " + 
               "onload='topCalFrame.document.open();topCalFrame.document.write(parent.opener.calDocTop);topCalFrame.document.close ();bottomCalFrame.document.open();bottomCalFrame.document.write(parent.opener.calDocBottom);bottomCalFrame.document.close ();buttonFrame.document.open();buttonFrame.document.write(parent.opener.buttonDoc);buttonFrame.document.close ();parent.opener.InitKeyHandler();  parent.opener.SetFocusToFirstElement();'>\n" + 
//Bug:11671230 :- Adding title to frames			   
        "  <FRAME NAME='topCalFrame' marginheight='5' SCROLLING='no' FRAMEBORDER='0' title='"+topCalFrameTitle+"'>\n" +
        "  <FRAME NAME='bottomCalFrame' marginheight='5' SCROLLING='auto' FRAMEBORDER='0' title='"+bottomCalFrameTitle+"'>\n" +
        "  <FRAME NAME='buttonFrame' marginheight='5' marginwidth='5' SCROLLING='no' FRAMEBORDER='0' title='"+buttonFrameTitle+"'>";
        }
        //IE7 Check CR # 12-1H09LEB & IE6 check for FR# 12-1V059B0
        else if (isIE70 || isIE60 ) 
        {
        SWECalendarFrameset +=
        "<FRAMESET ROWS='37,120,*' BORDER='0' " + 
               "onload='topCalFrame.document.open();topCalFrame.document.write(parent.opener.calDocTop);topCalFrame.document.close ();bottomCalFrame.document.open();bottomCalFrame.document.write(parent.opener.calDocBottom);bottomCalFrame.document.close ();buttonFrame.document.open();buttonFrame.document.write(parent.opener.buttonDoc);buttonFrame.document.close ();parent.opener.InitKeyHandler();  parent.opener.SetFocusToFirstElement();'>\n" + 
//Bug:11671230 :- Adding title to frames			   
        "  <FRAME NAME='topCalFrame' marginheight='5' SRC='javascript:\"\"' SCROLLING='no' FRAMEBORDER='0' title='"+topCalFrameTitle+"'>\n" +
        "  <FRAME NAME='bottomCalFrame' marginheight='5' SRC='javascript:\"\"' SCROLLING='auto' FRAMEBORDER='0' title='"+bottomCalFrameTitle+"'>\n" +
        "  <FRAME NAME='buttonFrame' marginheight='5' marginwidth='5' SRC='javascript:\"\"' SCROLLING='no' FRAMEBORDER='0' title='"+buttonFrameTitle+"'>";
        }
        else if (!isNav && !isMac && !isAOL7orGreater) 
        {
        SWECalendarFrameset +=
        "<FRAMESET ROWS='37,120,*' FRAMEBORDER='0'>\n" +
//Bug:11671230 :- Adding title to frames
        "  <FRAME NAME='topCalFrame' marginheight='5' SRC='javascript:parent.opener.calDocTop' SCROLLING='no' title='"+topCalFrameTitle+"'>\n" +
        "  <FRAME NAME='bottomCalFrame' marginheight='5' SRC='javascript:parent.opener.calDocBottom' SCROLLING='auto' title='"+bottomCalFrameTitle+"'>\n" +
        "  <FRAME NAME='buttonFrame' marginheight='5' marginwidth='5' SRC='javascript:parent.opener.buttonDoc' SCROLLING='no' title='"+buttonFrameTitle+"'>\n";
        }
        else
        {
        SWECalendarFrameset +=
        "<FRAMESET ROWS='37,120,*' BORDER='0' " + 
               "onload='topCalFrame.document.open();topCalFrame.document.write(parent.opener.calDocTop);topCalFrame.document.close ();bottomCalFrame.document.open();bottomCalFrame.document.write(parent.opener.calDocBottom);bottomCalFrame.document.close ();buttonFrame.document.open();buttonFrame.document.write(parent.opener.buttonDoc);buttonFrame.document.close ();parent.opener.InitKeyHandler();  parent.opener.SetFocusToFirstElement();'>\n" + 
//Bug:11671230 :- Adding title to frames			   
        "  <FRAME NAME='topCalFrame' marginheight='5' SRC='javascript:\"\"' SCROLLING='no' FRAMEBORDER='0' title='"+topCalFrameTitle+"'>\n" +
        "  <FRAME NAME='bottomCalFrame' marginheight='5' SRC='javascript:\"\"' SCROLLING='auto' FRAMEBORDER='0' title='"+bottomCalFrameTitle+"'>\n" +
        "  <FRAME NAME='buttonFrame' marginheight='5' marginwidth='5' SRC='javascript:\"\"' SCROLLING='no' FRAMEBORDER='0' title='"+buttonFrameTitle+"'>";
        }
        
        SWECalendarFrameset += "</FRAMESET></HTML>";
        
        displayCalendarPopup (SWECalendarFrameset, 478, 220);
}

function createTimeOnlyFrame(s_winTitle) 
{
    if (isCalendarBusy()) 
       return;
    
    SWECalendarFrameset = "<HTML><HEAD><TITLE>" + s_winTitle + "</TITLE></HEAD>";

    // To lower risk, for .200 added separate if statement. In future, want to combine this 
    // block with the block of code used for Netscape, Mac and AOL 7
    if (isIE50) // 12-EL3MJ8
    {
        SWECalendarFrameset +=
            "<FRAMESET ROWS='40,*'  BORDER='0' " + 
            "onload='timeFrame.document.open();timeFrame.document.write(parent.opener.timeDoc);timeFrame.document.close ();buttonFrame.document.open();buttonFrame.document.write(parent.opener.buttonDoc);buttonFrame.document.close ();parent.opener.InitKeyHandler();  parent.opener.SetFocusToFirstElement();'>\n" +
//Bug:11671230 :- Adding title to frames
            "  <FRAME NAME='timeFrame' marginheight='5' SCROLLING='no' FRAMEBORDER='0' title='"+timeFrameTitle+"'>\n" +
            "  <FRAME NAME='buttonFrame' marginheight='5' marginwidth='5' SCROLLING='no' FRAMEBORDER='0' title='"+buttonFrameTitle+"'>";
    }
    //IE7 Check CR # 12-1H09LEB & IE6 check for FR# 12-1V059B0
    else if (isIE70 || isIE60 ) 
    {
     SWECalendarFrameset +=
            "<FRAMESET ROWS='40,*'  BORDER='0' " + 
            "onload='timeFrame.document.open();timeFrame.document.write(parent.opener.timeDoc);timeFrame.document.close ();buttonFrame.document.open();buttonFrame.document.write(parent.opener.buttonDoc);buttonFrame.document.close ();parent.opener.InitKeyHandler();  parent.opener.SetFocusToFirstElement();'>\n" +
//Bug:11671230 :- Adding title to frames
            "  <FRAME NAME='timeFrame' marginheight='5' SRC='javascript:\"\"' SCROLLING='no' FRAMEBORDER='0' title='"+timeFrameTitle+"'>\n" +
            "  <FRAME NAME='buttonFrame' marginheight='5' marginwidth='5' SRC='javascript:\"\"' SCROLLING='no' FRAMEBORDER='0' title='"+buttonFrameTitle+"'>";
    }
    else if (!isNav && !isMac && !isAOL7orGreater) 
    {
        SWECalendarFrameset +=
            "<FRAMESET ROWS='40,*' FRAMEBORDER='0'>\n" +
//Bug:11671230 :- Adding title to frames
            "  <FRAME NAME='timeFrame' marginheight='5' SRC='javascript:parent.opener.timeDoc' SCROLLING='no' title='"+timeFrameTitle+"'>\n" +
            "  <FRAME NAME='buttonFrame' marginheight='5' marginwidth='5' SRC='javascript:parent.opener.buttonDoc' SCROLLING='no' title='"+buttonFrameTitle+"'>\n";
    }
    else
    {
        SWECalendarFrameset +=
            "<FRAMESET ROWS='40,*'  BORDER='0' " + 
            "onload='timeFrame.document.open();timeFrame.document.write(parent.opener.timeDoc);timeFrame.document.close ();buttonFrame.document.open();buttonFrame.document.write(parent.opener.buttonDoc);buttonFrame.document.close ();parent.opener.InitKeyHandler();  parent.opener.SetFocusToFirstElement();'>\n" +
//Bug:11671230 :- Adding title to frames
            "  <FRAME NAME='timeFrame' marginheight='5' SRC='javascript:\"\"' SCROLLING='no' FRAMEBORDER='0' title='"+timeFrameTitle+"'>\n" +
            "  <FRAME NAME='buttonFrame' marginheight='5' marginwidth='5' SRC='javascript:\"\"' SCROLLING='no' FRAMEBORDER='0' title='"+buttonFrameTitle+"'>";
    }

    SWECalendarFrameset += "</FRAMESET></HTML>";

    displayCalendarPopup (SWECalendarFrameset, 278, 100);
}

// return true if when we enter this method, top.CalendarBusy is set to true
function isCalendarBusy()
{
   // netscape bug: if user double clicks, don't allow two calendar frames to be created
   if (!Top().SWEIsHighInteract && isNav)
   {
      if (typeof (top.CalendarBusy) == "undefined" ||
          top.CalendarBusy == false)
      {
         top.CalendarBusy = true;
         return false;
      }
      else
      {
         top.CalendarBusy = false; // safeguard against infinite setting of busy
         return true;
      }
   }
   return false;
}

// CREATE THE TOP CALENDAR FRAME
function buildTopCalFrame() {
    padding = "&nbsp;&nbsp;";
	padding1= "&nbsp;";
    pyear = "<<";
    pmonth = "<";    
    nmonth = ">";
    nyear = ">>";
    if (bAccessibilityOn)
    {
      /*pyear = "Previous Year";
      pmonth = "Previous Month";
      nyear = "Next Year";
      nmonth = "Next Month";*/
	  pyear = sPyear + " : "+gTitle;//"Previous Year";
      pmonth = sPmonth+" : "+gTitle;//"Previous Month";
      nyear = sNyear+" : "+gTitle;//"Next Year";
      nmonth = sNmonth+" : "+gTitle;//"Next Month";
    }
    // CREATE THE TOP FRAME OF THE CALENDAR
    var calDoc =
      "<HTML" + sRTLmarkUp + "><HEAD><STYLE type='text/css'><!--" +
      "TD.heading { text-decoration: none; color:" + headingTextColor + "; font: " + headingFontStyle + "; }" +
      "INPUT { color: " + topButtonColor + "; font: " + myFontStyle + "; }" +
      "SELECT { color: " + topButtonColor + "; font: " + myFontStyle + "; }" +
      "A:link { color: " + headingLinkColor  + "; text-decoration: none; font: " + selectedDateStyle + "; }" +
      "A:hover { color: " + headingLinkColor  + "; text-decoration: none; font: " + selectedDateStyle + "; }" +
      "A:visited { color: " + headingLinkColor  + "; text-decoration: none; font: " + selectedDateStyle + "; }" +
      "--></STYLE></HEAD><BODY TABINDEX='-1' onload='if (navigator.userAgent.toUpperCase().match(/MAC/)) window.resizeBy(1,0);' BGCOLOR='" + topBackground + "'>" +
      "<FORM NAME='calControl' onSubmit='return false;'>" +      
      "<CENTER><TABLE CELLPADDING=0 CELLSPACING=1 BORDER=0><TR><TD COLSPAN=7><CENTER>" ;
	  if(bAccessibilityOn)
	  {
	      calDoc +="<input type='button' onclick='javascript:parent.opener.setPreviousYear()' value='"+padding1 + pyear + padding1 +"' id='SetPreviousYearAnchor'";          calDoc +="title='"+ pyear +"'>";
		  calDoc +="<input type='button' onclick='javascript:parent.opener.setPreviousMonth()' value='"+padding1 + pmonth + padding1  +"'  id='SetPreviousYearAnchor'";          calDoc +="title='" +pmonth +"'>";
	     
	  }
	  else
	  {
         calDoc +="<a id = 'SetPreviousYearAnchor' href='javascript:parent.opener.setPreviousYear()'>" + padding + pyear + padding + "</a>" ;
         calDoc +="<a id = 'SetPreviousMonthAnchor' href='javascript:parent.opener.setPreviousMonth()'>" + padding + pmonth + padding + "</a>";
	  }
      
      if (bMonthBeforeYear) {calDoc += getMonthSelect() +  padding + getYearSelect();}
      else { calDoc += getYearSelect()  +  padding + getMonthSelect()};
      if(bAccessibilityOn)
	  {
	      calDoc +="<input type='button' onclick='javascript:parent.opener.setNextMonth()' value='"+ padding + nmonth + padding +"' id='SetPreviousYearAnchor'"+           "title='"+ nmonth +"'>";
		  calDoc +="<input type='button' onclick='javascript:parent.opener.setNextYear()' value='"+padding + nyear + padding +"' id='SetPreviousYearAnchor'"+            "title='" + nyear + "'>";
	     
	  }
	  else
	  {
         calDoc += "<a id = 'SetNextMonthAnchor' href='javascript:parent.opener.setNextMonth()'>" + padding + nmonth + padding + "</a>" +
         "<a id = 'SetNextYearAnchor' href='javascript:parent.opener.setNextYear()'>" + padding + nyear + padding + "</a>" ;
         
	  }
      calDoc +="</CENTER></TD></TR></TABLE></CENTER></FORM></BODY></HTML>";   

    return calDoc;
}

// CREATE THE TOP CALENDAR FRAME
function buildTimeFrame() {
   var calDoc = "";
   var re = /h{1,2}\Wm{1,2}(\Ws)?/ig;

   // CHECK THE REQUESTED FORMAT TO SEE IF A CLOCK SHOULD BE SHOWN
   if ( calDateFormat.match(re)) {
      showClock = true;
   }
   else {
      showClock = false;
   }
      // CREATE THE TOP FRAME OF THE CALENDAR
      calDoc =
          "<HTML" + sRTLmarkUp + "><HEAD><STYLE type='text/css'>" +
                "<!--" +
             "TD.heading { text-decoration: none; color:" + headingTextColor + "; font: " + headingFontStyle + "; }" +
          "INPUT { color: " + topButtonColor + "; font: " + myFontStyle + "; }" +
             "SELECT { color: " + topButtonColor + "; font: " + myFontStyle + "; }" +
             "--></STYLE></HEAD>" +
          "<BODY TABINDEX='-1' onload='if (navigator.userAgent.toUpperCase().match(/MAC/)) window.resizeBy(1,0);' BGCOLOR='" + timeBackground + "'>" +

          "<FORM NAME='calControl' onSubmit='return false;'><CENTER><TABLE CELLPADDING=0 CELLSPACING=1 BORDER=0><TR><TD COLSPAN=7><CENTER>";
          
          if (bRTL)
          {
            calDoc +=
            getPMSelect() +
            getMinuteSelect() + 
            "&nbsp;&nbsp;" + getHourSelect();
          }
          else
          { 
            strDateFormat = calDateFormat.toUpperCase();
            if(strDateFormat.length != 0 && (strDateFormat.indexOf("P") < strDateFormat.indexOf("H")))
                  calDoc += getPMSelect() +
                            getHourSelect() + "&nbsp;&nbsp;" +
                            getMinuteSelect();
            else
                  calDoc += getHourSelect() + "&nbsp;&nbsp;" +
                            getMinuteSelect() +
                            getPMSelect();
          }
         
      calDoc +=
// COLSPAN=7      
          "</CENTER></TD></TR><TR><TD>";
            if (showTimeZone ){
          calDoc += "<CENTER>" +
          getTimeZones() +
          "</CENTER>";
         }
            calDoc += "</TD></TR></TABLE></CENTER></FORM></BODY></HTML>";

    return calDoc;
}

// CREATE THE TOP CALENDAR FRAME
function buildTimeZoneFrame() {
   var calDoc = "";
   // CREATE THE TOP FRAME OF THE CALENDAR
   calDoc =
       "<HTML" + sRTLmarkUp + "><HEAD><STYLE type='text/css'><!--" +
       "INPUT { color: " + topButtonColor + "; font: " + myFontStyle + "; }" +
       "SELECT { color: " + topButtonColor + "; font: " + myFontStyle + "; }" +
       "OPTION { color: " + topButtonColor + "; font: " + myFontStyle + "; }" +
       "OPTION SELECTED { color: " + topButtonColor + "; font: " + myFontStyle + "; }" +
          "--></STYLE></HEAD><BODY TABINDEX='-1' BGCOLOR='" + timeBackground + "'>" +
       "<FORM NAME='calControl' onSubmit='return false;'>" +       
       "<CENTER><TABLE CELLPADDING=0 CELLSPACING=1 BORDER=0><TR><TD COLSPAN=7><CENTER>" +
       getTimeZones() +
       "</CENTER></TD></TR></TABLE></CENTER></FORM></BODY></HTML>";

    return calDoc;
}

// CREATE THE TOP TIME FRAME.  THIS IS NEEDED FOR NETSCAPE TO DISPLAY THE FRAMES PROPERLY
function buildButtonFrame() {
    var ButtonAlignment = "right";
    var baseHref = isMac? document.location.href.split("start.swe")[0]:"";  //Mac needs to write explicit base HREF
    var lcap = baseHref + "images/btn_opn_d.gif";
    var rcap = baseHref + "images/btn_cls_d.gif";
    var backgrnd = baseHref + "images/btn_back2.gif";
    var space = baseHref + "images/spacer.gif";
    var strOkButton;
    var strCancelButton;
    
    if (bRTL)
    {
       ButtonAlignment = "left";
    }
    // CREATE THE TOP FRAME OF THE TIME SETTER
    var exitDoc =
         "<HTML" + sRTLmarkUp + "><HEAD><STYLE type='text/css'><!--" +
         "INPUT {BGCOLOR: " + exitFrameBG + " color: " + topButtonColor + "; font: " + myFontStyle + "; }" +
         "A:link { color: " + topButtonColor + "; text-decoration: none; font: " + myFontStyle + "; }" +
         "A:hover { color: " + topButtonColor + "; text-decoration: none; font: " + myFontStyle + "; }" +
         "A:visited { color: " + topButtonColor + "; text-decoration: none; font: " + myFontStyle + "; }" +
         "--></STYLE></HEAD>" +
         "<BODY TABINDEX='-1' onload='if (navigator.userAgent.toUpperCase().match(/MAC/)) window.resizeBy(1,0);' BGCOLOR='" + exitFrameBG + "'>"; //jwu

                
                  
         if ((navigator.userAgent.toUpperCase().match(/NETSCAPE/) && parseInt(navigator.appVersion) >= 5)
             || (navigator.userAgent.indexOf("Mozilla/5.0 (OS/2")>=0))
         {
            var buttonStyle = "border-bottom:1px solid gray;border-top:1px solid white;border-left:1px solid white;border-right:1px solid gray";
            if (bAccessibilityOn)
            {
               strOkButton = "<td nowrap STYLE='"+buttonStyle+"' class='minibuttonOn'>&nbsp;<input type='Button' onclick='JavaScript:parent.opener.returnNewDate()' TABINDEX='1' title='" + saveLabel + "' value='" + saveLabel + "'>&nbsp;</td>";
               strCancelButton = "<td nowrap STYLE='"+buttonStyle+"' class='minibuttonOn'>&nbsp;<input type='Button' onclick='JavaScript:parent.opener.returnInDate()' TABINDEX='2' title='" + cancelLabel + "' value='" + cancelLabel + "'>&nbsp;</td>";
            }
            
            else
            {
               strOkButton = "<td nowrap STYLE='"+buttonStyle+"' class='minibuttonOn'>&nbsp;<a name = 'SaveBtn' href='JavaScript:parent.opener.returnNewDate()' TABINDEX='1'>" + saveLabel + "</a>&nbsp;</td>";
               strCancelButton = "<td nowrap STYLE='"+buttonStyle+"' class='minibuttonOn'>&nbsp;<a href='JavaScript:parent.opener.returnInDate()' TABINDEX='2'>" + cancelLabel + "</a>&nbsp;</td>";
            }
            
            exitDoc += "<P ALIGN='" + ButtonAlignment + "'>" + 
                       "<TABLE CELLPADDING=0 CELLSPACING=0 BORDER=0><TR>" + strOkButton + "<td>&nbsp;&nbsp;</td>" + strCancelButton;            
         }
         else
         { 
            if (bAccessibilityOn)
            {
               strOkButton = "<td class='minibuttonOn'><nobr><input type='Button' onclick='JavaScript:parent.opener.returnNewDate()' TABINDEX='1' title='" + saveLabel + "' value='" + saveLabel + "'></nobr></td>";
               strCancelButton = "<td><img src='" + space + "' width='2' height='15' alt=''></td>" + "<td class='minibuttonOn'><nobr><input type='Button' onclick='JavaScript:parent.opener.returnInDate()' TABINDEX='2' title='" + cancelLabel + "' value='" + cancelLabel + "'></nobr></td>";
            }        
            else
            {
               strOkButton = "<td WIDTH='6'><img src='" + lcap + "' height='15' width='6' alt=''></td>" + "<td BACKGROUND='" + backgrnd + "' class='minibuttonOn'><nobr><a name = 'SaveBtn' href='JavaScript:parent.opener.returnNewDate()' TABINDEX='2'>" + saveLabel + "</a></nobr></td>"
               strCancelButton = "<td ALIGN='RIGHT' WIDTH='6'><img src='" + rcap + "' height='15' width='6' alt=''></td>" + "<td><img src='" + space + "' width='2' height='15' alt=''></td>" + "<td WIDTH='6'><img src='" + lcap + "' height='15' width='6' alt=''></td>" + "<td BACKGROUND='" + backgrnd + "' class='minibuttonOn'><nobr><a href='JavaScript:parent.opener.returnInDate()' TABINDEX='2'>" + cancelLabel + "</a></nobr></td>" + "<td ALIGN='RIGHT' WIDTH='6'><img src='" + rcap + "' height='15' width='6' alt=''></td>";
            }
            exitDoc +=
            "<TABLE CELLPADDING=0 CELLSPACING=1 BORDER=0 ALIGN='" + ButtonAlignment + "'><TR>" + strOkButton + strCancelButton;
            
         }
         
         exitDoc += "</TR></TABLE></BODY></HTML>";
    
    
    return exitDoc ;
}

// tells the Script to return the newdate
function returnNewDate() {
   returnDate(1);
}

// Tells the Script to return the original date
function returnInDate() {
   returnDate(0);
}

// CREATE THE BOTTOM CALENDAR FRAME 
function buildBottomCalFrame() { 
	var nWeek = 1;
	var weekdays = createWeekdayList();
	// added SUMMARY and datatable properties to table, so that screen reader read this as data table
	var calDoc = calendarBegin +"<TABLE SUMMARY='"+gTitle+"' datatable=1 CELLPADDING=0 CELLSPACING=1 BORDER=0 ALIGN=CENTER BGCOLOR='" + tableBGColor + "'>" + weekdays; 

	if(!bAccessibilityOn)
	{
	calDoc += "<TR><TD></TD>";
	}
	else
	{
	// Calendar table inspector issues : adding row header
	calDoc += "<TR><TD align=left bgcolor='" + cellColor + "' scope='row'> &nbsp;&nbsp;"+ sWeek +" "+nWeek+"&nbsp;&nbsp;</TD>";
	nWeek++;
	}
  
   var tabIndx = "";
   month = calDate.getMonth();
   year = calDate.getFullYear();
   day = calDate.getDate();
   var i = 0;
   var days = getDaysInMonth();
   var firstOfMonth = new Date (year, month, 1);
   
   // GET THE DAY OF THE WEEK THE FIRST DAY OF THE MONTH FALLS ON
   startingPos  = firstOfMonth.getDay();
   // offset start of week if another day was chosen
   startingPos = startingPos - startDay;
   if (startingPos < 0) { startingPos = startingPos + 7; }
   days += startingPos;
   // KEEP TRACK OF THE COLUMNS, START A NEW ROW AFTER EVERY 7 COLUMNS
   var columnCount = 0;
   // MAKE BEGINNING NON-DATE CELLS BLANK
   for (i = 0; i < startingPos; i++) {
      calDoc += blankCell;
      columnCount++;
   }

   // SET VALUES FOR DAYS OF THE MONTH
   var currentDay = 0;
   var dayType = "weekday";

   // DATE CELLS CONTAIN A NUMBER
   for (i = startingPos; i < days; i++) 
   {
      var paddingChar = "&nbsp;";
      var cCellColor = cellColor;

      // ADJUST SPACING SO THAT ALL LINKS HAVE RELATIVELY EQUAL WIDTHS
      if (i-startingPos+1 < 10) {
         padding = "&nbsp;&nbsp;";
      }
      else {
         padding = "&nbsp;";
      }

      // GET THE DAY CURRENTLY BEING WRITTEN
      currentDay = i-startingPos+1;

      // SET THE TYPE OF DAY, THE focusDay GENERALLY APPEARS AS A DIFFERENT COLOR
      if (currentDay == day) {
         dayType = "focusDay";
         cCellColor = currentCellColor; 
         tabIndx = "tabindex=1"
      }
      else {
         dayType = "weekday";
      }

      // ADD THE DAY TO THE CALENDAR STRING
	  // Resolving Table inspector issues : added row header
	  calDoc += "<TD align=center bgcolor='" + cCellColor + "' scope=''>" +
					  "<a " + tabIndx + " ID='Day"+ currentDay +"' class='" + dayType + "' href='javascript:parent.opener.setCalDay(" +
					  currentDay + ")'>" + padding + currentDay + paddingChar + "</a></TD>";
		
	  columnCount++;
      // START A NEW ROW WHEN NECESSARY
      if (columnCount % 7 == 0) {
	    
		    if(!bAccessibilityOn)
			{
		      calDoc += "</TR><TR><TD></TD>";
			}
			else
			{
			   // Resolving table inspector issues :Added row header
			   calDoc += "</TR><TR><TD align=left bgcolor='" + cCellColor + "' scope='row'> &nbsp;&nbsp;"+sWeek+" "+nWeek+" &nbsp;&nbsp;</TD>";
			   nWeek++;
			}
	         
      }
   }

   // MAKE REMAINING NON-DATE CELLS BLANK
   //Removed blank row for accessibility mode
   if(bAccessibilityOn)
   {
	   for (i=days; i<35; i++)  {
		  calDoc += blankCell;
		  columnCount++;

		  // START A NEW ROW WHEN NECESSARY
		  if (columnCount % 7 == 0) {
			 calDoc += "</TR>";
			 if (i<34) {
			    // Resolving table inspector issues :Added row header
				calDoc += "<TR><TD align=left bgcolor='" + cCellColor + "' scope='row'> &nbsp;&nbsp;"+sWeek+" "+nWeek+" &nbsp;&nbsp;</TD>";
				nWeek++;
			 }
		  }
	   }
	}
	else
	{
   	   for (i=days; i<42; i++)  {
		  calDoc += blankCell;
		  columnCount++;

		  // START A NEW ROW WHEN NECESSARY
		  if (columnCount % 7 == 0) {
			 calDoc += "</TR>";
			 if (i<41) {
				calDoc += "<TR>";
			 }
		  }
	   }
   }
   
   calDoc += calendarEnd;
   return calDoc;
}

function setCalDay(inDay) {
    calDate.setDate(inDay);
    writeCalDays();	

    SetFocusById (false, "Day" + inDay);
}

function updateMonth()
{
   var activeMonth = calDate.getMonth(); 
   top.SWEJannaPopupWin.topCalFrame.document.calControl.month.selectedIndex = activeMonth;
}

function updateYear()
{
    var activeYear = calDate.getFullYear();
    var i = parseInt(activeYear) - 4;
    var selOptions = top.SWEJannaPopupWin.topCalFrame.document.calControl.year.options;
    
    for (var j = 0 ; j < selOptions.length; ++j) 
    {      
      selOptions[j].text = i;
      ++i;        
    }
    
    top.SWEJannaPopupWin.topCalFrame.document.calControl.year.selectedIndex = 4;    
}

function updateCalendar()
{
   if (!timeOnly) 
   {
      updateMonth();
      updateYear();
      
      calDocBottom = buildBottomCalFrame();
      top.SWEJannaPopupWin.bottomCalFrame.document.open();
      top.SWEJannaPopupWin.bottomCalFrame.document.write(calDocBottom );
      top.SWEJannaPopupWin.bottomCalFrame.document.close();    
      
      InitKeyHandler();
   }
}

function writeCalDays() 
{
   if (!timeOnly) 
   {
      calDocBottom = buildBottomCalFrame();

      top.SWEJannaPopupWin.bottomCalFrame.document.open();
      top.SWEJannaPopupWin.bottomCalFrame.document.write(calDocBottom );
      top.SWEJannaPopupWin.bottomCalFrame.document.close();          
      
      InitKeyHandler();
   }
}

// SET THE CALENDAR TO TODAY'S DATE AND DISPLAY THE NEW CALENDAR
function setToday() {
    calDate = new Date();
    var month = calDate.getMonth();
    var year  = calDate.getFullYear();
    top.SWEJannaPopupWin.topCalFrame.document.calControl.month.selectedIndex = month;
    top.SWEJannaPopupWin.topCalFrame.document.calControl.year.value = year;    
    updateCalendar();
}

// SET THE GLOBAL DATE TO THE NEWLY ENTERED YEAR AND REDRAW THE CALENDAR
function setYear() {
    // GET THE NEW YEAR VALUE
    var year  = top.SWEJannaPopupWin.topCalFrame.document.calControl.year.value;
    if (isFourDigitYear(year)) {
        setFullYear(year);           
        updateCalendar();
    }
    else {
        // HIGHLIGHT THE YEAR IF THE YEAR IS NOT FOUR DIGITS IN LENGTH
        top.SWEJannaPopupWin.topCalFrame.document.calControl.year.focus();
        top.SWEJannaPopupWin.topCalFrame.document.calControl.year.select();
    }
}

// SET THE GLOBAL DATE TO THE SELECTED MONTH AND REDRAW THE CALENDAR
function setCurrentMonth() {    
    var month = top.SWEJannaPopupWin.topCalFrame.document.calControl.month.selectedIndex;    
    setMonth(month);
    updateCalendar();     
    top.SWEJannaPopupWin.topCalFrame.document.calControl.month.focus();
}

// SET THE GLOBAL DATE TO THE SELECTED MONTH AND REDRAW THE CALENDAR
function setCurrentYear() {    
    var year = top.SWEJannaPopupWin.topCalFrame.document.calControl.year.selectedIndex;    
    setFullYear(year + calDate.getFullYear() - 4);
    updateCalendar(); 
    top.SWEJannaPopupWin.topCalFrame.document.calControl.year.focus();    
}

// SET THE GLOBAL DATE TO THE PREVIOUS YEAR AND REDRAW THE CALENDAR
function setPreviousYear() {
    var year  = calDate.getFullYear();  
   
    year--;
    setFullYear(year);
    updateCalendar();
    SetFocusById(true, "SetPreviousYearAnchor");
}

// SET THE GLOBAL DATE TO THE PREVIOUS MONTH AND REDRAW THE CALENDAR
function setPreviousMonth() {
    var year  = calDate.getFullYear();  
    var month = top.SWEJannaPopupWin.frames['topCalFrame'].document.calControl.month.selectedIndex;
    // IF MONTH IS JANUARY, SET MONTH TO DECEMBER AND DECREMENT THE YEAR
    if (month == 0) {
        month = 11;
        if (year > 1000) {
            year--;
            calDate.setFullYear(year);
        }
    }
    else 
    {
       month--;
    }
    setMonth(month);
    top.SWEJannaPopupWin.topCalFrame.document.calControl.month.selectedIndex = month;    
    updateCalendar();
    SetFocusById(true, "SetPreviousMonthAnchor");
}

// SET THE GLOBAL DATE TO THE NEXT MONTH AND REDRAW THE CALENDAR
function setNextMonth() 
{
   var year = calDate.getFullYear(); 
   var month = top.SWEJannaPopupWin.topCalFrame.document.calControl.month.selectedIndex;
   // IF MONTH IS DECEMBER, SET MONTH TO JANUARY AND INCREMENT THE YEAR
   if (month == 11) 
   {
      month = 0;
      year++;
      calDate.setFullYear(year);
   }
   else 
   {
      month++;
   }
   setMonth(month);

   top.SWEJannaPopupWin.topCalFrame.document.calControl.month.selectedIndex = month;   
   updateCalendar();
   SetFocusById(true, "SetNextMonthAnchor");
}

// SET THE GLOBAL DATE TO THE NEXT YEAR AND REDRAW THE CALENDAR
function setNextYear() 
{
    var year  = calDate.getFullYear(); 
    year++;
    setFullYear(year);
    updateCalendar();
    SetFocusById(true, "SetNextYearAnchor");
}

function getDaysInMonth()  {
    var days;
    var month = calDate.getMonth()+1;
    var year  = calDate.getFullYear();
    // RETURN 31 DAYS
    if (month==1 || month==3 || month==5 || month==7 || month==8 ||
        month==10 || month==12)  {
        days=31;
    }
    // RETURN 30 DAYS
    else if (month==4 || month==6 || month==9 || month==11) {
        days=30;
    }
    // RETURN 29 DAYS
    else if (month==2)  {
        if (isLeapYear(year)) {
            days=29;
        }
        // RETURN 28 DAYS
        else {
            days=28;
        }
    }
    return (days);
}

function isLeapYear (Year) {
    if (((Year % 4)==0) && ((Year % 100)!=0) || ((Year % 400)==0)) {
        return (true);
    }
    else {
        return (false);
    }
}

function isFourDigitYear(year) {
    if (year.length != 4) {
    }
    else {
        return true;
    }
}

function setCurrentHour() {
   var hour = top.SWEJannaPopupWin.timeFrame.document.calControl.hour.selectedIndex;
   if (b24HourClock)
   {
      calDate.setHours(hour);
   }
   else
   {   
      var period = 0;
      hour += 1;

      if (parseInt(calDate.getHours()) > 11) {
         period = 12;
      }
      if (hour == 12) 
         hour = 0;
      calDate.setHours(hour + period);
   }

}

function setCurrentMinutes() {
    var minutes = top.SWEJannaPopupWin.timeFrame.document.calControl.minute.selectedIndex;
    if (minuteIndexOffest == 1 && minutes == 0)
    {
        calDate.setMinutes(minutesIn);
    }
    else
    {
        calDate.setMinutes((minutes - minuteIndexOffest) * 5);
    }
}

function setCurrentPeriod() {
    var period = top.SWEJannaPopupWin.timeFrame.document.calControl.pm.selectedIndex;
    var hour = calDate.getHours();
    // period selected changes from PM to AM
    if (parseInt(hour) > 11 && period == '0') {
      hour -= 12;
    }
    // period selected changes from AM to PM
    else if (parseInt(hour) < 12 && period == '1') {
      hour += 12;
    }
    calDate.setHours(hour);

}

function setTimeZone() {
    timeZone = top.SWEJannaPopupWin.timeFrame.document.calControl.timeZone.selectedIndex;
}

function getMonthSelect() {
    monthArray = monthList.split(";;");
    monthLongArray = monthLongList.split(";;");
    var activeMonth = calDate.getMonth();
    monthSelect = "<SELECT NAME='month' onChange='parent.opener.setCurrentMonth()' Title='"+tMonth+"'>";
    // LOOP THROUGH MONTH ARRAY
    for (i in monthArray) {
        // SHOW THE CORRECT MONTH IN THE SELECT LIST
        if (i == activeMonth) {
            monthSelect += "<OPTION SELECTED>" + monthArray[i] + "\n";
        }
        else {
            monthSelect += "<OPTION>" + monthArray[i] + "\n";
        }
    }
    monthSelect += "</SELECT>";
    return monthSelect;
}

function delayCalFocus()
{
   top.SWEJannaPopupWin.iCalModalTimeout=10000;
   top.SWEJannaPopupWin.thisCal = top.SWEJannaPopupWin.topCalFrame.document.calControl.month;
}

function getYearSelect() {
    var activeYear = calDate.getFullYear();
    var i = parseInt(activeYear) - 4;
    var yearSelect = "<SELECT NAME='year' onChange='parent.opener.setCurrentYear()' Title='"+tYear+"'>";
    for (i ; i < parseInt(activeYear)+5;  i++) {
        if (i == parseInt(activeYear)) {
            yearSelect += "<OPTION SELECTED>" + i + "\n";
        }
        else {
            yearSelect += "<OPTION>" + i + "\n";
        }
    }
    yearSelect += "</SELECT>";
    return yearSelect;
}

function createWeekdayList() {
    weekdayArray = weekList.split(";;");
    weekdayLongArray = weekLongList.split(";;");
    if (startDay != 0)
    {
       newWeekList = new Array(' ',' ',' ',' ',' ',' ',' ');
       newWeekLongList = new Array(' ',' ',' ',' ',' ',' ',' ');
       for (i in weekdayArray)  {
          if ( i-startDay < 0)
          {
             newWeekList[i-startDay+7] = "&nbsp " + weekdayArray[i] + " &nbsp";
             newWeekLongList[i-startDay+7] = "&nbsp " + weekdayLongArray[i] + " &nbsp";
          }
          else
          {
              newWeekList[i-startDay] = "&nbsp " + weekdayArray[i] + " &nbsp";
              newWeekLongList[i-startDay] = "&nbsp  " + weekdayLongArray[i] + " &nbsp";
          }
       }
       weekdayArray = newWeekList;
       weekdayLongArray = newWeekLongList;
   }
    
    var weekdays = "<TR BGCOLOR='" + headingCellColor + "'>";
	if(!bAccessibilityOn)
	{
	   weekdays+="<TD></TD>";
	}
   if(!bAccessibilityOn)
   {	
		for (i in weekdayArray) {
			 
			weekdays += "<TD class='heading' align=center>" + weekdayArray[i] + "</TD>";
		}
	}
	else
	{
	    weekdays += "<Th class='heading' align=center scope='col'> <span style= \"height:1px; width:1px; position:absolute; overflow:hidden; top=10px; visibility:hidden;\">&nbsp; " + sWeek +  "&nbsp;</span></Th>";
		for (i in weekdayArray) {
			// Resolving table inspector issues : added column header
			weekdays += "<Th class='heading' align=center scope='col'>" + weekdayArray[i] + "</Th>";
		}
	}
    weekdays += "</TR>";
    return weekdays;
}

function getHourSelect() {
   if (b24HourClock)
   {
      offset = 0;
      hourArray = new Array('0','1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12','13','14','15','16','17','18','19','20','21','22','23');
   }
   else 
   {
      offset = 1;
      hourArray = new Array('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12');
   } 
   hourSelect = "<SELECT TABINDEX='1' NAME='hour' onChange='parent.opener.setCurrentHour()' title='"+tHour+"'>";
   var activeHour = calDate.getHours();
   if (parseInt(activeHour) == 0)
   {
      activeHour = 12;
   }
   var period = 0;
   if (parseInt(activeHour) > 12 && !b24HourClock) {
      period = 12;
   }
    // LOOP THROUGH ARRAY
    for (i in hourArray) {
        if (i == activeHour - period - offset) {
            hourSelect += "<OPTION SELECTED>" + hourArray[i] + "\n";
        }
        else {
            hourSelect += "<OPTION>" + hourArray[i] + "\n";
        }
    }
    hourSelect += "</SELECT>";
    return hourSelect;
}

function getPMSelect() {
   if (b24HourClock)
   {
      pmSelect = "";
   }
   else 
   {
      pmArray = new Array(sAM, sPM);
      pmSelect = "<SELECT NAME='pm' onChange='parent.opener.setCurrentPeriod()' title='"+tPm+"'>";
      var activePM = calDate.getHours();
   if (parseInt(activePM) >= 12) {
      activePM = sPM;
      }
      else {
      activePM = sAM;
      }
      // LOOP THROUGH ARRAY
      for (i in pmArray) {
         if (pmArray[i] == activePM) {
             pmSelect += "<OPTION SELECTED>" + pmArray[i] + "\n";
         }
         else {
             pmSelect += "<OPTION>" + pmArray[i] + "\n";
         }
      }
      pmSelect += "</SELECT>";
   }
    return pmSelect;
}

function getMinuteSelect() {
    var bMinInList = false; 
    minuteArray = new Array('00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55');
    minuteSelect = "<SELECT NAME='minute' onChange='parent.opener.setCurrentMinutes()' title='"+tMinute+"'>";
    var activeMinute = calDate.getMinutes();
    // LOOP THROUGH MONTH ARRAY TO SEE IF THE INPUT MINUTES ARE IN THE DEFAULT LIST
    for (i in minuteArray) {      
        if (parseInt(minuteArray[i]) == activeMinute) 
        {
           bMinInList = true;
        }
    }      
    if (!bMinInList && activeMinute < 10) {
       minuteIndexOffest = 1;
       minutesIn = activeMinute;
       minuteSelect += "<OPTION SELECTED>0" + activeMinute + "\n";
    }
    else if (!bMinInList) {
       minuteIndexOffest = 1;
       minutesIn = activeMinute;
       minuteSelect += "<OPTION SELECTED>" + activeMinute + "\n";
    }
    for (i in minuteArray) {
        if (parseInt(minuteArray[i]) == activeMinute) {
            minuteSelect += "<OPTION SELECTED>" + minuteArray[i] + "\n";
        }
        else {
            minuteSelect += "<OPTION>" + minuteArray[i] + "\n";
        }
    }
    minuteSelect += "</SELECT>";
    return minuteSelect;
}

function getTimeZones() {
    timeZoneArray = timeZones.split(";;");
     var activeZone = 1;
    timeZoneSelect = "<SELECT font=" + myFontStyle + " NAME='timeZone' onChange='parent.opener.setTimeZone()' title='"+tTimeZone+"'>";
    for (i in timeZoneArray) {
        if (timeZoneArray[i] == currentTimeZone) {
            timeZoneSelect += "<OPTION SELECTED font=" + myFontStyle + ">" + timeZoneArray[i] + "\n";
            timeZone = i;
        }
        else {
            timeZoneSelect += "<OPTION  font=" + myFontStyle + ">" + timeZoneArray[i] + "\n";
        }
    }
    timeZoneSelect += "</SELECT>";
    return timeZoneSelect;
}

function buildCalParts() {
    weekdays = createWeekdayList();
    blankCell = "<TD align=center bgcolor='" + cellColor + "'><DIV>&nbsp;&nbsp;&nbsp;<DIV></TD>";
    calendarBegin =
        "<HTML" + sRTLmarkUp + "><HEAD><STYLE type='text/css'>" +
        "<!--" +
        "TD.heading { text-decoration: none; color:" + headingTextColor + "; font: " + headingFontStyle + "; }" +
        "DIV { color: " + dateColor + "; text-decoration: none; font: " + myFontStyle + "; }" +
        "A.focusDay:link { color: " + focusColor + "; text-decoration: none; font: " + selectedDateStyle + "; }" +
        "A.focusDay:hover { color: " + hoverColor + "; text-decoration: none; font: " + selectedDateStyle + "; }" +
        "A.focusDay:visited { color: " + focusColor + "; text-decoration: none; font: " + selectedDateStyle + "; }" +
        "A.weekday:link { color: " + dateColor + "; text-decoration: none; font: " + myFontStyle + "; }" +
        "A.weekday:hover { color: " + hoverColor + "; text-decoration: none; font: " + myFontStyle + "; }" +
        "A.weekday:visited { color: " + dateColor + "; text-decoration: none; font: " + myFontStyle + "; }" +
        "-->" +
        "</STYLE></HEAD>" +
        "<BODY TABINDEX='-1' onload='if (navigator.userAgent.toUpperCase().match(/MAC/)) window.resizeBy(-1,0); 'BGCOLOR='" + bottomBackground + "'" +

        "<CENTER>";
        // NAVIGATOR NEEDS A TABLE CONTAINER TO DISPLAY THE TABLE OUTLINES PROPERLY
        if (isNav) {
            calendarBegin += "<TABLE CELLPADDING=0 CELLSPACING=1 BORDER=0 ALIGN=CENTER BGCOLOR='" + tableBGColor + "'><TR><TD>";

        }
    calendarEnd = "";
        if(!bAccessibilityOn)
		{
          calendarEnd += "<TR></TR>";
		}
        

        // NAVIGATOR NEEDS A TABLE CONTAINER TO DISPLAY THE BORDERS PROPERLY
        if (isNav) {
            calendarEnd += "</TD></TR></TABLE>";
        }
        // END THE TABLE AND HTML DOCUMENT
        calendarEnd += "</TABLE></CENTER></BODY></HTML>";
}

function jsReplace(inString, find, replace) {
    var outString = "";
    if (!inString) {
        return "";
    }
    if (inString.indexOf(find) != -1) {
        t = inString.split(find);
        return (t.join(replace));
    }
    else {
        return inString;
    }
}

function doNothing() {
}

function makeTwoDigit(inValue) {
    var numVal = parseInt(inValue, 10);
    if (numVal < 10) {
        return("0" + numVal);
    }
    else {
        return numVal;
    }
}

// SET FIELD VALUE TO THE DATE SELECTED AND CLOSE THE CALENDAR WINDOW
function returnDate(whichDate)    
{	 
    var datestring;  
    if (whichDate == 1)
    {   
	   var outDate = "";  	   
	   var ctr = 0; 
	   var dateString = "";
	    
   	   while (ctr < formatArray.length)
	   {	        
	           if (formatArray[ctr] != null)
		   	{
		   		var newDate = buildDate(formatArray[ctr]);	
		   		if (newDate.length == 0 && special)
		   		{
		   			outDate += formatArray[ctr];
		   		}
		   		else
		   		{
		   			outDate += newDate;
		   		}			
		   	}
		      ctr++;
	   }

	   if (showTimeZone && bAppendTimezone && (timeZone != initialTimeZone))  
	   {
         outDate = outDate + " [" + timeZoneArray[timeZone] + "]";
		   timeOnly = false;
      }
   
      if (bIsQueryMode) {
         outDate = "'" + outDate + "'";
      }

      // SET THE VALUE OF THE FIELD THAT WAS PASSED TO THE CALENDAR
      calDateField.value = outDate;	   	   	   
	}
 
   showTimeZone     = false;
   calDateFormat    = "";
   sEndOfFormat     = false;
   bMonthBeforeYear = true;
   b24HourClock     = false;
   bAppendTimezone  = false;
   bIsQueryMode     = false;
   minuteIndexOffest = 0;
   formatArray      = new Array(30);
   bRTL = false;
   sRTLmarkUp = "";   
   top.SWEJannaPopupWin.close();

 	// trigger the OnBlur and OnChange events since these won't be fired otherwise
   if (isMac && calDateField.onchange != null)
   {
      if (calDateField.onblur != null)
         calDateField.onblur += calDateField.onchange;
      else
         calDateField.onblur = calDateField.onchange;
      top.focus();   
   }
	else if (calDateField.onchange != null)
      calDateField.onchange();
   
   if (!isMac && calDateField.onblur != null)
      calDateField.onblur();
   else if (isMac && calDateField.onblur != null)
      top.focus();
    
   calDateField.focus();
}

function buildDate(currentFormat)
{
   var retDate = "";
	var dayName = "";
	var monthName  = "";

   if (!timeOnly) {
      var day = calDate.getDate();
      var month = calDate.getMonth();
      var year = calDate.getFullYear();

      if (currentFormat == "DDDD") {
		   dayName = weekdayLongArray[3];
         retDate = dayName;
      }
      else if (currentFormat == "DDD") {
		   dayName = weekdayArray[3];
         retDate = dayName;
      }
	   else if (currentFormat == "DD") {
         day = makeTwoDigit(day);
         retDate = day;
      }
      else if (currentFormat == "D") {
         retDate = day;
      }
      else if (currentFormat == "MMMM") {
		   monthName = monthLongArray[month];
         retDate = monthName;
      }
      else if (currentFormat == "MMM") {
		   monthName = monthArray[month];
         retDate = monthName;
      }
      else if (currentFormat == "MM") {
         month = makeTwoDigit(month+1);
         retDate = month;
      }
      else if (currentFormat == "M") {
         retDate = month + 1;
      }
      else if (currentFormat == "YYYY") {
         retDate = year;
      }
      else if (currentFormat == "YYY") {
         retDate = year;
      }
      else if (currentFormat == "YY" ) {
         var yearString = "" + year;
         var yearString = yearString.substring(2,4);
         retDate = yearString;
      }
      else if (currentFormat == "Y" ) {
         var yearString = "" + year;
         var yearString = yearString.substring(2,4);
         retDate = yearString;
      }
	   else if (currentFormat == "/")
	   {
	      retDate = "/";
	   }
   }

   if (showClock) {
      var hour = calDate.getHours();
      var minutes = calDate.getMinutes();
      var seconds = calDate.getSeconds();
      var pm;

      if (!b24HourClock)
      {
	      if (parseInt(hour) == 24 || parseInt(hour) == 0 )
	      {
	         hour = 12;
	         pm = sAM;
	      }
	      else if (parseInt(hour) > 12)
	      {
	         hour -= 12;
	         pm = sPM;
	      }
         else if (parseInt(hour) == 12)
	      {
	         pm = sPM;
         }
         else
	      {
	         pm = sAM;
         }
      }

      if (currentFormat == "h" || currentFormat == "H") {
         retDate = hour;
      }
		else if (currentFormat == "hh" || currentFormat == "HH") {
		   if (parseInt(hour) < 10)
			{
			   hour = "0" + hour;
			}
			retDate = hour;
		}
      else if (currentFormat == "m" || currentFormat == "mm") {
         if (parseInt(minutes) < 10 && currentFormat == "mm") {
            minutes = "0" + minutes;
         }
         retDate = minutes;
      }
      else if (currentFormat == "s" || currentFormat == "ss") {
         if (parseInt(seconds) < 10 && currentFormat == "ss") {
            seconds = "0" + seconds;
         }
         retDate = seconds;
      }
      else if ((currentFormat == "p") || (currentFormat == "pp")) {
         retDate = pm;
      }
		else if (currentFormat == ":") {
		   retDate = ":";
		}
		timeOnly = false;
   }

	if (currentFormat == "D" || currentFormat == "DD" || currentFormat == "DDD" || currentFormat == "DDDD" ||
	    currentFormat == "M" || currentFormat == "MM" || currentFormat == "MMM" || currentFormat == "MMMM" ||
       currentFormat == "Y" || currentFormat == "YY" || currentFormat == "YYYY" || currentFormat == "YYY" ||
       currentFormat == "h" || currentFormat == "hh" || currentFormat == "H" || currentFormat == "HH" ||
       currentFormat == "m" || currentFormat == "s" || currentFormat == "p" || currentFormat == ":" ||
       currentFormat == "/")
   {
      special = false;
   }
   else
   {
      special = true;
   }

   return retDate;
}

// 12-F6GM9Y Date.setMonth has undefined behavior when the new month does not contain the original day.
// For example, 1/31/2003 would change to 3/1/2003 when ">" is clicked.
function setMonth(month)
{
   var oldDate = calDate.getDate();
   calDate.setDate(1);  // 1st is valid for every month
   calDate.setMonth(month);

   var days = getDaysInMonth();
   if(oldDate > days)
      calDate.setDate(days);
   else
      calDate.setDate(oldDate);
}

// Corner case of the same issue where the old year is a leap year && the date is 2/29 && the new year is 
// a non-leap year.
function setFullYear(year)
{
   var oldYear = calDate.getFullYear();
   if(isLeapYear(oldYear) && (!isLeapYear(year)) && 1 == calDate.getMonth() && 29 == calDate.getDate())
      calDate.setDate(28);

   calDate.setFullYear(year);
}


     


