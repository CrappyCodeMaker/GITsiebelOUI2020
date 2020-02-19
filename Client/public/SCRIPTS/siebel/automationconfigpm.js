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
typeof SiebelAppFacade.AutoCfgPM=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.AutoCfgPM"),define("siebel/automationconfigpm",["siebel/pmodel"],function(){return SiebelAppFacade.AutoCfgPM=function(){function i(e){SiebelAppFacade.AutoCfgPM.superclass.constructor.call(this,e)}function s(e,t,n,r,i){var s=this.Get("clobUpdateByUser");return s[i]=!0,this.SetProperty("clobUpdateByUser",s),o.call(this,e,t,n,r,i),s[i]=!1,this.SetProperty("clobUpdateByUser",s),!1}function o(e,i,s,o,f){var l=this.Get(f).split(n),c=l[i],h=c.split(r),p={userName:"",pwd:""},d={component:"",url:"",appType:"",osType:"",userName:"",pwd:"",srfPath:"",portNum:""},v={machine:"",userName:"",pwd:"",rootPath:"",srfPath:""},m;switch(f){case"userCredsClob":u.call(this,p,c,f),p[o]=e,l[i]=a.call(this,p),m=t.get("AUTO_USERCONTROL_NAME");break;case"serverCredsClob":u.call(this,d,c,f),d[o]=e,l[i]=a.call(this,d),m=t.get("AUTO_SERVERCONTROL_NAME");break;case"toolsCredsClob":u.call(this,v,c,f),v[o]=e,l[i]=a.call(this,v),m=t.get("AUTO_TOOLSCONTROL_NAME")}this.ExecuteMethod("SetFormattedValue",this.Get("GetControls")[m],l.join(n))}function u(e,t,n){var i=0,s=t.split(r),o="",u;switch(n){case"userCredsClob":o=f(s,2);break;case"serverCredsClob":o=f(s,8);break;case"toolsCredsClob":o=f(s,5)}u=o.split(r);for(var a in e)e[a]=u[i],i++}function a(e){var t="",n=0;for(var i in e)t+=(n!==0?r:"")+e[i],n++;return t}function f(e,t){var n="";for(var i=0;i<t;i++)n+=(i!==0?r:"")+(e[i]?e[i]:"");return n}var e=SiebelJS.Dependency("SiebelApp.Utils"),t=SiebelJS.Dependency("SiebelApp.Constants"),n=t.get("AUTO_CLOB_DELIM"),r=t.get("AUTO_OBJ_DELIM");return SiebelJS.Extend(i,SiebelAppFacade.PresentationModel),i.prototype.Init=function(){SiebelAppFacade.AutoCfgPM.superclass.Init.call(this),this.AddProperty("userCredsClob",""),this.AddProperty("serverCredsClob",""),this.AddProperty("toolsCredsClob",""),this.AddProperty("userCredsDivPlaceHolder",""),this.AddProperty("serverCredsDivPlaceHolder",""),this.AddProperty("toolsCredsDivPlaceHolder",""),this.AddProperty("clobUpdateByUser",{userCredsClob:!1,serverCredsClob:!1,toolsCredsClob:!1}),this.AddProperty("visibleRowLength",{userCredsClob:0,serverCredsClob:0,toolsCredsClob:0}),this.AttachEventHandler("OnInputFieldBlur",s)},i}(),"SiebelAppFacade.AutoCfgPM"}));
