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
typeof SiebelAppFacade.RecommendationRenderer=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.RecommendationRenderer"),define("siebel/recommendationrenderer",["siebel/phyrenderer"],function(){return SiebelAppFacade.RecommendationRenderer=function(){function t(e){SiebelAppFacade.RecommendationRenderer.superclass.constructor.call(this,e)}function t(e){SiebelAppFacade.RecommendationRenderer.superclass.constructor.call(this,e)}var e=SiebelJS.Dependency("SiebelApp.Constants");return SiebelJS.Extend(t,SiebelAppFacade.PhysicalRenderer),t.prototype.ShowUI=function(){var e=this.GetPM();$("#"+this.GetPM().Get("GetPlaceholder")).add({scroll:10,size:0,vertical:!0,itemFallbackDimension:200});var t=this.GetPM().Get("GetFullId"),n="s_"+t+"_div",r=$("#"+n);r.find(".AppletMenu").remove()},t.prototype.BindData=function(){SiebelAppFacade.RecommendationRenderer.superclass.BindData.call(this);var e=this.GetPM(),t=SiebelApp.S_App.GetService("RTD_NBA Integration Service"),n=e.Get("GetPlaceholder"),r=e.Get("GetBusComp").GetRecordSet(),i=e.Get("GetBusComp").GetName(),s=e.Get("GetBusComp").GetBusObj().GetName(),o=r.length,u,a="",f="",l="",c=SiebelApp.S_App.NewPropertySet(),h=SiebelApp.S_App.NewPropertySet();c.SetProperty("BCName",i),c.SetProperty("BOName",s),h=t.InvokeMethod("GetRequiredParams",c),u=h.GetChild(0).GetProperty("Application"),h.Reset(),c.Reset();if(o>0)for(var p=0;p<o;p++)a.search(r[p].offerCategory)===-1&&(a.length>0&&(a+=","),a+="'"+r[p].offerCategory+"'");c.SetProperty("Application",u),c.SetProperty("ChoiceGroups",a);var d=SiebelApp.S_App.NewPropertySet();if(t){h=t.InvokeMethod("GetChoiceGroupEvents",c);var v=h,m=v.GetChildCount();while(m>0){var g=v.GetChild(0);if(g!==null&&g.GetType()==="ChoiceGroup"){d=g;break}m=g.GetChildCount(),v=g}}f="<div class='siebui-dashboard-row'><br>",f+="<table width='100%' cellspacing='0' cellpadding='0' border='0' align='center' datatable='0'>",f+="<tbody>";for(var p=0;p<o;p++){var y=r[p].likelihoodIntensity,b=r[p].offerImage,w=r[p].name,E=r[p].offerCategory,S=r[p].Id;l="",l+="<tr align='left' class='AppletButtons'>",l+="<td nowrap='' class='AppletTitle'>"+w+"</td>";if(y){l+="<td nowrap='' class='AppletTitle'>";var x=5;x=Number(y),x===5?l+="<span class='stars5-img'></span>":x===4?l+="<span class='stars4-img'></span>":x===3?l+="<span class='stars3-img'></span>":x===2?l+="<span class='stars2-img'></span>":x===1&&(l+="<span class='stars1-img'></span>"),l+="</td>"}b&&(l+="<td nowrap='' class='AppletTitle'>",l+="<img src='",l+=b,l+="' alt ='"+w+"'>",l+="</td>");var T=d,m;T!==null&&(m=T.GetChildCount());for(var N=0;N<m;N++){var g=T.GetChild(N);if(g!==null&&g.GetProperty("ChoiceGroupName")===E){var C=g.GetChild(0);if(C!==null&&C.GetType()==="ListOfChoiceGroupEvent")for(var k=0,L=C.GetChildCount();k<L;k++){var A=C.GetChild(k),O=A.GetProperty("ResponseName"),M=A.GetProperty("RTDChoiceEventName"),_=A.GetProperty("ChoiceGroupEventId");l+="<td nowrap='' class='AppletTitle'>",l+="<span class='siebui-dashboard-cell'><button type='button' name="+S+"|"+_+"|"+M+">",l+=O,l+="</button></span>",l+="</td>"}}}l+="</tr >",f+=l}f+="</tbody></table>",f+="</div>",$("#"+n).html(""),$("#"+n).append(f)},t.prototype.BindEvents=function(){function e(e){if(e&&e.currentTarget){var t=e.data.ctx.GetPM(),n=e.currentTarget.name,r=n.split("|"),i=r[0],s=r[1],o=r[2],u=SiebelApp.S_App.NewPropertySet();u.SetProperty("ResponseId",s),u.SetProperty("vId",i),u.SetProperty("ResponseName",o);var a=t.ExecuteMethod("InvokeMethod","TrackResponse",u)}}SiebelAppFacade.RecommendationRenderer.superclass.BindEvents.call(this),$("#"+this.GetPM().Get("GetPlaceholder")).delegate("button","click",{ctx:this},e)},t}(),"SiebelAppFacade.RecommendationRenderer"}));
