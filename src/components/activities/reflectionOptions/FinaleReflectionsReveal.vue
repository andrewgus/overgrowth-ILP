<template>
	<div :class="$style.reflectionFinale">
		<p ref='promptEl'>{{ prompt }}</p>
		<div :class="$style.reflectionResponses">
			<div v-for="(response, _, index) in userReflectionsStore" :key="index" :class="$style.responseItem"
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
import { ref } from 'vue'
import { userReflectionsStore } from '../../../store/activityOptionsStore'
import { allSectionsMap, useUnlockNextSectionsAfterCompletion } from '../../../store/lessonStore'
import { useIntersectionObserver } from '@vueuse/core';

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
		gap: var(--s6);



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
