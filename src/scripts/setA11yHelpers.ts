const visuallyHiddenText = (A11yText: string, position: 'begin' | 'end') => {
	return `<span class="visuallyHidden">${A11yText}${
		position === 'begin' ? ':&nbsp;' : ''
	}</span>`
}

const elementsToA11y = document.querySelectorAll(
	'strong, em, del, ins, mark, code, q'
)

elementsToA11y.forEach((el) => {
	switch (el.nodeName) {
		case 'STRONG':
			el.insertAdjacentHTML(
				'afterbegin',
				visuallyHiddenText('Important', 'begin')
			)
			break
		case 'EM':
			el.insertAdjacentHTML('afterbegin', visuallyHiddenText('Note', 'begin'))
			break
		case 'DEL':
			el.insertAdjacentHTML(
				'afterbegin',
				visuallyHiddenText('Strikethrough begin', 'begin')
			)
			el.insertAdjacentHTML(
				'beforeend',
				visuallyHiddenText('Strikethrough end', 'end')
			)
			break
		case 'INS':
			el.insertAdjacentHTML(
				'afterbegin',
				visuallyHiddenText('Insert text begin', 'begin')
			)
			el.insertAdjacentHTML(
				'beforeend',
				visuallyHiddenText('Insert text end', 'end')
			)
			break
		case 'MARK':
			el.insertAdjacentHTML(
				'afterbegin',
				visuallyHiddenText('Highlight text begin', 'begin')
			)
			el.insertAdjacentHTML(
				'beforeend',
				visuallyHiddenText('Highlight text end', 'end')
			)
			break
		case 'CODE':
			el.insertAdjacentHTML(
				'afterbegin',
				visuallyHiddenText('code block begin', 'begin')
			)
			el.insertAdjacentHTML(
				'beforeend',
				visuallyHiddenText('code block end', 'end')
			)
			break
		case 'Q':
			el.insertAdjacentHTML(
				'afterbegin',
				visuallyHiddenText('quote begin', 'begin')
			)
			el.insertAdjacentHTML('beforeend', visuallyHiddenText('quote end', 'end'))
			break
	}
})

export {}
