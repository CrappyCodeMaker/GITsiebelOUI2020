/*
  This file is extension to jquery-ui.js, because of below issues in CKEditor plugin.
  jquery-ui.js Version 1.10.3 and below versions doesn't support CKEditor plugin completely.
  ISSUE 1:- Dropdowns in CKEditor(within Dialog Box) closes immediately in IE.
  ISSUE 2:- Dropdowns in CKEditor(within Dialog Box) loses content if user opens them more than once.
  So once new version of jquery-ui.js is available,if above issues get fixed, this file should be removed along with dependency from phyrenderer.js.
  Reference:- http://bugs.jqueryui.com/ticket/9087#comment:30
              http://bugs.jqueryui.com/ticket/9087#comment:27
              http://bugs.jqueryui.com/ticket/4727#comment:23
              http://dev.ckeditor.com/ticket/10269
*/

$.widget( "ui.dialog", $.ui.dialog, {
  _allowInteraction: function( event ) {
    var target = event ? $(event.target) : null ;
    if ( target.is('[id^="cke_"]') || target.closest('[id^="cke_"]').length ) {
      return true;
    }
    return this._super( event );
  },
  _moveToTop: function ( event, silent ) {
    if ( event && this.uiDialog.nextAll(":visible").find('iframe').is('[id^="cke_"]') ) {
      return ;
    }
    return this._super( event, silent );
  }
});

/*
  Keyboard navigation bug fix for "ui.menu" widget. This bug was effecting its child "ui.autocomplete" widget as well.
  ISSUE :-  Issues with keyboard navigation and scrolling when mouse over the menu
  Reference :- http://bugs.jqueryui.com/ticket/9356
               https://bug.oraclecorp.com/pls/bug/webbug_print.show?c_rptno=18233744  (Bug DB link of internal issue)
*/
$.widget("ui.menu", $.ui.menu, {
    _create: function () {
        this._super();
        var self = this,
            el = $(self.element, '.ui-menu-item');

        //remove the mouseenter event from the element
        //so we can register this event with bug fix
        self._off(el, 'mouseenter');
        self._on({
            "mouseenter .ui-menu-item": function (event) {
                var target = $(event.currentTarget),
                    preventConsecutiveEvents = $(self.element).data('preventConsecutiveEvents');

                target.siblings().children(".ui-state-active").removeClass("ui-state-active");
                // Remove ui-state-active class from siblings of the newly focused menu item
                // to avoid a jump caused by adjacent elements both having a class with a border
                if (!preventConsecutiveEvents) {
                    this.focus(event, target);
                }
            }
        });
    }
});

$.widget("ui.autocomplete", $.ui.autocomplete, {
    _create: function () {
        this._super();
        var self = this,
            lastSetTimeoutId;

        self._on({
            keydown: function (event) {
                var keyCode = $.ui.keyCode,
                    el;
                if (event.keyCode === keyCode.UP || event.keyCode === keyCode.DOWN) {
                    el = $(self.menu.element);
                    el.data('preventConsecutiveEvents', true);
                    clearTimeout(lastSetTimeoutId);
                    lastSetTimeoutId = setTimeout(function () {
                        el.data('preventConsecutiveEvents', false);
                        el = null;
                    }, 100);
                }
            }
        });
    }
});
/*
Following changes are made to hande left key press when a submenu is open.
Current behaviour: the uimenubar's handler collapses the parent menu.
fix: Ignore ui-menubar's left-key handler if event from submenu.
*/

$.widget( "ui.menu", $.ui.menu, {
    collapse: function( event ) {
        var newitem = this.active && this.active.parent().closest( ".ui-menu-item", this.element );
        jQuery.data(event.target,"submenuactive",!!(newitem && newitem.length));
        return this._super( event );
    }

});

$.widget( "ui.menubar",$.ui.menubar, {
    _left: function( event ) {
        if(jQuery.data(event.target,"submenuactive")===true){
            jQuery.removeData(event.target,"submenuactive");
            return;
        }
        return this._super( event );
    },
    _right: function( event ) {
        if( this.active.find( ".ui-state-focus" ).find(".ui-menu").length ){
            return;
        }
       return this._super( event );
    }
});

$.fn.styleShow = function () {
    return this.each(function () {
        this.style.display = $(this).data("oldStyleShow") || "";
        $(this).removeData("oldStyleShow");
    });
};

$.fn.styleHide = function () {
    return this.each(function () {
        // Do something to each element here.
        if ($(this).data("oldStyleShow") || this.style.display === "none") {
            return;
        }
        $(this).data("oldStyleShow", this.style.display);
        this.style.display = "none";
    });
};