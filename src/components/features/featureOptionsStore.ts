import { reactive } from 'vue'
// log user's reflection answers
interface userAnswers {
	[id: string]: {
		prompt: string
		answer: string
	}
}
const userReflectionsStore = reactive<userAnswers>({})
function initUserReflectionsStore(id: string, prompt: string) {
	userReflectionsStore[id] = {
		prompt: prompt,
		answer: '',
	}
}

/* TODO: A create a store for userPracticeAttempts with the following interface:

	[id: string]: {
		id: string
		attemptsTotal: number
		[attemptNum: number]: {
			...actions
			[Need to figure this out later]
		}
	}
	
	 NOTE: When creating first practice activity component, will need to create a store for # of user attempts and how they performed in each attempt. NOTE: May have to create a persisent nanostore for that and refactor all of this to that nanostore.
*/

// Tracking user progress for completing features
interface featureProgress {
	[id: string]: {
		id: string
		attemptsFinished: boolean
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
		attemptsFinished: false,
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
