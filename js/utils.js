export function truncateText(text, maxLength = 50) {
	if (text.length <= maxLength) {
		return text
	}

	const truncated = text.slice(0, maxLength + 1)
	const lastSpaceIndex = truncated.lastIndexOf(' ')

	if (lastSpaceIndex === -1) {
		return text.slice(0, maxLength) + ' [..]'
	}

	return text.slice(0, lastSpaceIndex) + ' [..]'
}
