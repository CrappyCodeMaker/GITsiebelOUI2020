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
typeof SiebelAppFacade.EditUIPModel=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.EditUIPModel"),define("siebel/epuipmodel",["siebel/listpmodel"],function(){return SiebelAppFacade.EditUIPModel=function(){function n(e){SiebelAppFacade.EditUIPModel.superclass.constructor.call(this,e);var t=[],n=[],r=[],i=[],s=[],o=[];this.SetReadOnlyControl=function(e){t=e},this.GetReadOnlyControls=function(){return t},this.SetHideControlPartInfo=function(e){n=e},this.GetHideControlPartInfo=function(){return n},this.SetRowLevelControls=function(e){r=e},this.GetRowLevelControls=function(){return r},this.SetControlDynCaptions=function(e){i=e},this.GetControlDynCaptions=function(){return i},this.SetHeaderIdentifier=function(e){o=e},this.GetHeaderIdentifier=function(){return o},this.SetResetFocusToHeader=function(e){return s=e},this.GetResetFocusToHeader=function(){return s}}function r(e){var t=e.split(","),n=t[0],r=t[1],i=t[2];return{Control:n,Info:{Field:r,Value:i}}}function i(e){var t=e.GetChildByType("apm");if(!t||typeof t=="undefined")return;var n=t.EnumProperties(!0),i=[],s=[],o=[],u=[],a=[],f=[];do{var l=t.GetProperty(n);if(n.indexOf("Row Level Hide Control")!==-1||n.indexOf("Hide Layout Part")!==-1){var c=r(l);s[c.Control]=c.Info}else if(n.indexOf("Row Level Controls")!==-1){var h=l.split(",");for(var p=0;p<h.length;p++)o[h[p]]=!0}else if(n.indexOf("Reset Focus To Header")!==-1){var d=l.split(",");for(var p=0;p<d.length;p++)a[d[p]]=!0}else if(n.indexOf("Read Only Field")!==-1){var v=r(l);i[v.Control]=v.Info}else if(n==="Record Group Field")this.SetProperty("RecordGroupField",l);else if(n==="Accordion Identifier"){var m=r(l);f[m.Control]=m.Info}else if(n.indexOf("Dyn Caption Control")!==-1){var g=l.split(",");u[g[0]]=g[1]}}while(n=t.EnumProperties(!1));this.SetHideControlPartInfo(s),this.SetReadOnlyControl(i),this.SetRowLevelControls(o),this.SetControlDynCaptions(u),this.SetHeaderIdentifier(f),this.SetResetFocusToHeader(a)}var e=SiebelJS.Dependency("SiebelAppFacade.FacadeConstants"),t=SiebelJS.Dependency("SiebelApp.Constants");SiebelJS.Extend(n,SiebelAppFacade.ListPresentationModel),n.prototype.Init=function(){SiebelAppFacade.EditUIPModel.superclass.Init.call(this),this.AddProperty("LastBoundData",[]),this.AddProperty("RecordGroupField",""),this.AddMethod("CanShowRowLevelControl",s,{scope:this}),this.AddMethod("IsRowLevelControl",a,{scope:this}),this.AddMethod("IsControlReadOnly",f,{scope:this}),this.AddMethod("GetControlCaption",l,{scope:this}),this.AddMethod("IsRuleRow",u,{scope:this}),this.AddMethod("CanResetFocusToHeader",o,{scope:this})},n.prototype.Setup=function(e){SiebelAppFacade.EditUIPModel.superclass.Setup.call(this,e),i.call(this,e)};var s=function(e,t){var n=this.GetHideControlPartInfo();if(!n.hasOwnProperty(e))return!0;var r=n[e].Field,i=n[e].Value,s=this.Get("GetRawRecordSet");if(t>=s.length)return!1;var o=s[t][r];return o!==i},o=function(e){var t=headerFocusControls.hasOwnProperty(e)&&this.GetResetFocusToHeader()[e]===!0?!0:!1;return t},u=function(e){var t=this.Get("GetRawRecordSet"),n=e<t.length&&t[e][this.GetHeaderIdentifier().AccordionHeader.Field]==="N"?!0:!1;return n},a=function(e){var t=this.GetRowLevelControls();return t.hasOwnProperty(e)&&t[e]===!0?!0:!1},f=function(e,t){var n=this.GetReadOnlyControls();if(!n.hasOwnProperty(e))return!1;var r=n[e].Field,i=n[e].Value,s=this.Get("GetRawRecordSet"),o=s[t][r];return o===i},l=function(e,t){var n=this.GetControlDynCaptions();if(!n.hasOwnProperty(e))return"";var r=n[e],i=this.Get("GetRawRecordSet");return i[t][r]};return n}(),"SiebelAppFacade.EditUIPModel"}));
