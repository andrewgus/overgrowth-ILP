<template>
	<div :class="$style.nextPrev">
		<BaseButton
			link
			isForNav
			:tabindex="isPrevDisabled ? '-1' : '0'"
			:isDisabled="isPrevDisabled"
			:aria-hidden="isPrevDisabled"
			:href="`#${prevSection}`"
			@click="useSetCurrSection(`section${currSectionId}`)"
			:class="$style.btn_prev"
			title="Go to previous section"
			aria-label="Go to previous section"
			text="&#9650;"
		/>
		<BaseButton
			link
			isForNav
			:tabindex="useIsBookendSection.isLast ? '-1' : '0'"
			:isDisabled="useIsBookendSection.isLast"
			:aria-hidden="useIsBookendSection.isLast"
			:href="`#${nextSection}`"
			@click="useSetCurrSection(`section${currSectionId}`)"
			:class="$style.btn_next"
			title="Go to next section"
			aria-label="Go to next section"
			text="&#9660;"
		/>
	</div>
</template>

<script setup lang="ts">
	import { computed } from 'vue'
	import {
		useIsBookendSection,
		useSetCurrSection,
	} from '../../composables/UseNavigationHelpers'
	import BaseButton from '../base/BaseButton.vue'

	const props = defineProps({
		currSectionId: {
			type: Number,
			required: true,
		},
		prevSection: {
			type: String,
			required: true,
		},
		nextSection: {
			type: String,
			required: true,
		},
	})

	const isPrevDisabled = computed(() => {
		return useIsBookendSection.value.isFirst || !!!props.currSectionId
	})
</script>

<style module lang="scss">
	.nextPrev {
		grid-area: 1/2/2/3;
		justify-self: end;
		display: flex;
		height: var(--s4);
		border: 1px solid var(--darkGray);
		border-radius: var(--s10) 0 0 var(--s10);
		background-color: var(--lightBlue);

		> * {
			border-radius: 0;
			display: flex;
			justify-content: center;
			align-items: center;
			width: var(--s3);
			border: none;
		}
		> .btn_prev {
			border-radius: var(--s10) 0 0 var(--s10);
		}
	}
</style>
