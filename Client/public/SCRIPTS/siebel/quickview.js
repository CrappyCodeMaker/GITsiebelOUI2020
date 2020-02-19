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
SiebelApp.QuickView=function(){var e={},t=function(){e={};var t=SiebelApp.S_App.GetActiveView();if(t){var n=t.GetAppletMap();for(var r in n){var i=n[r];if(i instanceof SiebelApp.S_App.ListApplet){var s=i.GetPModel().Get("GetCaption");e[s]={},e[s].length=i.GetRecordSet().length,e[s].id=i.GetFullId()}}}},n=function(){$("#anchor-applet-div").remove();var t="<div id='anchor-applet-div'>";return $("div#_svf0").children("div").children().find("a.next-item-applet").each(function(){var n=$(this).attr("title");if(e[n]){var r="anchor-s_"+e[n].id+"_div";t+="<a id='"+r+"' class='anchor-item-applet'>"+n+" ("+e[n].length+") </a>"}}),t+="</div>",t},r=function(){t.call(this);var r=n.call(this);$(r).insertBefore($("a.next-item-applet")[0]);for(var i in e)$("#anchor-s_"+e[i].id+"_div").hover(function(e){var t=$(this).attr("id").replace("anchor-",""),n=$("#"+t).find("div.AppletHIListBorder");n.animate({position:"absolute",top:$(this).offset().top-n.offset().top+$(this).outerHeight()/2},"slow")},function(e){var t=$(this).attr("id").replace("anchor-",""),n=$("#"+t).find("div.AppletHIListBorder");n.animate({position:"",top:""},"slow")}),$("#anchor-s_"+e[i].id+"_div").bind("click",function(){var e=$(this).attr("id").replace("anchor-",""),t=$("#"+e).find("div.AppletHIListBorder");$("#_svf0").scrollTop(t.offset().top+t.outerHeight())})},i=function(){$("#anchor-applet-div").remove()};return{attach:function(){r.call(this),SiebelApp.EventManager.removeListner("refreshview",r,this),SiebelApp.EventManager.addListner("refreshview",r,this)},detach:function(){i.call(this),SiebelApp.EventManager.removeListner("refreshview",r,this)}}}(),SiebelApp.QuickView.attach();
