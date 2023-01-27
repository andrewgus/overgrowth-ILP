<template>
	<div :class="$style.skipBtn" id="skipToContent">
		<BaseButton
			link
			text="Skip to main content"
			url="#section1"
			color="red-1"
		></BaseButton>
	</div>
</template>

<script setup lang="ts">
	import BaseButton from '../base/BaseButton.vue'
</script>

<style module lang="scss">
	.skipBtn {
		margin: 0 auto var(--s0);
		max-width: max-content;
		border: 1px solid var(--white);
		&:focus {
			outline: 1px solid var(--blue);
		}
		> a {
			color: var(--white);
		}
	}
</style>
