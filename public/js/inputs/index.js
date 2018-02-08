import {page} from './page.js'
import {gyroscopeFilter} from './gyroscope.js'
import {keyboardFilter} from './keyboard.js'
import {extraKeysFilter} from './extrakeys.js'
import {gamepadController} from './gamepad.js'
import {ui} from './ui.js'

const samplingTimer = Rx.Observable.timer(100)
const gamepads = samplingTimer.flatMap(x=>{
	let g = navigator.getGamepads()
	return [...Array(navigator.getGamepads().length).keys()].map(i=>g.item(i))
}).filter(g=>!!g)
const gamepad = n => gamepads.filter(g => g.id === n)

const listen = config => {
	const listeners = []

	config.onunload  && listeners.push( page.unload(window) )
	config.onblur    && listeners.push( page.blur(window) )
	config.arrows    && listeners.push( keyboardFilter(Rx.Observable.merge(Rx.Observable.fromEvent(document, 'keydown'), Rx.Observable.fromEvent(document, 'keyup'))) )
	config.extraKeys && listeners.push( extraKeysFilter(Rx.Observable.merge(Rx.Observable.fromEvent(document, 'keydown'), Rx.Observable.fromEvent(document, 'keyup'))) )
	config.gyroscope && listeners.push( gyroscopeFilter(Rx.Observable.fromEvent(window, 'deviceorientation').skip(1)) )
	config.gamepad   && listeners.push( gamepadController(gamepad(config.gamepad.index)) )
	config.uiButtons && listeners.push( ui.buttons(Rx.Observable.fromEvent(document, 'click').filter(ui.isButton)) )

	return Rx.Observable.merge.apply(undefined, listeners)
}

const controller = {
	listen
}

export {controller}

