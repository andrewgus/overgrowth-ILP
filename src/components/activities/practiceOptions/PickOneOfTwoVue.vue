<template>
    <div :class='$style.choiceBtns'>
        <BaseButtonVue isForActivity v-for='(btn, index) of buttonNames' :key='index' :text='btn'
            :isDisabled='btnClickedStatus[index] === false' @click='determineBtnClicked(index)'
            :aria-controls='`${uniqueID}-feedback`' :aria-expanded='btnClickedStatus[index] === true' />
    </div>
    <Transition name='opacity'>
        <div :class='[$style.choiceFeedback, { [$style.feedbackShown]: !!!btnClickedStatus.includes(null) }]'
            :id='`${uniqueID}-feedback`' v-show='!!!btnClickedStatus.includes(null)'>
            <p>
                {{ btnClickedStatus[0] === true ? choiceFeedback[0] : choiceFeedback[1] }}
            </p>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { nextTick, ref, watch, onMounted } from 'vue';
import BaseButtonVue from '../../base/BaseButtonVue.vue';
import { setAriaLiveAnnouncement } from '../../../store/ariaLiveStore';
import { includeUserPickChoiceInPracticeStore, userPracticeStore } from '../../../store/activityOptionsStore'
import getLocalStorage from '../../../composables/useGetLocalStorage';
import createNanoID from '../../../composables/useCreateNanoID';

const emits = defineEmits<{
    readyForNext: [isReadyForNextStep: boolean]
}>()

type Props = {
    id: string
    promptID: string
    isMultisteps: boolean
    isStepComplete: boolean
    buttonNames: [string, string]
    choiceFeedback: [string, string]
}
const props = defineProps<Props>()
const uniqueID = createNanoID(props.id)

// Ref to track what user selected
const btnClickedStatus = ref<(boolean | null)[]>([null, null])

// Get the localStorage, and if it exists, then use that data
const localStoragePickedChoices = getLocalStorage(props.id, 'userPickChoices') as [boolean, boolean]
onMounted(() => {
    if (!!localStoragePickedChoices) {
        // if user has already selected their choice, use that data
        emits('readyForNext', true)
        btnClickedStatus.value = localStoragePickedChoices
    }
})
// // if the store gets reset, reset the clickedStatus too
watch(userPracticeStore[props.id], (updatedStore) => {
    if (updatedStore.isPracticeOptionStepsComplete.every((step) => step === false)) btnClickedStatus.value = [null, null]
})

// Determine which btn was clicked
const determineBtnClicked = (index: number) => {
    btnClickedStatus.value.fill(false)
    btnClickedStatus.value[index] = true
    includeUserPickChoiceInPracticeStore(props.id, btnClickedStatus.value as [boolean, boolean])
    // Once choice is made, user can move on.
    emits('readyForNext', true)
    nextTick(() => {
        setAriaLiveAnnouncement('Feedback now available')

    })
}
</script>

<style module lang='scss'>
@use '../../../styles/mixins/containerStyles.scss';

.choiceBtns {
    display: flex;
    flex-wrap: nowrap;
    padding: max(var(--s4), 2ch);

    >* {
        flex: 1 1 50%;

        &:first-child {
            border-radius: var(--s10) 0 0 var(--s10);
        }

        &:last-child {
            border-radius: 0 var(--s10) var(--s10) 0;
        }

    }
}

.choiceFeedback {
    @include containerStyles.interactionMenuBar();
    margin-top: 0;

    &.feedbackShown {
        animation: flash var(--timeLong) ease-in-out forwards;
    }
}

@keyframes flash {
    0% {
        background-color: inherit;
    }

    50% {
        background-color: var(--yellow4);
    }

    100% {
        background-color: inherit;
    }
}
</style>
<style scoped lang='scss'>
@use '../../../styles/mixins/transitions.scss';
@include transitions.vueOpacity();
</style>