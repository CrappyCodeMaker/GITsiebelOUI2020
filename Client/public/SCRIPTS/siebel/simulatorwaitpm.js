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
typeof SiebelAppFacade.SimulatorWaitPM=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.SimulatorWaitPM"),define("siebel/simulatorwaitpm",["siebel/pmodel"],function(){return SiebelAppFacade.SimulatorWaitPM=function(){function e(e){SiebelAppFacade.SimulatorWaitPM.superclass.constructor.call(this,e)}function t(){var e,n,r,i,s,o=SiebelApp.S_App.GetService("Workflow Process Manager"),u=SiebelApp.S_App.NewPropertySet();if(this.Get("CallBackExecution")===!0)return;this.SetProperty("CallBackExecution",!0),i=o.InvokeMethod("_SimulatorLoopTop",u),n=i.GetChildCount(),s=!1;for(e=0;e<n;e++){r=i.GetChild(e);if(r.GetType()=="ResultSet"&&r.GetValue()=="SimulatorData"){s=!0;break}}if(s&&r.GetProperty("Action")=="Activate"){window.clearInterval(this.Get("IntervalId"));var a={};a.cb=function(){var e,e,n,r,i=this,s=Array.prototype.slice.call(arguments),o=s?s[s.length-1]:"";e=o.GetChildCount(),n=!1;for(bIdx=0;bIdx<e;bIdx++){r=o.GetChild(bIdx);if(r.GetType()=="ResultSet"&&r.GetValue()=="SimulatorData"){n=!0;break}}n&&(wfSimRecur=window.setInterval(function(){t.call(i)},1e3)),this.SetProperty("IntervalId",wfSimRecur)},a.timeOut=!1,a.mask=!0,a.scope=this,a.async=!0,o.InvokeMethod("_SimulatorLoopBottom",u,a)}else s&&r.GetProperty("Action")=="Terminate"&&(window.clearInterval(this.Get("IntervalId")),window.close());this.SetProperty("CallBackExecution",!1)}return SiebelJS.Extend(e,SiebelAppFacade.PresentationModel),e.prototype.Init=function(){SiebelAppFacade.SimulatorWaitPM.superclass.Init.apply(this,arguments),this.AddProperty("IntervalId",""),this.AddProperty("CallBackExecution",!1)},e.prototype.Setup=function(){SiebelAppFacade.SimulatorWaitPM.superclass.Setup.apply(this,arguments);var e=this,n=window.setInterval(function(){t.call(e)},1e3);this.SetProperty("IntervalId",n)},e}(),"SiebelAppFacade.SimulatorWaitPM"}));
