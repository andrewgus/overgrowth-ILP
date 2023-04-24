// lessonStore maintains the state of the entire lesson and . This manages the state of a user's work within a feature.
import { atom, map, computed, type MapStore } from 'nanostores'
import { useStore } from '@nanostores/vue'

// Feature setup for any given lesson
type FeatureType = 'reflection' | 'practice' | 'choice'

interface FeatureMap {
	reflection: boolean | null
	practice: boolean | null
	choice: boolean | null
}
// init to null because the given feature does not yet exist.
const featuresMap = map<FeatureMap>({
	reflection: null,
	practice: null,
	choice: null,
})
// if feature layout is used in lesson, activate it
const useDoesFeatureExist = (feature: FeatureType) => {
	featuresMap.setKey(feature, true)
}
// For v-ifs in vue components, if a given feature exists
const useFeatureExists = (feature: FeatureType) => {
	if (useStore(featuresMap).value[feature] !== null) {
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

// To determine whether user is on content vs header
const isOnContentAtom = atom(false)
const useToggleNavShown = () => {
	isOnContentAtom.set(!isOnContentAtom.get())
}

// To determine current section & nextActiveFeature
const currSectionMap = map<SectionDetails>()
const nextActiveFeatureMap = map<SectionDetails>()

const useSetCurrSection = (sectionKey: string) => {
	setSectionMap(currSectionMap, sectionKey)
}
const useSetNextActiveFeature = (sectionKey: string) => {
	setSectionMap(nextActiveFeatureMap, sectionKey)
}
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

// set & find functions for user nav based on user input.
const setSectionsToArray = (
	sectionMap: SectionsMap
): [string, SectionDetails][] => {
	return Object.entries(sectionMap)
}
const setSectionToLocked = (
	sectionKey: string,
	sectionDetails: SectionDetails,
	onOff: boolean
) => {
	allSectionsMap.setKey(sectionKey, {
		...sectionDetails,
		isLocked: onOff,
	})
}
const findNextActiveFeature = (
	sectionsArray: [string, SectionDetails][]
): [string, SectionDetails] | undefined => {
	const next = sectionsArray.find(([_, sectionDetails]) => {
		return (
			// it is a feature && the feature is on && the feature is not complete
			sectionDetails.featureType !== null &&
			featuresMap.get()[sectionDetails.featureType as FeatureType] &&
			!sectionDetails.isFeatureComplete
		)
	})
	return next
}

// To toggle feature on/off
const useToggleFeature = (feature: FeatureType) => {
	featuresMap.setKey(feature, !featuresMap.get()[feature])
	// updating allSections isLocked
	const isFeatureOn = featuresMap.get()[feature]
	const allSectionsAsArray = setSectionsToArray(allSectionsMap.get())

	// find the next available active feature
	const foundNextActiveFeature = findNextActiveFeature(allSectionsAsArray)
	if (foundNextActiveFeature) {
		useSetNextActiveFeature(foundNextActiveFeature[0])
	} else {
		useSetNextActiveFeature('')
	}

	if (nextActiveFeatureMap.get().id === '') {
		// all features are turned off...
		allSectionsAsArray.forEach(([sectionKey, sectionDetails]) => {
			// make sure all incomplete features are isLocked: true
			if (
				sectionDetails.featureType !== null &&
				!sectionDetails.isFeatureComplete
			) {
				setSectionToLocked(sectionKey, sectionDetails, true)
			}
			// unlock all static content
			if (sectionDetails.featureType === null) {
				setSectionToLocked(sectionKey, sectionDetails, false)
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
					setSectionToLocked(sectionKey, sectionDetails, true)
				}
				// and unlock any succeeding static content up until, and including, the nextActiveFeature..
				if (
					(sectionDetails.featureType === null &&
						sectionDetails.orderNum! < nextActiveFeatureMap.get().orderNum!) ||
					sectionDetails.orderNum === nextActiveFeatureMap.get().orderNum!
				) {
					setSectionToLocked(sectionKey, sectionDetails, false)
				}
			})
		} else if (isFeatureOn) {
			// and user reactivates selected feature...
			allSectionsAsArray.forEach(([sectionKey, sectionDetails]) => {
				// lock all suceeding sections
				if (sectionDetails.orderNum! > nextActiveFeatureMap.get().orderNum!) {
					setSectionToLocked(sectionKey, sectionDetails, true)
				}
				// unlock the selected feature
				if (sectionDetails.orderNum === nextActiveFeatureMap.get().orderNum) {
					setSectionToLocked(sectionKey, sectionDetails, false)
				}
			})
		}
	}
}
// To set a feature as complete & unlock next sections up until nextActiveFeature
const useSetFeatureComplete = () => {
	// marking feature as complete
	currSectionMap.setKey('isFeatureComplete', true)
	allSectionsMap.setKey(currSectionMap.get().id, {
		...currSectionMap.get(),
	})

	// NOTE: Below this point, I think it make become it's own function. Then, it can be called here, instead of the setFeatureComplete && it can be called if there is localStorage stating that a feature is complete.

	const allSectionsAsArray = setSectionsToArray(allSectionsMap.get())
	const foundNextActiveFeature = findNextActiveFeature(allSectionsAsArray)

	if (foundNextActiveFeature) {
		useSetNextActiveFeature(foundNextActiveFeature[0])
	} else {
		useSetNextActiveFeature('')
	}

	// if there is a next active feature
	if (foundNextActiveFeature !== undefined) {
		// Unlock all features up until, and including, the nextActiveFeature
		allSectionsAsArray.forEach(([sectionKey, sectionDetails]) => {
			if (sectionDetails.orderNum! <= nextActiveFeatureMap.get().orderNum!) {
				setSectionToLocked(sectionKey, sectionDetails, false)
			}
		})
	} else {
		// if there is NOT a next available feature
		allSectionsAsArray.forEach(([sectionKey, sectionDetails]) => {
			if (
				sectionDetails.featureType === null ||
				(sectionDetails.featureType !== null &&
					sectionDetails.isFeatureComplete)
			) {
				// Unlock all static content & complete features
				setSectionToLocked(sectionKey, sectionDetails, false)
			}
		})
	}
}

// filtering for sections that should be visible and navigable
const filteredNavSectionsComputed = computed(
	[allSectionsMap, featuresMap],
	(allSections) => {
		const allSectionsAsArray = setSectionsToArray(allSections)

		const filterForUnlocked = allSectionsAsArray.filter(
			([_, sectionDetails]) => {
				if (nextActiveFeatureMap.get().id !== '') {
					// (unlocked AND static content) OR (an unlocked, completed feature that comes before nextActiveFeature) OR the nextActiveFeature
					return (
						(sectionDetails.featureType === null && !sectionDetails.isLocked) ||
						(!sectionDetails.isLocked &&
							sectionDetails.isFeatureComplete &&
							sectionDetails.orderNum! <
								nextActiveFeatureMap.get().orderNum!) ||
						sectionDetails.orderNum! === nextActiveFeatureMap.get().orderNum!
					)
				} else {
					// any static content OR (feature is complete and not locked)
					return (
						sectionDetails.featureType === null ||
						(sectionDetails.isFeatureComplete && !sectionDetails.isLocked)
					)
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
		const allSectionsAsArray = setSectionsToArray(allSections)

		const filterForLocked = allSectionsAsArray.filter(([_, sectionDetails]) => {
			return sectionDetails.isLocked
		})
		return Object.fromEntries(filterForLocked)
	}
)
// Finding the next & previous section based on the current section
const findSectionID = (
	sections: SectionsMap,
	currSection: SectionDetails,
	isNext: boolean
) => {
	const filteredNavAsArray = setSectionsToArray(sections)
	let findSectionID: [string, SectionDetails] | undefined
	if (isNext) {
		findSectionID = filteredNavAsArray.find(([_, sectionDetails]) => {
			return (
				!sectionDetails.isLocked &&
				sectionDetails.orderNum! > currSection.orderNum!
			)
		})
	} else {
		findSectionID = filteredNavAsArray.findLast(([_, sectionDetails]) => {
			return (
				!sectionDetails.isLocked &&
				sectionDetails.orderNum! < currSection.orderNum!
			)
		})
	}

	let foundSectionID: string
	if (findSectionID) {
		foundSectionID = findSectionID[0]
	} else {
		foundSectionID = ''
	}
	return foundSectionID
}

const nextSectionComputed = computed(
	[currSectionMap, filteredNavSectionsComputed],
	(currSection, filteredNavSections) =>
		findSectionID(filteredNavSections, currSection, true)
)

const prevSectionComputed = computed(
	[currSectionMap, filteredNavSectionsComputed],
	(currSection, filteredNavSections) =>
		findSectionID(filteredNavSections, currSection, false)
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
	useSetFeatureComplete,
}
export type { SectionsMap, SectionDetails, FeatureMap, FeatureType }
