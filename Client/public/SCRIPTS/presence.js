/////////////////////////////////////////////////////////////////////////////
// JavaScript file to support the presence indicator using Name Control
//
// This file contains all the functions required to interact with Microsoft's
// Name Control.
// 
// Creator: Rahul Joshi
// Release: 7.9 Collaboration, IM Integration
//
/////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////
// Global Variables declared to perform actions
//
/////////////////////////////////////////////////////////////////////////////

var IMNControlObj = null;
var bIMNControlInited = false;
var IMNDictionaryObj = null;
var bIMNSorted = false;
var bIMNOnloadAttached = false;
var IMNOrigScrollFunc = null;
var bIMNInScrollFunc = false;
var IMNSortableObj = null;
var IMNHeaderObj = null;
var IMNNameDictionaryObj = null;
var IMNShowOfflineObj = null;

/////////////////////////////////////////////////////////////////////////////
// Function to instantiate the name control activex object.
//
// This function will create a new instance of the name control activex object
//
/////////////////////////////////////////////////////////////////////////////

function EnsureIMNControl()
{
    if (!bIMNControlInited)
    {
        if (browseris.ie5up && browseris.win32)
        {
//@cc_on
//@if (@_jscript_version >= 5)
//@            try
//@            {
//@                IMNControlObj = new ActiveXObject("Name.NameCtrl.1");
//@            } catch(e)
//@            {
//@                
//@            };
//@else
//@end
        }
        bIMNControlInited = true;
        if (IMNControlObj)
        {
            IMNControlObj.OnStatusChange = IMNOnStatusChange;
        }
    }
    return IMNControlObj;
}


////////////////////////////////////////////////////////////////////////
// Function to instantiate Name Control with the eMail Id provided
//
// This is most important function and calls other utilitiy functions 
// to do other tasks.
//
// Input: Presence URI OR Email Address, String
//
////////////////////////////////////////////////////////////////////////

function IMNRC(name)
{
    if (name == null || name == '')
        return;
    if (browseris.ie5up && browseris.win32)
    {
        var obj = window.event.srcElement;
        var objSpan = obj;
        var id = obj.id;
        var fFirst = false;
        if (!IMNDictionaryObj)
        {
            IMNDictionaryObj = new Object();
            IMNNameDictionaryObj = new Object();
            IMNSortableObj = new Object();
            IMNShowOfflineObj = new Object();
            if (!IMNOrigScrollFunc)	
            {
                IMNOrigScrollFunc = window.onscroll;
                window.onscroll = IMNScroll;
            }
        }
        if (IMNDictionaryObj)
        {
            if (!IMNNameDictionaryObj[id])
            {
                IMNNameDictionaryObj[id] = name;
                fFirst = true;
            }
            else if (name != IMNNameDictionaryObj[id] )
            {
                IMNNameDictionaryObj[id] = name;
                fFirst = true;
            }

            if (typeof(IMNDictionaryObj[id]) == "undefined")
            {
                IMNDictionaryObj[id] = 1;
            }
            if (!IMNSortableObj[id] &&
                (typeof(obj.Sortable) != "undefined"))
            {
                IMNSortableObj[id] = obj.Sortable;
                if (!bIMNOnloadAttached)
                {
                    if (EnsureIMNControl() && IMNControlObj.PresenceEnabled)
                        window.attachEvent("onload", IMNSortTable);
                    bIMNOnloadAttached = true;
                }
            }
            if (!IMNShowOfflineObj[id] &&
                (typeof(obj.ShowOfflinePawn) != "undefined"))
            {
                IMNShowOfflineObj[id] = obj.ShowOfflinePawn;
            }
            if (EnsureIMNControl() && IMNControlObj.PresenceEnabled)
            {
                var state = 1, img;
                state = IMNControlObj.GetStatus(name, id);
                // The following line is commented !
                //if (IMNIsOnlineState(state) || IMNSortableObj[id] || IMNShowOfflineObj[id])
                {
                    img = IMNGetStatusImage(state, IMNSortableObj[id] ||
                                            IMNShowOfflineObj[id]);
                    IMNUpdateImage(id, img);
                    IMNDictionaryObj[id] = state;
                }
            }        
        }
        //if (fFirst)
        {
            var objRet = IMNGetOOUILocation(obj);
            objSpan = objRet.objSpan;
            if (objSpan)
            {
                objSpan.onmouseover = IMNShowOOUIMouse;
                objSpan.onfocusin = IMNShowOOUIKyb;
                objSpan.onmouseout = IMNHideOOUI;
                objSpan.onfocusout = IMNHideOOUI;
            }
        }
    }
}

////////////////////////////////////////////////////////////////////////
// Function to retrive appropriate status image based on the current 
// presence status
//
// This function selects an appropriate image based on the presence 
// status.
//
// Input: Presence State, Integer 
// 			  Show Offline image, Boolean
//
////////////////////////////////////////////////////////////////////////


function IMNGetStatusImage(state, showoffline)
{
    var img = "imnblank.gif";
    showoffline = true ;
    switch (state)
    {
        case 0:
            img = "imnon.gif";
        break;      
        case 1:
            if (showoffline)
            {
                img = "imnoff.gif";
            }
            else
            {
                img = "imnblank.gif";
            }
        break;  
        case 2:
            img = "imnaway.gif";
        break;
        case 3:
            img = "imnbusy.gif";
        break;
        case 4:
            img = "imnaway.gif";
        break;
        case 5:
            img = "imnbusy.gif";
        break;
        case 6:
            img = "imnaway.gif";
        break;
    }
    return img;
}

////////////////////////////////////////////////////////////////////////
// Function to get header image, typically a gray pawn
//
// Input: None
//
////////////////////////////////////////////////////////////////////////

function IMNGetHeaderImage()
{
    return "imnhdr.gif";
}

////////////////////////////////////////////////////////////////////////
// Function to return the online state of the current object
//
// Input: Presence State, Boolean
//
////////////////////////////////////////////////////////////////////////

function IMNIsOnlineState(state)
{
    if (state == 1)
    {
            return false;
    }
    return true;
}


////////////////////////////////////////////////////////////////////////
// Function to sort the list of the objects
//
// Input: Index, Integer
//				Old online state, Integer
//				Current state, Integer
//
////////////////////////////////////////////////////////////////////////

function IMNSortList(j, oldState, state)
{
    var objTable = null; 
    var objRow = null;
    if (IMNSortableObj && IMNSortableObj[j])
    {
        objRow = document.getElementById(j);
        while (objRow && !(objRow.tagName == "TR" &&
               typeof(objRow.Sortable) != "undefined"))
        {
            objRow = objRow.parentNode;
        }
        objTable = objRow;
        while (objTable && objTable.tagName != "TABLE")
        {
            objTable = objTable.parentNode;
        }
        if (objTable != null && objRow != null)
        {
            if (objTable.rows[1].style.display == "none")
            {
                for (i=1; i<4; i++)
                {
                    objTable.rows[i].style.display = "block";
                }
            }
            if (!IMNIsOnlineState(oldState) && IMNIsOnlineState(state))
            {
                objTable.rows[2].style.display = "none"; 
                i = 3;
                while (objTable.rows[i].id != "Offline" && objTable.rows[i].innerText < objRow.innerText)
                	i++;
                objTable.moveRow(objRow.rowIndex, i); 
                if (	objTable.rows[objTable.rows.length - 3].id == "Offline")
                {   
                    objTable.rows[objTable.rows.length - 2].style.display = "block"; 
                }
            }
            else if (IMNIsOnlineState(oldState) && !IMNIsOnlineState(state))
            {
                if (objRow.rowIndex == 3 && 
                	objTable.rows[objRow.rowIndex + 1].id == "Offline")
                {   
                    objTable.rows[2].style.display = "block"; 
                }
                if (objTable.rows[objTable.rows.length - 3].id == "Offline")
                {   
                    objTable.rows[objTable.rows.length - 2].style.display = "none"; 
                }
                i = objTable.rows.length - 2;
                while (objTable.rows[i - 1].id != "Offline" && objTable.rows[i].innerText > objRow.innerText)
                    i--;
                objTable.moveRow(objRow.rowIndex, i); 
            }
        }
    }
}

////////////////////////////////////////////////////////////////////////
// Function to change the state displayed on the object when there is 
// a presence status change. 
//
// This function is responsible for responding to the AactiveX events
// based on the OnStatusChange flag.
//
// Input: Presence URI OR Email Address, String
//				Presence state, Integer
//				HTML Id, String (HTML id of the element)
//
////////////////////////////////////////////////////////////////////////

function IMNOnStatusChange(name, state, id)
{
    if (IMNDictionaryObj)
    {
        var img = IMNGetStatusImage(state, IMNSortableObj[id] ||
                                    IMNShowOfflineObj[id]);
        if (IMNDictionaryObj[id] != state)
        {
            if (bIMNSorted)
                IMNSortList(id, IMNDictionaryObj[id], state);
            IMNUpdateImage(id, img);
            IMNDictionaryObj[id] = state;
        }
    }
}

/////////////////////////////////////////////////////////////////////////////
// Function to update status image displayed according to the presence state
//
// This function updates the current image with the new image according to 
// the presence status.
//
// Input: HTML Id, String
// 				New Image name, String
//
/////////////////////////////////////////////////////////////////////////////

function IMNUpdateImage(id, img)
{
    var obj = document.images(id);
    if (obj)
    {
        var oldImg = obj.src;
        var index = oldImg.lastIndexOf("/");
        var newImg = oldImg.slice(0, index + 1);
        newImg += img;
        if (oldImg != newImg)
            obj.src = newImg;
        if (obj.altbase)
        {
            obj.alt = obj.altbase;
        }
    }
}

/////////////////////////////////////////////////////////////////////////////
// Function to handle and respond the keyboard accelarators
//
// This function will trigger the actions when the specific keyboard 
// accelrators are clicked.
//
// Input: None
//
/////////////////////////////////////////////////////////////////////////////

function IMNHandleAccelerator()
{
    if (IMNControlObj)
    {
       if (event.altKey && event.shiftKey &&
            event.keyCode==121)
        {
           IMNControlObj.DoAccelerator();
        }
    }
}

/////////////////////////////////////////////////////////////////////////////
// Function to get the onscreen coordinates of the object being displayed
//
// This function retrieves the x, y coordinates to identify the location in  
// order to display the context menu at that location.
//
// Input: Object in context, Object
//
/////////////////////////////////////////////////////////////////////////////


function IMNGetOOUILocation(obj)
{
    var objRet = new Object;
    var objSpan = obj;
    var objOOUI = obj;
    var oouiX = 0, oouiY = 0, objDX = 0;
    var fRtl = document.dir == "rtl";
    while (objSpan && objSpan.tagName != "SPAN" && objSpan.tagName != "TABLE")
    {
        objSpan = objSpan.parentNode;
    }
    if (objSpan)
    {
       var collNodes = objSpan.tagName == "TABLE" ?
                       objSpan.rows(0).cells(0).childNodes :
                       objSpan.childNodes;
       var i;
       for (i = 0; i < collNodes.length; ++i)
       {   
           if (collNodes.item(i).tagName == "IMG" && collNodes.item(i).id)
           {
               objOOUI = collNodes.item(i);
               break;
           }
       }
    }
    obj = objOOUI;
    while (obj)
    {
        if (fRtl)
        {
             if (obj.scrollWidth >= obj.clientWidth + obj.scrollLeft)        
                  objDX = obj.scrollWidth - obj.clientWidth - obj.scrollLeft;             
             else
                  objDX = obj.clientWidth + obj.scrollLeft - obj.scrollWidth;
             oouiX += obj.offsetLeft + objDX;
        }
        else
            oouiX += obj.offsetLeft - obj.scrollLeft;
        oouiY += obj.offsetTop - obj.scrollTop;
        obj = obj.offsetParent;            
    }
    try
    {
        obj = window.frameElement;
        while (obj)
        {
            if (fRtl)
            {
                if (obj.scrollWidth >= obj.clientWidth + obj.scrollLeft)        
                    objDX = obj.scrollWidth - obj.clientWidth - obj.scrollLeft;             
                else
                    objDX = obj.clientWidth + obj.scrollLeft - obj.scrollWidth;
                oouiX += obj.offsetLeft + objDX;
            }
            else
                oouiX += obj.offsetLeft - obj.scrollLeft;
            oouiY += obj.offsetTop - obj.scrollTop;
            obj = obj.offsetParent;
        }
    } catch(e)
    {
    };
    objRet.objSpan = objSpan;
    objRet.objOOUI = objOOUI;
    objRet.oouiX = oouiX;
    objRet.oouiY = oouiY;
    if (fRtl)
        objRet.oouiX += objOOUI.offsetWidth;
    return objRet;
}

/////////////////////////////////////////////////////////////////////////////
// Function to Show context menu based on mouse actions
//
//
// Input: None
//
/////////////////////////////////////////////////////////////////////////////

function IMNShowOOUIMouse()
{
    IMNShowOOUI(0);
}

/////////////////////////////////////////////////////////////////////////////
// Function to Show context menu based on keyboard actions
//
//
// Input: None
//
/////////////////////////////////////////////////////////////////////////////

function IMNShowOOUIKyb()
{
    IMNShowOOUI(1);
}

/////////////////////////////////////////////////////////////////////////////
// Function to Show context menu for an object in context
//
//
// Input: Input type (mouse or keyboard), Integer
//
/////////////////////////////////////////////////////////////////////////////

function IMNShowOOUI(inputType)
{
    if (browseris.ie5up && browseris.win32)
    {
        var obj = window.event.srcElement;
        var objSpan = obj;
        var objOOUI = obj;
        var oouiX = 0, oouiY = 0;
        if (EnsureIMNControl() && IMNNameDictionaryObj)
        {
            var objRet = IMNGetOOUILocation(obj);
            objSpan = objRet.objSpan;
            objOOUI = objRet.objOOUI;
            oouiX = objRet.oouiX;
            oouiY = objRet.oouiY;
            var name = IMNNameDictionaryObj[objOOUI.id];
            if (objSpan)
                objSpan.onkeydown = IMNHandleAccelerator;
            IMNControlObj.ShowOOUI(name, inputType, oouiX, oouiY);
        }
    }
}

/////////////////////////////////////////////////////////////////////////////
// Function to hide the context menu when mouse moves away or click outside
// the object is received
//
// Input: None
//
/////////////////////////////////////////////////////////////////////////////

function IMNHideOOUI()
{
    if (IMNControlObj)
    {
        IMNControlObj.HideOOUI();
        return false;
    }
    return true;
}

/////////////////////////////////////////////////////////////////////////////
// Function to hide the context menu based on window scroll
//
//
// Input: None
//
/////////////////////////////////////////////////////////////////////////////

function IMNScroll()
{
    if (!bIMNInScrollFunc)
    {
        bIMNInScrollFunc = true;
        IMNHideOOUI();
    }
    bIMNInScrollFunc = false;
    return IMNOrigScrollFunc ? IMNOrigScrollFunc() : true;   
}

/////////////////////////////////////////////////////////////////////////////
// Function to keep the objects list sorted
//
//
// Input: None
//
/////////////////////////////////////////////////////////////////////////////

function IMNSortTable()
{
    var id;
    for (id in IMNDictionaryObj)
    {
        IMNSortList(id, 1, IMNDictionaryObj[id]);
    }
    bIMNSorted = true;
}

/////////////////////////////////////////////////////////////////////////////
// Function to register the header object to receive the window events
//
//
// Input: None
//
/////////////////////////////////////////////////////////////////////////////

function IMNRegisterHeader()
{
    if (browseris.ie5up && browseris.win32)
    {
        var obj = window.event.srcElement;
        if (!IMNHeaderObj)
        {
            IMNHeaderObj = new Object();
        }
        if (IMNHeaderObj)
        {
            var id = obj.id;
            if (!IMNHeaderObj[id])
            {
                IMNHeaderObj[id] = id;
                var img;
                img = IMNGetHeaderImage();
                IMNUpdateImage(id, img);
            }
        }
    }
}

/////////////////////////////////////////////////////////////////////////////
// Function to determine the browser's (user agent's) type, class and 
// other information
//
// This function will identify if the browser in question is Internet Explorer 
// with Version 5.5 or up. Else it will return false
//
/////////////////////////////////////////////////////////////////////////////


function Browseris () {
	var agt = navigator.userAgent.toLowerCase();
        this.osver = 1.0;
        if (agt)
        {
            var stOSVer = agt.substring(agt.indexOf("windows ") + 11);
	    this.osver = parseFloat(stOSVer);
        }
	this.major = parseInt(navigator.appVersion);
	this.nav = ((agt.indexOf('mozilla')!=-1)&&((agt.indexOf('spoofer')==-1) && (agt.indexOf('compatible')==-1)));
 	this.nav2 = (this.nav && (this.major == 2));
	this.nav3 = (this.nav && (this.major == 3));
	this.nav4 = (this.nav && (this.major == 4));
	this.nav6 = this.nav && (this.major == 5);
	this.nav6up = this.nav && (this.major >= 5);
	this.nav7up = false;
	if (this.nav6up)
	{
		var navIdx = agt.indexOf("netscape/");
		if (navIdx >=0 )
			this.nav7up = parseInt(agt.substring(navIdx+9)) >= 7;
	}
	this.ie = (agt.indexOf("msie")!=-1);
	this.aol = this.ie && agt.indexOf(" aol ")!=-1;
	if (this.ie)
		{
		var stIEVer = agt.substring(agt.indexOf("msie ") + 5);
		this.iever = parseInt(stIEVer);
		this.verIEFull = parseFloat(stIEVer);
		}
	else
		this.iever = 0;
	this.ie3 = ( this.ie && (this.major == 2));
	this.ie4 = ( this.ie && (this.major == 4));
	this.ie4up = this.ie && (this.major >=4);
	this.ie5up = this.ie && (this.iever >= 5);
	this.ie55up = this.ie && (this.verIEFull >= 5.5);
	this.ie6up = this.ie && (this.iever >= 6);
    this.win16 = ((agt.indexOf("win16")!=-1)
               || (agt.indexOf("16bit")!=-1) || (agt.indexOf("windows 3.1")!=-1)
               || (agt.indexOf("windows 16-bit")!=-1) );
    this.win31 = (agt.indexOf("windows 3.1")!=-1) || (agt.indexOf("win16")!=-1) ||
                 (agt.indexOf("windows 16-bit")!=-1);
    this.win98 = ((agt.indexOf("win98")!=-1)||(agt.indexOf("windows 98")!=-1));
    this.win95 = ((agt.indexOf("win95")!=-1)||(agt.indexOf("windows 95")!=-1));
    this.winnt = ((agt.indexOf("winnt")!=-1)||(agt.indexOf("windows nt")!=-1));
    this.win32 = this.win95 || this.winnt || this.win98 ||
                 ((this.major >= 4) && (navigator.platform == "Win32")) ||
                 (agt.indexOf("win32")!=-1) || (agt.indexOf("32bit")!=-1);
    this.os2   = (agt.indexOf("os/2")!=-1)
                 || (navigator.appVersion.indexOf("OS/2")!=-1)
                 || (agt.indexOf("ibm-webexplorer")!=-1);
    this.mac    = (agt.indexOf("mac")!=-1);
    this.mac68k = this.mac && ((agt.indexOf("68k")!=-1) ||
                               (agt.indexOf("68000")!=-1));
    this.macppc = this.mac && ((agt.indexOf("ppc")!=-1) ||
                               (agt.indexOf("powerpc")!=-1));
    this.w3c = this.nav6up;
}
var browseris = new Browseris();
