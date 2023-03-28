<template>
	<div :class="$style.reflectionFinale">
		<p>{{ prompt }}</p>
		<div :class="$style.reflectionResponses">
			<div
				v-for="(response, id) in userReflectionsStore"
				:key="id"
				:class="$style.reflectionResponse"
			>
				<p>{{ response.prompt }}</p>
				<p>{{ response.answer }}</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { userReflectionsStore } from './userReflectionsStore'
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
		align-items: center;
	}
	.reflectionResponses {
		display: flex;
		flex-flow: row wrap;
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
