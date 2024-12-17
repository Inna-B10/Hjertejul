import { filterFamilies } from './functions.js'
import { families } from './main.js'

/* --------------------------- HandleFilterChange --------------------------- */
export default function handleFilterChange(filter, filters, optionsMap) {
	if (filter.type === 'checkbox') {
		// define the category
		const currentCategory = filter.dataset.category

		const currentGroup = Object.keys(optionsMap).find(group =>
			optionsMap[group].includes(filter.dataset.group)
		)

		const isPasserAlt = filter.dataset.group === 'all'
		const isNothing = filter.dataset.group === 'nothing'

		const relevantFilters = filters.filter(
			f => f.dataset.category === currentCategory
		)

		if (isNothing && filter.checked) {
			handleNothingSelection(relevantFilters, currentGroup, optionsMap)
		} else if (isPasserAlt && filter.checked) {
			handlePasserAltSelection(relevantFilters, currentGroup, optionsMap)
		} else if (filter.checked) {
			handleGroupSelection(relevantFilters, currentGroup, optionsMap)
		} else {
			handleGroupDeselection(relevantFilters, currentGroup, optionsMap)
		}
	}
	filterFamilies(families)
}

/* ========================================================================== */
/*                         HANDLERS FOR SPECIFIC CASES                        */
/* ========================================================================== */

/* ------------------------- HandleNothingSelection  */
function handleNothingSelection(filters, group, optionsMap) {
	filters.forEach(filter => {
		const isSameGroup = optionsMap[group]?.includes(filter.dataset.group)
		if (isSameGroup || filter.dataset.group === 'all') {
			filter.checked = false
			filter.disabled = true
		}
	})
}

/* ------------------------ HandlePasserAltSelection  */
function handlePasserAltSelection(filters, group, optionsMap) {
	filters.forEach(filter => {
		const isSameGroup = optionsMap[group]?.includes(filter.dataset.group)
		if (isSameGroup || filter.dataset.group === 'nothing') {
			filter.checked = false
			filter.disabled = true
		}
	})
}

/* -------------------------- HandleGroupSelection  */
function handleGroupSelection(filters, group, optionsMap) {
	const isAnyGroupSelected = filters.some(
		filter =>
			optionsMap[group]?.includes(filter.dataset.group) && filter.checked
	)

	filters.forEach(filter => {
		if (filter.dataset.group === 'nothing' || filter.dataset.group === 'all') {
			filter.checked = false
			filter.disabled = isAnyGroupSelected
		}
	})
}

/* ------------------------- HandleGroupDeselection  */
function handleGroupDeselection(filters, group, optionsMap) {
	const isGroupEmpty = !filters.some(
		filter =>
			optionsMap[group]?.includes(filter.dataset.group) && filter.checked
	)

	if (isGroupEmpty) {
		filters.forEach(filter => {
			if (
				filter.dataset.group === 'nothing' ||
				filter.dataset.group === 'all'
			) {
				filter.disabled = false
				if (filter.dataset.group === 'all') {
					filter.checked = true
				}
			}
		})
	}
}
