<template>
	<div v-if="isOnContent" :class="$style.nextPrev">
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
	import { computed, onMounted, Ref, ref } from 'vue'
	import { useStore } from '@nanostores/vue'
	import {
		filteredSectionsComputed,
		isOnContentAtom,
		currSectionMap,
		useSetCurrSection,
		allSectionsMap,
		SectionsMap,
		nextSectionComputed,
		prevSectionComputed,
	} from '../../store/NavigationStore'
	import BaseButton from '../base/BaseButton.vue'

	const isOnContent = useStore(isOnContentAtom)
	const currSection = useStore(currSectionMap)
	const nextSection = useStore(nextSectionComputed)
	const prevSection = useStore(prevSectionComputed)

	let filteredSections: Readonly<Ref<SectionsMap>>
	let areSectionsAvailable = ref<boolean>(false)
	let allSections = useStore(allSectionsMap)
	let sections = useStore(allSectionsMap)

	// TODO: consider how to refactor this... this is to fix refresh errors, where, the whole app resets, and we need to wait a short time for the filtered list to reload so that the proper items are showing. Right now, this is making sure the filtered list equals the allSections list as, with a page refresh, this is would be the case. This would be used in a number of places, so best to see if this can be moved to the Store, but this is where it is for now. It would be ideal to figure out how to simply way for the filteredList to finish updating before using it, but cannot quite figure out async await with it just yet.
	onMounted(() => {
		filteredSections = useStore(filteredSectionsComputed)
		const sectionKeys = Object.keys(allSections.value).length
		let filteredKeys: number
		setTimeout(() => {
			sections = useStore(filteredSectionsComputed)
			filteredKeys = Object.keys(filteredSections.value).length
			areSectionsAvailable.value = filteredKeys === sectionKeys
		}, 100)
	})

	const isOnFirstSection = computed(() => {
		return sections.value[currSection.value.id].orderNum === 0
	})

	const isOnLastSection = computed(() => {
		const lastSection: string = Object.keys(sections.value).at(-1)!
		return (
			sections.value[currSection.value.id].orderNum ===
			sections.value[lastSection].orderNum
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
