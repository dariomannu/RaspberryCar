import {config} from '../config/config.js'
import {socket} from './socket.js'
import {controller} from './inputs/index.js'
import {display} from './display.js'

const vehicle = socket.connect(location.href)

vehicle.messages
	.forEach(display.logMessage)
	.then(display.logEnd)
	.catch(display.logError)

controller.listen(config.inputSources)
	.do(console.log)
	.forEach(vehicle.command)

