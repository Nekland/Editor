/**
 * This file is a part of nekland editor package
 *
 * (c) Nekland <nekland.fr@gmail.fr>
 *
 * For the full license, take a look to the LICENSE file
 * on the root directory of this project
 */

/**
 * To be able to detect an error from the user,
 * here is a simulation of interface process
 */
Object.prototype.Implements = function(interface) { 
    for(var property in interface)
    {
        if( typeof interface[property] != "string")
            continue;
 
        if(this[property]==undefined || typeof this[property] != interface[property] )
            return false;
    }
    return true;
};

window.nekland.Editor.ModuleInterface = {
    getTemplateBefore: 'function',
    getTemplateAfter:  'function',
    addEvents:         'function'
};

window.nekland.Editor.modules = [];

/**
 * Check if all modules are valid
 * Add them the translator
 */
window.nekland.Editor.prototype.checkModules = function() {
    var _i, _len;

    for (_i = 0, _len = this.modules.length; _i < _len; i++) {
        this.modules[i].translate = this.translate;
    }
};