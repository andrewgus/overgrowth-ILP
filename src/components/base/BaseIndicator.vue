<template>
	<div :class="indicatorStyles">
		<a :class="$style.indicatorLink" :href="nextSection" :aria-hidden="hidden">
			<p :class="$style.text">{{ text }}</p>
			<span :class="$style.scrollArrow">
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
	import { computed, useCssModule } from 'vue'
	import { contentQuery } from '../../store/index.js'
	const props = defineProps({
		text: {
			type: String,
			required: true,
		},
		hidden: {
			type: Boolean,
		},
		isOnLanding: {
			type: Boolean,
		},
	})

	const nextSection = computed(() => {
		const currSectionNum = useStore(contentQuery.currSectionIdNum).value
		return currSectionNum ? `#section${currSectionNum + 1}` : '#section1'
	})

	const style = useCssModule()

	const indicatorStyles = computed(() => {
		const styles = [style.indicator]
		if (props.isOnLanding) styles.push(style.OnlandingIndicator)

		return styles
	})
</script>

<style module lang="scss">
	.indicator {
		align-self: center;
		margin: 0 auto;
	}
	.OnlandingIndicator {
		grid-area: card-indicator/landing-top/indicator-end/landing-bottom;
	}
	.indicatorLink {
		all: unset;
		display: flex;
		flex-flow: column nowrap;
		justify-content: center;
		align-items: center;
	}
	.text {
		padding: var(--s-5);
		display: block;
		font-size: var(--s0);
		margin: 0 auto;
		background-color: hsla(0deg, 0%, 98%, 0.5);
		filter: drop-shadow(0 0 var(--s1) var(--white));
		border-radius: var(--s10);
	}
	.scrollArrow {
		margin: var(--s-10) auto;
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
