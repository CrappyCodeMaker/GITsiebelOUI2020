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
typeof SiebelAppFacade.ParametricSearchRenderer=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.ParametricSearchRenderer"),define("siebel/parametricsearchrenderer",["siebel/phyrenderer"],function(){return SiebelAppFacade.ParametricSearchRenderer=function(){function t(e){SiebelAppFacade.ParametricSearchRenderer.superclass.constructor.call(this,e)}function n(){var t=this.GetPM(),n=t.Get("SpanInnerHTML"),r=$("#S_A"+t.Get("GetId")),i="",s=SiebelApp.S_App.IsAutoOn();n!==""&&r.html(n);var o=t.Get("SpanInnerHTML_IS_OK");if(o)o=!1,t.SetProperty("SpanInnerHTML_IS_OK",o);else{var u=t.ExecuteMethod("GetFieldDefs","Dummy");for(var a in u)if(u.hasOwnProperty(a)){var f=$(r).find("[id=ord_"+a+"]");f.val(u[a])}}var l=$("#S_A"+t.Get("GetId")).find("[class=minibuttonOn]").find("a"),c=l.length;for(var h=0;h<c;h++){var p=l.get(h),d=/InvokeMethod[^,]+?,(\"|\&quot\;)([^\"\&]+?)(\"|\&quot\;),(\"|\&quot\;)([^\"\&]+?)(\"|\&quot\;)/,v=p.outerHTML.match(d);v&&(i=" mthbtn=\"'"+v[2]+", "+v[5]+"'\""),s==="true"&&(i+='ot = "Button" rn = "'+v[2]+'" un = "'+v[2]+'"'),$(p).replaceWith(SiebelAppFacade.HTMLTemplateManager.GenerateMarkup({type:e.get("SWE_PST_BUTTON_CTRL"),value:$(p).text(),attrs:i}))}if(s==="true"){var m=$(r).find("[name='DisplayName']");m.attr("ot","JcomboBox"),m.attr("rn","SelectProductFamily"),m.attr("un","SelectProductFamily");var u=t.ExecuteMethod("GetFieldDefs","Dummy");for(var a in u)if(u.hasOwnProperty(a)){var g=$(r).find("[id=ord_"+a+"]");g.attr("ot","JText"),g.attr("rn",a),g.attr("un",a)}}$(r).closest("div[class*='siebui-catalogview-table']").addClass("siebui-searchview-table").removeClass("siebui-catalogview-table")}function r(){var e=this.GetPM(),t=$("#S_A"+e.Get("GetId")),n=e.ExecuteMethod("GetFieldDefs","Dummy");for(var r in n)n.hasOwnProperty(r)&&$(t).find("[id=ord_"+r+"]").unbind();var i=$(t).find("[name='DisplayName']"),s=i.length;for(var o=0;o<s;o++){var u=i.get(o),a=/ChangeSelectTag[^,]+[^;]+;([^"&]+)/,f=u.outerHTML.match(a);f&&$(u).removeAttr("onchange").bind("change",{ctx:this},function(t){e.OnControlEvent("EventOnChangeSelectTag",f[1],this.value)})}var l=$(t).find("[id^=ord]");l.bind("change",{ctx:this},function(e){e.data.ctx.GetPM().OnControlEvent("SearchUpdateFieldValue",e.target.name,e.target.value)}),l.bind("keydown",{ctx:this},function(t){t.keyCode==13&&(t.data.ctx.GetPM().OnControlEvent("SearchUpdateFieldValue",t.target.name,t.target.value),e.OnControlEvent("EventInvokeMethod","Search","Dummy"))}),$(t).find("button[mthbtn]").each(function(){$(this).unbind();var t=/ mthbtn=([^"]*?)"'([^,]+),\s*([^']+)'"/,n=this.outerHTML.match(t);n&&$(this).bind("click",{ctx:this},function(t){e.OnControlEvent("EventInvokeMethod",n[2],n[3])})})}function i(){this.GetPM().ExecuteMethod("SearchPurgeFieldValues");var e=this.GetPM(),t=$("#S_A"+e.Get("GetId")),n=$(t).find("[id^=ord]");n.each(function(t){var r=n.eq(t);r.val()!==""&&e.ExecuteMethod("SearchUpdateFieldValue",r.attr("name"),r.val())})}var e=SiebelJS.Dependency("SiebelApp.Constants");return SiebelJS.Extend(t,SiebelAppFacade.PhysicalRenderer),t.prototype.Init=function(){SiebelAppFacade.ParametricSearchRenderer.superclass.Init.call(this),this.AttachPMBinding("PopulateNeeded",function(){!0===this.GetPM().Get("PopulateNeeded")&&(this.ShowUI(),this.BindEvents(),this.BindData())})},t.prototype.BindEvents=function(){SiebelAppFacade.ParametricSearchRenderer.superclass.BindEvents.call(this),r.call(this)},t.prototype.BindData=function(){SiebelAppFacade.ParametricSearchRenderer.superclass.BindData.call(this),i.call(this)},t.prototype.ShowUI=function(){SiebelAppFacade.ParametricSearchRenderer.superclass.ShowUI.call(this),n.call(this)},t}(),"SiebelAppFacade.ParametricSearchRenderer"}));
