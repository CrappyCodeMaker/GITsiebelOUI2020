( function( $ ){
    
    //Calculator plug in localized strings
    $.extend( $.calculator.defaultOptions, 
        {
            decimalChar: _SWEgetMessage("IDS_SWE_JQGRID_DECIMAL_SEPARATOR"), // Character for the decimal point
            buttonStatus: _SWEgetMessage("IDS_SWE_CALCULATOR_BUTTON_STATUS"), // Status text for trigger button
            closeText: _SWEgetMessage("IDS_SWE_CALCULATOR_CLOSE_TEXT"), // Display text for close link
            closeStatus: _SWEgetMessage("IDS_SWE_CALCULATOR_CLOSE_STATUS"), // Status text for close link
            useText: _SWEgetMessage("IDS_SWE_CALCULATOR_USE_TEXT"), // Display text for use link
            useStatus: _SWEgetMessage("IDS_SWE_CALCULATOR_USE_STATUS"), // Status text for use link
            eraseText:  _SWEgetMessage("IDS_SWE_CALCULATOR_ERASE_TEXT"), // Display text for erase link
            eraseStatus: _SWEgetMessage("IDS_SWE_CALCULATOR_ERASE_STATUS"), // Status text for erase link
            backspaceText: _SWEgetMessage("IDS_SWE_CALCULATOR_BACKSPACE_TEXT"), // Display text for backspace link
            backspaceStatus: _SWEgetMessage("IDS_SWE_CALCULATOR_BACKSPACE_STATUS"), // Status text for backspace link
            clearErrorText: _SWEgetMessage("IDS_SWE_CALCULATOR_CLEAR_ERROR_TEXT"), // Display text for clear error link
            clearErrorStatus: _SWEgetMessage("IDS_SWE_CALCULATOR_CLEAR_ERROR_STATUS"), // Status text for clear error link
            clearText: _SWEgetMessage("IDS_SWE_CALCULATOR_CLEAR_TEXT"), // Display text for clear link
            clearStatus: _SWEgetMessage("IDS_SWE_CALCULATOR_CLEAR_STATUS"), // Status text for clear link
            memClearText: _SWEgetMessage("IDS_SWE_CALCULATOR_MEM_CLEAR_TEXT"), // Display text for memory clear link
            memClearStatus:  _SWEgetMessage("IDS_SWE_CALCULATOR_MEM_CLEAR_STATUS"), // Status text for memory clear link
            memRecallText: _SWEgetMessage("IDS_SWE_CALCULATOR_MEM_RECALL_TEXT"), // Display text for memory recall link
            memRecallStatus: _SWEgetMessage("IDS_SWE_CALCULATOR_MEM_RECALL_STATUS"), // Status text for memory recall link
            memStoreText: _SWEgetMessage("IDS_SWE_CALCULATOR_MEM_STORE_TEXT"), // Display text for memory store link
            memStoreStatus: _SWEgetMessage("IDS_SWE_CALCULATOR_MEM_STORE_STATUS"), // Status text for memory store link
            memAddText: _SWEgetMessage("IDS_SWE_CALCULATOR_MEM_ADD_TEXT"), // Display text for memory add link
            memAddStatus: _SWEgetMessage("IDS_SWE_CALCULATOR_MEM_ADD_STATUS"), // Status text for memory add link
            memSubtractText: _SWEgetMessage("IDS_SWE_CALCULATOR_MEM_SUBTRACT_TEXT"), // Display text for memory subtract link
            memSubtractStatus: _SWEgetMessage("IDS_SWE_CALCULATOR_MEM_SUBTRACT_STATUS"), // Status text for memory subtract link
            base2Text: _SWEgetMessage("IDS_SWE_CALCULATOR_BASE2_TEXT"), // Display text for base 2 link
            base2Status: _SWEgetMessage("IDS_SWE_CALCULATOR_BASE2_STATUS"), // Status text for base 2 link
            base8Text: _SWEgetMessage("IDS_SWE_CALCULATOR_BASE8_TEXT"), // Display text for base 8 link
            base8Status: _SWEgetMessage("IDS_SWE_CALCULATOR_BASE8_STATUS"), // Status text for base 8 link
            base10Text:  _SWEgetMessage("IDS_SWE_CALCULATOR_BASE10_TEXT"), // Display text for base 10 link
            base10Status: _SWEgetMessage("IDS_SWE_CALCULATOR_BASE10_STATUS"), // Status text for base 10 link
            base16Text: _SWEgetMessage("IDS_SWE_CALCULATOR_BASE16_TEXT"), // Display text for base 16 link
            base16Status: _SWEgetMessage("IDS_SWE_CALCULATOR_BASE16_STATUS"), // Status text for base 16 link
            degreesText: _SWEgetMessage("IDS_SWE_CALCULATOR_DEGREES_TEXT"), // Display text for degrees link
            degreesStatus: _SWEgetMessage("IDS_SWE_CALCULATOR_DEGREES_STATUS"), // Status text for degrees link
            radiansText: _SWEgetMessage("IDS_SWE_CALCULATOR_RADIANS_TEXT"), // Display text for radians link
            radiansStatus: _SWEgetMessage("IDS_SWE_CALCULATOR_RADIANS_STATUS"), // Status text for radians link
            popupTitle : 'Calculator Popup', // Internationalization Pending  
        }
    );
    $.calculator.addKeyDef( 'EX' , 'en' , $.calculator.unary , $.calculator._exp , 'fn exp' , 'EXP' , 'E' );
    $.calculator.addKeyDef( 'SR' , 'v' , $.calculator.unary , $.calculator._sqrt , 'fn sqrt' , 'SQRT' , '!' );
    /* Add DUMMY Localized Object Which gets values from SWE Localized String */
    $.datepicker.regional[ 'SWE' ] = {
        currentText     : _SWEgetMessage( "IDS_SWE_TIMEPICKER_CURRENT_TEXT" ),
        closeText       : _SWEgetMessage( "IDS_SWE_DATEPICKER_CLOSE_TEXT" ),
        amNames         : [_SWEgetMessage("IDS_SWE_JQGRID_AM_UC" ), _SWEgetMessage( "IDS_SWE_JQGRID_AM_ABBREVIATED" )],
        pmNames         : [_SWEgetMessage("IDS_SWE_JQGRID_PM_UC" ), _SWEgetMessage( "IDS_SWE_JQGRID_PM_ABBREVIATED" )],
        timeFormat      : 'hh:mm tt',
        timeSuffix      : '',
        timeOnlyTitle   : _SWEgetMessage( "IDS_SWE_TIMEPICKER_TIME_TITLE" ),
        timeText        : _SWEgetMessage( "IDS_SWE_TIMEPICKER_TIME" ),
        hourText        : _SWEgetMessage( "IDS_SWE_TIMEPICKER_HOUR" ),
        minuteText      : _SWEgetMessage( "IDS_SWE_TIMEPICKER_MINUTE" ),
        secondText      : _SWEgetMessage( "IDS_SWE_TIMEPICKER_SECOND" ),
        millisecText    : _SWEgetMessage( "IDS_SWE_TIMEPICKER_MILLISECOND" ),
        timezoneText    : _SWEgetMessage( "IDS_SWE_TIMEPICKER_TIME_ZONE" ),
        yearText        : _SWEgetMessage( "IDS_CALENDAR_YEAR_COMBOBOX_TITLE" ),
        monthText       : _SWEgetMessage( "IDS_CALENDAR_MONTH_COMBOBOX_TITLE" ),
        prevText        : _SWEgetMessage( "IDS_CALENDAR_PREVIOUS_MONTH_STRING" ),
        nextText        : _SWEgetMessage( "IDS_CALENDAR_NEXT_MONTH_STRING" ),
        isRTL           : false,
        monthNames      : [ _SWEgetMessage( "IDS_SWE_JQGRID_MONTH_FULL_JANUARY" ),
                            _SWEgetMessage( "IDS_SWE_JQGRID_MONTH_FULL_FEBRUARY" ),
                            _SWEgetMessage( "IDS_SWE_JQGRID_MONTH_FULL_MARCH" ),
                            _SWEgetMessage( "IDS_SWE_JQGRID_MONTH_FULL_APRIL" ),
                            _SWEgetMessage( "IDS_SWE_JQGRID_MONTH_FULL_MAY" ),
                            _SWEgetMessage( "IDS_SWE_JQGRID_MONTH_FULL_JUNE" ),
                            _SWEgetMessage( "IDS_SWE_JQGRID_MONTH_FULL_JULY" ),
                            _SWEgetMessage( "IDS_SWE_JQGRID_MONTH_FULL_AUGUST" ),
                            _SWEgetMessage( "IDS_SWE_JQGRID_MONTH_FULL_SEPTEMBER" ),
                            _SWEgetMessage( "IDS_SWE_JQGRID_MONTH_FULL_OCTOBER" ),
                            _SWEgetMessage( "IDS_SWE_JQGRID_MONTH_FULL_NOVEMBER" ),
                            _SWEgetMessage( "IDS_SWE_JQGRID_MONTH_FULL_DECEMBER" )],
        monthNamesShort : [ _SWEgetMessage( "IDS_SWE_JQGRID_MONTH_SHORT_JAN" ),
                            _SWEgetMessage( "IDS_SWE_JQGRID_MONTH_SHORT_FEB" ),
                            _SWEgetMessage( "IDS_SWE_JQGRID_MONTH_SHORT_MAR" ),
                            _SWEgetMessage( "IDS_SWE_JQGRID_MONTH_SHORT_APR" ),
                            _SWEgetMessage( "IDS_SWE_JQGRID_MONTH_SHORT_MAY" ),
                            _SWEgetMessage( "IDS_SWE_JQGRID_MONTH_SHORT_JUN" ),
                            _SWEgetMessage( "IDS_SWE_JQGRID_MONTH_SHORT_JUL" ),
                            _SWEgetMessage( "IDS_SWE_JQGRID_MONTH_SHORT_AUG" ),
                            _SWEgetMessage( "IDS_SWE_JQGRID_MONTH_SHORT_SEP" ),
                            _SWEgetMessage( "IDS_SWE_JQGRID_MONTH_SHORT_OCT" ),
                            _SWEgetMessage( "IDS_SWE_JQGRID_MONTH_SHORT_NOV" ),
                            _SWEgetMessage( "IDS_SWE_JQGRID_MONTH_SHORT_DEC" )],
        dayNames        : [ _SWEgetMessage( "IDS_SWE_JQGRID_DAY_FULL_SUNDAY" ),
                            _SWEgetMessage( "IDS_SWE_JQGRID_DAY_FULL_MONDAY" ),
                            _SWEgetMessage( "IDS_SWE_JQGRID_DAY_FULL_TUESDAY" ),
                            _SWEgetMessage( "IDS_SWE_JQGRID_DAY_FULL_WEDNESDAY" ),
                            _SWEgetMessage( "IDS_SWE_JQGRID_DAY_FULL_THURSDAY" ),
                            _SWEgetMessage( "IDS_SWE_JQGRID_DAY_FULL_FRIDAY" ),
                            _SWEgetMessage( "IDS_SWE_JQGRID_DAY_FULL_SATURDAY" )],
        dayNamesShort   : [ _SWEgetMessage( "IDS_SWE_JQGRID_DAY_SHORT_SUN" ),
                            _SWEgetMessage( "IDS_SWE_JQGRID_DAY_SHORT_MON" ),
                            _SWEgetMessage( "IDS_SWE_JQGRID_DAY_SHORT_TUE" ),
                            _SWEgetMessage( "IDS_SWE_JQGRID_DAY_SHORT_WED" ),
                            _SWEgetMessage( "IDS_SWE_JQGRID_DAY_SHORT_THU" ),
                            _SWEgetMessage( "IDS_SWE_JQGRID_DAY_SHORT_FRI" ), 
                            _SWEgetMessage( "IDS_SWE_JQGRID_DAY_SHORT_SAT" )],
        dayNamesMin     : [ _SWEgetMessage( "IDS_SWE_DATEPICKER_DAY_NAMES_MIN_SU" ),
                            _SWEgetMessage( "IDS_SWE_DATEPICKER_DAY_NAMES_MIN_MO" ),
                            _SWEgetMessage( "IDS_SWE_DATEPICKER_DAY_NAMES_MIN_TU" ),
                            _SWEgetMessage( "IDS_SWE_DATEPICKER_DAY_NAMES_MIN_WE" ),
                            _SWEgetMessage( "IDS_SWE_DATEPICKER_DAY_NAMES_MIN_TH" ),
                            _SWEgetMessage( "IDS_SWE_DATEPICKER_DAY_NAMES_MIN_FR" ),
                            _SWEgetMessage( "IDS_SWE_DATEPICKER_DAY_NAMES_MIN_SA" )],
        weekHeader      :   _SWEgetMessage("IDS_SWE_DATEPICKER_WEEK_HEADER")
    };
    
    $.datepicker.setDefaults( $.datepicker.regional[ 'SWE' ] );
    if( $.timepicker && $.timepicker.setDefaults ){
        $.timepicker.setDefaults( $.datepicker.regional[ 'SWE' ] );
    }
    
    var SWE_onTimeChange = $.timepicker.constructor.prototype._onTimeChange;    
    $.timepicker.constructor.prototype._onTimeChange = function(){
    
        var returnValue = SWE_onTimeChange.apply( this, arguments );
        
        if( this.$timeObj ){
            var dpId = this.inst.id.toString().replace(/([^A-Za-z0-9_])/g, '');
            this.$timeObj.attr({
                "tabindex"          : "0",
                "aria-labelledby"   : "ui-tpicker_time_label_" + dpId
            });
        }
        
        if( this.hour_slider ){
            this.hour_slider
                .children( "a" )
                .attr({
                    "role"          : "slider",
                    "title"         : this._defaults.hourText,
                    "aria-valuemin" : "0",
                    "aria-valuemax" : this._defaults.hourMax,
                    "aria-valuenow" : this.hour,
                    "aria-valuetext": this.hour + " " + this._defaults.hourText
                });
        }
        
        if( this.minute_slider ){
            this.minute_slider
                .children( "a" )
                .attr({
                   "role"           : "slider",
                   "title"          : this._defaults.minuteText,
                   "aria-valuemin"  : "0",
                   "aria-valuemax"  : this._defaults.minuteMax,
                   "aria-valuenow"  : this.minute,
                   "aria-valuetext" : this.minute + " " + this._defaults.minuteText
                });
        }

        return returnValue;
    };

    function addTimeZone($t) {
        if (($t.settings.timeZoneName && $t.settings.timeZoneName.length > 0) &&
            ($t.settings.timeZoneList && $t.settings.timeZoneList.length > 0) &&
            $t.dpDiv.find('.ui_tpicker_timezone_label.ui_tpicker_unit_hide').length === 1) {

            $t.dpDiv.find('.ui_tpicker_timezone_label').removeClass('ui_tpicker_unit_hide');

            var elem = $t.dpDiv.find('.ui_tpicker_timezone').removeClass('ui_tpicker_unit_hide');

            $(elem.children()[0]).remove();
            var child = $('<select></select>').addClass('ui_tpicker_timezone_select');
            elem.append(child);

            var _timeZoneList = $t.settings.timeZoneList.split("|");
            var list = [];
            for (var i = 0, len = _timeZoneList.length; i < len; i += 2) {
                  list.push({ value: _timeZoneList[i], label: _timeZoneList[i] });
            }
            _timeZoneList = list;
            elem = elem.find("select");
            $.fn.append.apply(elem,
            $.map(_timeZoneList, function (val, idx) {
                return $("<option />").val(typeof val === "object" ? val.value : val).text(typeof val === "object" ? val.label : val);
            }));
            elem.val($t.settings.timeZoneName);
        }
    };

    var SWE_showDatepicker = $.datepicker.constructor.prototype._showDatepicker;
    $.datepicker.constructor.prototype._showDatepicker = function(){
        var returnValue = SWE_showDatepicker.apply( this, arguments );

        if( $.datepicker._datepickerShowing ){

            var inst  = arguments[0].target || arguments[0];
            if (inst.nodeName.toLowerCase() != 'input') // find from button/image trigger
                inst = $('input', inst.parentNode)[0];
            if ($.datepicker._isDisabledDatepicker(inst) ) // already here
                return;

            inst = $.datepicker._getInst( inst );

            addTimeZone.call(this, inst);

            inst.dpDiv
                .find( ".ui-datepicker-close" )
                .unbind( "keydown.closePicker" )
                .bind( "keydown.closePicker" ,{ "inst": inst }, function( evt ){
                    var inst = evt.data.inst;
                    switch( evt.which ){
                        
                        case 27: // hide on escape
                                  inst.isEscapeKey = true;
                                  $.datepicker._hideDatepicker();
                                  $.datepicker._curInst.input.focus();
                                  evt.preventDefault();
                                  evt.stopImmediatePropagation();
                                  break; 
                        case 9: // hide on Tab
                                  if ( !evt.shiftKey){
                                      $.datepicker._hideDatepicker();
                                      $.datepicker._curInst.input.focus();
                                      evt.preventDefault();
                                  }
                                  break;
                        case 13 : //hide on enter
                                  var sel = inst.dpDiv.find('td.' + $.datepicker._dayOverClass + ':not(.' + $.datepicker._currentClass + ')' );
                                  if( sel[0] ){
                                      $.datepicker._selectDay(inst.input, inst.selectedMonth, inst.selectedYear, sel[0] );
                                  }
                                  var onSelect = $.datepicker._get(inst, 'onSelect');
                                  if (onSelect) {
                                      var dateStr = $.datepicker._formatDate(inst);
                                      // trigger custom callback
                                      onSelect.apply((inst.input ? inst.input[0] : null), [dateStr, inst]);
                                  }
                                  else{
                                      $.datepicker._hideDatepicker();
                                  }
                                  evt.preventDefault();
                                  break;
                    }
                });
            
            inst.dpDiv
                .find( ".ui-datepicker-prev" )
                .unbind( "keydown.prevButton" )
                .bind( "keydown.prevButton", { "inst": inst }, function( evt ) {
                    var inst = evt.data.inst;
                    switch( evt.which ) {
                        
                        case 27 : //hide on escape
                                  inst.isEscapeKey = true;
                                  $.datepicker._hideDatepicker();
                                  $.datepicker._curInst.input.focus();
                                  evt.preventDefault();
                                  evt.stopImmediatePropagation();
                                  break;
                        case 9:   // hide on Shift Tab
                                  if ( evt.shiftKey){
                                      $.datepicker._hideDatepicker();
                                      $.datepicker._curInst.input.focus();
                                      evt.preventDefault();
                                  }
                                  break;
                        
                    }
                });
            
            inst.dpDiv
                .find( ".ui-datepicker-calendar" )
                .unbind( "keydown.dayDiv" )
                .bind( "keydown.dayDiv", { "inst": inst }, function( evt ){
                    
                    var inst = evt.data.inst,
                        handled = true,
                        isRTL = inst.dpDiv.is( ".ui-datepicker-rtl" );
                    
                    switch( evt.which ){
                        
                        case 13 :  var sel = inst.dpDiv.find('td.' + $.datepicker._dayOverClass + ':not(.' + $.datepicker._currentClass + ')' );
                                    if( sel[0] ){
                                        $.datepicker._selectDay(inst.input, inst.selectedMonth, inst.selectedYear, sel[0] );
                                    }
                                    var onSelect = $.datepicker._get(inst, 'onSelect');
                                    if (onSelect) {
                                        var dateStr = $.datepicker._formatDate(inst);
                                        // trigger custom callback
                                        onSelect.apply((inst.input ? inst.input[0] : null), [dateStr, inst]);
                                    }
                                    else{
                                        $.datepicker._hideDatepicker();
                                    }
                                    return false; // don't submit the form
                                    break;
                                    
                        case 27 : inst.isEscapeKey = true;
                                  $.datepicker._hideDatepicker();
                                   break;
                                   
                        case 33 : $.datepicker._adjustDate( inst.input, ( evt.altKey ? -12 : -1 ), "M" );
                                   break;
                                   
                        case 34 : $.datepicker._adjustDate( inst.input, ( evt.altKey ? +12 : +1 ), "M" );
                                   break;
                                   
                        case 35 : var lastDay = $.datepicker._getDaysInMonth( inst.drawYear, inst.drawMonth ),
                                       moveDays = lastDay - inst.selectedDay;
                                   $.datepicker._adjustDate( inst.input, ( isRTL ? -moveDays : + moveDays ), "D" );
                                   break;
                                   
                        case 36 : var moveDays = inst.selectedDay - 1;
                                   $.datepicker._adjustDate( inst.input, ( isRTL ? +moveDays : -moveDays ), "D" );
                                   break;
                                   
                        case 37 : $.datepicker._adjustDate( inst.input, ( isRTL ? +1 : -1 ), "D" );
                                   break; 
                        
                        case 38 : $.datepicker._adjustDate( inst.input, ( isRTL ? +7 : -7 ), "D" );
                                   break;
                                   
                        case 39 : $.datepicker._adjustDate( inst.input, ( isRTL ? -1 : +1 ), "D" );
                                   break;
                                   
                        case 40 : $.datepicker._adjustDate( inst.input, ( isRTL ? -7 : +7 ), "D" );
                                   break;
                        
                        default:  handled = false;
                                   
                    }
                    
                    if( handled ){
                        evt.stopPropagation();
                        evt.preventDefault();
                    }
                });
            
            inst = null;
        }
        
        return returnValue;
    };

    var SWE_updateDatePicker = $.datepicker._updateDatepicker;
    $.datepicker._updateDatepicker = function(){
        var returnValue = SWE_updateDatePicker.apply( this, arguments );

        var inst = arguments[0],
            id = "ui-datepicker-day-" + inst.selectedDay;

        addTimeZone.call(this, inst);

        inst.dpDiv
            .find( "a.ui-datepicker-prev, a.ui-datepicker-next" )
            .attr({
                "tabindex" : "0",
                "role"     : "button"
            })
            .children( "span" )
                .attr( "tabindex", "-1" );
        
        inst.dpDiv
            .find( "table.ui-datepicker-calendar" )
                .attr({
                    "role"          : "grid",
                    "aria-readonly" : "true",
                    "tabindex"      : "0",
                    "aria-relevant" : "text",
                    "aria-live"     : "assertive",
                    "aria-label"    : $.datepicker._defaults.monthNames[ inst.selectedMonth ] + inst.selectedYear,
                    "aria-activedescendant": "ui-datepicker-day-" + inst.selectedDay
                })
                .children( "thead" )
                    .attr( "role", "presentation" )
                    .children( "tr" )
                        .first()
                            .children( "th" )
                                .not( ".ui-datepicker-week-col" )
                                    .attr( "role", "columnheader" )
                                    .attr( "aria-label", function( index, attr ){
                                        return $( this ).children( "span" ).attr( "title" );
                                    })
                                .end()
                            .end()
                        .end()
                    .end()
                .end()
                .children( "tbody" )
                    .attr( "role", "presentation" )
                    .find( "td" )
                        .attr( "role", "gridcell" )
                        .attr( "id", function( index, attr ){
                            return "ui-datepicker-day-" + $( this ).children().text();
                        }) 
                        .children()
                            .attr( "tabindex", "-1" );

        inst.dpDiv
            .find( "div.ui-datepicker-title" )
                .attr( "id", "ui-datepicker-1-month-lbl" )
                .find( "select.ui-datepicker-month" )
                    .attr({
                        "role"      : "combobox",
                        "tabindex"  : "0",
                        "aria-label": inst.settings.monthText
                    })
                    .children( "option" )
                        .attr( "aria-label", function( index, attr){
                            return $.datepicker._defaults.monthNames[ $( this ).val() ];
                        })
                    .end()
               .end()
               .find( "select.ui-datepicker-year" )
                   .attr({
                       "role"       : "combobox",
                       "tabindex"   : "0",
                       "aria-label" : inst.settings.yearText
                   });


        $( "#" + id )
            .addClass( "ui-datepicker-days-cell-over" );

        inst.dpDiv
            .find( ".ui-datepicker-calendar" )
            .attr( "tabindex", "0" )
            .focus();

        return returnValue;
    }


})( jQuery );