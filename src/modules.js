/**
 * This file is a part of nekland editor package
 *
 * (c) Nekland <nekland.fr@gmail.fr>
 *
 * For the full license, take a look to the LICENSE file
 * on the root directory of this project
 */


/**
 * All modules should be register in this variable.
 *
 * Each module have to implement theses methods:
 *      - getTemplateBefore: return a string that will be insert before the editor
 *      - getTemplateAfter:  return a string that will be insert after the editor
 *      - addEvent:          simply add events on some elements of the template
 *      - getName:           return a string witch represent the module
 *      - execute:           return a boolean witch say if the event should be prevent or not
 */
window.nekland.Editor.modules = [];

window.nekland.Editor.prototype.initModules = function() {
    var _i, _len;

    this.modules = [];

    for (_i = 0, _len = this.modules.length; _i < _len; _i++) {
        this.modules.push(new window.nekland.Editor.modules(this.translator));
    }

    this.checkModules();
};

/**
 * Check if all modules are valid
 * Add them the translator
 */
window.nekland.Editor.prototype.checkModules = function() {
    var _i, _len;

    /**
     * Check if the module implements the needeed methods
     */
    function checkModule (module) {
        if (
            typeof module['getTemplateBefore'] != 'function' || 
            typeof module['getTemplateAfter']  != 'function' || 
            typeof module['addEvents']         != 'function' ||
            typeof module['getName']           != 'function' ||
            typeof module['execute']           != 'function'
        ) {
            return false;
        }

        return true;
    }

    for (_i = 0, _len = this.modules.length; _i < _len; _i++) {
        if (!checkModule(this.modules[_i])) {
            var name = this.modules[_i].getName ? this.modules[_i].getName() : this.modules[_i].toString();

            throw 'A module does\'t work. Check if the following module implements all needed methods: \"' + name + '"';
        }
        this.modules[_i].translate = this.translate;
    }
};