/**
 * This file is a part of nekland editor package
 *
 * (c) Nekland <nekland.fr@gmail.fr>
 *
 * For the full license, take a look to the LICENSE file
 * on the root directory of this project
 */

(function() {
    var listModule = function(translator) {
        this.translator = translator;
    };

    listModule.prototype.getTemplateBefore = function() {
        var tpl = '<div class="btn-group">';

        tpl += '<a class="btn btn-default dropdown-toggle list-dropdown" data-toggle="dropdown" href="javascript:;">' +
            this.translator.translate('list', {
                ucfirst: true
            }) + ' <span class="caret"></span></a>';

        tpl += '<ul class="dropdown-menu">';

        tpl += '<li><a class="nekland-editor-command list-button" data-editor-module="list" data-editor-command="insertUnorderedList" href="javascript:;">' +
            '<span class="glyphicon glyphicon-list"></span> ' +
            this.translator.translate('normalList', {
                ucfirst: true
            }) + '</a></li>';

        tpl += '</ul></div>';

        return tpl;
    };

    /**
     * Add event on the list dropdown to define the label of the list button
     *
     */
    listModule.prototype.addEvents        = function() {

        this.$wrapper.find('.list-dropdown').click($.proxy(function() {
            var $listButton = this.$wrapper.find('.list-button');

            if (this.getCurrentNode().tagName === 'LI') {

                $listButton.html(
                    '<span class="glyphicon glyphicon-list"></span> ' + 
                    this.translator.translate('removeList', {
                        ucfirst: true
                    }
                ));
            } else {

                $listButton.html(
                    '<span class="glyphicon glyphicon-list"></span> ' +
                    this.translator.translate('normalList', {
                        ucfirst: true
                    }
                ));
            }

        }, this));
    };

    listModule.prototype.execute          = function ($button) {
        var command  = $button.data('editor-command'),
            removeLi = false,
            $node,
            html,
            $p;

        // When the current node is a li
        // we have to check 
        if (this.getCurrentNode().tagName === 'LI') {
            removeLi = true;
        }

        document.execCommand(command);

        if (!removeLi) {
            // Getting the supposed UL
            $node = $(this.getParentNode());

            // supposed the "p"
            $p = $node.parent();

            // if it's really a p
            if ($p.get(0).tagName === 'P') {
                // Add content of the p at the end of $editor
                this.$editor.append($node);
                $p.remove();
                this.replaceCarretOn($node);
            }
        }

        // TODO: traitment on remove li

        return true;
    };

    listModule.prototype.getName          = function() { return 'list'; };

    window.nekland.Editor.modules.push(listModule);
})();