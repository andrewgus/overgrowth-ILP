<template>
	<div :class="$style.indicator">
		<a
			:class="$style.indicator__link"
			:href="goTo"
			:aria-hidden="isHidden"
			:tabindex="isHidden ? '-1' : '0'"
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
	defineProps({
		text: {
			type: String,
			required: true,
		},
		goTo: {
			type: String,
			required: true,
		},
		isHidden: {
			type: Boolean,
		},
	})
</script>

<style module lang="scss">
	.indicator {
		width: fit-content;
		margin: 0 auto;
		&__link {
			text-decoration: none;
			&,
			&:hover,
			&:focus {
				display: flex;
				flex-flow: column nowrap;
				justify-content: center;
				align-items: center;
			}
			&:hover,
			&:focus {
				background-color: var(--peach);
			}
			> p {
				padding: var(--s-4) var(--s-2);
				display: block;
				font-size: var(--s0);
				margin: 0 auto var(--s-10);
			}
			&[aria-hidden='true'] {
				cursor: pointer;
				&:hover,
				&:focus {
					background-color: transparent;
					border-color: transparent;
					font-weight: 500;
				}
			}
		}

		.scrollArrow {
			margin: var(--s-10) auto var(--s-4);
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
