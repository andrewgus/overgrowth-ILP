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

// For determining if a feature section is used in the lesson
const useDoesFeatureExist = (feature: FeatureType) => {
	featuresMap.setKey(feature, true)
}
// For v-ifs, if those features exists
const useFeatureExists = (feature: FeatureType) => {
	if (useStore(featuresMap).value[feature] !== undefined) {
		return true
	} else {
		return false
	}
}

const useToggleFeature = (feature: FeatureType) => {
	// for any given Feature, toggle previous value
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

	const [_, nextActiveSectionDetails] = findNextActiveFeature

	if (isFeatureOn === false) {
		allSectionsAsArray.forEach(([sectionKey, sectionDetails]) => {
			if (sectionDetails.orderNum! <= nextActiveSectionDetails.orderNum!) {
				// if a section's orderNum is less than or equal to the nextActive's orderNum, unlock those sections
				allSectionsMap.setKey(sectionKey, {
					...sectionDetails,
					isLocked: false,
				})
			}
		})
	} else if (isFeatureOn === true) {
		allSectionsAsArray.forEach(([sectionKey, sectionDetails]) => {
			if (sectionDetails.orderNum! > nextActiveSectionDetails.orderNum!) {
				// if a section's orderNum is greater than the nextActive's orderNum, lock those sections
				allSectionsMap.setKey(sectionKey, {
					...sectionDetails,
					isLocked: true,
				})
			}
		})
	}
}

export { featuresMap, useDoesFeatureExist, useFeatureExists, useToggleFeature }
export type { FeatureType }
