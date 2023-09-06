
type localStorageDataObjProps = {
	isActivityComplete?: boolean
	reflectionAnswer?: string
	isPracticeOptionStepsComplete: boolean[]
}
type localStorageDataTypes = keyof localStorageDataObjProps

type localStorageDataObj = {
	[id: string]: localStorageDataObjProps
}

export type {
    localStorageDataObjProps, 
    localStorageDataTypes,
    localStorageDataObj
}