if (typeof (SiebelAppFacade.ContactFormAppletOUIPM) === "undefined") {
    SiebelJS.Namespace("SiebelAppFacade.ContactFormAppletOUIPM");
    define("siebel/custom/ContactFormAppletOUIPM", ["siebel/pmodel"], function () {
        SiebelAppFacade.ContactFormAppletOUIPM = (function () {

            function ContactFormAppletOUIPM(pm) {
                SiebelAppFacade.ContactFormAppletOUIPM.superclass.constructor.apply(this, arguments);
            }

            SiebelJS.Extend(ContactFormAppletOUIPM, SiebelAppFacade.PresentationModel);

            ContactFormAppletOUIPM.prototype.Init = function () {
                SiebelAppFacade.ContactFormAppletOUIPM.superclass.Init.apply(this, arguments);

                /*this.AddMethod("ShowSelection", this.SetUserProperty, { sequence: false, scope: this });
                this.AddProperty("UserProperty", "");*/

                /*this.AddMethod("ShowSelection", this.SetAddressProperty, { sequence: false, scope: this });
                this.AddProperty("AddressProperty", "");*/

                this.AddMethod("ShowSelection", this.SetbDayProperty, { sequence: false, scope: this });
                this.AddProperty("BdayProperty", "");
            }

            ContactFormAppletOUIPM.prototype.SetbDayProperty = function () {
                let controls = this.Get("GetControls");
                let now = new Date();
                let birthUser = this.ExecuteMethod("GetFieldValue", controls["Birth Date - Auto"]);
                let userSex = this.ExecuteMethod("GetFieldValue", controls["M/M"]);
                let bdayCustom = (new Date(now).getYear() - new Date(birthUser).getYear());

                //проверка на пустоту
                bdayCustom = (!isNaN(bdayCustom)) ? bdayCustom : ' - '; // так пишем If в ES6  = if ( !isNaN(bdayCustom) )  { bdayCustom: ' - '; }

                let sexPlusBdayCustom = userSex + ' (' + bdayCustom + ' y.o.)';

                this.SetProperty("BdayProperty", sexPlusBdayCustom);


            }


            /* ContactFormAppletOUIPM.prototype.SetUserProperty = function () {
                 let controls = this.Get("GetControls");
                 //достаем значения филды
                 let lastName = this.ExecuteMethod("GetFieldValue", controls["LastName"]);
                 let firstName = this.ExecuteMethod("GetFieldValue", controls["FirstName"]);
                 let midname = this.ExecuteMethod("GetFieldValue", controls["MiddleName"]);
 
                 let fioUser = lastName + " " + firstName + " " + midname;
 
                 //let oldFioUser = this.ExecuteMethod("GetFieldValue", controls["New Full Name"]);
 
                // oldFioUser = fioUser;
 
                 this.SetProperty("UserProperty", fioUser);
 
             }*/

            /*  ContactFormAppletOUIPM.prototype.SetAddressProperty = function () {
                  let controls = this.Get("GetControls");
                  //достаем значения филды
                 /* let street = this.ExecuteMethod("GetFieldValue", controls["Personal Address"]);
                  let city = this.ExecuteMethod("GetFieldValue", controls["Personal City"]);
                  let state = this.ExecuteMethod("GetFieldValue", controls["Personal State"]);
                  let address = street + " " + city + " " + state;
                  this.SetProperty("AddressProperty", address);
  
                  console.log(address);
              }*/




            ContactFormAppletOUIPM.prototype.Setup = function (propSet) {
                SiebelAppFacade.ContactFormAppletOUIPM.superclass.Setup.apply(this, arguments);
            }

            return ContactFormAppletOUIPM;
        }());
        return "SiebelAppFacade.ContactFormAppletOUIPM";
    })
}