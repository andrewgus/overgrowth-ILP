import { reactive } from 'vue'

interface userAnswers {
	[id: string]: {
		prompt: string
		answer: string
	}
}

const userReflectionsStore = reactive<userAnswers>({})

function initUserReflectionsStore(id: string, prompt: string) {
	userReflectionsStore[id] = {
		prompt: prompt,
		answer: '',
	}
}

export { userReflectionsStore, initUserReflectionsStore }
