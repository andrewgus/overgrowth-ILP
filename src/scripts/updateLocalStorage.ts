// saving to localStorage
import { watch } from 'vue'
import { allSectionsMap, featuresMap, lessonIDAtom } from '../store/lessonStore'
import { userReflectionsStore } from '../store/featureOptionsStore'
import getLocalStorage from '../composables/useGetLocalStorage'

interface localStorageDataObjProps {
	isFeatureComplete?: boolean
	reflectionAnswer?: string
	isReflectionOff?: boolean
	isPracticeOff?: boolean
	isChoiceOff?: boolean
}
type localStorageDataTypes = keyof localStorageDataObjProps

interface localStorageDataObj {
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

const updateLocalStorageUserData = (
	id: string,
	data: Partial<localStorageDataObjProps>
) => {
	localStorageUserData[id] = {
		...localStorageUserData[id],
		...data,
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
featuresMap.listen((feature) => {
	Object.entries(feature).forEach(([featureType, isOn]) => {
		if (isOn !== null && !isOn) {
			switch (featureType) {
				case 'reflection':
					updateLocalStorageUserData('featureToggle', {
						isReflectionOff: isOn,
					})
					break
				case 'practice':
					updateLocalStorageUserData('featureToggle', {
						isPracticeOff: isOn,
					})
					break
				case 'choice':
					updateLocalStorageUserData('featureToggle', {
						isChoiceOff: isOn,
					})
					break
			}
		}
	})
})

export { useResetLocalStorageUserData }
export type {
	localStorageDataObj,
	localStorageDataObjProps,
	localStorageDataTypes,
}
