import {
	filteredLockedSectionsComputed,
	filteredNavSectionsComputed,
	type SectionsMap,
} from '../store/lessonStore'

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
