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
typeof SiebelAppFacade.HBNavPlugin=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.HBNavPlugin"),define("siebel/hamburgernav",[],function(){return SiebelAppFacade.HBNavPlugin=function(){function t(e){this.cfg={showIcon:!0,hbClass:"siebui-nav-hb-btn",collapseClass:"siebui-nav-hb-closed",expandClass:"siebui-nav-hb-open",visibleClass:"siebui-nav-hb-visible",hiddenClass:"siebui-nav-hb-invisible",forceExpandClass:"siebui-nav-hb-expanded"},$.extend(this.cfg,e)}function n(e){e.removeClass(this.cfg.collapseClass).addClass(this.cfg.expandClass).removeClass(this.cfg.hiddenClass).addClass(this.cfg.visibleClass)}function r(e){e.removeClass(this.cfg.expandClass).addClass(this.cfg.collapseClass).removeClass(this.cfg.visibleClass).addClass(this.cfg.hiddenClass)}function i(e,t){e.undelegate("button."+this.cfg.hbClass,"click",{ctx:this,state:t},o).delegate("button."+this.cfg.hbClass,"click",{ctx:this,state:t},o).unbind("focusout.HBNavPlugin",{ctx:this,state:t},a).bind("focusout.HBNavPlugin",{ctx:this,state:t},a),$(window).unbind("resize.HBNavPlugin orientationchange.HBNavPlugin",{ctx:this,state:t},u).bind("resize.HBNavPlugin orientationchange.HBNavPlugin",{ctx:this,state:t},u)}function s(e){var t=$("#"+e),n=t.find("li.siebui-active-navtab").find("a");return n.length!==0?n.text():""}function o(e){var t=e.data.ctx,i=$(this).parent().find("ul").eq(0);if(e.data.state&&!$(this).is(":visible"))return;i.hasClass(t.cfg.collapseClass)?(n.call(t,i),i.find("li.siebui-active-navtab").length&&i.find("li.siebui-active-navtab").eq(0).focus()):r.call(t,i),i=null}function u(e){var t=e.data.ctx,i=$("#"+t.cfg.id).find("button."+t.cfg.hbClass),s=i.parent().find("ul").eq(0);if(e.data.state){if(!i.is(":visible")){s.hasClass(t.cfg.forceExpandClass)||(n.call(t,s),s.addClass(t.cfg.forceExpandClass));return}if(s.hasClass(t.cfg.forceExpandClass)){s.removeClass(t.cfg.forceExpandClass),r.call(t,s);return}}s.hasClass(t.cfg.expandClass)&&r.call(t,s),s=i=null}function a(e){var t=this;if(e.data.state&&!$(this).find("button."+e.data.ctx.cfg.hbClass).is(":visible"))return;setTimeout(function(){f.call(t,e),t=e=null},1)}function f(e){if($(this).find($(document.activeElement)).length===0&&this!==document.activeElement){var t=e.data.ctx,n=$(this).find("ul").eq(0);n.hasClass(t.cfg.visibleClass)&&r.call(t,n),n=null}}var e=SiebelJS.Dependency("SiebelApp.Utils");return t.prototype.CanManage=function(){return!0},t.prototype.addTemplate=function(e){var t=!1;if(e.length&&e.find("li").length&&e.find("button."+this.cfg.hbClass).length===0){var n=s.call(this,this.cfg.id),r="<span class='siebui-icon-bar'></span><span class='siebui-icon-bar'></span><span class='siebui-icon-bar'></span>",i="";i='<button class="'+this.cfg.hbClass+" "+(e.find("li").length>0?"siebui-display":"siebui-no-display")+'" >'+(this.cfg.showIcon?r:n)+"</button>",this.cfg.showIcon&&(i+='<span class="siebui-hb-header" >'+n+"</span>"),e.prepend(i),t=!0,r=i=e=null}return t},t.prototype.Refresh=function(){var e=$("#"+this.cfg.id);if(e.length&&e.find("button."+this.cfg.hbClass).length){var t=s.call(this,this.cfg.id);this.cfg.showIcon?e.find("span.siebui-hb-header").html(t):e.find("button."+this.cfg.hbClass).html(t)}},t.prototype.Manage=function(e,t){var r=this,s=$("#"+r.cfg.id);r.addTemplate(s)&&(s.find("ul").eq(0).hide().addClass(r.cfg.collapseClass).removeClass(r.cfg.visibleClass).addClass(r.cfg.hiddenClass),setTimeout(function(){s.find("ul").eq(0).show(),s=null},1),i.call(this,s,e)),e&&(s.find("button."+this.cfg.hbClass).addClass("siebui-no-display").end().find("span.siebui-hb-header").addClass("siebui-no-display"),s.find("button."+this.cfg.hbClass).is(":visible")||(n.call(this,s.find("ul").eq(0)),s.find("ul").eq(0).addClass(this.cfg.forceExpandClass))),t&&(s.find("button."+this.cfg.hbClass).attr({role:"presentation",title:t}),s.find("ul").eq(0).attr("tabindex","-1"))},t}(),SiebelAppFacade.HBNavPlugin}));
