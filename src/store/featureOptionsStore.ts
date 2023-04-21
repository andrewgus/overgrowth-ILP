import { reactive, watch } from 'vue'
// TODO: Need to track whether the feature is complete (featureComplete: boolean) with localStorage. That way, if users already selected continue, it will already be set as complete with their content inputted. Will still have the ability to save as PDF.
// TODO: Need to create a "Reset this Lesson" btn. So users can reset a lesson's local storage and have a fresh lesson. Also need to figure out it's placement.

// REFLECTION STORE
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

// PRACTICE STORE
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
		isAttemptsFinished: boolean
		isFeatureComplete: boolean
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
		isFeatureComplete: false,
		pdfGenStatus: {
			isDownloading: false,
			isComplete: false,
			isFailed: false,
		},
	}
}

// saving to localStorage
type localStorageDataTypes = 'isFeatureComplete' | 'reflectionAnswer'
interface localStorageFeatureComplete {
	isFeatureComplete?: boolean
}
interface localStorageReflectionAnswer {
	reflectionAnswer?: string
}
interface localStorageDataObj {
	[id: string]: localStorageFeatureComplete & localStorageReflectionAnswer
}
const localStorageUserData: localStorageDataObj = {}

// Updating local storage based on user's work
watch(
	() => userReflectionsStore,
	(updatedReflections) => {
		Object.entries(updatedReflections).forEach(([id, { answer }]) => {
			if (answer !== '') {
				localStorageUserData[id] = {
					...localStorageUserData[id],
					reflectionAnswer: answer ? answer : '',
				}
				localStorage.setItem('lessonData', JSON.stringify(localStorageUserData))
			}
		})
	},
	{ deep: true }
)
// Updating local storage based on user's progress
watch(
	featureProgressStore,
	(featureProgress) => {
		Object.entries(featureProgress).forEach(([id, { isFeatureComplete }]) => {
			if (isFeatureComplete) {
				localStorageUserData[id] = {
					...localStorageUserData[id],
					isFeatureComplete: isFeatureComplete ? isFeatureComplete : false,
				}
				console.log(localStorageUserData[id])
				localStorage.setItem('lessonData', JSON.stringify(localStorageUserData))
			}
		})
	},
	{ deep: true }
)

export {
	userReflectionsStore,
	initUserReflectionsStore,
	featureProgressStore,
	initFeatureProgressStore,
	localStorageUserData,
}
export type { localStorageDataObj, localStorageDataTypes }
