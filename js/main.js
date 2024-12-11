import cardFamily from './cardFamily.js'
import { API_URL } from './constants.js'

// const API_URL = 'data/families.json'
// const API_URL = 'http://localhost:5111/api'

let families
export const output = document.getElementById('output')
const searchInput = document.getElementById('search')
const filters = document.querySelectorAll(
	'#filters input[type=checkbox], #filters select'
)

const selectFilter = document.querySelector('#filters select')

filters.forEach(filter => filter.addEventListener('change', filterFamilies))
searchInput.addEventListener('input', filterFamilies)
const resetButton = document.getElementById('resetButton')
resetButton.addEventListener('click', () => {
	filters.forEach(checkbox => {
		checkbox.checked = false
	})
	selectFilter.value = selectFilter.options[1].value
	searchInput.value = ''
	renderFamilies(families)
})

async function fetchFamilies(id = null) {
	let url
	// get all families
	if (id === null) {
		url = `${API_URL}/Families`
	}
	//get family by id
	else {
		url = `${API_URL}/Families/${id}`
	}
	try {
		const response = await fetch(url)
		if (!response.ok) throw new Error('Error loading data!')
		families = await response.json()
		renderFamilies(families)
	} catch (error) {
		console.error(error)
		throw new Error('Error fetching data!')
	}
}

function renderFamilies(array) {
	if (array) {
		output.innerText = ''
	}

	array.forEach(family => {
		cardFamily(family)
	})
}

function filterFamilies() {
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

fetchFamilies()
