import { type Ref, ref, reactive } from 'vue'

// TODO: use reactive to init one per widget used

type FlipCardsInfo = {
	[flipID: string]: {
		cardsTotalNum: number
		activeCardIndex: number
		transitionName: 'next' | 'prev' | ''
	}
}

const flipCardsStore = reactive<FlipCardsInfo>({})
function initFlipCard(id: string, cardsTotal: number) {
	flipCardsStore[id] = {
		cardsTotalNum: cardsTotal ? cardsTotal : 1,
		activeCardIndex: 1,
		transitionName: '',
	}
}

export { flipCardsStore, initFlipCard }
