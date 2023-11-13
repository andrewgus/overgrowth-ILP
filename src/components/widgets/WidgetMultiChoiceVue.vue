<template>
    <div :class='$style.multichoice' ref='multiChoiceEl'>
        <p :class='$style.question' :id='uniqueID'>
            {{ question }}
        </p>
        <ol :class='$style.choices' :aria-labelledby='`${uniqueID}-feedback`' ref='choicesEl' tabindex='-1'>
            <li v-for='(_, index) of  answerOptions ' :key='index' :class='$style.choice'>
                <p v-if='userFeedback.length > 0'
                    :class='[$style.feedback, { [$style.feedbackCorrect]: userFeedback[index] === true }, { [$style.feedbackIncorrect]: userFeedback[index] === false }]'>
                    {{
                        userFeedback[index] ? 'Correct!' :
                        'Try&nbsp;again' }}
                </p>
                <BaseCheckboxVue :setTabIndex='index === 0 ? 0 : -1' :label='answerOptions[index]'
                    @userSelected='updateUserChoices($event, index)' :isDisabled='isUserComplete'
                    :ariaDescribedByText='uniqueID' />
            </li>
        </ol>
        <div :class='$style.questionCheck'>
            <p :id='`${uniqueID}-feedback`' v-show='!isUserComplete && userFeedback.length > 0'>{{ numberOfCorrectAnswers }}
            </p>
            <BaseButtonVue text='Check answers' isForActivity @btnClick='checkAnswers' v-if='!isUserComplete' />
            <p v-else ref='finalFeedbackEl' tabindex='-1'><strong>Correct!</strong> You got them all. 🎉</p>

        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick, computed } from 'vue';
import createNanoID from '../../composables/useCreateNanoID';
import BaseButtonVue from '../base/BaseButtonVue.vue';
import BaseCheckboxVue from '../base/BaseCheckboxVue.vue';
import { useSwapTabIndexAndFocusWithKeys } from '../../composables/useSwapTabIndexAndFocusWithKeys'


type Props = {
    question: string
    answerOptions: string[]
    correctAnswers: string[]
}
const props = defineProps<Props>()
const uniqueID = createNanoID('multichoice')
const multiChoiceEl = ref<HTMLElement | null>()
const choicesEl = ref<HTMLElement | null>()
const finalFeedbackEl = ref<HTMLElement | null>()

// Allowing for arrow keys use within answer choices. Have to include array of input items
let inputEls: HTMLElement[]
onMounted(() => {
    inputEls = Array.from(multiChoiceEl.value?.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLElement>)
    useSwapTabIndexAndFocusWithKeys(multiChoiceEl, inputEls, true)
})


// boolean map for where in the answerOptions array the correct answers exist
const correctAnswers = props.answerOptions.map((option) => props.correctAnswers.includes(option))
// initially, user has not made any choices
const initialUserChoices = props.answerOptions.map(() => false);
// refs for user's choices and feedback based on those choices
const userChoices = ref(initialUserChoices);
const userFeedback = ref<boolean[]>([]);

// update the userChoices array with the user's selection
const updateUserChoices = (answer: boolean, index: number) => {
    userChoices.value[index] = answer;
}
// determine whether the user selected the correct answers or not
let isUserComplete: boolean
const checkAnswers = async () => {
    correctAnswers.forEach((correctAnswer, index) => {
        userFeedback.value[index] = correctAnswer === userChoices.value[index];
    });
    // if every answer is correct, then user completed widget
    isUserComplete = userFeedback.value.every((fb) => fb === true);
    await nextTick()
    // if complete, send user to final feedback
    if (isUserComplete) finalFeedbackEl.value?.focus()
    // if not complete, send user back to the list of choices
    if (!isUserComplete) choicesEl.value?.focus()

}

const numberOfCorrectAnswers = computed(() => {
    return `${userFeedback.value.filter((fb) => fb === true).length} of ${correctAnswers.length} correct`
})
</script>

<style module lang='scss'>
@use '../../styles//mixins/containerStyles.scss';

.multichoice {
    @include containerStyles.interaction();
    flex-flow: column nowrap;
    overflow: hidden;
    margin-top: var(--s2);

    >.question {
        background-color: var(--blue-2);
        color: var(--white);
        padding: var(--s0);
        border-bottom: 1px dashed var(--white);
    }

    .choices {
        padding-left: var(--s2);
        list-style-type: none;
    }

    .choice {
        max-width: max-content;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        margin-top: var(--s0);

        >.feedback {
            @include containerStyles.feedback();
            min-width: 7ch;
            max-width: max-content;

            &.feedbackCorrect {
                @include containerStyles.feedbackCorrect();
            }

            &.feedbackIncorrect {
                @include containerStyles.feedbackIncorrect();
            }
        }
    }

    >.questionCheck {
        @include containerStyles.interactionMenuBar();
        flex-direction: column;
        gap: var(--s-6) 0;

        >p {
            max-width: max-content;
            margin: 0 auto var(--s-6);
        }
    }
}
</style>