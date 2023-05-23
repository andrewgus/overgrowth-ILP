<template>
	<div :class="$style.reflectionFinale">
		<p>{{ prompt }}</p>
		<div :class="$style.reflectionResponses">
			<div
				v-for="(response, _, index) in userReflectionsStore"
				:key="index"
				:class="$style.responseItem"
			>
				<p :class="$style.question">
					<span :class="$style.note">We asked:&nbsp;</span>
					<span>{{ response.prompt }}</span>
				</p>
				<BaseSeparator
					orientation="horizontal"
					color="var(--darkGray)"
					:class="$style.reflectionSeparator"
				/>
				<p :class="$style.answer">
					<span :class="$style.note">You answered:&nbsp;</span>
					<span>{{ response.answer }}</span>
				</p>
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
		> p {
			max-width: 60ch;
			margin: var(--s2) auto;
		}
		.reflectionResponses {
			display: flex;
			flex-flow: column nowrap;
			align-items: center;
			gap: var(--s2);

			> .responseItem {
				overflow: hidden;
				border-radius: var(--s4);
				border: var(--s-10) solid var(--darkGray);
				background-color: var(--offWhite);

				p {
					padding: var(--s0) var(--s-2) var(--s-2) var(--s0);
					&.question {
						border-bottom: 1px dashed var(--darkGray);
						background-color: var(--yellow5);
					}
				}
				span.note {
					display: block;
					width: max-content;
					border-radius: var(--s-10);
					padding: 0 var(--s-10);
					background-color: var(--blue-2);
					color: var(--white);
					margin-bottom: var(--s-4);
				}
			}
		}
	}
</style>
