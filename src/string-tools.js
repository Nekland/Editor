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

    return out;
};