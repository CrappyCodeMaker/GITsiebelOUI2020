function JSSSWEFrameListLS()
{
}

function JSSSWEFrameListLS_DoPopulate(applet)
{
   var   c;
   var   control;
   var   haveRow;
   var   listCol;
   var   r;
   var   spanName;
   var	strCurColName;
   var	strPreColName;
   var	strCurCellVal;
   var	strPreRowCurColCellVal;
   var	strPreRowPreColCellVal;
   var	strCurRowPreColCellVal;
   var	strNextRowPreColCellVal;
   var	strTempCellVal;
   var	strSqlBCSortSpec;
   var	strSortSpec;
   var	strSortOrder;
   var	bFirstDefSortCol  = false;
   var	nWSRowId;
   var	nRowSpanNum       = 1;
   var	bRemoved = false;
   var	parentE;
   var   preListCol;

   if (applet.activeRow >= 0)
   {
      applet.ClearActiveRow ();
      applet.activeRow = -1;
   }

   JSSListApplet_DoPopulate (applet);
   if (applet.listColArray == null)
   {
      applet.SetErrorMsg ("AppletErrNoListCols");
      return (false);
   }

   // populate the field columns in the data rows with rowspan value.
   applet.busComp.WSHome (applet.ntfyId);
   haveRow = true;

   if (applet.busComp.WSGetCurrRow (applet.ntfyId) < 0)
      haveRow = false;

   for (r = 0; r < applet.listRowCount; r++)
   {
      if (haveRow)
      {
         // read all values from our working set
         for (c = 0; c < applet.listColArray.length; c++)
         {
			   nRowSpanNum = 1;
			   bRemoved = false;

            listCol = applet.listColArray[c];

            if (listCol.fieldName == "")
               value = "";
            else
               value = applet.busComp.WSGetFormattedValue (applet.ntfyId,
                                                           listCol.fieldName,
                                                           listCol.displayFormat);

  			   strSortSpec = applet.busComp.GetSortSpec();
  			   if (((strSortSpec.indexOf(",") >= 0) && (strSortSpec.indexOf(listCol.fieldName) >= 0))
				  // when user click on only the first col still suppression, otherwise not.
  				  || ((strSortSpec.indexOf(",") < 0) && (listCol.fieldName == strSortSpec) && (c == 0)) )
			   {
				   if (c == 0)
				      bFirstDefSortCol = true;
				   else
				   {
				      bFirstDefSortCol = false;
				      preListCol = applet.listColArray[c -1];
	  	            strPreColName = preListCol.fieldName;
				   }				   
				 
				   // if not first sort col, get cell value of (curRow, preCol)
				   if (!bFirstDefSortCol)
				      strCurRowPreColCellVal = applet.busComp.WSGetFormattedValue(applet.ntfyId,
																				strPreColName,
																				listCol.displayFormat);
				   nWSRowId = applet.busComp.WSGetCurrRow (applet.ntfyId)
				   // if not first line compare with cell of (preRow, CurCol) first.
				   if (nWSRowId != 0)
				   {
				      this.busComp.WSSetCurrRow (this.ntfyId, nWSRowId -1);
				      strPreRowCurColCellVal = applet.busComp.WSGetFormattedValue(applet.ntfyId,
																			    listCol.fieldName,
																				listCol.displayFormat);
				    
   				   // if CurCell value equals to the PreRowCurCol Cell value
   				   // 1. if not first sort col CurRowPreCol cell value is the same as preRowCurCol cell value
   				   //    then no control should be shown for current cell.
   				   // 2. if first sort col
   				   //    then no control should be shown for current cell.
   				   if (strPreRowCurColCellVal == value)
   				   {  
   				      if (!bFirstDefSortCol)
   				      {
   				          
   				         strPreRowPreColCellVal = applet.busComp.WSGetFormattedValue(applet.ntfyId,
   																					  strPreColName,
   																					  listCol.displayFormat);
   				 
   				          
   				         spanName = preListCol.spanPrefix + (r-1);
   					      element = this.document.getElementById(spanName);
   			 			   while(element.tagName != "TD")
   						   element = element.parentElement;

   						   if ((element.rowSpan != 1) && (strCurRowPreColCellVal == strPreRowPreColCellVal))
   				         {
   							   spanName = listCol.spanPrefix + r;
   							   element = this.document.getElementById(spanName);
   			 				   while(element.tagName != "TD")
   			 				   {
   								   parentE = element.parentElement;
   							      element.style.display = "none";
   								   element = parentE;
   							   }
   							   element.style.display = "none";
   				               bRemoved = true;
   				         }
   				      }
   				      else
   				      {
   			            spanName = listCol.spanPrefix + r;
   				         element = this.document.getElementById(spanName);
   			 			   while(element.tagName != "TD")
   			 			   {
   						      parentE = element.parentElement;
   							   element.style.display = "none";
   							   element = parentE;
   						   }
   						   element.style.display = "none";
   			            bRemoved = true;
   				      }
   				   }
   				   this.busComp.WSSetCurrRow (this.ntfyId, nWSRowId);
   				}
   				   
   				// Compare with next lines.
   				if (!bRemoved)
   				{
   				   while (this.busComp.WSNextRecord(this.ntfyId))
   				   {
   					   strTempCellVal = applet.busComp.WSGetFormattedValue(applet.ntfyId,
   					                                                       listCol.fieldName,
   					                                                       listCol.displayFormat);

   					   if(strTempCellVal == value)
   					   {
   					      if (!bFirstDefSortCol)
   					      {
   					 		  strNextRowPreColCellVal = applet.busComp.WSGetFormattedValue(applet.ntfyId,
   																						   strPreColName,
   																						   listCol.displayFormat);

   					       //if (strCurRowPreColCellVal == strNextRowPreColCellVal)
    							 spanName = preListCol.spanPrefix + r;
   							 element = this.document.getElementById(spanName);
   			 				 while(element.tagName != "TD")
   								element = element.parentElement;
   							 if ((element.rowSpan != 1) && (strCurRowPreColCellVal == strNextRowPreColCellVal))
   					            nRowSpanNum ++;
   					         else
   					            break;
   					      }
   					      else
   					         nRowSpanNum ++;
   					   }
   					   else
   					      break;
   					}
   					spanName = listCol.spanPrefix + r;
   					element = this.document.getElementById(spanName);
   					while(element.tagName != "TD")
   					{
   						element.vAlign = "middle";
   						element.style.display = "";
   						element = element.parentElement;
   					}
   					element.style.display = "";
   					element.rowSpan = nRowSpanNum;
   					if (nRowSpanNum != 1)
   						element.vAlign = "top";
   					this.busComp.WSSetCurrRow (this.ntfyId, nWSRowId);
   					applet.SetCellValue (r, listCol, value);
   				}
   			}
   			else
   			{
   				spanName = listCol.spanPrefix + r;
   				element = this.document.getElementById(spanName);
   				while(element.tagName != "TD")
   				{
   					element.vAlign = "middle";
   					element.style.display = "";
   					element = element.parentElement;
   				}
   				element.rowSpan = 1;
   				element.vAlign = "middle";
   				element.style.display = "";

               applet.SetCellValue (r, listCol, value);
            }
         }
 
         if (!applet.busComp.WSNextRecord (applet.ntfyId))
            haveRow = false;
      }
   }

   applet.ClearErrorMsg ();
   return (true);
}


new JSSSWEFrameListLS ();

JSSSWEFrameListLS.prototype = new JSSListApplet ();

JSSSWEFrameListLS.prototype.DoPopulate = JSSSWEFrameListLS_DoPopulate;
