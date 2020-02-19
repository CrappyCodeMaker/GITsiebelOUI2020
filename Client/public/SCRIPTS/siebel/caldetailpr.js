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
typeof SiebelAppFacade.CalDetailPR=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.CalDetailPR"),define("siebel/caldetailpr",["siebel/phyrenderer"],function(){return SiebelAppFacade.CalDetailPR=function(){function t(){SiebelAppFacade.CalDetailPR.superclass.constructor.apply(this,arguments)}function n(){var t=this.GetPM(),n=t.Get("GetControls"),r=e.get("SWE_CTRL_DATE_TIME_PICK"),i=e.get("SWE_CTRL_DATE_TZ_PICK"),s=t.Get("IsAllDay"),o=t.Get("UseCalendarPane")==="Y"?!0:!1;for(var u in n)if(n.hasOwnProperty(u)){var a=n[u],f=a.GetUIType();if(a.GetName()==="Duration Minutes"||f===r||f===i){var l=this.GetUIWrapper(a).GetEl(),c=o?l.parent().parent():l.parent(),h=$("#"+a.GetName().replace(/\s+/g,"_")+"_Label").parent();if(a.GetName()==="Duration Minutes")s?(o||h.addClass("hidden"),c.addClass("hidden")):(o||h.removeClass("hidden"),c.removeClass("hidden"));else if(f===i||f===r){var p=a.GetDisplayFormat()===SiebelApp.S_App.LocaleObject.GetDateFormat();s&&!p||!s&&p?c.addClass("hidden"):c.removeClass("hidden")}}}}var e=SiebelJS.Dependency("SiebelApp.Constants");return SiebelJS.Extend(t,SiebelAppFacade.PhysicalRenderer),t.prototype.Init=function(){SiebelAppFacade.CalDetailPR.superclass.Init.call(this);var e=this.GetPM();e.AddProperty("IsAllDay",""),e.AddProperty("DateTimeCtrls",[]),this.AttachPMBinding("IsAllDay",n)},t.prototype.BindData=function(){var e=this.GetPM(),t;SiebelAppFacade.CalDetailPR.superclass.BindData.call(this),t=e.ExecuteMethod("GetControl","AllDay"),t&&e.SetProperty("IsAllDay",e.ExecuteMethod("GetFormattedFieldValue",t)==="Y")},t.prototype.BindControlEvents=function(t){SiebelAppFacade.CalDetailPR.superclass.BindControlEvents.call(this,t);if(t.GetUIType()===e.get("SWE_CTRL_CHECKBOX")&&t.GetFieldName()==="AllDay"){var n=this.GetPM(),r=this.GetUIWrapper(t).GetEl(),i=SiebelApp.S_App.PluginBuilder.GetHoByName("EventHelper"),s=function(){n.SetProperty("IsAllDay",!n.Get("IsAllDay"))},o=function(){n.SetProperty("IsAllDay",$(this).val()==="Y")};if(r&&i){i.Manage(r,"down",{ctx:this},o).Manage(r,"click",{ctx:this},o).Manage(r,"keydown",{ctx:this},o);if(r.hasClass("siebui-ctrl-flipswitch"))for(var u=0,a=r.length;u<a;u++)r.eq(u).data("switch").bind("switch:slide",{ctx:this},s)}}},t.prototype.ShowUI=function(){SiebelAppFacade.CalDetailPR.superclass.ShowUI.call(this);var e=this.GetPM();if(e.Get("UseCalendarPane")==="Y")return;var t=e.Get("DateTimeCtrls");for(var n=0;n<t.length;n++){var r=t[n],i=e.ExecuteMethod("GetControl",r),s=e.ExecuteMethod("GetControl",r+" Date");if(i&&s){var o=this.GetUIWrapper(s).GetEl(),u=this.GetUIWrapper(i).GetEl();o=o.parent().detach(),u.parent().parent().append(o)}}},t.prototype.ShowUIControl=function(t){SiebelAppFacade.CalDetailPR.superclass.ShowUIControl.call(this,t);var n=t.GetUIType(),r=this.GetPM(),i=t.GetDisplayFormat()===SiebelApp.S_App.LocaleObject.GetDateFormat();if(n===e.get("SWE_CTRL_DATE_TZ_PICK")&&!i){var s=r.Get("DateTimeCtrls");s.push(t.GetName()),r.SetProperty("DateTimeCtrls",s)}},t}(),SiebelAppFacade.CalDetailPR}));
