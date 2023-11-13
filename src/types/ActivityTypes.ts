// All possible activity types
type ActivityType = 'reflection' | 'practice'
// and their on/off value
type ActivitiesMap = Partial<{ [K in ActivityType]: boolean }>

// For LessonPractice/PracticeSwitchBoard: all possible practice activity types
interface ActivityDefinitions {
	Matching: {
		sectionTitle: string
		prompt: string
		itemsAndAnswers: [string, string][]
	}
	Math: {
		sectionTitle: string
		prompt: string
		QsAndAs: [string, string][]
		incorrectFeedback?: string[]
		isRoundedAnswerAccepted?: boolean
	}
	CreateList: {
		sectionTitle: string
		prompt: string
		listItems: string[]
		canAddAdditionalListItems?: boolean
	}
	SortingList: {
		sectionTitle: string
		prompt: string
		listItems: string[]
	}
	PickOneOfTwo: {
		sectionTitle: string
		prompt: string
		buttonNames: [string, string]
		choiceFeedback: [string, string]
	}
	FinalFeedback: {
		sectionTitle: string
		prompt: string
	}
}

type ValidPracticeActivityTypes = keyof ActivityDefinitions

type ActivitySwitchItem = {
	[type in ValidPracticeActivityTypes]?: ActivityDefinitions[type]
}

export type {
	ActivityType,
	ActivitiesMap,
	ValidPracticeActivityTypes,
	ActivitySwitchItem,
}
