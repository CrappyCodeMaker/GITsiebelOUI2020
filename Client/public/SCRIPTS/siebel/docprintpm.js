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
typeof SiebelAppFacade.PrintPresentationModel=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.PrintPresentationModel"),define("siebel/docprintpm",[],function(){return SiebelAppFacade.PrintPresentationModel=function(){function u(e){SiebelAppFacade.PrintPresentationModel.superclass.constructor.call(this,e)}function a(e){if("ClientPrintDoc"===e){navigator.appVersion.indexOf("Win")!==-1?l():SiebelJS.Log("Unsupported OS : "+navigator.appVersion);var n=arguments[arguments.length-1];return n&&n instanceof Object&&(n[t]=!0,n[r]=!0),!1}return!0}function f(){return o||(o=SiebelApp.S_App.GetService("CorrespPrint")),o}function l(){var t=d(),n=t.length;if(n===0)return;p().m_rowCount=n,p().m_printCount=0;var r=SiebelApp.S_App.GetPopupPM();r.Get("state")===e.get("POPUP_STATE_UNLOADED")&&r.Setup();var i=SiebelApp.S_App.LocaleObject.GetLocalString("IDS_SWE_LOADING_INDICATOR_TITLE");r.ExecuteMethod("OpenPopup",i,"0","0",!1,!1,!0),r.SetProperty("content",i),g();var s=f(),o=CCFMiscUtil_CreatePropSet(),u="SetParentFrameParams";o.SetProperty("SelectedRowIds",CCFMiscUtil_ArrayToString(t)),o.SetProperty("IsProspect","FALSE"),o.SetProperty("IsPrintDoc","TRUE");var a=s.InvokeMethod(u,o);c()}function c(){var e=CCFMiscUtil_CreatePropSet(),t=f();if(!t){SiebelJS.Log("Error: Service CorrespPrint Not Found");return}var n=t.InvokeMethod("ClientPrint",e),r=n.GetProperty("FileTitle")+"."+n.GetProperty("FileExt"),i=SiebelApp.S_App.GetPageURL()+"?";i+="SWECmd=GetFile&",i+="SWEC="+n.GetProperty("SWEC")+"&",i+="SRN="+SiebelApp.S_App.GetSRN();var s=function(){if(this.readyState===4&&(this.status===200||this.status===204)){SiebelJS.Log("Calling ws filename : "+r);var e=p().SendMessage(this.response,r);if(!e){SiebelJS.Log("Error: Unable to connect to DISA server");var t=SiebelApp.S_App.LocaleObject.GetLocalString("IDS_WS_CONNECTION_FAILED"),n=SiebelApp.S_App.GetPopupPM();n.SetProperty("content",t),setTimeout(function(){n.ExecuteMethod("SetPopupVisible",!1)},1e4)}}},o=v();o.onreadystatechange=s,o.open("GET",i),o.responseType="blob",o.send()}function h(t,n){var r=t[e.get("WS_INLINEEDIT_FILE_TRANSFERRED")];if(SiebelJS.Dependency("SiebelApp.Utils").IsEmpty(r)||r!==!0){SiebelJS.Log("Error : Print not complete internal error");var i=SiebelApp.S_App.LocaleObject.GetLocalString("IDS_WS_DISA_INTERNAL_ERROR"),s=SiebelApp.S_App.GetPopupPM();s.SetProperty("content",i),setTimeout(function(){s.ExecuteMethod("SetPopupVisible",!1)},1e4);return}var o=this.m_rowCount,u=this.m_printCount;u++,u<o?(this.m_printCount=u,c()):SiebelApp.S_App.GetPopupPM().ExecuteMethod("SetPopupVisible",!1)}function p(){return s===null&&(s=SiebelApp.WebSocketManager.CreateWSHandler(consts.get("WS_COMPONENT_TYPE_BATCH_PRINT")),s.OnMessage=h,s.m_rowCount=0,s.m_printCount=0),s}function d(){var e=[],t=SiebelApp.S_App.GetActiveView().GetActiveApplet(),n=t.GetRowsSelectedArray(),r=t.GetRawRecordSet(),i=n.length,s=0;while(s<i)n[s]&&e.push(r[s].Id),s++;return e}function v(){try{return new window.XMLHttpRequest}catch(e){}}function m(){try{return new window.ActiveXObject("Microsoft.XMLHTTP")}catch(e){}}function g(){$("div[name=popup]").dialog("option","height","60").dialog("option","width","60").dialog("option","position","center").dialog("option","title","Print")}var e=SiebelJS.Dependency("SiebelApp.Constants"),t=e.get("SWE_EXTN_CANCEL_ORIG_OP"),n=e.get("SWE_EXTN_RETVAL"),r=e.get("SWE_EXTN_STOP_PROP_OP"),i=e.get("WS_COMPONENT_TYPE_BATCH_PRINT"),s=null,o=null;return SiebelJS.Extend(u,SiebelAppFacade.ListPresentationModel),u.prototype.Init=function(){SiebelAppFacade.PrintPresentationModel.superclass.Init.call(this),this.AttachEventHandler(e.get("PHYEVENT_INVOKE_CONTROL"),a)},u.prototype.Setup=function(e){SiebelAppFacade.PrintPresentationModel.superclass.Setup.call(this,e)},u.prototype.EndLife=function(){s!==null&&(s.Unregister(),s=null),SiebelAppFacade.PrintPresentationModel.superclass.EndLife.call(this)},u}(),"SiebelAppFacade.PrintPresentationModel"}));
