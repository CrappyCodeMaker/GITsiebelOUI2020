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
typeof SiebelApp.S_App.notificationviewpr=="undefined"&&(SiebelJS.Namespace("SiebelApp.S_App.notificationviewpr"),define("siebel/notificationviewpr",["siebel/viewpr"],function(){return SiebelAppFacade.notificationviewpr=function(){function e(e){SiebelAppFacade.notificationviewpr.superclass.constructor.call(this,e)}function t(e){var t,n,r=e.GetPM().Get("ChildComponentState"),i="<div id=UserPreferTabs class=ui-body-g>";for(var s=0;s<r.length;s++){if(s===0)var t="#"+r[s].id,n="#s_"+r[s].id+"_div_Btn";i+="<button id=s_"+r[s].id+"_div_Btn class=ui-btn>"+r[s].childLabel+"</button>"}$(t).parent().prepend(i),$(n).addClass("siebui-userprofile-navigationtabs-focus")}return SiebelJS.Extend(e,SiebelAppFacade.ViewPR),e.prototype.Init=function(){SiebelAppFacade.notificationviewpr.superclass.Init.call(this),this.AttachPMBinding("ComponentStateChange",this.ComponentDisplay)},e.prototype.ShowUI=function(){SiebelAppFacade.notificationviewpr.superclass.ShowUI.call(this);var e=[],n=[],r=SiebelApp.S_App.IsRwd()?$("#"+SiebelApp.S_App.ViewTarget()):$("#_svf0");e=$(r).find("[id^=s_S_A]");for(var i=0;i<e.length;i++)n[i]="#"+e[i].id;this.GetPM().ExecuteMethod("PrepareStateInfo",n),t(this)},e.prototype.ComponentDisplay=function(e,t){var n="#s_"+e+"_div",r="a_"+e;t===!0?($(n).parent().show(),$(n+"_Btn").addClass("siebui-userprofile-navigationtabs-focus")):t===!1&&($(n).parent().hide(),$(n+"_Btn").removeClass("siebui-userprofile-navigationtabs-focus")),$(".siebui-view-multi-column").remove()},e.prototype.BindEvents=function(){$("#UserPreferTabs").find(".ui-btn").bind("click",{ctx:this},function(e){e.data.ctx.GetPM().OnControlEvent("TabClick",this.id);var t=e.data.ctx.GetPM().Get("ChildComponentState"),n;for(var r=0;r<t.length;r++){n=$("#s_"+t[r].id+"_div");if(n.hasClass("siebui-edit-mode")){var i=SiebelApp.S_App.GetActiveView().GetApplet(t[r].childName).GetControls();for(var s in i)s!=="UndoRecord"&&s!=="SaveEditRecord"&&$("[name="+i[s].GetInputName()+"]")&&$("[name="+i[s].GetInputName()+"]").parent().addClass("siebui-ipe-enabled");n.removeClass("siebui-edit-mode"),n.addClass("siebui-roipe-mode")}}})},e}(),"SiebelAppFacade.notificationviewpr"}));
