/*****************************************************************************
 *
 * Copyright (C) 2000, Siebel Systems, Inc., All rights reserved.
 *
 * FILE:       print.js
 *  $Revision: $
 *      $Date: $
 *    $Author: $ of last update
 *
 * CREATOR:    Jimin Li
 *
 * DESCRIPTION
 *    Print and Print Preview functions for quick print feature
 *
 *****************************************************************************/
function printsetup(args, myurl, xl)
{
   xl.Application.WindowState = -4140; //xlMinimized:-4140
   xl.Application.Visible = true;
   if (myurl.length >255)
   {
      alert(args[4]);
   }
   else 
   {
      xl.Application.Workbooks.Open (myurl);
      xl.Application.Rows("1:1").Select();
      xl.Application.Selection.Font.Bold = true; //true: -1 or true
      xl.Application.ActiveSheet.Range("A1").Select();
      xl.Application.ActiveCell.CurrentRegion.Select();
      var iColumn = xl.Application.Selection.Columns.Count;
      xl.Application.Selection.HorizontalAlignment = 1; //xlGeneral:1
      xl.Application.Selection.VerticalAlignment = -4160; //xlTop:-4160
      xl.Application.Selection.Columns.AutoFit();

      var i = 1;
      while (i<=iColumn)
      {
         var dWidth = xl.Application.ActiveSheet.Columns(i).ColumnWidth;
         if (dWidth > 30)
         {
            xl.Application.ActiveSheet.Columns(i).ColumnWidth = 30;
         }//end if
         i = i +1;
      } //end while
      xl.Application.Selection.WrapText = true; //true:-1 or true
      xl.Application.ActiveSheet.Range("A1").Select();
      xl.Application.ActiveSheet.PageSetup.PrintTitleRows = "$1:$1";
      xl.Application.ActiveSheet.PageSetup.LeftFooter = "&D";
      xl.Application.ActiveSheet.PageSetup.RightFooter = args[5];
      xl.Application.ActiveSheet.PageSetup.PrintGridlines = true; //true:-1 or true
      xl.Application.ActiveSheet.PageSetup.Orientation = 2; //xlLandscape:2
      xl.Application.ActiveSheet.PageSetup.Order = 2; //xlOverThenDown:2
   }
}

function printlist(args) {
   //args[0]: URL
   //args[1]: EXCEL, HTML, OTHER
   //args[2]: TRUE, FALSE TRUE if custom print or print preview
   //args[3]: Excel is the current printing application, but it cannot be launched.  
   //Please ensure that you have Excel installed properly on your computer, or change 
   //the printing application to HTML in User Preferences-->Behavior and print again.
   //args[4]: Excel can't open a URL longer than  255! 
   //args[5]: Page &P of &N
   var myurl = window.location.protocol + "//" + window.location.host; 
   var xl;
   if (args[1] == "EXCEL")
   {
      myurl = myurl + window.location.pathname + args[0];
      //ActiveXObject is IE only method.
      try{
         xl = new ActiveXObject ("Excel.Application");
      }
      catch (e)
      {
         alert (args[3]);
         return (false);
      }
      printsetup (args, myurl, xl);
      xl.Application.WindowState = -4143; //xlNormal: -4143
      xl.Application.ActiveWindow.SelectedSheets.PrintOut();
      xl.Application.WindowState = -4140;//xlMinimized:-4140
      xl.Application.ActiveWindow.Close(false);
   }
   else if (args[1] == "HTML")
   {
      myurl = myurl + args[0];
      var newWindow = window.open (myurl, "NewWindow", "menubar,resizable,scrollbars");
      //window.print();
   }
   if (args[2] == "TRUE")
   {
      App().ClosePopup();   
   }  
   //else
   //{
      //add your own script
      //var wrd = new ActiveXObject("Word.Document");
      //wrd.Application.Visible = true;
      //wrd.Application.Documents.Open(myurl);
      //wrd.Application.PrintOut(false);
      //wrd.Application.ActiveDocument.Close(0);
      //wrd.Application.Quit();
   //}
}

function printpreview(args) {
   //args[0]: URL
   //args[1]: EXCEL, HTML, OTHER
   //args[2]: TRUE, FALSE TRUE if custom print or print preview
   //args[3]: Excel is the current printing application, but it cannot be launched.  
   //Please ensure that you have Excel installed properly on your computer, or change 
   //the printing application to HTML in User Preferences-->Behavior and print again.
   //args[4]: Excel can't open a URL longer than  255! 
   //args[5]: Page &P of &N

   var myurl = window.location.protocol + "//" + window.location.host;
   var xl;
   if (args[1] == "EXCEL")
   {
      myurl = myurl + window.location.pathname + args[0]; 
      //ActiveXObject is IE only method.
      try{
         xl = new ActiveXObject ("Excel.Application");
      }
      catch (e)
      {
         alert (args[3]);
         return (false);
      }
      printsetup (args, myurl, xl);
      //xl.Application.ActiveSheet.PrintPreview();
    }
   else if (args[1] == "HTML")
   {
      myurl = myurl + args[0]; 
      var newWindow = window.open (myurl, "NewWindow", "menubar,resizable,scrollbars");
   }
   if (args[2] == "TRUE")
   {
      App().ClosePopup();   
   }
   if (args[1] == "EXCEL")
   {
      xl.Application.WindowState = -4143; //xlNormal: -4143
   }
}
