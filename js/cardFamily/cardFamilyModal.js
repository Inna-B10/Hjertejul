import { DATA_URL } from '../constants.js'
import {
	createDesc,
	createHeading,
	createImage,
	createNode,
} from '../functions/createElements.js'
import { sendForm } from '../functions/functions.js'

const modal = document.getElementById('modal')
const overlay = document.getElementById('overlay')
overlay &&
	overlay.addEventListener('click', e => closeModalCard(e, '#booking-form'))

const sendButton = document.getElementById('send-button')
sendButton &&
	sendButton.addEventListener('click', event => {
		sendForm(event, '#booking-form')
	})

export function showModalCard(family) {
	const closeButton = document.querySelector('.close-button')
	closeButton.addEventListener('click', e => closeModalCard(e, '#booking-form'))

	const modalOutput = document.getElementById('modal-output')
	modalOutput.innerHTML = ''

	document.body.style.overflow = 'hidden'

	const img = createImage(
		`${DATA_URL}/images_family/${family.image}`,
		`Bilde av familien ${family.surname}`,
		`Bilde av familien ${family.surname}`,
		'100%',
		'auto'
	)
	const familyTitle = createHeading('h3', family.title)

	const desc = createDesc(family.description)
	const surname = createHeading('h4', `Familie: ${family.surname}`)
	const list = createNode('ul', {})

	//create an array of data to subsequently create list items
	const items = [
		{ text: `Antall gjester: ${family.totalPeople}` },
		{
			text:
				'Barn i aldersgruppe: ' +
				(family.childGroup.length > 0 ? family.childGroup : 'uten barn'),
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

	const editButton = createNode('button', {})
	editButton.innerText = 'rediger'
	editButton.onclick = () => {
		window.location.href = `./manageFamily.html?id=${family.id}`
	}

	modalOutput.append(img, familyTitle, desc, surname, list, editButton)

	modal.style.display = 'block'
	overlay.style.display = 'block'
}

function closeModalCard(event, idForm) {
	const form = document.querySelector(idForm)
	const textArea = form.querySelector('textarea')
	if (textArea.value.trim() !== '') {
		alert('Din melding er ikke sent ennå!')
	} else {
		document.body.style.overflow = ''
		modal.style.display = 'none'
		overlay.style.display = 'none'
	}
}
