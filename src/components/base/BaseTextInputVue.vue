<template>
    <div>
        <label :for="uniqueID" v-if='!!label'>{{ label }}</label>
        <div :class='$style.textInput'>
            <input :id='!!label ? uniqueID : idForLabel' :class='{ [$style.withBtn]: isBtnRequired }' type="text"
                placeholder='type here' v-model='userInput' :readonly='shouldDisable' @keyup.enter='btnSubmit'>
            <BaseButtonVue :class='$style.inputBtn' v-if='isBtnRequired' :text='btnText' isForActivity
                :isForActivity__CorrectAnswer='isCorrectAnswer' :isDisabled='shouldDisable' @click='btnSubmit' />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import createNanoID from '../../composables/useCreateNanoID';
import BaseButtonVue from './BaseButtonVue.vue';

const uniqueID = createNanoID('TextInput')

type Props = {
    btnText: string
    isBtnRequired: boolean
    label?: string
    idForLabel?: string
    isCorrectAnswer?: boolean
    shouldDisable?: boolean
}
const props = withDefaults(defineProps<Props>(), {
    isBtnRequired: false,
    btnText: 'Submit'
})

const emits = defineEmits(['userTyped'])

const typedInput = ref<string>('')

const userInput = computed({
    get() {
        return typedInput.value
    },
    set(value) {
        typedInput.value = value
        // if there is no submit button, then just emit as value is logged
        if (props.isBtnRequired === false) emits('userTyped', value)
    },
})

const btnSubmit = () => {
    emits('userTyped', typedInput.value)
    resetInput()
}

const resetInput = async () => {
    await nextTick();
    if (props.isCorrectAnswer === false) typedInput.value = ''
}

</script>

<style module lang='scss'>
.textInput {
    margin-top: var(--s-2);
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;


    >input {
        width: 100%;
        min-width: 10ch;
        border: 1px solid var(--darkGray);
        padding: var(--s-2);

        &:read-only {
            background-color: var(--offWhite);
            color: var(--darkGray);
        }
    }

    >input:not(.withBtn) {
        border-radius: var(--s10);
    }

    >input.withBtn {
        border-radius: var(--s10) 0 0 var(--s10);

        +button.inputBtn {
            min-width: max-content;
            border-radius: 0 var(--s10) var(--s10) 0;
        }
    }


}
</style>