if (typeof (SiebelAppFacade.OpportunityListAppletPR) === "undefined") {
    SiebelJS.Namespace("SiebelAppFacade.OpportunityListAppletPR");
    define("siebel/custom/OpportunityListAppletPR", ["siebel/jqgridrenderer"], function () {
        SiebelAppFacade.OpportunityListAppletPR = (function () {

            function OpportunityListAppletPR(pm) {
                SiebelAppFacade.OpportunityListAppletPR.superclass.constructor.apply(this, arguments);
            }

            SiebelJS.Extend(OpportunityListAppletPR, SiebelAppFacade.JQGridRenderer);

            OpportunityListAppletPR.prototype.Init = function () {
                SiebelAppFacade.OpportunityListAppletPR.superclass.Init.apply(this, arguments);
            }

            OpportunityListAppletPR.prototype.ShowUI = function () {
                SiebelAppFacade.OpportunityListAppletPR.superclass.ShowUI.apply(this, arguments);
/////////////////////////////////////////////////
                let inPS = SiebelApp.S_App.NewPropertySet();
                let outPS = SiebelApp.S_App.NewPropertySet();
                inPS.SetProperty("Name", "Is Manager");
                let service = SiebelApp.S_App.GetService("SessionAccessService");
                outPS = service.InvokeMethod("GetProfileAttr", inPS);
                let resultSet = outPS.GetChildByType("ResultSet");
                let returnVal = resultSet.GetProperty("Value");

                if (returnVal === 'Y') {

                    let docsButton = "<button id='docs' class='btn btn-danger'>" + "VIEW DOCUMENTATION</button>";
                    let placeHolder = this.GetPM().Get("GetPlaceholder");
                    $('#' + placeHolder + 'd').parent().before(docsButton);
                    try {
                        $("#docs").click(function () {
                            let URL = 'http://docs.oracle.com';
                            window.open(URL, 'Documentation', 'width=400,height=400');
                        }
                        );
                    }
                    catch (err) {
                        alert("Error during attempt to reach external URL: " + err);
                    }

                }
//////////////////////////////////////////////

                let PM = this.GetPM();
                let placeHolder = PM.Get("GetPlaceholder");
                let markup = "<div id='mychart' class='mychart' style = 'height:250px; width:600px' > " + "</div>"; $('#' + placeHolder + 'd').append(markup);
                let PR = this;

                require(["http://www.google.com/jsapi"], function () {
                    PR.GoogleJSAPILoaded.call(PR);
                });
            }

            OpportunityListAppletPR.prototype.GoogleJSAPILoaded = function () {
                let PR = this;
                google.load('visualization', '1', {
                    'callback': PR.GoogleVisualizationPackageLoaded(PR),
                    'packages': ['corechart']
                });
                return false;
            }

            OpportunityListAppletPR.prototype.GoogleVisualizationPackageLoaded = function (PR) {
                if (!google.visualization || typeof (google.visualization.DataTable) != "function") {
                    setTimeout(function () { PR.GoogleVisualizationPackageLoaded(PR) }, 5);
                }
                else {
                    PR.BindData(true)
                }
                return false;
            }

            OpportunityListAppletPR.prototype.BindData = function (bRefresh) {
                SiebelAppFacade.OpportunityListAppletPR.superclass.BindData.apply(this, arguments);

                let PM = this.GetPM();
                let recordSet = PM.Get("GetRecordSet");
                data = new google.visualization.DataTable();
                data.addColumn('string', 'Label');
                data.addColumn('number', 'Value');
                for (let i = 0; i < recordSet.length; i++) {
                    let value = recordSet[i]["Primary Revenue Amount"];
                    let numVal = Number(value.replace(/[^0-9\.]+/g, ""));
                    data.addRow([recordSet[i]["Name"], { v: numVal, f: value }]);
                }
                let options = { title: 'Opportunities Primary Revenue Amount' };
                chart = new google.visualization.PieChart(document.getElementById('mychart'));
                chart.draw(data, options);
            }

            OpportunityListAppletPR.prototype.BindEvents = function () {
                SiebelAppFacade.OpportunityListAppletPR.superclass.BindEvents.apply(this, arguments);
            }

            OpportunityListAppletPR.prototype.EndLife = function () {
                SiebelAppFacade.OpportunityListAppletPR.superclass.EndLife.apply(this, arguments);
            }

            return OpportunityListAppletPR;
        }());
        return "SiebelAppFacade.OpportunityListAppletPR";
    })
}