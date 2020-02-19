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
typeof SiebelAppFacade.NavTabRenderer=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.NavTabRenderer"),define("siebel/navtabrenderer",["siebel/accnavigationphyrender"],function(){return SiebelAppFacade.NavTabRenderer=function(){function e(e){SiebelAppFacade.NavTabRenderer.superclass.constructor.call(this,e)}function t(e){r.call(this,$(".siebui-mobile-nav-tabs .siebui-nav-tabs.siebui-nav-tabView.ui-tabs-collapsible"),e)}function n(){r.call(this,$(".siebui-mobile-nav-tabs .siebui-nav-tabs.siebui-nav-tabView.ui-tabs-collapsible"))}function r(e,t){var n=e;t?t.matches?n.removeClass("siebui-open").addClass("siebui-closed"):n.removeClass("siebui-closed").addClass("siebui-open"):n.hasClass("siebui-closed")?n.removeClass("siebui-closed").addClass("siebui-open"):n.removeClass("siebui-open").addClass("siebui-closed"),n=null}return SiebelJS.Extend(e,SiebelAppFacade.AccNavigationPhyRenderer),e.prototype.BindData=function(e,t){SiebelAppFacade.NavTabRenderer.superclass.BindData.call(this);var n=$(".siebui-mobile-nav-tabs").find("ul");if($(n).length>0)if($(n).find("li").length<=1)$(".siebui-mobile-nav-tabs").hide();else{$(".siebui-mobile-nav-tabs").show();var i=window.matchMedia("(orientation: portrait)");i&&r.call(this,$(".siebui-mobile-nav-tabs .siebui-nav-tabs.siebui-nav-tabView.ui-tabs-collapsible"),i)}$("#_MobileViewTabContainer").find("li").length>0&&$("#_MobileAppletTabContainer").length>0&&($("#_MobileAppletTabContainer").append($("#_MobileViewTabContainer").contents()),$("#_MobileAppletTabContainer").parent().addClass("siebui-applet-tab")),$("#_MobileViewTabContainer").find("li").length>0&&$($("#_MobileNavAppletContainer").children()).length>0&&$("#_MobileViewTabContainer").hide()},e.prototype.BindEvents=function(){SiebelAppFacade.NavTabRenderer.superclass.BindEvents.call(this);if(!this.GetPM().Get("IsAddedOrientationListener")){var e=window.matchMedia("(orientation: portrait)");e&&e.addListener(t),this.GetPM().AddProperty("IsAddedOrientationListener","true")}$(".siebui-mobile-nav-tabs .siebui-nav-hb.siebui-subview-screennavs").undelegate(".siebui-invisible-el.siebui-nav-tabView","click").delegate(".siebui-invisible-el.siebui-nav-tabView","click",{ctx:this},n)},e}(),"SiebelAppFacade.NavTabRenderer"}));
