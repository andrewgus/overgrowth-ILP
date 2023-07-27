<template>
	<div :class="$style.flipCards">
		<p :class="$style.flipInstructions" :id="`${flipID}-instructions`">
			Move between flip cards with the next &amp; previous buttons, left &amp;
			right arrow keys, or&nbsp;swiping left&nbsp;&amp;&nbsp;right
			on&nbsp;the&nbsp;card.
		</p>
		<div
			ref="displayBoxEl"
			:id="`${flipID}-displayBox`"
			:class="$style.flipCards__displayBox">
			<slot></slot>
		</div>
		<div ref="nextPrevBtnsEl" :class="$style.flipCards__btns">
			<BaseButton
				text="&#9664;"
				aria-label="previous card"
				:aria-controls="`${flipID}-displayBox`"
				@btnClick="goToCard('prev', $event)"
				@focus="swapTabindex"
				:disabled="onFirstCard"></BaseButton>
			<BaseButton
				text="&#9654;"
				aria-label="next card"
				:aria-controls="`${flipID}-displayBox`"
				@btnClick="goToCard('next', $event)"
				@focus="swapTabindex"
				:disabled="onLastCard"></BaseButton>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, onMounted, computed } from 'vue'
	import { onKeyStroke, usePointerSwipe, useSwipe } from '@vueuse/core'
	import { flipCardsStore, initFlipCard } from '../../../store/flipCardStore'
	import BaseButton from '../../base/BaseButton.vue'

	const props = defineProps({
		id: {
			type: String,
			required: true,
		},
		cardsTotal: {
			type: String,
			required: true,
		},
	})

	const flipID = `flipCardWidget-${props.id}`
	initFlipCard(flipID, +props.cardsTotal)

	const displayBoxEl = ref<HTMLDivElement | null>(null)
	const nextPrevBtnsEl = ref<HTMLDivElement | null>(null)

	onMounted(() => {
		const allCards = displayBoxEl.value!.querySelectorAll('astro-island').length
		flipCardsStore[flipID].cardsTotalNum = allCards
	})

	const onFirstCard = computed(
		() => flipCardsStore[flipID].activeCardIndex === 1
	)
	const onLastCard = computed(
		() =>
			flipCardsStore[flipID].activeCardIndex ===
			flipCardsStore[flipID].cardsTotalNum
	)

	const goToCard = (direction: 'next' | 'prev', e?: MouseEvent) => {
		if (direction === 'next') {
			if (
				flipCardsStore[flipID].activeCardIndex <
				flipCardsStore[flipID].cardsTotalNum
			) {
				flipCardsStore[flipID].activeCardIndex++
				flipCardsStore[flipID].transitionName = direction
			}
		} else {
			if (flipCardsStore[flipID].activeCardIndex > 1) {
				flipCardsStore[flipID].activeCardIndex--
				flipCardsStore[flipID].transitionName = direction
			}
		}
		if (e) {
			swapTabindex(e)
		}
	}
	// controlling tabindex for the next/previous btns
	const isOnFirstOrLastCard = (el: HTMLElement) => {
		return (
			(onLastCard.value && el.getAttribute('aria-label') === `next card`) ||
			(onFirstCard.value && el.getAttribute('aria-label') === `previous card`)
		)
	}
	const findSiblingBtn = (el: HTMLElement) => {
		return [...el.parentElement!.children].find(
			(sib) => sib !== el
		) as HTMLElement
	}
	const swapTabindex = ({ target }: Event) => {
		const el = target as HTMLElement
		const siblingBtn = findSiblingBtn(el)
		if (isOnFirstOrLastCard(el) && el.tabIndex === 0) {
			el.tabIndex = -1
			siblingBtn.tabIndex = 0
		} else {
			el.tabIndex = 0
			siblingBtn.tabIndex = -1
		}
	}
	onKeyStroke(
		'ArrowLeft',
		(e) => {
			swapTabindex(e)
			if (isOnFirstOrLastCard(e.target as HTMLElement)) return
			findSiblingBtn(e.target as HTMLElement).focus()
		},
		{ target: nextPrevBtnsEl }
	)
	onKeyStroke(
		'ArrowRight',
		(e) => {
			swapTabindex(e)
			if (isOnFirstOrLastCard(e.target as HTMLElement)) return
			findSiblingBtn(e.target as HTMLElement).focus()
		},
		{ target: nextPrevBtnsEl }
	)
	// moving from one item to the next in various input modalities
	onKeyStroke(
		'ArrowLeft',
		() => {
			goToCard('prev')
		},
		{ target: displayBoxEl }
	)
	onKeyStroke(
		'ArrowRight',
		() => {
			goToCard('next')
		},
		{ target: displayBoxEl }
	)
	const { direction, distanceX } = usePointerSwipe(displayBoxEl, {
		onSwipeEnd() {
			if (direction.value === 'left' && distanceX.value >= 200) goToCard('next')
			if (direction.value === 'right' && distanceX.value <= -200)
				goToCard('prev')
		},
	})
	const { lengthX } = useSwipe(displayBoxEl, {
		onSwipeEnd() {
			if (direction.value === 'left' && lengthX.value >= 100) goToCard('next')
			if (direction.value === 'right' && lengthX.value <= -100) goToCard('prev')
		},
	})
</script>

<style module lang="scss">
	@use '../../../styles/mixins/containerStyles.scss';
	@use '../../../styles/mixins/shadows.scss';
	.flipCards {
		@include containerStyles.darkBorder();
		@include shadows.smallBoxShadow();
		margin: var(--s2) auto;
		border-radius: var(--s-10);
		background-color: var(--offWhite);
		> * + * {
			margin-top: var(--s0);
		}
		> .flipInstructions {
			font-style: italic;
			margin: var(--s0) auto 0;
			padding: 0 var(--s0);
			width: 100%;
			max-width: 80ch;
		}
		&__displayBox {
			padding: 0 var(--s-2);
			display: grid;
			grid-template: 1fr / 1fr;
			justify-content: center;
			align-items: center;
			perspective: 80ch;
		}
		&__btns {
			display: flex;
			flex-flow: row nowrap;
			justify-content: space-between;
			align-items: end;
			> button {
				flex: 1;
				border-width: 1px 0 0 0;
				&:first-of-type {
					border-radius: 0 0 0 var(--s-10);
					border-right-width: 1px;
				}
				&:last-of-type {
					border-radius: 0 0 var(--s-10) 0;
				}
				&:disabled {
					background-color: var(--lightGray);
					color: var(--darkGray);
					&:hover {
						box-shadow: none;
					}
				}
			}
		}
	}
</style>
