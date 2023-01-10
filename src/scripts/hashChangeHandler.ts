import { useStore } from '@nanostores/vue'
import { contentQuery } from '../store/index.js'

const sections: NodeListOf<HTMLElement> =
	document.querySelectorAll('article > section')

sections.forEach((s: HTMLElement, i: number) => (s.id = `section${i + 1}`))

// Sending all sections and their associated ID to store for LessonNav
let titles: string[] = []
let sectionIds: string[] = []
sections.forEach((s: HTMLElement) => {
	titles.push(s.querySelector('h2')!.textContent!)
	sectionIds.push(s.id)
})
for (const [i, sectionId] of sectionIds.entries()) {
	contentQuery.setAllSections(sectionId, titles[i])
}

const location = window.location.toString()
const baseURL = location.split('#')[0]

if (location.includes('#section')) contentQuery.isOnContent.set(true)

// Observer for Header & sections to update URL hash value w/ scroll
const obsSections: NodeListOf<HTMLElement> =
	document.querySelectorAll('article > section')!
const obsHeader: HTMLElement = document.querySelector('header')!

const obsCallback = function (entries: any) {
	const [entry] = entries
	if (!entry.isIntersecting) return

	if (entry.target.nodeName === 'SECTION') {
		history.replaceState(null, '', `${baseURL}#${entry.target.id}`)
		// Also updating store to toggle LessonNav
		if (!useStore(contentQuery.isOnContent).value) contentQuery.toggleNavShown()
		contentQuery.setCurrentLocationTitle(entry.target.id)
	}

	if (entry.target.nodeName === 'HEADER') {
		history.replaceState(null, '', `${baseURL}`)
		// Also updating store to toggle LessonNav
		if (useStore(contentQuery.isOnContent).value) contentQuery.toggleNavShown()
		contentQuery.setCurrentLocationTitle('')
	}
}
const obsOptions = {
	root: null,
	threshold: 0,
	rootMargin: '0px 0px -90% 0px',
}
const observer = new IntersectionObserver(obsCallback, obsOptions)

obsSections.forEach((section) => observer.observe(section))

observer.observe(obsHeader)

export {}
