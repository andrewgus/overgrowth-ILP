const elementsToA11y = document.querySelectorAll(
	'strong, em, del, ins, mark, code, q, blockquote'
)

const visuallyHiddenText = (el: Element, A11yText: string) => {
	el.insertAdjacentHTML(
		'afterbegin',
		`<span class="visuallyHidden">${A11yText}:&nbsp;</span>`
	)
	el.insertAdjacentHTML(
		'beforeend',
		`<span class="visuallyHidden">&nbsp;end ${A11yText}</span>`
	)
}

elementsToA11y.forEach((el) => {
	switch (el.nodeName) {
		case 'STRONG':
			visuallyHiddenText(el, 'important')
			break
		case 'EM':
			visuallyHiddenText(el, 'note')
			break
		case 'DEL':
			visuallyHiddenText(el, 'strikethrough')
			break
		case 'INS':
			visuallyHiddenText(el, 'insert text')
			break
		case 'MARK':
			visuallyHiddenText(el, 'highlight')
			break
		case 'CODE':
			visuallyHiddenText(el, 'code block')
			break
		case 'Q':
			visuallyHiddenText(el, 'quote')
			break
		case 'BLOCKQUOTE':
			visuallyHiddenText(el, 'block quote')
			break
	}
})
export {}
