if (typeof (SiebelAppFacade.ProductContactListAppletTMPR) === "undefined") {
    SiebelJS.Namespace("SiebelAppFacade.ProductContactListAppletTMPR");
    define("siebel/custom/ProductContactListAppletTMPR", ["siebel/jqgridrenderer"], function () {
        SiebelAppFacade.ProductContactListAppletTMPR = (function () {

            function ProductContactListAppletTMPR(pm) {
                SiebelAppFacade.ProductContactListAppletTMPR.superclass.constructor.apply(this, arguments);
            }

            SiebelJS.Extend(ProductContactListAppletTMPR, SiebelAppFacade.JQGridRenderer);

            ProductContactListAppletTMPR.prototype.Init = function () {
                SiebelAppFacade.ProductContactListAppletTMPR.superclass.Init.apply(this, arguments);
            }


            ProductContactListAppletTMPR.prototype.BindData = function (bRefresh) {
                SiebelAppFacade.PharmaProfessionalOwnCallsListAppletPR.superclass.BindData.apply(this, arguments);

            }

            return ProductContactListAppletTMPR;
        }());
        return "SiebelAppFacade.ProductContactListAppletTMPR";
    })
}