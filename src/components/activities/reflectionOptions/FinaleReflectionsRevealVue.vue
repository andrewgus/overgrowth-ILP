<template>
	<div :class="$style.reflectionFinale">
		<p ref='promptEl'>{{ prompt }}</p>
		<div :class="$style.reflectionResponses" v-if='waitForMounted'>
			<div v-for="([_, response], __, index) in SortedReflectionData" :key="index" :class="$style.responseItem"
				class='blue'>
				<p :class="$style.question">
					<span :class="$style.note">We asked:&nbsp;</span>
					<span>{{ response.prompt }}</span>
				</p>
				<p :class="$style.answer">
					<span :class="$style.note">You answered:&nbsp;</span>
					<span>{{ response.answer }}</span>
				</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { userReflectionsStore } from '../../../store/activityOptionsStore'
import { allSectionsMap, useUnlockNextSectionsAfterCompletion } from '../../../store/lessonStore'
import { useIntersectionObserver } from '@vueuse/core';
import { useStore } from '@nanostores/vue';


const props = defineProps({
	id: {
		type: String,
		required: true,
	},
	prompt: {
		type: String,
		required: true,
	},
})

const $allSections = useStore(allSectionsMap)

// Avoids hydration issue
const waitForMounted = ref<boolean>(false)
onMounted(() => waitForMounted.value = true)

// Ensure the reflection data is in the correct order
const SortedReflectionData = computed(() => {
	// convert the reflectionStore to an array to sort
	const reflectionStoreEntries: [string, { prompt: string; answer: string; }, number][] = Object.entries(userReflectionsStore).map(([key, value]) => {
		// grab the orderNum of the section
		const orderNum: number = $allSections.value && $allSections.value[key] && $allSections.value[key].orderNum!
		// return the info with the orderNum included
		return [key, value, orderNum]
	})
	// Use the orderNum to determine the order it should appear
	return reflectionStoreEntries.sort((a, b) => a[2] - b[2])
})


const promptEl = ref<HTMLElement | null>()
// When the top of this component is visible, set to complete.
useIntersectionObserver(
	promptEl,
	([{ isIntersecting }], _) => {
		if (isIntersecting) allSectionsMap.setKey(props.id, {
			...allSectionsMap.get()[props.id],
			'isActivityComplete': true
		})
		useUnlockNextSectionsAfterCompletion()
	},
)

</script>

<style module lang="scss">
.reflectionFinale {
	>p {
		max-width: 60ch;
		margin: var(--s2) auto;
	}

	.reflectionResponses {
		display: flex;
		flex-flow: column nowrap;
		align-items: center;
		gap: var(--s2);



		>.responseItem {
			width: 100%;
			overflow: hidden;
			border-radius: var(--s0);
			border: var(--s-10) solid var(--blue-2);

			&:first-child {
				margin-top: var(--s0);
			}

			p {
				z-index: 1;
				max-width: 98%;
				position: relative;
				margin-inline: auto;
				padding: var(--s0) var(--s2);
				margin: var(--s0);

				&.question {
					border-bottom: var(--s-10) dashed var(--blue-2);
					padding-bottom: var(--s2);

					&::after {
						overflow: hidden;
					}

					&::before {
						overflow: hidden;
					}
				}
			}

			span.note {
				display: block;
				width: max-content;
				font-size: var(--s1);
				font-weight: 700;
				border-radius: var(--s-10);
				padding: 0 var(--s-10);
				margin-bottom: var(--s0);
				text-decoration: underline;
				text-decoration-color: var(--blue-2);
				text-decoration-thickness: var(--s-10);
				text-underline-offset: var(--s-10);
			}
		}
	}
}
</style>
