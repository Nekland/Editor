/**
 * This file is a part of nekland editor package
 *
 * (c) Nekland <nekland.fr@gmail.fr>
 *
 * For the full license, take a look to the LICENSE file
 * on the root directory of this project
 */

window.nekland.Editor.prototype.translate = function(str, options) {
    var res;
    if (options == null) {
        options = {};
    }
    if (this.translations[str] != null) {
        res = this.translations[str];
    } else {
        throw new Error('Translation missing');
    }
    if (options.ucfirst != null) {
        res = res.charAt(0).toUpperCase() + res.slice(1);
    }
    return res;
};