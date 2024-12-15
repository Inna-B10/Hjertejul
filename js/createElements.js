export function createNode(node, attributes) {
	const el = document.createElement(node)
	for (let key in attributes) {
		el.setAttribute(key, attributes[key])
	}
	return el
}

export function createImage(src, alt, title, width, height) {
	return createNode('img', {
		src: src,
		alt: alt,
		title: title,
		width: width,
		height: height,
	})
}

export function createHeading(tag, text, attr) {
	const title = createNode(tag, attr)
	title.innerText = text
	return title
}

export function createDesc(text) {
	const desc = createNode('p', {
		class: 'desc',
	})
	desc.innerText = text
	return desc
}
