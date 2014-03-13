/**
 * This file is a part of nekland editor package
 *
 * (c) Nekland <nekland.fr@gmail.fr>
 *
 * For the full license, take a look to the LICENSE file
 * on the root directory of this project
 */

/**
 * Class NeklandEditor
 *
 * Everything is inside this class.
 */
window.nekland.Editor = function($domElement, _options, _templates) {
    // Constructor
    if (_options !== undefined) {
        _options = {};
    }

    if (_templates !== undefined) {
        _templates = {};
    }

    // Settings merging
    this.settings = $.extend(true, {}, {
        mode:    'classical',
        uid:     uniqid(),
        lang:    'en',
        modules: {}
    }, _options);

    // Translations loading
    this.translator   = this.getTranslator(this.settings.lang);

    // Modules loading
    // Note: the following operation needs the translator to inject it
    this.initModules();
    this.translator.addModuleTranslations(this.modules);

    // Recurcive/Create new object
    this.templates = $.extend(true, {}, this.getTemplates(), _templates);

    this.$wrapper = this.templates.load($domElement, this.settings.uid);
    this.$domElement = $domElement;
    this.$editor = this.$wrapper.find('.nekland-editor-html');
    this.$editor = this.$editor.html(this.pize(this.$editor.html()));
    this.lastKey = null;
    this.addEvents();
};

/**
 * Switch html editor/wysiwyg
 *
 * @param $switcher jQuery object of the switch link
 * @return false
 */
window.nekland.Editor.prototype.switchEditor = function($switcher) {

    // WYSIWYG to html
    if (this.$editor.is(':visible')) {
        // Even if synchronized on each keyup, we need to synch if there is no key pressed after the addition of an element
        this.synchronize();
        
        this.$domElement.css('height', this.$editor.css('height'));

        this.$editor.hide();
        this.$domElement.val(this.clearHtml(this.$domElement.val()));
        this.$domElement.show();

        $switcher.html(this.translator.translate('swapToText', {
            ucfirst: true
        }));

    // html to WYSIWYG
    } else {
        this.$editor.html(this.clearHtml(this.pize(this.$domElement.val())));
        this.$domElement.hide();
        this.$editor.show();

        $switcher.html(this.translator.translate('swapToHtml', {
            ucfirst: true
        }));
    }

    // Doesn't follow links after switch if defined as event
    return false;
};

/**
 * Synchronize content between the editor and the input
 */
window.nekland.Editor.prototype.synchronize = function() {
    return this.$domElement.val(this.$editor.html());
};