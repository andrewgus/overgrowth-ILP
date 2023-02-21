import { atom, map, computed } from 'nanostores'
import { featuresMap } from './FeatureSettingsStore'
import type { FeatureType } from './FeatureSettingsStore'

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
// Used to determine whether user is on content vs header
const isOnContentAtom = atom(false)

const useToggleNavShown = () => {
	isOnContentAtom.set(!isOnContentAtom.get())
}

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

// BUG: Issue here where it attempts to set first/last values before filteredSectionsComputed is fully registered
const firstSectionComputed = computed(filteredSectionsComputed, () => {
	const id = Object.keys(filteredSectionsComputed.get()).at(0)!
	const orderNum = filteredSectionsComputed.get()[id].orderNum
	return { id, orderNum }
})
const lastSectionComputed = computed(filteredSectionsComputed, () => {
	const id = Object.keys(filteredSectionsComputed.get()).at(-1)!
	const orderNum = filteredSectionsComputed.get()[id].orderNum
	return { id, orderNum }
})

// TODO: refactor next and prev to live here in the NavStore. Currently being used in BaseIndicator and NextPrevSectionButtons
const nextSectionComputed = computed(allSectionsMap, () => {
	// console.log(allSectionsMap.get())
})
const prevSectionComputed = computed(allSectionsMap, () => {})

export {
	isOnContentAtom,
	currSectionMap,
	useSetCurrSection,
	useToggleNavShown,
	allSectionsMap,
	filteredSectionsComputed,
	firstSectionComputed,
	lastSectionComputed,
	nextSectionComputed,
	prevSectionComputed,
}
export type { SectionDetails, SectionsMap }
