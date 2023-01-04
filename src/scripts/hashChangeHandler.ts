const sections: NodeListOf<HTMLElement> =
	document.querySelectorAll('article > section')

sections.forEach((s: HTMLElement, i: number) => (s.id = `section${i + 1}`))

const obsSections = document.querySelectorAll('article > section > h2')!
const obsHeader = document.querySelector('header')!

const obsCallback = function (entries: any) {
	const [entry] = entries

	if (!entry.isIntersecting) return

	const location = window.location.toString().split('#')[0]

	if (entry.target.nodeName === 'H2') {
		document.getElementById('lessonNav')!.style.display = 'block'
		history.replaceState(null, '', `${location}#${entry.target.id}`)
	}

	if (entry.target.nodeName === 'HEADER') {
		document.getElementById('lessonNav')!.style.display = 'none'
		history.replaceState(null, '', `${location}`)
	}
}

const obsOptions = {
	root: null,
	threshold: 1,
}

const observer = new IntersectionObserver(obsCallback, obsOptions)

obsSections.forEach((s) => observer.observe(s))
observer.observe(obsHeader)

export {}
