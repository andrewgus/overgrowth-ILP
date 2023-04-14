<template>
	<div aria-live="polite">
		<opacityTransition>
			<p
				v-if="!featureProgressStore[id].attemptsFinished && isNotOnLastSection"
				:class="$style.continueWarning"
			>
				Heads&nbsp;up!&nbsp;Once&nbsp;completed, this&nbsp;{{
					$allSections[id].featureType
				}}&nbsp;activity
				<strong>cannot</strong>&nbsp;be&nbsp;turned&nbsp;off&nbsp;later.
			</p>
		</opacityTransition>
		<opacityTransition mode="out-in">
			<div
				v-if="!featureMarkedComplete && isNotOnLastSection"
				:class="$style.completeBtns"
			>
				<BaseButton
					v-if="!featureProgressStore[id].attemptsFinished"
					:isDisabled="true"
					:class="$style.featureComMarkedpleteBtn"
					text="Complete activity to&nbsp;continue"
				/>
				<BaseButton
					v-if="featureProgressStore[id].attemptsFinished"
					text="Continue?"
					:class="$style.featureComMarkedpleteBtn"
					@btnClick="setComplete($event, false)"
				/>
				<BaseSeparator
					v-if="featureProgressStore[id].attemptsFinished"
					orientation="vertical"
					color="var(--darkGray)"
				/>
				<BaseButton
					v-if="featureProgressStore[id].attemptsFinished"
					:isDisabled="!featureProgressStore[id].attemptsFinished"
					text="Save&nbsp;work&nbsp;as&nbsp;PDF and&nbsp;continue?"
					:class="$style.featureComMarkedpleteBtn"
					@btnClick="setComplete($event, true)"
				/>
			</div>
			<div class="continueAndFeedback" v-else>
				<div :class="$style.pdfSave">
					<p
						v-if="shouldDisplayVisualFeedback"
						:class="$style.pdfSave__feedback"
					>
						{{ pdfStatusUpdate }}
					</p>
					<BaseSeparator
						v-if="shouldDisplayVisualFeedback"
						orientation="vertical"
						color="var(--darkGray)"
					/>
					<BaseButton
						:text="shouldDisplayVisualFeedback ? 'Save again?' : 'Save as PDF'"
						:class="$style.pdfSave__btn"
						@btnClick="setComplete($event, true)"
					/>
				</div>
				<BaseIndicator
					v-if="areSectionsAvailable && !isLastSection"
					text="Scoll to continue"
					:hidden="id !== $currSection.id"
					:goTo="`#${$nextSection}`"
				></BaseIndicator>
			</div>
		</opacityTransition>
	</div>
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
	import { featureProgressStore } from '../../store/featureOptionsStore'
	import BaseButton from '../base/BaseButton.vue'
	import BaseIndicator from '../base/BaseIndicator.vue'
	import BaseSeparator from '../base/BaseSeparator.vue'
	import useAreSectionsAvailable from '../../composables/useAreSectionsAvailable'
	import opacityTransition from '../../composables/opacityTransition.vue'

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
	const isLastSection = useIsLastSection(featureProgressStore[props.id].id)

	const featureMarkedComplete = ref<boolean>(false)

	const saveAsPDF = async () => {
		featureProgressStore[props.id].pdfGenStatus = {
			isDownloading: true,
			isComplete: false,
			isFailed: false,
		}
		const { default: generatePDF } = await import(
			'../../composables/useSaveAsPDF'
		)
		await generatePDF($currSection.value)
		if (!featureMarkedComplete.value) featureMarkedComplete.value = true
	}
	const setComplete = ({ target }: Event, toSave: boolean) => {
		const clicked = target as HTMLElement
		if (!clicked) return

		const thisSection = clicked.closest('section')
		useSetCurrSection(thisSection!.id)

		if (!featureMarkedComplete.value) useSetFeatureComplete()
		featureMarkedComplete.value = true

		if (toSave) saveAsPDF()
	}

	const isNotOnLastSection = computed(() => {
		return areSectionsAvailable.value && !isLastSection
	})

	const pdfStatusUpdate = computed(() => {
		if (featureProgressStore[props.id].pdfGenStatus.isFailed)
			return 'Failed to download. Try again?'
		if (featureProgressStore[props.id].pdfGenStatus.isComplete)
			return 'Download complete!'
		if (featureProgressStore[props.id].pdfGenStatus.isDownloading)
			return 'Downloading PDF…'

		return 'Save as PDF'
	})
	const shouldDisplayVisualFeedback = computed(() => {
		const pdfStatusAsArray = Object.entries(
			featureProgressStore[props.id].pdfGenStatus
		)
		const isAttemptingDownload = pdfStatusAsArray.some(([_, isDownloading]) => {
			return isDownloading === true
		})
		return isAttemptingDownload
	})
</script>

<style module lang="scss">
	@mixin btnLeft {
		border-right: 0;
		border-radius: var(--s10) 0 0 var(--s10);
	}
	@mixin btnRight {
		border-left: 0;
		border-radius: 0 var(--s10) var(--s10) 0;
	}

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
	}
	.continueWarning + .completeBtns > .featureComMarkedpleteBtn {
		border-radius: 0 0 var(--s-8) var(--s-8);
	}
	.completeBtns {
		display: flex;
		flex-flow: row nowrap;
		justify-content: center;
		align-items: stretch;
		.featureComMarkedpleteBtn {
			flex: 1;
			display: block;
			margin: 0 auto;
			min-height: var(--s5);
			&:first-child:not(:only-child) {
				@include btnLeft();
			}
			&:last-child:not(:only-child) {
				@include btnRight();
			}
		}
	}
	.pdfSave {
		display: flex;
		flex-flow: row nowrap;
		justify-content: center;
		align-items: center;
		margin-bottom: var(--s-4);
		&__feedback,
		&__btn {
			display: flex;
			justify-content: center;
			align-items: center;
			padding: var(--s-4) var(--s-2);
			text-align: center;
			border-radius: var(--s10);
			max-height: var(--s4);
		}
		&__feedback {
			opacity: 1;
			font-style: italic;
			background-color: var(--green4);
			border: 1px solid var(--darkGray);
			@include btnLeft();
		}
		&__btn:not(:only-child) {
			@include btnRight();
		}
	}
</style>
