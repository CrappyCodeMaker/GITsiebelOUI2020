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
typeof SiebelApp.serviceprintinfo=="undefined"&&(SiebelJS.Namespace("SiebelApp.serviceprintinfo"),define("siebel/offline/serviceprintinfo",["siebel/offline/model"],function(){var e={},t=SiebelApp.Offlineconstants,n=SiebelApp.OfflineUtils,r=t.get("PRT_BC_MAX_FETCH_SIZE");return SiebelApp.serviceprintinfo=function(){function e(e){}function i(e,t,n){var s={err:!1},o,u=!1,a=e.GetBusComp(t);(a!==null||typeof a!="undefined")&&a.GetWSSize()===r&&(u=!0),a.SetWSSize(r);var f=SiebelApp.S_App.GetActiveBusObj(),l=f.GetBusCompByName(t);if(typeof l!="undefined"){var c=l.GetSearchSpec();if(typeof l.GetParentBusComp()=="undefined"||l.GetParentBusComp()===null){var h=l.GetWS()[l.GetActiveRow()].Id;s=a.SetFldSearchSpec("Id",h)}else a.SetSearchSpec(c)}a.ActivateFields(),u||(s=a.Execute()),o=s,s={err:!1};if(!o.err){s=a.Home();var p=f.GetBCArray(),d=[];for(var v=0;v<p.length;v++){var m=p[v];if(m===null||typeof m=="undefined")continue;var g=m.GetName(),y=m.GetParentBusComp();if(y===null||typeof y=="undefined")continue;var b=y.GetName();b===t&&d.push(g)}var w=a.GetWS(),E=CCFMiscUtil_CreatePropSet();E.SetType(t),E.SetValue("bc"),n.AddChild(E);for(var S=0;S<w.length;S++){var x=CCFMiscUtil_CreatePropSet();x.SetType("bcr"),E.AddChild(x);var T=l.GetFieldMap();for(var N in T){var C=w[S][N.split(" ").join("")],k=T[N].GetDataType();if(SiebelApp.S_App.LocaleObject.m_sCurrencyCode===""&&k==="currency"){var L=T[N].GetCurrField(),A=L.split("|");typeof A[0]!="undefined"&&typeof w[S][A[0].split(" ").join("")]!="undefined"&&w[S][A[0].split(" ").join("")]!==""&&(SiebelApp.S_App.LocaleObject.m_sCurrencyCode=w[S][A[0].split(" ").join("")],SiebelApp.S_App.LocaleObject.m_sCurrency=w[S][A[0].split(" ").join("")])}C=SiebelApp.S_App.LocaleObject.StringToFormatted(k,C,""),x.SetProperty(N,C)}s=a.PositionById(w[S].Id);for(var O=0;O<d.length;O++)s=i.call(this,e,d[O],x)}}return s}function s(e){var r={err:!1},i,s=SiebelApp.S_App.GetActiveView().GetName()+"/PrintTemplate";n.CcfLogEvent([t.get("LOG_EVT_CLIENT_SYS"),"start GetTemplateFile for view : "+s,"SiebelApp.serviceprintinfo","GetPrintInfo"]);var o=SiebelApp.BrowserCacheMgr.DiscoverMetadata("","","gvl",s,"resrs");if(typeof o!="undefined"&&o!==null){var u=CCFMiscUtil_CreatePropSet();u.DecodeFromString(o),e.AddChild(u)}else n.CcfLogEvent([t.get("LOG_EVT_CLIENT_SYS"),"end GetTemplateFile for view: "+s,"SiebelApp.serviceprintinfo","GetPrintInfo"]);return r}return SiebelJS.Extend(e,SiebelApp.ServiceModel),e.prototype.GetServicePrintInfo=function(e){var t={err:!1},n,r="",i=CCFMiscUtil_CreatePropSet();return t=this.GetPrintInfo(i),i.SetProperty("Invoked",!0),t={err:!1,retVal:i},t},e.prototype.GetPrintInfo=function(e){var r={err:!1},o;n.CcfLogEvent([t.get("LOG_EVT_CLIENT_SYS"),"start GetPrintInfo","SiebelApp.serviceprintinfo","GetPrintInfo"]);var u=CCFMiscUtil_CreatePropSet(),a=SiebelApp.S_App.Model.GetBusObj(SiebelApp.S_App.GetActiveBusObj().GetName()),f=SiebelApp.S_App.GetActiveBusObj(),l=f.GetBCArray(),c="";for(var h=0;h<l.length;h++){var p=l[h];if(typeof p=="undefined")continue;var d=p.GetParentBusComp();if(typeof d=="undefined"||d===null){c=p.GetName();break}}e.AddChild(u),e.SetType("PRT"),u.SetType("prtda"),s.call(this,e),n.CcfLogEvent([t.get("LOG_EVT_CLIENT_SYS"),"start GetPrintData","SiebelApp.serviceprintinfo","GetPrintInfo"]),i.call(this,a,c,u),r={err:!1},n.CcfLogEvent([t.get("LOG_EVT_CLIENT_SYS"),"end GetPrintData","SiebelApp.serviceprintinfo","GetPrintInfo"]);var v=[],m=e.EncodeAsString();v.push(m),v.push("success");var g=SiebelApp.S_App;return g.ProcessResponse.apply(g,v),a=null,e=null,n.CcfLogEvent([t.get("LOG_EVT_CLIENT_SYS"),"end GetPrintInfo","SiebelApp.serviceprintinfo","GetPrintInfo"]),r},new e}(),"SiebelAppFacade.SiebelApp.serviceprintinfo"}));
