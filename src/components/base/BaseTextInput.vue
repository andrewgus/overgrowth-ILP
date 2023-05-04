<template>
	<textarea
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

	const props = defineProps({
		id: {
			type: String,
			required: true,
		},
		placeholderText: {
			type: String,
			required: true,
		},
		storeProp: {
			type: String,
			required: true,
		},
		savedData: {
			type: String,
		},
		isDisabled: {
			type: Boolean,
		},
	})

	const typedInput = ref<string>('')

	const userInput = computed({
		get() {
			if (props.savedData) typedInput.value = props.savedData
			typedInput.value = props.storeProp
			return typedInput.value
		},
		set(value) {
			emits('userTyped', value)
		},
	})
</script>

<style module lang="scss">
	.textarea {
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
</style>
