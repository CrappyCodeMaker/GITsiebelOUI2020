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
typeof SiebelAppFacade.GanttLegendBar=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.GanttLegendBar"),SiebelAppFacade.GanttLegendBar=function(){function t(){}var e=SiebelJS.Dependency("SiebelApp.Constants");return t.prototype.init=function(e,t){this.element=e,this.id=t},t.prototype.createLegends=function(t,n){var r=$("#"+this.id),s,o=0,u=8,a=0,f=SiebelApp.S_App.IsAutoOn(),l;r.remove(),s='<div class="siebui-legendTable" id='+this.id+"",f==="true"&&(s+=' ot = "div" rn = "Legend" un = "Legend"'),s+='><div class="siebui-legendTableRow">';for(i=0;i<t.length;i++){o>=u&&(s+='</div><div class="siebui-legendTableRow">',o=0);var c='<div class="siebui-legendTableCell"><div class="siebui-legendTable"><div class="siebui-legendTableRow"><div class="siebui-legendBoxCell"><span class="siebui-legendBox" style="color:'+t[i].color+';">&#9632</span></div><div class="siebui-legendKeyCell">';l="title='"+t[i].displayValue+"'",f==="true"&&(l+=" ot = 'div' rn = "+t[i].displayValue+" un = 'LB"+t[i].displayValue+"'"),c+=SiebelAppFacade.HTMLTemplateManager.GenerateMarkup({type:e.get("SWE_CTRL_PLAINTEXT"),className:"siebui-legendkey",value:t[i].displayValue,attrs:l}),c+="</div></div></div></div>",s+=c,o+=1}while(o<u&&o>=1)s+='<div class="siebui-legendTableCell"></div>',o+=1;s+="</div></div>",this.element.append(s),this.ShowLegends(n)},t.prototype.ShowLegends=function(e){e?$("#"+this.id).css("display","table"):$("#"+this.id).css("display","none")},t}());
