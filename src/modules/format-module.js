/**
 * This file is a part of nekland editor package
 *
 * (c) Nekland <nekland.fr@gmail.fr>
 *
 * For the full license, take a look to the LICENSE file
 * on the root directory of this project
 */

(function() {
    var formatModule = function(translator) {
        this.translator = translator;
    };

    formatModule.prototype.getTemplateBefore = function() {
        var tpl = '<div class="btn-group">';

        tpl += '<a class="btn btn-default dropdown-toggle" data-toggle="dropdown" href="javascript:;">' +
            this.translator.translate('format', {
                ucfirst: true
            }) + ' <span class="caret"></span></a>';

        tpl += '<ul class="dropdown-menu">';

        tpl += '<li><a href="javascript:;" class="nekland-editor-command" data-editor-module="format" data-editor-command="p">' +
            this.translator.translate('formatNormal', {
                ucfirst: true
            }) + '</a></li>';

        tpl += '<li><a href="javascript:;" class="nekland-editor-command nekland-editor-formath1" data-editor-module="format" data-editor-command="h1">' +
            this.translator.translate('formatH1', {
                ucfirst: true
            }) + '</a></li>';

        tpl += '<li><a href="javascript:;" class="nekland-editor-command nekland-editor-formath2" data-editor-module="format" data-editor-command="h2">' +
            this.translator.translate('formatH2', {
                ucfirst: true
            }) + '</a></li>';

        tpl += '<li><a href="javascript:;" class="nekland-editor-command nekland-editor-formath3" data-editor-module="format" data-editor-command="h3">' +
            this.translator.translate('formatH3', {
                ucfirst: true
            }) + '</a></li>';

        tpl += '<li><a href="javascript:;" class="nekland-editor-command nekland-editor-formath4" data-editor-module="format" data-editor-command="h4">' +
            this.translator.translate('formatH4', {
                ucfirst: true
            }) + '</a></li>';

        tpl += '<li><a href="javascript:;" class="nekland-editor-command nekland-editor-formath5" data-editor-module="format" data-editor-command="h5">' +
            this.translator.translate('formatH5', {
                ucfirst: true
            }) + '</a></li>';

        tpl += '</ul></div>';

        return tpl;
    };

    formatModule.prototype.execute          = function ($button) {
        var command = $button.data('editor-command');
        document.execCommand('formatblock', false, command);

        return true;
    };

    formatModule.prototype.getName          = function() { return 'format'; };

    window.nekland.Editor.modules.push(formatModule);
})();