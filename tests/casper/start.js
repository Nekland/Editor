var demo = 'file:///' + casper.cli.get(0) + '/../../demo/index.html';

casper.test.begin('Is nekland editor loaded without errors', 1, function suite(test) {

    casper.start(demo, function() {
        test.assertExists('.nekland-editor-html');

    }).run(function() {
        test.done();
    });

});