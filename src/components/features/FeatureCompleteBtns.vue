<template>
	<TransitionGroup
		tag="div"
		name="opacity"
		aria-live="polite"
		v-if="areSectionsAvailable"
		:class="{
			[$style.attemptComplete]:
				featureProgressStore[id].isAttemptsFinished && !featureMarkedComplete,
		}"
	>
		<BaseButton
			key="0"
			v-if="!featureMarkedComplete && !isLastSection"
			:isDisabled="!featureProgressStore[id].isAttemptsFinished"
			:class="$style.featureCompleteBtn"
			:text="
				!featureProgressStore[id].isAttemptsFinished
					? 'Complete activity to&nbsp;continue'
					: 'Ready to continue?'
			"
			@btnClick="setComplete"
		/>
		<template key="1" v-else>
			<div key="pdfSaveDiv" :class="$style.pdfSave">
				<p
					key="pdfFeedback"
					v-if="shouldDisplayVisualFeedback"
					:class="$style.pdfSave__feedback"
				>
					{{ pdfStatusUpdate }}
				</p>
				<BaseButton
					key="pdfSaveBtn"
					:text="shouldDisplayVisualFeedback ? 'Save again?' : 'Save as PDF?'"
					:aria-label="
						shouldDisplayVisualFeedback
							? `Save ${$allSections[id].title} as PDF again?`
							: `Save ${$allSections[id].title} as PDF?`
					"
					:class="$style.pdfSave__btn"
					@btnClick="saveAsPDF"
				/>
			</div>
			<BaseIndicator
				:class="$style.continueIndicator"
				key="continueIndicator"
				v-if="!isLastSection"
				text="Scoll to continue"
				:isHidden="id !== $currSection.id"
				:goTo="`#${$nextSection}`"
			/>
		</template>
	</TransitionGroup>
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
	import getLocalStorage from '../../service/useGetLocalStorage'

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
	const localStorageCompletion = getLocalStorage(
		props.id,
		'isFeatureComplete'
	) as boolean

	if (localStorageCompletion)
		featureMarkedComplete.value = localStorageCompletion

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
	}

	const setComplete = ({ target }: Event) => {
		const clicked = target as HTMLElement
		if (!clicked) return

		const thisSection = clicked.closest('section')
		useSetCurrSection(thisSection!.id)

		if (!featureMarkedComplete.value) {
			useSetFeatureComplete()
			featureMarkedComplete.value = true
			// FIXME: the below prop should not be on featureProgress. It should come from allSections, but I believe that is already set with useSetFeatureComplete
			// featureProgressStore[props.id].isFeatureComplete =
			// 	featureMarkedComplete.value
		}
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
	@use '../../styles/mixins.scss';

	.attemptComplete {
		position: sticky;
		bottom: var(--s-4);
	}

	.featureCompleteBtn {
		grid-area: pdfSave-indicator/topLine/indicator-end/bottomLine;
		align-self: end;
		width: 100%;
		border-radius: var(--s10);
	}
	.pdfSave {
		grid-area: pdfSave-Start/topLine/pdfSave-indicator/bottomLine;
		margin: 0 auto var(--s-4);
		width: fit-content;
		@include mixins.flexCenter;
		&__feedback,
		&__btn {
			@include mixins.flexCenter;
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
	.continueIndicator {
		grid-area: pdfSave-indicator/topLine/indicator-end/bottomLine;
	}
</style>
<style scoped lang="scss">
	@use '../../styles/mixins.scss';
	@include mixins.opacityTransition();
	.opacity-enter-active {
		transition-delay: var(--timeShort);
	}
</style>
