import {
	filteredLockedSectionsComputed,
	filteredNavSectionsComputed,
} from '../store/NavigationStore'
import type { SectionsMap } from '../store/NavigationStore'

const toggleSectionDisplay = (
	sections: Readonly<SectionsMap>,
	shouldDisplay: boolean
) => {
	const sectionKeys = Object.keys(sections)
	sectionKeys.forEach((key) => {
		const el = document.getElementById(key)

		if (shouldDisplay) {
			el?.classList.add('isLocked')
		} else {
			el?.classList.remove('isLocked')
		}
	})
}

filteredLockedSectionsComputed.subscribe((sections) => {
	toggleSectionDisplay(sections, true)
})
filteredNavSectionsComputed.subscribe((sections) => {
	toggleSectionDisplay(sections, false)
})

export {}
