import { useStore } from '@nanostores/vue'

import { contentQuery } from '../store/index.js'

const sections: NodeListOf<HTMLElement> =
	document.querySelectorAll('article > section')

sections.forEach((s: HTMLElement, i: number) => (s.id = `section${i + 1}`))

let titles: string[] = []
let sectionIds: string[] = []
sections.forEach((s: HTMLElement) => {
	titles.push(s.querySelector('h2')!.textContent!)
	sectionIds.push(s.id)
})

for (const [i, section] of sectionIds.entries()) {
	contentQuery.setAllSections(section, titles[i])
}
// send this (above lines 10-15) to LocationStore

const obsSections: NodeListOf<HTMLElement> =
	document.querySelectorAll('article > section')!
const obsHeader: HTMLElement = document.querySelector('header')!

const obsCallback = function (entries: any) {
	const [entry] = entries

	if (!entry.isIntersecting) return

	const location = window.location.toString().split('#')[0]

	if (entry.target.nodeName === 'SECTION') {
		if (!useStore(contentQuery.isOnContent).value) contentQuery.toggleNavShown()
		history.replaceState(null, '', `${location}#${entry.target.id}`)
		contentQuery.setCurrentLocationTitle(entry.target.id)
	}

	if (entry.target.nodeName === 'HEADER') {
		if (useStore(contentQuery.isOnContent).value) contentQuery.toggleNavShown()
		history.replaceState(null, '', `${location}`)
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
