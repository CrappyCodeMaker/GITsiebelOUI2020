topCalcButtonColor   = "black";         // BG COLOR OF THE TOP FRAME TEXT
topCalcBackground    = "#F5F5F5";         // BG COLOR OF THE TOP FRAME
calcTableBGColor     = "#CDCAFF";         // BG COLOR OF THE BOTTOM FRAME'S TABLE
calcCellColor        = "#CDCAFF";     // TABLE CELL BG COLOR OF THE CALCULATOR CELLS IN THE BOTTOM FRAME
headingcalcCellColor = "white";         // TABLE CELL BG COLOR OF THE WEEKDAY ABBREVIATIONS
headingCalcTextColor = "black";         // TEXT COLOR OF THE WEEKDAY ABBREVIATIONS
calcDigitColor       = "black";          // TEXT COLOR OF THE NUMBERS ON THE KEYPAD
calcHoverColor       = "darkred";       // TEXT COLOR OF A LINK WHEN YOU HOVER OVER IT
calcHeadingFontStyle = "bold 8pt arial, helvetica";      // TEXT STYLE FOR WEEKDAY ABBREVIATIONS
myCalcFontStyle      = "8pt arial, helvetica";           // TEXT STYLE FOR Numbers
exitFrameBG          = "#C0C0C0";     // BG color of the bottom button frame

// FORMATTING PREFERENCES
calcTableBorderStyle  = false;        // TRUE/FALSE (WHETHER TO DISPLAY BOTTOM CALCULATOR BORDER)
calcTableBorder   = 1;            // SIZE OF CALCULATOR TABLE BORDER (BOTTOM FRAME) 0=none
var displayValue     = "0";
var flag2ndNum       = false;
var total            = 0;
var pendingOperation = "";
var decimalDelimiter = ",";
var numberSeparator  = ".";
var sFormat          = "";
var sInitFormat      = "";
var sPreFormat       = "";
var sPostFormat      = "";
cancelLabel       = "Cancel";
saveLabel         = "Save";
var nDatumType      = "";
var useParensForNegative = false;
var isNeg = false;
var currencySymbol = "";
var bShift = false;
var bcalcRTL      = false;
var scalcRTLmarkUp = "";  // "" or " dir='rtl'"
var callingWindow = "";
var bIsQueryMode = false;
var bCtrl = false;

// DETERMINE BROWSER BRAND
var isNav = false;
var isMac = false;
var isAOL7orGreater = false;
var isIE50 = false;
// To support all IE versions for FR-12-1Z8CJ01
var isIE60 = false;
var isIE70 = false;
var isIE80 = false;
//Bug#11671230 :frame title variable declaration 
bPopulateMessages = false;
var notUsedStr			 = "";

// ASSUME IT'S EITHER NETSCAPE OR MSIE
if (navigator.appName == "Netscape") 
{
    isNav = true;
	selectedLanguage = navigator.language;
}
else {selectedLanguage = navigator.userLanguage;}

if (navigator.userAgent.toUpperCase().match(/MAC/))
	isMac = true;

if (navigator.userAgent.toUpperCase().indexOf("AOL 7") > -1 || navigator.userAgent.toUpperCase().indexOf("AOL 8") > -1)
    isAOL7orGreater = true;

if (navigator.userAgent.toUpperCase().indexOf ("MSIE 5.0") > -1)
   isIE50 = true;
// Changes for FR-12-1Z8CJ01
if (navigator.userAgent.toUpperCase().indexOf ("MSIE 6.0") > -1)
   isIE60 = true;
if (navigator.userAgent.toUpperCase().indexOf ("MSIE 7.0") > -1)
   isIE70 = true;
if (navigator.userAgent.toUpperCase().indexOf ("MSIE 8.0") > -1)
   isIE80 = true;   

// GET CURRENTLY SELECTED LANGUAGE DECIMAL DELIMITER - USE '.' FOR ALL ENGLISH SPEAKERS APPEARENTLY
if (selectedLanguage.indexOf("en")!= -1) 
{
	decimalDelimiter = ".";
}

// Check whether the application is on accessibility mode turned on
// bug# 12704352
var bAccessibilityOn = false;
if (typeof (Top()._swescript) != "undefined" && Top()._swescript.bAccessibleEnhanced == true)
{
   bAccessibilityOn = true;
   myCalcFontStyle      = "10pt arial, helvetica";           // TEXT STYLE FOR Numbers in accessibility mode
}

// PRE-BUILD PORTIONS OF THE CALCULATOR WHEN THIS JS LIBRARY LOADS INTO THE BROWSER
buildCalculatorParts();

//Bug:11671230 : start 
// reading default title from messages

if (typeof (Top()._swescript) != "undefined" && bAccessibilityOn && !bPopulateMessages)
{
  var appObj = (window.opener != null) ? window.opener : this;
  notUsedStr = appObj._SWEgetMessage ("IDS_SWE_DEFAULT_FRAME_TITLE_STRING");  //Bug : 11671230 : by default frame title should be not used
  bPopulateMessages = true;
		  
}
// setting default as title
var bottomCalcFrameTitle = notUsedStr;
var calcButtonFrameTitle = notUsedStr;

// Reading titles from global array
if (typeof (Top()._swescript) != "undefined" && bAccessibilityOn )
{
	
   bottomCalcFrameTitle = Top()._swescript._getFrameTitle("bottomCalcFrame");
   calcButtonFrameTitle = Top()._swescript._getFrameTitle("calcButtonFrame");
   	
}
if (bottomCalcFrameTitle == undefined)
	bottomCalcFrameTitle = notUsedStr;
if (calcButtonFrameTitle == undefined)
	calcButtonFrameTitle = notUsedStr;
// CALCULATOR FUNCTIONS BEGIN HERE ---------------------------------------------------
function setCalcButtonLabels(sSave, sCancel) {
    cancelLabel       = sCancel;
    saveLabel         = sSave;
}

function setCalcRTL( isRTL) {
   if (isRTL == "true")
   {
      bcalcRTL = true;
      scalcRTLmarkUp = " dir='rtl'";   
   }
}
   
function setNumFormat(decimalpoint,separator,currency) {
    decimalDelimiter = decimalpoint;
    numberSeparator  = separator;
    // currencySymbol = currency;  12-HPBX4D
    buildCalculatorParts();
    }
    
function setNumField(NumField, dDatum, format) {
    var iIndex = 0;
    nDatumType = dDatum;
    sFormat = format;
    sInitFormat = format;
    calcNumField = NumField;
    displayValue = NumField.value;

    parseNumFormat();

    // parse out the pre and post format marks
    var tempPreFormat = jscReplace(sPreFormat, "$", currencySymbol);
    iIndex = displayValue.indexOf( tempPreFormat);
    if (iIndex != -1 && tempPreFormat != "")
    {   
       displayValue = displayValue.substring(iIndex + tempPreFormat.length , displayValue.length);
    }
    if (isNeg)
    {
       displayValue = "-" + displayValue;
    }

    iIndex = displayValue.indexOf( sPostFormat);
    if (iIndex != -1 && sPostFormat != "")
    {   
       displayValue = displayValue.substring(0, iIndex );
    }

    if (isNaN(parseFloat(jscReplace(displayValue,decimalDelimiter, "."))))
    {
       displayValue = "0";
    }
    else 
    {
       flag2ndNum = true;
    }
    total = parseFloat(jscReplace(displayValue,decimalDelimiter, "."));

    // THE CALCULATOR FRAMESET DOCUMENTS ARE CREATED BY JAVASCRIPT FUNCTIONS
    calcDocBottom = buildBottomCalcFrame();
    calcButtonDoc   =  buildCalcButtonFrame();
}

function setQueryMode(isQuery)
{
   bIsQueryMode = (isQuery == "true");
}

function findCurrencySymbolInPre()
{
   var iStartIndex, iEndIndex;
   var prePreformat="";
   var tmpPreFormat = sPreFormat;
   var regX = /[0-9]/;

   if (tmpPreFormat == "$")
   {
      iEndIndex = displayValue.search(regX);
      currencySymbol = displayValue.substring(0, iEndIndex);
      displayValue = jscReplace(displayValue, currencySymbol, "");
   }
   else 
   {
      iStartIndex = tmpPreFormat.indexOf("$");
      if (iStartIndex != 0)
      {
        prePreformat =  tmpPreFormat.substring(0, iStartIndex);
        tmpPreFormat = tmpPreFormat.substring(iStartIndex, tmpPreFormat.length);
      }
      tmpPreFormat = tmpPreFormat.substring(1,tmpPreFormat.length);
      if (displayValue.indexOf(prePreformat) == 0)
         displayValue = displayValue.substring(prePreformat.length, displayValue.length);
      if (tmpPreFormat != ""  && displayValue.indexOf(tmpPreFormat) > 0)
      {
         currencySymbol = displayValue.substring(0, displayValue.indexOf(tmpPreFormat));
         displayValue = displayValue.substring(displayValue.indexOf(tmpPreFormat) + tmpPreFormat.length, displayValue.length);
      }
      else
      {
         iEndIndex = displayValue.search(regX);
         if (iEndIndex > 0)
         {
            currencySymbol = displayValue.substring(0, iEndIndex);
            displayValue = displayValue.substring(currencySymbol.length, displayValue.length);
         }
      }
   }
}

function findCurrencySymbolInPost()
{
   var iStartIndex, iEndIndex;
   var prePostformat="";
   var tmpPostFormat = sPostFormat;
   var tmpCurrency = "";

   iEndIndex = displayValue.lastIndexOf("0");
   if (displayValue.lastIndexOf("1") > iEndIndex) {iEndIndex = displayValue.lastIndexOf("1")}
   if (displayValue.lastIndexOf("2") > iEndIndex) {iEndIndex = displayValue.lastIndexOf("2")}
   if (displayValue.lastIndexOf("3") > iEndIndex) {iEndIndex = displayValue.lastIndexOf("3")}
   if (displayValue.lastIndexOf("4") > iEndIndex) {iEndIndex = displayValue.lastIndexOf("4")}
   if (displayValue.lastIndexOf("5") > iEndIndex) {iEndIndex = displayValue.lastIndexOf("5")}
   if (displayValue.lastIndexOf("6") > iEndIndex) {iEndIndex = displayValue.lastIndexOf("6")}
   if (displayValue.lastIndexOf("7") > iEndIndex) {iEndIndex = displayValue.lastIndexOf("7")}
   if (displayValue.lastIndexOf("8") > iEndIndex) {iEndIndex = displayValue.lastIndexOf("8")}
   if (displayValue.lastIndexOf("9") > iEndIndex) {iEndIndex = displayValue.lastIndexOf("9")}
   if (displayValue.lastIndexOf(decimalDelimiter)> iEndIndex) {iEndIndex = displayValue.lastIndexOf(decimalDelimiter)}
   
   tmpCurrency = displayValue.substring(iEndIndex + 1, displayValue.length);
   displayValue = displayValue.substring(0, iEndIndex + 1);

   if (tmpPostFormat.indexOf("$") == -1)
   { 
   }
   else if (tmpPostFormat == "$")
   {
      currencySymbol = tmpCurrency;
   }
   else 
   {
      iStartIndex = tmpPostFormat.indexOf("$");
      if (iStartIndex != -1 && (tmpCurrency.length >= iStartIndex))
      {
        tmpCurrency =  tmpCurrency.substring(iStartIndex, tmpCurrency.length);
        tmpPostFormat = tmpPostFormat.substring(iStartIndex + 1 , tmpPostFormat.length);
      }
      if (tmpPostFormat == "" )
      {
         currencySymbol = tmpCurrency;
      }
      else
      {
         iEndIndex = tmpCurrency.indexOf(tmpPostFormat);
         currencySymbol = tmpCurrency.substring(0, iEndIndex);
      }
   }
}

function parseNumFormat()
{
   var iIndex;
   isNeg = false;
   
   if (sFormat.indexOf("(") > -1 )
   {
      useParensForNegative = true;
		sFormat = jscReplace(sFormat, "(", "");
		sFormat = jscReplace(sFormat, ")", "");
		if (displayValue.indexOf("(") > -1)
		{
		   displayValue = jscReplace(displayValue, "(", "");
		   displayValue = jscReplace(displayValue, ")", "");	
		   isNeg = true;
		}	
   }
   else if (sFormat.indexOf("-") > -1 )
   {
      sFormat = jscReplace(sFormat, "-", "");
      if (displayValue.indexOf("-") > -1)
		{
                   displayValue = jscReplace(displayValue, "-", "");
		   isNeg = true;
		}
	}
   iIndex = sFormat.indexOf("#");
   if ( sFormat.indexOf("0") != -1)
   {
      if (sFormat.indexOf("0") < iIndex) 
      {
         iIndex = sFormat.indexOf("0");
      }
   }
   if (iIndex != -1)
   {
      sPreFormat = sFormat.substring(0,iIndex);
      sFormat = sFormat.substring(iIndex,sFormat.length);
      if (sPreFormat.indexOf("$") == -1)
      {
         displayValue = displayValue.substring(iIndex,displayValue.length);
      }
      else 
      {
         findCurrencySymbolInPre();
      }
   }
   iIndex = -1;
   iIndex = sFormat.lastIndexOf("#");
   if (sFormat.lastIndexOf("0") > iIndex)
   {
      iIndex = sFormat.lastIndexOf("0");
   }
   if (sFormat.lastIndexOf(decimalDelimiter) > iIndex)
   {
      iIndex = sFormat.lastIndexOf(decimalDelimiter);
   }
   if (sFormat.lastIndexOf(numberSeparator) > iIndex)
   {
      iIndex = sFormat.lastIndexOf(numberSeparator);
   }
   if (iIndex > 0  && iIndex < sFormat.length)
   {
      sPostFormat = sFormat.substring(iIndex+1, sFormat.length);
      sFormat = jscReplace(sFormat, sPostFormat, "");
      if (sPostFormat.indexOf("$") == -1)
      {
         displayValue = jscReplace(displayValue, sPostFormat, "");
      }
      else 
      {
         findCurrencySymbolInPost();
      }
   }
   displayValue = jscReplace(displayValue, numberSeparator, "");
}

// POPUP A WINDOW WITH THE CALCULATOR IN IT
function createCalculatorFrame(s_winTitle) 
{
   // netscape bug: if user double clicks, don't allow two calendar frames to be created
   if (!Top().SWEIsHighInteract && isNav)
   {
      if (typeof (top.isCalculatorBusy) == "undefined" ||
          top.isCalculatorBusy == false)
      {
         top.isCalculatorBusy = true;
      }
      else
      {
         top.isCalculatorBusy = false; // safeguard against infinite setting of busy
         return;
      }
   }


    // USE THE JAVASCRIPT-GENERATED DOCUMENTS (calDocTop, calDocBottom) IN THE FRAMESET
    calcDocFrameset = "<HTML><HEAD><TITLE>" + s_winTitle + "</TITLE></HEAD>";
        
        // To lower risk, for .200 added separate if statement. In future, want to combine this 
        // block with the block of code used for Netscape, Mac and AOL 7
        if (isIE50) // 12-EL3MJ8
        {
            calcDocFrameset +=       
            "<FRAMESET ROWS='83%,*' BORDER='0' onload='bottomCalcFrame.document.open();bottomCalcFrame.document.write(parent.opener.calcDocBottom);bottomCalcFrame.document.close ();calcButtonFrame.document.open();calcButtonFrame.document.write(parent.opener.calcButtonDoc);calcButtonFrame.document.close ();'>\n" +
//Bug:11671230 :- Adding title to frames
            "  <FRAME NAME='bottomCalcFrame' marginheight='5' marginwidth='5'  SCROLLING='no' FRAMEBORDER='0' title='"+bottomCalcFrameTitle+"'>\n" +
            "  <FRAME NAME='calcButtonFrame' marginheight='5' marginwidth='5' SCROLLING='no'  FRAMEBORDER='0' title='"+calcButtonFrameTitle+"'>\n";
        }
        else if (isIE60 || isIE70 || isIE80) // FR-12-1Z8CJ01
        {
            calcDocFrameset +=       
            "<FRAMESET ROWS='83%,*' BORDER='0' onload='bottomCalcFrame.document.open();bottomCalcFrame.document.write(parent.opener.calcDocBottom);bottomCalcFrame.document.close ();calcButtonFrame.document.open();calcButtonFrame.document.write(parent.opener.calcButtonDoc);calcButtonFrame.document.close ();'>\n" +
            "  <FRAME NAME='bottomCalcFrame' marginheight='5' marginwidth='5'  SCROLLING='no' FRAMEBORDER='0'>\n" +
            "  <FRAME NAME='calcButtonFrame' marginheight='5' marginwidth='5' SCROLLING='no'  FRAMEBORDER='0'>\n";
        }        
        else if (!isNav && !isMac && !isAOL7orGreater)
        {
            calcDocFrameset +=
            "<FRAMESET ROWS='83%,*' BORDER='0'>\n" +
//Bug:11671230 :- Adding title to frames
            "  <FRAME NAME='bottomCalcFrame' marginheight='5' marginwidth='5'  SRC='javascript:parent.opener.calcDocBottom' SCROLLING='no' FRAMEBORDER='0' "+
			"title='"+bottomCalcFrameTitle+"'>\n" +
            "  <FRAME NAME='calcButtonFrame' marginheight='5' marginwidth='5' SRC='javascript:parent.opener.calcButtonDoc' SCROLLING='no' FRAMEBORDER='0' "+
			"title='"+calcButtonFrameTitle+"'>\n";
        }
        else
        {
            calcDocFrameset +=       
            "<FRAMESET ROWS='83%,*' BORDER='0' onload='bottomCalcFrame.document.open();bottomCalcFrame.document.write(parent.opener.calcDocBottom);bottomCalcFrame.document.close ();calcButtonFrame.document.open();calcButtonFrame.document.write(parent.opener.calcButtonDoc);calcButtonFrame.document.close ();'>\n" +
//Bug:11671230 :- Adding title to frames
            "  <FRAME NAME='bottomCalcFrame' marginheight='5' marginwidth='5'  SRC='javascript:\"\"' SCROLLING='no' FRAMEBORDER='0' "+
			"title='"+bottomCalcFrameTitle+"'>\n" +
            "  <FRAME NAME='calcButtonFrame' marginheight='5' marginwidth='5' SRC='javascript:\"\"' SCROLLING='no'  FRAMEBORDER='0' "+
			"title='"+calcButtonFrameTitle+"'>\n";
        }
        
        calcDocFrameset +=
        "</FRAMESET>\n" +
        "</HTML>";

    // DISPLAY THE CALCULATOR IN A NEW POPUP WINDOW
    if (top.SWEJannaPopupWin &&
        typeof(top.SWEJannaPopupWin.closed) != "unknown" && 
        !top.SWEJannaPopupWin.closed)
    {
       top.SWEJannaPopupWin.close();
    }

    // bug# 12704352 - resize the popup in the accessibility mode
    if (bAccessibilityOn)
    {
        top.SWEJannaPopupWin = window.open("", 'jCalculator' , 'width=450,height=250,resizable');
    }
    else
    {
        top.SWEJannaPopupWin = window.open("", 'jCalculator' , 'width=220,height=205,resizable');
    }
		
    top.SWEJannaPopupWin.document.charset = document.charset;
    top.SWEJannaPopupWin.document.write(calcDocFrameset);
    top.SWEJannaPopupWin.document.close();
//    top.SWEJannaPopupWin.focus();

    if (!Top().SWEIsHighInteract && isNav)
       top.isCalculatorBusy = false;
}

// CREATE THE TOP CALCULATOR FRAME
// Do we use this function?
function buildTopCalcFrame() {

    // DUE TO A NETSCAPE 'FEATURE', WE NEED TO HAVE A 2ND FRAME FOR THINGS TO BE DISPLAYED PROPERLY
    var calcDoc =
        "<HTML>" +
        "<HEAD>" +
        "<BODY> </BODY>" +
        "</HTML>";

    return calcDoc;
}

// CREATE THE TOP CALCULATOR FRAME
function buildBottomCalcFrame()
{
    // CREATE THE TOP FRAME OF THE CALCULATOR
	
    // add the line break if the application is on accessibility mode
    // bug# 12704352
    var strAlignment;
    if (bAccessibilityOn)
    {
        strAlignment = "<br><CENTER>";
    }
    else
    {
        strAlignment = "<CENTER>";
    }
	
    var calcDoc =
        "<HTML>" +
        "<HEAD>" +
        "<STYLE type='text/css'>" +
        "<!--" +
        "input { text-align:right; color: " + calcDigitColor + "; font: " + myCalcFontStyle + "; }" +
        "A { color: " + calcDigitColor + "; text-decoration: none; font: " + myCalcFontStyle + "; }" +
        "A:hover { color: " + calcHoverColor + "; font: " + myCalcFontStyle + "; }" +
        "TD { align: center color: " + calcCellColor + "; font: " + myCalcFontStyle + "; }" +
        "-->" +
        "</STYLE>" +
        "</HEAD>" +
        "<BODY BGCOLOR='" + topCalcBackground + "';>" + 
        "<FORM NAME='calcControl' onSubmit='return false;'>" +
        strAlignment + 
        "<TABLE CELLPADDING=1 CELLSPACING=3 BORDER=" + calcTableBorder + " ALIGN=CENTER BGCOLOR='" + calcTableBGColor + "' onkeydown='event.cancelBubble=true; return (parent.opener.calculatorOnKeyDown(event));'>" +
        "<TR>" +
		"<TD colspan=4 align=CENTER>"  + 
		
		"<input "+((isNav)? "DISABLED":"") + "tabindex=1 name='Display' title='Display' type='Text' size='" + ((isNav)? 16 : 12) + "' value= " + displayValue + " width=100%>" +
		"</TD>" + 
		"</TR>" +
        keypads +
        "</TABLE>" +
        "</CENTER>" +
        "</FORM>" +
        //"</TD></TR></TABLE>" +        
        "</BODY>" +
        "</HTML>";

    return calcDoc;
}

// CREATE THE TOP TIME FRAME.  THIS IS NEEDED FOR NETSCAPE TO DISPLAY THE FRAMES PROPERLY
function buildCalcButtonFrame() {
    var baseHref = isMac? document.location.href.split("start.swe")[0]:"";  //Mac needs to write explicit base HREF
    var ButtonAlignment = "right";
    var lcap = baseHref + "images/btn_opn_d.gif";
    var rcap = baseHref + "images/btn_cls_d.gif";
    var backgrnd = baseHref + "images/btn_back2.gif";
    var space = baseHref + "images/spacer.gif";
    var strOkButton;
    var strCancelButton;
    
    if (bcalcRTL)
    {
       ButtonAlignment = "left";
    }

    // CREATE THE TOP FRAME OF THE TIME SETTER
    var exitDoc =
          "<HTML" + scalcRTLmarkUp + ">" +
          "<HEAD>" +
          "<STYLE type='text/css'>" +
          "<!--" +
         "A:link { color: " + topCalcButtonColor + "; text-decoration: none; font: " + myCalcFontStyle + "; }" +
         "A:hover { color: " + topCalcButtonColor + "; text-decoration: none; font: " + myCalcFontStyle + "; }" +
         "A:visited { color: " + topCalcButtonColor + "; text-decoration: none; font: " + myCalcFontStyle + "; }" +
          "-->" +
          "</STYLE>" +
	       "</HEAD>" +	        
           
          "<BODY onload='parent.opener.SetSingleFocus();parent.opener.calculatorOnLoad(document); if (navigator.userAgent.toUpperCase().match(/MAC/)) window.resizeBy(0,0);' BGCOLOR='" + exitFrameBG + "' onkeydown='event.cancelBubble=true; return (parent.opener.calculatorOnKeyDown(event));' >";
          
          if ((navigator.userAgent.toUpperCase().match(/NETSCAPE/) && parseInt(navigator.appVersion) >= 5)
              || (navigator.userAgent.indexOf("Mozilla/5.0 (OS/2")>=0))
         {
            var buttonStyle = "border-bottom:1px solid gray;border-top:1px solid white;border-left:1px solid white;border-right:1px solid gray";
            
            // change Link to a Button if the application is on accessibility mode
            // bug# 12704352
            if (bAccessibilityOn)
            {
                strOkButton = "<td nowrap STYLE='"+buttonStyle+"' class='minibuttonOn'>&nbsp;<input type='Button' onclick='JavaScript:parent.opener.returnNumber(1)' title='" + saveLabel + "' value='" + saveLabel + "'>&nbsp;</td>" ;
                strCancelButton = "<td nowrap STYLE='"+buttonStyle+"' class='minibuttonOn'>&nbsp;<input type='Button' onclick='JavaScript:parent.opener.returnNumber(0)' title='" + cancelLabel + "' value='" + cancelLabel + "'>&nbsp;</td>";
            }
            else
            {
                strOkButton =  "<td nowrap STYLE='"+buttonStyle+"' class='minibuttonOn'>&nbsp;<a href='JavaScript:parent.opener.returnNumber(1)' >" + saveLabel + "</a>&nbsp;</td>";
                strCancelButton =  "<td nowrap STYLE='"+buttonStyle+"' class='minibuttonOn'>&nbsp;<a href='JavaScript:parent.opener.returnNumber(0)' >" + cancelLabel + "</a>&nbsp;</td>";
            }

            exitDoc += "<P ALIGN = '" + ButtonAlignment+ "'>"+
            //ALIGN='" + ButtonAlignment + "'
            "<TABLE CELLPADDING=0 CELLSPACING=0 BORDER=0 ><TR>" + strOkButton + "<td>&nbsp;&nbsp;</td>" + strCancelButton;
         }
         else
         {         
            // change Link to a Button if the application is on accessibility mode
            // bug# 12704352
            if (bAccessibilityOn)
            {
                strOkButton = "<td class='minibuttonOn'><nobr><input type='Button' onclick='JavaScript:parent.opener.returnNumber(1)' title='" + 
                saveLabel + "' value='" + saveLabel + "'>";
                strCancelButton = "<td><img src='" + space + "' width='2' height='15' alt=''></td>" + 
                "<td class='minibuttonOn'><nobr><input type='Button' onclick='JavaScript:parent.opener.returnNumber(0)' title='" + 
                cancelLabel + "' value='" + cancelLabel + "'></nobr></td>";
            }
            else
            {
                strOkButton =  "<td WIDTH='6'><img src='" + lcap + "' height='15' width='6' alt=''></td>" +
                "<td BACKGROUND='" + backgrnd + "'  class='minibuttonOn'><nobr><a href='JavaScript:parent.opener.returnNumber(1)' >" + 
                saveLabel + "</a>";
                strCancelButton =  "<td ALIGN='RIGHT' WIDTH='6'><img src='" + rcap + "' height='15' width='6' alt=''></td>" +
                "<td><img src='" + space + "' width='2' height='15' alt=''></td>" + 
                "<td WIDTH='6'><img src='" + lcap + "' height='15' width='6' alt=''></td>" +
                "<td BACKGROUND='" + backgrnd + "'  class='minibuttonOn'><nobr><a href='JavaScript:parent.opener.returnNumber(0)' >" + 
                cancelLabel + "</a></nobr></td>" + "<td ALIGN='RIGHT' WIDTH='6'><img src='" + rcap + "' height='15' width='6' alt=''></td>";
            }
			
         //ALIGN='" + ButtonAlignment + "
            exitDoc +="<P ALIGN = '" + ButtonAlignment +  "'>" +
            "<TABLE CELLPADDING=0 CELLSPACING=1 BORDER=0><TR>" + strOkButton + "</nobr></td>" + strCancelButton;
         }
         
         exitDoc +=
         "</TR>" +      
         "</TABLE>" +
         "</BODY>" +
         "</HTML>";
 
    return exitDoc ;
}

// SET KEYPAD DEPENDING ON LANGUAGE
function createKeypad() {
	var keypadWidth = 4;
	var columnCount = 0;
	var paddingChar = "&nbsp;";

    var bAccessiblity =  ((typeof (Top()._swescript) != "undefined" &&
                           Top()._swescript.bAccessibleEnhanced) || 
                          (typeof(bAccessibleEnhanced) != "undefined" &&
                           typeof(bAccessibleEnhanced) != "unknown" && bAccessibleEnhanced));
        
    var keypads = "<TR BGCOLOR='" + calcCellColor + "'>";
    keypads += "<TD>" +
				   "<a href=\"javascript:parent.opener.clearAll()\" id = 'CKey'> " 
				   + paddingChar + " C " + paddingChar 
				   + "</a></TD>";
    keypads += "<TD align=center bgcolor='" + calcCellColor + "'>" +
				   "<a href=\"javascript:parent.opener.clearExpression()\"> " 
	//Bug#10562528 : adding pace between C and E
	if(bAccessiblity)
	{
		keypads += paddingChar + "C"+ paddingChar+"E" + paddingChar
	}
	else
	{
		keypads += paddingChar + "CE" + paddingChar
	}			   
	keypads += "</a></TD>";
    keypads += "<TD align=center bgcolor='" + calcCellColor + "'>" +
				   "<a href=\"javascript:parent.opener.backspace()\"> " 
				   + paddingChar + "<-" + paddingChar 
				   + "</a></TD>";
    keypads += "<TD align=center bgcolor='" + calcCellColor + "'>" +
				   "<a href=\"javascript:parent.opener.operatorPressed('/')\"> " 
				   + paddingChar + " / " + paddingChar 
				   + "</a></TD>";
	keypads += "</TR>";
	
	keypads += "<TR BGCOLOR='" + calcCellColor + "'>";    
    keypads += "<TD align=center bgcolor='" + calcCellColor + "'>" +
				   "<a href='javascript:parent.opener.numberPressed(7)'> " 
				   + paddingChar + " 7 " + paddingChar 
				   + "</a></TD>";
    keypads += "<TD align=center bgcolor='" + calcCellColor + "'>" +
				   "<a href='javascript:parent.opener.numberPressed(8)'> " 
				   + paddingChar + " 8 " + paddingChar 
				   + "</a></TD>";
    keypads += "<TD align=center bgcolor='" + calcCellColor + "'>" +
				   "<a href='javascript:parent.opener.numberPressed(9)'> " 
				   + paddingChar + " 9 " + paddingChar 
				   + "</a></TD>";
    keypads += "<TD align=center bgcolor='" + calcCellColor + "'>" +
				   "<a href=\"javascript:parent.opener.operatorPressed('*')\"> " 
				   + paddingChar + " * " + paddingChar 
				   + "</a></TD>";
	keypads += "</TR>";
    
	keypads += "<TR BGCOLOR='" + calcCellColor + "'>";    
    keypads += "<TD align=center bgcolor='" + calcCellColor + "'>" +
				   "<a href='javascript:parent.opener.numberPressed(4)'> " 
				   + paddingChar + " 4 " + paddingChar 
				   + "</a></TD>";
    keypads += "<TD align=center bgcolor='" + calcCellColor + "'>" +
				   "<a href='javascript:parent.opener.numberPressed(5)'> " 
				   + paddingChar + " 5 " + paddingChar 
				   + "</a></TD>";
    keypads += "<TD align=center bgcolor='" + calcCellColor + "'>" +
				   "<a href='javascript:parent.opener.numberPressed(6)'> " 
				   + paddingChar + " 6 " + paddingChar 
				   + "</a></TD>";
    keypads += "<TD align=center bgcolor='" + calcCellColor + "'>" +
				   "<a href=\"javascript:parent.opener.operatorPressed('-')\"> " 
				   + paddingChar + " - " + paddingChar 
				   + "</a></TD>";
	keypads += "</TR>";
    
	keypads += "<TR BGCOLOR='" + calcCellColor + "'>";    
    keypads += "<TD align=center bgcolor='" + calcCellColor + "'>" +
				   "<a href='javascript:parent.opener.numberPressed(1)'> " 
				   + paddingChar + " 1 " + paddingChar 
				   + "</a></TD>";
    keypads += "<TD align=center bgcolor='" + calcCellColor + "'>" +
				   "<a href='javascript:parent.opener.numberPressed(2)'> " 
				   + paddingChar + " 2 " + paddingChar 
				   + "</a></TD>";
    keypads += "<TD align=center bgcolor='" + calcCellColor + "'>" +
				   "<a href='javascript:parent.opener.numberPressed(3)'> " 
				   + paddingChar + " 3 " + paddingChar 
				   + "</a></TD>";
    keypads += "<TD align=center bgcolor='" + calcCellColor + "'>" +
				   "<a href=\"javascript:parent.opener.operatorPressed('+')\"> " 
				   + paddingChar + " + " + paddingChar 
				   + "</a></TD>";
	keypads += "</TR>";
    
	keypads += "<TR BGCOLOR='" + calcCellColor + "'>";    
    keypads += "<TD align=center bgcolor='" + calcCellColor + "'>" +
				   "<a href='javascript:parent.opener.numberPressed(0)'> " 
				   + paddingChar + " 0 " + paddingChar 
				   + "</a></TD>";
    keypads += "<TD align=center bgcolor='" + calcCellColor + "'>" +
				   "<a href='javascript:parent.opener.changeSign()'> " 
				   + paddingChar + "+/-" + paddingChar 
				   + "</a></TD>";
    keypads += "<TD align=center bgcolor='" + calcCellColor + "'>" +
				   "<a href='javascript:parent.opener.numberPressed(\"" + decimalDelimiter + "\")'> " 
				   + paddingChar + " " + decimalDelimiter + " " + paddingChar ;
	
    //FR 12-1VR7VHR: Added a check for accessibility
    if (bAccessiblity)
    {
  	  var appObj = (window.opener != null) ? window.opener : this;
      var msg = appObj._SWEgetMessage ("IDS_SWE_PERIOD");
      keypads += "<span style =\"height:1; width:1; overflow:hidden;\"> " + msg  + "</SPAN>";
    }

    keypads += "</a></TD>";
      
    keypads += "<TD align=center bgcolor='" + calcCellColor + "'>" +
				   "<a href=\"javascript:parent.opener.operatorPressed('=')\" > " 
				   + paddingChar + " = " + paddingChar 
				   + "</a></TD>";
	keypads += "</TR>";
    
    // RETURN TABLE OF KEYS TO DISPLAY IN THE CALCULATOR
    return keypads;
}

// PRE-BUILD PORTIONS OF THE CALCULATOR (FOR PERFORMANCE REASONS)
function buildCalculatorParts() {

    // GENERATE KEYPAD FOR THE CALCULATOR
    keypads = createKeypad();
}

 function doNothing() {
 }
 
function SetFocus()
{        
   if (typeof (Top()._swescript) != "undefined" &&
       Top()._swescript.bAccessibleEnhanced) 
   {
      return;
   }
      
   if (typeof(top.SWEJannaPopupWin.bottomCalcFrame.document.calcControl) == "undefined") return;
   
   top.SWEJannaPopupWin.bottomCalcFrame.focus();
   if (!isNav)
   {
      top.SWEJannaPopupWin.bottomCalcFrame.document.calcControl.Display.focus();               
   }
   else if (typeof (top.SWEJannaPopupWin.bottomCalcFrame.document.getElementById) != "undefined")
   {      
      var elm = top.SWEJannaPopupWin.bottomCalcFrame.document.getElementById("CKey");
      elm.focus();
   }   
}

function SetSingleFocus()
{        
   if (typeof(top.SWEJannaPopupWin.bottomCalcFrame.document.calcControl) == "undefined") return;
   
   top.SWEJannaPopupWin.bottomCalcFrame.focus();
   if (!isNav)
   {
      top.SWEJannaPopupWin.bottomCalcFrame.document.calcControl.Display.focus();               
   }
   else if (typeof (top.SWEJannaPopupWin.bottomCalcFrame.document.getElementById) != "undefined")
   {      
      var elm = top.SWEJannaPopupWin.bottomCalcFrame.document.getElementById("CKey");
      elm.focus();
   }   
}

// WRITE THE TOTAL TO THE TOP CALCULATOR FRAME
function writeCalcDisplay() 
{
    top.SWEJannaPopupWin.bottomCalcFrame.document.calcControl.Display.value = displayValue;
    return;
}


function numberPressed(Num) {
//  check to see if this is the 2nd number being input
	if (flag2ndNum) {
		if (Num == decimalDelimiter) {
			displayValue = "0" + decimalDelimiter;
		}
		else {
			displayValue = "" + Num;
		}
		flag2ndNum = false;
	}
// if the current value is 0, just overwrite it, otherwise append the number
	else {
		if ((displayValue == "0")&& Num != decimalDelimiter) {
			displayValue = "" + Num;
		}
		else {
			if ((Num == decimalDelimiter) && (displayValue.indexOf(decimalDelimiter) != -1)) {
			}
			else {
				displayValue += Num;
			}
		}
	}
	top.SWEJannaPopupWin.bottomCalcFrame.document.calcControl.Display.value = displayValue;
	if (navigator.userAgent.toUpperCase().match(/SAFARI/))
	{

	 if (typeof (top.SWEJannaPopupWin.bottomCalcFrame.document.getElementById) != "undefined")
		{      
			

			var elm = top.SWEJannaPopupWin.bottomCalcFrame.document.getElementById("CKey");
			elm.focus();
		}   
	
	}
}

function clearAll() {
	// SET EVERYTHINGBACK TO ORIGINAL VALUES
	total = 0;
	displayValue = "0";
	flag2ndNum = false;
	pendingOperation = "";
	writeCalcDisplay();
}

function clearExpression() {
	// ONLY RESET THE DISPLAY VALUE AND THE FLAG FOR 2ND NUMBER
	displayValue = "0";
	flag2ndNum = true;
	writeCalcDisplay();	
}

function backspace() {
	// IF THERE IS A 1 DIGIT NUMBER WITH A NEGATIVE SIGN SET DISPLAY VALUE = 0
	if ((displayValue.length == 2) && (displayValue.indexOf("-") != -1)) {
		displayValue = "0";
	}
	else if (displayValue.length != 1) {
	// IF THERE IS MORE THAN 1 DIGIT REMOVE THE RIGHTMOST DIGIT
		displayValue = displayValue.substr(0, displayValue.length - 1);
	}
	else {
		// IF THERE IS A 1 DIGIT NUMBER SET DISPLAY VALUE = 0
		displayValue = "0";
	}
	writeCalcDisplay();
}

function decimalDigit(a)
{
  var s = a.toString();
  var dotIndex = s.indexOf(".");
  if (dotIndex == -1)
  {
    return 0;
  }
  else
  { 
    return s.length -1 - dotIndex;
  }
}

// Only for +/-/*
function round( a, op, b)
{ 
  var scale = 1;
  var maxDecimalDigit;

  if (op != "*")  // +/-
    maxDecimalDigit = Math.max(decimalDigit(a), decimalDigit(b));
  else
    maxDecimalDigit = decimalDigit(a) + decimalDigit(b);

  if (op == "+")
    a += b;
  else if (op == "-")
    a -= b;
  else if (op == "*")
    a *= b;

  for(var i = 0; i < maxDecimalDigit; i++)
  {
    scale *= 10;
  }

  a *= scale;
  a = Math.round(a);
  a /= scale;     
  return a;
}

function operatorPressed(operation)  {
	// Simply update the total if there was no 2nd number and a 2nd operation was pressed
    // because backspace could have been pressed causing total and displayValue to be out of sync
	if (flag2ndNum)
    {
		total = parseFloat(jscReplace(displayValue,decimalDelimiter, "."));
	}
	else
	{
		// PROCESS THE PENDING OPERATION
		flag2ndNum = true;
		if ( '+' == pendingOperation )
			total = round(total, "+", parseFloat(jscReplace(displayValue,decimalDelimiter, ".")));
		else if ( '-' == pendingOperation )
			total = round(total, "-", parseFloat(jscReplace(displayValue,decimalDelimiter, ".")));
		else if ( '/' == pendingOperation )
			total /= parseFloat(jscReplace(displayValue,decimalDelimiter, "."));
		else if ( '*' == pendingOperation )
			total = round(total, "*", parseFloat(jscReplace(displayValue,decimalDelimiter, ".")));
		else 
			// THIS IS THE 1ST NUMBER ENTERED AND THERE IS NO PENDING OPERATION
			total = parseFloat(jscReplace(displayValue,decimalDelimiter, "."));
		if ('=' == operation)
		{
		}
		displayValue = jscReplace(total.toString(), "." , decimalDelimiter);
	}
	pendingOperation = operation;
	writeCalcDisplay();
}

function jscReplace(inString, find, replace) {

    var outString = "";

    if (!inString) {
        return "";
    }

    // REPLACE ALL INSTANCES OF find WITH replace
    if (inString.indexOf(find) != -1) {
        // SEPARATE THE STRING INTO AN ARRAY OF STRINGS USING THE VALUE IN find
        t = inString.split(find);

        // JOIN ALL ELEMENTS OF THE ARRAY, SEPARATED BY THE VALUE IN replace
        return (t.join(replace));
    }
    else {
        return inString;
    }
}

function changeSign() {
	displayValue = "" + parseFloat(jscReplace(displayValue,decimalDelimiter, "."))* -1;
	displayValue = jscReplace(displayValue, ".", decimalDelimiter)
   isNeg = !isNeg;
	writeCalcDisplay();
}

//----------------------------------------------------------------------
function calculatorOnLoad(doc)
{  
   if (isNav)
   { 
      doc.captureEvents(Event.KEYDOWN)
      doc.onkeydown = calculatorOnKeyDown;      
   }
   else
   {
//      doc.onkeydown = calculatorOnKeyDown;      
   }
   
   window.setTimeout ("SetFocus();",50);      
}

function calculatorOnKeyDown(anEvent)
{   
   //12-HSYGDN added check for Netscape to get keycode
   var code    =  isNav ? anEvent.which : anEvent.keyCode;
   
   if (typeof(anEvent.stopPropagation) != "undefined")
   {
      anEvent.stopPropagation()
   }   
   anEvent.cancelBubble=true; 
   
   bShift = anEvent.shiftKey;
   bCtrl = anEvent.ctrlKey;
   // how to localize this?
   
   /*
   if (code == 16) // shift
   {
      bShift = true;
   }
   else
   {
   */
      if (bShift)
      {
         bShift = false;

         if ((code == 187) || ((code == 61) && isNav))        // +
            operatorPressed('+');
         else if (code == 56)    // *
            operatorPressed('*');
         else if (code == 9)
            return true;         // Do not consume the TAB key msg                
      }
	  else if (bCtrl)
      {
         bCtrl = false;
         
         if (code == 49)
           	returnNumber(1);
      	 else if (code == 50)
      	    returnNumber(0);
      } 
      else
      {
         // decode using ASCII table values
         if (code >= 48 && code <= 57) // 0-9
            numberPressed(code - 48);
         else if (code >= 96 && code <= 105) // 0-9 on keypad - it doesn' matter if the numlock was pressed
            numberPressed(code - 96);
         else if (code == 190 || code == 188 || code == 110)  // . or , -  TODO: Localize this
            numberPressed(decimalDelimiter);
         else if (code == 107)   // +
            operatorPressed('+');
         else if (code == 189 || code == 109)   // -
            operatorPressed('-');
         else if (code == 106)   // *
            operatorPressed('*');
         else if (code == 191 || code == 111)   // /
            operatorPressed('/');
         else if ((code == 187) || ((code == 61) && isNav))   // = r
            operatorPressed('=');
         else if (code == 13)            //  Enter
         {
            // If accessbility is switched on, the enter key will be used as a substitute for a click
            // and will not force the popup to close.
            if ((typeof (Top()._swescript) != "undefined" &&
                 Top()._swescript.bAccessibleEnhanced) || 
                 (typeof(bAccessibleEnhanced) != "undefined" &&
                  typeof(bAccessibleEnhanced) != "unknown" && bAccessibleEnhanced)) 
            {
               return true;
            }
            else
               returnNumber(1);
         }
         else if (code == 8)     // Backspace is <-
            backspace();
         else if (code == 27)    // ESCAPE is CANCEL
            returnNumber(0);
         else if (code == 67 || code == 99)    // C or c is C
            clearAll();
         else if (code == 46)    // Delete is CE
            clearExpression();
         else if (code == 120)   // F9 is +/-
            changeSign();
         else if (code == 9)
            return true;         // Do not consume the TAB key msg                   
      }      
   //}
   return false;
}

function formatNumber(rTotal)
{
   var sTotal = sPostFormat;
   var sPreFormatPlus = sPreFormat;
   var tmpTotal = rTotal.toString(); 
   if (total < 0)
   { 
      sPreFormatPlus += "-";
      tmpTotal = jscReplace(tmpTotal,"-","");
   }
   var iIndexR = -1;
   var iPartLength = 3;
   // get the string index of the decimal portion
   iIndexR = tmpTotal.lastIndexOf(".");
   if (iIndexR > -1)
   {
      sTotal = tmpTotal.substring(iIndexR, tmpTotal.length) + sTotal;
      sTotal = jscReplace(sTotal, ".", decimalDelimiter);
      tmpTotal = tmpTotal.substring(0,iIndexR);
      sFormat = sFormat.substring(0,sFormat.lastIndexOf("."));
   }
   
   //add the formatted number for the rest
   if (sFormat.lastIndexOf(",") == -1)
   {
      sTotal = tmpTotal + sTotal;
   }
   else
   {
      var iIndexDecimal = sFormat.lastIndexOf(".");
      if (iIndexDecimal > sFormat.lastIndexOf(","))
      {
         iPartLength = iIndexDecimal - sFormat.lastIndexOf(",") -1 ;
      }
      else
      {
         iPartLength = sFormat.length - sFormat.lastIndexOf(",") -1;
      }
      while(tmpTotal.length > iPartLength)
      {
         sTotal = numberSeparator + tmpTotal.substring(tmpTotal.length - iPartLength, tmpTotal.length) + sTotal;
         tmpTotal = tmpTotal.substring(0, tmpTotal.length - iPartLength);
      }  
      sTotal = tmpTotal + sTotal;
   }
   
   sTotal = sPreFormatPlus + sTotal;
   //  create the correct formatting for negative numbers
   if (total < 0)
   {
      sTotal = jscReplace(sTotal, "-", "");
      if (useParensForNegative)
      {
         sTotal = "(" + sTotal + ")";
      }
      else
      {
         sTotal = "-" + sTotal;
      }
   }
   
   // currencySymbol stores the currency symbol that has been taken out.
   // sPreFormat stores the part of the string in the format before the first # or 0 whichever comes first.
   sTotal = (bIsQueryMode) ? jscReplace(sTotal, "$", "") : jscReplace(sTotal, "$", currencySymbol);

   return(sTotal);
}

function returnNumber (which) 
{
   if (which == 1)
   {
      var tmpTotal = "";
      operatorPressed('=');
      if (isNaN(total) || (!isFinite(total)))
         return;

      if (nDatumType == "Currency")
      {
	 tmpTotal = formatNumber(Math.round(total*100000)/100000);
      }
      else 
      {
	 tmpTotal = formatNumber(total);
      }
		
      // SET THE VALUE OF THE FIELD THAT WAS PASSED TO THE CALCULATOR
      calcNumField.value = tmpTotal; 
   }
	
   // SET total BACK TO 0 IN CASE THE CALCULATOR IS ENTERED AGAIN
   total = 0;
   displayValue = "0";
   flag2ndNum = false;
   pendingOperation = "";
   returnPrecision = -1;
   useParensForNegative = false;
   sFormat          = "";
   sInitFormat      = "";
   sPreFormat       = "";
   sPostFormat      = "";	
   bShift = false;
   bcalcRTL = false;
   scalcRTLmarkUp = ""; 
   bIsQueryMode = false;
   bCtrl = false;   

   // CLOSE THE CALCULATOR WINDOW
   top.SWEJannaPopupWin.close()
	
   // trigger the OnBlur and OnChange events since these won't be fired otherwise
   if (isMac && calcNumField.onchange != null)
   {
      if (calcNumField.onblur != null)
         calcNumField.onblur += calcNumField.onchange;
      else
         calcNumField.onblur = calcNumField.onchange;
         
      top.focus();   
   }
   else if (calcNumField.onchange != null)
      calcNumField.onchange();
   
   if (!isMac && calcNumField.onblur != null)
      calcNumField.onblur();
   else if (isMac && calcNumField.onblur != null)
      top.focus();
   
   // GIVE FOCUS BACK TO THE DATE FIELD
   calcNumField.focus();
}
