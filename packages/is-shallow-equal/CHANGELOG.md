<!-- Learn how to maintain this file at https://github.com/WordPress/gutenberg/tree/HEAD/packages#maintaining-changelogs. -->

## Unreleased

## 5.26.0 (2025-06-25)

## 5.25.0 (2025-06-04)

## 5.24.0 (2025-05-22)

## 5.23.0 (2025-05-07)

## 5.22.0 (2025-04-11)

## 5.21.0 (2025-03-27)

## 5.20.0 (2025-03-13)

## 5.19.0 (2025-02-28)

## 5.18.0 (2025-02-12)

## 5.17.0 (2025-01-29)

## 5.16.0 (2025-01-15)

## 5.15.0 (2025-01-02)

## 5.14.0 (2024-12-11)

## 5.13.0 (2024-11-27)

## 5.12.0 (2024-11-16)

## 5.11.0 (2024-10-30)

## 5.10.0 (2024-10-16)

## 5.9.0 (2024-10-03)

## 5.8.0 (2024-09-19)

## 5.7.0 (2024-09-05)

## 5.6.0 (2024-08-21)

## 5.5.0 (2024-08-07)

## 5.4.0 (2024-07-24)

## 5.3.0 (2024-07-10)

## 5.2.0 (2024-06-26)

## 5.1.0 (2024-06-15)

## 5.0.0 (2024-05-31)

### Breaking Changes

-   Increase the minimum required Node.js version to v18.12.0 matching long-term support releases ([#31270](https://github.com/WordPress/gutenberg/pull/61930)). Learn more about [Node.js releases](https://nodejs.org/en/about/previous-releases).

## 4.58.0 (2024-05-16)

## 4.57.0 (2024-05-02)

## 4.56.0 (2024-04-19)

## 4.55.0 (2024-04-03)

## 4.54.0 (2024-03-21)

## 4.53.0 (2024-03-06)

## 4.52.0 (2024-02-21)

## 4.51.0 (2024-02-09)

## 4.50.0 (2024-01-24)

## 4.49.0 (2024-01-10)

## 4.48.0 (2023-12-13)

## 4.47.0 (2023-11-29)

## 4.46.0 (2023-11-16)

## 4.45.0 (2023-11-02)

## 4.44.0 (2023-10-18)

## 4.43.0 (2023-10-05)

## 4.42.0 (2023-09-20)

## 4.41.0 (2023-08-31)

## 4.40.0 (2023-08-16)

## 4.39.0 (2023-08-10)

## 4.38.0 (2023-07-20)

## 4.37.0 (2023-07-05)

## 4.36.0 (2023-06-23)

## 4.35.0 (2023-06-07)

## 4.34.0 (2023-05-24)

## 4.33.0 (2023-05-10)

## 4.32.0 (2023-04-26)

## 4.31.0 (2023-04-12)

## 4.30.0 (2023-03-29)

## 4.29.0 (2023-03-15)

## 4.28.0 (2023-03-01)

## 4.27.0 (2023-02-15)

## 4.26.0 (2023-02-01)

## 4.25.0 (2023-01-11)

## 4.24.0 (2023-01-02)

## 4.23.0 (2022-12-14)

## 4.22.0 (2022-11-16)

## 4.21.0 (2022-11-02)

## 4.20.0 (2022-10-19)

## 4.19.0 (2022-10-05)

## 4.18.0 (2022-09-21)

## 4.17.0 (2022-09-13)

## 4.16.0 (2022-08-24)

## 4.15.0 (2022-08-10)

## 4.14.0 (2022-07-27)

## 4.13.0 (2022-07-13)

## 4.12.0 (2022-06-29)

## 4.11.0 (2022-06-15)

## 4.10.0 (2022-06-01)

## 4.9.0 (2022-05-18)

## 4.8.0 (2022-05-04)

## 4.7.0 (2022-04-21)

## 4.6.0 (2022-04-08)

## 4.5.0 (2022-03-23)

## 4.4.0 (2022-03-11)

## 4.3.0 (2022-01-27)

## 4.2.0 (2021-07-21)

## 4.1.0 (2021-05-20)

## 4.0.0 (2021-05-14)

### Breaking Changes

-   Drop support for Internet Explorer 11 ([#31110](https://github.com/WordPress/gutenberg/pull/31110)). Learn more at https://make.wordpress.org/core/2021/04/22/ie-11-support-phase-out-plan/.
-   Increase the minimum Node.js version to v12 matching Long Term Support releases ([#31270](https://github.com/WordPress/gutenberg/pull/31270)). Learn more at https://nodejs.org/en/about/releases/.

## 3.1.0 (2021-03-17)

## 3.0.0 (2020-12-17)

### Breaking Changes

-   Re-write using ES Modules causing CJS default import to change from `require('@wordpress/is-shallow-equal)` to `require('@wordpress/is-shallow-equal).default`. ([#26833](https://github.com/WordPress/gutenberg/pull/26833))

## 2.0.0 (2020-04-15)

### Breaking Changes

-   Restructure package moving source files into `lib` directory. Direct imports of
    `@wordpress/is-shallow-equal/arrays` and `@wordpress/is-shallow-equal/objects` were never
    officially supported and have been removed. ([#18942](https://github.com/WordPress/gutenberg/pull/18942))

### New Features

-   Include TypeScript type declarations ([#18942](https://github.com/WordPress/gutenberg/pull/18942))

## 1.5.0 (2019-08-05)

### Bug Fixes

-   Resolved an issue where an explicit `undefined` value in the first object may wrongly report as being shallow equal when the two objects are otherwise of equal length. ([#16329](https://github.com/WordPress/gutenberg/pull/16329))

## 1.2.0 (2019-03-06)

### New Features

-   Type-specific variants are now exposed from the module root. In a WordPress context, this has the effect of making them available as `wp.isShallowEqual.isShallowEqualObjects` and `wp.isShallowEqual.isShallowEqualArrays`.

### Internal

-   Development source code linting extends the `@wordpress/eslint-plugin/es5` ruleset.

## 1.1.0 (2018-07-12)

### New Features

-   Updated build to work with Babel 7 ([#7832](https://github.com/WordPress/gutenberg/pull/7832))

### Internal

-   Moved `@WordPress/packages` repository to `@WordPress/gutenberg` ([#7805](https://github.com/WordPress/gutenberg/pull/7805))

## 1.0.2 (2018-05-08)

### Bug Fixes

-   Fix: Use implicit `index.js` for main entry ([#124](https://github.com/WordPress/packages/pull/124))

## 1.0.1 (2018-05-01)

### Bug Fixes

-   Fix: Passing a null-ish value as one of the arguments now correctly falls back to a strict equality comparison. ([#116](https://github.com/WordPress/packages/pull/116))

## 1.0.0 (2018-04-25)

### New Features

-   Initial release
