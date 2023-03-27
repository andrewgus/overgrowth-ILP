<!-- TODO: Optionally, the complete btn can instead be a "Save & Complete" btn, where users will not only complete and continue, but also download a PDF of that activity, so that they can provide their finished results to their professor -->
<template>
	<transition>
		<!-- TODO: Style this. Also only have this show up on the first feature possible. Move this to just below the heading, and show until user starts. -->
		<p v-if="!canContinue" :class="$style.continueWarning">
			Heads&nbsp;up!&nbsp;Any&nbsp;feature&nbsp;you&nbsp;complete
			<strong>cannot</strong>&nbsp;be&nbsp;turned&nbsp;off&nbsp;later.
		</p>
	</transition>
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
		useSetNextActiveFeature,
		nextActiveFeatureMap,
		allSectionsMap,
	} from '../../store/lessonStore'
	import useFindNextActiveFeature from '../../composables/useFindNextActiveFeature'
	import BaseButton from '../base/BaseButton.vue'
	import BaseIndicator from '../base/BaseIndicator.vue'

	const $features = useStore(featuresMap)
	const $currSection = useStore(currSectionMap)
	const $nextActiveFeature = useStore(nextActiveFeatureMap)
	const $nextSection = useStore(nextSectionComputed)

	// canContinue is provided by each feature's layout SFC.
	const canContinue = inject('isFeatureComplete')
	const featureComplete = ref<boolean>(false)

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
					allSectionsMap.setKey(sectionKey, {
						...sectionDetails,
						isLocked: false,
					})
				}
			})
		} else {
			// if there is NOT a next available feature
			allSectionsAsArray.forEach(([sectionKey, sectionDetails]) => {
				if (sectionDetails.featureType === null) {
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
