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
typeof SiebelApp.S_App.DateFilterControl=="undefined"&&(SiebelJS.Namespace("SiebelApp.S_App.DateFilterControl"),SiebelApp.S_App.DateFilterControl=function(){function t(){var e;return t=function(){return e},t.prototype=this,e=new t,e.constructor=t,e}function n(e){var t=e.getDate();return t=t.toString(),t.length===1&&(t="0"+t),t}var e="";return t.prototype.populate=function(t){e=new Date;var n=t.GetDefn().userPropMap["Search Field Name"];utils.IsEmpty(n)?t.GetBusComp().SetSearchExpr("[Planned] = Today()"):t.GetBusComp().SetSearchExpr("["+n+"]"+" = Today()")},t.prototype.DoCanInvokeMethod=function(e,t){var n=CCFMiscUtil_CreatePropSet();e==="GetCurrentDate"?(n.SetProperty("Invoked",!0),n.SetProperty("RetVal",!0),$.setReturnValue({err:!1,retVal:n})):e==="PrevDay"?(n.SetProperty("Invoked",!0),n.SetProperty("RetVal",!0),$.setReturnValue({err:!1,retVal:n})):e==="NxtDay"&&(n.SetProperty("Invoked",!0),n.SetProperty("RetVal",!0),$.setReturnValue({err:!1,retVal:n}))},t.prototype.DoInvokeMethod=function(e,t){var n=CCFMiscUtil_CreatePropSet();e==="NxtDay"||e==="PrevDay"||e==="JumtoToday"||e==="GotoDay"?(this.GotoDayEvent(e,t),n.SetProperty("Invoked",!0),$.setReturnValue({err:!1,retVal:n})):e==="GetCurrentDate"&&(this.GetCurrentDate(t),n.SetProperty("Invoked",!0),$.setReturnValue({err:!1,retVal:n}))},t.prototype.GetCurrentDate=function(t){var n=CCFMiscUtil_CreatePropSet();utils.IsEmpty(e)&&(e=new Date),n.SetType("GetCurrentDate");var r=e.getMonth()+1,i=r+"/"+e.getDate()+"/"+e.getFullYear();i=SiebelApp.S_App.LocaleObject.GetStringFromDateTime(i,"M/D/YYYY",SiebelApp.S_App.LocaleObject.m_sDateFormat,!0),n.SetProperty("CurrentDate",i);var s=n.EncodeAsString(),o=[];o.push(s),SiebelApp.OfflineAppMgr.PostActions("ActionRPCCompleted"),t.IsNotifyEnabled()?t.NotifyGeneric("MobileCurrentDate",o):(t.EnableNotify(),t.NotifyGeneric("MobileCurrentDate",o),t.DisableNotify())},t.prototype.GotoDayEvent=function(t,r){var i,s,o,u,a,f=new Date,l=f.getTimezoneOffset();if(t==="NxtDay"){o=new Date(e.getTime()),o.setHours(0,0,0,0),o.setDate(o.getDate()+1),o.setMinutes(o.getMinutes()+l),u=o.getMonth()+1,a=n.call(this,o),u=u<10?"0"+u:""+u;var c=o.getHours()<10?"0"+o.getHours():""+o.getHours(),h=o.getMinutes()<10?"0"+o.getMinutes():""+o.getMinutes();i=""+o.getFullYear()+""+u+""+a+""+c+""+h,o.setDate(o.getDate()+1),u=o.getMonth()+1,u=u<10?"0"+u:""+u,a=n.call(this,o);var p=o.getHours()<10?"0"+o.getHours():""+o.getHours(),d=o.getMinutes()<10?"0"+o.getMinutes():""+o.getMinutes();s=""+o.getFullYear()+""+u+""+a+""+p+""+d,e.setDate(e.getDate()+1)}else if(t==="PrevDay"){o=new Date(e.getTime()),o.setHours(0,0,0,0),e.setDate(e.getDate()-1),o.setMinutes(o.getMinutes()+l);var c=o.getHours()<10?"0"+o.getHours():""+o.getHours(),h=o.getMinutes()<10?"0"+o.getMinutes():""+o.getMinutes();u=o.getMonth()+1,u=u<10?"0"+u:""+u,a=n.call(this,o),s=""+o.getFullYear()+""+u+""+a+""+c+""+h,o.setDate(o.getDate()-1),u=o.getMonth()+1,u=u<10?"0"+u:""+u,a=n.call(this,o);var p=o.getHours()<10?"0"+o.getHours():""+o.getHours(),d=o.getMinutes()<10?"0"+o.getMinutes():""+o.getMinutes();i=""+o.getFullYear()+""+u+""+a+""+c+""+h}else if(t==="JumtoToday")o=new Date,u=o.getMonth()+1,i=""+o.getFullYear()+""+u+""+o.getDate(),o.setDate(o.getDate()+1),u=o.getMonth()+1,s=""+o.getFullYear()+""+u+""+o.getDate();else if(t==="GotoDay"){var v=SiebelApp.AjaxRequestMgr.GetActiveRequestObj();i=SiebelApp.AjaxRequestMgr.GetActiveRequestObj().SweCommands.StartDate,e=new Date(i),s=SiebelApp.AjaxRequestMgr.GetActiveRequestObj().SweCommands.EndDate;var m=new Date(i);m.setMinutes(m.getMinutes()+l);var c=m.getHours()<10?"0"+m.getHours():""+m.getHours(),h=m.getMinutes()<10?"0"+m.getMinutes():""+m.getMinutes(),g=m.getDate()<10?"0"+m.getDate():""+m.getDate();month1=m.getMonth()+1,month1=month1<10?"0"+month1:""+month1,i=m.getFullYear()+""+month1+""+g+""+c+""+h;var y=new Date(s);y.setMinutes(m.getMinutes()+l);var p=y.getHours()<10?"0"+y.getHours():""+y.getHours(),d=y.getMinutes()<10?"0"+y.getMinutes():""+y.getMinutes(),b=y.getDate()<10?"0"+y.getDate():""+y.getDate();month2=y.getMonth()+1,month2=month2<10?"0"+month2:""+month2,s=y.getFullYear()+""+month2+""+b+""+""+p+""+d}r.SetSearchExpr("[Planned] >= '"+i+"' AND "+"[Planned] <= '"+s+"'"),r.Execute(),$.callback(this,function(e){r.Home()})},new t}());
