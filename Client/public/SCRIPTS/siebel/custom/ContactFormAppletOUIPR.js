if (typeof (SiebelAppFacade.ContactFormAppletOUIPR) === "undefined") {
    SiebelJS.Namespace("SiebelAppFacade.ContactFormAppletOUIPR");
    define("siebel/custom/ContactFormAppletOUIPR", ["siebel/phyrenderer"], function () {
        SiebelAppFacade.ContactFormAppletOUIPR = (function () {

            function ContactFormAppletOUIPR(pm) {
                SiebelAppFacade.ContactFormAppletOUIPR.superclass.constructor.apply(this, arguments);
            }

            SiebelJS.Extend(ContactFormAppletOUIPR, SiebelAppFacade.PhysicalRenderer);

            ContactFormAppletOUIPR.prototype.Init = function () {
                SiebelAppFacade.ContactFormAppletOUIPR.superclass.Init.apply(this, arguments);

                this.AttachPMBinding("BdayProperty", this.BdayPropertyyears);
                this.GetDayBeforDate();
            }

            ContactFormAppletOUIPR.prototype.BdayPropertyyears = function () {

                let PM = this.GetPM();
                let sexPlusBdayCustom = PM.Get("BdayProperty");

                document.querySelector('#UserYears_Label').textContent = sexPlusBdayCustom;

                //bottom field
                let getIdContact = document.querySelector('#id-user-bottom-applet');
                let getIdAbout = document.querySelector('#id-about-bottom-applet');
                //find field value
                let getAddressFull = PM.Get("GetBusComp").GetFieldValue("Full Address");
                let getContaktId = PM.Get("GetBusComp").GetFieldValue("Id");

                getIdContact.textContent = 'Contact id: ' + getContaktId;
                getIdAbout.textContent = 'Address: ' + getAddressFull

            }

            ContactFormAppletOUIPR.prototype.GetDayBeforDate = function () {
                let now = new Date();
                let febHoliday = new Date(2020, 1, 23);
                let holidayCustom = febHoliday - now;
                holidayCustom /= 1000; // секунды до даты
                holidayCustom /= 60;    // минуты до даты
                holidayCustom /= 60;    // часы до даты
                holidayCustom /= 24; // дни до даты

                febHolidayRound = Math.round(holidayCustom);

                document.querySelector("#AboutInfo_Label").textContent = 'Defender of the Fatherland Day in: ' + febHolidayRound + ' days.';
            }

            ContactFormAppletOUIPR.prototype.BindData = function () {
                SiebelAppFacade.ContactFormAppletOUIPR.superclass.BindData.apply(this, arguments);
            }


            ContactFormAppletOUIPR.prototype.BindEvents = function () {
                SiebelAppFacade.ContactFormAppletOUIPR.superclass.BindEvents.apply(this, arguments);
            }


            return ContactFormAppletOUIPR;
        }());
        return "SiebelAppFacade.ContactFormAppletOUIPR";
    })
}