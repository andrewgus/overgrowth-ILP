<template>
	<div :class="$style.reflectionFinale">
		<p>{{ prompt }}</p>
		<div :class="$style.reflectionResponses">
			<div
				v-for="(response, id) in userReflectionsStore"
				:key="id"
				:class="$style.responseItem"
			>
				<div>
					<p :class="$style.question">We asked:</p>
					<p>{{ response.prompt }}</p>
				</div>
				<BaseSeparator
					orientation="horizontal"
					:class="$style.reflectionSeparator"
				/>
				<div>
					<p :class="$style.answer">You answered:</p>
					<p>{{ response.answer }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { userReflectionsStore } from '../../../store/featureOptionsStore'
	import BaseSeparator from '../../base/BaseSeparator.vue'

	defineProps({
		prompt: {
			type: String,
			required: true,
		},
	})
</script>

<style module lang="scss">
	.reflectionFinale {
		display: flex;
		flex-flow: column nowrap;
		justify-content: center;
		align-items: flex-start;
	}
	.reflectionResponses {
		display: flex;
		flex-flow: column nowrap;
		gap: var(--s2);
		width: 100%;
		> .responseItem {
			align-self: stretch;
			flex: 1;
			border: var(--s-10) solid var(--darkGray);
			background-color: var(--offWhite);
			border-radius: var(--s-10);

			&:last-child {
				margin-bottom: var(--s6);
			}

			> * {
				p {
					padding: var(--s0) var(--s0);
				}
				p:first-child {
					border-bottom: 1px dashed var(--darkGray);
					margin-top: 0;

					&.question {
						background-color: var(--blue-2);
						color: var(--white);
					}
					&.answer {
						background-color: var(--green5);
					}
				}
				p:last-child {
					padding: var(--s2) var(--s0);
				}
			}
		}
	}
	.reflectionSeparator {
		border-color: var(--darkGray);
	}
</style>
