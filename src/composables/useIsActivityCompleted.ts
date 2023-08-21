import { computed } from "vue";
import { allSectionsMap } from "../store/lessonStore";
import { useStore } from "@nanostores/vue";

const $allSections = useStore(allSectionsMap)

/**
 * Get computed ref of whether an activity is fully completed or not.
 * @param id Section's ID
 * @returns boolean
 */
function isActivityCompleted(id: string) {
    return computed(() => $allSections.value && $allSections.value[id] && $allSections.value[id].isActivityComplete)
}

export default isActivityCompleted