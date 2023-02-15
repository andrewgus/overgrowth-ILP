import { atom, map, computed } from 'nanostores'
import { featuresMap } from './FeatureSettingsStore'
import type { FeatureType } from './FeatureSettingsStore'

// All sections
export interface SectionDetails {
	title: string
	id: string
	orderNum: number
	isFeatureType: FeatureType | boolean
	isVisible: boolean
	isLocked: boolean
}

interface SectionsMap {
	[sectionKey: string]: SectionDetails
}

const allSectionsMap = map<SectionsMap>()

const filteredSectionsMap = computed(
	[allSectionsMap, featuresMap],
	(sections, feature) => {
		const sectionsAsArray: [string, SectionDetails][] = Object.entries(sections)

		const filteredSections = sectionsAsArray.filter(([_, details]) => {
			const featureSelected = details.isFeatureType
			const featureValue = feature[featureSelected as FeatureType]
			// Must be either static content or  feature must be true
			return featureSelected === false || featureValue === true
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

// Used to set the current section title for the LessonNav
const currSectionTitleAtom = atom('')
const currSectionIdAtom = atom('')

const useSetCurrSection = (sectionKey: string) => {
	if (sectionKey === '') {
		currSectionTitleAtom.set('')
		currSectionIdAtom.set('')
	} else {
		const sectionTitle = allSectionsMap.get()[sectionKey].title
		currSectionTitleAtom.set(sectionTitle)
		currSectionIdAtom.set(sectionKey)
	}
}

export {
	isOnContentAtom,
	currSectionTitleAtom,
	currSectionIdAtom,
	useSetCurrSection,
	useToggleNavShown,
	allSectionsMap,
	filteredSectionsMap,
}
