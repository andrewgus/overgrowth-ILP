<template>
	<div class="fullWidth" :class="$style.reflectionFinale">
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
					color="var(--darkGray)"
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
	import { userReflectionsStore } from '../../../store/activityOptionsStore'
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

		> p {
			width: 60ch;
			margin: var(--s2) auto;
		}
	}
	.reflectionResponses {
		display: flex;
		flex-flow: row wrap;
		gap: var(--s2);
		flex: 1 1 auto;

		> .responseItem {
			align-self: stretch;
			flex: 1;
			border: var(--s-10) solid var(--darkGray);
			background-color: var(--offWhite);
			border-radius: var(--s4);
			overflow: scroll;
			min-width: 25%;
			aspect-ratio: 2/3;

			> * {
				p {
					margin: 0;
					padding: var(--s0);
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
					min-height: 15vh;
				}
			}
		}
	}
</style>
