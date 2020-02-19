//////////////////////////////////////////////////////////////////////////////
//
// Copyright (C) 2002 Siebel Systems, Inc., 
// All rights reserved.
//
// FILE:       commToolbar.js
//
// CREATOR:    ZSUN
//
// DESCRIPTION
//    This file implements the html communication toolbar
//
//
//////////////////////////////////////////////////////////////////////////////

var controlList = new Array(50);
var controlListIndex = 0;
var anchorControl;
var statusQueue = new Queue(30);
var statusBox;
var helpTip;
var workItemComboBox;

var btnOvr = "#ffffff #696969 #696969 #ffffff";
var btnDwn = "#696969 #ffffff #ffffff #696969";
var btnOut = "#E0E0FF";
var btnTogl = "#696969 #ffffff #ffffff #696969";
var style_a = "text-decoration:none; color:black;";
var style_btnbar = "background-color:#E0E0FF; height:31px;";
var style_btn = "border:1px solid #E0E0FF;";
var style_btnOvr = "border:1px solid #000000; border-color:#ffffff #696969 #696969 #ffffff;";
var style_btnDwn = "border:1px solid #000000; border-color:#696969 #ffffff #ffffff #696969;";
var style_btnOut = "border:1px solid #E0E0FF;";
var style_btnTogl = "border:1px solid #000000; border-color:#696969 #ffffff #ffffff #696969;";
var style_helpTip	= "visibility:hidden; background:beige; color:black; position:absolute; top:0; left:0; padding-left:2px; padding-right:2px; text-decoration:none;";
var style_statusBox = "visibility:hidden; font:bolder Arial; color:black; text-decoration:none";
var style_timer = "border:0px; background:#E0E0FF;";
var style_sep = "border:1px solid #000000; border-color:#696969 #ffffff #ffffff #696969; width:2px;"

var bInSIMode = false;
var sLHString;

function Initiate_HTMLToolbar(toolbarID)
{
   var HTMLToolBarContainer = document.getElementById(toolbarID);
   if (HTMLToolBarContainer)
   {
      var sHTML = "";
      sHTML += "<table border=0 CELLPADDING=0 CELLSPACING=0 width=100% bgcolor=#E0E0FF height=33>";
      sHTML += "<tr><td><span id=\"Toolbar\">&nbsp;</span>";
      sHTML += "</td></tr></table>";
      
      HTMLToolBarContainer.innerHTML = sHTML;
   }
}

function CreateHTMLToolbar()
{
	var tbar = document.getElementById("Toolbar");
	if (tbar)
	{
		//controlList = controlList.sort(sortFunc);
		var sHTML = "";		
		sHTML += "<table border=0 CELLPADDING=0 CELLSPACING=1><tr><td valign=\"top\" style=\"overflow: hidden\">";
		sHTML += "<table border=0 CELLPADDING=0 CELLSPACING=3><tr>";
		for (i=0; i<controlListIndex; i++)
		{
			sHTML += "<td id=\""+controlList[i].id+" TD\" style=\"border:1px solid #E0E0FF;\">"+controlList[i].HTML+"</td>";
		}
		sHTML += "</tr></table></td><td style=\"overflow: hidden; border: 1px inset\">";
		sHTML += "<a href=\"#\" id=\"statusBox\" style='"+style_statusBox+"' onkeypress=\"checkKey('statusBox',event)\">";
		// fix for BUG#12704067, use similar fix as following OGHAG Link Helper issue fix
		if (typeof (Top()._swescript) != "undefined" && Top()._swescript.bAccessibleEnhanced == true)
		{
		   bInSIMode = true;
		   sLHString = Top()._swescript._SWEgetMessage("IDS_LINK_HELPER_STRING");
		   sHTML += "<span style= \"height:1px; width:1px; position:absolute; overflow:hidden; top=10px; visibility:hidden;\">";
		   sHTML += sLHString;
		   sHTML += "</span>";
		   sHTML += "</a></td></tr></table>";
		}
		else
		   sHTML += "</a></td></tr></table>";
	      
		sHTML += "<a href=\"#\" id=\"helpTip\" style='"+style_helpTip+"' onkeypress=\"checkKey('helpTip',event)\" onblur=\"loseFocus('helpTip')\">" ;
		// OGHAG Link Helper issue fix - adding a span tag to the hyperlink
		// Accessibility check added.
		if (bInSIMode == true)
		{
		   sHTML += "<span style= \"height:1px; width:1px; position:absolute; overflow:hidden; top=10px; visibility:hidden;\">";
		   sHTML += sLHString;
		   sHTML += "</span>";
		   sHTML += "&nbsp;</a>";
		}
		else
		   sHTML += "&nbsp;</a>";
		
		tbar.innerHTML = sHTML;
		
		for (i=0; i<controlListIndex; i++)
		{
			controlList[i].obj = document.getElementById(controlList[i].id);
			controlList[i].imgObj = document.getElementById(controlList[i].id + " Img");
			controlList[i].textObj = document.getElementById(controlList[i].id + " Text");
			controlList[i].container = document.getElementById(controlList[i].id + " TD");
		   if(controlList[i].type =="Combo Box")  
		      workItemComboBox = controlList[i].obj;
		}
		statusBox = document.getElementById("statusBox");
		helpTip = document.getElementById("helpTip");
	}
}

//FR 12-1METRKU
function setWindowStatus(msgStr)
{
	window.status=msgStr;
	document.mm = true;
}

//For FR#12-1OE2JR2
function changeReadyState(name, state)
{
	var newState = "";
	if (state == "Toggled" && name.indexOf("Agent State") != -1)
		newState = "Change To Ready. Enabled.";
	else if (state == "Enabled" && name.indexOf("Agent State") != -1)
		newState = "Change To Not Ready. Enabled.";
	else newState = state;
	return newState;
}

function HTMLControl(type, name, values, enabled, image, imaged, width, sequence, index)
{
	this.type = type;
	this.name = name;
	this.id = name;
	this.value = values;
	this.img = image;
	this.imgd = imaged;
	this.state = "Enabled";
	var img_src = this.img;
	if (enabled == "false") 
	{
		img_src = this.imgd;
		this.state = "Disabled";
	}
	this.tooltip = "";
	this.width = width;
	this.sequence = sequence+index*0.01;
	this.useIt = 1;
	this.obj = null;	
	this.imgObj = null;
	this.textObj = null;
	this.container = null;
	this.refresh = control_refresh;
	this.timerID = 0;
	this.tStart  = null;
	if (this.img == this.imgd) this.isStatic = true;
	else this.isStatic = false;
	
	//For FR#12-1OE2JR2
	var newSta = changeReadyState(this.name, this.state);
	var name_state = this.name + ". " + newSta;
	
	var sHTML = "";
	if (type=="Button")
	{
		var cb = new Array(3);
		
		//FR 12-1METRKU
		for (i=0; i<3; i++){
			if(i==1)
				cb[i] = "\"changeBorder('" + this.id + "'," + i + ");";
			else
				cb[i] = "\"changeBorder('" + this.id + "'," + i + ")\"";
		}
		//cb[i] = "\"changeBorder('" + this.id + "'," + i + ")\"";
		//sHTML += "<span style='"+style_btn+"'>"
		sHTML += "<a href=\"javascript:InvokeToolbarCommand('InvokeCommand', '" + this.id + "')\" ";
		sHTML += "alt=\"" + name_state + "\"";
		sHTML += "id=\""+ this.id + "\" onkeypress=\"checkKey('" + this.id + "',event)\" ";
		//sHTML += "onMouseOver="+cb[1]+" onMouseOut="+cb[0]+" onMouseDown="+cb[2]+" onfocus="+cb[1]+" onblur="+cb[0]+">";
		sHTML += "onMouseOver="+cb[1]+"setWindowStatus('" + this.name + "');return document.mm;\""+" onMouseOut="+cb[0]+" onMouseDown="+cb[2]+" onfocus="+cb[1]+"setWindowStatus('" + this.name + "');return document.mm;\"" + " onblur="+cb[0]+">";

		sHTML += "<img id=\"" + this.id + " Img\" style='"+style_btn+"' src=\"" + img_src + "\">";
		sHTML += "</a>";
		//sHTML += "</span>";
	}
	else if (type=="Edit")
	{
	   sHTML += "<LABEL for=\"" + this.id + "\" style=\"display:none\">" + this.name + "</LABEL>";
		sHTML += "<INPUT TYPE=\"text\" id=\"" + this.id + "\" title=\"" + this.name + "\" "; 
		sHTML += "VALUE=\"" + this.value + "\" onkeypress=\"checkKey('" + this.id + "',event)\" size=" + this.width + ">";
	}
	else if (type=="Combo Box")
	{
	   sHTML += "<LABEL for=\"" + this.id + "\" style=\"display:none\">" + this.name + "</LABEL>";
		sHTML += "<SELECT id=\"" + this.id + "\" name=\"" + this.name + "\" style=\"display:none;\" "; // for FR#12-1OELC05
		sHTML += "onchange=\"InvokeToolbarCommand('InvokeCommand', '" + this.id + "')\">";
		sHTML +=	"<OPTION VALUE=\"0\" SELECTED>" + "Work items list" + "</OPTION>";
		sHTML += "</SELECT>"
	}
	else if (type=="Timer")
	{
		this.starttime_server = 0;
		this.currenttime_server = 0;
		//sHTML += "<INPUT TYPE=\"text\" id=\"" + this.id + "\" style='"+style_timer+"' SIZE=8 VALUE=\"00:00:00\" title=\"" + this.name + "\">";
		sHTML += "<a href=\"#\" id=\"" + this.id + "\" style='"+style_a+"'><span style=\"DISPLAY: none\">"+this.name+"</span>00:00:00</a>";
	}
	else if (type=="Separator")
	{
		sHTML += "<span style='"+style_sep+"'></span>"
	}
	else
	{
		this.useIt = 0;
	}
	this.HTML = sHTML;
}

function control_refresh(property)
{
	if (this.type == "Button")
	{
		var img = this.imgObj;
		if (property=="state")
		{
			if (img!=null)
			{
			   changeBorder(this.id, -1);
				if (this.state == "Toggled") changeBorder(this.id, 3);
				else if (this.state == "unToggled") changeBorder(this.id, -1);
				else if (this.state == "Enabled")  img.src = this.img;
				else if (this.state == "Disabled") img.src = this.imgd;
				else if (this.state == "Blinking")
				{
					control_blink(this.id);
					// fix for FR12-1OQV7AH
					var vBtnBlinking = document.getElementById(this.id);
					// FR#12-1PE9XG2
					if(vBtnBlinking != null && this.id.indexOf("Accept") != -1)
						vBtnBlinking.focus();		
				 
				}
				//For FR#12-1OE2JR2
				var newSta = changeReadyState(this.name, this.state);	
				if (this.state!="unToggled")
					img.alt = this.name + ". " + newSta;
			}
			if (this.state!="unToggled")
			{
				var txt = this.textObj;
				if (txt!=null)
					txt.innerHTML = this.name + ". " + this.state;
				//FR# 12-1OQV7D3
				var aobj = this.obj;
			    if (aobj!=null)
				{
					//For FR#12-1OE2JR2
					var newSta = changeReadyState(this.name, this.state);			    
					aobj.alt = this.name + ". " + newSta;
				}

			}
		}
		else if (property=="image")
		{
			var img_src = "";
			if (this.isStatic) 
				img_src = this.img;
			else
			{
				img_src = this.img;
				if (this.state == "Disabled") img_src = this.imgd;
				else img_src = this.img;
			}
			if (img_src == "") this.obj.style.display = "none";
			else {
				img.src = img_src;
				this.obj.style.display = "inline";
			}
		}
	}
}
function control_blink(ID)
{
	var control = getControlObjById(ID);
	if (control == null) return;

	if (control.type == "Timer")
	{
		if(control.timerID)  clearTimeout(control.timerID);
	   if(!control.tStart)  control.tStart = new Date();
	   var tDate = new Date();
	   var diffTime = tDate.getTime() - control.tStart.getTime() + control.currenttime_server - control.starttime_server;
		//control.obj.value = getElapseTime(diffTime);
		control.obj.innerHTML = getElapseTime(diffTime);
		
		control.timerID  = setTimeout("control_blink('"+ID+"')", 1000);
	}
	else if (control.type == "Button")
	{
		if (control.imgObj.style.visibility == "visible")
			control.imgObj.style.visibility = "hidden";
		else
			control.imgObj.style.visibility = "visible";
			
		if (control.state != "Blinking")
		{
			control.imgObj.style.visibility = "visible";
			control_stopBlink(ID);
			return;
		}			
		control.timerID  = setTimeout("control_blink('"+ID+"')", 500);
	}
}
function control_stopBlink(ID)
{
	var control = getControlObjById(ID);
	if (control == null) return;
	
	if (control.timerID == 0) return;
	
	if (control.type == "Timer")
	{
		control.tStart = null;
		//control.obj.value = "00:00:00";
		control.obj.innerHTML = "00:00:00";
	}
	
	if(control.timerID) 
	{
      clearTimeout(control.timerID);
      control.timerID  = 0;
   }
}
function getControlObjById(ID)
{
	for (i=0;i<controlListIndex;i++)
	{
		//for bug 12809179
		if (controlList[i].id == String(ID))
			return controlList[i];
	}
	return null;
}
function getElapseTime(milSeconds)
{
	var sec = Math.floor(milSeconds / 1000);
	var hour = Math.floor(sec / 3600);
	sec -= hour*3600;
	var min = Math.floor(sec / 60);
	sec -= min*60;
   
   if (hour < 10) hour = "0"+hour;
   if (min < 10)  min = "0"+min;
   if (sec < 10)  sec = "0"+sec;
   return hour+":"+min+":"+sec;	
}
function InvokeToolbarCommand(command, ID) {
	var control = getControlObjById(ID);
	if (control.state != "Disabled") changeBorder(ID, 0);
	
	//FR 12-1MEBPSU
	//Add the parameter FromCTIToolBar=true
	var control_value = "&FromCTIToolBar=true";
	for (i=0; i<controlListIndex; i++)
	{
		if (controlList[i].type == "Edit")
		{
			//FR#12-1PE9752
			var ctrValue = controlList[i].obj.value;
			if (controlList[i].name == "Work Edit" && ctrValue != "")
				ctrValue = trimSpaces(ctrValue);
			control_value += "&" + controlList[i].name + "=" + ctrValue;
			control_value += "&" + controlList[i].name + "_HasFocus=true";
		}
		else if (controlList[i].type == "Combo Box")
		{
			var comboObj = controlList[i].obj;
			var selVal = comboObj.options[comboObj.selectedIndex].value;
			selVal = String(selVal);
			var pattern = / /g;
			var control_name = String(controlList[i].name);
			if (selVal == 'undefined')
				control_value += "&" + control_name.replace(pattern,"+") + "=";
			else
				control_value += "&" + control_name.replace(pattern,"+") + "=" + selVal.replace(pattern,"+");
		}
	}
	//alert("InvokeToolbarCommand "+control_value);
  	try { document.getElementById("Communication").InvokeToolbarCommand(command, ID, control_value); }
   catch(e) {}
}

//FR#12-1PE9752
function trimSpaces(Str){       
        var ResultStr = "";       
        Temp=Str.split(/\s/);        
        for(ii = 0; ii < Temp.length; ii++)       
            ResultStr +=Temp[ii];       
        return ResultStr;       
}

function CreateHTMLControl(type, name, values, enabled, image, width, sequence, index)
{
	var control = new HTMLControl(type, name, values, enabled, image, width, sequence, index);
	if (control.useIt==1)
	{
		controlList[controlListIndex] = control;
		controlListIndex++;
	}
}

function UpdateHTMLControl(ID, args)
{
	var property = "";
	var val = "";
	var args_str = String(args);
	//for bug 12809179
	var pos = args_str.indexOf("=");
	if (pos>0)
	{
		property = args_str.substring(0,pos);
		val = args_str.substring(pos+1, args_str.length);
	}
	else 
		return;
	
	if (ID == "statusBox")
	{
		// FR#12-1OE2JR2
	    var tmpFocus = document.getElementById(document.activeElement.id);
	    
	    statusBox.style.visibility = "visible";
		statusBox.innerHTML = val;
		statusBox.style.padding = "5px";
		statusQueue.add(val);
		
		// FR#12-1OE2JR2
		setTimeout(function helper() 
					{
						alert(val);//FR#12-1PEQKD6
						tmpFocus.blur();tmpFocus.focus();
					}, 500);
	}

	var control = getControlObjById(ID);
	if (control!=null)
	{
		if (property!="")
		{
			if (property == "tooltip")
			{
				// for FR#12-1OE2JR2
				var tmpImg = document.getElementById(ID + " Img");
				var tmpHref = document.getElementById(ID);
				var tmpAlt = tmpImg.alt;
				tmpImg.alt = val;
				tmpHref.blur();
				tmpHref.focus();
				tmpImg.alt = tmpAlt;
				//showHelpTip(control.obj, val);
			}
			else if (property == "state")
			{
				control.state = val;
				control.refresh("state");
			}
			else if (property == "value")
			{
				var value_array = val.split(",");
				if (control.type == "Button")
				{
					control.img = value_array[0];
					if (value_array[1]!=null) 
					{
						if (value_array[1]!="")
							control.imgd = value_array[1];
					}
					control.refresh("image");
				}
				else if (control.type == "Combo Box")
				{
					for (i=0; i<control.obj.options.length; i++) control.obj.options[i]=null;
					for (i=0; i<value_array.length; i+=2) control.obj.options[i/2]=new Option(value_array[i],value_array[i+1]);
					//if ((control.obj.options.length == 0) || (value_array[0] == ""))
					//   control.obj.options[0]=new Option("Work Items",0);
				}
				else if (control.type == "Timer")
				{
					if (value_array[0] == "start")  
					{ 
						control.starttime_server = value_array[1]*1000;
						control.currenttime_server = value_array[2]*1000;
						control.obj.disabled=false; control_blink(ID); 
					}
					if (value_array[0] == "stop")	  
					{ //control.obj.disabled=true; 
						control_stopBlink(ID); 
					}
				}
			}
		}
	}
}
function checkKey(ID, e)
{
	var key_code = (navigator.appName == "Netscape") ? e.which : e.keyCode;
	if (ID=="statusBox")
	{
		if (key_code==112)	// press 'p' for previous
		{
			var str = statusQueue.get("prev");
			if (str!=null) statusBox.innerHTML = str;
		}
		else if (key_code==110)	// press 'n' for next
		{
			var str = statusQueue.get("next");
			if (str!=null) statusBox.innerHTML = str;
		}
		// set focus to statusBox
		statusBox.blur();
		statusBox.focus();
		return;
	}
	
	if (ID=="helpTip")	// press any key to erase tooltip
	{
		if (anchorControl!=null) anchorControl.focus();
		hideHelpTip();
	}
	else
	{
		anchorControl = document.getElementById(ID);

		// FR#12-1OE2JR2
		if (key_code==119)	// press "w" to get dynamic tooltip
			InvokeToolbarCommand("GetDynamicTooltip", ID);
			
		//if (key_code==104)	// press "h" to get tooltip
			//InvokeToolbarCommand("GetDynamicTooltip", ID);
	}
}
function changeBorder(ID,flag)
{
	var control = getControlObjById(ID);
	if (control.state == "Enabled" || control.state == "Blinking")
	{
		if (flag==0) control.container.style.borderColor = btnOut;
		if (flag==1) control.container.style.borderColor = btnOvr;
		if (flag==2) control.container.style.borderColor = btnOut;
	}
	if (flag==3) control.container.style.borderColor = btnTogl;
	if (flag==-1) control.container.style.borderColor = btnOut;

}
function loseFocus(ID)
{
	if (ID=="helpTip")
	{
		if (anchorControl!=null) anchorControl.focus();
		hideHelpTip();
	}
}
function showHelpTip(anchorControl, text)
{
	helpTip.innerHTML = text;
	helpTip.style.visibility = "visible";
	helpTip.focus();
	var tipWidth = helpTip.offsetWidth;
	var anchorOffsetLeft = getOffsetLeft(anchorControl);
	var anchorWidth = anchorControl.offsetWidth;
	
	if (workItemComboBox)
	{
   	var workItemComboBoxOffsetLeft = getOffsetLeft(workItemComboBox);
   	if (anchorOffsetLeft < workItemComboBoxOffsetLeft && (anchorOffsetLeft+anchorWidth-2+tipWidth) > workItemComboBoxOffsetLeft)
   	   helpTip.style.left = anchorOffsetLeft-tipWidth+5;
   	else
   	   helpTip.style.left = anchorOffsetLeft+anchorWidth-2;
	}
	else
	   helpTip.style.left = anchorOffsetLeft+anchorWidth-2;
	
	if (navigator.appName == "Netscape")
		helpTip.style.top = getOffsetTop(anchorControl);
	else
		helpTip.style.top = getOffsetTop(anchorControl)+12;
	
	//helpTip.style.visibility = "visible";
	//helpTip.focus();
}
function hideHelpTip()
{
	helpTip.style.visibility = "hidden";
	// fix for BUG#12704067, when hiding, set link text as "ignore link"
	if (bInSIMode == true)
	{
		var sHTML="";
		sHTML += "<span style= \"height:1px; width:1px; position:absolute; overflow:hidden; top=10px; visibility:hidden;\">";
		sHTML += sLHString;
		sHTML += "</span>";
		sHTML += "&nbsp;";
		helpTip.innerHTML = sHTML;
	}
}

function Queue(size)
{
	this.size = size;
	this.bufArray = new Array(size);
	this.head = 0;
	this.tail = 0;
	this.length = 0;
	this.cursor = 0;
	this.bound = 0;	// -1, 0, 1
	this.add = Queue_add;
	this.get = Queue_get;
}
function Queue_add(item)
{
	this.bufArray[this.tail] = item;
	this.tail++;  if (this.tail>=this.size) this.tail -= this.size;
	if (this.length < this.size)
		this.length++;
	else
	{
		this.head++;  if (this.head>=this.size) this.head -= this.size;
	}
	this.cursor = this.tail;
	this.bound = 1;
}
function Queue_get(where)
{
	if (this.length==0) return null;

	if (where=="prev" && this.bound!=-1)
	{
		if (this.cursor == this.tail) this.cursor -= 2;
		else this.cursor--;  
		if (this.cursor<0) this.cursor = this.size-1;
		if (this.cursor == this.head) this.bound = -1;	// left bound
		else this.bound = 0;
	}
	else if (where=="next" && this.bound!=1)
	{
		this.cursor++;  if (this.cursor>=this.size) this.cursor -= this.size;
		var tail = this.tail-1;  if (this.tail>=this.size) this.tail -= this.size;
		if (this.cursor == tail) this.bound = 1;	// right bound
		else this.bound = 0;
	}
	else
		return null;
	return this.bufArray[this.cursor];
}

function getOffsetLeft (el) {
	var ol = el.offsetLeft;
	while ((el = el.offsetParent) != null) { 
		ol += el.offsetLeft; 
	}
	return ol;
}
function getOffsetTop (el) {
	var ot = el.offsetTop;
	while((el = el.offsetParent) != null) { 
		ot += el.offsetTop; 
	}
	return ot;
}
function sortFunc(c1,c2) {
	return c1.sequence - c2.sequence;
}
