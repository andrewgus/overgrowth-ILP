// saving to localStorage
import { watch } from 'vue'
import {
	allSectionsMap,
	lessonIDAtom,
	useSetNextIncompleteActivity,
} from '../store/lessonStore'
import {
	userReflectionsStore,
	userPracticeStore,
} from '../store/activityOptionsStore'
import getLocalStorage from '../composables/useGetLocalStorage'
import type {
	LocalStorageDataObjProps,
	LocalStorageDataObj,
} from '../types/localStorageTypes'

let localStorageUserData: LocalStorageDataObj = !!getLocalStorage()
	? (getLocalStorage() as LocalStorageDataObj)
	: {}

const useResetLocalStorageUserData = () => {
	localStorageUserData = {}
	// Clearing all reflection store
	Object.values(userReflectionsStore).forEach(
		(reflection) => (reflection.answer = '')
	)
	// Clearing practice store
	Object.values(userPracticeStore).forEach((practice) => {
		// setting all steps to incomplete
		practice.isPracticeOptionStepsComplete.fill(false)
		// setting any user created lists to null
		if (practice.userCreatedList) practice.userCreatedList = null
		// setting any user choices to null
		if (practice.userPickChoices !== null) practice.userPickChoices = null
	})

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

	// removing item from localStorage

	if (localStorage.getItem(lessonIDAtom.get())) {
		setTimeout(() => {
			localStorage.removeItem(lessonIDAtom.get())
		}, 330)
	}
}

// function to update localStorage backed on what data was updated
const updateLocalStorageUserData = (
	id: string,
	dataToUpdate?: Partial<LocalStorageDataObjProps>
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
			// if user provided an anwer, send that answer to the store
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
	(updatedPractice) => {
		Object.entries(updatedPractice).forEach(([id, updatedPractice]) => {
			// if at least one practice step is complete, set that array to localStorage
			if (updatedPractice.isPracticeOptionStepsComplete.length >= 1) {
				updateLocalStorageUserData(id, {
					isPracticeOptionStepsComplete:
						updatedPractice.isPracticeOptionStepsComplete,
				})
			}
			// if there is a userCreatedList, set that created list to localStorage
			if (!!updatedPractice.userCreatedList) {
				updateLocalStorageUserData(id, {
					userCreatedList: updatedPractice.userCreatedList,
				})
			}
			if (!!updatedPractice.userPickChoices) {
				updateLocalStorageUserData(id, {
					userPickChoices: updatedPractice.userPickChoices,
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
