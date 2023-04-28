<template>
	<textarea
		:class="$style.textarea"
		:disabled="isDisabled"
		rows="7"
		autocomplete="off"
		:id="`${id}-textInput`"
		v-model="userInput"
	>
    {{ savedData }}
  </textarea>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue'
	const emits = defineEmits(['userTyped'])

	// FIXME: savedData not properly showing.

	const typedContent = ref<string>()

	defineProps({
		id: {
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

	const userInput = computed({
		get() {
			return typedContent.value
		},
		set(value) {
			typedContent.value = value
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
