import cardFamily from './cardFamily.js'
import { API_URL } from './constants.js'
import { filters, output, searchInput, selectFilter } from './main.js'

export async function fetchFamilies(id = null) {
	const url = id === null ? `${API_URL}/Families` : `${API_URL}/Families/${id}`

	try {
		const response = await fetch(url)

		if (!response.ok) {
			// if (output)
			// 	output.innerText = `${response.status}: ${response.StatusText}`
			// if (outputForm)
			// 	outputForm.innerText = `${response.status}: ${response.StatusText}`
			displayMessage(`${response.status}: ${response.StatusText}`, 'error')
			throw new Error(`${response.status}: Error loading data!`)
		}
		const data = await response.json()
		const families = data.data

		return families
	} catch (error) {
		console.error('Error loading data:', error.message)
		throw new Error('Error loading data:', error.message)
	}
}

export function renderFamilies(array) {
	if (array) {
		if (output) {
			output.innerText = ''

			if (array.length > 0) {
				array.forEach(family => {
					cardFamily(family)
				})
			} else {
				output.innerText = 'Ingen familie funnet basert på dine kriterier'
			}
		}
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
export function displayMessage(message, type) {
	const messageContainer = document.getElementById('message-container')

	messageContainer.innerText = message
	messageContainer.className = type // 'success' or 'error'
	// setTimeout(() => {
	// 	messageContainer.innerText = ''
	// 	messageContainer.className = ''
	// }, 5000) // disappear after 5 sec
}

export function saveData(id = null) {
	const form = document.getElementById('add-edit-form')

	const formData = new FormData(form)
	const updatedData = {
		surname: formData.get('surname'),
		title: formData.get('title'),
		description: formData.get('description'),
		totalPeople: Number(formData.get('totalPeople')),
		childGroup: Array.from(formData.getAll('childGroup')),
		allergies: formData.get('allergies')
			? formData
					.get('allergies')
					.split(',')
					.map(item => item.trim())
			: [],
		foodPref: formData.get('foodPref')
			? formData
					.get('foodPref')
					.split(',')
					.map(item => item.trim())
			: [],
		otherTraits: formData.get('otherTraits')
			? formData
					.get('otherTraits')
					.split(',')
					.map(item => item.trim())
			: [],
		image: formData.get('image'),
	}

	if (updatedData.childGroup.length + 1 > updatedData.totalPeople) {
		// displayMessage(
		// 	'Antall gjester totalt kan ikke være mindre eller lik antall barn',
		// 	'error'
		// )
		alert('Antall gjester totalt kan ikke være mindre eller likt antall barn')
		throw new Error('Totalt gjester <= antall barn')
	}

	const url = `${API_URL}/Families/${id || ''}`

	fetch(url, {
		method: id ? 'PUT' : 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(updatedData),
	})
		.then(response => {
			if (!response.ok) {
				console.log(`Error ${response.status}: ${response.statusText}`)
				throw new Error(`Error ${response.status}: ${response.statusText}`)
			}
			return response.json()
		})
		.then(() => {
			// alert('Data lagret vellykket!')
			displayMessage('Data lagret vellykket!', 'success')
			renderForm()
		})
		.catch(error => {
			displayMessage(`Error: ${error.message}`, 'error')
		})
}

export function deleteData(id) {
	if (confirm('Er du sikker på at du vil slette data?')) {
		const url = `${API_URL}/Families/${id}`

		fetch(url, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then(response => {
				if (!response.ok) {
					displayMessage(
						`Error ${response.status}: ${response.statusText}`,
						'error'
					)
					// console.log(`Error ${response.status}: ${response.statusText}`)
					throw new Error(`Error ${response.status}: ${response.statusText}`)
				}
				return response.json()
			})
			.then(() => {
				// alert('Data slettet vellykket!')
				displayMessage('Data slettet vellykket!', 'success')
				setTimeout(() => {
					window.location.replace(
						'./index.html?timestamp=' + new Date().getTime()
					)
				}, 5000)
			})
	}
}
