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
     * Translate a string
     *
     * @param str     A string: the key of the translation
     * @param options An object of options that allow transformation of translations
     */
    translator.prototype.translate = function(str, options) {
        var res;

        // Default value for options is {}
        if (options == null) {
            options = {};
        }

        // Check if the translation exists
        if (this.translations[str] != null) {
            res = this.translations[str];
        } else {
            throw new Error('Translation missing');
        }

        // Execute options
        if (options.ucfirst != null) {
            res = res.charAt(0).toUpperCase() + res.slice(1);
        }

        return res;
    };


    return new translator(lang);
};