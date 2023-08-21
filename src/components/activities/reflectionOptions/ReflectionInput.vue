<template>
	<slot></slot>
	<BaseTextArea v-if="areSectionsAvailable" :id="id" :prompt="prompt" :savedData="localStorageAnswers"
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
} from '../../../store/activityOptionsStore'
import useAreSectionsAvailable from '../../../composables/useAreSectionsAvailable'
import getLocalStorage from '../../../composables/useGetLocalStorage'
import BaseTextArea from '../../base/BaseTextArea.vue'

const $allSections = useStore(allSectionsMap)
const { areSectionsAvailable } = useAreSectionsAvailable()

const props = defineProps({
	id: {
		type: String,
		required: true,
	},
	prompt: {
		type: String,
		required: true,
	},
})

const localStorageAnswers = getLocalStorage(
	props.id,
	'reflectionAnswer'
) as string

localStorageAnswers
	? initUserReflectionsStore(props.id, props.prompt, localStorageAnswers)
	: initUserReflectionsStore(props.id, props.prompt)

const checkForCompletion = () => {
	if (userReflectionsStore[props.id].answer.length > 25) {
		activityProgressStore[props.id].isAttemptsFinished = true
	} else {
		activityProgressStore[props.id].isAttemptsFinished = false
	}
}

if (localStorageAnswers) checkForCompletion()

const updateReflectionStore = (emittedValue: string) =>
	(userReflectionsStore[props.id].answer = emittedValue)
</script>
