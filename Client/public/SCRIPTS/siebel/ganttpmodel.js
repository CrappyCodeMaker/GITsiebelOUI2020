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
typeof SiebelAppFacade.GanttPresentationModel=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.GanttPresentationModel"),define("siebel/ganttpmodel",["siebel/pmodel"],function(){return SiebelAppFacade.GanttPresentationModel=function(){function wt(){SiebelAppFacade.GanttPresentationModel.superclass.constructor.apply(this,arguments)}function Et(){var e=":"+this.Get(o)+":",t=String(this.Get("DisableExtendShrinkTS"));return t.indexOf(e)===-1}function St(e){this.ExecuteMethod("InvokeMethod","DoInvokeDrilldown",e)}function xt(e){this.ExecuteMethod("InvokeMethod","InvokeOperation",e)}function Tt(){if(this.Get("TSDDInfo"))return n;return}function Nt(e){var t=this.Get("ResEvents");if(t&&t[e]&&t[e].BOOKINGS)return t[e].BOOKINGS;return}function Ct(e,t){var n=this.Get("ResEvents");if(n&&n[e]&&n[e].EVENTS)return n[e].EVENTS[t];return}function kt(){var e=$("<div>").css({visibility:"hidden",width:100,overflow:"scroll"}).appendTo("body"),t=$("<div>").css({width:"100%"}).appendTo(e).outerWidth();e.remove(),this.SetProperty("ScrollbarWidth",100-t)}function Lt(t){var n,r=[],i=0,s,o,u=[],a=0;if(t.GetProperty(b)==="Gantt"){n=t.GetProperty(w),n&&CCFMiscUtil_StringToArray(n,r),s=CCFMiscUtil_CreatePropSet(),i=r.length;for(var f=0;f<i;f++)s.SetProperty(f.toString(),r[f]);o=CCFMiscUtil_CreatePropSet(),o.DecodeFromString(s.GetProperty("0")),this.ExecuteMethod("prepareGanttInfo",o),a=this.Get("PanesToRefresh"),!(a&4)&&(a&8||a&16)&&this.SetProperty("IsRefreshNeeded",!0)}else if(t.GetProperty(b)==="ClosePopup")this.SetProperty("RevertBooking",!0);else if(t.GetProperty(e.get("SWE_PROP_NOTI_TYPE"))==="EI"){n=t.GetProperty(e.get("SWE_PROP_ARGS_ARRAY")),n&&CCFMiscUtil_StringToArray(n,r),s=CCFMiscUtil_CreatePropSet();var l=r.length;for(var c=0;c<l;c++)s.SetProperty(c.toString(),r[c]);o=CCFMiscUtil_CreatePropSet(),o.DecodeFromString(s.GetProperty("0")),this.ExecuteMethod("prepareEventInfo",o),this.SetProperty("Newpages",!0)}else t.GetProperty(b)==="RevertBooking"&&this.SetProperty("RevertBooking",!0)}function At(e,t,n){var r=this.Get(s),i=this.Get("TST"),o=SiebelApp.S_App.NewPropertySet(),u=0;u|=2,u|=4,u|=8,u|=16,this.SetProperty("PanesToRefresh",u),o.SetProperty("PanesToRefresh",u);if(r!==e||t&&i!==t)typeof e!="undefined"&&(e!==0&&this.SetProperty(s,e),o.SetProperty(s,e)),t&&this.SetProperty("TST",t),this.ExecuteMethod("InvokeMethod","RefreshGantt",o,n)}function Ot(e){var t=SiebelApp.S_App.NewPropertySet(),n=this.Get("FLD_NAME")+" (DESCENDING)",r=this.Get("FLD_NAME"),i=0;i|=2,i|=4,i|=0,i|=16,this.SetProperty("PanesToRefresh",i),t.SetProperty("PanesToRefresh",i),this.Get("SORT_ORDER")?t.SetProperty("SortSpecValue",n):t.SetProperty("SortSpecValue",r),this.ExecuteMethod("InvokeMethod","RefreshGantt",t,e)}function Mt(){var e=this.Get("Booking Colors"),t=this.Get("Color Display By"),n=this.Get("Status Abbreviations"),r,i,s=[],o=[],u,a,f,l=0,c=1,h=" LOV";n&&t?r=n.substring(n.indexOf(t)+t.length+1,n.indexOf(";",n.indexOf(t))):n?r=n.substring(n.indexOf(",")+1,n.length-1):r="GS",u=this.Get("Legend Bar Order: "+r+" "+c);while(u){u+=";",a=u.indexOf(";");while(a!==-1&&a!==0)f=u.substring(0,a),u=u.substring(a+1,u.length),a=u.indexOf(";"),s[l++]=f;c+=1,u=this.Get("Legend Bar Order: "+r+" "+c)}r+="_",l=0;if(s.length>0)for(var c=0;c<s.length;c++){var p=s[c];e[r+p+h]&&e[r+p]&&(o[l]=new Object,o[l].displayValue=e[r+p+h],o[l].color=e[r+p],l++)}else for(var d in e)d.indexOf(r)===0&&d.indexOf(h)===-1&&(o[l]=new Object,o[l].displayValue=e[d+h],o[l].color=e[d],l++);return o}function _t(e){var t=CCFMiscUtil_CreatePropSet(),n=0;t.SetProperty(s,this.Get(s)),n=this.Get("PanesToRefresh"),t.SetProperty("PanesToRefresh",n),this.ExecuteMethod("InvokeMethod","RefreshGantt",t)}function Dt(e){var t,n,r={},i="DDrag",s=this.Get("datePaddingMap"),u=0,a="DRSZ";this.SetProperty("RecordSet",this.Get("GetRawRecordSet")),this.SetProperty("CustCtlrName",e.GetValue()),this.SetProperty("RTL Mode",e.GetProperty("RTL Mode")),this.SetProperty("SERVICE_NAME",e.GetProperty("Gantt Service Name")),e.GetProperty("SD")&&this.SetProperty("SD",e.GetProperty("SD")),this.SetProperty("ResEvents",{});if(e&&e instanceof JSSPropertySet){t=e.GetChildCount();for(var f=0;f<t;f++){n=e.GetChild(f);switch(n.GetType()){case E:case"DisplayControls":Vt.call(this,n),s[this.Get(o)]&&(u=s[this.Get(o)]),this.SetProperty("TotalHPages",1+u*2);break;case S:this.ExecuteMethod("prepareResInfo",n);break;case x:this.ExecuteMethod("prepareTimeScaleInfo",n);break;case T:this.ExecuteMethod("prepareGridInfo",n);break;case"Custom Controls":this.SetProperty("DateBarControl",n.GetProperty("DateBar Control Name")),this.SetProperty("LegendControl",n.GetProperty("Legend Control Name"))}}r[X]=this.Get(X),r.TotalHPages=this.Get("TotalHPages"),this.SetProperty(F,r)}}function Pt(e){var n,s,o,u,f,l,c,h=this.Get("TotalHPages"),d=!1;if(e&&e instanceof JSSPropertySet){o=e.GetChildCount();for(f=0;f<o;f+=1){n=e.GetChild(f);if(n.GetType()==i){c=n.EnumProperties(!0);if(c)do this.SetProperty(c,n.GetProperty(c)),c=n.EnumProperties(!1);while(c);u=n.GetChildCount();for(l=u-1;l>=0;l-=1){s=n.GetChild(l);switch(s.GetType()){case N:this.SetProperty("TSDDInfo",Xt(s));break;case t:this.SetProperty(t,Wt(s));break;case a:this.SetProperty(W,Xt(s));break;case q:this.SetProperty(X,Xt(s,this.Get(X)));break;case Y:var v=Xt(s);this.SetProperty(Y,Gt(v))}}}else if(n.GetType()==r){c=n.EnumProperties(!0);if(c)do this.SetProperty(c,n.GetProperty(c)),c=n.EnumProperties(!1);while(c);this.ExecuteMethod("setDefaults"),this.createPeriod(-parseInt(h/2,10),h),u=n.GetChildCount();for(l=u-1;l>=0;l-=1)s=n.GetChild(l),s.GetType()==p?this.SetProperty(p,$t(s)):s.GetType()==I&&this.SetProperty(I,Kt.call(this,s));d=!0}d||(this.ExecuteMethod("setDefaults"),this.createPeriod(-parseInt(h/2,10),h))}}}function Ht(){var e;e=this.Get(o),e||(e="4",this.SetProperty(o,e)),this.SetProperty(d,Ft(e))}function Bt(e,t){var n=0,r,i=0,s=t.length;e.setHours(0,0,0,0);for(r=0;r<s;r++)if(t.charAt(r)!=":")i=i*10+Number(t.charAt(r));else{if(n===0)e.setHours(i);else{if(n!=1){e.setSeconds
(i);break}e.setMinutes(i)}i=0,n+=1}}function jt(e,t,n,r){var i=864e5,s,o,u=new Date;for(s=1;s<8;s++){if(u.format("EEEE")===t){e=u;break}u=new Date(e.getTime()+i*s)}r=e.getDay()+",";for(s=1;s<n;s++)o=new Date(e.getTime()+i*s),r+=o.getDay()+",";return r}function Ft(e){switch(Number(e)){case C:case D:return 1;case k:return 2;case L:return 4;case H:return 7;case B:return 7;default:return 1}}function It(e){var t,n=0;if(e&&e instanceof JSSPropertySet){n=e.GetChildCount();for(var r=0;r<n;r++)t=e.GetChild(r),t.GetType()==i&&this.ExecuteMethod("prepareResStaticInfo",t)}}function qt(e){var t,n=0;if(e&&e instanceof JSSPropertySet){n=e.GetChildCount(),Vt.call(this,e);for(var r=0;r<n;r++){t=e.GetChild(r);switch(t.GetType()){case j:this.SetProperty("RESOURCEHEADER",Wt(t));break;case q:this.SetProperty(X,Xt(t,this.Get(X)))}}}}function Rt(e){var t,n,s,o,u;if(e&&e instanceof JSSPropertySet){s=e.GetChildCount();for(var a=0;a<s;a++){t=e.GetChild(a);if(t.GetType()==i){o=t.GetChildCount();for(var f=0;f<o;f++){n=t.GetChild(f);switch(n.GetType()){case N:this.SetProperty("Activity_DDInfo",Xt(n));break;case q:this.SetProperty(X,Xt(n,this.Get(X)));break;case"Color":this.SetProperty(et,Xt(n)),this.Get(nt)||this.SetProperty(nt,this.Get(et)["Event Status"]);break;case Z:this.SetProperty(Z,Xt(n));break;case yt:this.SetProperty(yt,Xt(n))}}u=t.GetProperty("Disable ExtendShrink Views"),u&&this.SetProperty("DisableExtendShrinkTS",":"+u+":"),u="",u=t.GetProperty("Round Minutes Events"),u&&this.SetProperty("Round Minutes Events",u),u="",u=t.GetProperty(rt),u&&this.SetProperty(rt,u),u="",u=t.GetProperty("Event Default Color"),u&&this.SetProperty(tt,u)}else t.GetType()==r&&this.ExecuteMethod("prepareEventInfo",t)}}}function Ut(e){var t="",n=0,r,i,s=this.Get("ResEvents");if(e){Vt.call(this,e),n=e.GetChildCount();for(var o=0;o<n;o++)r=[],i=e.GetChild(o),t=i.GetType(),s[t]={},s[t].EVENTS=zt(i,r),s[t].BOOKINGS=r}}function zt(e,t){var n,r={},i,s,o=e.GetChildCount();for(n=0;n<o;n++)s=e.GetChild(n),i=s.GetProperty("ID"),r[i]=Xt(s),t[n]=i;return r}function Wt(e){var t,n=[],r=e.GetChildCount();for(t=0;t<r;t++)n[t]=Xt(e.GetChild(t));return n}function Xt(e,t){var n,r={};t&&(r=t);if(e){n=e.EnumProperties(!0);do n&&(r||(r={}),r[n]=e.GetProperty(n)),n=e.EnumProperties(!1);while(n)}return r}function Vt(e){var t=e.EnumProperties(!0);if(t)do this.SetProperty(t,e.GetProperty(t)),t=e.EnumProperties(!1);while(t)}function $t(e){var t,n={},r,i,s=e.GetChildCount(),o;for(t=0;t<s;t++){i=e.GetChild(t),r=i.GetType();if(!r)break;o=(new Date(r)).format("MM/dd/yyyy"),n[o]=Xt(i)}return n}function Jt(e){if(this.Get("EnableTooltip")==="Y"&&bt){var t=null,n={};n.async=!1,n.selfbusy=!0,n.scope=this,n.cb=function(){t=arguments[2],t&&this.SetProperty("tooltipMap",t.GetChildByType("ResultSet"))},bt.InvokeMethod("GetTooltipInfo",e,n)}}function Kt(e){var t,n={},r,i,s,o,a,f,l,c,h,p=this.Get(u),d=this.Get(v),m=e.GetChildCount();for(t=0;t<m;t++){var g=!1;a=e.GetChild(t),s=a.GetProperty("SD");if(!s)break;c=new Date(s),c.setHours(0,0,0,0),h=c,o=a.GetProperty("ED"),o?(h=new Date(o),h.setHours(0,0,0,0)):g=!0,f=new Date(p),f.setHours(0,0,0,0),l=new Date(d),l.setHours(0,0,0,0);while(f.getTime()<=l.getTime()){if(!g&&f.getTime()>=c.getTime()&&f.getTime()<=h.getTime()){i={};if(n[f.format("MM/dd/yyyy")]){i=n[f.format("MM/dd/yyyy")],r=a.EnumProperties(!0);if(r)do r!=="SD"&&r!="ED"&&a.GetProperty(r)&&(i[a.GetProperty(r)]=""),r=a.EnumProperties(!1);while(r)}else{r=a.EnumProperties(!0);if(r){do r!="SD"&&r!="ED"&&(i[a.GetProperty(r)]=""),r=a.EnumProperties(!1);while(r);n[f.format("MM/dd/yyyy")]=i}}}f=new Date(f),f.setDate(f.getDate()+1)}}return n}function Qt(e,t){var n=this.Get("RecordSet"),r=this.Get("ResIDtoIndex"),i=n.length,s=this.Get("RJoinFld"),o=this.Get("RParentFld"),u="",a=0,f="",l=this.Get(F)[X],c=0,h=this.Get("RColorFld"),p="";if(!n)return;if(!r)return;this.Get("RESOURCEHEADER")[0]&&this.Get("RESOURCEHEADER")[0].ICONFLDS&&(u=this.Get("RESOURCEHEADER")[0].ICONFLDS.split(","),a=u.length);for(var d=e;d<t&&d<i;d+=1){r[n[d][s]]=d,n[d]["Outline Number"]&&(p=n[d]["Outline Number"].match(/./g),p&&(n[d].LEVEL=p.length-1)),n[d]["Has Children"]?n[d].LEVEL===0&&n[d]["Has Children"]==="1"?n[d].CLS="siebui-expcoll ui-icon ui-icon-triangle-1-se":n[d].LEVEL!==0&&(n[d].CLS="siebui-expnone ui-icon ui-icon-radio-off"):n[d].CLS="siebui-noIcon",n[d].Index=d;for(var v=0;v<a;v++)n[d][u[v]]==="Y"&&(l&&l[u[v]]&&(f=f+"<span><span class='"+l[u[v]]+"'></span></span>"),c+=1);n[d].LEVEL>=c&&(n[d].LEVEL=n[d].LEVEL-c),n[d].Icons=f,f="",c=0,n[d].STCLS="",n[d][h]&&(n[d].STCLS=" siebui-"+n[d][h])}this.SetProperty("RecordSet",n),this.SetProperty("ResIDtoIndex",r)}function Gt(e){var t={},n,r,i,s,o,u,a,f;for(f in e)if(e.hasOwnProperty(f)){a=f.indexOf("-");if(a==-1)continue;o=Number(f.substring(0,a)),u=Number(f.substring(a+1,f.length));while(o<u)t[o]=e[f],o+=1}return t}function Yt(){return it[this.Get(o)]}function Zt(){return st[this.Get(o)]}function en(e){var t,n=this.ExecuteMethod("getTimeScalePeriods"),r,i;return e===""&&(e=this.Get(s)),t=ot.GetStringFromDateTime(e,vt,pt),n>0?(i=new Date(e),i.setDate(i.getDate()+n),r=ot.GetStringFromDateTime(i.format(dt),vt,pt),t+" - "+r):t}function tn(e,t,n,r){var i=0;e==="FilterGantt"||e==="ReSetFilterGantt"?(i|=2,i|=4,i|=16,this.SetProperty("PanesToRefresh",i),t.SetProperty("PanesToRefresh",i),r.CancelOperation=!1):e==="RefreshGantt"?(i=this.Get("PanesToRefresh"),t.SetProperty("PanesToRefresh",i),t.SetProperty("TST",this.Get("TST")),r.CancelOperation=!1):e==="Show Legends"?(this.SetProperty("ShowLegend",!0),r.CancelOperation=!0):e==="Hide Legends"?(this.SetProperty("ShowLegend",!1),r.CancelOperation=!0):e==="ExpandAll"?(this.SetProperty("expcolpse",!0),r.CancelOperation=!0):e==="CollapseAll"?(this.SetProperty("expcolpse",!1),r.CancelOperation=!0):e==="FilterDisplayOptions"||e==="ResetDisplayOptions"?(e==="ResetDisplayOptions"&&(i|=1,this.SetProperty(nt,""),this.SetProperty("Redraw Legends","Y")),i|=2,i|=4,i|=16,this.SetProperty("PanesToRefresh",i),t.SetProperty("PanesToRefresh"
,i),r.CancelOperation=!1):r.CancelOperation=!1}function nn(e,t){e==="Show Legends"?(t.CancelOperation=!0,t.ReturnValue=!this.Get("ShowLegend")):e==="Hide Legends"?(t.CancelOperation=!0,t.ReturnValue=this.Get("ShowLegend")):t.CancelOperation=!1}function rn(e){var t=SiebelApp.S_App.GetService(this.Get("SERVICE_NAME"));if(t){var n={};n.async=!1,n.npr=!0,n.selfbusy=!0,n.scope=this,n.cb=function(){},t.InvokeMethod("SaveGanttUserPref",e,n)}}function sn(e){this.ExecuteMethod("InvokeMethod","SaveControlValues",e)}var e=SiebelJS.Dependency("SiebelApp.Constants"),t=e.get("SWE_GANTT_DAYINFO"),n=e.get("SWE_GANTT_DRILLDOWN_CLS"),r=e.get("SWE_GANTT_DYNAMIC"),i=e.get("SWE_GANTT_STATIC"),s=e.get("SWE_GANTT_START_DATE"),o=e.get("SWE_GANTT_TIME_SCALE"),u=e.get("SWE_GANTT_STARTMILLIS"),a=e.get("SWE_GANTT_COLOR"),f=e.get("SWE_GANTT_ACTIVITY_START_TIME"),l=e.get("SWE_GANTT_ACTIVITY_END_TIME"),c=e.get("SWE_GANTT_ACTIVITY_NO_DAYS_IN_WEEK"),h=e.get("SWE_GANTT_ACTIVITY_WEEK_DAY_START"),p=e.get("SWE_GANTT_BOTTOMAXIS"),d=e.get("SWE_GANTT_NOOFHRS"),v=e.get("SWE_GANTT_ENDMILLIS"),m=e.get("SWE_PROP_BC_NOTI_GENERIC"),g=e.get("SWE_PST_CNTRL_LIST"),y=e.get("SWE_PST_CUSTOM_CTRL"),b=e.get("SWE_PROP_NOTI_TYPE"),w=e.get("SWE_PROP_ARGS_ARRAY"),E=e.get("SWE_GANTT_PREFERENCES"),S=e.get("SWE_GANTT_RESOURCE_PANE"),x=e.get("SWE_GANTT_TIMESCALE_PANE"),T=e.get("SWE_GANTT_UTILIZATION_PANE"),N=e.get("SWE_GANTT_DRILLDOWN"),C=e.get("SWE_GANTT_DAY_HOUR"),k=e.get("SWE_GANTT_DAY_TWOHOUR"),L=e.get("SWE_GANTT_DAY_DAY_FOURHOUR"),A=e.get("SWE_GANTT_DAY_DAYPART"),O=e.get("SWE_GANTT_WEEK_DAY_DAYPART"),M=e.get("SWE_GANTT_MONTH_DOW_DAYPART"),_=e.get("SWE_GANTT_WEEK_DAY"),D=e.get("SWE_GANTT_MONTH_DAY"),P=e.get("SWE_GANTT_YEAR_MONTH"),H=e.get("SWE_GANTT_MONTH_DOW"),B=e.get("SWE_GANTT_3MONTH_DOW"),j=e.get("SWE_GANTT_RESHEADER"),F=e.get("SWE_GANTT_RENDER_INFO"),I=e.get("SWE_GANTT_SPL_DATE"),q=e.get("SWE_GANTT_ICONINFO"),R=e.get("SWE_GANTT_DRILLDOWN_CLS"),U="Weekend Axis Color TS",z="Weekends",W="TS COLOR",X="ICON_INFO",V="CurrentDate",J="NextDate",K="PrevDate",Q="TSUnints",G="TNT Utility Service",Y="Hour Axis Color",Z="LIC Field",et="Booking Colors",tt="EventDefaultColor",nt="Color Display By",rt="Status Abbreviations",it={1:7,2:1,4:1,32:35,64:31,128:7,256:35,512:1,1024:1,2048:1,4096:1,8192:366,16384:366,32768:35,65536:98},st={1:6,2:0,4:0,32:28,64:30,128:6,256:28,512:0,1024:0,2048:0,4096:0,8192:364,16384:364,32768:34,65536:91},ot=SiebelApp.S_App.LocaleObject,ut=ot.GetLocalString("IDS_TNT_PREV_DAY_TOOLTIP"),at=ot.GetLocalString("IDS_TNT_NEXT_DAY_TOOLTIP"),ft=ot.GetLocalString("IDS_TNT_PREV_WEEK_TOOLTIP"),lt=ot.GetLocalString("IDS_TNT_NEXT_WEEK_TOOLTIP"),ct=ot.GetLocalString("IDS_CALENDAR_PREVIOUS_MONTH_STRING"),ht=ot.GetLocalString("IDS_CALENDAR_NEXT_MONTH_STRING"),pt="MMMM D, YYYY",dt="MM/dd/yyyy",vt="MM/DD/YYYY",mt="Splitter Position",gt="Column Width",yt="Border Color",bt=SiebelApp.S_App.GetService("Gantt UI Service");return SiebelJS.Extend(wt,SiebelAppFacade.PresentationModel),wt.prototype.Init=function(){SiebelAppFacade.GanttPresentationModel.superclass.Init.call(this),this.AddProperty("CustCtlrName",""),this.AddProperty("RevertInfo",""),this.AddProperty("TSDDInfo",""),this.AddProperty("ResSeq",""),this.AddProperty("ResEvents",""),this.AddProperty("IsRefreshNeeded",!1),this.AddProperty("RevertBooking",!1),this.AddProperty("DisableExtendShrinkTS",""),this.AddProperty("Round Minutes Events",15),this.AddProperty("fx",""),this.AddProperty("RESOURCEHEADER",""),this.AddProperty("Activity_DDInfo",""),this.AddProperty("DDrag",""),this.AddProperty("DRSZ",""),this.AddProperty(f,""),this.AddProperty(l,""),this.AddProperty(c,""),this.AddProperty(h,""),this.AddProperty(s,""),this.AddProperty(t,""),this.AddProperty(p,""),this.AddProperty(o,""),this.AddProperty(d,""),this.AddProperty(u,""),this.AddProperty(v,""),this.AddProperty(F,""),this.AddProperty("tooltipMap",""),this.AddProperty(I,""),this.AddProperty(X,""),this.AddProperty("Newpages",!1),this.AddProperty("RecordSet",""),this.AddProperty("ResIDtoIndex",{}),this.AddProperty("InEvent",""),this.AddProperty(tt,""),this.AddProperty("RTL Mode",""),this.AddProperty("SERVICE_NAME",""),this.AddProperty("TotalHPages",""),this.AddProperty("VScrollPos",0),this.AddProperty("ScrollbarWidth",0),this.AddProperty("Scale_factor",1),this.AddProperty("FilterGantt_CLS",""),this.AddProperty("MinGanttsize",""),this.AddProperty("PanesToRefresh",0),this.AddProperty("RevertDate",""),this.AddProperty("Resource Id",""),this.AddProperty(mt,""),this.AddProperty(gt,""),this.AddProperty("EnableTooltip",""),this.AddProperty("ShowLegend",!0),this.AddProperty("TurnTime",""),this.AddProperty("expcolpse",!0),this.AddProperty("datePaddingMap",""),this.AddProperty("IsTotalHPagesChanged","Y"),this.AddProperty("Field_Name",""),this.AddProperty("Sort_Order",1),this.AddMethod("getEvent",Ct),this.AddMethod("gettaskSeqEvents",Nt),this.AddMethod("gettimescaleDDcls",Tt),this.AddMethod("prepareResInfo",It),this.AddMethod("prepareResStaticInfo",qt),this.AddMethod("prepareGanttInfo",Dt),this.AddMethod("prepareTimeScaleInfo",Pt),this.AddMethod("prepareGridInfo",Rt),this.AddMethod("prepareEventInfo",Ut),this.AddMethod("RefreshGanttChart",At),this.AddMethod("InvokeServer",_t),this.AddMethod("CustomDrillDown",St),this.AddMethod("setHoursFrom",Bt),this.AddMethod("setDefaults",Ht),this.AddMethod("InvokeOperation",xt),this.AddMethod("CanExtendShrinkEvents",Et),this.AddMethod("getTooltip",Jt),this.AddMethod("getScrollWidth",kt),this.AddMethod("prepareRespage",Qt),this.AddMethod("getTimeScaleUnits",Yt),this.AddMethod("getTimeScalePeriods",Zt),this.AddMethod("getDateRange",en),this.AddMethod("prepareLegendMap",Mt),this.AddMethod("SortRefreshGantt",Ot),this.AddMethod("CanInvokeMethod",nn,{sequence:!0,scope:this}),this.AddMethod("InvokeMethod",tn,{sequence:!0,scope:this}),this.AddMethod("saveUserPref",rn),this.AddMethod("saveControlValues",sn),this.AttachNotificationHandler(m,function(e){e&&e.GetProperty(b)==="ClosePopup"&&SiebelApp.S_App.GetPopupPM().SetProperty("isPrevPopupVisible"
,!1)},{core:!0,scope:this}),this.AttachNotificationHandler(m,Lt)},wt.prototype.Setup=function(e){SiebelAppFacade.GanttPresentationModel.superclass.Setup.call(this,e);var t=e.EnumChildren(!0),n,r=e.GetChildByType("apm"),i=e.GetChildByType(g),s=this.Get("ScrollbarWidth");s||this.ExecuteMethod("getScrollWidth");if(r){Vt.call(this,r);if(this.Get("Date Padding for TimeScale LIC")){var o=this.Get("Date Padding for TimeScale LIC"),u={};o=o.replace(/;/g,":"),o=o.split(":");var a=o.length;for(var f=0;f<a;f++)u[o[f]]=o[++f];this.SetProperty("datePaddingMap",u)}}if(i){n=i.EnumChildren(!0);do{if(n.GetType()===y){this.SetProperty("PanesToRefresh",63),this.ExecuteMethod("prepareGanttInfo",n.GetChild(0));break}n=i.EnumChildren(!1)}while(n)}},wt.prototype.createPeriod=function(e,n){var r,i,a,f,l,p,d=36e5,m=24,g=this.ExecuteMethod("getTimeScaleUnits"),y=this.Get(t),b="";r=new Date(this.Get(s));if(!r||!r instanceof Date)r=new Date;this.Get(c)?l=String(this.Get(c)):l=7,this.Get(h)?p=String(this.Get(h)):p=r.format("EEEE"),this.SetProperty("EndTime",""),this.SetProperty("FinalWeekDays",jt(r,p,l,b));switch(Number(this.Get(o))){case C:case k:case L:case A:r.setDate(r.getDate()+e*g),r.setHours(0,0,0,0),i=new Date(r.getTime()),i.setDate(r.getDate()+n*g-1),i.setHours(23,59,59,999);break;case M:r.setDate(r.getDate()+e*g),f=y[0],this.ExecuteMethod("setHoursFrom",r,f.ST),i=new Date(r.getTime()),i.setDate(r.getDate()+n*g-7),this.SetProperty("StartTime","0"),this.SetProperty("EndTime",24*d-1),this.SetProperty("TDays",168*d),this.SetProperty("AxisDuration",24*d-1);break;case _:case O:r.setDate(r.getDate()+e*g),r.setHours(0,0,0,0),i=new Date(r.getTime()),i.setDate(r.getDate()+n*g-1),i.setHours(23,59,59,999);break;case D:r.setDate(r.getDate()+e*g),r.setHours(0,0,0,0),i=new Date(r.getTime()),i.setDate(r.getDate()+n*g-1),i.setHours(23,59,59,999);break;case P:r.setDate(r.getDate()+e*g),r.setHours(0,0,0,0),i=new Date(r.getTime()+n*d*m*364),i.setHours(23,59,59,999);break;case H:r.setDate(r.getDate()+e*g),r.setHours(0,0,0,0),i=new Date(r.getTime()),i.setDate(r.getDate()+n*g-7),i.setHours(23,59,59,999);break;case B:r.setDate(r.getDate()+e*g),r.setHours(0,0,0,0),i=new Date(r.getTime()),i.setDate(r.getDate()+n*g-7),i.setHours(23,59,59,999);break;default:r.setDate(r.getDate()+e*g),r.setHours(0,0,0,0),i=new Date(r.getTime()),i.setDate(r.getDate()+n*g-1),i.setHours(23,59,59,999)}this.SetProperty(u,r.getTime()),this.SetProperty(v,i.getTime()),this.SetProperty(c,l),(this.Get("EndTime")||this.Get("TST")==="256")&&this.calcDayLeft()},wt.prototype.calcDayLeft=function(){var e=new Date(this.Get(u)),t=new Date(this.Get(v)),n,r=this.Get("TDays"),i=0,s={},o=this.Get("TST"),a=this.ExecuteMethod("getTimeScaleUnits");n=1/(this.Get("TotalHPages")>0?this.Get("TotalHPages"):1),o==="256"&&a&&(n=n/a*7);while(e.getTime()<=t.getTime())s[e.format("MM/dd/yyyy")]=i,i+=n,e.setTime(e.getTime()+r);this.SetProperty("DayLoc",s),this.SetProperty("PixelsPerUnit",n),this.Get("EndTime")-this.Get("StartTime")>0&&this.SetProperty("miniFX",n/(this.Get("EndTime")-this.Get("StartTime")))},wt.prototype.calcLeftWidth=function(e,t){var n,r,i,s,o,a=new Object,f=this.Get("StartTime"),l=this.Get("EndTime"),c=this.Get("PixelsPerUnit"),h=this.Get("AxisDuration"),p=new Date(this.Get(u)),d=this.Get("DayLoc"),v=6e4,m=this.Get("TST"),g=p.getTimezoneOffset(),y;return m==="256"&&(typeof d[e.format("MM/dd/yyyy")]=="undefined"&&(e.setDate(e.getDate()+(p.getDay()-e.getDay()+7)%7),e.setHours(0,0,0,0)),typeof d[t.format("MM/dd/yyyy")]=="undefined"&&(t.setDate(t.getDate()+(p.getDay()-t.getDay()+7)%7),t.setHours(0,0,0,0))),a.Left=d[e.format("MM/dd/yyyy")],s=d[t.format("MM/dd/yyyy")],y=e.getTimezoneOffset(),n=(e.getHours()*60+e.getMinutes()+(y-g))*v,y=t.getTimezoneOffset(),r=(t.getHours()*60+t.getMinutes()+(y-g))*v,n>=f&&n<=l?a.Left=a.Left+(n-f)*this.Get("miniFX"):n>l&&(a.Left=a.Left+c),r>=f&&r<=l?s+=(r-f)*this.Get("miniFX"):r>l&&(s+=c),a.Width=s-a.Left,a.Left=a.Left*100*this.Get("TotalHPages")*this.Get("Scale_factor"),a.Width=a.Width*100*this.Get("TotalHPages")*this.Get("Scale_factor"),a.Left=isNaN(a.Left)?0:a.Left,a.Width=isNaN(a.Width)?0:a.Width,a},wt.prototype.prepareUtillpage=function(e,t){var n=this.Get("ResEvents"),r=this.Get(u),i=this.Get("DayLoc"),s=this.Get("fx"),o=this.Get("RecordSet"),a=0,f=this.Get("RJoinFld"),l=this.Get("RParentFld"),c=this.Get(v),h="ST",p,d;ETF="ET",a=o?o.length:0,this.Get("TurnTime")==="Y"&&(h="AST",ETF="AET");for(var m=e;m<t;m+=1)if(n[o[m][f]]){o[m].EVENTS=n[o[m][f]].EVENTS,o[m].BOOKINGS=n[o[m][f]].BOOKINGS;var g="",y=0,b="",w=20,E=0;if(o[m].BOOKINGS){var S=o[m].BOOKINGS.length,x=0,T=0,N=0;for(var C=0;C<S;C+=1){b=o[m].EVENTS[o[m].BOOKINGS[C]],h==="AST"&&typeof b[h]=="undefined"&&(h="ST"),ETF==="AET"&&typeof b[ETF]=="undefined"&&(ETF="ET");var k=new Date(b[h]),L=new Date(b[ETF]);if(c<k.getTime())continue;c<L.getTime()&&(L=new Date(c));if(this.Get("EndTime")){k.getTime()<r&&(k=new Date(r));if(k.format("MM/dd/yyyy")!==L.format("MM/dd/yyyy")&&(typeof i[k.format("MM/dd/yyyy")]=="undefined"||typeof i[L.format("MM/dd/yyyy")]=="undefined")){var A=!1,O=!1,M=new Date(k.getTime()),_=new Date(L.getTime());for(var D=0;D<7;D++){if(M>=_)break;!A&&typeof i[M.format("MM/dd/yyyy")]!="undefined"&&(A=!0),!O&&typeof i[_.format("MM/dd/yyyy")]!="undefined"&&(O=!0);if(A&&O){k=new Date(M.getTime()),L=new Date(_.getTime());break}A||(M.setDate(M.getDate()+1),M.setHours(0,0,0,0)),O||(_.setDate(_.getDate()-1),_.setHours(23,59,59,999))}}}b.OLPCNT&&g!==""&&g.loco&&(y=0),b.OLPCNT?(T=w/b.OLPCNT,N=T,this.Get("isHospitalityScheduler")?b.SEQ&&(x=N*(b.SEQ-1)):(y++,y==1?x=E:b.OTE||(x+=T))):(y=0,x=E,N=w),p=0,d=null;if(this.Get("EndTime")||this.Get("TST")=="256")d=this.calcLeftWidth(k,L),p=1;o[m].EVENTS[o[m].BOOKINGS[C]].left=p?d.Left:(k.getTime()-r)*100*this.Get("TotalHPages")/(c-r)*this.Get("Scale_factor"),o[m].EVENTS[o[m].BOOKINGS[C]].width=p?d.Width:(L-k)/(c-r)*100*this.Get("TotalHPages")*this.Get("Scale_factor"),o[m].EVENTS[o[m].BOOKINGS[C]].top=x,o[m].EVENTS[o[m].BOOKINGS[C]].height=N;if(this
.Get("TurnTime")==="Y"&&o[m].EVENTS[o[m].BOOKINGS[C]].STTF==="Y"){var P=new Date(b.ST);P.getTime()!==k.getTime()&&(o[m].EVENTS[o[m].BOOKINGS[C]].SW=(P.getTime()-k.getTime())/(L-k)*100);var H=new Date(b.ET);H.getTime()!==L.getTime()&&(o[m].EVENTS[o[m].BOOKINGS[C]].TW=(L.getTime()-H.getTime())/(L-k)*100)}var B="",j=this.Get("DDrag")!="Y"&&o[m].EVENTS[o[m].BOOKINGS[C]].DRG==="Y",F=o[m].EVENTS[o[m].BOOKINGS[C]].DCLK==="Y",I=this.Get("DRSZ")!="Y"&&(o[m].EVENTS[o[m].BOOKINGS[C]].RSZ?o[m].EVENTS[o[m].BOOKINGS[C]].RSZ==="Y":o[m].EVENTS[o[m].BOOKINGS[C]].DRG==="Y");j&&(B+=" Dragpble"),F&&(B+=" DClickable"),I&&(B+=" Rsizable"),b.OLPCNT&&b.OLPCNT==="2"&&(B+=" siebui-overlapEvent"),o[m].EVENTS[o[m].BOOKINGS[C]].CLS=B,g=b}}}else o[m].EVENTS={},o[m].BOOKINGS={};this.SetProperty("RecordSet",o)},wt}(),"SiebelAppFacade.GanttPresentationModel"}));