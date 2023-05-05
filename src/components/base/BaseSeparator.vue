<template>
	<div
		role="separator"
		:class="$style.separator"
		:aria-orientation="orientation"
		:aria-hidden="hidden"
	></div>
</template>

<script setup lang="ts">
	type Props = {
		orientation: 'horizontal' | 'vertical'
		hidden?: boolean
		color?: string
	}
	const props = withDefaults(defineProps<Props>(), {
		hidden: false,
		color: 'var(--lightGray)',
	})
</script>

<style module>
	.separator {
		margin: 0;
		align-self: stretch;
		border-width: 0.5px;
		border-style: solid;
		border-color: v-bind('props.color');
		border-radius: var(--s10);
	}
</style>
