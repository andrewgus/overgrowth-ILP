// lessonStore maintains the state of the lesson interface.
import { atom, map, deepMap, computed, type MapStore } from 'nanostores'
import type { ActivityType, ActivitiesMap } from '../types/ActivityTypes'
import type { SectionDetails, SectionsMap } from '../types/SectionTypes'

// ID for the whole lesson.
const lessonIDAtom = atom<string>('')

// Activity setup for any given lesson
const activitiesMap = map<ActivitiesMap>({})
// if activity layout is used in lesson, activate it
const useDoesActivityExist = (activity: ActivityType) => {
	activitiesMap.setKey(activity, true)
}

// All sections
const allSectionsMap = deepMap<SectionsMap>()

// To determine whether user is on content vs header
const isOnContentAtom = atom(false)
const useToggleNavShown = () => {
	isOnContentAtom.set(!isOnContentAtom.get())
}

// currSectionMap contains the details of the section the user is currently viewing
const currSectionMap = map<SectionDetails>()
// nextIncompleteActivityMap contains the details of the next activity that is incomplete
const nextIncompleteActivityMap = map<SectionDetails | {}>()

const doesNextIncompleteActivityExist = () =>
	Object.keys(nextIncompleteActivityMap.get()).length > 0

// To determine current section & nextIncompleteActivity
const useSetCurrSection = (sectionKey: string) => {
	setSectionMap(currSectionMap, sectionKey)
}
const useSetNextIncompleteActivity = (sectionKey?: string) => {
	if (sectionKey) {
		setSectionMap(
			nextIncompleteActivityMap as MapStore<SectionDetails>,
			sectionKey
		)
	} else {
		nextIncompleteActivityMap.set({})
	}
}
const setSectionMap = (map: MapStore<SectionDetails>, sectionKey: string) => {
	if (sectionKey !== '') {
		map.set(allSectionsMap.get()[sectionKey])
	} else {
		map.setKey('id', '')
		map.setKey('title', '')
		map.setKey('orderNum', null)
		map.setKey('activityType', null)
		map.setKey('isLocked', false)
	}
}

// set & find functions for user nav based on user input.
const setSectionsToArray = (
	sectionMap: SectionsMap
): [string, SectionDetails][] => {
	return Object.entries(sectionMap)
}

const setSectionToLocked = (
	sectionKey: string,
	sectionDetails: SectionDetails,
	onOff: boolean
) => {
	allSectionsMap.setKey(sectionKey, {
		...sectionDetails,
		isLocked: onOff,
	})
}
const findNextIncompleteActivity = (
	sectionsArray: [string, SectionDetails][]
) => {
	const next = sectionsArray.find(([_, sectionDetails]) => {
		return (
			// it is a activity && the activity is on && the activity is not complete
			sectionDetails.activityType !== null &&
			activitiesMap.get()[sectionDetails.activityType as ActivityType] &&
			!sectionDetails.isActivityComplete
		)
	})
	setNextIncompleteActivityIfFound(next)
	return next
}

const setNextIncompleteActivityIfFound = (
	nextIncompleteSection: [string, SectionDetails] | undefined
) => {
	if (nextIncompleteSection) {
		useSetNextIncompleteActivity(nextIncompleteSection[0])
	} else {
		useSetNextIncompleteActivity()
	}
}

// To toggle activity on/off
const useToggleActivity = (activity: ActivityType) => {
	activitiesMap.setKey(activity, !activitiesMap.get()[activity])
	// updating allSections isLocked
	const isActivityOn = activitiesMap.get()[activity]
	const allSectionsAsArray = setSectionsToArray(allSectionsMap.get())

	// find the next available active activity
	findNextIncompleteActivity(allSectionsAsArray)

	if (!doesNextIncompleteActivityExist()) {
		// all activities are turned off...
		allSectionsAsArray.forEach(([sectionKey, sectionDetails]) => {
			// make sure all incomplete activities are isLocked: true
			if (
				sectionDetails.activityType !== null &&
				!sectionDetails.isActivityComplete
			) {
				setSectionToLocked(sectionKey, sectionDetails, true)
			}
			// unlock all static content
			if (sectionDetails.activityType === null) {
				setSectionToLocked(sectionKey, sectionDetails, false)
			}
		})
	} else {
		const nextIncompleteActivity =
			nextIncompleteActivityMap.get() as SectionDetails
		// a nextIncompleteActivity exists...
		if (!isActivityOn) {
			// and user deactivates selected activity...
			allSectionsAsArray.forEach(([sectionKey, sectionDetails]) => {
				// lock any matching activity that is not completed
				if (
					sectionDetails.activityType === activity &&
					!sectionDetails.isActivityComplete
				) {
					setSectionToLocked(sectionKey, sectionDetails, true)
				}
				// and unlock any succeeding static content up until, and including, the nextIncompleteActivity..
				if (
					(sectionDetails.activityType === null &&
						sectionDetails.orderNum! < nextIncompleteActivity.orderNum!) ||
					sectionDetails.orderNum === nextIncompleteActivity.orderNum!
				) {
					setSectionToLocked(sectionKey, sectionDetails, false)
				}
			})
		} else if (isActivityOn) {
			// and user reactivates selected activity...
			allSectionsAsArray.forEach(([sectionKey, sectionDetails]) => {
				// lock all suceeding sections
				if (sectionDetails.orderNum! > nextIncompleteActivity.orderNum!) {
					setSectionToLocked(sectionKey, sectionDetails, true)
				}
				// unlock the selected activity
				if (sectionDetails.orderNum === nextIncompleteActivity.orderNum) {
					setSectionToLocked(sectionKey, sectionDetails, false)
				}
			})
		}
	}
}

// To Determine what comes after a completed activity and revealing it
const useUnlockNextSectionsAfterCompletion = (fromLocalStorage?: boolean) => {
	const allSectionsAsArray = setSectionsToArray(allSectionsMap.get())

	const foundNextIncompleteActivity = fromLocalStorage
		? nextIncompleteActivityMap.get()
		: findNextIncompleteActivity(allSectionsAsArray)

	// if there is a next active activity
	if (foundNextIncompleteActivity !== undefined) {
		const nextIncomplete = nextIncompleteActivityMap.get() as SectionDetails
		// Unlock all activities up until, and including, the nextIncompleteActivity
		allSectionsAsArray.forEach(([sectionKey, sectionDetails]) => {
			if (sectionDetails.orderNum! <= nextIncomplete.orderNum!) {
				setSectionToLocked(sectionKey, sectionDetails, false)
			}
		})
	} else {
		allSectionsAsArray.forEach(([sectionKey, sectionDetails]) => {
			// Unlock everything
			setSectionToLocked(sectionKey, sectionDetails, false)
		})
	}
}

// To set a activity as complete & unlock next sections up until nextIncompleteActivity
const useSetActivityComplete = () => {
	// marking activity as complete
	currSectionMap.setKey('isActivityComplete', true)
	allSectionsMap.setKey(currSectionMap.get().id, {
		...currSectionMap.get(),
	})
	useUnlockNextSectionsAfterCompletion()
}

// filtering for sections that should be visible and navigable
const filteredNavSectionsComputed = computed(
	[allSectionsMap, activitiesMap],
	(allSections) => {
		const allSectionsAsArray = setSectionsToArray(allSections)

		const filterForUnlocked = allSectionsAsArray.filter(
			([_, sectionDetails]) => {
				if (doesNextIncompleteActivityExist()) {
					const nextIncomplete =
						nextIncompleteActivityMap.get() as SectionDetails
					// if there is a nextIncompleteActivity...
					// (unlocked AND static content) OR (an unlocked, completed activity that comes before nextIncompleteActivity) OR the nextIncompleteActivity
					return (
						(sectionDetails.activityType === null &&
							!sectionDetails.isLocked) ||
						(!sectionDetails.isLocked &&
							sectionDetails.isActivityComplete &&
							sectionDetails.orderNum! < nextIncomplete.orderNum!) ||
						sectionDetails.orderNum! === nextIncomplete.orderNum!
					)
				} else {
					// else there is NOT a nextIncompleteActivity...
					// any static content OR (activity is complete and not locked)
					return (
						sectionDetails.activityType === null ||
						(sectionDetails.isActivityComplete && !sectionDetails.isLocked)
					)
				}
			}
		)
		return Object.fromEntries(filterForUnlocked)
	}
)
// filtering for sections that should be locked & invisible
const filteredLockedSectionsComputed = computed(
	allSectionsMap,
	(allSections) => {
		const allSectionsAsArray = setSectionsToArray(allSections)

		const filterForLocked = allSectionsAsArray.filter(([_, sectionDetails]) => {
			return sectionDetails.isLocked
		})
		return Object.fromEntries(filterForLocked)
	}
)
// Finding the next & previous section based on the current section
const findSectionID = (
	sections: SectionsMap,
	currSection: SectionDetails,
	isNext: boolean
) => {
	const filteredNavAsArray = setSectionsToArray(sections)
	let findSectionID: [string, SectionDetails] | undefined
	if (isNext) {
		findSectionID = filteredNavAsArray.find(([_, sectionDetails]) => {
			return (
				!sectionDetails.isLocked &&
				sectionDetails.orderNum! > currSection.orderNum!
			)
		})
	} else {
		findSectionID = filteredNavAsArray.findLast(([_, sectionDetails]) => {
			return (
				!sectionDetails.isLocked &&
				sectionDetails.orderNum! < currSection.orderNum!
			)
		})
	}

	let foundSectionID: string
	if (findSectionID) {
		foundSectionID = findSectionID[0]
	} else {
		foundSectionID = ''
	}
	return foundSectionID
}

const nextSectionComputed = computed(
	[currSectionMap, filteredNavSectionsComputed],
	(currSection, filteredNavSections) =>
		findSectionID(filteredNavSections, currSection, true)
)

const prevSectionComputed = computed(
	[currSectionMap, filteredNavSectionsComputed],
	(currSection, filteredNavSections) =>
		findSectionID(filteredNavSections, currSection, false)
)

const isOnFirstSectionComputed = computed(
	[currSectionMap, filteredNavSectionsComputed],
	({ id }, filteredNavSections) => id === Object.keys(filteredNavSections).at(0)
)
const isOnLastSectionComputed = computed(
	[currSectionMap, filteredNavSectionsComputed],
	({ id }, filteredNavSections) =>
		id === Object.keys(filteredNavSections).at(-1)
)

const nextSectionAfterID = (id: string) => {
	const currOrderNum =
		allSectionsMap.get()[id] && (allSectionsMap.get()[id].orderNum as number)

	return Object.keys(allSectionsMap.get()).find((key) => {
		return allSectionsMap.get()[key].orderNum === currOrderNum + 1
	})
}

const useIsLastSection = (sectionID: string) =>
	Object.keys(allSectionsMap.get()).at(-1) === sectionID

const useIsLastActivity = (sectionID: string): boolean => {
	const sectionToCheck = allSectionsMap.get()[sectionID]

	if (!sectionToCheck) return false
	// only get activities, not static content
	const sectionsWithActivity = Object.values(allSectionsMap.get()).filter(
		(section) => section.activityType !== null
	)

	let highestOrderNum = Number.MIN_SAFE_INTEGER
	let lastActivitySection = null
	// get the last activity, based on having the highest ordernNum
	for (const currentSection of sectionsWithActivity) {
		if (
			currentSection.orderNum !== null &&
			currentSection.orderNum > highestOrderNum
		) {
			highestOrderNum = currentSection.orderNum
			lastActivitySection = currentSection
		}
	}
	// return true if param section is also the last activity
	return sectionToCheck === lastActivitySection
}

export {
	lessonIDAtom,
	activitiesMap,
	useDoesActivityExist,
	allSectionsMap,
	isOnContentAtom,
	useToggleNavShown,
	currSectionMap,
	useSetCurrSection,
	nextIncompleteActivityMap,
	useSetNextIncompleteActivity,
	useToggleActivity,
	filteredNavSectionsComputed,
	filteredLockedSectionsComputed,
	nextSectionComputed,
	prevSectionComputed,
	isOnFirstSectionComputed,
	isOnLastSectionComputed,
	nextSectionAfterID,
	useIsLastSection,
	useIsLastActivity,
	useSetActivityComplete,
	useUnlockNextSectionsAfterCompletion,
}
