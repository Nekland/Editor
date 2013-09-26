var demo = 'file:///' + casper.cli.get(0) + '/demo/index.html';



casper.test.begin('Nekland WYSIWYG', 1, function suite(test) {

    casper.start(demo, function() {
        console.log(this.getTitle());
        test.assertExists('#textarea');

    }).run(function() {
        test.done();
    });

});