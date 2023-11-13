<template>
	<!-- If multiple steps... -->
	<template v-if='waitForFinalFeedback && activitySteps.length > 1'>
		<template v-for='(asyncComponent, index) in asyncComponentsWithCondition' :key='index'>
			<transition name='opacity'>
				<!-- section per activityStep -->
				<section tabindex='-1' :class='$style.practiceStep' ref='activitySectionEls' v-if='showPreviousStep(index)'>
					<h3>Step {{ index + 1 }}{{ !!activitySteps && !!activityValues[index].sectionTitle ? `:
						${activityValues[index].sectionTitle}` :
						'' }}</h3>
					<div :class='$style.previousStepBtn'
						v-if='asyncComponent !== asyncComponentsWithCondition[0] && asyncComponent === asyncComponentsWithCondition.at(-1)'>
						<BaseButtonVue text='Go back one step' isForActivity @click='undoStep(index)' />
					</div>
					<div :class='$style.activity'>
						<p :id='`${id}-step-${index + 1}-prompt`'>{{
							activityValues[index].prompt
						}} <br /><mark class='highlightyellow'
								v-if='!!activitySteps[index].PickOneOfTwo?.buttonNames'><strong>Note:</strong>
								Selecting
								one choice will disable the other.</mark>
						</p>
						<!-- async load the activity within this overarching template -->
						<component :is='asyncComponent' v-bind='getConditionalProps(index)'
							@readyForNext='handleNextActivityLoad(index, $event)'>
							<template v-if='activityTypes.includes("FinalFeedback")'>
								<slot></slot>
							</template>
						</component>
					</div>
				</section>
			</transition>
		</template>
	</template>
	<template v-else-if='waitForFinalFeedback'>
		<!-- If only one step... -->
		<template v-for='(asyncComponent, index) in asyncComponentsWithCondition' :key='index'>
			<!-- section for the component -->
			<div :class='$style.activity'>
				<p :id='`${id}-step-${index + 1}-prompt`'>{{
					activityValues[index].prompt
				}} <br /><mark class='highlightyellow'
						v-if='!!activitySteps[index].PickOneOfTwo?.buttonNames'><strong>Note:</strong>
						Selecting one
						choice will
						disable the other.</mark>
				</p>
				<!-- async load the activity within this overarching template -->
				<component :is='asyncComponent' v-bind='getConditionalProps(index)'
					@readyForNext='handleNextActivityLoad(index, $event)'>
				</component>
			</div>
		</template>

	</template>
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent, watch, nextTick, onMounted } from 'vue'
import { activityProgressStore, userPracticeStore, initUserPracticeStore, type UserPracticeItems } from '../../store/activityOptionsStore';
import type { ActivitySwitchItem, ValidPracticeActivityTypes } from '../../types/ActivityTypes'
import getLocalStorage from '../../composables/useGetLocalStorage'
import BaseButtonVue from '../base/BaseButtonVue.vue';


type Props = {
	id: string
	activitySteps: ActivitySwitchItem[]
	isPreviousStepShown?: boolean
	isFinalFeedbackIncluded?: boolean
}
const props = defineProps<Props>()

const activitySectionEls = ref<HTMLElement[] | null>()
// Getting an array of the array types
const activityTypes = props.activitySteps.flatMap((step) => Object.keys(step)) as ValidPracticeActivityTypes[]
// Getting an array of each activity's properties
const activityValues = props.activitySteps.flatMap((step) => Object.values(step))

// make sure feedback and props are mounted before showed
const waitForFinalFeedback = ref<boolean>(false)
onMounted(() => {
	waitForFinalFeedback.value = true
	// if, when mounted, user had already completed every step, then allow them to continue. Need a timeout to ensure FinalFeedback is included in the array, if present.
	setTimeout(() => {
		if (isPracticeStepsComplete.value.every((step) => step === true)) activityProgressStore[props.id].isAttemptsFinished = true
	}, 330)
})

// using localStorage to determine progress thus far and apply that progress on reload.
const localStorageStepsCompleted = getLocalStorage(props.id, 'isPracticeOptionStepsComplete') as boolean[]
const allPracticeLocalStorage = getLocalStorage(props.id) as UserPracticeItems
// an array of booleans for each option used. Setting to true means that step is complete.
const isPracticeStepsComplete = ref<boolean[]>(!!localStorageStepsCompleted
	? localStorageStepsCompleted
	: props.activitySteps.map(() => false));

localStorageStepsCompleted ? initUserPracticeStore(props.id, allPracticeLocalStorage) : initUserPracticeStore(props.id)

// get asynComponents from practiceOptions selected
const asyncComponents = activityTypes.map((type) => defineAsyncComponent(() => import(`./practiceOptions/${type}Vue.vue`)));
// Only load the next asyncComponent if the previous one is complete. Will always load the first asyncComponent.
const asyncComponentsWithCondition = computed(() => {
	let prevComponentComplete = true;

	return asyncComponents.filter((_, index) => {
		if (prevComponentComplete) {
			const isComplete = isPracticeStepsComplete.value[index];
			prevComponentComplete = isComplete;
			return true;
		}
		return false;
	});
})
// When emitted, signals the current practice option is complete and to load next component
const handleNextActivityLoad = async (index: number, isCurrPracticeStepComplete: boolean) => {
	isPracticeStepsComplete.value[index] = isCurrPracticeStepComplete
	userPracticeStore[props.id].isPracticeOptionStepsComplete = isPracticeStepsComplete.value
	await nextTick();
	// check for the current ref Element
	if (!!activitySectionEls.value) {
		// determine current step depending on whether previous steps are shown or not
		let currStep
		if (!!activitySectionEls.value[index]) {
			currStep = activitySectionEls.value[index]
		}
		else {
			[currStep] = activitySectionEls.value
		}
		if (!!currStep.nextElementSibling) {
			// if a next element exists, focus on it.
			(currStep.nextElementSibling as HTMLElement).focus()
		} else {
			// else, if a currStep exists, focus on it.
			!!currStep && currStep.focus()
		}
	}
}
// determining if the element should be hidden when completing that step
const showPreviousStep = (index: number) => {
	// if the practice step is complete, and we do *not* want the previous step shown, and the current step is *not* the final step. Otherwise, show it.
	if (isPracticeStepsComplete.value[index] === true && !!props.isPreviousStepShown === false && activityTypes[index] !== activityTypes.at(-1)) {
		return false
	} else return true
}
// to undo the current step and take users back to the previous step
const undoStep = async (index: number) => {
	// set the previous item to false, so asyncComponentsWithCondition updates to show previous step
	isPracticeStepsComplete.value[index - 1] = false
	// also set the current step to false, so that it must be completed again, as they went back a step. This does not affect having completed the whole practice
	isPracticeStepsComplete.value[index] = false
	userPracticeStore[props.id].isPracticeOptionStepsComplete = isPracticeStepsComplete.value
	await nextTick()
	// check for the current ref Element
	if (!!activitySectionEls.value) {
		const prevStep = activitySectionEls.value.at(-1)
		// if a prevStep exists, focus on it.
		!!prevStep && prevStep.focus()
	}
}
// watch for when all practiceSteps are complete to signal that the attempt is finshed
watch(isPracticeStepsComplete.value, (newValue) => {
	if (newValue.every((val) => val === true)) activityProgressStore[props.id].isAttemptsFinished = true
}, { immediate: true })
// watch the practice store. If the store is reset, reset these values
watch(userPracticeStore, (newStore) => {
	if (newStore[props.id].isPracticeOptionStepsComplete.every((val) => val === false)) {
		activityProgressStore[props.id].isAttemptsFinished = false
		isPracticeStepsComplete.value.fill(false)
	}
})

// construct universal props for individual practiceOption components for v-bind
const getUniversalProps = (index: number) => {
	const lastIndex = activityTypes.length - 1
	return {
		id: props.id,
		promptID: `${props.id}-step-${index + 1}-prompt`,
		isMultisteps: activityTypes.length > 1 && index !== lastIndex,
		isStepComplete: isPracticeStepsComplete.value[index],
	};
};
// using index from v-for in <component> to choose the appropriate option-specific props in addition to the universal props via getUniversalProps
const getConditionalProps = (index: number) => {
	const universalProps = getUniversalProps(index);
	const typeSpecificProps = activityValues[index];
	// creating a new object, filteredProps, composed of universalProps && typeSpecificProps without sectionTitle and prompt
	const { sectionTitle, prompt, ...filteredProps } = { ...universalProps, ...typeSpecificProps };

	return filteredProps
};
</script>
<style module lang='scss'>
@use '../../styles/mixins/containerStyles.scss';

.practiceStep {
	margin-top: var(--s6);

	h3 {
		margin-top: 0;
	}

	>.previousStepBtn {
		>button {
			display: block;
			margin-left: auto;
			background-color: var(--lightGray);
			color: var(--blue);
			margin-right: var(--s-2);
			border-radius: var(--s0) var(--s0) 0 0;
		}
	}
}

.activity {
	@include containerStyles.interaction();
	align-self: start;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}
</style>
<style scoped lang="scss">
@use '../../styles/mixins/transitions.scss';
@include transitions.vueOpacity();
</style>