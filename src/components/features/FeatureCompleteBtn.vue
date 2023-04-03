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
			v-if="willSaveAsPDF && areSectionsAvailable && isLastSection"
			:text="pdfStatusUpdate"
			:isDisabled="
				pdfGeneratorStatusStore.isDownloading ||
				pdfGeneratorStatusStore.isComplete
			"
			:class="$style.featureCompleteBtn"
			@btnClick="setComplete"
		/>
		<BaseButton
			v-else-if="!featureComplete"
			:isDisabled="!canContinueFrom.isComplete"
			:text="willSaveAsPDF ? 'Save work as PDF and continue?' : 'Continue?'"
			:class="$style.featureCompleteBtn"
			@btnClick="setComplete"
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
		currSectionMap,
		useSetCurrSection,
		nextSectionComputed,
		useIsLastSection,
		useSetFeatureComplete,
	} from '../../store/lessonStore'
	import BaseButton from '../base/BaseButton.vue'
	import BaseIndicator from '../base/BaseIndicator.vue'
	import useAreSectionsAvailable from '../../composables/useAreSectionsAvailable'
	import { pdfGeneratorStatusStore } from './featureOptionsStore'

	const $currSection = useStore(currSectionMap)
	const $nextSection = useStore(nextSectionComputed)

	// willSaveAsPDF & canContinueFrom  provided by each feature's layout SFC.
	const willSaveAsPDF = inject('willSaveAsPDF') as boolean
	// NOTE: Should canContinueFrom actually be part of the featureStore?
	const canContinueFrom = inject('isFeatureComplete') as {
		id: string
		isComplete: boolean
	}
	const areSectionsAvailable = useAreSectionsAvailable()
	const isLastSection = useIsLastSection(canContinueFrom.id)

	const featureComplete = ref<boolean>(false)

	const saveAsPDF = async () => {
		pdfGeneratorStatusStore.isDownloading = true
		const { default: generatePDF } = await import(
			'../../composables/useSaveAsPDF'
		)
		await generatePDF($currSection.value)
		if (!featureComplete.value) featureComplete.value = true
	}

	const pdfStatusUpdate = computed(() => {
		if (pdfGeneratorStatusStore.isFailed)
			return 'Failed to download. Could not create PDF. Try again?'
		if (pdfGeneratorStatusStore.isComplete) return 'PDF download complete!'
		if (pdfGeneratorStatusStore.isDownloading) return 'Downloading PDF…'
		return 'Save as PDF?'
	})

	const setComplete = ({ target }: Event) => {
		const clicked = target as HTMLElement
		if (!clicked) return

		const thisSection = clicked.closest('section')
		useSetCurrSection(thisSection!.id)

		useSetFeatureComplete()
		featureComplete.value = true

		if (willSaveAsPDF) saveAsPDF()
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
