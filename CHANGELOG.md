# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

## [1.0.0] — 2023-11-09

Overgrowth reaches v1.0.0 with latest major overhaul of PracticeLesson component. This update also includes updates to provide responsive content to user input to provide a choice-based learning experience.

### Added

- SurveyLink component with start/end dates to send our surveys when desired
- PickOneOfTwo practice component to gather student's true/false values to respond to their choices
- WidgetToolTipVue allows for either hover/focus tooltips, or click-dialog tooltips
- ToolTip box styles

### Removed

- ResponsiveCodeSnippet not needed. Astro includes built-in `<Code>` compoent

### Changed

- Updated LessonPractice component to accept new activityType prop, which accepts an array of objects. Each object is an activity step and it's associated data properties
- Updated PracticeSwitchBoard component for new prop structure
- ActivityTypes TS file updated to manage activitySteps object prop used in PracticeLesson --> PracticeSwitchBoard --> given component
- Updated all practice option components to use new LessonPractice structure
- Cleaned up various components.
- Updated PickOneOfTwo practice component to properly reset when lesson is reset
- Updated BaseSwitch to be responsive to reactive props data.
- Updated LessonReflection for the option to change the prompt based on previous user choices
- Updated WidgetShowSavedDataVue to include WidgetToolTipVue for quick jump to incomplete activity, if this is blank
- Updated stores to use PickOneOfTwo practice component
- Updated previously created LessonPractice components in pages to use new structure.

## [0.8.1] — 2023-10-25

Fixing issue with activity toggle buttons not properly loading

### Removed

- useActivityExists function from lessonStore removed

### Changed

- ActivitySwitchesVue and SingleActivitySwitchVue components updated to use watchers, rather than getting a single value, to make sure it correctly shows toggle buttons when activities exist.

## [0.8.0] — 2023-10-18

Major visual update to Catalog view.

### Added

- New catalogStore to be used on the topic.astro pages. This is the first step in incorporating descriptions and icons with lesson names for easier discovery.
- New Icons for catalog view.
- New prop on TableData to hightlight a `<td>`
- New prop on StepsList to allow for different increment name in ::before psuedo-element content

### Changed

- Topics Layout now provides information on the lesson or widget: A representative icon, name, and description.
- SideBySideText component now accepts new property is define if the parent element should be a `<dl>`
- Changed WidgetShortTextQuestionVue to accept an array of possible answers
- Updated TheSceneVue component to only hide an image if that activity type is turned off. If it does not exist or is on, the image will still show, so the visual makes sense.
- StepsList component can now accept any word for the li::before content css prop
- Added prop to math practice components so that, if desired, rouneded answers can be accepted
- Updated components to properly use images from /assets folder
- Updates to TheLesson, TheCatalog, and EmbedWidget layout files to use the new catalogStore
- Updated how BaseImage & SoloImage components are created for dynamic attributes
- Fixed WidgetMathQuestionVue component to appropriately provide feedback
- Fixed ResponsiveTable component to appropriately apply data values for mobile view
- TheLesson component's isNotInteractive name changed for clearer purpose to areActivitiesExcluded
- Various minor style updates across components

## [0.7.1] — 2023-10-06

### Added

- Tooltip to landing page items to explain them.
- WidgetShortTextQuestion for singular short answer questions within LessContent context
- WidgetMathQuestion for singluar math questions within the LessonContent context
- TableData now has isMath prop for when we need KaTex within a `<td>`
- Trash can icon for delete buttons

### Removed

- TableAttribution component. Now just using Astro built-in `<Fragment>` for consistancy with other components that follow a similar pattern with `<slot>`s

### Changed

- CreateList updated to clarify when/where users can delete items from the list.
- Updated Math PracticeLesson component to only change context on request via enter key or button press. Also updated to allow specified feedback.
- Refactored ActivitySwitchesVue component for landing for tooltip.
- Icons moved to /src/assets.
- Harmonized interaction styles across platform. Updated to containerStyles mixins to reflect this.
- LessonPractice && PracticeSwitchBoardVue is updated for users to determine if the previous step should be shown or not.
- Updated purpose of ActivityAlertVue component. Now only shows on completed activities when users have then turned off that activity type, to explain why they are still seeing it.
- Fixed WidgetTabs focus for keyboard users
- Minor style adjustments in a few different components

## [0.7.0] — 2023-10-02

### Added

- New Layouts:
  - LessonContent component replaces StaticContent
  - LessonPractice component for all practice activities
  - LessonReflection component for all reflection activities
- The following base components:
  - BaseSlider for `<input type="range">`
  - BaseCheckbox for `<input type="checkbox">`
- The following widget components:
  - WidgetShowSavedData for grabbing some completed user info and reusing it in another part of the lesson
  - WidgetSliderComparison for creating two sliders to compare numbers
  - WidgetMultiChoice for multiple choice questions
  - WidgetPickOne for creating a path through content. These can be nested to create a chose-your-own-adventure feature
- New CreateList and SortingList options for Practice activities
- usePracticeOptionsEmits composable for all practice options
- SCSS mixins to standardize feedback styles

### Removed

- Choice activity type removed
- InteractiveActivity layout component removed
- StaticContent layout component removed
- BaseInput component. Will be making various base components for different types

### Changed

- Realigned Practice FinalFeedback to act as an additional, optional, option.
- Updated naming convention
  - All Vue component names end with Vue
  - All widgets for `<LessonContent>` start with `<Widget...>`
  - Astro components maintain simple TwoWord approach
- EmbedWidget layout component updated to not show `<h1>` when within `<iframe>`. Comments in component explain why.
- Fixes to ResponsiveTable component and TabsWidget component styles
- Type fixes for TextStyle component for better assistance
- SoloImage component updated for attribution
- Various style updates including adjustment for responsiveness
- SubSection component updated to properly align heading when using fullWidth
- Updated useSwapTabIndexAndFocusWithKeys composable to accept two new parameters: 1. useArray: an array to use if el.parentElement.children would not work as intended; 2. includeUpDownKeys: whether or not to also included up and down arrow keys in addition to left/right keys
- Updated localStorage store and app store for user created lists from createList composable
- ResponsiveVideo updated to only load video when container div is intersected

## [0.6.4] — 2023-09-06

### Changed

- Updated Astro to 3.0
- Moved reusable types to separate folder for easier maintenance

## [0.6.3] — 2023-08-23

### Changed

- Removed presentational folder. Moved all child folders up a level to be direct child of components.
- Reconfigured aria-live to be a global div at the top of the page. Added ariaLiveStore in /store to manage that.
- Fixed mobile-width issue with math practice equations.

## [0.6.2] — 2023-08-22

### Changed

- Changed how References page works to be a prop on StaticContent
- Changed styles for fade on non-interactive elements
- Imrpvoed saveAsPDF composable to save better
- Added flash to Matching Item change based on feedback
- Section break styles updated based on feedback
- Made callOutBox styles global so it can be used in Vue and Astro files

## [0.6.1] — 2023-08-20

### Changed

- FinaleReflectionReveal component updated to only mark as complete when seen.

## [0.6.0] — 2023-08-18

### Added

- Practice Components added: Math and Matching
- Content layout components: ReferenceItem component for reference sections & StepsList for a dramatic list effect

### Changed

- Updated to localStorage, PracticeSwitchBoard, and activityStore for better functionality
- Updated Flip card component to also include non-flip content
- Had to exclude "save to PDF" button on practice activities due to some more serious bugs. Will come back to it later. PDF button still functions on reflection finale reveal.
- Visual updates to tables
- Visual updates to Reflection finale reveal.
- Included ability to choose highlight color in TextAlert component

## [0.5.5] — 2023-08-16

### Added

- Math practice activity type (WIP)
- useIsActivityCompleted composable to check with practices
- useSwapTabIndexAndFocusWithKeys composable to manage tabindex for keyboard users

### Changed

- Changes to InteractiveActivity and PracticeSwitchBoard components to allow for multiple practice types in one practice activity

## [0.5.4] — 2023-08-15

### Changed

- Fixed ActivityCompleteBtn component to properly show completeBtn
- Adjusted table styles and added a tables.scss for those styles to make them global
- Adjusted TheScene component for better visual of scene, but may require more tweaking
- Ongoing work on Matching component. Added default table styles for results.

## [0.5.3] — 2023-08-14

### Changed

- CallOut component updates & color classes updated in ContainerStyles.scss
- Added @supports css at-rule for svh length value whenever possible. Fallback to vh.
- Updated typography. This is still subject to change.
- Updated ResponsiveVideo component styles.

## [0.5.2] — 2023-08-10

### Changed

- Continued progress on Matching component
- ActivityCompleteBtn component fix for when to show completedBtn or not.
- Clearer error messages for Table componenets
- BaseButton updates for use in practice components

## [0.5.1] — 2023-08-09

### Added

- useShuffleArray composable created

### Changed

- ActivityCompleteBtn component updated to fix save as PDF button bug. ensureCorrectSection function added to make sure the section sets to that reflection section before saving as PDF.
- Changes to InteractiveActivity and PracticeSwitchBoard components as start to new Matching component (a Practice Actvivity type). Matching component is WIP.
- Updated to BaseButton component for clarity when used a link and for use in activity context
- Other minor style updates via components and their associated styles
- Updated to StaticContent component to play around with Conic gradient being used as background.

## [0.5.0] — 2023-08-07

### Added

- ResponsiveVideo component for embedding Videos. Option for transcript download included.
- TableAttribution component for ResponiveTable component when there is an attribution

### Changed

- Updated Typography to include definition lists
- Updated FullWidthImage to SoloImage to reflect that it may or may not be fullWidth, but it is a single image
- Updated MathEq component for conditional displayMode
- Updated ResponsiveTable to function better
- Various minor style tweaks
- Updated SubSection & SideBySideText components for easier use

## [0.4.1] — 2023-08-07

### Changed

- Fixed lessonStore issue where nextIncompleteActivity was not properly registering in all contexts.
- Fixed updatedLocalStorage to assist with the above change
- Fixed ActivitiesOffFooter z-index to always be on top.
- Adjusted KaTex options
- Changed isFinaleReveal prop name to isReflectionFinaleReveal for InteractiveActivity component to be more clear on purpose

## [0.4.0] — 2023-07-31

### Added

- KaTex for typesetting math equations

### Changed

- Updated BaseImage component for .svg use
- Updated SideBySideImage component to fix image width

## [0.3.1] — 2023-07-31

### Changed

- Fixed load issue in setSectionsHandler file. Will now properly show all sections when every activity is complete.
- FinaleReflectionReveal component fixed to properly be set that section to isActivityComplete: true when isLocked property is false.

## [0.3] — 2023-07-27

### Added

- New SubSection component for proper semantics and accessibility of headings between sections and their child subsections

### Changed

- Renamed A11yTextStyle to TextStyle. A11y not needed as it lives in A11y folder.
- FlipCards and FlipCards Widget props updated for strings, rather than Numbers, for better DX
- Updated semantics of TheLesson. Moved <header> into <main> as the header content is part of the main content
- Simplified TheScene to just use the one image with different aspect-ratio for smaller screens & zoom
- Added extra white space to any subsection used within a contentLayout component

## [0.2.0] — 2023-07-26

### Added

- new composable for setting & using ariaLive messages
- new footer to reminder users if activities are turned on, lest they forget later on in the lesson.

### Changed

- refactored useActivityExists function in the lesson store for simplicity
- updated TheLesson layout to make use of the newly created footer component
- update FlipCard component to fix an import bug

## [0.1.1] — 2023-07-19

### Changed

- Fixed flipcard accessibility with aria-controls

## [0.1] — 2023-06-21

### Added

- New flip card interaction using vue.js

### Changed

- Name of TextDescriptor component to A11yTextStyle to clarify purpose of component in use
