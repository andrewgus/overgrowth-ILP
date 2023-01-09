import { atom, map } from 'nanostores'

// Used for determining if user is on content vs header
const isOnContent = atom(false)

const toggleNavShown = () => {
	isOnContent.set(!isOnContent.get())
}

// Used to set the current section title for the LessonNav
const currSectionTitle = atom('')

const setCurrentLocationTitle = (locationId: string) => {
	const sectionTitle = document
		.getElementById(locationId)
		?.querySelector('h2')?.textContent
	currSectionTitle.set(sectionTitle as string)
}

// Used to create a map for all sections to create LessonNav links
interface SectionMap {
	[key: string]: {
		sectionId: string
		title: string
	}
}
let allSections = map<SectionMap>({})

const setAllSections = (sectionId: string, title: string) => {
	allSections.setKey(sectionId, { sectionId, title })
}

export {
	isOnContent,
	currSectionTitle,
	allSections,
	setAllSections,
	toggleNavShown,
	setCurrentLocationTitle,
}
