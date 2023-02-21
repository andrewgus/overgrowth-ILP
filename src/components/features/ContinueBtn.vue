<!--
  
  TODO: This component...
    — will be based off the BaseButton & BaseIndicator components.
    — however, will have a few if/else situations tied to it.
    — will be used at the end of any given feature component. As these featuresMap are also stopping points in the lesson. Users will not be able to continue with the lesson until they have completed the feature. Until they have completed the feature, the Btn will be disabled. Once complete, they will be able to click it and then show the indicator.

    — Optionally, the complete btn will instead be a "Save & Complete" btn, where users will not only complete and continue, but also download a PDF of that activity, so that they can provide their finished results to their professor
-->

<template>
	<transition mode="out-in">
		<BaseButton
			v-if="!complete"
			text="Complete?"
			:class="$style.featureCompleteBtn"
			@btnClick="setComplete"
		></BaseButton>
		<BaseIndicator
			v-else
			text="Scoll to continue"
			:goTo="nextSection()"
		></BaseIndicator>
	</transition>
</template>

<script setup lang="ts">
	import { ref } from 'vue'
	import BaseButton from '../base/BaseButton.vue'
	import BaseIndicator from '../base/BaseIndicator.vue'
	import {
		currSectionMap,
		filteredSectionsComputed,
	} from '../../store/NavigationStore'
	import { useStore } from '@nanostores/vue'

	const filteredSections = useStore(filteredSectionsComputed)
	const currSection = useStore(currSectionMap)
	const complete = ref<boolean>(false)

	const setComplete = (e) => {
		console.log(e)
		currSectionMap.setKey('isLocked', false)
		complete.value = true
	}

	const nextSection = () => {
		const nextSectionOrderNum =
			filteredSections.value[currSection.value.id].orderNum! + 1

		const nextSectionId = Object.keys(filteredSections.value).at(
			nextSectionOrderNum
		)

		if (nextSectionId === undefined) return '#'

		return `#${nextSectionId}`
	}
</script>

<style module lang="scss">
	.featureCompleteBtn {
		display: block;
		margin: var(--s0) auto 0;
	}
</style>
<style scoped>
	/* transition styles */
	.v-enter-from,
	.v-leave-to {
		opacity: 0;
	}
	.v-enter-active,
	.v-leave-active {
		transition: var(--timeShort) opacity ease-in-out;
	}
	.v-enter-to,
	.v-leave-from {
		opacity: 1;
	}
</style>
