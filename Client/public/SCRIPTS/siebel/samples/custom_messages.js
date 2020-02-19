// JavaScript File for Facility UIJ
// Automatically produced by siebelrc

var _SWEcustommsgAry = [];
var _SWEbCMsgInit = false;

function _SWEgetGlobalCustomMsgAry()
{
   if (! _SWEbCMsgInit)
   {
      _SWEbCMsgInit = true;
      //_SWEcustommsgAry["TEST_EDIT"] = "Test Edit";
      
   }
   return _SWEcustommsgAry;
}
function _SWEgetCMessage(key)
{
   ary = _SWEgetGlobalCustomMsgAry();
   return ary[key];
}
