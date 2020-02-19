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
typeof SiebelAppFacade.fsDispatchBoardRenderer=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.fsDispatchBoardRenderer"),define("siebel/fsdispatchboardrenderer",["siebel/ganttrenderer"],function(){return SiebelAppFacade.fsDispatchBoardRenderer=function(){function v(){SiebelAppFacade.fsDispatchBoardRenderer.superclass.constructor.apply(this,arguments)}function m(){$("#db_resize").html("");var e='<a href="javascript:void()"><img src="images/btn_more.gif" border="0" space="0" hspace="0" alt="'+d+'"'+"title="+'"'+d+'"'+"></a>";$("#db_resize").append(e),$("#db_resize").attr("class","siebui-link-icon-e siebui-fs-db-common siebui-showmore")}function g(){var e=l.GetPM(),t,n=l.getGanttCtrlHeight();t=$("#"+l.GetCustCtrlName()).addClass("siebui-ganttControl"),t.css({height:parseInt(n,10)})}function y(){var e=this,t=e.GetPM(),n=$(window).height(),r=$("#_sweappmenu").height(),i=$(".siebui-button-toolbar").height(),s=$("#_swethreadbar").height(),o=$("#_swescrnbar").height(),u=60,a;t.Get("DefaultNavCtrl")==="Tree"&&(o=0),a=n-(r+i+s+o+u),e.setGanttCtrlHeight(parseInt(a/2,10))}function b(e){var t=e.data.ctx,n=t.GetPM();$(this).draggable({containment:$("#s_"+n.Get("GetFullId")+"_div").find("#UGrid"),zIndex:9999,drag:function(e,t){},start:function(e,t){var r=$(this).closest("div.siebui-gdfRow").attr("taskid"),i=$(this).closest("div.siebui-gdfRow").attr("Id"),s=$(this).attr("taskid"),o=0;console.log("In Drag"),$(this).draggable("option","sResId",r),$(this).draggable("option","resindex",i),$(this).draggable("option","dragType",o),$(this).draggable({cursor:"crosshair"}),n.SetProperty("InEvent",!0),console.log(r,i,s)}})}function w(e){}function E(e){var t=e.data.ctx,i=t.GetPM();$("#s_"+i.Get("GetFullId")+"_div").find(".siebui-taskEditUtility").droppable({drop:function(e,o){var u=null,a=$(this).attr("taskId"),f=o.draggable.attr("taskId"),l=$(this).scrollLeft()+e.clientX-$(this).offset().left,c,h,p,d,v,m,g,y,b=0,w,E,S,x;E=i.Get(n),S=i.Get(r),x=i.Get(s),w=$(o.draggable).draggable("option","dragType"),w===0?i.Get("EndTime")?u=new Date(t.calcNonContiguousTime(o.position.left)):u=new Date(Math.round(o.position.left/i.Get("fx")+i.Get("startMillis"))):i.Get("EndTime")?u=new Date(t.calcNonContiguousTime(l)):(c=Math.round(l/i.Get("fx")+i.Get("startMillis")),u=new Date(c)),h=parseInt((u.getMinutes()+7.5)/15,10)*15,u=new Date(u.setMinutes(h,0)),p=u.format("MM/dd/yyyy"),d=u.format("HH:mm:ss"),v=u.format("MM/dd/yyyy HH:mm:ss"),m=SiebelApp.S_App.NewPropertySet(),i.SetProperty("InEvent",!0);var T=[];for(var N in SiebelApp.S_App.GetActiveView().GetAppletMap())T.push(N);if(w===0)console.log("Within Gantt"),f=o.draggable.attr("taskId"),g=$(o.draggable).draggable("option","sResId"),$(o.draggable).draggable({cursor:"crosshair"}),m.SetProperty("DropSrcApplet",T[1]);else{console.log("Applet to Gantt Drag");var C=o.draggable.attr("id"),k=o.draggable.parent().parent().jqGrid("getRowData",C);m.SetProperty("DropSrcApplet",T[0]),f=k.Activity_UID,g=""}m.SetProperty("DropSrcYId",g),m.SetProperty("DropObjId",f),m.SetProperty("DropTrgtYId",a),m.SetProperty("Start Date",p),m.SetProperty("Start Time",d),m.SetProperty("DropTime",v),m.SetProperty("EnableEarlyLatestStartViolation",E),m.SetProperty("LoadActivityIntoABS",S),m.SetProperty("Gantt Chart Service Region Id",x),m.SetProperty("operation","DragnDrop"),b=0,b|=2,b|=4,b|=16,m.SetProperty("PanesToRefresh",b),i.SetProperty("PanesToRefresh",b),console.log("New ",u,f,g,a),i.ExecuteMethod("InvokeOperation",m),$("body").attr("style")!="undefined"&&$("body").attr("style")==="cursor: crosshair;"&&$("body").attr("style","cursor: auto;")}})}function S(e,t){var n=e.getMinutes(),r;return r=parseInt((n+t/2)/t,10)*t,e=new Date(e.setMinutes(r,0)),e}function x(e){var t="";if(e)for(var n in e){t="";var r="",i="";for(var s in e[n].EVENTS){var o=""+(parseInt(e[n].EVENTS[s].height)-1);t='<div class="siebui-taskBox '+e[n].EVENTS[s].BCLS+'"'+' id="'+e[n].EVENTS[s].ID+'"'+' style="width:'+e[n].EVENTS[s].width+"%;height:"+o+"px;left:"+e[n].EVENTS[s].left+"%;margin-top:"+e[n].EVENTS[s].top+"px;"+'"/>',r=e[n].EVENTS[s].Zyid,i='div[taskid="'+r+'"]',$(i).children(".siebui-eventContainer").append(t),$("#"+e[n].EVENTS[s].ID).bind("click",{ctx:this},function(e){$(this).parent().click()})}}}var e=SiebelJS.Dependency("SiebelApp.Constants"),t=e.get("SWE_GANTT_ACTIVITY_LABEL"),n=e.get("SWE_GANTT_ACTIVITY_EARLIEST_LATEST_VIOLATION"),r=e.get("SWE_GANTT_LOAD_ACTIVITY_INTO_ABS"),s=e.get("SWE_GANTT_SERVICE_REGION_ID"),o=e.get("SWE_GANTT_DRILLDOWN_CLS"),u=e.get("SWE_GANTT_RENDER_INFO"),a=e.get("SWE_GANTT_ACTIVITY_NO_DAYS_IN_WEEK"),f=e.get("SWE_GANTT_ACTIVITY_WEEK_DAY_START"),l,c=e.get("SWE_GANTT_TIME_SCALE"),h=e.get("SWE_GANTT_STARTMILLIS"),p=$("#Show_Less_Label").html(),d=$("#Show_More_Label").html();return SiebelJS.Extend(v,SiebelAppFacade.GanttRenderer),v.prototype.ShowUI=function(){var e=this.GetPM(),t=this.GetPM().Get(u);t.AppName=SiebelApp.S_App.GetName(),y.call(this),m.call(this),SiebelAppFacade.fsDispatchBoardRenderer.superclass.ShowUI.call(this),$("#s_at_m_1")!="undefined"&&$("#s_at_m_1").parent()!="undefined"&&$("#s_at_m_1").parent().parent()!="undefined"&&$("#s_at_m_1").parent().parent().parent()!="undefined"&&$("#s_at_m_1").parent().parent().parent().prop("tagName").toLowerCase()==="td"&&$("#s_at_m_1").parent().parent().parent().attr("class","AppletMenu")},v.prototype.BindEvents=function(){SiebelAppFacade.fsDispatchBoardRenderer.superclass.BindEvents.call(this),l=this;var e=this,t=e.GetPM(),n,r,i,s,o,u,a,f=0;$("#s_"+this.GetAppletId()+"_div").unbind("dblclick"),$("#s_"+t.Get("GetFullId")+"_div").on("mouseup",".siebui-splitBox3",{ctx:this},E).on("mousedown",".siebui-taskBox.Dragpble",{ctx:this},b).on("dblclick",".siebui-taskBox.Dragpble",{ctx:this},w),n=t.Get("GetControls"),r=n["Time Scale"],r&&(i=r.GetInputName(),$("#s_"+t.Get("GetFullId")+"_div").find("[Name="+i+"]").bind("autocompleteclose",{ctx:this},function(e){f=0,f|=2,f|=8,f|=16,t.SetProperty("PanesToRefresh",f),t.ExecuteMethod("InvokeServer"),$("#s_"+t.Get("GetFullId"
)+"_div").find("#ganttdatePicker").removeClass("siebui-dateInput").addClass("siebui-dateRange").val(t.ExecuteMethod("getDateRange",""))})),$("#db_resize").bind("click",{ctx:this},function(e){if($("#db_resize").hasClass("siebui-showmore")){$("#db_resize").html("");var t='<a href="javascript:void()"><img src="images/btn_less.gif" border="0" space="0" hspace="0" alt="'+p+'"'+"title="+'"'+p+'"'+"></a>";$("#db_resize").append(t),$("#db_resize").attr("class","siebui-link-icon-e siebui-fs-db-common siebui-showless");var n=l.getGanttCtrlHeight();l.setGanttCtrlHeight(parseInt(n*2,10)),g()}else if($("#db_resize").hasClass("siebui-showless")){$("#db_resize").html("");var t='<a href="javascript:void()"><img src="images/btn_more.gif" border="0" space="0" hspace="0" alt="'+d+'"'+"title="+'"'+d+'"'+"></a>";$("#db_resize").append(t),$("#db_resize").attr("class","siebui-link-icon-e siebui-fs-db-common siebui-showmore");var n=l.getGanttCtrlHeight();l.setGanttCtrlHeight(parseInt(n/2,10)),g()}})},v.prototype.BindData=function(){SiebelAppFacade.fsDispatchBoardRenderer.superclass.BindData.call(this);var e=this.GetPM().Get("Schedulerecordset");e.length>0&&x.call(this,e)},v.prototype.SetHScrollPos=function(){var e=this.GetPM();if(e.Get(c)=="4"||e.Get(c)=="512"||e.Get(c)=="1024"||e.Get(c)=="2048"||e.Get(c)=="4096"||e.Get(c)=="1"||e.Get(c)=="64")if(e.Get("EndTime")){var t=new Date(e.Get("StartDate")),n=String(e.Get("StartTime")),r=new Date(e.Get("paddingMiddleDayMillis")),i=e.Get("DayLoc"),s=0;e.ExecuteMethod("setHoursFrom",t,n),s=i[r.format("MM/dd/yyyy")],s*=e.Get("MinGanttsize"),$(".siebui-splitBox3").scrollLeft(s)}else SiebelAppFacade.fsDispatchBoardRenderer.superclass.SetHScrollPos.call(this);else SiebelAppFacade.fsDispatchBoardRenderer.superclass.SetHScrollPos.call(this)},v.prototype.calcNonContiguousTime=function(e){var t=this.GetPM();if(t.Get(c)=="1"||t.Get(c)=="64"||t.Get(c)=="4"||t.Get(c)=="512"||t.Get(c)=="1024"||t.Get(c)=="2048"||t.Get(c)=="4096"){var n=t.Get("PixelsPerUnit"),r=t.Get("TDays"),s=t.Get("StartTime"),o=t.Get("EndTime"),u=0,a=new Date(t.Get(h)),f=t.Get("FinalWeekDays");pixels=n*$("#UGrid").width(),pixels&&(noOfUnits=parseInt(e/pixels));for(i=0;i<noOfUnits;)f.indexOf(a.getDay())!==-1&&i++,u++,a.setDate(a.getDate()+1);while(f.indexOf(a.getDay())==-1)u++,a.setDate(a.getDate()+1);return timePixels=e%pixels,startDay=t.Get(h)+u*r,pixels&&(startTime=parseInt(t.Get("StartTime")+timePixels/pixels*t.Get("AxisDuration"),10)),startDay+=startTime,parseInt(startDay,10)}return SiebelAppFacade.fsDispatchBoardRenderer.superclass.calcNonContiguousTime.call(this,e)},v.prototype.preparerowtasks=function(e,n){var r="",i=this.GetPM(),s=i.Get("Color Display By"),u=i.Get("Status Abbreviations"),a=i.Get("Booking Colors"),f,l,c,h,p,d,v,m,g,y,b,w,E,S,x,T,N;u&&(f=u.substring(u.indexOf(s)+s.length+1,u.indexOf(";",u.indexOf(s))));if(e)for(b in e)if(e.hasOwnProperty(b)){l=e[b][f],c=f+"_"+l,v="BGRCLR_"+e[b].BGRCLR,m="BDRCLR_"+e[b].BDRCLR,g="TXTCLR_"+e[b].LBL,h=a[c],h=a[v],p=a[m],d=a[g],h||(h=i.Get("EventDefaultColor")),E=e[b].width;if(typeof E=="undefined"||E==0)continue;S="",x=e[b].OLPCNT,typeof p!="undefined"&&typeof x=="undefined"&&(S="border-color:#"+p+";border-width:2px;"),w=e[b][t];if(!d||!w)d="";w||(w=""),T=e[b].DDID,T?N=o:(T="",N=""),r=r+'<div class="siebui-taskBox '+e[b].CLS+'" taskId="'+e[b].ID+'" id= "'+n.toString()+'" style="width:'+e[b].width+"%;height:"+e[b].height+"px;left:"+e[b].left+"%;margin-top:"+e[b].top+"px;"+S+'">'+'<div class="siebui-layout" style="background-color:#'+h+';">'+'<div class="taskStatus" status="'+e[b].GS+'">'+'<a class="'+N+'" data-drilldown-type= "UGrid" data-drilldown-id="'+T+'" style="color:#'+d+';">'+w+"</a>"+"</div></div>";if(e[b]["ACTTT"]!=""&&a.ACTTT_TTD==="Y"){var C=new Date(e[b].ST),k=new Date(e[b].ET),L=e[b].top-e[b].height+4,A=e[b].ACTTT*6e6/(k-C);r=r+'<div class="siebui-layout" style="width:'+A+"%;margin-top:"+L+"px;background-color:#"+a.ACTTT_HPC+';"/>'}r+="</div>"}return r},v}(),"SiebelAppFacade.fsDispatchBoardRenderer"}));
