// Karma configuration
// Generated on Fri Dec 01 2017 14:42:20 GMT+0800 (中国标准时间)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
		'vendor/angular/angular.js',
		'vendor/angular-mocks/angular-mocks.js',
		'index.js',
		'test/index-test.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,
    plugins: [
	  'karma-chrome-launcher',
	  'karma-firefox-launcher',
    'karma-jasmine',
	  'karma-junit-reporter',
    'karma-coverage',
    'karma-read-json'
    ],

    junitReporter: {
        outputFile: '/test_out/unit.xml',
        suite: 'unit'
	},
	// 新增节点用于配置输出文件夹
	coverageReporter: {
		type: 'html',
		dir: 'coverage'
	},
	// 新增节点用于配置需要测试的文件地址（这里是controller地址）
	preprocessors: {'index.js': ['coverage']},
	// 新增元素 coverage
	reporters: ['progress', 'coverage'],
  })
}
