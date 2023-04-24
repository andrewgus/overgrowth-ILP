import type {
	localStorageDataObj,
	localStorageDataTypes,
} from './updateLocalStorage'

/**
 * To retrieve data saved to local storage
 * @param id id of a given lesson section
 * @param dataType a string value for the key of the data to retrieve
 * @returns the value of that key
 */
export default function useGetLocalStorage(
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
