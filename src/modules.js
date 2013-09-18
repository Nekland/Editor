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
 */
window.nekland.Editor.modules = [];

/**
 * Check if all modules are valid
 * Add them the translator
 */
window.nekland.Editor.prototype.checkModules = function() {
    var _i, _len;

    function checkModule (module) {
        if (
            typeof this.modules[i]['getTemplateBefore'] != 'function' || 
            typeof this.modules[i]['getTemplateAfter'] != 'function' || 
            typeof this.modules[i]['addEvents'] != 'function'
        ) {
            return false;
        }
    }

    for (_i = 0, _len = this.modules.length; _i < _len; i++) {
        if (!checkModule(this.modules[i])) {
            throw "A module does\'t work. Check if it implements all needed methods.";
        }
        this.modules[i].translate = this.translate;
    }
};