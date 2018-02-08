const Jasmine = require('jasmine')
const runner = new Jasmine()

global.jasmine = runner.jasmine
global.Rx = require('rxjs')

global.sinon = require('sinon')
global.should = require('chai')
	.use(require('sinon-chai'))
	.use(require('chai-as-promised'))
	.should()

global.expect = require('chai')
	.use(require('sinon-chai'))
	.use(require('chai-as-promised'))
	.expect

global.sandbox = function (fn) {
	beforeEach(function () {
		global.sandbox = global.sinon.sandbox.create({
			injectInto: null,
			properties: ['spy', 'stub', 'mock']
		})
	})

	afterEach(function () {
		global.sandbox.restore()
	})

	return fn
}

runner.loadConfig({
	spec_dir: '.',
	spec_files: ['{web,public}/**/*.spec.js'],
	verbose: true,
	watch: true
})

runner.execute()

