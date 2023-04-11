<template>
	<transition>
		<p
			v-if="
				!canContinueStore[id].attemptFinished &&
				areSectionsAvailable &&
				!isLastSection
			"
			:class="$style.continueWarning"
		>
			Heads&nbsp;up!&nbsp;Once&nbsp;completed, this&nbsp;{{
				$allSections[id].featureType
			}}&nbsp;activity&nbsp;<strong>cannot</strong>&nbsp;be&nbsp;turned&nbsp;off&nbsp;later.
		</p>
	</transition>
	<transition mode="out-in">
		<BaseButton
			v-if="
				!!pdfGeneratorStatusStore[id] &&
				areSectionsAvailable &&
				isLastSection &&
				!featureComplete
			"
			text="Save as PDF?"
			:isDisabled="
				pdfGeneratorStatusStore[id].isDownloading ||
				pdfGeneratorStatusStore[id].isComplete
			"
			:class="[
				$style.featureCompleteBtn,
				{ [$style.pdfSaveFeedback]: displayFeedback },
			]"
			@btnClick="setComplete"
		/>
		<BaseButton
			v-else-if="!featureComplete"
			:isDisabled="!canContinueStore[id].attemptFinished"
			:text="
				!!pdfGeneratorStatusStore[id]
					? 'Save work as PDF and continue?'
					: 'Continue?'
			"
			:aria-label="
				!canContinueStore[id].attemptFinished
					? 'Complete the activity to continue'
					: ''
			"
			:class="$style.featureCompleteBtn"
			@btnClick="setComplete"
		/>
		<div v-else>
			<p v-if="!!pdfGeneratorStatusStore[id]" :class="$style.pdfSaveFeedback">
				{{ pdfStatusUpdate }}
			</p>
			<BaseIndicator
				v-if="areSectionsAvailable && !isLastSection"
				text="Scoll to continue"
				:hidden="id !== $currSection.id"
				:goTo="`#${$nextSection}`"
			></BaseIndicator>
		</div>
	</transition>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue'
	import { useStore } from '@nanostores/vue'
	import {
		allSectionsMap,
		currSectionMap,
		useSetCurrSection,
		nextSectionComputed,
		useIsLastSection,
		useSetFeatureComplete,
	} from '../../store/lessonStore'
	import BaseButton from '../base/BaseButton.vue'
	import BaseIndicator from '../base/BaseIndicator.vue'
	import useAreSectionsAvailable from '../../composables/useAreSectionsAvailable'
	import {
		pdfGeneratorStatusStore,
		canContinueStore,
	} from './featureOptionsStore'

	const props = defineProps({
		id: {
			type: String,
			required: true,
		},
	})

	const $allSections = useStore(allSectionsMap)
	const $currSection = useStore(currSectionMap)
	const $nextSection = useStore(nextSectionComputed)
	const areSectionsAvailable = useAreSectionsAvailable()
	const isLastSection = useIsLastSection(canContinueStore[props.id].id)

	const featureComplete = ref<boolean>(false)

	const saveAsPDF = async () => {
		pdfGeneratorStatusStore[props.id].isDownloading = true
		const { default: generatePDF } = await import(
			'../../composables/useSaveAsPDF'
		)
		await generatePDF($currSection.value)
		if (!featureComplete.value) featureComplete.value = true
	}

	const setComplete = ({ target }: Event) => {
		const clicked = target as HTMLElement
		if (!clicked) return

		const thisSection = clicked.closest('section')
		useSetCurrSection(thisSection!.id)

		useSetFeatureComplete()
		featureComplete.value = true
		if (!!pdfGeneratorStatusStore[props.id]) saveAsPDF()
	}

	const pdfStatusUpdate = computed(() => {
		if (pdfGeneratorStatusStore[props.id].isFailed)
			return 'Failed to download. Could not create PDF. Try again?'
		if (pdfGeneratorStatusStore[props.id].isComplete)
			return 'PDF download complete!'
		if (pdfGeneratorStatusStore[props.id].isDownloading)
			return 'Downloading PDF…'
	})
	const displayFeedback = computed(() => {
		const pdfStatusAsArray = Object.entries(pdfGeneratorStatusStore[props.id])
		const isAttemptingDownload = pdfStatusAsArray.some(([_, isDownloading]) => {
			return isDownloading === true
		})
		return isAttemptingDownload
	})
</script>

<style module lang="scss">
	.continueWarning {
		width: 100%;
		text-align: center;
		padding: var(--s-4) var(--s-2);
		margin: var(--s0) auto 0;
		background-color: var(--yellow5);
		border-width: 1px 1px 0 1px;
		border-style: solid;
		border-color: var(--darkGray);
		border-radius: var(--s10) var(--s10) 0 0;

		&,
		> * {
			font-size: var(--s-1);
		}
	}
	.continueWarning + .featureCompleteBtn {
		transition: border-radius var(--timeShort) ease-in-out;
		border-radius: 0 0 var(--s-8) var(--s-8);
	}
	.featureCompleteBtn {
		display: block;
		width: 100%;
		margin: 0 auto;
	}
	.pdfSaveFeedback {
		margin: 0 auto;
		padding: var(--s-4) var(--s-2);
		text-align: center;
		width: fit-content;
		font-style: italic;
		opacity: 1;
		background-color: var(--green3);
		border: 0;
		border-radius: var(--s10);
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
