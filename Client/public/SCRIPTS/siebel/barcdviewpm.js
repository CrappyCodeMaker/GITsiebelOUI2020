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
typeof SiebelAppFacade.barcdviewpm=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.barcdviewpm"),define("siebel/barcdviewpm",["siebel/viewpm"],function(){return SiebelAppFacade.barcdviewpm=function(){function t(e){SiebelAppFacade.barcdviewpm.superclass.constructor.call(this,e)}function n(){var t=SiebelApp.S_App.GetActiveView().GetApplet(this.Get(e.get("SWE_BARCODE_DRIVER"))).GetPModel();t.AddMethod(e.get("SWE_BARCODE_NEW_OP"),r),t.AddMethod("BarcodeUpdateOp",i)}function r(){var t="",n;this.ExecuteMethod(e.get("SWE_CMD_INVOKE_METHOD_STR"),e.get("SWE_BARCODE_METHOD_NEW")),n=CCFMiscUtil_CreatePropSet(),n.SetType("GetProfileAttr"),n.SetProperty("attrName",e.get("SWE_BARCODE_OP")),t=SiebelApp.S_App.CallServerApp("GetProfileAttr",n),t=="New"&&barcodepm.SetProperty(e.get("SWE_BARCODE_STYLE"),e.get("SWE_BARCODE_METHOD_NEW"))}function i(){var t="",n;this.ExecuteMethod(e.get("SWE_CMD_INVOKE_METHOD_STR"),e.get("SWE_BARCODE_METHOD_UPDATE")),n=CCFMiscUtil_CreatePropSet(),n.SetType("GetProfileAttr"),n.SetProperty("attrName",e.get("SWE_BARCODE_OP")),t=SiebelApp.S_App.CallServerApp("GetProfileAttr",n),t=="Update"&&barcodepm.SetProperty(e.get("SWE_BARCODE_STYLE"),"Update")}var e=SiebelJS.Dependency("SiebelApp.Constants");return SiebelJS.Extend(t,SiebelAppFacade.ViewPM),t.prototype.Init=function(){SiebelAppFacade.barcdviewpm.superclass.Init.apply(this,arguments),this.AttachEventHandler(e.get("SWE_BARCODE_ON_SCAN"),function(){var t=SiebelApp.S_App.GetActiveView().GetApplet(this.Get(e.get("SWE_BARCODE_DRIVER"))).GetPModel(),n=CCFMiscUtil_CreatePropSet();this.Get(e.get("SWE_BARCODE_SCAN_TEXT"))==e.get("SWE_BARCODE_NEW")?t.ExecuteMethod(e.get("SWE_BARCODE_NEW_OP")):this.Get(e.get("SWE_BARCODE_SCAN_TEXT"))==e.get("SWE_BARCODE_UPDATE")?t.ExecuteMethod(e.get("SWE_BARCODE_UPDATE_OP")):t.ExecuteMethod(e.get("SWE_CMD_INVOKE_METHOD_STR"),this.Get("MethodName"),n)}),this.AddProperty(e.get("SWE_BARCODE_HIGHLIGHT"),!1),this.AttachPMBinding(e.get("SWE_BARCODE_HIGHLIGHT"),this.BarcodeHighlighter)},t.prototype.Setup=function(t){SiebelAppFacade.barcdviewpm.superclass.Setup.call(this,t);var n=t.GetChildByType("vpm");this.AddProperty(e.get("SWE_BARCODE_DRIVER"),n.GetProperty(e.get("SWE_BARCODE_DRIVER"))),this.AddProperty(e.get("SWE_BARCODE_OP"),n.GetProperty(e.get("SWE_BARCODE_OP"))),barcodepm=this},t.prototype.EndLife=function(){barcodepm=""},t}(),"SiebelAppFacade.barcdviewpm"}));
