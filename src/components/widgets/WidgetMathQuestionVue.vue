<template>
    <div :class='$style.mathWidget'>
        <p :id='`${uniqueID}-prompt`'>{{ prompt }}</p>
        <div :class='$style.mathQuestion'>
            <span
                :class="[$style.textFeedback, { [$style.answerCorrect]: isCorrectAnswer }, { [$style.answerIncorrect]: isIncorrectAnswer }]"
                v-if='isCorrectAnswer || isIncorrectAnswer' ref='feedbackEl' tabindex='-1' v-html='provideFeedback'>
            </span>
            <template v-if='!isCorrectAnswer'>
                <label :for='`${uniqueID}-answer`' :class='$style.mathLabel'>
                    <span v-html='renderMath(`${questionAndAnswer[0]}`)'></span>
                </label>
                <BaseTextInputVue isBtnRequired btnText='Submit' :idForLabel='`${uniqueID}-answer`'
                    @userTyped='checkAnswer' />
            </template>
            <span v-else :class='$style.answerRevealed'
                v-html='renderMath(`\\begin{align*}${props.questionAndAnswer[0]} \\\\ \\fcolorbox{#fac800}{#ffe270}{${props.questionAndAnswer[1]}}\\end{align*}`)'></span>
        </div>
        <div :class='$style.helpBtn' v-if='!isCorrectAnswer && trackAttempts >= 2' ref='showAnswerEl'>
            <BaseButtonVue text='Show me the answer' @click='userRequestsAnswer' isForActivity>
            </BaseButtonVue>
        </div>
    </div>
</template>

<script setup lang="ts">
import katex from 'katex';
import createNanoID from '../../composables/useCreateNanoID';
import BaseTextInputVue from '../base/BaseTextInputVue.vue';
import { computed, nextTick, ref, watch } from 'vue';
import BaseButtonVue from '../base/BaseButtonVue.vue';
import { setAriaLiveAnnouncement } from '../../store/ariaLiveStore';

const uniqueID = createNanoID('MathProblem')

type Props = {
    prompt: string
    questionAndAnswer: [string, string]
    isRoundedAnswerAccepted?: boolean
    incorrectFeedback?: string
}
const props = defineProps<Props>()

// to render KateX equations
const renderMath = (formula: string) => {
    return katex.renderToString(formula, {
        throwOnError: false,
        displayMode: true
    })
}

const feedbackEl = ref<HTMLElement | null>(null)
const showAnswerEl = ref<HTMLElement | null>(null)
// trackAttempts determines whether to allow user to get the answer later, with enough attempts
const trackAttempts = ref<number>(0)
// Check for whether learner got the answer correct or not
const isCorrectAnswer = ref<boolean>(false)
const isIncorrectAnswer = ref<boolean>(false)
// if true, will show rounded number as correct result
const didUserAnswerWithRoundedAnswer = ref<boolean>(false)
// if true, user clicked button requesting the correct answer
const didUserRequestAnswer = ref<boolean>(false)


const checkAnswer = async (userAnswer: string) => {
    const userAnswerNum = +userAnswer.replace(/[^\d.]/g, '')
    const answerNum = +props.questionAndAnswer[1].replace(/[^\d.]/g, '')
    // track attempts for the showAnswer button
    trackAttempts.value += 1

    if (userAnswerNum === answerNum || (props.isRoundedAnswerAccepted && Math.round(userAnswerNum) === Math.round(answerNum))) {
        // if user answered correctly...
        isCorrectAnswer.value = true
        isIncorrectAnswer.value = false
        // determining if user did round for an answer or not
        didUserAnswerWithRoundedAnswer.value = Number.isInteger(userAnswerNum) && Math.round(userAnswerNum) !== answerNum
    } else {
        // if user is wrong, provide feedback
        isCorrectAnswer.value = false
        isIncorrectAnswer.value = true
    }
    await nextTick()
    !!feedbackEl.value && feedbackEl.value.focus()
}

const userRequestsAnswer = () => {
    didUserRequestAnswer.value = true
    isCorrectAnswer.value = true
    isIncorrectAnswer.value = false
}

// feedback, depending on whether user got it right or not
const provideFeedback = computed(() => {
    if (didUserRequestAnswer.value) {
        // if user requested answer...
        return 'The correct answer is:'
    } else if (isCorrectAnswer.value && !didUserRequestAnswer.value) {
        // if user got the answer correct...
        if (didUserAnswerWithRoundedAnswer.value) {
            return '<strong>Correct!</strong> Rounding the answer also works 🎉'
        } else {
            return '<strong>Correct!</strong> 🎉'
        }
    } else {
        // user got the answer incorrect...
        return !!props.incorrectFeedback ? `<strong>Incorrect</strong>. Hint: ${props.incorrectFeedback}` : '<strong>Incorrect</strong>. Please try again.'
    }
})

watch(showAnswerEl, (newValue) => {
    // If 'Show me answer' button is available, notifiy screen readers
    if (newValue?.nodeName === 'DIV') setAriaLiveAnnouncement('Button now available after input to reveal answer')
})
</script>

<style module lang='scss'>
@use '../../styles/mixins/containerStyles.scss';
@use '../../styles/mixins/shadows.scss';
@use '../../styles/mixins/transitions.scss';

.mathWidget {
    @include containerStyles.interaction();
    margin: var(--s2) auto;

    .mathQuestion {
        display: flex;
        flex-flow: column wrap;
        align-items: center;
        justify-content: center;
        width: 100%;
        margin: var(--s2) auto;
        padding: 0 max(var(--s-2), 1ch);

        .textFeedback {
            @include containerStyles.feedback();
            padding: var(--s0);
            margin: 0 max(var(--s4), 2ch) max(var(--s-2), 1ch);

            &.answerCorrect {
                @include containerStyles.feedbackCorrect()
            }

            &.answerIncorrect {
                @include containerStyles.feedbackIncorrect()
            }
        }

        >.mathLabel {
            display: inline-block;
            width: min-content;
        }
    }

    .helpBtn {
        @include containerStyles.interactionMenuBar();
    }
}
</style>

<style lang='scss'>
span.katex-mathml {
    mpadded {
        display: block;
        width: 100%;
        border-radius: var(--s-10);
        padding: var(--s-10) var(--s2);
    }
}

span.katex-html {
    span.fcolorbox {
        border-radius: var(--s-10);
    }


}
</style>