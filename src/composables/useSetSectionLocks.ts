import type { MapStore } from 'nanostores'
import type { SectionDetails, SectionsMap } from '../store/lessonStore'

/**
 * To lock/unlock sections within the allSectionsMap in the lessonStore.
 * @param sectionMap use allSectionsMap
 * @param sectionKey use sectionMap key
 * @param sectionDetails the sectionMap details
 * @param onOff Whether a section should be locked (true) or unlocked (false)
 */
export default function setSectionLocks(
	sectionMap: MapStore<SectionsMap>,
	sectionKey: string,
	sectionDetails: SectionDetails,
	onOff: boolean
) {
	sectionMap.setKey(sectionKey, {
		...sectionDetails,
		isLocked: onOff,
	})
}
