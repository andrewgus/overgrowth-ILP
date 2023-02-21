import { useStore } from '@nanostores/vue'
import { computed } from 'vue'
import {
	allSectionsMap,
	filteredSectionsComputed,
} from '../store/NavigationStore'

const allSections = useStore(allSectionsMap).value
const filteredSections = useStore(filteredSectionsComputed).value

const useFilteredSections = computed(() => {
	let sections = allSections

	setTimeout(() => {
		sections = filteredSections
	}, 100)

	return sections
})

export default useFilteredSections
