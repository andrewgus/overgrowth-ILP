<template>
	<div aria-live="polite">
		<transition name="opacity" mode="out-in">
			<template v-if="!featureMarkedComplete && isNotOnLastSection">
				<transition mode="out-in" name="flourish">
					<BaseButton
						v-if="!featureProgressStore[id].attemptsFinished"
						:isDisabled="true"
						:class="$style.featureIncompleteBtn"
						text="Complete activity to&nbsp;continue"
					/>
					<div :class="$style.completeBtns" v-else>
						<BaseButton
							text="Continue?"
							:class="$style.featureComMarkedpleteBtn"
							@btnClick="setComplete($event, false)"
						/>
						<BaseSeparator orientation="vertical" color="var(--darkGray)" />
						<BaseButton
							:isDisabled="!featureProgressStore[id].attemptsFinished"
							text="Save&nbsp;work&nbsp;as&nbsp;PDF and&nbsp;continue?"
							:class="$style.featureComMarkedpleteBtn"
							@btnClick="setComplete($event, true)"
						/>
					</div>
				</transition>
			</template>
			<div v-else>
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
					v-if="isNotOnLastSection"
					text="Scoll to continue"
					:hidden="id !== $currSection.id"
					:goTo="`#${$nextSection}`"
				></BaseIndicator>
			</div>
		</transition>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue'
	import { useStore } from '@nanostores/vue'
	import {
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

	const props = defineProps({
		id: {
			type: String,
			required: true,
		},
	})
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

	const isNotOnLastSection = computed(
		() => areSectionsAvailable.value && !isLastSection
	)

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
	.featureIncompleteBtn,
	.completeBtns {
		display: flex;
		flex-flow: row nowrap;
		justify-content: center;
		align-items: stretch;
		width: 100%;
		border-radius: var(--s10);
		min-height: var(--s5);
	}

	.completeBtns {
		.featureComMarkedpleteBtn {
			flex: 1;
			display: block;
			margin: 0 auto;

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
