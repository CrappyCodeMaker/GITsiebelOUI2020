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
typeof SiebelAppFacade.ganttlsrenderer=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.ganttlsrenderer"),define("siebel/ganttlsrenderer",["siebel/ganttrenderer"],function(){return SiebelAppFacade.ganttlsrenderer=function(){function e(){SiebelAppFacade.ganttlsrenderer.superclass.constructor.apply(this,arguments);var e=this.GetPM()}function t(e){e.stopPropagation()}function n(e){var t=e?e.data.ctx:this,n=t.GetPM(),r=n.Get("Resource Id"),i=n.Get("ResIDtoIndex")[r];if(e){var s=$(this).attr("taskid"),o=n.Get("ResIDtoIndex")[s];$("#s_"+t.GetAppletId()+"_div").find(".row"+i).removeClass("siebui-rowSelected"),$("#s_"+t.GetAppletId()+"_div").find(".row"+o).addClass("siebui-rowSelected"),n.SetProperty("Resource Id",s)}else i!=="undefined"&&$("#s_"+t.GetAppletId()+"_div").find(".row"+i).addClass("siebui-rowSelected");var u=SiebelApp.S_App.NewPropertySet();u.SetProperty("Resource Id",s),u.SetProperty("operation","rowSelection"),n.ExecuteMethod("InvokeOperation",u)}return SiebelJS.Extend(e,SiebelAppFacade.GanttRenderer),e.prototype.ShowUI=function(){SiebelAppFacade.ganttlsrenderer.superclass.ShowUI.call(this);var e=SiebelApp.S_App.GetActiveView().GetName();e==="LS Pharma Account Call Planning View"&&$("#s_"+this.GetAppletId()+"_div").find(".siebui-ganttFilterPane").addClass("forcehide")},e.prototype.BindEvents=function(){SiebelAppFacade.ganttlsrenderer.superclass.BindEvents.call(this),eventHelper=SiebelApp.S_App.PluginBuilder.GetHoByName("EventHelper");var e=$("#s_"+this.GetAppletId()+"_div");eventHelper.Manage(e,"click",{ctx:this},n,".siebui-taskEditRow"),$(".siebui-icon-showpopup").on("click",{ctx:this},function(e){t(e)})},e}(),"SiebelAppFacade.ganttlsrenderer"}));
