<template>
	<div :class="$style.userInput">
		<label :for="`${id}-input`">{{ prompt }}</label>
		<slot></slot>
		<textarea
			:disabled="!!$currSection.isFeatureComplete"
			placeholder="I think&hellip;"
			:id="`${id}-input`"
			rows="7"
			v-model="userInput"
			autocomplete="off"
		></textarea>
	</div>
</template>

<script setup lang="ts">
	import { computed } from 'vue'
	import { useStore } from '@nanostores/vue'
	import { currSectionMap } from '../../../store/lessonStore'
	import {
		userReflectionsStore,
		initUserReflectionsStore,
		featureProgressStore,
	} from '../featureOptionsStore'

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

	initUserReflectionsStore(props.id, props.prompt)

	const userInput = computed({
		get() {
			return userReflectionsStore[props.id].answer
		},
		set(value) {
			userReflectionsStore[props.id].answer = value
			if (value.length > 25) {
				featureProgressStore[props.id].attemptsFinished = true
			} else {
				featureProgressStore[props.id].attemptsFinished = false
			}
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
				box-shadow: 12px 12px 12px var(--lightGray);
			}
		}
	}
</style>
