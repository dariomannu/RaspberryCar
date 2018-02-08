const config = {
	inputSources: {
		onunload  : true,
		onblur    : true,
		arrows    : true,
		extraKeys : true,
		gyroscope : true,
		gamepad   : {
			index: 0,
		},
		uiButtons : true,
	},
	//controls: {
	//	keyboard: {
	//		//"ArrowUp":    DRIVE_FWD,
	//		//"ArrowDown":  DRIVE_REV,
	//		//"ArrowLeft":  STEER_LEFT,
	//		//"ArrowRight": STEER_RIGHT,

	//		"KeyE": ENGINE_LIGHTS,
	//		"KeyL": FRONT_LIGHTS,
	//		"KeyB": BACK_LIGHTS,
	//		"KeyH": HORN,
	//		"KeyG": ENGINE,
	//		"KeyM": MEOW,
	//		"KeyX": RESET,
	//	},
	//	gamepad: {
	//		axes: {
	//			0:   STEER,
	//			1:   DRIVE,
	//		},
	//		buttons: {
	//			"0": ENGINE    , // [ ] square button
	//			"1": MEOW      , //  X  X button
	//			"2": LIGHT     , // ( ) circle button
	//			"3": BACKLIGHT , // /_\ triangle button

	//			"8": HORN      , // STOP button
	//			"9": ENGINE    , // PLAY button

	//			"12": RESET    , // HOME button
	//		}
	//	}
	//}
}

export {config}

