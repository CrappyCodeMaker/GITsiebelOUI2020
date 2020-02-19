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
typeof SiebelApp.FileLoader=="undefined"&&(Namespace("SiebelApp.FileLoader"),SiebelApp.FileLoader=function(){function s(){var e;return s=function(){return e},s.prototype=this,e=new s,e.constructor=s,e}function o(t,s){if(s==="success"){var o=t.split("[");for(var u=0;u<o.length;u++){var a=o[u];if(e.IsEmpty(o[u]))continue;var f=a.split("]"),l=f[1].split("\n");n[f[0]]=[];for(var c=0;c<l.length;c++)l[c].charCodeAt(0)!=13&&!isNaN(l[c].charCodeAt(0))&&n[f[0]].push(l[c])}SiebelApp.FileLoader.LoadKey([],r,i)}}function u(e){try{SiebelJS.Log(e)}catch(e){}}var e=SiebelApp.Utils,t=new s,n={},r,i;return s.prototype.LoadKey=function(e,t,r){var i=SiebelApp.S_App.GetPageURL().split("start.swe")[0]+SiebelApp.S_App.GetScriptDir();require.config({baseUrl:i,waitSeconds:30}),require.onError=u;if(e instanceof Array){var s=[];for(var o=0;o<e.length;o++)s=s.concat(n[e[o]]);require(s,function(){r.call(t)})}else require(n[e],function(e){r.call(t)})},s.prototype.Load=function(e,t){var n=SiebelApp.S_App.GetPageURL().split("start.swe")[0]+SiebelApp.S_App.GetScriptDir();r=e,i=t,require.config({baseUrl:n,waitSeconds:30}),SiebelApp.AjaxRequestMgr.Get(n+"scriptfiles.txt",o)},t}());
