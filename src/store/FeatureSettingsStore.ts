import { useStore } from '@nanostores/vue'
import { map } from 'nanostores'

type FeatureType = 'reflection' | 'practice' | 'choice'

interface FeatureMap {
	reflection: boolean | undefined
	practice: boolean | undefined
	choice: boolean | undefined
}

const features = map<FeatureMap>({
	reflection: undefined,
	practice: undefined,
	choice: undefined,
})

function useDoesFeatureExist(feature: FeatureType) {
	features.setKey(feature, true)
}

function useFeatureExists(feature: FeatureType) {
	if (useStore(features).value[feature] !== undefined) return true
	return undefined
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
