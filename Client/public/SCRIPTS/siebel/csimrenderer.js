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
typeof SiebelAppFacade.CSimRenderer=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.CSimRenderer"),define("siebel/csimrenderer",["siebel/jqgridrenderer"],function(){return SiebelAppFacade.CSimRenderer=function(){function e(e){SiebelAppFacade.CSimRenderer.superclass.constructor.call(this,e)}return SiebelJS.Extend(e,SiebelAppFacade.JQGridRenderer),e.prototype.ShowUI=function(){SiebelAppFacade.CSimRenderer.superclass.ShowUI.call(this),$("#s_"+this.GetPM().Get("GetFullId")+"_div").addClass("siebui-telco-no-title")},e.prototype.BindEvents=function(){SiebelAppFacade.CSimRenderer.superclass.BindEvents.call(this);var e=this.GetPM(),t=e.Get("GetControls")["Change SIM"].GetInputName()+"_Ctrl";e.AddProperty("launchpad_is","collapsed"),$("#"+t).bind("mouseover",function(){$(".siebui-custdash-toggle-applet").attr("id","qcsapplet"),$("#qcsapplet").addClass("siebui-show-quick-applet")}),$(".siebui-applet-container").bind("click",{ctx:this,PM:e},function(e){var t=e.data.PM;$(".siebui-quick-applet-combobox input").val(""),$(".siebui-quick-applet-input input").val(""),t.Get("launchpad_is")==="expanded"?(t.SetProperty("launchpad_is","collapsed"),$("#qcsapplet").hasClass("siebui-show-quick-applet")&&$("#qcsapplet").removeClass("siebui-show-quick-applet")):t.SetProperty("launchpad_is","expanded")})},e}(),"SiebelAppFacade.CSimRenderer"}));
