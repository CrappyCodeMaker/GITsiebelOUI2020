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
typeof SiebelAppFacade.GanttTNTRenderer=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.GanttTNTRenderer"),define("siebel/gantttntrenderer",["siebel/ganttrenderer"],function(){return SiebelAppFacade.GanttTNTRenderer=function(){function n(){SiebelAppFacade.GanttTNTRenderer.superclass.constructor.apply(this,arguments);var e=this.GetPM()}function r(){var e=this.GetPM(),t=$(window).height(),n=$("#_sweappmenu").outerHeight(!0),r=$(".siebui-button-toolbar").outerHeight(!0),i=$("#_swethreadbar").outerHeight(!0),s=$("#_swescrnbar").outerHeight(!0),o=$("#s_"+e.Get("GetFullId")+"_div").find(".AppletButtons").outerHeight(!0),u=$("#s_"+e.Get("GetFullId")+"_div").find("#siebui-formControls").outerHeight(!0),a=10,f=t-(n+r+i+s+o+u+a);this.setGanttCtrlHeight(f)}function i(e){thatPM=e.data.ctx.GetPM(),LICCode=thatPM.Get("LIC Field")[e.data.CW.GetValue()],thatPM.SetProperty("Color Display By",LICCode),thatPM.SetProperty("Redraw Legends","Y")}var e=SiebelJS.Dependency("SiebelApp.Constants"),t=e.get("SWE_GANTT_ACTIVITY_LABEL");return SiebelJS.Extend(n,SiebelAppFacade.GanttRenderer),n.prototype.ShowUI=function(){r.call(this),SiebelAppFacade.GanttTNTRenderer.superclass.ShowUI.call(this)},n.prototype.BindData=function(){SiebelAppFacade.GanttTNTRenderer.superclass.BindData.call(this);var e=this.GetPM();e.Get("Redraw Legends")==="Y"&&(e.SetProperty("Redraw Legends",""),this.getGanttLegendBar().createLegends(e.ExecuteMethod("prepareLegendMap"),e.Get("ShowLegend")))},n.prototype.BindEvents=function(){SiebelAppFacade.GanttTNTRenderer.superclass.BindEvents.call(this);var e=this,t,n,r,s,o=e.GetPM(),u,a,f,l,c,h,p,d=0,v,m,g,y,b=$("#s_"+o.Get("GetFullId")+"_div"),w=SiebelApp.S_App.PluginBuilder.GetHoByName("EventHelper");u=o.Get("GetControls"),a=u.TurnTime,a&&(f=this.GetUIWrapper(a),v=f.GetEl(),w&&v.length&&w.Manage(v,"click",{ctx:this},function(e){o.SetProperty("TurnTime",f.GetValue())})),l=u.ConfigSpacePattern,l&&(c=this.GetUIWrapper(l),m=c.GetEl(),w&&m.length&&w.Manage(m,"click",{ctx:this},function(e){o.SetProperty("ConfigSpacePattern",c.GetValue())})),t=u["Display Toggle"],t&&(n=this.GetUIWrapper(t),g=n.GetEl(),g.unbind("autocompleteclose")),r=u["Color Display Toggle"],r&&(s=this.GetUIWrapper(r),y=s.GetEl(),y.unbind("autocompleteclose"),w&&y.length&&w.Manage(y,"blur",{ctx:this,CW:s},i)),b=null,u=null},n.prototype.GetDrilldownPropSet=function(e,t,n,r){var i=SiebelAppFacade.GanttTNTRenderer.superclass.GetDrilldownPropSet.call(this,e,t,n,r);if($(e).attr("data-drilldown-type")==="UGrid"){var s=$(e).closest("div.siebui-taskBox").attr("taskid"),o=$(e).closest("div.siebui-taskEditUtility").attr("taskid"),u=this.GetPM().ExecuteMethod("getEvent",o,s),a=u?u.FI:0;a&&i.SetProperty("Function Id",a)}return i},n}(),"SiebelAppFacade.GanttTNTRenderer"}));
