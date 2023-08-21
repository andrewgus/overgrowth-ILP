<template>
	<div class="visuallyHidden" aria-live="polite">
		{{ ariaLiveAnnouncement }}
	</div>
	<footer v-show="showFooter" :class="[$style.activitiesOff, { [$style.sendToBottom]: userUnderstands }]">
		<p id="activitiesOffReminderMessage">
			<strong>Reminder:</strong>
			You turned off at least one activity and is missing from this lesson. You
			can turn on activities at the top of this page.
		</p>
		<div :class="$style.acknowledgeBtns">
			<BaseButton aria-describedby="activitiesOffReminderMessage" text="I understand" @btnClick="acceptMessage"
				v-if="!userUnderstands" />
			<BaseButton text="Back to top" isLink url="#titleHeading" />
		</div>
	</footer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
	activitiesMap,
	allSectionsMap,
	currSectionMap,
} from '../../store/lessonStore'
import { useStore } from '@nanostores/vue'
import BaseButton from '../base/BaseButton.vue'
import {
	setAriaLiveAnnouncement,
	ariaLiveAnnouncement,
} from '../../composables/useSetAriaLiveAnnouncement'

const $activities = useStore(activitiesMap)
const $allSections = useStore(allSectionsMap)
const $currSection = useStore(currSectionMap)
const anyActivityOff = ref<boolean>(false)
const userUnderstands = ref<boolean>(false)

watch($activities, (activity) => {
	anyActivityOff.value = Object.values(activity).includes(false)
})

const acceptMessage = () => {
	userUnderstands.value = true
	if ($currSection.value.id) {
		const article = document.querySelector(
			$currSection.value.id
		) as HTMLElement
		article.focus()
	} else {
		const header = document.querySelector('#titleHeading') as HTMLElement
		header.focus()
	}
}

const unlockedAllPossibleSections = computed(() => {
	// filter for any turned-off activities and map their keys
	const turnedOffActivities = Object.entries($activities.value)
		.filter(([_, isOn]) => !isOn)
		.map(([type]) => type)
	// filter for any section that is either static content or is NOT turned off
	const unlockedSections = Object.values($allSections.value)
		.filter((details) => {
			return (
				details.activityType === null ||
				!turnedOffActivities.includes(details.activityType)
			)
		})
		.every((section) => section.isLocked === false)

	return unlockedSections
})

const showFooter = computed(
	() =>
		(anyActivityOff.value && !userUnderstands.value) ||
		(userUnderstands.value && unlockedAllPossibleSections.value)
)

watch(showFooter, (isShown) => {
	isShown
		? setAriaLiveAnnouncement('Message available in content info section')
		: setAriaLiveAnnouncement('content info section is no longer available')
})
</script>

<style module lang="scss">
.activitiesOff {
	z-index: 999;
	border-top: 1px solid var(--darkGray);
	background-color: var(--yellow5);
	padding: var(--s0);
	position: sticky;
	bottom: 0;

	&.sendToBottom {
		position: initial;
	}

	>* {
		text-align: center;
	}

	.acknowledgeBtns {
		margin-top: var(--s-2);
		display: flex;
		flex-flow: row nowrap;
		justify-content: center;
		align-items: center;
		gap: 0 var(--s2);

		>* {
			flex: 0 1 auto;
		}
	}
}
</style>
