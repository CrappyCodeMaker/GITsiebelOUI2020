if( typeof( SiebelAppFacade.ClientCtrlPModel ) === "undefined" ){

    SiebelJS.Namespace( 'SiebelAppFacade.ClientCtrlPModel' );
     //Module with its dependencies
    define("siebel/samples/clientctrlpmodel", [], function () {
    SiebelAppFacade.ClientCtrlPModel = ( function(){
        
        var consts  = SiebelJS.Dependency( "SiebelApp.Constants" ); 
        
        /* *
         * Constructor Function - ClientCtrlPModel
         * 
         * Parameter - Be a good citizen. Pass All parameter to superclass. 
         * */
        function ClientCtrlPModel(proxy){

            var m_recordset = [];
            
            SiebelAppFacade.ClientCtrlPModel.superclass.constructor.call( this, proxy);
            
            this.AddMethod( "AddClientControl", null, { core : true } );    // add into method array
  
            this.GetClientRecordSet = function( ) {
               return m_recordset ;
            };
            
        }
        
        /* By default, any List Applet in OpenUI gets initialized with ListPresentationModel object.
         * We want to enhance on top of it and hence must extend from ListPresentationModel to keep
         * the core functionality.
         */
        SiebelJS.Extend( ClientCtrlPModel, SiebelAppFacade.ListPresentationModel );

        ClientCtrlPModel.prototype.Init = function(){

            SiebelAppFacade.ClientCtrlPModel.superclass.Init.call( this );

            /* Attach Post Handler for LeaveField */
            this.AddMethod( "LeaveField", PostLeaveField, { sequence : false, scope : this } );

            /* Attach Pre Handler for GetFormattedFieldValue */
            this.AddMethod("GetFormattedFieldValue", PreGetFormattedFieldValue, { sequence : true, scope : this } );

             /* Attach Handler for Delete Record Notification as well */
            this.AttachNotificationHandler( consts.get( "SWE_PROP_BC_NOTI_DELETE_RECORD" ), HandleDeleteNotification );
         
        };
        
        function PreGetFormattedFieldValue(control, bUseWS, recIndex, returnStructure){
            if (utils.IsEmpty(recIndex)){
                recIndex = this.Get("GetSelection");
            }
            
            if (recIndex >=0) {
               var clientObj = this.GetClientRecordSet();
                var recordSet=this.Get("GetRawRecordSet");
                var id = recordSet[recIndex]["Id"];
                var flag = false;
                var value;
                switch(control.GetName()){
                    case "TestDateTime":
                        value = "12/8/2013 11:41 AM";
                        flag = true;
                        break;
                    case "TestChkbox":
                        value = recordSet[recIndex]["Row Status"];
                        flag = true;
                        break;
                    case "TestEdit":
                        value = recordSet[recIndex]["Name"];
                        flag = true;
                        break;
                    case "TestCalc":
                    case "TestCombo":
                    case "TestPhone":
                        value = "";
                        flag = true;
                        break;

                }
                if (flag){
                    if( clientObj[id] && clientObj[id][control.GetName()] != undefined ){
                        value = clientObj[id][control.GetName()];
                    }
                    else if (clientObj[id]){
                        clientObj[id ][control.GetName()] = value;
                    }
                    else{
                        var recordclient = {};
                        recordclient[control.GetName()] = value;
                        clientObj[id] = recordclient;
                    }
                    returnStructure[ "CancelOperation" ] = true;
                    returnStructure[ "ReturnValue" ]     = value;
                }    
               
            }
        }
        
       
        function PostLeaveField( control, value, notLeave, returnStructure ){
               
                var clientObj = this.GetClientRecordSet();
                var currSel = this.Get( "GetSelection" );
                var recordSet=this.Get("GetRawRecordSet");
                var id = recordSet[currSel]["Id"];

                if (clientObj[id] && returnStructure["ReturnValue"] != null){
                switch(control.GetName()){
                    case "TestDateTime":
                    case "TestChkbox":
                    case "TestPhone":
                    case "TestCalc":
                    case "TestCombo":
                    case "TestEdit":
                        clientObj[id][control.GetName()] = returnStructure[ "ReturnValue" ] ; 
                        break;
                }
            }
        }

        
        function HandleDeleteNotification(propSet){
            var activeRow = propSet.GetProperty( consts.get( "SWE_PROP_BC_NOTI_ACTIVE_ROW" ) );
            if( activeRow  === this.Get( "GetSelection" ) ){
                var delObj = this.GetClientRecordSet();
                delObj[ activeRow ] = null;
            }
        }
       
        function getDropdownVal() {
            var pArrValues = [];
            for (var i = 1; i < 9; i++) {
                pArrValues.push("Static val " + i);
            }
            return pArrValues;
        }

        function injectQTPAttr(ot, rn, un , ctrlInfo) {
            if(utils.IsTrue(SiebelApp.S_App.IsAutoOn())) {
                var qtpiInj = CCFMiscUtil_CreatePropSet();
                qtpiInj.SetType(consts.get("SWE_PST_QTP_INFO"));
                qtpiInj.SetPropertyStr(consts.get("SWE_PROP_QTP_OT"), ot );
                qtpiInj.SetPropertyStr(consts.get("SWE_PROP_QTP_RN"), rn );
                qtpiInj.SetPropertyStr(consts.get("SWE_PROP_QTP_UN"), un );
                ctrlInfo.AddChild(qtpiInj);
            }
        }

        ClientCtrlPModel.prototype.UpdateModel = function(psInfo){
            var isAutoOn = utils.IsTrue(SiebelApp.S_App.IsAutoOn());
            
            /// PS Attribute info for Edit box
            SiebelAppFacade.ClientCtrlPModel.superclass.UpdateModel.call( this, psInfo );
            var ctrlType = consts.get( "SWE_CTRL_TEXTAREA" ),
                ctrlTxtInfo = SiebelAppFacade.PresentationModel.GetCtrlTemplate ("TestEdit", "Test Edit", ctrlType , 1);
            injectQTPAttr.call(this, ctrlType, "TestEdit", "Test Edit" , ctrlTxtInfo)


            /// PS Attribute info for Check box
            ctrlType = consts.get( "SWE_CTRL_CHECKBOX" );
            var ctrlChkboxInfo = SiebelAppFacade.PresentationModel.GetCtrlTemplate ("TestChkbox", "Test Checkbox", ctrlType, 2);
            injectQTPAttr.call(this, ctrlType, "TestChkbox", "Test Checkbox", ctrlChkboxInfo)

            /// PS Attribute info for Date\time picker
            ctrlType = consts.get( "SWE_CTRL_DATE_TZ_PICK" );
            var ctrlDateTimeInfo = SiebelAppFacade.PresentationModel.GetCtrlTemplate ("TestDateTime", "Test DateTime", ctrlType, 3 );
            injectQTPAttr.call(this, ctrlType, "TestDateTime", "Test DateTime", ctrlDateTimeInfo)

            /// PS Attribute info for Combo box
            ctrlType = consts.get( "SWE_CTRL_COMBOBOX" );
            var ctrlComboInfo = SiebelAppFacade.PresentationModel.GetCtrlTemplate ("TestCombo", "Test Drop Down", ctrlType, 10 );
            var pArrVal = getDropdownVal();
            ctrlComboInfo.SetPropertyStr(consts.get("SWE_PROP_CLIENT_CTRL_PICK_VAL"), pArrVal);
            injectQTPAttr.call(this, ctrlType, "TestCombo", "Test Drop Down", ctrlComboInfo)

            /// PS Attribute info for Calculator
            ctrlType = consts.get( "SWE_CTRL_CALC" );
            var ctrlCalcInfo = SiebelAppFacade.PresentationModel.GetCtrlTemplate ("TestCalc", "Test Calc", ctrlType, 14 );
            injectQTPAttr.call(this, ctrlType, "TestCalc", "Test Calc" ,ctrlCalcInfo)

            // set SWE_CTRL_CLIENTTYPE property to achieve the formatting provided by bc field. as it is used for phone format (mentioned below) 
            ctrlType = consts.get( "SWE_CTRL_TEXT" );
            var ctrlphInfo = SiebelAppFacade.PresentationModel.GetCtrlTemplate ("TestPhone", "Test Phone", ctrlType, 15 );
            ctrlphInfo.SetPropertyStr(consts.get("SWE_CTRL_CLIENTTYPE"), "phone");
            injectQTPAttr.call(this, ctrlType, "TestPhone", "Test Phone", ctrlphInfo)


            /// PS Attribute info for Link
            ctrlType = consts.get( "SWE_CTRL_LINK" );
            var ctrlURLInfo = SiebelAppFacade.PresentationModel.GetCtrlTemplate ("url", "url", ctrlType, 16 );
            ctrlURLInfo.SetPropertyStr(consts.get("SWE_PROP_JUSTIFICATION"), "Center");
            injectQTPAttr.call(this, ctrlType, "url", "url", ctrlURLInfo)

            // Add PS info to inject into proxy
            this.ExecuteMethod( "AddClientControl", ctrlTxtInfo );
            this.ExecuteMethod( "AddClientControl", ctrlChkboxInfo );
            this.ExecuteMethod( "AddClientControl", ctrlDateTimeInfo );
            this.ExecuteMethod( "AddClientControl", ctrlComboInfo );
            this.ExecuteMethod( "AddClientControl", ctrlCalcInfo );
            this.ExecuteMethod( "AddClientControl", ctrlphInfo ); 
            this.ExecuteMethod( "AddClientControl", ctrlURLInfo );

        };
        
        return ClientCtrlPModel;
    } ());

        return "SiebelAppFacade.ClientCtrlPModel";
    });
}
