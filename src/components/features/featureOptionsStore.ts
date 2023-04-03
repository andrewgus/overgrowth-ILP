import { reactive } from 'vue'

interface userAnswers {
	[id: string]: {
		prompt: string
		answer: string
	}
}
interface pdfGenStatus {
	[id: string]: {
		isDownloading: boolean
		isComplete: boolean
		isFailed: boolean
	}
}

const userReflectionsStore = reactive<userAnswers>({})

function initUserReflectionsStore(id: string, prompt: string) {
	userReflectionsStore[id] = {
		prompt: prompt,
		answer: '',
	}
}

// TODO: make this for each possible toSave feature
const pdfGeneratorStatusStore = reactive({
	isDownloading: false,
	isComplete: false,
	isFailed: false,
})

export {
	userReflectionsStore,
	initUserReflectionsStore,
	pdfGeneratorStatusStore,
}
