// AUTHOR:        BRowles
// DESCRIPTION:   SWE javascript functions for manipulating hidden/visible combo box selections

// Consolidate preferences
function SaveUserPreferences(formObj)
{
   if(IsOpenUI() && !formObj.ShownItems)
   {
      select = $('[name=ShownItems]')[0];
   }
   else
   {
      select = formObj.ShownItems;
   }

   if (0 == select.length)
   {
      SWEAlert(g_strErrorNoItemsSelected);
      return;
   }

   if(IsOpenUI() && !formObj.SubmitShownItems)
   {
      submit = $('[name=SubmitShownItems]')[0];
   }
   else
   {
      submit = formObj.SubmitShownItems;
   }
   
   submit.value = '';
   
   for (i = 0; i < select.length; i++)
   {
      opt = select.options[i];
      if (opt.value.length <= 0)
         continue;

      if (submit.value.length > 0)
         submit.value = submit.value + ',' + opt.value;
      else
         submit.value = opt.value;
   }

   if(IsOpenUI() && !formObj.HiddenItems)
   {
      select = $('[name=HiddenItems]')[0];
   }
   else
   {
      select = formObj.HiddenItems;
   }
   
   if(IsOpenUI() && !formObj.SubmitHiddenItems)
   {
      submit = $('[name=SubmitHiddenItems]')[0];
   }
   else
   {
      submit = formObj.SubmitHiddenItems;
   }
   submit.value = '';

   for (i = 0; i < select.length; i++)
   {
      opt = select.options[i];
      if (opt.value.length <= 0)
         continue;

      if (submit.value.length > 0)
         submit.value = submit.value + ',' + opt.value;
      else
         submit.value = opt.value;
   }

   //SWESaveFormObj (formObj);

   if(IsOpenUI() && !formObj.SWECmd && !formObj.SWEMethod)
   {
      $('[name=SWECmd]').attr('value', 'InvokeMethod');
      $('[name=SWEMethod]').attr('value', 'SaveUserPreferences');
   }
   else
   {
      formObj.SWECmd.value = 'InvokeMethod';
      formObj.SWEMethod.value = 'SaveUserPreferences';
   }
   //formObj.submit();

   // added as part of QTP bug fix FR:12-J7CY3B_F. This changes 
   // code path to route through SWESubmitForm() to submit the form
   SWESubmitForm (formObj);

   //SWERestoreFormObj (formObj);
}

// Switch all items to other combobox
function SwitchAllItems(formObj, tHidden)
{
   if (tHidden == "1")
   {
      if(IsOpenUI() && !formObj.HiddenItems && !formObj.ShownItems)
      {
         selectSrc = $('[name=HiddenItems]')[0];
         selectDest = $('[name=ShownItems]')[0];
      }
      else
      {
         selectSrc = formObj.HiddenItems;
         selectDest = formObj.ShownItems;
      }
   }
   else
   {
      if(IsOpenUI() && !formObj.HiddenItems && !formObj.ShownItems)
      {
         selectSrc = $('[name=ShownItems]')[0];
         selectDest = $('[name=HiddenItems]')[0];
      }
      else
      {
         selectSrc = formObj.ShownItems;
         selectDest = formObj.HiddenItems;
      }
   }

   selectDest.selectedIndex = -1;

   i = 0;
   var NewOpt;
   while (i < selectSrc.length)
   {
      opt = selectSrc.options[i];
      NewOpt = new Option(opt.text,opt.value);
      NewOpt.selected = 1;
      selectSrc.options[i] = null;
      selectDest.options[selectDest.length] = NewOpt;
   }

   if(IsOpenUI() && SiebelApp.S_App.IsMobileApplication() === "true")
   {
      $(selectSrc).selectmenu('refresh');
      $(selectDest).selectmenu('refresh');
   }
   selectDest.focus();
}

// Switch selected items to other combobox
function SwitchSelectedItems(formObj, tHidden)
{
   if (tHidden == "1")
   {
      if(IsOpenUI() && !formObj.HiddenItems && !formObj.ShownItems)
      {
         selectSrc = $('[name=HiddenItems]')[0];
         selectDest = $('[name=ShownItems]')[0];
      }
      else
      {
         selectSrc = formObj.HiddenItems;
         selectDest = formObj.ShownItems;
      }
   }
   else
   {
      if(IsOpenUI() && !formObj.HiddenItems && !formObj.ShownItems)
      {
         selectSrc = $('[name=ShownItems]')[0];
         selectDest = $('[name=HiddenItems]')[0];
      }
      else
      {
         selectSrc = formObj.ShownItems;
         selectDest = formObj.HiddenItems;
      }
   }

   i = 0;
   var NewOpt;
   while (i < selectSrc.length)
   {
      opt = selectSrc.options[i];
      if (opt.selected)
      {
         NewOpt = new Option(opt.text,opt.value);
         NewOpt.selected = 1;
         selectSrc.options[i] = null;
         selectDest.options[selectDest.length] = NewOpt;
      }
      else
         ++i;
   }

   if(IsOpenUI() && SiebelApp.S_App.IsMobileApplication() === "true")
   {
      $(selectSrc).selectmenu('refresh');
      $(selectDest).selectmenu('refresh');
   }
   selectDest.focus();
}

// Move selected item in ShownItems combobox
function MoveShownItem(formObj, tUp, tEnd)
{
   if(IsOpenUI() && !formObj.HiddenItems && !formObj.ShownItems)
   {
      select = $('[name=ShownItems]')[0];
   }
   else
   {
      select = formObj.ShownItems;
   }
   

   cSelected = 0;

   for (i = 0; i < select.length; i++)
   {
      opt = select.options[i];
      if (opt.selected)
      {
         iSelected = i;
         ++cSelected;
      }
   }

   if (1 != cSelected)
      return;

   if (tUp == "1")
   {
      if (iSelected <= 0)
         return;
      if (tEnd == "1")
         iInsert = 0;
      else
         iInsert = iSelected - 1;
		iIncr = -1;
   }
   else
   {
      c = select.length - 1;
      if (iSelected >= c)
         return;
      if (tEnd == "1")
         iInsert = c;
      else
         iInsert = iSelected + 1;
		iIncr = 1;
   }

	// Swap the options up/down
	var szTmpText, szTmpValue;
	var opt1, opt2;
	for (i = iSelected; i != iInsert; i += iIncr)
	{
   	opt1 = select.options[i];
   	opt2 = select.options[i+iIncr];
   	szTmpText = opt1.text;
   	szTmpValue = opt1.value;
   	select.options[i].text = opt2.text;
   	select.options[i].value = opt2.value;
   	select.options[i+iIncr].text = szTmpText;
   	select.options[i+iIncr].value = szTmpValue;
	}

	select.selectedIndex = iInsert;
	if (IsOpenUI()) {
	    //work around added for IE-combo box freeze issue: 19785461 
	    select.options[select.length] = new Option();
	    select.remove(select.length - 1);
	}

    // fix for dev_yzhang_12-FTAD9F
    if (navigator.userAgent.indexOf("Netscape/7.") >= 0) 
		select.options[iSelected].selected = false;
    if(IsOpenUI() && SiebelApp.S_App.IsMobileApplication() === "true")
    {
       $(select).selectmenu('refresh');
    }
}


// Unselect all items in other combobox
function HasFocus(formObj, tHidden)
{
   if (tHidden == "1")
   {
      if(IsOpenUI() && !formObj.HiddenItems && !formObj.ShownItems)
      {
         select = $('[name=ShownItems]')[0];
      }
      else
      {
         select = formObj.ShownItems;
      }
   }
   else
   {
      if(IsOpenUI() && !formObj.HiddenItems && !formObj.ShownItems)
      {
         select = $('[name=HiddenItems]')[0];
      }
      else
      {
         select = formObj.HiddenItems;
      }
   }

   select.selectedIndex = -1;
}

var oldFormObj = null;
function SWERestoreFormObj (formObj)
{
   for (i = 0; i < formObj.elements.length; i++)
      formObj.elements[i].value = oldFormObj[i];
}

function SWESaveFormObj (formObj)
{
   oldFormObj = new Array(formObj.elements.length);
   for (i = 0; i < formObj.elements.length; i++)
      oldFormObj[i] = formObj.elements[i].value;
}

