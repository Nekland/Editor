/**
 * This file is a part of nekland editor package
 *
 * (c) Nekland <nekland.fr@gmail.fr>
 *
 * For the full license, take a look to the LICENSE file
 * on the root directory of this project
 */

/**
 * Transform to p-text.
 *
 * If the html uses div, it should transform them to paragraph
 */
window.nekland.Editor.prototype.pize = function(str) {
    str = $.trim(str);
    if (str === '' || str === '<p></p>') {
        return '<p><br /></p>';
    }
    return str;
};

window.nekland.Editor.prototype.clearHtml = function(html) {
    return html.replace(/&nbsp;/g, ' ', html);
};