import { filteredSectionsComputed } from '../store/NavigationStore'

const test2 = (str: string) =>
	filteredSectionsComputed.listen((section) => {
		console.log(section[str])
	})

test2('what-do-you-think')

export {}
