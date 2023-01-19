import { useStore } from '@nanostores/vue'
import { contentQuery } from '../store/index.js'

const location = window.location.toString()
const baseURL = location.split('#')[0]

// Setting all section ids and storing sections for LessonNav
const sections: NodeListOf<HTMLElement> =
	document.querySelectorAll('article > section')!

sections.forEach((s: HTMLElement, i: number) => (s.id = `section${i + 1}`))

contentQuery.setAllSections(sections)

if (location.includes('#section')) {
	contentQuery.isOnContent.set(true)
	contentQuery.setCurrSection(location.split('#').at(-1)!)
}

// Observer for header, sections, & headings to update URL hash value w/ scroll
const header: HTMLElement = document.querySelector('header')!
const sectionHeadings: NodeListOf<HTMLElement> = document.querySelectorAll(
	'article > section > h2'
)!

const observerCallbackHeader = function (
	entries: Array<IntersectionObserverEntry>
) {
	const [entry] = entries

	if (!entry.isIntersecting) return

	history.replaceState(null, '', `${baseURL}`)
	// Updating store to toggle LessonNav & set current section id
	if (useStore(contentQuery.isOnContent).value) contentQuery.toggleNavShown()
	contentQuery.setCurrSection('')
}

const observerCallbackHeadings = function (
	entries: Array<IntersectionObserverEntry>
) {
	const [entry] = entries

	if (!entry.isIntersecting) return

	history.replaceState(null, '', `${baseURL}#${entry.target.parentElement!.id}`)
	// Updating store to toggle LessonNav & set current section id
	if (!useStore(contentQuery.isOnContent).value) contentQuery.toggleNavShown()
	contentQuery.setCurrSection(entry.target.parentElement!.id)
}

const observerCallbackSections = function (
	entries: Array<IntersectionObserverEntry>
) {
	const [entry] = entries

	if (!entry.isIntersecting) return

	// Only fires when scrolling up
	if (entry.intersectionRect.top === 0) {
		history.replaceState(null, '', `${baseURL}#${entry.target.id}`)
		//setting current section id
		contentQuery.setCurrSection(entry.target.id)
	}
}

const observerOptionsHeader = {
	root: null,
	threshold: 0.5,
}
const observerOptionsHeadings = {
	root: null,
	threshold: 1,
	rootMargin: '0px 0px -75% 0px',
}
const observerOptionsSections = {
	root: null,
	threshold: 0.1,
}

const observerHeader = new IntersectionObserver(
	observerCallbackHeader,
	observerOptionsHeader
)
const observerHeadings = new IntersectionObserver(
	observerCallbackHeadings,
	observerOptionsHeadings
)
const observerSections = new IntersectionObserver(
	observerCallbackSections,
	observerOptionsSections
)

observerHeader.observe(header)
sectionHeadings.forEach((heading) => observerHeadings.observe(heading))
sections.forEach((section) => observerSections.observe(section))

export {}
