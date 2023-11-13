import { lessonIDAtom } from '../store/lessonStore'
import type {
	LocalStorageDataObj,
	LocalStorageDataTypes,
} from '../types/localStorageTypes'

/**
 * To retrieve data saved to local storage
 * @param id? id of a given lesson section
 * @param dataType? a string value for the key of the data to retrieve
 * @returns string, boolean, LocalStorageDataObj, or null
 */
export default function useGetLocalStorage(
	id?: string,
	dataType?: LocalStorageDataTypes
) {
	if (
		typeof localStorage !== 'undefined' &&
		!!localStorage.getItem(lessonIDAtom.get())
	) {
		const localStorageData: LocalStorageDataObj = JSON.parse(
			localStorage.getItem(lessonIDAtom.get())!
		)
		if (id && dataType)
			return localStorageData[id] && localStorageData[id][dataType]

		if (id) return localStorageData[id]

		return localStorageData
	}
	return null
}
