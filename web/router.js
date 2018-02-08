module.exports = (hardware_controller, sound_controller) => {

	return function router(message) {
		var p
		switch(message.command) {
			case 'DRIVE':
				p=hardware_controller.drive(message)
				break
			case 'TWEEN':
				p=hardware_controller.tween(message.target)
				break;
			case 'POWER':
				p=hardware_controller.power(message.target, message.value)
				break
			case 'RESET':
				p=hardware_controller.reset();
				break
			case 'SFX':
				p=sound_controller.play(message.file)
				break
			case 'HORN':
				p=sound_controller.horn()
				break
			case 'ENGINE':
				p=sound_controller.engine()
				break
			case 'MEOW':
				p=sound_controller.meow()
				break
			default:
				p=Promise.reject('Unknown command', message)
				break
		}
		return p
	}
}
