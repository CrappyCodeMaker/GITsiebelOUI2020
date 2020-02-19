//////////////////////////////////////////////////////////////////////////////
//
// Copyright (C) 2002 Siebel Systems, Inc., 
// All rights reserved.
//
// FILE:       htmlMessageBar.js
//
// CREATOR:    ZSUN
//
// DESCRIPTION
//    This file implements the html message broadcasting bar
//
//
//////////////////////////////////////////////////////////////////////////////

// HTML Message Bar

/*
   Query messages from server side. HI - use swe RPC, LI - use java applet (asynch)
*/
function InvokeMsgBarServiceMethod(methodName, inputPropSet)
{
   if (browser_mode == "HI")     // HIGH mode
   {
      try {
         //var msgBar = top._swe._sweapp.S_App.GetService("Message Bar");
         var msgBarService = msgBar.msgbarService;
         if (msgBarService!=null)
         {
            // make sure we have a property set
            if (typeof (inputPropSet) != "object")
               inputPropSet = null;
            if (inputPropSet == null)
               inputPropSet = App().NewPropertySet ();

            if (msgBar.IsInitiated == false)
               inputPropSet.SetProperty ("IsInitiated", "FALSE");

            // set as background service, do not change the active applet
            inputPropSet.SetProperty ("SWEBS", "1");

            var returnPropSet = App().NewPropertySet();
            var resultSetPropSet = App().NewPropertySet();

            returnPropSet = msgBarService.InvokeMethod(methodName, inputPropSet);
            if (returnPropSet != null)
            {
               var count = returnPropSet.GetChildCount ();
               for (var i = 0; i < count; i++)
               {
                  returnSetPropSet = returnPropSet.GetChild (i);
                  if (returnSetPropSet != null && returnSetPropSet.GetType () == "ResultSet")
                  {
                     return returnSetPropSet.GetProperty ("returnVal");
                  }
               }
            }
         }
      }
      catch(e) {}
   }
   else if (browser_mode == "LI") // SI mode
   {
      // Bug 12754169, Firefox compatibility
      if (!document.getElementById("MessageBar"))
      {
         setTimeout("InvokeMsgBarServiceMethod('"+methodName+"')", 1000);
         return "";
      }
      try {
         // Bug 12754169, Firefox compatibility
         var retVal = document.getElementById("MessageBar").InvokeMsgBarServiceMethod(methodName);
         return "WAIT_FOR_ANSWER";
      }
      catch(e) {}
   }

   /* comment out, it may cause high frequent function calls when network is down */
   //setTimeout("InvokeMsgBarServiceMethod('"+methodName+"')", 1000);
   return "";
}

/*
   called back from java applet in SI (asynch call in SI mode)
*/
function UpdateHTMLMessagebar(method, val)
{
   if (method == "Init")
      msgBar.init(val);
   if (method == "UpdatePrefMsg")
      msgBar.updateData(val);
   if (method == "SetSection508")
      bSection508 = true;
}

// global varibles

var msgBar;
var HTMLMsgBar;
var browser_mode;
var browser_type = getBrowserType();
var RTLheader = "";  // in BiDi, RTLheader = "H" invisible, in normal, RTLheader = ""
var RTLfactor = 1;   // in BiDi, RTLfactor = -1, in normal, RTLfactor = 1
var bSection508 = false;

var style_a = "\"text-decoration:none; color:black;\"";

/*
   called in CCFrameMsgbar.swt template
*/
function CreateMessageBar(msgbarID, mode)
{
   browser_mode = mode;
   var HTMLMsgBarContainer = document.getElementById(msgbarID);
   if (HTMLMsgBarContainer)
   {
      if (browser_type == "ie5")
      {
         HTMLMsgBar = HTMLMsgBarContainer;
      }
      else
      {
         var sHTML = "";
         sHTML += "<table border=0 CELLPADDING=0 CELLSPACING=0 width=100%>";
         sHTML += "<tr width=100%><td width=100%><div id='Messagebar'>&nbsp;</div>";
         sHTML += "</td></tr></table>";
         sHTML += "<br><div id=\"measurer\" style=\"visibility: hidden; overflow: hidden;\"></div>";
         
         HTMLMsgBarContainer.innerHTML = sHTML;
         HTMLMsgBar = document.getElementById("Messagebar");
      }
                  
      msgBar = new HTMLMessageBar();
      if (msgBar)
      {
         if (browser_mode == "HI")  // in HI mode, msgbar call RPC
         {
            msgBar.update();
         }
         else if (browser_mode == "LI")  // if there's java applet(LI mode), let applet do the Init();
            return;
      }
   }
}

/*
   generat a message object. 
   stream is the input string passed from server, pos is the current index at the input string
 */
function MsgBarMessage(stream, pos)
{
   if(stream==null)
     return;
   this.id = nextString (stream, pos);
   this.body = nextString (stream, pos);
   this.type = nextString (stream, pos);
   this.strStartTime = nextString (stream, pos);
   this.strEndTime = nextString (stream, pos);
   this.summary = nextString (stream, pos);
   this.status =  nextString (stream, pos);
   this.dismiss = nextString(stream, pos);
   this.strcreated = nextString(stream, pos);
   this.HTMLBody = "";
   this.HTMLWidth = 0;
}

/*
   HTMLMessageBar javascript class
*/
function HTMLMessageBar()
{
// initiate messagebar service
   if (browser_mode == "HI" && !IsOpenUI())
   {
      this.msgbarService = App().GetService("Message Bar");
   }
   
   this.IsInitiated = false;
   
// initial preference seeting 
   this.normalCC = /\[N\]/g;  // regular expression
   this.highCC   = /\[H\]/g;  // regular expression
   this.urgentCC = /\[U\]/g;  // regular expression
   this.normal = "";
   this.automation = "";
   this.high   = "";
   this.urgent = "";
   this.urgentWA = "";
   this.m_bkColor ="";
   this.m_normalColor = "";
   this.m_highColor = "";
   this.m_urgentColor = "";
   this.scrollSpeed = 0;
   this.fastScrollSpeed = 0;
   this.slowScrollSpeed =0;
   this.prefixNormal = "";
   this.prefixHigh = "";
   this.prefixUrgent = "";
   this.CounterText = "";
   this.rightScrollImg = new Image();
   this.leftScrollImg = new Image();
   this.rightScrollText = "";
   this.leftScrollText = "";
   this.updateInterval = 120;   // default 120 seconds
   this.enableSound = "";
   this.soundFile = "";

   
   this.bLicense = false;
   this.m_bAlwaysAlert = false;

// initial messages setting  
   this.msgArray = new Array; // msgArray stores the list of message
   this.AlertMsgs = new Array;// AlertMsgs store all alerted messages
                              // Compare coming message with the alerted message, if no difference, don't alert again
   this.HTMLMessages = "";    // messages rendered with HTML
   this.left = 0;             // left offset of all messages
   this.currentMsg = 0;       // current message
   this.numberOfChild = 0;    // number of messages
   
   this.div = null;           // DIV of message ticker (DHTML obj)
   this.container = null;     // ticker container DHTML obj
   
// initial ticker setting  
   this.shiftBy = 1;
   this.scrollInterval = 100;
   this.fastScrollSkip = 1;
   this.slowScrollDelay = -1;
   this.slowCount = 0;
   this.direction = "left";
   this.speedMode = "normal";
   
   this.htmlMsgsWidth = 0;    // html messages pixel length   |<---------------------->|
   this.shiftInPixel = 0;     // pixel shifted in to the show area 
   this.currentInMsg = 0;     // mesasge index shifted in to the show area 
   this.shiftOutPixel = 0;    // pixel shifted out of the show area 
   this.currentOutMsg = 0;    // message index shifted out of the show area 

   this.childrenLeft = Array();

// ticker running id   
   this.runId  = null;
      
// object methods setting   
   this.init = HTMLMessageBar_init;
   this.update = HTMLMessageBar_update;
   this.updateData = HTMLMessageBar_updateData;
   this.render = HTMLMessageBar_render;
   this.formatMsg = HTMLMessageBar_formatMsg;
// ticker methods
   this.reset = HTMLMessageBar_resetTicker;
   this.start = HTMLMessageBar_startTicker;
   this.scroll = HTMLMessageBar_scrollTicker;
   this.scrollTickerSection508 = HTMLMessageBar_scrollTickerSection508;
   this.stop = HTMLMessageBar_stopTicker;
   this.setSpeed = HTMLMessageBar_setSpeedTicker;
   this.updateCounter = HTMLMessageBar_updateCounterTicker;
   this.resize = HTMLMessageBar_resizeTicker; 
   this.restartScroll = HTMLMessageBar_restartScroll;
   this.getTickerWidth = HTMLMessageBar_getTickerWidth;
}

/*
   parse the initialization string passed from server side
*/
function HTMLMessageBar_init( rawData )
{
   rawData = escape(rawData);
   rawData = unescape(rawData);
   // Should be consistent with CSSMessageBarService::Init
   var pos     = new Array(1);
   pos[0]      = 0;
   var tmpStr      = nextString    (rawData, pos);
   this.bLicense   = (tmpStr == "TRUE");

   tmpStr      = nextString       (rawData, pos);
   this.m_bAlwaysAlert = (tmpStr == "TRUE");

   this.normal      = nextString (rawData, pos);
   this.automation  = nextString (rawData, pos);
   this.high        = nextString (rawData, pos);
   this.urgent      = nextString (rawData, pos);
   this.urgentWA    = nextString (rawData, pos);
   
   this.CounterText = "%1 of %2";
   this.CounterText_1 = /%1/;
   this.CounterText_2 = /%2/;
   tmpStr = nextString (rawData, pos);
   if (tmpStr.length > 0)
   {
      var pos1 = tmpStr.indexOf("%1");
      var pos2 = tmpStr.indexOf("%2");
      if (pos1 >= 0 && pos2 > 0)
         this.CounterText = tmpStr;
   }
   
   this.rightScrollImg.src = "images/" + nextString (rawData, pos);
   this.rightScrollText = nextString (rawData, pos);
   this.leftScrollImg.src = "images/" + nextString (rawData, pos);
   this.leftScrollText = nextString (rawData, pos);
   rtl = nextString (rawData, pos);
   if (rtl == "rtl")
      RTLfactor = -1
   if (RTLfactor == -1)
   {
      tmp = this.leftScrollImg.src;
      this.leftScrollImg.src = this.rightScrollImg.src;
      this.rightScrollImg.src = tmp;
      tmp = this.leftScrollText;
      this.leftScrollText = this.rightScrollText;
      this.rightScrollText = tmp;
      RTLheader = "<span style='visibility:hidden'>H</span>";
   }

   this.render();
}

/*
   Draw an empty messagebar without messages
*/
function HTMLMessageBar_render()
{
   if (HTMLMsgBar)
   {
      var sHTML = "";
      sHTML += "<table border=0 CELLPADDING=0 CELLSPACING=0 width=100%>";
      sHTML += "<tr><td valign=\"top\" width=20>";
      sHTML += "<a href=\"javascript:setScrollTicker('left',null)\" onMouseOver=\"window.status='" + this.leftScrollText + "';return true;\" onMouseDown=\"setScrollTicker('left', 'fast')\">";
      sHTML += "<img src='" + this.leftScrollImg.src + "' border=0 alt='" + this.leftScrollText + "'></a>";
      sHTML += "</td>";
      sHTML += "<td valign=\"top\" style=\"border: 1px inset; overflow: hidden;\">";
      sHTML += "<div id=\"tickerContainer\" style=\"position: relative; background: black; overflow: hidden;\" onMouseOver=\"setScrollTicker(null, 'slow')\" onMouseOut=\"setScrollTicker()\">";
      sHTML += "<div id=\"tickerID\" style=\"position: relative\">";
      sHTML += "...";
      sHTML += "</div>";
      sHTML += "</div>";
      sHTML += "</td>";
      sHTML += "<td valign=\"top\" width=20>";
      if (browser_type == "ie5") {
         sHTML += "<a href=\"javascript:setScrollTicker('right',null)\" onMouseOver=\"window.status='" + this.rightScrollText + "';return true;\" onMouseDown=\"setScrollTicker('right', 'fast')\">";
         sHTML += "<img src='" + this.rightScrollImg.src + "' border=0 alt='" + this.rightScrollText + "'></a>";
      }
      sHTML += "</td>";
      sHTML += "<td valign=\"top\" align=\"center\" width=50>";
      //sHTML += "<a href=\"javascript:void(0)\" id=\"counter\" onMouseOver=\"window.status='';return true;\" style="+style_a+">&nbsp;</a>";
      if (browser_type == "ie5")
      {
         // For FR#12-1VD8A0E
         sHTML += "<span id=\"counter\" style="+style_a+">&nbsp;</span></td>";
         sHTML += "<td><div id=\"measurer\" style=\"visibility: hidden; overflow: hidden;\"></div>";
      }
      sHTML += "</td>";
      sHTML += "</tr>";
      sHTML += "</table>";
      if (browser_type == "ie5")
          // For FR#12-1VD8A0E
      	 ;//sHTML += "<br><div id=\"measurer\" style=\"visibility: hidden; overflow: hidden;\"></div>";
      else {   // in netscape/mozilla, use absolute position for right part
         sHTML += "<span id=\"right_part\" style=\"position: absolute; left:"+this.getTickerWidth()+"; top:0; width:80; background-color: #ccccff;\">";
         sHTML += "<a href=\"javascript:setScrollTicker('right',null)\" onMouseOver=\"window.status='" + this.rightScrollText + "';return true;\" onMouseDown=\"setScrollTicker('right', 'fast')\">";
         // For FR#12-1VD8A0E
         sHTML += "<img src='" + this.rightScrollImg.src + "' align=top border=0 alt='" + this.rightScrollText + "'></a>";
         sHTML += "<a href=\"javascript:void(0)\" id=\"counter\" onMouseOver=\"window.status='';return true;\" style="+style_a+">&nbsp;</a>";
         sHTML += "</span>";
      }
      
      HTMLMsgBar.innerHTML = sHTML;
      
      this.div = document.getElementById("tickerID");                // DIV of message ticker (DHTML obj)
      this.container = document.getElementById("tickerContainer");   // ticker container DHTML obj
   }
}

/*
   update() is called to get update date from server
 */
function HTMLMessageBar_update( )
{
   var rawData = InvokeMsgBarServiceMethod("UpdatePrefMsg");
   if (rawData == "WAIT_FOR_ANSWER")
      return;
   else
      this.updateData(rawData);
}

/*
   updateData(data) is called to update the messagebar with data
 */
function HTMLMessageBar_updateData( rawData )
{
   // Fix for 12-EMG5IB, when the server is down or network is not stable, the rawData is empty. 
   // If update messagebar with empty data, it'll cause an infinite loop inside toRadix() function.
   // if the input data is empty, do nothing. prepare an update next cycle.
   if (!rawData || typeof(rawData)=="undefined")
   {
      setTimeout("msgBar.update()", this.updateInterval*1000);
      return;
   }
   var pos     = new Array(1);
   pos[0]      = 0;
   var isPrefChanged  = false;
   var isMsgChanged  = false;

   rawData = escape(rawData);
   rawData = unescape(rawData);
   
   // see if there's Init info.
   pos[0] = rawData.indexOf("-$$$-");
   if (pos[0]>=0)
   {
      if (pos[0]>0)
      {
         var initData = rawData.substring(0,pos[0]);
         this.init(initData);
         this.IsInitiated = true;
      }
      pos[0] += 5;
   }
   else
      pos[0] = 0;
   
   var pos0, pos1, pos2, numMsg=0, i=0;
   pos0 = rawData.indexOf("-|||-", pos[0]);
   pos1 = rawData.indexOf("--saMe--", pos[0]);
   pos2 = rawData.indexOf("--saMe--", pos0);

   // set user preference
   if ((pos1 == -1) || (pos1 > pos0))  // not same as before
   {
      this.scrollSpeed = parseInt(nextString (rawData, pos));
      this.fastScrollSpeed = parseInt(nextString (rawData, pos));
      this.slowScrollSpeed = parseInt(nextString (rawData, pos));
      this.m_bkColor       = getColorFromString (nextString (rawData, pos));
      this.m_normalColor   = getColorFromString (nextString (rawData, pos));
      this.m_highColor     = getColorFromString (nextString (rawData, pos));
      this.m_urgentColor   = getColorFromString (nextString (rawData, pos));
      this.updateInterval  = parseInt(nextString (rawData, pos)); 
      this.prefixNormal    = nextString (rawData, pos);
      this.prefixHigh      = nextString (rawData, pos);
      this.prefixUrgent    = nextString (rawData, pos);
      this.enableSound	   = nextString (rawData, pos);
	  this.soundFile	   = nextString (rawData, pos);

      //String fontIndex        = "1"; 
      //setFont(CSSUtilities.atoi (fontIndex));
      isPrefChanged  = true;
   }

   //set messages
   if (pos2 == -1) // not same as before
   {
      this.msgArray = null;
      this.msgArray = new Array();
      pos[0] = rawData.indexOf("Msg", pos0);

      while(pos0<pos[0] && pos[0]<rawData.length)
      {
         pos[0] += 3;
         this.msgArray[i] = new MsgBarMessage(rawData, pos);
         i++;
      }
      isMsgChanged  = true;
	
	  if (bSection508 == true)
	  {
         if("1"==this.enableSound||"Y" ==this.enableSound||"y"==this.enableSound)
         {
            // Bug 12754169, Firefox compatibility
            document.getElementById("MessageBar").InvokeMsgBarPlayMusic(this.soundFile);
         }
	  }
   }

   if (isPrefChanged || isMsgChanged)
   {
      this.HTMLMessages = "";
	  this.numberOfChild = this.msgArray.length;
	  var tmp_array = new Array();

      if (bSection508 == false)
      {
         for (i=0; i < this.msgArray.length; i++)
         {
            this.formatMsg( this.msgArray[i]);
         }
      }
      else  // in section508 mode, all message concatinate together so that user can tab through all messages (no hidden messages)
      {
         tmp_array[0] = new MsgBarMessage(null,0);   // only single virtual message with HTMLBody and HTMLWidth
         tmp_array[0].HTMLBody = "";

         for (i=0; i < this.msgArray.length; i++)
			tmp_array[0].HTMLBody += this.formatMsg(this.msgArray[i]);

         tmp_array[0].HTMLWidth = 0;
         this.childrenLeft[0] = 0;

         for (i=0; i < this.msgArray.length; i++)
         {
         	this.childrenLeft[i] = tmp_array[0].HTMLWidth;
            tmp_array[0].HTMLWidth += this.msgArray[i].HTMLWidth;
         }
      }

      if (tmp_array.length > 0)
	  {
         this.HTMLMessages += tmp_array[0].HTMLBody;
		 this.msgArray[0].HTMLWidth = tmp_array[0].HTMLWidth;
      }
	  else if((bSection508 == false) && (this.msgArray.length > 0))
	  {
		this.HTMLMessages += this.msgArray[0].HTMLBody;
	  }
      else
      {
         this.HTMLMessages = "";
         this.updateCounter(0);
      }

      this.div.innerHTML = this.HTMLMessages;
      this.reset();
      this.start(); 
   }
   
   setTimeout("msgBar.update()", this.updateInterval*1000);
}

/*
   render a message from HTML format
*/
function HTMLMessageBar_formatMsg(msgObj)
{
   var body = msgObj.body;
   //var body_strlen = body.length;

   // apply color for the whole message
   var HTMLColor = this.m_normalColor;
   var prefix = this.prefixNormal;
   if (msgObj.type == this.high) 
   {
      HTMLColor = this.m_highColor;
      prefix = this.prefixHigh;
   }
   else if (msgObj.type == this.urgent || msgObj.type == this.urgentWA) 
   {
      HTMLColor = this.m_urgentColor;
      prefix = this.prefixUrgent;
   }
   
   var body_strlen = body.length + prefix.length;

   // apply color inside the message
   body = body.replace(this.normalCC, "<font color=" + this.m_normalColor + ">" + this.prefixNormal);
   body = body.replace(this.highCC, "<font color=" + this.m_highColor + ">" + this.prefixHigh);
   body = body.replace(this.urgentCC, "<font color=" + this.m_urgentColor + ">" + this.prefixUrgent);
   var i = 0;
   var endFontTags = "";
   while (1)
   {
      i = body.indexOf("<font", i);
      if (i>0) i += 5;
      else break;
      endFontTags += "</font>";
   }
   body += endFontTags;

   if (bSection508 == true)
      body = "<a href=\"javascript:void(0)\" style="+style_a+"><span id=\""+msgObj.id+"\" style=\"color:"+HTMLColor+"; padding-right:50px\">"+prefix+body+"</span></a>";
   else
      body = "<span id=\""+msgObj.id+"\" style=\"color:"+HTMLColor+"; padding-right:50px\">"+prefix+body+"</span>";
   
   if (msgObj.type == this.urgentWA)
   {
      var showAlert = true;
      var iAlert = this.AlertMsgs.length;
      for (i=0; i<this.AlertMsgs.length; i++)
      {
         if (msgObj.id == this.AlertMsgs[i].id)
         {
            iAlert = i;
            if (msgObj.body == this.AlertMsgs[i].body) 
            {
               showAlert = false;
               break;
            }
         }
      }
      if (showAlert)
      {
         this.AlertMsgs[iAlert] = msgObj;
         var alertBody = msgObj.body.replace(this.normalCC, this.prefixNormal);
         //FR#12-1VR5VGU
         alertBody = alertBody.replace(this.highCC, this.prefixHigh);
         alertBody = alertBody.replace(this.urgentCC, this.prefixUrgent);
         alertBody = prefix + alertBody;
         alert(alertBody);
      }
   }

   body = RTLheader+body;
   msgObj.HTMLBody = body;
   msgObj.HTMLWidth = measureStringWidth(body, body_strlen);
   return body;
}

/*
   reset the scrolling ticker
*/
function HTMLMessageBar_resetTicker()
{
   this.setSpeed(this.scrollSpeed, this.fastScrollSpeed, this.slowScrollSpeed);
   if (this.leftScrollImg.width == 0)  this.leftScrollImg.width = 20;
   if (this.rightScrollImg.width == 0)  this.rightScrollImg.width = 20;
   if (browser_type == "ie5")
      this.container.style.width = document.body.offsetWidth-(this.leftScrollImg.width+this.rightScrollImg.width+50);

   // right_part include right scroll button and counter
   var right_part = document.getElementById("right_part");
   if (right_part)
      right_part.style.left = this.getTickerWidth() + "px";
   
   this.left = this.getTickerWidth()*RTLfactor;
   this.div.style.left = this.left + "px";

   if (this.numberOfChild > 0)
   {
      this.htmlMsgsWidth = this.msgArray[0].HTMLWidth;
      
      this.div.style.height   = this.div.firstChild.offsetHeight;
      this.div.style.width = this.htmlMsgsWidth + 10;
      this.div.style.visibility = 'visible';
   }
   
   this.updateCounter(0);
   if (bSection508 == false)
      this.restartScroll();
}

/*
   start scrolling the message ticker
*/
function HTMLMessageBar_startTicker()
{
  this.stop();

  var skip = 1;
  if (this.speedMode == "slow")
  {
      this.slowCount++;
      if (this.slowCount >= this.slowScrollDelay && this.slowScrollDelay >= 0)
      {
         skip = 1;
         this.slowCount = 0;
      }
      else
         skip = 0;
  }
  else if (this.speedMode == "fast")
      skip = (this.fastScrollSkip==0) ? 1 : this.fastScrollSkip;
  else   // normal scroll
      if (this.scrollSpeed == 0)
         skip = 0;

  for (i=0; i<skip; i++)
  {  
     this.scroll();
  }

  this.runId = setTimeout('msgBar.start()', this.scrollInterval);
}

/*
   section 508 special scroll, single virtual message moves
*/
function HTMLMessageBar_scrollTickerSection508()
{
  if (this.direction == "left")
  {
      this.left -= this.shiftBy*RTLfactor;
      if (this.left*RTLfactor < -this.childrenLeft[this.currentMsg+1])
         this.updateCounter(this.currentMsg+1);
      if (this.left*RTLfactor <= -this.htmlMsgsWidth)
      {
         this.left = this.getTickerWidth()*RTLfactor;
         this.currentMsg = 0;
         this.updateCounter(this.currentMsg);
      }
  }
  else if (this.direction == "right")
  {
      this.left += this.shiftBy*RTLfactor;
      if (this.childrenLeft[this.currentMsg]*RTLfactor > (this.getTickerWidth() - this.left))
         this.updateCounter(this.currentMsg-1);
      if (this.left*RTLfactor > this.getTickerWidth())
      {
         this.left = -this.htmlMsgsWidth*RTLfactor;
         this.currentMsg = this.numberOfChild-1;
         this.updateCounter(this.currentMsg);
      }
  }
  this.div.style.left = (this.left + 'px'); 
}

/*
   scroll the message ticker by pixel
   In 7.5.x, all messages are in a long HTML element, they are moved together. There's a potential CPU load issue 12-H8WG9T
   In 7.7, message is added/removed to the display area dynamically to avoid scrolling very long HTML text.
      When a message move into the display area
         if (this message fully in the area) 
            append next message to the HTML string, shiftInPixel=0
         else
            shiftInPixel++
      When a message move out of the display area
         if (this message fully out the area) 
            remove this message from the HTML string, shiftOutPixel=0
         else
            shiftOutPixel++
*/
function HTMLMessageBar_scrollTicker()
{
  if (this.numberOfChild == 0)
      return;

  // section 508, single virtual message moves
  if (bSection508 == true)
  {
      this.scrollTickerSection508();
      return;
  }

  if (this.direction == "left")
  {
      this.left -= this.shiftBy*RTLfactor;

      if (this.left*RTLfactor <= -this.htmlMsgsWidth)
         this.restartScroll();

      if (this.currentInMsg == this.numberOfChild-1 )
         this.shiftInPixel = 0;
      else
      {
         if (this.currentInMsg < this.numberOfChild-1 && this.shiftInPixel == this.msgArray[this.currentInMsg].HTMLWidth)
         {
            this.currentInMsg++;
            this.htmlMsgsWidth += this.msgArray[this.currentInMsg].HTMLWidth;
            this.div.style.width = this.htmlMsgsWidth + 10;
            if (RTLfactor == 1)
               this.HTMLMessages += this.msgArray[this.currentInMsg].HTMLBody;
            else 
               this.HTMLMessages = this.msgArray[this.currentInMsg].HTMLBody + this.HTMLMessages;
            this.div.innerHTML = this.HTMLMessages;
            this.shiftInPixel = 0;
         }
         else
            this.shiftInPixel++;
      }
         
      if (this.left*RTLfactor <= 0)
      {
         if (this.currentOutMsg < this.numberOfChild && this.shiftOutPixel == this.msgArray[this.currentOutMsg].HTMLWidth)
         {
            this.htmlMsgsWidth -= this.msgArray[this.currentOutMsg].HTMLWidth;
            this.div.style.width = this.htmlMsgsWidth + 10;
            if (RTLfactor == 1)
               this.HTMLMessages = this.HTMLMessages.substring(this.msgArray[this.currentOutMsg].HTMLBody.length, this.HTMLMessages.length);
            else
               this.HTMLMessages = this.HTMLMessages.substring(0, this.HTMLMessages.length-this.msgArray[this.currentOutMsg].HTMLBody.length);
            this.div.innerHTML = this.HTMLMessages;
            this.shiftOutPixel = 0;
            this.left = 0;
            this.currentOutMsg++;
            this.updateCounter(this.currentOutMsg);
         }
         else
            this.shiftOutPixel++;
      }
  }
  else if (this.direction == "right")
  {
      this.left += this.shiftBy*RTLfactor;

      if (this.left*RTLfactor > this.getTickerWidth())
         this.restartScroll();
      
      if (this.currentInMsg == 0 )
         this.shiftInPixel = 0;
      else
      {
         if (this.currentInMsg > 0 && this.shiftInPixel == this.msgArray[this.currentInMsg].HTMLWidth)
         {
            this.currentInMsg--;
            this.htmlMsgsWidth += this.msgArray[this.currentInMsg].HTMLWidth;
            this.div.style.width = this.htmlMsgsWidth + 10;
            if (RTLfactor == -1)
               this.HTMLMessages += this.msgArray[this.currentInMsg].HTMLBody;
            else 
               this.HTMLMessages = this.msgArray[this.currentInMsg].HTMLBody + this.HTMLMessages;
            this.div.innerHTML = this.HTMLMessages;
            this.shiftInPixel = 0;
            this.left -= (this.msgArray[this.currentInMsg].HTMLWidth)*RTLfactor;
         }
         else
            this.shiftInPixel++;
      }
         
      if (this.left*RTLfactor+this.htmlMsgsWidth >= this.getTickerWidth())
      {
         if (this.currentOutMsg > 0 && this.shiftOutPixel == this.msgArray[this.currentOutMsg].HTMLWidth)
         {
            this.htmlMsgsWidth -= this.msgArray[this.currentOutMsg].HTMLWidth;
            this.div.style.width = this.htmlMsgsWidth + 10;
            if (RTLfactor == -1)
               this.HTMLMessages = this.HTMLMessages.substring(this.msgArray[this.currentOutMsg].HTMLBody.length, this.HTMLMessages.length);
            else
               this.HTMLMessages = this.HTMLMessages.substring(0, this.HTMLMessages.length-this.msgArray[this.currentOutMsg].HTMLBody.length);
            this.div.innerHTML = this.HTMLMessages;
            this.shiftOutPixel = 0;
            this.currentOutMsg--;
            this.updateCounter(this.currentOutMsg);
         }
         else
            this.shiftOutPixel++;
      }
  }

  this.div.style.left = (this.left + 'px'); 
}

/*
   called when all messages are out of the display area
*/
function HTMLMessageBar_restartScroll()
{
   if (this.msgArray.length == 0)
      return;
   if (this.direction == "left")
   {
      this.left = this.getTickerWidth()*RTLfactor;
      this.updateCounter(0);
      
      this.currentInMsg = 0;
      this.currentOutMsg = 0;
   }
   else if (this.direction == "right")
   {
      this.updateCounter(this.numberOfChild-1);
      
      this.currentInMsg = this.numberOfChild-1;
      this.currentOutMsg = this.numberOfChild-1;
   }

   this.shiftInPixel = 0;
   this.shiftOutPixel = 0;
   this.htmlMsgsWidth = this.msgArray[this.currentInMsg].HTMLWidth;
   this.HTMLMessages = this.msgArray[this.currentInMsg].HTMLBody;
   this.div.innerHTML = this.HTMLMessages;
   this.div.style.width = this.htmlMsgsWidth + 10;
   
   if (this.direction == "right")
      this.left = -this.htmlMsgsWidth*RTLfactor;
}

/*
   stop scrolling
*/
function HTMLMessageBar_stopTicker()
{
  if (this.runId)
    clearTimeout(this.runId);
    
  this.runId = null;
}

/*
   resize the scroll area
*/
function HTMLMessageBar_resizeTicker()
{
   //if (browser_type == "ie5")
   //   this.container.style.width = document.body.offsetWidth-(this.leftScrollImg.width+this.rightScrollImg.width+50);
   //else  // nav6
   //{
      this.stop();
      if (this.div.style.width)
         this.div.style.width = "";
      this.reset();
      this.start();
   //}
}

/*
   set the scrolling speed
*/
function HTMLMessageBar_setSpeedTicker(speed, fastScrollSpeed, slowScrollSpeed)
{
   this.scrollInterval  = 50 - speed / 2 + 5;
   this.fastScrollSkip  = fastScrollSpeed / 5; 
   this.slowScrollDelay = (slowScrollSpeed == 0) ? -1 : (100 - slowScrollSpeed) / 10 + 1;; 
}

/*
   update the message counter
*/
function HTMLMessageBar_updateCounterTicker(childIndex)
{
   var counter = document.getElementById("counter");

   if (childIndex > this.numberOfChild)
      this.currentMsg = 0;
   else if (childIndex < 0)
      this.currentMsg = 0;
   else
      this.currentMsg = childIndex;
   if (counter)
   {
      var ct = this.CounterText;
      var tmp;
      if (this.numberOfChild == 0)
         tmp = ct.replace(this.CounterText_1, "0");
      else
         tmp = ct.replace(this.CounterText_1, ((this.currentMsg+1)+""));
      counter.innerHTML = RTLheader + tmp.replace(this.CounterText_2, (this.numberOfChild+""));
   }
}

/* Prototypes for Ticker 
Ticker.prototype.start = startTicker;
Ticker.prototype.scroll = scrollTicker;
Ticker.prototype.stop = stopTicker;
Ticker.prototype.setSpeed = setSpeedTicker;
Ticker.prototype.updateCounter = updateCounterTicker;
Ticker.prototype.getLeadChild = getLeadChildTicker;
*/

function HTMLMessageBar_getTickerWidth()
{
   if (browser_type == "ie5")
      return this.container.offsetWidth;
   else
   {
      return (innerWidth - 70);
   }
}

// general functions
function getColorFromString(str)
{
   if (str.charAt(0) == "#") 
      return str;
   var strArray = str.split(",");
   var HTMLColor = "#", tmp;
   for (i=0; i<3; i++) 
   {
      tmp = toRadix(strArray[i], 16);
      if (tmp.length == 1) tmp = "0"+tmp;
      HTMLColor += tmp;
   }
   return HTMLColor;
}

function toRadix(N,radix) {
 var HexN="", Q=Math.floor(Math.abs(N)), R;
 if (!Q || typeof(Q)=="undefined")
   return "0";
 while (true) {
  R=Q%radix;
  HexN = "0123456789abcdefghijklmnopqrstuvwxyz".charAt(R)+HexN;
  Q=(Q-R)/radix; if (Q==0) break;
 }
 return ((N<0) ? "-"+HexN : HexN);
}

function nextString(stream, pos)
{
   var stream0 = "*4*TRUE*";
   var index, len = null;

   if (stream.charAt(pos[0]) == '*')
   {
      pos[0]++;
      index = stream.indexOf("*", pos[0]);
      if (index > 0)
      {
         len = parseInt(stream.substring(pos[0], index));
         if (len==null) return "";
      }
      if (index < stream.length && stream.charAt(index) == '*')
      {
         str = stream.substring (index+1, len + index + 1);
         pos[0] = index + len + 1;
         return str;
      }
   }
   return "";
}

function setScrollTicker(direction, speedMode)
{
   if (msgBar==null || msgBar.msgArray.length==0) 
      return;
   else
   {
      if (direction) 
      {
         if (msgBar.direction != direction)
         {
            msgBar.direction = direction;
            
            // switch the In/Out message when switch direction
            tmp = msgBar.currentOutMsg;
            msgBar.currentOutMsg = msgBar.currentInMsg;
            msgBar.currentInMsg = tmp;
            // switch the In/Out pixel when switch direction
            tmp_shiftInPixel = msgBar.shiftInPixel;
            if (msgBar.shiftOutPixel == 0)
               msgBar.shiftInPixel = 0;
            else
               msgBar.shiftInPixel = msgBar.msgArray[msgBar.currentInMsg].HTMLWidth - msgBar.shiftOutPixel;
            if (tmp_shiftInPixel == 0)
               msgBar.shiftOutPixel = 0;
            else
               msgBar.shiftOutPixel = msgBar.msgArray[msgBar.currentOutMsg].HTMLWidth - tmp_shiftInPixel;
         }
      }
      if (speedMode) msgBar.speedMode = speedMode;
      else  msgBar.speedMode = "normal";
   }
}

function resizeHTMLMsgBar()
{
   if (msgBar==null) 
      return;
   else
      msgBar.resize();
}

function getBrowserType()
{
   var agt=navigator.userAgent.toLowerCase();
   
   // *** BROWSER VERSION ***
   // Note: On IE5, these return 4, so use is_ie5up to detect IE5.
   var is_major = parseInt(navigator.appVersion);
   var is_minor = parseFloat(navigator.appVersion);

   var is_gecko  = (agt.indexOf('gecko') != -1);
   if (is_gecko)
      return "nav6";
   var is_ie     = ((agt.indexOf("msie") != -1) && (agt.indexOf("opera") == -1));
   var is_ie3    = (is_ie && (is_major < 4));
   var is_ie4    = (is_ie && (is_major == 4) && (agt.indexOf("msie 4")!=-1) );
   var is_ie5up  = (is_ie && !is_ie3 && !is_ie4);
   if (is_ie5up)
      return "ie5";
   
   return "other"
}

function measureStringWidth(HTMLString, body_strlen)
{
   var measurer = document.getElementById("measurer");
   if (body_strlen)
      measurer.style.width = body_strlen*20;	// to make sure the measure is long enough
   
   measurer.innerHTML = "<span id=testspan>"+HTMLString+"</span>";
   var testspan = document.getElementById("testspan");
   var StringWidth = testspan.offsetWidth;
   
   if (browser_type == "ie5")
      StringWidth += 50;

   //alert(HTMLString+" - "+StringWidth);
   measurer.style.width = 0;
   // For FR#12-1VD8A0E
   measurer.innerHTML = "";
   return StringWidth;
}
