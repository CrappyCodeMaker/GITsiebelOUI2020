function JSSSWEFrameFINSQueryBaseNotify(applet)
{
	this.applet = applet;
}
function JSSSWEFrameFINSQueryBase_NotifyGeneric(type, args)
{
	if(type == "HI_Filter_Spec")
	{
		var oView = this.applet.GetView()
		var oApplet = oView.GetApplet("Event HI Calendar Applet")
		var oPropset = new top._swescript.JSSPropertySet();
		oPropset.SetProperty("Filter Spec", args[0])
		oApplet.InvokeMethod("ExecuteFilterQuery",oPropset) 		
	}   
	//else
	//	this.applet.NotifyGeneric (this.applet, type, args);
}

function JSSSWEFrameFINSQueryBase_DoInvokeMethod (applet, method, inputPropSet)
{
   var ctlNamedFilters;
   var ctlFilterName; 
   var bNoErr;
   var input;
   var index;
   var curFilterName,ret;

   if (method == "ExecuteQuery")
		method = "RunFilter"

   if (method == "NewQuery")
	    method = "ClearFilter"		
		
   if ((method == "FilterChanged") || (method == "RunFilter"))
   {
       ctlNamedFilters = this.document.getElementsByName("_SweNamedFilters")[0];
       if ((ctlNamedFilters != null) && (ctlNamedFilters.tagName == "SELECT"))
	   {
   		 inputPropSet.SetProperty("_SweNamedFilters", ctlNamedFilters.value);
   		 top._swescript.JSSApplet_DoInvokeMethod (applet, method, inputPropSet);
	   }
   }
    else if (method == "DeleteFilter")
   {
       ctlNamedFilters = this.document.getElementsByName("_SweNamedFilters")[0];
       curFilterName = this.document.getElementsByName("_SweFilterName")[0].value;              if ((ctlNamedFilters != null) && (ctlNamedFilters.tagName == "SELECT"))
	   {
   		 inputPropSet.SetProperty("_SweNamedFilters", ctlNamedFilters.value);
    	 inputPropSet.SetProperty("_SweFilterName", curFilterName);
    	     	 if (top._swescript.JSSApplet_DoInvokeMethod (applet, method, inputPropSet))
      	 {           ctlNamedFilters = this.document.getElementsByName("_SweNamedFilters")[0];
    	   ctlNamedFilters.options[ctlNamedFilters.selectedIndex].removeNode(true);
    	   ctlNamedFilters.options[0].selected = true;    	   this.document.getElementsByName("_SweFilterName")[0].value = "";
  		  }
	   }
   }
   else if ((method == "SaveFilterAs") || (method == "SaveFilterAsDefault"))
   {
      curFilterName = this.document.getElementsByName("_SweFilterName")[0].value; 
     if (curFilterName == "")
			return false;
      ctlNamedFilters = this.document.getElementsByName("_SweNamedFilters")[0];
      
      if ((ctlNamedFilters != null) && (ctlNamedFilters.tagName == "SELECT"))
      {
      	   for (index=0; index<ctlNamedFilters.options.length; index++)
      	   {
      	   		if (ctlNamedFilters.options[index].value == curFilterName)
      	   			break;
      	   }      	         	   inputPropSet.SetProperty("_SweFilterName", curFilterName);
      	         	   if (index != ctlNamedFilters.options.length)
      	   {
      	   		if (top._swescript.JSSApplet_DoInvokeMethod (applet, method, inputPropSet))
      	   			ctlNamedFilters.options[index].selected = true;
      	   }
      	   else if (top._swescript.JSSApplet_DoInvokeMethod (applet, method, inputPropSet))
      	   {
      	     	 ctlNamedFilters.options[ctlNamedFilters.options.length] = new Option(curFilterName,curFilterName);
  			     ctlNamedFilters.options[ctlNamedFilters.options.length-1].selected = true;
  		   }  		   
  		   this.document.getElementsByName("_SweFilterName")[0].value	= ""
	  }
   }
    else if (method == "ClearFilter")
    {
        this.document.getElementsByName("_SweNamedFilters")[0].value = "";
        top._swescript.JSSApplet_DoInvokeMethod (applet, method, inputPropSet);
    }
	else if (method ==	"WriteRecord" || method == "NewRecord" || method == "CopyRecord" || method == "DeleteRecord" || method == "GotoLastSet" || method == "RefineQuery" || method == "UndoRecord")
		return false;
  	else   
   		top._swescript.JSSApplet_DoInvokeMethod (applet, method, inputPropSet);
}

function JSSSWEFrameFINSQueryBase_DoPopulate (applet)
{
   if (this.m_bInitialLoad)
	{
      var inputPropSet;
		inputPropSet = new top._swescript.JSSPropertySet ();
		this.m_bInitialLoad = false;
	   var oBusComp = this.GetBusComp();
	   var oNotify = new JSSSWEFrameFINSQueryBaseNotify(this);
	   this.SetNotifyObj(oNotify);
	   oBusComp.RegNotifyObj(oNotify);

		top._swescript.JSSApplet_DoInvokeMethod(applet,"PreDefaultHook", inputPropSet);
	}
	
	top._swescript.JSSApplet_DoPopulate(applet);
}
function JSSSWEFrameFINSQueryBase ()
{
	this.m_bInitialLoad = true;

}


function JSSSWEFrameFINSQueryBase_DoPostChangesToBC (applet, writeRecord)
{
//   var pset;

//   if (applet.busComp != null &&
//       applet.busComp.IsCommitPending ())
//   {
//      pset = new top._swescript.JSSPropertySet ();
//      if (!writeRecord)
//        return (top._swescript.JSSApplet_DoInvokeMethod (this, "PostChanges", pset));
//   }

   applet.ClearErrorMsg ();
   return (true);
}

new JSSSWEFrameFINSQueryBase ();
JSSSWEFrameFINSQueryBase.prototype = new top._swescript.JSSApplet ();
JSSSWEFrameFINSQueryBase.prototype.DoInvokeMethod = JSSSWEFrameFINSQueryBase_DoInvokeMethod;
JSSSWEFrameFINSQueryBase.prototype.DoPopulate = JSSSWEFrameFINSQueryBase_DoPopulate;
JSSSWEFrameFINSQueryBase.prototype.DoPostChangesToBC = JSSSWEFrameFINSQueryBase_DoPostChangesToBC;



//new JSSSWEFrameFINSQueryBase ();

JSSSWEFrameFINSQueryBaseNotify.prototype = new top._swescript.JSSAppletNotify();
JSSSWEFrameFINSQueryBaseNotify.prototype.NotifyGeneric = JSSSWEFrameFINSQueryBase_NotifyGeneric;

