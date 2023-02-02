import { atom, map } from 'nanostores'

export interface FeatureMap {
	reflection: boolean
	practice: boolean
	choice: boolean
}

const features = map<FeatureMap>()

const isReflectionOn = atom<boolean>(false)
const isPracticeOn = atom<boolean>(false)
const isChoiceOn = atom<boolean>(false)

const reflectionToggle = () => {
	isReflectionOn.set(!isReflectionOn.get())
}
const practiceToggle = () => {
	isPracticeOn.set(!isPracticeOn.get())
}
const choiceToggle = () => {
	isChoiceOn.set(!isChoiceOn.get())
}

export {
	features,
	isReflectionOn,
	isPracticeOn,
	isChoiceOn,
	reflectionToggle,
	practiceToggle,
	choiceToggle,
}
