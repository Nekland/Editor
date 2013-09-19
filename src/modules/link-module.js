/**
 * This file is a part of nekland editor package
 *
 * (c) Nekland <nekland.fr@gmail.fr>
 *
 * For the full license, take a look to the LICENSE file
 * on the root directory of this project
 */


// Old templates to report as modules (link module)
// linkButton: function () {
//     return "<div class=\"btn-group\">            <a class=\"btn dropdown-toggle\" data-toggle=\"dropdown\" href=\"#\">              " + self.translate('link', {
//         ucfirst: true
//     }) + "            <span class=\"caret\"></span>            </a>            <ul class=\"dropdown-menu\">              <li>                <a href=\"#\" class=\"open-link-modal\">                  " + self.translate('insertLink', {
//         ucfirst: true
//     }) + "                </a>              </li>              <li>                <a href=\"#\" class=\"nekland-editor-command\" data-editor-command=\"unlink\" data-prevent=\"no\">                  " + self.translate('removeLink', {
//         ucfirst: true
//     }) + "                </a>              </li>            </ul>          </div>";
// },
// modals: function() {
//     return "<div class=\"modal hide fade nekland-editor-link\" role=\"dialog\" aria-hidden=\"true\">            <div class=\"modal-header\">              <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">×</button>              <h3>" + self.translate('addLink', {
//         ucfirst: true
//     }) + "</h3>            </div>            <div class=\"modal-body\">              <input type=\"text\" class=\"link-input\" style=\"width: 250px;\" />              <p class=\"error link-error\"></p>            </div>            <div class=\"modal-footer\">              <button type=\"button\" class=\"btn\" data-dismiss=\"modal\" aria-hidden=\"true\">" + self.translate('close', {
//         ucfirst: true
//     }) + "</button>              <button type=\"button\" class=\"btn btn-primary nekland-editor-command\" data-dismiss=\"modal\"                      data-option-selector=\".link-input\" data-editor-command=\"createLink\"                      data-prevent=\"no\">" + self.translate('insertLink', {
//         ucfirst: true
//     }) + "              </button>            </div>          </div>";
// },


    // // Add the event on the button for link
    // this.$wrapper.find('.open-link-modal').click($.proxy(function() {
    //     this.saveSelection();

    //     return this.$wrapper.find('.nekland-editor-link').modal('show');
    // }, this));

    // // Remove the availability of the enter key
    // // on the input in the link modal
    // this.$wrapper.find('.link-input').keydown(this.removeEnter);