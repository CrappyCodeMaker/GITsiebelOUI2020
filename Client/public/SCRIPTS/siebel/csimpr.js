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
typeof SiebelAppFacade.csimpr=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.csimpr"),define("siebel/csimpr",["siebel/jqgridrenderer"],function(){var e=5e3;return SiebelAppFacade.csimpr=function(){function t(e){SiebelAppFacade.csimpr.superclass.constructor.call(this,e)}function n(e){e.currentTarget.id.indexOf("Due_Date")>0&&e.data.ctx.GetPM().OnControlEvent("modifyDueDate",e.currentTarget.firstChild.value)}function r(){var t=this.GetPM(),n=t.Get("isValidDate"),r=t.Get("GetId"),i=$("#s_"+r+"_l"),s=i.find("tr.ui-state-highlight").find("td[id$='Due_Date']"),o=t.Get("invalidDate");n?(s.removeClass("siebui-telco-invalid-input"),s.tooltip({content:s.text(),show:{effect:"blind",duration:8e3}}),s[0].isttip=!1):(s.tooltip({content:o,show:{duration:50},tooltipClass:"siebui-telco-custom-tooltip",position:{my:"center bottom-10",at:"center top",using:function(e,t){$(this).css(e),$("<div>").addClass("siebui-telco-custom-tooltip-arrow",t.vertical,t.horizontal).appendTo(this)}}}),s.tooltip("open"),s.addClass("siebui-telco-invalid-input"),setTimeout(function(){s.tooltip("close"),s.tooltip("enable")},e),s[0].isttip=!0)}function i(e){e.currentTarget.id.indexOf("SIM_")>0&&e.data.ctx.GetPM().OnControlEvent("modifySimNum",e.currentTarget.lastChild.value)}function s(){var t=this.GetPM(),n=t.Get("isValidSnum"),r=t.Get("GetId"),i=$("#s_"+r+"_l"),s=i.find("tr.ui-state-highlight").find("td[id$='SIM_']"),o="";switch(n){case"empty":o=t.Get("emptyValError");break;case"lenError":o=t.Get("lengthError");break;case"invalid":o=t.Get("invalidEntryError")}o?(s.addClass("siebui-telco-invalid-input"),s.tooltip({content:o,tooltipClass:"siebui-telco-custom-tooltip",position:{my:"center bottom-10",at:"center top",using:function(e,t){$(this).css(e),$("<div>").addClass("siebui-telco-custom-tooltip-arrow",t.vertical,t.horizontal).appendTo(this)}}}),s.tooltip("open"),setTimeout(function(){s.tooltip("close"),s.tooltip("enable")},e),s[0].isttip=!0):(s.removeClass("siebui-telco-invalid-input"),s.tooltip({content:s.text(),show:{effect:"blind",duration:100}}),s[0].isttip=!1)}function o(e,t){var n=e;n.tooltip({position:{my:"center bottom-10",at:"center top",using:function(e,t){$(this).css(e),$("<div>").addClass("siebui-telco-custom-tooltip-arrow",t.vertical,t.horizontal).appendTo(this)}},content:t,tooltipClass:"siebui-telco-custom-tooltip"}),n[0].isttip=!0}function u(){var e=$(this);e[0].isttip&&e.tooltip("disable")}return SiebelJS.Extend(t,SiebelAppFacade.JQGridRenderer),t.prototype.Init=function(){SiebelAppFacade.csimpr.superclass.Init.call(this),this.AttachPMBinding("isValidSnum",s,{scope:this}),this.AttachPMBinding("isValidDate",r,{scope:this})},t.prototype.BindData=function(){this.ClearData(),SiebelAppFacade.csimpr.superclass.BindData.call(this);var e=this.GetPM(),t=e.Get("GetId"),n=$("#S_A"+t),r=n.find("td[id$='SIM_']");for(var i=0;i<r.length;i++){var s=$(r[i]),u=s.text(),a=SiebelApp.TelcoUtils.ValidateSimNumber(u),f="";switch(a){case"empty":f="emptyValError";break;case"lenError":f="lengthError";break;case"invalid":f="invalidEntryError"}f&&(s.addClass("siebui-telco-invalid-input"),o(s,this.GetPM().Get(f)))}},t.prototype.BindEvents=function(){SiebelAppFacade.csimpr.superclass.BindEvents.call(this),this.ClearData();var e=this.GetPM(),t=e.Get("GetId"),r=$("#S_A"+t);r.on("blur","td[id$='Due_Date']",{ctx:this},n),r.on("blur","td[id$='SIM_']",{ctx:this},i),r.on("focus","td[id$='Due_Date'] , td[id$='SIM_']",{ctx:this},u)},t}(),"SiebelAppFacade.csimpr"}));
