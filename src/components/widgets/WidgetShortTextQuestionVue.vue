<template>
    <div :class='$style.shortTextWidget'>
        <label :for='`${uniqueID}-input`'>{{ question }}</label>
        <div :class='$style.shortTextQuestion'>
            <span
                :class="[$style.textFeedback, { [$style.answerCorrect]: isCorrectAnswer }, { [$style.answerIncorrect]: isIncorrectAnswer || isAnswerRequested }]"
                v-if='isCorrectAnswer || isIncorrectAnswer || isAnswerRequested' ref='feedbackEl' tabindex='-1'
                v-html='provideFeedback'>
            </span>
            <BaseTextInputVue isBtnRequired btnText='Submit' :idForLabel='`${uniqueID}-input`' @userTyped='checkAnswer'
                :isCorrectAnswer='isCorrectAnswer || isAnswerRequested'
                :shouldDisable='isCorrectAnswer || isAnswerRequested' />
        </div>

        <div :class='$style.helpBtn' v-if='!isCorrectAnswer && trackAttempts >= 2' ref='showAnswerEl'>
            <BaseButtonVue text='Show me the answer' @click='revealAnswer()' isForActivity>
            </BaseButtonVue>
        </div>
    </div>
</template>

<script setup lang="ts">
import createNanoID from '../../composables/useCreateNanoID';
import BaseTextInputVue from '../base/BaseTextInputVue.vue';
import { computed, nextTick, ref, watch } from 'vue';
import BaseButtonVue from '../base/BaseButtonVue.vue';
import { setAriaLiveAnnouncement } from '../../store/ariaLiveStore';

const uniqueID = createNanoID('ShortTextProblem')

type Props = {
    question: string
    answers: string[]
    incorrectFeedback?: string
}
const props = defineProps<Props>()

const trackAttempts = ref<number>(0)
const feedbackEl = ref<HTMLElement | null>(null)
const showAnswerEl = ref<HTMLElement | null>(null)

// Check for whether learner got the answer correct or not
const isCorrectAnswer = ref<boolean>(false)
const isIncorrectAnswer = ref<boolean>(false)
const isAnswerRequested = ref<boolean>(false)
const checkAnswer = async (userAnswer: string) => {
    trackAttempts.value += 1
    // compare users answer to any possible correct answer, if any is true, it is correct
    const gotCorrectAnswer = props.answers.some((answer) => {
        const punctuation = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
        return userAnswer.replaceAll(punctuation, '').toLowerCase() === answer.replaceAll(punctuation, '').toLowerCase()
    })
    // if learner's answer is equal to correct answer, 
    if (gotCorrectAnswer) {
        isCorrectAnswer.value = true
        isIncorrectAnswer.value = false
    } else {
        // if learner is wrong, provide feedback
        isCorrectAnswer.value = false
        isIncorrectAnswer.value = true
    }
    await nextTick()
    !!feedbackEl.value && feedbackEl.value.focus()
}
// feedback, depending on whether learner got it right or not
const provideFeedback = computed(() => {
    if (isCorrectAnswer.value) {
        return `<strong>Correct!</strong> 🎉 The answer is ${props.answers[0]}`
    } else if (isIncorrectAnswer.value) {
        return !!props.incorrectFeedback ? `<strong>Incorrect.</strong> Hint: ${props.incorrectFeedback}` : '<strong>Incorrect.</strong> Please try again.'
    } else if (isAnswerRequested.value) {
        return `The correct answer is ${props.answers[0]}`
    }
    return ''
})

const revealAnswer = () => {
    isAnswerRequested.value = true
    isIncorrectAnswer.value = false
}

watch(showAnswerEl, (newValue) => {
    // If 'Show me answer' button is available, notifiy screen readers
    if (newValue?.nodeName === 'DIV') setAriaLiveAnnouncement('Button now available after input to reveal answer')
})
</script>

<style module lang='scss'>
@use '../../styles/mixins/containerStyles.scss';
@use '../../styles/mixins/shadows.scss';
@use '../../styles/mixins/transitions.scss';

.shortTextWidget {
    @include containerStyles.interaction();
    margin: var(--s2) auto;

    >label {
        display: block;
        width: 100%
    }

    .shortTextQuestion {
        display: flex;
        flex-flow: column wrap;
        align-items: center;
        justify-content: center;
        gap: var(--s-2);
        width: 100%;
        margin: var(--s2) auto;
        padding: 0 var(--s0);

        .textFeedback {
            @include containerStyles.feedback();
            padding: var(--s0);
            margin: 0 max(var(--s4), 2ch);

            &.answerCorrect {
                @include containerStyles.feedbackCorrect()
            }

            &.answerIncorrect {
                @include containerStyles.feedbackIncorrect()
            }
        }

        >div {
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            gap: 0 var(--s-4);

            .shortTextLabel {
                display: inline-block;
                width: min-content;
            }
        }
    }

    .helpBtn {
        @include containerStyles.interactionMenuBar();
    }
}
</style>

<style lang='scss'>
label[class*='mathQuestion'],
span[class*='answerRevealed'] {
    .katex {
        display: inline;
        text-align: left;
    }
}
</style>