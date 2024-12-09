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
	const activeFilters = Array.from(filters)
		.filter(checkbox => checkbox.checked)
		.map(checkbox => checkbox.dataset.trait)

	const filteredFamilies =
		// families &&
		families.filter(family => {
			const matchesSearch =
				family.title.toLowerCase().trim().includes(searchValue) ||
				family.description.toLowerCase().trim().includes(searchValue) ||
				family.surname.toLowerCase().trim().includes(searchValue)
			const matchesFilters = activeFilters.every(
				trait =>
					family.otherTraits.includes(trait) || family.foodPref.includes(trait)
			)
			console.log(matchesSearch)
			return matchesFilters && matchesSearch
		})
	renderFamilies(filteredFamilies)
}

fetchFamilies()
