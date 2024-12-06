import {
	createDesc,
	createImage,
	createNode,
	createTitle,
} from './createElements.js'

const modal = document.getElementById('modal')
const overlay = document.getElementById('overlay')
overlay.addEventListener('click', e => closeModalCard(e))

const sendButton = document.getElementById('send-button')
sendButton.addEventListener('click', sendForm)

export function showModalCard(family) {
	const modalOutput = document.getElementById('modal-output')
	modalOutput.innerHTML = ''

	const img = createImage(
		`../data/${family.image}`,
		`Bilde av ${family.name}`,
		`Bilde av ${family.name}`,
		'100%',
		'auto'
	)
	const familyTitle = createTitle('h3', family.name)

	const desc = createDesc(family.description)

	const closeButton = createNode('button', {
		class: 'close-button',
	})
	closeButton.innerText = 'X'
	closeButton.addEventListener('click', closeModalCard)

	modalOutput.append(img, familyTitle, desc, closeButton)

	modal.style.display = 'block'
	overlay.style.display = 'block'
}

function closeModalCard() {
	modal.style.display = 'none'
	overlay.style.display = 'none'
}

function sendForm(event) {
	event.preventDefault()
	const textArea = document.getElementById('booking')
	textArea.value = ''
}
