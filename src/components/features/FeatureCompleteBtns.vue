<template>
	<TransitionGroup
		tag="div"
		name="opacity"
		v-if="areSectionsAvailable"
		:class="[
			$style.featureCompleteBtns,
			{
				[$style.attemptComplete]:
					featureProgressStore[id].isAttemptsFinished &&
					!$allSections[id].isFeatureComplete,
			},
		]"
	>
		<BaseButton
			key="0"
			v-if="!$allSections[id].isFeatureComplete && !isLastSection"
			:isDisabled="!featureProgressStore[id].isAttemptsFinished"
			:class="$style.featureCompleteBtn"
			:text="
				!featureProgressStore[id].isAttemptsFinished
					? `Complete ${$allSections[id].featureType} activity&nbsp;to&nbsp;continue`
					: `Lock in ${$allSections[id].featureType} &amp; continue?`
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
					:text="
						shouldDisplayVisualFeedback
							? 'Save again?'
							: 'Save your work as a PDF?'
					"
					srText="Optional"
					:aria-label="
						shouldDisplayVisualFeedback
							? `Save ${$allSections[id].title} as a PDF again?`
							: `Save ${$allSections[id].title} as a PDF?`
					"
					:class="$style.pdfSave__btn"
					@btnClick="saveAsPDF"
				/>
			</div>
			<BaseIndicator
				:class="$style.continueIndicator"
				key="continueIndicator"
				v-if="!isLastSection"
				text="Continue to next section"
				:isHidden="id !== $currSection.id"
				:goTo="`#${nextSection}`"
			/>
		</template>
	</TransitionGroup>
</template>

<script setup lang="ts">
	import { computed, nextTick } from 'vue'
	import { mapStores } from '@nanostores/vue'
	import {
		allSectionsMap,
		currSectionMap,
		useSetCurrSection,
		nextSectionAfterID,
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

	const { allSectionsMap: $allSections, currSectionMap: $currSection } =
		mapStores({ allSectionsMap, currSectionMap })

	const { areSectionsAvailable } = useAreSectionsAvailable()
	const nextSection = nextSectionAfterID(props.id)
	const isLastSection = useIsLastSection(featureProgressStore[props.id].id)

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

	const setComplete = async ({ target }: Event) => {
		const clicked = target as HTMLButtonElement
		if (!clicked) return

		const thisSection = clicked.closest('article') as HTMLElement

		useSetCurrSection(thisSection.id)
		useSetFeatureComplete()
		await nextTick()
		const saveBtnEl = thisSection.querySelector(
			'button[class*="pdfSave__btn"]'
		) as HTMLButtonElement
		saveBtnEl.focus()
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
	@use '../../styles/mixins/containerStyles.scss';

	.featureCompleteBtns {
		width: 100%;
		display: grid;
		grid-template-rows: [pdfSave-Start] min-content [pdfSave-indicator] min-content [indicator-end];
		grid-template-columns: [topLine] 1fr [bottomLine];
		align-items: end;
		justify-content: center;
		margin: var(--s2) auto;
	}

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
		margin: 0 auto var(--s-2);
		width: fit-content;
		@include containerStyles.flexCenter;
		&__feedback,
		&__btn {
			animation-delay: var(--timeShort);
			@include containerStyles.flexCenter;
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
		background-color: var(--white);
		grid-area: pdfSave-indicator/topLine/indicator-end/bottomLine;
	}
</style>
<style scoped lang="scss">
	@use '../../styles/mixins/transitions.scss';
	@include transitions.vueOpacity();
	.opacity-enter-active {
		transition-delay: var(--timeShort);
	}
</style>
