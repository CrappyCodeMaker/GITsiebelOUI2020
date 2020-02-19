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
typeof SiebelAppFacade.ExplorerPresentationModel=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.ExplorerPresentationModel"),define("siebel/explorerpmodel",["siebel/pmodel"],function(){return SiebelAppFacade.ExplorerPresentationModel=function(){function n(e){SiebelAppFacade.ExplorerPresentationModel.superclass.constructor.call(this,e)}function r(e){var t=[],n=0,r=e;for(;;){if(t.length>3)break;var i=e.indexOf("*",n),s=e.substring(n,i),o=Number(s);if(s===0)t.push(""),n=s.length+n+1;else{var u=e.substring(i+1,i+1+Number(s));t.push(u),n=s.length+n+1+Number(s)}}return t}function i(e){var t=e,n=t.length,r=0,i=0,o=0,a="";this.SetProperty("cleartree",!0),this.SetProperty("nodecount",0);while(r<=n){r=t.indexOf(" ",i),o=t.substring(i,r),i=r,r=Number(i)+Number(o)+1,a=t.substring(i+1,r),i=Number(r);var f=s.call(this,a);u.call(this,f)}this.SetProperty("refreshTree",!0)}function s(e){var t=e.indexOf("|");t===-1&&(t=e.length);var n=e.substring(0,t),r=n.split(" ",t-1),i=e.substring(t+1);return i!==""&&(r[r.length-1]=i),r}function o(){var e=this.Get("currentnode"),t=e.child.length+1;return e.position==="0"?""+t:this.Get("currentnode").position+"."+t}function u(t){if(t[0]===e.get("CMD_SET_ROOT")){var n=this.Get("root");n.child==undefined&&(n={caption:"root",child:[],type:"0",position:"0"},this.SetProperty("root",n)),this.SetProperty("currentnode",n);var r={caption:t[1],child:[],type:e.get("TREENODE_TYPE_ROOT"),selected:"f",position:o.call(this),parent:this.Get("currentnode")};n.child.push(r),this.SetProperty("currentnode",r),this.SetProperty("nodecount",this.Get("nodecount")+1)}else if(t[0]===e.get("CMD_ADD_CHILD")){var i={child:[],type:t[1],selected:t[2],caption:t[3],position:o.call(this),parent:this.Get("currentnode")};this.Get("currentnode").child.push(i),this.SetProperty("nodecount",this.Get("nodecount")+1)}else if(t[0]===e.get("CMD_ADD_CHILDI")){var i={child:[],type:t[1],selected:t[2],icon:t[3],caption:t[4],position:o.call(this),parent:this.Get("currentnode")};this.Get("currentnode").child.push(i),this.SetProperty("nodecount",this.Get("nodecount")+1)}else if(t[0]===e.get("CMD_GO_DOWN")){var s=this.Get("currentnode");this.SetProperty("currentnode",s.child[s.child.length-1])}else t[0]===e.get("CMD_GO_UP")?this.SetProperty("currentnode",this.Get("currentnode").parent):t[0]===e.get("CMD_EXPAND_ITEM")?this.Get("currentnode").expand=t[1]:t[0]===e.get("CMD_SELECT_ITEM")?(a.call(this,t[1],this.Get("root")),this.SetProperty("selectednode",this.Get("currentnode"))):t[0]===e.get("CMD_DELETE_ALL")?this.SetProperty("root",{}):t[0]===e.get("CMD_DELETE_CHILDREN")&&(a.call(this,t[1],this.Get("root")),this.Get("currentnode").child=[],this.Get("currentnode").expand="")}function a(e,t){if(t.position===e){this.SetProperty("currentnode",t);return}var n=t.child.length;for(var r=0;r<n;r++){var i=t.child[r];if(i.position===e){this.SetProperty("currentnode",i);return}i.child.length>0&&a.call(this,e,i)}}var e=SiebelJS.Dependency("SiebelApp.Constants"),t=SiebelJS.Dependency("SiebelApp.Utils");return SiebelJS.Extend(n,SiebelAppFacade.PresentationModel),n.prototype.Init=function(){SiebelAppFacade.ExplorerPresentationModel.superclass.Init.call(this),this.AddProperty("root",{}),SiebelApp.S_App.IsRwd()&&t.IsTrue(this.Get("IsObjResponsive"))?this.AddProperty("placeholder",this.Get("GetTreeId")):this.AddProperty("placeholder","s_"+this.Get("GetId")+"_treectrl"),this.AddProperty("selectednode",null),this.AddProperty("currentnode",null),this.AddProperty("nodecount",0),this.AddProperty("refreshTree",!1),this.AddProperty("cleartree",!1),this.AddProperty("LandMarkTitle",this.Get("GetAppletLabel")+" "+SiebelApp.S_App.LocaleObject.GetLocalString("IDS_SWE_TREE_APPLET")),this.AttachNotificationHandler(e.get("SWE_PROP_BC_NOTI_GENERIC"),function(e){var t=r(e.GetProperty("ArgsArray"));e.GetProperty("type")==="GetPage"&&i.call(this,t[3])}),this.AttachEventHandler("OnTreeEvent",function(t,n){var r=CCFMiscUtil_CreatePropSet();r.SetProperty(e.get("SWE_TREE_ITEM_STR"),n),this.ExecuteMethod("InvokeMethod",t,r)},{core:!0}),this.AddMethod("SetCurrentNode",function(e){a.call(this,e,this.Get("root"))})},n.prototype.Setup=function(n){SiebelAppFacade.ExplorerPresentationModel.superclass.Setup.call(this,n),i.call(this,n.GetProperty(e.get("SWE_PROP_UPDATE"))),this.AddProperty("nodeIconsMap",n.GetChildByType("tcb")),SiebelApp.S_App.IsRwd()&&t.IsTrue(this.Get("IsObjResponsive"))&&this.SetProperty("placeholder",this.Get("GetTreeId"))},n}(),"SiebelAppFacade.ExplorerPresentationModel"}));
