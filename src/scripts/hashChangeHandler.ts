import {
	location,
	sectionHeadings,
	sections,
} from '../scripts/setSectionsHandler.js'
import {
	isOnContentAtom,
	useSetCurrSection,
	useToggleNavShown,
} from '../store/lessonStore'

const baseURL = location.split('#')[0]

const header: HTMLElement = document.querySelector('header')!

// Observer for header, sections, & headings to update URL hash value w/ scroll
const observerCallbackHeader = function (
	entries: Array<IntersectionObserverEntry>
) {
	const [entry] = entries
	if (!entry.isIntersecting) return
	history.replaceState(null, '', `${baseURL}`)
	// Updating store to toggle LessonNav & set current section id
	if (isOnContentAtom.get()) useToggleNavShown()
	useSetCurrSection('')
}

const observerCallbackHeadings = function (
	entries: Array<IntersectionObserverEntry>
) {
	const [entry] = entries
	if (!entry.isIntersecting) return
	history.replaceState(
		null,
		'',
		`${baseURL}#${entry.target.closest('.section')!.id}`
	)
	// Updating store to toggle LessonNav & set current section id
	if (!isOnContentAtom.get()) useToggleNavShown()
	useSetCurrSection(entry.target.closest('.section')!.id)
}

const observerCallbackSections = function (
	entries: Array<IntersectionObserverEntry>
) {
	const [entry] = entries
	const entrySection = entry.target.closest('article.section')!

	if (!entry.isIntersecting) return
	// Only fires when scrolling up
	if (entry.intersectionRect.top <= 360) {
		console.log(entry.target)
		console.log(entry.rootBounds)
		console.log(entrySection)
		history.replaceState(null, '', `${baseURL}#${entrySection.id}`)
		//setting current section id
		useSetCurrSection(entrySection.id)
	}
}

const observerOptionsHeader = {
	root: null,
	threshold: 0.5,
}
const observerOptionsHeadings = {
	root: null,
	threshold: 1,
	rootMargin: '0px 0px -68% 0px',
}
const observerOptionsSections = {
	root: null,
	threshold: 0.1,
	rootMargin: '-360px 0px 0px 0px',
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
sections.forEach((section) =>
	observerSections.observe(section.lastElementChild!)
)

export {}
