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
			Heads&nbsp;up!&nbsp;Once&nbsp;completed,&nbsp;this
			{{
				$allSections[id].featureType
			}}&nbsp;activity&nbsp;<strong>cannot</strong>&nbsp;be&nbsp;turned&nbsp;off&nbsp;later.
		</p>
	</transition>
	<transition mode="out-in">
		<div
			v-if="!featureComplete && areSectionsAvailable && !isLastSection"
			aria-live="polite"
			:class="$style.completeBtns"
		>
			<BaseButton
				v-if="!canContinueStore[id].attemptFinished"
				:isDisabled="true"
				:class="$style.featureCompleteBtn"
				text="Complete activity to&nbsp;continue"
			/>
			<BaseButton
				v-if="canContinueStore[id].attemptFinished"
				text="Continue?"
				:class="$style.featureCompleteBtn"
				@btnClick="setComplete($event, false)"
			/>
			<BaseSeparator
				v-if="canContinueStore[id].attemptFinished"
				orientation="vertical"
				color="var(--darkGray)"
			/>
			<BaseButton
				v-if="canContinueStore[id].attemptFinished"
				:isDisabled="!canContinueStore[id].attemptFinished"
				text="Save&nbsp;work&nbsp;as&nbsp;PDF and&nbsp;continue?"
				:class="$style.featureCompleteBtn"
				@btnClick="setComplete($event, true)"
			/>
		</div>
		<div v-else>
			<BaseButton
				v-if="!shouldDisplayVisualFeedback"
				text="Save as PDF?"
				:class="$style.featureSaveOnlyBtn"
				@btnClick="setComplete($event, true)"
			/>
			<p v-if="shouldDisplayVisualFeedback" :class="$style.pdfSaveFeedback">
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
	import BaseSeparator from '../base/BaseSeparator.vue'
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

	const setComplete = ({ target }: Event, toSave: boolean) => {
		const clicked = target as HTMLElement
		if (!clicked) return

		const thisSection = clicked.closest('section')
		useSetCurrSection(thisSection!.id)

		useSetFeatureComplete()
		featureComplete.value = true
		if (toSave) saveAsPDF()
	}

	const pdfStatusUpdate = computed(() => {
		if (pdfGeneratorStatusStore[props.id].isFailed)
			return 'Failed to download. Could not create PDF. Try again?'
		if (pdfGeneratorStatusStore[props.id].isComplete)
			return 'PDF download complete!'
		if (pdfGeneratorStatusStore[props.id].isDownloading)
			return 'Downloading PDF…'
	})
	const shouldDisplayVisualFeedback = computed(() => {
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
	.continueWarning + .completeBtns > .featureCompleteBtn {
		border-radius: 0 0 var(--s-8) var(--s-8);
	}
	.completeBtns {
		display: flex;
		flex-flow: row nowrap;
		justify-content: center;
		align-items: stretch;
		.featureCompleteBtn {
			flex: 1;
			display: block;
			margin: 0 auto;
			min-height: var(--s5);

			&:first-child:not(:only-child) {
				border-right: 0;
				border-radius: var(--s10) 0 0 var(--s10);
			}
			&:last-child:not(:only-child) {
				border-left: 0;
				border-radius: 0 var(--s10) var(--s10) 0;
			}
		}
	}
	.pdfSaveFeedback,
	.featureSaveOnlyBtn {
		display: flex;
		align-items: center;
		font-size: var(--s-1);
		margin: 0 auto var(--s-4);
		padding: var(--s-4) var(--s2);
		text-align: center;
		width: fit-content;
		border-radius: var(--s10);
		max-height: var(--s4);
	}
	.pdfSaveFeedback {
		font-style: italic;
		background-color: var(--green3);
		border-color: transparent;
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
