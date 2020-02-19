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
typeof SiebelAppFacade.OKSearchPRenderer=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.OKSearchPRenderer"),define("siebel/oksearchprenderer",["siebel/phyrenderer","http://yui.yahooapis.com/3.14.0/build/yui/yui-min.js"],function(){return SiebelAppFacade.OKSearchPRenderer=function(){function t(e){SiebelAppFacade.OKSearchPRenderer.superclass.constructor.call(this,e),this._DestoryObjArray=[],this._HeadNode,this._Panel}function n(e){var t=this.GetPM().Get("GetFullId"),n="#"+t+"_header",r="#"+t+"_overlay",i="#"+t+"_listDetailContainer",s="#"+t+" #ok-list-container",o="#"+t+" #ok-list",u="#"+t+" #ok-search",a="#"+t+" #ok-results",f="#"+t+" #ok-facet",l='<div id ="'+t+'_header"></div>';$("div:first").before(l),$(n).addClass("yui3-skin-sam");var c='<div id ="'+t+'_overlay"></div>';$(n).append(c);var h='<div id ="'+t+'_listDetailContainer"></div>';$(r).append(h);var p=this.GetPM().Get("GetRawRecordSet");if(p.length==0)return;var d=p[0]["Knowledge Management Url"],v=d+"/apps/infocenter/resources/js/OKWidgets/",m=d+"/apps/infocenter/resources/css/oracleKnowledgeWidget",g=p[0].Type,y=p[0]["Channel Name"],b=p[0].Language,w=p[0]["Num Records"],E=p[0]["Sort By"];if(this.GetPM()!==null){var S=e.one(n),x=e.one(r),T=e.one(a),N=e.one(i),C=e.one(s),k=e.one(o),L=e.one(u),A=e.one(f),O={};O.baseURL=d,O.widgetDir=v,O.css=m,O.setLocale=b,O.transport="jsonp",O.type="type";try{var M=new e.OracleKnowledge.OKUtility(O),_=(new e.Panel({srcNode:x,width:"50%",height:"90%",zIndex:10,modal:!0,visible:!1,close:!0})).render();_.set("align",{node:S,points:[e.WidgetPositionAlign.TC,e.WidgetPositionAlign.BC]});var D=(new e.OracleKnowledge.AnswerView({utility:M})).render(N);D.on("show",function(e){_.show(),D.get("closeButton").hide()});var P={};P.answerViewWidget=D,P.utility=M,P.type=g,P.channelReferenceKey=y,P.pageSize=w,P.sortBy=E;var H=(new e.OracleKnowledge.AnswerList(P)).render(k),B=(new e.OracleKnowledge.SearchWidget({utility:M,inputType:"text"})).render(L);B.get("searchButton").on("click",function(e){B.get("searchField")._node.value!==""&&(C.hide(!0),A.show(!0))}),B.on("startOverSearch",function(e){C.show(!0)}),B.after("searchResultChange",function(e){B.get("searchResult").isDocID?(F.get("contentBox").hide(),j.get("contentBox").hide()):(F.get("contentBox").show(),j.get("contentBox").show())});var j=(new e.OracleKnowledge.ResultWidget({utility:M,searchWidget:B,answerViewWidget:D,showExcerpt:!0})).render(T),F=(new e.OracleKnowledge.FacetTree({utility:M,searchWidget:B})).render(A);this._Panel=_,this._HeadNode=S,this._DestoryObjArray.push(F),this._DestoryObjArray.push(j),this._DestoryObjArray.push(B),this._DestoryObjArray.push(H),this._DestoryObjArray.push(D),this._DestoryObjArray.push(M)}catch(I){$(s).html("<p class='siebui-quick-applet-validation-error'>"+SiebelApp.S_App.LocaleObject.GetLocalString("IDS_OK_CONFIG")+"</p>")}}}var e=SiebelJS.Dependency("SiebelApp.Constants");return SiebelJS.Extend(t,SiebelAppFacade.PhysicalRenderer),t.prototype.ShowUI=function(){var e=this,t=this.GetPM().Get("GetRawRecordSet");if(t.length==0)return;var r=t[0]["Knowledge Management Url"],i=r+"/apps/infocenter/resources/js/OKWidgets/",s=$.data($("body")[0],"yuiObj");s?n.call(e,s):YUI({modules:{"oracle-knowledge/base":{fullpath:i+"okBaseWidget.js"},"oracle-knowledge/answer-view":{fullpath:i+"answerViewWidget.js"},"oracle-knowledge/ok-utility":{fullpath:i+"okUtility.js"},"oracle-knowledge/answer-list":{fullpath:i+"answerListWidget.js"},okLocale:{fullpath:i+"localeUtility.js"},"oracle-knowledge/search-widget":{fullpath:i+"searchWidget.js"},"oracle-knowledge/result-widget":{fullpath:i+"resultWidget.js"},"oracle-knowledge/facet-tree":{fullpath:i+"facetsWidget.js"}},combine:!1,filter:"RAW"}).use("node-event-simulate","panel","transition","oracle-knowledge/base","oracle-knowledge/ok-utility","okLocale","oracle-knowledge/answer-view","oracle-knowledge/answer-list","oracle-knowledge/search-widget","oracle-knowledge/result-widget","oracle-knowledge/facet-tree",function(t){$.data($("body")[0],"yuiObj")?(t.destroy(),t=null,n.call(e,$.data($("body")[0],"yuiObj"))):($.data($("body")[0],"yuiObj",t),n.call(e,t))}),SiebelAppFacade.OKSearchPRenderer.superclass.ShowUI.call(this)},t.prototype.EndLife=function(){for(var e=0;e<this._DestoryObjArray.length;e++)this._DestoryObjArray[e]!=null&&typeof this._DestoryObjArray[e]!="undefined"&&(this._DestoryObjArray[e].destroyWidget(),this._DestoryObjArray[e]=null);this._Panel&&(this._Panel.destroy(!0),this._Panel=null),this._HeadNode&&(this._HeadNode.destroy(!0),this._HeadNode=null);var t=this.GetPM().Get("GetFullId"),n="#"+t+"_header";$(n).remove(),SiebelAppFacade.OKSearchPRenderer.superclass.EndLife.call(this)},t}(),SiebelAppFacade.OKSearchPRenderer}));
