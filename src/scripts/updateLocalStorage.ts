// saving to localStorage
import { watch } from 'vue'
import { allSectionsMap, lessonIDAtom } from '../store/lessonStore'
import { userReflectionsStore } from '../store/featureOptionsStore'
import getLocalStorage from '../composables/useGetLocalStorage'

// TODO: Need to store in localStorage whether features have been turned off or not. Default to on, if they exist.

// Interfaces: whether feature is complete, reflection answers, practice data, etc...
interface localStorageFeatureComplete {
	isFeatureComplete: boolean
}
interface localStorageReflectionAnswer {
	reflectionAnswer: string
}
// Extracting interface keys to...
type ExtractLocalStorageKeys<T> = { [K in keyof T]: K }[keyof T]
// ...create a type of those keys for the getLocalStorage composable
type localStorageDataTypes = ExtractLocalStorageKeys<
	localStorageFeatureComplete & localStorageReflectionAnswer
>
// interface for localStorage use
interface localStorageDataObj {
	[id: string]: localStorageFeatureComplete & localStorageReflectionAnswer
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
	// Clearing all feature progress
	const allSectionsAsArray = Object.entries(allSectionsMap.get())
	// finding first available feature
	const firstFeature = allSectionsAsArray.findIndex(
		([_, details]) => details.featureType !== null
	)
	allSectionsAsArray.forEach(([key, details], index) => {
		allSectionsMap.setKey(key, {
			...details,
			isLocked: index <= firstFeature ? false : true,
			isFeatureComplete: details.featureType !== null ? false : null,
		})
	})
}

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
				localStorage.setItem(
					lessonIDAtom.get(),
					JSON.stringify(localStorageUserData)
				)
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
			localStorage.setItem(
				lessonIDAtom.get(),
				JSON.stringify(localStorageUserData)
			)
		}
	})
})

export { useResetLocalStorageUserData }
export type { localStorageDataObj, localStorageDataTypes }
