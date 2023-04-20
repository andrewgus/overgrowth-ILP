<template>
	<div :class="$style.userInput">
		<label :for="`${id}-textInput`">{{ prompt }}</label>
		<slot></slot>
		<textarea
			:disabled="!!$currSection.isFeatureComplete"
			placeholder="I think&hellip;"
			:id="`${id}-textInput`"
			rows="7"
			v-model="userInput"
			autocomplete="off"
			>{{ userReflectionsStore[id].answer }}</textarea
		>
	</div>
</template>

<script setup lang="ts">
	import { computed, toRefs } from 'vue'
	import { useStore } from '@nanostores/vue'
	import { currSectionMap } from '../../../store/lessonStore'
	import {
		userReflectionsStore,
		initUserReflectionsStore,
		featureProgressStore,
		localStorageReflectionAnswers,
		updatelocalStorageReflectionAnswers,
		type reflectionAnswersOnly,
	} from '../../../store/featureOptionsStore'

	const $currSection = useStore(currSectionMap)
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

	if (!!localStorage.getItem('reflectionResponses')) {
		const localStorageReflectionAnswers: reflectionAnswersOnly = JSON.parse(
			localStorage.getItem('reflectionResponses')!
		)
		initUserReflectionsStore(
			props.id,
			props.prompt,
			localStorageReflectionAnswers[props.id]
		)
	} else {
		initUserReflectionsStore(props.id, props.prompt)
	}

	const userInput = computed({
		get() {
			if (userReflectionsStore[props.id].answer.length > 25) {
				featureProgressStore[props.id].attemptsFinished = true
			} else {
				featureProgressStore[props.id].attemptsFinished = false
			}

			return userReflectionsStore[props.id].answer
		},
		set(value) {
			userReflectionsStore[props.id].answer = value
			updatelocalStorageReflectionAnswers(
				props.id,
				userReflectionsStore[props.id].answer.trim()
			)
			localStorage.setItem(
				'reflectionResponses',
				JSON.stringify(localStorageReflectionAnswers)
			)
		},
	})
</script>

<style module lang="scss">
	.userInput {
		display: flex;
		flex-flow: column nowrap;

		& > label {
			margin-bottom: var(--s0);
		}

		& > textarea {
			resize: none;
			font-size: var(--s0);
			font-family: var(--fonts);
			line-height: 1.6;
			border-radius: var(--s-2);
			border: 1px solid var(--darkGray);
			transition: var(--timeShort) box-shadow var(--transitionFlourish);
			padding: var(--s-2);

			&:focus {
				box-shadow: var(--s-4) var(--s-4) var(--s-8) var(--lightGray);
			}
		}
	}
</style>
