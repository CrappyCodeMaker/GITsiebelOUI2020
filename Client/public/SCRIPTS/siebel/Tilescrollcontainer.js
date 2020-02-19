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
typeof SiebelAppFacade.Tilescrollcontainer=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.Tilescrollcontainer"),define("siebel/Tilescrollcontainer",["siebel/TileLayoutPR"],function(){return SiebelAppFacade.Tilescrollcontainer=function(){function i(e){var t;this.SetScrollcontainer=function(e){t=e},this.GetScrollcontainer=function(){return t};var n=0;this.SetContainerWidth=function(e){n=e},this.GetContainerWidth=function(){return n};var r=0;this.SetTileWidth=function(e){r=e},this.GetTileWidth=function(){return r};var i=0;this.SetContainerHeight=function(e){i=e},this.GetContainerHeight=function(){return i};var s=0;this.SetTileHeight=function(e){s=e},this.GetTileHeight=function(){return s},SiebelAppFacade.Tilescrollcontainer.superclass.constructor.call(this,e)}function s(t,i,s,o,u,a,f){var l=!1,c=this.GetPM(),h=0,p=0,d=0,v,m;$("#"+c.Get("GetFullId")+"_"+e.get("SWE_TILE_CONTAINER")).find(t).bind("mousedown",{ctx:this},function(o){function g(i,m){f==="marginLeft"?(h=o.data.ctx.GetContainerWidth(),u===n?(p=i.css(a),v=parseInt(p,10)>=0):(p=-parseInt(i.css(a),10)+o.data.ctx.GetTileWidth(),v=p>=h)):(p=i.scrollTop(),d=o.data.ctx.GetContainerHeight(),u===n?v=p<=0:v=p>=d);if(v){l=!1;var y=c.ExecuteMethod("CanInvokeScrollMethod",s);y||$("#s_"+o.data.ctx.GetPM().Get("GetFullId")+"_div").find(t).addClass("siebui-tile-scroll-d"),c.OnControlEvent(e.get("PHYEVENT_VSCROLL_LIST"),u)}else{var b={};b[f]=m;var w=this;i.animate(b,10,function(){if(f!=="marginLeft"&&u===r&&p===i.scrollTop()){$("#"+c.Get("GetFullId")+"_"+e.get("SWE_TILE_CONTAINER")).find(t).addClass("siebui-tile-scroll-d");return}l&&g(i,m)})}}l=!0;if($(this).hasClass("siebui-tile-scroll-d"))return;o.data.ctx.EnableScrollArrow($("#"+c.Get("GetFullId")+"_"+e.get("SWE_TILE_CONTAINER")).find(i));switch(u){case r:m=f==="marginLeft"?"-":"+";break;case n:m=f==="marginLeft"?"+":"-"}g(o.data.ctx.GetContainer().children("div.siebui-tile-list"),m+"="+c.Get("Default Tile Scroll Speed")+"px")}),$("#"+c.Get("GetFullId")+"_"+e.get("SWE_TILE_CONTAINER")).find(t).bind("mouseup",{ctx:this},function(e){l=!1})}function o(){var t=this.GetPM(),n=this.GetVisibleTileScrollType();if(n&&n.toLowerCase()==="scrollvisibletiles"){var r=$("#"+t.Get("GetFullId")+"_"+e.get("SWE_TILE_CONTAINER"));r.data("Scroll_Index",0),r.find("#tile-left-scroll").bind("click",{ctx:this,horizontal:!0},function(e){var t=this;f.call(e.data.ctx,e.data.ctx.GetContainer(),function(){a.call(t,e),t=null})}).end().find("#tile-right-scroll").bind("click",{ctx:this,horizontal:!0},function(e){var t=this;f.call(this,e.data.ctx.GetContainer(),function(){u.call(t,e),t=null})}),r.find("#tile-up-scroll").bind("click",{ctx:this,horizontal:!1},function(e){var t=this;f.call(e.data.ctx,e.data.ctx.GetContainer(),function(){a.call(t,e),t=null})}).end().find("#tile-down-scroll").bind("click",{ctx:this,horizontal:!1},function(e){var t=this;f.call(this,e.data.ctx.GetContainer(),function(){u.call(t,e),t=null})})}}function u(n){if($(this).hasClass("siebui-tile-scroll-d")){l.call(n.data.ctx,n.data.ctx.GetContainer());return}var i=n.data.ctx,s=n.data.horizontal,o=s?"#tile-left-scroll":"#tile-up-scroll";i.EnableScrollArrow(i.GetContainer().find(o));var u=null,a=i.GetPM().Get("GetRecordSet").length,f=i.GetContainer().data("Scroll_Index");s?u=parseInt((i.GetContainer().width()||$("#s_"+i.GetPM().Get("GetFullId")+"_div").width())/i.GetTileWidth(),10):u=parseInt(i.GetContainerHeight()/i.GetTileHeight(),10),f+2*u>a&&i.GetPM().ExecuteMethod("CanInvokeScrollMethod","ScrollNextData")&&(i.GetPM().OnControlEvent(e.get("PHYEVENT_VSCROLL_LIST"),r),f=i.GetContainer().data("Scroll_Index")),f+2*u>a&&(f-=f+2*u-a),f+=u,f+u>=a&&!i.GetPM().ExecuteMethod("CanInvokeScrollMethod","ScrollNextData")&&$(this).addClass("siebui-tile-scroll-d"),i.GetContainer().data("Scroll_Index",f);var c={};s?c.marginLeft="-"+f*i.GetTileWidth()+"px":c.scrollTop=f*i.GetTileHeight()+"px",i.GetContainer().children("div.siebui-tile-list").animate(c,{duration:2e3,easing:t,complete:function(){l.call(i,i.GetContainer())}})}function a(r){if($(this).hasClass("siebui-tile-scroll-d")){l.call(r.data.ctx,r.data.ctx.GetContainer());return}var i=r.data.ctx,s=r.data.horizontal,o=s?"#tile-right-scroll":"#tile-down-scroll";i.EnableScrollArrow(i.GetContainer().find(o));var u=null,a=i.GetContainer().data("Scroll_Index");s?u=parseInt((i.GetContainer().width()||$("#s_"+i.GetPM().Get("GetFullId")+"_div").width())/i.GetTileWidth(),10):u=parseInt(i.GetContainerHeight()/i.GetTileHeight(),10),a-u<0&&i.GetPM().ExecuteMethod("CanInvokeScrollMethod","ScrollPrevData")&&(i.GetPM().OnControlEvent(e.get("PHYEVENT_VSCROLL_LIST"),n),a=i.GetContainer().data("Scroll_Index")),a-u<0&&(a-=a-u),a-=u,a==0&&!i.GetPM().ExecuteMethod("CanInvokeScrollMethod","ScrollPrevData")&&$(this).addClass("siebui-tile-scroll-d"),i.GetContainer().data("Scroll_Index",a);var f={};s?f.marginLeft="-"+a*i.GetTileWidth()+"px":f.scrollTop=a*i.GetTileHeight()+"px",i.GetContainer().children("div.siebui-tile-list").animate(f,{duration:2e3,easing:t,complete:function(){l.call(i,$(this).parent())}})}function f(e,t){e.queue("Scroll_Queue",t),e.queue("Scroll_Queue").length===1&&!e.data("Scroll_Pending")&&(e.data("Scroll_Pending",!0),e.dequeue("Scroll_Queue")),e=null}function l(e){e.queue("Scroll_Queue").length===0&&e.removeData("Scroll_Pending"),e.dequeue("Scroll_Queue"),e=null}var e=SiebelJS.Dependency("SiebelApp.Constants"),t="easeInOutQuad",n=e.get("PAG_SCROLL_UP"),r=e.get("PAG_SCROLL_DN");return SiebelJS.Extend(i,SiebelAppFacade.TileLayoutPR),i.prototype.ShowUI=function(){SiebelAppFacade.Tilescrollcontainer.superclass.ShowUI.call(this),this.EnhanceScroller()},i.prototype.EnhanceScroller=function(){var t=this.GetPM(),n=t.Get("GetFullId"),r=null,i=(this.GetTileScrollDirection()||"horizontal").toLowerCase()==="horizontal",s="<div id='"+n+"_scrollarea' class='siebui-tile-scrollarea'></div>";r='<div id="tile-${DIRECTION}-scroll" class="siebui-tile-${DIRECTION}-scroll siebui-tile-scroll-d"><a class="siebui-tile-scroll-anchor" href="#"/></div>'
,i?(this.GetContainer().children("div.siebui-tile-list").after(s),$("#"+n+"_scrollarea").append(r.replace(/\${DIRECTION}/g,"left")+r.replace(/\${DIRECTION}/g,"right"))):this.GetContainer().children("div.siebui-tile-list").before(r.replace(/\${DIRECTION}/g,"up")).after(r.replace(/\${DIRECTION}/g,"down")).end().after(s);if(!this.GetVisibleTileScrollType()){var o='<div class="siebui-tile-slider-label"><div id=\''+n+"_scrollamount' class='siebui-scroll-amount'></div>"+"<div id='"+n+"_scrollslider' class='siebui-tile-scrollspeed-slider'></div>";$("#"+n+"_scrollarea").after(o),$(function(){$("#"+n+"_scrollslider").slider({value:t.Get("Default Tile Scroll Speed")?parseInt(t.Get("Default Tile Scroll Speed")):10,min:10,max:100,step:10,slide:function(e,n){$("#"+t.Get("GetFullId")+"_scrollamount").html(n.value)},stop:function(n,r){var i=CCFMiscUtil_CreatePropSet();i.SetProperty("Key","Default Tile Scroll Speed"),i.SetProperty("Default Tile Scroll Speed",r.value.toString()),t.OnControlEvent(e.get("PHYEVENT_INVOKE_CONTROL"),t.Get(e.get("SWE_MTHD_UPDATE_USER_PREF")),i),t.SetProperty("Default Tile Scroll Speed",r.value.toString())}}),$("#"+n+"_scrollamount").html($("#"+n+"_scrollslider").slider("value"))})}this.BindScrollEvents()},i.prototype.UpdateScrollArrows=function(){var t=this.GetTileScrollDirection(),n=this.GetPM(),r=$("#"+n.Get("GetFullId")+"_"+e.get("SWE_TILE_CONTAINER")),i=0,s=n.Get("GetRecordSet")?n.Get("GetRecordSet").length:0;!t||t.toLowerCase()==="horizontal"?(i=parseInt((r.width()||$("#s_"+n.Get("GetFullId")+"_div").width())/this.GetTileWidth(),10),s>i?r.find("#tile-right-scroll").removeClass("siebui-tile-scroll-d"):s===i&&n.ExecuteMethod("CanInvokeScrollMethod","ScrollNextData")?r.find("#tile-right-scroll").removeClass("siebui-tile-scroll-d"):r.find("#tile-right-scroll").addClass("siebui-tile-scroll-d")):(i=parseInt(this.GetContainerHeight()/this.GetTileHeight(),10),s===0||s<=i?r.find("#tile-down-scroll").addClass("siebui-tile-scroll-d"):r.find("#tile-down-scroll").removeClass("siebui-tile-scroll-d"))},i.prototype.EnableScrollArrow=function(e){e.length>0&&e.removeClass("siebui-tile-scroll-d")},i.prototype.BindScrollEvents=function(){var e=this.GetTileScrollDirection(),t=this.GetVisibleTileScrollType();t&&t.toLowerCase()==="scrollvisibletiles"?o.call(this):!e||e.toLowerCase()==="horizontal"?(s.call(this,"#tile-left-scroll","#tile-right-scroll","ScrollPrevData","ScrollNextData",n,"margin-left","marginLeft"),s.call(this,"#tile-right-scroll","#tile-left-scroll","ScrollNextData","ScrollPrevData",r,"margin-left","marginLeft")):(s.call(this,"#tile-up-scroll","#tile-down-scroll","ScrollPrevData","ScrollNextData",n,"","scrollTop"),s.call(this,"#tile-down-scroll","#tile-up-scroll","ScrollNextData","ScrollPrevData",r,"","scrollTop"))},i.prototype.SetFirstTileId=function(e,t){var n=this.GetTileScrollDirection(),r=$("#"+e).outerHeight(!0),i=$("#"+e).outerWidth(!0);this.SetTileHeight($("#"+e).outerHeight(!0)),this.SetTileWidth($("#"+e).outerWidth(!0)),!n||n.toLowerCase()==="horizontal"?(this.SetContainerHeight(r*t),this.SetContainerWidth(parseInt(i*t/2),10)):parseInt(this.GetContainer().children("div.siebui-tile-list").css("max-height"),10)>0?this.GetContainer().children("div.siebui-tile-list").outerHeight(!0)<parseInt(this.GetContainer().children("div.siebui-tile-list").css("max-height"),10)?this.SetContainerHeight(this.GetContainer().children("div.siebui-tile-list").outerHeight(!0)):this.SetContainerHeight(parseInt(this.GetContainer().children("div.siebui-tile-list").css("max-height"),10)):this.SetContainerHeight(r*t),(!this.GetTileScrollDirection()||this.GetTileScrollDirection().toLowerCase()==="horizontal")&&this.GetContainer().children("div.siebui-tile-list").outerHeight(r),this.UpdateScrollArrows()},i.prototype.SetNewscrollpos=function(e,t){var n=this.GetPM(),r=this.GetTileScrollDirection(),i=-1,s=0,o=0,u=this.GetContainerHeight(),a=this.GetContainerWidth(),f=!r||r.toLowerCase()==="horizontal"?this.GetContainerWidth():this.GetContainerHeight(),l=n.Get("GetRecordSet").length;if(e===null||t===0)return;t<0&&(t=-t);if(this.GetVisibleTileScrollType()){var c=this.GetContainer().data("Scroll_Index");c=e?c-Number(t):c+Number(t),this.GetContainer().data("Scroll_Index",c),!r||r.toLowerCase()==="horizontal"?this.GetContainer().children("div.siebui-tile-list").css("marginLeft","-"+c*this.GetTileWidth()+"px"):this.GetContainer().children("div.siebui-tile-list").scrollTop(c*this.GetTileHeight());return}!r||r.toLowerCase()==="horizontal"?(o=this.GetContainer().children("div.siebui-tile-list").offset().left,e?s=0:s=-(this.GetContainerWidth()-this.GetTileWidth())):(o=this.GetContainer().children("div.siebui-tile-list").scrollTop(),e?(i=this.GetOffset(l-t-1,l-1),s=o-i):(i=this.GetOffset(0,t),s=o+i),s<0?s=0:s>f&&(s=f)),s=String(s)+"px",!r||r.toLowerCase()==="horizontal"?this.GetContainer().children("div.siebui-tile-list").animate({marginLeft:s},2):(this.GetContainer().children("div.siebui-tile-list").scrollTop(0),this.GetContainer().children("div.siebui-tile-list").animate({scrollTop:s},2))},i.prototype.GetOffset=function(e,t){e+=this.m_Offset,t+=this.m_Offset;var n=this.GetPM(),r=this.GetTileScrollDirection(),i,s=n.Get("GetRecordSet").length,o=this.GetContainer().children("div.siebui-tile-list").height(),u=n.Get("GetFullId"),a=u+"_tile_"+e,f=u+"_tile_"+t;return!r||r.toLowerCase()==="horizontal"?(f=u+"_tile_"+(t-1),i=$("#"+f).offset().left):i=$("#"+f).offset().top-$("#"+a).offset().top,i},i}(),"SiebelAppFacade.Tilescrollcontainer"}));