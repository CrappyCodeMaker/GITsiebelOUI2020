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
typeof SiebelAppFacade.edetailerthreadbar=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.edetailerthreadbar"),define("siebel/edetailerthreadbar",["siebel/TileLayoutPR"],function(){return SiebelAppFacade.edetailerthreadbar=function(){function r(e){SiebelAppFacade.edetailerthreadbar.superclass.constructor.call(this,e);var t=e;this.GetPM=function(){return t}}var e=SiebelJS.Dependency("SiebelApp.Constants"),t=!0,n=!1;return SiebelJS.Extend(r,SiebelAppFacade.TileLayoutPR),r.prototype.Init=function(){SiebelAppFacade.edetailerthreadbar.superclass.Init.call(this),this.AttachPMBinding("ShowSelection",this.ShowSelection)},r.prototype.ShowUI=function(e){SiebelAppFacade.edetailerthreadbar.superclass.ShowUI.call(this,e);var t=this.GetPM(),n=t.Get("GetFullId"),r=SiebelAppFacade.ComponentMgr.FindComponent({id:SiebelApp.S_App.GetActiveView().GetName()}).GetPM();r.Get("ThreadbarFullId")===""&&r.AddProperty("ThreadbarFullId",n);var i=$("#"+n);i.find(".AppletButtons").hide(),i.find(".siebui-tile-container").addClass("siebui-edetailing-threadbar-tile-container"),i.addClass("siebui-thread");var s=localStorage.getItem("isAdfmContainer");s==="1"&&i.addClass("siebui-thread-maf")},r.prototype.BindEvents=function(e){SiebelAppFacade.edetailerthreadbar.superclass.BindEvents.call(this,e)},r.prototype.BindData=function(e){n=!0;var r=this.GetPM(),i=$("#"+r.Get("GetFullId")),s=SiebelApp.S_App.IsAutoOn();i.show(),SiebelAppFacade.edetailerthreadbar.superclass.BindData.call(this,e);var o=r.Get("GetControls");$('[name="SWEForm4_0"]').addClass("siebui-edetailing-player-threadbar"),this.GetContainer().find(".siebui-tile-list").find("img").addClass("siebui-preview-img"),$(".siebui-edetailing-threadbar-prev-container").on("click",function(){var e=SiebelAppFacade.ComponentMgr.FindComponent({id:SiebelApp.S_App.GetActiveView().GetName()}).GetPM();if(e.Get("Mode")==="Related")return;var t=r.Get("GetRecordSet")[r.Get("GetSelection")],n=t["Parent Disable Nav Flag"];if(n==="Y")return;i.show(),s==="true"?setTimeout(function(){i.hide()},3e4):setTimeout(function(){i.hide()},1e4)}),i.mouseenter(function(){t=!1}),i.mouseleave(function(){t=!0}),$("#s_vctrl_div_tabScreen").hide(),i.find(".siebui-tile-image").hide(),i.hide();for(var u in o)if(o.hasOwnProperty(u)&&o[u].GetHTMLAttr()==="eDetailing Control")for(var a=0;a<this.GetUIWrapper(o[u]).GetEl().length;a++)this.GetUIWrapper(o[u]).GetEl().eq(a).parent().hide()},r.prototype.ShowSelection=function(){SiebelAppFacade.edetailerthreadbar.superclass.ShowSelection.call(this),this.GetContainer().find("img").addClass("siebui-preview-img");var e=this.GetPM(),t=localStorage.getItem("isAdfmContainer");t==="1"&&SiebelApp.S_App.GetOfflineMode&&SiebelApp.S_App.GetOfflineMode()&&SiebelApp.MobileFileMgr.GetHttpURLPrefix({success:function(t){var r=e.Get("GetRecordSet").length;if(r>0)for(var i=0;i<r;i++){var s=e.Get("GetRecordSet")[i],o=s.LitFileExt;if(o==="zip"||o==="ZIP"){var u=s["Image With Path"],a=u.split("\\"),f=a.length;if(s["Thumbnail Id"])offlineFileName="S_LIT_"+s["Thumbnail Id"]+"_"+s["Thumbnail Rev Id"]+"/"+a[f-2]+"/"+a[f-1];else{var l=s["Literature Id"],c=s.LitFileRev;offlineFileName="S_LIT_"+l+"_"+c+"/"+a[f-2]+"/"+a[f-1]}}else offlineFileName="S_LIT_"+s["Thumbnail Id"]+"_"+s["Thumbnail Rev Id"]+"."+s["Thumbnail Extension"];if(n===!0){var h=t+"/"+offlineFileName;$("#"+e.Get("GetFullId")+"_tile_"+i).find("img")[0]&&($("#"+e.Get("GetFullId")+"_tile_"+i).find("img")[0].src=h)}else if(n===!1&&e.Get("GetSelection")===i){var h=t+"/"+offlineFileName;$("#"+e.Get("GetFullId")+"_tile_"+i).find("img")[0]&&($("#"+e.Get("GetFullId")+"_tile_"+i).find("img")[0].src=h)}}n=!1},error:function(e){alert(e)}}),SiebelAppFacade.DecisionManager.IsTouch()&&$(".siebui-icon-fullscreen").length>0&&$(".siebui-icon-fullscreen").hide()},r}(),"SiebelAppFacade.edetailerthreadbar"}));
