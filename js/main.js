// import families from '../data/families.json' with {type:'json'}
import cardFamily from './cardFamily.js'

const API_URL = 'data/families.json'
let families
export const output = document.getElementById('output')
const searchInput = document.getElementById('search')
const filters = document.querySelectorAll('#filters input[type=checkbox]')

filters.forEach(filter => filter.addEventListener('change', filterFamilies))
searchInput.addEventListener('input', filterFamilies)

async function fetchFamilies() {
	try {
		const response = await fetch(API_URL)
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
			const matchesSearch =
				family.title.toLowerCase().trim().includes(searchValue) ||
				family.description.toLowerCase().trim().includes(searchValue) ||
				family.surname.toLowerCase().trim().includes(searchValue)

			const matchesTraits = activeFilters.trait.every(
				trait =>
					family.otherTraits.includes(trait) || family.foodPref.includes(trait)
			)
			const matchesAllergies = activeFilters.allergies.every(
				allergy => !family.allergies.includes(allergy)
			)
			const matchesChildGroup = activeFilters.childGroup.every(group =>
				family.group.includes(group)
			)

			return (
				matchesSearch && matchesTraits && matchesAllergies && matchesChildGroup
			)
		})
	renderFamilies(filteredFamilies)
}

fetchFamilies()
