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
 *      - addEvent:          simply add events on some elements of the template
 *      - getName:           return a string witch represent the module
 *      - execute:           return a boolean witch say if the event should be prevent or not
 */
window.nekland.Editor.modules = [];

window.nekland.Editor.prototype.initModules = function() {
    var _i, _len, _module;

    this.modules = [];

    for (_i = 0, _len = window.nekland.Editor.modules.length; _i < _len; _i++) {
        _module = new window.nekland.Editor.modules[_i](this.translator);

        this.checkModule(_module);

        if (typeof _module.setOptions === 'function' && this.settings.modules[_module.getName()]) {
            _module.setOptions(this.settings.modules[_module.getName()]);
        }

        this.modules.push(_module);
    }

};


/**
 * Check if the module implements the needeed methods
 *
 * @param module The module to check
 * @return true if there was no problem
 * @throw error if a module is not compatible
 */
window.nekland.Editor.prototype.checkModule = function(module) {

    if (
        typeof module.getTemplateBefore != 'function' ||
        typeof module.getName           != 'function' ||
        typeof module.execute           != 'function'
    ) {
        var name = module.getName ? module.getName() : 'not known name';
        throw 'A module does\'t work. Check if the following module implements all needed methods: "' + name + '".';
    }

    return true;
};