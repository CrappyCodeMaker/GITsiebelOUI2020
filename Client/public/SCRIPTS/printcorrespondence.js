/*****************************************************************************
 *
 * Copyright (C) 2003, Siebel Systems, Inc., All rights reserved.
 *
 * FILE:       printcorresp.js
 *  $Revision: $
 *      $Date: $
 *    $Author: $ of last update
 *
 * CREATOR:    jili
 *
 * DESCRIPTION
 *     Correspondence ( Fulfillment ) Print Function
 *
 *****************************************************************************/

function printmergeddocument (args)
{
   //args[0]: encoded PS
   //args[1]: number of records selected
   var i;
   var iRecord = parseInt(args[1], 10);
   var Wrd;
   var background = false;
   var dsSaveChangesNo = 0;
   var filepath = '';
   var nPropertyCount = 0;
   var service = null;

   if (iRecord < 1)
	return;

   var inputPropSet = App().NewPropertySet ();
   inputPropSet.DecodeFromString (args[0]);
   nPropertyCount = inputPropSet.GetPropertyCount ();

   service = App().GetService ("CorrespPrint");
      
   if (nPropertyCount > 0 && service != null && typeof (service) != "undefined")
   {
   
	Wrd = new ActiveXObject("Word.Application");
	Wrd.Application.Visible = false;
      
   	for (i = 0; i < iRecord; i++)
   	{
      	outPropSet = service.InvokeMethod ("ClientPrint", inputPropSet);
      		
      	filepath = outPropSet.GetProperty ("FilePath");
      		
		if(filepath != '')
      	{
      		Wrd.Application.Documents.Open(filepath);
      		Wrd.Application.PrintOut(background);
      		Wrd.Application.ActiveDocument.Close(dsSaveChangesNo);
      		filepath = '';
       	}
    }
    
    Wrd.Application.Quit();
   }
   App().ClosePopup();
   return (true);
}

