import {
	createDesc,
	createImage,
	createNode,
	createTitle,
} from './createElements.js'

const modal = document.getElementById('modal')
const overlay = document.getElementById('overlay')
overlay.addEventListener('click', e => closeModalCard(e))
const textArea = document.getElementById('booking')

const sendButton = document.getElementById('send-button')
sendButton.addEventListener('click', sendForm)

export function showModalCard(family) {
	const modalOutput = document.getElementById('modal-output')
	modalOutput.innerHTML = ''

	const img = createImage(
		`../data/${family.image}`,
		`Bilde av familien ${family.surname}`,
		`Bilde av familien ${family.surname}`,
		'100%',
		'auto'
	)
	const familyTitle = createTitle('h3', family.title)

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
	if (textArea.value.trim() !== '') {
		alert('Din melding er ikke sent ennå!')
	} else {
		modal.style.display = 'none'
		overlay.style.display = 'none'
	}
}

function sendForm(event) {
	event.preventDefault()
	if (textArea.value.trim() === '') {
		alert('Du må skrive noe!')
	} else {
		textArea.value = ''
		alert('Meldingen er sent!')
	}
}
