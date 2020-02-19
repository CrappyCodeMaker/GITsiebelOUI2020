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
typeof SiebelAppFacade.notificationviewpm=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.notificationviewpm"),define("siebel/notificationviewpm",["siebel/viewpm"],function(){return SiebelAppFacade.notificationviewpm=function(){function e(e){SiebelAppFacade.notificationviewpm.superclass.constructor.call(this,e)}function t(e){var t=SiebelAppFacade.ComponentMgr.FindComponent({id:SiebelApp.S_App.GetActiveView().GetName()}),n=t.GetChildren(),r=[],i={},s,o;if(n&&e)for(s=0,o=n.length;s<o;s++){var u=n[s].Get("GetFullId"),a=e.indexOf("#s_"+u+"_div"),f=e.indexOf("#s_"+u+"_div")===0;i={childName:n[s].Get("GetName"),childLabel:n[s].Get("GetAppletLabel"),id:u,displayState:f?!0:!1},this.ExecuteMethod("ComponentStateChange",i.id,i.displayState),r.splice(a,0,i)}else if(n&&!e)for(s=0,o=n.length;s<o;s++)i={childName:n[s].Get("GetName"),childLabel:n[s].Get("GetAppletLabel"),id:n[s].Get("GetFullId"),displayState:s===0?!0:!1},this.ExecuteMethod("ComponentStateChange",i.id,i.displayState),r.push(i);this.AddProperty("ChildComponentState",r)}function n(e){var t=this.Get("ChildComponentState");for(var n=0,r=t.length;n<r;n++){SiebelApp.S_App.GetActiveView().GetApplet(t[n].childName).GetBusComp().IsCommitPending()===!0&&SiebelApp.S_App.GetActiveView().GetApplet(t[n].childName).PostChangesToBC(!0,null,!0);if(e.indexOf("s_"+t[n].id+"_div")===0&&t[n].displayState===!1||e.indexOf("s_"+t[n].id+"_div")!==0&&t[n].displayState===!0)t[n].displayState=!t[n].displayState,this.ExecuteMethod("ComponentStateChange",t[n].id,t[n].displayState)}}function r(e,t){}return SiebelJS.Extend(e,SiebelAppFacade.ViewPM),e.prototype.Init=function(){SiebelAppFacade.notificationviewpm.superclass.Init.apply(this,arguments),this.AddMethod("PrepareStateInfo",t),this.AddMethod("ComponentStateChange",r),this.AddMethod("ChangeState",n),this.AttachEventHandler("TabClick","ChangeState")},e.prototype.Setup=function(e){SiebelAppFacade.notificationviewpm.superclass.Setup.call(this,e)},e}(),"SiebelAppFacade.notificationviewpm"}));
