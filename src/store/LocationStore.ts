import { atom, map } from 'nanostores'

const isOnContent = atom(false)

const toggleNavShown = () => {
	isOnContent.set(!isOnContent.get())
}

const contentTitle = atom('')

const setCurrentLocationTitle = (locationId: string) => {
	const sectionTitle = document
		.getElementById(locationId)
		?.querySelector('h2')?.textContent
	contentTitle.set(sectionTitle as string)
}

// TODO: WORK OUT BUGS BELOW
export interface SectionMap {
	id?: {
		sectionId: string
		title: string
	}
}

let allSections = map<SectionMap>({})

const setAllSections = (
	id: keyof SectionMap,
	sectionId: string,
	title: string
) => {
	allSections.setKey(id, { sectionId, title })
}

export {
	isOnContent,
	contentTitle,
	allSections,
	setAllSections,
	toggleNavShown,
	setCurrentLocationTitle,
}
