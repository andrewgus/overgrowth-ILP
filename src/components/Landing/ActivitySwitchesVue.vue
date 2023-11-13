<template>
	<fieldset :class="$style.options" v-if="areSectionsAvailable && activitiesOn" ref="switchesEl">
		<legend aria-describedby="activityToggleInstructions">
			This lesson includes&hellip;
		</legend>
		<SingleActivitySwitchVue activityType='reflection' toolTipText='Consider your own thoughts on this topic.' />
		<SingleActivitySwitchVue activityType='practice' toolTipText='Use the knowledge you&rsquo;re learning.' />
	</fieldset>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { activitiesMap } from '../../store/lessonStore'
import useAreSectionsAvailable from '../../composables/useAreSectionsAvailable'
import SingleActivitySwitchVue from './SingleActivitySwitchVue.vue'
import { onKeyStroke } from '@vueuse/core'

const { areSectionsAvailable } = useAreSectionsAvailable()


// To verify if the activity is registered or not
const activitiesOn = ref<boolean>(false)
activitiesMap.subscribe((activity) => {
	activitiesOn.value = activity.practice !== undefined || activity.reflection !== undefined
})

// toggle between buttons
const switchesEl = ref<HTMLFieldSetElement | null>(null)
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
</script>

<style module lang="scss">
.options {
	border: 0;
	padding: 0 0 0 0;
	margin: var(--s-2) 0 0 0;
	display: flex;
	justify-content: center;
	flex-flow: row wrap;
	gap: var(--s2);

	>legend {
		text-align: center;
		margin: 0 auto var(--s-4);
	}
}
</style>
