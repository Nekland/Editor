/**
 * This file is a part of nekland editor package
 *
 * (c) Nekland <nekland.fr@gmail.fr>
 *
 * For the full license, take a look to the LICENSE file
 * on the root directory of this project
 */

(function() {
    var tableModule = function(translator) {
        this.translator = translator;
    };

    tableModule.prototype.getTemplateBefore = function () {
        var tpl = '<div class="btn-group">';

        tpl += '<a class="btn btn-default dropdown-toggle table-dropdown" data-toggle="dropdown" href="javascript:;">' +
            this.translator.translate('table', {
                ucfirst: true
            }) + ' <span class="caret"></span></a>';

        tpl += '<ul class="dropdown-menu">';

        tpl += '<li><a class="open-table-modal" data-editor-module="list" data-editor-command="insertTable" href="javascript:;">' +
            this.translator.translate('addTable', {
                ucfirst: true
            }) + '</a></li>';

        tpl += '</ul></div>';

        return tpl;
    };

    tableModule.prototype.getTemplateAfter = function () {

        // Header of the modal
        var tpl = '<div class="modal fade" id="table-modal" role="dialog" aria-hidden="true">';
        tpl += '<div class="modal-dialog"><div class="modal-content"><div class="modal-header">';
        tpl += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>';
        tpl += '<h3>' + this.translator.translate('addTable', {ucfirst: true}) + '</h3>';
        tpl += '</div>';

        // Content of the modal
        tpl += '<div class="modal-body">';
        tpl += '<div class="row"><div class="col-md-6">';
        tpl += '<label for="table-columns-input">' + this.translator.translate('columnNumber', {ucfirst: true}) + '</label>';
        tpl += '<input type="number" class="" id="table-columns-input" />';
        tpl += '</div><div class="col-md-6">';
        tpl += '<label for="table-rows-input">' + this.translator.translate('rowNumber', {ucfirst: true}) + '</label>';
        tpl += '<input type="number" class="" id="table-rows-input" />';
        tpl += '</div></div>';
        tpl += '</div>';

        // Bottom of the modal
        tpl += '<div class="modal-footer">';
        tpl += '<button type="button" class="btn" data-dismiss="modal" aria-hidden="true">';
        tpl += this.translator.translate('close', {ucfirst: true}) + '</button>';
        tpl += '<button type="button" class="btn btn-primary nekland-editor-command" data-dismiss="modal" data-editor-command="newTable" data-editor-module="table">';
        tpl += this.translator.translate('insertLink', {ucfirst: true}) + '</button>';

        return tpl += '</div></div></div></div>';
    };

    /**
     * Add event on the table dropdown
     * and the event for open the modal
     *
     */
    tableModule.prototype.addEvents        = function () {

        var $tableDropDown = this.$wrapper.find('.table-dropdown');

        $tableDropDown.click($.proxy(function() {

            // If the carret is on a table, show table modification icons

        }, this));


        this.$wrapper.find('.open-table-modal').click($.proxy(function() {
            this.saveSelection();

            $('#table-modal').modal('show');
        }, this));
    };

    tableModule.prototype.execute          = function ($button) {
        var command = $button.data('editor-command');

        if (command === 'newTable') {
            var columns = $('#table-columns-input').val(),
                rows    = $('#table-rows-input').val(),
                i       = 0,
                j       = 0,
                table   = '<table class="table table-bordered table-hover">',
                node;

            for (i; i < rows; i++) {
                table += '<tr>';
                for (j = 0; j < columns; j++) {
                    table += '<td></td>';
                }
                table += '</tr>';
            }

            table += '</table>';

            this.replaceSelection();

            // Before inserting table, check the container node
            node = this.getCurrentNode();
            if (node.tagName === 'P') {
                $(node).remove();
            }

            document.execCommand('insertHTML', false, table);
        }

        

        return true;
    };

    tableModule.prototype.getName          = function() { return 'table'; };

    window.nekland.Editor.modules.push(tableModule);
})();