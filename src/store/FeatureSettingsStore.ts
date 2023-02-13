import { map } from 'nanostores'

type FeatureType = 'reflection' | 'practice' | 'choice'

interface FeatureMap {
	reflection: boolean
	practice: boolean
	choice: boolean
}

const features = map<FeatureMap>()

function useDoesFeatureExist(feature: FeatureType) {
	features.setKey(feature, true)
}

function useFeatureExists(feature: FeatureType) {
	if (features.get()[feature] !== undefined) return true
}

const reflectionToggle = () => {
	features.setKey('reflection', !features.get().reflection)
}
const practiceToggle = () => {
	features.setKey('practice', !features.get().practice)
}
const choiceToggle = () => {
	features.setKey('choice', !features.get().choice)
}

export {
	features,
	reflectionToggle,
	practiceToggle,
	choiceToggle,
	useDoesFeatureExist,
	useFeatureExists,
}
export type { FeatureType }
