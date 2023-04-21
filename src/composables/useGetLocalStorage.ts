import type {
	localStorageDataObj,
	localStorageDataTypes,
} from '../store/featureOptionsStore'

export default function getLocalStorage(
	id: string,
	dataType: localStorageDataTypes
) {
	if (!!localStorage.getItem('lessonData')) {
		const localStorageData: localStorageDataObj = JSON.parse(
			localStorage.getItem('lessonData')!
		)
		return localStorageData[id] && localStorageData[id][dataType]
	}
}
