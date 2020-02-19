
(function($){
    "use strict";
    $.jgrid.extend({
        NavigateByKey : function (){
            return this.each(function (){
                var $t = this;
                if( !$t.grid ) {return;}
                $t.p.NavigateByKey = true;
                $($t).bind( "jqGridSelectRow", function( row, stat, e ){
                    $( this ).find( "tr.ui-row-ltr" ).attr( "tabindex", "-1" );
                    $( this ).find( "tr.ui-state-highlight" ).attr( "tabindex", "0" );
                });
                
                $($t).keydown(function(evt){

                    var handled = true,
                        target  = evt.srcElement || evt.target,
                        next    = null,
                        el      = $( this ),
                        rowId   = Number( $( target ).parent().attr( "id" ) ) || el.data("jqGrid").GetSelectedRow(),
                        pm      = el.data("jqGrid").GetPM(),
                        colheader = target.id.replace((rowId + '_' ), ''),
                        rowheader = rowId + '_' + pm.Get("GetPlaceholder") + '_' + pm.Get("GetRowIdentifierName"),
                        rowChange = false;
                    switch( evt.which ){
                        case $.ui.keyCode.DOWN :
                            next = rowId + 1 ;
                            rowChange = true;
                            break;
                        case $.ui.keyCode.UP   :
                            next = rowId - 1 ;
                            rowChange = true;
                            break;
                        case $.ui.keyCode.PAGE_UP:
                            next = 1;
                            rowChange = true;
                            break;
                        case $.ui.keyCode.PAGE_DOWN:
                            next = this.p.reccount;
                            rowChange = true;
                            break;
                            
                        case $.ui.keyCode.SPACE:
                            if( evt.ctrlKey || evt.shiftKey ){
                                el.jqGrid( "setSelection", rowId, true, evt );
                                el.find( "tr.ui-row-ltr:visible" ).eq( rowId - 1 ).children( "td:visible" ).eq(0).attr( "tabindex", 0).focus();
                            }
                            break;

                        case $.ui.keyCode.HOME:
                            var oldEl = $( el.find( "tr.ui-row-ltr:visible" ).eq( rowId - 1 ).children( "td:visible" ).attr( "tabindex", "-1") ),
                                newEl = $(oldEl.first());
                            UpdateAccessibilityTags( oldEl, newEl, rowheader, newEl.attr("id").replace((rowId + '_' ), ''), "Column");
                            break;
                            
                        case $.ui.keyCode.END :
                            var oldEl = $( el.find( "tr.ui-row-ltr:visible" ).eq( rowId - 1 ).children( "td:visible" ).attr( "tabindex", "-1") ),
                                newEl = $(oldEl.last());
                            UpdateAccessibilityTags( oldEl, newEl, rowheader, newEl.attr("id").replace((rowId + '_' ), ''), "Column");                            
                            break;
                            
                        case $.ui.keyCode.LEFT :
                            var r = target.previousSibling;
                            if(r) {
                                if($(r).is(":hidden")) {
                                    while(r) {
                                        r = r.previousSibling;
                                        if(!$(r).is(":hidden") && $(r).hasClass('jqgrow')) {break;}
                                    }
                                }
                                UpdateAccessibilityTags($( target ), $( r ), rowheader, r.id.replace((rowId + '_' ), ''), "Column");
                            }
                            break;

                        case $.ui.keyCode.RIGHT:
                            var r = target.nextSibling;
                            if(r) {
                                if($(r).is(":hidden")) {
                                    while(r) {
                                        r = r.nextSibling;
                                        if(!$(r).is(":hidden") && $(r).hasClass('jqgrow')) {break;}
                                    }
                                }
                                UpdateAccessibilityTags($( target ), $( r ), rowheader, r.id.replace((rowId + '_' ), ''), "Column");
                            }
                            break;
                            
                        case $.ui.keyCode.ENTER :
                            pm.SetProperty("ColumnChange", true);
                            $( target ).click();
                            break;
                            
                        case $.ui.keyCode.TAB :
                            var newEl = el.find( "tr.ui-state-highlight" ).children( "td:visible" ).eq(0);
                            if( !this.p.focus ){
                                newEl.attr( "tabindex" , "0" );
                                this.p.focus = true;
                            }
                            if( this.p.focus && ($('#' + rowId + '_' + colheader).length !== 0)){
                                newEl = $('#' + rowId + '_' + colheader);
                            }
                            colheader = newEl.attr("id").replace(rowId + '_', '');
                            UpdateAccessibilityTags($( target ), newEl, rowheader, colheader, "RowColumn");
                            break;
                            
                        default:
                            handled = false;
                            break;
                    }
                    if ( rowChange && ( ( next > 0 ) && ( next <= this.p.reccount ) ) ) {
                        rowheader = next + '_' + pm.Get("GetPlaceholder") + '_' + pm.Get("GetRowIdentifierName");

                        if( !evt.ctrlKey ){
                            el.jqGrid( "setSelection", next, true, evt );
                        }
                        var newEl = $('#' + evt.target.id.replace(/[0-9]*/, next)),
                            oldEl = el.find( "tr.ui-row-ltr:visible" ).eq( rowId - 1 ).children( "td:visible" );

                        UpdateAccessibilityTags(oldEl, newEl, rowheader, colheader, "Row");
                        oldEl = newEl = null;
                    }

                    if( handled ){
                        evt.stopPropagation();
                    }
                    target= el = null;
                });

                function UpdateAccessibilityTags(oldEl, newEl, rowHeader, ColHeader, toChange) {
                    var labledby = newEl.attr("aria-labelledby") || "",
                        toRemove = "",
                        toAdd    = "";

                    switch(toChange) {
                        case "Row" :
                            toRemove = ColHeader;
                            if (newEl.attr("id") !== rowHeader) {
                                toAdd = rowHeader;
                            }
                            break;
                        case "Column" :
                            toRemove = rowHeader;
                            toAdd = ColHeader;
                            break;
                        case "RowColumn" :
                            if (labledby.indexOf(ColHeader) === -1) {
                                labledby = ColHeader + " " + labledby;
                            }
                            if ((labledby.indexOf(rowHeader) === -1) && (newEl.attr("id") !== rowHeader)) {
                                labledby = rowHeader + " " + labledby;
                            }
                            newEl.attr("aria-labelledby", labledby);
                            return;
                        default:
                            break;
                    }

                    if ( labledby.indexOf(toAdd) === -1 ) {
                        labledby = toAdd + " " + labledby;
                    }
                    if (labledby.indexOf(toRemove) > -1) {
                        labledby = labledby.replace(toRemove, '')
                    }

                    oldEl.attr( "tabindex", -1);
                    newEl.attr( "tabindex", 0)
                         .focus()
                         .attr("aria-labelledby", labledby);
                }
                
                $( $t )
                    .parents( "div.ui-jqgrid" )
                        .find( "tr.ui-jqgrid-labels" )
                        .bind( "keydown", function( evt ){
                            var target = evt.srcElement || evt.target;
                            switch( evt.which ){
                                case $.ui.keyCode.RIGHT :
                                    $( evt.target )
                                        .removeAttr( "tabindex" )
                                        .nextAll( "th" )
                                            .filter( ":visible" )
                                                .first()
                                                    .attr( "tabindex", "0" )
                                                    .focus();
                                    break;
                                
                                case $.ui.keyCode.LEFT:
                                    $( evt.target )
                                        .removeAttr( "tabindex" )
                                        .prevAll( "th" )
                                            .filter( ":visible" )
                                                .first()
                                                    .attr( "tabindex", "0" )
                                                    .focus();
                                    
                                    break;
                                    
                                case $.ui.keyCode.ENTER:
                                case $.ui.keyCode.SPACE:
                                    $( evt.target )
                                        .find( "span.s-ico")
                                            .eq(0)
                                                .click();
                                    break;
                            }
                        });
                $t = null;
            });
        },
        ResetDisableClick : function (){
            return this.each(function (){
                var $t = this;
                setTimeout(function(){$t.p.disableClick=false;}, 50);
            });
        }
    });
    })(jQuery);

(function($){
    "use strict";
    $.jgrid.extend({
        expandRow: function (record){
            this.each(function(){
               var $t = this;
               if(!$t.grid || !$t.p.treeGrid) {return;}

               // check the record position in $t.p.data
               var dataLen = $t.p.data.length;
               var SelRecIdx = 0;

               for ( ;SelRecIdx < dataLen; SelRecIdx++)
                  if (record == $t.p.data[SelRecIdx]) break;

               if($.isFunction($t.p.OnExpand ))
                  $t.p.OnExpand.call($t, SelRecIdx);

               var childern = $($t).jqGrid("getNodeChildren",record);
               $(childern).each(function(i){
                  var id  = $.jgrid.getAccessor(this,$t.p.localReader.id);
                  $("#"+id,$t.grid.bDiv).css("display","");
               });
            });
         },

         collapseRow : function (record) {
            this.each(function(){
               var $t = this;
               if(!$t.grid || !$t.p.treeGrid) {return;}

               // check the record position in $t.p.data
               var dataLen = $t.p.data.length;
               var SelRecIdx = 0;

               for ( ;SelRecIdx < dataLen; SelRecIdx++)
                  if (record == $t.p.data[SelRecIdx]) break;

               if($.isFunction($t.p.OnCollapse )){
                  $t.p.OnCollapse.call($t, SelRecIdx);
               }
            });
         },

         setFrozenColumns: function () {
             return this.each(function () {
                 if (!this.grid) { return; }
                 var $t = this, cm = $t.p.colModel, i = 0, len = cm.length, maxfrozen = -1, frozen = false;
                 // TODO treeGrid and grouping  Support
                 if ($t.p.subGrid === true || $t.p.cellEdit === true || $t.p.sortable || $t.p.scroll) {
                     return;
                 }
                 if ($t.p.rownumbers) { i++; }
                 if (!$t.p.treeGrid && $t.p.multiselect) { i++; }

                 // get the max index of frozen col
                 while (i < len) {
                     // from left, no breaking frozen
                     if (cm[i].frozen === true) {
                         frozen = true;
                         maxfrozen = i;
                     } else {
                         break;
                     }
                     i++;
                 }
                 if (maxfrozen >= 0 && frozen) {
                     var top = $t.p.caption ? $($t.grid.cDiv).outerHeight() : 0,
                     hth = $(".ui-jqgrid-htable", "#gview_" + $.jgrid.jqID($t.p.id)).height();
                     //headers
                     if ($t.p.toppager) {
                         top = top + $($t.grid.topDiv).outerHeight();
                     }
                     if ($t.p.toolbar[0] === true) {
                         if ($t.p.toolbar[1] !== "bottom") {
                             top = top + $($t.grid.uDiv).outerHeight();
                         }
                     }
                     $t.grid.fhDiv = $('<div style="position:absolute;left:0px;top:' + top + 'px;height:' + hth + 'px;" class="frozen-div ui-state-default ui-jqgrid-hdiv"></div>');
                     $t.grid.fbDiv = $('<div style="position:absolute;left:0px;top:' + (parseInt(top, 10) + parseInt(hth, 10) + 1) + 'px;overflow-y:hidden" class="frozen-bdiv ui-jqgrid-bdiv"></div>');
                     $("#gview_" + $.jgrid.jqID($t.p.id)).append($t.grid.fhDiv);
                     var htbl = $(".ui-jqgrid-htable", "#gview_" + $.jgrid.jqID($t.p.id)).clone(true);
                     // groupheader support - only if useColSpanstyle is false
                     if ($t.p.groupHeader) {
                         $("tr.jqg-first-row-header, tr.jqg-third-row-header", htbl).each(function () {
                             $("th:gt(" + maxfrozen + ")", this).remove();
                         });
                         var swapfroz = -1, fdel = -1, cs, rs;
                         $("tr.jqg-second-row-header th", htbl).each(function () {
                             cs = parseInt($(this).attr("colspan"), 10);
                             rs = parseInt($(this).attr("rowspan"), 10);
                             if (rs) {
                                 swapfroz++;
                                 fdel++;
                             }
                             if (cs) {
                                 swapfroz = swapfroz + cs;
                                 fdel++;
                             }
                             if (swapfroz === maxfrozen) {
                                 return false;
                             }
                         });
                         if (swapfroz !== maxfrozen) {
                             fdel = maxfrozen;
                         }
                         $("tr.jqg-second-row-header", htbl).each(function () {
                             $("th:gt(" + fdel + ")", this).remove();
                         });
                     } else {
                         $("tr", htbl).each(function () {
                             $("th:gt(" + maxfrozen + ")", this).remove();
                         });
                     }
                     $(htbl).width(1);
                     // resizing stuff
                     $($t.grid.fhDiv).append(htbl)
                     .mousemove(function (e) {
                         if ($t.grid.resizing) { $t.grid.dragMove(e); return false; }
                     });
                     $($t).bind('jqGridResizeStop.setFrozenColumns', function (e, w, index) {
                         var rhth = $(".ui-jqgrid-htable", $t.grid.fhDiv);
                         $("th:eq(" + index + ")", rhth).width(w);
                         var btd = $(".ui-jqgrid-btable", $t.grid.fbDiv);
                         $("tr:first td:eq(" + index + ")", btd).width(w);
                     });
                     // sorting stuff
                     $($t).bind('jqGridSortCol.setFrozenColumns', function (e, index, idxcol) {

                         var previousSelectedTh = $("tr.ui-jqgrid-labels:last th:eq(" + $t.p.lastsort + ")", $t.grid.fhDiv), newSelectedTh = $("tr.ui-jqgrid-labels:last th:eq(" + idxcol + ")", $t.grid.fhDiv);

                         $("span.ui-grid-ico-sort", previousSelectedTh).addClass('ui-state-disabled');
                         $(previousSelectedTh).attr("aria-selected", "false");
                         $("span.ui-icon-" + $t.p.sortorder, newSelectedTh).removeClass('ui-state-disabled');
                         $(newSelectedTh).attr("aria-selected", "true");
                         if (!$t.p.viewsortcols[0]) {
                             if ($t.p.lastsort !== idxcol) {
                                 $("span.s-ico", previousSelectedTh).hide();
                                 $("span.s-ico", newSelectedTh).show();
                             }
                         }
                     });

                     // data stuff
                     //TODO support for setRowData
                     $("#gview_" + $.jgrid.jqID($t.p.id)).append($t.grid.fbDiv);
                     $($t.grid.bDiv).scroll(function () {
                         $($t.grid.fbDiv).scrollTop($(this).scrollTop());
                     });
                     if ($t.p.hoverrows === true) {
                         $("#" + $.jgrid.jqID($t.p.id)).unbind('mouseover').unbind('mouseout');
                     }
                     $($t).bind('jqGridAfterGridComplete.setFrozenColumns', function () {
                         $("#" + $.jgrid.jqID($t.p.id) + "_frozen").remove();
                         $($t.grid.fbDiv).height($($t.grid.bDiv).height() - 16);
                         var btbl = $("#" + $.jgrid.jqID($t.p.id)).clone(true);
                         $("tr[role=row]", btbl).each(function () {
                             $("td[role=gridcell]:gt(" + maxfrozen + ")", this).remove();
                         });

                         $(btbl).width(1).attr("id", $t.p.id + "_frozen");
                         $($t.grid.fbDiv).append(btbl);
                         if ($t.p.hoverrows === true) {
                             $("tr.jqgrow", btbl).hover(
                                 function () { $(this).addClass("ui-state-hover"); $("#" + $.jgrid.jqID(this.id), "#" + $.jgrid.jqID($t.p.id)).addClass("ui-state-hover"); },
                                 function () { $(this).removeClass("ui-state-hover"); $("#" + $.jgrid.jqID(this.id), "#" + $.jgrid.jqID($t.p.id)).removeClass("ui-state-hover"); }
                             );
                             $("tr.jqgrow", "#" + $.jgrid.jqID($t.p.id)).hover(
                                 function () { $(this).addClass("ui-state-hover"); $("#" + $.jgrid.jqID(this.id), "#" + $.jgrid.jqID($t.p.id) + "_frozen").addClass("ui-state-hover"); },
                                 function () { $(this).removeClass("ui-state-hover"); $("#" + $.jgrid.jqID(this.id), "#" + $.jgrid.jqID($t.p.id) + "_frozen").removeClass("ui-state-hover"); }
                             );
                         }
                         btbl = null;
                     });
                     if (!$t.grid.hDiv.loading) {
                         $($t).triggerHandler("jqGridAfterGridComplete");
                     }
                     $t.p.frozenColumns = true;
                 }
             });
         },
         setTreeNode : function(i, len){
             return this.each(function(){
                 var $t = this;
                 if( !$t.grid || !$t.p.treeGrid ) {return;}
                 var expCol = $t.p.expColInd,
                 expanded = $t.p.treeReader.expanded_field,
                 isLeaf = $t.p.treeReader.leaf_field,
                 level = $t.p.treeReader.level_field,
                 icon = $t.p.treeReader.icon_field,
                 loaded = $t.p.treeReader.loaded,  lft, rgt, curLevel, ident,lftpos, twrap,
                 ldat, lf;
                 while(i<len) {
                     var ind = $t.rows[i].id, dind = $t.p._index[ind], expan;
                     ldat = $t.p.data[dind];
                     //$t.rows[i].level = ldat[level];
                     if($t.p.treeGridModel == 'nested') {
                         if(!ldat[isLeaf]) {
                         lft = parseInt(ldat[$t.p.treeReader.left_field],10);
                         rgt = parseInt(ldat[$t.p.treeReader.right_field],10);
                         // NS Model
                             ldat[isLeaf] = (rgt === lft+1) ? 'true' : 'false';
                             $t.rows[i].cells[$t.p._treeleafpos].innerHTML = ldat[isLeaf];
                         }
                     }
                     //else {
                         //row.parent_id = rd[$t.p.treeReader.parent_id_field];
                     //}
                     curLevel = parseInt(ldat[level],10);
                     if($t.p.tree_root_level === 0) {
                         ident = curLevel+1;
                         lftpos = curLevel;
                     } else {
                         ident = curLevel;
                         lftpos = curLevel -1;
                     }
                     twrap = "<div class='tree-wrap tree-wrap-"+$t.p.direction+"' style='width:"+(ident*18)+"px;'>";
                     twrap += "<div style='"+($t.p.direction=="rtl" ? "right:" : "left:")+(lftpos*18)+"px;' class='ui-icon ";


                     if(ldat[loaded] !== undefined) {
                         if(ldat[loaded]=="true" || ldat[loaded]===true) {
                             ldat[loaded] = true;
                         } else {
                             ldat[loaded] = false;
                         }
                     }
                     if(ldat[isLeaf] == "true" || ldat[isLeaf] === true) {
                         twrap += ((ldat[icon] !== undefined && ldat[icon] !== "") ? ldat[icon] : $t.p.treeIcons.leaf)+" tree-leaf treeclick";
                         ldat[isLeaf] = true;
                         lf="leaf";
                     } else {
                         ldat[isLeaf] = false;
                         lf="";
                     }
                     ldat[expanded] = ((ldat[expanded] == "true" || ldat[expanded] === true) ? true : false) && ldat[loaded];
                     if(ldat[expanded] === false) {
                         twrap += ((ldat[isLeaf] === true) ? "'" : $t.p.treeIcons.plus+" tree-plus treeclick'");
                     } else {
                         twrap += ((ldat[isLeaf] === true) ? "'" : $t.p.treeIcons.minus+" tree-minus treeclick'");
                     }
                     
                     twrap += "></div></div>";
                     $($t.rows[i].cells[expCol]).wrapInner("<span class='cell-wrapper"+lf+"'></span>").prepend(twrap);

                     if(curLevel !== parseInt($t.p.tree_root_level,10)) {
                         var pn = $($t).jqGrid('getNodeParent',ldat);
                         expan = pn && pn.hasOwnProperty(expanded) ? pn[expanded] : true;
                         if( !expan ){
                             //$($t.rows[i]).css("display","none");
                         }
                     }
                     $($t.rows[i].cells[expCol])
                         .find("div.treeclick")
                         .bind("click",function(e){
                             var target = e.target || e.srcElement,
                             ind2 =$(target,$t.rows).closest("tr.jqgrow")[0].id,
                             pos = $t.p._index[ind2];
                             if(!$t.p.data[pos][isLeaf]){
                                 if($t.p.data[pos][expanded]){
                                     $($t).jqGrid("collapseRow",$t.p.data[pos]);
                                     $($t).jqGrid("collapseNode",$t.p.data[pos]);
                                 } else {
                                     $($t).jqGrid("expandRow",$t.p.data[pos]);
                                     $($t).jqGrid("expandNode",$t.p.data[pos]);
                                 }
                             }
                             return false;
                         });
                     if($t.p.ExpandColClick === true) {
                         $($t.rows[i].cells[expCol])
                             .find("span.cell-wrapper")
                             .css("cursor","pointer")
                             .bind("click",function(e) {
                                 var target = e.target || e.srcElement,
                                 ind2 =$(target,$t.rows).closest("tr.jqgrow")[0].id,
                                 pos = $t.p._index[ind2];
                                 if(!$t.p.data[pos][isLeaf]){
                                     if($t.p.data[pos][expanded]){
                                         $($t).jqGrid("collapseRow",$t.p.data[pos]);
                                         $($t).jqGrid("collapseNode",$t.p.data[pos]);
                                     } else {
                                         $($t).jqGrid("expandRow",$t.p.data[pos]);
                                         $($t).jqGrid("expandNode",$t.p.data[pos]);
                                     }
                                 }
                                 $($t).jqGrid("setSelection",ind2);
                                 return false;
                             });
                     }
                     i++;
                 }

             });
         },
         
         setTreeGrid : function() {
             return this.each(function (){
                 var $t = this, i=0, pico, ecol = false, nm, key, dupcols=[];
                 if(!$t.p.treeGrid) {return;}
                 if(!$t.p.treedatatype ) {$.extend($t.p,{treedatatype: $t.p.datatype});}
                 $t.p.subGrid = false;$t.p.altRows =false;
                 //$t.p.pgbuttons = false;$t.p.pginput = false; //MCB
                 $t.p.gridview =  true;
                 if($t.p.rowTotal === null ) { $t.p.rowNum = 10000; }
                 $t.p.multiselect = false;$t.p.rowList = [];
                 $t.p.expColInd = 0;
                 pico = 'ui-icon-triangle-1-' + ($t.p.direction=="rtl" ? 'w' : 'e');
                 $t.p.treeIcons = $.extend({plus:pico,minus:'ui-icon-triangle-1-s',leaf:'ui-icon-radio-off'},$t.p.treeIcons || {});
                 if($t.p.treeGridModel == 'nested') {
                     $t.p.treeReader = $.extend({
                         level_field: "level",
                         left_field:"lft",
                         right_field: "rgt",
                         leaf_field: "isLeaf",
                         expanded_field: "expanded",
                         loaded: "loaded",
                         icon_field: "icon"
                     },$t.p.treeReader);
                 } else if($t.p.treeGridModel == 'adjacency') {
                     $t.p.treeReader = $.extend({
                             level_field: "level",
                             parent_id_field: "parent",
                             leaf_field: "isLeaf",
                             expanded_field: "expanded",
                             loaded: "loaded",
                             icon_field: "icon"
                     },$t.p.treeReader );
                 }
                 for ( key in $t.p.colModel){
                     if($t.p.colModel.hasOwnProperty(key)) {
                         nm = $t.p.colModel[key].name;
                         if( nm == $t.p.ExpandColumn && !ecol ) {
                             ecol = true;
                             $t.p.expColInd = i;
                         }
                         i++;
                         //
                         for(var tkey in $t.p.treeReader) {
                             if($t.p.treeReader[tkey] == nm)
                                 dupcols.push(nm);
                     }

                 }
                 }
                 $.each($t.p.treeReader,function(j,n){
                     if(n && $.inArray(n, dupcols) === -1){
                         if(j==='leaf_field') { $t.p._treeleafpos= i; }
                     i++;
                         $t.p.colNames.push(n);
                         $t.p.colModel.push({name:n,width:1,hidden:true,sortable:false,resizable:false,hidedlg:true,editable:true,search:false});
                     }
                 });         
             });
         },         
         
         addChildNode : function( nodeid, parentid, data ) {
             //return this.each(function(){
             var $t = this[0];
             if(data) {
                 // we suppose tha the id is autoincremet and
                 var expanded = $t.p.treeReader.expanded_field,
                 isLeaf = $t.p.treeReader.leaf_field,
                 level = $t.p.treeReader.level_field,
                 icon = $t.p.treeReader.icon_field,
                 parent = $t.p.treeReader.parent_id_field,
                 left = $t.p.treeReader.left_field,
                 right = $t.p.treeReader.right_field,
                 loaded = $t.p.treeReader.loaded,
                 method, parentindex, parentdata, parentlevel, i, len, max=0, rowind = parentid, leaf, maxright;

                 if ( !nodeid ) {
                     i = $t.p.data.length-1;
                     if( i>= 0 ) {
                         while(i>=0){max = Math.max(max, parseInt($t.p.data[i][$t.p.localReader.id],10)); i--;}
                     }
                     nodeid = max+1;
                 }
                 var prow = $($t).jqGrid('getInd', parentid);
                     leaf = false;
                     // if not a parent we assume root
                     if ( parentid === undefined  || parentid === null || parentid==="") {
                         parentid = null;
                         rowind = null;
                         method = 'last';
                         parentlevel = $t.p.tree_root_level;
                         i = $t.p.data.length+1;
                     } else {
                         method = 'after';
                         parentindex = $t.p._index[parentid];
                         parentdata = $t.p.data[parentindex];
                         parentid = parentdata[$t.p.localReader.id];
                         parentlevel = parseInt(parentdata[level],10)+1;
                         var childs = $($t).jqGrid('getFullTreeNode', parentdata);
                         // if there are child nodes get the last index of it
                         if(childs.length) {
                             i = childs[childs.length-1][$t.p.localReader.id];
                             rowind = i;
                             i = $($t).jqGrid('getInd',rowind)+1;
                         } else {
                             i = $($t).jqGrid('getInd', parentid)+1;
                         }
                         // if the node is leaf
                         if(parentdata[isLeaf]) {
                             leaf = true;
                             parentdata[expanded] = true;
                             //var prow = $($t).jqGrid('getInd', parentid);
                             $($t.rows[prow])
                                 .find("span.cell-wrapperleaf").removeClass("cell-wrapperleaf").addClass("cell-wrapper")
                                 .end()
                                 .find("div.tree-leaf").removeClass($t.p.treeIcons.leaf+" tree-leaf").addClass($t.p.treeIcons.minus+" tree-minus");
                             $t.p.data[parentindex][isLeaf] = false;
                             parentdata[loaded] = true;
                         }
                     }
                     len = i+1;

                 //data[expanded] = false;//MCB
                 data[loaded] = true;
                 //data[level] = parentlevel;
                 //data[isLeaf] = true;
                 if( $t.p.treeGridModel === "adjacency") {
                     //data[parent] = parentid;//MCB
                 }
                 if( $t.p.treeGridModel === "nested") {
                     // this method requiere more attention
                     var query, res, key;
                     //maxright = parseInt(maxright,10);
                     // ToDo - update grid data
                     if(parentid !== null) {
                         maxright = parseInt(parentdata[right],10);
                         query = $.jgrid.from($t.p.data);
                         query = query.greaterOrEquals(right,maxright,{stype:'integer'});
                         res = query.select();
                         if(res.length) {
                             for( key in res) {
                                 res[key][left] = res[key][left] > maxright ? parseInt(res[key][left],10) +2 : res[key][left];
                                 res[key][right] = res[key][right] >= maxright ? parseInt(res[key][right],10) +2 : res[key][right];
                             }
                         }
                         data[left] = maxright;
                         data[right]= maxright+1;
                     } else {
                         maxright = parseInt( $($t).jqGrid('getCol', right, false, 'max'), 10);
                         res = $.jgrid.from($t.p.data)
                             .greater(left,maxright,{stype:'integer'})
                             .select();
                         if(res.length) {
                             for( key in res) {
                                 res[key][left] = parseInt(res[key][left],10) +2 ;
                             }
                         }
                         res = $.jgrid.from($t.p.data)
                             .greater(right,maxright,{stype:'integer'})
                             .select();
                         if(res.length) {
                             for( key in res) {
                                 res[key][right] = parseInt(res[key][right],10) +2 ;
                             }
                         }
                         data[left] = maxright+1;
                         data[right] = maxright + 2;
                     }
                 }
                 if( parentid === null || $($t).jqGrid("isNodeLoaded",parentdata) || leaf ) {
                         $($t).jqGrid('addRowData', nodeid, data, method, rowind);
                         $($t).jqGrid('setTreeNode', i, len);
                 }
                 /*if(parentdata && !parentdata[expanded]) { //MCB
                     $($t.rows[prow])
                         .find("div.treeclick")
                         .click();
                 }*/
             }
             //});
         },

        GridNav : function() {
            return this.each(function () {
                var  $t = this;
            if (!$t.grid || $t.p.cellEdit !== true ) {return;}
            // trick to process keydown on non input elements
            $t.p.knv = $t.p.id + "_kn";
            if( $t.p.NavigateByKey ){
                return;
            }
            var selection = $("<div style=width:1px;height:1px;' tabindex='0'><div tabindex='-1' style='width:1px;height:1px;' id='"+$t.p.knv+"'></div></div>"),
            i, kdir;
            function scrollGrid(iR, iC, tp){
                if (tp.substr(0,1)=='v') {
                        var ch = $($t.grid.bDiv)[0].clientHeight,
                        st = $($t.grid.bDiv)[0].scrollTop,
                        nROT = $t.rows[iR].offsetTop+$t.rows[iR].clientHeight,
                        pROT = $t.rows[iR].offsetTop;
                        if(tp == 'vd') {
                            if(nROT >= ch) {
                                $($t.grid.bDiv)[0].scrollTop = $($t.grid.bDiv)[0].scrollTop + $t.rows[iR].clientHeight;
                            }
                        }
                        if(tp == 'vu'){
                            if (pROT < st ) {
                                $($t.grid.bDiv)[0].scrollTop = $($t.grid.bDiv)[0].scrollTop - $t.rows[iR].clientHeight;
                            }
                        }
                    }
                    if(tp=='h') {
                        var cw = $($t.grid.bDiv)[0].clientWidth,
                        sl = $($t.grid.bDiv)[0].scrollLeft,
                        nCOL = $t.rows[iR].cells[iC].offsetLeft+$t.rows[iR].cells[iC].clientWidth,
                        pCOL = $t.rows[iR].cells[iC].offsetLeft;
                        if(nCOL >= cw+parseInt(sl,10)) {
                            $($t.grid.bDiv)[0].scrollLeft = $($t.grid.bDiv)[0].scrollLeft + $t.rows[iR].cells[iC].clientWidth;
                        } else if (pCOL < sl) {
                            $($t.grid.bDiv)[0].scrollLeft = $($t.grid.bDiv)[0].scrollLeft - $t.rows[iR].cells[iC].clientWidth;
                        }
                    }
                }
                function findNextVisible(iC,act){
                    var ind, i;
                    if(act == 'lft') {
                        ind = iC+1;
                        for (i=iC;i>=0;i--){
                        if ($t.p.colModel[i].hidden !== true) {
                                ind = i;
                                break;
                            }
                        }
                    }
                    if(act == 'rgt') {
                    ind = iC-1;
                        for (i=iC; i<$t.p.colModel.length;i++){
                            if ($t.p.colModel[i].hidden !== true) {
                                ind = i;
                                break;
                            }
                        }
                    }
                    return ind;
                }

                $(selection).insertBefore($t.grid.cDiv);
                $("#"+$t.p.knv)
                .focus()
                .keydown(function (e){
                    kdir = e.keyCode;
                    if($t.p.direction == "rtl") {
                    if(kdir===37) { kdir = 39;}
                    else if (kdir===39) { kdir = 37; }
                    }
                    switch (kdir) {
                        case 38:
                            if ($t.p.iRow-1 >0 ) {
                                scrollGrid($t.p.iRow-1,$t.p.iCol,'vu');
                                $($t).jqGrid("editCell",$t.p.iRow-1,$t.p.iCol,false);
                            }
                        break;
                        case 40 :
                            if ($t.p.iRow+1 <=  $t.rows.length-1) {
                                scrollGrid($t.p.iRow+1,$t.p.iCol,'vd');
                                $($t).jqGrid("editCell",$t.p.iRow+1,$t.p.iCol,false);
                            }
                        break;
                        case 37 :
                            if ($t.p.iCol -1 >=  0) {
                                i = findNextVisible($t.p.iCol-1,'lft');
                                scrollGrid($t.p.iRow, i,'h');
                                $($t).jqGrid("editCell",$t.p.iRow, i,false);
                            }
                        break;
                        case 39 :
                            if ($t.p.iCol +1 <=  $t.p.colModel.length-1) {
                                i = findNextVisible($t.p.iCol+1,'rgt');
                                scrollGrid($t.p.iRow,i,'h');
                                $($t).jqGrid("editCell",$t.p.iRow,i,false);
                            }
                        break;
                        case 13:
                            if (parseInt($t.p.iCol,10)>=0 && parseInt($t.p.iRow,10)>=0) {
                                $($t).jqGrid("editCell",$t.p.iRow,$t.p.iCol,true);
                            }
                        break;
                        default :
                            return true;
                    }
                    return false;
                });
            });
        }
  });

})(jQuery);