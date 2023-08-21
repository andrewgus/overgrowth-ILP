<template>
	<div :class="$style.reflectionFinale">
		<p ref='promptEl'>{{ prompt }}</p>
		<div :class="$style.reflectionResponses">
			<div v-for="(response, _, index) in userReflectionsStore" :key="index" :class="$style.responseItem">
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
			background-color: var(--offWhite);

			p {
				padding: var(--s0) var(--s2);

				&.question {
					border-bottom: 1px dashed var(--offWhite);
					background-color: var(--blue-2);
					color: var(--white);
					padding-bottom: var(--s2);

					>.note {
						color: var(--blue-2);
						background-color: var(--white);
					}
				}

			}

			>.answer {
				padding-top: var(--s4);
				padding-bottom: var(--s2);

				>.note {
					background-color: var(--blue-2);
					color: var(--white);
				}
			}

			span.note {
				display: block;
				width: max-content;
				border-radius: var(--s-10);
				padding: 0 var(--s-10);
				margin-bottom: var(--s2);
			}
		}
	}
}
</style>
