/**
 * This file is a part of nekland editor package
 *
 * (c) Nekland <nekland.fr@gmail.fr>
 *
 * For the full license, take a look to the LICENSE file
 * on the root directory of this project
 */

/**
 * Add events on the generated dom
 */
window.nekland.Editor.prototype.addEvents = function() {
    var $switcher, self = this;

    $switcher = this.$wrapper.find('.nekland-switch-button');
    $switcher.click($.proxy(this.switchEditor, this, $switcher));

    // Added events on buttons
    this.$wrapper.find('.nekland-editor-command').click(function() {

        return self.execute($(this));
    });

    // Added event on the editor when user add any character
    this.$editor.keyup($.proxy(this.onKeyUp, this));

    this.addModulesEvents();

};

window.nekland.Editor.prototype.addModulesEvents = function() {
    var _i, _len;

    for (_i = 0, _len = this.modules.length; _i < _len; _i++) {
        if (this.modules[_i].addEvents !== undefined && typeof this.modules[_i].addEvents === 'function') {
            $.proxy(this.modules[_i].addEvents, this)();
        }
    }
};

/**
 * Define the behavior on key up
 * on the editor
 *
 * @param event
 */
window.nekland.Editor.prototype.onKeyUp = function(event) {
    this.synchronize();
};

/**
 * Prevent enter
 * @param e Event
 */
window.nekland.Editor.prototype.removeEnter = function(e) {
    if (e.which === 13) {
        return e.preventDefault();
    }
};