<template>
	<div aria-live="polite" v-if="areSectionsAvailable">
		<transition mode="out-in" name="opacity">
			<BaseButton
				v-if="!featureMarkedComplete && !isLastSection"
				:isDisabled="!featureProgressStore[id].attemptsFinished"
				:class="$style.featureCompleteBtn"
				:text="
					!featureProgressStore[id].attemptsFinished
						? 'Complete activity to&nbsp;continue'
						: 'Ready to continue?'
				"
				@btnClick="setComplete($event, false)"
			/>
			<div :class="$style.continueBtns" v-else>
				<div :class="$style.pdfSave">
					<p
						v-if="shouldDisplayVisualFeedback"
						:class="$style.pdfSave__feedback"
					>
						{{ pdfStatusUpdate }}
					</p>

					<BaseButton
						:text="shouldDisplayVisualFeedback ? 'Save again?' : 'Save as PDF?'"
						:aria-label="
							shouldDisplayVisualFeedback
								? `Save ${$allSections[id].title} as PDF again?`
								: `Save ${$allSections[id].title} as PDF?`
						"
						:class="$style.pdfSave__btn"
						@btnClick="setComplete($event, true)"
					/>
				</div>
				<BaseIndicator
					v-if="!isLastSection"
					text="Scoll to continue"
					:isHidden="id !== $currSection.id"
					:goTo="`#${$nextSection}`"
				/>
			</div>
		</transition>
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
	import useAreSectionsAvailable from '../../composables/useAreSectionsAvailable'

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

	const pdfStatusUpdate = computed(() => {
		if (featureProgressStore[props.id].pdfGenStatus.isDownloading)
			return 'Downloading…'
		if (featureProgressStore[props.id].pdfGenStatus.isComplete)
			return 'Download complete!'
		if (featureProgressStore[props.id].pdfGenStatus.isFailed)
			return 'Failed to download. Try again?'

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
	.featureCompleteBtn,
	.pdfSave {
		display: flex;
		flex-flow: row nowrap;
		justify-content: center;
		align-items: center;
		margin-top: var(--s4);
	}
	.featureCompleteBtn {
		width: 100%;
		border-radius: var(--s10);
	}
	.pdfSave {
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
			border-right: 0;
			border-radius: var(--s10) 0 0 var(--s10);
		}
		&__btn:not(:only-child) {
			border-radius: 0 var(--s10) var(--s10) 0;
		}
	}
</style>
