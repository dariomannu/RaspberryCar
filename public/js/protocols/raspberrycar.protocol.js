// ASN.1?
const mapping = {
	'RESET': {
		description: "Stop all motors, lights and switches",
		request: () => { command: 'ENGINE' },
		response: () => { response: 'OK' },
	},
	'ENGINE': {
		description: "Start the Engine (Sound effect)",
		request: () => { command: 'ENGINE' },
		response: () => { response: 'OK' },
	},
	'MEOW': {
		description: "Meow like an angry cat",
		request: () => { command: 'MEOW' },
		response: () => { response: 'OK' },
	},
	'HORN': {
		description: "Blow the horn",
		request: () => { command: 'HORN' },
		response: () => { response: 'OK' },
	},
	'FRONT_LIGHTS': {
		description: "Toggle the front lights",
		request: () => { command: 'TWEEN', target: 'LIGHT' },
		response: () => { response: 'OK' },
	},
	'BACK_LIGHTS': {
		description: "Toggle the back lights",
		request: () => { command: 'TWEEN', target: 'BACKLIGHT' },
		response: () => { response: 'OK' },
	},
	'ENGINE_LIGHTS': {
		description: "Toggle the engine light",
		request: () => { command: 'TWEEN', target: 'ENGINE' },
		response: () => { response: 'OK' },
	},
	'LASER': {
		description: "Toggle the laser lights",
		request: () => { command: 'TWEEN', target: 'LASER' },
		response: () => { response: 'OK' },
	},
	'STEER': {
		description: "Steer right/left",
		request: (x) => { command: 'DRIVE', x },
		response: () => { response: 'OK' },
	},
	'DRIVE': {
		description: "Drive forward/reverse",
		request: (y) => { command: 'DRIVE', y },
		action:  (message) => hardware_controller.drive(message),
	},
	'DRIVE_FWD': {
		description: "Drive forward",
		request: (y) => { command: 'DRIVE', y: 1 },
		action:  (message) => hardware_controller.drive({ y: 1 }),
	},
	'DRIVE_REV': {
		description: "Drive reverse",
		request: (y) => { command: 'DRIVE', y: -1 },
		action:  (message) => hardware_controller.drive({ y: -1 }),
	},
}

const createCommand = (command, parameters) => {
	if(!mapping[command])
		throw new Error(`Unknown command: ${command}.`)
	else
		return mapping[command].apply(parameters)
}

export {createCommand}

