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
typeof SiebelAppFacade.stepsrenderer=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.stepsrenderer"),define("siebel/stepsrenderer",["siebel/TileLayoutPR"],function(){return SiebelAppFacade.stepsrenderer=function(){function n(e){SiebelAppFacade.stepsrenderer.superclass.constructor.call(this,e)}function r(){var e=this.GetPM(),n=CCFMiscUtil_CreatePropSet(),r="siebui-steps-circle";$("#s_"+e.Get("GetFullId")+"_div").find("."+r+"").unbind("click"),$("#s_"+e.Get("GetFullId")+"_div").find("."+r+"").on("click",{ctx:this},function(r){var i=$(this).parents(".siebui-tile").attr("id"),s=i.substr(i.lastIndexOf("_")+1),o=$(this).parents(".siebui-step-name").find(".siebui-step-id label").text();if(typeof t[o]=="undefined"){var u=$(this).parents(".siebui-step-timeline").find(".siebui-step-start label").text(),a=$(this).parents(".siebui-step-timeline").find(".siebui-step-end label").text();u.length>0&&a.length>0?t[o]=2:u.length>0?t[o]=1:t[o]=0}t[o]===0?(t[o]=1,$(this).addClass("siebui-steps-circle-partial-completed"),$("#"+i+" .siebui-step-end").hasClass("siebui-no-display")||$("#"+i+" .siebui-step-end").addClass("siebui-no-display"),e.OnControlEvent("SetStartTime")):t[o]===1?(t[o]=2,$(this).addClass("siebui-steps-circle-completed"),$(this).removeClass("siebui-steps-circle-partial-completed"),$("#"+i+" .siebui-step-end").hasClass("siebui-no-display")&&$("#"+i+" .siebui-step-end").removeClass("siebui-no-display"),n.SetProperty("SetDoneFlg","TRUE"),e.OnControlEvent("OnSetEstimatedTime",n)):t[o]===2?(t[o]=3,$(this).addClass("siebui-steps-circle-partial-completed"),$(this).removeClass("siebui-steps-circle-completed"),$("#"+i+" .siebui-step-end").hasClass("siebui-no-display")||$("#"+i+" .siebui-step-end").addClass("siebui-no-display"),n.SetProperty("RowId",o),n.SetProperty("ResetStartTime","FALSE"),e.OnControlEvent("ResetEndTime",n)):t[o]===3&&(t[o]=0,$(this).removeClass("siebui-steps-circle-partial-completed"),$("#"+i+" .siebui-step-end").hasClass("siebui-no-display")||$("#"+i+" .siebui-step-end").addClass("siebui-no-display"),n.SetProperty("RowId",o),n.SetProperty("ResetStartTime","TRUE"),e.OnControlEvent("ResetEndTime",n))})}var e,t=[];return SiebelJS.Extend(n,SiebelAppFacade.TileLayoutPR),n.prototype.Init=function(){SiebelAppFacade.stepsrenderer.superclass.Init.call(this),t=[]},n.prototype.BindData=function(t){SiebelAppFacade.stepsrenderer.superclass.BindData.call(this,t);var n=this.GetPM(),i=n.Get("GetRecordSet"),s;e=i.length,$("#s_"+n.Get("GetFullId")+"_div").find(".siebui-tile-list .siebui-tile").each(function(){stepRowId=$(this).find(".siebui-step-id label").text();for(nIndex=0;nIndex<e;nIndex++)if(stepRowId==i[nIndex]["Id"]){s=i[nIndex].Performed,i[nIndex]["Start Date"]!==""&&i[nIndex]["End Date"]===""?$(this).find(".siebui-step-name button").addClass("siebui-steps-circle-partial-completed"):s==="Y"&&$(this).find(".siebui-step-name button").addClass("siebui-steps-circle-completed");break}}),r.call(this)},n.prototype.SetControlValue=function(e,t,n){var r=this.GetPM(),i=n===undefined||n===null?r.Get("GetSelection"):n,s,o,u;(e.GetFieldName()=="Start Date"||e.GetFieldName()=="End Date")&&t.length>0&&(s=t.indexOf(" "),s!=-1&&(o=t.substr(s+1,2),u=t.substr(s+4,2),t=o+":"+u)),this.GetUIWrapper(e).SetValue(t,i)},n.prototype.EndLife=function(){SiebelAppFacade.stepsrenderer.superclass.EndLife.call(this),t=[]},n}(),"SiebelAppFacade.stepsrenderer"}));
