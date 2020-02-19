if (typeof (SiebelAppFacade.ContactActivityListAppletPR) === "undefined") {
    SiebelJS.Namespace("SiebelAppFacade.ContactActivityListAppletPR");
    define("siebel/custom/ContactActivityListAppletPR", ["siebel/jqgridrenderer"], function () {
        SiebelAppFacade.ContactActivityListAppletPR = (function () {

            //global variable for activities id
            let getActivitiesIdValue; 
            let getActivitiesStatusValue;
            let getActivitiesEndValue;




            function ContactActivityListAppletPR(pm) {
                SiebelAppFacade.ContactActivityListAppletPR.superclass.constructor.apply(this, arguments);
            }

            SiebelJS.Extend(ContactActivityListAppletPR, SiebelAppFacade.JQGridRenderer);

            ContactActivityListAppletPR.prototype.Init = function () {
                SiebelAppFacade.ContactActivityListAppletPR.superclass.Init.apply(this, arguments);
                this.AttachPMBinding("ActivitiesId",  this.ActivitiesIdFind);
                this.AttachPMBinding("ActivitiesStatus", this.ActivitiesIdFind);
                this.AttachPMBinding("ActivitiesEnd", this.ActivitiesIdFind);
            }

                   

            ContactActivityListAppletPR.prototype.ActivitiesIdFind = function () {

                let PM = this.GetPM();

                getActivitiesIdValue = PM.Get("ActivitiesId"); 
                getActivitiesStatusValue = PM.Get("ActivitiesStatus");
                getActivitiesEndValue = PM.Get("ActivitiesEnd");

                let getBottomIdActivities = document.querySelector('#id-activities-bottom-applet');
                
                getBottomIdActivities.textContent = 'Activities id: ' + getActivitiesIdValue +' // Status: '+ getActivitiesStatusValue +' // Ending: ' + getActivitiesEndValue;

            }

            ContactActivityListAppletPR.prototype.BindData = function (bRefresh) {
                SiebelAppFacade.PharmaProfessionalOwnCallsListAppletPR.superclass.BindData.apply(this, arguments);

                console.log('bind >>>>>');
                this.ActivitiesIdFind();

            }






            return ContactActivityListAppletPR;
        }());
        return "SiebelAppFacade.ContactActivityListAppletPR";
    })
}