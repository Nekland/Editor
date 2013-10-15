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

/**
 * Take an html string and clean it
 */
window.nekland.Editor.prototype.clearHtml = function(html) {
	var partial = html.replace(/&nbsp;/g, ' ', html),
		res     = '',
		htmlLen = partial.length,

		// Parser vars
		lastChar   = '',
		lastIndent = 0;

	for (var i = 0; i < htmlLen; i++) {
		if (lastChar === '') {

		}
		if (partial[i] === '<') {
			
		}
	}


    return partial;
};