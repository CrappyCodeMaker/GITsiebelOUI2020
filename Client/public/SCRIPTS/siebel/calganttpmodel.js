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
typeof SiebelAppFacade.CalGanttPM=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.CalGanttPM"),define("siebel/calganttpmodel",["siebel/ganttpmodel"],function(){return SiebelAppFacade.CalGanttPM=function(){function St(){SiebelAppFacade.CalGanttPM.superclass.constructor.apply(this,arguments),this.SetProperty("Color Display By","STATUS")}function xt(e,t,n){var r=this.Get(o),i=this.Get("TST"),s=SiebelApp.S_App.NewPropertySet(),u=0;u|=2,u|=4,u|=8,u|=16,this.SetProperty("PanesToRefresh",u),s.SetProperty("PanesToRefresh",u),typeof e!="undefined"&&(e!==0&&this.SetProperty(o,e),s.SetProperty(o,e)),t&&this.SetProperty("TST",t),this.ExecuteMethod("InvokeMethod","RefreshGantt",s,n)}function Tt(e,t,n,r){var i=864e5,s,o,u=new Date;for(s=1;s<8;s++){if(u.format("EEEE")===t){e=u;break}u=new Date(e.getTime()+i*s)}r=e.getDay()+",";for(s=1;s<n;s++)o=new Date(e.getTime()+i*s),r+=o.getDay()+",";return r}function Nt(){var e=this.Get("GetRawRecordSet"),n=this.Get("RecordSet"),r=this.Get("ResIDtoIndex"),i=this.Get("Resource Id"),s=this.Get("RJoinFld");if(!e||!n||!r)return;if(t.IsEmpty(i)||this.Get("IsNotifyRefresh")){this.SetProperty("Resource Id",e[0][s]);return}var o=n.length,u=r[i];if(!e[u]||e[u][s]!==i)u===o-1?i=u!==0?e[u-1][s]:"":u<o-1?i=e[u][s]:i="",this.SetProperty("Resource Id",i)}function Ct(e){if(e.GetProperty("bSetup")==="false"){var t=this.Get("GetRawRecordSet"),n=this.Get("RecordSet");t&&n&&t.length<n.length&&Nt.call(this),this.SetProperty("SelectedRow",0),this.SetProperty("InEvent",!0),this.ExecuteMethod("RefreshGanttChart")}}function kt(e){if(e.GetProperty(E)==="ClosePopup"||e.GetProperty(E)==="Refresh"){var t=new Date(this.Get(o)),n=new Date(this.Get(o));n.setDate(n.getDate()+1),e.GetProperty(E)==="Refresh"&&this.SetProperty("IsNotifyRefresh",!0),this.SetProperty("InEvent",!0),this.ExecuteMethod("RefreshGanttChart",n.format(gt)),this.SetProperty("SelectedRow",0),this.SetProperty("InEvent",!0),this.ExecuteMethod("RefreshGanttChart",t.format(gt)),this.Get("IsNotifyRefresh")&&this.SetProperty("IsNotifyRefresh",!1)}else e.GetProperty(E)==="Gantt"&&this.Get("IsNotifyRefresh")&&Nt.call(this)}var e=SiebelJS.Dependency("SiebelApp.Constants"),t=SiebelJS.Dependency("SiebelApp.Utils"),n=e.get("SWE_GANTT_DAYINFO"),r=e.get("SWE_GANTT_DRILLDOWN_CLS"),i=e.get("SWE_GANTT_DYNAMIC"),s=e.get("SWE_GANTT_STATIC"),o=e.get("SWE_GANTT_START_DATE"),u=e.get("SWE_GANTT_TIME_SCALE"),a=e.get("SWE_GANTT_STARTMILLIS"),f=e.get("SWE_GANTT_COLOR"),l=e.get("SWE_GANTT_ACTIVITY_START_TIME"),c=e.get("SWE_GANTT_ACTIVITY_END_TIME"),h=e.get("SWE_GANTT_ACTIVITY_NO_DAYS_IN_WEEK"),p=e.get("SWE_GANTT_ACTIVITY_WEEK_DAY_START"),d=e.get("SWE_GANTT_BOTTOMAXIS"),v=e.get("SWE_GANTT_NOOFHRS"),m=e.get("SWE_GANTT_ENDMILLIS"),g=e.get("SWE_PROP_BC_NOTI_DELETE_RECORD"),y=e.get("SWE_PROP_BC_NOTI_GENERIC"),b=e.get("SWE_PST_CNTRL_LIST"),w=e.get("SWE_PST_CUSTOM_CTRL"),E=e.get("SWE_PROP_NOTI_TYPE"),S=e.get("SWE_PROP_ARGS_ARRAY"),x=e.get("SWE_GANTT_PREFERENCES"),T=e.get("SWE_GANTT_RESOURCE_PANE"),N=e.get("SWE_GANTT_TIMESCALE_PANE"),C=e.get("SWE_GANTT_UTILIZATION_PANE"),k=e.get("SWE_GANTT_DRILLDOWN"),L=e.get("SWE_GANTT_DAY_DAY_HALFHOUR"),A=e.get("SWE_GANTT_DAY_DAY_QUARTERHOUR"),O=e.get("SWE_GANTT_DAY_HOUR"),M=e.get("SWE_GANTT_DAY_TWOHOUR"),_=e.get("SWE_GANTT_DAY_DAY_FOURHOUR"),D=e.get("SWE_GANTT_DAY_DAYPART"),P=e.get("SWE_GANTT_WEEK_DAY_DAYPART"),H=e.get("SWE_GANTT_MONTH_DOW_DAYPART"),B=e.get("SWE_GANTT_WEEK_DAY"),j=e.get("SWE_GANTT_MONTH_DAY"),F=e.get("SWE_GANTT_YEAR_MONTH"),I=e.get("SWE_GANTT_MONTH_DOW"),q=e.get("SWE_GANTT_3MONTH_DOW"),R=e.get("SWE_GANTT_RESHEADER"),U=e.get("SWE_GANTT_RENDER_INFO"),z=e.get("SWE_GANTT_SPL_DATE"),W=e.get("SWE_GANTT_ICONINFO"),X=e.get("SWE_GANTT_DRILLDOWN_CLS"),V="Weekend Axis Color TS",$="Weekends",J="TS COLOR",K="ICON_INFO",Q="CurrentDate",G="NextDate",Y="PrevDate",Z="TSUnints",et="TNT Utility Service",tt="Hour Axis Color",nt="LIC Field",rt="Booking Colors",it="EventDefaultColor",st="Color Display By",ot="Status Abbreviations",ut={1:7,2:1,4:1,32:35,64:31,128:7,256:35,512:1,1024:1,2048:1,4096:1,8192:366,16384:366,32768:35,65536:98},at={1:6,2:0,4:0,32:28,64:30,128:6,256:28,512:0,1024:0,2048:0,4096:0,8192:364,16384:364,32768:34,65536:91},ft=SiebelApp.S_App.LocaleObject,lt=ft.GetLocalString("IDS_TNT_PREV_DAY_TOOLTIP"),ct=ft.GetLocalString("IDS_TNT_NEXT_DAY_TOOLTIP"),ht=ft.GetLocalString("IDS_TNT_PREV_WEEK_TOOLTIP"),pt=ft.GetLocalString("IDS_TNT_NEXT_WEEK_TOOLTIP"),dt=ft.GetLocalString("IDS_CALENDAR_PREVIOUS_MONTH_STRING"),vt=ft.GetLocalString("IDS_CALENDAR_NEXT_MONTH_STRING"),mt="MMMM D, YYYY",gt="MM/dd/yyyy",yt="MM/DD/YYYY",bt="Splitter Position",wt="Column Width",Et="GCD";return SiebelJS.Extend(St,SiebelAppFacade.GanttPresentationModel),St.prototype.Init=function(){this.AddMethod("RefreshGanttChart",xt),SiebelAppFacade.CalGanttPM.superclass.Init.call(this),this.AddProperty("NotifyTSButtonClk",""),this.AddProperty("SelectedRow",0),this.AddProperty("IsNotifyRefresh",!1),this.AttachEventHandler(e.get("PHYEVENT_SELECT_ROW"),"HandleRowSelect",{core:!0}),this.AddMethod("HandleRowSelect",function(t,n,r,i){var s=this.OnControlEvent(e.get("PHYEVENT_APPLET_FOCUS"));s===!1&&(i[e.get("SWE_EXTN_CANCEL_ORIG_OP")]=!0,i[e.get("SWE_EXTN_RETVAL")]=s)},{scope:this,sequence:!0}),this.AttachNotificationHandler(y,kt),this.AttachNotificationHandler(g,Ct)},St.prototype.createPeriod=function(e,t){var n,r,i,s,f,d,v=36e5,g=24,y=this.ExecuteMethod("getTimeScaleUnits"),b=Number(this.Get(u)),w="",E="",S="";n=new Date(this.Get(o))||new Date,f=this.Get(h)||7,this.Get(p)?d=String(this.Get(p)):d=n.format("EEEE"),this.SetProperty("EndTime",""),this.SetProperty("FinalWeekDays",Tt(n,d,f,w)),this.SetProperty("IsTotalHPagesChanged","Y"),this.Get(Et)==="Working Hours"?(i=String(this.Get(l)),s=String(this.Get(c))):(i="00:00",s="24:00");for(var x=0;x<2;x++)i.charAt(x)!==":"&&(E+=i.charAt(x)),s.charAt(x)!==":"&&(S+=s.charAt(x));switch(b){case L:case A:case O:case M:case _:this.SetProperty("StartDate",n),n.setDate(n.getDate()+e*y),n.setHours(0,0,0,0),r=new Date(n.getTime
()),r.setDate(n.getDate()+t*y-1),r.setHours(23,59,59,999),b===L?this.SetProperty("Scale_factor",2):b===A?this.SetProperty("Scale_factor",4):this.SetProperty("Scale_factor",1),this.SetProperty("StartTime",v*E),this.SetProperty("EndTime",v*S),this.SetProperty("TDays",24*v),this.SetProperty("AxisDuration",this.Get("EndTime")-this.Get("StartTime"));break;default:SiebelAppFacade.CalGanttPM.superclass.createPeriod.call(this,e,t)}this.SetProperty(a,n.getTime()),this.SetProperty(m,r.getTime()),this.SetProperty(h,f),(this.Get("EndTime")||this.Get("TST")==="256")&&this.calcDayLeft()},St.prototype.prepareUtillpage=function(e,t){SiebelAppFacade.CalGanttPM.superclass.prepareUtillpage.call(this,e,t);var n=this.Get("ResEvents"),r=this.Get("RecordSet"),i=this.Get("RJoinFld");for(var s=e;s<t;s+=1)if(n[r[s][i]]){r[s].EVENTS=n[r[s][i]].EVENTS,r[s].BOOKINGS=n[r[s][i]].BOOKINGS;if(r[s].BOOKINGS){var o=r[s].BOOKINGS.length;for(var u=0;u<o;u+=1){var a=r[s].EVENTS[r[s].BOOKINGS[u]].CR==="Y";if(a){var f=r[s].EVENTS[r[s].BOOKINGS[u]].CLS;f+=" siebui-cal-gantt-current-record",r[s].EVENTS[r[s].BOOKINGS[u]].CLS=f}}}}},St}(),SiebelAppFacade.CalGanttPM}));
