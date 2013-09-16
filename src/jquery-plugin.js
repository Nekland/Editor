/**
 * This file is a part of nekland editor package
 *
 * (c) Nekland <nekland.fr@gmail.fr>
 *
 * For the full license, take a look to the LICENSE file
 * on the root directory of this project
 */

// The jQuery plugin
(function($) {
    $.fn.neklandEditor = function(_options, _templates) {

        this.each(function() {
            var $this, editor;
            $this = $(this);
            editor = $this.data('nekland-editor');
            if (!editor) {
                return $this.data('nekland-editor', new window.nekland.Editor($this, _options, _templates));
            }
        });

        return this;
    };
})(jQuery);