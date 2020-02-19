if (typeof (SiebelAppFacade.RecycleBinRenderer) === "undefined") {

    SiebelJS.Namespace("SiebelAppFacade.RecycleBinRenderer");

    define("siebel/samples/recyclebinrenderer", ["3rdParty/jcarousel/lib/jquery.jcarousel.min", "siebel/jqgridrenderer"], function () {

        SiebelAppFacade.RecycleBinRenderer = (function () {

            var siebConsts = SiebelJS.Dependency("SiebelApp.Constants");

            /* *
             * Constructor Function - RecycleBinRenderer
             *
             * Parameter - presentation model ref
             * */
            function RecycleBinRenderer(pm) {
                /* Be a good citizen. Let Superclass constructor function gets executed first */
                SiebelAppFacade.RecycleBinRenderer.superclass.constructor.call(this, pm);

                /* Static List of Control Identifier which will be displayed in Carousel; */
                this.listOfCols = ["Name", "Location"];
            }

            /* By default, any List Applet in OpenUI gets initialized with JQGridRenderer object which generates the grid
             * and has core functionality. We want to enhance on top of it and hence must extend from JQGridRenderer to keep
             * the core functionality.
             */
            SiebelJS.Extend(RecycleBinRenderer, SiebelAppFacade.JQGridRenderer);

            /* function - Init 
             * Purpose - Any function extension via PM's attachPMbinding needs to be done in this call.
             */
            RecycleBinRenderer.prototype.Init = function () {
                SiebelAppFacade.RecycleBinRenderer.superclass.Init.call(this);
                /* Bind to PM method "RefreshList" which is created as Marker function to indicate UI refresh is required */
                this.AttachPMBinding("RefreshList", RefreshCarousel);
            };
            /*
             * function - EndLife
             * Purpose - Acts as destructor for this Object.It is advisable to remove any kind of
             * live events as well as DOM reference stored in this object.
             *
             * Again, be a good citizen. When you are inheriting from any class, you must also
             * let the superclass perform it's job as well.
             */
            RecycleBinRenderer.prototype.EndLife = function () {
                $("#s_" + this.GetPM().Get("GetFullId") + "_div").parent().undelegate();

                this.listOfCols = null;

                SiebelAppFacade.RecycleBinRenderer.superclass.EndLife.call(this);
            };

            /*
             * function - ShowUI
             * Purpose - Enhance the UI. It is always advisable to let superclass
             * process first.
             */
            RecycleBinRenderer.prototype.ShowUI = function () {
                SiebelAppFacade.RecycleBinRenderer.superclass.ShowUI.call(this);
                /* Now, list has shown in UI. Let's show carousel */
                var pm = this.GetPM();
                var placeHolder = "s_" + pm.Get("GetFullId") + "_div";

                var carouselHtml = "<div class='siebui-jcarousel-wrapper'> " +
                                     "<div class='siebui-jcarousel' id=\"" + placeHolder + "_recycle\"> " +
                                        "<ul class='siebui-list-carousel' >" +
                                          "<li></li>" +
                                        "</ul>" +
                                     "</div>" +
                                     "<a href='#' class='siebui-jcarousel-prev'>&lsaquo;</a> " +
                                     "<a href='#' class='siebui-jcarousel-next'>&rsaquo;</a>" +
                                   "</div>";


                $("#" + placeHolder)
                    .addClass("siebui-list-recyclebin")
                    .after(carouselHtml)
                    .nextAll("div.siebui-jcarousel-wrapper")
                    .eq(0)
                    .hide()
                    .children("div.siebui-jcarousel")
                    .jcarousel({
                    });
            };

            RecycleBinRenderer.prototype.BindEvents = function () {
                SiebelAppFacade.RecycleBinRenderer.superclass.BindEvents.call(this);
                var placeHolder = "s_" + this.GetPM().Get("GetFullId") + "_div";
                /* Attach Events for Carousel Items whenever they appear in Applet Region */
                $("#" + placeHolder)
                    .parent()
                    .delegate(
                            "div.siebui-carousel-item", "mouseenter", { ctx: this }, ShowRestoreButton)
                    .delegate(
                            "div.siebui-carousel-item", "mouseleave", { ctx: this }, HideRestoreButton)
                    .delegate(
                            "a.siebui-citem-add", "click", { ctx: this }, AddFromRecycleBin);

                $("#" + placeHolder + "_recycle")
                    .parent()
                    .find('.siebui-jcarousel-prev')
                        .on('jcarouselcontrol:active', function () {
                            $(this).removeClass('siebui-jcarousel-ctrl-inactive');
                        })
                        .on('jcarouselcontrol:inactive', function () {
                            $(this).addClass('siebui-jcarousel-ctrl-inactive');
                        })
                        .jcarouselControl({
                            target: '-=1'
                        });

                $("#" + placeHolder + "_recycle")
                    .parent()
                    .find('.siebui-jcarousel-next')
                        .on('jcarouselcontrol:active', function () {
                            $(this).removeClass('siebui-jcarousel-ctrl-inactive');
                        })
                        .on('jcarouselcontrol:inactive', function () {
                            $(this).addClass('siebui-jcarousel-ctrl-inactive');
                        })
                        .jcarouselControl({
                            target: '+=1'
                        });
            };

            RecycleBinRenderer.prototype.BindData = function () {
                SiebelAppFacade.RecycleBinRenderer.superclass.BindData.apply(this, arguments);
            };

            /* RefreshCarousel gets called cause of PM binding with RefreshList method. 
             * 
             * Reads the property "DeletionCompleteSet" which gives the set of already deleted records. 
             * Using this set of records, add each record into carousel.
             * Carousel plugin also requires us to reset before adding records and after addition process,
             * it requires us to reset the size otherwise the scrollbar won't appear correctly. 
             */
            function RefreshCarousel() {
                var pm = this.GetPM(),
                    placeHolder = "s_" + pm.Get("GetFullId") + "_div",
                    recordSet = pm.Get("DeletionCompleteSet"),
                    el = $("#" + placeHolder + "_recycle"),
                    count = 0,
                    markUp = "";



                for (var i = 0, len = recordSet.length; i < len; i++) {
                    if (recordSet[i]) {
                        markUp += "<li>" + GetCurrentCarouselItems.call(this, recordSet[i], this.listOfCols, i) + "</li>";
                        count++;
                    }
                }

                if (count > 0) {
                    $("#" + placeHolder).addClass("siebui-span-md-10");
                    el.parent().show().addClass("siebui-span-md-2");
                }
                else {
                    $("#" + placeHolder).removeClass("siebui-span-md-10");
                    el.parent().hide().removeClass("siebui-span-md-2");
                }

                el.children("ul.siebui-list-carousel").html(markUp);
                el.jcarousel('reload');
                el.find("a.siebui-citem-add").hide();
                el = null;
            }

            /* Build the markup of each element which needs to be shown in Carousel.
             * Notice that first element is "a" tag which is being used to show "Restore" Button. 
             * See BindEvents for event attachment. 
             */
            function GetCurrentCarouselItems(record, listOfCols, index) {
                var itemMarkup = "<div class='siebui-carousel-item' data-index=\"" + index + "\" ><a class=\"siebui-citem-add\" href=\"#\"></a>";
                for (var i = 0; i < listOfCols.length; i++) {
                    if (typeof listOfCols[i] === "string" && record[listOfCols[i]]) {
                        itemMarkup += "<span class='siebui-carousel-col'>" + record[listOfCols[i]] + "</span>";
                    }
                }
                itemMarkup += "</div>";
                return itemMarkup;
            }

            /* Event Handler for mouseenter (see BindData). 
             * Verify the target and show the "Restore" button 
             */
            function ShowRestoreButton(evt) {
                if (evt && evt.currentTarget) {
                    $(evt.currentTarget).children("a.siebui-citem-add").show();
                }
            }

            /* Event Handler for mouseleave (see BindData). 
             * Verify the target and hide the "Restore" button 
             */
            function HideRestoreButton(evt) {
                if (evt && evt.currentTarget) {
                    $(evt.currentTarget).children("a.siebui-citem-add").hide();
                }
            }

            //Cliekc handler for retore button. Calls OnControlEvent of PM which will call the the event handler attached via AttachEventHandler
            /* Event Handler for click (see BindData). 
             * Verify the target and let PM knows that RESTORE of a record with index is required. 
             * Communication with PM happens using OnControlEvent for which the handler was added in
             * PM using AttachEventHandler.
             */
            function AddFromRecycleBin(evt) {
                var pm = evt.data.ctx.GetPM();
                if (evt && evt.currentTarget) {
                    pm.OnControlEvent("RESTORE", $(evt.currentTarget).parent().data("index"));
                }
            }

            return RecycleBinRenderer;
        }());

        return "SiebelAppFacade.RecycleBinRenderer";
    });
}