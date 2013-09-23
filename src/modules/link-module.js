/**
 * This file is a part of nekland editor package
 *
 * (c) Nekland <nekland.fr@gmail.fr>
 *
 * For the full license, take a look to the LICENSE file
 * on the root directory of this project
 */

(function() {
    var linkModule = function(translator) {
        this.translator = translator;
    };

    linkModule.prototype.getTemplateBefore = function() {
        var tpl = '<div class="btn-group">';

        tpl += '<a class="btn btn-default dropdown-toggle link-modal" data-toggle="dropdown" href="#">' + this.translator.translate('link', {
            ucfirst: true
        }) + ' <span class="caret"></span></a>';

        tpl += '<ul class="dropdown-menu">';


        tpl += '<li><a href="#" class="open-link-modal">' + this.translator.translate('insertLink', {
            ucfirst: true
        }) + '</a></li>';

        tpl += '<li><a href="#" class="nekland-editor-command" data-editor-command="unlink" data-editor-module="link">' + this.translator.translate('removeLink', {
            ucfirst: true
        }) + '</a></li>';

        tpl += '</ul></div>';

        return tpl;
    };

    /**
     * Generate the modal for link
     */
    linkModule.prototype.getTemplateAfter = function() {

        // Header of the modal
        var tpl = '<div class="modal fade nekland-editor-link" id="link-modal" role="dialog" aria-hidden="true">';
        tpl += '<div class="modal-dialog"><div class="modal-content"><div class="modal-header">';
        tpl +=  '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>';
        tpl += '<h3>' + this.translator.translate('addLink', {ucfirst: true}) + '</h3>';
        tpl += '</div>';

        // Body of the modal
        tpl += '<div class="modal-body">';
        tpl += '<input type="text" class="link-input form-control" id="link-input" style="width: 250px;" />';
        tpl += '<p class="error link-error"></p>';
        tpl += '</div>';

        // Bottom of the modal
        tpl += '<div class="modal-footer">';
        tpl += '<button type="button" class="btn" data-dismiss="modal" aria-hidden="true">';
        tpl += this.translator.translate('close', {ucfirst: true}) + '</button>';
        tpl += '<button type="button" class="btn btn-primary nekland-editor-command" data-dismiss="modal" data-editor-module="link" data-editor-command="createLink">';
        tpl += this.translator.translate('insertLink', {ucfirst: true}) + '</button>';

        return tpl += '</div></div></div></div>';
    };
    linkModule.prototype.addEvents        = function() {
        //this.$wrapper.find('.link-modal').modal('hide');
        this.$wrapper.find('.open-link-modal').click($.proxy(function() {
            this.saveSelection();

            $('#link-modal').modal('show');
        }, this));
        this.$wrapper.find('.link-input').keydown(this.removeEnter);
    };

    linkModule.prototype.execute          = function ($button) {
        var command = $button.data('editor-command'),
            $modal   = $('#link-modal'),
            link    = null,
            node,
            prevent = false;

        if (command === 'createLink') {
            link = $('#link-input').val();
            if(!/(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(link)) {
                $modal.find('.link-error').html(this.translator.translate('notALink', {ucfirst: true}));

                return prevent;
            }

            prevent = true;

        } else if (command === 'unlink') {
            node = this.getCurrentNode();
            if (node.tagName === 'A') {
                $(node).replaceWith($(node).text());
                this.synchronize();

                return prevent;
            }
        }

        this.replaceSelection();
        document.execCommand(command, false,  link);

        return prevent;
    };

    linkModule.prototype.getName          = function() { return 'link'; };

    window.nekland.Editor.modules.push(linkModule);
})();