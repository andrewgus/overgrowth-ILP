<template>
	<div :class="$style.skipBtn" id="skipToContent">
		<BaseButton
			link
			text="Skip to main content"
			:url="`#${firstSection.id}`"
			color="red-1"
		></BaseButton>
	</div>
</template>

<script setup lang="ts">
	import BaseButton from '../base/BaseButton.vue'
	import { useStore } from '@nanostores/vue'
	import { firstSectionComputed } from '../../store/NavigationStore'

	const firstSection = useStore(firstSectionComputed)

</script>

<style module lang="scss">
	.skipBtn {
		margin: 0 auto var(--s0);
		max-width: max-content;
		border: 1px solid var(--white);

		> a {
			display: block;
			padding: var(--s-5);
			margin-top: -5vh;
			opacity: 0;
			color: var(--white);
			&:focus {
				opacity: 1;
				outline: 1px solid var(--blue);
			}
		}
	}
</style>
