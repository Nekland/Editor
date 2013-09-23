/**
 * This file is a part of nekland editor package
 *
 * (c) Nekland <nekland.fr@gmail.fr>
 *
 * For the full license, take a look to the LICENSE file
 * on the root directory of this project
 */

/**
 * Return an tralator object (with the method "translate" and translations inside)
 */
window.nekland.Editor.prototype.getTranslator = function (lang) {

    // Defining the translator class
    var translator = function (lang) {
    
        this.translations = window.nekland.lang.editor[lang];
    };

    /**
     * Add module translations to current translations
     * (the process merge them)
     *
     * @param modules An array of modules
     */
    translator.prototype.addModuleTranslations = function (modules) {
        var _i, _len, _translations;

        // Load translations from modules
        for (_i = 0, _len = modules.length; _i < _len; _i++) {
            if (modules[_i].getTranslations !== undefined && typeof modules[_i].getTranslations == 'function') {
                _translations = modules[_i].getTranslations()[lang];

                if (_translations !== undefined) {
                    this.translations = $.extend({}, this.translations, _translations);
                }
            }
        }
    };

    /**
     * Translate a string
     *
     * @param str     A string: the key of the translation
     * @param options An object of options that allow transformation of translations
     */
    translator.prototype.translate = function(str, options) {
        var res;

        // Default value for options is {}
        if (options === undefined) {
            options = {};
        }

        // Check if the translation exists
        if (this.translations[str] !== undefined) {
            res = this.translations[str];
        } else {
            throw new Error('Translation missing');
        }

        // Execute options
        if (options.ucfirst !== undefined) {
            res = res.charAt(0).toUpperCase() + res.slice(1);
        }

        return res;
    };


    return new translator(lang);
};