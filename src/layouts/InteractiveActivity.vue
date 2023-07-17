<template>
	<article class="section activity" :class="setActivityType" tabindex="-1">
		<h2>{{ title }}</h2>
		<BaseAlertText
			v-if="!activityProgressStore.wantsNoMoreAlerts"
			:show="
				!isFinaleReveal && !activityProgressStore[sectionID].isAttemptsFinished
			">
			<p>
				<span class="visuallyHidden">Important:</span>
				Heads&nbsp;up!&nbsp;Once&nbsp;complete, this&nbsp;{{
					setActivityType
				}}&nbsp;activity
				<strong>cannot</strong>
				&nbsp;be&nbsp;turned&nbsp;off&nbsp;later.
			</p>
			<div :class="$style.disableAlerts">
				<input
					type="checkbox"
					:id="`disabledAlert-${sectionID}`"
					@click="registerNoMoreAlerts($event)" />
				<label :for="`disabledAlert-${sectionID}`">
					Hide these alerts on all future activities
				</label>
			</div>
		</BaseAlertText>
		<component :is="activity" v-bind="conditionalProps">
			<slot></slot>
		</component>
		<ActivityCompleteBtns :id="sectionID" />
	</article>
</template>

<script setup lang="ts">
	import { ref, computed, defineAsyncComponent, provide } from 'vue'
	import { useDoesActivityExist, type ActivityType } from '../store/lessonStore'
	import {
		initActivityProgressStore,
		activityProgressStore,
	} from '../store/activityOptionsStore'
	import createID from '../composables/useCreateID'
	import ActivityCompleteBtns from '../components/activities/ActivityCompleteBtns.vue'
	import BaseAlertText from '../components/base/BaseAlertText.vue'

	type Props = {
		setActivityType: ActivityType
		title: string
		prompt: string
		isFinaleReveal?: boolean
		practiceType?: 'explorable'
	}
	const props = withDefaults(defineProps<Props>(), {
		toSave: false,
		isFinaleReveal: false,
	})

	const sectionID = createID(props.title)
	initActivityProgressStore(sectionID)

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

	const activity = defineAsyncComponent(() =>
		import(
			`../components/activities/${
				props.setActivityType.charAt(0).toUpperCase() +
				props.setActivityType.slice(1)
			}SwitchBoard.vue`
		).finally(() => {
			useDoesActivityExist(props.setActivityType)
			// only need setLocksHandler && updateLocalStorage scripts if activities are being used within a given lesson
			import('../scripts/setLocksHandler.js')
			import('../scripts/updateLocalStorage.js')
		})
	)

	const conditionalProps = computed(() => {
		const universalProps = {
			id: sectionID,
			prompt: props.prompt,
		}
		let activityProps: {}
		switch (props.setActivityType) {
			case 'reflection':
				activityProps = {
					isFinaleReveal: props.isFinaleReveal,
				}
				break
			case 'practice':
				activityProps = {
					practiceType: props.practiceType,
				}
				break
			case 'choice':
				activityProps = {}
				break
		}
		return { ...universalProps, ...activityProps }
	})
</script>

<style module lang="scss">
	.disableAlerts {
		max-width: 95%;
		margin-top: var(--s-6);
		display: flex;
		align-items: center;
		> input {
			height: var(--s0);
			width: var(--s0);
			&:checked {
				+ label {
					font-style: italic;
					color: var(--darkGray);
				}
			}
		}
		> label {
			font-size: var(--s-1);
		}
	}
</style>
