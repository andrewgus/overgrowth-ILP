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

// filtered sections determined if features are turned on or off
const filteredNavSectionsComputed = computed(
	[allSectionsMap, featuresMap],
	(allSections, features) => {
		const allSectionsAsArray: [string, SectionDetails][] =
			Object.entries(allSections)

		const filterForUnlocked = allSectionsAsArray.filter(([_, details]) => {
			const isFeatureOn = features[details.isFeatureType as FeatureType]

			// Must be either 1) static content or feature must be true AND 2) section is unlocked
			return (
				(details.isFeatureType === false || isFeatureOn === true) &&
				details.isLocked === false
			)
		})
		// updating orderNum to match new order
		// NOTE: This may have to move to the bottom, after the next filter, AFTER the two arrays are already concat, on the concat array, rather than the filterForUnlocked array.
		filterForUnlocked.forEach(([_, details], i) => {
			details.orderNum = i
		})

		// NOTE: If user turns off a Feature, then any proceeding sections, up until and including the next available Feature, that is on, is changed to isLocked: false.
		/*  NOTE: If this works, will also need to consider what happens when a user starts the lesson, begins to unlock content, and then goes back to the top and switched features on/off. 
				1. Should reset any completed features? Yes, but with a warning pop-up box first to confirm.
				2. Should unlock any content trapped behind locked features? Yes. 
		*/
		allSectionsAsArray.forEach(([_, details], i) => {
			// if features[feature] is false, as is filtered out above.
			// Also, here, if features[feature] is false, unlock all static content until the next feature where features[feature] is true. If there are multiples of the same type, they will be filtered out, and this rule should still apply.
			const isFeatureOn = features[details.isFeatureType as FeatureType]

			// NOTE: if the feature is off, find all the static content with an orderNum higher than that feature, and switch to isLocked: false, up until we hit something that matches (!!details.isFeatureType && isFeatureOn)
			// To above, another way to think about it is: find the next feature that matches (!!details.isFeatureType && isFeatureOn) and then turn anything below that to isLocked: false.
			if (isFeatureOn === false) {
				console.log(allSectionsAsArray[i])
				console.log(details.isFeatureType)
				console.log(details.id)
				console.log(details.orderNum)
			}
		})
		

		// NOTE: Current thought process is to continue doing as above, and now also filter for the items that match what is stated on lines 69 & 70. Then, concat that array with the filterForUnlocked array and return that Object.fromEntries(concatArray)

		return Object.fromEntries(filterForUnlocked)
	}
)

const filteredLockedSectionsComputed = computed(
	allSectionsMap,
	(allSections) => {
		const allSectionsAsArray: [string, SectionDetails][] =
			Object.entries(allSections)

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
