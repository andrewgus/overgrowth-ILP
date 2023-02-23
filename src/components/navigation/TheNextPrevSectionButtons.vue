<template>
	<div v-if="isOnContent && areSectionsAvailable" :class="$style.nextPrev">
		<BaseButton
			link
			isForNav
			:tabindex="isOnFirstSection ? '-1' : '0'"
			:isDisabled="isOnFirstSection"
			:aria-hidden="isOnFirstSection"
			:href="`#${prevSection}`"
			@click="useSetCurrSection(currSection.id)"
			:class="$style.btn_prev"
			title="Go to previous section"
			aria-label="Go to previous section"
			text="&#9650;"
		/>
		<BaseButton
			link
			isForNav
			:tabindex="isOnLastSection ? '-1' : '0'"
			:isDisabled="isOnLastSection"
			:aria-hidden="isOnLastSection"
			:href="`#${nextSection}`"
			@click="useSetCurrSection(currSection.id)"
			:class="$style.btn_next"
			title="Go to next section"
			aria-label="Go to next section"
			text="&#9660;"
		/>
	</div>
</template>

<script setup lang="ts">
	import { useStore } from '@nanostores/vue'
	import {
		isOnContentAtom,
		currSectionMap,
		useSetCurrSection,
		nextSectionComputed,
		prevSectionComputed,
		isOnFirstSectionComputed,
		isOnLastSectionComputed,
	} from '../../store/NavigationStore'
	import BaseButton from '../base/BaseButton.vue'

	const isOnContent = useStore(isOnContentAtom)
	const currSection = useStore(currSectionMap)
	const isOnFirstSection = useStore(isOnFirstSectionComputed)
	const nextSection = useStore(nextSectionComputed)
	const isOnLastSection = useStore(isOnLastSectionComputed)
	const prevSection = useStore(prevSectionComputed)
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
