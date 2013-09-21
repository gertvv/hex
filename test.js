require.config({
	paths: {
		'jasmine': 'lib/jasmine/jasmine',
		'jasmine-html': 'lib/jasmine/jasmine-html'
	},
	shim: {
		jasmine: {
			exports: 'jasmine'
		},
		'jasmine-html': {
			deps: ['jasmine'],
			exports: 'jasmine'
		}
	}
});


require(['jasmine-html'], function (jasmine) {
	var jasmineEnv = jasmine.getEnv();
	jasmineEnv.updateInterval = 1000;

	var htmlReporter = new jasmine.HtmlReporter();

	jasmineEnv.addReporter(htmlReporter);

	jasmineEnv.specFilter = function (spec) {
		return htmlReporter.specFilter(spec);
	};

	var specs = [];

	specs.push('spec/HexGridTest');

	require(specs, function() {
		jasmineEnv.execute();
	});
});
