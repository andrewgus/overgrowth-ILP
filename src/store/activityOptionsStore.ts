// activityOptionsStore maintains the state across various activity interactions. This manages the state of a user's work within a activity.
import { reactive } from 'vue'

// REFLECTION
// log user's reflection answers
type userReflectionResponses = {
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

// Tracking user progress within activity interactions
interface activityProgress {
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
const activityProgressStore = reactive<activityProgress>({})
function initActivityProgressStore(id: string) {
	activityProgressStore[id] = {
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
	activityProgressStore,
	initActivityProgressStore,
}
