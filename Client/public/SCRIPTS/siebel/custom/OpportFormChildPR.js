if (typeof (SiebelAppFacade.OpportFormChildPR) === "undefined") {
    SiebelJS.Namespace("SiebelAppFacade.OpportFormChildPR");
    define("siebel/custom/OpportFormChildPR", ["siebel/phyrenderer"], function () {
        SiebelAppFacade.OpportFormChildPR = (function () {

            function OpportFormChildPR(pm) {
                SiebelAppFacade.OpportFormChildPR.superclass.constructor.apply(this, arguments);
            }

            SiebelJS.Extend(OpportFormChildPR, SiebelAppFacade.PhysicalRenderer);

            OpportFormChildPR.prototype.Init = function () {
                SiebelAppFacade.OpportFormChildPR.superclass.Init.call(this);
                this.AttachPMBinding("IsSecure", this.HiliteSecure);
            }

            OpportFormChildPR.prototype.HiliteSecure = function () {
                let PM = this.GetPM();
                let secureStatus = PM.Get("IsSecure");
                let controls = PM.Get("GetControls");
                for (controlKey in controls) {
                    if (controls[controlKey].GetFieldName() == "Secure Flag") {
                        let securityControl = controls[controlKey];
                        let htmlName = securityControl.GetInputName();
                        if (secureStatus == true) {
                            $("[name='" + htmlName + "']").parent()
                                .css({
                                    "background-color": "red",
                                    "color": "white",
                                    "font-weight": "bold"
                                });
                        }
                        else {
                            $("[name='" + htmlName + "']").parent()
                                .css({
                                    "background-color": "white",
                                    "color": "black",
                                    "font-weight": "normal"
                                });
                        }
                    }
                }
            }

            return OpportFormChildPR;
        }());
        return "SiebelAppFacade.OpportFormChildPR";
    })
}