import { atom } from 'nanostores'

const isReflectionOn = atom(true)
const isPracticeOn = atom(true)
const isChoiceOn = atom(true)

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
	isReflectionOn,
	isPracticeOn,
	isChoiceOn,
	reflectionToggle,
	practiceToggle,
	choiceToggle,
}
