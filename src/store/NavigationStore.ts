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
const filteredSectionsComputed = computed(
	[allSectionsMap, featuresMap],
	(sections, feature) => {
		const sectionsAsArray: [string, SectionDetails][] = Object.entries(sections)

		const filteredSections = sectionsAsArray.filter(([_, details]) => {
			const featureValue = feature[details.isFeatureType as FeatureType]

			// TODO:  filter out anything that matches isLocked: true. These will turn to display: none.
			// 	/* Need from sections:
			// 			isLocked
			// 			isFeatureType
			// 			orderNum
			// 	 */
			// const lockedFeature =
			// 	details.isLocked === true && details.isFeatureType !== false
			/*  NOTE: 
				If this works, will also need to consider what happens when a user starts the lesson, begins to unlock content, and then goes back to the top and switched features on/off. 
					1. Should reset any completed features? Yes, but with a warning pop-up box first to confirm.
					2. Should unlock any content trapped behind locked features? Yes. 
			*/

			// Must be either static content or feature must be true
			return details.isFeatureType === false || featureValue === true
		})
		// updating orderNum to match new order
		filteredSections.forEach(([_, details], i) => {
			details.orderNum = i
		})

		return Object.fromEntries(filteredSections)
	}
)

const nextSectionComputed = computed(currSectionMap, ({ orderNum }) => {
	const allFilteredSectionKeys = Object.keys(filteredSectionsComputed.get())
	let nextSection: string
	if (orderNum !== null) {
		nextSection = allFilteredSectionKeys.at(orderNum + 1)!
	} else {
		nextSection = allFilteredSectionKeys.at(0)!
	}
	return nextSection
})
const prevSectionComputed = computed(currSectionMap, ({ orderNum }) => {
	const allFilteredSectionKeys = Object.keys(filteredSectionsComputed.get())
	let prevSection: string
	if (orderNum !== null) {
		prevSection = allFilteredSectionKeys.at(orderNum - 1)!
	} else {
		prevSection = allFilteredSectionKeys.at(0)!
	}
	return prevSection
})

//These only work if initialized within onMounted lifecycle hook within vue
const firstSectionComputed = computed(filteredSectionsComputed, (sections) => {
	const id = Object.keys(sections).at(0)!
	const orderNum = sections[id].orderNum
	return { id, orderNum }
})
const lastSectionComputed = computed(filteredSectionsComputed, (sections) => {
	const id = Object.keys(sections).at(-1)!
	const orderNum = sections[id].orderNum
	return { id, orderNum }
})

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
	filteredSectionsComputed,
	firstSectionComputed,
	lastSectionComputed,
	isOnFirstSectionComputed,
	isOnLastSectionComputed,
}
export type { SectionDetails, SectionsMap }
