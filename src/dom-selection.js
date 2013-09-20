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


window.nekland.Editor.prototype.getCurrentNode = function() {
    if (window.getSelection !== null) {
        return this.getSelectedNode().parentNode;
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
    sel = this.getSelection;
    if (window.getSelection) {
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