CKEDITOR.plugins.add('mergefieldsblock', {

    requires: ['richcombo'], //, 'styles' ],

    init: function (editor) {

        var config = editor.config,
            lang = editor.lang.format;
        var mergeField;
        var set_value = -1;
        var combo;
        // Gets the list of tags from the settings.
        var tags = []; //new Array();
        var list_drop;
        var responseFormsValues = [];
        var mergeFieldSelectValues = [];
        var currentValue = 100;
        var buildListHasRunOnce = false;
        var arrGroupName = [];
        var valueToInsert;
        arrGroupName = CKEDITOR.config['g_arrCategory'];
        var g_arrCategory = CKEDITOR.config['g_arrCategory'];
        var g_arrItem = CKEDITOR.config['g_arrItem'];
        var g_arrRule = CKEDITOR.config['g_arrRule'];
        var g_arrRuleMap = CKEDITOR.config['g_arrRuleMap'];
        var g_arrOperator = CKEDITOR.config['g_arrOperator'];
        var g_arrOperatorMap = CKEDITOR.config['g_arrOperatorMap'];
        var g_arrStr = CKEDITOR.config['g_arrStr'];
        var g_iMergeField = CKEDITOR.config['g_iMergeField'];
        var insertMergeFieldValue;
        var pinsertMergeFieldValue;
		var pParentselectedValue;

        //Social Sharing URLs//
        var socialSharingURL = [];
        var socialSharingImagePath = [];

        socialSharingURL[0] = 'http://www.facebook.com/sharer.php?t=';
        socialSharingURL[1] = 'http://www.twitter.com/intent/tweet?text=';
        socialSharingURL[2] = 'http://www.linkedin.com/shareArticle?mini=true&title=';
        socialSharingURL[3] = 'http://www.tumblr.com/share?s=&v=3&t=';
        socialSharingURL[4] = 'http://pinterest.com/pin/create/button/?title=';
        socialSharingURL[5] = 'https://plus.google.com/share?title=';
        socialSharingURL[6] = 'http://www.blogger.com/start?successUrl/blog-this.g?t=';
        socialSharingURL[7] = 'http://www.myspace.com/Modules/PostTo/Pages/default.aspx?t=';
        socialSharingURL[8] = 'http://www.delicious.com/save?title=';

        var imagepath = this.path;
        imagepath.replace("/ckeditor/", "");
        this.path = "../ckeditor-custom/mergefieldsblock/";//imagepath.substr(0, imagepath.indexOf("plugin.js"));

        socialSharingImagePath[0] = this.path + 'fb16.jpg';
        socialSharingImagePath[1] = this.path + 'tw16.jpg';
        socialSharingImagePath[2] = this.path + 'ln16.jpg';
        socialSharingImagePath[3] = this.path + 'tm16.jpg';
        socialSharingImagePath[4] = this.path + 'pin16.jpg';
        socialSharingImagePath[5] = this.path + 'gplus16.jpg';
        socialSharingImagePath[6] = this.path + 'blog16.jpg';
        socialSharingImagePath[7] = this.path + 'space16.jpg';
        socialSharingImagePath[8] = this.path + 'delc16.jpg';


        //remove once selected

        function removeAllOptions(combo) {
            combo = getSelect(combo);
            while (combo.getChild(0) && combo.getChild(0).remove()) { /*jsl:pass*/ }
        }

        function getSelect(obj) {
            if (obj && obj.domId && obj.getInputElement().$) // Dialog element.
                return obj.getInputElement();
            else if (obj && obj.$)
                return obj;
            return false;
        }

        var buildList = function buildList() {

            for (j = 0; j < arrGroupName.length; j++) {
                combo.startGroup(arrGroupName[j]);
                var arrItem = CKEDITOR.config['g_arrItem'];
                for (i = 0; i < arrItem[j].length; i++) {
                    combo.add(arrItem[j][i]);
                }
            }
        };



        function selectMergeFieldListener(value) {

            currentValue = value;

            var o = editor.ui.get('selectedValue');
            o.setValue("");
            o.reset(value);
        };


        /////////////////////////////////////////////////////////////////Merge Fields Combo Box///////////////////

        function getInsertFieldComboValue() {
            return this.getValue();
        }

        editor.ui.addRichCombo('selectedValue', {
            label: g_arrStr["item"],
            id: 'selectedValue',
            title: g_arrStr["item"],
            voiceLabel: g_arrStr["item"],
            className: 'cke_format',
            multiSelect: false,

            panel: {
                css: [config.contentsCss, CKEDITOR.getUrl(CKEDITOR.skin.getPath('editor')) ],
                voiceLabel: lang.panelVoiceLabel
            },

            init: function () {
                combo = this;

                if (buildListHasRunOnce == false) {
                    var rebuildList = CKEDITOR.tools.bind(buildList, combo);
                    rebuildList();
                    buildListHasRunOnce = true;
                    var counter = 0;
                    this.commit();
                    for (var GroupName in arrGroupName) {

                        if(arrGroupName[counter++] == set_value)
                            continue;
                        combo.hideGroup(arrGroupName[GroupName]);
                    }

                }

                insertMergeFieldValue = CKEDITOR.tools.bind(getInsertFieldComboValue, combo);
            },

            reset: function (value) {

                var count = 0;
				pinsertMergeFieldValue="";
                if (buildListHasRunOnce == false) {
                    set_value = value;
                } else {
                    combo.showAll();
                    for (var GroupName in arrGroupName) {

                        if (arrGroupName[count++]== value)
                            continue;
                        combo.hideGroup(arrGroupName[GroupName]);
                    }

                }

            },

            onRender: function() {
				editor.on("selectionChange", function(ev) {
					this.setValue(pinsertMergeFieldValue);
				}, this);
			},

            //Listener for the event
            onClick: function (value) {
					pinsertMergeFieldValue = value;
                    this.setValue(value);
            }
        });




        ///////////////////////////////////////////////////////////////// Combo Box///////////////////
        editor.ui.addRichCombo('mergefields', {
            label: g_arrStr["category"],
            id: 'mergeFields',
            title: g_arrStr["category"],
            voiceLabel: g_arrStr["category"],
            className: 'cke_format',
            multiSelect: false,

            panel: {
                css: [config.contentsCss,  CKEDITOR.getUrl(CKEDITOR.skin.getPath('editor') )],
                voiceLabel: lang.panelVoiceLabel
            },

            init: function () {

                //this.startGroup( "asfdasfas" );
                var arr_category = CKEDITOR.config['g_arrCategory'];
                for (i = 0; i < arr_category.length; i++) {
                    this.add(arr_category[i], arr_category[i], arr_category[i]);
                }
            },

			onRender: function() {
				editor.on("selectionChange", function(ev) {
					this.setValue(pParentselectedValue);
				}, this);
			},

            onClick: function (value) {

                editor.focus(); //focus on previously selected value.
                pParentselectedValue = value;
				this.setValue(value);
                editor.on('selectMergeField', selectMergeFieldListener(value));
                editor.fire('saveSnapshot');

            }
        });

        var insertValue = {
            exec: function () {
                editor.focus();
                editor.fire('saveSnapshot');
                try {
                    if (insertMergeFieldValue().split('{')[1]) {
                        editor.addCommand('socialDialog', new CKEDITOR.dialogCommand('socialSharingDialog'));
                        var dialogCommand = editor.getCommand('socialDialog');
                        dialogCommand.exec();
                        var dialog = CKEDITOR.dialog.getCurrent();
                        dialog.setValueOf('social', 'title', insertMergeFieldValue().split('{')[0]);
                        dialog.setValueOf('social', 'url', insertMergeFieldValue().split('{')[1].split('}')[0]);
                    } else {
                        editor.insertHtml(insertMergeFieldValue());
                    }
                } catch (Exception) {
                    alert('Please select value');
                }
                editor.fire('saveSnapshot');
            }

        };
        /////////////////////////////////////////////////////////////////Insert Button///////////////////
        editor.addCommand('insert', insertValue);
        editor.ui.add('insert', CKEDITOR.UI_BUTTON, {
            label: g_arrStr["additem"],
            command: 'insert',
            icon: this.path + 'insert.jpg'
        });

        CKEDITOR.dialog.add('socialSharingDialog', function (editor) {
            return {
                title: 'Social Sharing',
                minWidth: 600,
                minHeight: 400,
                contents: [{
                        id: 'social',
                        label: 'Social Sharing',
                        elements: [

                            {
                                type: 'html',
                                html: 'This dialog lets you create social sharing links.'
                            }, {
                                type: 'textarea',
                                rows: 2,
                                cols: 40,
                                id: 'title',
                                label: 'Title',
                                validate: CKEDITOR.dialog.validate.notEmpty('The Title field cannot be empty.'),
                                required: true,
                                commit: function (data) {
                                    data.title = this.getValue();
                                }
                            }, {
                                type: 'textarea',
                                rows: 2,
                                cols: 40,
                                id: 'url',
                                label: 'URL',
                                enable: false,
                                validate: CKEDITOR.dialog.validate.notEmpty('The URL field cannot be empty.'),
                                required: true,
                                commit: function (data) {
                                    data.url = this.getValue();
                                }
                            }, {
                                type: 'hbox',
                                widths: ['25%', '25%', '25%'],
                                children: [{
                                        type: 'checkbox',
                                        id: 'facebook',
                                        label: 'Facebook',
                                        'default': true,
                                        commit: function (data) {
                                            data.fb = this.getValue();
                                        }
                                    }, {
                                        type: 'checkbox',
                                        id: 'twitter',
                                        label: 'Twitter',
                                        'default': true,
                                        commit: function (data) {
                                            data.tw = this.getValue();
                                        }
                                    }, {
                                        type: 'checkbox',
                                        id: 'linkedin',
                                        label: 'Linked In',
                                        'default': true,
                                        commit: function (data) {
                                            data.ln = this.getValue();
                                        }
                                    }
                                ]
                            }, {
                                type: 'hbox',
                                widths: ['25%', '25%', '25%'],
                                children: [

                                    {
                                        type: 'checkbox',
                                        id: 'tumblr',
                                        label: 'Tumblr',
                                        'default': true,
                                        commit: function (data) {
                                            data.tm = this.getValue();
                                        }
                                    }, {
                                        type: 'checkbox',
                                        id: 'pinit',
                                        label: 'PInterest',
                                        'default': true,
                                        commit: function (data) {
                                            data.pin = this.getValue();
                                        }
                                    }, {
                                        type: 'checkbox',
                                        id: 'gplus',
                                        label: 'GooglePlus',
                                        'default': true,
                                        commit: function (data) {
                                            data.gplus = this.getValue();
                                        }
                                    }
                                ]
                            }, {
                                type: 'hbox',
                                widths: ['25%', '25%', '25%'],
                                children: [

                                    {
                                        type: 'checkbox',
                                        id: 'blogger',
                                        label: 'Blogger',
                                        'default': true,
                                        commit: function (data) {
                                            data.blog = this.getValue();
                                        }
                                    }, {
                                        type: 'checkbox',
                                        id: 'Myspace',
                                        label: 'My Space',
                                        'default': true,
                                        commit: function (data) {
                                            data.space = this.getValue();
                                        }
                                    }, {
                                        type: 'checkbox',
                                        id: 'delicious',
                                        label: 'Delicious',
                                        'default': true,
                                        commit: function (data) {
                                            data.delc = this.getValue();
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ],

                onOk: function () {

                    var dialog = this;
                    data = {};
                    this.commitContent(data);


                    if (data.fb) {
                        img = editor.document.createElement('img');
                        link = editor.document.createElement('a');
                        img.setAttribute('src', socialSharingImagePath[0]);
                        img.setAttribute('alt', 'facebook');
                        img.setAttribute('border', '0');
                        editor.document.createElement('table');
                        var url = socialSharingURL[0] + data.title + '&u=' + data.url;
                        link.setAttribute('href', url);
                        link.setAttribute('target', '_blank');

                        link.append(img);
                        editor.insertElement(link);
                        editor.insertHtml('&nbsp;&nbsp;');

                    }
                    if (data.tw) {
                        img = editor.document.createElement('img');
                        link = editor.document.createElement('a');

                        img.setAttribute('src', socialSharingImagePath[1]);
                        img.setAttribute('alt', 'twitter');
                        img.setAttribute('border', '0');
                        var url = socialSharingURL[1] + data.title + '&url=' + data.url;
                        link.setAttribute('href', url);
                        link.setAttribute('target', '_blank');

                        link.append(img);
                        editor.insertElement(link);
                        editor.insertHtml('&nbsp;&nbsp;');
                    }
                    if (data.ln) {
                        img = editor.document.createElement('img');
                        link = editor.document.createElement('a');


                        img.setAttribute('src', socialSharingImagePath[2]);
                        img.setAttribute('alt', 'linkedin');
                        img.setAttribute('border', '0');
                        var url = socialSharingURL[2] + data.title + '&url=' + data.url;
                        link.setAttribute('href', url);
                        link.setAttribute('target', '_blank');

                        link.append(img);
                        editor.insertElement(link);
                        editor.insertHtml('&nbsp;&nbsp;');
                    }
                    if (data.tm) {
                        img = editor.document.createElement('img');
                        link = editor.document.createElement('a');
                        img.setAttribute('src', socialSharingImagePath[3]);
                        img.setAttribute('alt', 'Tumblr');
                        img.setAttribute('border', '0');
                        var url = socialSharingURL[3] + data.title + '&u=' + data.url;
                        link.setAttribute('href', url);
                        link.setAttribute('target', '_blank');

                        link.append(img);
                        editor.insertElement(link);
                        editor.insertHtml('&nbsp;&nbsp;');
                    }
                    if (data.pin) {
                        img = editor.document.createElement('img');
                        link = editor.document.createElement('a');
                        img.setAttribute('src', socialSharingImagePath[4]);
                        img.setAttribute('alt', 'Pinterest');
                        img.setAttribute('border', '0');
                        var url = socialSharingURL[4] + data.title + '&url=' + data.url;
                        link.setAttribute('href', url);
                        link.setAttribute('target', '_blank');
                        link.append(img);
                        editor.insertElement(link);
                        editor.insertHtml('&nbsp;&nbsp;');
                    }
                    if (data.gplus) {
                        img = editor.document.createElement('img');
                        link = editor.document.createElement('a');

                        img.setAttribute('src', socialSharingImagePath[5]);
                        img.setAttribute('alt', 'linkedin');
                        img.setAttribute('border', '0');
                        var url = socialSharingURL[5] + data.title + '&url=' + data.url;
                        link.setAttribute('href', url);
                        link.setAttribute('target', '_blank');
                        link.append(img);
                        editor.insertElement(link);
                        editor.insertHtml('&nbsp;&nbsp;');
                    }
                    if (data.blog) {
                        img = editor.document.createElement('img');
                        link = editor.document.createElement('a');

                        img.setAttribute('src', socialSharingImagePath[6]);
                        img.setAttribute('alt', 'Blogger');
                        img.setAttribute('border', '0');
                        var url = socialSharingURL[6] + data.title + '&u=' + data.url;
                        link.setAttribute('href', url);
                        link.setAttribute('target', '_blank');
                        link.append(img);
                        editor.insertElement(link);
                        editor.insertHtml('&nbsp;&nbsp;');
                    }
                    if (data.space) {
                        img = editor.document.createElement('img');
                        link = editor.document.createElement('a');

                        img.setAttribute('src', socialSharingImagePath[7]);
                        img.setAttribute('alt', 'My Space');
                        img.setAttribute('border', '0');
                        var url = socialSharingURL[7] + data.title + '&u=' + data.url;
                        link.setAttribute('href', url);
                        link.setAttribute('target', '_blank');
                        link.append(img);
                        editor.insertElement(link);
                        editor.insertHtml('&nbsp;&nbsp;');
                    }
                    if (data.delc) {
                        img = editor.document.createElement('img');
                        link = editor.document.createElement('a');

                        img.setAttribute('src', socialSharingImagePath[8]);
                        img.setAttribute('alt', 'delicious');
                        img.setAttribute('border', '0');
                        var url = socialSharingURL[8] + data.title + '&url=' + data.url;
                        link.setAttribute('href', url);
                        link.setAttribute('target', '_blank');
                        link.append(img);
                        editor.insertElement(link);
                        editor.insertHtml('&nbsp;&nbsp;');
                    }

                }
            };
        });

    }


});