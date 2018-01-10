//import {Rx} from './Rx.js';

function gamepadFilter(window, navigator) {
	console.log('init')
	let gamepads
	let gamepadsStates = []

	const gamepadStream = new Rx.Subject()
		.do((x)=>console.log('SUBJ:', x))

	const cloneGamepadState = gamepad => {
		console.log('clone')
		return {
			axes: JSON.parse(JSON.stringify(gamepad.axes)),
			buttons: gamepad.buttons.map((b)=>{
				return {pressed: b.pressed, touched: b.touched, value: b.value};
			}),
		}
	}

	function monitor() {
		console.log('monitor')
		let gamepads = navigator.getGamepads()
		for(var i=0; i<gamepads.length; i++) {
			let gamepad = gamepads.item(i)
			console.log('GP: ', gamepad.axes[0])

			if(!gamepad) {
				console.log('NO GAMEPAD')
				break
			}

			if(!gamepadsStates[i]) {
				gamepadsStates[i] = cloneGamepadState(gamepad)
			} else {
				let gamepadState = gamepadsStates[i]

				gamepad.axes.forEach((a,ai) => {
					console.log('state of ', ai, gamepadState.axes[ai], a)
					if(gamepadState.axes[ai] !== a) {
						console.log(')))', a)
						gamepadStream.next({event: 'axis', gamepad: i, axis: ai, value: a});
					}
				});

				gamepad.buttons.forEach((b,bi)=>{
					if( gamepadState.buttons[bi].pressed !== b.pressed || gamepadState.buttons[bi].touched !== b.touched )
						gamepadStream.next({event: 'button', gamepad: i, button: bi, pressed: b.pressed, touched: b.touched, state: b.value});
				});
				gamepadsStates[i] = cloneGamepadState(gamepad);
			}
		}

		window.requestAnimationFrame(monitor);
	}
	window.requestAnimationFrame(monitor);

	return gamepadStream
}

export { gamepadFilter }

