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
typeof SiebelAppFacade.EmailPModel=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.EmailPModel"),define("siebel/emailpmodel",["siebel/pmodel"],function(){return SiebelAppFacade.EmailPModel=function(){function i(e){SiebelAppFacade.EmailPModel.superclass.constructor.call(this,e)}function s(){return n===null&&(n=SiebelApp.WebSocketManager.CreateWSHandler(e.get("WS_COMPONENT_TYPE_EMAIL")),n.timeoutID=null,n.OnClose=f,n.OnFail=a,n.OnMessage=u),n}function o(){n&&(n.Unregister(),n=null)}function u(n){var i=n[e.get("WS_EMAIL_MAIL_INFO_PROCESSED")];if(i!==undefined){SiebelApp.S_App.uiStatus.Free(),c();if(i===!1){var s=SiebelApp.S_App.LocaleObject.GetLocalString("IDS_EMAIL_SEND_EXT_FAILED");s=s.replace("%1",r),SiebelJS.Debug("[DISA][Error] "+s),t.Alert(s)}h()}}function a(){l()}function f(){SiebelJS.Debug("[DISA][Warning] DISA was closed during sending email from DISA."),l()}function l(){SiebelApp.S_App.uiStatus.Free(),c(),h()}function c(){n&&n.timeoutID&&(window.clearTimeout(n.timeoutID),n.timeoutID=null)}function h(){SiebelApp.S_App.GetPopupPM().OnControlEvent("ClosePopupByX",document.createEvent("Event"))}function p(t){if(!t)return;var n=e.get("WS_EMAIL_MAIL_INFO"),i=t.GetChildByType(n);if(i){var o=e.get("WS_EMAIL_MAIL_CLIENT_TYPE"),u=e.get("WS_EMAIL_MAIL_INFO_TO"),a=e.get("WS_EMAIL_MAIL_INFO_CC"),f=e.get("WS_EMAIL_MAIL_INFO_BCC"),l=e.get("WS_EMAIL_MAIL_INFO_SUBJECT"),c=e.get("WS_EMAIL_MAIL_INFO_BODY");r=i.GetProperty(o);var p=i.GetProperty(u),d=i.GetProperty(a),v=i.GetProperty(f),m=i.GetProperty(l),g=i.GetProperty(c);if(r===e.get("WS_EMAIL_EXT_MAIL_CLIENT")){var y="mailto:"+p+"?";d&&(y+="cc="+d+"&"),v&&(y+="bcc="+v+"&"),m&&(y+="subject="+m+"&"),g&&(y+="body="+g);var b=document.createElement("a");$(b).attr("href",y).appendTo("div[name=popup]"),b.click(),setTimeout(h,100)}else{SiebelApp.S_App.uiStatus.Busy({mask:!0});var w=e.get("WS_EMAIL_MAIL_INFO_LANGUAGE_CODE"),E=e.get("WS_EMAIL_MAIL_INFO_HTMLBODY"),S=e.get("WS_EMAIL_MAIL_INFO_CONNECT"),x=e.get("WS_EMAIL_MAIL_INFO_ATTACHMENTS"),T=i.GetProperty(w),N=i.GetProperty(E),C={};C[o]=r,C[w]=T,C[u]=p,C[a]=d,C[f]=v,C[l]=m,N?C[E]=N:g&&(C[c]=g);var k=i.GetChildByType(S);if(k){var L=e.get("WS_EMAIL_MAIL_INFO_CONNECT_URL"),A=e.get("WS_EMAIL_MAIL_INFO_CONNECT_CMD"),O=e.get("WS_EMAIL_MAIL_INFO_CONNECT_SECURE"),M=e.get("WS_EMAIL_MAIL_INFO_CONNECT_USER_NAME"),_=e.get("WS_EMAIL_MAIL_INFO_CONNECT_PASSWORD"),D={};D[L]=k.GetProperty(L),D[A]=k.GetProperty(A),D[O]=k.GetProperty(O),D[M]=k.GetProperty(M),D[_]=k.GetProperty(_),C[S]=D}var P=i.GetChildByType(x);if(P){var H=e.get("WS_EMAIL_MAIL_INFO_ATTS_FILE_PATH"),B=e.get("WS_EMAIL_MAIL_INFO_ATTS_FILE_NAME"),j=e.get("WS_EMAIL_MAIL_INFO_ATTS_DISP_FILE_NAME"),F=P.EnumChildren(!0);if(F){var I=[];do{var q={};q[H]=F.GetProperty(H),q[B]=F.GetProperty(B),q[j]=F.GetProperty(j),I.push(q)}while(F=P.EnumChildren(!1));C[x]=I}}var R={};R[n]=C;var U=s();U.SendMessage(R),U.timeoutID=setTimeout(function(){SiebelJS.Debug("[DISA][Warning] Sending email from DISA time out."),SiebelApp.S_App.uiStatus.Free(),h()},e.get("WS_EMAIL_SEND_TIMEOUT"))}}}var e=SiebelJS.Dependency("SiebelApp.Constants"),t=SiebelJS.Dependency("SiebelApp.Utils"),n=null,r="";return SiebelJS.Extend(i,SiebelAppFacade.PresentationModel),i.prototype.Init=function(){SiebelAppFacade.EmailPModel.superclass.Init.call(this),this.AddProperty("CcCaption","Cc"),this.AddProperty("BccCaption","Bcc")},i.prototype.Setup=function(e){e.SetProperty("SWE_OUI_RENDERER","EmailRenderer"),SiebelAppFacade.EmailPModel.superclass.Setup.call(this,e),p.call(this,e)},i.prototype.EndLife=function(){o.call(this),SiebelAppFacade.EmailPModel.superclass.EndLife.call(this)},i}(),SiebelAppFacade.EmailPModel}));
