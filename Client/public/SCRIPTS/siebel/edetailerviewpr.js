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
typeof SiebelApp.S_App.edetailerviewpr=="undefined"&&(Namespace("SiebelApp.S_App.edetailerviewpr"),define("siebel/edetailerviewpr",["siebel/viewpr","siebel/htmltmplmgr"],function(){return SiebelAppFacade.edetailerviewpr=function(){function r(e){SiebelAppFacade.edetailerviewpr.superclass.constructor.call(this,e)}function i(n){var r=n.GetPM(),i=r.Get("View"),s=r.Get("ChildComponentState"),o="#S_A"+s[0].id,u=SiebelAppFacade.ComponentMgr.FindComponent({id:r.Get("RelatedApplet")}),a=u.GetPM(),f=a.Get("GetRecordSet")[a.Get("GetSelection")],l=!0,c=!0,h="Related",p=SiebelApp.S_App.IsAutoOn(),d=p==="true"?' rn="Related_Ctrl" un="Related" ot="Button"':" ",v=p==="true"?' rn="Player_Ctrl" un="Player" ot="Button"':" ",m=p==="true"?' rn="Contacts_Ctrl" un="Contacts" ot="Button"':" ",g=p==="true"?' rn="Done_Ctrl" un="Player" ot="Button"':" ",y="Contacts",b=r.Get("ChildComponentState");f?l=!0:l=!1;var w=e.GenerateMarkup({type:t,id:h+"_Ctrl",className:l?"appletButton siebui-related-applet-btn sieble-ui-related":"appletButtonDis sieble-ui-related",value:s[1].childLabel,attrs:'data-display="'+s[1].childLabel+'" tabindex="'+"0"+'" title="'+s[1].childLabel+'" '+'aria-label="'+s[1].childLabel+'" '+d+(l===!0?" ":'disabled="disabled"')}),E=e.GenerateMarkup({type:t,id:h+"_Ctrl",className:l?"appletButton siebui-related-applet-btn sieble-ui-related":"appletButtonDis sieble-ui-related",value:s[0].childLabel,attrs:'data-display="'+s[0].childLabel+'" tabindex="'+"0"+'" title="'+s[0].childLabel+'" '+'aria-label="'+s[0].childLabel+'" '+v+(l===!0?" ":'disabled="disabled"')}),S="<span class = 'siebui-edetail-related-container'>"+E+"</span>",x="<span class = 'siebui-edetail-related-container'>"+w+"</span>";$(o).find(".siebui-applet-buttons").append(x),o="#S_A"+s[1].id,$(o).find(".siebui-applet-buttons").append(S);var T=SiebelApp.S_App.GetService("LS PCD Service"),N=SiebelApp.S_App.NewPropertySet(),C=SiebelApp.S_App.NewPropertySet(),k,L;if(T){var A={};A.async=!0,A.scope=this,A.npr=!0,A.selfbusy=!0,A.cb=function(){C=arguments[2],k=C.childArray[0].GetProperty("RetVal"),L=C.childArray[0].GetProperty("CrossIndRetVal");if(k==="Y"){SiebelApp.S_App.GetOfflineMode&&SiebelApp.S_App.GetOfflineMode()&&(L="N");if(L==="N"){var n=e.GenerateMarkup({type:t,id:y+"_Ctrl",className:c?"appletButton":"FALSE",value:s[2].childLabel,attrs:'data-display="'+s[2].childLabel+'" tabindex="'+"0"+'" title="'+s[2].childLabel+'" '+'aria-label="'+s[2].childLabel+'" '+m+(c===!0?" ":'disabled="disabled"')}),r="<span class = 'AppletButtons siebui-add'>"+n+"</span>";$("#S_A"+b[0].id).find(".siebui-applet-buttons").append(r)}var i=e.GenerateMarkup({type:t,id:"Done_Ctrl",className:c?"appletButton":"FALSE",value:s[0].childLabel,attrs:'data-display="'+s[0].childLabel+'" tabindex="'+"0"+'" title="'+s[0].childLabel+'" '+'aria-label="'+s[0].childLabel+'" '+g+(c===!0?" ":'disabled="disabled"')}),o="<span class = 'siebui-ctrl-btn siebui-icon-done'>"+i+"</span>";$("#S_A"+b[2].id).find(".siebui-btn-grp-applet").prepend(o)}},T.InvokeMethod("GeteDetailingSysPref",N,A)}}var e=SiebelJS.Dependency("SiebelAppFacade.HTMLTemplateManager"),t="Button",n=SiebelJS.Dependency("SiebelApp.Constants");return SiebelJS.Extend(r,SiebelAppFacade.ViewPR),r.prototype.Init=function(){SiebelAppFacade.edetailerviewpr.superclass.Init.call(this),this.AttachPMBinding("ComponentStateChange",this.ComponentDisplay),this.AttachPMBinding("ButtonCanInvoke",this.RelItmCanInvoke)},r.prototype.ShowUI=function(){SiebelAppFacade.edetailerviewpr.superclass.ShowUI.call(this);var e=[],t=[];e=$("[id^=s_S_A]");for(var n=0;n<e.length;n++)t[n]="#"+e[n].id;this.GetPM().ExecuteMethod("PrepareStateInfo",t),i(this)},r.prototype.RelItmCanInvoke=function(){var n=SiebelAppFacade.ComponentMgr.FindComponent({id:this.GetPM().Get("RelatedApplet")}),r=n.GetPM(),i=r.Get("GetRecordSet")[r.Get("GetSelection")],s=!0;i?s=!0:s=!1;var o=this.GetPM().Get("ChildComponentState"),u="#S_A"+o[0].id,a="Related",f=SiebelApp.S_App.IsAutoOn(),l=f==="true"?' rn="Related_Ctrl" un="Related" ot="Button"':" ",c=f==="true"?' rn="Player_Ctrl" un="Player" ot="Button"':" ",h=e.GenerateMarkup({type:t,id:a+"_Ctrl",className:s?"appletButton siebui-related-applet-btn sieble-ui-related":"appletButtonDis sieble-ui-related",value:o[1].childLabel,attrs:'data-display="'+o[1].childLabel+'" tabindex="'+"0"+'" title="'+o[1].childLabel+'" '+'aria-label="'+o[1].childLabel+'" '+l+(s===!0?" ":'disabled="disabled"')}),p=e.GenerateMarkup({type:t,id:a+"_Ctrl",className:s?"appletButton siebui-related-applet-btn sieble-ui-related":"appletButtonDis sieble-ui-related",value:o[0].childLabel,attrs:'data-display="'+o[0].childLabel+'" tabindex="'+"0"+'" title="'+o[0].childLabel+'" '+'aria-label="'+o[0].childLabel+'" '+c+(s===!0?" ":'disabled="disabled"')}),d="<span class = 'siebui-edetail-related-container'>"+p+"</span>",v="<span class = 'siebui-edetail-related-container'>"+h+"</span>";$(u).find(".siebui-edetail-related-container").replaceWith(v),u="#S_A"+o[1].id,$(u).find(".siebui-edetail-related-container").replaceWith(d)},r.prototype.ComponentDisplay=function(e,t){var n="#s_S_A"+e+"_div",r="a_"+e,i=SiebelAppFacade.ComponentMgr.FindComponent({id:this.GetPM().Get("RelatedApplet")}),s=i.GetPM();t===!0?($(n).parent().show(),s.GetRenderer().BindData()):t===!1&&$(n).parent().hide(),$(".siebui-view-multi-column").remove()},r.prototype.BindEvents=function(){var e=this,t=this.id,n=e.GetPM().Get("ChildComponentState");$("#s_svctrl_div").hide(),$(".sieble-ui-related").bind("click",{ctx:this},function(t){var n=t.data.ctx.GetPM();n.OnControlEvent("TabClick",this.id);var r=SiebelAppFacade.ComponentMgr.FindComponent({id:n.Get("PlayerApplet")}),i=SiebelAppFacade.ComponentMgr.FindComponent({id:n.Get("RelatedApplet")}),s=e.GetPM().Get("ChildComponentState"),o=r.GetPM(),u=i.GetPM(),a=u.Get("GetRecordSet").length,f=new Date,l=SiebelApp.S_App.GetService("LS PCD Service");if(s[0].displayState===!1){n.AddProperty("Mode","Related"),n.AddProperty("visited","N"),i.GetPR().ShowSelection(),i.GetPR().CanInvokeNavBar
(u);var c={};c.async=!0,c.scope=this,c.npr=!0,c.selfbusy=!0,c.cb=function(){var e=f.getMonth()+1+"/"+f.getDate()+"/"+f.getFullYear()+" "+f.getHours()+":"+f.getMinutes()+":"+f.getSeconds();n.AddProperty("RelatedStartTime",e),u.ExecuteMethod("SetSesRecData")};if(l){var h="",p=o.ExecuteMethod("GetSesRecData"),d=n.Get("PlayerStartTime"),v=SiebelApp.S_App.NewPropertySet();v.SetProperty("MpiId",p.MpiId),v.SetProperty("StartTime",d),v.SetProperty("ThumbnailPath",p.ThumbnailPath),v.SetProperty("EndTime",h),v.SetProperty("ParentMPId",p.ParentMPId),v.SetProperty("ItemName",p.ItemName),v.SetProperty("ParentMPName",p.ParentMPName),v.SetProperty("ParentDsblMsgResponse",p.ParentDsblMsgResponse),v.SetProperty("LitFileExt",p.LitFileExt),v.SetProperty("LitFileRev",p.LitFileRev),v.SetProperty("LiteratureId",p.LiteratureId),v.SetProperty("ThumbnailExtension",p.ThumbnailExtension),v.SetProperty("ThumbnailId",p.ThumbnailId),v.SetProperty("ThumbnailRevId",p.ThumbnailRevId),n.Get("UpdatePlayer")==="N"?v.SetProperty("Mode","INSERT"):v.SetProperty("Mode","UPDATE"),n.AddProperty("LastUpdatedRec",p.MpiId),n.AddProperty("UpdatePlayer","N"),l.InvokeMethod("LogMsgPlanItemSesResponse",v,c)}}else{u.ExecuteMethod("SetSesRecData");var v=SiebelApp.S_App.NewPropertySet();r.GetPR().CanInvokeNavBar(o);if(l){var h=f.getMonth()+1+"/"+f.getDate()+"/"+f.getFullYear()+" "+f.getHours()+":"+f.getMinutes()+":"+f.getSeconds(),m=u.ExecuteMethod("GetSesRecData"),d=n.Get("RelatedStartTime");v.SetProperty("MpiId",m.MpiId),v.SetProperty("StartTime",d),v.SetProperty("ThumbnailPath",m.ThumbnailPath),v.SetProperty("EndTime",h),v.SetProperty("ParentMPId",m.ParentMPId),v.SetProperty("ItemName",m.ItemName),v.SetProperty("ParentMPName",m.ParentMPName),v.SetProperty("ParentDsblMsgResponse",m.ParentDsblMsgResponse),v.SetProperty("Mode","INSERT"),v.SetProperty("LitFileExt",m.LitFileExt),v.SetProperty("LitFileRev",m.LitFileRev),v.SetProperty("LiteratureId",m.LiteratureId),v.SetProperty("ThumbnailExtension",m.ThumbnailExtension),v.SetProperty("ThumbnailId",m.ThumbnailId),v.SetProperty("ThumbnailRevId",m.ThumbnailRevId),n.AddProperty("LastUpdatedRec",m.MpiId),o.ExecuteMethod("SetSesRecData"),n.AddProperty("Mode","Player"),n.AddProperty("UpdatePlayer","Y"),l.InvokeMethod("LogMsgPlanItemSesResponse",v)}}}),$(document).undelegate("#Contacts_Ctrl","click"),$(document).delegate("#Contacts_Ctrl","click",{ctx:this},function(e){$(".siebui-thread").hide(),$("#S_A"+n[0].id).hide(),$("#S_A"+n[1].id).hide(),$("#s_S_A"+n[2].id+"_div").removeClass("siebui-addcontact-applet"),$("#S_A"+n[2].id).show(),$(".siebui-form-applet-header").removeClass("siebui-view-player-top"),$("#Done_Ctrl").on("click",{ctx:this},function(e){$("#S_A"+n[2].id).hide(),$("#s_S_A"+n[2].id+"_div").addClass("siebui-addcontact-applet"),$("#S_A"+n[0].id).show(),$(".siebui-form-applet-header").addClass("siebui-view-player-top")})})},r}(),"SiebelAppFacade.edetailerviewpr"}()));
