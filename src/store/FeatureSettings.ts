import { atom } from 'nanostores'

const isReflectionOn = atom(true)
const isPracticeOn = atom(true)
const isChoiceOn = atom(true)

const reflectionToggle = () => {
	if (isReflectionOn.get() === true) {
		isReflectionOn.set(false)
	} else {
		isReflectionOn.set(true)
	}
}

const practiceToggle = () => {
	if (isPracticeOn.get() === true) {
		isPracticeOn.set(false)
	} else {
		isPracticeOn.set(true)
	}
}

const choiceToggle = () => {
	if (isChoiceOn.get() === true) {
		isChoiceOn.set(false)
	} else {
		isChoiceOn.set(true)
	}
}

export {
	isReflectionOn,
	isPracticeOn,
	isChoiceOn,
	reflectionToggle,
	practiceToggle,
	choiceToggle,
}
