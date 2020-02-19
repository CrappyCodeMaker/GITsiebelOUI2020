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
typeof SiebelAppFacade.edetailerviewpm=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.edetailerviewpm"),define("siebel/edetailerviewpm",["siebel/viewpm"],function(){return SiebelAppFacade.edetailerviewpm=function(){function e(e){SiebelAppFacade.edetailerviewpm.superclass.constructor.call(this,e)}function t(){var e,t,n=SiebelApp.S_App.GetService("LS PCD Service"),r=SiebelApp.S_App.NewPropertySet(),i=SiebelApp.S_App.NewPropertySet();if(n){var s={};s.async=!1,s.scope=this,s.npr=!0,s.selfbusy=!0,s.cb=function(){r=arguments[2],e=r.childArray[0].GetProperty("RetVal"),t=r.childArray[0].GetProperty("CrossIndRetVal"),this.AddProperty("GetSysPref",e),this.AddProperty("GetCrossInd",t)},n.InvokeMethod("GeteDetailingSysPref",i,s)}}function n(e){var t;t=localStorage.getItem("isAdfmContainer");var n=[],r=[],i=SiebelAppFacade.ComponentMgr.FindComponent({id:this.Get("PlayerApplet")}),s=SiebelAppFacade.ComponentMgr.FindComponent({id:this.Get("RelatedApplet")});n.push(i),n.push(s);var o=[],u=SiebelAppFacade.ComponentMgr.FindComponent({id:SiebelApp.S_App.GetActiveView().GetName()});this.AddProperty("View",u);if(n)for(var a=0,f=n.length;a<f;a++){var l="#s_S_A"+n[a].Get("GetId")+"_div";r.push(l);var c=e.indexOf("#s_S_A"+n[a].Get("GetId")+"_div");if(t==="1"&&SiebelApp.S_App.GetOfflineMode&&SiebelApp.S_App.GetOfflineMode())var h=e.indexOf("#s_S_A"+n[a].Get("GetId")+"_div")===2;else var h=e.indexOf("#s_S_A"+n[a].Get("GetId")+"_div")===3;var p={childName:n[a].Get("GetName"),childLabel:n[a].Get("GetAppletLabel"),id:n[a].Get("GetId"),displayState:h?!0:!1};this.ExecuteMethod("ComponentStateChange",p.id,p.displayState),o.splice(c,0,p)}this.AddProperty("ChildComponentState",o);var d,v=SiebelApp.S_App.GetService("LS PCD Service"),m=SiebelApp.S_App.NewPropertySet(),g=SiebelApp.S_App.NewPropertySet();if(v){var y={};y.async=!1,y.scope=this,y.npr=!0,y.selfbusy=!0,y.cb=function(){m=arguments[2],d=m.childArray[0].GetProperty("RetVal");if(d==="Y"){var t=SiebelAppFacade.ComponentMgr.FindComponent({id:"Contact Feedback List VBC Applet"});n.push(t);var i="#s_S_A"+n[a].Get("GetId")+"_div";r.push(i);var s=e.indexOf("#s_S_A"+n[2].Get("GetId")+"_div");p={childName:n[a].Get("GetName"),childLabel:n[a].Get("GetAppletLabel"),id:n[a].Get("GetId"),displayState:h?!0:!1},p.displayState="",$("#s_S_A"+p.id+"_div").addClass("siebui-addcontact-applet"),this.ExecuteMethod("ComponentStateChange",p.id,p.displayState),o.splice(s,0,p),this.AddProperty("ChildComponentState",o)}},v.InvokeMethod("GeteDetailingSysPref",g,y)}}function r(e){var t=this.Get("ChildComponentState");for(var n=0,r=t.length;n<r;n++)n!=="2"&&(t[n].displayState=!t[n].displayState),this.ExecuteMethod("ComponentStateChange",t[n].id,t[n].displayState)}function i(e,t){}function s(){var e=0}return SiebelJS.Extend(e,SiebelAppFacade.ViewPM),e.prototype.Init=function(){SiebelAppFacade.edetailerviewpm.superclass.Init.apply(this,arguments),this.AddMethod("PrepareStateInfo",n),this.AddMethod("SysPref",t),this.AddMethod("ComponentStateChange",i),this.AddMethod("ButtonCanInvoke",s),this.AddMethod("ChangeState",r),this.AddProperty("LastUpdatedRec",""),this.AddProperty("PlayerApplet",""),this.AddProperty("RelatedApplet",""),this.AddProperty("DetailingStartTime",""),this.AddProperty("hotspotappletname",""),this.AddProperty("PlayerStartTime",""),this.AddProperty("RelatedStartTime",""),this.AddProperty("Mode",""),this.AddProperty("UpdatePlayer","N"),this.AddProperty("ThreadbarFullId",""),this.AttachEventHandler("TabClick","ChangeState"),this.AddProperty("m_sessionData",CCFMiscUtil_CreatePropSet()),this.AddProperty("hotspotRelatedStartTime",""),this.AddProperty("hotspotRelatedEndTime",""),this.AddProperty("visited","N"),this.AddProperty("GetSysPref",""),this.AddProperty("GetCrossInd","")},e.prototype.Setup=function(e){SiebelAppFacade.edetailerviewpm.superclass.Setup.call(this,e)},e}(),"SiebelAppFacade.edetailerviewpm"}));
