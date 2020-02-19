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
SiebelApp.UIStatus=function(){this.maskClass="siebui-mask-content",this.m_gbusy=0,this.timeOut=!1,this.timeOutId=null,this.config={},this.masked=!1,this.loadMsg=!1},SiebelApp.UIStatus.prototype={Busy:function(e){SiebelApp.UIStatus.Global&&(SiebelApp.UIStatus.Global.Free(),delete SiebelApp.UIStatus.Global),this.m_gbusy++,this.config=$.extend({timeOut:!0},this.config,e);var t=this,n=3e4;SiebelApp.S_App.GetBusyTimer!==undefined&&(n=SiebelApp.S_App.GetBusyTimer()*1e3,n=n<3e4?3e4:n),this.config.timeOut&&this.timeOutId===null&&(this.timeOutId=setTimeout(function(){t.timeout=!0,t.Free()},n));if(this.config.mask&&!this.masked){$(".siebui-mask-content").text(""),e.imgClass!="siebui-mask-splash"&&($("#mask-img").hide(),setTimeout(function(){$("#mask-img").show()},900)),$("#maskoverlay").css({width:$(window).width(),height:$(window).height(),top:"0",left:"0",position:"absolute",display:"block"});if(e.loadMsg){var r=SiebelApp.S_App.LocaleObject.GetLocalString("IDS_SWE_LOADING_INDICATOR_TITLE");$(".siebui-mask-content").addClass("loadmsg"),$(".siebui-mask-content").text(r)}this.masked=!0}return $("html").hasClass("siebui-busy")||$("html").addClass("siebui-busy"),this},Free:function(){this.m_gbusy>0&&!this.timeOut&&this.m_gbusy--;if(this.m_gbusy<=0||this.timeout){if(this.timeOut)this.m_gbusy=0;else if(SiebelApp.S_App.GetEnablePerfHooks()&&SiebelApp.S_App.GetTimer()&&this.m_gbusy===0){var e=SiebelApp.S_App.GetTimer();e.TimePopupApplet("","Reset Busy State"),e.TimeGoToView("","Reset Busy State"),e.TimeInvokeMethod("","","","Reset Busy State"),e.TimeRefreshView("","","Reset Busy State"),e.ShowTotal()}this.Reset()}return this},IsBusy:function(){return $("html")[0].className=="siebui-busy"||this.m_gbusy>0?!0:!1},LocalBusy:function(e){this.configLocal=this.configLocal||{};var t=SiebelApp.S_App.LocaleObject.GetLocalString("IDS_SWE_LOADING_INDICATOR_TITLE");$.extend(this.configLocal,{message:t,imgClass:"localLoading"}),$.extend(this.configLocal,e),this.configLocal.mask===!0&&($(this.configLocal.target).addClass(this.configLocal.imgClass),$(this.configLocal.target).html(this.configLocal.message))},LocalFree:function(){$(this.configLocal.target).removeClass(this.configLocal.imgClass)},ShowOnLoadIndicator:function(){$("body").append("<div id='maskcontent' aria-live='polite' aria-atomic='true' class='siebui-mask-content' /><div id='maskoverlay' class='siebui-mask-overlay' style='display:none'> <div id='mask-img' class='siebui-mask-outer'>   <div class='siebui-mask-inner' /> </div></div>");var e=new SiebelApp.UIStatus({});e.Busy({target:"html",imgClass:"siebui-mask-splash",mask:!0}),SiebelApp.UIStatus.Global=e},Reset:function(){this.timeOut=!1,this.timeOutId!==null&&clearTimeout(this.timeOutId),this.timeOutId=null,this.masked=!1;if(this.config.mask){if(this.config.loadMsg){var e=SiebelApp.S_App.LocaleObject.GetLocalString("IDS_SWE_DATEPICKER_CLOSE_TEXT");$(".siebui-mask-content").removeClass("loadmsg"),$(".siebui-mask-content").text(e),setTimeout(function(){$("#maskoverlay").hide()},1e3)}else $("#maskoverlay").hide();$("#mask").hide()}$("html").removeClass("siebui-busy"),this.config={}}},$(function(){(!SiebelApp.S_App.PortletSessionMgr||!SiebelApp.S_App.PortletSessionMgr.GetInstance()||!SiebelApp.S_App.PortletSessionMgr.GetInstance().GetAction()||SiebelApp.S_App.PortletSessionMgr.GetInstance().GetAction().indexOf("SWECmd=GetApplet")===-1)&&SiebelApp.S_App.uiStatus.ShowOnLoadIndicator()});
