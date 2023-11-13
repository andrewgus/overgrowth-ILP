<template>
	<slot></slot>
	<BaseTextAreaVue v-if="areSectionsAvailable" :id="id" :prompt="prompt" :savedData="localStorageAnswers"
		:storeProp="userReflectionsStore[id].answer" :isDisabled="!!$allSections[id].isActivityComplete"
		:completeCondition="checkForCompletion" placeholderText="I think&hellip;" @userTyped="updateReflectionStore" />
</template>

<script setup lang="ts">
import { useStore } from '@nanostores/vue'
import { allSectionsMap } from '../../../store/lessonStore'
import {
	userReflectionsStore,
	initUserReflectionsStore,
	activityProgressStore,
	userPracticeStore,
} from '../../../store/activityOptionsStore'
import useAreSectionsAvailable from '../../../composables/useAreSectionsAvailable'
import getLocalStorage from '../../../composables/useGetLocalStorage'
import BaseTextAreaVue from '../../base/BaseTextAreaVue.vue'
import { ref, watch } from 'vue'
import createID from '../../../composables/useCreateID'


const $allSections = useStore(allSectionsMap)
const { areSectionsAvailable } = useAreSectionsAvailable()

type Props = {
	id: string
	prompt: string
	previousChoiceBasedPrompts?: [string, [string, string]]
}

const props = defineProps<Props>()

const localStorageAnswers = getLocalStorage(
	props.id,
	'reflectionAnswer'
) as string

// Setting up prompt based on whether it is based on previous choice or not.
const prompt = ref<string>(props.prompt)
watch(userPracticeStore, (newPracticeStore) => {
	// if the previousChoice prompt is used..
	if (props.previousChoiceBasedPrompts !== undefined) {
		// make the ID to match that previous choice activity
		const choiceActivityID = createID(props.previousChoiceBasedPrompts[0])
		// if that exists in the new store
		if (newPracticeStore[choiceActivityID]) {
			// grab the userChoices of that store
			const userChoices = newPracticeStore[choiceActivityID].userPickChoices
			// If that userChoices array exists...
			if (Array.isArray(userChoices)) {
				// set the prompt ref to to associated prompt to the choice
				prompt.value = userChoices[0] === true ? props.previousChoiceBasedPrompts[1][0] : props.previousChoiceBasedPrompts[1][1]
				// init the reflectionStore again to match the updated prompt
				localStorageAnswers
					? initUserReflectionsStore(props.id, prompt.value, localStorageAnswers)
					: initUserReflectionsStore(props.id, prompt.value)
			}
		}
	}
})




localStorageAnswers
	? initUserReflectionsStore(props.id, prompt.value, localStorageAnswers)
	: initUserReflectionsStore(props.id, prompt.value)

const checkForCompletion = () => {
	if (userReflectionsStore[props.id].answer.length > 20) {
		activityProgressStore[props.id].isAttemptsFinished = true
	} else {
		activityProgressStore[props.id].isAttemptsFinished = false
	}
}

if (localStorageAnswers) checkForCompletion()

const updateReflectionStore = (emittedValue: string) =>
	(userReflectionsStore[props.id].answer = emittedValue)
</script>
