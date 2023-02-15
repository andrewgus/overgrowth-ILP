import { useStore } from '@nanostores/vue'
import { map } from 'nanostores'

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

function useDoesFeatureExist(feature: FeatureType) {
	featuresMap.setKey(feature, true)
}

function useToggleFeature(feature: FeatureType) {
	featuresMap.setKey(feature, !featuresMap.get()[feature])
}

function useFeatureExists(feature: FeatureType) {
	if (useStore(featuresMap).value[feature] !== undefined) {
		return true
	} else {
		return false
	}
}

export { featuresMap, useDoesFeatureExist, useFeatureExists, useToggleFeature }
export type { FeatureType }
