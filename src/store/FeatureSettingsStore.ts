import { useStore } from '@nanostores/vue'
import { map } from 'nanostores'
import { allSectionsMap } from './NavigationStore.js'

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

const useDoesFeatureExist = (feature: FeatureType) => {
	featuresMap.setKey(feature, true)
}

const useFeatureExists = (feature: FeatureType) => {
	if (useStore(featuresMap).value[feature] !== undefined) {
		return true
	} else {
		return false
	}
}

const useToggleFeature = (feature: FeatureType) => {
	// for any given Feature
	featuresMap.setKey(feature, !featuresMap.get()[feature])
	// updating allSections isLocked
	const isFeatureOn = featuresMap.get()[feature]

	const allSectionsAsArray = Object.entries(allSectionsMap.get())

	const findNextActiveFeature = allSectionsAsArray.find(
		([_, sectionDetails]) => {
			return (
				!!sectionDetails.isFeatureType &&
				featuresMap.get()[sectionDetails.isFeatureType as FeatureType]
			)
		}
	)

	if (findNextActiveFeature === undefined) return

	const [nextActiveSectionKey, nextActiveSectionDetails] = findNextActiveFeature

	const newValue = {
		...nextActiveSectionDetails,
		isLocked: !nextActiveSectionDetails.isLocked,
	}
	console.log(newValue)

	// TODO: work on this. when feature is turned back on, nextActive feature, is now that feature that was turned off before. In its current state, this just switches it to locked. Not what is intended.
	if (isFeatureOn === false) {
		allSectionsMap.setKey(nextActiveSectionKey, newValue)
		allSectionsAsArray.forEach(([_, sectionDetails]) => {
			if (
				sectionDetails.orderNum &&
				sectionDetails.orderNum <= nextActiveSectionDetails.orderNum!
			) {
				sectionDetails.isLocked === false
			}
		})
	} else if (isFeatureOn === true) {
		allSectionsMap.setKey(nextActiveSectionKey, newValue)
		console.log(allSectionsMap.get())
		allSectionsAsArray.forEach(([_, sectionDetails]) => {
			if (
				sectionDetails.orderNum &&
				sectionDetails.orderNum > nextActiveSectionDetails.orderNum!
			) {
				sectionDetails.isLocked === true
			}
		})
	}

	// NOTE: OLD STUFF BELOW. STILL NEED IF STATEMENT
	allSectionsMap.subscribe((allSections) => {
		const allSectionsAsArray = Object.entries(allSections)

		//Finding the next active feature...
		const findNextActiveFeatureIndex = allSectionsAsArray.find(
			([_, sectionDetails]) => {
				return (
					!!sectionDetails.isFeatureType &&
					featuresMap.get()[sectionDetails.isFeatureType as FeatureType]
				)
			}
		)

		if (isFeatureOn === false) {
			// If the feature is off, unlock any content that comes before it.
			// allSectionsAsArray.forEach(([_, sectionDetails]) => {
			// 	if (sectionDetails.orderNum! <= findNextActiveFeatureIndex) {
			// 		sectionDetails.isLocked = false
			// 	}
			// })
			allSections[findNextActiveFeatureIndex![0]]
		} else if (isFeatureOn === true) {
			// If the feature is on, lock any content that comes after it.
			// allSectionsAsArray.forEach(([_, sectionDetails]) => {
			// 	if (sectionDetails.orderNum! > findNextActiveFeatureIndex) {
			// 		sectionDetails.isLocked = true
			// 	}
			// })
		}
	})
}

export { featuresMap, useDoesFeatureExist, useFeatureExists, useToggleFeature }
export type { FeatureType }
