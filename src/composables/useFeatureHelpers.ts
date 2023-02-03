import { useStore } from '@nanostores/vue'
import { featureSettings } from '../store/index.js'

type featureType = 'reflection' | 'practice' | 'choice'

function useFeatureExists(feature: featureType) {
	if (featureSettings.features.get()[feature] !== undefined) return true
}

function useGetFeature(featureType: featureType) {
	return useStore(featureSettings.features).value[featureType]
}

export { useFeatureExists, useGetFeature }
