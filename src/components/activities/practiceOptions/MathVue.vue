<template>
    <ol :class='$style.mathQuestions'>
        <template v-for='([question, answer], i) in QsAndAs' :key='i'>
            <li :class='$style.mathQuestion' ref='equationEls' tabindex='-1'>
                <div :class="[$style.textFeedback, { [$style.answerCorrect]: userFeedback[i] === true }, { [$style.answerIncorrect]: userFeedback[i] === false }]"
                    v-if='userFeedback[i] !== undefined'>
                    <p v-html='provideFeedback(i)'></p>
                </div>
                <template v-if='!!!userFeedback[i]'>
                    <label :for='`${id}-mathQ${i}`' :class='$style.mathQuestion__question'><span
                            v-html='renderMath(`${question}`)'></span></label>&nbsp;
                    <BaseTextInputVue isBtnRequired btnText='submit' :idForLabel='`${id}-mathQ${i}`'
                        @userTyped='checkForAnswer($event, i)' />
                    <transition name='flourish'>
                        <BaseButtonVue v-if='!!!userFeedback[i] && trackAttempts[i] >= 2' isForActivity text='show answer'
                            @click='userRequestsAnswer(i)' />
                    </transition>
                </template>
                <span v-else :class='$style.answerRevealed' v-html='renderMath(`${question}\\bold{${answer}}`)'></span>
            </li>
        </template>
    </ol>
    <div v-if='isMultisteps && !isStepComplete' :class='$style.nextStepBtns'>
        <BaseButtonVue :isDisabled='!canProceedToNext' text='Go to next step' isForActivity @click='readyForNext()' />
    </div>
</template>

<script setup lang="ts">
import katex from 'katex'
import { nextTick, ref, watch, watchEffect } from 'vue';
import BaseButtonVue from '../../base/BaseButtonVue.vue';
import BaseTextInputVue from '../../base/BaseTextInputVue.vue';
import { setAriaLiveAnnouncement } from '../../../store/ariaLiveStore';

const emits = defineEmits<{
    readyForNext: [isReadyForNextStep: boolean]
}>()
const readyForNext = () => {
    emits('readyForNext', true)
}

type Props = {
    id: string
    promptID: string
    isMultisteps: boolean
    isStepComplete: boolean
    QsAndAs: [string, string][]
    isRoundedAnswerAccepted?: boolean
    incorrectFeedback?: string[]
}
const props = defineProps<Props>()

const renderMath = (formula: string) => {
    return katex.renderToString(formula, {
        throwOnError: false,
        displayMode: false
    })
}
const equationEls = ref<HTMLElement[] | null>()

// answers with all non-numerals removed
const answersOnly = props.QsAndAs.flatMap((QA) => QA[1].replace(/[^\d.]/g, ''))
// trackAttempts determines whether to allow user can request answer later, with enough attempts
const trackAttempts = ref<(number)[]>([...props.QsAndAs].map(() => 0));
// tracks wheather user requested the answer, when possible
const requestedAnswer = ref<(boolean)[]>([...props.QsAndAs].map(() => false));
// tracjs if user answered with rounded number
const didUserAnswerWithRoundedAnswer = ref<boolean[]>([...props.QsAndAs].map(() => false))
// Check for whether learner got the answer correct or not
const userFeedback = ref<(boolean | undefined)[]>([...props.QsAndAs].map(() => undefined));
// for determining if user has completed this step, and then they can continue to next
const canProceedToNext = ref<boolean>(false)

// if the step is already complete, probvide all the answers
props.isStepComplete && userFeedback.value.fill(true)

const checkForAnswer = (payload: string, i: number) => {
    const userAnswerNum = +payload.replace(/[^\d.]/g, '')
    const answerNum = +answersOnly[i]
    // trackAttempts increases to determine when users can request answer
    trackAttempts.value[i]++

    // if the payload matches the answer, inform users they are correct
    if (userAnswerNum === answerNum || (props.isRoundedAnswerAccepted && Math.round(userAnswerNum) === Math.round(answerNum))) {
        setAriaLiveAnnouncement('You correctly answered the question.')
        userFeedback.value[i] = true
        // if user used rounded number to answer, track it
        didUserAnswerWithRoundedAnswer.value[i] = Number.isInteger(userAnswerNum) && Math.round(userAnswerNum) !== answerNum
    } else {
        // else, inform users they are incorrect
        setAriaLiveAnnouncement('Incorrect. Please try again.')
        userFeedback.value[i] = false
    }
}
// if user has tried twice, they can optionally ask for the answer
const userRequestsAnswer = async (i: number) => {
    requestedAnswer.value[i] = true
    userFeedback.value[i] = true
    setAriaLiveAnnouncement('The correct answer is now available.')
    await nextTick()
    !!equationEls.value && equationEls.value[i].focus()

}

const provideFeedback = (i: number) => {
    if (requestedAnswer.value[i]) {
        // if user requested answer:
        return 'The correct answer is:'
    } else if (userFeedback.value[i] && !requestedAnswer.value[i]) {
        // if user got the question correct:
        if (didUserAnswerWithRoundedAnswer.value[i]) {
            return '<strong>Correct!</strong> Rounding the answer also works 🎉'
        } else {
            return '<strong>Correct!</strong> 🎉'
        }
    } else {
        // if user got the question incorrect:
        return !!props.incorrectFeedback && !!props.incorrectFeedback[i] ? `<strong>Incorrect.</strong> Hint: ${props.incorrectFeedback[i]}` : '<strong>Incorrect.</strong> Please try again.'
    }

}
// if every question has been answered, emit that this option is complete
watch(userFeedback.value, (newValue) => {
    if (newValue.every((val) => val === true)) {
        if (props.isMultisteps) {
            setAriaLiveAnnouncement('You can now go to the next step')
            canProceedToNext.value = true
        } else {
            readyForNext()
        }
    }
})
// if the step has been reset, also reset the answers
watchEffect(() => {
    if (props.isStepComplete === false) {
        userFeedback.value.fill(undefined)
    }
})
</script>

<style module lang='scss'>
@use '../../../styles/mixins/containerStyles.scss';
@use '../../../styles/mixins/shadows.scss';
@use '../../../styles/mixins/transitions.scss';

.mathQuestions {
    padding: 0;
    margin: var(--s5) max(var(--s2), 2ch);

    .mathQuestion {
        padding: var(--s-6);
        border-radius: var(--s-10);
        display: flex;
        flex-flow: column nowrap;
        align-items: center;

        +.mathQuestion {
            margin-top: var(--s2);
            padding-top: var(--s0);
            border-top: 1px solid var(--lightGray);
            border-radius: 0;
        }

        .textFeedback {
            width: 100%;

            >p {
                padding: 0 max(var(--s-6), .25ch);
            }

            &[class*="answer"] {
                @include containerStyles.feedback()
            }

            &.answerCorrect {
                @include containerStyles.feedbackCorrect()
            }

            &.answerIncorrect {
                @include containerStyles.feedbackIncorrect()
            }
        }

        &__question {
            display: inline;
        }

        .answerRevealed {
            display: inline;
        }

        >button:last-child {
            margin: var(--s-2) auto 0;
        }
    }
}

.nextStepBtns {
    @include containerStyles.interactionMenuBar();
}
</style>
<style scope lang='scss'>
@use '../../../styles/mixins/transitions.scss';
@include transitions.vueFlourish();
</style>
<style lang='scss'>
label[class*='mathQuestion'],
span[class*='answerRevealed'] {
    .katex {
        display: inline;
        text-align: left;

        >.katex-mathml {
            position: relative !important;
        }
    }
}
</style>
