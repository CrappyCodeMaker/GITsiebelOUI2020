CKEDITOR.plugins.add('contentruleblock', {

    requires: ['richcombo'], //, 'styles' ],

    init: function (editor) {
        var config = editor.config,
            lang = editor.lang.format;



        var g_arrCategory = CKEDITOR.config['g_arrCategory'];
        var g_arrItem = CKEDITOR.config['g_arrItem'];
        var g_arrRule = CKEDITOR.config['g_arrRule'];
        var g_arrRuleMap = CKEDITOR.config['g_arrRuleMap'];
        var g_arrOperator = CKEDITOR.config['g_arrOperator'];
        var g_arrOperatorMap = CKEDITOR.config['g_arrOperatorMap'];
        var g_arrStr = CKEDITOR.config['g_arrStr'];
        var g_iMergeField = CKEDITOR.config['g_iMergeField'];


        var insertRuleValue;
        var insertRuleFieldsValue;
        var insertRuleConditionsValue;
        var ruleValFunction;
        var ruleValueObj;
        var state;
        var strRuleValue;
        var pinsertRuleValue;
		var pinsertRuleFieldsValue;
		var pinsertRuleConditionsValue;
        var imagepath = this.path;
        imagepath.replace("/ckeditor/", "");
        this.path = "../ckeditor-custom/contentruleblock/";//imagepath.substr(0, imagepath.indexOf("plugin.js"));

        //function when insert button is clicked
        var p = {
            exec: function () {

                var strRuleType;
                try {
                    strRuleType = insertRuleValue();
                } catch (e) {
                    strRuleType = '';
                }


                var strMergeField;

                try {
                    strMergeField = insertRuleFieldsValue();
                } catch (e) {
                    strMergeField = '';
                }

                var strOperator;
                try {

                    strOperator = insertRuleConditionsValue()

                } catch (e) {
                    strOperator = '';
                }


                var strRule = "";

                try {

                    strValue = ruleValFunction();

                } catch (e) {
                    strValue = '';
                }
                if (g_arrRuleMap[strRuleType] != "insertBlock" && (!strValue || /^\s*$/.test(strValue) || 0 == strValue.length)) {
                    alert('Please select a value');
                } else {

                    var numberRegexp = /^[+-]?[0-9]+$/;

                    if (!numberRegexp.test(strValue)) {
                        // it doesn't look like a number
                        strValue = "\"" + strValue + "\"";
                    }

                    switch (g_arrRuleMap[strRuleType]) {

                    case "if":
                    case "elseif":
                        {
                            switch (g_arrOperatorMap[strOperator]) {
                            case "notLike":
                                {

                                    strRule = "<p><b>$(not " + strMergeField + " like " + strValue + ")</b></p>";
                                    break;
                                }
                            case "notContains":
                                {
                                    strRule = "<p><b>$(not " + strMergeField + " contains " + strValue + ")</b></p>";
                                    break;
                                }
                            default:
                                {
                                    strRule = "<p><b>$(" + g_arrRuleMap[strRuleType] + " " + strMergeField + " " + g_arrOperatorMap[strOperator] + " " + strValue + ")</b></p>";
                                    break;
                                }
                            }
                            if (g_arrRuleMap[strRuleType] == "if") {
                                strRule += editor.getSelection().getSelectedText() + "<p><b>$(endif)</b></p>";
                            }
                            break;
                        }
                    case "createBlock":
                        {

                            strRule = "<p><b>$(DefineBlock " + strValue + ")</b></p>";
                            strRule += editor.getSelection().getSelectedText() + "<p><b>$(EndBlock)</b></p>";
                            break;
                        }
                    case "insertBlock":
                        {
                            strRule = "<p><b>$(InsertBlock \"" + strMergeField + "\")</b></p>";
                            break;
                        }
                    default:

                    }

                    editor.insertHtml(strRule);

                }

            }

        };


        editor.addCommand('insertRuleButton', p);




        function getInsertRuleComboValue() {
            return this.getValue();
        }

        function getInsertRuleFieldsComboValue() {
            return this.getValue();
        }

        function getInsertRuleConditionsComboValue() {
            return this.getValue();
        }

        ///////////////////////////////////////////////

        editor.ui.addRichCombo('insertRule', {
            label: g_arrStr["ifelsebar"],
            id: 'insertRule',
            className: 'cke_format',

            panel: {
                css: [config.contentsCss, CKEDITOR.getUrl(CKEDITOR.skin.getPath('editor'))],
                voiceLabel: lang.panelVoiceLabel
            },


            init: function () {
                combo = this;

                insertRuleValue = CKEDITOR.tools.bind(getInsertRuleComboValue, combo);

                for (i = 0; i < g_arrRule.length; i++) {
                    combo.add(g_arrRule[i], g_arrRule[i], g_arrRule[i]);
                }

            },

            onRender: function() {
				editor.on("selectionChange", function(ev) {
					this.setValue(pinsertRuleValue);
				}, this);
			},

            onClick: function (value) {

                editor.focus(); //focus on previously selected value.
                pinsertRuleValue = value;
                this.setValue(value);
                insertRuleValue = CKEDITOR.tools.bind(getInsertRuleComboValue, combo);

                var mergeField = editor.ui.get('insertRuleFields');
                var mergeCondition = editor.ui.get('insertRuleConditions');
                var mergeFieldValue = editor.ui.get('insertRuleValueButton');

                if (g_arrRuleMap[value] == "createBlock") {
                    try {
                        mergeField.disable();
                        mergeCondition.disable();
                        mergeFieldValue.setState(CKEDITOR.TRISTATE_ON);
                        state = true;

                    } catch (e) {
                        state = true;
                    }
                } else if (g_arrRuleMap[value] == "insertBlock") {
                    try {
                        mergeField.enable();
                        mergeCondition.disable();
                        mergeFieldValue.setState(CKEDITOR.TRISTATE_DISABLED);
                        state = true;
                    } catch (e) {
                        state = true;
                    }
                } else if (state == true) {
                    mergeField.enable();
                    mergeCondition.enable();
                    mergeFieldValue.setState(CKEDITOR.TRISTATE_ON);
                }

                editor.fire('saveSnapshot');


            }


        });

        editor.ui.addRichCombo('insertRuleFields', {
            label: g_arrStr["mergefield"],
            id: 'jsmergefield',
            title: g_arrStr["mergefield"],
            multiSelect: false,
            className: 'cke_format',
            panel: {
                css: [config.contentsCss, CKEDITOR.getUrl(CKEDITOR.skin.getPath('editor'))],
                voiceLabel: lang.panelVoiceLabel
            },


            init: function () {
                ruleCombo = this;

                insertRuleFieldsValue = CKEDITOR.tools.bind(getInsertRuleFieldsComboValue, ruleCombo);

                /*var ruleValue = '';
                                 try{ruleValue = insertRuleValue()}catch(e){}

           			if(ruleValue == '' || g_arrRuleMap[ruleValue] == "createBlock" )
           			  return;
                                */

                for (i = 0; i < g_arrItem[g_iMergeField].length; i++) {

                    ruleCombo.add(g_arrItem[g_iMergeField][i], g_arrItem[g_iMergeField][i], g_arrItem[g_iMergeField][i]);
                }



            },

            disable: function (value) {
                ruleCombo.setState(CKEDITOR.TRISTATE_DISABLED);
            },
            enable: function (value) {
                ruleCombo.setState(CKEDITOR.TRISTATE_ON);
            },

            onRender: function() {
				editor.on("selectionChange", function(ev)
				{
					this.setValue(pinsertRuleFieldsValue);
					if(g_arrRuleMap[pinsertRuleValue] == "createBlock")
					{
						this.disable();
						return;
					}
				}, this);
			},

            onClick: function (value) {
				pinsertRuleFieldsValue = value;
                this.setValue(value);
                editor.fire('saveSnapshot');
            }

        });

        editor.ui.addRichCombo('insertRuleConditions', {
            label: g_arrStr["operator"],
            id: 'jsoperator',
            title: g_arrStr["operator"],
            multiSelect: false,
            className: 'cke_format',
            panel: {
                css: [config.contentsCss, CKEDITOR.getUrl(CKEDITOR.skin.getPath('editor'))],
                voiceLabel: lang.panelVoiceLabel
            },



            init: function () {
                conditionCombo = this;
                insertRuleConditionsValue = CKEDITOR.tools.bind(getInsertRuleFieldsComboValue, conditionCombo);

                /*  var ruleValue = '';
                                 try{ruleValue = insertRuleValue()}catch(e){}

				if(ruleValue == '' || g_arrRuleMap[ruleValue] == "createBlock" || g_arrRuleMap[ruleValue] == "insertBlock")
				  return;
                                */

                for (i = 0; i < g_arrOperator.length; i++) {

                    conditionCombo.add(g_arrOperator[i], g_arrOperator[i], g_arrOperator[i]);
                }


            },
            disable: function (value) {
                conditionCombo.setState(CKEDITOR.TRISTATE_DISABLED);
            },

            enable: function (value) {
                conditionCombo.setState(CKEDITOR.TRISTATE_ON);
            },

            onRender: function() {
				editor.on("selectionChange", function(ev) {
					this.setValue(pinsertRuleConditionsValue);
					if(g_arrRuleMap[pinsertRuleValue] == "createBlock" || g_arrRuleMap[pinsertRuleValue] == "insertBlock")
					{
						this.disable();
						return;
					}
				}, this);
			},

            onClick: function (value) {
				pinsertRuleConditionsValue = value;
                this.setValue(value);
                editor.fire('saveSnapshot');
            }
        });


        editor.ui.addButton('insertRuleValueButton', {
            label: g_arrStr["value"],
            command: 'ruleValueDialog',
            icon: this.path + 'value.png'

        });




        function getRuleValue() {
            return this.getValue();
        }


        editor.addCommand('ruleValueDialog', new CKEDITOR.dialogCommand('ruleValueDialog'));

        CKEDITOR.dialog.add('ruleValueDialog', function (editor) {
            return {

                title: g_arrStr["value"],
                minWidth: 200,
                minHeight: 30,
                onShow: function () {

                    var prevValue;

                    try {

                        prevValue = strRuleValue;
                    } catch (e) {
                        prevValue = '';
                    }

                    this.setupContent(prevValue);
                },
                contents: [{
                        id: 'ruleValueInfo',
                        label: g_arrStr["value"],
                        elements: [{
                                type: 'text',
                                id: 'ruleValue',
                                label: g_arrStr["value"],
                                validate: CKEDITOR.dialog.validate.notEmpty("Rule Value cannot be empty"),
                                setup: function (value) {

                                    this.setValue(value);


                                    var insertrlvalue;
                                    try {
                                        insertrlvalue = g_arrRuleMap[insertRuleValue()];
                                    } catch (e) {
                                        insertrlvalue = '';
                                    }

                                    if (insertrlvalue == "insertBlock")
                                        this.disable();
                                    else
                                        this.enable();
                                }
                            }
                        ]
                    }
                ],
                buttons: [CKEDITOR.dialog.okButton, CKEDITOR.dialog.cancelButton],
                onOk: function () {

                    var dialog = this;
                    editor = this.getParentEditor();

                    ruleValueObj = this.getContentElement('ruleValueInfo', 'ruleValue');
                    ruleValFunction = CKEDITOR.tools.bind(getRuleValue, ruleValueObj);
                    strRuleValue = ruleValFunction();
                }
            };
        });




        editor.ui.addButton('insertRuleButton', {
            label: g_arrStr["addrule"],
            title: g_arrStr["addrule"],
            command: 'insertRuleButton',
            icon: this.path + 'insert.jpg'

        });


    }


});