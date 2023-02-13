<template>
	<div v-if="useStore(isOnContent).value" :class="$style.nextPrev">
		<BaseButton
			link
			isForNav
			:tabindex="isOnFirstSection ? '-1' : '0'"
			:isDisabled="isOnFirstSection"
			:aria-hidden="isOnFirstSection"
			:href="prevSection"
			@click="NavigationStore.setCurrSection(useStore(currSectionId).value)"
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
			@click="NavigationStore.setCurrSection(useStore(currSectionId).value)"
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
	import { NavigationStore } from '../../store'
	import BaseButton from '../base/BaseButton.vue'

	const isOnContent = NavigationStore.isOnContent
	const allSections = NavigationStore.allSectionsMap
	const currSectionId = NavigationStore.currSectionId

	const prevSection = computed(() => {
		const prevSectionOrderNum =
			useStore(allSections).value[useStore(currSectionId).value].orderNum - 1

		const prevSectionId = Object.keys(useStore(allSections).value).at(
			prevSectionOrderNum
		)

		return `#${prevSectionId}`
	})

	const nextSection = computed(() => {
		const nextSectionOrderNum =
			useStore(allSections).value[useStore(currSectionId).value].orderNum + 1

		const nextSectionId = Object.keys(useStore(allSections).value).at(
			nextSectionOrderNum
		)

		if (nextSectionId === undefined) return '#'

		return `#${nextSectionId}`
	})

	const isOnFirstSection = computed(() => {
		return (
			useStore(allSections).value[useStore(currSectionId).value].orderNum === 0
		)
	})

	const isOnLastSection = computed(() => {
		const lastSection: string = Object.keys(allSections.get()).at(-1)!
		return (
			useStore(allSections).value[useStore(currSectionId).value].orderNum ===
			useStore(allSections).value[lastSection].orderNum
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
