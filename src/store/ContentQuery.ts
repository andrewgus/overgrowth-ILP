import { atom, map, computed } from 'nanostores'

// Used to determine whether user is on content vs header
const isOnContent = atom(false)

const toggleNavShown = () => {
	isOnContent.set(!isOnContent.get())
}

// Used to set the current section title for the LessonNav
const currSectionTitle = atom('')
const currSectionId = atom(0)

const setCurrSection = (sectionId: string) => {
	const sectionTitle = sectionId
		? document.getElementById(sectionId)!.querySelector('h2')!.textContent
		: ''

	const sectionNum = Number(sectionId.split('n').at(-1))

	currSectionTitle.set(sectionTitle as string)
	currSectionId.set(sectionNum)
}

// Used to create a map for all sections to create LessonNav links
interface allSectionsMap {
	[key: string]: {
		sectionId: string
		title: string
	}
}
let allSections = map<allSectionsMap>({})

const setAllSections = (sectionId: string, title: string) => {
	allSections.setKey(sectionId, { sectionId, title })
}

export {
	isOnContent,
	toggleNavShown,
	currSectionTitle,
	currSectionId,
	setCurrSection,
	allSections,
	setAllSections,
}
