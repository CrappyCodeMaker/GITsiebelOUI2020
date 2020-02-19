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
typeof SiebelAppFacade.AppletSliderViewPR=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.AppletSliderViewPR"),define("siebel/appletsliderviewpr",["siebel/viewpr"],function(){return SiebelAppFacade.AppletSliderViewPR=function(){function t(){SiebelAppFacade.AppletSliderViewPR.superclass.constructor.apply(this,arguments)}function n(t){for(var n in t)if(t.hasOwnProperty(n)){var r=t[n],i=SiebelApp.S_App.LocaleObject.GetLocalString(r.ToolTip)||SiebelApp.S_App.LocaleObject.GetLocalString(r.ControlDisplay),s=i?i:r.ControlName,o=utils.IsTrue(SiebelApp.S_App.IsAutoOn())?"un='"+r.ControlElement+"'"+" rn='"+r.ControlElement+"'"+" ot='Button'"+"aria-label='"+s+"'":"aria-label='"+s+"'",u=null;if(r.ControlType==="icon")SiebelApp.Utils.IsEmpty(r.ToolTip)||(o=o+" title='"+i+"' "),u=SiebelAppFacade.HTMLTemplateManager.GenerateMarkup({id:r.ControlElement+"_bttn",type:e.get("SWE_PST_BUTTON_CTRL"),className:r.ControlDisplay+" appletButton",attrs:o});else if(r.ControlType==="text"){var a=SiebelApp.S_App.LocaleObject,f=a.GetLocalString(r.ControlDisplay);u=SiebelAppFacade.HTMLTemplateManager.GenerateMarkup({id:r.ControlElement+"_bttn",type:e.get("SWE_PST_BUTTON_CTRL"),className:"appletButton",attrs:o+" title='"+f+"' ",value:f})}var l=$('<div id="siebui_mask_'+r.ControlElement+'" class="siebui-ss-mask siebui-mask-hide"></div>');$("#"+r.ControlElement).append(l),$("#"+r.ControlElement).append(u)}}function r(e){var t=SiebelApp.S_App.GetActiveView().GetAppletMap(),n=$(e.data.TargetElement),r=parseInt(n.find(".siebui-applet")[0].id.match(/\d+/)[0]);n[e.data.TargetOperation](e.data.TargetOperParam),$(window).resize(),n.addClass("siebui-slider-on"),$("#siebui_mask_"+e.data.id).removeClass("siebui-mask-hide");for(var i in t)if(parseInt(t[i].GetId())===r){t[i].FocusFirstControl();break}$("#siebui_mask_"+e.data.id).attr("slider-mask-on","Y")}function i(e){var t=$("#siebui_mask_"+e.data.id),n=$(e.data.TargetElement);n[e.data.TargetOperation](e.data.TargetOperParam),$(window).resize(),t.attr("slider-mask-on","N"),t.addClass("siebui-mask-hide"),n.removeClass("siebui-slider-on")}function s(e){e.which===27&&$("#siebui_mask_"+e.data.id).attr("slider-mask-on")==="Y"&&i(e)}function o(e){var t=SiebelApp.S_App.PluginBuilder.GetHoByName("EventHelper");for(var n in e)if(e.hasOwnProperty(n)){var o=e[n];t.Manage($("#"+o.ControlElement+"_bttn"),"click",{ctx:this,TargetElement:o.TargetElement,TargetOperation:o.TargetOperation,TargetOperParam:o.TargetOperParam,id:o.ControlElement},r),t.Manage($("#siebui_mask_"+o.ControlElement),"click",{ctx:this,TargetElement:o.TargetElement,TargetOperation:o.TargetOperation,TargetOperParam:o.TargetOperParam,id:o.ControlElement},i),t.Manage($(".siebui-com-mode"),"keyup",{ctx:this,TargetElement:o.TargetElement,TargetOperation:o.TargetOperation,TargetOperParam:o.TargetOperParam,id:o.ControlElement},s)}}var e=SiebelJS.Dependency("SiebelApp.Constants");return SiebelJS.Extend(t,SiebelAppFacade.ViewPR),t.prototype.Init=function(){SiebelAppFacade.AppletSliderViewPR.superclass.Init.call(this)},t.prototype.ShowUI=function(){SiebelAppFacade.AppletSliderViewPR.superclass.ShowUI.apply(this,arguments),n.call(this,this.GetPM().Get("UISliders")),$(".ui-autocomplete").addClass("ui-autocomplete-catalog"),$("#_sweclient").addClass("siebui-com-mode")},t.prototype.BindEvents=function(){SiebelAppFacade.AppletSliderViewPR.superclass.BindEvents.apply(this,arguments),o.call(this,this.GetPM().Get("UISliders"))},t.prototype.EndLife=function(){SiebelAppFacade.AppletSliderViewPR.superclass.EndLife.apply(this,arguments),$(".ui-autocomplete").removeClass("ui-autocomplete-catalog"),$("#_sweclient").removeClass("siebui-com-mode")},t}(),"SiebelAppFacade.AppletSliderViewPR"}));
