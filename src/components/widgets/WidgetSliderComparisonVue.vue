<template>
    <div :class='$style.sliderComparison'>
        <p>Adjust the sliders to {{ prompt }}</p>
        <div :class="$style.sliders">
            <BaseSliderVue v-for='(_, index) in labels' :key='index' @userMovedSlider='updateSlidersValue($event, index)'
                :label='labels[index]' :minNum='minNums[index]' :maxNum='maxNums[index]' :setNumType='setNumType' />
        </div>
        <div :class="[$style.sliderFeedback, { [$style.changeFeedbackAlert]: isFeedbackChanged }]" ref='feedbackEl'>
            <p>{{ userFeedback }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import BaseSliderVue from '../base/BaseSliderVue.vue';
import { setAriaLiveAnnouncement } from '../../store/ariaLiveStore';
import { computed, ref, watch } from 'vue';

type Props = {
    prompt: string
    comparisonAnswers: [string, string, string]
    labels: [string, string]
    minNums: [number, number]
    maxNums: [number, number]
    setNumType?: '%' | '$'
}

const props = defineProps<Props>()
const feedbackEl = ref<HTMLElement | null>()
const sliderOneValue = ref<string>('0')
const sliderTwoValue = ref<string>('0')
const isFeedbackChanged = ref<boolean>(false)


const updateSlidersValue = (sliderValue: string, index: number) => {
    // Change the array value to the value of that slider
    if (index === 0) sliderOneValue.value = sliderValue;
    if (index === 1) sliderTwoValue.value = sliderValue;
}

const userFeedback = computed(() => {
    if (+sliderOneValue.value > +sliderTwoValue.value) {
        // if the first is greater, return first feedback
        return `${props.comparisonAnswers[0]}. ${props.labels[0]} is greater than ${props.labels[1].toLowerCase()}.`
    } else if (+sliderOneValue.value < +sliderTwoValue.value) {
        // if the second is greater, return second feedback
        return `${props.comparisonAnswers[1]}. ${props.labels[0]} is less than ${props.labels[1].toLowerCase()}.`
    } else {
        // else return the third, and fallback, feedback
        return `${props.comparisonAnswers[2]}. ${props.labels[0]} and ${props.labels[1].toLowerCase()} are equal.`
    }
})

watch(userFeedback, (newValue, oldValue) => {
    // if userFeedback changes, set the appropriate ariaLive announcement
    if (newValue !== oldValue) {
        isFeedbackChanged.value = true
        setTimeout(() => {
            isFeedbackChanged.value = false
        }, 500);
    }
    if (newValue === props.comparisonAnswers[0]) {
        setAriaLiveAnnouncement(props.comparisonAnswers[0])
    } else if (newValue === props.comparisonAnswers[1]) {
        setAriaLiveAnnouncement(props.comparisonAnswers[1])
    } else {
        setAriaLiveAnnouncement(props.comparisonAnswers[2])
    }
})
</script>

<style module lang='scss'>
@use '../../styles/mixins/containerStyles.scss';

.sliderComparison {
    @include containerStyles.interaction();
    flex-flow: column nowrap;
    margin: var(--s2) 0;
}

.sliders {
    display: flex;
    flex-flow: row nowrap;
    padding: var(--s2);
    gap: var(--s2);
    justify-content: center;
}

.sliderFeedback {
    @include containerStyles.interactionMenuBar();

    &.changeFeedbackAlert {
        animation: feedbackColorAlert var(--timeLong) ease-in-out forwards;
    }
}

@keyframes feedbackColorAlert {
    0% {
        background-color: var(--offWhite);
    }

    50% {
        background-color: var(--yellow5);
    }

    100% {
        background-color: var(--offWhite);
    }
}
</style>