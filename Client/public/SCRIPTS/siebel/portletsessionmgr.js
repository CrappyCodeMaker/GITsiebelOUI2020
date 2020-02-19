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
typeof SiebelApp.S_App.PortletSessionMgr=="undefined"&&(SiebelJS.Namespace("SiebelApp.S_App.PortletSessionMgr"),SiebelApp.S_App.PortletSessionMgr=function(){function i(){function v(t){l=t.GetProperty(e.get("SWE_PROP_PORTLET_ORIGIN_LIST")),d=Number(t.GetProperty(e.get("SWE_PROP_PORTLET_API_FAILUREATTEMPT"))),p=Number(t.GetProperty(e.get("SWE_PROP_PORTLET_API_BLOCK_TIME")));var n=t.GetProperty(e.get("SWE_PARAM_PORTLET_API_BLOCKE_ORIGIN_LIST"));n&&g.call(this,!1,n.split(","))}function m(t){t=t.replace(/SWEAC[\s]*=/g,"").replace("SWECmd%3d","SWECmd="),f&&(t+="&"+e.get("SWE_PARAM_KEEPALIVE")+"=1"),u=encodeURI(t)}function g(n,r){for(var i=0;i<r.length;i++)h[r[i]]=!0;var o=CCFMiscUtil_CreatePropSet(),u=CCFMiscUtil_CreatePropSet(),a={};setTimeout(function(){for(var t=0;t<r.length;t++)h[r[t]]=!1,c[r[t]]=0;u.SetProperty(e.get("SWE_PARAM_PORTLET_API_BLOCKE_ORIGIN_LIST"),w()),SiebelApp.S_App.CallServer(u,o,!1,a)},p*1e3),n&&(u.SetProperty(e.get("SWE_PARAM_PORTLET_API_BLOCKE_ORIGIN_LIST"),w()),SiebelApp.S_App.CallServer(u,o,!1,a),t.Alert(s.GetLocalString("IDS_PORTLET_API_BLOCK_MSG").replace("%1",p)))}function y(){var t=CCFMiscUtil_CreatePropSet(),n=CCFMiscUtil_CreatePropSet(),r=a*1e3-100,i={};n.SetProperty(e.get("SWE_CMD_ARG"),e.get("SWE_PROP_PING")),i.selfbusy=!0,setInterval(function(){SiebelApp.S_App.CallServer(n,t,!1,i)},r)}function b(t){var n=r.length,i=!1,s=t[e.get("SWE_CMD_ARG")];if(!t.Key||t[e.get("SWE_METHOD_STR")])i=!1;else for(var o=0;o<n;o++)if(s===r[o]){i=!0;break}return i}function w(){var e="";for(var t in h)h.hasOwnProperty(t)&&h[t]&&(e=t+","+e);return e}function E(e){var t=l.split(","),n=t.length;for(var r=0;r<n;r++)if(t[r]===e)return!0;return!1}var s=SiebelApp.S_App.LocaleObject,u="",a=0,f=!1,l="",c={},h={},p,d;return n=this,SiebelApp.S_App.PortletSessionMgr=function(){return n},SiebelApp.S_App.PortletSessionMgr.GetInstance=i.GetInstance,n.constructor=i,this.GetAction=function(){return u},this.ProcessPortalRequest=function(n,r){if(!E(n)){t.Alert(s.GetLocalString("IDS_PORTLET_API_UNAUTHORIZED_REQUEST"));return}c[n]||(c[n]=0);if(h[n]){t.Alert(s.GetLocalString("IDS_PORTLET_API_BLOCK_MSG").replace("%1",p));return}if(c[n]>=d){g.call(this,!0,n.split(","));return}if(!b(r)){++c[n],t.Alert(s.GetLocalString("IDS_PORTLET_API_UNAUTHORIZED_REQUEST"));return}if(r[e.get("SWE_CMD_ARG")]=="Logoff"){var i,o;SiebelApp.S_App.InvokeMethod("Logoff",i,o)}else{var u=e.get("SWE_PARAM_PORTLET_API_KEY"),a=e.get("SWE_CMD_ARG"),f=e.get("SWE_AUX_CMD_STR"),l=CCFMiscUtil_CreatePropSet(),v=CCFMiscUtil_CreatePropSet(),m={};m.selfbusy=!0,m.scope=this;var y=function(){var e=n;SiebelApp.S_App.ErrorObject.GetErrorArray(SiebelApp.S_App).length>0?++c[e]:c[e]=0};SiebelApp.S_App.PushPostBack(y,this),v.SetProperty(u,r.Key);for(var w in r)r.hasOwnProperty(w)&&w!==u&&w!==f&&v.SetProperty(w,r[w]);SiebelApp.S_App.CallServer(v,l,!0,m)}},this.ProcessPortletInfo=function(n){a=n.GetProperty(e.get("SWE_PROP_SESSIONTIMEOUT_VALUE")),t.IsTrue(n.GetProperty(e.get("SWE_PARAM_KEEPALIVE")))&&(f=!0),v.call(this,n),m.call(this,n.GetProperty(e.get("SWE_PROP_PORTLET_ACTION"))),f&&y.call(this)},o.call(this),n}function s(e){SiebelApp.S_App.PortletSessionMgr.GetInstance().ProcessPortalRequest(e.origin,e.data)}function o(){window.addEventListener?window.addEventListener("message",s,!1):window.attachEvent("onmessage",s,!1)}var e=SiebelJS.Dependency("SiebelApp.Constants"),t=SiebelJS.Dependency("SiebelApp.Utils"),n,r=[e.get("SWE_GOTO_VIEW"),e.get("SWE_GET_APPLET"),e.get("SWE_CMD_LOGOFF")];return i.GetInstance=function(){return n},i}());
