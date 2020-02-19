/*****************************************************************************
 *
 * Copyright (C) 2000, Siebel Systems, Inc., All rights reserved.
 *
 * FILE:       propset.js
 *  $Revision: 31 $
 *      $Date: 11/04/01 12:07a $
 *    $Author: Mrfreeze $ of last update
 *
 * CREATOR:    John Coker
 *
 * DESCRIPTION
 *    Property Set class for JavaScript browser tier
 *
 *****************************************************************************/

/*
 * JSSPropertySet
 *
 * childArray
 * childEnum
 * propArray
 * propArrayLen
 * propEnum
 * propEnumArray
 * type
 * value
 * encoded
 * encodeArray
 * encodePos
 * decodePos
 */
/*****************************************************************************
 *
 * Copyright (C) 2000, Siebel Systems, Inc., All rights reserved.
 *
 * FILE:       propset.js
 *  $Revision: 31 $
 *      $Date: 11/04/01 12:07a $
 *    $Author: Mrfreeze $ of last update
 *
 * CREATOR:    John Coker
 *
 * DESCRIPTION
 *    Property Set class for JavaScript browser tier
 *
 *****************************************************************************/

/*
 * JSSPropertySet
 *
 * childArray
 * childEnum
 * propArray
 * propArrayLen
 * propEnum
 * propEnumArray
 * type
 * value
 * encoded
 * encodeArray
 * encodePos
 * decodePos
 */
function gettestdataPS ()
{
   var data;
   data = "azaharPS";
   return data;
}	

function JSSPropertySet ()
{ 
   this.Reset (); 
   this.axObj = null;

}

function JSSPropertySet_AddChild (child)
{
   if (child == null ||
       typeof (child) != "object" ||
       child.constructor != JSSPropertySet)
      return (false);

   if (this.axObj != null)
   {
      this.axObj.AddChild (child.axObj);
      return (true);
   }

   this.childArray[this.childArray.length] = child;

   return (true);
}
function JSSPropertySet_DeepCopy ( inputPS )
{
   var  i;
   var  name;
   var  value;
   var  oldPS; 
   var  newPS;
   if( inputPS instanceof JSSPropertySet ){
       
       name = inputPS.GetType ();
       if (name != null && name != "")
          this.SetType (name);

       value = inputPS.GetValue ();
       if (value != null && value != "")
          this.SetValue (value);

       for (name in inputPS.propArray)
       {
           if (inputPS.propArray.hasOwnProperty(name) ) 
           {
           this.SetPropertyStr (name, inputPS.propArray[name]);
           }
        }
           

       for (i = 0; i < inputPS.childArray.length; i++)
       {
          oldPS = inputPS.childArray[i];
          if (oldPS == null)
             break;

          newPS = oldPS.Clone();
          this.AddChild (newPS);
       }
       return true;       
   }
   return false;
}

function JSSPropertySet_Clone ()
{
   var  i;
   var  name;
   var  value;

   var  dup = new JSSPropertySet ();

   name = this.GetType ();
   if (name != null && name != "")
      dup.SetType (name);

   value = this.GetValue ();
   if (value != null && value != "")
      dup.SetValue (value);

   for (name in this.propArray)
   {
       if (this.propArray.hasOwnProperty(name)) 
       {
      dup.SetPropertyStr (name, this.propArray[name]);
       }
    }
      

   for (i = 0; i < this.childArray.length; i++)
   {
      oldChild = this.childArray[i];
      if (oldChild == null)
         break;

      newChild = oldChild.Clone();
      dup.AddChild (newChild);
   }

   return (dup);
}

function JSSPropertySet_Copy (old)
{
   var  i;
   var  oldChild;
   var  name;

   if (this.axObj != null)
   {     
      if (old == null)
         return (false);

      this.axObj.Copy (old.axObj); // this should return a value
      return (true);
   }

   this.Reset ();

   if (old == null)
      return (false);

   name = old.GetType ();
   if (name != null && name != "")
      this.SetType (name);

   value = old.GetValue ();
   if (value != null && value != "")
      this.SetValue (value);

   for (name in old.propArray)
   {
       if (old.propArray.hasOwnProperty(name)) 
       {
      this.SetPropertyStr (name, old.propArray[name]);
       }
   }
  

   for (i = 0; i < old.childArray.length; i++)
   {
      oldChild = old.childArray[i];
      if (oldChild == null)
         break;

      newChild = new JSSPropertySet ();
      newChild.Copy (oldChild);

      this.AddChild (newChild);
   }

   return (true);
}

function JSSPropertySet_EnumChildren (first)
{
   if (this.axObj != null)
   {
      var ps = null;
      var axPs = this.axObj.EnumChildren (first);
      if (axPs != null)
      {
         ps = new JSSPropertySet (true);
         ps.axObj = axPs;
         this.axObj.jsObj = this;
      }
      
      return (ps);
   }

   if (first)
      this.childEnum = 0;

   if (this.childEnum >= this.childArray.length)
      return (null);

   return (this.childArray[this.childEnum++]);
}

function JSSPropertySet_EnumProperties (first)
{
   if (this.axObj != null)
      return (this.axObj.EnumProperties (first));

   if (first)
   {
      this.propEnumArray = new Array;

      for (next in this.propArray)
      {
          if (this.propArray.hasOwnProperty(next)) 
          {
         this.propEnumArray[this.propEnumArray.length] = next;
          }
      }
      

      this.propEnum = 0;
   }

   if (this.propEnumArray == null ||
       this.propEnum >= this.propEnumArray.length)
      return (null);

   return (this.propEnumArray[this.propEnum++]);
}

function JSSPropertySet_GetPropertiesSize ()
{
   if (this.axObj != null)
      return (this.axObj.GetPropertiesSize());

   var propName;
   var size = 0;

   for (propName in this.propArray)
   {
       if (this.propArray.hasOwnProperty(propName)) 
       {
      size += this.propArray[propName].length;
   }
   }

   return (size);
}

function JSSPropertySet_GetChild (index)
{
   if (this.axObj != null)
   {
      var ps = null;
      var axPs = this.axObj.GetChild (index);
      if (axPs != null)
      {
         ps = new JSSPropertySet (true);
         ps.axObj = axPs;
         this.axObj.jsObj = this;
      }
      
      return (ps);
   }

   var  at;

   at = parseInt (index);
   if (isNaN(at) || at < 0 || at >= this.childArray.length)
      return (null);

   return (this.childArray[at]);
}

function JSSPropertySet_GetChildByType (type , isChildren )
{
   if (this.axObj != null)
   {
      var ps = null;
      var axPs = this.axObj.GetChildByType (type);
      if (axPs != null)
      {
         ps = new JSSPropertySet (true);
         ps.axObj = axPs;
         this.axObj.jsObj = this;
      }
      
      return (ps);
   }

   var  child;
   var  i;
   
   if(isChildren){
       var childrenProp = new JSSPropertySet ();
       var arrLen       = this.childArray.length;
       for (i = 0; i < arrLen ; i++)
       {
          child = this.childArray[i];
          if (child.type === type){
              childrenProp.AddChild (child);
          }              
       }
       return (childrenProp);
   }

   for (i = 0; i < this.childArray.length; i++)
   {
      child = this.childArray[i];
      if (child.type == type)
         return (child);
   }

   return (null);
}

function JSSPropertySet_FindChildPosition (type)
{
   var  child;
   var  i;

   for (i = 0; i < this.childArray.length; i++)
   {
      child = this.childArray[i];
      if (child.type == type)
         return i;
   }

   return -1;
}

function JSSPropertySet_GetChildCount ()
{
   if (this.axObj != null)
      return (this.axObj.GetChildCount ());
   return (this.childArray.length);
}

function JSSPropertySet_GetFirstProperty ()
{
   return (this.EnumProperties(true));
}

function JSSPropertySet_GetNextProperty ()
{
   return (this.EnumProperties(false));
}

function JSSPropertySet_GetPropertyAsStr (name)
{

   var prop;

   if (this.axObj != null)
      return (this.axObj.GetProperty (name));

   if (name == null || name == "" )
      return ("");

   prop = this.GetProperty(name);
   if (prop == null) return ("");

   return (prop.toString());
}

function JSSPropertySet_GetProperty (name)
{
   if (this.axObj != null)
      return (this.axObj.GetProperty (name));

   if (name == null || name == "")
      return ("");

   return (this.propArray[name]);
}

function JSSPropertySet_GetPropertyCount ()
{
   if (this.axObj != null)
      return (this.axObj.GetPropertyCount ());
   return (this.propArrayLen);
}

function JSSPropertySet_GetQueryString ()
{
   if (this.axObj != null)
      return (this.axObj.GetQueryString ());
   else
      return (null);
}

function JSSPropertySet_GetType ()
{
   if (this.axObj != null)
      return (this.axObj.GetType ());
   return (this.type);
}

function JSSPropertySet_GetValue ()
{
   if (this.axObj != null)
      return (this.axObj.GetValue ());
   return (this.value);
}

function JSSPropertySet_InsertChildAt (child, index)
{
   if (this.axObj != null)
      return (this.axObj.InsertChildAt (child.axObj, index));

   var  at;
   var  i;

   if (child == null ||
       typeof (child) != "object" ||
       child.constructor != JSSPropertySet)
      return (false);

   at = parseInt (index);
   if (isNaN(at) || at < 0)
      return (false);

   if (at >= this.childArray.length)
   {
      // just add to end
      this.childArray[this.childArray.length] = child;
   }
   else
   {
      for (i = this.childArray.length; i > at; i--)
         this.childArray[i] = this.childArray[i - 1];
   
      this.childArray[at] = child;
   }

   return (true);
}

function JSSPropertySet_PropertyExists (name)
{
   if (this.axObj != null)
      return (this.axObj.PropertyExists (name));

   if (name == null || name == "")
      return (false);

   return ((this.propArray[name]) != null);
}

function JSSPropertySet_RemoveChild (index)
{
   if (this.axObj != null)
      return (this.axObj.RemoveChild (index));

   var  at;
   var  i;

   at = parseInt (index);
   if (isNaN(at) || at < 0 || at >= this.childArray.length)
      return (false);

   for (i = at; i < this.childArray.length - 1; i++)
      this.childArray[i] = this.childArray[i + 1];

   this.childArray[this.childArray.length - 1] = null;

   this.childArray.length = this.childArray.length - 1;

   return (true);
}

function JSSPropertySet_RemoveProperty (name)
{
   if (this.axObj != null)
      return (this.axObj.RemoveProperty (name));

   if (name == null || name == "")
      return;

   if (this.propArray[name] == null)
      return;

   this.propArray[name] = null;
   this.propArrayLen--;
}

function JSSPropertySet_Reset ()
{
   if (this.axObj != null)
   {  
      this.axObj.Reset ();
      return;
   }

   this.childArray    = new Array;
   this.childEnum     = 0;

   this.propArray     = new Array;
   this.propArrayLen  = 0;
   if (this.propEnum != null)       // perf
      this.propEnum   = 0;
   if (this.propEnumArray != null)
      this.propEnumArray = null;
   this.type          = "";
   this.value         = "";
}

function JSSPropertySet_SetProperty (name, value)
{
   if (this.axObj != null)
      return (this.axObj.SetProperty (name, value));

   if (name == null || name == "")
      return (false);

   return this.SetPropertyStr (name, "" + value);
}

function JSSPropertySet_SetPropertyStr (name, value)
{
   if (this.propArray[name] == null)
      this.propArrayLen++;

   this.propArray[name] = value;

   return (true);
}

function JSSPropertySet_SetType (type)
{
   if (this.axObj != null)
      return (this.axObj.SetType (type));

   this.type = type;

   return (true);
}

function JSSPropertySet_SetValue (value)
{
   if (this.axObj != null)
      return (this.axObj.SetValue (value));

   this.value = value;

   return (true);
}

function JSSPropertySet_GetAxObj ()
{
   return (this.axObj);
}

// encoding/decoding methods

function JSSPropertySet_DecodeFromStringOld (encodedValue)
{
   var  formatPrefix;
   var  iFormatPrefix;

   this.Reset ();
 
   if (encodedValue == null || encodedValue == "")
      return (true);

   formatPrefix = encodedValue.charAt(0);

   if (formatPrefix != '@')
   {
      //Temperarily put the encodeValue here to trace down all the cases
      //that make this happen
      alert ("Invalid encoding of property set " + encodedValue);  
    
      //alert ("Invalid encoding of property set");
      return (false);
   }

   // set the encoded value and current position to local vars
   this.encoded   = encodedValue;
   this.decodePos = 1;

   // read the header
   if (!this.ReadHeader () ||
       !this.ReadPropertySet (this))
   {
      this.Reset ();
      alert ("Invalid encoded property set string");
      return (false);
   }

   // clear out the encoding vars
   this.encoded   = null;
   this.decodePos = null;

   return (true);
}

function JSSPropertySet_EncodeAsStringOld ()
{
   var retval;

   this.encodeArray    = new Array ();
   this.encodeArray[0] = '@';

   if (!this.WriteHeader () ||
       !this.WritePropertySet (this))
   {
      assert ("Unable to encode property set");
      retval = null;
   }
   else
   {
      retval = this.encodeArray.join ("");
   }

   this.encodeArray = null;

   return (retval);
}

function JSSPropertySet_ReadHeader ()
{
   var  value;

   // expect version 0
   value = this.ReadInteger ();
   if (value != 0)
      return (false); 

   // ignore endianess
   if (this.ReadInteger () == null)
      return (false);   

   return (true);
}

function JSSPropertySet_ReadInteger ()
{
   var  star;
   var  value;

   if (this.decodePos >= this.encoded.length)
      return (null);

   star = this.encoded.indexOf ('*', this.decodePos);
   if (star <= 0)
      return (null);
      
   value = parseInt (this.encoded.substr (this.decodePos, star - this.decodePos));
   if (isNaN(value))
      return (null);
   
   this.decodePos = star + 1;

   return (value);
}

function JSSPropertySet_ReadPropertySet (propSet)
{
   var  nProperties;
   var  nChildren;
   var  newPropSet;
   var  decodePos;
   var  length;
   var  star;
   var  strlen;
   var  i;
   var  k;
   var  v;

   nProperties = this.ReadInteger ();
   if (nProperties == null)
      return (false);

   nChildren = this.ReadInteger ();
   if (nChildren == null)
      return (false);

   v = this.ReadString ();
   if (v == null)
      return (false);

   if (!this.ReadValueVariant (propSet))
      return (false);

   propSet.SetType (v);

   decodePos = this.decodePos;
   length    = this.encoded.length;
   for (i = 0; i < nProperties; i++)
   {
      /*
      k = this.ReadString ();
      if (k == null)
         return (false);

      v = this.ReadString ();
      if (v == null)
         return (false);
      */

      // read key length
      if (decodePos >= length)
         return (false);
      star = this.encoded.indexOf ('*', decodePos);
      if (star <= 0)
         return (false);
      strlen = parseInt (this.encoded.substr (decodePos, star - decodePos));
      if (isNaN(strlen))
         return (false);
      decodePos = star + 1;

      // read key string
      if (strlen > 0)
      {
         k = this.encoded.substr (decodePos, strlen);
         decodePos += strlen;
      }
      else
         k = "";

      // read value length
      if (decodePos >= length)
         return (false);
      star = this.encoded.indexOf ('*', decodePos);
      if (star <= 0)
         return (false);
      strlen = parseInt (this.encoded.substr (decodePos, star - decodePos));
      if (isNaN(strlen))
         return (false);
      decodePos = star + 1;

      // read value string
      if (strlen > 0)
      {
         v = this.encoded.substr (decodePos, strlen);
         decodePos += strlen;
      }
      else
         v = "";

/*
      propSet.SetPropertyStr (k, v);
*/
      // set the property
      if (propSet.propArray[k] == null)
         propSet.propArrayLen++;

      propSet.propArray[k] = v;
   }
   this.decodePos = decodePos;

   for (i = 0; i < nChildren; i++)
   {
      newPropSet = new JSSPropertySet ();
      propSet.AddChild (newPropSet);

      if (!this.ReadPropertySet (newPropSet))
         return (false);
   }

   return (true);
}

function JSSPropertySet_ReadString ()
{
   var  cLen;
   var  str;

   cLen = this.ReadInteger ();
   if (cLen == null || cLen < 0)
      return (null);

   if (cLen == 0)
      return ("");

   str = this.encoded.substr (this.decodePos, cLen);
   this.decodePos += cLen;

   return (str);
}

function JSSPropertySet_ReadValueVariant (propSet)
{
   var nType;

   nType = this.ReadInteger ();

   if (nType == 3 || nType == 6)
      propSet.value = this.ReadString ();
   else if (nType == 0)
      propSet.value = "";
   else if (nType == 1)
      propSet.value = this.ReadInteger ().toString ();
   else
   {
      alert ("Unsupported property set value type: " + nType);
      return (false);
   }

   return (true);
}



function JSSPropertySet_WriteHeader ()
{
   // version 0
   this.WriteInteger (0);

   // endianness
   this.WriteInteger (0);

   return (true);
}

function JSSPropertySet_WriteInteger (value)
{
   this.encodeArray[this.encodeArray.length] = value.toString () + '*';
}

function JSSPropertySet_WritePropertySet (propSet)
{
   var  childPropSet;
   var  i;
   var  nChildren;
   var  nProperties;
   var  prop;

   nProperties = propSet.GetPropertyCount ();
   nChildren = propSet.GetChildCount ();

   this.WriteInteger (nProperties);
   this.WriteInteger (nChildren);
   this.WriteString (propSet.GetType ());
   if (!this.WriteValueVariant (propSet))
      return (false);

   for (prop in propSet.propArray)
   {
       if (propSet.propArray.hasOwnProperty(prop)) 
       {
      this.WriteString (prop);
      this.WriteString (propSet.propArray[prop]);
   }
   }

   for (i = 0; i < nChildren; i++)
   {
      childPropSet = propSet.GetChild (i);
      if (!this.WritePropertySet (childPropSet))
         return (false);
   }

   return (true);
}

function JSSPropertySet_WriteString (str)
{
   if (str == null)
      str = "";

   this.WriteInteger (str.length);

   if (str.length > 0)
      this.encodeArray[this.encodeArray.length] = str;
}

function JSSPropertySet_WriteValueVariant (propSet)
{
   this.WriteInteger (3);   // string type

   this.WriteString (propSet.value);

   return (true);
}

function JSSPropertySet_DecodeFromString (encodedValue)
{
   if (this.axObj != null)
   {
      this.axObj.DecodeFromString (encodedValue);
      return (true);
   }

   var  formatPrefix;
   var  separator;
   var  iFormatPrefix;

   this.Reset ();
 
   if (encodedValue == null || encodedValue == "")
      return (true);

   formatPrefix = encodedValue.charAt(0);

   if (formatPrefix != '@')
   {
      // old, unsupported format
      alert ("Invalid encoding of property set " + encodedValue);  
      return (false);
   }

   separator = encodedValue.charAt(2);

   if (separator == '*')
      return this.DecodeFromStringOld (encodedValue);

   this.arr = encodedValue.split(separator);
   this.arr[0] = this.arr[0].substr(1);

   // set the encoded value and current position to local vars
   this.arrPos = 0;

   // read the header
   if (!this.ReadHeader2 () ||
       !this.ReadPropertySet2 (this))
   {
      this.arr    = null;
      this.Reset ();
      alert ("Invalid encoded property set string");
      return (false);
   }

   // clear out the encoding vars
   this.arr    = null;
   this.arrPos = 0;

   return (true);
}

function JSSPropertySet_EncodeAsString ()
{
   if (this.axObj != null)
      return (this.axObj.EncodeAsString ());

   var retval;

   this.encodeArray    = new Array ();
   this.strArray    = new Array ();

   if (!this.WriteHeader2 () ||
       !this.WritePropertySet2 (this))
   {
      assert ("Unable to encode property set");
      retval = null;
   }
   else
   {
      var datastrs = this.strArray.join("");
      var i;
      var sepChars = "`^~[";

      for (i = 0; i < sepChars.length; i++)
      {
         if (datastrs.indexOf(sepChars.charAt(i)) < 0)
            break;
      }

      if (i == sepChars.length)
         retval = null;
      else
      {
         this.encodeArray[0] = '@' + this.encodeArray[0];
         this.encodeArray[this.encodeArray.length] = "";
         retval = this.encodeArray.join (sepChars.charAt(i));
      }
   }

   this.encodeArray = null;
   this.strArray = null;

   if (retval == null)
      return this.EncodeAsStringOld ();     // try old format

   return (retval);
}

function JSSPropertySet_ReadHeader2 ()
{
   var  value;

   // expect version 0
   value = this.ReadInteger2 ();
   if (value != 0)
      return (false); 

   // ignore endianess
   if (this.ReadInteger2 () == null)
      return (false);   

   return (true);
}

function JSSPropertySet_ReadInteger2 ()
{
   if (this.arrPos >= this.arr.length)
      return (null);

   value = parseInt (this.arr[this.arrPos++]);
   if (value == NaN)
      return (null);
   
   return (value);
}

function JSSPropertySet_ReadPropertySet2 (propSet)
{
   var  nProperties;
   var  nChildren;
   var  newPropSet;
   var  i;
   var  k;
   var  v;

   nProperties = this.ReadInteger2 ();
   if (nProperties == null)
      return (false);

   nChildren = this.ReadInteger2 ();
   if (nChildren == null)
      return (false);

   v = this.ReadString2 ();
   if (v == null)
      return (false);

   if (!this.ReadValueVariant2 (propSet))
      return (false);

   propSet.SetType (v);

   for (i = 0; i < nProperties; i++)
   {
      k = this.arr[this.arrPos++];
      if (k == null)
         return (false);

      v = this.arr[this.arrPos++];
      if (v == null)
         return (false);

      // set the property
      if (propSet.propArray[k] == null)
         propSet.propArrayLen++;

      propSet.propArray[k] = v;
   }

   for (i = 0; i < nChildren; i++)
   {
      newPropSet = new JSSPropertySet ();
      propSet.AddChild (newPropSet);

      if (!this.ReadPropertySet2 (newPropSet))
         return (false);
   }

   return (true);
}

function JSSPropertySet_ReadString2 ()
{
   if (this.arrPos >= this.arr.length)
      return (null);

   return (this.arr[this.arrPos++]);
}

function JSSPropertySet_ReadValueVariant2 (propSet)
{
   var nType;

   nType = this.ReadInteger2 ();

   if (nType == 3 || nType == 6)
      propSet.value = this.ReadString2 ();
   else if (nType == 0)
      propSet.value = "";
   else if (nType == 1)
      propSet.value = this.ReadInteger2 ().toString ();
   else
   {
      alert ("Unsupported property set value type: " + nType);
      return (false);
   }

   return (true);
}



function JSSPropertySet_WriteHeader2 ()
{
   // version 0
   this.WriteInteger2 (0);

   // endianness
   this.WriteInteger2 (0);

   return (true);
}

function JSSPropertySet_WriteInteger2 (value)
{
   this.encodeArray[this.encodeArray.length] = value;
}

function JSSPropertySet_WritePropertySet2 (propSet)
{
   var  childPropSet;
   var  i;
   var  nChildren;
   var  nProperties;
   var  prop;

   nProperties = propSet.GetPropertyCount ();
   nChildren = propSet.GetChildCount ();

   this.WriteInteger2 (nProperties);
   this.WriteInteger2 (nChildren);
   this.WriteString2safe (propSet.GetType ());

   if (!this.WriteValueVariant2 (propSet))
      return (false);

   for (prop in propSet.propArray)
   {
       if (propSet.propArray.hasOwnProperty(prop)) 
       {
      this.WriteString2safe (prop);
      if (!this.WriteString2 (propSet.propArray[prop]))
         return (false);
       }
   }

   for (i = 0; i < nChildren; i++)
   {
      childPropSet = propSet.GetChild (i);
      if (!this.WritePropertySet2 (childPropSet))
         return (false);
   }

   return (true);
}

function JSSPropertySet_WriteString2safe (str)
{
   if (str == null)
      str = "";

   this.encodeArray[this.encodeArray.length] = str;
}

function JSSPropertySet_WriteString2 (str)
{
   if (str == null)
      str = "";
   else if (str != "")
      this.strArray[this.strArray.length] = str;

   this.encodeArray[this.encodeArray.length] = str;

   return (true);
}

function JSSPropertySet_WriteValueVariant2 (propSet)
{
   this.WriteInteger2 (3);   // string type

   if (!this.WriteString2 (propSet.value))
      return (false);

   return (true);
}

function JSSPropertySet_IsEmpty (propSet)
{
   if (this.GetChildCount() <= 0 && this.GetPropertyCount() <= 0)
      return true;
   return false;
}

JSSPropertySet.prototype.DeepCopy         = JSSPropertySet_DeepCopy;
JSSPropertySet.prototype.AddChild         = JSSPropertySet_AddChild;
JSSPropertySet.prototype.Clone            = JSSPropertySet_Clone
JSSPropertySet.prototype.Copy             = JSSPropertySet_Copy;
JSSPropertySet.prototype.DecodeFromString = JSSPropertySet_DecodeFromString;
JSSPropertySet.prototype.EncodeAsString   = JSSPropertySet_EncodeAsString;
JSSPropertySet.prototype.EnumChildren     = JSSPropertySet_EnumChildren;
JSSPropertySet.prototype.EnumProperties   = JSSPropertySet_EnumProperties;
JSSPropertySet.prototype.GetChild         = JSSPropertySet_GetChild;
JSSPropertySet.prototype.GetChildByType   = JSSPropertySet_GetChildByType;
JSSPropertySet.prototype.FindChildPosition = JSSPropertySet_FindChildPosition;
JSSPropertySet.prototype.GetChildCount    = JSSPropertySet_GetChildCount;
JSSPropertySet.prototype.GetProperty      = JSSPropertySet_GetProperty;
JSSPropertySet.prototype.GetPropertyAsStr = JSSPropertySet_GetPropertyAsStr;
JSSPropertySet.prototype.GetFirstProperty = JSSPropertySet_GetFirstProperty;
JSSPropertySet.prototype.GetNextProperty  = JSSPropertySet_GetNextProperty;
JSSPropertySet.prototype.GetPropertyCount = JSSPropertySet_GetPropertyCount;
JSSPropertySet.prototype.GetQueryString   = JSSPropertySet_GetQueryString;
JSSPropertySet.prototype.GetType          = JSSPropertySet_GetType;
JSSPropertySet.prototype.GetValue         = JSSPropertySet_GetValue;
JSSPropertySet.prototype.InsertChildAt    = JSSPropertySet_InsertChildAt;
JSSPropertySet.prototype.IsEmpty          = JSSPropertySet_IsEmpty;
JSSPropertySet.prototype.PropertyExists   = JSSPropertySet_PropertyExists;
JSSPropertySet.prototype.RemoveChild      = JSSPropertySet_RemoveChild;
JSSPropertySet.prototype.RemoveProperty   = JSSPropertySet_RemoveProperty;
JSSPropertySet.prototype.Reset            = JSSPropertySet_Reset;
JSSPropertySet.prototype.SetProperty      = JSSPropertySet_SetProperty;
JSSPropertySet.prototype.SetPropertyStr   = JSSPropertySet_SetPropertyStr;
JSSPropertySet.prototype.SetType          = JSSPropertySet_SetType;
JSSPropertySet.prototype.SetValue         = JSSPropertySet_SetValue;
JSSPropertySet.prototype.GetAxObj         = JSSPropertySet_GetAxObj;
JSSPropertySet.prototype.GetPropertiesSize= JSSPropertySet_GetPropertiesSize;

// internal encoding/decoding methods (would be private)
JSSPropertySet.prototype.DecodeFromStringOld  = JSSPropertySet_DecodeFromStringOld;
JSSPropertySet.prototype.EncodeAsStringOld    = JSSPropertySet_EncodeAsStringOld;
JSSPropertySet.prototype.ReadHeader        = JSSPropertySet_ReadHeader;
JSSPropertySet.prototype.ReadInteger       = JSSPropertySet_ReadInteger;
JSSPropertySet.prototype.ReadPropertySet   = JSSPropertySet_ReadPropertySet;
JSSPropertySet.prototype.ReadString        = JSSPropertySet_ReadString;
JSSPropertySet.prototype.ReadValueVariant  = JSSPropertySet_ReadValueVariant;
JSSPropertySet.prototype.WriteHeader       = JSSPropertySet_WriteHeader;
JSSPropertySet.prototype.WriteInteger      = JSSPropertySet_WriteInteger;
JSSPropertySet.prototype.WritePropertySet  = JSSPropertySet_WritePropertySet;
JSSPropertySet.prototype.WriteString       = JSSPropertySet_WriteString;
JSSPropertySet.prototype.WriteValueVariant = JSSPropertySet_WriteValueVariant;
JSSPropertySet.prototype.ReadHeader2        = JSSPropertySet_ReadHeader2;
JSSPropertySet.prototype.ReadInteger2       = JSSPropertySet_ReadInteger2;
JSSPropertySet.prototype.ReadPropertySet2   = JSSPropertySet_ReadPropertySet2;
JSSPropertySet.prototype.ReadString2        = JSSPropertySet_ReadString2;
JSSPropertySet.prototype.ReadValueVariant2  = JSSPropertySet_ReadValueVariant2;
JSSPropertySet.prototype.WriteHeader2       = JSSPropertySet_WriteHeader2;
JSSPropertySet.prototype.WriteInteger2      = JSSPropertySet_WriteInteger2;
JSSPropertySet.prototype.WritePropertySet2  = JSSPropertySet_WritePropertySet2;
JSSPropertySet.prototype.WriteString2       = JSSPropertySet_WriteString2;
JSSPropertySet.prototype.WriteString2safe   = JSSPropertySet_WriteString2safe;
JSSPropertySet.prototype.WriteValueVariant2 = JSSPropertySet_WriteValueVariant2;


function CCFMiscUtil_ArrayToString (arr)
{
   var       i;
   var       encoded = "";
   var       str;

   for (i = 0; i < arr.length; i++)
   {
      str = arr[i];

      if (str == null || str == "")
         encoded += "0*";
      else
         encoded += str.length + '*' + str;
   }

   return (encoded);
}

function CCFMiscUtil_StringToArray (str, arr)
{
   var      i;
   var      len;
   var      next;
   var      star;

   if (arr == null || arr.length > 0)
      return (false);

   if (str == null || str == "")
      return (true);

   next   = 0;
   i      = 0;
   while (next < str.length)
   {
      star = str.indexOf ('*', next);
      if (star <= 0)
         return (false);

      len    = parseInt (str.substr (next, star - next));
      if (isNaN(len))
         return (false);

      if (len <= 0)
      {
         arr[i++] = "";
         next = star + 1;
      }
      else
      {
         arr[i++] = str.substr (star + 1, len);
         next = star + 1 + len;
      }
   }

   return (true);
}

function CCFMiscUtil_PropArrayGetVal (arr, prop)
{
   var i;

   if (arr.length >= 2)
   {
      for (i = 0; i < arr.length; i += 2)
      {
         if (arr[i] == prop)
            return (arr[i+1]);
      }
   }

   return "";
}

function CCFMiscUtil_PropArraySetVal (arr, prop, val)
{
   var i = 0;

   if (arr.length >= 2)
   {
      for (; i < arr.length; i += 2)
      {
         if (arr[i] == prop)
         {
            arr[i+1] = val;
            return;
         }
      }
   }

   arr[i] = prop;
   arr[i+1] = val;
}

function CCFMiscUtil_CreatePropSet ()
{
/*   if (typeof (top._swe._sweapp.S_ClientOM) != "undefined" &&
       top._swe._sweapp.S_ClientOM != null)
      return top._swe._sweapp.S_ClientOM.NewPropertySet();
   else*/
   
   return new JSSPropertySet ();
}

function gettestdataPS ()
{
   var data;
   data = "azaharTempPS1";
   return data;
}	

