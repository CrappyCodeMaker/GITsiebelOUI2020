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
typeof SiebelAppFacade.CKEditorRenderer=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.CKEditorRenderer"),define("siebel/ckeditorrenderer",["siebel/phyrenderer","3rdParty/ckeditor/ckeditor.js"],function(){return SiebelAppFacade.CKEditorRenderer=function(){function t(e){SiebelAppFacade.CKEditorRenderer.superclass.constructor.call(this,e),e.AttachPMBinding("SetContentBinder",function(){var e=this.GetPM().Get("OfferType"),t=this.GetPM().Get("Content"),n=this.GetPM().Get("EditorElementId");if(e.indexOf("Email")!=-1)a(t,n);else if(t.split("*")!=null&&t.split("*").length>=2&&t.split("*")[1]!=null){var r=t.split("*")[1];a(r,n)}},{scope:this}),e.AttachPMBinding("prop",function(){var e=this.Get("ResetCount");e++,this.SetProperty("ResetCount",e);if(e==1)return;this.SetProperty("ResetCount",0);if(!this.Get("HandleReset")){this.SetProperty("HandleReset",!0);return}var t=this.Get("prop"),r=this.Get("prop").GetChild(2),i=this.Get("EditorElementId"),s=this.Get("ControlConfig");for(var o=0;o<s.GetChildCount();o++){var u,a=s.GetChild(o),f=a.GetType();if(f=="Person"){s.RemoveChild(o),s.AddChild(r);break}}s.SetProperty("Content",this.Get("Content")),this.SetProperty("ControlConfig",s),n.call(this,this)})}function n(t){var n,u,f,l,c,h,p=700,d=400,v=new Array,m=new Array,g=new Array,y=new Array,b=new Array,w=new Array,E=new Array,S=0,x="",T="",N=new Array,C="",k,L=t.Get("ControlConfig");C=L.GetProperty("Content"),x=L.GetProperty("OfferType"),T=L.GetProperty("Language"),N=L.GetProperty("Templates"),n=L.GetProperty("filebrowserBrowseUrl"),u=L.GetProperty("filebrowserImageBrowseUrl"),f=L.GetProperty("filebrowserFlashBrowseUrl"),l=L.GetProperty("filebrowserUploadUrl"),c=L.GetProperty("filebrowserImageUploadUrl"),h=L.GetProperty("filebrowserFlashUploadUrl"),p=L.GetProperty("filebrowserWindowWidth"),d=L.GetProperty("filebrowserWindowHeight");var A=L.GetChildCount();for(var O=0;O<A;O++){var M,_=L.GetChild(O),D=_.GetType();if(D=="Person"){var P=_.GetProperty("MergeFieldVal"),H=_.GetChildCount();for(var B=0;B<H;B++){var j=_.GetChild(B),F=j.GetType();v[B]=F,m[B]=new Array,o(j,m[B],!0),F==P&&(S=B)}}else if(D=="Rule"){var I=_.GetChildCount();for(var B=0;B<I;B++){var q=_.GetChild(B),D=q.GetType();D=="R"?(s(q,g,!0),s(q,y,!1)):D=="O"&&(s(q,b,!0),s(q,w,!1))}}else D=="Caption"&&o(_,E,!1)}var R,U;CKEDITOR.config.g_arrCategory=v,CKEDITOR.config.g_arrItem=m,CKEDITOR.config.g_arrRule=g,CKEDITOR.config.g_arrRuleMap=y,CKEDITOR.config.g_arrOperator=b,CKEDITOR.config.g_arrOperatorMap=w,CKEDITOR.config.g_arrStr=E,CKEDITOR.config.g_iMergeField=S,U=t,R=U.Get("EditorElementId"),CKEDITOR.instances[R]&&(CKEDITOR.instances[R].destroy(!0),delete CKEDITOR.instances[R]),e=CKEDITOR.replace(R,{customConfig:"../ckeditor-custom/custom-config.js",extraPlugins:"mergefieldsblock,contentruleblock",filebrowserBrowseUrl:n,filebrowserImageBrowseUrl:u,filebrowserFlashBrowseUrl:f,filebrowserWindowWidth:p,filebrowserWindowHeight:d,language:i(T),toolbar:r(x),template_files:N,on:{instanceReady:function(e){CKEDITOR.instances[R]&&(a(C,R),CKEDITOR.instances[R].on("blur",function(){}))}}})}function r(e){if(!e||0===e.length)e="Base";return e+"Block"}function i(e){var t={};return t.ENU="en",t.ARA="ar",t.PRC="zh",t.CNT="zh-cn",t.CSY="cs",t.DAN="da",t.DEU="de",t.ENG="en-gb",t.ESN="esn",t.ESP="es",t.FIN="fi",t.FRA="fr",t.HEB="he",t.ITA="it",t.JPN="ja",t.KOR="ko",t.NLD="nl",t.PL="pl",t.PTB="pt-br",t.PTG="pt",t.RUS="ru",t.SVE="sv",t.THA="th",t.TRK="tr",t[e]}function s(e,t,n){var r=0,i;for(var s=0;s<e.GetChildCount();s++){var o=e.GetChild(s);(i=o.EnumProperties(true))!=null&&i!=""&&(n?(t[r]=i,r++):t[i]=o.GetProperty(i))}}function o(e,t,n){for(var r in e.propArray)n?t[e.propArray[r]]=r:t[r]=e.propArray[r]}function u(e,t,n){var r;if((r=e.EnumProperties(true))!=null&&r!="")do n?t[e.GetProperty(r)]=r:t[r]=e.GetProperty(r);while((r=e.EnumProperties(false))!=null&&r!="")}function a(e,t){if(!CKEDITOR.instances[t]||CKEDITOR.instances[t]=="undefined")return;CKEDITOR.instances[t].setData(e)}var e;return SiebelJS.Extend(t,SiebelAppFacade.PhysicalRenderer),t.prototype.EndLife=function(){var e=this.GetPM().Get("EditorElementId");CKEDITOR.instances[e]&&(CKEDITOR.config.removePlugins="mergefieldsblock,contentruleblock",CKEDITOR.instances[e].destroy(!0),CKEDITOR.removeListener("instanceReady"),$("#"+e).remove())},t.prototype.ShowUI=function(){SiebelAppFacade.CKEditorRenderer.superclass.ShowUI.call(this),dir=CKEDITOR.basePath.replace("/ckeditor/",""),CKEDITOR.plugins.addExternal("mergefieldsblock",dir+"/ckeditor-custom/mergefieldsblock/plugin.js",""),CKEDITOR.plugins.addExternal("contentruleblock",dir+"/ckeditor-custom/contentruleblock/plugin.js",""),CKEDITOR.config.extraPlugins="mergefieldsblock,contentruleblock",CKEDITOR.config.removePlugins="";var e=$("table.GridBack tbody tr td:last-child","#s_"+this.GetPM().Get("GetFullId")+"_div"),t=$("div span",e),r=this.GetPM().Get("GetFullId")+"_editor1";this.GetPM().SetProperty("EditorElementId",r),$("<textarea id='"+r+"' name='"+r+"'></textarea>").appendTo(t),SiebelApp.S_App.GetDirection()&&($(t).addClass("cke_rtl"),CKEDITOR.config.contentsLangDirection="rtl"),n.call(this,this.GetPM())},t}(),"SiebelAppFacade.CKEditorRenderer"}));