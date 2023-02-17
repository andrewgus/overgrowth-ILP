<template>
	<div v-if="isOnContent && areSectionsAvailable" :class="$style.nextPrev">
		<BaseButton
			link
			isForNav
			:tabindex="isOnFirstSection ? '-1' : '0'"
			:isDisabled="isOnFirstSection"
			:aria-hidden="isOnFirstSection"
			:href="prevSection"
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
			:href="nextSection"
			@click="useSetCurrSection(currSection.id)"
			:class="$style.btn_next"
			title="Go to next section"
			aria-label="Go to next section"
			text="&#9660;"
		/>
	</div>
</template>

<script setup lang="ts">
	import { computed, onMounted, ref, Ref } from 'vue'
	import { useStore } from '@nanostores/vue'
	import {
		filteredSectionsComputed,
		isOnContentAtom,
		currSectionMap,
		useSetCurrSection,
		lastSectionComputed,
	} from '../../store/NavigationStore'
	import type { SectionsMap } from '../../store/NavigationStore.js'
	import BaseButton from '../base/BaseButton.vue'

	const lastSection = useStore(lastSectionComputed)
	const isOnContent = useStore(isOnContentAtom)
	const currSection = useStore(currSectionMap)

	let filteredSections: Readonly<Ref<SectionsMap>>
	let areSectionsAvailable = ref<boolean>(false)

	onMounted(() => {
		filteredSections = useStore(filteredSectionsComputed)
		areSectionsAvailable.value = Object.keys(filteredSections.value).length > 0
	})

	const prevSection = computed(() => {
		const prevSectionOrderNum =
			filteredSections.value[currSection.value.id].orderNum! - 1

		const prevSectionId = Object.keys(filteredSections.value).at(
			prevSectionOrderNum
		)

		return `#${prevSectionId}`
	})

	const nextSection = computed(() => {
		const nextSectionOrderNum =
			filteredSections.value[currSection.value.id].orderNum! + 1

		const nextSectionId = Object.keys(filteredSections.value).at(
			nextSectionOrderNum
		)

		if (nextSectionId === undefined) return '#'

		return `#${nextSectionId}`
	})

	const isOnFirstSection = computed(() => {
		if (filteredSections.value[currSection.value.id]) {
			return filteredSections.value[currSection.value.id].orderNum === 0
		}
	})

	const isOnLastSection = computed(() => {
		return (
			filteredSections.value[currSection.value.id].orderNum ===
			filteredSections.value[lastSection.value.id].orderNum
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
