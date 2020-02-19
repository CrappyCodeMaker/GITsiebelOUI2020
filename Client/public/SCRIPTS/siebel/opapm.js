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
typeof SiebelAppFacade.OPAPM=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.OPAPM"),define("siebel/opapm",["siebel/dynacontrolpm"],function(){return SiebelAppFacade.OPAPM=function(){function f(){SiebelAppFacade.OPAPM.superclass.constructor.apply(this,arguments)}function l(i,s,o,u){if(i==="FrameEventMethodWFNavigate"){var a=CCFMiscUtil_CreatePropSet(),f=this.Get("GetControls");for(var l in f)if(f.hasOwnProperty(l)){var c=f[l],h=c.GetUIType();h!==n&&h!==t&&h!==r&&a.SetProperty(c.GetName(),this.ExecuteMethod("GetFieldValue",c))}a.SetProperty("action",i),a.SetProperty("Screen Id",this.Get("ScreenId"));var p,d=SiebelApp.S_App.GetService("OPA Interface Service");if(d){var v={};v.async=!1,v.selfbusy=!0,v.scope=this,v.cb=function(){p=arguments[2]},d.InvokeMethod("InvokeSubWorkflow",a,v)}p&&p.GetChildByType(e.get("SWE_RPC_PROP_ERRORS"))&&(u[e.get("SWE_EXTN_CANCEL_ORIG_OP")]=!0,u[e.get("SWE_EXTN_RETVAL")]=!1,this.ExecuteMethod("SetFocusToCtrl",this.Get("defaultControlFocus"),!0))}}function c(t,n,r,i){var s=t.GetUIType(),f=i.ReturnValue;s==u||s==o?(i.CancelOperation=!0,i.ReturnValue=p(f,t,!0,t.GetDisplayFormat(),e.get("ISO8601_DATETIME_FORMAT_T"))):s==a&&(i.CancelOperation=!0,i.ReturnValue=p(f,t,!1,t.GetDisplayFormat(),e.get("ISO_DATE_FORMAT")))}function h(t,n,r,i){var s=t.GetUIType(),f=i.ReturnValue;if(s==u||s==o){i.CancelOperation=!0;var l=f.split("T"),c=l[0]&&l[1]?l[0]+" "+l[1]:f;i.ReturnValue=p(c,t,!0,e.get("ISO8601_DATETIME_FORMAT"),t.GetDisplayFormat())}else s==a&&(i.CancelOperation=!0,i.ReturnValue=p(f,t,!1,e.get("ISO_DATE_FORMAT"),t.GetDisplayFormat()))}function p(e,t,n,r,s){var o=t.GetUIType(),u=e;return u!=""?(n?u=i.GetStringFromDateTime(e,r,s,!0):u=i.GetStringFromDateTime(e,r,s),u==""?e:u):u}var e=SiebelJS.Dependency("SiebelApp.Constants"),t=e.get("SWE_PST_BUTTON_CTRL"),n=e.get("SWE_CTRL_LABEL"),r=e.get("SWE_CTRL_IMAGECONTROL"),i=SiebelJS.Dependency("SiebelApp.S_App.LocaleObject"),s=SiebelJS.Dependency("SiebelApp.Utils"),o=e.get("SWE_CTRL_DATE_TIME_PICK"),u=e.get("SWE_CTRL_DATE_TZ_PICK"),a=e.get("SWE_CTRL_DATE_PICK");return SiebelJS.Extend(f,SiebelAppFacade.DynaControlPM),f.prototype.Setup=function(e){SiebelAppFacade.OPAPM.superclass.Setup.call(this,e);var t;e&&(t=e.GetChildByType(consts.get("SWE_APPLET_PM_PS")));if(t){var n=t.GetChildByType(consts.get("SWE_DYNA_CONTROL_PROPERTY"));n&&this.SetProperty("ScreenId",n.GetProperty("Screen Id"))}},f.prototype.Init=function(){SiebelAppFacade.OPAPM.superclass.Init.apply(this,arguments),this.AddMethod("InvokeMethod",l,{sequence:!0,scope:this}),this.AddMethod("GetFieldValue",c,{sequence:!1,scope:this}),this.AddMethod("GetFormattedFieldValue",h,{sequence:!1,scope:this})},f}(),SiebelAppFacade.OPAPM}));
