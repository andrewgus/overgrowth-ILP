<template>
	<div v-if="$isOnContent" :class="$style.nextPrev">
		<BaseButton
			link
			:tabindex="$isOnFirstSection ? '-1' : '0'"
			:isDisabled="$isOnFirstSection"
			:aria-hidden="$isOnFirstSection"
			:href="`#${$prevSection}`"
			@click="useSetCurrSection($currSection.id)"
			:class="$style.btn_prev"
			title="Go to previous section"
			aria-label="Go to previous section"
			text="&#9650;"
		/>
		<BaseButton
			link
			:tabindex="$isOnLastSection ? '-1' : '0'"
			:isDisabled="$isOnLastSection"
			:aria-hidden="$isOnLastSection"
			:href="`#${$nextSection}`"
			@click="useSetCurrSection($currSection.id)"
			:class="$style.btn_next"
			title="Go to next section"
			aria-label="Go to next section"
			text="&#9660;"
		/>
	</div>
</template>

<script setup lang="ts">
	import { mapStores } from '@nanostores/vue'
	import {
		isOnContentAtom,
		currSectionMap,
		useSetCurrSection,
		nextSectionComputed,
		prevSectionComputed,
		isOnFirstSectionComputed,
		isOnLastSectionComputed,
	} from '../../store/lessonStore'
	import BaseButton from '../base/BaseButton.vue'

	const {
		isOnContentAtom: $isOnContent,
		currSectionMap: $currSection,
		nextSectionComputed: $nextSection,
		prevSectionComputed: $prevSection,
		isOnFirstSectionComputed: $isOnFirstSection,
		isOnLastSectionComputed: $isOnLastSection,
	} = mapStores({
		isOnContentAtom,
		currSectionMap,
		nextSectionComputed,
		prevSectionComputed,
		isOnFirstSectionComputed,
		isOnLastSectionComputed,
	})
</script>

<style module lang="scss">
	@use '../../styles/mixins/containerStyles.scss';
	.nextPrev {
		grid-area: 1/2/2/3;
		display: flex;
		justify-self: end;
		height: var(--s4);
		border-radius: var(--s10) 0 0 var(--s10);
		background-color: var(--lightBlue);
		@include containerStyles.darkBorder();

		> a.btn_next,
		> a.btn_prev {
			color: var(--black);
			border-radius: 0;
			border: none;
			&:visited {
				color: var(--black);
			}
			&[aria-hidden='true'] {
				color: var(--darkGray);
				pointer-events: none;
			}
		}
		> a.btn_prev {
			border-radius: var(--s10) 0 0 var(--s10);
			border-right: 1px solid var(--darkGray);
		}
	}
</style>
