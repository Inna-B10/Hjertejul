import { fetchFamilies, filterFamilies, renderFamilies } from './functions.js'

let families
export const output = document.getElementById('output')
if (output) {
	async function getData() {
		// Дождемся результата fetchFamilies
		console.log('Функция fetchFamilies вызвана без ID')
		families = await fetchFamilies()

		// Убедимся, что families - это массив
		if (Array.isArray(families) && families.length > 0) {
			console.log('render families')
			renderFamilies(families)
		} else {
			output.innerText = 'Error fetching data!'
			throw new Error('Error: no families fetched!')
		}
	}
	getData()
}

export const searchInput = document.getElementById('search')
searchInput &&
	searchInput.addEventListener('input', () => filterFamilies(families))

export const selectFilter = document.querySelector('#filters select')
export const filters = document.querySelectorAll(
	'#filters input[type=checkbox], #filters select'
)
filters &&
	filters.forEach(filter =>
		filter.addEventListener('change', () => filterFamilies(families))
	)
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
