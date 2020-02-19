/* object position is stored in a variable at the 
 * level of parent frame. The variable name is constructed 
 * of the frame name  + "_" + the direction of scrolling (x or y)
 */
function getScrollPosition()
{   
   var posX = eval("window.parent." + window.name + "_x");
   var posY = eval("window.parent." + window.name + "_y");
   
   if (posX == null) posX = 0;
   if (posY == null) posY = 0;

   return posX + "," + posY;
}

/* stores the position of the object in a variable 
 * in the parent frame (the view frameset); 
 * this variable will be cleared when we move to another view
 */
function setScrollPosition()
{   
   var posX = 0;
   var posY = 0;
   
   if (document.all) //ie
   {   
      posX = parseInt(this.document.body.scrollLeft);
      posY = parseInt(this.document.body.scrollTop); 
   }
   else if (document.layers) //ns
   {   
      posX = self.pageXOffset;
      posY = self.pageYOffset;
   }   
   
   eval("window.parent." + window.name + "_x" + "=" + posX);   
   eval("window.parent." + window.name + "_y" + "=" + posY);   

}

/* obtains stored scroll positions; if they have been set already 
 * the function repositions the document to that position; 
 * this has the effect of maintaining scroll position between frame refreshes.
 */
function restoreScrollPosition()
{   
   var $pos = getScrollPosition();
   var Apos = $pos.split(',');
   var posX = parseInt( Apos[0] );
   var posY = parseInt( Apos[1] );
   
   if (document.all) //ie
   {   
      if (posX!=0 || posY!=0)
      {   
         this.document.body.scrollTop =posY;
         this.document.body.scrollLeft=posX;            
      }         
      
   } else if (document.layers) //ns
   {
      if (posX!=0 || posY!=0)
      {   window.scroll(posX,posY);      }
   }
}
