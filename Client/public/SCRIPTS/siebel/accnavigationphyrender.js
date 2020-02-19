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
typeof SiebelAppFacade.AccNavigationPhyRenderer=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.AccNavigationPhyRenderer"),define("siebel/accnavigationphyrender",["siebel/basephyrenderer"],function(){return SiebelAppFacade.AccNavigationPhyRenderer=function(){function o(e){SiebelAppFacade.AccNavigationPhyRenderer.superclass.constructor.call(this,e);var t={};this._getLast=function(e){return t[e]},this._setCurrent=function(e,n){t[e]=n}}function u(){return this.GetPM().Get("GetType")===e.get("SWE_PROP_NC_ID_SCREEN_CONTROL")}function a(){return s===null&&(s=!!SiebelAppFacade.HBNavPlugin&&$("html").hasClass("siebui-navigation-side")),s}function f(e,t){var n=a.call(this)?"siebui-nav-hb":"siebui-nav-tab",r=$("div#"+e+"."+n);if(t&&r.length===0){r=$("div#"+e);if(r.length){r=r.eq(0);var i=(r.attr("class")||"").split(" ");for(var s=0,o=i.length;s<o;s++)i[s].indexOf("siebui-nav-")===0&&i[s]!==n&&r.removeClass(i[s]);r.addClass(n)}}else r.length&&(r=r.eq(0));return r}function l(e){$("#s_sctrl_tabView").toggleClass("siebui-open"),$(".siebui-open").length?$("#s_sctrl_tabView").height($("#_sweview").height()):$("#s_sctrl_tabView").height(46)}function c(e){var t,n,r,i=$("#s_sctrl_tabScreen"),s=i.scrollLeft(),o=i.width();($(e.target).attr("id")||"").indexOf("left")>-1?(r=s<=o?s:o,i.animate({scrollLeft:s-r},500),s-r===0&&$("#sui-left-scroll").addClass("siebui-tile-scroll-d"),$("#sui-right-scroll").removeClass("siebui-tile-scroll-d"),$("#sui-right-scroll").addClass("siebui-tile-right-scroll")):($(e.target).attr("id")||"").indexOf("right")>-1&&(t=$(".siebui-nav-tabScreen ul").width(),n=t-(s+o),r=n<=o?n:o,i.animate({scrollLeft:s+r},500),s+r+o===t&&$("#sui-right-scroll").addClass("siebui-tile-scroll-d"),$("#sui-left-scroll").removeClass("siebui-tile-scroll-d"),$("#sui-left-scroll").addClass("siebui-tile-left-scroll"))}function h(e){var n=$(this),i=n.attr("data-tabindex"),s=e.data.ctx.GetPM(),o=s.Get("GetTabInfo");if(o[i]){var a="viewName";u.call(e.data.ctx)?(a="defaultViewName",o[i].level=t):o[i].level=r;var f=o[i][a];f&&(s.OnControlEvent("OnClick",o[i])||$("#"+s.Get("placeholder")+"_tabScreen").tabs("active",Number(s.Get("GetSelectedTabKey").replace("tabScreen",""))||0))}}function p(e){var t=$(this),r=t.attr("data-tabindex"),s=e.data.ctx.GetPM(),o=s.Get("GetSelectedTabLinkInfo");u.call(e.data.ctx)?o[r].level=n:o[r].level=i;if(o[r]){var a="viewName",f=o[r][a];f&&(s.OnControlEvent("OnClick",o[r])||$("#"+s.Get("LevelPlaceholder")+"_tabView").tabs("active",Number(s.Get("GetSelectedLinkKey").replace("tabView",""))||0))}}function d(s){if(s.type!=="keypress"||s.which===$.ui.keyCode.ENTER){var o=s.data.ctx.GetPM(),u=o.Get("placeholder"),a=$(this).attr("id"),f=$(this).val(),l={},c=o.Get("GetType");if(f){if(a==="j_"+u+"_tabScreen")l=o.Get("GetTabInfo"),c===e.get("SWE_PROP_NC_ID_SCREEN_CONTROL")?l[f].level=t:l[f].level=r;else{if(a!=="j_"+o.Get("LevelPlaceholder")+"_tabView")return;l=o.Get("GetSelectedTabLinkInfo"),c===e.get("SWE_PROP_NC_ID_SCREEN_CONTROL")?l[f].level=n:l[f].level=i}if($(this).data("NavLinkChange")===l[f])return;var h=l[f]||{},p=h.defaultViewName||h.viewName;if(p){$(this).data("NavLinkChange",l[f]),o.OnControlEvent("OnClick",l[f]);var d=this;setTimeout(function(){$(d).removeData("NavLinkChange"),d=null},1)}}}}function v(e,t,n,r,i){var s=this.GetPM(),o,l=SiebelApp.S_App.LocaleObject,c=!1,h=e+"_"+t,p=null,d=E.call(this,e,t,n,r),v=null,x=SiebelApp.S_App.GetNavLevel()||[],T=null,N="",C,k=Number((r||"").replace(t,""));if(!i&&!SiebelApp.Utils.IsTrue(SiebelApp.S_App.IsSui())){var L=$("#"+h),A=L.find(".ui-state-default"),O=L.find("li.siebui-active-navtab").eq(0);if(u.call(this)&&d&&d===this._getLast(t)&&n[r]&&O.text()===n[r].captionName)return k=k>=A.length?A.length-1:k,L.tabs("option","active")!==k&&(O.removeClass("siebui-active-navtab").removeAttr("aria-label"),L.data("refreshActivate",!0),L.tabs("option","active",k),L.removeData("refreshActivate"),L.find("li").eq(k).addClass("siebui-active-navtab").attr("aria-label",function(){return $(this).text()+" "+SiebelApp.S_App.LocaleObject.GetLocalString("IDS_SWE_CKEDITOR_SELECTED")}),a.call(this)&&y.call(this,h,n,t,o)),L=A=O=null,c;L=A=O=null}this._setCurrent(t,d),p=f.call(this,e),v=p.children("#"+h),v.remove(),v=null;if(d){SiebelApp.Utils.IsTrue(SiebelApp.S_App.IsSui())&&$("#sui-left-scroll").length===0&&p.append("<div id='sui-left-scroll' class='siebui-nav-scroll'></div>"),p.append("<div class='siebui-nav-tabs siebui-nav-"+t+"' id="+h+">"+d+"</div>"),SiebelApp.Utils.IsTrue(SiebelApp.S_App.IsSui())&&$("#sui-right-scroll").length===0&&p.append("<div id='sui-right-scroll' class='siebui-nav-scroll'></div>"),$("#"+h).find("ol,ul").eq(0).bind("keydown",{ctx:this},b).end().end().tabs({active:r===undefined?!1:Number((r||"").replace(t,"")),collapsible:!0,create:w,beforeActivate:function(e,t){return!!$(this).data("refreshActivate")}}).find("li").eq(Number((r||"").replace(t,""))).addClass("siebui-active-navtab").attr("aria-label",function(){return $(this).text()+" "+SiebelApp.S_App.LocaleObject.GetLocalString("IDS_SWE_CKEDITOR_SELECTED")}),u.call(this)?o=t==="tabScreen"?l.GetLocalString("IDS_SWE_FIRST_LEVEL_VIEW_BAR_TITLE"):l.GetLocalString("IDS_SWE_SECOND_LEVEL_VIEW_BAR_TITLE"):o=t==="tabScreen"?l.GetLocalString("IDS_SWE_THIRD_LEVEL_VIEW_BAR_TITLE"):l.GetLocalString("IDS_SWE_FOURTH_LEVEL_VIEW_BAR_TITLE"),T=u.call(this)?t==="tabScreen"?"1":"2":t==="tabScreen"?"3":"4",C=window.matchMedia("(orientation: landscape)");if(x.indexOf(T)!==-1&&C.matches)switch(parseInt(T)){case 1:N="s_sctrl_tabScreen";break;case 2:N="s_sctrl_tabView";break;case 3:N="s_vctrl_div_tabScreen";break;case 4:N="s_vctrl_div_tabView"}SiebelApp.Utils.IsTrue(SiebelApp.S_App.IsSui())?(m.call(this,i),!u.call(this)&&N!==h&&S.call(this,h,t,n,r)):!a.call(this)&&N!==h&&S.call(this,h,t,n,r),a.call(this)&&g.call(this,h,n,t,o),d=null,c=!0}else t=="tabView"&&p.append("<div class='siebui-nav-tabs siebui-empty-tabs siebui-nav-"+t+"' id="+h+"></div>");return c}function m(e){var t,n,r=0,i=0,s,o=$("#s_sctrl_tabScreen"),u=o.scrollLeft
();n=o.children("ul").children("li");for(var a=0,r=n.length;a<r;a++)i+=n.eq(a).width();$(".siebui-landing").length&&$(".siebui-toolbar-settings-popup").width($("#_svf0").width()-10),$(".siebui-landing").length===0&&e&&o.children("ul").width(i),viewport=o.width(),u>0?($("#sui-left-scroll").removeClass("siebui-tile-scroll-d"),$("#sui-left-scroll").addClass("siebui-tile-left-scroll")):$("#sui-left-scroll").addClass("siebui-tile-scroll-d"),t=i-(u+viewport),t>0?($("#sui-right-scroll").removeClass("siebui-tile-scroll-d"),$("#sui-right-scroll").addClass("siebui-tile-right-scroll")):$("#sui-right-scroll").addClass("siebui-tile-scroll-d")}function g(e,t,n,r){var i=this.GetPM();i.Get("HB-"+e)||i.SetProperty("HB-"+e,new SiebelAppFacade.HBNavPlugin({id:e}));var s=SiebelApp.S_App.GetNavLevel()||[],o=null;o=u.call(this)?n==="tabScreen"?"1":"2":n==="tabScreen"?"3":"4",i.Get("HB-"+e).Manage(s.indexOf(o)!==-1,r)}function y(e,t,n,r){var i=this.GetPM();if(!i.Get("HB-"+e))return;i.Get("HB-"+e).Refresh()}function b(e){$(e.target).is("li")&&e.which===$.ui.keyCode.ENTER&&$(document.activeElement.firstChild).trigger("click")}function w(e,t){$(t.panel).hide()}function E(e,t,n,r){var i="",s=e+"_"+t+"_noop",o=SiebelApp.S_App.GetDirection(),a,f=0;for(var l in n)n.hasOwnProperty(l)&&(i+="<li ",o&&(i+=" class='siebui-rtl-element-right' "),i+="><a data-tabindex='"+l+"' href='#"+s+"'",u.call(this)&&(f=t==="tabScreen"?1:2),SiebelApp.Utils.IsTrue(SiebelApp.S_App.IsSui())&&f===1?i+=" title='"+String(n[l].captionName)+"' >":i+=" >",currentTabBmpHtmlAttrib=n[l].tabBmpHTMLAttrib,currentTabBmpHtmlAttrib?i+="<span "+currentTabBmpHtmlAttrib+">"+"</span>":(a=n[l].tabIcon,a&&f===1?i+=utils.GetSpanTag(a,"screentab_icon")+"<img src='"+a+"'/></span>":f===1?i+=utils.GetSpanTag("screentab_icon")+"</span>":a&&(i+=utils.GetSpanTag(a)+"<img src='"+a+"'/></span>")),i+=String(n[l].captionName)+"</a></li>");return i!==""&&(i="<ul>"+i+"</ul>",i+='<div class="siebui-invisible-el siebui-nav-'+t+'"  id="'+s+'" ></div>'),i}function S(e,t,n,r){var i=this.GetPM(),s=$("#"+e),o=Number((r||"").replace(t,""))||0,a=Number(s.outerWidth()),f=25,l=s.children("ul").children("li");f+=l.eq(o).outerWidth();var c=0,h=SiebelApp.Utils.IsTrue(SiebelApp.S_App.IsMobileApplication());for(var p=0,d=l.length;p<d;p++)if(p!==o){f+=l.eq(p).outerWidth();if(f>a){c=p-1;break}}if((h||c!==0)&&c<l.length){var v=SiebelApp.S_App.LocaleObject,m="";u.call(this)?m=t==="tabScreen"?v.GetLocalString("IDS_SWE_FIRST_LEVEL_VIEW_BAR_TITLE"):v.GetLocalString("IDS_SWE_SECOND_LEVEL_VIEW_BAR_TITLE"):m=t==="tabScreen"?v.GetLocalString("IDS_SWE_THIRD_LEVEL_VIEW_BAR_TITLE"):v.GetLocalString("IDS_SWE_FOURTH_LEVEL_VIEW_BAR_TITLE");var g="<span></span><li><select class='siebui-nav-links "+(i.Get("IsScreen")?"siebui-nav-screenlist":"siebui-nav-viewlist")+"' "+" id='j_"+e+"' role='combo' aria-atomic='true' aria-label='"+m+"' ><option value='' hidden> </option>",y=0,b=0;h||(b=c+1);var w;while(n[t+b])b!==o&&(g+="<option value='"+(t+b)+"'>"+n[t+b].captionName+"</option>",w=s.children("ul").children("li").eq(b-y),w.remove(),w=null,y++),b++;g+="</select></li>",s.tabs("refresh"),s.children("ul").append(g),s.children("ul").children("li").last().eq(0).addClass(SiebelApp.S_App.GetDirection()?"siebui-rtl-element-right":""),x.call(this,"select#j_"+e)}}function x(e){if(!!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase())){var t=$(e).outerWidth();$(e).wrap("<span style='width:"+t+"px; overflow:hidden; float:right;'/>").width("auto").css({position:"relative",left:"-"+($(e).outerWidth()-t)+"px"})}}function T(){var e=this.GetPM(),t=e.Get("placeholder"),n=t+"_tabScreen",r=e.Get("LevelPlaceholder")+"_tabView",i=$("#"+n),s=$("#"+r),o=SiebelApp.S_App.LocaleObject;u.call(this)?(i.attr({role:"navigation",title:o.GetLocalString("IDS_SWE_FIRST_LEVEL_VIEW_BAR_TITLE")}).children("ul").eq(0).attr("aria-live","off"),s.attr({role:"navigation",title:o.GetLocalString("IDS_SWE_SECOND_LEVEL_VIEW_BAR_TITLE")}).children("ul").eq(0).attr("aria-live","off")):(i.attr({role:"navigation",title:o.GetLocalString("IDS_SWE_THIRD_LEVEL_VIEW_BAR_TITLE")}).children("ul").eq(0).attr("aria-live","off"),s.attr({role:"navigation",title:o.GetLocalString("IDS_SWE_FOURTH_LEVEL_VIEW_BAR_TITLE")}).children("ul").eq(0).attr("aria-live","off"))}function N(t,n,r,i){var s=e.get("SWE_PROP_QTP_OT"),o=e.get("SWE_PROP_QTP_RN"),u=e.get("SWE_PROP_QTP_UN");r&&typeof r.GetProperty=="function"&&t.children("ul").attr("ot",r.GetProperty(s)).attr("rn",r.GetProperty(o)).attr("un",r.GetProperty(u));if(!i)return;var a=t.children("ul").children("li"),f=a.children("select").length,l=f?a.length-1:a.length;for(var c=0;c<l-1;c++)i[c]&&typeof i[c].GetProperty=="function"&&a.eq(c).attr("ot",i[c].GetProperty(s)).attr("rn",i[c].GetProperty(o)).attr("un",i[c].GetProperty(u));var h=c,p=n==="tabScreen"?this.GetPM().Get("GetSelectedTabKey"):this.GetPM().Get("GetSelectedLinkKey");if(p){var d=parseInt(p.substring(n.length));d&&(h=d<c?c:d)}i[h]&&typeof i[h].GetProperty=="function"&&a.eq(c).attr("ot",i[h].GetProperty(s)).attr("rn",i[h].GetProperty(o)).attr("un",i[h].GetProperty(u))}function C(t,n,r,i){var s=e.get("SWE_PROP_QTP_OT"),o=e.get("SWE_PROP_QTP_RN"),u=e.get("SWE_PROP_QTP_UN");n&&typeof n.GetProperty=="function"&&t.attr("ot",n.GetProperty(s)).attr("rn",n.GetProperty(o)).attr("un",n.GetProperty(u));var a=t.children("option");for(var f=0;f<a.length;f++){var l=Number((a.eq(f).val()||"").replace(i,""));l&&r[l]&&typeof r[l].GetProperty=="function"&&a.eq(f).attr("ot",r[l].GetProperty(s)).attr("rn",r[l].GetProperty(o)).attr("un",r[l].GetProperty(u))}}function k(){var e=this.GetPM(),t=e.Get("GetTabContainerQTPInfo"),n=e.Get("GetTabItemsQTPInfo"),r=e.Get("GetTabViewLinkContainerQTPInfo"),i=e.Get("GetTabViewLinkItemsQTPInfo"),s=e.Get("placeholder")+"_tabScreen",o=e.Get("LevelPlaceholder")+"_tabView";N.call(this,$("#"+s),"tabScreen",t,n),N.call(this,$("#"+o),"tabView",r,i),C.call(this,$("#j_"+s),e.Get("GetJumpTabQTPInfo"),n,"tabScreen"),C.call(this,$("#j_"+o),e.Get("GetJumpTabQTPInfo"),i,"tabView"
)}function L(n){var i=e.get("SWE_PROP_NC_ID_SCREEN_CONTROL"),s=e.get("SWE_PROP_NC_ID_VIEW_CONTROL"),o=null;switch(n){case t:u.call(this)&&(o=f.call(this,i),a.call(this)&&o.find(".siebui-nav-hb-btn").click(),o.find(" ul  li ").tabs().eq(0).focus());break;case r:u.call(this)||(o=f.call(this,s),a.call(this)&&o.find(".siebui-nav-hb-btn").click(),o.find(" ul  li ").tabs().eq(0).focus())}}function A(){var e=this.GetPM(),t=e.Get("placeholder"),n=e.Get("LevelPlaceholder"),r=e.Get("SubPlaceholder");if(n){var i=f.call(this,n);i.length!==0&&(i.empty(),i.removeClass("siebui-subview-screennavs"))}f.call(this,r,a.call(this)||!u.call(this)).length!==0&&(t=r||t,el=f.call(this,r),el.hasClass("siebui-subview-screennavs")||el.addClass("siebui-subview-screennavs")),e.SetProperty("LevelPlaceholder",t),O.call(this)}function O(){var e=this.GetPM(),t=e.Get("placeholder"),n=e.Get("LevelPlaceholder"),r=f.call(this,t),i=f.call(this,n);t!==n&&i.undelegate(".AccNavBar"),i.delegate("#"+n+"_tabView a","click.AccNavBar",{ctx:this},p),i.delegate("#s_sctrl_tabView_noop","click.AccNavBar",{ctx:this},l),$($.unique($("#"+t+", #"+n).get())).delegate("select.siebui-nav-links","click.AccNavBar keypress.AccNavBar blur.AccNavBar",{ctx:this},d).delegate("select.siebui-nav-links","focus.AccNavBar keyup.AccNavBar",function(e){if(e.type==="keyup"&&e.keyCode===$.ui.keyCode.ESCAPE||e.type!=="keyup")$(this)[0].selectedIndex=0})}var e=SiebelJS.Dependency("SiebelApp.Constants"),t=e.get("SWE_SCREEN_NAV_CONTROL_STR"),n=e.get("SWE_AGGR_VIEW_NAV_CONTROL_STR"),r=e.get("SWE_DET_VIEW_NAV_CONTROL_STR"),i=e.get("SWE_DET_SUB_VIEW_NAV_CONTROL_STR"),s=null;return SiebelJS.Extend(o,SiebelAppFacade.BasePR),o.prototype.Init=function(){SiebelAppFacade.AccNavigationPhyRenderer.superclass.Init.call(this),u.call(this)&&this.AttachPMBinding("Refresh",this.BindData),this.GetPM().AttachPMBinding("FocusNavLink",L,{scope:this}),SiebelApp.S_App.IsRwd()&&this.AttachPMBinding("SubPlaceholder",A,{scope:this})},o.prototype.ShowUI=function(){SiebelAppFacade.AccNavigationPhyRenderer.superclass.ShowUI.call(this);var e=this.GetPM(),t=e.Get("placeholder"),n=f.call(this,t,!0),r=u.call(this)?"siebui-view-navs":"siebui-subview-navs";n.hasClass(r)||n.addClass(r);var i=e.Get("SubPlaceholder");i&&f.call(this,i,a.call(this)||!u.call(this)).length!==0&&(t=i,n=f.call(this,i),n.hasClass("siebui-subview-screennavs")||n.addClass("siebui-subview-screennavs")),e.SetProperty("LevelPlaceholder",t)},o.prototype.BindEvents=function(){SiebelAppFacade.AccNavigationPhyRenderer.superclass.BindEvents.call(this);var e=this.GetPM(),t=e.Get("placeholder"),n=f.call(this,t);n.undelegate(".AccNavBar"),n.delegate("#"+t+"_tabScreen a","click.AccNavBar",{ctx:this},h),n.delegate(".siebui-nav-scroll","click.AccNavBar",{ctx:this},c),O.call(this),a.call(this)||$(window).unbind("resize."+e.GetPMName()).bind("resize."+e.GetPMName(),{ctx:this},function(e){e.data.ctx.BindData(!0,!0)})},o.prototype.BindData=function(e,t){SiebelAppFacade.AccNavigationPhyRenderer.superclass.BindData.call(this),t=t||!1;var n=this.GetPM();if(n.Get("GetDataReload")===!0||e){var r=n.Get("placeholder"),i=n.Get("LevelPlaceholder"),s=f.call(this,r);if(s.length===0)return;v.call(this,r,"tabScreen",n.Get("GetTabInfo"),n.Get("GetSelectedTabKey"),t),v.call(this,n.Get("LevelPlaceholder"),"tabView",n.Get("GetSelectedTabLinkInfo"),n.Get("GetSelectedLinkKey"),t),T.call(this),k.call(this)}},o}(),"SiebelAppFacade.AccNavigationPhyRenderer"}));
