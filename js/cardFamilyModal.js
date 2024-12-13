

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
	const list = createNode('ul', {})

	//create an array of data to subsequently create list items
	const items = [
		{ text: `Antall gjester: ${family.totalPeople}` },
		{
			text:
				'Barn i aldersgruppe: ' +
				(family.childGroup.length > 0 ? family.childGroup : 'ikke barn'),
		},
		{
			text: `Allergier: ${family.allergies}`,
			condition: family.allergies.length > 0,
		},
		{
			text: `Matpreferanser: ${family.foodPref}`,
			condition: family.foodPref.length > 0,
		},
		{
			text: `Andre vaner: ${family.otherTraits}`,
			condition: family.otherTraits.length > 0,
		},
	]

	//create only those elements that have data
	items.forEach(({ text, condition = true }) => {
		if (condition) {
			const item = createNode('li', {})
			text = text.split(',').join(', ')
			item.innerText = text
			list.appendChild(item)
		}
	})

	const closeButton = createNode('button', {
		class: 'close-button',
	})
	closeButton.innerText = 'X'
	closeButton.addEventListener('click', closeModalCard)

	modalOutput.append(img, familyTitle, desc, list, closeButton)

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
