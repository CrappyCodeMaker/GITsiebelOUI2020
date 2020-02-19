// AUTHOR:	KALAU
// DESCRIPTION:	JavaScript functions for manipulating Proposal or Presentation layout

function SaveTemplate (formObj)
{
	var select = formObj.Layout;
	
	var submit = formObj.SubmitLayout;
	submit.value = '';
	
	var delim = "\t";
	
	for (i = 0; i < select.length; i++)
	{
		opt = select.options[i];
		if (opt.value.length <= 0)
			continue;
		if (submit.value.length > 0)
			submit.value = submit.value + opt.value + delim;
		else
			submit.value = opt.value + delim;
	}
	
	formObj.SWECmd.value = 'InvokeMethod';
	formObj.SWEMethod.value = 'SaveTemplate';
	
    //FR : 12-1B9V685: Set SWENoHttpRedir=true 
    if ((formObj.target != "_blank") && 
		(formObj.target != "_top") && 
		(typeof(formObj.SWENoHttpRedir) != 'undefined')
       )       
         formObj.SWENoHttpRedir.value = "true";
         
	formObj.submit();
}


function AddAllItems (formObj)
{
	selectSrc = formObj.Contents;
	selectDest = formObj.Layout;
	
	selectDest.selectedIndex = -1;
	
	var NewOpt;
	for (i = 0; i < selectSrc.length; i++)
	{
		opt = selectSrc.options[i];
		NewOpt = new Option(opt.text, opt.value);
		NewOpt.selected = 1;
		selectDest.options[selectDest.length] = NewOpt;
	}
	
	selectDest.focus();
}


function AddItem (formObj)
{
	selectSrc = formObj.Contents;
	selectDest = formObj.Layout;
	
	var NewOpt;
	for (i = 0; i < selectSrc.length; i++)
	{
		opt = selectSrc.options[i];
		if (opt.selected)
		{
			NewOpt = new Option(opt.text, opt.value);
			NewOpt.selected = 1;
			selectDest.options[selectDest.length] = NewOpt;
		}
	}
	
	selectDest.focus();
}

function MoveLayout (formObj, tUp, tEnd)
{
	select = formObj.Layout;
	
	var cSelected = 0;
	var iSelected;
	for (i = 0; i < select.length; i++)
	{
		opt = select.options[i];
		if (opt.selected)
		{
			iSelected = i;
			++cSelected;
		}
	}
	
	if (cSelected != 1)
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
}


function HasFocus (formObj, tContents)
{
	if (tContents == "1")
		select = formObj.Layout;
	else
		select = formObj.Contents;
		
	select.selectedIndex = -1;
}


function RemoveItem (formObj)
{
	select = formObj.Layout;
	
	if (select.length == 0)
		return;
		
	if (select.selectedIndex == -1)
		return;
		
	if (!confirm(g_strPromptRemove))
		return;
		
	i = 0;
	while (i < select.length)
	{
		opt = select.options[i];
		if (opt.selected)
			select.options[i] = null;
		else
			++i;
	}
}


function ToggleList (formObj)
{
	var hidden = formObj.HiddenContents.value;
	var contents = "";
	var delim = "\t";
	var tag = "C";
	
	select = formObj.Contents;
	
	i = 0;
	while (i < select.length)
	{
		opt = select.options[i];
		if (contents.length > 0)
			contents = contents + opt.text + delim;
		else
			contents = opt.text + delim;
		select.options[i] = null;
	}
	
	i = 0;
	var NewOpt;
	var optText;
	while ((i = hidden.indexOf(delim)) >= 0)
	{
		optText = hidden.substr(0,i);
		NewOpt = new Option(optText, tag + optText);
		select.options[select.length] = NewOpt;
		hidden = hidden.substr(i+delim.length);
	}
	
	formObj.HiddenContents.value = contents;
}


function ResetLayout (formObj)
{
	var orig = formObj.OriginalLayout.value;
	var delim = "\t";
	var tag = "S";

	select = formObj.Layout;
	
	i = 0;
	while (i < select.length)
	{
		select.options[i] = null;
	}
	
	i = 0;
	var NewOpt;
	var optText;
	while ((i = orig.indexOf(delim)) >= 0)
	{
		optText = orig.substr(0,i);
		NewOpt = new Option(optText, tag + optText);
		select.options[select.length] = NewOpt;
		orig = orig.substr(i+delim.length);
	}
}