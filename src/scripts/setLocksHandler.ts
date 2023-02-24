import { filteredLockedSectionsComputed } from '../store/NavigationStore'

/* 

What do I want happening with this?

1) If section isLocked: true, then apply the class, .isLocked, which will make is display:none;

2) If section isLocked: true, filter that out of the filteredNavSectionsComputed in the NavigationStore


What I have so far:

1) On init of the app: Any section that comes after the first feature to exist is locked

2) within the CompleteBtn component in "components --> features", will set (not finished yet) all succeeding sections, after said feature is completed, to unlocked (isLocked: false), including the next feature, but all sections after that will still be locked. This creates a pattern where all content is unlocked until you get to the next feature, which you can complete, and then progress.

*/

filteredLockedSectionsComputed.subscribe((sections) => {
	const sectionKeys = Object.keys(sections)

	sectionKeys.forEach((key) => {
		const el = document.getElementById(key)

		el?.classList.add('isLocked')
	})
})

export {}
