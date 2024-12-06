import { output } from './main.js'
import createNode from './utils.js'

export default function cardFamily(family) {
	const card = createNode('div', {
		class: 'flex column card',
	})
	const img = createNode('img', {
		src: `../data/${family.image}`,
		alt: `Bilde av ${family.name}`,
		title: `Bilde av ${family.name}`,
		width: '100%',
		height: 'auto',
	})
	const familyTitle = createNode('h3', {})
	familyTitle.innerText = family.name

	//*TODO SHORT DESC!
	const desc = createNode('p', {
		class: 'desc',
	})
	desc.innerText = family.description
	card.append(img, familyTitle, desc)
	output.appendChild(card)
}
