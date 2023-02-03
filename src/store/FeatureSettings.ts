import { map } from 'nanostores'

export interface FeatureMap {
	reflection: boolean
	practice: boolean
	choice: boolean
}

const features = map<FeatureMap>()

const reflectionToggle = () => {
	features.setKey('reflection', !features.get().reflection)
}
const practiceToggle = () => {
	features.setKey('practice', !features.get().practice)
}
const choiceToggle = () => {
	features.setKey('choice', !features.get().choice)
}

export { features, reflectionToggle, practiceToggle, choiceToggle }
