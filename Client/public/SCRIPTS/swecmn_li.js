//swecmn_li.js 

function SWESelectAppletMenu(frameName, url)
{
   if (typeof(frameName) == "undefined" || frameName == "")
      frameName = "_self";
   
   var frameObj = SWEFindFrame(top, frameName);
   var i,splitStr,subsplit, done1=0, done2=0;
   var height, width;

   if (frameObj != null && url !="")
   {
      eval(url);
   }
}


// Delay the actual resizing for 10 ms because in NS 6.2 onload may fire prematurely.
function SWEPopupNNSize() 
{  
   var popWin=Top().SWEPopupWin;
   if((popWin == null) || (popWin.closed))
      popWin = window;
		
   popWin.scrollTo(10000, 10000);
   setTimeout("NNResize()", 10);
}

// called by setTimeout in SWEPopupNNSize() 
// Sets the Popup size of the browser window for Netscape by getting the available screen size
// and the actual size of the popup.
//
function NNResize()
{
   var popWin  = Top().SWEPopupWin;
   var screenX = SWEGetAvailScreenWidth();
   var screenY = SWEGetAvailScreenHeight(); 
   var bSafari = false;
   
   if (navigator.userAgent.indexOf("Safari") >= 0)
      bSafari = true;

   if ((popWin == null) || (popWin.closed))
      popWin = window;

   popWin.scrollTo(10000,10000);

   if (navigator.userAgent.indexOf("Mozilla/5.0") >= 0) 
   {
         // Ported this fix from 7.5.3,
         // fix for defect 12-FTAGAQ and 12-FS6ESU
         // In NS 7.0x, sizeToContent() doesnt work, and there's following problems:
         // 1) window.pageYOffset + window.content.innerHeight != window.document.height
         // 2) window.innerHeight > window.outerHeight
         // 3) resizeTo(..., window.document.height + window.outerHeight - window.innerHeight) doesn't fit to content

        //FR 12-1EXWTY9  before resize needs to move window since safari will NOT allow resize beyond screen
         var winX = popWin.screenX;
         var winY = popWin.screenY;
         if (bSafari)
         {   
             popWin.moveTo(0,0);
         }
		
         // fix 1) and 2), start with tall window	
         window.resizeBy(0, 400);
         var offX = window.pageXOffset;
         var newY = window.document.height + window.outerHeight - window.innerHeight;
         
         if (offX > screenX - window.outerWidth)
         {
            offX = screenX - window.outerWidth; 
         }
         //CR 12-J1RBUM. If a window's vertical size is smaller than 180 then in Mozilla and netscape
         //the horizontal scrollbar (bottom of the window) is clipped. So have 180 as the lower bound
         //for the size - amohole
         if(newY < 180)
         {
            newY = 180;
         }
         if (newY > screenY)
         {
            newY = screenY;
         }

         window.resizeTo(offX+window.outerWidth, newY);
         
         //fix 3)
         window.scrollTo(0,10000);
         if(window.pageYOffset > 0)
         {
            window.resizeBy(0, window.pageYOffset);
         }

         if (bSafari)
         {
            popWin.moveTo(winX, winY);
         }

   }
   else
   {
      var offX = window.pageXOffset;
      var offY = window.pageYOffset; 

      if (offX > screenX - window.outerWidth)
         offX = screenX - window.outerWidth; 
      if (offY > screenY - window.outerHeight)
         offY = screenY - window.outerHeight;

      window.resizeBy (offX, offY);
   }
   popWin.moveTo (Math.floor((screenX-window.outerWidth) / 2), 
                  Math.floor((screenY-window.outerHeight) / 2) );
}


// This function should not return any value (12-H6DUU2)
//12-N69UQO. We will set a new variable showNSPopup instead of return values
//If return is false in Maria's fix, we will set showNSPopup = false
function SWEShowPopup (url, height, width, bFull, bFree, extraFeatures)
{
   var position;
   var sFeatures;
   
   //Accesibilty Phase3 : Session Warning. Clear timeout in the base page before
   //opening the Popup.
   if((typeof (Top().iRef) != "undefined") && Top().iRef > 0)
   {
       Top().iRef=Top().iRef - 1;
   }
   
   // 12-K3TPZX
   if (navigator.appName == "Netscape")
   {
      if (typeof (Top().isPopupBusy) == "undefined" ||
          Top().isPopupBusy == false)
      {
         Top().isPopupBusy = true;
      }
      else
      {
         Top().isPopupBusy = false; // safeguard against infinite setting of busy
         Top().showNSPopup = false;
         return;
      }
   }


   // use full toolbars if full
   // 
   if (bFull == true || bFull == "true")
      sFeatures = "scrollbars=yes,resizable,location,toolbar,menubar,status,personalbar,";
   else
      sFeatures = "resizable,scrollbars=yes,";

   // set the size
   //
   if (!Top().SWEPopupResizeNoAuto && 
      (typeof(height) == "undefined" || typeof(width) == "undefined" || 
      height <= 0 || width <= 0 ||
      SWEGetAvailScreenWidth()-width <0 || SWEGetAvailScreenHeight()-height <0))
   {
      height   = 480;	
      width    = 640;
   }
   
   // AOL 6.0 has defect that position is interpreted as position of content
   // in popup window as opposed to position of popup window itself MEK
   //
   if (navigator.userAgent.toUpperCase().indexOf("AOL 6.") > -1)  // 12-ENMO2V
      position = SWEPosition(0,0); 
   else
      position = SWEPosition (parseInt((SWEGetAvailScreenWidth()-width)/2),
                              parseInt((SWEGetAvailScreenHeight()-height)/2));

   sFeatures += ("height=" + height + ",width= " + width);

   if (typeof(extraFeatures)  != 'undefined' && extraFeatures != null && extraFeatures != "")
      sFeatures = sFeatures + "," + extraFeatures;
   
   // open a free window if bFree
   //
   if (bFull == true || bFull == "true")
   {
        //12-JABPQZ Mozilla can not handle opening a popup within a popup
      	Top().open (url, "", sFeatures);
      	
         if (navigator.appName == "Netscape")
         {
            Top().isPopupBusy = false;
            Top().showNSPopup = true;
         }
      	return;
   }      
   if (bFree == true || bFree == "true")
   {
      //12-JABPQZ Mozilla can not handle opening a popup within a popup
      Top().open (url, "", sFeatures+position);

      if (navigator.appName == "Netscape")
      {
         Top().isPopupBusy = false;
         Top().showNSPopup = true;
      }
      return;
   }

   if (Top().SWEPopupWin != null && 
       typeof(Top().SWEPopupWin.closed) != "unknown" && 
       !Top().SWEPopupWin.closed)
   {
      if (url != "")
         Top().SWEPopupWin.location.replace (url);
   }
   else
   {
      Top().SWEPopupWin = open (url, Top().SWEHtmlPopupName, sFeatures + position);
   }
   
   if (navigator.appName == "Netscape")
   {
      Top().isPopupBusy = false;
      Top().showNSPopup = true;
   }
   
   return;
}

// FR#12-1YGT7GN:Show Report Popup . 
// Befor open url, created porpset and append to url
function SWEShowReportPopup (url, strReportName)
{   
    if (url == "")
    {
        if ( typeof(s_SWEReport ) != "undefined" )
        {
            s_SWEReport.options[0].selected = true;
        }
        return;
    }
    
    if (strReportName == null)
    {
        strReportName = "";
    }
    
    var strCurrentFrame = Top()._swescript.GetCurrentAppletName();
    if (strCurrentFrame == null)
    {
        strCurrentFrame = "";
    }
    
    //propSet string like : @0`0`2`0``0`CurrentFrameName`<CurrentFrame>`ReportExecutableName`<ReportName>`
    //Some of them will not be used, but still we add them.
    var propSet = "@0`0`2`0``0`";
    propSet = propSet + "CurrentFrameName`" + strCurrentFrame + "`";
    propSet = propSet + "ReportExecutableName`" + strReportName + "`";
    
    url = SWEAppendArgsToURL(url, "SWEIPS", propSet);
    
    var bFromPopup = IsSWEPopup(this);
    if (pendingChanges(bFromPopup) && StopForSavingData(bFromPopup))
    {
        if ( typeof(s_SWEReport ) != "undefined" )
        {
            s_SWEReport.options[0].selected = true;
        }
        return;
    }

    
    SWEShowPopup(url);
    
    if ( typeof(s_SWEReport ) != "undefined" )
    {
        s_SWEReport.options[0].selected = true;
    }
}

// Sets the Popup Size for all browser windows except Netscape by getting the available screen size
// and the actual size of the popup based on the scrollwidth and scrollheight. If bHide is TRUE
// it hides the popup else it shows the Popup. Sometimes when the SWESPNH flag is set for 
// someoperations then we do not want to hide the popups.
//
function SWEPopupSize(bHide)
{
   var deltaX;
   var deltaY;

   if (bHide && 
       SWEGetPopupResizeNoHide())
   {
      return;
   }
  
   var body    = document.body;
   var popWin  = Top().SWEPopupWin;

   if (popWin == null || popWin.closed)
   {
      popWin  = window;
   }
  
   if (popWin != null && !popWin.closed)
   {
      if (bHide)
      {
         //With XP SP2 it is no loger allowed to move popup offscreen
         //So we make the window of minimum possible allowed size (100,100)
         //and move it to the top left corner of the screen and using
         //alwaysLowered flag put it last in the z order 
         popWin.innerWidth = 100;
         popWin.innerHeight = 100;
         popWin.screenX = 0;
         popWin.screenY = 0;
         popWin.alwaysLowered = true;
      }
      else
      {
         //reset the flag which puts popup window last in the z order
         popWin.alwaysLowered = false;
         var screenX = SWEGetAvailScreenWidth();
         var screenY = SWEGetAvailScreenHeight();
      
         if (typeof Top().SWEPopupResizeNoAuto != "undefined" && Top().SWEPopupResizeNoAuto)
         {
            Top().SWEPopupResizeNoAuto = false;
            //As XP SP2 does not allow popup window going offscreen which might 
            //happen if the window size is larger than half of the screen size
            //we now first move the window to appropriate position and then
            //resize it
            popWin.moveTo (Math.floor((screenX-Top().SWEPopupWidth) / 2), 
                           Math.floor((screenY-Top().SWEPopupHeight) / 2 ));
            popWin.resizeTo (Top().SWEPopupWidth, 
                             Top().SWEPopupHeight);
         
         }
         else 
         {
            if (SWEGetPopupResizeNoHide())
            {   // 12-HJKXEX: Do not resize and hide the popup.
                SWESetPopupResizeNoHide (false);
                return;
            }
            
            var minX    = (body.minWidth != null) ? body.minWidth : 0;
            var bodyX   = (body.scrollWidth > minX) ? body.scrollWidth : minX;
            var bodyY   = body.scrollHeight;
            var maxX    = (bodyX < screenX) ? bodyX : screenX;
            var maxY    = (bodyY < screenY - 0x20) ? bodyY : screenY - 0x20;
         
            deltaX  = maxX - body.clientWidth;
            deltaY  = maxY - body.offsetHeight+0x10; //12-DGRML5
            
            //As XP SP2 does not allow popup window going offscreen which might 
            //happen if the window size is larger than half of the screen size
            //we now first move the window to appropriate position and then
            //resize it
            //FR#12-1U0A8YD - Internet Explorer hangs when user fast clicks on MVG Applet
            //Below try block is added to handle any exceptions when the user fast clicks on MVG Applet
            try
            {
               popWin.moveTo (Math.floor((screenX-maxX) / 2), 
                           Math.floor((screenY-maxY) / 2) );
               popWin.resizeBy (deltaX, deltaY);
            }
            catch(err)
            {
            }
         }
      }
   }
}

//these functions determine the absoloute X and Y coordinates of an element in the page. 
//Works for NS6+ and IE5+

function getObjCoordinateX(obj)
{
  return( obj.offsetParent==null ? obj.offsetLeft : obj.offsetLeft+getObjCoordinateX(obj.offsetParent) );
}

function getObjCoordinateY(obj)
{
  return( obj.offsetParent==null ? obj.offsetTop : obj.offsetTop+getObjCoordinateY(obj.offsetParent) );
}