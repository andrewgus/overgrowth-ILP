import { useStore } from '@nanostores/vue'
import { contentQuery } from '../store/index.js'
import { computed } from 'vue'

const querycurrSectionIdNum = useStore(contentQuery.currSectionIdNum)
const queryAllSections = useStore(contentQuery.allSections)

/**
 * To set the current section in the store
 * @param sectionId The section ID to be set as the current section
 * @returns The given section ID is set as the current section in the store
 */
const useSetCurrSection = (sectionId: string) =>
	contentQuery.setCurrSection(sectionId)

/**
 * Returns an array of all items in the lesson
 */
const useNavItems = computed(() => {
	let titles: string[] = []
	let sectionIds: string[] = []

	queryAllSections.value.forEach((s: HTMLElement) => {
		titles.push(s.querySelector('h2')!.textContent!)
		sectionIds.push(s.id)
	})

	const allSectionsObj: {
		[key: string]: {
			id: string
			title: string
		}
	} = {}

	for (const [i, sectionId] of sectionIds.entries()) {
		allSectionsObj[sectionId] = {
			id: sectionId,
			title: titles[i],
		}
	}

	return allSectionsObj
})

/**
 * Returns an object with the first and last section of the lesson as bookends
 */

const useIsBookendSection = computed(() => {
	const currSectionIdNum = `section${querycurrSectionIdNum.value}`
	const bookendSectionId = {
		first: Object.keys(useNavItems.value).at(0),
		last: Object.keys(useNavItems.value).at(-1),
	}

	const isFirst = currSectionIdNum === bookendSectionId.first
	const isLast = currSectionIdNum === bookendSectionId.last

	return { isFirst, isLast }
})

export { useSetCurrSection, useNavItems, useIsBookendSection }
