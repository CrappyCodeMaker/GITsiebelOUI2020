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
typeof SiebelAppFacade.DynaControlGridPR=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.DynaControlGridPR"),define("siebel/dynacontrolgridpr",["siebel/jqgridrenderer","siebel/htmltmplmgr"],function(){return SiebelAppFacade.DynaControlGridPR=function(){function n(e){SiebelAppFacade.DynaControlGridPR.superclass.constructor.apply(this,arguments)}var e=SiebelJS.Dependency("SiebelAppFacade.HTMLTemplateManager"),t=SiebelJS.Dependency("SiebelApp.Constants");return SiebelJS.Extend(n,SiebelAppFacade.JQGridRenderer),n.prototype.Init=function(){SiebelAppFacade.DynaControlGridPR.superclass.Init.call(this)},n.prototype.ShowUI=function(){var e=this.GetPM();if(SiebelAppFacade.ComponentMgr.FindComponent({id:SiebelApp.S_App.GetActiveView().GetName()}).GetPM().Get("ViewPRLoaded")){var n=e.Get("GetControls"),r=e.Get("GetFullId"),i=e.Get("GetPlaceholder"),s=e.Get("AppletTemplateId"),o=e.Get("AppletTitleId"),u=e.Get(t.get("SWE_VIS_MODE_DEFAULT")),a=!1;$('[id="'+s+'"][data-mode]').not('[data-mode ="'+u+'"]').remove();var f=$('[id="'+s+'"][data-mode ="'+u+'"]').length;f?($('[id="'+s+'"][data-mode ="'+u+'"]').eq(0).html('<div id="'+r+'"><div id="s_'+r+'_div"></div></div>'),f>1&&SiebelJS.Log("Html template has multiple elements with id '"+s+"' and data-mode '"+u+"'")):$("#"+s)?$("#"+s).attr("data-mode",u).html('<div id="'+r+'"><div id="s_'+r+'_div"></div></div>'):SiebelJS.Log("Ensure that the HTML template has an element with id '"+s+"'"),$('[id="'+s+'"]').not('[data-mode ="'+u+'"]').remove();var l=$("#s_"+r+"_div"),c;l.append('<div class="siebui-applet-header"><div class="siebui-applet-title"></div></div>');for(var h in n)if(n.hasOwnProperty(h)){var p=n[h];o&&p.GetName()==o&&l.find(".siebui-applet-title").attr("id",o).attr("name",o),p.GetUIType()==="Button"?(a||(l.children(".siebui-applet-header").append('<div class="siebui-btn-grp-applet" id="buttonDiv"></div>'),a=!0,c=l.find("#buttonDiv")),c.append('<div class="siebui-vismode-buttonbar"></div>'),c.append('<span id="'+p.GetName()+'sp" name="'+p.GetName()+'"></span>')):p.GetUIType()==="Label"&&($("#"+p.GetName()).addClass("siebui-show-control"),$("#"+p.GetName()).text(p.GetDisplayName()))}l.append('<table id="'+i+'" valign="top" width="100%" datatable="1"></table>'),SiebelAppFacade.DynaControlGridPR.superclass.ShowUI.call(this)}},n.prototype.BindData=function(e){SiebelAppFacade.ComponentMgr.FindComponent({id:SiebelApp.S_App.GetActiveView().GetName()}).GetPM().Get("ViewPRLoaded")&&SiebelAppFacade.DynaControlGridPR.superclass.BindData.call(this,e)},n.prototype.BindEvents=function(){SiebelAppFacade.ComponentMgr.FindComponent({id:SiebelApp.S_App.GetActiveView().GetName()}).GetPM().Get("ViewPRLoaded")&&SiebelAppFacade.DynaControlGridPR.superclass.BindEvents.call(this)},n.prototype.ShowSelection=function(){var e=this.GetPM(),t=e.Get("GetRecordSet").length,n=e.Get("GetRowsSelectedArray"),r=e.Get("ActiveRow");if(r<0)for(var i=0;i<t&&i<n.length;i++)n[i]?(e.SetSelection(i),e.SetProperty("ActiveRow",i),e.Get("GetRowsSelectedArray")[i]=!0):e.Get("GetRowsSelectedArray")[i]=!1;else{e.SetSelection(r);for(var s=0;s<t;s++)e.Get("GetRowsSelectedArray")[s]=!1;e.Get("GetRowsSelectedArray")[r]=!0}SiebelAppFacade.DynaControlGridPR.superclass.ShowSelection.call(this),e.SetProperty("ActiveRow","-1")},n}(),SiebelAppFacade.DynaControlGridPR}));
