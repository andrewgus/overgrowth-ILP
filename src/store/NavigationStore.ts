import { atom, map } from 'nanostores'

// All sections
export interface SectionDetails {
	title: string
	id: string
	orderNum: number
	isLocked: boolean
}

interface SectionsMap {
	[sectionKey: string]: SectionDetails
}

const allSectionsMap = map<SectionsMap>()

// Used to determine whether user is on content vs header
const isOnContent = atom(false)

const toggleNavShown = () => {
	isOnContent.set(!isOnContent.get())
}

// Used to set the current section title for the LessonNav
const currSectionTitle = atom('')
const currSectionId = atom('')

const setCurrSection = (sectionKey: string) => {
	if (sectionKey === '') {
		currSectionTitle.set('')
		currSectionId.set('')
	} else {
		const sectionTitle = allSectionsMap.get()[sectionKey].title
		currSectionTitle.set(sectionTitle)
		currSectionId.set(sectionKey)
	}
}

export {
	isOnContent,
	toggleNavShown,
	currSectionTitle,
	currSectionId,
	setCurrSection,
	allSectionsMap,
}
