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
typeof SiebelAppFacade.DynaControlPortraitPR=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.DynaControlPortraitPR"),define("siebel/dynacontrolportraitpr",["siebel/TileLayoutPR"],function(){return SiebelAppFacade.DynaControlPortraitPR=function(){function t(e){SiebelAppFacade.DynaControlPortraitPR.superclass.constructor.apply(this,arguments)}var e=SiebelJS.Dependency("SiebelApp.Constants");return SiebelJS.Extend(t,SiebelAppFacade.TileLayoutPR),t.prototype.Init=function(){SiebelAppFacade.DynaControlPortraitPR.superclass.Init.call(this)},t.prototype.ShowUI=function(){var t=this.GetPM(),n=t.Get("AppletTemplateId");if(SiebelAppFacade.ComponentMgr.FindComponent({id:SiebelApp.S_App.GetActiveView().GetName()}).GetPM().Get("ViewPRLoaded")&&n){var r=t.Get("GetControls"),i=t.Get("GetFullId"),n=t.Get("AppletTemplateId"),s=t.Get("AppletTitleId"),o=t.Get(e.get("SWE_VIS_MODE_DEFAULT")),u=$('[id="'+n+'"][data-mode ="'+o+'"]'),a,f=!1;$('[id="'+n+'"][data-mode]').not('[data-mode ="'+o+'"]').remove();var l=$('[id="'+n+'"][data-mode ="'+o+'"]').length;l?(u=$('[id="'+n+'"][data-mode ="'+o+'"]').eq(0),l>1&&SiebelJS.Log("Html template has multiple elements with id '"+n+"' and data-mode '"+o+"'")):$("#"+n)?u=$("#"+n).attr("data-mode",o):SiebelJS.Log("Ensure that the HTML template has an with id '"+n+"'"),$('[id="'+n+'"]').not('[data-mode ="'+o+'"]').remove(),u.eq(0).find("#tile_1").length?a=$("#tile_1").wrap("p").parent().html():u.children().length?(a=u.eq(0).html(),u.eq(0).html('<div id="tile_1"></div>').find("#tile_1").append(a),a=u.eq(0).html()):SiebelJS.Log("Unable to find sample tile layout for the element with id '"+n+"' in the HTML template"),u.html('<div id="'+i+'"><div id="s_'+i+'_div"></div></div>');var c=$("#s_"+i+"_div"),h;c.append('<div class="siebui-applet-header"><div class="siebui-applet-title"></div></div>');var p=i+"_"+e.get("SWE_TILE_CONTAINER");c.append('<div id="'+p+'"></div>'),$("#"+p).addClass("siebui-tile-container").addClass("siebui-no-margin").append(a);for(var d in r)if(r.hasOwnProperty(d)){var v=r[d];s&&v.GetName()==s&&c.find(".siebui-applet-title").attr("id",s).attr("name",s);if(v.GetUIType()==="Button")f||(c.children(".siebui-applet-header").append('<div class="siebui-btn-grp-applet" id="buttonDiv"></div>'),f=!0,h=c.find("#buttonDiv")),h.append('<div class="siebui-vismode-buttonbar"></div>'),h.append('<span id="'+v.GetName()+'sp" name="'+v.GetName()+'"></span>');else if(v.GetUIType()==="Label")$("#"+v.GetName()).addClass("siebui-show-control"),$("#"+v.GetName()).text(v.GetDisplayName());else if(v.GetUIType()==="JDatePick"||v.GetUIType()==="JDateTimeZonePick"||v.GetUIType()==="JDateTimePick"){if(!$("#"+v.GetName()).attr("name")){var m=$("#"+v.GetName()).attr("id");$("#"+v.GetName()).attr("name",m)}$("#"+v.GetName()).removeAttr("id")}}SiebelAppFacade.DynaControlPortraitPR.superclass.ShowUI.call(this),this.SetTileScrollDirection("vertical")}},t.prototype.BindData=function(e){var t=this.GetPM(),n=t.Get("GetRecordSet"),r=n?n.length:0,i=t.Get("GetControls"),s=t.Get("GetFullId"),o="",u=this.GetPM().Get("AppletTemplateId");if(SiebelAppFacade.ComponentMgr.FindComponent({id:SiebelApp.S_App.GetActiveView().GetName()}).GetPM().Get("ViewPRLoaded")&&u){this.SetTileScrollDirection("vertical"),SiebelAppFacade.DynaControlPortraitPR.superclass.BindData.call(this,e);for(var a=0;a<r;a++){o=s+"_tile_"+a;for(var f in i)if(i.hasOwnProperty(f)){var l=i[f];$("#"+o+" #"+l.GetName()).addClass("siebui-show-control"),l.GetUIType()==="Label"&&$("#"+o+" #"+l.GetName()).text(l.GetDisplayName())}}}},t.prototype.BindEvents=function(){var e=this.GetPM().Get("AppletTemplateId");SiebelAppFacade.ComponentMgr.FindComponent({id:SiebelApp.S_App.GetActiveView().GetName()}).GetPM().Get("ViewPRLoaded")&&e&&SiebelAppFacade.DynaControlPortraitPR.superclass.BindEvents.call(this)},t.prototype.ShowSelection=function(){var e=this.GetPM();rowCount=e.Get("GetRecordSet").length,selArray=e.Get("GetRowsSelectedArray"),controlSet=e.Get("GetControls"),selectedTile=0;var t=e.Get("ActiveRow");if(t<0)for(var n=0;n<rowCount&&n<selArray.length;n++)selArray[n]&&(e.SetSelection(n),e.SetProperty("ActiveRow",n),n>0&&(t=n));else e.SetSelection(t),selectedTile=t;for(var r in controlSet)controlSet.hasOwnProperty(r)&&$("#"+appletId+"_tile_"+selectedTile+" "+"#"+controlSet[r].GetName()+"_icon").addClass("forceshow");SiebelAppFacade.DynaControlPortraitPR.superclass.ShowSelection.call(this),e.SetProperty("ActiveRow","-1")},t.prototype.SetFirstTileId=function(e,t){var n=this.GetPM(),r=n.Get("GetFullId"),i=n.Get("GetControls"),s=n.Get("ListOfColumns");for(var o in i)if(i.hasOwnProperty(o)){var u=i[o];if(i[o].GetUIType()==="Label")for(recordIndex=0;recordIndex<t;recordIndex++)$("#"+r+"_tile_"+recordIndex+" "+"#"+i[o].GetName()).text(i[o].GetDisplayName())}var a=$("#"+e).outerHeight(!0),f=$("#"+e).outerWidth(!0);this.SetTileHeight(a),this.SetTileWidth(f),this.GetContainer().parent(".siebui-tile-container").addClass("siebui-vertical"),parseInt(this.GetContainer().children("div.siebui-tile-list").css("max-height"),10)>0?this.SetContainerHeight(parseInt(this.GetContainer().children("div.siebui-tile-list").css("max-height"),10)):this.SetContainerHeight(this.GetTileHeight()*this.GetPM().Get("GetRecordSet").length),this.GetContainer().css("height",this.GetContainerHeight()),this.GetContainer().find(".siebui-tile-list").css("height",this.GetTileHeight()*this.GetPM().Get("GetRecordSet").length)},t.prototype.EndLife=function(){this.SetBasicLayout(null),this.GetContainer().empty(),SiebelAppFacade.DynaControlPortraitPR.superclass.EndLife.call(this)},t}(),SiebelAppFacade.DynaControlPortraitPR}));