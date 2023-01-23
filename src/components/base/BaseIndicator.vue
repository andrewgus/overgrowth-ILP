<template>
	<div>
		<a :href="nextSection" :aria-hidden="hidden">
			<p>{{ text }}</p>
			<span class="scrollArrow">
				<svg
					width="60"
					height="38"
					viewBox="0 0 60 38"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M5 5L30 30L55 5"
						stroke="#2d3031"
						stroke-width="10"
						stroke-linecap="round"
					/>
				</svg>
			</span>
		</a>
	</div>
</template>

<script setup lang="ts">
	import { useStore } from '@nanostores/vue'
	import { computed } from 'vue'
	import { contentQuery } from '../../store/index.js'
	defineProps({
		text: {
			type: String,
			required: true,
		},
		hidden: {
			type: Boolean,
		},
	})

	const nextSection = computed(() => {
		const currSectionNum = useStore(contentQuery.currSectionIdNum).value
		return currSectionNum ? `#section${currSectionNum + 1}` : '#section1'
	})
</script>

<style scoped>
	div {
		grid-area: 1/1/-1/-1;
		align-self: end;
		z-index: 999;
		margin: 0 auto var(--s1);
	}
	a,
	a:focus,
	a:hover {
		all: unset;
		display: flex;
		flex-flow: column nowrap;
		justify-content: center;
		align-items: center;
	}
	p {
		padding: var(--s-5);
		display: block;
		font-size: var(--s0);
		margin: 0 auto;
		background-color: hsla(0deg, 0%, 98%, 0.5);
		filter: drop-shadow(0 0 var(--s1) var(--white));
		border-radius: var(--s5);
	}
	.scrollArrow {
		margin: var(--s-1) auto;
		max-width: fit-content;
		animation: bounce 1s ease-in-out infinite alternate;
	}

	@keyframes bounce {
		from {
			transform: translateY(0);
		}
		to {
			transform: translateY(10px);
		}
	}
</style>
