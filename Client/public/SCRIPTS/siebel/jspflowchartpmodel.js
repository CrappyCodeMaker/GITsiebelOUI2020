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
typeof SiebelAppFacade.JSPFlowChartPModel=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.JSPFlowChartPModel"),define("siebel/jspflowchartpmodel",["siebel/networkpmodel"],function(){return SiebelAppFacade.JSPFlowChartPModel=function(){function n(){SiebelAppFacade.JSPFlowChartPModel.superclass.constructor.apply(this,arguments)}function r(e,t,n){if(n&&t){var r=CCFMiscUtil_CreatePropSet();r.SetProperty("sel",t),r.SetProperty("action",n),e.ExecuteMethod("NotifyServer",n,r)}}function i(e,t,n,r,i,s){var o=CCFMiscUtil_CreatePropSet(),u=e.Get("ActionMap");o.SetProperty("shpId",t),o.SetProperty("frId","");var a=typeof e.Get("SelectedId")=="undefined"?"":e.Get("SelectedId");o.SetProperty("rect",n+" "+r+" "+i+" "+s),o.SetProperty("sel",a),e.ExecuteMethod("NotifyServer",u.NodeDropped,o)}function s(e,t,n){var r=CCFMiscUtil_CreatePropSet();r.SetProperty("pt",e+" "+t),r.SetProperty("ptPos","1"),r.SetProperty("sel",n);var i=this.Get("ActionMap"),s=this.Get("chartTypeProp");s==="AccountChart"&&r.SetProperty("ctrl","0"),this.ExecuteMethod("NotifyServer",i.NodeMoved,r)}function o(e){e.ExecuteMethod("SetActionMap","NodeDropped","newGfc")}var e=0,t=2;return SiebelJS.Extend(n,SiebelAppFacade.NetworkPM),n.prototype.Init=function(){SiebelAppFacade.JSPFlowChartPModel.superclass.Init.apply(this,arguments),this.AddProperty("fullyLoaded",!1),this.AddProperty("isSmartScript",!1),this.AddProperty("isHelp",!1),this.AddProperty("waitingforConnections",[]),this.AddMethod("EventMenuClickHandler",function(e,t){r(this,e,t)},{override:!0}),this.AddMethod("NewNodeHandler",function(e,t,n,r,s){i(this,e,t,n,r,s)},{override:!0}),this.AddMethod("NodeMoved",s,{override:!0}),this.AddMethod("GetColorClass",function(e){var t=this.Get("isSmartScript"),n=this.Get("isHelp");t&&e=="105"?this.SetProperty("colorclass","smart_page"):t&&e=="110"?this.SetProperty("colorclass","smart_question"):n&&e=="100"?this.SetProperty("colorclass","ihelp_start"):n&&e=="103"?this.SetProperty("colorclass","ihelp_step"):e=="100"?this.SetProperty("colorclass","loy_start"):e=="110"&&this.SetProperty("colorclass","loy_end")},{override:!0}),o(this)},n.prototype.Setup=function(e){SiebelAppFacade.JSPFlowChartPModel.superclass.Setup.apply(this,arguments);var t=e.GetChildByType("apm");this.SetProperty("i110",t.GetProperty("i110")),this.SetProperty("i0",t.GetProperty("i0")),this.SetProperty("i105",t.GetProperty("i105"));var n=t.GetProperty("OrgChartType");this.SetProperty("chartTypeProp",n);if(n==="AccountChart"){this.SetProperty("DisableContextMenu",!0);var r=this.Get("connectionStyle");r.connectorStyle=["Flowchart"],this.SetProperty("connectionStyle",r);var i=this.Get("Handle");i.nodeDrag=!1,this.SetProperty("Handle",i)}var s=CCFMiscUtil_CreatePropSet();s.SetProperty("hasPalette",!0),this.ExecuteMethod("SetCanvasProperties",s);var o=t.GetProperty("IsQandAnsApplet"),u=t.GetProperty("IsSmallApplet");if(o=="T"||o=="t")this.SetProperty("isSmartScript",!0),this.ExecuteMethod("SetLengths",72,48,96,48),this.SetProperty("HandleCR",!1);if(u=="T"||u=="t"){this.SetProperty("isHelp",!0),this.ExecuteMethod("SetLengths",72,48,96,48);var a=this.Get("CanvasProperties");a.SetProperty("designerHeight",!0),this.SetProperty("CanvasProperties",a);var f=this.Get("colorMap");f[100]="siebui-fcd-c3",this.SetProperty("colorMap",f)}},n}(),SiebelAppFacade.JSPFlowChartPModel}));
