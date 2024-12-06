export default function createNode(node, attributes) {
	const el = document.createElement(node)
	for (let key in attributes) {
		el.setAttribute(key, attributes[key])
	}
	return el
}
