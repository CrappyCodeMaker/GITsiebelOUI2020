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
typeof SiebelAppFacade.OrgChartPModel=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.OrgChartPModel"),define("siebel/orgchartpmodel",["siebel/networkpmodel"],function(){return SiebelAppFacade.OrgChartPModel=function(){function i(){SiebelAppFacade.OrgChartPModel.superclass.constructor.apply(this,arguments)}function s(e){var t=e.GetProperty("type"),n,r,i;if(t==="MsgFCNotifyClient"){n=e.GetProperty("ArgsArray"),n=n.substr(n.indexOf("@")),r=CCFMiscUtil_CreatePropSet(),r.DecodeFromString(n),i=r.GetChildByType("PSFCWorkspace");if(i!=null){t=i.GetType(),console.log(t);var s=i.GetProperty("szBox");this.SetProperty("BoxSize",s)}}}function o(e,t,n,r){this.SetProperty("HandleBeforeConnectionInUI",""),n=="LeftMiddle"&&r=="Direct"||n=="Direct"&&r=="LeftMiddle"||n=="Direct"&&r=="RightMiddle"||n=="RightMiddle"&&r=="Direct"?this.SetProperty("ContinueConnection",!1):this.SetProperty("ContinueConnection",!0)}function u(e){var t=this.Get("ConnectionsList"),n=t[e];return typeof n.color=="undefined"?["BottomCenter","TopCenter"]:["RightMiddle","RightMiddle"]}function a(e,t){var n=this.Get("ConnectionsList"),r=n[e];return typeof r.color=="undefined"?[]:[["Arrow",{location:1,width:10,length:5}]]}function f(){var e={tolerance:"",hoverClass:"",activeClass:""};return{tolerance:"touch",hoverClass:"",activeClass:""}}function l(e,t,n,r,i,s){var o=CCFMiscUtil_CreatePropSet(),u=this.Get("waitingforConnections"),a=this.Get("localPos"),f=u.pop();f.connectionDrawn!==!0&&(f.connectionDrawn=!0,this.SetProperty("waitingforConnections",u),f.sourceEndpointType=="Direct"&&f.targetEndpointType=="Direct"?(o.SetProperty("sel",f.to),o.SetProperty("ctrl","0"),o.SetProperty("pt",a[f.from].left+" "+a[f.from].top)):(o.SetProperty("sel",f.from),o.SetProperty("ctrl","1"),o.SetProperty("pt",f.left+" "+f.top)),this.ExecuteMethod("NotifyServer","move",o))}function c(e,t,n){var r=this.Get("NewEndpointsList"),i=this.Get("EndpointsList");if(typeof n=="undefined"||!n){var s=[],o=this.Get("DefaultEnpointType");s.push({type:"Direct",id:"1",nodeId:t,location:"TopCenter"}),s.push({type:"Direct",id:"2",nodeId:t,location:"BottomCenter"}),s.push({type:"LeftMiddle",id:"3",nodeId:t,location:"LeftMiddle"}),s.push({type:"RightMiddle",id:"4",nodeId:t,location:"RightMiddle"}),i[t]=r[t]=[],i[t].push(s),e||r[t].push(s)}else i[t].push(n),e||r[t].push(n);this.SetProperty("EndpointsList",i),this.SetProperty("NewEndpointsList",r)}function h(e,t,n){var r=e.Get("obj").id,i=e.Get("ConnectionsList"),s=i[r],o=CCFMiscUtil_CreatePropSet();if(typeof s.color=="undefined")o.SetProperty("ctrl","0"),t=s.toId,o.SetProperty("pt","-1 -1"),n="move";else{t=r;var u=e.Get("DeletedConnectionsInfluencer");u.push(t),e.SetProperty("DeletedConnectionsInfluencer",u),n="Delete"}o.SetProperty("sel",t),e.ExecuteMethod("NotifyServer",n,o)}function p(){e.NodeDropped="newGfc"}var e={},t=0,n=2,r=SiebelJS.Dependency("SiebelApp.Constants");return SiebelJS.Extend(i,SiebelAppFacade.NetworkPM),i.prototype.Init=function(){SiebelAppFacade.OrgChartPModel.superclass.Init.apply(this,arguments),this.AddMethod("EventMenuClickHandler",function(e,t){h(this,e,t)},{override:!0}),this.AddMethod("BeforeConnectionHanlder",o,{override:!0}),this.AddMethod("InitiateConnectionHandler",l,{override:!0}),this.AddMethod("AddNewEndpointToList",c,{override:!0}),this.AddMethod("GetConnectionAnchorForConnId",u,{override:!0}),this.AddMethod("GetOverlay",a,{override:!0}),this.AddMethod("GetTargetDropOptions",f,{override:!0}),this.AddProperty("DeletedConnectionsInfluencer",[]),this.AddProperty("DeletedConnectionsList",[]),this.AddProperty("Deleted",!1),this.AddProperty("saveActivated",!1),this.AddProperty("BoxSize","");var e=this.Get("connectionStyle");e.connectorStyle=["Flowchart",{stub:[40,40],gap:5,cornerRadius:5}],e.endpointStyle=[],e.endpointStyle.RightMiddle={},e.endpointStyle.LeftMiddle={},e.endpointStyle.Direct={},e.endpointStyle.TopCenter={},e.endpointStyle.BottomCenter={},e.endpointStyle.RightMiddle.type=["Dot",{radius:4}],e.endpointStyle.RightMiddle.fillColor="#456",e.endpointStyle.LeftMiddle.type=["Dot",{radius:4}],e.endpointStyle.Direct.type=["Dot",{radius:4}],e.endpointStyle.TopCenter.type=["Dot",{radius:4}],e.endpointStyle.BottomCenter.type=["Dot",{radius:4}],e.detachable=!1,this.SetProperty("connectionStyle",e);var t=this.Get("Handle");t.nodeDrag=!1,t.AddNewNode=!1,t.HandleCR=!1,this.SetProperty("Handle",t),this.AddProperty("AcceptBackgroundColour",!1);var n=CCFMiscUtil_CreatePropSet();n.SetProperty("hasPalette",!1),this.ExecuteMethod("SetCanvasProperties",n),p(),this.AttachNotificationHandler(r.get("SWE_PROP_BC_NOTI_GENERIC"),s)},i.prototype.Setup=function(e){SiebelAppFacade.OrgChartPModel.superclass.Setup.apply(this,arguments);var t=e.GetChildByType("apm");this.SetProperty("hasPalette",!1)},i}(),SiebelAppFacade.OrgChartPModel}));
