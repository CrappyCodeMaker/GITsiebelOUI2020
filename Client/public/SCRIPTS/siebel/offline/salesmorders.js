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
typeof SiebelApp.salesmorders=="undefined"&&(SiebelJS.Namespace("SiebelApp.salesmorders"),define("siebel/offline/salesmorders",["siebel/offline/model","siebel/offline/servicemodel"],function(){var e={},t=SiebelApp.Offlineconstants;return e[t.get("DOUIREG_OBJ_NAME")]="Order Entry - Orders",e[t.get("DOUIREG_OBJ_TYPE")]=t.get("DOUIREG_OBJ_TYPEBUSCOMP"),e[t.get("DOUIREG_OBJ_MTHD")]="WriteRecord",e[t.get("DOUIREG_SRVC_NAME")]="salesmorders",e[t.get("DOUIREG_SRVC_MTDH")]="SalesOrderPredefault",e[t.get("DOUIREG_EXT_TYPE")]=t.get("DOUIREG_EXT_TYPEPRE"),SiebelApp.S_App.Model.ServiceRegistry(e),e={},e[t.get("DOUIREG_OBJ_NAME")]="Order Entry - Line Items",e[t.get("DOUIREG_OBJ_TYPE")]=t.get("DOUIREG_OBJ_TYPEBUSCOMP"),e[t.get("DOUIREG_OBJ_MTHD")]="WriteRecord",e[t.get("DOUIREG_SRVC_NAME")]="salesmorders",e[t.get("DOUIREG_SRVC_MTDH")]="WriteRecord",e[t.get("DOUIREG_EXT_TYPE")]=t.get("DOUIREG_EXT_TYPEPRE"),SiebelApp.S_App.Model.ServiceRegistry(e),SiebelApp.salesmorders=function(){function e(e){}return SiebelJS.Extend(e,SiebelApp.ServiceModel),e.prototype.SalesOrderPredefault=function(e){var t={err:!1},n;SiebelJS.Log("Invoked Service Method SalesOrderPredefault");var r,i,s=CCFMiscUtil_CreatePropSet();r=this.GetContext();if(r.IsNewRecordPending()){n=t,t=r.FieldValue("Order Type"),n=t,t={err:!1};if(!n.err){var o=n.retVal;if(utils.IsEmpty(o))if(!n.err){i=SiebelApp.S_App.Model.GetLovNameVal("Sales Order","FS_ORDER_TYPE");if(!utils.IsEmpty(i)){t=r.GetPickList("Order Type"),n=t,t={err:!1};if(!n.err){var u=n.retVal;t=u.SetFldSearchSpec("Order Type",i),n=t,t=u.Execute(),n=t,t={err:!1};if(!n.err){t=u.Home();var a=t;t={err:!1};if(u.CheckActiveRow()===!0){t=u.PickCurrentRow();var a=t;t={err:!1},n.err?(r!=null&&typeof r!="undefined"&&(r=null),u!=null&&typeof u!="undefined"&&(u=null),t={err:n.err,retVal:n.retVal}):(r!=null&&typeof r!="undefined"&&(r=null),u!=null&&typeof u!="undefined"&&(u=null),t={err:!1,retVal:s})}}else r!=null&&typeof r!="undefined"&&(r=null),u!=null&&typeof u!="undefined"&&(u=null),t={err:n.err,retVal:n.retVal}}else r!=null&&typeof r!="undefined"&&(r=null),t={err:n.err,retVal:n.retVal}}}else r!=null&&typeof r!="undefined"&&(r=null),t={err:n.err,retVal:n.retVal}}}else r!=null&&typeof r!="undefined"&&(r=null);return t},e.prototype.WriteRecord=function(e){var t={err:!1},n;SiebelJS.Log("Invoked Service Method WriteRecord");var r,i=0,s=0;r=this.GetContext();var o=CCFMiscUtil_CreatePropSet(),u,a=[];r.ActivateField("Product Id"),t=r.FieldValue("Product Id"),n=t,t={err:!1},u=n.retVal;if(utils.IsEmpty(u))return r!=null&&typeof r!="undefined"&&(r=null),a.push("Product"),SiebelApp.S_App.OfflineErrorObject.SetErrorMsg("SSAFReqFieldNotExist",a),t={err:"SSAFReqFieldNotExist",retVal:o},t;if(r.IsNewRecordPending()){var f=SiebelApp.S_App.Model.GetBusObj("Order Entry (Sales)"),l=f.GetBusComp("Order Entry - Line Items");t=r.FieldValue("Order Header Id");var c=t;t={err:!1};var h=c.retVal;if(!utils.IsEmpty(h)){l.SetSearchSpec("Order Header Id",h),t=l.Execute();var c=t;t=l.Home();var c=t;t={err:!1};var p=function(){t=l.FieldValue("Line Number");var e=t;t={err:!1};var r=e.retVal;r>s&&(s=r),n=t,t=l.NextRecord(),n=t,t={err:!1};var i=n.err;i||p.call(this)};l.CheckActiveRow()===!0&&p.call(this),i=++s;var c=t;t=r.SetFieldValue("Line Number",i,!0),n=t,t={err:!1},n.err?(r!=null&&typeof r!="undefined"&&(r=null),SiebelApp.S_App.Model.ReleaseBO(f),t={err:n.err,retVal:n.retVal}):(r!=null&&typeof r!="undefined"&&(r=null),SiebelApp.S_App.Model.ReleaseBO(f),t={err:!1,retVal:o})}else r!=null&&typeof r!="undefined"&&(r=null),SiebelApp.S_App.Model.ReleaseBO(f)}else r!=null&&typeof r!="undefined"&&(r=null);return t},e}(),"SiebelAppFacade.salesmorders"}));
