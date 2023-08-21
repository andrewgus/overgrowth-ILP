<template>
    <slot></slot>
    <div :class='$style.mathPractice'>
        <p :id='`${id}-math-prompt`' :class='$style.prompt'>{{ prompt }}</p>
        <ol>
            <template v-for='(equation, i) in MathQsAndAs' :key='i'>
                <li :class='$style.mathQuestion' ref='equationEls' tabindex='-1'>
                    <span
                        :class="[$style.textFeedback, { [$style.answerCorrect]: userFeedback[i] === true }, { [$style.answerIncorrect]: userFeedback[i] === false }]"
                        v-if='userFeedback[i] !== undefined'>
                        {{ !!userFeedback[i] ? 'Correct! 🎉' : 'Try again' }}
                    </span>
                    <template v-if='!!!userFeedback[i]'>
                        <label :for='`${id}-mathQ${i}`' :class='$style.mathQuestion__question'><span
                                v-html='renderMath(`${equation[0]}`)'></span></label>&nbsp;
                        <input :id='`${id}-mathQ${i}`' :aria-describedby='`${id}-math-prompt`' placeholder='type here'
                            :class='[$style.mathQuestion__userInput, { [$style.answerIncorrect]: userFeedback[i] === false }]'
                            :readonly='userFeedback[i]' type="number" v-model='userAnswersInput[i]'
                            @input='checkForCorrect(i)' @blur.once='checkForIncorrect(i)'>
                    </template>
                    <span v-else :class='$style.answerRevealed'
                        v-html='renderMath(`${equation[0]}\\bold{${equation[1]}}`)'></span>
                </li>
            </template>
        </ol>
        <BaseButton v-if='isMultisteps' text='Go to next step' isForActivity @click='readyForNext()' />
    </div>
    <div class='visuallyHidden'>{{ ariaLiveAnnouncement }}</div>
</template>

<script setup lang="ts">
import katex from 'katex'
import { ref, watch } from 'vue';
import BaseButton from '../../base/BaseButton.vue';
import useIsActivityCompleted from '../../../composables/useIsActivityCompleted';
import { ariaLiveAnnouncement, setAriaLiveAnnouncement } from '../../../composables/useSetAriaLiveAnnouncement';

const emit = defineEmits<{
    readyForNext: [payload: boolean]
}>();

type Props = {
    id: string,
    prompt: string
    MathQsAndAs: string[][]
    isMultisteps: boolean,
    isStepComplete: boolean
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
const answersOnly = props.MathQsAndAs.flatMap((QA) => QA[1].replace(/\D/g, ''))
const userAnswersInput = ref(Array(props.MathQsAndAs.length).fill(''));
const userFeedback = ref<(boolean | undefined)[]>([...props.MathQsAndAs].map(() => undefined));

props.isStepComplete && userFeedback.value.fill(true)

const checkForCorrect = (i: number) => {

    if (userAnswersInput.value[i] === answersOnly[i]) {
        setAriaLiveAnnouncement('Correct')
        userFeedback.value[i] = true
        equationEls.value![i].focus()
    }
}
const checkForIncorrect = (i: number) => {
    if (userAnswersInput.value[i].length > 0 && userAnswersInput.value[i] !== answersOnly[i]) {
        setAriaLiveAnnouncement('Incorrect. Please try again.')
        userFeedback.value[i] = false
        equationEls.value![i].focus()
    }
}
// if every question has been answered, emit that this option is complete
watch(userFeedback.value, (newValue) => {
    if (newValue.every((val) => val === true)) emit('readyForNext', true);
})
// TODO: fix userFeedback if refresh and completed

const readyForNext = () => {
    // if this is a multistep practice, then this signals that users is ready to see next step
    emit('readyForNext', true);
}
</script>

<style module lang='scss'>
@use '../../../styles/mixins/containerStyles.scss';
@use '../../../styles/mixins/shadows.scss';
@use '../../../styles/mixins/transitions.scss';

.mathPractice {
    @include containerStyles.practiceBorder();
    background-color: var(--offWhite);
    overflow: hidden;

    >.prompt {
        background-color: var(--blue-2);
        color: var(--white);
        border-bottom: 1px dashed var(--white);
        padding: var(--s0);
        margin-bottom: var(--s0);
    }

    ol {
        margin: var(--s5) var(--s2);
    }
}

.mathQuestion {
    width: max-content;
    padding: var(--s-6);
    border-radius: var(--s-10);

    +.mathQuestion {
        margin-top: var(--s0);
    }

    .textFeedback {
        &[class*="answer"] {
            max-width: 90%;
            widows: 100%;
            padding: var(--s-10);
            margin-right: var(--s-10);
            border-radius: var(--s-10);
            border: 1px solid var(--darkGray);
        }

        &.answerCorrect {
            border: 1px solid var(--darkGray);
            background-color: var(--green5);
        }

        &.answerIncorrect {
            background-color: var(--red5);
        }
    }

    &__question {
        display: inline;
    }

    input {
        @include containerStyles.darkBorder();
        @include transitions.short();
        border-radius: var(--s10);
        display: inline;
        padding: var(--s-6);
        max-width: var(--s10);
        background-color: var(--white);

        &.answerIncorrect:empty {
            background-color: var(--red5);
        }

        @media only screen and (max-width: 70ch) {
            display: block;
        }

        &:empty {
            background-color: var(--blue);
        }

        &:not(:empty) {
            border-radius: var(--s-10);
        }

        &:focus {
            border-radius: var(--s-10);
            background-color: inherit;

            &::placeholder {
                color: transparent;
            }
        }

        &::placeholder {
            text-align: center;
            color: var(--offWhite);
            opacity: 1;
        }

        &:hover {
            @include shadows.hoverBoxShadow();
        }
    }

    .answerRevealed {
        display: inline;
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
