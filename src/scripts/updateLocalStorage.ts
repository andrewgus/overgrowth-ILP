// saving to localStorage
import { watch } from 'vue'
import { allSectionsMap, lessonID } from '../store/lessonStore'
import { userReflectionsStore } from '../store/featureOptionsStore'
import getLocalStorage from '../composables/useGetLocalStorage'

// TODO: Need to create a "Reset this Lesson" btn. So users can reset a lesson's local storage and have a fresh lesson. Also need to figure out it's placement.

interface localStorageFeatureComplete {
	isFeatureComplete: boolean
}
interface localStorageReflectionAnswer {
	reflectionAnswer: string
}

type ExtractLocalStorageKeys<T> = { [K in keyof T]: K }[keyof T]

type localStorageDataTypes = ExtractLocalStorageKeys<
	localStorageFeatureComplete & localStorageReflectionAnswer
>

interface localStorageDataObj {
	[id: string]: localStorageFeatureComplete & localStorageReflectionAnswer
}

const localStorageUserData: localStorageDataObj = !!getLocalStorage()
	? (getLocalStorage() as localStorageDataObj)
	: {}

// Updating local storage based on user's work
watch(
	() => userReflectionsStore,
	(updatedReflections) => {
		Object.entries(updatedReflections).forEach(([id, { answer }]) => {
			if (!!answer) {
				localStorageUserData[id] = {
					...localStorageUserData[id],
					reflectionAnswer: answer ? answer : '',
				}
				localStorage.setItem(lessonID.get(), JSON.stringify(localStorageUserData))
			}
		})
	},
	{ deep: true }
)

// Updating local storage based on user's progress
allSectionsMap.subscribe((sections) => {
	Object.entries(sections).forEach(([id, { isFeatureComplete }]) => {
		if (isFeatureComplete) {
			localStorageUserData[id] = {
				...localStorageUserData[id],
				isFeatureComplete: isFeatureComplete ? isFeatureComplete : false,
			}
			localStorage.setItem(lessonID.get(), JSON.stringify(localStorageUserData))
		}
	})
})

export { localStorageUserData }
export type { localStorageDataObj, localStorageDataTypes }
