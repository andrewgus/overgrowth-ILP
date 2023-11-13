<template>
	<transition name='opacity'>
		<template v-if='!isStepComplete'>
			<div :class="$style.matchingSpace">
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
				<div :class='$style.nextStepBtns' ref='choiceBtnsEl' v-if='isShuffleReady'>
					<template v-if='!isAllMatched'>
						<BaseButtonVue v-for='(  choice, i  ) in  matchingChoices  ' :key='i' :text='choice' isForActivity
							:isDisabled='isIncorrectChoices[i]' :isForActivity__IncorrectAnswer='isIncorrectChoices[i]'
							:isForActivity__CorrectAnswer='isCorrectChoices[i]' @btnClick='userGuess($event, i)'
							:aria-describedby='`${id}-term ${promptID}`' :tabindex='i === 0 ? 0 : -1' />
					</template>
					<template v-else>
						<BaseButtonVue :class='$style.endBtn' isForActivity text='Want to try again?'
							@click='restartMatching()' />
						<BaseButtonVue v-if='isMultisteps' :class='$style.endBtn' isForActivity text='Go to next step'
							@click='readyForNext()' />
					</template>
				</div>
			</div>
		</template>
		<template :class='$style.answerReveal' v-else>
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
		</template>
	</transition>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useSwapTabIndex, useSwapTabIndexAndFocusWithKeys } from '../../../composables/useSwapTabIndexAndFocusWithKeys'
import { setAriaLiveAnnouncement } from '../../../store/ariaLiveStore';
import BaseButtonVue from '../../base/BaseButtonVue.vue';
import shuffleArray from '../../../composables/useShuffleArray'


const emits = defineEmits<{
	readyForNext: [isReadyForNextStep: boolean]
}>()

type Props = {
	id: string
	promptID: string
	isMultisteps: boolean
	isStepComplete: boolean
	itemsAndAnswers: string[][]
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
	const prevItem = itemEls.value![0]
	await nextTick()
	if (!!itemEls.value![0]) {
		const nextItemToMatch = itemEls.value![0]
		// If the item has changed, hightlight that change
		if (nextItemToMatch !== prevItem) {
			nextItemToMatch.style.backgroundColor = 'var(--yellow2)'
			setTimeout(() => {
				nextItemToMatch.style.backgroundColor = ''
			}, 750)
		}
		nextItemToMatch.focus();
	}
	if (isAllMatched.value) {
		completionEl.value!.focus()
	}
}
// if user wants to try again
const restartMatching = (isAlsoResetting?: boolean, e?: Event) => {
	if (isAlsoResetting) {
		const btn = e!.target as HTMLButtonElement
		btn.innerText = 'Are you sure?'
	}
	setAriaLiveAnnouncement('Matching reset')
	btnClickCount.value = 0
	isCorrectChoices.value.fill(false)
	isIncorrectChoices.value.fill(false)
	shuffleItemsAndAnswers = shuffleArray(props.itemsAndAnswers)
	itemsToMatch = shuffleItemsAndAnswers.flatMap((itemAnswerPair) => itemAnswerPair[0])
	if (!isAllMatched) {
		focusNextItemToMatch()
	}
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
	emits('readyForNext', true)
	setAriaLiveAnnouncement('Table with matching results available')
}

// if this is a single step practice activity & it's complete, then allow users to continue
!props.isMultisteps && watch(isAllMatched, (newValue) => newValue === true && emits('readyForNext', true))

// Needed for responsive table styles
const determineTableLength = computed(() => [...matchingChoices].length >= 3 && 'bigTable')
</script>

<style module lang='scss'>
@use '../../../styles/mixins/containerStyles.scss';
@use '../../../styles/mixins/shadows.scss';

.matchingSpace {
	display: flex;
	flex-flow: column nowrap;
	align-items: stretch;
}

.itemsToMatchDisplay {
	@include containerStyles.flexCenter();
	margin: var(--s8) auto;
	flex: 2;
	text-align: center;
	padding: var(--s2);

	>p {
		transition: background-color var(--timeShort) ease-in-out;
		border-radius: var(--s-10);
		padding: var(--s-10);
		font-size: var(--s1);
	}
}

.nextStepBtns {
	@include containerStyles.interactionMenuBar();
	justify-content: space-between;
	flex-wrap: wrap;
	gap: var(--s2);

	>* {
		flex: 1 1 30%;
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
