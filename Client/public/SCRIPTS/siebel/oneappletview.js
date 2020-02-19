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
SiebelApp.OneAppletView=function(){var e=[],t=0,n=0,r="ontouchstart"in document.documentElement,i=!1,s=!1,o=function(){e=[],$("a.next-item-applet").each(function(){var t=$(this).next();t.attr("id")&&e.push({sel:"#"+t.attr("id"),height:t.height()})}),n=0},u=function(){if(!r)return;if(i)return;var t=this;for(var n=0,s=e.length;n<s;n++)$(e[n].sel).swipe({swipeLeft:function(e,t){return function(){a.call(e,t,"L")}}(t,n),swipeRight:function(e,t){return function(){a.call(e,t,"R")}}(t,n)});i=!0},a=function(r,i){if(!s)return;var r=r||n;i==="L"?r+1<e.length&&($(e[r].sel).css("display","none"),$(e[r+1].sel).css("display","").css("height",t),SiebelApp.EventManager.fireEvent("gridresize",{id:e[r+1].sel}),n=r+1):i==="R"&&r-1>=0&&($(e[r].sel).css("display","none"),$(e[r-1].sel).css("display","").css("height",t),SiebelApp.EventManager.fireEvent("gridresize",{id:e[r-1].sel}),n=r-1)},f=function(){if(e.length>0){$(e[0].sel).css("height",t),SiebelApp.EventManager.fireEvent("gridresize",{id:e[0].sel});for(var n=1,r=e.length;n<r;n++)$(e[n].sel).css("display","none")}},l=function(){for(var t=0,n=e.length;t<n;t++)$(e[t].sel).css("display","").css("height",e[t].height),SiebelApp.EventManager.fireEvent("gridresize",{id:e[t].sel}),$(e[t].sel).css("height","")},c=function(){if(r||$("div.applet-left-mover")[0])return;$("body").append("<div class='applet-left-mover'></div><div class='applet-right-mover'></div>");var e=$("#_svf0").offset().top+$("#_svf0").outerHeight()/2,t=$("#_svf0").offset().left;$("div.applet-left-mover").css("top",e).css("left",t),$("div.applet-right-mover").css("top",e).css("left",t+$("#_svf0").outerWidth());var n=this;$("div.applet-left-mover").click(function(){a.call(n,undefined,"R")}).hover(function(){$(this).toggleClass("applet-mover-highlight")}),$("div.applet-right-mover").click(function(){a.call(n,undefined,"L")}).hover(function(){$(this).toggleClass("applet-mover-highlight")})},h=function(){if(r)return;$("div.applet-left-mover").remove(),$("div.applet-right-mover").remove()},p=function(){s=!0,t=parseInt($("#_svf0").height()*.9,10),o.call(this),u.call(this),c.call(this),f.call(this)},d=function(){s=!1,h.call(this),l.call(this)},v=function(){i=!1,s&&p.call(this)};return{attach:function(){p.call(this),SiebelApp.EventManager.addListner("refreshview",v,this)},detach:function(){d.call(this)}}}(),SiebelApp.ThemeManager.getTheme("ipad-one-applet-view").objList.push(SiebelApp.OneAppletView);
