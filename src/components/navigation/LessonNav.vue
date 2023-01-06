<template>
	<transition name="lessonNav">
		<nav v-show="useStore(contentQuery.isOnContent).value" id="lessonNav">
			<div>
				<p>Currently on: {{ useStore(contentQuery.contentTitle) }}</p>
			</div>
		</nav>
	</transition>
</template>

<script setup lang="ts">
	import { useStore } from '@nanostores/vue'
	import { contentQuery } from '../../store/index.js'
</script>

<style scoped>
	nav {
		display: block;
		background-color: hsla(0, 0%, 100%, 0.9);
		border-width: 1px 0 1px 0;
		border-style: solid;
		border-color: var(--darkGray);
		width: 100%;
		position: sticky;
		top: 0;
	}
	nav > div {
		margin: 0 auto;
		max-width: 72ch;
	}
	nav p {
		font-size: var(--s-1);
	}
	.lessonNav-enter-from,
	.lessonNav-leave-to {
		opacity: 0;
	}
	.lessonNav-enter-active,
	.lessonNav-leave-active {
		transition: opacity 0.3s ease-in-out;
	}
	.lessonNav-enter-to,
	.lessonNav-leave-from {
		opacity: 1;
	}
</style>
