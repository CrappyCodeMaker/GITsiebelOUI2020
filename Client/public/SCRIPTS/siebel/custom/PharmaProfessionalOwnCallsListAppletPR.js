if (typeof (SiebelAppFacade.PharmaProfessionalOwnCallsListAppletPR) === "undefined") {
    SiebelJS.Namespace("SiebelAppFacade.PharmaProfessionalOwnCallsListAppletPR");
    define("siebel/custom/PharmaProfessionalOwnCallsListAppletPR", ["siebel/jqgridrenderer"], function () {
        SiebelAppFacade.PharmaProfessionalOwnCallsListAppletPR = (function () {

            function PharmaProfessionalOwnCallsListAppletPR(pm) {
                SiebelAppFacade.PharmaProfessionalOwnCallsListAppletPR.superclass.constructor.apply(this, arguments);
            }

            SiebelJS.Extend(PharmaProfessionalOwnCallsListAppletPR, SiebelAppFacade.JQGridRenderer);

            PharmaProfessionalOwnCallsListAppletPR.prototype.Init = function () {
                SiebelAppFacade.PharmaProfessionalOwnCallsListAppletPR.superclass.Init.apply(this, arguments);
            }


            PharmaProfessionalOwnCallsListAppletPR.prototype.BindData = function (bRefresh) {
                SiebelAppFacade.PharmaProfessionalOwnCallsListAppletPR.superclass.BindData.apply(this, arguments);

            }


            return PharmaProfessionalOwnCallsListAppletPR;
        }());
        return "SiebelAppFacade.PharmaProfessionalOwnCallsListAppletPR";
    })
}