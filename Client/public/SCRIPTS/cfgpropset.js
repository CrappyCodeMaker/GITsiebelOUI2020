/*****************************************************************************
 *
 * Copyright (C) 2000, Siebel Systems, Inc., All rights reserved.
 *
 * FILE:       cfgpropset.js
 *  $Revision: 31 $
 *      $Date: 11/04/01 12:07a $
 *    $Author: Mrfreeze $ of last update
 *
 * CREATOR:    standrio
 *
 * DESCRIPTION
 *    Property Set class for Configurator
 *
 *****************************************************************************/
 
/*
 * JSSCfgPropertySet
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

function JSSCfgPropertySet ()
{ 
   this.Reset (); 
}

function JSSCfgPropertySet_AddChild (child)
{
   if (child == null ||
       typeof (child) != "object" ||
       child.constructor != JSSCfgPropertySet)
      return (false);

   this.childArray[this.childArray.length] = child;

   return (true);
}

function JSSCfgPropertySet_Clone ()
{
   var  i;
   var  name;
   var  value;

   var  dup = new JSSCfgPropertySet ();

   name = this.GetType ();
   if (name != null && name != "")
      dup.SetType (name);

   value = this.GetValue ();
   if (value != null && value != "")
      dup.SetValue (value);

   for (name in this.propArray)
      dup.SetPropertyStr (name, this.propArray[name]);

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

function JSSCfgPropertySet_Copy (old)
{
   var  i;
   var  oldChild;
   var  name;

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
      this.SetPropertyStr (name, old.propArray[name]);

   for (i = 0; i < old.childArray.length; i++)
   {
      oldChild = old.childArray[i];
      if (oldChild == null)
         break;

      newChild = new JSSCfgPropertySet ();
      newChild.Copy (oldChild);

      this.AddChild (newChild);
   }

   return (true);
}

function JSSCfgPropertySet_EnumChildren (first)
{
   if (first)
      this.childEnum = 0;

   if (this.childEnum >= this.childArray.length)
      return (null);

   return (this.childArray[this.childEnum++]);
}

function JSSCfgPropertySet_EnumProperties (first)
{
   if (first)
   {
      this.propEnumArray = new Array;

      for (next in this.propArray)
         this.propEnumArray[this.propEnumArray.length] = next;

      this.propEnum = 0;
   }

   if (this.propEnumArray == null ||
       this.propEnum >= this.propEnumArray.length)
      return (null);

   return (this.propEnumArray[this.propEnum++]);
}

function JSSCfgPropertySet_GetPropertiesSize ()
{
   var propName;
   var size = 0;

   for (propName in this.propArray)
   {
      size += this.propArray[propName].length;
   }

   return (size);
}

function JSSCfgPropertySet_GetChild (index)
{
   var  at;

   at = parseInt (index);
   if (isNaN(at) || at < 0 || at >= this.childArray.length)
      return (null);

   return (this.childArray[at]);
}

function JSSCfgPropertySet_GetChildByType (type)
{
   var  child;
   var  i;
   var  length = this.childArray.length;

   for (i = 0; i < length; i++)
   {
      child = this.childArray[i];
      if (child.type == type)
      {
         return (child);
      }
   }

   return (null);
}

function JSSCfgPropertySet_GetChildIndexByType (type)
{
   var  child;
   var  i;
   var  length = this.childArray.length;   

   for (i = 0; i < length; i++)
   {
      child = this.childArray[i];
      if (child.type == type)
      {
         return (i);
      }
   }

   return (-1);
}

function JSSCfgPropertySet_GetChildCount ()
{
   return (this.childArray.length);
}

function JSSCfgPropertySet_GetFirstProperty ()
{
   return (this.EnumProperties(true));
}

function JSSCfgPropertySet_GetNextProperty ()
{
   return (this.EnumProperties(false));
}

function JSSCfgPropertySet_GetPropertyAsStr (name)
{
   if (name == null || name == "" || this.propArray[name] == null)
      return ("");

   return (this.propArray[name].toString());
}

function JSSCfgPropertySet_GetProperty (name)
{
   if (name == null || name == "")
      return ("");

   return (this.propArray[name]);
}

function JSSCfgPropertySet_GetPropertyCount ()
{
   return (this.propArrayLen);
}

function JSSCfgPropertySet_GetQueryString ()
{
   return (null);
}

function JSSCfgPropertySet_GetType ()
{
   return (this.type);
}

function JSSCfgPropertySet_GetValue ()
{
   return (this.value);
}

function JSSCfgPropertySet_InsertChildAt (child, index)
{
   var  at;
   var  i;

   if (child == null ||
       typeof (child) != "object" ||
       child.constructor != JSSCfgPropertySet)
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

function JSSCfgPropertySet_PropertyExists (name)
{
   if (name == null || name == "")
      return (false);

   return ((this.propArray[name]) != null);
}

function JSSCfgPropertySet_RemoveChild (index)
{
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

function JSSCfgPropertySet_RemoveProperty (name)
{
   if (name == null || name == "")
      return;

   if (this.propArray[name] == null)
      return;

   this.propArray[name] = null;
   this.propArrayLen--;
}

function JSSCfgPropertySet_Reset ()
{
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

function JSSCfgPropertySet_SetProperty (name, value)
{
   if (name == null || name == "")
      return (false);

   return this.SetPropertyStr (String(name), String(value));
}

function JSSCfgPropertySet_SetPropertyStr (name, value)
{
   if (this.propArray[name] == null)
      this.propArrayLen++;

   this.propArray[name] = value;

   return (true);
}

function JSSCfgPropertySet_SetType (type)
{
   this.type = type;

   return (true);
}

function JSSCfgPropertySet_SetValue (value)
{
   this.value = value;

   return (true);
}

// encoding/decoding methods

function JSSCfgPropertySet_DecodeFromStringOld (encodedValue)
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
      top._swescript.SWEAlert ("Invalid encoding of property set " + encodedValue);  
    
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
      top._swescript.SWEAlert ("Invalid encoded property set string");
      return (false);
   }

   // clear out the encoding vars
   this.encoded   = null;
   this.decodePos = null;

   return (true);
}

function JSSCfgPropertySet_EncodeAsStringOld ()
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

function JSSCfgPropertySet_ReadHeader ()
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

function JSSCfgPropertySet_ReadInteger ()
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

function JSSCfgPropertySet_ReadPropertySet (propSet)
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
      newPropSet = new JSSCfgPropertySet ();
      propSet.AddChild (newPropSet);

      if (!this.ReadPropertySet (newPropSet))
         return (false);
   }

   return (true);
}

function JSSCfgPropertySet_ReadString ()
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

function JSSCfgPropertySet_ReadValueVariant (propSet)
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
      top._swescript.SWEAlert ("Unsupported property set value type: " + nType);
      return (false);
   }

   return (true);
}



function JSSCfgPropertySet_WriteHeader ()
{
   // version 0
   this.WriteInteger (0);

   // endianness
   this.WriteInteger (0);

   return (true);
}

function JSSCfgPropertySet_WriteInteger (value)
{
   this.encodeArray[this.encodeArray.length] = value.toString () + '*';
}

function JSSCfgPropertySet_WritePropertySet (propSet)
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
      this.WriteString (prop);
      this.WriteString (propSet.propArray[prop]);
   }

   for (i = 0; i < nChildren; i++)
   {
      childPropSet = propSet.GetChild (i);
      if (!this.WritePropertySet (childPropSet))
         return (false);
   }

   return (true);
}

function JSSCfgPropertySet_WriteString (str)
{
   if (str == null)
      str = "";

   this.WriteInteger (str.length);

   if (str.length > 0)
      this.encodeArray[this.encodeArray.length] = str;
}

function JSSCfgPropertySet_WriteValueVariant (propSet)
{
   this.WriteInteger (3);   // string type

   this.WriteString (propSet.value);

   return (true);
}

function JSSCfgPropertySet_DecodeFromString (encodedValue)
{	
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
      top._swescript.SWEAlert ("Invalid encoding of property set " + encodedValue);  
		      
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
      top._swescript.SWEAlert ("Invalid encoded property set string");
      return (false);
   }

   // clear out the encoding vars
   this.arr    = null;
   this.arrPos = 0;

   return (true);
}

function JSSCfgPropertySet_EncodeAsString ()
{
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

function JSSCfgPropertySet_ReadHeader2 ()
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

function JSSCfgPropertySet_ReadInteger2 ()
{
   if (this.arrPos >= this.arr.length)
      return (null);

   value = parseInt (this.arr[this.arrPos++]);
   if (value == NaN)
      return (null);
   
   return (value);
}

function JSSCfgPropertySet_ReadPropertySet2 (propSet)
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
      newPropSet = new JSSCfgPropertySet ();
      propSet.AddChild (newPropSet);

      if (!this.ReadPropertySet2 (newPropSet))
         return (false);
   }

   return (true);
}

function JSSCfgPropertySet_ReadString2 ()
{
   if (this.arrPos >= this.arr.length)
      return (null);

   return (this.arr[this.arrPos++]);
}

function JSSCfgPropertySet_ReadValueVariant2 (propSet)
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
      top._swescript.SWEAlert ("Unsupported property set value type: " + nType);
      return (false);
   }

   return (true);
}



function JSSCfgPropertySet_WriteHeader2 ()
{
   // version 0
   this.WriteInteger2 (0);

   // endianness
   this.WriteInteger2 (0);

   return (true);
}

function JSSCfgPropertySet_WriteInteger2 (value)
{
   this.encodeArray[this.encodeArray.length] = value;
}

function JSSCfgPropertySet_WritePropertySet2 (propSet)
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
      this.WriteString2safe (prop);
      if (!this.WriteString2 (propSet.propArray[prop]))
         return (false);
   }

   for (i = 0; i < nChildren; i++)
   {
      childPropSet = propSet.GetChild (i);
      if (!this.WritePropertySet2 (childPropSet))
         return (false);
   }

   return (true);
}

function JSSCfgPropertySet_WriteString2safe (str)
{
   if (str == null)
      str = "";

   this.encodeArray[this.encodeArray.length] = str;
}

function JSSCfgPropertySet_WriteString2 (str)
{
   if (str == null)
      str = "";
   else if (str != "")
      this.strArray[this.strArray.length] = str;

   this.encodeArray[this.encodeArray.length] = str;

   return (true);
}

function JSSCfgPropertySet_WriteValueVariant2 (propSet)
{
   this.WriteInteger2 (3);   // string type

   if (!this.WriteString2 (propSet.value))
      return (false);

   return (true);
}

JSSCfgPropertySet.prototype.AddChild               = JSSCfgPropertySet_AddChild;
JSSCfgPropertySet.prototype.Clone                  = JSSCfgPropertySet_Clone
JSSCfgPropertySet.prototype.Copy                   = JSSCfgPropertySet_Copy;
JSSCfgPropertySet.prototype.DecodeFromString       = JSSCfgPropertySet_DecodeFromString;
JSSCfgPropertySet.prototype.EncodeAsString         = JSSCfgPropertySet_EncodeAsString;
JSSCfgPropertySet.prototype.EnumChildren           = JSSCfgPropertySet_EnumChildren;
JSSCfgPropertySet.prototype.EnumProperties         = JSSCfgPropertySet_EnumProperties;
JSSCfgPropertySet.prototype.GetChild               = JSSCfgPropertySet_GetChild;
JSSCfgPropertySet.prototype.GetChildIndexByType    = JSSCfgPropertySet_GetChildIndexByType;
JSSCfgPropertySet.prototype.GetChildByType         = JSSCfgPropertySet_GetChildByType;
JSSCfgPropertySet.prototype.GetChildCount          = JSSCfgPropertySet_GetChildCount;
JSSCfgPropertySet.prototype.GetProperty            = JSSCfgPropertySet_GetProperty;
JSSCfgPropertySet.prototype.GetPropertyAsStr       = JSSCfgPropertySet_GetPropertyAsStr;
JSSCfgPropertySet.prototype.GetFirstProperty       = JSSCfgPropertySet_GetFirstProperty;
JSSCfgPropertySet.prototype.GetNextProperty        = JSSCfgPropertySet_GetNextProperty;
JSSCfgPropertySet.prototype.GetPropertyCount       = JSSCfgPropertySet_GetPropertyCount;
JSSCfgPropertySet.prototype.GetQueryString         = JSSCfgPropertySet_GetQueryString;
JSSCfgPropertySet.prototype.GetType                = JSSCfgPropertySet_GetType;
JSSCfgPropertySet.prototype.GetValue               = JSSCfgPropertySet_GetValue;
JSSCfgPropertySet.prototype.InsertChildAt          = JSSCfgPropertySet_InsertChildAt;
JSSCfgPropertySet.prototype.PropertyExists         = JSSCfgPropertySet_PropertyExists;
JSSCfgPropertySet.prototype.RemoveChild            = JSSCfgPropertySet_RemoveChild;
JSSCfgPropertySet.prototype.RemoveProperty         = JSSCfgPropertySet_RemoveProperty;
JSSCfgPropertySet.prototype.Reset                  = JSSCfgPropertySet_Reset;
JSSCfgPropertySet.prototype.SetProperty            = JSSCfgPropertySet_SetProperty;
JSSCfgPropertySet.prototype.SetPropertyStr         = JSSCfgPropertySet_SetPropertyStr;
JSSCfgPropertySet.prototype.SetType                = JSSCfgPropertySet_SetType;
JSSCfgPropertySet.prototype.SetValue               = JSSCfgPropertySet_SetValue;
JSSCfgPropertySet.prototype.GetPropertiesSize      = JSSCfgPropertySet_GetPropertiesSize;

// internal encoding/decoding methods (would be private)
JSSCfgPropertySet.prototype.DecodeFromStringOld  = JSSCfgPropertySet_DecodeFromStringOld;
JSSCfgPropertySet.prototype.EncodeAsStringOld    = JSSCfgPropertySet_EncodeAsStringOld;
JSSCfgPropertySet.prototype.ReadHeader        = JSSCfgPropertySet_ReadHeader;
JSSCfgPropertySet.prototype.ReadInteger       = JSSCfgPropertySet_ReadInteger;
JSSCfgPropertySet.prototype.ReadPropertySet   = JSSCfgPropertySet_ReadPropertySet;
JSSCfgPropertySet.prototype.ReadString        = JSSCfgPropertySet_ReadString;
JSSCfgPropertySet.prototype.ReadValueVariant  = JSSCfgPropertySet_ReadValueVariant;
JSSCfgPropertySet.prototype.WriteHeader       = JSSCfgPropertySet_WriteHeader;
JSSCfgPropertySet.prototype.WriteInteger      = JSSCfgPropertySet_WriteInteger;
JSSCfgPropertySet.prototype.WritePropertySet  = JSSCfgPropertySet_WritePropertySet;
JSSCfgPropertySet.prototype.WriteString       = JSSCfgPropertySet_WriteString;
JSSCfgPropertySet.prototype.WriteValueVariant = JSSCfgPropertySet_WriteValueVariant;
JSSCfgPropertySet.prototype.ReadHeader2        = JSSCfgPropertySet_ReadHeader2;
JSSCfgPropertySet.prototype.ReadInteger2       = JSSCfgPropertySet_ReadInteger2;
JSSCfgPropertySet.prototype.ReadPropertySet2   = JSSCfgPropertySet_ReadPropertySet2;
JSSCfgPropertySet.prototype.ReadString2        = JSSCfgPropertySet_ReadString2;
JSSCfgPropertySet.prototype.ReadValueVariant2  = JSSCfgPropertySet_ReadValueVariant2;
JSSCfgPropertySet.prototype.WriteHeader2       = JSSCfgPropertySet_WriteHeader2;
JSSCfgPropertySet.prototype.WriteInteger2      = JSSCfgPropertySet_WriteInteger2;
JSSCfgPropertySet.prototype.WritePropertySet2  = JSSCfgPropertySet_WritePropertySet2;
JSSCfgPropertySet.prototype.WriteString2       = JSSCfgPropertySet_WriteString2;
JSSCfgPropertySet.prototype.WriteString2safe   = JSSCfgPropertySet_WriteString2safe;
JSSCfgPropertySet.prototype.WriteValueVariant2 = JSSCfgPropertySet_WriteValueVariant2;


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
   
   return new JSSCfgPropertySet ();
}
