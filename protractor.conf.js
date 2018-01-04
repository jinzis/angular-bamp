var Jasmine2HtmlReporter = require('protractor-jasmine2-html-reporter');
exports.config = {
    framework: 'jasmine',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    // seleniumServerJar: 'node_modules/protractor/selenium/selenium-server-standalone-2.45.0.jar',
    specs: ['test/e2e/add.js'],
    jasmineNodeOpts : {
        defaultTimeoutInterval : 60000,
        showColors            : true,
        includeStackTrace      : true,
        isVerbose             : true
    },
    onPrepare: function() {
        jasmine.getEnv().addReporter(
          new Jasmine2HtmlReporter({
            savePath: './test/reports/',
            screenshotsFolder: 'images',
            takeScreenshotsOnlyOnFailures: true
          })
        );
     }
};