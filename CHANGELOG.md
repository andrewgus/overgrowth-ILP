# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

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

## [0.1.0] — 2023-07-17

### Added
- New flip card interaction using vue.js

### Changed
- Name of TextDescriptor component to A11yTextStyle to clarify purpose of component in use