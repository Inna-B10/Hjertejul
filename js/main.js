import { fetchFamilies, filterFamilies, renderFamilies } from './functions.js'

let families
export const output = document.getElementById('output')
if (output) {
	async function getData() {
		// Дождемся результата fetchFamilies
		console.log('Функция fetchFamilies вызвана без ID')
		families = await fetchFamilies()

		// Убедимся, что families - это массив
		if (Array.isArray(families)) {
			renderFamilies(families)
		} else {
			console.error('fetchFamilies вернул данные не в виде массива:', families)
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
