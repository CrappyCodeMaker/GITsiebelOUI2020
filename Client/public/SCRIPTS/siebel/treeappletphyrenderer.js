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
typeof SiebelAppFacade.TreeAppletPR=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.TreeAppletPR"),define("siebel/treeappletphyrenderer",["3rdParty/jstree/jquery.jstree.js","3rdParty/accessible-jqui/jquery.hotkeys.js","siebel/basephyrenderer"],function(){return SiebelAppFacade.TreeAppletPR=function(){function r(e){SiebelAppFacade.TreeAppletPR.superclass.constructor.call(this,e);var t=!1;this.SetPending=function(e){t=e},this.IsPending=function(){return t};var r=!1;this.SetReadyState=function(e){r=e},this.IsReady=function(){return r};var i=!1;this.SetLateBinding=function(e){i=e},this.IsLateBinding=function(){return i},this.SetDefaultIcon=function(e){n=e},this.GetDefaultIcon=function(){return n}}function i(){var e=this.GetPM(),t=$("#s_"+e.Get("GetFullId")+"_div");t.length!=0&&(typeof e.Get("GetObjectType")=="string"&&$(t).attr("ot",e.Get("GetObjectType")),typeof e.Get("GetRepstrName")=="string"&&$(t).attr("rn",e.Get("GetRepstrName")),typeof e.Get("GetUIName")=="string"&&$(t).attr("un",e.Get("GetUIName")))}function s(e,t){var n=null;if("ti_"+t.position===e)return t;for(var r=0;r<t.child.length;r++)if("ti_"+t.child[r].position===e)return t.child[r];for(var r=0;r<t.child.length;r++)if(t.child[r].child.length>0){n=s.call(this,e,t.child[r]);if(n!=null)return n}return null}function o(e,t){var n=s.call(this,"ti_"+e,t),r;if(n==null)return null;while(n.parent&&"ti_"+n.parent.position!="ti_0")r=n.parent,r.expand="t",n=n.parent;return r}function u(){var e=this.GetPM(),t=e.Get("root");SiebelJS.Debug((new Date).toLocaleString()+": Tree:Cleartree:begin");if(t&&t.child)for(var n=0;n<=t.child.length-1;n++){var r=t.child[n];a.call(this,r)}try{var i=$("#"+this.GetPM().Get("placeholder")).jstree("data");i.data.html_data.original_container_html=null,i.data.ui.selected=$(),i.data.ui.last_selected=!1,i.data.ui.hovered=null,i.data.ui.to_select=[]}catch(s){SiebelJS.Debug("Exception while clearing tree ")}SiebelJS.Debug((new Date).toLocaleString()+": Tree:Cleartree:end")}function a(e){var t=this.GetPM(),n=e.child,r=t.Get("placeholder");for(var i=0;i<=n.length-1;i++){var s="ti_"+n[i].position;$("#"+r).jstree("delete_node",s)}$("#"+r).jstree("deselect_node","ti_1")}function f(){var e=this.GetPM(),t=e.Get("placeholder"),n=e.Get("nodeIconsMap"),r=e.Get("root"),i=SiebelApp.S_App.GetDirection();$("#"+t).jstree("destroy");if(r&&r.child&&r.child.length>0){var s=n.GetProperty(r.child[0].caption);this.SetDefaultIcon(s?$(s).find("img").addBack("img").attr("src"):""),s=null}var o=$("#"+t);o.jstree({core:{data:{id:"ti_0",state:{opened:!0}},rtl:i?!0:!1,themes:{url:!0,dir:SIEBEL_BUILD+"3rdParty/jstree/themes",name:"default",icons:!0,dots:!0},check_callback:!0},plugins:["ui","themes","html_data","hotkeys","crrm"]})}function l(){var e=this.GetPM(),t=e.Get("placeholder"),n=e.Get("nodeIconsMap"),r=e.Get("root"),i=SiebelApp.S_App.GetDirection(),s=$("#"+t);if(r&&r.child)for(var o=0;o<=r.child.length-1;o++){var u=r.child[o],a=u.expand&&u.expand.toLowerCase()==="t"?!0:!1;s.jstree("create_node","ti_0",{id:"ti_"+u.position,text:u.caption,state:{opened:a},li_attr:{name:u.position,role:"presentation"},a_attr:{role:"treeitem",tabindex:"-1","aria-expanded":a}},"last","",!0)}$("#ti_0>i").addClass("siebui-no-display"),$("#ti_0>a").addClass("siebui-no-display")}function c(e,t){var n=t.match(/siebel\-icon[^\s]+/g)||[];return n.join(" ")}function h(n,r){var i=n.expand&&n.expand.toLowerCase()==="t"?!0:!1,s=this.IsLateBinding()&&!i,o={id:"ti_"+n.position,state:{opened:i}},u=this.GetPM(),a=u.Get("nodeIconsMap"),f=a.GetPropertyCount(),l=$("#"+r);tinode=$("#"+r).jstree("get_node",o),tinode&&(tinode.state.opened=i);for(var c=0;c<=n.child.length-1;c++){if(c>0&&s)break;var p=n.child[c],d="#ti_"+p.position.replace(/\./gi,"\\.");if($(d).length>0)continue;var v=a.GetProperty(p.caption),m="",g=p.expand&&p.expand.toLowerCase()==="t"?!0:!1;f>0&&v?m=$(v).find("img").addBack("img").attr("src"):this.GetDefaultIcon()&&(m=this.GetDefaultIcon());var y="";e.IsEmpty(p.icon)||(y="siebel-icon-"+p.icon),l.jstree("create_node",o,{id:"ti_"+p.position,text:p.caption,state:{opened:g},icon:m,li_attr:{name:p.position,role:"presentation","class":y},a_attr:{role:"treeitem",tabindex:"-1","aria-expanded":g}},"last","",!0);if(p.type===t.get("TREENODE_TYPE_NEXT")){var b="#ti_"+p.position.replace(/\./gi,"\\.");$(b).addClass("siebel-nextpage")}else if(p.type===t.get("TREENODE_TYPE_PREV")){var w="#ti_"+p.position.replace(/\./gi,"\\.");$(w).addClass("siebel-prevpage")}p.child.length>0?h.call(this,p,r):($(d).removeClass("jstree-open").addClass("jstree-leaf"),$(d).removeClass("jstree-open").addClass("jstree-leaf"))}if(e.IsEmpty(n.expand)){var E=n.position.replace(/\./gi,"\\.");$("div#"+r+" ul li[id="+E+"]").removeClass("jstree-open").addClass("jstree-closed").children("a").attr("aria-expanded","false")}}var e=SiebelJS.Dependency("SiebelApp.Utils"),t=SiebelJS.Dependency("SiebelApp.Constants"),n;return SiebelJS.Extend(r,SiebelAppFacade.BasePR),r.prototype.Init=function(){SiebelAppFacade.TreeAppletPR.superclass.Init.call(this),this.AttachPMBinding("refreshTree",this.BindData),this.AttachPMBinding("cleartree",u),this.AttachPMBinding("FocusSelectedTreeNode",function(e){var t=this.GetPM(),n=t.Get("placeholder"),r="ti_"+t.Get("selectednode").position,i=$("#"+n).jstree("get_selected");$("#"+n).jstree("deselect_node",i),$("#"+n).jstree("select_node",r),r=r.replace(/\./gi,"\\."),$("#"+r).attr("role","presentation").attr("aria-selected","true").children("a").addClass("siebel-selectednode")})},r.prototype.EndLife=function(){$("#"+this.GetPM().Get("placeholder")).jstree("destroy")},r.prototype.ShowUI=function(){SiebelAppFacade.TreeAppletPR.superclass.ShowUI.call(this);var t=this.GetPM(),n=t.Get("placeholder"),r=t.Get("root"),s=$("#s_"+t.Get("GetFullId")+"_div"),o=SiebelApp.S_App.GetDirection();e.IsTrue(SiebelApp.S_App.GetAccessibilityEnhanced())&&s.attr({role:"region",title:t.Get("LandMarkTitle")}),this.ShowCollapseExpand(),this.SetReadyState(!1),$("#"+n).bind("loaded.jstree",{ctx:this},function(e,t){
var n=e.data.ctx;n.SetReadyState(!0),l.call(n),n.IsPending()&&(n.SetPending(!1),n.BindData())}),f.call(this),$("#"+n).jstree("clear_bindingflag"),s.removeClass("siebui-form"),s.addClass(" siebui-applet siebui-tree siebui-applet-title "),i.call(this)},r.prototype.ShowCollapseExpand=function(){var n=this.GetPM(),r=n.Get("defaultAppletDisplayMode");if(r){var i=n.Get("GetAppletLabel");i!==""&&(i+=":");var s,o=SiebelApp.S_App.LocaleObject.GetLocalString("IDS_SWE_APPLET_EXPAND"),u=i+o,a=e.IsTrue(SiebelApp.S_App.IsAutoOn()),f="#s_"+n.Get("GetFullId")+"_div";s="<span class='siebui-button-secondary siebui-btn-icon-expanded'><a href='javascript:void()' role='link' tabindex='0' aria-label='"+u+"' ",a&&(s+=t.get("SWE_PROP_QTP_OT")+"='"+t.get("SWE_CTRL_LINK")+"' "+t.get("SWE_PROP_QTP_RN")+"='"+o+"' "+t.get("SWE_PROP_QTP_UN")+"='"+o+"'"),s+="></a></span>",u="",o=SiebelApp.S_App.LocaleObject.GetLocalString("IDS_SWE_APPLET_COLLAPSE"),u=i+o,s+="<span class='siebui-button-secondary siebui-btn-icon-collapsed'><a href='javascript:void()' role='link' tabindex='0' aria-label='"+u+"' ",a&&(s+=t.get("SWE_PROP_QTP_OT")+"='"+t.get("SWE_CTRL_LINK")+"' "+t.get("SWE_PROP_QTP_RN")+"='"+o+"' "+t.get("SWE_PROP_QTP_UN")+"='"+o+"'"),s+="></a></span>",$(f).find(".siebui-applet-container.siebui-collapsible").prepend(s).find(".siebui-btn-icon-"+r).hide(),r==="collapsed"&&$(f).find(".siebui-applet-content.siebui-collapsible").hide()}},r.prototype.BindEvents=function(){SiebelAppFacade.TreeAppletPR.superclass.BindEvents.call(this);var e=this.GetPM(),n=e.Get("placeholder"),r=this,i=$("#s_"+e.Get("GetFullId")+"_div");i.on("click",".siebui-applet-header.siebui-collapsible .siebui-button-secondary",{ctx:this},function(e){$(this).parents(".siebui-applet-header.siebui-collapsible").find(".siebui-button-secondary").toggle().parents(".siebui-applet:first").find(".siebui-applet-content.siebui-collapsible").slideToggle("fast","linear"),(e.data.ctx.resize||$.noop).call(e.data.ctx)}),$("#"+n).bind("reopen.jstree",function(t,r){if(e.Get("selectednode")){var i="ti_"+e.Get("selectednode").position.replace(/\./gi,"\\.");$("#"+n).jstree("select_node",i)}}),$("#"+n).bind("close_node.jstree",function(t,n){if(n.node){var r=n.node.id.split("ti_")[1];e.OnControlEvent("OnTreeEvent","CollapseTreeItem",r);var i=$("#"+n.node.id.replace(/\./gi,"\\."));i.children("a").attr("tabindex","0").focus()}}),$("#"+n).bind("open_node.jstree",function(t,i){if(i.node){var o=i.node.id.split("ti_")[1],u,a;r.IsLateBinding()&&(u=e.Get("root"),a=s.call(r,i.node.id,u),a&&(a.expand="t",h.call(r,a,n))),e.OnControlEvent("OnTreeEvent","ExpandTreeItem",o);var f=$("#"+i.node.id.replace(/\./gi,"\\."));f.children("a").attr("tabindex","0").focus()}}),$("#"+n).bind("hover_node.jstree",function(e,t){var n=$("#"+t.node.id.replace(/\./gi,"\\."));n.removeAttr("aria-selected");if(!n||!n.length)return!1;n.children("a").attr("tabindex","0").focus()}),$("#"+n).bind("dehover_node.jstree",function(e,t){var n=$("#"+t.node.id.replace(/\./gi,"\\."));n.removeAttr("aria-selected");if(!n||!n.length)return!1;n.children("a").attr("tabindex","-1")}),$("#"+n).bind("click",function(n,r){n.stopImmediatePropagation();if(n.target.nodeName==="A"){var i=!0,s=$(n.target),o;e.Get("IsActive")||(i=e.OnControlEvent(t.get("PHYEVENT_APPLET_FOCUS")));var u=s.parent("li")[0].id.split("ti_")[1];if(i){e.ExecuteMethod("SetCurrentNode",u);var a=e.Get("currentnode").type,f="";a===t.get("TREENODE_TYPE_NEXT")?f="NextTreeItem":a===t.get("TREENODE_TYPE_PREV")?f="PreviousTreeItem":f="SelectTreeItem",e.OnControlEvent("OnTreeEvent",f,u)}else s.jstree("deselect_node","[name = '"+u+"']"),o=e.Get("currentnode"),o&&s.jstree("select_node","[name = '"+o.position+"']");s=null}})},r.prototype.BindData=function(){SiebelAppFacade.TreeAppletPR.superclass.BindData.call(this);if(!this.IsReady()){this.SetPending(!0);return}SiebelJS.Debug((new Date).toLocaleString()+": Tree:BindData:begin");var t=this.GetPM(),n=t.Get("root"),r=t.Get("placeholder"),i=t.Get("nodecount");i>200?this.SetLateBinding(!0):this.SetLateBinding(!1);if(n&&n.child){var s,u;$("#"+r).find("li").length===0&&f.call(this,!1),$("#"+r).jstree("rename_node","#ti_"+n.child[0].position,n.child[0].caption);for(var a=0;a<=n.child.length-1;a++){var l=n.child[a];h.call(this,l,r);var c="ti_"+l.position.replace(/\./gi,"\\.");$("div#"+r+" ul li#"+c).children("a").attr("aria-expanded",!e.IsEmpty(l.expand)&&l.expand==="t")}s="ti_"+t.Get("selectednode").position,u=o.call(this,t.Get("selectednode").position,n),this.IsLateBinding()&&u&&h.call(this,u,r),$("#"+r).find("i").each(function(){$(this).attr({role:"presentation","aria-hidden":"true"})}),$("#"+r).find("ul").each(function(){$(this).attr("role","group")}),$("#"+r).jstree("select_node",s),s=s.replace(/\./gi,"\\."),$("#"+s).attr("role","presentation").children("a").attr("aria-selected","true").addClass("siebel-selectednode").attr("tabindex","0"),t.Get("IsActive")&&$("#"+s).children("a").focus()}else $("#"+r).jstree("delete_node","#ti_0");this.GetDefaultIcon()&&$($("#"+r).find("a").find("i")[0]).css("background-image","url("+this.GetDefaultIcon()+")").css("background-position","0 , 0"),SiebelJS.Debug((new Date).toLocaleString()+": Tree:BindData:end")},r.prototype.ShowSelection=function(){},r.prototype.SetHighlightState=function(){},r.prototype.FocusFirstControl=function(){},r.prototype.UpdateUIButtons=function(){},r}(),"SiebelAppFacade.TreeAppletPR"}));