import {
	allergiesOptions,
	API_URL,
	childGroupOptions,
	foodPrefOptions,
	otherTraitsOptions,
} from './constants.js'
import { createNode } from './createElements.js'
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
			}
		}
		initPage()
	} else {
		renderForm()
	}

	function renderForm(data) {
		console.log(data)
		outputForm.innerText = ''

		const form = createNode('form', {
			id: 'add-edit-form',
		})

		//# ------------------------ surname
		const surnameLabel = createNode('label', {})
		surnameLabel.innerText = 'Surname: '
		const surnameInput = createNode('input', {
			type: 'text',
			name: 'surname',
			value: data?.surname ? data.surname : '',
			required: true,
		})
		surnameLabel.appendChild(surnameInput)
		form.appendChild(surnameLabel)

		//# ------------------------ totalPeople
		const totalPeopleLabel = createNode('label', {})
		totalPeopleLabel.innerText = 'Antall gjester: '
		const select = createNode('select', {
			name: 'totalPeople',
		})
		//TODO add attribute selected to data.totalPeople
		for (let i = 1; i <= 6; i++) {
			const option = createNode('option', {
				value: i,
				selected: i === Number(data?.totalPeople),
			})
			option.innerText = i
			select.appendChild(option)
		}
		totalPeopleLabel.appendChild(select)
		form.appendChild(totalPeopleLabel)

		//# ------------------------ title
		const titleLabel = createNode('label', {})
		titleLabel.innerText = 'Tittel: '
		const title = createNode('input', {
			type: 'text',
			name: 'title',
			value: data?.title ? data.title : '',
			required: true,
		})
		titleLabel.appendChild(title)
		form.appendChild(titleLabel)

		//# ------------------------ description
		const descLabel = createNode('label', {})
		descLabel.innerText = 'Om familien: '
		const desc = createNode('textarea', {
			rows: '4',
			cols: '50',
			name: 'description',
			required: true,
		})
		desc.textContent = data?.description ? data.description : ''

		descLabel.appendChild(desc)
		form.appendChild(descLabel)

		//# ------------------------ childGroup
		const childGroupLabel = createNode('div', {})
		childGroupLabel.innerText = 'Barn i aldersgruppe: '

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
			label.appendChild(document.createTextNode(option))

			childGroupLabel.appendChild(label)
		})
		form.appendChild(childGroupLabel)

		//# ------------------------ allergies
		const allergiesLabel = createNode('div', {})
		allergiesLabel.innerText = 'Allergier: '

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
			label.appendChild(document.createTextNode(option))

			allergiesLabel.appendChild(label)
		})
		form.appendChild(allergiesLabel)

		//# ------------------------ foodPref
		const foodPrefLabel = createNode('div', {})
		foodPrefLabel.innerText = 'Matpreferanser: '

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
			label.appendChild(document.createTextNode(option))

			foodPrefLabel.appendChild(label)
		})
		form.appendChild(foodPrefLabel)

		//# ------------------------ otherTraits
		const otherTraitsLabel = createNode('div', {})
		otherTraitsLabel.innerText = 'Vaner: '

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
			label.appendChild(document.createTextNode(option))

			otherTraitsLabel.appendChild(label)
		})
		form.appendChild(otherTraitsLabel)

		//# ------------------------ image
		const imageLabel = createNode('label', {})
		imageLabel.innerText = 'Bilde: '
		const image = createNode('input', {
			type: 'text',
			name: 'image',
			value: data?.image ? data.image : '',
			required: true,
		})
		imageLabel.appendChild(image)
		form.appendChild(imageLabel)

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
					throw new Error(`Error ${response.status}: ${response.statusText}`)
				}
				return response.json()
			})
			.then(() => {
				displayMessage('Data lagret vellykket!', 'success')
				// alert('Data lagret vellykket!')
			})
			.catch(error => {
				displayMessage(`Error: ${error.message}`, 'error')
				// alert(`Error: ${error.message}`, 'error')
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
				// .then(response => {
				// 	if (!response.ok) {
				// 		throw new Error(`Error ${response.status}: ${response.statusText}`)
				// 	}
				// 	return response.json()
				// })
				.then(() => {
					alert('Data slettet vellykket!')
					// setTimeout(() => {
					window.location.replace(
						'./index.html?timestamp=' + new Date().getTime()
					)
					// }, 100)
				})
		}
	}

	function displayMessage(message, type) {
		const messageContainer = document.getElementById('message-container')
		console.log(messageContainer)
		messageContainer.innerText = message
		messageContainer.className = type // 'success' or 'error'
		setTimeout(() => {
			messageContainer.innerText = ''
			messageContainer.className = ''
		}, 5000) // disappear after 5 sec
	}
}
