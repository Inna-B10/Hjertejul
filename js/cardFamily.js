import createNode from './utils.js'

export default function cardFamily(family) {
	const card = createNode('div', {
		class: 'flex column card',
	})
	console.log(card)
}
