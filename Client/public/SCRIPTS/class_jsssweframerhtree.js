///////////////////////////////////////////////////////////////////////////////
//
// Copyright (C) 2001, Siebel Systems, Inc., All rights reserved.
//
// FILE:       rhtreeapplet.js
//  $Revision: 1 $
//      $Date: 7/05/01 12:00a $
//    $Author: Calvin Lai $ of last update
//
// CREATOR:    Calvin Lai
//
// DESCRIPTION
//    Relationship Hierarchy Tree applet for JavaScript browser tier.
//
//////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////
//
// JSSSWEFrameRHTree class - derived from JSSApplet.
//
//////////////////////////////////////////////////////////////////////////////

//----------------------------------------------------------------------
// m_backupdoc    Object:     Caches applet document.
// m_tbId         String:     Id of the table tag containing the tree.
function JSSSWEFrameRHTree()
{
   this.m_backupdoc = null;
   this.m_tbId      = "X";
}

//----------------------------------------------------------------------
// Overridden methods inheritated from JSSApplet class
//----------------------------------------------------------------------
function JSSSWEFrameRHTree_DoCanInvokeMethod(applet,
                                         method)
{
   if (method == "CollapseTreeItem" ||
       method == "ExpandTreeItem"   ||
       method == "NextTreeItem"     ||
       method == "PreviousTreeItem")
   {
      return (true);
   }
   else
   {
      return (JSSApplet_DoCanInvokeMethod(applet, method));
   }
}

//----------------------------------------------------------------------
function JSSSWEFrameRHTree_DoInitialize(applet)
{
   var  busComp;
   var  notifyObj;

   // register our notification object
   if (applet.GetNotifyObj() == null)
   {
      busComp = applet.GetBusComp();

      if (busComp)
      {
         notifyObj     = new JSSSWEFrameRHTreeNotify(applet);
         applet.ntfyId = busComp.RegNotifyObj(notifyObj);
         applet.SetNotifyObj(notifyObj);
      }
   }
   return (JSSApplet_DoInitialize(applet));
}

//----------------------------------------------------------------------
function JSSSWEFrameRHTree_DoReinitialize(applet)
{
   return (JSSApplet_DoReinitialize(applet));
}

//----------------------------------------------------------------------
function JSSSWEFrameRHTree_DoInvokeMethod(applet,
                                      method,
                                      inputPropSet)
{
   if (method == "CollapseTreeItem" ||
       method == "ExpandTreeItem"   ||
       method == "NextTreeItem"     ||
       method == "PreviousTreeItem")
   {
      if (inputPropSet.GetProperty("SWETreeItem") != null)
         return (JSSApplet_DoInvokeMethod(applet, method, inputPropSet));
   }
   return (false);
}

//----------------------------------------------------------------------
function JSSSWEFrameRHTree_DoPopulate(applet)
{
   JSSApplet_DoPopulate(applet);
   return (applet.Display(applet));
}

//----------------------------------------------------------------------
// Notification handlers
//----------------------------------------------------------------------
function JSSSWEFrameRHTree_NotifyGeneric(applet, type, args)
{
   if (type == "GetPage")
      applet.UpdateTree(applet, args);
}

//----------------------------------------------------------------------
// Utilities
//----------------------------------------------------------------------
function JSSSWEFrameRHTree_Display(applet)
{
   return (true);
}

//----------------------------------------------------------------------
function JSSSWEFrameRHTree_GetDocument()
{
   var doc = this.document;

   if (doc == null || doc.body == null)
   {
      doc = this.m_backupdoc;
   }
   return (doc);
}

//----------------------------------------------------------------------
// Handle event resulting from click on an item link
function JSSSWEFrameRHTree_HandleItemAction(method, path)
{
   var inputProps = new JSSPropertySet();
   inputProps.SetProperty("SWETreeItem", path);
   this.InvokeMethod(method, inputProps);
}

//----------------------------------------------------------------------
function JSSSWEFrameRHTree_SetDocument (doc)
{
   this.document    = doc;
   this.m_backupdoc = doc;
}

//----------------------------------------------------------------------
function JSSSWEFrameRHTree_SetSpanId (id)
{
   this.m_tbId = id;
}

//----------------------------------------------------------------------
function JSSSWEFrameRHTree_ToString()
{
   return ("[JSSSWEFrameRHTree " + GetName() + "]");
}

//----------------------------------------------------------------------
// In-place swap of the tree content
function JSSSWEFrameRHTree_UpdateTree(applet, data)
{
   if (data[1] != applet.view.GetName())
      return;

   if (data[2] != applet.name)
      return;

   var doc = applet.GetDocument();

   if (doc != null && doc.body != null)
   {
      var span = doc.getElementById("_sweTblBegin"+applet.m_tbId);

      if (span != null)
         span.innerHTML = data[3];
   }
}

//----------------------------------------------------------------------
new JSSSWEFrameRHTree();
JSSSWEFrameRHTree.prototype                      = new JSSApplet();

JSSSWEFrameRHTree.prototype.Display              = JSSSWEFrameRHTree_Display;
JSSSWEFrameRHTree.prototype.DoCanInvokeMethod    = JSSSWEFrameRHTree_DoCanInvokeMethod;
JSSSWEFrameRHTree.prototype.DoInitialize         = JSSSWEFrameRHTree_DoInitialize;
JSSSWEFrameRHTree.prototype.DoInvokeMethod       = JSSSWEFrameRHTree_DoInvokeMethod;
JSSSWEFrameRHTree.prototype.DoPopulate           = JSSSWEFrameRHTree_DoPopulate;
JSSSWEFrameRHTree.prototype.DoReinitialize       = JSSSWEFrameRHTree_DoReinitialize;
JSSSWEFrameRHTree.prototype.GetDocument          = JSSSWEFrameRHTree_GetDocument;
JSSSWEFrameRHTree.prototype.HandleItemAction     = JSSSWEFrameRHTree_HandleItemAction;
JSSSWEFrameRHTree.prototype.NotifyGeneric        = JSSSWEFrameRHTree_NotifyGeneric;
JSSSWEFrameRHTree.prototype.SetDocument          = JSSSWEFrameRHTree_SetDocument;
JSSSWEFrameRHTree.prototype.SetSpanId            = JSSSWEFrameRHTree_SetSpanId;
JSSSWEFrameRHTree.prototype.toString             = JSSSWEFrameRHTree_ToString;
JSSSWEFrameRHTree.prototype.UpdateTree           = JSSSWEFrameRHTree_UpdateTree;


//////////////////////////////////////////////////////////////////////////////
//
// JSSSWEFrameRHTreeNotify class - derived from JSSAppletNotify.
//
//////////////////////////////////////////////////////////////////////////////

function JSSSWEFrameRHTreeNotify(applet)
{
   this.m_bInGeneric = false;
   this.applet       = applet;
}

function JSSSWEFrameRHTreeNotify_NotifyGeneric(type, args)
{
   if (!this.m_bInGeneric)
   {
      this.m_bInGeneric = true;
      this.applet.NotifyGeneric(this.applet, type, args);
      this.m_bInGeneric = false;
   }
}

//----------------------------------------------------------------------
new JSSSWEFrameRHTreeNotify();
JSSSWEFrameRHTreeNotify.prototype                         = new JSSAppletNotify();

JSSSWEFrameRHTreeNotify.prototype.NotifyGeneric           = JSSSWEFrameRHTreeNotify_NotifyGeneric;
