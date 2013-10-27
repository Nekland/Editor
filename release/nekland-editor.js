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
    // Note: the following operation needs the translator to inject it
    this.initModules();
    this.translator.addModuleTranslations(this.modules);

    // Recurcive/Create new object
    this.templates = $.extend(true, {}, this.getTemplates(), _templates);

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
window.nekland.Editor.prototype.execute = function ($button, event) {
    var command = $button.data('editor-module'),
        _i, _len, res;

    // launch execution method for each module
    for (_i = 0, _len = this.modules.length; _i < _len; _i++) {
        if (this.modules[_i].getName() === command) {
            if (this.$editor.is(':visible')) {
                res = $.proxy(this.modules[_i].execute, this, $button)();
            }
        }
    }

    // Firefox fix
    if (this.compatibility('mozilla') && this.$editor.is(':visible')) {
        console.log ('hi');
        this.$editor.focus();
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
                if (self.modules[_i].getTemplateAfter !== undefined && typeof self.modules[_i].getTemplateAfter === 'function') {
                    tpl += self.modules[_i].getTemplateAfter();
                }
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
        typeof module.getName           != 'function' ||
        typeof module.execute           != 'function'
    ) {
        var name = module.getName ? module.getName() : 'not known name';
        throw 'A module does\'t work. Check if the following module implements all needed methods: "' + name + '".';
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
    this.$wrapper.find('.nekland-editor-command').click(function(e) {

        return self.execute($(this), e);
    });

    // Added event on the editor when user add any character
    this.$editor.keyup($.proxy(this.onKeyUp, this));

    this.addModulesEvents();

};

window.nekland.Editor.prototype.addModulesEvents = function() {
    var _i, _len;

    for (_i = 0, _len = this.modules.length; _i < _len; _i++) {
        if (this.modules[_i].addEvents !== undefined && typeof this.modules[_i].addEvents === 'function') {
            $.proxy(this.modules[_i].addEvents, this)();
        }
    }
};

/**
 * Define the behavior on key up
 * on the editor
 *
 * @param event
 */
window.nekland.Editor.prototype.onKeyUp = function(event) {
    var key = event.keyCode || event.which;

    if (key === 13) {

        // Bugfix for chrome/webkit
        // It doesn't pize the new line
        if (this.compatibility('webkit')) {
            this.formatNewLine();
        }
        // TODO: convert links on the last line
    }

    this.synchronize();
};

/**
 * Prevent enter
 * @param event Event
 */
window.nekland.Editor.prototype.removeEnter = function(event) {
    if (event.which === 13) {
        return event.preventDefault();
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
    var parent      = this.getParentNode(),
        currentNode = this.getCurrentNode();

    if (parent.nodeName === 'DIV' && parent.className.indexOf('nekland-editor-html') !== -1)
    {
        var element = $(currentNode);

        if (element.get(0).tagName === 'DIV' && (element.html() === '' || element.html() === '<br>'))
        {
            // Create p element without removing child nodes
            var newElement = $('<p>').append(element.clone().get(0).childNodes);
            // Replace the div with the p element
            element.replaceWith(newElement);
            // Add a br for not having empty element
            newElement.html('<br />');
            this.setSelection(newElement[0], 0, newElement[0], 0);
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
 * Replace the carret at the start
 * of the element specified
 *
 * @param $element A jQuery object in the $editor
 */
window.nekland.Editor.prototype.replaceCarretOn = function($element) {
    this.setSelection($element[0], 0, $element[0], 0);
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
     * Add module translations to current translations
     * (the process merge them)
     *
     * @param modules An array of modules
     */
    translator.prototype.addModuleTranslations = function (modules) {
        var _i, _len, _translations;

        // Load translations from modules
        for (_i = 0, _len = modules.length; _i < _len; _i++) {
            if (modules[_i].getTranslations !== undefined && typeof modules[_i].getTranslations == 'function') {
                _translations = modules[_i].getTranslations()[lang];

                if (_translations !== undefined) {
                    this.translations = $.extend({}, this.translations, _translations);
                }
            }
        }
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

/**
 * Take an html string and clean it
 */
window.nekland.Editor.prototype.clearHtml = function(html) {
    var partial = html.replace(/&nbsp;/g, ' ', html);

    return this.indentHtml(partial);
};

/**
 * Take an html string (basically in one only line) and
 * return an intented html string
 *
 * @param code html as string
 * @return string of html
 */
window.nekland.Editor.prototype.indentHtml = function (code) {
    var i     = 0,
        point = 0,
        start = null,
        end   = null,
        tag   = '',
        out   = '',
        cont  = '',
        level = 0,

        ownLine = [
            'area',
            'body',
            'head',
            'hr',
            'iframe',
            'link',
            'meta',
            'noscript',
            'style',
            'table',
            'tbody',
            'thead',
            'tfoot'
        ],
        contOwnLine = [
            'li',
            'dt',
            'dt',
            'h[1-6]',
            'option',
            'script'
        ],

        //line will go before these tags
        lineBefore = new RegExp('^<(/?' + ownLine.join('|/?')+'|' + contOwnLine.join('|') + ')[ >]'),
        //line will go after these tags
        lineAfter  = new RegExp('^<(br|/?' + ownLine.join('|/?')+'|/' + contOwnLine.join('|/')+')[ >]'),
        newLevel   = new RegExp('^</?(' + [
            'blockquote',
            'div',
            'dl',
            'fieldset',
            'form',
            'frameset',
            'map',
            'ol',
            'p',
            'pre',
            'select',
            'td',
            'th',
            'tr',
            'ul'
        ].join('|') + ')[ >]');

    function tabs() {
        var s = '';
        for (var j=0; j < level; j++)
            s += '\t';
        
        return s;
    }

    function placeTag(tag, out) {

        var nl = tag.match(newLevel);
        if (tag.match(lineBefore) || nl) {
            out = out.replace(/\s*$/, '');
            out += "\n";
        }

        if (nl && '/' == tag.charAt(1))
            level--;
        if ('\n' == out.charAt(out.length-1))
            out += tabs();
        if (nl && '/' != tag.charAt(1))
            level++;

        out += tag;
        if (tag.match(lineAfter) || tag.match(newLevel)) {
            out = out.replace(/ *$/, '');
            out += "\n";
        }

        return out;
    }

    function cleanTag(tag) {
        var tagout = '',
            suffix = '',
            m,
            partRe = /\s*([^= ]+)(?:=((['"']).*?\3|[^ ]+))?/;
        tag = tag.replace(/\n/g, ' ');       //remove newlines
        tag = tag.replace(/[\s]{2,}/g, ' '); //collapse whitespace
        tag = tag.replace(/^\s+|\s+$/g, ' '); //collapse whitespace

        if (tag.match(/\/$/)) {
            suffix='/';
            tag=tag.replace(/\/+$/, '');
        }
        m = partRe.exec(tag);
        while (m) {
            if (m[2]) {
                tagout += m[1].toLowerCase() + '=' + m[2];
            } else if (m[1]) {
                tagout += m[1].toLowerCase();
            }
            tagout += ' ';

            // Why is this necessary?  I thought .exec() went from where it left off.
            tag = tag.substr(m[0].length);
            m = partRe.exec(tag);
        }

        return tagout.replace(/\s*$/, '') + suffix + '>';
    }


    for (i = 0; i < code.length; i++) {
        point = i;

        //if no more tags, copy and exit
        if (-1 == code.substr(i).indexOf('<')) {
            out += code.substr(i);

            return out;
        }

        //copy verbatim until a tag
        while (point < code.length && '<' != code.charAt(point))
            point++;
        if (i != point) {
            cont = code.substr(i, point - i);
            if (!cont.match(/^\s+$/)) {
                if ('\n' == out.charAt(out.length - 1)) {
                    out += tabs();
                } else if ('\n' == cont.charAt(0)) {
                    out += '\n' + tabs();
                    cont = cont.replace(/^\s+/, '');
                }
                cont = cont.replace(/\s+/g, ' ');
                out += cont;
            } if (cont.match(/\n/)) {
                out += '\n' + tabs();
            }
        }
        start = point;

        //find the end of the tag
        while (point < code.length && '>' != code.charAt(point))
            point++;

        tag = code.substr(start, point-start);
        i   = point;

        //if this is a special tag, deal with it!
        if ('!--' == tag.substr(1,3)) {
            if (!tag.match(/--$/)) {
                while ('-->' != code.substr(point, 3))
                    point++;
                point += 2;
                tag = code.substr(start, point-start);
                i = point;
            }
            if ('\n' != out.charAt(out.length-1))
                out += '\n';
            out += tabs();
            out += tag+'>\n';
        } else if ('!' == tag[1]) {
            out = placeTag(tag+'>', out);
        } else if ('?' == tag[1]) {
            out += tag + '>\n';
        } else {
            t = tag.match(/^<(script|style)/i);
            if (t) {
                t[1] = t[1].toLowerCase();
                tag  = cleanTag(tag);
                out  = placeTag(tag, out);
                end  = String(code.substr(i +1)).toLowerCase().indexOf('</' + t[1]);
                if (end) {
                    cont = code.substr(i + 1, end);
                    i   += end;
                    out += cont;
                }
            } else {
                tag = cleanTag(tag);
                out = placeTag(tag, out);
            }
        }
    }

    return out.substr(1, out.length-1);
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
 * Allow simple browser compatibility check
 *
 * @param browser One of theses strings: "webkit" | "mozilla" | "opera" | "msie" | 'chrome' | "version"
 * @return string|bool String when version is asked. Bool when browser is asked
 */
window.nekland.Editor.prototype.compatibility = function(browser) {

    // Caching the data to avoid multiple regex execution
    if (this.browser === undefined) {
        var ua = navigator.userAgent.toLowerCase();
        var match = /(chrome)[ \/]([\w.]+)/.exec(ua) || /(webkit)[ \/]([\w.]+)/.exec(ua) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];

        this.version = match[2];
        this.browser = match[1];
    }

    if (browser == 'version') {
        return this.version;
    }

    if (browser == 'webkit') {
        return (this.browser == 'chrome' || this.browser == 'webkit');
    }

    return this.browser == browser;
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
 * Generate a special code that is unique
 *
 * Notice: this function comes from php_js.
 */
uniqid = function(prefix, more_entropy) {
    var formatSeed, retId;
    if (typeof prefix === 'undefined') {
        prefix = "";
    }
    formatSeed = function(seed, reqWidth) {
        seed = parseInt(seed, 10).toString(16);
        if (reqWidth < seed.length) {
            return seed.slice(seed.length - reqWidth);
        }
        if (reqWidth > seed.length) {
            return Array(1 + (reqWidth - seed.length)).join('0') + seed;
        }
        return seed;
    };
    uniqidSeed = Math.floor(Math.random() * 0x75bcd15);
    uniqidSeed++;

    retId = prefix;
    retId += formatSeed(parseInt(new Date().getTime() / 1000, 10), 8);
    retId += formatSeed(uniqidSeed, 5);
    if (more_entropy) {
      retId += (Math.random() * 10).toFixed(8).toString();
    }
    return retId;
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

    // Alignment module
    alignment:        'alignment',
    alignmentLeft:    'alignment to the left',
    alignmentRight:   'alignment to the right',
    alignmentCenter:  'alignment to the center',
    alignmentJustify: 'justify alignment',

    // Format module
    format:       'format',
    formatNormal: 'normal text',
    formatH1:     'title 1',
    formatH2:     'title 2',
    formatH3:     'title 3',
    formatH4:     'title 4',
    formatH5:     'title 5',

    // List module
    list:       'list',
    normalList: 'list',
    removeList: 'end the list',

    // Table module
    table:               'table',
    addTable:            'add new table',
    insertTable:         'insert new table',
    addRowAbove:         'add row above',
    addRowBelow:         'add row below',
    addColumnLeft:       'add column left',
    addColumnRight:      'add column right',
    deleteCurrentRow:    'delete current row',
    deleteCurrentColumn: 'delete current column',
    deleteCurrentTable:  'delete current table',
    columnNumber:        'number of columns',
    rowNumber:           'number of rows'
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
        tpl += '<button type="button" class="btn btn-default nekland-editor-command" data-editor-module="basic" data-editor-command="bold" id="nekland-editor-bold"><b>' + this.translator.translate('bold', {
            ucfirst: true
        }) + '</b></button>';
        tpl += '<button type="button" class="btn btn-default nekland-editor-command" data-editor-module="basic" data-editor-command="italic" id="nekland-editor-italic"><i>' + this.translator.translate('italic', {
            ucfirst: true
        }) + '</i></button>';
        return tpl +='</div>';
    };

    basicModule.prototype.execute          = function ($button) {
        var command = $button.data('editor-command');

        document.execCommand(command);
    };

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

    /**
     * Add events for open modal on click on link
     *
     */
    linkModule.prototype.addEvents        = function() {
        this.$wrapper.find('.open-link-modal').click($.proxy(function() {
            this.saveSelection();

            $('#link-modal').modal('show');
        }, this));
        this.$wrapper.find('.link-input').keydown(this.removeEnter);
    };

    /**
     * Execute the creation or remove of a link
     *
     * @param $button jQuery object of the button clicked
     * @return boolean true if there is a link addition (letting the checkbox close) flase in other cases
     */
    linkModule.prototype.execute          = function ($button) {
        var command = $button.data('editor-command'),
            $modal  = $('#link-modal'),
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
        document.execCommand(command, false, link);

        return prevent;
    };

    linkModule.prototype.getName          = function() { return 'link'; };

    window.nekland.Editor.modules.push(linkModule);
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
    var alignModule = function(translator) {
        this.translator = translator;
    };

    alignModule.prototype.getTemplateBefore = function() {
        var tpl = '<div class="btn-group">';

        tpl += '<a class="btn btn-default dropdown-toggle" data-toggle="dropdown" href="javascript:;">' +
            this.translator.translate('alignment', {
                ucfirst: true
            }) + ' <span class="caret"></span></a>';

        tpl += '<ul class="dropdown-menu">';

        tpl += '<li><a href="javascript:;" class="nekland-editor-command" data-editor-module="alignment" data-editor-command="justifyLeft">' +
            '<span class="glyphicon glyphicon-align-left"></span> ' +
            this.translator.translate('alignmentLeft', {
                ucfirst: true
            }) + '</a></li>';

        tpl += '<li><a href="javascript:;" class="nekland-editor-command" data-editor-module="alignment" data-editor-command="justifyRight">' +
            '<span class="glyphicon glyphicon-align-right"></span> ' +
            this.translator.translate('alignmentRight', {
                ucfirst: true
            }) + '</a></li>';

        tpl += '<li><a href="javascript:;" class="nekland-editor-command" data-editor-module="alignment" data-editor-command="justifyCenter">' +
            '<span class="glyphicon glyphicon-align-center"></span> ' +
            this.translator.translate('alignmentCenter', {
                ucfirst: true
            }) + '</a></li>';

        tpl += '<li><a href="javascript:;" class="nekland-editor-command" data-editor-module="alignment" data-editor-command="justifyFull">' +
            '<span class="glyphicon glyphicon-align-justify"></span> ' +
            this.translator.translate('alignmentJustify', {
                ucfirst: true
            }) + '</a></li>';

        tpl += '</ul></div>';

        return tpl;
    };

    alignModule.prototype.execute          = function ($button) {
        var command = $button.data('editor-command');
        document.execCommand(command);

        return true;
    };

    alignModule.prototype.getName          = function() { return 'alignment'; };

    window.nekland.Editor.modules.push(alignModule);
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
        else {
            var node, text = '';

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

        tpl += '<li><a class="open-table-modal" href="javascript:;">' +
            this.translator.translate('addTable', {
                ucfirst: true
            }) + '</a></li>';

        tpl += '<li class="table-updates"><a href="javascript:;" class="nekland-editor-command" data-editor-module="table" data-editor-command="addRowAbove">' +
            this.translator.translate('addRowAbove', {
                ucfirst: true
            }) + '</a></li>';

        tpl += '<li class="table-updates"><a href="javascript:;" class="nekland-editor-command" data-editor-module="table" data-editor-command="addRowBelow">' +
            this.translator.translate('addRowBelow', {
                ucfirst: true
            }) + '</a></li>';

        tpl += '<li class="table-updates"><a href="javascript:;" class="nekland-editor-command" data-editor-module="table" data-editor-command="addColumnLeft">' +
            this.translator.translate('addColumnLeft', {
                ucfirst: true
            }) + '</a></li>';

        tpl += '<li class="table-updates"><a href="javascript:;" class="nekland-editor-command" data-editor-module="table" data-editor-command="addColumnRight">' +
            this.translator.translate('addColumnRight', {
                ucfirst: true
            }) + '</a></li>';

        tpl += '<li class="table-updates"><a href="javascript:;" class="nekland-editor-command" data-editor-module="table" data-editor-command="deleteCurrentRow">' +
            this.translator.translate('deleteCurrentRow', {
                ucfirst: true
            }) + '</a></li>';

        tpl += '<li class="table-updates"><a href="javascript:;" class="nekland-editor-command" data-editor-module="table" data-editor-command="deleteCurrentColumn">' +
            this.translator.translate('deleteCurrentColumn', {
                ucfirst: true
            }) + '</a></li>';

        tpl += '<li class="table-updates"><a href="javascript:;" class="nekland-editor-command" data-editor-module="table" data-editor-command="deleteCurrentTable">' +
            this.translator.translate('deleteCurrentTable', {
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
            var currentNode = this.getCurrentNode();
            if (currentNode.tagName === 'TABLE' || currentNode.tagName === 'TR' || currentNode.tagName === 'TD') {
                $tableDropDown.parent().find('.table-updates').show();
            } else {
                $tableDropDown.parent().find('.table-updates').hide();
            }

        }, this));


        this.$wrapper.find('.open-table-modal').click($.proxy(function() {
            this.saveSelection();

            $('#table-modal').modal('show');
        }, this));

        // To avoid problems with firefox resizing features
        if (this.compatibility('mozilla')) {
            try
            {
                document.execCommand('enableObjectResizing', false, false);
                document.execCommand('enableInlineTableEditing', false, false);
            }
            catch (e) {}
        }
    };

    tableModule.prototype.execute          = function ($button) {
        var command = $button.data('editor-command'),
            i       = 0;

        if (command === 'newTable') {
            var columns = $('#table-columns-input').val(),
                rows    = $('#table-rows-input').val(),
                j       = 0,
                table   = '<table class="table table-bordered table-hover"><tbody>',
                node;

            for (i; i < rows; i++) {
                table += '<tr>';
                for (j = 0; j < columns; j++) {
                    table += '<td></td>';
                }
                table += '</tr>';
            }

            table += '</tbody></table><p><br /></p>';

            this.replaceSelection();

            // Before inserting table, check the container node
            node = this.getCurrentNode();
            if (node.tagName === 'P') {
                $(node).remove();
            }

            document.execCommand('insertHTML', false, table);
        } else {
            var $currentNode = $(this.getCurrentNode()),
                html         = '',
                $tr          = $currentNode.parent(),
                $trs         = $tr.parent().find('tr'),
                index;

            if (command === 'addRowAbove' || command === 'addRowBelow') {
                var len    = $tr.find('td').length;

                html = '<tr>';
                for (i; i < len; i++) {
                    html += '<td></td>';
                }
                html += '</tr>';

                if (command === 'addRowBelow') {
                    $tr.after(html);
                } else {
                    $tr.before(html);
                }

            } else if (command === 'addColumnLeft' || command === 'addColumnRight') {
                index = $tr.find('td').index($currentNode);
                var addition;

                if (command === 'addColumnLeft') {
                    addition = function () {
                        $(this).find('td').eq(index).before('<td></td>');
                    };
                } else {
                    addition = function () {
                        $(this).find('td').eq(index).after('<td></td>');
                    };
                }

                $trs.each(addition);
            } else if (command === 'deleteCurrentRow') {
                $currentNode.parent().remove();
            } else if (command === 'deleteCurrentColumn') {
                index = $tr.find('td').index($currentNode);

                $trs.each(function() {
                    $(this).find('td').eq(index).remove();
                });
            } else if (command === 'deleteCurrentTable') {
                while ($currentNode.get(0).tagName !== 'TABLE') {
                    $currentNode = $currentNode.parent();
                }

                $currentNode.remove();
            }
        }

        return true;
    };

    tableModule.prototype.getName          = function() { return 'table'; };

    window.nekland.Editor.modules.push(tableModule);
})();