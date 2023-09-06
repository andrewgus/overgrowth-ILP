<template>
	<article class="section activity" :class="setActivityType" tabindex="-1">
		<h2>{{ title }}</h2>
		<BaseAlertText v-if="!activityProgressStore.wantsNoMoreAlerts" :show="!isReflection__FinaleReveal && !activityProgressStore[sectionID].isAttemptsFinished
			">
			<p>
				<span class="visuallyHidden">Important:</span>
				Heads&nbsp;up!&nbsp;Once&nbsp;complete, this&nbsp;{{
					setActivityType
				}}&nbsp;activity
				<strong>cannot</strong> be&nbsp;turned&nbsp;off&nbsp;later.
			</p>
			<div :class="$style.disableAlerts">
				<input type="checkbox" :id="`disabledAlert-${sectionID}`" @click="registerNoMoreAlerts($event)" />
				<label :for="`disabledAlert-${sectionID}`">
					Hide these alerts on all future activities
				</label>
			</div>
		</BaseAlertText>
		<div :class='$style.userInput' v-if='isDataReady'>
			<component :is="activity" v-bind="conditionalProps">
				<slot></slot>

			</component>
			<slot v-if='isActivityCompleted' name='finalFeedback'>
			</slot>
		</div>
		<ActivityCompleteBtns :id="sectionID" />
	</article>
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent, provide, onMounted } from 'vue'
import { useDoesActivityExist, type ActivityType } from '../store/lessonStore'
import {
	initActivityProgressStore,
	activityProgressStore,
} from '../store/activityOptionsStore'
import createID from '../composables/useCreateID'
import ActivityCompleteBtns from '../components/activities/ActivityCompleteBtns.vue'
import BaseAlertText from '../components/base/BaseAlertText.vue'
import useIsActivityCompleted from '../composables/useIsActivityCompleted'

type validPracticeActivityOptions = 'Matching' | 'Math'
type Props = {
	title: string
	prompts: string[]
	setActivityType: ActivityType
	isReflection__FinaleReveal?: boolean
	isPractice__setOptions?: validPracticeActivityOptions[]
	isPractice__finalFeedback?: boolean
	isPracticeMatching__itemsAndAnswers?: [string, string][]
	isPracticeMath__QsAndAs?: [string, string][]
}
const props = withDefaults(defineProps<Props>(), {
	isReflection__FinaleReveal: false,
})

const sectionID = createID(props.title)
initActivityProgressStore(sectionID)

const isActivityCompleted = useIsActivityCompleted(sectionID)

// To keep track of if user wants to disable activity alerts or not
const wantsNoMoreAlerts = ref<boolean>(false)
const registerNoMoreAlerts = ({ target }: Event) => {
	const checkbox = target as HTMLInputElement
	if (!checkbox) return
	if (checkbox.checked) {
		wantsNoMoreAlerts.value = true
	} else {
		wantsNoMoreAlerts.value = false
	}
}
provide('fromInteractiveActivityWantsNoMoreAlerts', wantsNoMoreAlerts)

// Determine which activity is should be rendered
const activity = defineAsyncComponent(() =>
	import(
		`../components/activities/${props.setActivityType.charAt(0).toUpperCase() +
		props.setActivityType.slice(1)
		}SwitchBoard.vue`
	).finally(() => {
		useDoesActivityExist(props.setActivityType)
		// only need setLocksHandler && updateLocalStorage scripts if activities are being used within a given lesson
		import('../scripts/setLocksHandler.js')
		import('../scripts/updateLocalStorage.js')
	})
)
// Determine which props are needed to be passed to async component
const conditionalProps = computed(() => {
	let activityProps: {}
	switch (props.setActivityType) {
		case 'reflection':
			activityProps = {
				prompt: props.prompts[0],
				isReflectionFinaleReveal: props.isReflection__FinaleReveal,
			}
			break
		case 'practice':
			activityProps = {
				prompts: props.prompts,
				practiceOptions: props.isPractice__setOptions,
				isMatching__itemsAndAnswers: props.isPracticeMatching__itemsAndAnswers,
				isMath__QsAndAs: props.isPracticeMath__QsAndAs
			}
			break
		case 'choice':
			activityProps = {}
			break
	}
	return { id: sectionID, ...activityProps }
})
// IMPORTANT: isDataReady ensures localStorage is ready before rendering components that use localStorage data.
const isDataReady = ref<boolean>(false)
onMounted(() => {
	isDataReady.value = true
})
</script>

<style module lang="scss">
.disableAlerts {
	max-width: 95%;
	margin-top: var(--s-6);
	display: flex;
	align-items: center;

	>input {
		height: var(--s0);
		width: var(--s0);

		&:checked {
			+label {
				font-style: italic;
				color: var(--darkGray);
			}
		}
	}

	>label {
		font-size: var(--s-1);
	}
}

.userInput {
	display: flex;
	flex-flow: column nowrap;

	&>label {
		margin-bottom: var(--s0);
	}

	>div:not(.visuallyHidden)+div:not(.visuallyHidden) {
		margin-top: var(--s6);
	}
}
</style>
