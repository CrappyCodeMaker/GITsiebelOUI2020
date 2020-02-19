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
typeof SiebelAppFacade.AutoKWDRenderer=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.AutoKWDRenderer"),define("siebel/autokwdrenderer",["siebel/phyrenderer"],function(){return SiebelAppFacade.AutoKWDRenderer=function(){function f(e){SiebelAppFacade.AutoKWDRenderer.superclass.constructor.call(this,e)}function l(){var e=this.GetPM(),t=e.Get("GetControls");for(var r in t)if(t.hasOwnProperty(r)){var i=t[r],s=i.GetName();i.GetUIType()!==n&&s!=="Description"&&s!=="Keyword"&&s!=="Paste Attr"&&s!=="Help Text"&&s!=="Test Step Sequence"&&s!=="Screen Shot Flag"&&this.GetUIWrapper(t[i.GetName()]).GetEl().parents("tr").hide()}}function c(){var e=this.GetPM(),t=e.Get("GetControls"),n=null,r=e.Get("objRnAlias");if(r){var i=r.length;for(var s=0;s<i;s++){n=t["RN"+(s+1)];var o=this.GetUIWrapper(t[n.GetName()]).GetEl();o.parents("tr").show(),o.parents("tr").find("#"+n.GetName()+"_Label").empty().append('<span id="RN1_Label">'+r[s]+"</span>")}}}function h(){var e=this.GetPM(),t=e.Get("GetControls");e.Get("rowNum").toString()==="Y"&&(ctrl=t["Row Number"],this.GetUIWrapper(t[ctrl.GetName()]).GetEl().parents("tr").show())}function p(){var e=this.GetPM(),t=e.Get("GetControls"),n=null,r=e.Get("inputs");if(r){var i=r.length;for(var s=0;s<i;s++){var n=t["Input"+(s+1)],u=this.GetUIWrapper(t[n.GetName()]).GetEl();if(r[s].search(o)>-1){var a=r[s].split(o),f=t["Value"+(s+1)],l=this.GetUIWrapper(t[f.GetName()]),c=l.GetEl();r[s]=a[0],c.parents("tr").show(),c.show(),l.SetValue(""),c.parents("tr").find("#"+f.GetName()+"_Label").empty().append('<span id=\u200b"inputs">\u200b'+a[1]+"</span>")}u.parents("tr").show(),u.show(),u.nextAll().remove(),u.removeAttr("placeholder"),u.parents("tr").find("#"+n.GetName()+"_Label").empty().append('<span id=\u200b"inputs">\u200b'+r[s]+"</span>"),typeof u.autocomplete()&&u.autocomplete().length>0&&u.autocomplete("destroy")}}}function d(){var e=this.GetPM(),t=e.Get("GetControls"),n=e.Get("lovs"),i=e.Get("inputs");if(n){var o=n,f=o.length,l=i.length;for(var c=0;c<l;c++)for(var h=0;h<f;h++){var p=o[h].split(u),d=p[0],v=p[1].split(a),m,g=i[c],y="Input"+(c+1);if(g===d){m=t[y];var b=this.GetUIWrapper(t[m.GetName()]).GetEl();v.unshift(""),b.nextAll().remove(),s.EnhanceMarkup({el:b,type:r,id:m.GetInputName()+"_Ctrl",className:"siebui-ctrl-select",value:v}),this.GetPM().ExecuteMethod("CanUpdate",m.GetName())&&(b.autocomplete({source:v,appendTo:b.parents("#_sweview").length?"#_sweview":null,autoFocus:!0,delay:170}).autocomplete("option","position",{my:"center top",at:"center bottom",of:b,collision:"flipfit flipfit"}),b.next("span.siebui-icon-dropdown").bind("click",{ctx:this,ctrl:m,lovVal:v},function(e){var n=e.data.ctrl,r=e.data.lovVal,i=e.data.ctx.GetUIWrapper(t[n.GetName()]).GetEl();i.autocomplete("option","source",r),setTimeout(function(){i.autocomplete("option","minLength",0),i.autocomplete("widget").not(":hidden").length===0&&i.autocomplete("search",""),i.autocomplete("option","autoFocus",!0).autocomplete("option","minLength",1),i.focus(),i=null},0)}))}}}}function v(){var e=this.GetPM(),t=e.Get("GetControls"),r=e.Get("mulInputs"),i=e.Get("inputs");if(r){var o=i.length,u=r.length;for(var a=0;a<o;a++)for(var f=0;f<u;f++){var l=r[f],c=i[a],h="Input"+(a+1);if(l===c){var p=t[h],d=t["Multiple Input"+(a+1)],v=this.GetUIWrapper(t[d.GetName()]),m=this.GetUIWrapper(t[p.GetName()]).GetEl(),g=v.GetEl(),y,b;g.parents("tr").show(),v.SetValue(""),y=s.GenerateMarkup({type:n,id:"Ctrl_Add_"+h,className:"appletButton",value:"+"}),b=s.GenerateMarkup({type:n,id:"Ctrl_Done_"+h,className:"appletButton",value:"Done"}),m.nextAll().remove(),m.after(y),g.nextAll().remove(),g.after(b),this.GetPM().ExecuteMethod("CanUpdate",p.GetName())||(m.next().addClass("appletButtonDis"),g.next().addClass("appletButtonDis"))}}}}function m(){var e=this.GetPM();if(e.Get("endAction")){var t=this.GetUIWrapper(e.Get("GetControls")["End Action"]).GetEl();$(t).parents("tr").show()}}function g(){var e=this.GetPM(),t=e.Get("GetControls"),n=e.Get("pasteAttr"),r=SiebelApp.S_App.PluginBuilder.GetHoByName("EventHelper"),i=e.Get("inputs");if(n){var s=i.length,o=n.length;for(var u=0;u<s;u++)for(var a=0;a<o;a++){var f="Input"+(u+1),l=t[f],c=i[u],h=n[a],p=this.GetUIWrapper(l).GetEl();p.removeAttr("Paste Attribute"),c===h&&(p.attr("placeholder","Paste Attribute"),p.off("blur"),r.Manage(p,"blur",{ctx:this,ctrl:t[l.GetName()]},S))}}}function y(e){var t=e.data.ctx,n=e.data.ctrV,r=t.GetUIWrapper(n),i=r.GetValue();if(i!==""){var s=i.split(a),o=t.GetPM(),f=o.Get("GetControls"),l=o.Get("objRnAlias"),c=l.length;if(l&&i.indexOf(a)>0)for(var h=0;h<c;h++)for(j=0;j<=3;j++)if(s[j]&&s[j].search(u)>0&&l[h]===s[j].split(u)[0]){var p=f["RN"+(h+1)],d=t.GetUIWrapper(p).GetEl();o.ExecuteMethod("SetActiveControl",p),t.GetUIWrapper(p).SetValue(s[j].split(u)[1]),d.trigger("blur");break}o.ExecuteMethod("SetActiveControl",n),r.SetValue(""),r.OnControlEvent(consts.get("PHYEVENT_CONTROL_BLUR"),n,"")}}function b(e){var t=e.data.ctrV,n=t.GetName(),r=e.data.ctx,i=r.GetUIWrapper(t),s=i.GetValue(),o=r.GetPM(),u=r.GetUIWrapper(o.Get("GetControls")["Input"+n.substring(n.length-1)]);if(s!==""){var a=u.GetValue()==""?s:u.GetValue()+"|"+s;o.ExecuteMethod("SetActiveControl",u.control),u.SetValue(a),u.GetEl().trigger("blur"),o.ExecuteMethod("SetActiveControl",i.control),i.SetValue(""),i.GetEl().trigger("blur")}}function w(e){var t=e.data.ctx,n=t.GetPM(),r=n.Get("GetControls"),i=$(this).attr("id").substring($(this).attr("id").length-1),s=t.GetUIWrapper(r["Input"+i]),o=t.GetUIWrapper(r["Multiple Input"+i]),u=s.GetValue();InpMEleVlue=o.GetValue(),u!==""&&(InpMEleVlue=InpMEleVlue===""?u:InpMEleVlue+","+u),o.SetValue(InpMEleVlue),s.SetValue(""),s.GetEl().focus()}function E(e){var n=e.data.ctx,r=n.GetPM(),i=r.Get("GetControls"),s=$(this).attr("id").substring($(this).attr("id").length-1),o=n.GetUIWrapper(i["Input"+s]),u=n.GetUIWrapper(i["Multiple Input"+s]),a,f=u.GetValue(),l=o.GetValue(),c=o.GetEl();r.ExecuteMethod("SetActiveControl",i["Input"+s]),a=l===""?f:f===""?l:f+","+l,o.SetValue(a),c.trigger
("blur"),u.SetValue(""),$(this).addClass("appletButtonDis"),c.nextAll("button").addClass("appletButtonDis"),o.SetState(t.get("EDITABLE"),!1),u.SetState(t.get("EDITABLE"),!1),n.GetUIWrapper(i["Value"+s]).SetState(t.get("EDITABLE"),!1)}function S(e){var t=e.data.ctrl,n=e.data.ctx,r=n.GetUIWrapper(t);if($(this).attr("placeholder")==="Paste Attribute"){var i=r.GetValue().split(a),s=r.GetValue();i.length>=4&&i[3]!==""&&i[3].search(u)>0&&(s=i[3].split(u)[1]),n.GetPM().ExecuteMethod("SetActiveControl",t),r.SetValue(s),r.OnControlEvent(consts.get("PHYEVENT_CONTROL_BLUR"),t,s)}else n.GetPM().ExecuteMethod("SetActiveControl",t),r.SetValue($(this).val()),r.OnControlEvent(consts.get("PHYEVENT_CONTROL_BLUR"),t,$(this).val())}var e=SiebelJS.Dependency("SiebelApp.Utils"),t=SiebelJS.Dependency("SiebelApp.Constants"),n=t.get("SWE_PST_BUTTON_CTRL"),r=t.get("SWE_CTRL_COMBOBOX"),i=t.get("SWE_CTRL_TEXT"),s=SiebelJS.Dependency("SiebelAppFacade.HTMLTemplateManager"),o=":-",u="::",a="|";return SiebelJS.Extend(f,SiebelAppFacade.PhysicalRenderer),f.prototype.Init=function(){SiebelAppFacade.AutoKWDRenderer.superclass.Init.call(this),this.AttachPMBinding("objRnAlias",c,{scope:this}),this.AttachPMBinding("inputs",p,{scope:this}),this.AttachPMBinding("mulInputs",v,{scope:this}),this.AttachPMBinding("lovs",d,{scope:this}),this.AttachPMBinding("endAction",m,{scope:this}),this.AttachPMBinding("pasteAttr",g,{scope:this}),this.AttachPMBinding("rowNum",h,{scope:this}),this.AttachPMBinding("definitionChanged",l,{scope:this})},f.prototype.ShowUIControl=function(e){SiebelAppFacade.AutoKWDRenderer.superclass.ShowUIControl.call(this,e);if(e.GetUIType()!==n){var t=e.GetName();if(t!=="Description"&&t!=="Keyword"&&t!=="Paste Attr"&&t!=="Help Text"&&t!=="Test Step Sequence"&&t!=="Screen Shot Flag"){var r=this.GetUIWrapper(e).GetEl();r.parents("tr").hide()}}},f.prototype.SetControlValue=function(e,t,n){SiebelAppFacade.AutoKWDRenderer.superclass.SetControlValue.call(this,e,t,n);if(e.GetName()==="Keyword Def"){var r=this.GetPM(),i=t.split("&&");if(i=="")return;function s(e){return i[e].split("#")[1]===""||i[e].split("#")[1]===undefined?null:i[e].split("#")[1].split("|^")}r.SetProperty("definitionChanged",t),r.SetProperty("objRnAlias",s(0)),r.SetProperty("inputs",s(1)),r.SetProperty("mulInputs",s(2)),r.SetProperty("lovs",s(3)),r.SetProperty("endAction",s(4)),r.SetProperty("pasteAttr",s(5)),r.SetProperty("rowNum",s(6))}},f.prototype.BindControlEvents=function(e){SiebelAppFacade.AutoKWDRenderer.superclass.BindControlEvents.call(this,e);var t=e.GetName(),n=SiebelApp.S_App.PluginBuilder.GetHoByName("EventHelper"),r=$("#s_"+this.GetPM().Get("GetFullId")+"_div");handlerMethod=null;switch(t){case"Paste Attr":handlerMethod=y;break;case"Value1":case"Value2":case"Value3":handlerMethod=b;break;case"Input1":case"Input2":case"Input3":n.Manage(r,"click",{ctx:this},w,"#Ctrl_Add_"+t),n.Manage(r,"click",{ctx:this},E,"#Ctrl_Done_"+t)}handlerMethod&&n.Manage(this.GetUIWrapper(e).GetEl(),"blur",{ctx:this,ctrV:e},handlerMethod)},f.prototype.GetPhysicalControlValue=function(e){if(e.GetName().search("Value")===0){var t=this.GetPM();$(document.activeElement).trigger("blur"),t.SetProperty("PhysicalCtrlVal",t.ExecuteMethod("GetFormattedFieldValue",e)),t.ExecuteMethod("SetActiveControl",null)}else SiebelAppFacade.AutoKWDRenderer.superclass.GetPhysicalControlValue.call(this,e)},f.prototype.EndLife=function(){SiebelAppFacade.AutoKWDRenderer.superclass.EndLife.call(this)},f}(),"SiebelAppFacade.AutoKWDRenderer"}));