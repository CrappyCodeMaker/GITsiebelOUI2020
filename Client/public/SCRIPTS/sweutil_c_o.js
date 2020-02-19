// The following functions are used to add options dynamically to the selections
//    function setDefaultByText(list, text_in)
//    function setDefaultByValue(list, value_in)
//    function c_o (id, optionNames, optionValues, selectedValue) 

function addElement(list, text_in, value_in)
{
   var o = list.options;
   var nIdx;
	if (o.length < 0) //IE for Mac 4.5 sets length to -1 if list is empty
		nIdx = 0;
	else
		nIdx = o.length;
		
	o[nIdx] = new Option(text_in, value_in);
	list.disabled = false;
}

function setDefaultByText(list, text_in)
{
   with (list)
   {
      for (var i = 0; i < (options.length); i++)
      {
         if (options[i].text == text_in)
         {
            selectedIndex = i;
            options.selectIndexOrigin = i;
            return;
         }
      }
   }
}

function setDefaultByValue(list, value_in)
{
   with (list)
   {
      for (var i = 0; i < (options.length); i++)
      {
         if (options[i].value == value_in)
         {
            selectedIndex = i;
            options.selectIndexOrigin = i;
            return;
         }
      }
   }
}

function c_o (id, optionNames, optionValues, selectedValue) 
{
   var size;
	if (optionValues.length != optionNames.length)
	{
      SWEAlert ("error found in writting options");
   }
	if (optionValues.length > optionNames.length)
	{
		size = optionNames.length;
	}
	else
	{
		size = optionValues.length;
	}
   
	var list = document.getElementById(id);
   for (var i = 0; i < size; i++) 
	{
      addElement (list,optionValues[i], optionNames[i]);
   }
	setDefaultByValue(list, selectedValue);
}