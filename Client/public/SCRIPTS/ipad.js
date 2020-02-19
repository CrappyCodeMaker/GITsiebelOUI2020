SiebelApp.TabScrollers = function(){
  
  this.scroll = function( move, ul, max )
  {
    var li = ul.children();
    
    var count = li.length - 2;
    
    var start = 1;
    
    for( var i = 1; i < (count + 1); i++ )
    {
      if( $(li[ i ]).is(":visible") )
      {
        start = i;
        break;
      }
    }
    
    if( (start + max) <= count )
    {
      if( move === "left" )
      {
        $( li[start] ).hide();
        $( li[start+max] ).show();
      }
    }
    if( start > 1 )
    {
      if( move === "right" )
      {
        $( li[start + max - 1] ).hide();
        $( li[start -1 ] ).show();  
      }
    }
  };
  
  return {
    attach : function()
    {
      $( ".view-tab-selected" ).livequery( 
        function( )
        {
          var ul = $( this ).next( "ul" );
          
          var li = ul.children();

          if( !ul.find( "a.tab-move-left" )[0] )
          {
            $( "<a href=\"javascript:void(0)\" class='tab-move-left'> << </a>" ).insertBefore( li[0] );

            ul.append( "<a href=\"javascript:void(0)\" class='tab-move-right'> >> </a>");    
          }
          
          var scrollWidth = $( "body" ).width(); //ul[0].clientWidth;
          
          console.log( "Element " + ul + "clientWidth " + ul[0].clientWidth + " width " + $( ul[0]).width() );
          
          var totalWidth = 0;
          
          var allowed = 0;
          
          for( var i = 1; i < li.length -1 ; i++ ) 
          {
            totalWidth += $( li[i]).width() + 15;    
            
            if( totalWidth > scrollWidth ){
              console.log( "width " + totalWidth + " element " + i );
              $( li[ i]).hide(); 
            }
            else
            {
              allowed++;
            }
          }
          
          $( ".tab-move-left", ul ).bind( "mouseenter mouseout", { ul : ul, max : allowed }, function( event ){
              //event.type event.data.start, event.data.max
              event.preventDefault();
              
              scroll( "left", event.data.ul,  event.data.max );
              
          });
          
          $( ".tab-move-right", ul).bind( "mouseenter mouseout", { ul: ul,  max : allowed }, function( event ){
              event.preventDefault();

              scroll( "right", event.data.ul,  event.data.max );
          });
        }, 
        function()
        {
          var ul = $( this ).next( "ul" );
          
          ul.find( "a.tab-move-left" ).remove();

          ul.find( "a.tab-move-right" ).remove();    
          var li = ul.children();
          for( var i = 0, len = li.length; i < len; i++ )
          {
            $( li[i] ).show();
          }          
        });
    },
    
    detach : function()
    {
      $( ".view-tab-selected" ).expire();
      
      $( ".view-tab-selected" ).each( function(){
        var ul = $( this ).next( "ul" );
        
        if( ul.find( "a.tab-move-left" )[0] )
        {
          ul.find( "a.tab-move-left" ).remove();

          ul.find( "a.tab-move-right" ).remove();    
        }
        var li = ul.children();
        for( var i = 0, len = li.length; i < len; i++ )
        {
          $( li[i] ).show();
        }
      });

    }
  };
}();

SiebelApp.ThemeManager.getTheme( "ipad-portrait" )[ 'objList' ].push( SiebelApp.TabScrollers );

/*SiebelApp.TabMaximizers = function()
{
  return {
    attach : function()
    {
      $( "div#_svf0 > div" ).livequery(
        function()
        {
          var siblings = $(this).children().siblings( "div" );
          
          //alert( "Siblings length : " + siblings.length );
          
          $( siblings[1]).slideToggle( 500 );
          
          //alert("Siblings height"  + $( siblings[0] ).height() ); 
          
          SiebelApp.EventManager.fireEvent( "toggleSize" );
        },
        function()
        {
          
        }
      );
    },
    detach : function()
    {
      $( "div#_svf0 > div" ).expire();
    }
  };
}();

SiebelApp.ThemeManager.getTheme( "ipad-portrait" )[ 'objList' ].push( SiebelApp.TabMaximizers );*/


//okay to attach when loading for the first time
setTimeout( function(){ 
SiebelApp.TabScrollers.attach();
//SiebelApp.TabMaximizers.attach();
}, 100 );
