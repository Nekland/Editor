How modules work
================

You want to create a new module for our editor ? That's easy.

What you need to do
-------------------

*A module is a javascript class.*


If you create a new module, it must implement the following methods:
* `getTemplateBefore`: have to return a string (Usually he button you want to add on the editor)
* `getName`: have to return a string (as simple as possible: the name of your module)
* `execute`: you have to "say" what your module does on activation (using the context of the editor), return true if you don't want to prevent following events

You can also implements some other methods that will be automatically call:
* `getTemplateAfter`: have to return an html string (that can be empty) witch will be added to the html after the editor
* `addEvents`: this method doesn't return anything but you can add events using the context of the editor
* `getTranslations`: have to return an object that contains translations

### Important things about **template**

Since the editor add automatically link to buttons, there are some requirements in your template.
* Each button that trigger the execution of a command must have the attribute `data-editor-module="{nameOfYourModule}"`
* On the same way, it must have the class `nekland-editor-command`

Here is an example:

```html
<button class="btn btn-default nekland-editor-command" data-editor-module="{nameOfYourModule}"></button>
```

Register it
-----------

```javascript
window.nekland.Editor.modules.push(myModule);
```

Example
-------

Here is a basic module definition with some precisions :) .

You can find this module next to other modules in the folder `src/modules`.

```javascript
/**
 * Creation of a module in a closure to not disturb
 * the rest of the application
 */
(function() {

    /**
     * Some services injection
     *
     * @param translator The translator of the editor (usage with his "translate" method)
     */
    var myModule = function(translator) {
        this.translator = translator;
    };

    myModule.prototype.getTemplateBefore = function () {
        var tpl = '<button class="btn nekland-editor-command">' +
        this.translator.translate('bold', { ucfirst: true }) +
        '</button>';

        return tpl;
    };

    // Need to be define even if there is nothing to do
    // to follow the interface
    myModule.prototype.getTemplateAfter = function () { return ''; };

    // Again nothing to do since the template has the class "nekland-editor-command"
    // An event will be automatically added ;-)
    myModule.prototype.addEvents        = function () {};

    // The name of the module
    myModule.prototype.getName          = function () { return 'empty'; };

    // execute when clicking on
    // return "true" to don't prevent events
    myModule.prototype.execute          = function () {
        document.execCommand('something');
    };

    // Notice: this method is not needed
    myModule.prototype.getTranslations  = function () {
        return {
            'en': {
                'someKey': 'A random translation'
            },
            'fr': {
                'someKey': 'Une traduction aléatoire'
            }
        };
    };

    window.nekland.Editor.modules.push(myModule);
})();
```