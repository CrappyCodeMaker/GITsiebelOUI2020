// SWE Interface Calls

// Bug# 14805762, fix for CSRF
// Get the value of SRN in SI+ mode
// by YUTILIU
function SIGetSRN()
{
   // NOTE that we'd better call URLEncode because the SRN may contain '/' character, 
   // and we're not sure the browser would always encode the special characters.
   var srn_iHelp = document.getElementById("SRN_iHelp");
   return srn_iHelp ? URLEncode(srn_iHelp.value) : "";
}

function SIInvokeMethod (methodName)
{
   if (!SWEIsHighInteract)
   {
      // use location.replace to avoid adding to browser history

      var url = window.location.protocol + "//" + window.location.host + window.location.pathname;
      url += "?SWEVI=TaskAssistant&SWEView=Task+Assistant+Player+View&SWEApplet=Task+Assistant+Player+Applet&SWECmd=InvokeMethod&SWEMethod=" + methodName;
      url += "&SWEC=1";
      url += "&SRN=" + SIGetSRN(); // CSRF

      this.document.location.replace (url);
      return;
   }

   alert ("SIInvokeMethod: should never get here in HI mode!");

   g_csObj.SWEMethod = methodName;
   SWESubmitForm (g_formObj, g_csObj);
}

function SIInvokeMethod__sweview (methodName, swecount)
{
   if (!SWEIsHighInteract)
   {
      var url = window.location.protocol + "//" + window.location.host + window.location.pathname;
      url += "?SWEVI=TaskAssistant&SWEView=Task+Assistant+Player+View&SWEApplet=Task+Assistant+Player+Applet&SWECmd=InvokeMethod&SWEMethod=" + methodName;
      url += "&SWEC=" + swecount;
      url += "&SRN=" + SIGetSRN(); // CSRF

      SWETargetGotoURL (url, "_sweview");
   }
   else
   {
      var inPropSet = new JSSPropertySet ();
      var outPropSet = null;

      var service  = App().GetService ("Task Assistant UI Service");

      outPropSet = service.InvokeMethod (methodName, inPropSet);
   }
}

function SWEPersGotoview (viewName, extraParams, count)
{        
   var url = window.location.protocol + "//" + window.location.host + window.location.pathname;
   url += "?SWEVI=&SWECmd=GotoView&SWEView=" + viewName;
   url += "&SWEC=" + count;
   
   if (extraParams != null && 
       (typeof (extraParams) == "string") && 
        extraParams.length > 1)
   {
      if (extraParams.charAt(0) != "&")
         extraParams = "&" + extraParams;
      url += extraParams;
   }
   
   var frameObj = SWEFindFrame (top, "_sweview");
   if (frameObj == null) 
      frameObj = this;
       
   if (!SWEIsHighInteract)
   {
      url += "&SRN=" + SIGetSRN(); // CSRF
      frameObj.location = url;   
   }
   else
   {
      viewName = viewName.replace(/\+/g, " ");
      App().GotoView(viewName, "", url, frameObj);
   }
}

function TaskInvokeMethod_OpenPlayer (launchMethodName, taskId, swecount)
{
   if (!SWEIsHighInteract)
   {
      var url = window.location.protocol + "//" + window.location.host + window.location.pathname;
      url += "?SWEVI=TaskAssistant&SWEView=Task+Assistant+Player+View&SWEApplet=Task+Assistant+Player+Applet&SWECmd=InvokeMethod&SWEMethod=" + launchMethodName + taskId;
      url += "&SWEC=" + swecount;
      url += "&SRN=" + SIGetSRN(); // CSRF

      SWETargetGotoURL (url, "_swecontent");
   }
   else
   {
      var inPropSet = App().NewPropertySet ();
      var outPropSet = null;
      inPropSet.SetProperty("Task Id", taskId);

      var service  = App().GetService ("Task Assistant UI Service");

      outPropSet = service.InvokeMethod (launchMethodName, inPropSet);

      if (outPropSet != null)
      {
         childPropSet = TaskGetChildByType (outPropSet, "ResultSet");

         if (childPropSet != null)
         {
            errPropSet = TaskGetChildByType (childPropSet, "Error");
            if (errPropSet != null)
            {
               if (ProcessError (errPropSet))
                  return;
            }
         }
      }
   }
}

// call service directly using fast technique.
function TaskFastServiceInvokeMethod (methodName, inPropSet)
{
   var outPropSet = null;

   if (false)
   {
      // this is the usual way and it is more generic, but no performance gain.
      // (server-side generates extra notify info for view with viewId='' or main view.)
      // (this can be expensive if applets in main view need many CanInvokeMethods.)

      var service  = App().GetService ("Task Assistant UI Service");

      outPropSet = service.InvokeMethod (methodName, inPropSet);
   }
   else
   {
      // for performance.
      // (avoid expensive extra notify info for main view, by setting SWEViewId to 'TaskAssistant'.)
      // (Since it is an SI view, server-side doesn't generate any extra notify info for it.)

      if (TaskObj () != null)
      {
         Top ().SetBusy (true);

         // similar to CSSAxService::CallServerService
         var argsPropSet = App().NewPropertySet ();

         // set request args
         argsPropSet.SetProperty ("SWECmd", "InvokeMethod");
         argsPropSet.SetProperty ("SWEService", "Task Assistant UI Service");
         argsPropSet.SetProperty ("SWEMethod", methodName);

         var inPropSetStr = inPropSet.EncodeAsString ();
         argsPropSet.SetProperty ("SWEIPS", inPropSetStr);

         argsPropSet.SetProperty ("SWEVI", "TaskAssistant");  // this is the trick

         // call SWE As String
         var argsPropSetStr = argsPropSet.EncodeAsString ();
         var outPropSetStr = TaskObj ().CallSWEAsString (argsPropSetStr, false /* bQueryStr */);

         // process outPropSet
         outPropSet = App().NewPropertySet ();
         outPropSet.DecodeFromString (outPropSetStr);

         Top ().SetBusy (false);
      }
      else
         alert ("No TaskObj() found!");
   }

   return (outPropSet);
}

// SWE Utility Calls

function TaskGetChildByType (propSet, type)
{
   var childPropSet;

   for (i=0 ; i<propSet.GetChildCount () ; i++)
   {
      childPropSet = propSet.GetChild (i);
      if (childPropSet.GetType () == type)
         return (childPropSet);
   }

   return (null);
}


// Service Calls

function TaskDoPostedBuildView ()
{
   if (SWEIsHighInteract)
   {
      var js;
      var doPostedBuildView;

      var childPropSet = null;
      var inPropSet = new JSSPropertySet ();
      var outPropSet = null;

      var service  = App().GetService ("Task Assistant UI Service");

      outPropSet = service.InvokeMethod ("DoPostedBuildView", inPropSet);
   }
   else
   {
      SIInvokeMethod ("DoPostedBuildView");
   }
}

function TaskGetNextSet (stepNum)
{
   if (SWEIsHighInteract)
   {
      var js;

      var childPropSet = null;
      var errPropSet   = null;
      var inPropSet    = App().NewPropertySet ();
      var outPropSet   = null;

      inPropSet.SetProperty ("Step Num", stepNum);

      outPropSet = TaskFastServiceInvokeMethod ("DoNext", inPropSet);

      if (outPropSet != null)
      {
         childPropSet = TaskGetChildByType (outPropSet, "ResultSet");

         if (childPropSet != null)
         {
            errPropSet = TaskGetChildByType (childPropSet, "Error");
            if (errPropSet != null)
            {
               if (ProcessError (errPropSet))
                  return;
            }

            js = childPropSet.GetProperty ("JS");
            if (js.length > 0)
            {
               eval (js);
            }
         }
      }
   }
   else
   {
      SIInvokeMethod ("DoNext" + stepNum + "," + GenerateOpenStepList (false));
   }
}

function TaskGotoView (viewName, stepNum)
{
   if (SWEIsHighInteract)
   {
      var js;

      var childPropSet = null;
      var errPropSet   = null;
      var inPropSet    = App().NewPropertySet ();
      var outPropSet   = null;

      var service = App().GetService ("Task Assistant UI Service");

      inPropSet.SetProperty ("Step Num", stepNum);

      outPropSet = service.InvokeMethod ("DoStep", inPropSet);

      if (outPropSet != null)
      {
         childPropSet = TaskGetChildByType (outPropSet, "ResultSet");

         if (childPropSet != null)
         {
            errPropSet = TaskGetChildByType (childPropSet, "Error");
            if (errPropSet != null)
            {
               if (ProcessError (errPropSet))
                  return;
            }

            js = childPropSet.GetProperty ("JS");
            if (js.length > 0)
            {
               eval (js);
            }
         }
      }
   }
   else
   {
      SIInvokeMethod ("DoStep" + stepNum + "," + GenerateOpenStepList (false));
   }
}

function TaskLaunchTaskFromList (taskId)
{
   if (SWEIsHighInteract)
   {
      var js;

      var childPropSet = null;
      var errPropSet   = null;
      var inPropSet    = App().NewPropertySet ();
      var outPropSet   = null;

      inPropSet.SetProperty ("Task Id", taskId);

      outPropSet = TaskFastServiceInvokeMethod ("LaunchTaskFromList", inPropSet);

      if (outPropSet != null)
      {
         childPropSet = TaskGetChildByType (outPropSet, "ResultSet");

         if (childPropSet != null)
         {
            errPropSet = TaskGetChildByType (childPropSet, "Error");
            if (errPropSet != null)
            {
               if (ProcessError (errPropSet))
                  return;
            }

            js = childPropSet.GetProperty ("JS");
            if (js.length > 0)
            {
               eval (js);
            }
         }
      }
   }
   else
   {
      SIInvokeMethod ("LaunchTaskFromList" + taskId);
   }
}

//The following function added by SNAYAK for the iHelp-Development :iHelp Task UI Bridge 
//Feature#12-QP5WH8 to invoke related task UI mapped to iHelp item from iHelp Task pane
function TaskLaunchSubTaskFromList (taskId,taskName)
{
   var inPropSet = App().NewPropertySet ();
   var inPropSet1 = App().NewPropertySet ();
   inPropSet.SetProperty("TaskName", taskName);
   service  = App().GetService ("Task UI Service (SWE)");
   // Fix 12-1F3QHUB, no need to toggle task pane before or after StartTask request since 
   // StartTask request automatically toggles action pane to Task Pane.
   outPropSet = service.InvokeMethod ("StartTask", inPropSet);
}

function TaskInvokeMethod (methodName)
{
   if (SWEIsHighInteract)
   {
      var js;

      var childPropSet = null;
      var errPropSet   = null;
      var inPropSet    = App().NewPropertySet ();
      var outPropSet   = null;

      outPropSet = TaskFastServiceInvokeMethod (methodName, inPropSet);

      if (outPropSet != null)
      {
         childPropSet = TaskGetChildByType (outPropSet, "ResultSet");

         if (childPropSet != null)
         {
            errPropSet = TaskGetChildByType (childPropSet, "Error");
            if (errPropSet != null)
            {
               if (ProcessError (errPropSet))
                  return;
            }

            js = childPropSet.GetProperty ("JS");
            if (js.length > 0)
            {
               eval (js);
            }
         }
      }
   }
   else
   {
      SIInvokeMethod (methodName);
   }
}

function ProcessError (errPropSet)
{
   if (errPropSet != null)
   {
      var errString = errPropSet.GetProperty ("ErrString");

      if (errString.length > 0)
      {
         alert (errString);
         return (true);
      }
   }
   return (false);
}


// Task Assistant Interface Calls

function IsStepOpen (stepId)
{
   var subStepBoxRef = document.getElementById(stepId + "_sub_box");
   var bStepOpen = (subStepBoxRef.className == "substep1");

   return (bStepOpen);
}

function GenerateOpenStepList (bIncludeCurrent)
{
   var openStepList = "";

   if (bIncludeCurrent)
      openStepList = g_currentStep;

   for (var i = 1; i < g_stepDefArray.length ; i++)
   {
      var stepId = "" + i;
      if (IsStepOpen (stepId))
      {
         if (openStepList != "")
            openStepList += ",";
         openStepList += i;
      }
   }

   return (openStepList);
}

function TaskSetControlHighlight (appletName, controlName, action)
{
   if (SWEIsHighInteract)
   {
      if (TaskObj () != null)
      {
         TaskObj ().SetControlHighlight (appletName, controlName, action);
      }
   }
}

// Automation support functions

// returns a pointer to Task Assistant ActiveX object
var g_taskObj = null;

function TaskObj ()
{
   if (g_taskObj == null)
      g_taskObj = this.document.getElementById ("E_TaskAssistant");

   return (g_taskObj);
}

// calls SetAutoProperty on ActiveX object
function getJSProperty (propName)
{
   var taskObj = TaskObj ();

   if (taskObj != null)
   {
      if (propName == "Mode")
      {
         taskObj.SetAutoProperty (g_bPlayerMode ? "PLAYER" : "LIST");
      }
      else if (propName == "NumSteps")
      {
         if (g_stepDefArray != null && typeof g_stepDefArray != "undefined")
            taskObj.SetAutoProperty ("" + g_stepDefArray.length - 1);
         else
            taskObj.SetAutoProperty ("0");
      }
      else if (propName == "NumTasks")
      {
         if (g_taskDefArray != null && typeof g_taskDefArray != "undefined")
            taskObj.SetAutoProperty ("" + g_taskDefArray.length - 1);
         else
            taskObj.SetAutoProperty ("0");
      }
      else if (propName == "StepNum")
      {
         taskObj.SetAutoProperty (g_currentStep);
      }
      else if (propName == "TaskId")
      {
         taskObj.SetAutoProperty (g_taskId);
      }
      else if (propName == "TaskName")
      {
         taskObj.SetAutoProperty (g_taskName);
      }
   }
}

// plays back an event
function PlaybackEvent (eventName, arg)
{
   if (eventName == "Close")
   {
      HandleClose ();
   }
   else if (eventName == "Done")
   {
      HandleDone ();
   }
   else if (eventName == "Next")
   {
      HandleBranch ();
   }
   else if (eventName == "Start")
   {
      LaunchTask (arg);
   }
   else if (eventName == "Step")
   {
      GotoStepIfAllowed (arg, false);
   }
   else if (eventName == "StepView")
   {
      GotoStepIfAllowed (arg, true);
   }
   else if (eventName == "SubStepToggle")
   {
      // do nothing
   }
}

// calls the Task Assistant ActiveX object to record an event
function RecordEvent (eventName, arg)
{
   var taskObj = TaskObj ();

   if (taskObj != null)
   {
      taskObj.RecordEvent (eventName, arg);
   }
}
