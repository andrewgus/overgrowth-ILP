<template>
	<button v-if="!isLink" type="button" :class="btnStyles" :disabled="isDisabled" autocomplete="off"
		@click="$emit('btnClick', $event)">
		{{ text }}
	</button>
	<a v-else :href="url" :class="btnStyles">{{ text }}</a>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import computedCssModule from '../../composables/UseComputedCssModule'


type Props = {
	text: string,
	isDisabled?: boolean,
	isWarning?: boolean,
	isLink?: boolean,
	isForActivity?: boolean
	isForToolTipDialog?: boolean
	isForActivity__CorrectAnswer?: boolean
	isForActivity__IncorrectAnswer?: boolean
	url?: string
}

const props = defineProps<Props>()

const computedConditionalClasses = new Map([
	[computed(() => props.isWarning), 'warning'],
	[computed(() => props.isForActivity), 'activityBtn'],
	[computed(() => props.isForToolTipDialog), 'tooltipBtn'],
	[computed(() => props.isForActivity__CorrectAnswer), 'correct'],
	[computed(() => props.isForActivity__IncorrectAnswer), 'incorrect']

])
const btnStyles = computedCssModule('btn', computedConditionalClasses)
</script>

<style module lang="scss">
@use '../../styles/mixins/buttons.scss';
@use '../../styles/mixins/shadows.scss';

.btn {
	text-decoration: none;
	line-height: 1.7;
	border-radius: var(--s10);

	&:not(.activityBtn, .tooltipBtn) {
		@include buttons.primary();
		@include shadows.blueDropShadow();
	}

	&.activityBtn {
		@include buttons.secondary();

		&.incorrect {
			animation: shakeNo var(--timeMed) ease-in-out;
		}

		&.correct {
			animation: shakeYes var(--timeMed) ease-in-out;
		}
	}

	&.warning {
		@include buttons.warning();
	}

	&:disabled {
		cursor: not-allowed;
		background-color: var(--lightGray);
		filter: drop-shadow(0px 0px 0 var(--blue));
		opacity: 0.75;

		&:hover {
			color: inherit;
			background-color: var(--lightGray);
			box-shadow: none;
		}
	}

	&.tooltipBtn {
		@include buttons.toolTip();
	}
}

@keyframes shakeNo {
	0% {
		transform: translateX(0);
	}

	33% {
		transform: translateX(-10px);
	}

	67% {
		transform: translateX(10px);
	}

	100% {
		transform: translateX(0px);
	}
}

@keyframes shakeYes {
	0% {
		transform: translateY(0);
	}

	33% {
		transform: translateY(-10px);
	}

	67% {
		transform: translateY(10px);
	}

	100% {
		transform: translateY(0px);
	}
}
</style>
