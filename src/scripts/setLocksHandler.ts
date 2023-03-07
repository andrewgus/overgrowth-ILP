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
