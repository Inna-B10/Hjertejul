import { DATA_URL } from '../constants.js'
import {
	createDesc,
	createHeading,
	createImage,
	createNode,
} from '../functions/createElements.js'
import { output } from '../main.js'
import { truncateText } from '../utils.js'
import { showModalCard } from './cardFamilyModal.js'

export default function cardFamily(family) {
	const card = createNode('div', {
		class: 'family-card',
	})
	card.addEventListener('click', () => {
		showModalCard(family)
	})
	const img = createImage(
		`${DATA_URL}/images_family/${family.image}`,
		`Bilde av familien ${family.surname}`,
		`Bilde av familien ${family.surname}`,
		'100%',
		'auto'
	)
	const familyTitle = createHeading('h3', family.title)

	const desc = createDesc(truncateText(family.description))

	card.append(img, familyTitle, desc)
	output.appendChild(card)
}
