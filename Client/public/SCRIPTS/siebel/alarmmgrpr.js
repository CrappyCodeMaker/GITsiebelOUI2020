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
typeof SiebelAppFacade.AlarmMgrPR=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.AlarmMgrPR"),define("siebel/alarmmgrpr",["siebel/phyrenderer"],function(){return SiebelAppFacade.AlarmMgrPR=function(){function e(e){SiebelAppFacade.AlarmMgrPR.superclass.constructor.call(this,e)}return SiebelJS.Extend(e,SiebelAppFacade.PhysicalRenderer),e.prototype.Init=function(){SiebelAppFacade.AlarmMgrPR.superclass.Init.call(this);var e=$("#s_"+this.GetPM().Get("GetFullId")+"_div");e.find("form").attr("name","SWEAlarmForm0_0"),e.dialog({autoOpen:!1,height:"auto",width:"auto",title:this.GetPM().Get("GetAppletLabel"),modal:!0,closeOnEscape:!1,resizable:!1,draggable:!1}),e.parent().find(".ui-dialog-titlebar-close").addClass("siebui-alarmmgr-close-btn"),e.addClass("siebui-alarmmgr-applet")},e.prototype.ShowUI=function(){var e=SiebelJS.Dependency("SiebelApp.Constants"),t=e.get("SWE_PST_BUTTON_CTRL"),n=e.get("SWE_CTRL_TEXT"),r=e.get("SWE_CTRL_TEXTAREA"),i=this.GetPM();SiebelAppFacade.AlarmMgrPR.superclass.ShowUI.call(this);if(i.Get("nextAlarm")===0)$("#s_"+i.Get("GetFullId")+"_div").dialog("close");else{$("#s_"+i.Get("GetFullId")+"_div").dialog("isOpen")||$("#s_"+i.Get("GetFullId")+"_div").dialog("open");var s,o=i.Get("GetControls");for(var u in o)if(o.hasOwnProperty(u)){control=o[u];if(s=this.GetUIWrapper(control).GetEl())control.GetUIType()===t?s.addClass("siebui-alarmmgr-btn"):control.GetUIType()===n?s.addClass("siebui-alarmmgr-field"):control.GetUIType()===r&&(s.addClass("siebui-alarmmgr-field"),s.addClass("siebui-alarmmgr-comment"))}}},e.prototype.BindData=function(){SiebelAppFacade.AlarmMgrPR.superclass.BindData.call(this);var e=this.GetPM(),t,n,r=e.Get("GetControls");for(var i in r)if(r.hasOwnProperty(i)){var s=r[i];s.GetUIType()==="JTextArea"&&(t=this.GetUIWrapper(s),n=t.GetEl(),n&&(n.css("height","10px"),n.css("height",n[0].scrollHeight)))}},e}(),SiebelAppFacade.AlarmMgrPR}));
