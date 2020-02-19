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
typeof SiebelAppFacade.calendarviewpm=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.calendarviewpm"),define("siebel/calendarviewpm",["siebel/viewpm"],function(){return SiebelAppFacade.calendarviewpm=function(){function e(e){var t=[];this.GetCompMode=function(){return t},this.SetCompMode=function(e){t=e},SiebelAppFacade.calendarviewpm.superclass.constructor.call(this,e)}function t(){compMode=this.GetCompMode();if(compMode.length===0){var e=SiebelAppFacade.ComponentMgr.FindComponent({id:SiebelApp.S_App.GetActiveView().GetName()}),t=e.GetChildren();if(t)for(var n=0,r=t.length;n<r;n++){var i={childName:t[n].Get("GetName"),childLabel:t[n].Get("GetAppletLabel"),id:t[n].Get("GetId"),displayMode:t[n].Get("defaultAppletDisplayMode")};this.ExecuteMethod("ComponentModeChange",t[n].Get("GetId"),t[n].Get("defaultAppletDisplayMode")),compMode.push(i)}}else for(var n=0,r=compMode.length;n<r;n++)this.ExecuteMethod("ComponentModeChange",compMode[n].id,compMode[n].displayMode);this.AddProperty("ChildComponentMode",compMode)}function n(e){var t=this.Get("ChildComponentMode");for(var n=0,r=t.length;n<r;n++)$(e).closest("#s_S_A"+t[n].id+"_div").length>0&&t[n].displayMode&&t[n].displayMode!="expanded"?t[n].displayMode="expanded":t[n].displayMode&&(t[n].displayMode="collapsed"),this.ExecuteMethod("ComponentModeChange",t[n].id,t[n].displayMode)}function r(e,t){}return SiebelJS.Extend(e,SiebelAppFacade.ViewPM),e.prototype.Init=function(){SiebelAppFacade.calendarviewpm.superclass.Init.apply(this,arguments),this.AddMethod("PrepareModeInfo",t),this.AddMethod("ComponentModeChange",r),this.AddMethod("ChangeMode",n),this.AttachEventHandler("TabClick","ChangeMode")},e.prototype.Setup=function(e){SiebelAppFacade.calendarviewpm.superclass.Setup.call(this,e)},e.prototype.EndLife=function(){this.SetCompMode(null),SiebelAppFacade.calendarviewpm.superclass.EndLife.call(this)},e}(),"SiebelAppFacade.calendarviewpm"}));
