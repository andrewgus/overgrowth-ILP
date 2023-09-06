import type {ActivityType} from './ActivityTypes'
// All sections
type SectionDetails = {
	title: string
	id: string
	orderNum: number | null
	activityType: ActivityType | null
	isLocked: boolean
	isActivityComplete: boolean | null
}
type SectionsMap = {
	[sectionKey: string]: SectionDetails
}

export type {
    SectionDetails,
    SectionsMap
}