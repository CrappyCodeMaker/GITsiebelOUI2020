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
typeof SiebelAppFacade.SalesPipeLineRenderer=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.SalesPipeLineRenderer"),define("siebel/salespipelinerenderer",["siebel/phyrenderer","3rdParty/jsplot/plugins/jqplot.funnelRenderer.js","3rdParty/funnelrenderer-ext.js"],function(){return SiebelAppFacade.SalesPipeLineRenderer=function(){function f(e){SiebelAppFacade.SalesPipeLineRenderer.superclass.constructor.apply(this,arguments)}function l(){var e=[[]],t=this.GetPM(),n=this.GetPM().Get("GetFullId"),a=$("#"+n+"salespipeline").height(),f=$("#"+n+"salespipeline").width(),l,c,h=[],p=[],d=[],v=f-20,m=a-48;h[0]=v-r-s;var g=m-i-o,y=h[0]*u,b=g/2*(h[0]+y),w=Math.atan((h[0]-y)/2/g),E,S,x,T=0,N=1e-4,C=t.ExecuteMethod("GetChartData","NumOfCategories");d=t.ExecuteMethod("GetChartData","CategoryName");for(var k=0;k<C;k++){l=g/C,E=l*h[k],S=999999,p[k]=E,x=0;while(S>p[k]*N&&x<100)p[k]=l*(h[k]-l*Math.tan(w)),S=Math.abs(p[k]-E),h[k+1]=h[k]-2*l*Math.tan(w),E=p[k],c=p[k]*100/b,x++;e[k]=[],e[k][0]=d[k],e[k][1]=c}return e}var e=SiebelJS.Dependency("SiebelApp.Constants"),t=e.get("CHART_FUNNEL_DEF_METHOD"),n=e.get("CHART_FUNNEL_DATA_METHOD"),r=20,i=20,s=20,o=20,u=.2,a=null;return SiebelJS.Extend(f,SiebelAppFacade.PhysicalRenderer),f.prototype.Init=function(){SiebelAppFacade.SalesPipeLineRenderer.superclass.Init.apply(this,arguments),this.AttachPMBinding("RefreshChart",function(){})},f.prototype.ShowUI=function(){SiebelAppFacade.SalesPipeLineRenderer.superclass.ShowUI.apply(this,arguments);var e=CCFMiscUtil_CreatePropSet();SiebelJS.Log("Invoking FunnelChartDefn"),this.GetPM().ExecuteMethod("NotifyServer",t,e),SiebelJS.Log("Invoking ChartData"),this.GetPM().ExecuteMethod("NotifyServer",n,e);var r=this.GetPM(),i=[],s=[],o=[],f=[],c=[],h=[],p=[],d=[],v=[],m=[];if(r.Get("RefreshChart")){var g=r.ExecuteMethod("GetChartData","FunctionName");i=r.ExecuteMethod("GetChartData","CategoryColours"),s=r.ExecuteMethod("GetChartData","CategoryPercent"),o=r.ExecuteMethod("GetChartData","CategoryName");var y=r.ExecuteMethod("GetChartData","AppTitle"),b=r.ExecuteMethod("GetChartData","OutOfString");c=r.ExecuteMethod("GetChartData","Revenue"),p=r.ExecuteMethod("GetChartData","Quota"),v=r.ExecuteMethod("GetChartData","LegendColors"),m=r.ExecuteMethod("GetChartData","LegendText");var w=l.call(this),E=this.GetPM().Get("GetFullId"),S=E+"salespipeline";$("#"+E).find(".siebui-funnel-chart").attr("id",S),$.jqplot.config.enablePlugins=!0,a=$.jqplot(S,[w],{title:g,seriesColors:i,axesDefaults:{drawBaseline:!1,tickOptions:{showGridline:!1,showLabel:!1},rendererOptions:{drawBaseline:!1}},seriesDefaults:{renderer:$.jqplot.FunnelRenderer,rendererOptions:{sectionMargin:10,widthRatio:u,dataLabels:"value",showDataLabels:!0,dataLabelThreshold:3,fill:!0,varyFunnelColor:!1,highlightMouseOver:!1}},grid:{drawGridLines:!1,background:"white",borderColor:"white",borderWidth:0,shadow:!1}});var x=$("#"+S+" "+"span");for(var T=0,N=x.length;T<N;T++)x.eq(T).html(Math.floor(s[T])+"%");elem=$("#"+S+" "+"canvas.jqplot-event-canvas");var C=a.series[0],k,L,A;N=0;for(T=0,N=o.length;T<N;T++)k="",f=C._vertices[T],L=f[0][0]-C.canvas._offsets.left,A=f[1][1]+C.canvas._offsets.right+16,L=Math.round(L),A=Math.round(A),k=o[T].substring(0,3),SiebelApp.S_App.GetDirection()=="rtl"?$('<span class="siebui-funnel-category siebui-funnel-label" style="position:absolute; right:'+L+"px; top: "+A+'px;">'+k+"</span>").insertBefore(elem):$('<span class="siebui-funnel-category siebui-funnel-label" style="position:absolute; left:'+L+"px; top: "+A+'px;">'+k+"</span>").insertBefore(elem);$('<div class="siebui-legend"></div>').insertBefore(elem),$("#"+S).bind("jqplotMouseMove",myHandleMove),$("#"+S).bind("jqplotDataMouseOver",function(e,t,n,r){c[n]=Math.floor(parseFloat(c[n])*100)/100,h[n]=c[n],c[n]!==0&&(h[n]=SiebelApp.S_App.LocaleObject.StringToFormatted("number",c[n],"")),d[n]=SiebelApp.S_App.LocaleObject.StringToFormatted("number",p[n],""),$("#s_S_A2_div").attr("title",y+":"+o[n]+"\n"+g+":"+Math.floor(s[n])+"\n("+h[n]+" "+b+" "+d[n]+")")}),$("#"+S).bind("jqplotDataUnhighlight",function(e){$("#s_S_A2_div").attr("title"," ")}),$.each(v,function(e,t){$("#"+E).find(".siebui-legend").append('<br><div><div style="display: inline;background-color:'+v[e]+';">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>&nbsp;<div style="display: inline;">'+m[e]+"</div></div>")})}},f.prototype.EndLife=function(){var e=this.GetPM().Get("GetFullId"),t=e+"salespipeline";a!==null&&($("#"+t).remove(),$(".siebui-legend").children().remove(),$(".siebui-legend").remove(),a.destroy()),SiebelAppFacade.SalesPipeLineRenderer.superclass.EndLife.call(this)},f}(),SiebelAppFacade.SalesPipeLineRenderer}));
