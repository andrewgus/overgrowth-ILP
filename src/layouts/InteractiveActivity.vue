<template>
	<article class="section activity" :class="activityType" tabindex="-1">
		<h2>{{ title }}</h2>
		<BaseAlertText
			:show="
				!isFinaleReveal && !activityProgressStore[sectionID].isAttemptsFinished
			"
		>
			Heads&nbsp;up!&nbsp;Once&nbsp;completed, this&nbsp;{{
				activityType
			}}&nbsp;activity
			<strong>cannot</strong>&nbsp;be&nbsp;turned&nbsp;off&nbsp;later.
		</BaseAlertText>
		<component :is="activity" v-bind="conditionalProps">
			<slot></slot>
		</component>
		<ActivityCompleteBtns :id="sectionID" />
	</article>
</template>

<script setup lang="ts">
	import { computed, defineAsyncComponent } from 'vue'
	import { useDoesActivityExist, type ActivityType } from '../store/lessonStore'
	import {
		initActivityProgressStore,
		activityProgressStore,
	} from '../store/activityOptionsStore'
	import createID from '../composables/useCreateID'
	import ActivityCompleteBtns from '../components/activities/ActivityCompleteBtns.vue'
	import BaseAlertText from '../components/base/BaseAlertText.vue'

	type Props = {
		activityType: ActivityType
		title: string
		prompt: string
		isFinaleReveal?: boolean
	}
	const props = withDefaults(defineProps<Props>(), {
		toSave: false,
		isFinaleReveal: false,
	})
	const sectionID = createID(props.title)
	initActivityProgressStore(sectionID)

	const activity = defineAsyncComponent(() =>
		import(
			`../components/activities/${
				props.activityType.charAt(0).toUpperCase() + props.activityType.slice(1)
			}SwitchBoard.vue`
		).finally(() => {
			useDoesActivityExist(props.activityType)
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
		switch (props.activityType) {
			case 'reflection':
				activityProps = {
					isFinaleReveal: props.isFinaleReveal,
				}
				break
			case 'practice':
				activityProps = {}
				break
			case 'choice':
				activityProps = {}
				break
		}
		return { ...universalProps, ...activityProps }
	})
</script>
