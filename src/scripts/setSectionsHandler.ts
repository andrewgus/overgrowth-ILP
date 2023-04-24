import {
	allSectionsMap,
	isOnContentAtom,
	useSetNextActiveFeature,
	useSetCurrSection,
	type SectionDetails,
	type FeatureType,
} from '../store/lessonStore'
import createID from '../composables/useCreateID'
import getLocalStorage from '../service/useGetLocalStorage'

const location = window.location.toString()

const sections: Array<HTMLElement> = []
const sectionHeadings: NodeListOf<HTMLElement> = document.querySelectorAll(
	'article section  h2:first-of-type'
)!
const sectionIDs: string[] = []

for (const heading of sectionHeadings) {
	sections.push(heading.closest('section')!)
	sectionIDs.push(createID(heading.textContent!))
}

console.log(getLocalStorage(sectionIDs[0], 'isFeatureComplete'))

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
		title: sectionHeadings[index].textContent!,
		id: sectionIDs[index],
		orderNum: index,
		featureType: s.classList.contains('feature')
			? getFeatureType(s.classList.toString())
			: null,
		isLocked: getFirstFeatureAndAllAfter(index),
		isFeatureComplete: s.classList.contains('feature') ? false : null,
	}

	allSectionsMap.setKey(sectionIDs[index], section)

	s.id = sectionIDs[index]
})

const firstAvailableFeature = sections.find((s) => {
	return s.classList.contains('feature')
})
if (firstAvailableFeature) {
	useSetNextActiveFeature(firstAvailableFeature.id)
}

if (location.includes('#')) {
	isOnContentAtom.set(true)
	useSetCurrSection(location.split('#').at(-1)!)
}

export { location, sections, sectionHeadings }
