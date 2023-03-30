import { atom, map, computed, type MapStore } from 'nanostores'
import { useStore } from '@nanostores/vue'
import useFindNextActiveFeature from '../composables/useFindNextActiveFeature'
import useSetSectionLocks from '../composables/useSetSectionLocks'

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
	featureType: FeatureType | null
	isLocked: boolean
	isFeatureComplete: boolean | null
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

// Determining current section & nextActiveFeature
const currSectionMap = map<SectionDetails>()
const nextActiveFeatureMap = map<SectionDetails>()

const setSectionMap = (map: MapStore<SectionDetails>, sectionKey: string) => {
	if (sectionKey !== '') {
		map.set(allSectionsMap.get()[sectionKey])
	} else {
		map.setKey('id', '')
		map.setKey('title', '')
		map.setKey('orderNum', null)
		map.setKey('featureType', null)
		map.setKey('isLocked', false)
	}
}
const useSetCurrSection = (sectionKey: string) => {
	setSectionMap(currSectionMap, sectionKey)
}
const useSetNextActiveFeature = (sectionKey: string) => {
	setSectionMap(nextActiveFeatureMap, sectionKey)
}

// To toggle feature on/off
const useToggleFeature = (feature: FeatureType) => {
	featuresMap.setKey(feature, !featuresMap.get()[feature])
	// updating allSections isLocked
	const isFeatureOn = featuresMap.get()[feature]
	const allSectionsAsArray = Object.entries(allSectionsMap.get())

	// find the next available active feature
	const findNextActiveFeature = useFindNextActiveFeature(
		allSectionsAsArray,
		featuresMap.get()
	)

	if (findNextActiveFeature) {
		useSetNextActiveFeature(findNextActiveFeature[0])
	} else {
		useSetNextActiveFeature('')
	}

	if (nextActiveFeatureMap.get().id === '') {
		// all features are turned off...
		allSectionsAsArray.forEach(([sectionKey, sectionDetails]) => {
			// unlock all static content
			if (sectionDetails.featureType === null) {
				useSetSectionLocks(allSectionsMap, sectionKey, sectionDetails, false)
			}
			// make sure all uncomplete features are isLocked: true
			if (
				sectionDetails.featureType !== null &&
				!sectionDetails.isFeatureComplete
			) {
				useSetSectionLocks(allSectionsMap, sectionKey, sectionDetails, true)
			}
		})
	} else {
		// a nextActiveFeature exists...
		if (!isFeatureOn) {
			// and user deactivates selected feature...
			allSectionsAsArray.forEach(([sectionKey, sectionDetails]) => {
				// lock any matching feature that is not completed
				if (
					sectionDetails.featureType === feature &&
					!sectionDetails.isFeatureComplete
				) {
					useSetSectionLocks(allSectionsMap, sectionKey, sectionDetails, true)
				}
				// and unlock any succeeding static content up until, and including, the nextActiveFeature..
				if (
					(sectionDetails.featureType === null &&
						sectionDetails.orderNum! < nextActiveFeatureMap.get().orderNum!) ||
					sectionDetails.orderNum === nextActiveFeatureMap.get().orderNum!
				) {
					useSetSectionLocks(allSectionsMap, sectionKey, sectionDetails, false)
				}
			})
		} else if (isFeatureOn) {
			// and user reactivates selected feature...
			allSectionsAsArray.forEach(([sectionKey, sectionDetails]) => {
				// lock all suceeding sections
				if (sectionDetails.orderNum! > nextActiveFeatureMap.get().orderNum!) {
					useSetSectionLocks(allSectionsMap, sectionKey, sectionDetails, true)
				}
			})
		}
	}
}

// filtering for sections that should be visible and navigable
const filteredNavSectionsComputed = computed(
	[allSectionsMap, featuresMap],
	(allSections) => {
		const allSectionsAsArray: [string, SectionDetails][] =
			Object.entries(allSections)

		const filterForUnlocked = allSectionsAsArray.filter(
			([_, sectionDetails]) => {
				// Must be (unlocked AND static content) OR (an unlocked, completed feature that comes before nextActiveFeature) OR the nextActiveFeature
				if (nextActiveFeatureMap.get().id !== '') {
					return (
						(sectionDetails.featureType === null && !sectionDetails.isLocked) ||
						(sectionDetails.featureType !== null &&
							!sectionDetails.isLocked &&
							sectionDetails.isFeatureComplete &&
							sectionDetails.orderNum! <
								nextActiveFeatureMap.get().orderNum!) ||
						sectionDetails.orderNum! === nextActiveFeatureMap.get().orderNum!
					)
				} else {
					return sectionDetails.featureType === null
				}
			}
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
			return sectionDetails.isLocked
		})
		return Object.fromEntries(filterForLocked)
	}
)
// Finding the next & previous section based on the current section
const findSection = (
	sections: SectionsMap,
	currSection: SectionDetails,
	isNext: boolean
) => {
	const filteredNavAsArray = Object.entries(sections)
	let findSection: [string, SectionDetails] | undefined
	if (isNext) {
		findSection = filteredNavAsArray.find(([_, sectionDetails]) => {
			return (
				!sectionDetails.isLocked &&
				sectionDetails.orderNum! > currSection.orderNum!
			)
		})
	} else {
		findSection = filteredNavAsArray.findLast(([_, sectionDetails]) => {
			return (
				!sectionDetails.isLocked &&
				sectionDetails.orderNum! < currSection.orderNum!
			)
		})
	}

	let foundSection: string
	if (findSection) {
		foundSection = findSection[0]
	} else {
		foundSection = ''
	}
	return foundSection
}

const nextSectionComputed = computed(
	[currSectionMap, filteredNavSectionsComputed],
	(currSection, filteredNavSections) =>
		findSection(filteredNavSections, currSection, true)
)

const prevSectionComputed = computed(
	[currSectionMap, filteredNavSectionsComputed],
	(currSection, filteredNavSections) =>
		findSection(filteredNavSections, currSection, false)
)

const isOnFirstSectionComputed = computed(
	[currSectionMap, filteredNavSectionsComputed],
	({ id }, filteredNavSections) => id === Object.keys(filteredNavSections).at(0)
)
const isOnLastSectionComputed = computed(
	[currSectionMap, filteredNavSectionsComputed],
	({ id }, filteredNavSections) =>
		id === Object.keys(filteredNavSections).at(-1)
)
const useIsLastSection = (sectionID: string) => {
	return Object.keys(allSectionsMap.get()).at(-1) === sectionID
}

export {
	featuresMap,
	useDoesFeatureExist,
	useFeatureExists,
	allSectionsMap,
	isOnContentAtom,
	useToggleNavShown,
	currSectionMap,
	useSetCurrSection,
	nextActiveFeatureMap,
	useSetNextActiveFeature,
	useToggleFeature,
	filteredNavSectionsComputed,
	filteredLockedSectionsComputed,
	nextSectionComputed,
	prevSectionComputed,
	isOnFirstSectionComputed,
	isOnLastSectionComputed,
	useIsLastSection,
}
export type { SectionsMap, SectionDetails, FeatureMap, FeatureType }
