import { fetchFamilies, filterFamilies, renderFamilies } from './functions.js'
import { renderForm } from './manageFamily.js'

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

export function editFamily(family) {
	console.log(family)
	renderForm(family)
}

// export function filterFamilies() {
// 	const searchValue = searchInput.value.toLowerCase().trim()
//
// 	// collect all checked checkboxes
// 	const activeFilters = {
// 		foodPref: Array.from(filters)
// 			.filter(checkbox => checkbox.checked && checkbox.dataset.food)
// 			.map(checkbox => checkbox.dataset.food),
// 		trait: Array.from(filters)
// 			.filter(checkbox => checkbox.checked && checkbox.dataset.trait)
// 			.map(checkbox => checkbox.dataset.trait),
// 		allergies: Array.from(filters)
// 			.filter(checkbox => checkbox.checked && checkbox.dataset.allergies)
// 			.map(checkbox => checkbox.dataset.allergies),
// 		childGroup: Array.from(filters)
// 			.filter(checkbox => checkbox.checked && checkbox.dataset.group)
// 			.map(checkbox => checkbox.dataset.group),
// 	}
//
// 	const filteredFamilies = families?.filter(family => {
// 		// --------------------------------- Check totalPeople first
// 		if (family.totalPeople > Number(selectFilter.value)) {
// 			return false
// 		}
//
// 		// --------------------------------- Search
// 		const matchesSearch = searchValue
// 			? ['title', 'description', 'surname'].some(field =>
// 					family[field]?.toLowerCase().trim().includes(searchValue)
// 			  )
// 			: true // If searchValue is empty, match all families
//
// 		// --------------------------------- FoodPref
// 		const matchesFoodPref =
// 			activeFilters.foodPref.length === 0
// 				? family.foodPref.length === 0
// 				: activeFilters.foodPref.every(pref => family.foodPref.includes(pref))
// 		// --------------------------------- Traits
// 		const matchesTraits = activeFilters.trait.every(trait =>
// 			family.otherTraits.includes(trait)
// 		)
//
// 		// -------------------------------- Allergies
// 		const matchesAllergies = activeFilters.allergies.every(
// 			allergy => !family.allergies.includes(allergy)
// 		)
//
// 		// ------------------------------- ChildGroup
// 		const uniqueGroups = [...new Set(family.childGroup)]
// 		const matchesChildGroup =
// 			activeFilters.childGroup.length === 0
// 				? uniqueGroups.length === 0 // Show only families with empty childGroup
// 				: activeFilters.childGroup.length === 3
// 				? family.childGroup
// 				: uniqueGroups.some(group =>
// 						activeFilters.childGroup.includes(group)
// 				  ) &&
// 				  activeFilters.childGroup.some(group => uniqueGroups.includes(group))
//
// 		// --------------------------------- Result
// 		return (
// 			matchesSearch &&
// 			matchesFoodPref &&
// 			matchesTraits &&
// 			matchesAllergies &&
// 			matchesChildGroup
// 		)
// 	})
//
// 	renderFamilies(filteredFamilies)
// }
//
// export function editFamily(family) {
// 	console.log(family)
// 	renderForm(family)
// }
