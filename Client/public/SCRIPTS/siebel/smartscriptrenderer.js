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
typeof SiebelAppFacade.SmartScriptRenderer=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.SmartScriptRenderer"),typeof SiebelApp!="undefined"&&typeof SiebelApp.S_App!="undefined"&&typeof SiebelApp.Constants!="undefined"&&SiebelApp.S_App.RegisterConstructorAgainstKey("SmartScriptPR","SiebelAppFacade.SmartScriptRenderer"),define("siebel/smartscriptrenderer",[],function(){return SiebelAppFacade.SmartScriptRenderer=function(){function l(e){SiebelAppFacade.SmartScriptRenderer.superclass.constructor.call(this,e),this.AttachPMBinding("FocusOnApplet",p,{scope:this}),this.AttachPMBinding("firstQuestionFocus",p,{scope:this}),this.PopulateQuestionList=function(e){var t=$(".siebui-smartscript  #SSQuestionList");t.length&&t.html(e),t.show()},this.DisplayPageLabel=function(e,t){var n=$(".siebui-smartscript #s_SSPageLabel");n.length&&e!==null&&n.html(e.m_displayName),SiebelApp.S_App.IsRwd()&&$(".siebui-smartscript .siebui-smsc-title .siebui-smartscript-required-indicator").html(t)},this.DisplayQuestion=function(e,t){var n,r;e.m_mustAnswer>0&&(SiebelApp.S_App.IsRwd()?n=$(".siebui-smartscript span[name='"+e.m_uiInputName+"_Label']").next(".siebui-smartscript-required-indicator"):n=$(".siebui-smartscript #"+e.m_uiInputName+"_r"),n.html(t)),SiebelApp.S_App.IsRwd()?r=".siebui-smartscript span[name='"+e.m_uiInputName+"_Label']":r=".siebui-smartscript #"+e.m_uiInputName+"_d",$(r).html(e.m_displayName)},this.ExtractHtmlForQuestions=function(e){var t=SiebelApp.S_App.IsRwd()?$(".siebui-smartscript .siebui-smartscript-one-question"):$(".siebui-smartscript #SSQuestionList > table.AppletBack"),n,r,i,s,o;if(t.length===0){SiebelJS.Debug("SmartScript missing question list in SSQuestionList");return}for(n=0;n<t.length;n++){r=t[n],i=$(r).find(SiebelApp.S_App.IsRwd()?".siebui-label":".ssDisplayName");if(i.length){o=i.attr(SiebelApp.S_App.IsRwd()?"name":"id"),o=o.substring(0,SiebelApp.S_App.IsRwd()?o.length-6:o.length-2);if(e.hasOwnProperty(o)){s=e[o];if(s.m_enabledHTML===undefined||s.m_enabledHTML==="")s.m_enabledHTML=r.outerHTML}else SiebelJS.Debug("SmartScript unexpected quest id: "+i.attr("id"))}}}}function c(e,t){if(!e||!e.length)return null;var n=e.length;for(var r=0;r<n;r++)if(e[r].value===t)return e[r];return null}function h(e){return typeof e.GetInputName=="function"}function p(){var e=this.GetPM().Get("firstQuestionFocus"),t=e===null?null:e.GetInputName();SiebelJS.Debug("SmartScript focus on control: "+t),setTimeout(function(){if(e!==null){var n=e.GetUIType(),r;n===s?r=$(".siebui-smartscript #"+t+"_d")[0]:r=$(".siebui-smartscript #"+t)[0]||$(".siebui-smartscript [name="+t+"]")[0]||$(".siebui-smartscript #"+t+"_d")[0],$(r).attr("tabindex",0).focus()}else{var r=$(".siebui-smartscript .siebui-applet-btm-buttons  button:enabled")[0];$(r).attr("tabindex",0).focus()}},60)}var e=SiebelJS.Dependency("SiebelApp.Utils"),t=SiebelJS.Dependency("SiebelApp.Constants"),n=t.get("SWE_PST_BUTTON_CTRL"),r=t.get("SWE_CTRL_MVG"),i=t.get("SWE_CTRL_PICK"),s=t.get("SWE_CTRL_RADIO"),o=t.get("SWE_CTRL_CHECKBOX"),u=t.get("SWE_CTRL_COMBOBOX"),a=t.get("SWE_CTRL_TEXT"),f="175px";return SiebelJS.Extend(l,SiebelAppFacade.PhysicalRenderer),l.prototype.ShowUI=function(){var e=this.GetPM();e.GetHtmlForQuestions(),e.CcPopulate(),SiebelAppFacade.SmartScriptRenderer.superclass.ShowUI.call(this),e.FocusOnFirstQuestion(),SiebelApp.S_App.uiStatus.Free()},l.prototype.BindEvents=function(){SiebelAppFacade.SmartScriptRenderer.superclass.BindEvents.call(this)},l.prototype.SetControlValue=function(e,t){if(!h(e))return;var n=$(".siebui-smartscript #"+e.GetInputName())[0]||$(".siebui-smartscript [name="+e.GetInputName()+"]")[0];n=$(n);switch(e.GetUIType()){case s:n=$(".siebui-smartscript input[name="+e.GetInputName()+"]"),n=c(n,t),n&&$(n).prop("checked",!0);break;case u:if(t!==undefined&&t!==""){var r=n.find("option:contains('"+t+"'"+")");r.length?r.attr("selected","selected"):n.append("<option value='"+t+"' selected>"+t+"</option>")}n.attr("value",t);break;default:SiebelAppFacade.SmartScriptRenderer.superclass.SetControlValue.call(this,e,t)}},l.prototype.ShowUIControl=function(e){if(!h(e))return;SiebelAppFacade.SmartScriptRenderer.superclass.ShowUIControl.call(this,e);var t=$(".siebui-smartscript [name="+e.GetInputName()+"]");switch(e.GetUIType()){case a:t.addClass("text");break;case u:t.addClass("comboBox"),e.GetWidth()==0&&t.width(f);break;default:}t.height(t.attr("height")),t.width(t.attr("width"))},l.prototype.BindControlEvents=function(e){SiebelAppFacade.SmartScriptRenderer.superclass.BindControlEvents.call(this,e);if(!h(e))return;var t=$(".siebui-smartscript [name="+e.GetInputName()+"]");switch(e.GetUIType()){case u:break;case a:break;default:}t=null},l}(),"SiebelAppFacade.SmartScriptRenderer"}));
