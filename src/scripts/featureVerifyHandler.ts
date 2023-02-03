import { featureSettings } from '../store/index.js'
type featureType = 'reflection' | 'practice' | 'choice'

const featuresTypes: Array<featureType> = ['reflection', 'practice', 'choice']

featuresTypes.forEach((feature) => {
	if (document.querySelector(`[class*="${feature}"]`)) {
		featureSettings.features.setKey(feature, true)
	}
})
export {}
