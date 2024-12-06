export function truncateText(text, maxLength = 50) {
	if (text.length <= maxLength) {
		return text
	}
	return text.slice(0, maxLength) + '[..]'
}
