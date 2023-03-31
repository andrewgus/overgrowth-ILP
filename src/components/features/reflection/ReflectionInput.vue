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
	} from './userReflectionsStore'

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
	const emit = defineEmits(['userTyped'])

	initUserReflectionsStore(props.id, props.prompt)

	const userInput = computed({
		get() {
			return userReflectionsStore[props.id].answer
		},
		set(value) {
			userReflectionsStore[props.id].answer = value
			emit('userTyped', value)
		},
	})
</script>

<style module lang="scss">
	.userInput {
		display: flex;
		flex-flow: column nowrap;
		gap: var(--s-2);

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
