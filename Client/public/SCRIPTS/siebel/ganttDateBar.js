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
typeof SiebelAppFacade.GanttDateBar=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.GanttDateBar"),SiebelAppFacade.GanttDateBar=function(){function S(){}function x(e){var n=e.data.ctx.pm,r=n.Get("GetFullId");localizedValue=s.GetStringFromDateTime(n.Get(t),i,a),$(this).hide(),$("#s_"+r+"_div").find("#ganttdatePicker").val(localizedValue).show().focus(),n.SetProperty("InEvent",!0)}function T(e){var t=e.data.ctx.pm,n=t.Get("GetFullId");t.SetProperty("InEvent",!0),$(this).hide(),$("#s_"+n+"_div").find("#ganttDateLbl").show()}function N(e){if(e.type==="change"||e.type==="keypress"&&e.which===13){var t=e.data.ctx.pm,n=t.Get("GetFullId");lpcsa=e.data.lpcsa,nDate=s.GetStringFromDateTime($(this).val(),a,i),DateSep=s.GetDispDateSeparator(),t.SetProperty("InEvent",!0);while(DateSep!="/"&&nDate.indexOf(DateSep)!=-1)nDate=nDate.replace(DateSep,"/");nDate===""&&$(this).val()!==""?(SiebelApp.S_App.ErrorObject.SetErrorMsg("LocaleErrFormattedToString",$(this).val()),SiebelApp.S_App.ErrorObject.ProcessError()):(t.ExecuteMethod("RefreshGanttChart",nDate,null,lpcsa),$(this).hide(),$("#s_"+n+"_div").find("#ganttDateLbl").show())}}function C(e){var t=e.data.lpcsa,n=e.data.ctx.pm;n.SetProperty("InEvent",!0),n.ExecuteMethod("RefreshGanttChart",0,null,t)}function k(e){var n=e.data.ctx,i=n.pm,s=e.data.lpcsa,o=e.data.nav,u=new Date(i.Get(t));switch(o){case"Next":u.setDate(u.getDate()+n.NextPrev);break;case"Prev":u.setDate(u.getDate()-n.NextPrev);break;case"NextSet":u.setDate(u.getDate()+n.NextPrevSet);break;case"PrevSet":u.setDate(u.getDate()-n.NextPrevSet);break;default:}i.SetProperty("InEvent",!0),i.ExecuteMethod("RefreshGanttChart",u.format(r),null,s)}var e=SiebelJS.Dependency("SiebelApp.Constants"),t=e.get("SWE_GANTT_START_DATE"),n=e.get("SWE_GANTT_TIME_SCALE"),r="MM/dd/yyyy",i="MM/DD/YYYY",s=SiebelApp.S_App.LocaleObject,o=s.GetLocalString("IDS_TNT_DATE_INPUT_TOOLTIP"),u=s.GetLocalString("IDS_TNT_DATE_CAL_TOOLTIP"),a=s.GetDateFormat(),f=s.GetLocalString("IDS_SWE_DATEPICKER_CURRENT_TEXT"),l=s.GetLocalString("IDS_TNT_PREV_DAY_TOOLTIP"),c=s.GetLocalString("IDS_TNT_NEXT_DAY_TOOLTIP"),h=s.GetLocalString("IDS_TNT_PREV_WEEK_TOOLTIP"),p=s.GetLocalString("IDS_TNT_NEXT_WEEK_TOOLTIP"),d=s.GetLocalString("IDS_CALENDAR_PREVIOUS_MONTH_STRING"),v=s.GetLocalString("IDS_CALENDAR_NEXT_MONTH_STRING"),m=s.GetLocalString("IDS_TNT_PREV_DAY_TOOLTIP"),g=s.GetLocalString("IDS_CALENDAR_NEXT_YEAR_STRING"),y=s.GetLocalString("IDS_CALENDAR_PREVIOUS_YEAR_STRING"),b={7:h,1:m,30:d,31:d,365:y,35:d},w={7:p,1:c,30:v,31:v,365:g,35:v},E=e.get("SWE_PST_BUTTON_CTRL");return S.prototype.ShowUI=function(n,r){var i,s,o,u=SiebelApp.S_App.IsAutoOn(),a;this.pm=n,o=this.pm.Get("GetFullId"),r&&(i='<div class = "siebui-buttonBar">',a="name = '"+o+"todayButton' title = '"+f+"' aria-labelledby = '"+f+"'",u==="true"&&(a+=" ot = 'Button' rn = '"+f+"' un = 'DB "+f+"'"),i+=SiebelAppFacade.HTMLTemplateManager.GenerateMarkup({type:E,className:" siebui-todayButton",value:f,id:o+"todayButton",attrs:a}),a="aria-labelledby = 'Previous Set' title='Previous Set'",u==="true"&&(a+=" ot = 'Button' rn = 'Previous Set' un = 'DB Previous Set'"),i+=SiebelAppFacade.HTMLTemplateManager.GenerateMarkup({type:E,className:"siebui-buttonBar-button siebui-prevSetButton",id:o+"prevSetButton",attrs:a}),a="aria-labelledby = 'Previous Day' title='Previous Day'",u==="true"&&(a+=" ot = 'Button' rn = 'Previous Day' un = 'DB Previous Day'"),i+=SiebelAppFacade.HTMLTemplateManager.GenerateMarkup({type:E,className:"siebui-buttonBar-button siebui-prevButton",id:o+"prevButton",attrs:a}),i+='<span class="siebui-ganttDate">',a="",u==="true"&&(a+=" ot = 'label' rn = 'DateLabel' un = 'DB DateLabel'"),i+=SiebelAppFacade.HTMLTemplateManager.GenerateMarkup({type:e.get("SWE_CTRL_LABEL"),className:"siebui-dateRange",value:n.ExecuteMethod("getDateRange",""),id:"ganttDateLbl",attrs:a}),a="title='Click to Enter Date' aria-labelledby='Click to Enter Date'",u==="true"&&(a+=" ot = 'JDatePick' rn = 'Start Date' un = 'DB Start Date'"),i+=SiebelAppFacade.HTMLTemplateManager.GenerateMarkup({type:e.get("SWE_CTRL_TEXT"),className:"siebui-dateInput siebui-input-popup",value:n.Get(t),id:"ganttdatePicker",attrs:a}),i+="</span>",a="aria-labelledby = 'Next Day' title='Next Day'",u==="true"&&(a+=" ot = 'Button' rn = 'Next Day' un = 'DB Next Day'"),i+=SiebelAppFacade.HTMLTemplateManager.GenerateMarkup({type:E,className:"siebui-buttonBar-button siebui-nextButton",id:o+"nextButton",attrs:a}),a="aria-labelledby = 'Next Set' title='Next Set'",u==="true"&&(a+=" ot = 'Button' rn = 'Next Set' un = 'DB Next Set'"),i+=SiebelAppFacade.HTMLTemplateManager.GenerateMarkup({type:E,className:"siebui-buttonBar-button siebui-nextSetButton",id:o+"nextSetButton",attrs:a}),i+="</div>",r.append(i),$("#s_"+o+"_div").find("#ganttdatePicker").hide())},S.prototype.BindEvents=function(){var e=this,t=e.pm,n=t.Get("GetFullId"),r,i,s,o="Click to Enter Date",a=t.Get("RTL Mode"),f={mask:!0},l=SiebelApp.S_App.PluginBuilder.GetHoByName("EventHelper"),c=$("#s_"+n+"_div").find("#ganttDateLbl");l&&c.length&&l.Manage(c,"click",{ctx:this},x),$("#s_"+n+"_div").find("#ganttdatePicker").datepicker({showOn:"button",buttonImage:"images/calPicker_icon.gif",buttonImageOnly:!0,buttonText:u,isRTL:t.Get("RTL Mode")==="Y",changeMonth:!0,changeYear:!0,onSelect:function(){t.SetProperty("InEvent",!0),t.ExecuteMethod("RefreshGanttChart",$(this).val(),null,f),$(this).datepicker("hide")}});var h=$("#s_"+n+"_div").find("#ganttdatePicker");l&&h.length&&(l.Manage(h,"blur",{ctx:this},T),l.Manage(h,"change",{ctx:this,lpcsa:f},N),l.Manage(h,"keypress",{ctx:this,lpcsa:f},N));var p=$("#s_"+n+"_div").find("#"+n+"todayButton");l&&p.length&&l.Manage(p,"click",{ctx:this,lpcsa:f},C);var d=$("#s_"+n+"_div").find("#"+n+"nextButton");l&&d.length&&l.Manage(d,"click",{ctx:this,lpcsa:f,nav:"Next"},k);var v=$("#s_"+n+"_div").find("#"+n+"nextSetButton");l&&v.length&&l.Manage(v,"click",{ctx:this,lpcsa:f,nav:"NextSet"},k);var m=$("#s_"+n+"_div").find("#"+n+"prevButton");l&&m.length&&l.Manage(m,"click"
,{ctx:this,lpcsa:f,nav:"Prev"},k);var g=$("#s_"+n+"_div").find("#"+n+"prevSetButton");l&&g.length&&l.Manage(g,"click",{ctx:this,lpcsa:f,nav:"PrevSet"},k)},S.prototype.setNavigationValues=function(){var e=this.pm.Get("TST"),t=this.pm.Get("DateBar Navigation TS"),n=this.pm.Get("GetFullId"),r;t&&e&&(t=";"+t,e=";"+e+":",r=t.substring(t.indexOf(e)+e.length,t.indexOf(";",t.indexOf(e)+e.length)),this.NextPrev=r?Number(r.substring(0,r.indexOf(","))):"",this.NextPrevSet=r?Number(r.substring(r.indexOf(",")+1,r.length)):""),$("#s_"+n+"_div").find("#"+n+"prevSetButton").attr("aria-labelledby",b[this.NextPrevSet]).attr("title",b[this.NextPrevSet]),$("#s_"+n+"_div").find("#"+n+"prevButton").attr("aria-labelledby",b[this.NextPrev]).attr("title",b[this.NextPrev]),$("#s_"+n+"_div").find("#"+n+"nextSetButton").attr("aria-labelledby",w[this.NextPrevSet]).attr("title",w[this.NextPrevSet]),$("#s_"+n+"_div").find("#"+n+"nextButton").attr("aria-labelledby",w[this.NextPrev]).attr("title",w[this.NextPrev])},S}());