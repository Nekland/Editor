/**
 * This file is a part of nekland editor package
 *
 * (c) Nekland <nekland.fr@gmail.fr>
 *
 * For the full license, take a look to the LICENSE file
 * on the root directory of this project
 */

(function() {
    var basicModule = function(translator) {
        this.translator = translator;
    };

    basicModule.prototype.getTemplateBefore = function() {
        var tpl;
        tpl = '<div class="btn-group">';
        tpl += '<button type="button" class="btn btn-default nekland-editor-command" data-editor-module="basic" data-editor-command="bold"><b>' + this.translator.translate('bold', {
            ucfirst: true
        }) + '</b></button>';
        tpl += '<button type="button" class="btn btn-default nekland-editor-command" data-editor-module="basic" data-editor-command="italic"><i>' + this.translator.translate('italic', {
            ucfirst: true
        }) + '</i></button>';
        return tpl +='</div>';
    };

    basicModule.prototype.execute          = function ($button) {
        var command = $button.data('editor-command');

        document.execCommand(command);
    };

    basicModule.prototype.getName          = function() { return 'basic'; };

    window.nekland.Editor.modules.push(basicModule);
})();