import { reactive } from 'vue'

interface userAnswers {
	[id: string]: {
		prompt: string
		answer: string
	}
}
export const userReflectionsStore = reactive<userAnswers>({})
