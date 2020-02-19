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
typeof SiebelAppFacade.OKListPRenderer=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.OKListPRenderer"),define("siebel/oklistprenderer",["siebel/phyrenderer","http://yui.yahooapis.com/3.14.0/build/yui/yui-min.js"],function(){return SiebelAppFacade.OKListPRenderer=function(){function t(e){SiebelAppFacade.OKListPRenderer.superclass.constructor.call(this,e),this._DestoryObjArray=[],this._HeadNode,this._Panel}function n(e){var t=this.GetPM().Get("GetFullId"),n="#"+t+"_header",r="#"+t+"_overlay",i="#"+t+"_listDetailContainer",s="#"+t+" #ok-list-container",o="#"+t+" #ok-list",u='<div id ="'+t+'_header"></div>';$("div:first").before(u),$(n).addClass("yui3-skin-sam");var a='<div id ="'+t+'_overlay"></div>';$(n).append(a);var f='<div id ="'+t+'_listDetailContainer"></div>';$(r).append(f);var l=this.GetPM().Get("GetRawRecordSet");if(l.length==0)return;var c=l[0]["Knowledge Management Url"],h=c+"/apps/infocenter/resources/js/OKWidgets/",p=c+"/apps/infocenter/resources/css/oracleKnowledgeWidget",d=l[0].Type,v=l[0]["Channel Name"],m=l[0].Language,g=l[0]["Num Records"],y=l[0]["Sort By"];if(this.GetPM()!==null){var b=e.one(n),w=e.one(r),E=e.one(i),S=e.one(s),x=e.one(o),T={};T.baseURL=c,T.widgetDir=h,T.css=p,T.setLocale=m,T.transport="jsonp",T.type="type";try{var N=new e.OracleKnowledge.OKUtility(T),C=(new e.Panel({srcNode:w,width:"50%",height:"90%",zIndex:10,modal:!0,visible:!1,close:!0})).render();C.set("align",{node:b,points:[e.WidgetPositionAlign.TC,e.WidgetPositionAlign.BC]});var k=(new e.OracleKnowledge.AnswerView({utility:N})).render(E);k.on("show",function(e){C.show(),k.get("closeButton").hide()});var L={};L.answerViewWidget=k,L.utility=N,L.type=d,L.channelReferenceKey=v,L.pageSize=g,L.sortBy=y;var A=(new e.OracleKnowledge.AnswerList(L)).render(x);this._Panel=C,this._HeadNode=b,this._DestoryObjArray.push(A),this._DestoryObjArray.push(k),this._DestoryObjArray.push(N)}catch(O){$(s).html("<p class='siebui-quick-applet-validation-error'>"+SiebelApp.S_App.LocaleObject.GetLocalString("IDS_OK_CONFIG")+"</p>")}}}var e=SiebelJS.Dependency("SiebelApp.Constants");return SiebelJS.Extend(t,SiebelAppFacade.PhysicalRenderer),t.prototype.ShowUI=function(){var e=this,t=this.GetPM().Get("GetRawRecordSet");if(t.length==0)return;var r=t[0]["Knowledge Management Url"],i=r+"/apps/infocenter/resources/js/OKWidgets/",s=$.data($("body")[0],"yuiObj");s?n.call(e,s):YUI({modules:{"oracle-knowledge/base":{fullpath:i+"okBaseWidget.js"},"oracle-knowledge/answer-view":{fullpath:i+"answerViewWidget.js"},"oracle-knowledge/ok-utility":{fullpath:i+"okUtility.js"},"oracle-knowledge/answer-list":{fullpath:i+"answerListWidget.js"},okLocale:{fullpath:i+"localeUtility.js"},"oracle-knowledge/search-widget":{fullpath:i+"searchWidget.js"},"oracle-knowledge/result-widget":{fullpath:i+"resultWidget.js"},"oracle-knowledge/facet-tree":{fullpath:i+"facetsWidget.js"}},combine:!1,filter:"RAW"}).use("node-event-simulate","panel","transition","oracle-knowledge/base","oracle-knowledge/ok-utility","okLocale","oracle-knowledge/answer-view","oracle-knowledge/answer-list","oracle-knowledge/search-widget","oracle-knowledge/result-widget","oracle-knowledge/facet-tree",function(t){$.data($("body")[0],"yuiObj")?(t.destroy(),t=null,n.call(e,$.data($("body")[0],"yuiObj"))):($.data($("body")[0],"yuiObj",t),n.call(e,t))}),SiebelAppFacade.OKListPRenderer.superclass.ShowUI.call(this)},t.prototype.EndLife=function(){for(var e=0;e<this._DestoryObjArray.length;e++)this._DestoryObjArray[e]!=null&&typeof this._DestoryObjArray[e]!="undefined"&&(this._DestoryObjArray[e].destroyWidget(),this._DestoryObjArray[e]=null);this._Panel&&(this._Panel.destroy(!0),this._Panel=null),this._HeadNode&&(this._HeadNode.destroy(!0),this._HeadNode=null);var t=this.GetPM().Get("GetFullId"),n="#"+t+"_header";$(n).remove(),SiebelAppFacade.OKListPRenderer.superclass.EndLife.call(this)},t}(),SiebelAppFacade.OKListPRenderer}));
