import { showModalCard } from './cardFamilyModal.js'
import { createDesc, createNode, createTitle } from './createElements.js'
import { output } from './main.js'
import { truncateText } from './utils.js'

export default function cardFamily(family) {
	const card = createNode('div', {
		class: 'flex column card',
	})
	card.addEventListener('click', () => {
		showModalCard(family)
	})
	// const img = createImage(
	// 	`../data/${family.image}`,
	// 	`Bilde av familien ${family.surname}`,
	// 	`Bilde av familien ${family.surname}`,
	// 	'100%',
	// 	'auto'
	// )
	const familyTitle = createTitle('h3', family.title)

	const desc = createDesc(truncateText(family.description))

	// card.append(img, familyTitle, desc)
	card.append(familyTitle, desc)
	output.appendChild(card)
}
