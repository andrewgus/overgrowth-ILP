// activityOptionsStore maintains the state across various activity interactions. This manages the state of a user's work within a activity.
import { reactive } from 'vue'

// REFLECTION
// log user's reflection answers
type UserReflectionResponses = {
	[id: string]: {
		prompt: string,
		answer: string
	}	
}

const userReflectionsStore = reactive<UserReflectionResponses>({})
function initUserReflectionsStore(id: string, prompt: string, answer?: string) {
	userReflectionsStore[id] = {
		prompt: prompt,
		answer: answer ? answer : '',
	}
}

// PRACTICE
type userPracticeProgess = {
	[id: string]: {
	isPracticeOptionStepsComplete: boolean[]
}}
const userPracticeStore = reactive<userPracticeProgess>({})
function initUserPracticeStore(id: string, isPracticeOptionsCompleteArr?: boolean[]) {
	userPracticeStore[id] = {
		isPracticeOptionStepsComplete: isPracticeOptionsCompleteArr ? isPracticeOptionsCompleteArr : []
	}
}


// Tracking user progress within activity interactions
type ActivityProgressItem = {
	id: string
	isAttemptsFinished: boolean
	pdfGenStatus: {
		isDownloading: boolean
		isComplete: boolean
		isFailed: boolean
	}
}
type ActivityProgress = Record<string, ActivityProgressItem> & {
	wantsNoMoreAlerts?: boolean
}

const activityProgressStore = reactive<ActivityProgress>({})
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
	activityProgressStore['wantsNoMoreAlerts'] = false
}

export {
	userReflectionsStore,
	initUserReflectionsStore,
	userPracticeStore,
	initUserPracticeStore,
	activityProgressStore,
	initActivityProgressStore,
}
