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
typeof SiebelAppFacade.SearchModel=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.SearchModel"),define("siebel/searchmodel",["siebel/webpgpm"],function(){return SiebelAppFacade.SearchModel=function(){function e(){SiebelAppFacade.SearchModel.superclass.constructor.apply(this,arguments)}function t(){var e=SiebelApp.S_App.GetService("Invoke Search"),t=CCFMiscUtil_CreatePropSet(),n=CCFMiscUtil_CreatePropSet(),r,i,s,o=[],u=[];if(e){n=e.InvokeMethod("GetOUISearchLookinValues",t),r=n.GetChildCount();for(var a=0;a<r;a++){i=n.GetChild(a);if(i&&i.GetType()==="ResultSet")if(SiebelApp.S_App.GetOfflineMode&&SiebelApp.S_App.GetOfflineMode())s=i.GetProperty("Output"),o=utils.TokenizeString(s,",");else{var f=i.GetProperty("isBarcodeEnabled"),l="",c="",h=i.GetPropertyCount(),p=i.GetProperty("OPTIONS_LENGTH");for(k=0;k<p;k++)l="OPTION"+k,c="FIELD"+k,o.push(i.GetProperty(l)),u.push(i.GetProperty(c))}}}this.SetProperty("barcodeCategories",o)}function n(e,t){this.SetProperty("ToggleSearchOptions",!0)}return SiebelJS.Extend(e,SiebelAppFacade.WebpgPM),e.prototype.Init=function(){SiebelAppFacade.SearchModel.superclass.Init.apply(this,arguments),this.AddProperty("barcodeCategories",[]),this.AddProperty("ToggleSearchOptions",""),this.AddMethod("ToggleSearchOptions",n),this.AddMethod("GetBarcodeCategories",t),this.AttachEventHandler("BarcodeCategories",function(){this.ExecuteMethod("GetBarcodeCategories")}),this.AttachEventHandler("OnExecuteBarcodeSearch",function(){var e=CCFMiscUtil_CreatePropSet(),t=CCFMiscUtil_CreatePropSet(),n=this.Get("SearchType"),r=this.Get("BCType");e.SetProperty("BARCODE",this.Get("SearchText")),e.SetProperty("OPTION",this.Get("BCType"));var i=SiebelApp.S_App.GetService("Invoke Search");if(!i)return;t=i.InvokeMethod("BarcodeQuery",e)})},e}(),SiebelAppFacade.SearchModel}));
