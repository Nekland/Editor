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