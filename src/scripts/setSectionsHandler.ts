import {
	isOnContentAtom,
	allSectionsMap,
	useSetCurrSection,
} from '../store/NavigationStore'
import type { SectionDetails } from '../store/NavigationStore'
import type { FeatureType } from '../store/FeatureSettingsStore'

const location = window.location.toString()
const sectionHeadings: NodeListOf<HTMLElement> = document.querySelectorAll(
	'article section  h2:first-of-type'
)!
let sections: Array<HTMLElement> = []

for (const heading of sectionHeadings) {
	sections.push(heading.closest('section')!)
}

const createID = (title: string) =>
	`${title
		.replaceAll(/[^\w\s]/g, '')
		.replaceAll(' ', '-')
		.substring(0, 25)
		.toLowerCase()}`

const getFeatureType = (featureClassName: string): boolean | FeatureType => {
	if (featureClassName.includes('reflection')) return 'reflection'
	if (featureClassName.includes('practice')) return 'practice'
	if (featureClassName.includes('choice')) return 'choice'
	return false
}

const getFirstFeatureAndAllAfter = (sectionIndex: number) => {
	const firstFeatureIndex = sections.findIndex((s) =>
		s.classList.contains('feature')
	)
	if (firstFeatureIndex === -1) {
		return false
	} else if (sectionIndex > firstFeatureIndex) {
		// Any section that comes after the first feature to exist is locked
		return true
	} else {
		return false
	}
}

if (sections) sections[0].classList.add('firstSection')

sections.forEach((s: HTMLElement, index: number) => {
	const section: SectionDetails = {
		title: s.querySelector('h2')!.textContent!,
		id: createID(s.querySelector('h2')!.textContent!),
		orderNum: index,
		isFeatureType:
			s.classList.contains('feature') && getFeatureType(s.classList.toString()),
		isLocked: getFirstFeatureAndAllAfter(index),
	}

	allSectionsMap.setKey(createID(s.querySelector('h2')!.textContent!), section)

	s.id = allSectionsMap.get()[createID(s.querySelector('h2')!.textContent!)].id
})

if (location.includes('#')) {
	isOnContentAtom.set(true)
	useSetCurrSection(location.split('#').at(-1)!)
	// TODO: if user attempts to access # that is hidden because it is locked, send them to the landing page with alert that that content is locked.
}

export { location, sections, sectionHeadings }
