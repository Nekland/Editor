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

        return self.command($(this));
    });

    // Added event on the editor when user add any character
    this.$editor.keyup($.proxy(this.onKeyUp, this));

    // Add the event on the button for link
    this.$wrapper.find('.open-link-modal').click($.proxy(function() {
        this.saveSelection();

        return this.$wrapper.find('.nekland-editor-link').modal('show');
    }, this));

    // Remove the availability of the enter key
    // on the input in the link modal
    this.$wrapper.find('.link-input').keydown(this.removeEnter);
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