import { fetchFamilies } from './functions/functions.js'
import renderForm from './functions/renderForm.js'

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

	renderForm()
}
