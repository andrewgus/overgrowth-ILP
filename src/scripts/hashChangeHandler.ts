import { useStore } from '@nanostores/vue'
import { contentQuery } from '../store/index.js'

const location = window.location.toString()
const baseURL = location.split('#')[0]
const header: HTMLElement = document.querySelector('header')!
const sections: NodeListOf<HTMLElement> =
	document.querySelectorAll('article > section')!

sections.forEach((s: HTMLElement, i: number) => (s.id = `section${i + 1}`))

contentQuery.setAllSections(sections)

if (location.includes('#section')) contentQuery.isOnContent.set(true)

// Observer for Header & sections to update URL hash value w/ scroll

const observerCallback = function (entries: Array<IntersectionObserverEntry>) {
	const [entry] = entries

	/*  TODO:  
				Within this observer callback,

				1. only fires when isIntersecting boolean changes.

				I want this for scrolling Up. Change as soon as the items intersects.

				For scrolling down, I want to watch the H2 of a given section and when boundingRect.top is approx 0, then change as well.
	
	*/

	// if (!entry.isIntersecting) return
	console.log(entry)

	if (entry.target.nodeName === 'SECTION') {
		history.replaceState(null, '', `${baseURL}#${entry.target.id}`)
		// Also updating store to toggle LessonNav
		if (!useStore(contentQuery.isOnContent).value) contentQuery.toggleNavShown()
		contentQuery.setCurrSection(entry.target.id)
	}

	if (entry.target.nodeName === 'HEADER') {
		history.replaceState(null, '', `${baseURL}`)
		// Also updating store to toggle LessonNav
		if (useStore(contentQuery.isOnContent).value) contentQuery.toggleNavShown()
		contentQuery.setCurrSection('')
	}
}
const observerOptions = {
	root: null,
	threshold: 0.4,
	// rootMargin: '0px 0px -50% 0px',
}
const observer = new IntersectionObserver(observerCallback, observerOptions)

sections.forEach((section) => observer.observe(section))

observer.observe(header)

export {}
