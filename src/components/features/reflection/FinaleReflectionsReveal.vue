<template>
	<div :class="$style.reflectionFinale">
		<p>{{ prompt }}</p>
		<div :class="$style.reflectionResponses" v-if="userReflectionsStore">
			<div
				v-for="(response, id) in userReflectionsStore"
				:key="id"
				:class="$style.reflectionResponse"
			>
				<div>
					<p>You were asked:</p>
					<p>{{ response.prompt }}</p>
				</div>
				<BaseSeparator orientation="horizontal" />
				<div>
					<p>You answered:</p>
					<p>{{ response.answer }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { userReflectionsStore } from './userReflectionsStore'
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
		margin-top: var(--s2);
		> .reflectionResponse {
			align-self: stretch;
			flex: 1;
			border: var(--s-10) solid var(--darkGray);
			background-color: var(--lightBlue);
			padding: var(--s2);
			border-radius: var(--s-10);
		}
	}
</style>
