// saving to localStorage
import { watch } from 'vue'
import { allSectionsMap, lessonIDAtom } from '../store/lessonStore'
import {
	featureProgressStore,
	userReflectionsStore,
} from '../store/featureOptionsStore'
import getLocalStorage from '../composables/useGetLocalStorage'

type localStorageDataObjProps = {
	isFeatureComplete?: boolean
	reflectionAnswer?: string
	isReflectionOff?: boolean
	isPracticeOff?: boolean
	isChoiceOff?: boolean
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
	// Clearing all finished attempts
	Object.values(featureProgressStore).forEach(
		({ isAttemptsFinished }) => (isAttemptsFinished = false)
	)
	// Clearing all feature progress
	const allSectionsAsArray = Object.entries(allSectionsMap.get())
	// finding first available feature to lock sections all after it
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
// Updating local storage based on user's progress
allSectionsMap.listen((sections) => {
	Object.entries(sections).forEach(([id, { isFeatureComplete }]) => {
		if (isFeatureComplete) {
			updateLocalStorageUserData(id, {
				isFeatureComplete: isFeatureComplete ? isFeatureComplete : false,
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
