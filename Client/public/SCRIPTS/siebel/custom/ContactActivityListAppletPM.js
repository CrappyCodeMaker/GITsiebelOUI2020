if (typeof (SiebelAppFacade.ContactActivityListAppletPM) === "undefined") {
    SiebelJS.Namespace("SiebelAppFacade.ContactActivityListAppletPM");
    define("siebel/custom/ContactActivityListAppletPM", ["siebel/listpmodel"], function () {
        SiebelAppFacade.ContactActivityListAppletPM = (function () {

            function ContactActivityListAppletPM(pm) {
                SiebelAppFacade.ContactActivityListAppletPM.superclass.constructor.apply(this, arguments);
            }

            SiebelJS.Extend(ContactActivityListAppletPM, SiebelAppFacade.ListPresentationModel);

            ContactActivityListAppletPM.prototype.Init = function () {
                SiebelAppFacade.ContactActivityListAppletPM.superclass.Init.apply(this, arguments);

                this.AddMethod("InvokeMethod", this.GetActivitiesInfo, { sequence: false, scope: this });
                this.AddMethod("ShowSelection", this.GetActivitiesInfo, { sequence: false, scope: this });

                this.AddProperty("ActivitiesId", "");
                this.AddProperty("ActivitiesStatus", "");
                this.AddProperty("ActivitiesEnd", "");

            }

            ContactActivityListAppletPM.prototype.GetActivitiesInfo = function () {
                let controls = this.Get("GetControls");
                let activitiesId;
                let  ActivitiesStatus;
                let  ActivitiesEnd;

                for (controlKey in controls) {
                    if (controls[controlKey].GetFieldName() == "Activity UID") {
                        activitiesId = this.ExecuteMethod("GetFieldValue", controls[controlKey]);
                        this.SetProperty("ActivitiesId", activitiesId);
                        console.log('PM ID - ' + activitiesId);

                    } else if (controls[controlKey].GetFieldName() == "Status") {

                        ActivitiesStatus = this.ExecuteMethod("GetFieldValue", controls[controlKey]);
                        this.SetProperty("ActivitiesStatus", ActivitiesStatus);
                        console.log('PM STATUS - ' + ActivitiesStatus);

                    } else if (controls[controlKey].GetFieldName() == "Due") {

                        ActivitiesEnd = this.ExecuteMethod("GetFieldValue", controls[controlKey]);
                        this.SetProperty("ActivitiesEnd", ActivitiesEnd);
                        console.log('PM END - ' + ActivitiesEnd);
                    }
                }
            }

            ContactActivityListAppletPM.prototype.Setup = function (propSet) {
                SiebelAppFacade.ContactActivityListAppletPM.superclass.Setup.apply(this, arguments);
            }

            return ContactActivityListAppletPM;
        }());
        return "SiebelAppFacade.ContactActivityListAppletPM";
    })
}