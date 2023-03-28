import { onMounted, ref } from 'vue'
import { useStore } from '@nanostores/vue'
import { allSectionsMap } from '../store/lessonStore'

const $allSections = useStore(allSectionsMap)
/**
 * For Vue only: To determine if sections are registered in the lessonStore
 * @returns boolean, if the number of section keys are greater than 0
 */
export default function useAreSectionsAvailable() {
	let areSectionsAvailable = ref<boolean>(false)
	onMounted(() => {
		areSectionsAvailable.value = Object.keys($allSections.value).length > 0
	})
	return areSectionsAvailable
}
