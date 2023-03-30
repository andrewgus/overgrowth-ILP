<template>
	<transition>
		<p
			v-if="
				!canContinueFrom.isComplete && areSectionsAvailable && !isLastSection
			"
			:class="$style.continueWarning"
		>
			Heads&nbsp;up!&nbsp;Once&nbsp;completed,
			this&nbsp;<strong>cannot</strong>&nbsp;be&nbsp;turned&nbsp;off&nbsp;later.
		</p>
	</transition>
	<transition mode="out-in">
		<BaseButton
			v-if="!featureComplete && areSectionsAvailable && !isLastSection"
			:isDisabled="!canContinueFrom.isComplete"
			:text="willSaveAsPDF ? 'Save work as PDF and continue?' : 'Continue?'"
			:class="$style.featureCompleteBtn"
			@btnClick="setComplete"
		/>
		<BaseButton
			v-else-if="areSectionsAvailable && isLastSection"
			text="Save as PDF"
			:class="$style.featureCompleteBtn"
			@btnClick="saveAsPDF"
		/>
		<BaseIndicator
			v-else
			text="Scoll to continue"
			:goTo="`#${$nextSection}`"
		></BaseIndicator>
	</transition>
</template>

<script setup lang="ts">
	import { ref, inject, computed } from 'vue'
	import { useStore } from '@nanostores/vue'
	import {
		featuresMap,
		currSectionMap,
		useSetCurrSection,
		nextSectionComputed,
		useSetNextActiveFeature,
		nextActiveFeatureMap,
		allSectionsMap,
		useIsLastSection,
	} from '../../store/lessonStore'
	import BaseButton from '../base/BaseButton.vue'
	import BaseIndicator from '../base/BaseIndicator.vue'
	import useFindNextActiveFeature from '../../composables/useFindNextActiveFeature'
	import useAreSectionsAvailable from '../../composables/useAreSectionsAvailable'
	import useSetSectionLocks from '../../composables/useSetSectionLocks'
	import useSaveAsPDF from '../../composables/useSaveAsPDF'

	const $features = useStore(featuresMap)
	const $currSection = useStore(currSectionMap)
	const $nextActiveFeature = useStore(nextActiveFeatureMap)
	const $nextSection = useStore(nextSectionComputed)

	// willSaveAsPDF & canContinueFrom  provided by each feature's layout SFC.
	const willSaveAsPDF = inject('willSaveAsPDF') as boolean
	const canContinueFrom = inject('isFeatureComplete') as {
		id: string
		isComplete: boolean
	}
	const areSectionsAvailable = useAreSectionsAvailable()
	const isLastSection = useIsLastSection(canContinueFrom.id)

	const featureComplete = ref<boolean>(false)

	const saveAsPDF = () => {
		useSaveAsPDF($currSection.value)
		if (!featureComplete.value) featureComplete.value = true
	}

	const setComplete = ({ target }: Event) => {
		const clicked = target as HTMLElement
		if (!clicked) return

		const thisSection = clicked.closest('section')
		useSetCurrSection(thisSection!.id)

		// marking feature as complete
		currSectionMap.setKey('isFeatureComplete', true)
		allSectionsMap.setKey(thisSection!.id, {
			...$currSection.value,
		})

		const allSectionsAsArray = Object.entries(allSectionsMap.get())
		const findNextActiveFeature = useFindNextActiveFeature(
			allSectionsAsArray,
			$features.value
		)
		if (findNextActiveFeature) {
			useSetNextActiveFeature(findNextActiveFeature[0])
		}

		// if there is a next active feature
		if (findNextActiveFeature !== undefined) {
			// Unlock all features up until, and including, the nextActiveFeature
			allSectionsAsArray.forEach(([sectionKey, sectionDetails]) => {
				if (sectionDetails.orderNum! <= $nextActiveFeature.value.orderNum!) {
					useSetSectionLocks(allSectionsMap, sectionKey, sectionDetails, false)
				}
			})
		} else {
			// if there is NOT a next available feature
			allSectionsAsArray.forEach(([sectionKey, sectionDetails]) => {
				if (sectionDetails.featureType === null) {
					useSetSectionLocks(allSectionsMap, sectionKey, sectionDetails, false)
				}
			})
		}
		if (willSaveAsPDF) saveAsPDF()

		featureComplete.value = true
	}
</script>

<style module lang="scss">
	.featureCompleteBtn {
		display: block;
		margin: var(--s0) auto 0;
	}
	.continueWarning {
		width: fit-content;
		text-align: center;
		padding: var(--s-4) var(--s-2);
		margin: var(--s0) auto;
		background-color: var(--yellow5);
		border: 1px solid var(--darkGray);
		border-radius: var(--s10);

		&,
		> strong {
			font-size: var(--s-1);
		}
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
