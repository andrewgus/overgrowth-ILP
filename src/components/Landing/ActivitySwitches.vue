<template>
	<fieldset :class="$style.options" v-if="areSectionsAvailable && activitiesOn" ref="switchesEl">
		<legend aria-describedby="activityToggleInstructions">
			This lesson includes&hellip;
		</legend>
		<BaseSwitch v-if="useActivityExists('reflection')" name="Reflection" :set="getActivityValue('reflection')"
			@toggleSwitch="useToggleActivity('reflection')" />
		<BaseSwitch v-if="useActivityExists('practice')" name="Practice" :set="getActivityValue('practice')"
			@toggleSwitch="useToggleActivity('practice')" />
		<BaseSwitch v-if="useActivityExists('choice')" name="Choice" :set="getActivityValue('choice')"
			@toggleSwitch="useToggleActivity('choice')" />
	</fieldset>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from '@nanostores/vue'
import {
	activitiesMap,
	useActivityExists,
	useToggleActivity
} from '../../store/lessonStore'
import BaseSwitch from '../base/BaseSwitch.vue'
import useAreSectionsAvailable from '../../composables/useAreSectionsAvailable'
import { onKeyStroke } from '@vueuse/core'
import type { ActivityType } from '../../types/ActivityTypes'
const { areSectionsAvailable } = useAreSectionsAvailable()

const switchesEl = ref<HTMLFieldSetElement | null>(null)

const $activities = useStore(activitiesMap)

const getActivityValue = (activity: ActivityType) => {
	return $activities.value[activity] as boolean
}

const focusOnNextButton = (el: HTMLButtonElement, dir: 'left' | 'right') => {
	if (
		dir === 'left' &&
		el.previousElementSibling instanceof HTMLButtonElement
	)
		el.previousElementSibling.focus()

	if (dir === 'right' && el.nextElementSibling instanceof HTMLButtonElement)
		el.nextElementSibling.focus()
}
onKeyStroke(
	'ArrowLeft',
	({ target }) => {
		focusOnNextButton(target as HTMLButtonElement, 'left')
	},
	{ target: switchesEl }
)
onKeyStroke(
	'ArrowRight',
	({ target }) => {
		focusOnNextButton(target as HTMLButtonElement, 'right')
	},
	{ target: switchesEl }
)

const activitiesOn = computed(() => {
	return (
		useActivityExists('reflection') ||
		useActivityExists('practice') ||
		useActivityExists('choice')
	)
})
</script>

<style module lang="scss">
.options {
	border: 0;
	padding: 0 0 0 0;
	margin: var(--s-2) 0 0 0;
	display: flex;
	justify-content: center;
	flex-flow: row wrap;
	gap: var(--s-5);

	>legend {
		text-align: center;
		margin: 0 auto var(--s-4);
	}

	>div {
		display: flex;
		flex-flow: column nowrap;
		align-items: center;
		justify-content: start;
	}
}
</style>
