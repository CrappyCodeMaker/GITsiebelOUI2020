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
typeof SiebelAppFacade.barcdviewpr=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.barcdviewpr"),define("siebel/barcdviewpr",["siebel/viewpr"],function(){return SiebelAppFacade.barcdviewpr=function(){function r(e){SiebelAppFacade.barcdviewpr.superclass.constructor.call(this,e)}function i(){var t=this.GetPM(),n=t.Get(e.get("SWE_BARCODE_STYLE")),r=t.Get(e.get("SWE_BARCODE_DRIVER")),i=SiebelApp.S_App.GetActiveView().GetApplet(r).GetControls(),s=i.BarcodeNew.GetInputName(),o=i.BarcodeUpdate.GetInputName();SiebelApp.S_App.uiStatus.IsBusy()&&SiebelApp.S_App.uiStatus.Free()}var e=SiebelJS.Dependency("SiebelApp.Constants"),t=SiebelApp.S_App.LocaleObject,n=!1;return SiebelJS.Extend(r,SiebelAppFacade.ViewPR),r.prototype.EndLife=function(){var e=this.GetPM();$("div[id ='BarcodeButtons']").remove()},r.prototype.ShowUI=function(){SiebelApp.S_App.GetOfflineMode&&SiebelApp.S_App.GetOfflineMode()&&$("#_sweview > div[id ='BarcodeButtons']").length>0&&$("#_sweview > div[id ='BarcodeButtons']").each(function(){$(this).remove()});var r=this.GetPM(),i=r.Get(e.get("SWE_BARCODE_DRIVER")),s=r.Get(e.get("SWE_BARCODE_OP")),o=SiebelApp.S_App.GetActiveView().GetApplet(i).GetControls(),u=o.BarcodeNew.GetInputName(),a=o.BarcodeUpdate.GetInputName(),f=o.BarcodeCombo.GetInputName();SiebelAppFacade.barcdviewpr.superclass.ShowUI.call(this),$("[name="+f+"]").addClass("siebui-barcode-field"),$("[name="+f+"]").attr("id",$("[name="+f+"]").attr("name")),$("[name="+f+"]").attr("title",t.GetLocalString("IDS_BARCODE_TEXT")+" "+t.GetLocalString("IDS_SWE_COMBO_FIELD")),n||$("[name="+f+"]").addClass("siebui-no-display"),SiebelApp.S_App.IsAutoOn()&&($("[id="+u+"_Ctrl]").attr("ot","BarcodeNewBtn"),$("[id="+u+"_Ctrl]").attr("rn","BarcodeNewBtn"),$("[id="+u+"_Ctrl]").attr("un","BarcodeNewBtn"),$("[id="+a+"_Ctrl]").attr("ot","BarcodeUpdateBtn"),$("[id="+a+"_Ctrl]").attr("rn","BarcodeUpdateBtn"),$("[id="+a+"_Ctrl]").attr("un","BarcodeUpdateBtn"),$("[name="+f+"]").attr("ot","BarcodeComboBox"),$("[name="+f+"]").attr("rn","BarcodeComboBox"),$("[name="+f+"]").attr("un","BarcodeComboBox")),f=SiebelApp.S_App.GetActiveView().GetApplet(i).GetControls().BarcodeScanText.GetInputName(),$("[name="+f+"]").addClass("siebui-barcode-text"),$("[name="+f+"]").attr("id",$("[name="+f+"]").attr("name")),$("[name="+f+"]").attr("title",t.GetLocalString("IDS_BARCODE_TEXT")+" "+t.GetLocalString("IDS_SEARCH_OUI_SRCH_TEXTBOX")),n||$("[name="+f+"]").addClass("siebui-no-display"),SiebelApp.S_App.IsAutoOn()&&($("[name="+f+"]").attr("ot","BarcodeTextBox"),$("[name="+f+"]").attr("rn","BarcodeTextBox"),$("[name="+f+"]").attr("un","BarcodeTextBox")),$("[id="+u+"_Ctrl]").addClass("siebui-icon-barcode-add"),$("[id="+a+"_Ctrl]").addClass("siebui-icon-barcode-edit"),$("[id="+u+"_Ctrl]").attr("title",t.GetLocalString("IDS_BARCODE_TEXT")+" "+t.GetLocalString("IDS_NEW_STRING")),$("[id="+a+"_Ctrl]").attr("title",t.GetLocalString("IDS_BARCODE_TEXT")+" "+t.GetLocalString("IDS_BARCODE_TOOLTIP_UPDATE"));var l=$("div[id ='BarcodeButtons']").detach();l.addClass("siebui-barcode"),$("#_sweview").prepend(l),n=!1,r.SetProperty(e.get("SWE_BARCODE_HIGHLIGHT"),!0),r.AddProperty(e.get("SWE_BARCODE_STYLE"),"New"),r.AttachPMBinding(e.get("SWE_BARCODE_STYLE"),this.BarcodeStyler)},r.prototype.BindEvents=function(){var t=this.GetPM(),r=t.Get(e.get("SWE_BARCODE_DRIVER")),s=SiebelApp.S_App.GetActiveView().GetApplet(r).GetControls().BarcodeCombo.GetInputName(),o=SiebelApp.S_App.GetActiveView().GetApplet(r).GetControls().BarcodeScanText.GetInputName();SiebelApp.S_App.GetOfflineMode&&SiebelApp.S_App.GetOfflineMode()&&($(".siebui-icon-barcodenew").bind("click",{ctx:this},function(t){t.data.ctx.GetPM().SetProperty(e.get("SWE_BARCODE_STYLE"),"New"),i.call(t.data.ctx)}),$(".siebui-icon-barcodeupdate").bind("click",{ctx:this},function(t){t.data.ctx.GetPM().SetProperty(e.get("SWE_BARCODE_STYLE"),"Update"),i.call(t.data.ctx)})),$(".siebui-icon-barcodenew").bind("click",{ctx:this},function(e){n=!0,$("[name="+s+"]").removeClass("siebui-no-display"),$("[name="+o+"]").removeClass("siebui-no-display")}),$(".siebui-icon-barcodeupdate").bind("click",{ctx:this},function(e){n=!0,$("[name="+s+"]").removeClass("siebui-no-display"),$("[name="+o+"]").removeClass("siebui-no-display")}),$("[name="+o+"]").bind("keypress",{ctx:this},function(t){var n=t.data.ctx.GetPM();if((t.which===28||t.which===92)&&t.ctrlKey===!0||t.which===$.ui.keyCode.ENTER){n.SetProperty(e.get("SWE_BARCODE_METHOD_NAME"),"BarcodeEntry");var r=$("[name="+o+"]").val();n.SetProperty(e.get("SWE_BARCODE_SCAN_TEXT"),r),n.OnControlEvent(e.get("SWE_BARCODE_ON_SCAN")),$("[name="+o+"]").val("")}}),SiebelApp.S_App.GetTargetViewContainer().bind("keypress",{ctx:this},function(e){var t=e.data.ctx,n=t.GetPM();((e.which===28||e.which===92)&&e.ctrlKey===!0||e.which===$.ui.keyCode.ENTER)&&$("[name="+o+"]").focus()})},r}(),"SiebelAppFacade.barcdviewpr"}()));
