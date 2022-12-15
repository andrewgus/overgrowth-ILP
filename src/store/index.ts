import type { WritableAtom } from 'nanostores'
import * as featureSettings from './FeatureSettings'

interface Settings {
	isReflectionOn: WritableAtom<boolean>
	isPracticeOn: WritableAtom<boolean>
	isChoiceOn: WritableAtom<boolean>
	reflectionToggle: () => void
	practiceToggle: () => void
	choiceToggle: () => void
}

export default featureSettings as Settings
