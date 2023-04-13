import { reactive } from 'vue'

// log user's reflection answers
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

// log whether user has done the feature work of a given feature
interface canContinue {
	[id: string]: {
		id: string
		attemptFinished: boolean
	}
}
const canContinueStore = reactive<canContinue>({})
function initCanContinueStore(id: string) {
	canContinueStore[id] = {
		id: id,
		attemptFinished: false,
	}
}

// track status of PDF generation for user feedback
interface pdfGenStatus {
	[id: string]: {
		isDownloading: boolean
		isComplete: boolean
		isFailed: boolean
	}
}
const pdfGeneratorStatusStore = reactive<pdfGenStatus>({})
function initPdfGeneratorStatusStore(id: string) {
	pdfGeneratorStatusStore[id] = {
		isDownloading: false,
		isComplete: false,
		isFailed: false,
	}
}

// NOTE: When creating first practice activity component, will need to create a store for # of user attempts and how they performed in each attempt. NOTE: May have to create a persisent nanostore for that and refactor all of this to that nanostore.

export {
	userReflectionsStore,
	initUserReflectionsStore,
	canContinueStore,
	initCanContinueStore,
	pdfGeneratorStatusStore,
	initPdfGeneratorStatusStore,
}
