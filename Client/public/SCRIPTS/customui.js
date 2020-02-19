/*
 * Function to add a map icon and a globe icon for bringing up a Google map and the home page for an account.
 * Andy Keleher        9/28/11        Create
 *
 */
function addIcons () {
    if (navigator.platform != "iPad") {
        // Not iPad: Hover over map icon to bring up map. Click to go to Google Map site.
        document.getElementsByName('s_2_1_119_0')[0].outerHTML='<input type="text" onkeypress="if (event.keyCode==13) return false;" name="s_2_1_119_0" value="'+document.getElementsByName("s_2_1_119_0")[0].value+'" height="24" width="60"></input><img src="http://cdn-img.easyicon.cn/png/5222/522221.gif" height="20" width="20" onmouseover=\'map_window = window.open("http://maps.googleapis.com/maps/api/staticmap?markers="+document.getElementsByName("s_2_1_119_0")[0].value+"&center="+document.getElementsByName("s_2_1_119_0")[0].value+"&zoom=14&size=300x300&scale=2&sensor=false","map_window","status=no,width=300,height=300,location=0,menubar=no,resizable=no,scrollbars=no,titlebar=no,toolbar=no,top=200,left=180");\' onmouseout=\'map_window.close()\' onclick=\'map_window.close(); window.open("http://maps.google.co.uk/maps?&q="+document.getElementsByName("s_2_1_119_0")[0].value)\'></img>';
        
        // Hover over URL icon to bring up preview site. Click to go to customer site specified in the URL.
        document.getElementsByName('s_2_1_99_0')[0].outerHTML='<input type="text" onkeypress="if (event.keyCode==13) return false;" name="s_2_1_99_0" value="'+document.getElementsByName("s_2_1_99_0")[0].value+'" height="24" width="60"></input><img src="images/html_globe.png" height="16" width="16" onmouseover=\'url_window = window.open("http://"+document.getElementsByName("s_2_1_99_0")[0].value,"url_window","status=no,width=900,height=600,location=0,menubar=no,resizable=no,scrollbars=no,titlebar=no,toolbar=no,top=120,left=180");\' onmouseout=\'url_window.close()\' onclick=\'url_window.close(); window.open("http://"+document.getElementsByName("s_2_1_99_0")[0].value)\'></img>';
    }
}

/*
 * Function to add Show and Hide buttons for the left hand navigation
 * Kirk Leibert        9/28/11        Create
 *
 */
function addShowAndHide () {
    //Check if hide/show was previously added, if not then add elements and jQuery functions to the DOM
    if (!$('#_swescrnbar').hasClass('addshowactivated')) {
        // add hide and show logic to the DOM;
        var prependtext;
        
        prependtext = '<a href="#" id="openSidebarButton" title="Open Sidebar" class="hidden">&raquo;</a>'; //Oliver: changed to >> 
        $("#_swescrnbar").prepend(prependtext);
        $("#_swescrnbar").addClass("addshowactivated");
        var appendtext;
         
        appendtext = '<a href="#" class="sidebarNavButton" id="sidebarCloseButton" title="Close Sidebar">&laquo;</a>'; //Oliver: removed superfluous html
          
        $( "#s_sctrl").prepend(appendtext);
         
        // bind close function to close href
        $("#sidebarCloseButton").click(function() {
            $("#_swescrnbar").addClass("treeClosed");
            $("#_swecontent").addClass("maxWidth");                          
            $("#openSidebarButton").removeClass("hidden");    
            $("#sidebarCloseButton").css("Display","none");
            $("#gview_s_1_l").resize();
        });
        
        // bind open function to open href
        $("#openSidebarButton").click(function() {
            $("#s_sctrl").css("display", "");
            $("#_swescrnbar").removeClass("treeClosed");
            $("#openSidebarButton").addClass("hidden");
            $("#_swecontent").removeClass("maxWidth");
            $("#gview_s_1_l").resize();
        });
    }
}
