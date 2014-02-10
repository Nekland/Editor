/**
 * This file is a part of nekland editor package
 *
 * (c) Nekland <nekland.fr@gmail.fr>
 *
 * For the full license, take a look to the LICENSE file
 * on the root directory of this project
 */

(function() {
    var imageModule = function(translator) {
        this.translator = translator;
        this.options    = {
            path:          'upload.php',
            inputName:     'image',
            method:        'POST', // For compatibility, but should be PUT
            dataName:      'url',
            dataErrorName: 'error'
        };
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
        tpl += '<p class="error"></p>';
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
        var self = this;
        $('#image_button').click(function () {
            self.saveSelection();
            $('#image-modal').modal('show');
        });
    };

    /**
     * Upload an image !
     */
    imageModule.prototype.execute          = function ($button, module) {
        var command      = $button.data('editor-command'),
            $modal       = $('#image-modal'),
            $progressbar = $modal.find('.progress-bar'),
            self         = this;

        var xhr = new XMLHttpRequest();
        xhr.open(module.getOption('method'), module.getOption('path'));

        xhr.upload.onprogress = function(e) {
            $progressbar.css('width', (e.total / e.loaded) + '%');
        };

        xhr.onreadystatechange = function () {
            if(xhr.readyState == 4) {
                data = JSON.parse(xhr.responseText);

                if (xhr.status == 200) {
                    $modal.modal('hide');
                    self.replaceSelection();
                    document.execCommand('insertHtml', false, '<img src="' + data[module.getOption('dataName')] + '" alt="Image" /><br />');
                } else {
                    $modal.find('.error').html(data[module.getOption('dataErrorName')]);
                }
            }
        };


        var form = new FormData();
        form.append(module.getOption('inputName'), $modal.find('#image-input').get(0).files[0]);

        xhr.send(form);

        return true;
    };

    imageModule.prototype.sendImage        = function () {

    };

    imageModule.prototype.getName          = function () { return 'image'; };
    imageModule.prototype.getOption        = function (option) { return this.options[option]; };
    imageModule.prototype.setOptions       = function (_options) {
        if (_options !== undefined) {
            this.options = $.extends({}, this.options, _options);
        }
    };

    window.nekland.Editor.modules.push(imageModule);
})();