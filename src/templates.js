/**
 * This file is a part of nekland editor package
 *
 * (c) Nekland <nekland.fr@gmail.fr>
 *
 * For the full license, take a look to the LICENSE file
 * on the root directory of this project
 */

/**
 * Return an object witch contains the following methods:
 * -> load($domElement, uid) with:
 *    $domElement: The element on what is bind the editor (basically a textarea)
 *    uid:         an uniq id for the wrapper
 * 
 * @param modules array of modules, each one has his template
 */
window.nekland.Editor.prototype.getTemplates = function() {
    var self = this;
    return {
        main: function(size) {
            return '<div class="nekland-editor-html form-control" style="width:' + size[0] + 'px;height:' + size[1] + 'px" contenteditable="true"></div>';
        },
        switchButton: function(css_class) {
            if (css_class == null) {
                css_class = 'nekland-switch-button';
            }
            return '<a href="#" class="' + css_class + '"></a>';
        },
        /**
         * Generate what need to be show before the text zone
         *
         * @param size An array of int witch represent the height/width
         */
        before: function(size) {
            var button, tpl, _i, _len;
            tpl = '<div>';

            // Get each module and execute the getTemplate method
            for (_i = 0, _len = self.modules.length; _i < _len; _i++) {
                tpl += self.modules[_i].getTemplateBefore();
            }
            tpl += '</div>';
            return tpl += this.main(size);
        },
        /**
         * Generate what need to be show before the text zone
         */
        after: function () {
            var tpl = this.switchButton(), _i, _len;

            // Get each module and execute the getTemplate method
            for (_i = 0, _len = self.modules.length; _i < _len; _i++) {
                tpl += self.modules[_i].getTemplateAfter();
            }

            return tpl;
        },
        /**
         * Load all templates in the DOM
         *
         * @param $element jQuery object of the original DOM element
         * @param uid String of a uniqid
         * @return jQuery object of jQuery witch represent the wrapper
         */
        load: function($element, uid) {
            var $wrapper, html;

            // Creating wrapper
            $wrapper = $('<div>', {
                id: 'nekland-editor-wrapper-' + uid
            });

            // Place wrapper
            $element.wrap($wrapper);

            // insert bunton list and editor
            $element.before(this.before([$element.width(), $element.height()]));
            
            // Insert switch button
            $element.after(this.after());

            // Hide original element
            $element.css('display', 'block').hide();

            // Re-get the wrapper in the dom
            // (if not, following functions will not work as expected)
            $wrapper = $('#nekland-editor-wrapper-' + uid);
            if (html = $element.val()) {
                $wrapper.find('.nekland-editor-html').html(html);
            } else {
                $wrapper.find('.nekland-editor-html').html('<p></p>');
            }
            $wrapper.find('.nekland-switch-button').html(self.translator.translate('swapToHtml', {
                ucfirst: true
            }));

            return $wrapper;
        }
    };
};