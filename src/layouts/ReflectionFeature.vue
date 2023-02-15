<template>
	<section
		v-show="features.reflection"
		class="feature"
		:class="$style.reflection"
	>
		<div>
			<h2>{{ title }}</h2>
			<p>{{ prompt }}</p>
			<div :class="$style.userInput">
				<!-- TODO: Need to create dynamic ids for this, but later -->
				<label for="reflectioninput">Write your response&hellip;</label>
				<textarea
					placeholder="I think&hellip;"
					id="reflectioninput"
					rows="7"
					v-model="input"
				></textarea>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
	// TODO: When this is here, the activity is not complete, the completeBtn has not yet been selected, then all other content that comes after that is hidden. Need to figure out how to accomplish that. Think it will end up being a state management thing...
	import { ref } from 'vue'
	import { useStore } from '@nanostores/vue'

	import {
		featuresMap,
		useDoesFeatureExist,
	} from '../store/FeatureSettingsStore'

	defineProps({
		title: {
			type: String,
			required: true,
		},
		prompt: {
			type: String,
			required: true,
		},
	})

	const features = useStore(featuresMap)

	useDoesFeatureExist('reflection')

	const input = ref('')
</script>

<style module lang="scss">
	.reflection > div {
		font-size: var(--s0);
		margin: 0 auto;
		max-width: 60ch;
		widows: 100%;
	}
	.userInput {
		display: flex;
		flex-flow: column nowrap;
		gap: var(--s-2);

		& > textarea {
			resize: none;
			font-size: var(--s0);
			font-family: var(--fonts);
			line-height: 1.6;
			border-radius: var(--s-2);
			border: 1px solid var(--darkGray);
			transition: var(--timeShort) box-shadow var(--transitionFlourish);
			padding: var(--s-2);

			&:focus {
				box-shadow: 12px 12px 12px var(--lightGray);
			}
		}
	}
</style>
