if (typeof (SiebelAppFacade.ContactListAppletPR) === "undefined") {
    SiebelJS.Namespace("SiebelAppFacade.ContactListAppletPR");
    define("siebel/custom/ContactListAppletPR", ["siebel/jqgridrenderer"], function () {
        SiebelAppFacade.ContactListAppletPR = (function () {

            function ContactListAppletPR(pm) {
                SiebelAppFacade.ContactListAppletPR.superclass.constructor.apply(this, arguments);
            }

            SiebelJS.Extend(ContactListAppletPR, SiebelAppFacade.JQGridRenderer);

            ContactListAppletPR.prototype.Init = function () {
                SiebelAppFacade.ContactListAppletPR.superclass.Init.apply(this, arguments);
            }

            ContactListAppletPR.prototype.ShowUI = function () {
                SiebelAppFacade.ContactListAppletPR.superclass.ShowUI.apply(this, arguments);
            }

            ContactListAppletPR.prototype.BindData = function (bRefresh) {
                SiebelAppFacade.ContactListAppletPR.superclass.BindData.apply(this, arguments);

                //проверяем значение полученное в ПМ на пустоту
                let PM = this.GetPM();
                let probVal = PM.Get("EmailValue");

                probVal.onclick = function() {
                     if (probVal === '') {
                         $("<div id='dialog' title='Email Changed'> Please verify that this email <strong>" + probVal + "</strong> is now <span style='color:red'>correct</span></div>").dialog(
                             {
                                 buttons: [
                                     { text: "Yes", click: function () { $(this).dialog("close"); } },
                                     { text: "No", click: function () { $("<div>Please change email</div>").dialog(); $(this).dialog("close"); } }
                                 ]
                             }
                         );
                     }
                 }

                this.IdentifyEmail();
            }

            ContactListAppletPR.prototype.IdentifyEmail = function () {

                let recordSet = this.GetPM().Get("GetRecordSet");
                for (record in recordSet) {
                    let cell = $("#" + this.GetPM().Get("GetPlaceholder"))
                        .find("tr[id=" + (Number(record) + 1) + "]")
                        .find("td[id*=" + (Number(record) + 1) + "_s_1_l_Email_Address]");

                    let val = recordSet[record]["Email Address"];

                    if (val === '') {
                        cell.css({ "background-color": "rgba(21, 31, 44, 0.9)" });
                    }
                    else {
                        cell.css({ "background-color": "rgba(230, 230, 240, 0.9)" });
                    }
                }
            }

            ContactListAppletPR.prototype.BindEvents = function () {
                SiebelAppFacade.ContactListAppletPR.superclass.BindEvents.apply(this, arguments);
            }

            ContactListAppletPR.prototype.EndLife = function () {
                SiebelAppFacade.ContactListAppletPR.superclass.EndLife.apply(this, arguments);
            }

            return ContactListAppletPR;
        }());
        return "SiebelAppFacade.ContactListAppletPR";
    })
}