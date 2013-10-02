var demo = 'file:///' + casper.cli.get(0) + '/../../demo/index.html',
    utils = require('utils');

casper.test.begin('Are nekland editor basics working', 1, function suite(test) {

    var $editor;

    casper.start(demo, function() {
        this.sendKeys('.nekland-editor-html', 'Hello world', {
            keepFocus: true
        });
        this.click('.nekland-switch-button');
    });

    casper.then(function() {
        test.assertEquals(this.getFormValues('form').content, '<p>Hello world</p>');
    });

    casper.run(function() {
        test.done();
    });

});