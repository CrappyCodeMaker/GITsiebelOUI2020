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
typeof SiebelAppFacade.CDRenderer=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.CDRenderer"),define("siebel/cdrenderer",["siebel/jqgridrenderer"],function(){return SiebelAppFacade.CDRenderer=function(){function t(e){SiebelAppFacade.CDRenderer.superclass.constructor.call(this,e)}var e=SiebelJS.Dependency("SiebelApp.Constants");return SiebelJS.Extend(t,SiebelAppFacade.JQGridRenderer),t.prototype.ShowUI=function(){SiebelAppFacade.CDRenderer.superclass.ShowUI.call(this);var e=this.GetPM().Get("GetId"),t="s_"+e+"_ld",n=parseInt(this.GetPM().Get("GetControls").CDIcon.GetColIndex());n+=1;var r=$("#"+t).find("th")[n];this.GetGrid().jqGrid("setGridParam",{deepempty:!0})},t.prototype.BindEvents=function(){SiebelAppFacade.CDRenderer.superclass.BindEvents.call(this);var t=this.GetColCount();t-=1;var n=SiebelApp.S_App.GetActiveView().GetAppletMap()["TOUI CustDir Applet"];SiebelApp.S_App.GetActiveView().SetActiveAppletOnLoad(n),$("#"+this.GetPM().Get("GetPlaceholder")).bind("keyup",{ctx:this},function(e){if(e.keyCode===27){var t=e.data.ctx.GetPM().Get("GetSelection");t+=1;var n=$("#"+t+"CDIcon");n.hasClass("siebui-telco-inline-open")&&(n.hasClass("siebui-telco-inline-close")||(n.parent().next().slideUp(50),n.addClass("siebui-telco-inline-close").removeClass("siebui-telco-inline-open")))}}),$("#"+this.GetPM().Get("GetPlaceholder")).on("click",'[id*="CDIcon"]',{ctx:this,TotalAppletColumns:t},function(t){var n=$(this).parent()[0].id,r=t.data.ctx.GetPM().Get("GetFullId"),i="#s_"+t.data.ctx.GetPM().Get("GetId")+"_ld",s=$("#"+r).find('[data-content-id="siebui-custdir-drop-content"]').find("input"),o;n-=1,t.data.ctx.GetPM().OnControlEvent(e.get("PHYEVENT_SELECT_ROW"),n,!1,!1),s.each(function(){$(this).attr("value",$(this).val())});if($(this).attr("class")===undefined){var u=$("#"+r).find('[data-content-id="siebui-custdir-drop-content"]').html(),a;$(this).addClass("siebui-telco-inline-open"),$(this).parent().after('<section class = "siebui-telco-inline"><section class="siebui-telco-inline-applet" colspan='+t.data.TotalAppletColumns+"> "+u+"</section></section>"),$(this).parent().next().find(".siebui-custdir-drop-applet input").removeAttr("name"),a=$(this).parent().next().find(".siebui-custdir-drop-applet input"),(a.attr("title")==undefined||a.prev("span").attr("title")==undefined)&&a.each(function(){var e=$(this).prev("span");$(this).attr("title",$(this).val()),e.attr("title",e.text())})}else $(this).hasClass("siebui-telco-inline-close")?($(this).addClass("siebui-telco-inline-open").removeClass("siebui-telco-inline-close"),$(this).parent().next().slideDown(50)):($(this).addClass("siebui-telco-inline-close").removeClass("siebui-telco-inline-open"),$(this).parent().next().slideUp(50));o=$(i).find("tr").width(),$(this).parent().next().css("width",o),t.stopImmediatePropagation()})},t.prototype.BindData=function(e){var t="#s_"+this.GetPM().Get("GetId")+"_ld";if(e){var n=$(t).find("section.siebui-telco-inline");n.length!=0&&n.remove()}SiebelAppFacade.CDRenderer.superclass.BindData.call(this,e)},t}(),"SiebelAppFacade.CDRenderer"}));
