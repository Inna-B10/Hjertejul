import cardFamily from './cardFamily.js'
import { API_URL } from './constants.js'
import { filters, output, searchInput, selectFilter } from './main.js'

export async function fetchFamilies(id = null) {
	console.log('Функция fetchFamilies вызвана с ID:', id)

	const url = id === null ? `${API_URL}/Families` : `${API_URL}/Families/${id}`
	console.log('URL:', url)

	try {
		const response = await fetch(url)
		console.log('Ответ получен:', response)

		if (!response.ok) throw new Error('Error loading data!')
		const families = await response.json()
		console.log('Данные:', families)
		return families

		// id ? editFamily(families) : renderFamilies(families)
	} catch (error) {
		console.error('Ошибка при загрузке данных:', error)
	}
}
// export async function fetchFamilies(id = null) {
// 	console.log(id)
//
// 	// get all families or get family by id
// 	const url = id === null ? `${API_URL}/Families` : `${API_URL}/Families/${id}`
// 	try {
// 		const response = await fetch(url)
// 		if (!response.ok) throw new Error('Error loading data!')
// 		families = await response.json()
// 		console.log(id)
// 		id ? editFamily(families) : renderFamilies(families)
// 	} catch (error) {
// 		console.error(error)
// 		throw new Error('Error fetching data!')
// 	}
// }

export function renderFamilies(array) {
	if (array) {
		if (output) {
			output.innerText = ''
		}
		array.forEach(family => {
			cardFamily(family)
		})
	}
}

export function filterFamilies(families) {
	const searchValue = searchInput.value.toLowerCase().trim()

	// collect all checked checkboxes
	const activeFilters = {
		foodPref: Array.from(filters)
			.filter(checkbox => checkbox.checked && checkbox.dataset.food)
			.map(checkbox => checkbox.dataset.food),
		trait: Array.from(filters)
			.filter(checkbox => checkbox.checked && checkbox.dataset.trait)
			.map(checkbox => checkbox.dataset.trait),
		allergies: Array.from(filters)
			.filter(checkbox => checkbox.checked && checkbox.dataset.allergies)
			.map(checkbox => checkbox.dataset.allergies),
		childGroup: Array.from(filters)
			.filter(checkbox => checkbox.checked && checkbox.dataset.group)
			.map(checkbox => checkbox.dataset.group),
	}
	console.log(activeFilters)
	const filteredFamilies = families?.filter(family => {
		// --------------------------------- Check totalPeople first
		if (family.totalPeople > Number(selectFilter.value)) {
			return false
		}

		// --------------------------------- Search
		const matchesSearch = searchValue
			? ['title', 'description', 'surname'].some(field =>
					family[field]?.toLowerCase().trim().includes(searchValue)
			  )
			: true // If searchValue is empty, match all families

		// --------------------------------- FoodPref
		const matchesFoodPref =
			activeFilters.foodPref.length === 0
				? family.foodPref.length === 0
				: activeFilters.foodPref.every(pref => family.foodPref.includes(pref))
		// --------------------------------- Traits
		const matchesTraits = activeFilters.trait.every(trait =>
			family.otherTraits.includes(trait)
		)

		// -------------------------------- Allergies
		const matchesAllergies = activeFilters.allergies.every(
			allergy => !family.allergies.includes(allergy)
		)

		// ------------------------------- ChildGroup
		const uniqueGroups = [...new Set(family.childGroup)]
		const matchesChildGroup =
			activeFilters.childGroup.length === 0
				? uniqueGroups.length === 0 // Show only families with empty childGroup
				: activeFilters.childGroup.length === 3
				? family.childGroup
				: uniqueGroups.some(group =>
						activeFilters.childGroup.includes(group)
				  ) &&
				  activeFilters.childGroup.some(group => uniqueGroups.includes(group))

		// --------------------------------- Result
		return (
			matchesSearch &&
			matchesFoodPref &&
			matchesTraits &&
			matchesAllergies &&
			matchesChildGroup
		)
	})

	renderFamilies(filteredFamilies)
}