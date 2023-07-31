import {
	lessonIDAtom,
	allSectionsMap,
	isOnContentAtom,
	useSetNextIncompleteActivity,
	useSetCurrSection,
	useUnlockNextSectionsAfterCompletion,
	type SectionDetails,
	type ActivityType,
} from '../store/lessonStore'
import createID from '../composables/useCreateID'
import getLocalStorage from '../composables/useGetLocalStorage'

// setting lessonID for localStorage
lessonIDAtom.set(document.querySelector('body')!.id)

const location = window.location.toString()

const sections: HTMLElement[] = []
const sectionIDs: string[] = []
const sectionHeadings: NodeListOf<HTMLElement> = document.querySelectorAll(
	'article  h2:first-of-type'
)!

for (const heading of sectionHeadings) {
	sections.push(heading.closest('article')!)
	sectionIDs.push(createID(heading.textContent!))
}

// Functions to be used for creating allSectionsMap
// To set activityType property
const getActivityType = (
	activityClasses: DOMTokenList
): ActivityType | null => {
	if (activityClasses.contains('reflection')) return 'reflection'
	if (activityClasses.contains('practice')) return 'practice'
	if (activityClasses.contains('choice')) return 'choice'
	return null
}
// To set isLocked property
const getFirstActivityAndAllAfter = (sectionIndex: number) => {
	const firstActivityIndex = sections.findIndex((s) =>
		s.classList.contains('activity')
	)
	if (firstActivityIndex === -1) {
		// No activities in lesson
		return false
	} else if (sectionIndex > firstActivityIndex) {
		// Any section that comes after the first activity to exist is locked
		return true
	} else {
		// Activity is first section
		return false
	}
}
// To set isActivityComplete property
const isPreviouslyComplete = (
	id: string,
	section: HTMLElement
): boolean | null => {
	if (!!getLocalStorage(id, 'isActivityComplete')) {
		return getLocalStorage(id, 'isActivityComplete') as boolean
	} else {
		return section.classList.contains('activity') ? false : null
	}
}

if (sections.length > 0) sections[0].classList.add('firstSection')

sections.forEach((section: HTMLElement, index: number) => {
	section.id = sectionIDs[index]

	const sectionDetails: SectionDetails = {
		title: sectionHeadings[index].textContent!,
		id: sectionIDs[index],
		orderNum: index,
		activityType: section.classList.contains('activity')
			? getActivityType(section.classList)
			: null,
		isLocked: getFirstActivityAndAllAfter(index),
		// isLocked is whether to show it or not
		isActivityComplete: isPreviouslyComplete(sectionIDs[index], section),
		// isActivityComplete is used to determine the NEXT activity and unlock everything up until, and including, that next activity
	}

	allSectionsMap.setKey(sectionIDs[index], sectionDetails)
})

// Setting the next activity to complete, whether there is saved data or not
const SectionDetailValues = Object.values(allSectionsMap.get())
const findNextIncompleteActivity = SectionDetailValues.find((details) => {
	return (
		details.activityType !== null &&
		!getLocalStorage(details.id, 'isActivityComplete')
	)
})

if (findNextIncompleteActivity) {
	// If there is a nextIncompleteActivity, set that to nextIncompleteActivityMap and unlock everything up until, and including, that next activity.
	useSetNextIncompleteActivity(findNextIncompleteActivity.id)
	useUnlockNextSectionsAfterCompletion(true)
} else {
	// If there are no more incomplete activities, then everything should be unlocked
	SectionDetailValues.forEach((section) => {
		section.isLocked = false
	})
}

// Setting whether on content or not && currSection
if (location.includes('#')) {
	isOnContentAtom.set(true)
	useSetCurrSection(location.split('#').at(-1)!)
}

export { location, sections, sectionHeadings }
