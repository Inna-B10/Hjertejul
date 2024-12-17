import { allergies, childGroup, foodPref, otherTraits } from './constants.js'
import {
	fetchFamilies,
	filterFamilies,
	renderFamilies,
	sendForm,
} from './functions.js'
import handleFilterChange from './handleFilterChange.js'

export let families
export const output = document.getElementById('output')

/* ------------------------------- Main Output ------------------------------ */
if (output) {
	async function getData() {
		families = await fetchFamilies()

		if (Array.isArray(families) && families.length > 0) {
			renderFamilies(families)
		} else {
			output.innerText =
				'An error has occurred while attempting to connect to the server.'
			throw new Error('Error: Error fetching data!')
		}
	}
	getData()
	document.getElementById('contact-form').addEventListener('submit', event => {
		sendForm(event, '#contact-form')
	})
}

/* --------------------------------- Filters -------------------------------- */
// Constants for groups
const optionsMap = {
	childGroup,
	foodPref,
	allergies,
	otherTraits,
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
		filter.addEventListener('change', () =>
			handleFilterChange(filter, filters, optionsMap)
		)
	)

/* ------------------------------- Reset Form ------------------------------- */
const resetButton = document.getElementById('resetButton')
resetButton &&
	resetButton.addEventListener('click', () => {
		filters.forEach(checkbox => {
			checkbox.checked = false
		})
		if (selectFilter && selectFilter.options.length > 0) {
			selectFilter.selectedIndex = selectFilter.options.length - 1
		}
		searchInput.value = ''
		renderFamilies(families)
	})
