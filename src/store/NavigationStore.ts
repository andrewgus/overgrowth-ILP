import { atom, map, computed } from 'nanostores'
import { featuresMap } from './FeatureSettingsStore'
import type { FeatureType } from './FeatureSettingsStore'

// Used to determine whether user is on content vs header
const isOnContentAtom = atom(false)

const useToggleNavShown = () => {
	isOnContentAtom.set(!isOnContentAtom.get())
}

// All sections
interface SectionDetails {
	title: string
	id: string
	orderNum: number | null
	isFeatureType: FeatureType | boolean
	isLocked: boolean
}

interface SectionsMap {
	[sectionKey: string]: SectionDetails
}

const allSectionsMap = map<SectionsMap>()

// Determining current section, and first & last sections
const currSectionMap = map<SectionDetails>()

const useSetCurrSection = (sectionKey: string) => {
	if (sectionKey !== '') {
		currSectionMap.set(allSectionsMap.get()[sectionKey])
	} else {
		currSectionMap.setKey('id', '')
		currSectionMap.setKey('title', '')
		currSectionMap.setKey('orderNum', null)
		currSectionMap.setKey('isFeatureType', false)
		currSectionMap.setKey('isLocked', false)
	}
}

// filtered sections items that should be visible and navigable
const filteredNavSectionsComputed = computed(
	[allSectionsMap, featuresMap],
	(allSections, features) => {
		const allSectionsAsArray: [string, SectionDetails][] =
			Object.entries(allSections)

		const filterForUnlocked = allSectionsAsArray.filter(([_, details]) => {
			const isFeatureOn = features[details.isFeatureType as FeatureType]

			//Finding the next active feature...
			const findNextActiveFeatureIndex = allSectionsAsArray.findIndex(
				([_, details]) => {
					return (
						!!details.isFeatureType &&
						features[details.isFeatureType as FeatureType]
					)
				}
			)

			if (isFeatureOn === false) {
				// If the feature is off, unlock any content that comes before it.
				allSectionsAsArray.forEach(([_, details]) => {
					if (details.orderNum! <= findNextActiveFeatureIndex) {
						details.isLocked = false
					}
				})
			} else if (isFeatureOn === true) {
				// If the feature is on, lock any content that comes after it.
				allSectionsAsArray.forEach(([_, details]) => {
					if (details.orderNum! > findNextActiveFeatureIndex) {
						details.isLocked = true
					}
				})
			}

			// NOTE: MAY NEED TO SOMEHOW UPDATE THE ORDER NUM HERE. MAYBE NOT?
			if (
				(details.isFeatureType === false || isFeatureOn === true) &&
				details.isLocked === false
			) {
				console.log(details)
			}

			// Must be either 1) static content or feature must be true (on) AND 2) section is unlocked
			return (
				(details.isFeatureType === false || isFeatureOn === true) &&
				details.isLocked === false
			)
		})

		return Object.fromEntries(filterForUnlocked)
	}
)

// filtered section items that should be invisible
const filteredLockedSectionsComputed = computed(
	[allSectionsMap, featuresMap],
	(allSections, features) => {
		const allSectionsAsArray: [string, SectionDetails][] =
			Object.entries(allSections)

		// TODO: Need to filter out any features or content that is beyond (higher orderNum than) any uncomplete, unlocked, active feature. If feature is turned off, then need to search for next active feature, and unlock (details.isLocked = false) that content that comes before it or equal to it (lower or equal orderNum than). That content would not be filtered out. Similar to filter above for Nav, but the inverse, essentially.

		const filterForLocked = allSectionsAsArray.filter(([_, details]) => {
			return details.isLocked === true
		})
		return Object.fromEntries(filterForLocked)
	}
)

const nextSectionComputed = computed(currSectionMap, ({ orderNum }) => {
	const allFilteredSectionKeys = Object.keys(filteredNavSectionsComputed.get())
	let nextSection: string
	if (orderNum !== null) {
		nextSection = allFilteredSectionKeys.at(orderNum + 1)!
	} else {
		nextSection = allFilteredSectionKeys.at(0)!
	}
	return nextSection
})
const prevSectionComputed = computed(currSectionMap, ({ orderNum }) => {
	const allFilteredSectionKeys = Object.keys(filteredNavSectionsComputed.get())
	let prevSection: string
	if (orderNum !== null) {
		prevSection = allFilteredSectionKeys.at(orderNum - 1)!
	} else {
		prevSection = allFilteredSectionKeys.at(0)!
	}
	return prevSection
})

// first/lastSectionsComputed only work if initialized within onMounted lifecycle hook within vue
const firstSectionComputed = computed(
	filteredNavSectionsComputed,
	(sections) => {
		const id = Object.keys(sections).at(0)!
		const orderNum = sections[id].orderNum
		return { id, orderNum }
	}
)
const lastSectionComputed = computed(
	filteredNavSectionsComputed,
	(sections) => {
		const id = Object.keys(sections).at(-1)!
		const orderNum = sections[id].orderNum
		return { id, orderNum }
	}
)

const isOnFirstSectionComputed = computed(currSectionMap, ({ id }) => {
	return id === firstSectionComputed.get().id
})
const isOnLastSectionComputed = computed(currSectionMap, ({ id }) => {
	return id === lastSectionComputed.get().id
})
export {
	isOnContentAtom,
	useToggleNavShown,
	allSectionsMap,
	currSectionMap,
	useSetCurrSection,
	nextSectionComputed,
	prevSectionComputed,
	filteredNavSectionsComputed,
	filteredLockedSectionsComputed,
	firstSectionComputed,
	lastSectionComputed,
	isOnFirstSectionComputed,
	isOnLastSectionComputed,
}
export type { SectionDetails, SectionsMap }
