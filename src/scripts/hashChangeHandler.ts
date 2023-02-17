import {
	isOnContentAtom,
	allSectionsMap,
	useSetCurrSection,
	useToggleNavShown,
} from '../store/NavigationStore'
import type { SectionDetails } from '../store/NavigationStore'
import useCreateID from '../composables/useCreateId'
import useGetFeatureType from '../composables/useGetFeatureType'

const location = window.location.toString()
const baseURL = location.split('#')[0]

const header: HTMLElement = document.querySelector('header')!
const sectionHeadings: NodeListOf<HTMLElement> = document.querySelectorAll(
	'article section  h2:first-of-type'
)!
let sections: Array<HTMLElement> = []

// Setting all section ids and storing sections
for (const heading of sectionHeadings) {
	sections.push(heading.closest('section')!)
}

sections.forEach((s: HTMLElement, i: number) => {
	const section: SectionDetails = {
		title: s.querySelector('h2')!.textContent!,
		id: useCreateID(s.querySelector('h2')!.textContent!),
		orderNum: i,
		isFeatureType:
			s.classList.contains('feature') &&
			useGetFeatureType(s.classList.toString()),
		isLocked: true,
	}

	allSectionsMap.setKey(
		useCreateID(s.querySelector('h2')!.textContent!),
		section
	)

	s.id =
		allSectionsMap.get()[useCreateID(s.querySelector('h2')!.textContent!)].id
})

if (location.includes('#')) {
	isOnContentAtom.set(true)
	useSetCurrSection(location.split('#').at(-1)!)
}

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
		`${baseURL}#${entry.target.closest('section')!.id}`
	)
	// Updating store to toggle LessonNav & set current section id
	if (!isOnContentAtom.get()) useToggleNavShown()

	useSetCurrSection(entry.target.closest('section')!.id)
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
		useSetCurrSection(entry.target.id)
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
	threshold: 0.33,
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
