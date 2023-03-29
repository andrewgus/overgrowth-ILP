import { jsPDF } from 'jspdf'
import type { SectionDetails } from '../store/lessonStore'

/**
 * To generate a PDF download of a learner's work they've completed (practice and/or reflection)
 * @param sectionID currSectionMap
 */
export default function generatePDF(currSection: SectionDetails) {
	const newPDF = new jsPDF({
		orientation: 'l',
		unit: 'px',
		hotfixes: ['px_scaling'],
		format: 'a4',
		floatPrecision: 'smart',
	})

	const pdfElement: HTMLElement = document.getElementById(currSection.id)!
	const continueBtn: HTMLElement = pdfElement.querySelector('button')!
	const lessonName: string = window.location
		.toString()
		.split('/')
		.at(-1)!
		.split('#')
		.at(0)
		?.replaceAll('-', ' ')!

	newPDF.html(pdfElement, {
		callback: (newPDF) => {
			newPDF.setFontSize(18)
			newPDF.text(`${lessonName} ${currSection.featureType}`, 20, 40, {
				align: 'left',
			})

			newPDF.save(`${currSection.id}.pdf'`)
		},
		html2canvas: {
			// TODO: figure out how to get ignoreElements function to work to remove the continueBtn.
			// ignoreElements(continueBtn) {
			// 	return true
			// },
			scale: 0.75,
			width: 90,
			height: 90,
			x: 0,
			y: 0,
		},
	})
}
