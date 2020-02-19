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
typeof SiebelAppFacade.DynaControlFormPR=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.DynaControlFormPR"),define("siebel/dynacontrolformpr",["siebel/phyrenderer"],function(){return SiebelAppFacade.DynaControlFormPR=function(){function e(e){SiebelAppFacade.DynaControlFormPR.superclass.constructor.apply(this,arguments)}return SiebelJS.Extend(e,SiebelAppFacade.PhysicalRenderer),e.prototype.Init=function(){SiebelAppFacade.DynaControlFormPR.superclass.Init.call(this),this.GetPM().SetProperty("SelectedRow",0),this.AttachPMBinding("CellChange",this.SetCellValue),this.AttachPMBinding("FocusFirstControl",this.FocusFirstControl)},e.prototype.ShowUI=function(){var e=this.GetPM();if(SiebelAppFacade.ComponentMgr.FindComponent({id:SiebelApp.S_App.GetActiveView().GetName()}).GetPM().Get("ViewPRLoaded")){var t=e.Get("GetControls"),n=e.Get("GetFullId"),r=e.Get("AppletTemplateId"),i=$("#"+r).html();$("#"+r).html('<div id="'+n+'"><div id="s_'+n+'_div"></div></div>');var s=$("#s_"+n+"_div");i&&s.append(i);for(var o in t)if(t.hasOwnProperty(o)){var u=t[o];$("#"+u.GetName()).addClass("siebui-show-control"),u.GetUIType()==="Label"&&$("#"+u.GetName()).text(u.GetDisplayName())}SiebelAppFacade.DynaControlFormPR.superclass.ShowUI.call(this)}},e.prototype.BindData=function(){SiebelAppFacade.ComponentMgr.FindComponent({id:SiebelApp.S_App.GetActiveView().GetName()}).GetPM().Get("ViewPRLoaded")&&SiebelAppFacade.DynaControlFormPR.superclass.BindData.call(this)},e.prototype.BindEvents=function(){SiebelAppFacade.ComponentMgr.FindComponent({id:SiebelApp.S_App.GetActiveView().GetName()}).GetPM().Get("ViewPRLoaded")&&SiebelAppFacade.DynaControlFormPR.superclass.BindEvents.call(this)},e.prototype.SetCellValue=function(e,t,n){var r=this.GetPM(),i=r.Get("GetControls"),s;for(var o in i)if(i.hasOwnProperty(o)){var u=i[o];if(u.GetName()==t){var a=$("#"+t);return a.length===0?!1:(a.val(n),s=!0,a=null,s)}}},e.prototype.FocusFirstControl=function(){var e=this.GetPM().Get("GetControls"),t=9999;this.SetFirstControl(null);for(var n in e)if(e.hasOwnProperty(n)){var r=e[n];if(r.GetIndex()&&r.GetIndex()<t){var i=!1;this.GetPM().Get("IsInQueryMode")===!1?i=this.GetPM().ExecuteMethod("CanUpdate",n):i=!0;if(i&&!utils.IsEmpty(r.GetUIType())&&(r.isBasicControl()||r.GetUIType()[0]==="J"||r.GetUIType()===mvg||r.GetUIType()===pick)&&($("#"+r.GetInputName())[0]||$("[name="+r.GetInputName()+"]")[0])){t=r.GetIndex(),this.SetFirstControl($("#"+r.GetInputName())[0]||$("[name="+r.GetInputName()+"]")[0]);break}}}if(this.GetFirstControl()!=null){$(this.GetFirstControl()).focus();return}this.FocusFirstNonEditableControl()},e}(),SiebelAppFacade.DynaControlFormPR}));
