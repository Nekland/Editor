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
window.nekland.Editor.prototype.execute = function ($button) {
    var command = $button.data('editor-module'),
        _i, _len, res;

    for (_i = 0, _len = this.modules.length; _i < _len; _i++) {
        if (this.modules[_i].getName() == command) {
            if (this.$editor.is(':visible')) {
                res = this.modules[_i].execute($button);
            }
        }
    }

    this.synchronize();

    return res || false;
};