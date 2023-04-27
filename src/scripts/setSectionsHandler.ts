import {
	lessonID,
	allSectionsMap,
	isOnContentAtom,
	useSetNextIncompleteFeature,
	useSetCurrSection,
	useUnlockNextSectionsAfterCompletion,
	type SectionDetails,
	type FeatureType,
} from '../store/lessonStore'
import createID from '../composables/useCreateID'
import getLocalStorage from '../composables/useGetLocalStorage'

// setting lessonID for localStorage
lessonID.set(document.querySelector('main')!.id)

const location = window.location.toString()

const sections: HTMLElement[] = []
const sectionIDs: string[] = []
const sectionHeadings: NodeListOf<HTMLElement> = document.querySelectorAll(
	'article section  h2:first-of-type'
)!

for (const heading of sectionHeadings) {
	sections.push(heading.closest('section')!)
	sectionIDs.push(createID(heading.textContent!))
}

// Functions to be used for creating allSectionsMap
// To set featureType property
const getFeatureType = (featureClassName: string): FeatureType | null => {
	if (featureClassName.includes('reflection')) return 'reflection'
	if (featureClassName.includes('practice')) return 'practice'
	if (featureClassName.includes('choice')) return 'choice'
	return null
}
// To set isLocked property
const getFirstFeatureAndAllAfter = (sectionIndex: number) => {
	const firstFeatureIndex = sections.findIndex((s) =>
		s.classList.contains('feature')
	)
	if (firstFeatureIndex === -1) {
		// No features in lesson
		return false
	} else if (sectionIndex > firstFeatureIndex) {
		// Any section that comes after the first feature to exist is locked
		return true
	} else {
		// Feature is first section
		return false
	}
}
// To set isFeatureComplete property
const isPreviouslyComplete = (
	id: string,
	section: HTMLElement
): boolean | null => {
	if (!!getLocalStorage(id, 'isFeatureComplete')) {
		return getLocalStorage(id, 'isFeatureComplete') as boolean
	} else {
		return section.classList.contains('feature') ? false : null
	}
}

if (sections.length > 0) sections[0].classList.add('firstSection')

sections.forEach((section: HTMLElement, index: number) => {
	section.id = sectionIDs[index]

	const sectionDetails: SectionDetails = {
		title: sectionHeadings[index].textContent!,
		id: sectionIDs[index],
		orderNum: index,
		featureType: section.classList.contains('feature')
			? getFeatureType(section.classList.toString())
			: null,
		isLocked: getFirstFeatureAndAllAfter(index),
		isFeatureComplete: isPreviouslyComplete(sectionIDs[index], section),
	}

	allSectionsMap.setKey(sectionIDs[index], sectionDetails)
})

// Setting the next feature to complete, whether there is saved data or not
const SectionDetailValues = Object.values(allSectionsMap.get())
const findNextIncompleteFeature = SectionDetailValues.find((details) => {
	return (
		(!!!getLocalStorage(details.id, 'isFeatureComplete') as boolean) &&
		details.featureType !== null
	)
})
if (findNextIncompleteFeature) {
	useSetNextIncompleteFeature(findNextIncompleteFeature.id)
	useUnlockNextSectionsAfterCompletion(true)
}

// Setting whether on content or not && currSection
if (location.includes('#')) {
	isOnContentAtom.set(true)
	useSetCurrSection(location.split('#').at(-1)!)
}

export { location, sections, sectionHeadings }
