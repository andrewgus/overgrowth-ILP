// saving to localStorage
import { watch } from 'vue'
import { allSectionsMap, lessonIDAtom, useSetNextIncompleteActivity } from '../store/lessonStore'
import {userReflectionsStore, userPracticeStore } from '../store/activityOptionsStore'
import getLocalStorage from '../composables/useGetLocalStorage'

type localStorageDataObjProps = {
	isActivityComplete?: boolean
	reflectionAnswer?: string
	isPracticeOptionStepsComplete: boolean[]
}
type localStorageDataTypes = keyof localStorageDataObjProps

type localStorageDataObj = {
	[id: string]: localStorageDataObjProps
}

let localStorageUserData: localStorageDataObj = !!getLocalStorage()
	? (getLocalStorage() as localStorageDataObj)
	: {}

const useResetLocalStorageUserData = () => {
	localStorageUserData = {}
	// Clearing all reflection answers
	Object.values(userReflectionsStore).forEach(
		(reflection) => (reflection.answer = '')
	)
	// Clearing all practice steps
	Object.values(userPracticeStore).forEach(
		(practice) => (practice.isPracticeOptionStepsComplete.fill(false))
	)
	// Clearing all activity progress
	const allSectionsAsArray = Object.entries(allSectionsMap.get())
	// finding first available activity to lock sections all after it
	const firstActivity = allSectionsAsArray.findIndex(
		([_, details]) => details.activityType !== null
	)
	useSetNextIncompleteActivity(allSectionsAsArray[firstActivity][0])
	allSectionsAsArray.forEach(([key, details], index) => {
		allSectionsMap.setKey(key, {
			...details,
			isLocked: index <= firstActivity ? false : true,
			isActivityComplete: details.activityType !== null ? false : null,
		})
	})
}

const updateLocalStorageUserData = (
	id: string,
	dataToUpdate?: Partial<localStorageDataObjProps>
) => {
	if (dataToUpdate) {
		localStorageUserData[id] = {
			...localStorageUserData[id],
			...dataToUpdate,
		}
	}
	localStorage.setItem(lessonIDAtom.get(), JSON.stringify(localStorageUserData))
}

// Updating local storage based on user's work
watch(
	() => userReflectionsStore,
	(updatedReflections) => {
		Object.entries(updatedReflections).forEach(([id, { answer }]) => {
			if (answer !== '') {
				updateLocalStorageUserData(id, {
					reflectionAnswer: answer ? answer : '',
				})
			}
		})
	},
	{ deep: true }
)
watch(
	() => userPracticeStore,
	(updatedReflections) => {
		Object.entries(updatedReflections).forEach(([id, { isPracticeOptionStepsComplete }]) => {
			if (isPracticeOptionStepsComplete.length >= 1) {
				updateLocalStorageUserData(id, {
					isPracticeOptionStepsComplete: isPracticeOptionStepsComplete
				})
			}
		})
	},
	{ deep: true }
)
// Updating local storage based on user's progress
allSectionsMap.listen((sections) => {
	Object.entries(sections).forEach(([id, { isActivityComplete }]) => {
		if (isActivityComplete) {
			updateLocalStorageUserData(id, {
				isActivityComplete: isActivityComplete ? isActivityComplete : false,
			})
		}
	})
})

export { useResetLocalStorageUserData }
export type {
	localStorageDataObj,
	localStorageDataObjProps,
	localStorageDataTypes,
}
