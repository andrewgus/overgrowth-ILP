<template>
	<label :for="`${id}-textInput`">{{ prompt }}</label>
	<textarea
		:aria-describedby="describedBy"
		:class="$style.textarea"
		:disabled="isDisabled"
		rows="7"
		autocomplete="off"
		:id="`${id}-textInput`"
		v-model="userInput"
		:placeholder="placeholderText"
	>
	</textarea>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue'

	const emits = defineEmits(['userTyped'])

	type Props = {
		id: string
		prompt: string
		placeholderText: string
		storeProp: string
		savedData?: string
		isDisabled?: boolean
		describedBy?: string
		completeCondition?: Function
	}

	const props = defineProps<Props>()

	const typedInput = ref<string>('')

	const userInput = computed({
		get() {
			if (props.savedData) typedInput.value = props.savedData
			typedInput.value = props.storeProp

			if (props.completeCondition) props.completeCondition()

			return typedInput.value
		},
		set(value) {
			emits('userTyped', value)
		},
	})
</script>

<style module lang="scss">
	@use '../../styles/mixins/shadows.scss';
	.textarea {
		width: 100%;
		resize: none;
		font-size: var(--s0);
		font-family: var(--fonts);
		line-height: 1.6;
		border-radius: var(--s-2);
		border: 1px solid var(--darkGray);
		transition: var(--timeShort) box-shadow var(--transitionFlourish);
		padding: var(--s-2);

		&:focus {
			@include shadows.largeBoxShadow();
		}
	}
</style>
