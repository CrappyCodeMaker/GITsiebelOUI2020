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
typeof SiebelApp.salesmlead=="undefined"&&(SiebelJS.Namespace("SiebelApp.salesmlead"),define("siebel/offline/salesmlead",["siebel/offline/model","siebel/offline/servicemodel"],function(){var e={},t=SiebelApp.Offlineconstants,n=CCFMiscUtil_CreatePropSet();return e[t.get("DOUIREG_OBJ_NAME")]="SHCE Sales Lead Form Applet - Mobile",e[t.get("DOUIREG_OBJ_TYPE")]=t.get("DOUIREG_OBJ_TYPEAPPLET"),e[t.get("DOUIREG_OBJ_MTHD")]="DoInvokeMethod",e[t.get("DOUIREG_SRVC_NAME")]="salesmlead",e[t.get("DOUIREG_SRVC_MTDH")]="DoInvokeMethod",e[t.get("DOUIREG_EXT_TYPE")]=t.get("DOUIREG_EXT_TYPEPRE"),SiebelApp.S_App.Model.ServiceRegistry(e),e[t.get("DOUIREG_OBJ_NAME")]="SHCE Sales Lead Form Applet - Mobile",e[t.get("DOUIREG_OBJ_TYPE")]=t.get("DOUIREG_OBJ_TYPEAPPLET"),e[t.get("DOUIREG_OBJ_MTHD")]="DoCanInvokeMethod",e[t.get("DOUIREG_SRVC_NAME")]="salesmlead",e[t.get("DOUIREG_SRVC_MTDH")]="DoCanInvokeMethod",e[t.get("DOUIREG_EXT_TYPE")]=t.get("DOUIREG_EXT_TYPEPRE"),SiebelApp.S_App.Model.ServiceRegistry(e),e[t.get("DOUIREG_OBJ_NAME")]="Opportunity",e[t.get("DOUIREG_OBJ_TYPE")]=t.get("DOUIREG_OBJ_TYPEBUSCOMP"),e[t.get("DOUIREG_OBJ_MTHD")]="AddAssociation",e[t.get("DOUIREG_SRVC_NAME")]="salesmlead",e[t.get("DOUIREG_SRVC_MTDH")]="SetLeadPrimaryOpty",e[t.get("DOUIREG_EXT_TYPE")]=t.get("DOUIREG_EXT_TYPEPOST"),SiebelApp.S_App.Model.ServiceRegistry(e),e[t.get("DOUIREG_OBJ_NAME")]="Opportunity",e[t.get("DOUIREG_OBJ_TYPE")]=t.get("DOUIREG_OBJ_TYPEBUSCOMP"),e[t.get("DOUIREG_OBJ_MTHD")]="DeleteRecord",e[t.get("DOUIREG_SRVC_NAME")]="salesmlead",e[t.get("DOUIREG_SRVC_MTDH")]="EmptyLeadPrimaryOpty",e[t.get("DOUIREG_EXT_TYPE")]=t.get("DOUIREG_EXT_TYPEPRE"),SiebelApp.S_App.Model.ServiceRegistry(e),SiebelApp.salesmlead=function(){function t(e){}var e=SiebelJS.Dependency("SiebelApp.Utils");return SiebelJS.Extend(t,SiebelApp.ServiceModel),t.prototype.DoCanInvokeMethod=function(e){var t={err:!1},n,r=CCFMiscUtil_CreatePropSet(),i="",s,o,u;i=e.GetProperty("MethodName").toString();if(i==="OnCreateOpptyClicked"){var a=this.GetContext().GetBusComp();if(a.CheckActiveRow()===!0){s=SiebelApp.S_App.Model.GetLovNameVal("Retired","LEAD_STATUS"),t=a.FieldValue("Lead Status"),n=t,t={err:!1};var f=n.retVal;f===s?(r.SetProperty("Invoked",!0),r.SetProperty("RetVal",!1),a!=null&&typeof a!="undefined"&&(a=null),t={err:!1,retVal:r}):(r.SetProperty("Invoked",!0),r.SetProperty("RetVal",!0),a!=null&&typeof a!="undefined"&&(a=null),t={err:!1,retVal:r})}else a!=null&&typeof a!="undefined"&&(a=null)}return t},t.prototype.DoInvokeMethod=function(t){var r={err:!1},i,s="",o=CCFMiscUtil_CreatePropSet(),u;s=t.GetProperty("MethodName").toString();if(s==="OnCreateOpptyClicked"){r=this.CheckContactProspect(),i=r,r={err:!1};if(!i.err){r=this.CreateOptyFromLead(),i=r,r={err:!1};if(!i.err){var a=SiebelApp.S_App.GetActiveView().GetActiveApplet(),f=a.GetUserProperty("Convert Lead Mobile Navigate View");if(!e.IsEmpty(f)){var l=SiebelApp.S_App.Model.GetBusObj("Lead"),c=l.GetBusComp("Lead"),h=l.GetBusComp("Opportunity"),p=n.GetProperty("LeadId"),d=n.GetProperty("OpptyId");r=c.Execute(),i=r,r=c.Home(),i=r,r=c.PositionById(p),i=r,r=h.Execute(),i=r,r=h.Home(),i=r,r=h.PositionById(d),i=r,r={err:!1},SiebelApp.OfflineAppMgr.BuildViewAsync(f,"BS_NORMAL","",l),i=r,r={err:!1}}r={err:"",retVal:o}}else r={err:i.err,retVal:o}}else o.SetProperty("Invoked",!0),r={err:i.err,retVal:o}}else o.SetProperty("Invoked",!1),r={err:!1,retVal:o};return r},t.prototype.SetLeadPrimaryOpty=function(t){var r={err:!1},i;SiebelJS.Log("Invoked SetLeadPrimaryOpty Method");var s,o,u,a,f,l,c;s=this.GetContext();var h=n.GetProperty("isConvertOpty");return a=s.GetParentBusComp(),a&&a.GetName()==="Lead"&&h!="Y"?(r=a.FieldValue("Id"),i=r,f=i.retVal,r=a.FieldValue("Primary Opportunity Id"),i=r,r={err:!1},l=i.retVal,e.IsEmpty(l)&&(r=s.FieldValue("Id"),i=r,c=i.retVal,r=a.SetFieldValue("Primary Opportunity Id",c,!0),i=r,a.SetCommitPending(!0),r=a.WriteRecord(!1),i=r,r={err:!1},i.err?(s!=null&&typeof s!="undefined"&&(s=null),a!=null&&typeof a!="undefined"&&(a=null),r={err:i.err,retVal:""}):(s!=null&&typeof s!="undefined"&&(s=null),a!=null&&typeof a!="undefined"&&(a=null),r={err:"",retVal:""}))):(s!=null&&typeof s!="undefined"&&(s=null),a!=null&&typeof a!="undefined"&&(a=null)),r},t.prototype.EmptyLeadPrimaryOpty=function(e){var t={err:!1},n;SiebelJS.Log("Invoked EmptyLeadPrimaryOpty Method");var r,i,s,o,u,a,f;return r=this.GetContext(),o=r.GetParentBusComp(),o&&o.GetName()==="Lead"?(t=o.FieldValue("Id"),n=t,u=n.retVal,t=o.FieldValue("Primary Opportunity Id"),n=t,a=n.retVal,t=r.FieldValue("Id"),n=t,t={err:!1},f=n.retVal,a===f&&(t=o.SetFieldValue("Primary Opportunity Id","",!0),n=t,o.SetCommitPending(!0),t=o.WriteRecord(!1),n=t,t={err:!1},n.err?(r!=null&&typeof r!="undefined"&&(r=null),o!=null&&typeof o!="undefined"&&(o=null),t={err:n.err,retVal:""}):(r!=null&&typeof r!="undefined"&&(r=null),o!=null&&typeof o!="undefined"&&(o=null),t={err:"",retVal:""}))):(r!=null&&typeof r!="undefined"&&(r=null),o!=null&&typeof o!="undefined"&&(o=null)),t},t.prototype.CreateOptyFromLead=function(){var t={err:!1},r;SiebelJS.Log("Invoked CreateOptyFromLead Method");var i,s,o,u,a,f,l,c,h,p,d=0,v,m,g,y,b,w,E,S,x,T,N,C=new Date,k=C.getMonth()+1+"/"+C.getDate()+"/"+C.getFullYear()+" "+C.getHours()+":"+C.getMinutes()+":"+C.getSeconds();i=SiebelApp.S_App.GetActiveView().GetActiveApplet().GetBusComp();if(n.propArrayLen>0){f=n.GetProperty("ProspectId"),l=n.GetProperty("ContactId"),c=n.GetProperty("LeadId");if(e.IsEmpty(f)&&!e.IsEmpty(l)||!e.IsEmpty(f)&&e.IsEmpty(l))i.ActivateField("Id"),i.ActivateField("Description"),i.ActivateField("Account Id"),i.ActivateField("Contact Id"),i.ActivateField("Primary Position Id"),i.ActivateField("Primary organization Id"),i.ActivateField("Source Id"),i.ActivateField("Quality"),i.ActivateField("Outcome"),i.ActivateField("Primary Opportunity Id"),i.ActivateField("Date Converted"),t=i.SetFldSearchSpec("Id",c),t=i.Execute(),r=t,t=i.Home(),r=t,t={err:!1},i.CheckActiveRow()===!0&&(t=i.FieldValue("Description"),r=t,m=
r.retVal,t=i.FieldValue("Account Id"),r=t,g=r.retVal,t=i.FieldValue("Contact Id"),r=t,y=r.retVal,t=i.FieldValue("Primary Position Id"),r=t,b=r.retVal,t=i.FieldValue("Primary Organization Id"),r=t,w=r.retVal,t=i.FieldValue("Quality"),r=t,S=r.retVal,S=SiebelApp.S_App.Model.GetLovNameVal(S,"LEAD_QUALITY"),strOptyName=m+" ("+c+") "+k,s=SiebelApp.S_App.Model.GetBusObj("Lead").GetBusComp("Opportunity"),s.SetSearchSpec(""),t=s.Execute(),r=t,t=s.NewRecord(),r=t,t=s.SetFieldValue("Name",strOptyName,!0),r=t,t=s.SetFieldValue("Account Id",g,!0),r=t,t=s.SetFieldValue("Key Contact Id",y,!0),r=t,t=s.SetFieldValue("Primary Revenue Amount",d,!0),r=t,t=s.SetFieldValue("Primary Revenue Close Date",k,!0),r=t,t=s.SetFieldValue("Primary Position Id",b,!0),r=t,t=s.SetFieldValue("Primary Organization Id",w,!0),r=t,t=s.SetFieldValue("Quality",S,!0),r=t,x=SiebelApp.S_App.Model.GetLovNameVal("Pending","OPTY_STATUS"),t=s.SetFieldValue("Status",x,!0),r=t,T=SiebelApp.S_App.Model.GetLovNameVal("Local","SHM_BUSINESS_TYPE_CD"),t=s.SetFieldValue("Business Type",T,!0),r=t,s.SetCommitPending(!0),t=s.WriteRecord(),r=t,function(e){t={err:!1};if(!!e.err)return t={err:e.err,retVal:psOutArgs},t;t=s.FieldValue("Id"),e=t,t={err:!1};if(!e.err){h=e.retVal,n.SetProperty("OpptyId",h),n.SetProperty("isConvertOpty","Y"),t=this.AssocLeadOpty(c,h),e=t,t={err:!1};if(!e.err){t=this.AssocOptyContact(h,y),e=t,t={err:!1};if(!e.err){var r=SiebelApp.S_App.Model.GetLovNameVal("Opportunity created","LEAD_OUTCOME");t=i.SetFieldValue("Outcome",r,!0),e=t;var o=new Date,u=o.getMonth()+1+"/"+o.getDate()+"/"+o.getFullYear()+" "+o.getHours()+":"+o.getMinutes()+":"+o.getSeconds();t=i.SetFieldValue("Date Converted",u,!0),e=t,t=i.SetFieldValue("Primary Opportunity Id",h,!0),e=t;var a=SiebelApp.S_App.Model.GetLovNameVal("Converted","LEAD_STATUS");t=i.SetFieldValue("Lead Status",a,!0),e=t,i.SetCommitPending(!0),t=i.WriteRecord(),e=t,t={err:!1},e.err?t={err:e.err,retVal:""}:t={err:"",retVal:""},t={err:"",retVal:""}}else t={err:e.err,retVal:psOutArgs}}else t={err:e.err,retVal:psOutArgs}}else t={err:e.err,retVal:psOutArgs}}.call(this,r))}return t},t.prototype.AssocOptyContact=function(e,t){var n={err:!1},r,i,s,o,u;return i=SiebelApp.S_App.Model.GetBusObj("Opportunity"),s=i.GetBusComp("Contact"),o=i.GetBusComp("Opportunity"),o.ActivateField("Id"),o.SetSearchSpec("Id",e),n=o.Execute(),r=n,n=o.Home(),r=n,n=o.PositionById(e),r=n,n={err:!1},o.FindWorkSet(o.GetActiveRow())?(s.ActivateField("Id"),n=s.Execute(),r=n,n={err:!1},u=s.GetAssocList(),r=n,u.ActivateField("Id"),n=u.SetFldSearchSpec("Id",t),n=u.Execute(),r=n,n=u.Home(),r=n,n=u.PositionById(t),r=n,n={err:!1},u.FindWorkSet(u.GetActiveRow())?(n=s.AddAssociation(),r=n,n={err:!1},SiebelApp.S_App.Model.ReleaseBO(i)):SiebelApp.S_App.Model.ReleaseBO(i)):SiebelApp.S_App.Model.ReleaseBO(i),n},t.prototype.AssocLeadOpty=function(e,t){var n={err:!1},r,i,s,o,u,a;return i=SiebelApp.S_App.Model.GetBusObj("Lead"),u=i.GetBusComp("Lead"),o=i.GetBusComp("Opportunity"),u.ActivateField("Id"),u.SetSearchSpec("Id",e),n=u.Execute(),r=n,n=u.Home(),r=n,n=u.PositionById(e),r=n,n={err:!1},u.FindWorkSet(u.GetActiveRow())?(o.ActivateField("Id"),n=o.Execute(),r=n,n={err:!1},a=o.GetAssocList(),r=n,a.ActivateField("Id"),n=a.SetFldSearchSpec("Id",t),n=a.Execute(),r=n,n=a.Home(),r=n,n=a.PositionById(t),r=n,n={err:!1},a.FindWorkSet(a.GetActiveRow())?(n=o.AddAssociation(),r=n,n={err:!1},SiebelApp.S_App.Model.ReleaseBO(i),SiebelApp.OfflineAppMgr.PostActions("ActionRPCCompleted")):(SiebelApp.S_App.Model.ReleaseBO(i),SiebelApp.OfflineAppMgr.PostActions("ActionRPCCompleted"))):(SiebelApp.S_App.Model.ReleaseBO(i),SiebelApp.OfflineAppMgr.PostActions("ActionRPCCompleted")),n},t.prototype.CheckContactProspect=function(){var t={err:!1},r;SiebelJS.Log("Invoked CheckContactProspect Method");var i,s,o,u=CCFMiscUtil_CreatePropSet(),a=[],f=CCFMiscUtil_CreatePropSet();s=this.GetContext().GetBusComp(),t=s.FieldValue("Id"),r=t;var l=r.retVal;t=s.FieldValue("Contact Id"),r=t;var c=r.retVal;return t=s.FieldValue("Prospect Id"),r=t,function(r){t={err:!1};var i=r.retVal;if(e.IsEmpty(c)&&e.IsEmpty(i)||!e.IsEmpty(c)&&!e.IsEmpty(i))return s!=null&&typeof s!="undefined"&&(s=null),SiebelApp.S_App.OfflineErrorObject.SetErrorMsg("IDS_SALES_CONTACT_PROSPECT_REQD",a),t={err:"IDS_SALES_CONTACT_PROSPECT_REQD",retVal:""},t;n.Reset(),n.SetProperty("LeadId",l),n.SetProperty("ContactId",c),n.SetProperty("ProspectId",i),s!=null&&typeof s!="undefined"&&(s=null),t={err:!1,retVal:""},!e.IsEmpty(i)&&e.IsEmpty(c)&&(t=this.ProspectToContact(),r=t,t={err:!1},r.err?(s!=null&&typeof s!="undefined"&&(s=null),t={err:r.err,retVal:f}):(s!=null&&typeof s!="undefined"&&(s=null),t={err:!1,retVal:""}))}.call(this,r),t},t.prototype.ProspectToContact=function(){var e={err:!1},t;SiebelJS.Log("Invoked ProspectToContact Method");var r=SiebelApp.S_App.GetModel(),i=SiebelApp.S_App.Model.GetBusObj("Lead"),s=i.GetBusComp("List Mgmt Prospective Contact"),o,u,a,f,l,c,h,p,d,v,m;s.ActivateField("Last Name"),s.ActivateField("First Name"),s.ActivateField("Home Phone #"),s.ActivateField("Work Phone #"),s.ActivateField("Cellular Phone #"),s.ActivateField("Fax Phone #"),s.ActivateField("Email Address"),s.ActivateField("Promoted By"),s.ActivateField("Promoted Date"),s.ActivateField("Associated Contact Id"),e=s.SetFldSearchSpec("Id",n.GetProperty("ProspectId")),e=s.Execute(),t=e,e=s.Home(),t=e,e={err:!1};if(s.CheckActiveRow()===!0){e=s.FieldValue("Last Name"),t=e,o=t.retVal,e=s.FieldValue("First Name"),t=e,u=t.retVal,e=s.FieldValue("Home Phone #"),t=e,strHomePhone=t.retVal,e=s.FieldValue("Work Phone #"),t=e,f=t.retVal,e=s.FieldValue("Cellular Phone #"),t=e,l=t.retVal,e=s.FieldValue("Fax Phone #"),t=e,c=t.retVal,e=s.FieldValue("Email Address"),t=e,h=t.retVal,d=r.GetBusObj("Contact"),v=d.GetBusComp("Contact"),v.ActivateField("Last Name"),v.ActivateField("First Name"),v.ActivateField("Home Phone #"),v.ActivateField("Work Phone #"),v.ActivateField("Cellular Phone #"),v.ActivateField("Fax Phone #"),v.ActivateField("Email Address"
),v.ActivateField("Last Name"),v.ActivateField("Prospect Flag"),e=v.Execute(),t=e,e=v.NewRecord(),t=e,e=v.SetFieldValue("Last Name",o,!0),t=e,e=v.SetFieldValue("First Name",u,!0),t=e,e=v.SetFieldValue("Home Phone #",strHomePhone,!0),t=e,e=v.SetFieldValue("Work Phone #",f,!0),t=e,e=v.SetFieldValue("Cellular Phone #",l,!0),t=e,e=v.SetFieldValue("Fax Phone #",c,!0),t=e,e=v.SetFieldValue("Email Address",h,!0),t=e,e=v.SetFieldValue("Person UId",n.GetProperty("ProspectId"),!0),t=e,e=v.SetFieldValue("Prospect Flag","Y",!0),t=e,v.SetCommitPending(!0),e=v.WriteRecord(),t=e,e={err:!1};if(!t.err){e=v.FieldValue("Id"),t=e,p=t.retVal,m=this.GetContext().GetBusComp(),e=m.GetPickList("Contact Last Name"),t=e;var g=t.retVal;e=g.SetFldSearchSpec("Id",p),t=e,e=g.Execute(),t=e,e=g.Home(),t=e,e={err:!1};if(g.CheckActiveRow()===!0){e=g.PickCurrentRow();var y=e;e={err:!1};if(!y.err){e=m.SetFieldValue("Prospect Last Name","",!0);var y=e;e=m.SetFieldValue("Prospect First Name","",!0);var y=e;e=m.SetFieldValue("Prospect Id","",!0);var y=e;m.SetCommitPending(!0),e=m.WriteRecord();var y=e;e={err:!1};if(!y.err){e=s.SetFieldValue("Promoted By",SiebelApp.S_App.Model.GetLoginId(),!0),t=e,e=s.SetFieldValue("Associated Contact Id",p,!0),t=e;var b=new Date,w=b.getMonth()+1+"/"+b.getDate()+"/"+b.getFullYear()+" "+b.getHours()+":"+b.getMinutes()+":"+b.getSeconds();e=s.SetFieldValue("Promoted Date",w,!0),t=e,s.SetCommitPending(!0),e=s.WriteRecord();var y=e;e={err:!1},y.err||(e={err:"",retVal:""},SiebelApp.S_App.Model.ReleaseBO(d),SiebelApp.S_App.Model.ReleaseBO(i))}else e={err:t.err,retVal:t.retVal}}}}}return e},t}(),"SiebelAppFacade.salesmlead"}));
