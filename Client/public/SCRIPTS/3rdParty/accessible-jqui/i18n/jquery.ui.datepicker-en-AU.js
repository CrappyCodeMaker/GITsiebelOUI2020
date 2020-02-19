/* English/Australia initialisation for the jQuery UI date picker plugin. */
/* Based on the en-GB initialisation. */
jQuery(function($){
	$.datepicker.regional['en-AU'] = {
		closeText: _SWEgetMessage("IDS_SWE_DATEPICKER_CLOSE_TEXT"),
		prevText: IDS_SWE_DATEPICKER_PREV_TEXT,
		nextText: IDS_SWE_DATEPICKER_NEXT_TEXT,
		currentText: IDS_SWE_DATEPICKER_CURRENT_TEXT,
		monthNames: [_SWEgetMessage("IDS_SWE_JQGRID_MONTH_FULL_JANUARY"), _SWEgetMessage("IDS_SWE_JQGRID_MONTH_FULL_FEBRUARY"), _SWEgetMessage("IDS_SWE_JQGRID_MONTH_FULL_MARCH"),
            _SWEgetMessage("IDS_SWE_JQGRID_MONTH_FULL_APRIL"), _SWEgetMessage("IDS_SWE_JQGRID_MONTH_FULL_MAY"), _SWEgetMessage("IDS_SWE_JQGRID_MONTH_FULL_JUNE"), 
            _SWEgetMessage("IDS_SWE_JQGRID_MONTH_FULL_JULY"), _SWEgetMessage("IDS_SWE_JQGRID_MONTH_FULL_AUGUST"), _SWEgetMessage("IDS_SWE_JQGRID_MONTH_FULL_SEPTEMBER"), 
            _SWEgetMessage("IDS_SWE_JQGRID_MONTH_FULL_OCTOBER"), _SWEgetMessage("IDS_SWE_JQGRID_MONTH_FULL_NOVEMBER"), _SWEgetMessage("IDS_SWE_JQGRID_MONTH_FULL_DECEMBER")],
		monthNamesShort: [_SWEgetMessage("IDS_SWE_JQGRID_MONTH_SHORT_JAN"), _SWEgetMessage("IDS_SWE_JQGRID_MONTH_SHORT_FEB"), _SWEgetMessage("IDS_SWE_JQGRID_MONTH_SHORT_MAR"),
            _SWEgetMessage("IDS_SWE_JQGRID_MONTH_SHORT_APR"), _SWEgetMessage("IDS_SWE_JQGRID_MONTH_SHORT_MAY"), _SWEgetMessage("IDS_SWE_JQGRID_MONTH_SHORT_JUN"),
            _SWEgetMessage("IDS_SWE_JQGRID_MONTH_SHORT_JUL"), _SWEgetMessage("IDS_SWE_JQGRID_MONTH_SHORT_AUG"), _SWEgetMessage("IDS_SWE_JQGRID_MONTH_SHORT_SEP"),
            _SWEgetMessage("IDS_SWE_JQGRID_MONTH_SHORT_OCT"), _SWEgetMessage("IDS_SWE_JQGRID_MONTH_SHORT_NOV"), _SWEgetMessage("IDS_SWE_JQGRID_MONTH_SHORT_DEC"),],
		dayNames: [_SWEgetMessage("IDS_SWE_JQGRID_DAY_FULL_SUNDAY"), _SWEgetMessage("IDS_SWE_JQGRID_DAY_FULL_MONDAY"), _SWEgetMessage("IDS_SWE_JQGRID_DAY_FULL_TUESDAY"), 
            _SWEgetMessage("IDS_SWE_JQGRID_DAY_FULL_WEDNESDAY"), _SWEgetMessage("IDS_SWE_JQGRID_DAY_FULL_THURSDAY"), _SWEgetMessage("IDS_SWE_JQGRID_DAY_FULL_FRIDAY"),
            _SWEgetMessage("IDS_SWE_JQGRID_DAY_FULL_SATURDAY")],
		dayNamesShort: [_SWEgetMessage("IDS_SWE_JQGRID_DAY_SHORT_SUN"), _SWEgetMessage("IDS_SWE_JQGRID_DAY_SHORT_MON"), _SWEgetMessage("IDS_SWE_JQGRID_DAY_SHORT_TUE"),
            _SWEgetMessage("IDS_SWE_JQGRID_DAY_SHORT_WED"), _SWEgetMessage("IDS_SWE_JQGRID_DAY_SHORT_THU"), _SWEgetMessage("IDS_SWE_JQGRID_DAY_SHORT_FRI"), 
            _SWEgetMessage("IDS_SWE_JQGRID_DAY_SHORT_SAT"),],
		dayNamesMin: [_SWEgetMessage("IDS_SWE_DATEPICKER_DAY_NAMES_MIN_SU"), _SWEgetMessage("IDS_SWE_DATEPICKER_DAY_NAMES_MIN_MO"), _SWEgetMessage("IDS_SWE_DATEPICKER_DAY_NAMES_MIN_TU"),
            _SWEgetMessage("IDS_SWE_DATEPICKER_DAY_NAMES_MIN_WE"), _SWEgetMessage("IDS_SWE_DATEPICKER_DAY_NAMES_MIN_TH"), _SWEgetMessage("IDS_SWE_DATEPICKER_DAY_NAMES_MIN_FR"),
            _SWEgetMessage("IDS_SWE_DATEPICKER_DAY_NAMES_MIN_SA")],
		weekHeader: _SWEgetMessage("IDS_SWE_DATEPICKER_WEEK_HEADER"),
		dateFormat: 'dd/mm/yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['en-AU']);
});
