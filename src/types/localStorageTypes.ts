type LocalStorageDataObjProps = {
	isActivityComplete?: boolean
	reflectionAnswer?: string
	isPracticeOptionStepsComplete?: boolean[]
	userCreatedList?: {}[]
	userPickChoices?: [boolean, boolean]
}

type LocalStorageDataTypes = keyof LocalStorageDataObjProps

type LocalStorageDataObj = {
	[id: string]: LocalStorageDataObjProps
}

export type {
	LocalStorageDataObjProps,
	LocalStorageDataTypes,
	LocalStorageDataObj,
}
