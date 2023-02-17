<template>
	<div
		:class="[$style.indicator, { [$style.OnlandingIndicator]: isOnLanding }]"
	>
		<a
			:class="$style.indicatorLink"
			:href="goToNextSection"
			:aria-hidden="hidden"
			:tabindex="hidden ? '-1' : '0'"
		>
			<p>{{ text }}</p>
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
	import { computed } from 'vue'
	import { useStore } from '@nanostores/vue'
	import {
		firstSectionComputed,
		filteredSectionsComputed,
		currSectionMap,
	} from '../../store/NavigationStore'

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

	const filteredSections = useStore(filteredSectionsComputed)
	const currSection = useStore(currSectionMap)
	const firstSection = useStore(firstSectionComputed)

	console.log(props.isOnLanding)

	const goToNextSection = computed(() => {
		if (props.isOnLanding) {
			return `#${firstSection.value.id}`
		} else {
			const nextSectionOrderNum =
				filteredSections.value[currSection.value.id].orderNum! + 1

			const nextSectionId = Object.keys(filteredSections.value).at(
				nextSectionOrderNum
			)

			if (nextSectionId === undefined) return '#'

			return `#${nextSectionId}`
		}
	})
</script>

<style module lang="scss">
	.indicator {
		align-self: center;
		margin: 0 auto;
	}
	.OnlandingIndicator {
		grid-area: card-indicator/landing-top/indicator-end/landing-bottom;

		p {
			background-color: hsla(0deg, 0%, 98%, 0.5);
			filter: drop-shadow(0 0 var(--s1) var(--white));
			border-radius: var(--s10);
		}
	}
	.indicatorLink {
		&,
		&:hover,
		&:focus {
			all: unset;
			display: flex;
			flex-flow: column nowrap;
			justify-content: center;
			align-items: center;
		}

		> p {
			padding: var(--s-5);
			display: block;
			font-size: var(--s0);
			margin: 0 auto var(--s-10);
		}
		> span {
			margin: var(--s-10) auto;
			max-width: fit-content;
			animation: bounce 1s ease-in-out infinite alternate;
		}
	}

	@keyframes bounce {
		from {
			transform: translateY(0);
		}
		to {
			transform: translateY(var(--s-5));
		}
	}
</style>
