<template>
	<div v-if="isOnContent" :class="$style.nextPrev">
		<BaseButton
			link
			isForNav
			:tabindex="isOnFirstSection ? '-1' : '0'"
			:isDisabled="isOnFirstSection"
			:aria-hidden="isOnFirstSection"
			:href="prevSection"
			@click="useSetCurrSection(currSectionId)"
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
			:href="nextSection"
			@click="useSetCurrSection(currSectionId)"
			:class="$style.btn_next"
			title="Go to next section"
			aria-label="Go to next section"
			text="&#9660;"
		/>
	</div>
</template>

<script setup lang="ts">
	import { computed } from 'vue'
	import { useStore } from '@nanostores/vue'
	import {
		allSectionsMap,
		isOnContentAtom,
		currSectionIdAtom,
		useSetCurrSection,
	} from '../../store/NavigationStore'
	import BaseButton from '../base/BaseButton.vue'

	const allSections = useStore(allSectionsMap)
	const isOnContent = useStore(isOnContentAtom)
	const currSectionId = useStore(currSectionIdAtom)

	const prevSection = computed(() => {
		const prevSectionOrderNum =
			allSections.value[currSectionId.value].orderNum - 1

		const prevSectionId = Object.keys(allSections.value).at(prevSectionOrderNum)

		return `#${prevSectionId}`
	})

	const nextSection = computed(() => {
		const nextSectionOrderNum =
			allSections.value[currSectionId.value].orderNum + 1

		const nextSectionId = Object.keys(allSections.value).at(nextSectionOrderNum)

		if (nextSectionId === undefined) return '#'

		return `#${nextSectionId}`
	})

	const isOnFirstSection = computed(() => {
		return allSections.value[currSectionId.value].orderNum === 0
	})

	const isOnLastSection = computed(() => {
		const lastSection: string = Object.keys(allSections.value).at(-1)!
		return (
			allSections.value[currSectionId.value].orderNum ===
			allSections.value[lastSection].orderNum
		)
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
