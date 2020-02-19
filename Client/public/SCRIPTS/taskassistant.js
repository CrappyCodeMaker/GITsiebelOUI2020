////////////////////
// global variables
////////////////////
   var g_taskDefArray = new Array();                 // array to store task definitions
   var g_subtaskDefArray;              // array to store task mapped to an iHelp item to invoke it from the task list pane
   var g_stepDefArray;                 // array to store step definitions
   var g_imgMap;                       // map to store pre-cached image files
   var g_localeStrMap = new Array();   // map to store locale strings
   var g_currentStep = "1";            // variable to track current step
   var g_curViewName = "";             // variable to track current view name
   var g_branchStepIdArray;            // variable to track branching step
   var g_offset = "0";                 // variable to be added to each step number
   var g_bPlayerMode = false;          // variable to track we are in player mode or list mode
   var g_bInit = false;                // variable to track if HandleInit has been triggered
   var g_bShowReqOnly = false;         // variable to track "ShowRequiredOnly" status
   var g_bHasDoneStep = false;         // variable to track if "Done" step has been added
   var g_taskId = "";                  // variable to track current task id for automation property
   var g_taskName = "";                // varialbe to trakc current task name for automation property
   var isNN = false;                   // variable to track browser flavor
   var g_bIsHyperLink = false;         // variable to track if the step has a hyperlink.			 

   var gHighlightStyle1 = "3px red solid";   // highlight style (on)
   var gHighlightStyle0 = "0px red solid";   // highlight style (off)

   var g_formObj;
   var g_csObj;
   
   var g_selectediHelpId;              // variable to have currently selected iHelp id
   var g_iHelpIdsArray   = new Array();// array to have all step and subsetp id's 
   var g_iHelpIdCount    = 0;          // count variable for step and subsetp id count
   var g_moreImgAltMsg ;               // variable to have img alt message for more image
   var g_lessImgAltMsg ;               // Variable to have img alt message for les image 
   var g_bIsClickMore = false;

   function SetSIMethodInvokeParams (formObj, csObj)
   {
      g_formObj = formObj;
      g_csObj = csObj;
      g_csObj.SWEMethod = "Test";
   }

///////////////////
// task definition
///////////////////
   function taskDef(id, view)
   {
      this.rowId = id;
      this.viewName = view;
   }
///////////////////
// Sub task definition
///////////////////
   function subtaskDef(taskid,id,taskheadername,taskname)
   {
      this.taskId = taskid;   
      this.rowId = id;
      this.taskName = taskheadername;
      this.viewName = taskname;
   }

///////////////////
// step definition
///////////////////
   function stepDef(req, vName, sectionLabel)
   {
      this.bReq = (req == "0")?false:true;
      this.viewName = vName;
      this.sectionLabel = "";

      this.bChecked = false;
      this.bSel = false;
      this.highlightData = "";
      this.subStepArray = new Array();
   }
   function subStepDef(req)
   {
      this.bReq = (req == "0")?false:true;
      this.highlightData = "";
   }

////////////////////////////
// private helper functions
////////////////////////////
   function LaunchTask(taskId)
   {
      var taskRef;
      RecordEvent ("Start", taskId);
      // Launch iHelp item or UI Task based on item selected
      if( taskId.charAt(taskId.length - 1) == "T")
      {
         taskRef = g_subtaskDefArray[parseInt(taskId)];  
         TaskLaunchSubTaskFromList (taskRef.rowId,taskRef.viewName);
      }
      else
      {
         taskRef = g_taskDefArray[parseInt(taskId)];
         TaskLaunchTaskFromList (taskRef.rowId);
      }
   }
   //The following function added by SNAYAK for the iHelp-Development :iHelp Task UI Bridge 
   //Feature#12-QP5WH8 to invoke related task UI mapped to iHelp item from iHelp Task pane
   function LaunchRelatedTask(taskRowId)
   {
      for (var i = 1; i < g_taskDefArray.length; i++)
      {
         var taskRef = g_taskDefArray[i];
         if(taskRef.rowId == taskRowId)
         {
            i = "" + i + "";
            LaunchTask(i);
            break;
         }
      }
   }
   function UpdateStepStatus(originStep, destStep)
   {
      var originDef = g_stepDefArray[parseInt(originStep)];
      var destDef = g_stepDefArray[parseInt(destStep)];

      if (parseInt(destStep) > parseInt(originStep))
      {  // moving forward
         if (destDef != null && typeof destDef != "undefined")
            destDef.bChecked = false;
         if (originDef != null && typeof originDef != "undefined")
            originDef.bChecked = true;
      }
      else
      {  // moving backward
         if (destDef != null && typeof destDef != "undefined")
            destDef.bChecked = false;

         if (!destDef.bReq)
         {  // moving back to a non-required step
            if (originDef != null && typeof originDef != "undefined")
            {
               if (!originDef.bReq)
                  originDef.bChecked = true;
               else
                  originDef.bChecked = false;
            }
         }
         else
         {  // moving back to a required step
            for (var i = g_stepDefArray.length - 1; i > parseInt(destStep); i--)
            {
               // need to unchecked all steps below destStep
               if (g_stepDefArray[i] != null && typeof g_stepDefArray[i] != "undefined")
               {
                  g_stepDefArray[i].bChecked = false;
                  //FetchImage("" + i);
               }
            }
         }
      }
   }
   function GotoStepIfAllowed (stepId, bViewNav)
   {
      if (!bViewNav)
         RecordEvent ("Step", stepId);
      else
         RecordEvent ("StepView", stepId);
   // Added by SKODAVAL for Kansas to add the sub item iHlep items to g_iHelpIdsArray
   // when expand the sub itmes
      var temArray = new Array();
      var subStepBoxRef = document.getElementById(stepId + "_sub_box");
      if (subStepBoxRef != null && typeof subStepBoxRef != "undefined")
      {
         var bMore = (subStepBoxRef.className == "substep0");
         if(bMore)
         {
            var k=0;
            iHelpSubItemArray = g_stepDefArray[stepId].subStepArray;
            for(j=0;j<g_iHelpIdsArray.length;j++)
            {
               temArray[k]=g_iHelpIdsArray[j];
               k++;
               if (g_iHelpIdsArray[j]==stepId+"_main_more_acr")
               {
                  for(i=1;i<iHelpSubItemArray.length;i++)
                  {
                     temArray[k]=stepId + "_" +i+"l";
                     k++;
                  }
               }
            }
            g_iHelpIdsArray=temArray;
            g_iHelpIdCount=k;
         }
      }
	  var sId ;
	  if(g_bIsClickMore)
	  {
	     if (top._swescript!=null) top._swescript.resetiHelpStepIdSelId(g_iHelpIdsArray,g_selectediHelpId);
	     g_bIsClickMore = false;
	  }
	  else
	  {
	  	if (top._swescript!=null) top._swescript.SetiHelpStepIdSelId(g_iHelpIdsArray,stepId + "_main_acr"); 
	  }
      
   //End code
      DoGotoStepIfAllowed (stepId, bViewNav);
   }

      function DoGotoStepIfAllowed(stepId, bViewNav)
   {
      if (parseInt(stepId) > g_stepDefArray.length)
         return;

      // check we are moving forward or backward
      var bForward = true;
      if (parseInt(stepId) < parseInt(g_currentStep))
         bForward = false;

      // check if we are moving beyond the last step among all step defs
      if (parseInt(stepId) == g_stepDefArray.length)
      {
         if (g_bHasDoneStep == true)
         {
            // we are heading for the "Done" step, render UI accordingly
            SetCurrentStep(stepId);
            return;
         }
         else
         {
            // we are heading forward beyond the branching point
            g_branchStepIdArray.push("" + (parseInt(stepId)-1));
            // ask for steps beyond branching point
            //SWE: RPC call to server
            // rpc nextset
            TaskGetNextSet (g_currentStep);
            return;
         }
      }

      // check if view change is needed
      var bViewChange = bViewNav;
      var targetView = g_stepDefArray[parseInt(stepId)].viewName;
      
      // iHelp - FR-12-1I088XV 
      // Explicitly change the view if we are moving to a non hyperlink step based on a
      // different view.
      if (!bViewChange && !g_bIsHyperLink)
      {
         g_bIsHyperLink = false;
         var currentView = g_stepDefArray[parseInt(g_currentStep)].viewName;
         if (currentView != targetView)
            bViewChange = true;
      }
      // check if we are moving backward to the latest branching point
      if (g_branchStepIdArray.length > 0)
      {
         var latestBranchStep = g_branchStepIdArray[g_branchStepIdArray.length - 1];
         var prevBranchStep = 0;
                  
         if (g_branchStepIdArray.length - 1 > 0)
            prevBranchStep = g_branchStepIdArray[g_branchStepIdArray.length - 2];

         if (parseInt(stepId) <= parseInt(latestBranchStep)) 
         {
            // we are moving backward to the latest branching point
            if (parseInt(stepId) > parseInt(prevBranchStep))
            {
                if (bViewChange)
                {
                    TaskGotoView(targetView, stepId);
                }
                
                HighlightStep ("", "CLEAR");
                ClearStepsAfter(latestBranchStep);
                SetCurrentStep(stepId);
                HighlightStep ("", "SET");
                                  
                return;
             }
         // FR - 12-1GA0G99 - iHelp Crashes
         // Case to check if we are moving backward beyond the previous branch step.
         // For ex: if the iHelp steps are 1 -> 2 -> 3 -> 5 and 1 -> 2 -> 4 -> 5
         // we navigate backward from 5 to 1 (latestBranchStep = 4 and prevBranchStep = 2)
           if (parseInt(stepId) <= parseInt(prevBranchStep))
           {
             if (bViewChange)
             {
               TaskGotoView(targetView, stepId);
             }
                     
            HighlightStep ("", "CLEAR");
            //We are moving to the previous branch step.
            if (parseInt(stepId) == parseInt(prevBranchStep))
            {
               ClearStepsAfter(prevBranchStep);
             }
             //We are moving beyond the previous branch step.
             else
            {
               // Clear all the steps from the previous branch step. i.e. the first branch 
               // from the selected step id.
               var clearBranchStep = 0;
               if (g_branchStepIdArray.length - 2 > 0)
                  { 
                     //Parse through the branch step id array to get the branching point immediately 
                     //after the current step id.
                     //latest branch step = length -1 and we have previous branch step = length-2
                     for (var stepindex = parseInt(g_branchStepIdArray.length - 3); stepindex >= 0; stepindex--)
                     {
                           clearBranchStep = g_branchStepIdArray[stepindex];
                           if (parseInt(stepId) < parseInt(clearBranchStep))
                              continue;
                           else if (parseInt(stepId) > parseInt(clearBranchStep))
                           {
                              clearBranchStep =  g_branchStepIdArray[stepindex + 1];
                              break;
                           }
                           // The current step is a branching point.
                           else
                              break;
                     }
                     //Clear steps after immediate branching point.
                     ClearStepsAfter(clearBranchStep);
                  }
                  // prevBranchStep is the immediate branching point after the selected step.
                  else
                        ClearStepsAfter(prevBranchStep);
               }
               
            SetCurrentStep(stepId);
            HighlightStep ("", "SET");                                      
            return;
         }
     }
     }
      
      // goto view if needed
      if (bViewChange)
      {
         TaskGotoView(targetView, stepId);
      }

      HighlightStep ("", "CLEAR");
      SetCurrentStep(stepId);
      HighlightStep ("", "SET");
   }
       
    function HighlightStep (stepId, action)
   {
      if (stepId == "")
         stepId = g_currentStep;  // server says just whatever current step is
 
      if (SWEIsHighInteract)
      {
         var view = App().GetMainView ();
         if (view != null && stepId != "")
         {
            var viewName = view.GetName ();
            if (viewName == g_stepDefArray[stepId].viewName)
            {
               var hlDataStr = g_stepDefArray[stepId].highlightData;
               var hlDataStrArray = hlDataStr.split("|");

               for (var i = 0; i < hlDataStrArray.length; i++)
               {
                  var hlStr = hlDataStrArray[i].split("@");
                  var appletName = hlStr[0];
                  var controlName = hlStr[1];

                  if (appletName != "" && controlName != "")
                  {
                     if (action == "SET")
                     {
                        // highlight control on applet
                        //alert ("SET " + appletName + " : " + controlName);
                        TaskSetControlHighlight (appletName, controlName, "SET");
                     }
                     else if (action == "CLEAR")
                     {
                        // clear control on applet
                        //alert ("CLEAR " + appletName + " : " + controlName);
                        TaskSetControlHighlight (appletName, controlName, "CLEAR");
                     }
                  }
               }
            }
         }
      }
   }
//////////////////
// event handlers
//////////////////
   function HandleInit()
   {
      if (g_bInit)
         return;

      // browser check
      isNN = (navigator.appName == "Netscape")?true:false;

      // initialize image array
      g_imgMap = new Array();
      g_imgMap["arw_more"]        = new Image(7, 14);
      g_imgMap["arw_less"]        = new Image(7, 14);
      g_imgMap["arw_more"].src        = "images/arw_more.gif";
      g_imgMap["arw_less"].src        = "images/arw_less.gif";

      g_bInit = true;

      // initialize template sizes
      HandleResize();
   }
   function HandleResize()
   {
      // reset tasklist pane width
      var browserWidth = (isNN)?innerWidth:document.body.offsetWidth;
      document.getElementById("taskListHeader").style.width = browserWidth - 10;
      document.getElementById("tasklistUI").style.width = browserWidth - 10;
      document.getElementById("taskPlayerMain").style.width = browserWidth - 10;
      document.getElementById("taskListPane").style.width = document.getElementById("tasklistUI").clientWidth; // excluding scrollbar

      // reset taskPlayer pane height
      var browserHeight = (isNN)?innerHeight:document.body.offsetHeight;
      var taskListHeaderHeight = document.getElementById("taskListHeader").clientHeight;
      document.getElementById("tasklistUI").style.height = browserHeight - taskListHeaderHeight - 10;
      document.getElementById("taskPlayerMain").style.height = browserHeight - 60;
   }
   function HandleStepEvt(evt)   // event handler for STEP block click
   {
      evt = (evt)?evt:((event)?event:null);
      if (evt)
      {
         var elem = (evt.target)?evt.target:((evt.srcElement)?evt.srcElement:null);
         if (elem)
         {
            // retrieve stepId
            var stepId;
            while (elem.id == null || typeof elem.id == "undefined" || elem.id == "")
            {
               elem = elem.parentNode;
            }
            var idx;
            if (elem.id.indexOf("S_") >= 0)
            {
               alert ("Error: An internal tag has an id of " + elem.id + " with capital 'S'. It should use lowercase 's'.");
            }
            if (elem.id.indexOf("s_") >= 0)
            {
               idx = elem.id.substring(2).indexOf("_") + 2;
               stepId = elem.id.substring(2, idx);
            }
            else
            {
               idx = elem.id.indexOf("_");
               stepId = elem.id.substring(0, idx);
            }

            if (g_bPlayerMode)
            {
               //if (AllowJumping(stepId))  // make sure we're allowed to jump around
               //{
                  // find out the matching event handler
                  switch(evt.type)
                  {
                     case "click":
                        var bSubClick = (elem.id.indexOf("_main_more") >= 0);
                        if (bSubClick)
                        {
                           var subStepBoxRef = document.getElementById(stepId + "_sub_box");
                           if (subStepBoxRef != null && typeof subStepBoxRef != "undefined")
                           {
                              var bMore = (subStepBoxRef.className == "substep0");
                              subStepBoxRef.className = bMore?"substep1":"substep0";

                              var stepImg = document.getElementById(stepId + "_main_more");
                              if (stepImg != null && typeof stepImg != "undefined")
                              {
                                 if(bMore)
                                 {
                                    stepImg.src=g_imgMap["arw_less"].src;
                                    stepImg.alt=g_imgMap["arw_less"].alt;
                                 }
                                 else
                                 {
                                    stepImg.src = g_imgMap["arw_more"].src;
                                    stepImg.alt=g_imgMap["arw_more"].alt;
                                 }
                              }
                           }
                           evt.cancelBubble = true;
                        }
                        else
                        {
                           //iHelp - FR-12-1I088XV - Check for HyperLink.
                           g_bIsHyperLink = (elem.innerHTML.indexOf("_main_link") >= 0);                           
                           var bViewNav = (elem.id.indexOf("_main_link") >= 0);
                           if (bViewNav)
                              evt.cancelBubble = true;
                           else
                              GotoStepIfAllowed(stepId, bViewNav);
                        }
                        break;
                     case "mouseover":
                        if (document.getElementById(stepId + "_main_span") != null)
                           document.getElementById(stepId + "_main_span").className = (g_currentStep == stepId)?"step1Hover":"step0Hover";
                        if (document.getElementById(stepId + "_main_more") != null &&
                            document.getElementById(stepId + "_main_more").className == "stepImg1")
                           document.getElementById(stepId + "_main_more").className = "stepImg1Hover";
                        break;
                     case "mouseout":
                        if (document.getElementById(stepId + "_main_span") != null)
                           document.getElementById(stepId + "_main_span").className = (g_currentStep == stepId)?"step1":"step0";
                        if (document.getElementById(stepId + "_main_more") != null &&
                            document.getElementById(stepId + "_main_more").className == "stepImg1Hover")
                           document.getElementById(stepId + "_main_more").className = "stepImg1";
                        break;
                  }
               //}
            }
            else
            {
               // find out the matching event handler
               switch(evt.type)
               {
                  case "click":
                     LaunchTask(stepId);
                     break;
                  case "mouseover":
                     if (document.getElementById("s_" + stepId + "_task") != null)
                        document.getElementById("s_" + stepId + "_task").className = "taskHoverOn";
                     break;
                  case "mouseout":
                     if (document.getElementById("s_" + stepId + "_task") != null)
                        document.getElementById("s_" + stepId + "_task").className = "taskHoverOff";
                     break;
               }
            }
         }
      }
   }
   function HandleClose()
   {
      RecordEvent ("Close");

      if (SWEIsHighInteract)
      {
         if (g_stepDefArray != null && typeof g_stepDefArray != "undefined" &&
             g_stepDefArray.length > 0)
         {
            HighlightStep ("", "CLEAR");
         }
      }
      
      TaskInvokeMethod ("CloseTaskAssistant");
   }
   function HandleDone()
   {
      RecordEvent ("Done");

      if (SWEIsHighInteract)
      {
         if (g_stepDefArray != null && typeof g_stepDefArray != "undefined" &&
             g_stepDefArray.length > 0)
         {
            HighlightStep ("", "CLEAR");
         }
      }

      TaskInvokeMethod ("Done");
   }
   function HandleBranch()
   {
      RecordEvent ("Next");

      var numDefs = g_stepDefArray.length;
      DoGotoStepIfAllowed("" + (numDefs));
   }

////////////////////
// public functions
////////////////////
   function SetPlayerMode(bMode)
   {
      g_bPlayerMode = (bMode=="1")?true:false;

      // update UI
      document.getElementById("tasklistUI").className = g_bPlayerMode?"tasklist0":"tasklist1";
      document.getElementById("taskPlayerUI").className = g_bPlayerMode?"taskUI1":"taskUI0";
      document.getElementById("titleBox_list").className = g_bPlayerMode?"control0":"control1";
      document.getElementById("titleBox_player").className = g_bPlayerMode?"control1":"control0";
   }
   function SetLocaleStrings(localeString)
   {
      // populate locale strings into g_localeStrMap
      var strArray = localeString.split("|");
      for (var i = 0; i < strArray.length; i++)
      {
         var localeStr = strArray[i].split("@");
         g_localeStrMap[localeStr[0]] = localeStr[1];

         // substitute locale strings into corresponding spans
         var elem = document.getElementById(localeStr[0]);
         if (elem != null && typeof elem != "undefined")
            elem.innerHTML = localeStr[1];
      }
   }

   function InitTaskList(taskTitleName)
   {
      // initialize the task assistant frame
      HandleInit();

      // set task list name
      document.getElementById("taskTitle_list").innerHTML = taskTitleName;

      // initialize task def array
      //g_taskDefArray = new Array();

      // initialize subtask def array
      g_subtaskDefArray = new Array();

      // for automation properties
      g_taskId = "";
      g_taskName = "";
   }
   function AddTask(taskId, taskRowId, taskName, viewName)
   {
      // create step node in the document tree
      if (document.getElementById(taskId + "_task_box") == null ||
          typeof document.getElementById(taskId + "_task_box") == "undefined")
      {
         // create container
         document.getElementById("0_task_box").id = taskId + "_task_box";
         document.getElementById("s_0_task").id = "s_" + taskId + "_task";
         document.getElementById("s_0_sub_task").id = "s_" + taskId + "T_sub_task";

         var taskNode = document.getElementById(taskId + "_task_box").cloneNode(true);

         // add to document tree
         document.getElementById("taskContainer").appendChild(taskNode);
         
         // reset template
         document.getElementById(taskId + "_task_box").id = "0_task_box";
         document.getElementById("s_" + taskId + "_task").id = "s_0_task";
         document.getElementById("s_" + taskId + "T_sub_task").id = "s_0_sub_task";
      }
   
      // modify data
      var action = "LaunchTask(\"" + taskId + "\")";
      document.getElementById("s_" + taskId + "_task").innerHTML = "<a href='javascript:" + action + "'>" + taskName + "</a>";
      document.getElementById(taskId + "_task_box").className = "taskBox1";

      // store task def data
      g_taskDefArray[parseInt(taskId)] = new taskDef(taskRowId, viewName);

      // attach event handler
      document.getElementById("s_" + taskId + "_task").onmouseover = HandleStepEvt;
      document.getElementById("s_" + taskId + "_task").onmouseout = HandleStepEvt;
      //document.getElementById("s_" + taskId + "_task").onclick = HandleStepEvt;
   }

   //The following function added by SNAYAK for the iHelp-Development :iHelp Task UI Bridge 
   //Feature#12-QP5WH8 to invoke related task UI mapped to iHelp item from iHelp Task pane
   function AddSubTask(taskId, taskRowId, taskHeaderName, taskName)
   {
      // create step node in the document tree
      if (document.getElementById(parseInt(taskId)+ "_sub_task_box") == null ||
         typeof document.getElementById(parseInt(taskId) + "_sub_task_box") == "undefined")
      {
         // reset template
         document.getElementById("s_0_sub_task").id = "s_" + taskId + "_sub_task";
         document.getElementById("s_" + taskId + "_sub_task").id = "s_0_sub_task";
      }

      // modify data
      var action = "LaunchTask(\"" + taskId + "\")";
      document.getElementById("s_" + taskId + "_sub_task").className = "subtaskBox";
      document.getElementById("s_" + taskId + "_sub_task").innerHTML = "<a href='javascript:" + action +"'><FONT COLOR=#008C00>" + taskHeaderName + "</FONT></a>";
      
      // store subsub task def data
      g_subtaskDefArray[parseInt(taskId)] = new subtaskDef(taskId,taskRowId,taskHeaderName,taskName);

      // attach event handler
      document.getElementById("s_" + taskId + "_sub_task").onmouseover = HandleStepEvt;
      document.getElementById("s_" + taskId + "_sub_task").onmouseout = HandleStepEvt;
      //document.getElementById("s_" + taskId + "_sub_task").onclick = HandleStepEvt;
      
   }

   function ClearTaskList()
   {
      // clear task list name
      document.getElementById("taskTitle_list").innerHTML = "";

      // remove tasks from document tree
      var contRef = document.getElementById("taskContainer");
      var numChilds = contRef.childNodes.length;
      for (var i = 0; i < numChilds; i++)
      {
         contRef.removeChild(contRef.childNodes[0]);
      }

      // clear task def array
      if (g_taskDefArray != null && typeof g_taskDefArray != "undefined")
      {
         var numDefs = g_taskDefArray.length - 1;
         for (var i = 0; i < numDefs; i++)
         {
            g_taskDefArray.pop();
         }
      }
      
      // clear sub task def array
      if (g_subtaskDefArray != null && typeof g_subtaskDefArray != "undefined")
      {
         var numDefs = g_subtaskDefArray.length - 1;
         for (var i = 0; i < numDefs; i++)
         {
            g_subtaskDefArray.pop();
         }
      }
      
   }
   function SetCurViewName(viewName)   // to support same view task launch
   {
      g_curViewName = viewName;
   }
   function SetReturnLinkName (returnLinkName)
   {
      // set return link name
      document.getElementById("taskListName").innerHTML = returnLinkName;
   }
   function InitTask(taskTitleName, taskName, taskId)
   {
      // initialize the task assistant frame
      HandleInit();

      // set task list name
      //document.getElementById("taskTitle_player").innerHTML = taskTitleName;

      // set task name
      document.getElementById("taskName").innerHTML = taskName;

      // initialize current step
      g_currentStep = "1";

      // initialize step def array
      g_stepDefArray = new Array();

      // initialize branch step array
      g_branchStepIdArray = new Array();

      // for automation properties
      g_taskName = taskName;
      g_taskId = taskId;
      
      //FR# 12-TCJG8P - Reset Scrolls
      var taskPaneDoc = document.getElementById("taskPane");
      var visibleTop = taskPaneDoc.scrollTop;
      
      //FR_12-1FFF94U - check stepTop when taskPaneDoc.offsetParent = null
      var stepTop;
      var taskMainDoc = document.getElementById(g_currentStep + "_main_box")
      if (taskMainDoc != null && typeof taskMainDoc != "undefined")
		  stepTop = taskMainDoc.offsetTop;
   
      if (taskPaneDoc.offsetParent)
      {
         taskPaneDoc.offsetParent.scrollTop = 0;
         taskPaneDoc.scrollTop = 0;
      }
      else if (stepTop < visibleTop)
      {
         taskPaneDoc.scrollTop = 0;
      }
   }
   ////////////////////////////////////////////////////////////////////////
   // The following AddShowMeMore Function added by SNAYAK for the 
   // Feature#12-QP5WH9 to add iHelp Show Me More Link in task playbar pane
   ////////////////////////////////////////////////////////////////////////
   function AddShowMeMore (taskId, RowId, showMeText, helpLocation)
   {
      // create Show me node in the document tree
      document.getElementById("0_ShowMe_box").id = taskId + "_ShowMe_box";
      document.getElementById("s_0_ShowMe").id = "s_" + taskId + "_ShowMe";
      var ShowMeNode = document.getElementById(taskId + "_ShowMe_box").cloneNode(true);

      // reset template
      document.getElementById(taskId + "_ShowMe_box").id = "0_ShowMe_box";
      document.getElementById("s_" + taskId + "_ShowMe").id = "s_0_ShowMe";

      // modify data
      //ShowMeLocation could be either file location or url name
      var ShowMeLocation = "<a href=\"" + helpLocation +"\" TARGET=_blank>" + showMeText + "</a>";
      document.getElementById("s_" + taskId + "_ShowMe").innerHTML = ShowMeLocation;
      document.getElementById(taskId + "_ShowMe_box").className = "taskBox1";
   }
   ////////////////////////////////////////////////////////////////////////
   // The following AddAdditionalHelpHeading Function added by SNAYAK for the 
   // Feature#12-QP5W7S to add Additional iHelp heading in task playbar pane
   ////////////////////////////////////////////////////////////////////////
   function AddAdditionalHelpHeading (taskId, additionalHelpText)
   {
      // modify data and the stayle of the header
      document.getElementById("AddHelpHeader").innerHTML = additionalHelpText;
      document.getElementById("AddHelpHeaderImg").className = "stepImg1"
      document.getElementById("AddHelpHeaderImg").className = "AddiHelpHeader"
   }
   ////////////////////////////////////////////////////////////////////////
   // The following AddAdditionalHelpTopicItem Function added by SNAYAK for the 
   // Feature#12-QP5W7S to add related Additional iHelp list items in task playbar pane
   ////////////////////////////////////////////////////////////////////////
   function AddAdditionalHelpTopicItem (taskId, ParentTaskId, helpTopicName, helpTopicRowId)
   {
      // create step node in the document tree
      if (document.getElementById(taskId + "_taskiHelpAdd_box") == null ||
          typeof document.getElementById(taskId + "_taskiHelpAdd_box") == "undefined")
      {
         // create container
         document.getElementById("0_taskiHelpAdd_box").id = taskId + "_taskiHelpAdd_box";
         document.getElementById("s_0_taskiHelpAdd").id = "s_" + taskId + "_taskiHelpAdd";
         var taskNode = document.getElementById(taskId + "_taskiHelpAdd_box").cloneNode(true);

         // add to document tree
         document.getElementById("taskiHelpAddContainer").appendChild(taskNode);
   
         // reset template
         document.getElementById(taskId + "_taskiHelpAdd_box").id = "0_taskiHelpAdd_box";
         document.getElementById("s_" + taskId + "_taskiHelpAdd").id = "s_0_taskiHelpAdd";
      }
     
      //Action could be javasript function to lunach iHelp item
      var action = "LaunchRelatedTask(\"" + helpTopicRowId + "\")";
      var AddHelpTopicName = "<a href='javascript:" + action +"'>" + helpTopicName + "</a>";
      
      // modify data and style of the text
      document.getElementById("s_" + taskId + "_taskiHelpAdd").innerHTML = AddHelpTopicName;
      document.getElementById(taskId + "_taskiHelpAdd_box").className = "taskBox1";

      // store task def data
      g_taskDefArray[parseInt(taskId)] = new taskDef(helpTopicRowId, ParentTaskId);
   }

   function AddStep(stepId, stepData, bReq, viewName, sectionLabel, strAccessEnhanced)
   {
      // if "Done" step
      if (stepData.toLowerCase() == "done")
      {
         g_bHasDoneStep = true;
         document.getElementById("branchStep").className = "branch0";
      }
      else
      {
         // create step node in the document tree
         if (document.getElementById(stepId + "_main_box") == null ||
             typeof document.getElementById(stepId + "_main_box") == "undefined")
         {
            // create container
            document.getElementById("0_main_box").id = stepId + "_main_box";
            document.getElementById("0_main_sectionLabel").id = stepId + "_main_sectionLabel";
            document.getElementById("0_main_span").id = stepId + "_main_span";
            document.getElementById("s_0_main").id = "s_" + stepId + "_main";
            document.getElementById("0_main_more").id = stepId + "_main_more";
            document.getElementById("0_sub_box").id = stepId + "_sub_box";
            document.getElementById("0_subStepContainer").id = stepId + "_subStepContainer";
            document.getElementById("0_0_sub_span").id = stepId + "_0_sub_span";
            document.getElementById("0_0_sub").id = stepId + "_0_sub";
            var stepNode = document.getElementById(stepId + "_main_box").cloneNode(true);

            // reset template
            document.getElementById(stepId + "_main_box").id = "0_main_box";
            document.getElementById(stepId + "_main_sectionLabel").id = "0_main_sectionLabel";
            document.getElementById(stepId + "_main_span").id = "0_main_span";
            document.getElementById("s_" + stepId + "_main").id = "s_0_main";
            document.getElementById(stepId + "_main_more").id = "0_main_more";
            document.getElementById(stepId + "_sub_box").id = "0_sub_box";
            document.getElementById(stepId + "_subStepContainer").id = "0_subStepContainer";
            document.getElementById(stepId + "_0_sub_span").id = "0_0_sub_span";
            document.getElementById(stepId + "_0_sub").id = "0_0_sub";

            // add to document tree
            document.getElementById("stepContainer").appendChild(stepNode);
         }

         // modify data
         // process the step text
         var viewTagIdx = stepData.indexOf("<v>");
         if (viewTagIdx >= 0)
         {
            // <v> tag was found
            var tmpArray1 = stepData.split("<v>");
            var stepData1 = tmpArray1[0];
            var tmpArray2 = tmpArray1[1].split("</v>");
            var stepData2 = tmpArray2[1];
            var viewText = tmpArray2[0];
            var action = "GotoStepIfAllowed(\"" + stepId + "\", true)";
           
            // modified for Kansas in making iHelp Accessibility complaint by adding id to <a> tag
            document.getElementById("s_" + stepId + "_main").innerHTML = "" + (parseInt(stepId) + parseInt(g_offset)) + ". " 
                                                                     + stepData1 + "<label id='" + "s_" + stepId 
                                                                     + "_main_link'><a  href='javascript:" + action + "' id='"+"s_" + stepId+"_main_acr'>"
                                                                     + viewText + "</a></label>" + stepData2;
            // adding iHelp Step id in array and increasing count
            g_iHelpIdsArray[g_iHelpIdCount]="s_" + stepId + "_main_acr";
            g_iHelpIdCount++;
         }
         else
         {
            if(strAccessEnhanced =="TRUE")
            {
               var action = "GotoStepIfAllowed(\"" + stepId + "\", false)";
               // modified for Kansas in making iHelp Accessibility complaint by adding id to <a> tag
               document.getElementById("s_" + stepId + "_main").innerHTML = "" + (parseInt(stepId) + parseInt(g_offset)) + ". " + "<label id='" + "s_" + stepId 
                                                                           + "_main_link'><a href='javascript:" + action + "' id='"+"s_" + stepId+"_main_acr'>"
                                                                           + stepData + "</a></label>";
               // adding iHelp Step id in array and increasing count
               g_iHelpIdsArray[g_iHelpIdCount]="s_" + stepId + "_main_acr";
               g_iHelpIdCount++;
               
            }
            else
            {
               document.getElementById("s_" + stepId + "_main").innerHTML = "" + (parseInt(stepId) + parseInt(g_offset)) + ". " + stepData;
            }
         }
         document.getElementById(stepId + "_main_box").className = "stepBox1";
         document.getElementById(stepId + "_main_sectionLabel").innerHTML = sectionLabel;

         // store step def data
         g_stepDefArray[parseInt(stepId)] = new stepDef(bReq, viewName, sectionLabel);

         // attach event handler
         document.getElementById(stepId + "_main_span").onmouseover = HandleStepEvt;
         document.getElementById(stepId + "_main_span").onmouseout = HandleStepEvt;
         if(strAccessEnhanced !="TRUE")
         {
            document.getElementById(stepId + "_main_span").onclick = HandleStepEvt;
         }
      }
   }
   function AddSubStep(stepId, subStepId, subStepData, bReq, strAccessEnhanced)
   {
      var subStepArray;

      if (g_stepDefArray[stepId] != null && typeof g_stepDefArray[stepId] != "undefined")
         subStepArray = g_stepDefArray[stepId].subStepArray;

      // store subStep data into subStepArray in the corresponding step definition
      // (overwrite the existing data if exists already)
      subStepArray[subStepId] = new subStepDef(bReq);

      // display the "has more" image for this step
      var stepImg = document.getElementById(stepId + "_main_more");
      if (stepImg != null && typeof stepImg != "undefined" && stepImg.className == "stepImg0")
      {
         stepImg.className = "stepImg1";
         // attach event handler
         if(strAccessEnhanced !="TRUE")
         {
            document.getElementById(stepId + "_main_more").onmouseover = HandleStepEvt;
            document.getElementById(stepId + "_main_more").onmouseout = HandleStepEvt;
            document.getElementById(stepId + "_main_more").onclick = HandleStepEvt;
         }
         else
         {
            if(strAccessEnhanced =="TRUE")
            {
               var action;
			   // BUG# 11656274
               // Revised for Firefox compatibility, according to W3C standards.
               // "parentElement" can only be used in IE browser.
               // by YUTILIU
               // if (stepImg.parentElement.tagName != "A")
               if (stepImg.parentNode.tagName != "A")
               {
                  action = "toggleSubSteps(\"" + stepId + "\")";
                  // modified for Kansas in making iHelp Accessibility complaint by adding id to <a> tag
                  // and added the alt text to image
                    stepImg.alt=g_moreImgAltMsg;
                    stepImg.outerHTML = "<a href='javascript:" + action + "' id='"+stepId + "_main_more_acr'>" + stepImg.outerHTML + "</a>";
                  
               }
            }
         }
          // adding the iHelp id to array in making it as accessibilty complaint
          g_iHelpIdsArray[g_iHelpIdCount]=stepId + "_main_more_acr";
          g_iHelpIdCount++;
      }

      // insert subStep data into corresponding step box
      var subStepBoxRef = document.getElementById(stepId + "_sub_box");
      if (subStepBoxRef != null && typeof subStepBoxRef != "undefined")
      {
         // create sub step node in the document tree
         var subStepRef = document.getElementById(stepId + "_" + subStepId + "_sub_span");
         if (subStepRef == null || typeof subStepRef == "undefined")
         {
            // create container
            document.getElementById(stepId + "_0_sub_span").id = stepId + "_" + subStepId + "_sub_span";
            document.getElementById(stepId + "_0_sub").id = stepId + "_" + subStepId + "_sub";
            var subStepNode = document.getElementById(stepId + "_" + subStepId + "_sub_span").cloneNode(true);
   
            // reset template
            document.getElementById(stepId + "_" + subStepId + "_sub_span").id = stepId + "_0_sub_span";
            document.getElementById(stepId + "_" + subStepId + "_sub").id = stepId + "_0_sub";
   
            // add to document tree
            document.getElementById(stepId + "_subStepContainer").appendChild(subStepNode);
         }
         
         // fetch the corresponding status image
         var imgName = "req_" + (subStepArray[subStepId].bReq?"1":"0");
         var imgAlt = (subStepArray[subStepId].bReq?"Required":"") + "Sub Step";
         
         // modify data
         //document.getElementById(stepId + "_" + subStepId + "_sub").innerHTML = "<Label id='"+stepId + "_" + subStepId+"l'>"+subStepData +"</Label>";
         if(strAccessEnhanced)
         {
            document.getElementById(stepId + "_" + subStepId + "_sub").innerHTML = "<a href='#' id='"+stepId + "_" + subStepId+"l'>"+subStepData +"</a>";
            
         }
         else
         {
            document.getElementById(stepId + "_" + subStepId + "_sub").innerHTML =subStepData ;
         }
         document.getElementById(stepId + "_" + subStepId + "_sub_span").className = "substep1";
      }
   }
   function AddHighlights(stepId, subStepId, highlightData)
   {
      if (subStepId == "")
      {
         g_stepDefArray[stepId].highlightData = highlightData;
      }
      else
      {
         g_stepDefArray[stepId].subStepArray.highlightData = highlightData;
      }
   }
   
   function toggleSubSteps (stepId)
   {
      var subStepBoxRef = document.getElementById(stepId + "_sub_box");
      if (subStepBoxRef != null && typeof subStepBoxRef != "undefined")
      {
         var bMore = (subStepBoxRef.className == "substep0");
         if (bMore)
         {
		    g_bIsClickMore = true;
            GotoStepIfAllowed (stepId, false);
         }
         else
         {
            // Code added by SKODAVL for Kansas to make iHelp Accessibilty Complaint
            // When click on less arrow image to collapse the sub iHelp itesm.
            // Need to remove the sub iHelp items Id's from the g_iHelpIdsArray so that focus will not goes to sub items
            var tempArray = new Array();
            var bFindstep=false;
            var k=0;
            var nextStepId = parseInt(stepId)+1;
            for(var j=0;j<g_iHelpIdsArray.length;j++)
            {
               if (g_iHelpIdsArray[j]==stepId+"_main_more_acr")
               {
                  tempArray[k]=g_iHelpIdsArray[j];
                  k++;
				  bFindstep = true;
               }
               if(g_iHelpIdsArray[j]=="s_"+nextStepId+"_main_acr")
               {
                  bFindstep = false;
               }
               if(!bFindstep)
               {
                  tempArray[k]=g_iHelpIdsArray[j];
                  k++;
               }
            }
            g_iHelpIdsArray=tempArray;
            // Reseting  g_iHelpIdsArray,g_selectediHelpId values in sweutil_Keyboard.js
            if (top._swescript!=null) top._swescript.resetiHelpStepIdSelId(g_iHelpIdsArray,g_selectediHelpId);
            //End code for Kansas
            subStepBoxRef.className = "substep0";
            var stepImg = document.getElementById(stepId + "_main_more");
            if (stepImg != null && typeof stepImg != "undefined")
            {   
               stepImg.src = g_imgMap["arw_more"].src;
               //setting the alt text.
               stepImg.alt = g_moreImgAltMsg;
            }
            
         }
      }
   }
   
   
   
   
   function SetCurrentStep(stepId)
   {
      UpdateStepStatus(g_currentStep, stepId);

      if (parseInt(stepId) > g_stepDefArray.length)
         return;

      // change render style
      document.getElementById(g_currentStep + "_main_span").className = "step0";
     // setting the current iHelp step id to global variable used for focus tracking
      g_selectediHelpId =	 "s_" + stepId + "_main_acr"; 
      // change font style
      //document.getElementById("s_" + g_currentStep + "_main").className = "step0HoverOff";
      // change status
      var oldStepRef = g_stepDefArray[parseInt(g_currentStep)];
      if (oldStepRef != null && typeof oldStepRef != "undefined")
      {
         oldStepRef.bSel = false;
      }
      
      g_currentStep = stepId;

      var newBoxRef = document.getElementById(g_currentStep + "_sub_box");
      if (newBoxRef != null && typeof newBoxRef != "undefined")
         newBoxRef.className = "substep1";

      var stepImg = document.getElementById(g_currentStep + "_main_more");
      if (stepImg != null && typeof stepImg != "undefined")
      {
         stepImg.src = g_imgMap["arw_less"].src;
         stepImg.alt = g_imgMap["arw_less"].alt; //Setting alt text for image
      }

      // change render style
      var mainSpan = document.getElementById(g_currentStep + "_main_span");
      if (mainSpan != null && typeof mainSpan != "undefined")
         mainSpan.className = "step1";
      // change font style
      //document.getElementById("s_" + g_currentStep + "_main").className = "step1HoverOff";
      // change status
      var newStepRef = g_stepDefArray[parseInt(g_currentStep)];
      if (newStepRef != null && typeof newStepRef != "undefined")
      {
         newStepRef.bSel = true;
      }

      // scroll the task pane if the current step is not completely visible
      var stepTop = document.getElementById(g_currentStep + "_main_box").offsetTop;
      var visibleTop = document.getElementById("taskPane").scrollTop;
      if (stepTop < visibleTop)
      {
         document.getElementById("taskPane").scrollTop = stepTop;
      }
   }
   function SetStepState(stepId, bOpen)
   {
      // Code added by SKODAVAL for Kansas to put the sub iHelp Items which were in expand
      // to g_iHelpIdsArray 
	  if(bOpen)
	  {
         iHelpSubStepArray = g_stepDefArray[stepId].subStepArray;
         for(i=1;i<iHelpSubStepArray.length;i++)
         {
            g_iHelpIdsArray[g_iHelpIdCount]=stepId + "_" +i+"l";
            g_iHelpIdCount++;
         }
	  }
      //End code for Kansas
      // set substep open state
      var subStepBoxRef = document.getElementById(stepId + "_sub_box");
      if (subStepBoxRef != null && typeof subStepBoxRef != "undefined")
      {
         subStepBoxRef.className = bOpen?"substep1":"substep0";
 
         var stepImg = document.getElementById(stepId + "_main_more");
         if (stepImg != null && typeof stepImg != "undefined")
         {
            if(bOpen)
            {
               stepImg.src = g_imgMap["arw_less"].src;
               stepImg.alt = g_imgMap["arw_less"].alt; //Setting alt text for image
            }
            else 
            {
               stepImg.src = g_imgMap["arw_more"].src;
               stepImg.alt = g_imgMap["arw_more"].alt; //Setting alt text for image
            }
         }
      }
   }
   function SetBranchStepIdArray(branchStepIdList)
   {
      if (branchStepIdList.length > 0)
         g_branchStepIdArray = branchStepIdList.split (",");
   }
   function SetStepNumberOffset(offset)
   {
      g_offset = offset;
   }
   function DoRenderAll ()
   {
      document.getElementById("taskPane").className = "taskPane1";
   }
   function RenderAll()
   {
      DoRenderAll ();

      // IE bug workaround.
      // When the task has lots of steps (>=15) and substeps, IE doesn't completely create all the steps
      // by this point and the style doesn't get applied to all the steps (they show up invisible).
      // Setup a timer to do another round of rendering/applying styles once all the steps have been
      // fully created by IE.
      if (SWEIsHighInteract)
      {
         if (g_stepDefArray != null && typeof g_stepDefArray != "undefined" &&
             g_stepDefArray.length >= 0)
         {
            setTimeout ("DoRenderAll();", 150);
         }
      }
   }
   function ClearStepsAfter(stepId)
   {
      // remove from document tree
      var contRef = document.getElementById("stepContainer");
      var index = parseInt(stepId);
      var numChilds = contRef.childNodes.length;
      for (var i = index; i < numChilds; i++)
      {
         contRef.removeChild(contRef.childNodes[index]);
      }

      // remove from g_stepDefArray
      var numDefs = g_stepDefArray.length - 1;
      for (var i = index; i < numDefs; i++)
      {
         delete g_stepDefArray[i+1];
         g_stepDefArray.length--;
      }

      // reset "Done" step
      g_bHasDoneStep = false;
      // hide Done box
      document.getElementById("branchStep").className = "branch1";

      //update g_currentStep in case currentStep has been removed
      if (parseInt(g_currentStep) > parseInt(stepId) && stepId != "0")
      {
         // TODO: handle "g_bShowReqOnly" case
         g_currentStep = stepId;
         SetCurrentStep(g_currentStep);
      }

      // update g_branchStepIdArray if case some of the branching points have been removed
      var index = g_branchStepIdArray.length;
      for (var i = index; i > 0; i--)
      {
         if (parseInt(g_branchStepIdArray[i - 1]) >= parseInt(stepId))
         {
            g_branchStepIdArray.pop();
         }
      }
   }
   function ClearTask()
   {
      // clear task list name
      //document.getElementById("taskTitle_player").innerHTML = "";

      // clear task name
      document.getElementById("taskName").innerHTML = "";

      // reset step numbering
      //document.getElementById("IDS_TASKASST_STEPNUM").innerHTML = g_localeStrMap["IDS_TASKASST_STEPNUM"];

      // update buttons
      //document.getElementById("stepPrv").className = "stepBtn0";
      //document.getElementById("stepNxt").className = "stepBtn0";

      // reset global variables
      g_currentStep = "1";
      g_offset = "0";
      g_bShowReqOnly = false;
      g_bHasDoneStep = false;
      // reset global variables for iHelp
      g_selectediHelpId	="";           
      g_iHelpIdsArray	= new Array();
      g_iHelpIdCount	= 0;	

      // remove all step defs
      //ClearStepsAfter("0");
      document.getElementById("stepContainer").innerHTML = "";
      // remove all additional iHelp items
      document.getElementById("taskiHelpAddContainer").innerHTML = "";
      // hide show me location
      document.getElementById("s_0_ShowMe").innerHTML = "";
      document.getElementById("0_ShowMe_box").className = "tasklist0"
      // hide Additional iHelp header
      document.getElementById("AddHelpHeader").innerHTML =  "";
      document.getElementById("AddHelpHeaderImg").className = "stepImg0"

      // hide the whole panel
      document.getElementById("taskPane").className = "taskPane0";
   }
   
   function getiHelpIdsArray()
   {
      return g_iHelpIdsArray;
   }
   function getSelectediHelpId()
   {
      return g_selectediHelpId;
   }
   function SetImgAltMsg(moreImg,moreImgAltMsg,lessImg,lessImgAltMsg)
   {
      g_moreImgAltMsg = moreImgAltMsg;
      g_lessImgAltMsg = lessImgAltMsg;
      g_imgMap["arw_more"].src        = moreImg;
      g_imgMap["arw_less"].src        = lessImg;
      g_imgMap["arw_more"].alt        = moreImgAltMsg;
      g_imgMap["arw_less"].alt        = lessImgAltMsg;
   }
   
   function AddCurrentStepSubiHelpItems()
   {
     if (parseInt(g_currentStep) > g_stepDefArray.length)
         return;

     var stepImg = document.getElementById(g_currentStep + "_main_more");
	 var mainSpan = document.getElementById(g_currentStep + "_main_span");
      
      if (stepImg != null && typeof stepImg != "undefined" 
	  && mainSpan != null && typeof mainSpan != "undefined")
      {
	     var k=0;
		 var temArray = new Array();
         var iHelpSubItemArray = g_stepDefArray[g_currentStep].subStepArray;
		 if (iHelpSubItemArray != null && typeof iHelpSubItemArray != "undefined" &&
             iHelpSubItemArray.length >= 0)
		{
            for(j=0;j<g_iHelpIdsArray.length;j++)
            {
               temArray[k]=g_iHelpIdsArray[j];
               k++;
               if (g_iHelpIdsArray[j]==g_currentStep+"_main_more_acr")
               {
                  for(i=1;i<iHelpSubItemArray.length;i++)
                  {
                     temArray[k]=g_currentStep + "_" +i+"l";
                     k++;
                  }
               }
            }
            g_iHelpIdsArray=temArray;
		}
	  }
     
   }

   // BUG# 11717944
   // Add for Firefox compatibility
   // Extend the prototype of HTMLElement to implement outerHTML property
   // by YUTILIU
   if (typeof(HTMLElement) != "undefined" && !window.opera)
   {          
      HTMLElement.prototype.__defineGetter__("outerHTML", function()
      {
         var a = this.attributes;
         var str = "<" + this.tagName;
         for (var i = 0, len = a.length; i < len; i++)
         {
            if (a[i].specified)
            {
               str += " " + a[i].name + '="' + a[i].value + '"';
            }
         }
         if (!this.canHaveChildren)
         {
            return str + " />";
         }
      
         return str + ">" + this.innerHTML + "</" + this.tagName + ">";
      });
      
      HTMLElement.prototype.__defineSetter__("outerHTML", function(s)
      {
         var r = this.ownerDocument.createRange();
         r.setStartBefore(this);
         var df = r.createContextualFragment(s);
         this.parentNode.replaceChild(df, this);
         return s;
      });

      HTMLElement.prototype.__defineGetter__("canHaveChildren", function()
      {
         return !/^(area|base|basefont|col|frame|hr|img|br|input|isindex|link|meta|param)$/.test(this.tagName.toLowerCase());
      });
   }