/**
 * This file is a part of nekland editor package
 *
 * (c) Nekland <nekland.fr@gmail.fr>
 *
 * For the full license, take a look to the LICENSE file
 * on the root directory of this project
 */

window.nekland.Editor.prototype.getSelection = function() {
    if (window.getSelection !== null) {
        return window.getSelection();

    } else if (document.getSelection !== null) {

        return document.getSelection();
    } else {

        return document.selection.createRange();
    }
};

window.nekland.Editor.prototype.setSelection = function(orgn, orgo, focn, foco) {
    var r, sel;
    if (focn === null) {
        focn = orgn;
    }
    if (foco === null) {
        foco = orgo;
    }
    sel = this.getSelection();
    if (!sel) {

        return;
    }
    if (sel.collapse && sel.extend) {
        sel.collapse(orgn, orgo);

        return sel.extend(focn, foco);
    } else {
        r = document.createRange();
        r.setStart(orgn, orgo);
        r.setEnd(focn, foco);
        try {
            sel.removeAllRanges();
        } catch (_error) {}

        return sel.addRange(r);
    }
};

/**
 * Get the current node on carret
 *
 * @return Node A javascript native dom element
 */
window.nekland.Editor.prototype.getCurrentNode = function() {
    var node = this.getRealCurrentNode();

    // The current node can be a text node, this doesn't interest us
    if (node.tagName === undefined) {
        node = node.parentNode;
    }

    return node;
};

/**
 * Return the real current node
 * even if it's a text node
 *
 * @return Node A javascript native dom element
 */
window.nekland.Editor.prototype.getRealCurrentNode = function() {
    if (window.getSelection !== null) {
        
        return this.getSelectedNode();
    }
};

window.nekland.Editor.prototype.getParentNode = function() {

    return $(this.getCurrentNode()).parent()[0];
};

window.nekland.Editor.prototype.getSelectedNode = function() {
    var s;

    if (window.getSelection !== null) {
        s = window.getSelection();
        if (s.rangeCount > 0) {

            return this.getSelection().getRangeAt(0).commonAncestorContainer;
        } else {

            return false;
        }

    } else if (document.selection !== null) {

        return this.getSelection();
    }
};

window.nekland.Editor.prototype.setFocusNode = function(node) {
    var range, selection;
    range = document.createRange();
    selection = this.getSelection();
    if (selection !== null) {
        selection.collapse(node, 0);
        selection.extend(node, 0);
    }

    return this.$editor.trigger('focus');
};

window.nekland.Editor.prototype.insertNodeAtCaret = function(node) {
    var range, sel;
    sel = this.getSelection();

    if (sel.rangeCount) {
        range = sel.getRangeAt(0);
        range.collapse(false);
        range.insertNode(node);
        range = range.cloneRange();
        range.selectNodeContents(node);
        range.collapse(false);
        sel.removeAllRanges();

        return sel.addRange(range);
    }
};

window.nekland.Editor.prototype.replaceSelection = function() {
    if ((this.savedSel !== null) && (this.savedSelObj !== null) && this.savedSel[0].tagName !== 'BODY') {
        if ($(this.savedSel[0]).closest('.nekland-editor-html').size() === 0) {

            return this.$editor.focus();
        } else {

            return this.setSelection(this.savedSel[0], this.savedSel[1], this.savedSelObj[0], this.savedSelObj[1]);
        }
    } else {

        return this.$editor.focus();
    }
};

window.nekland.Editor.prototype.getOrigin = function() {
    var sel;
    if (!((sel = this.getSelection()) && (sel.anchorNode !== null))) {

        return null;
    }

    return [sel.anchorNode, sel.anchorOffset];
};

window.nekland.Editor.prototype.getFocus = function() {
    var sel;
    if (!((sel = this.getSelection()) && (sel.focusNode !== null))) {

        return null;
    }

    return [sel.focusNode, sel.focusOffset];
};

window.nekland.Editor.prototype.saveSelection = function() {
    this.$editor.focus();
    this.savedSel = this.getOrigin();
    this.savedSelObj = this.getFocus();
};

/**
 * Bugfix for webkit
 *
 */
window.nekland.Editor.prototype.formatNewLine = function() {
    var parent      = this.getParentBlockNode(),
        currentNode = this.getCurrentBlockNode();


    if (currentNode.nodeName === 'DIV' && parent.nodeName === 'DIV' && parent.className.indexOf('nekland-editor-html') !== -1)
    {
        var $element = $(currentNode);

        if ($element.get(0).tagName === 'DIV')
        {
            // Create p element without removing child nodes
            var html        = $element.clone().html(),
                $newElement = $('<p>').append(html);
            // Replace the div with the p element
            $element.replaceWith($newElement);
            // Add a br for not having empty element
            var $lastElement = $newElement.find('br').parent();
            this.setSelection($lastElement[0], 0, $lastElement[0], 0);
        }
    } else if (currentNode.tagName === 'DIV' && currentNode.className.indexOf('nekland-editor-html') !== -1) {
        // Remove trailing br
        $(currentNode).find('> br').remove();

        var $newElement = $('<p>').html('<br />');
        this.insertNodeAtCaret($newElement.get(0));
        //this.setSelection($newElement[0], 0, $newElement[0], 0);
    }
};

/**
 * Note: will bug if usage on broken html
 *
 */
window.nekland.Editor.prototype.getParentBlockNode = function () {

    return $(this.getCurrentBlockNode()).parent()[0];
};

window.nekland.Editor.prototype.getCurrentBlockNode = function () {
    var node = this.getCurrentNode();

    while (node.tagName !== 'P' && node.tagName !== 'DIV' && node.tagName !== 'TABLE' && node.tagName !== 'UL') {
        node = node.parentNode;
    }

    return node;
};

window.nekland.Editor.prototype.getParentNodeAtCarret = function (tag) {
    var node = this.getCurrentNode();

    while (node.tagName !== tag && !this.isContainer(node)) {
        node = node.parentNode;
    }

    if (node.tagName === tag) {
        return node;
    }

    return false;
};

window.nekland.Editor.prototype.isContainer = function (node) {
    return node.nodeName === 'DIV' && node.className.indexOf('nekland-editor-html') !== -1;
}

/**
 * Replace the carret at the start
 * of the element specified
 *
 * @param $element A jQuery object in the $editor
 */
window.nekland.Editor.prototype.replaceCarretOn = function($element) {
    this.setSelection($element[0], 0, $element[0], 0);
};