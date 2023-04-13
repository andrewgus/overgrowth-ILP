<template>
	<div
		:class="$style.separator"
		role="separator"
		:aria-orientation="orientation"
		:aria-hidden="hidden"
	></div>
</template>

<script setup lang="ts">
	interface props {
		orientation: 'horizontal' | 'vertical'
		hidden?: boolean
		color?: string
	}
	const props = withDefaults(defineProps<props>(), {
		color: 'var(--lightGray)',
	})
</script>

<style module>
	.separator {
		border-width: 1px;
		border-style: solid;
		border-color: v-bind('props.color');
		border-radius: var(--s10);
	}
</style>
