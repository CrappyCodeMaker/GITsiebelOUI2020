if (typeof (SiebelAppFacade.OpportFormChildPM) === "undefined") {
    SiebelJS.Namespace("SiebelAppFacade.OpportFormChildPM");
    define("siebel/custom/OpportFormChildPM", ["siebel/pmodel"], function () {
        SiebelAppFacade.OpportFormChildPM = (function () {

            function OpportFormChildPM(pm) {
                SiebelAppFacade.OpportFormChildPM.superclass.constructor.apply(this, arguments);
            }

            SiebelJS.Extend(OpportFormChildPM, SiebelAppFacade.PresentationModel);

            OpportFormChildPM.prototype.Init = function () {
                SiebelAppFacade.OpportFormChildPM.superclass.Init.call(this);
                this.AddMethod('FieldChange', this.OnFieldChange, { sequence: false, scope: this });
                this.AddMethod('ShowSelection', this.OnSelectionChange, { sequence: false, scope: this });
                this.AddProperty('IsSecure', false);

            }

            OpportFormChildPM.prototype.OnFieldChange = function (control, value) {
                if (control.GetFieldName() == "Secure Flag") {
                    if (value == "Y") {
                        this.SetProperty('IsSecure', true);
                        SiebelJS.Log("This record is currently secure");
                    }
                    else {
                        this.SetProperty('IsSecure', false);
                        SiebelJS.Log("This record is currently not secure");
                    }
                }
            }
            
            OpportFormChildPM.prototype.OnSelectionChange = function () {
                let controls = this.Get("GetControls");
                let value;
                for (controlKey in controls) {
                    if (controls[controlKey].GetFieldName() == "Secure Flag") {
                        value = this.ExecuteMethod("GetFieldValue", controls[controlKey]);
                        if (value == "Y") {
                            this.SetProperty('IsSecure', true);
                            SiebelJS.Log("This record is currently secure");
                        }
                        else {
                            this.SetProperty('IsSecure', false);
                            SiebelJS.Log("This record is currently not secure");
                        }
                    }
                }
            }
            return OpportFormChildPM;
        }());
        return "SiebelAppFacade.OpportFormChildPM";
    });
}