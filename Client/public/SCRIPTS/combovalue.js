// AUTHOR:        GSHEN
// DESCRIPTION:   SWE javascript functions for manipulating a combo box selections
//                for Apply Target List Applet (a popup applet)

// Save selections in ComboBox (Queries) into a string (ComboValues)
function SaveComboSelectedValuesToString(formObj)
{
   select = formObj.Queries;

   if (0 == select.length)
   {
      return;
   }

   ComboString = formObj.ComboValues;
   ComboString.value = '';
   
   for (i = 0; i < select.length; i++)
   {
      opt = select.options[i];
      if (opt.selected == false)
         continue;

      if (ComboString.value.length > 0)
         ComboString.value = ComboString.value + ',' + opt.value;
      else
         ComboString.value = opt.value;
   }

}

function OnButtonIntersection(formObj)
{
   SaveComboSelectedValuesToString(formObj);

   SWESaveFormObj (formObj);

   formObj.SWECmd.value = 'InvokeMethod';
   formObj.SWEMethod.value = 'Intersection';
   formObj.submit();

   SWERestoreFormObj (formObj);

}

function OnButtonUnion(formObj)
{
   SaveComboSelectedValuesToString(formObj);

   SWESaveFormObj (formObj);

   formObj.SWECmd.value = 'InvokeMethod';
   formObj.SWEMethod.value = 'Union';
   formObj.submit();

   SWERestoreFormObj (formObj);

}

function OnButtonOk(formObj)
{
   SaveComboSelectedValuesToString(formObj);

   SWESaveFormObj (formObj);

   formObj.SWECmd.value = 'InvokeMethod';
   formObj.SWEMethod.value = 'OnOk';
   formObj.submit();

   SWERestoreFormObj (formObj);

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
