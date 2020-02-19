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
typeof SiebelAppFacade.MapPlusRenderer=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.MapPlusRenderer"),define("siebel/mapplusrenderer",[window.location.protocol+"//elocation.oracle.com/elocation/jslib/oracleelocation.js",window.location.protocol+"//elocation.oracle.com/mapviewer/fsmc/jslib/oraclemaps.js","siebel/phyrenderer","siebel/maprenderer"],function(){return SiebelAppFacade.MapPlusRenderer=function(){function S(e){SiebelAppFacade.MapPlusRenderer.superclass.constructor.call(this,e);var t;this.SetMapView=function(e){t=e},this.GetMapView=function(){return t}}function x(){var e=window.location.protocol+"//elocation.oracle.com/mapviewer",t=this.GetPM();this.SetMapView(new MVMapView(document.getElementById(t.Get("GetPlaceholder")),e)),this.GetMapView().addBaseMapLayer(new MVBaseMap("elocation_mercator.world_map"),T(this))}function T(){var e=20,t=0,n=1,r=arguments[0];r||(r=this);var i=MVSdoGeometry.createPoint(t,e,8307);r.GetMapView().setCenter(i),r.GetMapView().setZoomLevel(n),r.GetMapView().addNavigationPanel("EAST"),r.GetMapView().setLoadingIconVisible()}function N(e){var t=/^\s*lon lat:\s*-?((\d\d*\.\d*)|(\d\d*)|(\.\d\d*))\s*-?((\d\d*\.\d*)|(\d\d*)|(\.\d\d*))\s*$/;if(e&&t.test(e)){var n=e.indexOf("lon lat:");return e=e.substr(n+"lon/lat:".length).replace(/^\s+|\s+$/,""),n=e.indexOf(" "),{lon:e.substr(0,n),lat:e.substr(n)}}return e}function C(){v=new OracleELocation(window.location.protocol+"//elocation.oracle.com/elocation");var e=this;d={};var t=this.GetPM(),n=_.call(this),r=D.call(this),i=t.Get("GetRowsSelectedArray"),s=$("#"+t.Get("GetPlaceholder")),o="<span class='"+t.Get("SelectedRowImage")+"' />",u="<span class='"+t.Get("UnselectedrowImage")+"' />",a=t.Get("GetRawRecordSet"),e=this;g=n.length,f=n;var f=[];$.each(n,function(t,r){v.geocode(N(r),function(r,s){if(r.length==0)SiebelJS.Log("No address is found! "+s);else{var l=r[0];if(l.accuracy<1)SiebelJS.Log("No address is found! "+s);else{icon=i[t]===!0?o:u,selected=i[t]===!0?!0:!1,d[t]=l,M.call(e,l,t,icon,selected);var c=0,h=[],p="#333333",v=new Array;v.lon=d[t].x,v.lat=d[t].y,f[t]=v;if(t===n.length-1){for(var m=0;m<=t;m++)a[m]["Status"]!="Declined"&&(h[c]=f[m],c++);j.call(e,h,p)}}}})}),this.GetMapView().display()}function k(){this.GetMapView().removeAllFOIs(),d={}}function L(e,t){var n=d[e];g===1?n.accuracy==1?this.GetMapView().setCenterAndZoomLevel(t,15):this.GetMapView().setCenterAndZoomLevel(t,10):g<3?this.GetMapView().setCenterAndZoomLevel(t,12):g==3?n.accuracy==1?this.GetMapView().setCenterAndZoomLevel(t,13):this.GetMapView().setCenterAndZoomLevel(t,12):g==4?this.GetMapView().setCenterAndZoomLevel(t,7):g==5?this.GetMapView().setCenterAndZoomLevel(t,5):this.GetMapView().setCenterAndZoomLevel(t,6)}function A(e,t){$(this).hide();var n=e.data.ctx;if(t&&t.item)if(t.item.children().attr("tag")=="SelectRecord")U.call(n,m.id);else if(t.item.children().attr("tag")=="ViewDetails"){var r=I.call(n,m.id),i=F.call(n,m.id);$(n.GetPM().Get("ListDetail")).dialog("option","title",i).dialog("open")}return!0}function O(){var e=arguments[1].id;m=arguments[1],$("#"+p).show().position({my:"center top+15",at:"center bottom",of:$(m.node),collision:"flip flip"}),setTimeout(function(){$("#"+p).hide()},5e3)}function M(e,t,n,r){var i=this,s=i.GetPM(),o=MVSdoGeometry.createPoint(e.x,e.y,8307),u=MVFOI.createHTMLFOI(t.toString(),o,n);u.enableInfoWindow(!1),u.enableInfoTip(!0),u.enableEventPropagation(!0),this.GetMapView().enableInfoWindowEventPropagation(!0);var a=F.call(this,t);u.setInfoTip(a);var f=t;u.attachEventListener(MVEvent.MOUSE_CLICK,O),this.GetMapView().removeFOI(t.toString()),this.GetMapView().addFOI(u),r&&(L.call(i,t,u.geom),u.setZIndex(999),u.reDraw())}function _(){var t=this.GetPM(),n=t.Get("markerLocation"),r=t.Get("GetRawRecordSet"),i=[];if(!e.IsEmpty(n))for(var s=0,o=r.length;s<o;s++){var u=r[s][n];i.push(u)}return i}function D(){var t=this.GetPM(),n=t.Get("markerTitle"),r=t.Get("GetRawRecordSet"),i=[];if(!e.IsEmpty(n))for(var s=0,o=r.length;s<o;s++){var u=r[s][n];e.IsEmpty(u)||i.push(u)}return i}function P(e,t){}function H(e){return e?e.replace("'","\\'"):e}function B(e,t){var n="<font class=OraHeaderSubSub>";n+=e.streetLine&&e.streetLine!="null"&&e.streetLine.length>0?e.streetLine+"<BR>"+e.localityLine:e.localityLine,e.country!=undefined&&e.country!="undefined"&&(n+=", "+e.country);var r=H((e.streetLine&&e.streetLine!="null"&&e.streetLine.length>0?e.streetLine+", "+e.localityLine:e.localityLine)+", "+e.country);return n+="</font>",n}function j(e,t){var n=this,r=n.GetPM(),i=r.Get("GetPlaceholder"),s=$("#"+i),o;v=new OracleELocation(window.location.protocol+"//elocation.oracle.com/elocation");var u=new Array;u[0]=e;var a=t;v.getDirections(u,P,function(t,n,r,i,s,o){switch(t){case OracleELocation.ERROR_GEOCODE_FAILED:break;case OracleELocation.ERROR_ROUTE_ADDR_INVALID:break;case OracleELocation.ERROR_ROUTE_FAILED:$("#"+statusPanel).html(SiebelApp.S_App.LocaleObject.GetLocalString("IDS_SWE_ERROR_ROUTE_FAILED"));case OracleELocation.ERROR_ROUTE_NOT_FOUND:break;default:}},{ignoreGeocodeErrorsForBatchRequests:!1},{mapview:n.GetMapView(),zoomToFit:!0,removePreviousRoutes:!0,resultPanel:s.context.getElementById("directions"),drawMarkers:!0,getMarkerInfoStr:B,routeStyles:[[{render_style:{color:a,opacity:150,width:5},typeName:"Customer",label:"{time}. {distance}."}]]})}function F(e){var t=this.GetPM(),n=t.Get("markerTitle"),r=t.Get("GetRawRecordSet"),i=r[e][n];return i}function I(e){var t=this,n=$(t.GetPM().Get("ListDetail"));R.call(t,e),$("input",n).attr("readonly",!0)}function q(t,r){var i=r?r:0,s=this.GetPM(),o=t.GetName(),u=t.GetFieldName(),a=s.Get("IsInQueryMode"),f=s.Get("IsPure"),l=s.ExecuteMethod("IsPrivateField",o);if(!e.IsEmpty(u)||l||!f){var c="";if(a||l||!f)if(!a||!f)r===undefined||r===null?c=s.ExecuteMethod("GetFormattedFieldValue",t,!1):c=s.ExecuteMethod("GetFormattedFieldValue",t,!0,i);else{var h=s.Get("GetRecordSet");c=e.IsEmpty(h[i][u])?"":h[i][u]}else r===undefined||r===null?c=s.ExecuteMethod("GetFormattedFieldValue",t,!0):c=s
.ExecuteMethod("GetFormattedFieldValue",t,!0,i);(f||!f&&t.GetUIType()!==n)&&this.SetControlValue(t,c,0)}}function R(e){var t=this.GetPM(),n=t.Get("ListOfColumns"),r=n.length;for(var i=0;i<r;i++)q.call(this,n[i].control,e)}function U(e){var n=this.GetPM(),r=self;return Number(e)===Number(n.Get("GetSelection"))?!0:(SiebelApp.S_App.uiStatus.Busy({}),n.OnControlEvent(t.get("PHYEVENT_SELECT_ROW"),e,"","")?(SiebelApp.S_App.uiStatus.Free(),!0):(SiebelApp.S_App.uiStatus.Free(),!1))}function z(){$(this.GetPM().Get("ListDetail")).dialog({modal:!0,appendTo:"#s_"+this.GetPM().Get("GetFullId")+"_div",autoOpen:!1,title:"",close:function(){$(this).hide()}})}function W(e){return typeof e.GetInputName=="function"}var e=SiebelJS.Dependency("SiebelApp.Utils"),t=SiebelJS.Dependency("SiebelApp.Constants"),n=t.get("SWE_PST_BUTTON_CTRL"),r=t.get("SWE_CTRL_MVG"),i=t.get("SWE_CTRL_RADIO"),s=t.get("SWE_CTRL_CHECKBOX"),o=t.get("SWE_CTRL_CHART"),u=t.get("SWE_CTRL_PLAINTEXT"),a=t.get("SWE_CTRL_TEXT"),f=t.get("SWE_CTRL_RTCEMBEDDED"),l=t.get("SWE_CTRL_URL"),c=t.get("SWE_CTRL_MAILTO"),h=t.get("SWE_CTRL_IMAGECONTROL"),p="SiebelMap_Menu",d={},v,m={},g=0,y=[],b=0,w=new Array,E=new Array;return SiebelJS.Extend(S,SiebelAppFacade.PhysicalRenderer),S.prototype.Init=function(){var e=this;z.call(this),SiebelAppFacade.MapPlusRenderer.superclass.Init.call(e)},S.prototype.ShowSelection=function(e){var t=this.GetPM(),n=$("#"+t.Get("GetPlaceholder")),r=t.Get("GetRowsSelectedArray"),i="<span class='"+t.Get("SelectedRowImage")+"' />",s="<span class='"+t.Get("UnselectedrowImage")+"' />";if(!this.GetMapView())return;var o=this.GetMapView().getAllFOIs(),u=!1;if(o.length<1)return;SiebelApp.S_App.uiStatus.Busy({});for(var a=0,f=r.length;a<f;a++){var l=this.GetMapView().getFOI(a.toString());r[a]===!0?l&&(l.setHTMLElement(i,0,0),L.call(this,a,l.geom),l.setZIndex(999),l.reDraw(),u=!0):l&&(l.setHTMLElement(s,0,0),l.setZIndex(500),l.reDraw())}u||T.call(this),SiebelApp.S_App.uiStatus.Free({})},S.prototype.ShowUI=function(){SiebelAppFacade.MapPlusRenderer.superclass.ShowUI.call(this),z.call(this);var e=this.GetPM(),n=e.Get("GetPlaceholder"),r=$("#"+n),i=e.Get(t.get("SWE_VIS_MODE_LIST")),s=i?i.length:0,o=e.Get("GetFullId"),u="",a=e.Get("GetPlaceholder");if(s>0)for(var f=0;f<s;f++)$("#"+a+"_"+i[f]+"_btn").length>0&&(i[f]==="Map"&&($("#"+a+"_"+i[f]+"_btn").removeClass("siebui-ctrl-btn"),$("#"+a+"_"+i[f]+"_btn").removeClass("appletButtonDis")),i[f]==="Grid"&&$("#"+a+"_"+i[f]+"_btn").addClass("siebui-listbtn-fsmobile"));htmlmarkupstr="<div class = 'siebui-map' ><div style='width: 100%; height: 230%; position: absolute; top: -6px;left: -1px;' id = '"+n+"'></div></div>",r.replaceWith(htmlmarkupstr),x.call(this);var l=SiebelApp.S_App.LocaleObject.GetLocalString("IDS_SWE_MAP_MENU_SELECT_RECORD"),c=SiebelApp.S_App.LocaleObject.GetLocalString("IDS_SWE_MAP_MENU_DISPLAY_INFO"),h=" <ul id='"+p+"' style='z-index:99' ><li><a href='#' class='siebui-menu-details' tag='ViewDetails' >"+c+"</a></li><li><a href='#' class='siebui-menu-select' tag='SelectRecord' >"+l+"</a></li></ul>";$("#"+e.Get("GetPlaceholder")).append(h),$("#"+p).menu({}).css({position:"absolute",zIndex:99}).hide().bind("menuselect",{ctx:this},A)},S.prototype.BindData=function(e){var t=this.GetPM(),n=$("#"+t.Get("GetPlaceholder")),r=t.Get("IsInQueryMode");e&&(k.call(this),T.call(this));if(r){this.GetMapView().display();return}C.call(this)},S.prototype.EndLife=function(){var e=this.GetPM(),t=$("#"+e.Get("GetPlaceholder"));k.call(this),delete this.GetMapView(),delete v,delete d,SiebelAppFacade.MapPlusRenderer.superclass.EndLife.call(this)},S}(),SiebelAppFacade.MapPlusRenderer}));