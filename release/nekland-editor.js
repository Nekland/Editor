/**
 * This file is a part of nekland editor package
 *
 * (c) Nekland <nekland.fr@gmail.fr>
 *
 * For the full license, take a look to the LICENSE file
 * on the root directory of this project
 */


///////////////////////////
// Setting up namespaces

// Create nekland namespace if doesn't exists
if (window.nekland === undefined) {
    window.nekland = {};
}
// Create nekland lang namespace if doesn't exists
if (window.nekland.lang === undefined) {
    window.nekland.lang = {};
}
// Create lang editor namespace
window.nekland.lang.editor = {};
/**
 * This file is a part of nekland editor package
 *
 * (c) Nekland <nekland.fr@gmail.fr>
 *
 * For the full license, take a look to the LICENSE file
 * on the root directory of this project
 */

/**
 * Class NeklandEditor
 *
 * Everything is inside this class.
 */
window.nekland.Editor = function($domElement, _options, _templates) {
    // Constructor
    if (_options !== undefined) {
        _options = {};
    }

    if (_templates !== undefined) {
        _templates = {};
    }

    // Settings merging
    this.settings = $.extend(true, {}, {
        mode: 'classical',
        uid: uniqid(),
        lang: 'en'
    }, _options);

    // Translations loading
    this.translator   = this.getTranslator(this.settings.lang);

    // Modules loading
    this.initModules();

    this.templates = $.extend(true, {}, _templates, this.getTemplates());

    this.$wrapper = this.templates.load($domElement, this.settings.uid);
    this.$domElement = $domElement;
    this.$editor = this.$wrapper.find('.nekland-editor-html');
    this.$editor = this.$editor.html(this.pize(this.$editor.html()));
    this.lastKey = null;
    this.addEvents();
};

/**
 * Switch html editor/wysiwyg
 *
 * @param $switcher jQuery object of the switch link
 * @return false
 */
window.nekland.Editor.prototype.switchEditor = function($switcher) {

    // WYSIWYG to html
    if (this.$editor.is(':visible')) {
        // Notice: no need to synchronize since it's done on each keyup
        this.$editor.hide();
        this.$domElement.val(this.clearHtml(this.$domElement.val()));
        this.$domElement.show();

        $switcher.html(this.translator.translate('swapToText', {
            ucfirst: true
        }));

    // html to WYSIWYG
    } else {
        this.$editor.html(this.clearHtml(this.pize(this.$domElement.val())));
        this.$domElement.hide();
        this.$editor.show();

        $switcher.html(this.translator.translate('swapToHtml', {
            ucfirst: true
        }));
    }

    // Doesn't follow links after switch if defined as event
    return false;
};

/**
 * Synchronize content between the editor and the input
 */
window.nekland.Editor.prototype.synchronize = function() {
    return this.$domElement.val(this.$editor.html());
};
/**
 * This file is a part of nekland editor package
 *
 * (c) Nekland <nekland.fr@gmail.fr>
 *
 * For the full license, take a look to the LICENSE file
 * on the root directory of this project
 */

/**
 * Execute a command, check each module and execute his method "execute"
 *
 * @param $button A jQuery object of the clicked button
 */
window.nekland.Editor.prototype.execute = function ($button) {
    var command = $button.data('editor-module'),
        _i, _len, res;

    for (_i = 0, _len = this.modules.length; _i < _len; _i++) {
        if (this.modules[_i].getName() === command) {
            if (this.$editor.is(':visible')) {
                res = $.proxy(this.modules[_i].execute, this, $button)();
            }
        }
    }

    this.synchronize();

    if (res !== undefined) {
        return res;
    }

    return false;
};
/**
 * This file is a part of nekland editor package
 *
 * (c) Nekland <nekland.fr@gmail.fr>
 *
 * For the full license, take a look to the LICENSE file
 * on the root directory of this project
 */

/**
 * Return an object witch contains the following methods:
 * -> load($domElement, uid) with:
 *    $domElement: The element on what is bind the editor (basically a textarea)
 *    uid:         an uniq id for the wrapper
 * 
 * @param modules array of modules, each one has his template
 */
window.nekland.Editor.prototype.getTemplates = function() {
    var self = this;
    return {
        main: function(size) {
            return '<div class="nekland-editor-html form-control" style="width:' + size[0] + 'px;height:' + size[1] + 'px" contenteditable="true"></div>';
        },
        switchButton: function(css_class) {
            if (css_class === undefined) {
                css_class = 'nekland-switch-button';
            }
            return '<a href="#" class="' + css_class + '"></a>';
        },
        /**
         * Generate what need to be show before the text zone
         *
         * @param size An array of int witch represent the height/width
         */
        before: function(size) {
            var button, tpl, _i, _len;
            tpl = '<div>';

            // Get each module and execute the getTemplate method
            for (_i = 0, _len = self.modules.length; _i < _len; _i++) {
                tpl += self.modules[_i].getTemplateBefore();
            }
            tpl += '</div>';
            return tpl += this.main(size);
        },
        /**
         * Generate what need to be show before the text zone
         */
        after: function () {
            var tpl = this.switchButton(), _i, _len;

            // Get each module and execute the getTemplate method
            for (_i = 0, _len = self.modules.length; _i < _len; _i++) {
                tpl += self.modules[_i].getTemplateAfter();
            }

            return tpl;
        },
        /**
         * Load all templates in the DOM
         *
         * @param $element jQuery object of the original DOM element
         * @param uid String of a uniqid
         * @return jQuery object of jQuery witch represent the wrapper
         */
        load: function($element, uid) {
            var $wrapper, html;

            // Creating wrapper
            $wrapper = $('<div>', {
                id: 'nekland-editor-wrapper-' + uid
            });

            // Place wrapper
            $element.wrap($wrapper);

            // insert bunton list and editor
            $element.before(this.before([$element.width(), $element.height()]));
            
            // Insert switch button
            $element.after(this.after());

            // Hide original element
            $element.css('display', 'block').hide();

            // Re-get the wrapper in the dom
            // (if not, following functions will not work as expected)
            $wrapper = $('#nekland-editor-wrapper-' + uid);
            html = $.trim($element.val());
            if (html !== '') {
                $wrapper.find('.nekland-editor-html').html(html);
            } else {
                $wrapper.find('.nekland-editor-html').html('<p></p>');
            }
            $wrapper.find('.nekland-switch-button').html(self.translator.translate('swapToHtml', {
                ucfirst: true
            }));

            return $wrapper;
        }
    };
};
/**
 * This file is a part of nekland editor package
 *
 * (c) Nekland <nekland.fr@gmail.fr>
 *
 * For the full license, take a look to the LICENSE file
 * on the root directory of this project
 */


/**
 * All modules should be register in this variable.
 *
 * Each module have to implement theses methods:
 *      - getTemplateBefore: return a string that will be insert before the editor
 *      - getTemplateAfter:  return a string that will be insert after the editor
 *      - addEvent:          simply add events on some elements of the template
 *      - getName:           return a string witch represent the module
 *      - execute:           return a boolean witch say if the event should be prevent or not
 */
window.nekland.Editor.modules = [];

window.nekland.Editor.prototype.initModules = function() {
    var _i, _len, _module;

    this.modules = [];

    for (_i = 0, _len = window.nekland.Editor.modules.length; _i < _len; _i++) {
        _module = new window.nekland.Editor.modules[_i](this.translator);

        this.checkModule(_module);

        this.modules.push(_module);
    }

};


/**
 * Check if the module implements the needeed methods
 *
 * @param module The module to check
 * @return true if there was no problem
 * @throw error if a module is not compatible
 */
window.nekland.Editor.prototype.checkModule = function(module) {

    if (
        typeof module.getTemplateBefore != 'function' || 
        typeof module.getTemplateAfter  != 'function' || 
        typeof module.addEvents         != 'function' ||
        typeof module.getName           != 'function' ||
        typeof module.execute           != 'function'
    ) {
        var name = module.getName ? module.getName() : 'not known name';
        throw 'A module does\'t work. Check if the following module implements all needed methods: \"' + name + '"';
    }

    return true;
};
/**
 * This file is a part of nekland editor package
 *
 * (c) Nekland <nekland.fr@gmail.fr>
 *
 * For the full license, take a look to the LICENSE file
 * on the root directory of this project
 */

/**
 * Add events on the generated dom
 */
window.nekland.Editor.prototype.addEvents = function() {
    var $switcher, self = this;

    $switcher = this.$wrapper.find('.nekland-switch-button');
    $switcher.click($.proxy(this.switchEditor, this, $switcher));

    // Added events on buttons
    this.$wrapper.find('.nekland-editor-command').click(function() {

        return self.execute($(this));
    });

    // Added event on the editor when user add any character
    this.$editor.keyup($.proxy(this.onKeyUp, this));

    this.addModulesEvents();

};

window.nekland.Editor.prototype.addModulesEvents = function() {
    var _i, _len;

    for (_i = 0, _len = this.modules.length; _i < _len; _i++) {
        $.proxy(this.modules[_i].addEvents, this)();
    }
};

/**
 * Define the behavior on key up
 * on the editor
 *
 * @param event
 */
window.nekland.Editor.prototype.onKeyUp = function(event) {
    this.synchronize();
};

/**
 * Prevent enter
 * @param e Event
 */
window.nekland.Editor.prototype.removeEnter = function(e) {
    if (e.which === 13) {
        return e.preventDefault();
    }
};
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
/**
 * This file is a part of nekland editor package
 *
 * (c) Nekland <nekland.fr@gmail.fr>
 *
 * For the full license, take a look to the LICENSE file
 * on the root directory of this project
 */

/**
 * Return an tralator object (with the method "translate" and translations inside)
 */
window.nekland.Editor.prototype.getTranslator = function (lang) {

    // Defining the translator class
    var translator = function (lang) {
        this.translations = window.nekland.lang.editor[lang];
    };

    /**
     * Translate a string
     *
     * @param str     A string: the key of the translation
     * @param options An object of options that allow transformation of translations
     */
    translator.prototype.translate = function(str, options) {
        var res;

        // Default value for options is {}
        if (options === undefined) {
            options = {};
        }

        // Check if the translation exists
        if (this.translations[str] !== undefined) {
            res = this.translations[str];
        } else {
            throw new Error('Translation missing');
        }

        // Execute options
        if (options.ucfirst !== undefined) {
            res = res.charAt(0).toUpperCase() + res.slice(1);
        }

        return res;
    };


    return new translator(lang);
};
/**
 * This file is a part of nekland editor package
 *
 * (c) Nekland <nekland.fr@gmail.fr>
 *
 * For the full license, take a look to the LICENSE file
 * on the root directory of this project
 */

/**
 * Transform to p-text.
 *
 * If the html uses div, it should transform them to paragraph
 */
window.nekland.Editor.prototype.pize = function(str) {
    str = $.trim(str);
    if (str === '' || str === '<p></p>') {
        return '<p><br /></p>';
    }
    return str;
};

window.nekland.Editor.prototype.clearHtml = function(html) {
    return html.replace(/&nbsp;/g, ' ', html);
};
/**
 * This file is a part of nekland editor package
 *
 * (c) Nekland <nekland.fr@gmail.fr>
 *
 * For the full license, take a look to the LICENSE file
 * on the root directory of this project
 */

// The jQuery plugin
(function($) {
    $.fn.neklandEditor = function(_options, _templates) {

        this.each(function() {
            var $this, editor;
            $this = $(this);
            editor = $this.data('nekland-editor');
            if (!editor) {
                return $this.data('nekland-editor', new window.nekland.Editor($this, _options, _templates));
            }
        });

        return this;
    };
})(jQuery);
/**
 * This file is a part of nekland editor package
 *
 * (c) Nekland <nekland.fr@gmail.fr>
 *
 * For the full license, take a look to the LICENSE file
 * on the root directory of this project
 */

window.nekland.lang.editor.en = {
    swapToText: 'swap to text',
    swapToHtml: 'swap to html',
    italic: 'italic',
    bold: 'bold',
    addLink: 'add link',
    close: 'close',
    insertLink: 'insert link',
    link: 'link',
    removeLink: 'remove link',
    notALink: 'your link is not a valid link',
    modules: {}
};
/**
 * This file is a part of nekland editor package
 *
 * (c) Nekland <nekland.fr@gmail.fr>
 *
 * For the full license, take a look to the LICENSE file
 * on the root directory of this project
 */

(function() {
    var basicModule = function(translator) {
        this.translator = translator;
    };

    basicModule.prototype.getTemplateBefore = function() {
        var tpl;
        tpl = '<div class="btn-group">';
        tpl += '<button type="button" class="btn btn-default nekland-editor-command" data-editor-module="basic" data-editor-command="bold"><b>' + this.translator.translate('bold', {
            ucfirst: true
        }) + '</b></button>';
        tpl += '<button type="button" class="btn btn-default nekland-editor-command" data-editor-module="basic" data-editor-command="italic"><i>' + this.translator.translate('italic', {
            ucfirst: true
        }) + '</i></button>';
        return tpl +='</div>';
    };

    basicModule.prototype.execute          = function ($button) {
        var command = $button.data('editor-command');

        document.execCommand(command);
    };

    basicModule.prototype.getTemplateAfter = function() { return ''; };
    basicModule.prototype.addEvents        = function() {};
    basicModule.prototype.getName          = function() { return 'basic'; };

    window.nekland.Editor.modules.push(basicModule);
})();
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
        }) + '<span class="caret"></span></a>';

        tpl += '<ul class="dropdown-menu">';


        tpl += '<li><a href="#" class="open-link-modal">' + this.translator.translate('insertLink', {
            ucfirst: true
        }) + '</a></li>';

        tpl += '<li><a href="#" class="nekland-editor-command" data-editor-command="unlink" data-editor-module="link" data-prevent="no">' + this.translator.translate('removeLink', {
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