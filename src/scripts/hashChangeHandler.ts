const sections: NodeListOf<HTMLElement> =
	document.querySelectorAll('article > section')

sections.forEach((s: HTMLElement, i: number) => (s.id = `section${i + 1}`))

const obsSections = document.querySelectorAll('article > section')!
const obsHeader = document.querySelector('header')!

const obsCallback = function (entries: any) {
	const [entry] = entries

	if (!entry.isIntersecting) return

	const location = window.location.toString().split('#')[0]

	if (entry.target.nodeName === 'SECTION')
		history.replaceState(null, '', `${location}#${entry.target.id}`)

	if (entry.target.nodeName === 'HEADER')
		history.replaceState(null, '', `${location}`)
}

const obsOptions = {
	root: null,
	threshold: 0.8,
}

const observer = new IntersectionObserver(obsCallback, obsOptions)

obsSections.forEach((s) => observer.observe(s))
observer.observe(obsHeader)

export {}
