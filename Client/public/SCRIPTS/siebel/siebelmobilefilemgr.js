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
typeof SiebelApp=="undefined"&&(SiebelApp={}),typeof SiebelApp.MobileFileMgr=="undefined"&&(SiebelApp.MobileFileMgr=function(){function e(){var t;return e=function(){return t},e.prototype=this,t=new e,t.constructor=e,t}var t=0,n=new e,r=localStorage.getItem("isAdfmContainer");return e.prototype.adfInvoke=function(e,t){var n={success:function(e){},error:function(e){}};return $.extend(n,t),adf.mf.api.invokeMethod("com.oracle.determinations.mobile.application.FileBean",e,t.filename,function(e,t){n.success(t)},function(e,t){n.error(t)}),this},e.prototype.cordovaInvoke=function(e,t){var n={arguments:[],success:function(e){},error:function(e){}};return $.extend(n,t),Cordova.exec(function(e){n.success(e)},function(e){n.error(e)},"IOSService",e,n.arguments),this},e.prototype.Write=function(e){if(r){var n=5e5,i=0,s=e.content.length;t+=s;var o=function(){if(i>=s){e.success();return}var r=i+n;r=r>s?s:r;var u=e.content.substring(i,r);i+=n;var a=function(){t-=u.length};adf.mf.api.invokeMethod("com.oracle.determinations.mobile.application.FileBean","writeFile",e.filename,u,function(){a()},function(){e.error()});var f=function(){if(t<5e7){o();return}setTimeout(f,500)};f()};o()}else e.success();return this},e.prototype.WriteTempWithFlag=function(e){if(r){var t=40960,n=0,i=e.content.length,s=e.append?!0:!1,o=!0,u=function(){if(n>=i){e.success();return}var r=n+t;r=r>i?i:r;var a=e.content.substring(n,r);n+=t;var f=!0;o?f=s:f=!0,adf.mf.api.invokeMethod("com.oracle.determinations.mobile.application.FileBean","writeTempFileWithFlag",e.filename,a,f,function(){o=!1,u()},function(){e.error()})};u()}else e.success();return this},e.prototype.Open=function(e){if(e&&e.filename&&r){var t=!1;adf.mf.api.invokeMethod("com.oracle.determinations.mobile.application.FileBean","displayFile",e.filename,e.displayFileName,function(n,r){t=!0,e&&e.success&&e.success(r)},function(n,r){t=!0,e&&e.error?e.error(r):alert(r.message)});var n=function(){if(!t){var n=SiebelApp.S_App.LocaleObject.GetLocalString("IDS_CLIENT_ERROR_FILE_OPEN");n=n.replace("%1",e.displayFileName),alert(n)}};setTimeout(n,2e3)}return this},e.prototype.OpenTempFile=function(e){return e&&e.filename&&r?(adf.mf.api.invokeMethod("com.oracle.determinations.mobile.application.FileBean","displayFileFromTemp",e.filename,e.displayFileName,function(t,n){e&&e.success&&e.success(n)},function(t,n){e&&e.error?e.error(n):alert(n.message)}),this):this},e.prototype.Unzip=function(e){return e&&e.filename&&r&&adf.mf.api.invokeMethod("com.oracle.determinations.mobile.application.FileBean","unzipFile",e.filename,function(t,n){e&&e.success&&e.success(n)},function(t,n){e&&e.error&&e.error(n)}),this},e.prototype.DeleteFilePath=function(e){return e&&e.filename&&r&&this.adfInvoke("deleteFile",e),this},e.prototype.StartHttpServer=function(e){if(r){var t=this,n={success:function(e){},error:function(e){}};$.extend(n,e);var i=n.success;n.success=function(e){localStorage.setItem("httpServerPort",e),i(e)},t.cordovaInvoke("starthttpserver",n)}return this},e.prototype.StopHttpServer=function(e){return r&&this.cordovaInvoke("stophttpserver",e),this},e.prototype.GetHttpURLPrefix=function(e){if(!r)return;var t=this,n={success:function(e){},error:function(e){}};$.extend(n,e);var i=function(e){var n=function(e){var n=parseInt(localStorage.getItem("tsStartingLServer"));n&&n>0&&(new Date).valueOf()-parseInt(n)<5e3?setTimeout(function(){t.GetHttpURLPrefix(e)},1e3):(localStorage.setItem("tsStartingLServer",(new Date).valueOf()),t.StartHttpServer({success:function(t){localStorage.setItem("tsSuccessLocalServer",(new Date).valueOf()),localStorage.removeItem("tsStartingLServer"),e.success("http://localhost:"+t)},error:function(t){localStorage.removeItem("tsStartingLServer");var n=SiebelApp.S_App.LocaleObject.GetLocalString("IDS_SWE_CKEDITOR_NOT_AVAILABLE");e.error(n)}}))};t.detectServer({success:function(t){e.success(t),localStorage.removeItem("tsStartingLServer")},error:function(){n(e)}})},s=parseInt(localStorage.getItem("tsSuccessLocalServer")),o=localStorage.getItem("httpServerPort");return s&&s>0&&(new Date).valueOf()-parseInt(s)<5e3&&o&&parseInt(o)>0?n.success("http://localhost:"+o):i(n),this},e.prototype.detectServer=function(e){var t={success:function(e){},error:function(e){}};$.extend(t,e);var n=localStorage.getItem("httpServerPort");if(n&&parseInt(n)>0){var r=$("<img src='http://localhost:"+n+"/e5a6126c-9ffc-44d9-b4dc-6a0c7b6667a6-detect.gif'>");r.load(function(){r.remove(),localStorage.setItem("tsSuccessLocalServer",(new Date).valueOf()),t.success("http://localhost:"+n)}),r.error(function(){r.remove(),t.error()}),$("body").append(r)}else t.error()},n}());
