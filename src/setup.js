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
if (window.nekland == null) {
	window.nekland = {};
}
// Create nekland lang namespace if doesn't exists
if (window.nekland.lang == null) {
	window.nekland.lang = {};
}
// Create lang editor namespace
window.nekland.lang.editor = {};