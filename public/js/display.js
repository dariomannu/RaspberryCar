const outputPanel = document.getElementById('output')

const logPosition = e => {
	if(e.hasOwnProperty('x'))
		document.getElementById('x').innerHTML = e.x
	if(e.hasOwnProperty('y'))
		document.getElementById('y').innerHTML = e.y
}

const logConnected = e => {
	document.body.classList.remove('error')
}

const logMessage = e => {
	outputPanel.innerHTML = '<p>' +JSON.stringify(e.data) +'</p>' +outputPanel.innerHTML
}

const logError = e => {
	document.body.classList.add('error')
	console.warn('ERROR on vehicle:', e)
}

const logEnd = e => {
	document.body.classList.add('error')
	logMessage({data:'Server disconnected!'})
	console.log('Server disconnected!')
}

const display = {
	logMessage,
	logPosition,
	logError,
	logEnd,
}

export {display}
