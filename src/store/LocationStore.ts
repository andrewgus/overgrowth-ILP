import { atom } from 'nanostores'

const isOnContent = atom(false)
const contentTitle = atom('')

const toggleNavShown = () => {
	isOnContent.set(!isOnContent.get())
}
const setCurrentLocationTitle = (locationId: string) => {
	const sectionTitle = document
		.getElementById(locationId)
		?.querySelector('h2')?.textContent
	contentTitle.set(sectionTitle as string)
}

export { isOnContent, contentTitle, toggleNavShown, setCurrentLocationTitle }
