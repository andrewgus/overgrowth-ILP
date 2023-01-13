import type { WritableAtom } from 'nanostores'
import { atom } from 'nanostores'

// Used to determine whether user is on content vs header
const isOnContent = atom(false)

const toggleNavShown = () => {
	isOnContent.set(!isOnContent.get())
}

// Used to set the current section title for the LessonNav
const currSectionTitle = atom('')
const currSectionIdNum = atom(0)

const setCurrSection = (sectionId: string) => {
	const sectionTitle = sectionId
		? document.getElementById(sectionId)!.querySelector('h2')!.textContent
		: ''

	const sectionNum = Number(sectionId.split('n').at(-1))

	currSectionTitle.set(sectionTitle as string)
	currSectionIdNum.set(sectionNum)
}

const allSections: WritableAtom<NodeListOf<HTMLElement>> = atom([])

const setAllSections = (sections: NodeListOf<HTMLElement>) => {
	allSections.set(sections)
}

export {
	isOnContent,
	toggleNavShown,
	currSectionTitle,
	currSectionIdNum,
	setCurrSection,
	allSections,
	setAllSections,
}
