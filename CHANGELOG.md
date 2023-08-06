# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- `extensions` option to specify which types of files to check.
- `exclusions` option to exclude certain files or directories from checking.
- `exclusionRules` option to exclude files based on content using strings or regular expressions.
- `.gitignore` file to exclude `node_modules` and other common development files/directories.
- `congratulations` option to customize congratulatory messages when all necessary files have tests.
- `depthLevel` option to specify how many levels of subdirectories to check for test files.
- `mockIdentifier` option to define the string used for identifying mock files.
- `showStatistics` option to determine if the reporter should display statistics about checked files, files with tests, and files missing tests.
- Enhanced `README.md` documentation to better describe configuration options and their usage.

### Updated
- Improved the order of configuration options in `README.md` based on importance, utility, and likelihood of use.

## [1.0.1] - 2023-08-05

### Added
- Link to the GitHub repository in `package.json`.

## [1.0.0] - 2023-08-04

### Added
- Initialization of the `jest-angular-test-verifier` project.
- Main implementation of the verifier to ensure files have corresponding tests.
- `showTestedFiles` option to determine if files with tests should be displayed.
- `failOnMissingTests` option to specify if Jest should fail when files are missing tests.