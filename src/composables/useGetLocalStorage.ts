import { lessonIDAtom } from '../store/lessonStore'
import type {
	localStorageDataObj,
	localStorageDataTypes,
} from '../types/localStorageTypes'

/**
 * To retrieve data saved to local storage
 * @param id? id of a given lesson section
 * @param dataType? a string value for the key of the data to retrieve
 * @returns string, boolean, localStorageDataObj, or null
 */
export default function useGetLocalStorage(
	id?: string,
	dataType?: localStorageDataTypes
) {
	if (
		typeof localStorage !== 'undefined' &&
		!!localStorage.getItem(lessonIDAtom.get())
	) {
		const localStorageData: localStorageDataObj = JSON.parse(
			localStorage.getItem(lessonIDAtom.get())!
		)
		if (id && dataType)
			return localStorageData[id] && localStorageData[id][dataType]

		if (id) return localStorageData[id]

		return localStorageData
	}
	return null
}
