import { showModalCard } from './cardFamilyModal.js'
import {
	createDesc,
	createImage,
	createNode,
	createTitle,
} from './createElements.js'
import { output } from './main.js'
import { truncateText } from './utils.js'

export default function cardFamily(family) {
	const card = createNode('div', {
		class: 'flex column card',
	})
	card.addEventListener('click', () => {
		showModalCard(family)
	})
	const img = createImage(
		`../data/${family.image}`,
		`Bilde av ${family.name}`,
		`Bilde av ${family.name}`,
		'100%',
		'auto'
	)
	const familyTitle = createTitle('h3', family.name)

	const desc = createDesc(truncateText(family.description))

	card.append(img, familyTitle, desc)
	output.appendChild(card)
}
