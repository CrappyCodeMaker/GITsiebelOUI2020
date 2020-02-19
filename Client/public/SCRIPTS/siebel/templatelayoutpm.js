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
typeof SiebelAppFacade.TemplateLayoutPM=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.TemplateLayoutPM"),define("siebel/templatelayoutpm",[],function(){return SiebelAppFacade.TemplateLayoutPM=function(){function i(e){SiebelAppFacade.TemplateLayoutPM.superclass.constructor.call(this,e)}function s(e,t,n,r){this.SetProperty("contentControl",e),this.SetProperty("contentDropdownControl",t),this.SetProperty("contentDisplayArray",n),this.SetProperty("contentFieldArray",r);return}function o(e,t,n,r){this.SetProperty("layoutControl",e),this.SetProperty("layoutDropdownControl",t),this.SetProperty("layoutDisplayArray",n),this.SetProperty("layoutFieldArray",r),this.SetProperty("layoutDisplayArrayM",this.Get("layoutDisplayArray").slice(0)),this.SetProperty("layoutFieldArrayM",this.Get("layoutFieldArray").slice(0));return}function u(e){var t=this.Get("defWidth"),n=this.Get("extWidth"),r=this.ExecuteMethod("GetComboHtmlAttr","height",e),i=this.ExecuteMethod("GetComboHtmlAttr","width",e),s=[];return i<=0&&(i=t),r<=0&&(r=i),i+=n,s.push(r.toString()+"px"),s.push(i.toString()+"px"),s}function a(e,t){var n="0",r=0,i=[];if(!e||!t)return r;var s=e+"=",o=t.slice(0);o=o.trim().toLowerCase();if(o.indexOf(s)>=0){i=o.split(" ");for(var u=0;u<i.length;u++){var a=i[u].search(s);if(a>=0){n=i[u].substring(a+s.length,i[u].length);break}}}return n=n.replace(/"/g,""),r=Number(n),r}function f(){var e=this.Get("contentDisplayArray"),t=this.Get("layoutDisplayArrayM"),n=this.Get("mapDisplayExt");for(var r=0;r<e.length;r++){var i=t.indexOf(e[r]);i<0?n[e[r]]="":n[e[r]]="0"}this.SetProperty("mapDisplayExt",n)}function l(e){var t=this.Get("mapDisplayExt"),n=this.Get("strExt"),r=this.Get("comma"),i="",s=t[e];if(!s)i="",t[e]="0";else{var o=s.split(r);o.sort(function(e,t){return t-e});var u=Number(o[0]);u++,u>0&&(i=n+u.toString());var a=s+r+u.toString();t[e]=a}return this.SetProperty("mapDisplayExt",t),i}function c(e){var t=this.Get("mapDisplayExt"),n=this.Get("strExt"),r=this.Get("comma"),i=e.lastIndexOf(n),s="",o="";i<0?(s=e,o="0"):(s=e.substring(0,i),o=e.substring(i+1));var u=t[s];if(!u)return;var a=u.split(r);i=a.indexOf(o);if(i<0)return;a.splice(i,1),t[s]=a.toString(),this.SetProperty("mapDisplayExt",t);return}function h(e,t){var n=this.Get("mapFieldValue");n[t]=e,this.SetProperty("mapFieldValue",n);return}function p(e){var t=this.Get("mapFieldValue"),n=t[e];return n||(n=e),n}function d(){var e=this.Get("layoutDisplayArrayM"),t=this.Get("layoutFieldArrayM"),n=CCFMiscUtil_CreatePropSet();for(var r=0;r<e.length;r++){var i=CCFMiscUtil_CreatePropSet();i.SetProperty("DisplayName",e[r]),i.SetProperty("FieldValue",t[r]),n.AddChild(i)}return n}function v(e){var t=this.Get("layoutControl"),n=this.Get("layoutDropdownControl");if(!t||!n)return;var r=this.ExecuteMethod("GetLayoutPS");t.SetRadioGroupPropSet(r);var i=t.GetIndex();n.SetValue(e,i);return}function m(){var e=this.Get("contentControl"),t=this.Get("contentFieldArray");if(!e)return;if(this.Get("IsContentEmpty")===!0)return;var n=e.GetValue(),r=t.indexOf(n);if(r<0)return;this.ExecuteMethod("AddItemsToLayout",r,r);return}function g(){var e=this.Get("contentDisplayArray");if(this.Get("IsContentEmpty")===!0)return;var t=0,n=e.length-1;this.ExecuteMethod("AddItemsToLayout",t,n);return}function y(e,t){var n=this.Get("layoutControl"),r=this.Get("contentDisplayArray"),i=this.Get("contentFieldArray"),s=this.Get("layoutDisplayArrayM"),o=this.Get("layoutFieldArrayM"),u=CCFMiscUtil_CreatePropSet();if(!n)return;if(e<0||t<e||t>r.length-1)return;for(var a=e;a<=t;a++){var f=r[a],l=i[a],c=this.ExecuteMethod("GetDisplayExt",f);f+=c;var h=l+c;this.ExecuteMethod("SaveOrigFieldValue",l,h),s.push(f),o.push(h)}if(s.length!==o.length)return;var p="",d=n.GetValue(),v=o.indexOf(d);v>=0&&v<s.length&&(p=s[v]),this.SetProperty("layoutDisplayArrayM",s),this.SetProperty("layoutFieldArrayM",o),this.ExecuteMethod("SetLayoutList",p);return}function b(){var e=this.Get("layoutControl"),t=this.Get("layoutDisplayArray"),n=this.Get("layoutFieldArray"),r=this.Get("layoutDisplayArrayM"),i=this.Get("layoutFieldArrayM"),s=CCFMiscUtil_CreatePropSet();if(!e)return;var o=e.GetValue(),u="",a=i.indexOf(o);a>=0&&a<r.length&&(u=r[a]),r=t.slice(0),i=n.slice(0),this.SetProperty("layoutDisplayArrayM",r),this.SetProperty("layoutFieldArrayM",i),this.ExecuteMethod("SetLayoutList",u),this.ExecuteMethod("SetDisplayExtMap");return}function w(e){var t=this.Get("layoutFieldArrayM"),n="";for(var r=0;r<t.length;r++){var i=this.ExecuteMethod("GetOrigFieldValue",t[r]);n=n+i+"	"}e.SetProperty("SubmitLayout",n);return}function E(e){var t=this.Get("layoutControl"),n=this.Get("layoutDisplayArrayM"),r=this.Get("layoutFieldArrayM"),i=CCFMiscUtil_CreatePropSet(),s=[],o=[];if(!t)return;var u=t.GetValue(),a=r.indexOf(u);if(a<0)return;var f="";e==="Top"&&(s.push(r[a]),o.push(n[a]),f=o[0]);for(var l=0;l<r.length;l++)l!==a&&(s.push(r[l]),o.push(n[l]));e==="Bottom"&&(s.push(r[a]),o.push(n[a]),f=o[o.length-1]);if(e==="Remove"){var c=n[a];this.ExecuteMethod("RemoveDisplayExt",c)}r=s.slice(0),n=o.slice(0),this.SetProperty("layoutDisplayArrayM",n),this.SetProperty("layoutFieldArrayM",r),this.ExecuteMethod("SetLayoutList",f);return}function S(e){var t=this.Get("layoutControl"),n=this.Get("layoutDisplayArrayM"),r=this.Get("layoutFieldArrayM"),i=CCFMiscUtil_CreatePropSet();if(!t)return;var s=t.GetValue(),o=r.indexOf(s);if(o<0)return;if(e==="Up"&&o===0)return;if(e==="Down"&&o>=r.length-1)return;var u=0,a=n[o];if(e==="Up")u=o;else{if(e!=="Down")return;u=o+1}var f="";f=r[u-1],r[u-1]=r[u],r[u]=f,f=n[u-1],n[u-1]=n[u],n[u]=f,this.SetProperty("layoutDisplayArrayM",n),this.SetProperty("layoutFieldArrayM",r),this.ExecuteMethod("SetLayoutList",a);return}function x(e){var t=this.Get("contentControl"),n=this.Get("contentDropdownControl"),r=this.Get("contentDisplayArray"),i=this.Get("contentFieldArray"),s=this.Get("IsContentEmpty"),o=this.Get("selContentDisplay"),u=CCFMiscUtil_CreatePropSet(),a=t.GetIndex();if(!t||!n)return;var f="";if(e==="Y"){var l=t.GetValue(),c=i.indexOf
(l);c>=0&&c<r.length&&(o=r[c]),this.SetProperty("selContentDisplay",o),s=!0}else{for(var h=0;h<r.length;h++){var p=CCFMiscUtil_CreatePropSet();p.SetProperty("DisplayName",r[h]),p.SetProperty("FieldValue",i[h]),u.AddChild(p)}f=o,s=!1}this.SetProperty("IsContentEmpty",s),t.SetRadioGroupPropSet(u),n.SetValue(f,a);return}function T(e,r,i){var s=arguments[arguments.length-1];if(!e)return;switch(e){case"AddItem":this.ExecuteMethod("AddItem"),s[t]=!0,s[n]=!1;break;case"AddAllItems":this.ExecuteMethod("AddAllItems"),s[t]=!0,s[n]=!1;break;case"MoveItemTop":this.ExecuteMethod("MoveItemEnd","Top"),s[t]=!0,s[n]=!1;break;case"MoveItemUp":this.ExecuteMethod("MoveItem","Up"),s[t]=!0,s[n]=!1;break;case"MoveItemDown":this.ExecuteMethod("MoveItem","Down"),s[t]=!0,s[n]=!1;break;case"MoveItemBottom":this.ExecuteMethod("MoveItemEnd","Bottom"),s[t]=!0,s[n]=!1;break;case"RemoveItem":this.ExecuteMethod("MoveItemEnd","Remove"),s[t]=!0,s[n]=!1;break;case"ToggleList":s[t]=!0,s[n]=!1;break;case"ResetLayout":this.ExecuteMethod("ResetLayout"),s[t]=!0,s[n]=!1;break;case"SaveTemplate":this.ExecuteMethod("SaveTemplate",r);break;case"CloseApplet":break;default:s[t]=!0,s[n]=!1}SiebelApp.S_App.uiStatus.Free();return}var e=SiebelJS.Dependency("SiebelApp.Constants"),t=e.get("SWE_EXTN_CANCEL_ORIG_OP"),n=e.get("SWE_EXTN_RETVAL"),r=e.get("SWE_EXTN_STOP_PROP_OP");return SiebelJS.Extend(i,SiebelAppFacade.PresentationModel),i.prototype.Init=function(){SiebelAppFacade.TemplateLayoutPM.superclass.Init.call(this,arguments),this.AddProperty("contentControl",null),this.AddProperty("contentDropdownControl",null),this.AddProperty("layoutControl",null),this.AddProperty("layoutDropdownControl",null),this.AddProperty("contentDisplayArray",[]),this.AddProperty("contentFieldArray",[]),this.AddProperty("layoutDisplayArray",[]),this.AddProperty("layoutFieldArray",[]),this.AddProperty("layoutDisplayArrayM",[]),this.AddProperty("layoutFieldArrayM",[]),this.AddProperty("defWidth",200),this.AddProperty("extWidth",50),this.AddProperty("IsContentEmpty",!1),this.AddProperty("selContentDisplay",""),this.AddProperty("strExt","-"),this.AddProperty("comma",","),this.AddProperty("mapDisplayExt",{}),this.AddProperty("mapFieldValue",{}),this.AddMethod("InvokeMethod",T,{scope:this,sequence:!0}),this.AddMethod("SetContentCtl",s),this.AddMethod("SetLayoutCtl",o),this.AddMethod("GetComboSize",u),this.AddMethod("GetComboHtmlAttr",a),this.AddMethod("SetDisplayExtMap",f),this.AddMethod("GetDisplayExt",l),this.AddMethod("RemoveDisplayExt",c),this.AddMethod("SaveOrigFieldValue",h),this.AddMethod("GetOrigFieldValue",p),this.AddMethod("GetLayoutPS",d),this.AddMethod("AddItem",m),this.AddMethod("AddAllItems",g),this.AddMethod("AddItemsToLayout",y),this.AddMethod("ResetLayout",b),this.AddMethod("SaveTemplate",w),this.AddMethod("MoveItemEnd",E),this.AddMethod("MoveItem",S),this.AddMethod("SetLayoutList",v),this.AddMethod("ChangeContentList",x),this.AttachEventHandler("ToggleContentList",function(e){this.ExecuteMethod("ChangeContentList",e)},{core:!0})},i}(),SiebelAppFacade.TemplateLayoutPM}));