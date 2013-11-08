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
            node,
            html,
            $p;

        // When the current node is a li
        // we have to check 
        if (this.getCurrentNode().tagName === 'LI') {
            removeLi = true;
        }

        document.execCommand(command);

        if (!removeLi) {
            // This is a bugfix while executing new list element

            if (this.compatibility('webkit')) {
                $node = $(this.getParentNodeAtCarret('LI'));

                $node.find('span, b, i').each(function() {
                    $(this).removeAttr('style');
                });
            }


            // supposed the "p"
            $p = this.getParentNodeAtCarret('P');

            // if it's really a p
            if ($p) {
                $p = $($p);
                $p.after($p.html());
                // Add content of the p at the end of $editor
                //this.$editor.append($node);
                this.replaceCarretOn($p.next('ul').find('li'));
                $p.remove();
            }
        } else {
            var text = '';

            // Getting the supposed text or parent node
            node = this.getRealCurrentNode();

            // If it's a text node
            // Saving the text, removing the text node
            if (node.tagName === undefined) {
                var textNode = node;
                text = textNode.toString();
                node = textNode.parentNode;
                node.removeChild(textNode);
            } else {
                // If the p is empty, we can't place the carret on it
                text = '<br />';
            }

            // The parent node
            $node = $(node);
            $node.find('br:last').remove();
            $p    = $('<p>').append(text);
            $node.append($p);
            this.replaceCarretOn($p);
        }

        return true;
    };

    listModule.prototype.getName          = function() { return 'list'; };

    window.nekland.Editor.modules.push(listModule);
})();