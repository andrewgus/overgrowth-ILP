import { map } from 'nanostores'

interface Topics {
	id: string
	topicName: string
	lessonName: string
}

export const Topics = map<Topics>()
