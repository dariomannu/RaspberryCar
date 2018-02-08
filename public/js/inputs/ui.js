//import {Rx} from './Rx.js';

const isButton = e => e.target.nodeName === 'BUTTON'

const command = e => {
	const command = e.target.getAttribute('data-command')
	const target = e.target.getAttribute('data-target')
	return { command, target }
}

const ui = {
	buttons: eventSource => eventSource.map(command),
	isButton,
}

export { ui }

