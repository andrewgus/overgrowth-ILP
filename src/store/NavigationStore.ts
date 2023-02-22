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

const nextSectionComputed = computed(currSectionMap, ({ orderNum }) => {
	const sectionKeys = Object.keys(allSectionsMap.get())
	const next = sectionKeys.at(orderNum! + 1)
	return next
})
const prevSectionComputed = computed(currSectionMap, ({ orderNum }) => {
	const sectionKeys = Object.keys(allSectionsMap.get())
	const prev = sectionKeys.at(orderNum! - 1)
	return prev
})

// filtered sections determined if features are turned on or off
const filteredSectionsComputed = computed(
	[allSectionsMap, featuresMap],
	(sections, feature) => {
		const sectionsAsArray: [string, SectionDetails][] = Object.entries(sections)

		const filteredSections = sectionsAsArray.filter(([_, details]) => {
			const featureValue = feature[details.isFeatureType as FeatureType]

			// NOTE: perhaps filtered here includes anything that is locked to turn to display: none, rather than it a seperate computed.
			// 	/* Need from sections:
			// 			isLocked
			// 			isFeatureType
			// 			orderNum
			// 	 */
			// const lockedFeature =
			// 	details.isLocked === true && details.isFeatureType !== false

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

//This only works if initialized within onMounted lifecycle hook within vue

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
}
export type { SectionDetails, SectionsMap }
