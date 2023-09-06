import { jsPDF } from 'jspdf'
import type { SectionDetails } from '../types/SectionTypes'
import { activityProgressStore } from '../store/activityOptionsStore'

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
	// Get a copy of the PDF HTML
	const newPdfElement = pdfElement.innerHTML
	// Find the class "blue"
	const classRegex = /(class=["'][^"']*?\b)blue(\b[^"']*?["'])/g
	// Remove the class "blue" wherever it exists
	const modifiedHTML = newPdfElement.replaceAll(classRegex, '$1$2')

	const lessonName: string = window.location
		.toString()
		.split('/')
		.at(-1)!
		.split('#')
		.at(0)
		?.replaceAll('-', ' ')!

	newPDF.html(modifiedHTML, {
		autoPaging: true,
		html2canvas: {
			ignoreElements: (el) =>
				el.classList.toString().includes('btn') ||
				el.classList.toString().includes('pdfSave') ||
				el.classList.toString().includes('indicator') ||
				el.classList.toString().includes('alertText'),

			scale: 0.7,
			width: 700,
			windowWidth: 700,
		},
		callback: (newPDF) => {
			const totalPages = newPDF.getNumberOfPages()

			for (let i = 1; i <= totalPages; i++) {
				newPDF.setPage(i)
				newPDF.setFontSize(10)
				newPDF.setTextColor(150)
				newPDF.text(`${lessonName} ${currSection.activityType}`, 16, 20, {
					align: 'left',
				})
			}
			newPDF
				.save(`${currSection.id}.pdf`, { returnPromise: true })
				.catch(
					(_) =>
						(activityProgressStore[currSection.id].pdfGenStatus.isFailed = true)
				)
				.then(
					(_) =>
						(activityProgressStore[currSection.id].pdfGenStatus.isDownloading =
							false)
				)
				.finally(
					() =>
						(activityProgressStore[currSection.id].pdfGenStatus.isComplete =
							true)
				)
		},
		width: 700,
		windowWidth: 700,
		margin: [0, 16, 24, 16],
	})
}
