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
var SiebelApp=SiebelApp||{};SiebelApp.EventManager=function(){var e={};return{addListner:function(t,n,r){e[t]=e[t]||[];var i=e[t];if(i&&i.length)for(var s=0;s<i.length;s++)if(i[s].fn===n&&i[s].scope===r)return;e[t].push({fn:n,scope:r})},removeListner:function(t,n,r){var i=e[t];if(i&&i.length)for(var s=0;s<i.length;s++)i[s].fn===n&&i[s].scope===r&&i.splice(s,1)},cleanListners:function(t){e[t]=[]},fireEvent:function(t,n){var r=e[t]||{};for(var i in r)r.hasOwnProperty(i)&&typeof r[i]!="function"&&r[i].fn.call(r[i].scope||window,n)}}}(),SiebelApp.contentUpdater={loadContent:function(bSetFree,bSync){var counter=$("div[src],body[src]").length;return bSetFree=bSetFree===undefined?!1:bSetFree,$("div[src],body[src]").each(function(){var that=this,src=$(that).attr("src");$(that).removeAttr("src");if(!src){counter--;return}if(src.indexOf("Javascript:")!=-1||src.indexOf("javascript:")!=-1){var script=src.split(":")[1];script.indexOf("<!")==-1&&eval(script),counter--}else{var reqDate=new Date;reqDate.setMilliseconds(0),reqDate=reqDate.getTime(),SiebelApp.AjaxRequestMgr.Get(src,function(e){if($(that).attr("id")==="_svf0"||$(that).attr("id")==="SiebMainView"){var t=arguments[2];if(t){var n=new Date(t.getResponseHeader("Date"));n=n.getTime();var r=t.getResponseHeader("Cache-Control"),i="server";if(n<reqDate)i="browsercache";else if(r.trim()=="no-cache"||r.trim()=="no-store")i="nocache"}else i="browsercache";$(that).data("cache-mode",i)}SiebelApp.S_App.GetEnablePerfHooks()&&SiebelApp.S_App.GetTimer()&&(SiebelApp.S_App.GetTimer().TimeGoToView("","Have Layout"),SiebelApp.S_App.GetTimer().TimePopupApplet("","Have Layout"));var s=$.ajaxSetup().cache;try{e.indexOf("SWEWriteObjectTag")!=-1&&(e=e.replace(/SWEWriteObjectTag/g,"SiebelApp.contentUpdater.Nullify"));var o=e.match(/\<title\>(.*)<\/title\>/i),u="";o&&(u="title-preserved='"+HtmlEncode(o[1])+"'",e=e.replace(o[0],"")),e=e.replace(/top.document.title.*;/i,""),$(that).attr("id")==="_svf0"&&$("#_sweview").removeClass("siebui-view-sitemap"),$.ajaxSetup({cache:!0}),$(that).empty().append("<div style='height:100%;'"+u+">"+e+"</div>");var a=$(that).find("table").not("[datatable]");a.length&&a.each(function(){var e=$(this).parent().outerWidth();$(this).parent().data("_width_",e)}),a=null,counter--}catch(f){SiebelJS.Log("[ContentLoader]  Error -> "+f.message)}finally{$.ajaxSetup({cache:s}),SiebelApp.contentUpdater.setAutoHeight($(that).find("table[data-siebel-form-table]").find("tr").children("td:first-child")),that=e=null}SiebelApp.S_App.GetEnablePerfHooks()&&SiebelApp.S_App.GetTimer()&&(SiebelApp.S_App.GetTimer().TimeGoToView("","Processed Layout"),SiebelApp.S_App.GetTimer().TimePopupApplet("","Processed Layout"));var l=SiebelApp.contentUpdater.loadContent(bSetFree,bSync);if(SiebelApp.contentUpdater.callBackMap[src])if(l==0){var c=$("html").data("deferObj");c?c.done(function(){SiebelApp.contentUpdater.viewLoaded(src),$("html").removeData("deferObj")}):SiebelApp.contentUpdater.viewLoaded(src)}else SiebelApp.contentUpdater.callBackMap.ViewLoadedDeferred=SiebelApp.contentUpdater.callBackMap[src],delete SiebelApp.contentUpdater.callBackMap[src];else counter==0&&SiebelApp.contentUpdater.viewLoaded("ViewLoadedDeferred")},bSync)}}),counter},setAutoHeight:function(e){var t;for(var n=0,r=e.length;n<r;n++)t=e.eq(n),t.is(":empty")&&t.siblings().length===t.siblings(":empty").length&&t.height("auto");t=null},viewLoaded:function(e){var t=SiebelApp.contentUpdater.callBackMap[e]?SiebelApp.contentUpdater.callBackMap[e].pop():{};t&&t.handler&&t.handler.call(t.object),SiebelApp.contentUpdater.callBackMap[e]&&SiebelApp.contentUpdater.callBackMap[e].length===0&&delete SiebelApp.contentUpdater.callBackMap[e]},Nullify:function(e){SiebelJS.Debug("[ContentLoader] -> Nullifying ActiveX")},updateSrc:function(e,t){$(e).attr("src",t),this.loadContent()},InvalidateHistory:function(e,t){var n=t.split("&"),r=e.split("&");if(n.length!=r.length)return!1;var i=n.length;for(var s=0;s<i;s++)if(n[s].indexOf("SWEC=")===-1&&r[s].indexOf("SWEC=")===-1&&n[s].indexOf("SWEFrame=")===-1&&r[s].indexOf("SWEFrame=")===-1&&n[s]!=r[s])return!1;return!0},updateSrcForFrame:function(e,t){var n=e.split(".");this.updateSrc("[name="+n[n.length-1]+"]",t)},AddCallBack:function(e,t,n){this.callBackMap[e]=this.callBackMap[e]||[],this.callBackMap[e].push({handler:t,object:n})},InitializeiFrame:function(e,t){var n=t.match('src=["]{0,1}http[s]{0,1}://'+location.host)!==null;n||(n=t.search('src="https')===-1&&t.search('src="http')===-1?!0:!1);var r=$("#"+e);r.parent().parent("td").length&&r.parent().addClass("siebui-max-area").parent("td").height(r.parent().parent("td").height());if(n){t=t.replace(" src="," data-src=");var i=r.html(t).find("iframe").eq(0).attr("data-siebel-cd","false"),s=this.NavigationByHistory();i.load(function(){if($(this).attr("data-first")==="true"){$(this).removeAttr("data-first");return}SiebelApp.EventManager.fireEvent("History_PushState",{iframeOrig:$(this).attr("src"),iframeNow:this.contentWindow.location.href})}),s&&(i.attr("data-src")===s[0]||this.InvalidateHistory(i.attr("data-src"),s[0]))?(i[0].contentWindow.location.replace(s[1]),this.iframeArr[location.href]=null):i.attr("data-first","true").attr("src",i.attr("data-src"))}else r.html(t).find("iframe").eq(0).attr("data-siebel-cd","true")},ProcessHistoryInfo:function(target,navurl,lastExecute){var frame=$("#_svf0").find('iframe[data-src="'+target+'"]');frame[0]?frame[0].contentWindow.location.replace(navurl):(this.iframeArr[location.href]=[target,navurl],eval(lastExecute))},NavigationByHistory:function(){return this.iframeArr[location.href]},iframeArr:{},callBackMap:{}},$(function(){SiebelApp.contentUpdater.loadContent()}),function(){var e=$.ajaxSetup().cache;$.ajaxSetup({cache:!0}),SiebelRequire(["3rdParty/fastdom"],null,null,function(){DOMUtils=function(){return{Read:function(){fastdom.read.apply(fastdom,arguments)},Write:function(){fastdom.write.apply(fastdom,arguments)}}}()}),$.ajaxSetup({cache:e})}();
