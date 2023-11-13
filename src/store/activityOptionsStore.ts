// activityOptionsStore maintains the state across various activity interactions. This manages the state of a user's work within a activity.
import { reactive } from 'vue'
// REFLECTION
// log user's reflection answers
type UserReflectionResponses = {
	[id: string]: {
		prompt: string
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
type UserPracticeItems = {
	isPracticeOptionStepsComplete: boolean[]
	userCreatedList?: { id: number; name: string }[] | null
	userPickChoices?: [boolean, boolean] | null
}

type userPracticeProgess = {
	[id: string]: UserPracticeItems
}
const userPracticeStore = reactive<userPracticeProgess>({})
function initUserPracticeStore(id: string, data?: UserPracticeItems) {
	userPracticeStore[id] = {
		// want to be able to just put the data here, if it exists...
		/// details of what I want without it being this finegrained...
		isPracticeOptionStepsComplete: data?.isPracticeOptionStepsComplete || [],
		userCreatedList: data?.userCreatedList || null,
		userPickChoices: data?.userPickChoices || null,
	}
}

function includeUserCreatedListInPracticeStore(
	id: string,
	createdListAvailable?: { id: number; name: string }[] | null
) {
	userPracticeStore[id] = {
		...userPracticeStore[id],
		userCreatedList: !!createdListAvailable ? createdListAvailable : null,
	}
}
function includeUserPickChoiceInPracticeStore(
	id: string,
	choices?: [boolean, boolean] | null
) {
	userPracticeStore[id] = {
		...userPracticeStore[id],
		userPickChoices: !!choices ? choices : null,
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
	activtyAlertViewed?: boolean
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
	activityProgressStore['activtyAlertViewed'] = false
}

export {
	userReflectionsStore,
	initUserReflectionsStore,
	userPracticeStore,
	initUserPracticeStore,
	activityProgressStore,
	includeUserCreatedListInPracticeStore,
	includeUserPickChoiceInPracticeStore,
	initActivityProgressStore,
}
export type { UserPracticeItems }
