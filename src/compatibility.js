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