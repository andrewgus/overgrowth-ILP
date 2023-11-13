<template>
    <div :class='$style.slider'>
        <label :for="uniqueID">{{ label }} <span>{{ valueTextOrder }}</span></label>
        <input type="range" ref='sliderEl' :id="uniqueID" :name="label" :min="minNum" :max="maxNum" step="1"
            aria-orientation="horizontal" :aria-valuenow="sliderValue" :aria-valuetext='valueTextOrder'
            v-model='sliderValue' @input='updateValue' />
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import createNanoID from '../../composables/useCreateNanoID';

type Props = {
    label: string;
    minNum: number;
    maxNum: number;
    setNumType?: '%' | "$"
};

const props = defineProps<Props>();
const emits = defineEmits(['userMovedSlider'])

const uniqueID = createNanoID('slider');
const sliderEl = ref<HTMLInputElement | null>()
const sliderValue = ref<string>('0');

const updateValue = () => {
    emits('userMovedSlider', sliderValue.value)
}

const valueTextOrder = computed(() => {
    switch (props.setNumType) {
        case '$': return `${props.setNumType}${sliderValue.value}`
            break;
        case '%': return `${sliderValue.value}${props.setNumType}`
            break;
        default: return `${sliderValue.value}`
            break;
    }
})
</script>

<style module lang='scss'>
@use '../../styles/mixins/shadows.scss';
@use '../../styles/mixins/transitions.scss';

.slider {
    max-width: max-content;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;

    &:hover input {
        background-color: var(--blue);
        @include shadows.smallBoxShadow();
    }

    label {
        display: block;
        width: max-content;
        text-align: center;

        >span {
            display: block;
            width: 100%;
            font-size: var(--s1);
            text-align: center;
        }
    }

    input {
        @include transitions.short();
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        background-color: var(--blue1);
        border: 2px solid var(--darkGray);
        border-radius: var(--s10);

        &::-webkit-slider-thumb {
            -webkit-appearance: none;
            @include transitions.short();
            height: 20px;
            width: max(9.5%, 20px);
            border-radius: 50%;
            background-color: var(--offWhite);
            -webkit-appearance: none;
        }

        &::-moz-range-thumb {
            @include transitions.short();
            height: 90%;
            width: max(9.5%, 20px);
            border-radius: 50%;
            background-color: var(--offWhite);
        }

        &:focus {
            background-color: var(--blue);

            &::-webkit-slider-thumb,
            &::-moz-range-thumb {
                border: 2px solid var(--blue-5);
            }
        }
    }

}
</style>