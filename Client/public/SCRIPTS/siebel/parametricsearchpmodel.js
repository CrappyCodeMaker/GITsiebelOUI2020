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
typeof SiebelAppFacade.ParametricSearchPresentationModel=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.ParametricSearchPresentationModel"),define("siebel/parametricsearchpmodel",["siebel/pmodel"],function(){return SiebelAppFacade.ParametricSearchPresentationModel=function(){function n(e){SiebelAppFacade.ParametricSearchPresentationModel.superclass.constructor.call(this,e),this.CleanInternalStructs=function(){this.SetProperty("MltSelHTMLIdsToRowDefsMap",{}),this.SetProperty("RowIdsToFieldDefsMap",{})}}function r(e,t,n){var r=this.Get("RowIdsToFieldDefsMap");r[e]||(r[e]={}),r[e][t]=n}function i(e,t,n){var r=this.Get("MltSelHTMLIdsToRowDefsMap");r.hasOwnProperty(e)&&r[e].slice(0,1),r[e]={},r[e].RowId=t,r[e].RowIndex=n}function s(e,t){var n,r="",i;n=CCFMiscUtil_CreatePropSet(),n.SetProperty("SWEReqRowId","0"),n.SetProperty("SWERowId",t),i=u.call(this,t);if(t!=="Dummy"&&!i)return!1;for(var s in i)i.hasOwnProperty(s)&&n.SetProperty(s,i[s]);this.ExecuteMethod("InvokeMethod",e,n,!0)}function o(e,t){var n=CCFMiscUtil_CreatePropSet();n.SetProperty("SWEReqRowId","0"),n.SetProperty("FieldValue",t),this.ExecuteMethod("InvokeMethod",e,n,!0)}function u(e){var t=this.Get("RowIdsToFieldDefsMap");return t.hasOwnProperty(e)?t[e]:null}function a(e){var t=e.EnumChildren(!0);if(t)do{var n=t.GetType();switch(n){case"AppletJS":break;case"AppletRowData":f.call(this,t);break;case"SpanInnerHTML":var r=t.GetProperty("HTML_SRC");this.SetProperty("SpanInnerHTML",r),this.SetProperty("SpanInnerHTML_IS_OK",!0);break;default:}}while(t=e.EnumChildren(!1))}function f(e){var t=e.GetChildCount();for(var n=0;n<t;n++){var s=e.GetChild(n);if(s.GetType()==="RowFields"){var o=s.GetProperty("row_id"),u=s.GetChildCount();for(var a=0;a<u;a++){var f=s.GetChild(a);if(f.GetType()==="RowFields"){var l=f.GetProperty("name"),c=f.GetProperty("html_id"),h=f.GetProperty("CheckBoxRowIndex"),p=f.GetProperty("type");p==="MultiSelectCheckbox"?i.call(this,c,o,h):r.call(this,o,l,c)}}}}}function l(){var e=u.call(this,"Dummy");for(var t in e)e.hasOwnProperty(t)&&(e[t]="")}function c(e,t){var n=u.call(this,"Dummy");n[e]=t}var e=SiebelJS.Dependency("SiebelAppFacade.FacadeConstants"),t=SiebelJS.Dependency("SiebelApp.Constants");return SiebelJS.Extend(n,SiebelAppFacade.PresentationModel),n.prototype.Init=function(){SiebelAppFacade.ParametricSearchPresentationModel.superclass.Init.call(this),this.AddProperty("PopulateNeeded",!0),this.AddProperty("SpanInnerHTML",""),this.AddProperty("MltSelHTMLIdsToRowDefsMap",{}),this.AddProperty("RowIdsToFieldDefsMap",{}),this.AddProperty("SpanInnerHTML_IS_OK",!1),this.AddMethod("CanNavigate",function(e){return!1},{scope:this,override:!0,core:!1}),this.AddMethod("AddFieldDef",r),this.AddMethod("AddMltSelRowDef",i),this.AddMethod("EventInvokeMethod",s),this.AddMethod("EventOnChangeSelectTag",o),this.AddMethod("GetFieldDefs",u),this.AddMethod("SearchPurgeFieldValues",l),this.AddMethod("SearchUpdateFieldValue",c),this.AttachEventHandler("SearchUpdateFieldValue",c),this.AttachEventHandler("EventInvokeMethod",s),this.AttachEventHandler("EventOnChangeSelectTag",o),this.AttachNotificationHandler(t.get("SWE_PROP_BC_NOTI_GENERIC"),function(e){var n=e.GetProperty("type"),r=[],i=e.GetProperty(t.get("SWE_PROP_ARGS_ARRAY"));i&&CCFMiscUtil_StringToArray(i,r);switch(n){case"RefreshRowFieldDefs":var s=CCFMiscUtil_CreatePropSet();s.DecodeFromString(r[0]),f.call(this,s);break;case"RefreshSpanInnerHTML":this.SetProperty("SpanInnerHTML",r[0]),this.SetProperty("SpanInnerHTML_IS_OK",!0),this.SetProperty("PopulateNeeded",!0);break;case"RefreshAppletJS":default:}})},n.prototype.Setup=function(e){SiebelAppFacade.ParametricSearchPresentationModel.superclass.Setup.call(this,e);var n=e.EnumChildren(!0);if(n)do if(n.GetType()===t.get("SWE_PST_CNTRL_LIST")){var r=n.EnumChildren(!0);if(r){do if(r.GetType()===t.get("SWE_PST_CUSTOM_CTRL")){a.call(this,r.GetChild(0));break}while(r=n.EnumChildren(!1));break}}while(n=e.EnumChildren(!1))},n}(),"SiebelAppFacade.ParametricSearchPresentationModel"}));
