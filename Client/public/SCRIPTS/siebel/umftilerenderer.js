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
typeof SiebelAppFacade.UMFTileRenderer=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.UMFTileRenderer"),define("siebel/umftilerenderer",["siebel/TileLayoutPR"],function(){return SiebelAppFacade.UMFTileRenderer=function(){function i(e){SiebelAppFacade.UMFTileRenderer.superclass.constructor.call(this,e)}var e=SiebelJS.Dependency("SiebelAppFacade.FacadeConstants"),t=SiebelJS.Dependency("SiebelApp.Utils"),n=SiebelJS.Dependency("SiebelApp.Constants"),r=n.get("SWE_PST_COL");return SiebelJS.Extend(i,SiebelAppFacade.TileLayoutPR),i.prototype.Init=function(){SiebelAppFacade.UMFTileRenderer.superclass.Init.call(this),this.AttachPMBinding("InvokeStateChange",this.UpdateControlCaption),this.AttachPMBinding("UpdateConditionals",this.UpdateControlCaption)},i.prototype.UpdateControlCaption=function(){var e=this.GetPM(),i=e.Get("GetSelection");if(typeof i=="undefined"||i<0)i=0;var s=e.Get("GetControls");for(var o in s)if(s.hasOwnProperty(o)&&s[o].GetControlType()!==r&&e.ExecuteMethod("IsRowLevelControl",o)){var u=s[o].GetInputName();if(e.ExecuteMethod("CanShowRowLevelControl",o,i)){var a=e.ExecuteMethod("GetControlCaption",o,i);t.IsEmpty(a)&&(a=s[o].GetDisplayName());var f=this.GetUIWrapper(s[o]).GetEl();f&&$(f).attr("data-display",a).text(a),this.GetUIWrapper(s[o]).SetState(n.get("SHOW"),!0)}else this.GetUIWrapper(s[o]).SetState(n.get("SHOW"),!1)}},i}(),"SiebelAppFacade.UMFTileRenderer"}));