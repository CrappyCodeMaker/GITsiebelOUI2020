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
typeof SiebelAppFacade.ListRenderer=="undefined"&&(Namespace("SiebelAppFacade.ListRenderer"),SiebelAppFacade.ListRenderer=function(){function r(t){this.superclass.constructor.call(this,t);var n={};this.GetAttribute=function(t){return e.IsEmpty(n[t])?null:n[t]},this.SetAttribute=function(e,t){n[e]=t}}var e=SiebelApp.Utils,t=SiebelAppFacade.FacadeConstants,n=navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i);return r.prototype.ShowUI=function(){this.superclass.ShowUI.call(this)},r.prototype.OnControlEvent=function(e){var t;switch(e[0]){case"sr":var n=e[1],r=e[2],i=e[3];t=this.GetProxy().HandleRowSelect(n,r,i);break;case"vs":var s=e[1];t=this.GetProxy().OnVerticalScroll(s);break;case"st":var o=e[1],u=e[2];t=this.GetProxy().OnClickSort(o,u);break;case"CellChange":this.GetProxy().OnLeaveColInput(e[1],e[2],e[3]);break;default:t=this.superclass.OnControlEvent.call(this,e)}return t},r.prototype.CreateRenderer=function(){var t="JQGRID",r=SiebelAppFacade.JQGridRenderer;n&&(t="JQMLIST");switch(t){case"JQGRID":var i=e.InheritCtor(SiebelAppFacade.PhysicalRenderer,SiebelAppFacade.JQGridRenderer);this.SetConcreteRenderer(new i(this));break;case"JQMLIST":var s=e.InheritCtor(SiebelAppFacade.PhysicalRenderer,SiebelAppFacade.JQMListRenderer);this.SetConcreteRenderer(new s(this))}},r.prototype.FocusFirstControl=function(){this.GetConcreteRenderer().FocusFirstControl()},r.prototype.SetFocusToControl=function(e){return this.GetConcreteRenderer().SetFocusToControl(e)},r.prototype.SetCellValue=function(e,t,n){this.GetConcreteRenderer().SetCellValue(e,t,n)},r.prototype.SetCellEdit=function(e){this.GetConcreteRenderer().SetCellEdit(e)},r.prototype.ShowSelection=function(){this.GetConcreteRenderer().ClearSelection();var e=this.GetConcreteRenderer().GetRowCount();for(var t=0;t<e&&t<this.GetProxy().GetRowsSelectedArray().length;t++)this.GetConcreteRenderer().SelectRow(t+1,this.GetProxy().GetRowsSelectedArray()[t])},r.prototype.ShowSearch=function(){n?this.GetSearchCtrl().SetContainer($("#"+this.GetPlaceholder())):this.GetSearchCtrl().SetContainer($("#"+this.GetPlaceholder()).parents("div.NotSelected").parent().find("tr td[width='100%']")[0]||$("#"+this.GetPlaceholder()).parents("td.AppletStylePopup").find("tr td[width='100%']")[0]);var e=[],t=this.GetListOfColumns();for(var r in t)e.push(t[r].control.GetDisplayName());this.GetSearchCtrl().ShowUI(e,this.GetPlaceholder()),this.GetProxy().GetAppletLabel()!=""&&(this.GetSearchCtrl().GetInputField().attr("title",this.GetProxy().GetAppletLabel()+":Search"),this.GetSearchCtrl().GetSearchField().attr("title",this.GetProxy().GetAppletLabel()+":Search"));var i=this;this.GetSearchCtrl().GetInputField().result(function(e,t,n){var r={};r[i.GetSearchCtrl().GetSelectedField()]=t,i.Query(r)}),this.GetSearchCtrl().GetInputField().bind("keypress",function(e){if(e.which==13){var t=i.GetSearchCtrl().GetInputField().attr("value"),n={},r=i.GetListOfColumns();for(var s=0;s<r.length;s++)if(r[s].control.GetDisplayName()==i.GetSearchCtrl().GetSelectedField()){var o=r[s].control.GetSpanPrefix()+"0";i.GetSearchCtrl().SetColumnId(o)}return n[i.GetSearchCtrl().GetSelectedField()]=t,i.Query(n),!1}})},r.prototype.BindData=function(e){e==1&&this.GetConcreteRenderer().ClearData(),this.GetConcreteRenderer().BindData(),this.BindSearchData({matchContains:!1,multiple:!1,mustMatch:!1,autoFill:!1,minChars:0})},r.prototype.GetRowIdentifier=function(){var e=this.GetProxy().GetRowIdentifier();if(e==""||typeof e=="undefined"||e==null)e=this.GetListOfColumns()[0].name;return e},r.prototype.GetAppletSummary=function(){var e=this.GetProxy().GetAppletSummary();return e},r.prototype.GetListOfColumns=function(){var e=this.GetProxy().GetListOfColumns(),t=[];for(var n in e)if(e.hasOwnProperty(n)){var r=e[n],i=n,s={name:i,controlType:r.GetUIType(),isLink:this.GetProxy().CanNavigate(i),index:Number(r.GetColNum())+1,bCanUpdate:this.GetProxy().CanUpdate(i),control:r};this.GetControlKeyMap()[i]=n,t.push(s)}return t.sort(function(e,t){return e.index-t.index}),this.GetListOfColumns=function(){return t},t},r}());
