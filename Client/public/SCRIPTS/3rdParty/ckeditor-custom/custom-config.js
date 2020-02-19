/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/
(function () {


})();


CKEDITOR.editorConfig = function (config) {
    // Define changes to default configuration here. For example:
    // config.language = 'fr';
    // config.uiColor = '#AADC6E';


    config.height = '450px';
    config.fullPage = true;    
    config.entities = false;
    config.htmlEncodeOutput = false;
    config.enterMode = CKEDITOR.ENTER_BR;
    config.allowedContent = true;



    config.toolbar_EmailBlock = [{
            name: 'document',
            items: ['Source', '-', 'NewPage', 'DocProps', 'Preview', 'Print', '-', 'Templates']
        }, {
            name: 'clipboard',
            items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo']
        }, {
            name: 'editing',
            items: ['Find', 'Replace', '-', 'SelectAll', '-', 'SpellChecker', 'Scayt']
        }, {
            name: 'forms',
            items: ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton',

                'HiddenField'
            ]
        },
            '/', {
            name: 'basicstyles',
            items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat']
        }, {
            name: 'paragraph',
            items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-',

                'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl'
            ]
        }, {
            name: 'links',
            items: ['Link', 'Unlink', 'Anchor']
        }, {
            name: 'insert',
            items: ['Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe']
        },
            '/', {
            name: 'styles',
            items: ['Styles', 'Format', 'Font', 'FontSize']
        }, {
            name: 'colors',
            items: ['TextColor', 'BGColor']
        }, {
            name: 'tools',
            items: ['Maximize', 'ShowBlocks', '-', 'About']
        },
            '/', {
            name: 'mergefieldsblock',
            items: ['mergefields']
        }, {
            name: 'mergefieldsblock',
            items: ['selectedValue']
        }, {
            name: 'mergefieldsblock',
            items: ['insert']
        },
            '/', {
            name: 'contentruleblock',
            items: ['insertRule', 'insertRuleFields', 'insertRuleConditions', 'insertRuleValueButton']
        }, {
            name: 'contentruleblock',
            items: ['insertRuleButton']
        }

    ];

    config.toolbar_WebBlock = [{
            name: 'document',
            items: ['Source', '-', 'NewPage', 'DocProps', 'Preview', 'Print', '-', 'Templates']
        }, {
            name: 'clipboard',
            items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo']
        }, {
            name: 'editing',
            items: ['Find', 'Replace', '-', 'SelectAll', '-', 'SpellChecker', 'Scayt']
        }, {
            name: 'forms',
            items: ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton',
                    'HiddenField'
            ]
        },
            '/', {
            name: 'basicstyles',
            items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat']
        }, {
            name: 'paragraph',
            items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-',

                'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl'
            ]
        }, {
            name: 'links',
            items: ['Link', 'Unlink', 'Anchor']
        }, {
            name: 'insert',
            items: ['Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe']
        },
            '/', {
            name: 'styles',
            items: ['Styles', 'Format', 'Font', 'FontSize']
        }, {
            name: 'colors',
            items: ['TextColor', 'BGColor']
        }, {
            name: 'tools',
            items: ['Maximize', 'ShowBlocks', '-', 'About']
        },
            '/', {
            name: 'mergefieldsblock',
            items: ['mergefields']
        }, {
            name: 'mergefieldsblock',
            items: ['selectedValue']
        }, {
            name: 'mergefieldsblock',
            items: ['insert']
        }
    ];

    config.toolbar_BaseBlock = [{
            name: 'document',
            items: ['Source', '-', 'NewPage', 'DocProps', 'Preview', 'Print', '-', 'Templates']
        }, {
            name: 'clipboard',
            items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo']
        }, {
            name: 'editing',
            items: ['Find', 'Replace', '-', 'SelectAll', '-', 'SpellChecker', 'Scayt']
        }, {
            name: 'forms',
            items: ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton',
                    'HiddenField'
            ]
        },
            '/', {
            name: 'basicstyles',
            items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat']
        }, {
            name: 'paragraph',
            items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-',

                'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl'
            ]
        }, {
            name: 'links',
            items: ['Link', 'Unlink', 'Anchor']
        }, {
            name: 'insert',
            items: ['Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe']
        },
            '/', {
            name: 'styles',
            items: ['Styles', 'Format', 'Font', 'FontSize']
        }, {
            name: 'colors',
            items: ['TextColor', 'BGColor']
        }, {
            name: 'tools',
            items: ['Maximize', 'ShowBlocks', '-', 'About']
        },

    ];


};