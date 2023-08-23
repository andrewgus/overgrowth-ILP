<template>
	<Transition :name="flipCardsStore[flipID].transitionName" mode="out-in">
		<section v-if="areFlipCardsAvailable" v-show="isActive" :id="`${flipID}-card#${cardNum}`" ref="flipCardEl"
			tabindex="-1"
			:class="[$style.flipCard, { [$style.isFlipped]: !isOnFront }, { [`${isNoFlip__setColor}`]: !!isNoFlip__setColor }, { [$style.noFlip]: isNoFlip }]"
			:aria-labelledby="`${flipID}-${cardNum}`" :aria-describedby="`${flipID}-instructions`">
			<p :class="$style.cardNum" :id="`${flipID}-${cardNum}`">
				<span class="visuallyHidden">Flip Card</span>
				{{ cardNum }} of
				{{ flipCardsStore[flipID].cardsTotalNum }}
				<span v-if="!isNoFlip">&vert; {{ isOnFront ? 'Front' : 'Back' }}</span>
			</p>
			<div ref="flipCardContentEl" :class="$style.cardContent" tabindex="-1">
				<slot v-if='!isNoFlip' :name="isOnFront ? 'front' : 'back'">
					🛑 ERROR: FlipCard is missing
					<code
						style='background-color: salmon;'>&lt;Fragment client:visible slot="{{ isOnFront ? 'front' : 'back' }}"&gt;</code>
				</slot>
				<slot v-else></slot>
			</div>
			<button v-if='!isNoFlip' type="button" :aria-controls="`${flipID}-card#${cardNum}`" :class="$style.flipBtn"
				@click="flipTheCard">
				Flip to {{ isOnFront ? 'back' : 'front' }}?
			</button>
		</section>
	</Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { flipCardsStore } from '../../store/flipCardStore'

type Props = {
	id: string,
	cardNum: string,
	isNoFlip?: boolean
	isNoFlip__setColor?: 'blue' | 'green' | 'red' | 'yellow'
}

const props = defineProps<Props>()

const areFlipCardsAvailable = ref<boolean>(false)

const flipID = `flipCardWidget-${props.id}`
const flipCardEl = ref<HTMLDivElement | null>(null)
const flipCardContentEl = ref<HTMLDivElement | null>(null)

const isActive = computed(
	() => +props.cardNum === flipCardsStore[flipID].activeCardIndex
)

const isOnFront = ref<boolean>(true)

const flipTheCard = () => {
	isOnFront.value = !isOnFront.value
	flipCardContentEl.value?.focus()

	const cardContentArr = Array.from(
		flipCardEl.value!.children
	) as HTMLElement[]

	cardContentArr.forEach((el) => {
		el.style.opacity = '0'
		setTimeout(() => {
			el.style.opacity = '1'
		}, 250)
	})
}

if (flipCardsStore[flipID]) {
	watch(flipCardsStore[flipID], async (newStoreVal) => {
		if (newStoreVal.activeCardIndex === +props.cardNum) {
			await nextTick()
			flipCardEl.value?.focus()
		}
	})
}

onMounted(() => (areFlipCardsAvailable.value = !!flipCardsStore[flipID]))
</script>

<style module lang="scss">
@use '../../styles/mixins/containerStyles.scss';
@use '../../styles/mixins/shadows.scss';
@use '../../styles/mixins/buttons.scss';

.flipCard {
	@include shadows.smallBoxShadow();
	@include containerStyles.darkBorder();
	grid-area: 1/1/-1/-1;
	background-color: var(--white);
	border-radius: var(--s-10);
	width: 100%;
	height: clamp(30ch, 50vh, 45ch);
	max-width: 60ch;
	margin: 0 auto;
	display: flex;
	justify-content: space-between;
	flex-flow: column nowrap;
	transition: transform var(--timeLong) var(--transitionFlourish);

	@supports (height: 1svh) {
		height: clamp(30ch, 50svh, 45ch);
	}

	&.noFlip {
		justify-content: center;
		position: relative;

		>.cardNum {
			position: absolute;
			top: 0;
		}
	}



	&.isFlipped {
		transform: rotateX(180deg);
		flex-direction: column-reverse;

		>* {
			transform: rotateX(180deg);
		}
	}

	>.cardContent {
		z-index: 1;
		margin: 0 var(--s-4);
		padding: 0 var(--s-4);
		align-self: center;
		overflow-y: scroll;
		max-width: 50ch;

		>astro-slot {
			>*:not(ul, ol)+* {
				margin-top: var(--s2);
			}

			div,
			picture {
				max-height: 80%;
			}
		}
	}

	>.cardNum {
		z-index: 1;
		padding: var(--s-6) var(--s-6) 0 var(--s-6);
		width: 96%;
		text-align: right;
		background-color: var(--white);
		color: var(--darkGray);
		border-radius: var(--s-10);
		margin: var(--s-6)
	}

	>.flipBtn {
		@include buttons.secondary();
		transition: none;
		min-height: var(--s4);
		border-radius: 0 0 var(--s-10) var(--s-10);
		border: 0;
		align-self: end;
		width: 100%;
	}
}
</style>
<style scoped lang="scss">
.next-leave-from,
.prev-enter-to {
	opacity: 1;
	-webkit-transform: translateX(0) rotateZ(0);
	transform: translateX(0) rotateZ(0);

	&[class*='isFlipped'] {
		-webkit-transform: translateX(0) rotateZ(0) rotateX(180deg);
		transform: translateX(0) rotateZ(0) rotateX(180deg);
	}
}

.next-leave-to,
.prev-enter-from {
	opacity: 0;
	-webkit-transform: translateX(-30%) rotateZ(-10deg);
	transform: translateX(-30%) rotateZ(-10deg);

	&[class*='isFlipped'] {
		-webkit-transform: translateX(-30%) rotateZ(-10deg) rotateX(180deg);
		transform: translateX(-30%) rotateZ(-10deg) rotateX(180deg);
	}
}

.next-enter-from,
.prev-leave-to {
	opacity: 0;
	-webkit-transform: scale(0.85);
	transform: scale(0.85);

	&[class*='isFlipped'] {
		-webkit-transform: scale(0.85) rotateX(180deg);
		transform: scale(0.85) rotateX(180deg);
	}
}

.next-enter-to,
.prev-leave-from {
	opacity: 1;
	-webkit-transform: scale(1);
	transform: scale(1);

	&[class*='isFlipped'] {
		-webkit-transform: scale(1) rotateX(180deg);
		transform: scale(1) rotateX(180deg);
	}
}

.next-enter-active,
.prev-enter-active,
.next-leave-active,
.prev-leave-active {
	transition: all var(--timeMed) ease-in-out;
}

.next-enter-active,
.prev-enter-active {
	transition-delay: var(--timeMed);
}
</style>
