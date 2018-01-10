import {remote} from './remote.js'
import {controller} from './controller.js'

const outputPanel = document.getElementById('output')
const vector = (e,f) => f.x === e.x && f.y === e.y

window.remoteController = remote
//remote.connect(document.getElementById('remote').value)
remote.connect(location.href)
// FIXME: remove
window.remote = remote

controller
	//.distinctUntilChanged(vector)
	.do(e=>{
		if(e.command === 'MOVE') {
			if(e.hasOwnProperty('x'))
				document.getElementById('x').innerHTML = e.x
			if(e.hasOwnProperty('y'))
				document.getElementById('y').innerHTML = e.y
		}
	})
	.forEach(remote.command)

setInterval(() => {
	remote.heartbeat()
}, 900)


remote.receive
	.forEach((e) => {
		outputPanel.innerHTML = `<p>${JSON.stringify(e)}</p>` + output.innerHTML
	})
;

