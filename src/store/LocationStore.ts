import { atom, map, computed } from 'nanostores'

// Used to determine whether user is on content vs header
const isOnContent = atom(false)

const toggleNavShown = () => {
	isOnContent.set(!isOnContent.get())
}

// Used to set the current section title for the LessonNav
const currSectionTitle = atom('')
const currSectionId = atom('')

const setCurrentLocation = (locationId: string) => {
	const sectionTitle = locationId
		? document.getElementById(locationId)!.querySelector('h2')!.textContent
		: ''
	currSectionTitle.set(sectionTitle as string)
	currSectionId.set(locationId)
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
	toggleNavShown,
	currSectionTitle,
	currSectionId,
	setCurrentLocation,
	allSections,
	setAllSections,
}
