import { atom, map, computed } from 'nanostores'
import { useStore } from '@nanostores/vue'

// Feature setup for any given lesson
type FeatureType = 'reflection' | 'practice' | 'choice'

interface FeatureMap {
	reflection: boolean | undefined
	practice: boolean | undefined
	choice: boolean | undefined
}

const featuresMap = map<FeatureMap>({
	reflection: undefined,
	practice: undefined,
	choice: undefined,
})

// if feature layout is used in lesson, activate it
const useDoesFeatureExist = (feature: FeatureType) => {
	featuresMap.setKey(feature, true)
}
// For v-ifs in vue components, if a given feature exists
const useFeatureExists = (feature: FeatureType) => {
	if (useStore(featuresMap).value[feature] !== undefined) {
		return true
	} else {
		return false
	}
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

// Used to determine whether user is on content vs header
const isOnContentAtom = atom(false)

const useToggleNavShown = () => {
	isOnContentAtom.set(!isOnContentAtom.get())
}

// To toggle feature on/off
const useToggleFeature = (feature: FeatureType) => {
	featuresMap.setKey(feature, !featuresMap.get()[feature])
	// updating allSections isLocked
	const isFeatureOn = featuresMap.get()[feature]
	const allSectionsAsArray = Object.entries(allSectionsMap.get())
	// find the next available active feature
	const findNextActiveFeature = allSectionsAsArray.find(
		([_, sectionDetails]) => {
			return (
				!!sectionDetails.isFeatureType &&
				featuresMap.get()[sectionDetails.isFeatureType as FeatureType]
			)
		}
	)

	const setSectionLocks = (
		sectionKey: string,
		sectionDetails: SectionDetails,
		onOff: boolean
	) => {
		allSectionsMap.setKey(sectionKey, {
			...sectionDetails,
			isLocked: onOff,
		})
	}

	if (findNextActiveFeature === undefined) {
		// if all features are turned off...
		allSectionsAsArray.forEach(([sectionKey, sectionDetails]) => {
			if (sectionDetails.isFeatureType === false) {
				setSectionLocks(sectionKey, sectionDetails, false)
			}
		})
	} else {
		const [_, nextActiveSectionDetails] = findNextActiveFeature
		if (isFeatureOn === false) {
			// if given feature is deactivated, unlock next available feature...
			allSectionsAsArray.forEach(([sectionKey, sectionDetails]) => {
				if (sectionDetails.orderNum! <= nextActiveSectionDetails.orderNum!) {
					setSectionLocks(sectionKey, sectionDetails, false)
				}
			})
		} else if (isFeatureOn === true) {
			// if given feature is reactivated, lock all future sections...
			allSectionsAsArray.forEach(([sectionKey, sectionDetails]) => {
				if (sectionDetails.orderNum! > nextActiveSectionDetails.orderNum!) {
					setSectionLocks(sectionKey, sectionDetails, true)
				}
			})
		}
	}
}

// Determining current section
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

// filtering for sections that should be visible and navigable
const filteredNavSectionsComputed = computed(
	[allSectionsMap, featuresMap],
	(allSections, features) => {
		const allSectionsAsArray: [string, SectionDetails][] =
			Object.entries(allSections)

		const filterForUnlocked = allSectionsAsArray.filter(
			([_, sectionDetails]) => {
				const isFeatureOn =
					features[sectionDetails.isFeatureType as FeatureType]

				// Must be either 1) static content or feature must be true (on) AND 2) section is unlocked
				return (
					(sectionDetails.isFeatureType === false || isFeatureOn === true) &&
					sectionDetails.isLocked === false
				)
			}
		)
		filterForUnlocked.forEach(
			([_, sectionDetails], i) => (sectionDetails.orderNum = i)
		)
		return Object.fromEntries(filterForUnlocked)
	}
)

// filtering for sections that should be locked & invisible
const filteredLockedSectionsComputed = computed(
	allSectionsMap,
	(allSections) => {
		const allSectionsAsArray: [string, SectionDetails][] =
			Object.entries(allSections)

		const filterForLocked = allSectionsAsArray.filter(([_, sectionDetails]) => {
			return sectionDetails.isLocked === true
		})
		return Object.fromEntries(filterForLocked)
	}
)
// Finding the next & previous section based on the current section
const nextSectionComputed = computed(currSectionMap, ({ orderNum }) => {
	const allFilteredNavSectionKeys = Object.keys(
		filteredNavSectionsComputed.get()
	)
	let nextSection: string

	if (orderNum !== null) {
		nextSection = allFilteredNavSectionKeys.at(orderNum + 1)!
	} else {
		nextSection = allFilteredNavSectionKeys.at(0)!
	}
	return nextSection
})

const prevSectionComputed = computed(currSectionMap, ({ orderNum }) => {
	const allFilteredNavSectionKeys = Object.keys(
		filteredNavSectionsComputed.get()
	)
	let prevSection: string
	if (orderNum !== null) {
		prevSection = allFilteredNavSectionKeys.at(orderNum - 1)!
	} else {
		prevSection = allFilteredNavSectionKeys.at(0)!
	}
	return prevSection
})

const isOnFirstSectionComputed = computed(currSectionMap, ({ id }) => {
	return id === Object.keys(filteredNavSectionsComputed.get()).at(0)
})
const isOnLastSectionComputed = computed(currSectionMap, ({ id }) => {
	return id === Object.keys(filteredNavSectionsComputed.get()).at(-1)
})

export {
	featuresMap,
	useDoesFeatureExist,
	useFeatureExists,
	allSectionsMap,
	isOnContentAtom,
	useToggleNavShown,
	useToggleFeature,
	currSectionMap,
	useSetCurrSection,
	filteredNavSectionsComputed,
	filteredLockedSectionsComputed,
	nextSectionComputed,
	prevSectionComputed,
	isOnFirstSectionComputed,
	isOnLastSectionComputed,
}
export type { FeatureType, SectionDetails, SectionsMap }
