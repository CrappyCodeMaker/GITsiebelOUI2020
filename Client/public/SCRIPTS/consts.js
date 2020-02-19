//////////////////////////////////////////////////////////////////////////////
//
// Copyright (C) 2002 Siebel Systems, Inc., All rights reserved.
//
// FILE: consts.js
// $Revision: 1 $
// $Date: 1/02/02 12:01p $
// $Author: Rchang $ of last update
//
// CREATOR: Rita Chang (Java-to-Javascript)
//
// DESCRIPTION
//    Generally useful constants.
//
//////////////////////////////////////////////////////////////////////////////

function JSSConsts ()
{
}

/**
 * SSA Field data types.
 */
function JSSConsts_FieldDataType ()
{
}

JSSConsts_FieldDataType.DTYPE_TEXT           = 1;
JSSConsts_FieldDataType.DTYPE_NOTE           = 2;
JSSConsts_FieldDataType.DTYPE_PHONE          = 3;
JSSConsts_FieldDataType.DTYPE_MLTEXT         = 4;
JSSConsts_FieldDataType.DTYPE_ID             = 5;
      
JSSConsts_FieldDataType.DTYPE_NUMBER         = 6;
JSSConsts_FieldDataType.DTYPE_CURRENCY       = 7;
JSSConsts_FieldDataType.DTYPE_BOOL           = 8;
JSSConsts_FieldDataType.DTYPE_INTEGER        = 9;

JSSConsts_FieldDataType.DTYPE_DATE           = 10;
JSSConsts_FieldDataType.DTYPE_TIME           = 11;
JSSConsts_FieldDataType.DTYPE_DATETIME       = 12;

JSSConsts_FieldDataType.DTYPE_UNKNOWN        = 13;

JSSConsts_FieldDataType.DTYPE_UTCDATETIME    = 14;

// interfaces
JSSConsts.FieldDataType = JSSConsts_FieldDataType;

/**
*  Siebel Error Constants.
*/
JSSConsts.SSASqlErrAssignBadTypes            = 1;
JSSConsts.SSASqlErrOperBadTypes              = 2;
JSSConsts.SSASqlErrOperBadType               = 3;
JSSConsts.SSASqlErrInvalAssign               = 4;
JSSConsts.SSASqlErrDivideByZero              = 5;
JSSConsts.SSASqlErrNumericOverflow           = 6;
JSSConsts.SSASqlErrBadDateTimeVal            = 7;

// Max and min long int values
JSSConsts.MAX_LONGINT                        = 2147483648;
JSSConsts.MIN_LONGINT                        = -2147483647;

/**
*  Siebel Locale Constants.
*/
//  modes
JSSConsts.LOCAL_NUMBER_FORMAT                =  "0";
JSSConsts.LOCAL_INTEGER_FORMAT               =  "1";
JSSConsts.LOCAL_DATETIME_FORMAT              =  "2";
JSSConsts.LOCAL_DATE_FORMAT                  =  "3";
JSSConsts.LOCAL_TIME_FORMAT                  =  "4";
JSSConsts.LOCAL_TIME_NOSEC_FORMAT            =  "5";
JSSConsts.LOCAL_CURR_FORMAT                  =  "6";
JSSConsts.LOCAL_PHONE_FORMAT                 =  "7";
JSSConsts.LOCAL_PHONE_CTRY_FORMAT            =  "8";
JSSConsts.LOCAL_PHONE_EXT_FORMAT             =  "9";
JSSConsts.LOCAL_NUMBER_SCALE                 = "10";
JSSConsts.LOCAL_NUMBER_SEPARATOR             = "11";
JSSConsts.LOCAL_NUMBER_DECIMAL               = "12";
JSSConsts.LOCAL_CURRENCY                     = "13";
JSSConsts.LOCAL_DATE_SEPARATOR               = "14";
JSSConsts.LOCAL_TIME_SEPARATOR               = "15";
JSSConsts.LOCAL_TIME_AM                      = "16";
JSSConsts.LOCAL_TIME_PM                      = "17";
JSSConsts.LOCAL_PHONE_COUNTRY                = "18";
JSSConsts.LOCAL_LONG_DATE_FORMAT             = "19";
JSSConsts.LOCAL_UI_DIRECTIONALITY            = "20";
JSSConsts.LOCAL_CURRENCY_SEPARATOR           = "21";
JSSConsts.LOCAL_CURRENCY_DECIMAL             = "22";

JSSConsts.LOCAL_FIRST_VALUE                  = JSSConsts.LOCAL_NUMBER_FORMAT;
JSSConsts.LOCAL_LAST_VALUE                   = JSSConsts.LOCAL_CURRENCY_DECIMAL;
JSSConsts.LOCAL_SIZE                         = JSSConsts.LOCAL_LAST_VALUE + 1;

JSSConsts.IDS_SSA_FORMAT_DATE                = "Date";
JSSConsts.IDS_SSA_FORMAT_TIME                = "Time";
JSSConsts.IDS_SSA_FORMAT_TIME_NOSEC          = "TimeNoSec";


