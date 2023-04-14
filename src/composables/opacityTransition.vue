<template>
	<transition :mode="mode" :name="name">
		<slot />
	</transition>
</template>

<script setup lang="ts">
	interface Props {
		mode?: 'in-out' | 'out-in' | 'default'
		name?: string
	}
	defineProps<Props>()
</script>

<style scoped>
	.v-enter-from,
	.v-leave-to {
		opacity: 0;
	}
	.v-enter-active,
	.v-leave-active {
		transition: opacity var(--timeShort) ease-in-out;
	}
	.v-enter-to,
	.v-leave-from {
		opacity: 1;
	}
</style>
