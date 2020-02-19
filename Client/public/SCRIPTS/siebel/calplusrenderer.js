/*<ORACLECOPYRIGHT>
* Copyright (C) 2008-2016
* Oracle and Java are registered trademarks of Oracle and/or its affiliates.
* Other names may be trademarks of their respective owners.
* UNIX is a registered trademark of The Open Group.
*
* This software and related documentation are provided under a license agreement
* containing restrictions on use and disclosure and are protected by intellectual property laws.
* Except as expressly permitted in your license agreement or allowed by law, you may not use, copy,
* reproduce, translate, broadcast, modify, license, transmit, distribute, exhibit, perform, publish,
* or display any part, in any form, or by any means. Reverse engineering, disassembly,
* or decompilation of this software, unless required by law for interoperability, is prohibited.
*
* The information contained herein is subject to change without notice and is not warranted to be error-free.
* If you find any errors, please report them to us in writing.
*
* U.S. GOVERNMENT RIGHTS Programs, software, databases, and related documentation and technical data delivered to U.S.
* Government customers are "commercial computer software" or "commercial technical data" pursuant to the applicable
* Federal Acquisition Regulation and agency-specific supplemental regulations.
* As such, the use, duplication, disclosure, modification, and adaptation shall be subject to the restrictions and
* license terms set forth in the applicable Government contract, and, to the extent applicable by the terms of the
* Government contract, the additional rights set forth in FAR 52.227-19, Commercial Computer Software License
* (December 2007). Oracle America, Inc., 500 Oracle Parkway, Redwood City, CA 94065.
*
* This software or hardware is developed for general use in a variety of information management applications.
* It is not developed or intended for use in any inherently dangerous applications, including applications that
* may create a risk of personal injury. If you use this software or hardware in dangerous applications,
* then you shall be responsible to take all appropriate fail-safe, backup, redundancy,
* and other measures to ensure its safe use. Oracle Corporation and its affiliates disclaim any liability for any
* damages caused by use of this software or hardware in dangerous applications.
*
* This software or hardware and documentation may provide access to or information on content,
* products, and services from third parties. Oracle Corporation and its affiliates are not responsible for and
* expressly disclaim all warranties of any kind with respect to third-party content, products, and services.
* Oracle Corporation and its affiliates will not be responsible for any loss, costs,
* or damages incurred due to your access to or use of third-party content, products, or services.
</ORACLECOPYRIGHT>*/
/* 16.0.0.0SIA[23057] */
typeof SiebelAppFacade.calplusrenderer=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.calplusrenderer"),define("siebel/calplusrenderer",["3rdParty/moment.min.js","3rdParty/fullcalendar/fullcalendar.js","3rdParty/jquery-ui/current/ui/jquery.ui.tooltip.js","3rdParty/jquery-ui/current/ui/jquery.ui.mouse.js","3rdParty/jquery-ui/current/ui/jquery.ui.widget.js","3rdParty/jquery.ui.touch-punch.min.js","siebel/phyrenderer","siebel/jqfullcalrenderer"],function(){return SiebelAppFacade.calplusrenderer=function(){function e(e){SiebelAppFacade.calplusrenderer.superclass.constructor.call(this,e)}return SiebelJS.Extend(e,SiebelAppFacade.JQFullCalRenderer),e.prototype.Init=function(){SiebelAppFacade.calplusrenderer.superclass.Init.call(this)},e.prototype.BindEvents=function(e){SiebelAppFacade.calplusrenderer.superclass.BindEvents.call(this)},e.prototype.ShowUI=function(){SiebelAppFacade.calplusrenderer.superclass.ShowUI.call(this),SiebelApp.S_App.GetOfflineMode&&SiebelApp.S_App.GetOfflineMode()&&$(".siebui-short-hdr").find("#cal-newEvent-button").attr("disabled","disabled")},e.prototype.GetOptions=function(){this.SetEventHandlerMap(null),this.SetEventHandlerMap(new SiebelAppFacade.CalPlusEventHandlers(this.GetPM(),this.GetCal(),this.GetCalCtrlBuilder(),this.GetUtilityMap()));var e=SiebelAppFacade.calplusrenderer.superclass.GetOptions.call(this);return e.contentHeight=585,e},e.prototype.resize=function(){var e=this.GetPM();e.SetProperty("MultViewFrames","0"),SiebelAppFacade.calplusrenderer.superclass.resize.call(this)},e.prototype.EndLife=function(){SiebelAppFacade.calplusrenderer.superclass.EndLife.call(this)},e.prototype.BindData=function(){SiebelAppFacade.calplusrenderer.superclass.BindData.call(this)},e}(),SiebelAppFacade.CalPlusEventHandlers=function(){function e(e,t,n,r){var i=t,s=e,o=n,u=r;this.GetCal=function(){return i},this.GetPM=function(){return s},this.GetCalCtrlBuilder=function(){return o},this.GetUtilityMap=function(){return u}}return SiebelJS.Extend(e,SiebelAppFacade.CalEventHandlers),e.prototype.OnCalSelect=function(e,t){SiebelAppFacade.CalPlusEventHandlers.superclass.OnCalSelect.call(this,e,t)},e.prototype.OnDayClick=function(e,t,n){SiebelAppFacade.CalPlusEventHandlers.superclass.OnDayClick.call(this,event,element,n)},e.prototype.OnEventRender=function(e,t,n){var r=[],i=this.GetPM().Get("EventInfo");for(var s=0;s<i.length;s++)if(i[s].Id==e.id)for(var o=0;o<e.multiDisplay.length;o++)i[s].Type!="Personal"&&e.multiDisplay[o].DrillDown.match("Description")=="Description"?r.push(o):i[s].Type=="Personal"&&e.multiDisplay[o].DrillDown.match("Description")!="Description"&&r.push(o);for(var u=0;u<r.length;u++)e.multiDisplay.splice(r[u],1);SiebelAppFacade.CalPlusEventHandlers.superclass.OnEventRender.call(this,e,t,n)},e.prototype.OnEventAfterRender=function(e,t,n){SiebelAppFacade.CalPlusEventHandlers.superclass.OnEventAfterRender.call(this,e,t,n);var r=this.GetPM(),s=r.Get("EventInfo");if(this.GetCal()&&s){var o=s.length;for(i=0;i<o;i++){var u=s[i],a,f=u.DisplayField.length;for(j=0;j<f;j++)a=u.DisplayField[j],a.FieldValue===""&&a.IconFile!==""&&$(".siebui-icon-"+a.IconFile.split(".")).addClass("siebui-calendar-act-select")}}$(".siebui-cal-timestamp").hide()},e.prototype.OnEventClick=function(e,t,n){var r=this.GetPM(),i=this.GetCal(),s=CCFMiscUtil_CreatePropSet();i.fullCalendar("gotoDate",e.start),r.AddProperty("SelectedDate",i.fullCalendar("getDate").toDate());var o=t.target||t.srcElement;$(o).hasClass("siebui-calendar-act-select")?(s.SetProperty("ActId",e.id),r.OnControlEvent("Show Selected Activity",s)):SiebelAppFacade.CalPlusEventHandlers.superclass.OnEventClick.call(this,e,t,n)},e.prototype.OnEventLimitClick=function(e,t){return SiebelAppFacade.CalPlusEventHandlers.superclass.OnEventLimitClick.call(this,e,t)},e.prototype.OnEventDestroy=function(e,t,n){SiebelAppFacade.CalPlusEventHandlers.superclass.OnEventDestroy.call(this,e,t,n)},e.prototype.OnEventDragStop=function(e,t,n,r){SiebelAppFacade.CalPlusEventHandlers.superclass.OnEventDragStop.call(this,e,t,n,r)},e.prototype.OnEventDrop=function(e,t,n,r){SiebelAppFacade.CalPlusEventHandlers.superclass.OnEventDrop.call(this,e,t,n,r)},e.prototype.OnEventResize=function(e,t,n,r,i){SiebelAppFacade.CalPlusEventHandlers.superclass.OnEventResize.call(this,e,t,n,r,i)},e.prototype.OnEventRefresh=function(e,t,n,r){SiebelAppFacade.CalPlusEventHandlers.superclass.OnEventRefresh.call(this,e,t,n,r)},e.prototype.OnExtJQueryDropHandler=function(e,t,n,r,i){SiebelAppFacade.CalPlusEventHandlers.superclass.OnExtJQueryDropHandler.call(this,e,t,n,r,i)},e.prototype.OnExtHTMLDropHandler=function(e){SiebelAppFacade.CalPlusEventHandlers.superclass.OnExtHTMLDropHandler.call(this,e)},e.prototype.OnViewDisplayChange=function(e){SiebelAppFacade.CalPlusEventHandlers.superclass.OnViewDisplayChange.call(this,e)},e}(),"SiebelAppFacade.calplusrenderer"}));
