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
typeof SiebelAppFacade.DynaControlListPM=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.DynaControlListPM"),define("siebel/dynacontrollistpm",["siebel/listpmodel"],function(){return SiebelAppFacade.DynaControlListPM=function(){function o(e){SiebelAppFacade.DynaControlListPM.superclass.constructor.apply(this,arguments),this.AddProperty("SelectedRow",-1)}function u(){var e=this.GetPModel().Get("SelectedRow");return e?e:0}function a(e){function n(e){return e||(t=[],t=f.call(this)),t}var t=[];return t=f.call(this),t}function f(){var e=[],t=this,n=t.GetPrivateFieldMap(),r=t.GetListOfColumns(),e=[],i=[],s,o=0;for(var u in r){if(r[u]){var a=r[u].GetName();i[o]=a,t.GetPrivateFieldMap()[a]&&!s&&(s=n[a].valueArray.length)}o++}for(var f=0;f<s;f++){var l={};for(var c=0,h=i.length;c<h;c++){var p=i[c];l[p]=n[p].valueArray[f]}e.push(l)}return e}var e=SiebelJS.Dependency("SiebelApp.Constants"),t=SiebelJS.Dependency("SiebelApp.S_App.LocaleObject"),n=SiebelJS.Dependency("SiebelApp.Utils"),r=e.get("SWE_CTRL_DATE_TIME_PICK"),i=e.get("SWE_CTRL_DATE_TZ_PICK"),s=e.get("SWE_CTRL_DATE_PICK");return SiebelJS.Extend(o,SiebelAppFacade.ListPresentationModel),o.prototype.Setup=function(t){SiebelAppFacade.DynaControlListPM.superclass.Setup.call(this,t);var n;t&&(n=t.GetChildByType(e.get("SWE_APPLET_PM_PS")));if(n){this.AddProperty("AppletTemplateId",n.GetProperty("DynaAppletTemplateId")),this.AddProperty("AppletTitleId",n.GetProperty("APPLET_TITLE"));var r=n.GetProperty("Required Control");r&&this.AddProperty("RequiredControl",r.split(",")),this.AddProperty("ActiveRow",n.GetProperty("atr"))}},o.prototype.Init=function(){SiebelAppFacade.DynaControlListPM.superclass.Init.apply(this,arguments),this.AddMethod("GetSelection",u,{core:!0,override:!0,scope:this}),this.AddMethod("GetRecordSet",a,{override:!0,sequence:!0,scope:this})},o.prototype.SetSelection=function(e){this.SetProperty("SelectedRow",e)},o}(),SiebelAppFacade.DynaControlListPM}));
