if (typeof (SiebelAppFacade.ContactFormAppletPR) === "undefined") {
    SiebelJS.Namespace("SiebelAppFacade.ContactFormAppletPR");
    define("siebel/custom/ContactFormAppletPR", ["siebel/phyrenderer"], function () {
        SiebelAppFacade.ContactFormAppletPR = (function () {
            function ContactFormAppletPR(pm) {
                SiebelAppFacade.ContactFormAppletPR.superclass.constructor.call(this, pm);
            }
            SiebelJS.Extend(ContactFormAppletPR, SiebelAppFacade.PhysicalRenderer);

            ContactFormAppletPR.prototype.Init = function () {
                SiebelAppFacade.ContactFormAppletPR.superclass.Init.call(this);
                this.AttachPMBinding("AddressProperty", this.SetUpMap);
            }

            // called on each change of record
            ContactFormAppletPR.prototype.SetUpMap = function () {

                let PM = this.GetPM();
                let address = PM.Get("AddressProperty");
                address = address.replace(/ /g, "+");
                let URL = 'https://www.google.com/maps?t=m&q=' + address;

                $("#map_link").click(
                    function () {
                        window.open(URL, 'Google Map', 'width=600,height=600');
                    }
                );
            }

            ContactFormAppletPR.prototype.BindData = function () {

                SiebelAppFacade.ContactFormAppletPR.superclass.BindData.call(this);

                let PM = this.GetPM();
                let newLink = "<span id='map_link' style='color:steelblue;text-decoration:underline;cursor:pointer'>View on map</span>";
                let controls = PM.Get("GetControls");
                addressControlName = controls["Business Street Address"].GetInputName();
                $("[name='" + addressControlName + "']").parent().after(newLink);


                //start colors

                //достаем значения филды
                let lastName = "[name='" + controls["LastName"].GetInputName() + "']";
                let fristName = "[name='" + controls["FirstName"].GetInputName() + "']";
                let midName = "[name='" + controls["MiddleName"].GetInputName() + "']";

                //красим
                $(lastName).mouseenter(function () {
                    $(lastName).css({ "color": "rgba(220, 225, 252, 0.9)", "background-color": "rgba(65, 119, 189, 0.9)" });
                })
                    .mouseleave(function () {
                        $(lastName).css({ "color": "red", "background-color": "white" });
                    });

                $(fristName).mouseenter(function () {
                    $(fristName).css({ "color": "rgba(220, 225, 252, 0.9)", "background-color": "rgba(65, 119, 189, 0.9)" });
                })
                    .mouseleave(function () {
                        $(fristName).css({ "color": "red", "background-color": "white" });
                    });

                $(midName).mouseenter(function () {
                    $(midName).css({ "color": "rgba(220, 225, 252, 0.9)", "background-color": "rgba(65, 119, 189, 0.9)" });
                })
                    .mouseleave(function () {
                        $(midName).css({ "color": "red", "background-color": "white" });
                    });
                //end colors

            }

            return ContactFormAppletPR;
        }());
        return "SiebelAppFacade.ContactFormAppletPR";
    });
}