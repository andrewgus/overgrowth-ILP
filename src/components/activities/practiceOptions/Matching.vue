<template>
	<slot></slot>
	<transition name='opacity'>
		<div v-if='!isStepComplete'>
			<div :class="$style.matchingSpace">
				<p :id='`${id}-matching-prompt`' :class='$style.prompt'>{{ prompt }}</p>
				<div :class='$style.itemsToMatchDisplay' v-if='isShuffleReady'>
					<template v-if='!isAllMatched'>
						<template v-for='(item, i) in itemsToMatch' :key='i'>
							<p :id='`${id}-term`' tabindex='-1' ref="itemEls" v-if='item === itemsToMatch[btnClickCount]'>{{
								item
							}}</p>

						</template>
					</template>
					<p v-else tabindex='-1' ref="completionEl">You&rsquo;ve matched them all! 🎉</p>
				</div>
				<div :class='$style.matchingChoicesBtns' ref='choiceBtnsEl' v-if='isShuffleReady'>
					<template v-if='!isAllMatched'>
						<BaseButton v-for='(  choice, i  ) in  matchingChoices  ' :key='i' :text='choice' isForActivity
							:isDisabled='isIncorrectChoices[i]' :isForActivity__CorrectAnswer='isCorrectChoices[i]'
							@btnClick='userGuess($event, i)' :aria-describedby='`${id}-term ${id}-matching-prompt`'
							:tabindex='i === 0 ? 0 : -1' />
					</template>
					<template v-else>
						<BaseButton :class='$style.endBtn' isForActivity text='Want to try again?'
							@click='restartMatching()' />
						<BaseButton v-if='isMultisteps' :class='$style.endBtn' isForActivity text='Go to next step'
							@click='readyForNext()' />
					</template>
				</div>
			</div>
		</div>
		<div :class='$style.answerReveal' v-else>
			<table>
				<caption>Matching Results</caption>
				<thead>
					<tr>
						<th scope='col'>Matching Items</th>
						<th v-for='(choice, i) in matchingChoices' :key='i' scope='col'>{{ choice }}?</th>
					</tr>
				</thead>
				<tbody :class='determineTableLength'>
					<tr v-for='( matchingPair, i ) in   shuffleItemsAndAnswers  ' :key='i'>
						<th scope='row'>{{ matchingPair[0] }}</th>
						<template v-for='( choice, i ) in   matchingChoices  ' :key='i'>
							<td :data-header-name='choice'>{{ matchingPair[1] === choice ? 'Yes' : 'No' }}</td>
						</template>
					</tr>
				</tbody>
			</table>
		</div>
	</transition>
	<div class='visuallyHidden' aria-live='polite'>{{ ariaLiveAnnouncement }}</div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { ariaLiveAnnouncement, setAriaLiveAnnouncement } from '../../../composables/useSetAriaLiveAnnouncement';
import BaseButton from '../../base/BaseButton.vue';
import shuffleArray from '../../../composables/useShuffleArray'
import { useSwapTabIndex, useSwapTabIndexAndFocusWithKeys } from '../../../composables/useSwapTabIndexAndFocusWithKeys'

const emit = defineEmits<{
	readyForNext: [payload: boolean]
}>();

type Props = {
	id: string,
	prompt: string,
	itemsAndAnswers: string[][],
	isMultisteps: boolean,
	isStepComplete: boolean
}

const props = defineProps<Props>()

const btnClickCount = ref<number>(0)
const itemEls = ref<HTMLElement[] | null>();
const completionEl = ref<HTMLElement | null>()
const choiceBtnsEl = ref<HTMLElement | null>();

useSwapTabIndexAndFocusWithKeys(choiceBtnsEl)

let shuffleItemsAndAnswers = shuffleArray(props.itemsAndAnswers)
let itemsToMatch = shuffleItemsAndAnswers.flatMap((itemAnswerPair) => itemAnswerPair[0])
const matchingChoices = new Set(props.itemsAndAnswers.flatMap((itemAnswerPair) => itemAnswerPair[1]))

const isIncorrectChoices = ref([...matchingChoices].map(() => false));
const isCorrectChoices = ref([...matchingChoices].map(() => false));

const isShuffleReady = ref<boolean>(false)
onMounted(() => isShuffleReady.value = shuffleItemsAndAnswers.length === props.itemsAndAnswers.length)

// determine if all are matched and set to complete
const isAllMatched = computed(() => btnClickCount.value === shuffleItemsAndAnswers.length)

// to focus on next item to be matched
const focusNextItemToMatch = async () => {
	await nextTick()
	if (!!itemEls.value![0]) {
		const nextItemToMatch = itemEls.value![0]
		nextItemToMatch.focus();
	}
	if (isAllMatched.value) {
		completionEl.value!.focus()
	}
}
// if user wants to try again
const restartMatching = () => {
	setAriaLiveAnnouncement('Matching reset')
	btnClickCount.value = 0
	isCorrectChoices.value.fill(false)
	isIncorrectChoices.value.fill(false)
	shuffleItemsAndAnswers = shuffleArray(props.itemsAndAnswers)
	itemsToMatch = shuffleItemsAndAnswers.flatMap((itemAnswerPair) => itemAnswerPair[0])
	focusNextItemToMatch()
}
// prep for next matching item
const setUpNextQuestion = () => {
	btnClickCount.value++
	isIncorrectChoices.value.fill(false)
	setTimeout(() => {
		isCorrectChoices.value.fill(false)
	}, 500)
	if (!isAllMatched.value) setAriaLiveAnnouncement('Correct. Now on next item to match')
	focusNextItemToMatch()
}

const userGuess = ({ target }: Event, i: number) => {
	const selectedBtn = target as HTMLElement
	if (!selectedBtn) return

	if (selectedBtn.innerText === shuffleItemsAndAnswers[btnClickCount.value][1]) {
		// Success condition
		useSwapTabIndex(selectedBtn)
		isCorrectChoices.value[i] = true
		if (!isAllMatched.value) setUpNextQuestion()
	} else {
		// Fail condition
		isIncorrectChoices.value[i] = true
		setAriaLiveAnnouncement('Incorrect. Please try again.')
		focusNextItemToMatch();
		// reset disabled buttons
		const btns = [...choiceBtnsEl.value!.children] as HTMLButtonElement[]
		const firstAvailableBtn = btns.find((btn) => !btn.disabled) as HTMLButtonElement
		useSwapTabIndex(firstAvailableBtn)
	}
}
const readyForNext = () => {
	// if this is a multistep practice, then this signals that users is ready to see next step
	emit('readyForNext', true);
	setAriaLiveAnnouncement('Table with matching results available')
}
// if this is a single step practice activity & it's complete, then allow users to continue
!props.isMultisteps && watch(isAllMatched, (newValue) => newValue === true && readyForNext())

// Needed for responsive table styles
const determineTableLength = computed(() => [...matchingChoices].length >= 3 && 'bigTable')
</script>

<style module lang='scss'>
@use '../../../styles/mixins/containerStyles.scss';
@use '../../../styles/mixins/shadows.scss';

.matchingSpace {
	@include containerStyles.practiceBorder();
	margin: var(--s2) 0;
	min-height: 50vh;
	display: flex;
	flex-flow: column nowrap;
	align-items: stretch;
	overflow: hidden;

	>.prompt {
		background-color: var(--blue-2);
		color: var(--white);
		border-bottom: 1px dashed var(--white);
		padding: var(--s0);
		margin-bottom: var(--s0);
	}
}

@supports (min-height: 1svh) {
	.matchingSpace {
		min-height: 50svh
	}
}

.itemsToMatchDisplay {
	@include containerStyles.flexCenter();
	flex: 2;
	text-align: center;
	padding: var(--s2);

	>p {
		border-radius: var(--s-10);
		padding: var(--s-10);
		font-size: var(--s1);
	}
}

.matchingChoicesBtns {
	flex: 1;
	background-color: var(--offWhite);
	border-top: 1px dashed var(--blue-2);
	margin-top: var(--s-2);
	padding: 0 var(--s-2);
	display: flex;
	flex-flow: row wrap;
	justify-content: space-around;
	align-items: center;
	gap: 0 var(--s2);

	>* {
		flex: 1;
	}

	.endBtn {
		max-width: max-content;
	}
}

td {
	text-align: center;
}
</style>
<style scoped lang="scss">
@use '../../../styles/mixins/transitions.scss';
@include transitions.vueOpacity();
</style>
