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
typeof SiebelAppFacade.EmailRenderer=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.EmailRenderer"),define("siebel/emailprenderer",["siebel/phyrenderer"],function(){return SiebelAppFacade.EmailRenderer=function(){function n(e){SiebelAppFacade.EmailRenderer.superclass.constructor.call(this,e)}function r(e){a(),l()}function i(e){f(),l()}function s(t){if(t.which===e.get("SWE_F2_KEY")){var n=t.data.ctrl.GetMethodPropSet().Clone();t.data.ctx.GetPM().OnControlEvent(e.get("PHYEVENT_INVOKE_CONTROL"),t.data.ctrl.GetMethodName(),n),t.stopImmediatePropagation()}}function o(){var e=$(".siebui-email-show-cc a");e.length>0&&(e.text(this.GetPM().Get("CcCaption")),$(".siebui-email-show-cc").width(e.width()))}function u(){var e=$(".siebui-email-show-bcc a");e.length>0&&(e.text(this.GetPM().Get("BccCaption")),$(".siebui-email-show-bcc").width(e.width()))}function a(){var e=$(".siebui-email-cc-row");e.length>0&&e.show().attr("aria-hidden",!1);var t=$(".siebui-email-show-cc");t.length>0&&t.hide().attr("aria-hidden",!0)}function f(){var e=$(".siebui-email-bcc-row");e.length>0&&e.show().attr("aria-hidden",!1);var t=$(".siebui-email-show-bcc");t.length>0&&t.hide().attr("aria-hidden",!0)}function l(){$("div[name=popup]").parent().height("auto")}var e=SiebelJS.Dependency("SiebelApp.Constants"),t=SiebelJS.Dependency("SiebelApp.Utils");return SiebelJS.Extend(n,SiebelAppFacade.PhysicalRenderer),n.prototype.Init=function(){SiebelAppFacade.EmailRenderer.superclass.Init.call(this),this.AttachPMBinding("CcCaption",o,{scope:this}),this.AttachPMBinding("BccCaption",u,{scope:this})},n.prototype.ShowUI=function(){SiebelAppFacade.EmailRenderer.superclass.ShowUI.call(this);var e=$(".siebui-email-to input");e.length>0&&e.addClass("siebui-ctrl-pick siebui-input-popup");var t=$(".siebui-email-cc input");t.length>0&&t.addClass("siebui-ctrl-pick siebui-input-popup");var n=$(".siebui-email-bcc input");n.length>0&&n.addClass("siebui-ctrl-pick siebui-input-popup");var r=this.GetPM().Get("GetControls");for(var i in r)if(r.hasOwnProperty(i)){var s=r[i];if(i==="HTML Address Book"){var o=$("[name="+s.GetInputName()+"]");o.length>0&&o.text("").addClass("siebui-icon-pick applet-form-pick applet-list-pick").attr("aria-label","Selection Field")}else if(i==="HTML Label3")this.GetPM().SetProperty("CcCaption",s.GetDisplayName());else if(i==="HTML Label4")this.GetPM().SetProperty("BccCaption",s.GetDisplayName());else if(i==="HTML Button2"||i==="HTML Button"){var u=$("[name="+s.GetInputName()+"]");u.children("a").attr("title",s.GetDisplayName())}}r=null;var a=$(".siebui-email-cc-row");a.length>0&&a.hide().attr("aria-hidden",!0);var f=$(".siebui-email-bcc-row");f.length>0&&f.hide().attr("aria-hidden",!0);var l=$("div[name=popup]");if(l.length>0){var c=l.find(".siebui-email-popup-buttons"),h=l.find(".siebui-send-email");if(c.length>0&&h.length>0){var p=c.width()+h.outerWidth(!0)-h.width();l.parent(".ui-dialog").css({minWidth:p})}}},n.prototype.BindEvents=function(){var e=SiebelApp.S_App.PluginBuilder.GetHoByName("EventHelper"),t=this.GetPM().Get("GetControls");for(var n in t)if(t.hasOwnProperty(n)){var o=t[n];if(n==="HTML Address Book"){var u=$("[name="+o.GetInputName()+"]").siblings("input");u.length>0&&e&&e.Manage(u,"keydown",{ctx:this,ctrl:o},s)}}var a=$(".siebui-email-show-bcc a"),f=$(".siebui-email-show-cc a");a.length>0&&f.length>0&&e&&(e.Manage(f,"click",{ctx:this},r),e.Manage(a,"click",{ctx:this},i)),SiebelAppFacade.EmailRenderer.superclass.BindEvents.call(this)},n.prototype.BindData=function(){SiebelAppFacade.EmailRenderer.superclass.BindData.call(this)},n.prototype.EndLife=function(){SiebelAppFacade.EmailRenderer.superclass.EndLife.call(this)},n.prototype.SetControlValue=function(e,n,r){e.GetFieldName()==="Email CC Line"&&!t.IsEmpty(n)&&a(),e.GetFieldName()==="Email BCC Line"&&!t.IsEmpty(n)&&f(),SiebelAppFacade.EmailRenderer.superclass.SetControlValue.call(this,e,n,r)},n}(),SiebelAppFacade.EmailRenderer}));
