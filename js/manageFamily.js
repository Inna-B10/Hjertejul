import {
	allergiesOptions,
	API_URL,
	childGroupOptions,
	foodPrefOptions,
	otherTraitsOptions,
} from './constants.js'
import { createHeading, createNode } from './createElements.js'
import { fetchFamilies } from './functions.js'

export const outputForm = document.getElementById('output-form')
if (outputForm) {
	const params = new URLSearchParams(window.location.search)
	const familyId = params.get('id')

	let family
	if (familyId > 0) {
		async function initPage(id = familyId) {
			family = await fetchFamilies(id)
			if (family) {
				renderForm(family)
			} else {
				outputForm.innerText = 'Error fetching data!'
				throw new Error('Error: no families fetched!')
			}
		}
		initPage()
	} else {
		renderForm()
	}

	function renderForm(data) {
		outputForm.innerText = ''

		const form = createNode('form', {
			id: 'add-edit-form',
		})

		//# ------------------------ surname
		const surnameHeading = createHeading('h2', '')
		const surnameLabel = createHeading('label', 'Familienavn: ', {
			for: 'surname',
		})
		const surnameInput = createNode('input', {
			type: 'text',
			name: 'surname',
			value: data?.surname ? data.surname : '',
			required: true,
		})
		surnameHeading.appendChild(surnameLabel)
		form.append(surnameHeading, surnameInput)

		//# ------------------------ totalPeople
		const totalPeopleHeading = createHeading('h2', '')
		const totalPeopleLabel = createHeading('label', 'Antall gjester: ', {
			for: 'totalPeople',
		})
		const select = createNode('select', {
			name: 'totalPeople',
		})

		for (let i = 1; i <= 6; i++) {
			const option = createNode('option', {
				value: i,
			})
			option.innerText = i
			select.appendChild(option)
		}
		select.value = data?.totalPeople || 6
		totalPeopleLabel.appendChild(select)
		totalPeopleHeading.appendChild(totalPeopleLabel)
		form.appendChild(totalPeopleHeading)

		//# ------------------------ title
		const titleHeading = createHeading('h2', '')
		const titleLabel = createHeading('label', 'Tittel: ', {
			for: 'title',
		})
		const title = createNode('input', {
			type: 'text',
			name: 'title',
			value: data?.title ? data.title : '',
			required: true,
		})
		titleHeading.appendChild(titleLabel)
		form.append(titleHeading, title)

		//# ------------------------ description
		const descHeading = createHeading('h2', '')
		const descLabel = createHeading('label', 'Beskrivelse: ', {
			for: 'description',
		})
		const desc = createNode('textarea', {
			rows: '10',
			cols: '50',
			name: 'description',
			required: true,
		})
		desc.textContent = data?.description ? data.description : ''
		descHeading.appendChild(descLabel)
		form.append(descHeading, desc)

		//# ------------------------ childGroup
		const childGroupLabel = createHeading('h2', 'Barn i aldersgruppe: ')

		const divGroups = createNode('div', {
			class: 'checkboxes-row',
		})
		childGroupOptions.forEach(option => {
			const label = createNode('label', {})

			const checkbox = createNode('input', {
				type: 'checkbox',
				name: 'childGroup',
				value: option,
			})

			if (data?.childGroup.includes(option)) {
				checkbox.checked = true
			}

			label.appendChild(checkbox)
			label.appendChild(document.createTextNode(`-${option}`))

			divGroups.appendChild(label)
		})
		form.append(childGroupLabel, divGroups)

		//# ------------------------ allergies
		const allergiesLabel = createHeading('h2', 'Allergier: ', {})

		const divAllergies = createNode('div', {
			class: 'checkboxes-row',
		})
		allergiesOptions.forEach(option => {
			const label = createNode('label', {})

			const checkbox = createNode('input', {
				type: 'checkbox',
				name: 'allergies',
				value: option,
			})

			if (data?.allergies.includes(option.toLowerCase())) {
				checkbox.checked = true
			}

			label.appendChild(checkbox)
			label.appendChild(document.createTextNode(`-${option}`))

			divAllergies.appendChild(label)
		})
		form.append(allergiesLabel, divAllergies)

		//# ------------------------ foodPref
		const foodPrefLabel = createHeading('h2', 'Matpreferanser: ', {})

		const divFood = createNode('div', {
			class: 'checkboxes-row',
		})

		foodPrefOptions.forEach(option => {
			const label = createNode('label', {})

			const checkbox = createNode('input', {
				type: 'checkbox',
				name: 'foodPref',
				value: option,
			})

			if (data?.foodPref.includes(option.toLowerCase())) {
				checkbox.checked = true
			}

			label.appendChild(checkbox)
			label.appendChild(document.createTextNode(`-${option}`))

			divFood.appendChild(label)
		})
		form.append(foodPrefLabel, divFood)

		//# ------------------------ otherTraits
		const otherTraitsLabel = createHeading('h2', 'Vaner: ', {})

		const divTraits = createNode('div', {
			class: 'checkboxes-row',
		})

		otherTraitsOptions.forEach(option => {
			const label = createNode('label', {})

			const checkbox = createNode('input', {
				type: 'checkbox',
				name: 'otherTraits',
				value: option,
			})

			if (data?.otherTraits.includes(option.toLowerCase())) {
				checkbox.checked = true
			}

			label.appendChild(checkbox)
			label.appendChild(document.createTextNode(`-${option}`))

			divTraits.appendChild(label)
		})
		form.append(otherTraitsLabel, divTraits)

		//# ------------------------ image
		const imageHeading = createHeading('h2', '')

		const imageLabel = createHeading('label', 'Bilde: ', {
			for: 'image',
		})

		const image = createNode('input', {
			type: 'text',
			name: 'image',
			value: data?.image ? data.image : '',
			required: true,
		})
		imageHeading.appendChild(imageLabel)
		form.append(imageHeading, image)

		//# ------------------------ saveButton
		const saveButton = createNode('button', {
			id: 'save-button',
			type: 'submit',
			'data-action': 'save',
		})
		saveButton.innerText = 'Lagre'
		form.appendChild(saveButton)

		if (data?.id) {
			//# ------------------------ deleteButton
			const deleteButton = createNode('button', {
				id: 'delete-button',
				type: 'submit',
				'data-action': 'delete',
			})
			deleteButton.innerText = 'Slette'
			form.appendChild(deleteButton)
		}

		//# ------------------------ add form to the container
		outputForm.appendChild(form)

		form.addEventListener('submit', function (event) {
			event.preventDefault()
			const action = event.submitter?.dataset?.action

			if (action === 'save') {
				saveData(data?.id)
			} else if (action === 'delete') {
				deleteData(data?.id)
			}
		})
	}

	function saveData(id = null) {
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
				alert('Data lagret vellykket!')
				displayMessage('Data lagret vellykket!', 'success')
				renderForm()
			})
			.catch(error => {
				displayMessage(`Error: ${error.message}`, 'error')
			})
	}

	function deleteData(id) {
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
						console.log(`Error ${response.status}: ${response.statusText}`)
						throw new Error(`Error ${response.status}: ${response.statusText}`)
					}
					return response.json()
				})
				.then(() => {
					alert('Data slettet vellykket!')
					window.location.replace(
						'./index.html?timestamp=' + new Date().getTime()
					)
				})
		}
	}

	function displayMessage(message, type) {
		const messageContainer = document.getElementById('message-container')

		messageContainer.innerText = message
		messageContainer.className = type // 'success' or 'error'
		setTimeout(() => {
			messageContainer.innerText = ''
			messageContainer.className = ''
		}, 5000) // disappear after 5 sec
	}
}
