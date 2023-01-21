<template>
	<div class="nextPrev">
		<BaseButton
			:tabindex="useIsBookendSection.isFirst ? '-1' : '0'"
			:isDisabled="useIsBookendSection.isFirst"
			:aria-hidden="useIsBookendSection.isFirst"
			link
			:href="`#${prevSection}`"
			@click="useSetCurrSection(`section${currSectionId}`)"
			class="btn_prev"
			title="Go to previous section"
			aria-label="Go to previous section"
			text="&#9650;"
		/>
		<BaseButton
			:tabindex="useIsBookendSection.isLast ? '-1' : 0"
			:isDisabled="useIsBookendSection.isLast"
			:aria-hidden="useIsBookendSection.isLast"
			link
			:href="`#${nextSection}`"
			ref="prev"
			@click="useSetCurrSection(`section${currSectionId}`)"
			class="btn_next"
			title="Go to next section"
			aria-label="Go to next section"
			text="&#9660;"
		/>
	</div>
</template>

<script setup lang="ts">
	import { useIsBookendSection, useSetCurrSection } from './UseNavigation'
	import BaseButton from '../base/BaseButton.vue'

	defineProps({
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
</script>

<style scoped>
	div > .nextPrev {
		grid-area: 1/2/2/3;
		justify-self: end;
		display: flex;
		height: 48px;
		overflow: hidden;
		border: 1px solid var(--darkGray);
		border-radius: 30px 0 0 30px;
	}
	.nextPrev > * {
		overflow: hidden;
		border-radius: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		width: var(--s3);
		border: none;
	}
	.nextPrev > *:visited {
		color: var(--black);
	}
	.btn_prev {
		border-radius: 20px 0 0 20px;
	}
</style>
