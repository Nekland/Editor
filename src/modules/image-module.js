/**
 * This file is a part of nekland editor package
 *
 * (c) Nekland <nekland.fr@gmail.fr>
 *
 * For the full license, take a look to the LICENSE file
 * on the root directory of this project
 */

(function() {
    var imageModule = function(translator, options) {
        this.translator = translator;
        this.options    = {
            path:      'upload.html',
            inputName: 'image',
            method:    'POST', // For compatibility, but should be PUT
            dataName:  'url'
        };

        if (options !== undefined) {
            this.options = $.extends({}, this.options, options);
        }
    };

    imageModule.prototype.getTemplateBefore = function () {
        var tpl =  '<a class="btn btn-default" id="image_button" href="javascript:;">' +
            this.translator.translate('image', {
                ucfirst: true
            }) + '</a>';

        return tpl;
    };

    // TODO: add simple form for image via url
    imageModule.prototype.getTemplateAfter = function () {

        // Header of the modal
        var tpl = '<div class="modal fade" id="image-modal" role="dialog" aria-hidden="true">';
        tpl += '<div class="modal-dialog"><div class="modal-content"><div class="modal-header">';
        tpl += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>';
        tpl += '<h3>' + this.translator.translate('addImage', {ucfirst: true}) + '</h3>';
        tpl += '</div>';

        // Content of the modal
        tpl += '<div class="modal-body"><div class="row"><div class="col-md-10">';
        tpl += '<label for="image-input">' + this.translator.translate('yourImage', {ucfirst: true}) + '</label>';
        tpl += '<input type="file" class="" name="' + this.options.inputName + '" id="image-input" />';
        tpl += '</div></div>';

        // Progress bar
        tpl += '<div class="row"><div class="col-md-10">';
        tpl += '<div class="progress">';
        tpl += '<div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0">';
        tpl += '</div></div>';
        tpl += '</div></div></div>';

        // Bottom of the modal
        tpl += '<div class="modal-footer">';
        tpl += '<button type="button" class="btn" data-dismiss="modal" aria-hidden="true">';
        tpl += this.translator.translate('close', {ucfirst: true}) + '</button>';
        tpl += '<button type="button" class="btn btn-primary nekland-editor-command" data-editor-command="uploadImage" data-editor-module="image">';
        tpl += this.translator.translate('insertImage', {ucfirst: true}) + '</button>';

        return tpl += '</div></div></div></div>';
    };

    /**
     * Add the event for open the modal
     *
     */
    imageModule.prototype.addEvents        = function (module) {
        $('#image_button').click(function () {
            $('#image-modal').modal('show');
        });
    };

    /**
     * Upload an image !
     */
    imageModule.prototype.execute          = function ($button, module) {
        var command      = $button.data('editor-command'),
            $modal       = $('#image-modal'),
            $progressbar = $modal.find('.progress-bar');

        var xhr = new XMLHttpRequest();
        xhr.open(module.getOption('method'), module.getOption('path'));

        xhr.upload.onprogress = function(e) {
            $progressbar.css('width', (e.total / e.loaded) + '%');
        };

        xhr.onload = function (data) {

            data = JSON.parse(data);
            $modal.modal('hide');

            this.replaceSelection();

            document.execCommand('insertHtml', false, '<img src="' + data[module.getOtion('dataName')] + '" alt="" />');
        };


        var form = new FormData();
        form.append('file', $modal.find('#image-input').get(0).files[0]);

        xhr.send(form);

        return true;
    };

    imageModule.prototype.sendImage        = function() {

    };

    imageModule.prototype.getName          = function() { return 'image'; };
    imageModule.prototype.getOption        = function(option) { return this.options[option]; };

    window.nekland.Editor.modules.push(imageModule);
})();