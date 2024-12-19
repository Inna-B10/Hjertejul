import { allergies, childGroup, foodPref, otherTraits } from '../constants.js'
import { createHeading, createNode } from './createElements.js'
import { deleteData, saveData } from './functions.js'

const outputForm = document.getElementById('output-form')
export default function renderForm(data) {
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
	select.value = data?.totalPeople ?? 6
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
	childGroup.forEach((option, index) => {
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

		// Add comma only if it's not the last element
		const labelText = index === childGroup.length - 1 ? option : `${option},`
		label.appendChild(document.createTextNode(labelText))

		divGroups.appendChild(label)
	})
	form.append(childGroupLabel, divGroups)

	//# ------------------------ allergies
	const allergiesLabel = createHeading('h2', 'Allergier: ', {})

	const divAllergies = createNode('div', {
		class: 'checkboxes-row',
	})
	allergies.forEach((option, index) => {
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
		const labelText = index === allergies.length - 1 ? option : `${option},`
		label.appendChild(document.createTextNode(labelText))

		divAllergies.appendChild(label)
	})
	form.append(allergiesLabel, divAllergies)

	//# ------------------------ foodPref
	const foodPrefLabel = createHeading('h2', 'Matpreferanser: ', {})

	const divFood = createNode('div', {
		class: 'checkboxes-row',
	})

	foodPref.forEach((option, index) => {
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
		const labelText = index === foodPref.length - 1 ? option : `${option},`
		label.appendChild(document.createTextNode(labelText))

		divFood.appendChild(label)
	})
	form.append(foodPrefLabel, divFood)

	//# ------------------------ otherTraits
	const otherTraitsLabel = createHeading('h2', 'Vaner: ', {})

	const divTraits = createNode('div', {
		class: 'checkboxes-row',
	})

	otherTraits.forEach((option, index) => {
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
		const labelText = index === otherTraits.length - 1 ? option : `${option},`
		label.appendChild(document.createTextNode(labelText))

		divTraits.appendChild(label)
	})
	form.append(otherTraitsLabel, divTraits)

	//# ------------------------ image
	const imageHeading = createHeading('h2', '')

	const imageLabel = createHeading('label', 'Bilde-URL: ', {
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

	//# ------------------------ Buttons
	const manageButtons = createNode('div', {
		class: 'manageButtons',
	})

	//# ------------------------ saveButton
	const saveButton = createNode('button', {
		id: 'save-button',
		type: 'submit',
		'data-action': 'save',
	})
	saveButton.innerText = 'Lagre'
	manageButtons.appendChild(saveButton)

	//# ------------------------ deleteButton
	if (data?.id) {
		const deleteButton = createNode('button', {
			id: 'delete-button',
			type: 'submit',
			'data-action': 'delete',
		})
		deleteButton.innerText = 'Slette'
		manageButtons.appendChild(deleteButton)
	}
	form.appendChild(manageButtons)

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
