/**
 * This file is a part of nekland editor package
 *
 * (c) Nekland <nekland.fr@gmail.fr>
 *
 * For the full license, take a look to the LICENSE file
 * on the root directory of this project
 */

/**
 * Creation of a module in a closure to not disturb
 * the rest of the application
 */
(function() {
    var myModule = function() {
        // Noting to do in the constructor
    };

    myModule.prototype.getTemplateBefore = function() {
        var tpl = '<button class="btn nekland-editor-command">nothing</button>'
    };

    // Need to be define even if there is nothing to do
    // to follow the interface
    myModule.prototype.getTemplateAfter = function() { return ''; };

    // Again nothing to do since the template has the class "nekland-editor-command"
    // An event will be automatically added ;-)
    myModule.prototype.addEvents        = function() {};


    window.nekland.Editor.modules.push(myModule);
})();