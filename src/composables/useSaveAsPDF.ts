import { jsPDF } from 'jspdf'
import type { SectionDetails } from '../store/lessonStore'

/**
 * To generate a PDF download of a learner's work they've completed (practice and/or reflection)
 * @param sectionID currSectionMap
 */
export default function generatePDF(currSection: SectionDetails) {
	const newPDF = new jsPDF({
		orientation: 'p',
		unit: 'px',
		hotfixes: ['px_scaling'],
		format: 'a5',
		floatPrecision: 'smart',
	})

	const pdfElement: HTMLElement = document.getElementById(currSection.id)!
	const lessonName: string = window.location
		.toString()
		.split('/')
		.at(-1)!
		.split('#')
		.at(0)
		?.replaceAll('-', ' ')!

	newPDF.html(pdfElement, {
		callback: (newPDF) => {
			const totalPages = newPDF.getNumberOfPages()

			for (let i = 1; i <= totalPages; i++) {
				newPDF.setPage(i)
				newPDF.setFontSize(10)
				newPDF.setTextColor(150)
				newPDF.text(`${lessonName} ${currSection.featureType}`, 20, 40, {
					align: 'left',
					lineHeightFactor: 1,
				})
			}

			newPDF.save(`${currSection.id}.pdf'`)
		},
		html2canvas: {
			ignoreElements: (el) => el.classList.toString().includes('btn'),
			scale: 0.7,
			width: 700,
			windowWidth: 700,
		},
		width: 700,
		windowWidth: 700,
		margin: 24,
	})
}
