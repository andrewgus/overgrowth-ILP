<template>
	<TransitionGroup tag="div" name="opacity" v-if="areSectionsAvailable" :class="[
		$style.activityCompleteBtns,
		{
			[$style.attemptComplete]:
				activityProgressStore[id].isAttemptsFinished &&
				!$allSections[id].isActivityComplete,
		},
	]">
		<BaseButton key="0" v-if="showCompleteBtn" :isDisabled="!activityProgressStore[id].isAttemptsFinished"
			:class="$style.activityCompleteBtn" :text="!activityProgressStore[id].isAttemptsFinished
				? `Complete ${$allSections[id].activityType} activity&nbsp;to&nbsp;continue`
				: `Lock in ${$allSections[id].activityType} &amp; continue?`
				" @btnClick="setComplete" />
		<template key="1" v-else>
			<template key='showPdfBtn' v-if='showSavePdfBtn'>
				<div key="pdfSaveDiv" :class="$style.pdfSave">
					<p v-show="shouldDisplayVisualFeedback" key="pdfFeedback" :class="$style.pdfSave__feedback"
						role="status">
						{{ pdfStatusUpdate }}
					</p>
					<BaseButton key="pdfSaveBtn" :text="shouldDisplayVisualFeedback
						? 'Save again?'
						: 'Save your work as a PDF?'
						" :aria-label="shouldDisplayVisualFeedback
		? `Optional: Save ${$allSections[id].title} as a PDF again?`
		: `Optional: Save ${$allSections[id].title} as a PDF?`
		" :class="$style.pdfSave__btn" @btnClick="saveAsPDF" />
				</div>
			</template>

			<BaseIndicator :class="$style.continueIndicator" key="continueIndicator" v-if="!isLastActivity"
				text="Continue to next section" :isHidden="id !== $currSection.id" :goTo="`#${nextSection}`" />
		</template>
	</TransitionGroup>
	<div class="visuallyHidden" aria-live="assertive">
		{{ ariaLiveAnnouncement }}
	</div>
</template>

<script setup lang="ts">
import { computed, nextTick, inject, type Ref, watch } from 'vue'
import { mapStores } from '@nanostores/vue'
import {
	allSectionsMap,
	currSectionMap,
	useSetCurrSection,
	nextSectionAfterID,
	useIsLastActivity,
	useSetActivityComplete,
} from '../../store/lessonStore'
import { activityProgressStore } from '../../store/activityOptionsStore'
import BaseButton from '../base/BaseButton.vue'
import BaseIndicator from '../base/BaseIndicator.vue'
import useAreSectionsAvailable from '../../composables/useAreSectionsAvailable'
import {
	setAriaLiveAnnouncement,
	ariaLiveAnnouncement,
} from '../../composables/useSetAriaLiveAnnouncement'

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
const isLastActivity = useIsLastActivity(activityProgressStore[props.id].id)
const wantsNoMoreAlerts = inject(
	'fromInteractiveActivityWantsNoMoreAlerts'
) as Ref<boolean>

watch(activityProgressStore[props.id], (newValue) => {
	newValue.isAttemptsFinished
		? setAriaLiveAnnouncement('Continue button is now clickable.')
		: setAriaLiveAnnouncement('Complete activity to continue.')
})

const ensureCorrectSection = (target: EventTarget) => {
	const btn = target as HTMLButtonElement
	if (!btn) return
	const activitySection = btn.closest('article') as HTMLElement

	if (activitySection.id !== $currSection.value.id) {
		activitySection.scrollIntoView({ 'block': 'start' })
		useSetCurrSection(activitySection.id)
	}
	return activitySection
}

const saveAsPDF = async ({ target }: Event) => {
	ensureCorrectSection(target as EventTarget)

	activityProgressStore[props.id].pdfGenStatus = {
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
	const thisSection = ensureCorrectSection(target as EventTarget) as HTMLElement
	useSetActivityComplete()

	if (wantsNoMoreAlerts.value) activityProgressStore.wantsNoMoreAlerts = true

	await nextTick()

	const finalFeedbackEl = thisSection.querySelector('div[class*="callOutBox"]') as HTMLElement
	const nextSectionLinkEl = thisSection.querySelector(
		'a[class*="_indicator"]'
	) as HTMLElement
	// if there is finalFeedback, then focus there, but let SR users know they can continue
	if (!!finalFeedbackEl) {
		finalFeedbackEl.focus()
		finalFeedbackEl.scrollIntoView({ behavior: 'smooth', block: "center", inline: "nearest" })
		setAriaLiveAnnouncement('You can continue to next section.');
	} else {
		// this does not need aria-live, as the link name describes it.
		nextSectionLinkEl.focus()
	}

}

const pdfStatusUpdate = computed(() => {
	if (activityProgressStore[props.id].pdfGenStatus.isDownloading)
		return 'PDF Downloading…'
	if (activityProgressStore[props.id].pdfGenStatus.isComplete)
		return 'PDF Download complete!'
	if (activityProgressStore[props.id].pdfGenStatus.isFailed)
		return 'PDF Failed to download. Try again?'

	return ''
})

const shouldDisplayVisualFeedback = computed(() => {
	const pdfStatusAsArray = Object.entries(
		activityProgressStore[props.id].pdfGenStatus
	)
	const isAttemptingDownload = pdfStatusAsArray.some(([_, isDownloading]) => {
		return isDownloading === true
	})
	return isAttemptingDownload
})
const showCompleteBtn = computed(() => {
	// this activity is not complete && if it is the last section, then only show if it is not a reflection activity, otherwise always show.
	// This is so that, if a reflection is last and would there be used as a FinaleReflectionReveal component, it should just jump to save as PDF. But if it is a choice or practice, that needs to be completed for feedback, even if it is the last section.
	return !$allSections.value[props.id].isActivityComplete && (isLastActivity ? $allSections.value[props.id].activityType !== 'reflection' : true)
})
// NOTE: For now, only using savePDF button on the FinaleReflectionReveal because of some large issues getting the PDF to render content corrctly (i.e. css content will not render when needed). Once fixed, savePDF button will return for all activities.
const showSavePdfBtn = computed(() => {
	return isLastActivity && $allSections.value[props.id].activityType == 'reflection'
})
</script>

<style module lang="scss">
@use '../../styles/mixins/containerStyles.scss';

.activityCompleteBtns {
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

.activityCompleteBtn {
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

		&:not([style*='display: none'])+.pdfSave__btn {
			border-radius: 0 var(--s10) var(--s10) 0;
		}
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
