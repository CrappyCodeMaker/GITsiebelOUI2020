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
if(typeof SiebelAppFacade.SitemapPR=="undefined"){SiebelJS.Namespace("SiebelAppFacade.SitemapPR"),define("siebel/sitemappr",["siebel/webpgpr"],function(){return SiebelAppFacade.SitemapPR=function(){function n(){SiebelAppFacade.SitemapPR.superclass.constructor.apply(this,arguments)}var e=!1,t;return SiebelJS.Extend(n,SiebelAppFacade.WebpgPR),n.prototype.BindEvents=function(){SiebelAppFacade.SitemapPR.superclass.BindEvents.call(this),$("#filterReset").click(function(e){$("#sitemapFilterInput").val("").keyup()}),$("#sitemapFilterInput").keyup(function(){var n=$(this).val(),r=new RegExp(n,"i");n!=""&&n.length>0?($(this).addClass("filtered"),$("#filterReset").css("display","inline-block")):($(this).removeClass("filtered"),$("#filterReset").hide());if(n!=""&&n.length>2){e||(e=!0,t=$(".sitemapMain span a"),$(".sitemapIndexSection").hide(),$(".sitemapMain > a").hide(),$("#filterResultCount").text(""),$(".filterResult").show(),$(".sitemapPage").addClass("filtered")),$(".sitemapMain li:visible").hide();var i=0;t.each(function(e){$(this).text().match(r)&&(i++,$(this).parentsUntil(".sitemapMain","li").show())}),$("#filterResultCount").text(i)}else $(".sitemapPage").removeClass("filtered"),$(".sitemapIndexSection").show(),$(".sitemapMain li").show(),$(".sitemapMain > a").show(),$(".filterResult").hide(),e=!1,t=null}),setTimeout(function(){$("#sitemapFilterInput").focus()},1e3),$("#"+SiebelApp.S_App.ViewTarget()).addClass("siebui-view-sitemap")},n}(),SiebelAppFacade.SitemapPR});function SWEGotoAnchor(e,t){var n,r,i,s,o;t==null||t==""?n=this:n=SWEFindFrame(top,t);if(n!=null){r=document.all?n.document.all(e):n.document.anchors[e],r=r||$("a[name="+e+"]",n.document).eq(0)||$("a#"+e,n.document).eq(0);if(r){var u=$("#"+SiebelApp.S_App.ViewTarget());u.scrollTop($(r).offset().top-u.offset().top+ +u.scrollTop()),r.focus()}return}}};
