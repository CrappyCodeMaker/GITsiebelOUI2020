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
(function(){if(Object&&typeof Object.defineProperty!="function")return;var e=document,t=window,n=t.console,r=Object,i=r.defineProperty;try{i.call(r,n,"_commandLineAPI",{set:function(e){},get:function(){throw""}})}catch(s){}try{i.call(r,t,"_FirebugCommandLine",{set:function(e){},get:function(){throw""}})}catch(s){}try{i.call(r,e,"__IE_DEVTOOLBAR_CONSOLE_EVAL_RESULT",{set:function(e){throw""},get:function(){throw""}})}catch(s){}})();if(typeof SiebelJS=="undefined"){var SiebelJS={};SiebelJS.Namespace=function(e){var t=e.split("."),n=SiebelApp,r;t[0]==="SiebelApp"&&(t=t.slice(1));for(r=0;r<t.length;r+=1)typeof n[t[r]]=="undefined"&&(n[t[r]]={}),n=n[t[r]];return n},SiebelJS.Dependency=function(e){var t=e.split("."),n=window[t[0]];if(n)for(var r=1;r<t.length;r++){n=n[t[r]];if(!n)break}return n},SiebelJS.LogLevel="info",SiebelJS.Debug=function(e){SiebelJS.LogLevel==="debug"&&SiebelJS.Log(e instanceof Error?e:"[DEBUG] "+e)},SiebelJS.Log=function(e){typeof console=="object"&&typeof console.log!="undefined"&&(console.log(e),e instanceof Error&&(e.stack?console.log(e.stack):typeof console.trace=="function"&&console.trace()))},SiebelJS.Trace=function(){window.console&&typeof console.trace=="function"&&console.trace()},SiebelJS.Extend=function(e,t){if(typeof e=="undefined"){this.Log("subClass is undefined @ SiebJS.Extend");return}if(typeof t=="undefined"){this.Log("superClass is undefined @ SiebJS.Extend ");return}var n=function(){};n.prototype=t.prototype,e.prototype=new n,e.prototype.constructor=e,e.superclass=t.prototype,t.prototype.constructor==Object.prototype.constructor&&(t.prototype.constructor=t)}};
