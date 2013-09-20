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

    /**
     * Some services injection
     *
     * @param translator The translator of the editor (usage with his "translate" method)
     */
    var myModule = function(translator) {
        this.translator = translator;
    };

    myModule.prototype.getTemplateBefore = function () {
        var tpl = '<button class="btn nekland-editor-command">nothing</button>';
    };

    // Need to be define even if there is nothing to do
    // to follow the interface
    myModule.prototype.getTemplateAfter = function () { return ''; };

    // Again nothing to do since the template has the class "nekland-editor-command"
    // An event will be automatically added ;-)
    myModule.prototype.addEvents        = function () {};

    // The name of the module
    myModule.prototype.getName          = function () { return 'empty'; };

    // execute when clicking on
    myModule.prototype.execute          = function () {
        document.execCommand('something');
    };


    window.nekland.Editor.modules.push(myModule);
})();