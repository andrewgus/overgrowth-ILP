// Activity setup: 
// All possible activity types 
type ActivityType = 'reflection' | 'practice' | 'choice'
// and their on/off value
type ActivitiesMap = Partial<{ [K in ActivityType]: boolean }>

// For Interactive Activities: all possible practice activity types
type validPracticeActivityOptions = 'Matching' | 'Math'

export type {
    ActivityType, 
    ActivitiesMap,
    validPracticeActivityOptions
}