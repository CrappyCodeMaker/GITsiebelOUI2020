jQuery.fn.contextPopup = function(menuData) {

	var settings = {
		contextClass: 'contextMenu',
		marginSpace: 'marginSpace',
		headerClass: 'header',
		seperatorClass: 'divider',
		title: '',
		items: []
	};
	
	
	$.extend(settings, menuData);

  
  function createMenu(e) {
    var menu = $('<ul class="' + settings.contextClass + '"><div class="' + settings.marginSpace + '"></div></ul>')
      .appendTo(document.body);
    if (settings.title) {
      $('<li class="' + settings.headerClass + '"></li>').text(settings.title).appendTo(menu);
    }
    settings.items.forEach(function(item) {
      if (item) {
        var rowCode = '<li><a href="#"><span></span></a></li>';
        
		var row = $(rowCode).appendTo(menu);
        if(item.icon){
          var icon = $('<img>');
          icon.attr('src', item.icon);
          icon.insertBefore(row.find('span'));
        }
        row.find('span').text(item.label);
        if (item.action) {
          row.find('a').click(function(){ item.action(e); });
        }
      } else {
        $('<li class="' + settings.seperatorClass + '"></li>').appendTo(menu);
      }
    });
    menu.find('.' + settings.headerClass ).text(settings.title);
    return menu;
  }

  oneMenushown=false;
  $('div.slidemenu,._jsPlumb_connector').on('click', function(e) {
	if(oneMenushown==true)return;
	oneMenushown=true;
    // Create and show menu
    var menu = createMenu(e)
      .show()
      .css({zIndex:1000001, left:e.pageX + 5, top:e.pageY})
      .bind('contextmenu', function() { return false; });

	
    var bg = $('<div></div>')
      .css({left:0, top:0, width:'100%', height:'100%', position:'absolute', zIndex:1000000})
      .appendTo(document.body)
      .bind('contextmenu click', function() {
        bg.remove();
        menu.remove();
		 oneMenushown=false;
        return false;
      });


    menu.find('a').click(function() {
	  bg.remove();
      menu.remove();
	  oneMenushown=false;
    });

    return false;
  });

  return this;
};