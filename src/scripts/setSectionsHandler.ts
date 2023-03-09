import {
	allSectionsMap,
	isOnContentAtom,
	useSetCurrSection,
	type SectionDetails,
	type FeatureType,
} from '../store/lessonStore'
import useCreateID from '../composables/useCreateID'

const location = window.location.toString()
const sectionHeadings: NodeListOf<HTMLElement> = document.querySelectorAll(
	'article section  h2:first-of-type'
)!
let sections: Array<HTMLElement> = []

for (const heading of sectionHeadings) {
	sections.push(heading.closest('section')!)
}

const getFeatureType = (featureClassName: string): FeatureType | null => {
	if (featureClassName.includes('reflection')) return 'reflection'
	if (featureClassName.includes('practice')) return 'practice'
	if (featureClassName.includes('choice')) return 'choice'
	return null
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

if (sections.length > 0) sections[0].classList.add('firstSection')

sections.forEach((s: HTMLElement, index: number) => {
	const section: SectionDetails = {
		title: s.querySelector('h2')!.textContent!,
		id: useCreateID(s.querySelector('h2')!.textContent!),
		orderNum: index,
		isFeatureType: s.classList.contains('feature')
			? getFeatureType(s.classList.toString())
			: null,
		isLocked: getFirstFeatureAndAllAfter(index),
		isFeatureComplete: s.classList.contains('feature') ? false : null,
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

export { location, sections, sectionHeadings }
