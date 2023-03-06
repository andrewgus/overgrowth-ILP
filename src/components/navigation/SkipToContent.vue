<template>
	<div :class="$style.skipBtn" id="skipToContent">
		<BaseButton
			link
			text="Skip to main content"
			:url="`#${Object.keys($allNavSections).at(0)}`"
			color="red-1"
		></BaseButton>
	</div>
</template>

<script setup lang="ts">
	import { useStore } from '@nanostores/vue'
	import { filteredNavSectionsComputed } from '../../store/lessonStore'
	import BaseButton from '../base/BaseButton.vue'

	const $allNavSections = useStore(filteredNavSectionsComputed)
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
