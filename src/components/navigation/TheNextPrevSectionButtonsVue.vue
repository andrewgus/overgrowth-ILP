<template>
	<div v-if="$isOnContent" :class="$style.nextPrev">
		<BaseButtonVue isLink :tabindex="$isOnFirstSection ? '-1' : '0'" :isDisabled="$isOnFirstSection"
			:aria-hidden="$isOnFirstSection" :href="`#${$prevSection}`" @click="useSetCurrSection($currSection.id)"
			:class="$style.btn_prev" title="Go to previous section" aria-label="Go to previous section" text="&#9650;" />
		<BaseButtonVue isLink :tabindex="$isOnLastSection ? '-1' : '0'" :isDisabled="$isOnLastSection"
			:aria-hidden="$isOnLastSection" :href="`#${$nextSection}`" @click="useSetCurrSection($currSection.id)"
			:class="$style.btn_next" title="Go to next section" aria-label="Go to next section" text="&#9660;" />
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
import BaseButtonVue from '../base/BaseButtonVue.vue'

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
	max-height: 80%;
	border-radius: var(--s10) 0 0 var(--s10);
	background-color: var(--lightBlue);


	>a.btn_next,
	>a.btn_prev {
		@include containerStyles.darkBorder();
		color: var(--black);
		border-radius: 0;

		&[aria-hidden='true'] {
			background-color: var(--lightGray);
			color: var(--darkGray);
			pointer-events: none;
		}
	}

	>a.btn_prev {
		border-radius: var(--s10) 0 0 var(--s10);
		border-right: 0;
	}
}
</style>
