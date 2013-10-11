/**
 * This file is a part of nekland editor package
 *
 * (c) Nekland <nekland.fr@gmail.fr>
 *
 * For the full license, take a look to the LICENSE file
 * on the root directory of this project
 */

/**
 * Execute a command, check each module and execute his method "execute"
 *
 * @param $button A jQuery object of the clicked button
 */
window.nekland.Editor.prototype.execute = function ($button, event) {
    var command = $button.data('editor-module'),
        _i, _len, res;

    // launch execution method for each module
    for (_i = 0, _len = this.modules.length; _i < _len; _i++) {
        if (this.modules[_i].getName() === command) {
            if (this.$editor.is(':visible')) {
                res = $.proxy(this.modules[_i].execute, this, $button)();
            }
        }
    }

    // Firefox fix
    if (this.compatibility('mozilla') && this.$editor.is(':visible')) {
        console.log ('hi');
        this.$editor.focus();
    }

    this.synchronize();

    if (res !== undefined) {
        return res;
    }

    return false;
};