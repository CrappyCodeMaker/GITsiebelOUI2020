/*****************************************************************************
 *
 * Copyright (C) 2003, Siebel Systems, Inc., All rights reserved.
 *
 * FILE:       javaautomation.js
 *  $Revision: 0 $
 *      $Date: 8/15/03 12:00a $
 *    $Author: Mlin $ of last update
 *
 * CREATOR:    Mike Lin
 *
 * DESCRIPTION
 *    For communication between a Java applet and its automation wrapper.
 *
 *****************************************************************************/

/////////
// JSSJavaAutomation
//////


function JSSJavaAutomation_FireRecorderEvent (strEvent, strPropSet)
{
   // pass message to wrapper
   this._axWrapper.FireRecorderEvent (strEvent, strPropSet);
}

function JSSJavaAutomation_Initialize (baseId)
{
   // establish communication drivers
   // this._javaApplet = document.getElementById (baseId); 
   this._axWrapper = document.getElementById ("Ax_" + baseId);
}

function JSSJavaAutomation_IsRecording ()
{
   // if recording is enabled, return "Y", else return "N"
   return this._axWrapper.IsRecording ();
}

function JSSJavaAutomation ()
{
   // explicitly set member variables
   this._axWrapper = null;
   this._javaApplet = null;
}

new JSSJavaAutomation ();


// exposed API
JSSJavaAutomation.prototype.FireRecorderEvent = JSSJavaAutomation_FireRecorderEvent;
JSSJavaAutomation.prototype.Initialize        = JSSJavaAutomation_Initialize;
JSSJavaAutomation.prototype.IsRecording       = JSSJavaAutomation_IsRecording;


//////////////////////////////////////////////////////////////////////////////
//  Following JavaScript code is for HTML Chart automation.
//////////////////////////////////////////////////////////////////////////////

function JSAChart(docObj)
{
   this.doc = docObj;
   this.categories = null;
}

function JSAChart_ScanMap()
{
   var maps = this.doc.getElementsByTagName("map");
   if(maps == null || this.categories != undefined)
      return;
      
   this.categories = new Array();
   var areas = maps[0].areas;
   var areaCount = areas.length;

   // Scan all the areas and populate each category
   for(var i = 0; i < areaCount; ++i)
   {
      var area = areas[i];
      if(area.coords != "-1,-1,-1,-1")
      {
         var series = area.href.match(/Series`\d+/);
         var cat = area.href.match(/Category`\d+/);
         if(series != null && cat != null)
         {
            var seriesNum = series[0].match(/\d+/);
            var catNum = cat[0].match(/\d+/);

            if(this.categories[catNum[0]] == undefined)
               this.categories[catNum[0]] = new Array();
         
            var length = this.categories[catNum[0]].length;
            this.categories[catNum[0]][length] = new Object();
            this.categories[catNum[0]][length].series = seriesNum[0];
            this.categories[catNum[0]][length].area = area;
         }
      }
   }
   
   // Sort the series within each category
   for(var j = 0; j < this.categories.length; ++j)
      this.categories[j].sort(function(a, b){return a.series - b.series;});
}   

function JSAChart_GetChartName()
{
   var maps = this.doc.getElementsByTagName("map");

   if(maps == null)
      return "";
   else
      return maps[0].name;
}

function JSAChart_GetCategoryCount()
{
   var maps = this.doc.getElementsByTagName("map");
   if(maps == null)
      return -1;

   if(this.categories == undefined)
      this.ScanMap();

   return this.categories.length;
}

function JSAChart_GetSeriesCount(cat)
{
   var maps = this.doc.getElementsByTagName("map");
   if(maps == null)
      return -1;

   if(this.categories == undefined)
      this.ScanMap();
   
   if(cat < 0 || cat >= this.categories.length)
   {  
      return -1;
   } 
   return this.categories[cat].length;
}

function JSAChart_GetChartTooltip(cat, index)
{
   var maps = this.doc.getElementsByTagName("map");
   if(maps == null)
      return;
   else
   {
       if(this.categories == undefined)
         this.ScanMap();

       if(cat < 0 || cat >= this.categories.length || index < 0 || index >= this.categories[cat].length)
       {
         return;
       }
         
       var area = this.categories[cat][index].area;
       var onmouseover = area.onmouseover.toString();
       var tooltip = onmouseover.substr(0, onmouseover.lastIndexOf("'"));
       return tooltip.substr(tooltip.lastIndexOf("'")+1);
   }
}

function JSAChart_ChartDrilldown(cat, index)
{
   var maps = this.doc.getElementsByTagName("map");
   if(maps == null)
      return false;
   else
   {
       if(this.categories == undefined)
         this.ScanMap();

       if(cat < 0 || cat >= this.categories.length || index < 0 || index >= this.categories[cat].length)
          return false;
       else
       {
          var area = this.categories[cat][index].area;
	  area.fireEvent ("onclick");
       }
   }
   return false;
}


function JSAChart_BindAXObj (axObj)
{
   axObj.jsObj = this;
}

new JSAChart ();

// Methods that are implemented by JSAChart class.
JSAChart.prototype.GetChartName          = JSAChart_GetChartName
JSAChart.prototype.GetCategoryCount      = JSAChart_GetCategoryCount
JSAChart.prototype.GetSeriesCount        = JSAChart_GetSeriesCount
JSAChart.prototype.GetChartTooltip       = JSAChart_GetChartTooltip
JSAChart.prototype.ChartDrilldown        = JSAChart_ChartDrilldown
JSAChart.prototype.ScanMap               = JSAChart_ScanMap
JSAChart.prototype.BindAXObj             = JSAChart_BindAXObj
///////////////////////////////////////////////////////////////////////////////


