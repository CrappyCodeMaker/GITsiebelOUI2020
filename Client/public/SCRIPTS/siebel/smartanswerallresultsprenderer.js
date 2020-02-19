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
typeof SiebelAppFacade.SmartAnswerPR=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.SmartAnswerPR"),define("siebel/smartanswerallresultsprenderer",["siebel/phyrenderer"],function(){return SiebelAppFacade.SmartAnswerPR=function(){function r(e){SiebelAppFacade.SmartAnswerPR.superclass.constructor.call(this,e);var t=e;this.GetPM=function(){return t}}function i(t){var r,i,s,o,u,a,f,l,c,h,p,d,v="",m="#",g=[],y=[],b='<span class="siebui-search-bigheadingtext-dialog">'+n.GetLocalString("IDS_SEARCH_OUI_SRCH_TITLE_TEXT")+"</span>",w='<span class="siebui-search-bigheadingtext-dialog">'+n.GetLocalString("IDS_SWE_CKEDITOR_SOURCE")+"</span>",E=t.Get("GetRecordSet"),S="<div id='div-find-results' class=siebui-applet-content><table title="+n.GetLocalString("RTCFindTxt")+n.GetLocalString("IDS_SEARCH_OUI_SRCH_RESULTS_TEXT")+"><tbody><tr><th class=siebui-search-table-h1>"+b+"</th><th class=siebui-search-table-h2>"+w+"</th></tr>",x="<tr class=siebui-row-first siebui-row-odd>",T="<tr class=siebui-row-odd>",N="<tr class=siebui-row-even>",C=E.length;for(var k=0;k<C;k++){s=E[k].URL,g=e.TokenizeString(s,m),o=e.Trim(g[0].substring(5)),u=e.Trim(g[1].substring(7)),a=e.Trim(g[2].substring(6)),f=e.Trim(g[3].substring(8)),v="SWECmd=GotoView&SWEView="+o+"&SWEApplet0="+u+"&SWERowId0="+a,l='<a href="javascript:void(0)"id="URL'+k+'"'+"value ="+'"'+v+'"'+">"+E[k]["Result Field"]+"</a>";var L="<td class=siebui-search-col1><p><span class=siebui-search-highlight>"+l+"</td><td class=siebui-search-col2>"+f+"</td></tr>";k===0?S+=x+L:k%2===0?S+=N+L:S+=T+L}S+="</tbody></table></div>",$("#findresulttable").append(S).trigger("create"),$("#findresulttable").attr("tabindex","0"),$("#findresulttable").focus()}var e=SiebelJS.Dependency("SiebelApp.Utils"),t=SiebelJS.Dependency("SiebelApp.Constants"),n=SiebelApp.S_App.LocaleObject;return SiebelJS.Extend(r,SiebelAppFacade.PhysicalRenderer),r.prototype.ShowUI=function(){var e=this.GetPM();SiebelAppFacade.SmartAnswerPR.superclass.ShowUI.call(this),i.call(this,e)},r.prototype.BindEvents=function(e){var t=this.GetPM();e!=="drilldown"&&SiebelAppFacade.SmartAnswerPR.superclass.BindEvents.call(this);switch(e){case"drilldown":default:for(var n=0;n<10;n++){var r="URL"+n,i;$("#"+r+"").bind("click",{ctx:this},function(e){i=e.currentTarget.getAttribute("value"),SiebelApp.S_App.GotoView("","",i,"")})}}},r.prototype.BindData=function(e){var t=this.GetPM();SiebelAppFacade.SmartAnswerPR.superclass.BindData.call(this),$("#div-find-results").remove(),i.call(this,t),this.BindEvents("drilldown")},r}(),"SiebelAppFacade.SmartAnswerPR"}));
