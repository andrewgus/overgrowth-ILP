<!-- TODO: Optionally, the complete btn can instead be a "Save & Complete" btn, where users will not only complete and continue, but also download a PDF of that activity, so that they can provide their finished results to their professor -->
<template>
	<transition mode="out-in">
		<BaseButton
			:isDisabled="!canContinue"
			v-if="!featureComplete"
			text="Continue?"
			:class="$style.featureCompleteBtn"
			@btnClick="setComplete"
		></BaseButton>
		<BaseIndicator
			v-else
			text="Scoll to continue"
			:goTo="`#${$nextSection}`"
		></BaseIndicator>
	</transition>
</template>

<script setup lang="ts">
	import { ref, inject } from 'vue'
	import { useStore } from '@nanostores/vue'
	import {
		featuresMap,
		currSectionMap,
		useSetCurrSection,
		nextSectionComputed,
		allSectionsMap,
		type FeatureType,
	} from '../../store/lessonStore'
	import BaseButton from '../base/BaseButton.vue'
	import BaseIndicator from '../base/BaseIndicator.vue'

	const $allSections = useStore(allSectionsMap)
	const $features = useStore(featuresMap)
	const $currSection = useStore(currSectionMap)
	const $nextSection = useStore(nextSectionComputed)

	const canContinue = inject('isFeatureComplete')
	const featureComplete = ref<boolean>(false)

	const setComplete = ({ target }: Event) => {
		const clicked = target as HTMLElement
		if (!clicked) return

		const thisSection = clicked.closest('section')
		// NOTE: Should this lock (isLocked: true) if the feature is turned off after it was completed? Does this coincide with the pop-up warning?
		useSetCurrSection(thisSection!.id)

		const allSectionsAsArray = Object.entries($allSections.value)
		const nextActiveFeature = allSectionsAsArray.find(([_, sectionDetails]) => {
			return (
				// it is a feature && it is on && it is not the currentFeature && it has a higher orderNum than the currSection orderNum
				!!sectionDetails.isFeatureType &&
				$features.value[sectionDetails.isFeatureType as FeatureType] &&
				sectionDetails.id !== $currSection.value.id &&
				sectionDetails.orderNum! > $currSection.value.orderNum!
			)
		})
		// Unlock all features up until, and including, the nextActiveFeature
		if (nextActiveFeature !== undefined) {
			// if there is a next active feature
			const [_, nextActiveFeatureDetails] = nextActiveFeature

			allSectionsAsArray.forEach(([sectionKey, sectionDetails]) => {
				if (sectionDetails.orderNum! <= nextActiveFeatureDetails.orderNum!) {
					allSectionsMap.setKey(sectionKey, {
						...sectionDetails,
						isLocked: false,
					})
				}
			})
		} else {
			// if there is NOT a next available feature
			allSectionsAsArray.forEach(([sectionKey, sectionDetails]) => {
				if (sectionDetails.isFeatureType === false) {
					allSectionsMap.setKey(sectionKey, {
						...sectionDetails,
						isLocked: false,
					})
				}
			})
		}
		featureComplete.value = true
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
