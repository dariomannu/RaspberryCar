#!/usr/bin/env node
'use strict'

/*  just  */ require('babel-register')
const argv = require('commander')

argv
  .version('1.1.0')
	  .option('-c, --controller [controller]', 'Hardware controller [pwm]', 'pwm')
  .version('1.2.0')
	  .option('-h, --host [host]', 'Host [host]', '::')
	  .option('-p, --port [port]', 'Port [port]', '31337')
  .parse(process.argv)

const hardware = require('./lib/controllers/hardware')(argv.controller)
const sound    = require('./lib/controllers/hardware/sound.js')
const router   = require('./web/router.js')

// Inputs
const web   = require('./web')
//const terminal = require('./inputs/terminal') // (terminal_router(hardware, sound))
//const ai = require('./inputs/ai')             // (ai_router(hardware, sound))

async function main() {
	console.log(`Setting up "${argv.controller}" hardware controller`)
	await hardware.setup()
		.catch(e => {
			console.error(`Hardware setup error ${e.stack}`)
			process.exit(1)
		})

	console.log('Setting up web interface')
	const route = router(hardware, sound)

	web.createServer(argv.port, argv.host, route)
		.then(() => console.log(`Web Interface listening on ${argv.host}:${argv.port}`))
		.catch(e=>{
			console.error(e)
			route('RESET')
		})

	process.on( 'SIGINT', function() {
		console.log('SIGINT caught. Exiting')
		hardware
			.reset()
			.then(process.exit.bind(0))
	})

	process.on('uncaughtException', function(err) {
		console.error(err.stack)
		hardware
			.reset()
			.then(process.exit.bind(1))
	})

	process.on('unhandledRejection', (err, p) => {
		console.log('Unhandled Promise rejection', p, err.stack);
	})
}

main()

