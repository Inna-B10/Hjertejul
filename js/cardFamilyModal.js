import {
	createDesc,
	createImage,
	createNode,
	createTitle,
} from './createElements.js'

const modal = document.getElementById('modal')
const overlay = document.getElementById('overlay')

export function showModalCard(family) {
	// modal.innerHTML = ''

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

	modal.append(img, familyTitle, desc, closeButton)

	modal.style.display = 'block'
	overlay.style.display = 'block'
}

function closeModalCard() {
	modal.style.display = 'none'
	overlay.style.display = 'none'
}
