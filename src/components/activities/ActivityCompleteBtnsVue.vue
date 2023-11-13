<template>
	<TransitionGroup tag="div" name="opacity" v-if="areSectionsAvailable" :class="[
		$style.activityCompleteBtns,
		{
			[$style.attemptComplete]:
				activityProgressStore[id].isAttemptsFinished &&
				!$allSections[id].isActivityComplete,
		},
	]">
		<BaseButtonVue key="0" v-if="showCompleteBtn" :isDisabled="!activityProgressStore[id].isAttemptsFinished"
			:class="$style.activityCompleteBtn" :text="!activityProgressStore[id].isAttemptsFinished
				? `Complete ${$allSections[id].activityType} activity&nbsp;to&nbsp;continue`
				: `Continue`
				" @btnClick="setComplete" />
		<template key="1" v-else>
			<template key='showPdfBtn' v-if='isReflectionFinaleReveal'>
				<div key="pdfSaveDiv" :class="$style.pdfSave">
					<p :id='`${props.id}-savePDFtip`' key='savePDFtip'>Need these thoughts for an assignment or discussion?
					</p>
					<div>
						<p v-show="shouldDisplayVisualFeedback" key="pdfFeedback" :class="$style.pdfSave__feedback"
							role="status">
							{{ pdfStatusUpdate }}
						</p>
						<BaseButtonVue key="pdfSaveBtn" :text="shouldDisplayVisualFeedback
							? 'Save again'
							: 'Save your thoughts as a PDF'
							" :aria-label="shouldDisplayVisualFeedback
		? `Optional: Save ${$allSections[id].title} as a PDF again?`
		: `Optional: Save ${$allSections[id].title} as a PDF?`
		" :aria-describedby='`${props.id}-savePDFtip`' :class="$style.pdfSave__btn" @btnClick="saveAsPDF" />
					</div>
				</div>
			</template>
			<BaseIndicatorVue :class="$style.continueIndicator" key="continueIndicator"
				v-if="!isReflectionFinaleReveal && !isLastSection" text="Continue to next section"
				:isHidden="id !== $currSection.id" :goTo="`#${nextSection}`" />
		</template>
	</TransitionGroup>
</template>

<script setup lang="ts">
import { computed, nextTick, watch } from 'vue'
import { mapStores } from '@nanostores/vue'
import {
	allSectionsMap,
	currSectionMap,
	useSetCurrSection,
	nextSectionAfterID,
	useSetActivityComplete,
	useIsLastSection
} from '../../store/lessonStore'
import { activityProgressStore, initActivityProgressStore } from '../../store/activityOptionsStore'
import BaseButtonVue from '../base/BaseButtonVue.vue'
import BaseIndicatorVue from '../base/BaseIndicatorVue.vue'
import useAreSectionsAvailable from '../../composables/useAreSectionsAvailable'
import { setAriaLiveAnnouncement } from '../../store/ariaLiveStore'

type Props = {
	id: string
	isReflectionFinaleReveal?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	isReflectionFinaleReveal: false
})
// initalize activityProgressStore to track learner's progress
initActivityProgressStore(props.id)

const { allSectionsMap: $allSections, currSectionMap: $currSection } =
	mapStores({ allSectionsMap, currSectionMap })

const { areSectionsAvailable } = useAreSectionsAvailable()
const nextSection = nextSectionAfterID(props.id)
const isLastSection = useIsLastSection(activityProgressStore[props.id].id)

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

	await nextTick()
	const nextSectionLinkEl = thisSection.querySelector(
		'a[class*="_indicator"]'
	) as HTMLElement
	// focus on link to next section
	nextSectionLinkEl.focus()

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
	// this activity is not complete && it's not a reflection finale reveal component
	return !$allSections.value[props.id].isActivityComplete && !props.isReflectionFinaleReveal
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
	margin: var(--s8) auto var(--s2);
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
	flex-flow: column nowrap;

	>p {
		font-size: var(--s-1);
		margin-bottom: var(--s-4);
		font-style: italic;
	}

	>div {
		display: flex;
		flex-flow: row nowrap;
	}

	&__feedback,
	&__btn {
		animation-delay: var(--timeShort);
		@include containerStyles.flexCenter;
		padding: var(--s-4) var(--s-2);
		text-align: center;
		border-radius: var(--s10);
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
