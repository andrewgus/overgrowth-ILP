// saving to localStorage
import { watch } from 'vue'
import { allSectionsMap, featuresMap, lessonIDAtom } from '../store/lessonStore'
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
	data?: Partial<localStorageDataObjProps>,
	shouldDelete?: boolean,
	deleteWhat?: localStorageDataTypes
) => {
	if (shouldDelete) {
		// FIXME: Figure out best way to delete
		if (Object.values(localStorageUserData[id]).length === 0) {
			delete localStorageUserData[id]
			if (Object.values(localStorageUserData).length === 0) {
				localStorage.removeItem(lessonIDAtom.get())
			}
		} else {
			delete localStorageUserData[id][deleteWhat!]
		}
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
		// FIXME: toggle data will save, but not properly return on refresh... I think it has to do with this before. It starts as null and then changes to true, and that triggers this...
		if (!!getLocalStorage('featureToggle')) {
			if (isOn !== null && isOn === true) {
				console.log(featureType, isOn)
				// switch (featureType) {
				// 	case 'reflection':
				// 		updateLocalStorageUserData(
				// 			'featureToggle',
				// 			undefined,
				// 			true,
				// 			'isReflectionOff'
				// 		)
				// 		break
				// 	case 'practice':
				// 		updateLocalStorageUserData(
				// 			'featureToggle',
				// 			undefined,
				// 			true,
				// 			'isPracticeOff'
				// 		)
				// 		break
				// 	case 'choice':
				// 		updateLocalStorageUserData(
				// 			'featureToggle',
				// 			undefined,
				// 			true,
				// 			'isChoiceOff'
				// 		)
				// 		break
				// }
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
