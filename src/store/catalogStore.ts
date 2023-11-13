type Catalog = {
	[pageID: string]: {
		name: string
		description: string
		type: 'interactive lesson' | 'lesson' | 'widget'
	}
}
// This store is used on the [topic].astro page to render the description of the lesson that page.
const catalogStore: Catalog = {}

function addPageToCatalogStore(
	pageID: string,
	pageName: string,
	pageDescription: string,
	pageType: 'interactive lesson' | 'lesson' | 'widget'
) {
	catalogStore[pageID] = {
		name: pageName,
		description: pageDescription,
		type: pageType,
	}
}

export { catalogStore, addPageToCatalogStore }
