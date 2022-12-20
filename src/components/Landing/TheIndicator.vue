<template>
	<div>
		<p>Scroll to start</p>
		<div class="scrollArrow" aria-hidden="true">
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
		</div>
	</div>
</template>

<script setup lang="ts"></script>

<style scoped>
	div {
		margin: 0 auto var(--s1);
	}
	p {
		display: block;
		font-size: var(--s0);
		margin: 0 auto;
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
