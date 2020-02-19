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
typeof SiebelAppFacade.CKEditorPresentationModel=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.CKEditorPresentationModel"),define("siebel/ckeditorpmodel",[],function(){return SiebelAppFacade.CKEditorPresentationModel=function(){function e(e){SiebelAppFacade.CKEditorPresentationModel.superclass.constructor.call(this,e)}return SiebelJS.Extend(e,SiebelAppFacade.PresentationModel),e.prototype.Setup=function(e){var t,n=e.GetChildByType("cl");if(n){var r=n.GetChildByType("cc");if(r){var i=r.GetChildByType("cc");i&&(t=i,this.AddProperty("ControlConfig",i),this.AddProperty("OfferType",t.GetProperty("OfferType")))}}SiebelAppFacade.CKEditorPresentationModel.superclass.Setup.call(this,e)},e.prototype.Init=function(){function e(e,t,n,r){if(e==="SaveTemplate"){var i=this.Get("EditorElementId");this.SetProperty("HandleReset",!1);var s=CKEDITOR.instances[i];templateContents=s.getData(),t.SetProperty("Content",templateContents)}if(e==="PromptSaveTemplateText"){var i=this.Get("EditorElementId");this.SetProperty("HandleReset",!1);var s=CKEDITOR.instances[i];if(typeof s.document=="undefined"){alert("Please donot save Templatetext in Source Mode"),r.CancelOperation=!0;return}templateContents=s.document.getBody().getText(),CKEDITOR.tools.trim(templateContents),t.SetProperty("ContentText",templateContents)}if(e==="TemplateVerifyPopup"){var i=this.Get("EditorElementId");this.SetProperty("HandleReset",!1);var s=CKEDITOR.instances[i];templateContents=s.document.getBody().getText(),CKEDITOR.tools.trim(templateContents),t.SetProperty("ContentText",templateContents)}}SiebelAppFacade.CKEditorPresentationModel.superclass.Init.call(this),this.AddMethod("InvokeMethod",e,{scope:this,sequence:!0}),this.AddProperty("prop",{}),this.AddProperty("Content",[]),this.AddProperty("EditorElementId",""),this.AddProperty("StrContent",""),this.AddProperty("ContentText",""),this.AddProperty("onInit",!0),this.AddProperty("ResetCount",0),this.AddProperty("HandleReset",!0),this.AddMethod("SetContentBinder",function(){}),this.AttachNotificationHandler(consts.get("SWE_PROP_BC_NOTI_GENERIC"),function(e){var t=e.GetProperty(consts.get("SWE_PROP_NOTI_TYPE")),n=this.Get("onInit"),r=this.Get("OfferType");if(r=="Email"){if(t=="SWEIPrivFlds"){var i=e.propArray.ArgsArray,s=i.substr(i.indexOf("**HTML RTCEmbedded")),o=s.substr(s.indexOf("?")+1);this.SetProperty("onInit",!1),this.SetProperty("Content",o),this.ExecuteMethod("SetContentBinder")}else if(t=="SetContent"&&n){this.SetProperty("onInit",!1);var i=e.propArray.ArgsArray;if(i.split("*")!=null&&i.split("*").length>=2&&i.split("*")[1]!=null){var u=i.split("*")[1];this.SetProperty("Content",i),this.ExecuteMethod("SetContentBinder")}}}else if(t=="SetContent"){var i=e.propArray.ArgsArray;this.SetProperty("Content",i),this.ExecuteMethod("SetContentBinder")}})},e}(),"SiebelAppFacade.CKEditorPresentationModel"}));
