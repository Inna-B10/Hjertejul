import cardFamily from '../cardFamily/cardFamily.js'
import { API_URL } from '../constants.js'
import { filters, output, searchInput, selectFilter } from '../main.js'
import renderForm from './renderForm.js'

/* ------------------------------ FetchFamilies ----------------------------- */
export async function fetchFamilies(id = null) {
	const url = id === null ? `${API_URL}/Families` : `${API_URL}/Families/${id}`

	try {
		const response = await fetch(url)

		if (!response.ok) {
			//#TODO check working messages
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
		// throw new Error('Error loading data:', error.message)
	}
}

/* ----------------------------- RenderFamilies ----------------------------- */
export function renderFamilies(array) {
	if (array) {
		if (output) {
			output.innerText = ''

			if (array.length > 0) {
				array.forEach(family => {
					cardFamily(family)
				})
			} else {
				output.innerHTML = `<p>Ingen familie funnet basert på dine kriterier</p>`
			}
		}
	}
}

/* ----------------------------- FilterFamilies ----------------------------- */
export function filterFamilies(families) {
	const searchValue = searchInput.value.toLowerCase().trim()

	// ----------------------------- collect all checked checkboxes
	const activeFilters = {
		foodPref: Array.from(filters)
			.filter(
				checkbox => checkbox.checked && checkbox.dataset.category === 'foodPref'
			)
			.map(checkbox => checkbox.dataset.group),
		traits: Array.from(filters)
			.filter(
				checkbox =>
					checkbox.checked && checkbox.dataset.category === 'otherTraits'
			)
			.map(checkbox => checkbox.dataset.group),
		allergies: Array.from(filters)
			.filter(
				checkbox =>
					checkbox.checked && checkbox.dataset.category === 'allergies'
			)
			.map(checkbox => checkbox.dataset.group),
		childGroup: Array.from(filters)
			.filter(
				checkbox =>
					checkbox.checked && checkbox.dataset.category === 'childGroup'
			)
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
		const matchesFoodPref = activeFilters.foodPref.includes('all')
			? true
			: activeFilters.foodPref.includes('nothing')
			? family.foodPref.length === 0
			: activeFilters.foodPref.some(pref => family.foodPref.includes(pref))

		// --------------------------------- Traits
		const matchesTraits = activeFilters.traits.includes('all')
			? true
			: activeFilters.traits.some(trait => family.otherTraits.includes(trait))

		// -------------------------------- Allergies
		const matchesAllergies = activeFilters.allergies.every(
			allergy => !family.allergies.includes(allergy)
		)

		// ------------------------------- ChildGroup
		const matchesChildGroup = activeFilters.childGroup.includes('all')
			? true
			: activeFilters.childGroup.includes('nothing')
			? family.childGroup.length === 0
			: family.childGroup.some(group =>
					activeFilters.childGroup.includes(group)
			  )

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

/* ----------------------------- DisplayMessage ----------------------------- */
export function displayMessage(message, type) {
	const messageContainer = document.getElementById('message-container')

	messageContainer.innerText = message
	messageContainer.className = type // 'success' or 'error'
	// setTimeout(() => {
	// 	messageContainer.innerText = ''
	// 	messageContainer.className = ''
	// }, 5000) // disappear after 5 sec
}

/* -------------------------------- SaveData -------------------------------- */
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

/* ------------------------------- DeleteData ------------------------------- */
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
				alert('Data slettet vellykket!')
				// displayMessage('Data slettet vellykket!', 'success')
				// setTimeout(() => {
				// 	window.location.replace(
				// 		'./index.html?timestamp=' + new Date().getTime()
				// 	)
				// }, 5000)
			})
	}
}

/* -------------------------------- SendForm -------------------------------- */
export function sendForm(event, idForm) {
	event.preventDefault()

	const form = document.querySelector(idForm)
	const textArea = form.querySelector('textarea')
	if (textArea.value.trim() === '') {
		alert('Du må skrive noe!')
	} else {
		alert('Meldingen er sent!')
		form.reset()
	}
}
