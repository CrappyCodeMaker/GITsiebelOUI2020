if (typeof (SiebelAppFacade.ContactListAppletPM) === "undefined") {
    SiebelJS.Namespace("SiebelAppFacade.ContactListAppletPM");
    define("siebel/custom/ContactListAppletPM", ["siebel/listpmodel"], function () {
        SiebelAppFacade.ContactListAppletPM = (function () {

            function ContactListAppletPM(pm) {
                SiebelAppFacade.ContactListAppletPM.superclass.constructor.apply(this, arguments);
            }

            SiebelJS.Extend(ContactListAppletPM, SiebelAppFacade.ListPresentationModel);

            ContactListAppletPM.prototype.Init = function () {
                SiebelAppFacade.ContactListAppletPM.superclass.Init.apply(this, arguments);

                //делаем наше свойство
                this.AddProperty("EmailValue", "");
                this.AddMethod('FieldChange', this.OnFieldChange, { sequence: false, scope: this });
            }

            ContactListAppletPM.prototype.OnFieldChange = function (control, value) {
                let fieldName = control.GetName();
                if (fieldName == "Email Address") {
                    this.SetProperty("EmailValue", value);
                }
            }

            ContactListAppletPM.prototype.Setup = function (propSet) {
                SiebelAppFacade.ContactListAppletPM.superclass.Setup.apply(this, arguments);
            }

            return ContactListAppletPM;
        }());
        return "SiebelAppFacade.ContactListAppletPM";
    })
}