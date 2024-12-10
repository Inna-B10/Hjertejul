import cardFamily from './cardFamily.js'
import { API_URL } from './constants.js'

// const API_URL = 'data/families.json'
// const API_URL = 'http://localhost:5111/api'

let families
export const output = document.getElementById('output')
const searchInput = document.getElementById('search')
const filters = document.querySelectorAll('#filters input[type=checkbox]')

filters.forEach(filter => filter.addEventListener('change', filterFamilies))
searchInput.addEventListener('input', filterFamilies)

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

	const filteredFamilies =
		families &&
		families.filter(family => {
			// --------------------------------- Search
			const matchesSearch =
				family.title.toLowerCase().trim().includes(searchValue) ||
				family.description.toLowerCase().trim().includes(searchValue) ||
				family.surname.toLowerCase().trim().includes(searchValue)

			// --------------------------------- Traits
			const matchesTraits = activeFilters.trait.every(
				trait =>
					family.otherTraits.includes(trait) || family.foodPref.includes(trait)
			)

			// -------------------------------- Allergies
			const matchesAllergies = activeFilters.allergies.every(
				allergy => !family.allergies.includes(allergy)
			)

			// ------------------------------- ChildGroup
			const uniqueGroups = [...new Set(family.childGroup)]
			const matchesChildGroup =
				uniqueGroups.every(group => activeFilters.childGroup.includes(group)) &&
				activeFilters.childGroup.some(group => uniqueGroups.includes(group))

			// --------------------------------- Result
			return (
				matchesSearch && matchesTraits && matchesAllergies && matchesChildGroup
			)
		})
	renderFamilies(filteredFamilies)
}

fetchFamilies()
