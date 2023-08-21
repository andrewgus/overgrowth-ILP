import { reactive } from 'vue'

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
