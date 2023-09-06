import {
	filteredLockedSectionsComputed,
	filteredNavSectionsComputed,
} from '../store/lessonStore'
import type { SectionsMap } from '../types/SectionTypes'

const toggleSectionDisplay = (
	sections: Readonly<SectionsMap>,
	shouldDisplay: boolean
) => {
	const sectionKeys = Object.keys(sections)
	sectionKeys.forEach((key) => {
		const el = document.getElementById(key)

		if (shouldDisplay) {
			el?.classList.remove('isLocked')
		} else {
			el?.classList.add('isLocked')
		}
	})
}

filteredNavSectionsComputed.subscribe((sections) => {
	toggleSectionDisplay(sections, true)
})

filteredLockedSectionsComputed.subscribe((sections) => {
	toggleSectionDisplay(sections, false)
})

export {}
