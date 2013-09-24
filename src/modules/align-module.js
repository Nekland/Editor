/**
 * This file is a part of nekland editor package
 *
 * (c) Nekland <nekland.fr@gmail.fr>
 *
 * For the full license, take a look to the LICENSE file
 * on the root directory of this project
 */

(function() {
    var alignModule = function(translator) {
        this.translator = translator;
    };

    alignModule.prototype.getTemplateBefore = function() {
        var tpl = '<div class="btn-group">';

        tpl += '<a class="btn btn-default dropdown-toggle" data-toggle="dropdown" href="javascript:;">' +
            this.translator.translate('alignment', {
                ucfirst: true
            }) + ' <span class="caret"></span></a>';

        tpl += '<ul class="dropdown-menu">';

        tpl += '<li><a href="javascript:;" class="nekland-editor-command" data-editor-module="alignment" data-editor-command="justifyLeft">' +
            '<span class="glyphicon glyphicon-align-left"></span> ' +
            this.translator.translate('alignmentLeft', {
                ucfirst: true
            }) + '</a></li>';

        tpl += '<li><a href="javascript:;" class="nekland-editor-command" data-editor-module="alignment" data-editor-command="justifyRight">' +
            '<span class="glyphicon glyphicon-align-right"></span> ' +
            this.translator.translate('alignmentRight', {
                ucfirst: true
            }) + '</a></li>';

        tpl += '<li><a href="javascript:;" class="nekland-editor-command" data-editor-module="alignment" data-editor-command="justifyCenter">' +
            '<span class="glyphicon glyphicon-align-center"></span> ' +
            this.translator.translate('alignmentCenter', {
                ucfirst: true
            }) + '</a></li>';

        tpl += '<li><a href="javascript:;" class="nekland-editor-command" data-editor-module="alignment" data-editor-command="justifyFull">' +
            '<span class="glyphicon glyphicon-align-justify"></span> ' +
            this.translator.translate('alignmentJustify', {
                ucfirst: true
            }) + '</a></li>';

        tpl += '</ul></div>';

        return tpl;
    };

    alignModule.prototype.execute          = function ($button) {
        var command = $button.data('editor-command');
        document.execCommand(command);

        return true;
    };

    alignModule.prototype.getName          = function() { return 'alignment'; };

    window.nekland.Editor.modules.push(alignModule);
})();