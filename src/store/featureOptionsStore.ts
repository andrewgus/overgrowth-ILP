// FeatureOptionsStore maintains the state across various feature interactions. This manages the state of a user's work within a feature.
import { reactive } from 'vue'

// REFLECTION
// log user's reflection answers
interface userReflectionResponses {
	[id: string]: {
		prompt: string
		answer: string
	}
}

const userReflectionsStore = reactive<userReflectionResponses>({})
function initUserReflectionsStore(id: string, prompt: string, answer?: string) {
	userReflectionsStore[id] = {
		prompt: prompt,
		answer: answer ? answer : '',
	}
}

// PRACTICE
/* TODO: A create a store for userPracticeAttempts with the following interface:

	[id: string]: {
		id: string
		attemptsTotal: number
		[attemptNum: number]: {
			...actions
			[Need to figure this out later]
		}
	}
	 NOTE: When creating first practice activity component, will need to create a store for # of user attempts and how they performed in each attempt.
*/

// Tracking user progress within feature interactions
interface featureProgress {
	[id: string]: {
		id: string
		isAttemptsFinished: boolean
		pdfGenStatus: {
			isDownloading: boolean
			isComplete: boolean
			isFailed: boolean
		}
	}
}
const featureProgressStore = reactive<featureProgress>({})
function initFeatureProgressStore(id: string) {
	featureProgressStore[id] = {
		id: id,
		isAttemptsFinished: false,
		pdfGenStatus: {
			isDownloading: false,
			isComplete: false,
			isFailed: false,
		},
	}
}

export {
	userReflectionsStore,
	initUserReflectionsStore,
	featureProgressStore,
	initFeatureProgressStore,
}
