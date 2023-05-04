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
	data?: Partial<localStorageDataObjProps>,
	shouldDelete?: boolean,
	deleteWhat?: localStorageDataTypes
) => {
	if (shouldDelete) {
		delete localStorageUserData[id][deleteWhat!]
	} else {
		localStorageUserData[id] = {
			...localStorageUserData[id],
			...data,
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
// Updating local storage based on user's choice
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
		// NOTE: Want to remove the prop all together from the store if feature is turned on. Get this functioning where it deletes the prop from the object. Probably need to update the updateLocalStorageUserData for an optional param to delete and still send to localStorage.
		// TODO: THEN work on getting that over to the TitleCard
		// BUG: This will run immediately when it is set from null to true... that's bad.
		// if (isOn !== null && isOn === true) {
		// 	switch (featureType) {
		// 		case 'reflection':
		// 			console.log(featureType, isOn)

		// 			break
		// 		case 'practice':
		// 			console.log(featureType, isOn)
		// 			break
		// 		case 'choice':
		// 			console.log(featureType, isOn)
		// 			break
		// 	}
		// }
	})
})

export { useResetLocalStorageUserData }
export type {
	localStorageDataObj,
	localStorageDataObjProps,
	localStorageDataTypes,
}
