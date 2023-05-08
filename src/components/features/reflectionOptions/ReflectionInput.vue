<template>
	<div :class="$style.userInput">
		<div :id="`${id}-description`">
			<slot></slot>
		</div>
		<BaseTextInput
			v-if="areSectionsAvailable"
			:describedBy="`${id}-description`"
			:id="id"
			:prompt="prompt"
			:savedData="localStorageAnswers"
			:storeProp="userReflectionsStore[id].answer"
			:isDisabled="!!$allSections[id].isFeatureComplete"
			:completeCondition="checkForCompletion"
			placeholderText="I think&hellip;"
			@userTyped="updateReflectionStore"
		/>
	</div>
</template>

<script setup lang="ts">
	import { useStore } from '@nanostores/vue'
	import { allSectionsMap } from '../../../store/lessonStore'
	import {
		userReflectionsStore,
		initUserReflectionsStore,
		featureProgressStore,
	} from '../../../store/featureOptionsStore'
	import useAreSectionsAvailable from '../../../composables/useAreSectionsAvailable'
	import getLocalStorage from '../../../composables/useGetLocalStorage'
	import BaseTextInput from '../../base/BaseTextInput.vue'

	// FIXME: set up so the div id around the slot and the aria-describedby are dynamic to if content was actually passed into the slot or not...

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
			featureProgressStore[props.id].isAttemptsFinished = true
		} else {
			featureProgressStore[props.id].isAttemptsFinished = false
		}
	}

	if (localStorageAnswers) checkForCompletion()

	const updateReflectionStore = (emittedValue: string) =>
		(userReflectionsStore[props.id].answer = emittedValue)
</script>

<style module lang="scss">
	.userInput {
		display: flex;
		flex-flow: column nowrap;

		& > label {
			margin-bottom: var(--s0);
		}
	}
</style>
