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
	isFeatureType: FeatureType | null
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

// To toggle feature on/off
const useToggleFeature = (feature: FeatureType) => {
	featuresMap.setKey(feature, !featuresMap.get()[feature])
	// updating allSections isLocked
	const isFeatureOn = featuresMap.get()[feature]
	const allSectionsAsArray = Object.entries(allSectionsMap.get())
	// find the next available active feature
	const nextActiveFeature = allSectionsAsArray.find(([_, sectionDetails]) => {
		return (
			// it is a feature && the feature is on && the feature is not complete
			!!sectionDetails.isFeatureType &&
			featuresMap.get()[sectionDetails.isFeatureType as FeatureType] &&
			sectionDetails.isFeatureComplete !== true
		)
	})

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
	/*  TODO: 
	Within this toggleFeature function, I'm also determining the nextActiveFeature and using that to set the isLocked prop all sections based on that, to respond to users desires for what feature(s) are active or not. Parts 1 and 2 below should properly fit into this function. Parts 3 and 4 should fit into their own named computed values.

	How below should function:
	✅ 1) nextActiveFeature must: 1) be a feature, 2) must be toggled on, 3) NOT be completed


	 2) If a feature is complete, it cannot be isLocked: true. It must be unlocked. 

	 	2b) The only exception to 1 being when, for example, feature B is completed while feature A (which is situated before feature B in the section stack) is turned off. Then, the user decides to go back and turn feature A on. Feature A is now on, and incomplete, which would mean that all features after it must be locked and hidden until it is complete. This MUST include feature B. However, once feature A is completed, feature B will already also be completed and the user can progress past both as they are now both completed and unlocked.


	3) filterForNav will only ever contain: 1) all static content or any completed features preceding nextActiveFeature, and 2) the nextActiveFeature (if it exists)


	4) filterForLocked will only ever contain: any static content or any feature (completed or not) that comes after the nextActiveFeature  
	*/

	console.log(allSectionsMap.get())
	if (nextActiveFeature === undefined) {
		// all features are turned off...
		allSectionsAsArray.forEach(([sectionKey, sectionDetails]) => {
			if (sectionDetails.isFeatureType === null) {
				setSectionLocks(sectionKey, sectionDetails, false)
			}
		})
	} else {
		// a nextActiveFeature exists...
		const [_, nextActiveFeatureDetails] = nextActiveFeature
		if (isFeatureOn === false) {
			// and user deactivates selected feature...
			allSectionsAsArray.forEach(([sectionKey, sectionDetails]) => {
				// NOTE: Here, I want... the selected feature to be set isLocked: true, unless isFeatureComplete is true, AND any static content that comes after it and before the nextActiveFeature to set isLocked: false, AND the nextActiveFeature to be set to isLocked: false
				// BUG: Somewhere, the orderNum of practice is being changed to zero. Need to stop that ASAP.
				// CLUES: When Reflection is completed, practice orderNum becomes 0. When Reflection && Practice are turned OFF, practice orderNum becomes 0. So far, those are the only two cases. What do they have in common? Turning off all three, sets both practice and choice orderNum to 0. Turned off only practice and choice, does NOT set the orderNum to 0. Reflection must also be turned off. The common denom is Reflection. The first item. Turning off Reflection and Choice sets practice orderNum to 0.

				// lock any matching feature that is not completed
				if (
					sectionDetails.isFeatureType === feature &&
					sectionDetails.isFeatureComplete === false
				) {
					setSectionLocks(sectionKey, sectionDetails, true)
				}
				// and also unlock next available feature...
				if (
					sectionDetails.orderNum! <= nextActiveFeatureDetails.orderNum! ||
					sectionDetails.isFeatureComplete === true
				) {
					setSectionLocks(sectionKey, sectionDetails, false)
				}
			})
		} else if (isFeatureOn === true) {
			// and user reactivates selected feature...
			allSectionsAsArray.forEach(([sectionKey, sectionDetails]) => {
				// lock all future sections
				if (sectionDetails.orderNum! > nextActiveFeatureDetails.orderNum!) {
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
		currSectionMap.setKey('isFeatureType', null)
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

				// Must be either 1) static content OR feature is on && incomplete OR feature is off && complete AND 2) section is unlocked
				return (
					(sectionDetails.isFeatureType === null ||
						(isFeatureOn === true &&
							sectionDetails.isFeatureComplete === false) ||
						(isFeatureOn === false &&
							sectionDetails.isFeatureComplete === true)) &&
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
const nextSectionComputed = computed(
	[currSectionMap, filteredNavSectionsComputed],
	({ orderNum }, filteredNavSections) => {
		const allFilteredNavSectionKeys = Object.keys(filteredNavSections)
		let nextSection: string

		if (orderNum !== null) {
			nextSection = allFilteredNavSectionKeys.at(orderNum + 1)!
		} else {
			nextSection = allFilteredNavSectionKeys.at(0)!
		}
		return nextSection
	}
)

const prevSectionComputed = computed(
	[currSectionMap, filteredNavSectionsComputed],
	({ orderNum }, filteredNavSections) => {
		const allFilteredNavSectionKeys = Object.keys(filteredNavSections)
		let prevSection: string
		if (orderNum !== null) {
			prevSection = allFilteredNavSectionKeys.at(orderNum - 1)!
		} else {
			prevSection = allFilteredNavSectionKeys.at(0)!
		}
		return prevSection
	}
)

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
