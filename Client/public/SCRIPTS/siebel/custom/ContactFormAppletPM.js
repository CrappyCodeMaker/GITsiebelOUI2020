if (typeof (SiebelAppFacade.ContactFormAppletPM) === "undefined") {
    SiebelJS.Namespace("SiebelAppFacade.ContactFormAppletPM");
    define("siebel/custom/ContactFormAppletPM", ["siebel/pmodel"], function () {
        SiebelAppFacade.ContactFormAppletPM = (function () {

            function ContactFormAppletPM(pm) {
                SiebelAppFacade.ContactFormAppletPM.superclass.constructor.apply(this, arguments);
            }

            SiebelJS.Extend(ContactFormAppletPM, SiebelAppFacade.PresentationModel);

            ContactFormAppletPM.prototype.Init = function () {
                SiebelAppFacade.ContactFormAppletPM.superclass.Init.apply(this, arguments);

                this.AddMethod("ShowSelection", this.SetAddressProperty, { sequence: false, scope: this });
                this.AddProperty("AddressProperty", "");

            }

            ContactFormAppletPM.prototype.SetAddressProperty = function () {
                let controls = this.Get("GetControls");
                //достаем значения филды
                let street = this.ExecuteMethod("GetFieldValue", controls["Business Street Address"]);
                let city = this.ExecuteMethod("GetFieldValue", controls["Business City"]);
                let state = this.ExecuteMethod("GetFieldValue", controls["Business State"]);
                let address = street + " " + city + " " + state;
                this.SetProperty("AddressProperty", address);
            }

            ContactFormAppletPM.prototype.Setup = function (propSet) {
                SiebelAppFacade.ContactFormAppletPM.superclass.Setup.apply(this, arguments);
            }

            return ContactFormAppletPM;
        }());
        return "SiebelAppFacade.ContactFormAppletPM";
    })
}