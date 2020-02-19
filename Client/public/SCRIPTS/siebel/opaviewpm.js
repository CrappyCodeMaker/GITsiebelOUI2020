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
typeof SiebelAppFacade.OPAViewPM=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.opaviewpm"),define("siebel/opaviewpm",["siebel/viewpm"],function(){return SiebelAppFacade.OPAViewPM=function(){function t(e){SiebelAppFacade.OPAViewPM.superclass.constructor.call(this,e)}function n(){var e=SiebelApp.S_App.GetActiveView(),t=e.GetAppletMap();for(var n in t)if(t.hasOwnProperty(n)){var r=t[n];e.IsAppletActive(r)&&r.SetHighlightState(!1,r),t[n].PostChangesToBC(!0,null,!0)}}function r(){var e=SiebelApp.S_App.GetActiveView().GetAppletMap(),t=0;for(var n in e)e.hasOwnProperty(n)&&(t++,SiebelAppFacade.ComponentMgr.FindComponent({id:n}).Show())}function i(){var e,t,n,r,i="",s,o,u,a;arguments.length>=1&&(e=arguments[1]);var f=CCFMiscUtil_CreatePropSet();f.SetProperty("action",e),f.SetProperty("Screen Id",this.Get("ScreenId")),f.SetProperty("WorkflowName",this.Get("OPAWorkflow"));var l,c=SiebelApp.S_App.GetService(this.Get("OPABusinessServcie"));if(c){var h={};h.async=!1,h.selfbusy=!0,h.scope=this,h.cb=function(){l=arguments[2],SiebelApp.S_App.uiStatus.Free()},SiebelApp.S_App.uiStatus.Busy({mask:!0,loadMsg:!0}),c.InvokeMethod("InvokeSubWorkflow",f,h)}if(l){t=l.GetChildByType("ResultSet");if(t){n=t.GetChildByType("ErrorDetail");if(n){a=n.GetProperty("StaticAppletName"),r=n.GetChildByType("error-list");if(r){for(var p=!0;(s=r.EnumProperties(p))!==null;p=!1){o=r.GetProperty(s);if(s==="Entity_ID"){u=o;continue}i+=o+"\n"}SiebelApp.S_App.ErrorObject.GetErrorRendr().ShowError(HtmlDecode(i));var d=SiebelApp.S_App.GetActiveView().GetAppletMap();for(var v in d)if(d.hasOwnProperty(v))if(u&&v==u||!u&&v!==a){d[v].FocusFirstControl();break}}}}}}var e=SiebelJS.Dependency("SiebelApp.Constants");return SiebelJS.Extend(t,SiebelAppFacade.ViewPM),t.prototype.Init=function(){SiebelAppFacade.OPAViewPM.superclass.Init.apply(this,arguments),this.AddProperty("ViewPRLoaded",!1),this.AddMethod("CallAppletsShowMethod",r,{sequence:!0,scope:this}),this.AddMethod("HandleCommit",n),this.AttachEventHandler("CallServer",i)},t.prototype.Setup=function(e){SiebelAppFacade.OPAViewPM.superclass.Setup.call(this,e);var t,n,r;e&&(t=e.GetChildByType(consts.get("SWE_VIEW_PM_PS"))),t&&(n=t.GetChildByType("SCREEN_DETAILS"),this.SetProperty("dynaTemplateId",t.GetProperty("dynaTemplateId")),r=t.GetChildByType("screen-list"),this.SetProperty("OPABusinessServcie",t.GetProperty("OPABusinessServcie")),this.SetProperty("OPAWorkflow",t.GetProperty("OPAWorkflow"))),n&&(this.SetProperty("htmlTemplateName",n.GetProperty("SBL_TEMPLATE_NAME")),this.SetProperty("Screen Id",n.GetProperty("Screen Id")),this.SetProperty("vcls",n)),r&&this.SetProperty("Navigation Step",r)},t}(),"SiebelAppFacade.OPAViewPM"}));
