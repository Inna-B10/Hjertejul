import {
	allergiesOptions,
	childGroupOptions,
	foodPrefOptions,
	otherTraitsOptions,
} from './constants.js'
import { createNode } from './createElements.js'
import { fetchFamilies } from './functions.js'

const outputForm = document.getElementById('output-form')
const params = new URLSearchParams(window.location.search)
const familyId = params.get('id')

let family

async function initPage(id = familyId) {
	console.log('Функция fetchFamilies вызвана с ID:', id)
	family = await fetchFamilies(id)
	if (family) {
		renderForm(family)
	}
}
initPage()

export function addNewFamily() {
	renderForm()
}

export function renderForm(data) {
	console.log(data)
	outputForm.innerText = ''

	const form = createNode('form', {
		id: 'add-edit-form',
	})

	//# ------------------------ surname
	const surnameLabel = createNode('label', {})
	// surnameLabel.textContent = 'Surname:'
	surnameLabel.textContent = 'Surname: '
	const surnameInput = createNode('input', {
		type: 'text',
		name: 'surname',
		value: data.surname,
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
			selected: i === Number(data.totalPeople),
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
		value: data.title,
	})
	titleLabel.appendChild(title)
	form.appendChild(titleLabel)

	//# ------------------------ description
	const descLabel = createNode('label', {})
	descLabel.innerText = 'Om familien: '
	const desc = createNode('input', {
		type: 'text',
		name: 'description',
		value: data.description,
	})
	descLabel.appendChild(desc)
	form.appendChild(descLabel)

	//# ------------------------ childGroup
	const childGroupLabel = createNode('div', {})
	childGroupLabel.innerText = 'Barn i aldersgruppe: '

	childGroupOptions.forEach(option => {
		// Создаем контейнер для чекбокса
		const label = createNode('label', {})

		// Создаем чекбокс
		const checkbox = createNode('input', {
			type: 'checkbox',
			name: 'childGroup',
			value: option,
		})

		// Проверяем, есть ли значение в data.childGroup
		if (data.childGroup.includes(option)) {
			checkbox.checked = true
		}

		// Добавляем текст и чекбокс в label
		label.appendChild(checkbox)
		label.appendChild(document.createTextNode(option))

		// Добавляем label в форму
		childGroupLabel.appendChild(label)
	})
	form.appendChild(childGroupLabel)
	//# ------------------------ allergies
	const allergiesLabel = createNode('div', {})
	allergiesLabel.innerText = 'Allergier: '

	allergiesOptions.forEach(option => {
		// Создаем контейнер для чекбокса
		const label = createNode('label', {})

		// Создаем чекбокс
		const checkbox = createNode('input', {
			type: 'checkbox',
			name: 'allergies',
			value: option,
		})

		if (data.allergies.includes(option.toLowerCase())) {
			checkbox.checked = true
		}

		// Добавляем текст и чекбокс в label
		label.appendChild(checkbox)
		label.appendChild(document.createTextNode(option))

		// Добавляем label в форму
		allergiesLabel.appendChild(label)
	})
	form.appendChild(allergiesLabel)
	//# ------------------------ foodPref
	const foodPrefLabel = createNode('div', {})
	foodPrefLabel.innerText = 'Matpreferanser: '

	foodPrefOptions.forEach(option => {
		// Создаем контейнер для чекбокса
		const label = createNode('label', {})

		// Создаем чекбокс
		const checkbox = createNode('input', {
			type: 'checkbox',
			name: 'foodPref',
			value: option,
		})

		if (data.foodPref.includes(option.toLowerCase())) {
			checkbox.checked = true
		}

		// Добавляем текст и чекбокс в label
		label.appendChild(checkbox)
		label.appendChild(document.createTextNode(option))

		// Добавляем label в форму
		foodPrefLabel.appendChild(label)
	})
	form.appendChild(foodPrefLabel)
	//# ------------------------ otherTraits
	const otherTraitsLabel = createNode('div', {})
	otherTraitsLabel.innerText = 'Vaner: '

	otherTraitsOptions.forEach(option => {
		// Создаем контейнер для чекбокса
		const label = createNode('label', {})

		// Создаем чекбокс
		const checkbox = createNode('input', {
			type: 'checkbox',
			name: 'otherTraits',
			value: option,
		})

		if (data.otherTraits.includes(option.toLowerCase())) {
			checkbox.checked = true
		}

		// Добавляем текст и чекбокс в label
		label.appendChild(checkbox)
		label.appendChild(document.createTextNode(option))

		// Добавляем label в форму
		otherTraitsLabel.appendChild(label)
	})
	form.appendChild(otherTraitsLabel)

	//# ------------------------ image
	const imageLabel = createNode('label', {})
	imageLabel.innerText = 'Bilde: '
	const image = createNode('input', {
		type: 'text',
		name: 'image',
		value: data.image,
	})
	imageLabel.appendChild(image)
	form.appendChild(imageLabel)

	//# ------------------------ saveButton
	const saveButton = createNode('button', {
		id: 'save-button',
	})
	saveButton.innerText = 'Lagre'
	saveButton.addEventListener('click', () => {
		saveData(data.id)
	})

	form.appendChild(saveButton)

	// Добавляем форму в контейнер
	outputForm.appendChild(form)
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

	console.log('Updated Data:', updatedData)
	//
	// 	const url = `${API_URL}/Families/${id || ''}`
	// 	const newUrl = `http://127.0.0.1:5500/manageFamily.html?id=${id}`
	// 	window.history.pushState({ id }, '', newUrl)
	// 	initPage(id)
}
