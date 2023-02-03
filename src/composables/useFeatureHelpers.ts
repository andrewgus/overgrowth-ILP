import { useStore } from '@nanostores/vue'
import { featureSettings } from '../store/index.js'

type FeatureType = 'reflection' | 'practice' | 'choice'

const useFeatureTypes: Array<FeatureType> = ['reflection', 'practice', 'choice']

function useDoesFeatureExist(feature: FeatureType) {
	if (document.querySelector(`[class*="${feature}"]`)) {
		featureSettings.features.setKey(feature, true)
	}
}

function useFeatureExists(feature: FeatureType) {
	if (featureSettings.features.get()[feature] !== undefined) return true
}

function useGetFeature(featureType: FeatureType) {
	return useStore(featureSettings.features).value[featureType]
}

export { useFeatureTypes, useDoesFeatureExist, useFeatureExists, useGetFeature }
