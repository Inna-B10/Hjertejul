import {
	fetchFamilies,
	filterFamilies,
	renderFamilies,
	sendForm,
} from './functions.js'

let families
export const output = document.getElementById('output')
if (output) {
	async function getData() {
		families = await fetchFamilies()

		if (Array.isArray(families) && families.length > 0) {
			renderFamilies(families)
		} else {
			output.innerText = 'Error fetching data!'
			throw new Error('Error: no families fetched!')
		}
	}
	getData()
	document.getElementById('contact-form').addEventListener('submit', event => {
		sendForm(event, '#contact-form')
	})
}

export const searchInput = document.getElementById('search')
searchInput &&
	searchInput.addEventListener('input', () => filterFamilies(families))

export const selectFilter = document.querySelector('#filters select')
export const filters = Array.from(
	document.querySelectorAll('#filters input[type=checkbox], #filters select')
)

filters &&
	filters.forEach(filter =>
		filter.addEventListener('change', () => updateCheckBoxes(filter))
	)

function updateCheckBoxes(filter) {
	if (filter.type === 'checkbox') {
		const key = Object.keys(filter.dataset)[0]
		console.log(
			filters.map(f => ({
				key: Object.keys(f.dataset)[0],
				value: f.dataset[key],
			}))
		)
		const passerAltCheckbox = filters.find(
			otherFilter => otherFilter.dataset[key] === 'passer alt'
		)

		// Checking the key value
		if (
			['passer alt', 'uten barn'].includes(filter.dataset[key]) &&
			filter.checked
		) {
			filters
				.filter(
					otherFilter =>
						['passer alt', 'uten barn'].includes(otherFilter.dataset[key]) &&
						otherFilter !== filter
				)
				.forEach(otherFilter => (otherFilter.checked = false))
		} else {
			if (filter.checked) {
				// disable "passer alt"
				if (passerAltCheckbox) {
					passerAltCheckbox.checked = false
					passerAltCheckbox.disabled = true
				}
			} else {
				// Check if no other filter is checked
				const anyChecked = filters.some(otherFilter => {
					// check only checkboxes with the current dataset
					if (
						otherFilter.dataset[key] !== undefined &&
						otherFilter.dataset[key] !== filter.dataset[key] &&
						otherFilter !== filter
					) {
						return otherFilter.checked
					}
					return false //filter checkboxes with other dataset
				})

				if (!anyChecked && passerAltCheckbox) {
					passerAltCheckbox.checked = true
					passerAltCheckbox.disabled = false
				}
			}
		}
	}
	filterFamilies(families)
}
const resetButton = document.getElementById('resetButton')
resetButton &&
	resetButton.addEventListener('click', () => {
		filters.forEach(checkbox => {
			checkbox.checked = false
		})
		selectFilter.value = selectFilter.options[6].value
		searchInput.value = ''
		renderFamilies(families)
	})
