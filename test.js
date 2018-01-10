const Jasmine = require('jasmine')
const runner = new Jasmine()
const Rx = require('rxjs')

global.jasmine = runner.jasmine
global.Rx = Rx

runner.loadConfig({
	spec_dir: 'public',
	spec_files: ['**/*.spec.js'],
	verbose: true,
	watch: true
});

runner.execute();
