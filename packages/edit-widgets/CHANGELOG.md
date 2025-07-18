<!-- Learn how to maintain this file at https://github.com/WordPress/gutenberg/tree/HEAD/packages#maintaining-changelogs. -->

## Unreleased

## 6.26.0 (2025-06-25)

## 6.25.0 (2025-06-04)

## 6.24.0 (2025-05-22)

## 6.23.0 (2025-05-07)

## 6.22.0 (2025-04-11)

## 6.21.0 (2025-03-27)

## 6.20.0 (2025-03-13)

## 6.19.0 (2025-02-28)

## 6.18.0 (2025-02-12)

## 6.17.0 (2025-01-29)

## 6.16.0 (2025-01-15)

## 6.15.0 (2025-01-02)

## 6.14.0 (2024-12-11)

## 6.13.0 (2024-11-27)

## 6.12.0 (2024-11-16)

## 6.11.0 (2024-10-30)

## 6.10.0 (2024-10-16)

## 6.9.0 (2024-10-03)

## 6.8.0 (2024-09-19)

## 6.7.0 (2024-09-05)

## 6.6.0 (2024-08-21)

## 6.5.0 (2024-08-07)

## 6.4.0 (2024-07-24)

## 6.3.0 (2024-07-10)

## 6.2.0 (2024-06-26)

## 6.1.0 (2024-06-15)

## 6.0.0 (2024-05-31)

### Breaking Changes

-   Variables like `process.env.IS_GUTENBERG_PLUGIN` have been replaced by `globalThis.IS_GUTENBERG_PLUGIN`. Build systems using `process.env` should be updated ([#61486](https://github.com/WordPress/gutenberg/pull/61486)).
-   Increase the minimum required Node.js version to v18.12.0 matching long-term support releases ([#31270](https://github.com/WordPress/gutenberg/pull/61930)). Learn more about [Node.js releases](https://nodejs.org/en/about/previous-releases).

## 5.35.0 (2024-05-16)

### Internal

-   Replaced `classnames` package with the faster and smaller `clsx` package ([#61138](https://github.com/WordPress/gutenberg/pull/61138)).

## 5.34.0 (2024-05-02)

## 5.33.0 (2024-04-19)

## 5.32.0 (2024-04-03)

## 5.31.0 (2024-03-21)

## 5.30.0 (2024-03-06)

## 5.29.0 (2024-02-21)

## 5.28.0 (2024-02-09)

## 5.27.0 (2024-01-24)

## 5.26.0 (2024-01-10)

## 5.25.0 (2023-12-13)

## 5.24.0 (2023-11-29)

## 5.23.0 (2023-11-16)

## 5.22.0 (2023-11-02)

## 5.21.0 (2023-10-18)

## 5.20.0 (2023-10-05)

## 5.19.0 (2023-09-20)

## 5.18.0 (2023-08-31)

## 5.17.0 (2023-08-16)

## 5.16.0 (2023-08-10)

## 5.15.0 (2023-07-20)

## 5.14.0 (2023-07-05)

## 5.13.0 (2023-06-23)

## 5.12.0 (2023-06-07)

## 5.11.0 (2023-05-24)

## 5.10.0 (2023-05-10)

## 5.9.0 (2023-04-26)

## 5.8.0 (2023-04-12)

## 5.7.0 (2023-03-29)

## 5.6.0 (2023-03-15)

## 5.5.0 (2023-03-01)

## 5.4.0 (2023-02-15)

## 5.3.0 (2023-02-01)

## 5.2.0 (2023-01-11)

## 5.1.0 (2023-01-02)

## 5.0.0 (2022-12-14)

### Breaking Changes

-   Updated dependencies to require React 18 ([45235](https://github.com/WordPress/gutenberg/pull/45235))

## 4.19.0 (2022-11-16)

## 4.18.0 (2022-11-02)

## 4.17.0 (2022-10-19)

## 4.16.0 (2022-10-05)

## 4.15.0 (2022-09-21)

## 4.14.0 (2022-09-13)

## 4.13.0 (2022-08-24)

## 4.12.0 (2022-08-10)

## 4.11.0 (2022-07-27)

## 4.10.0 (2022-07-13)

## 4.9.0 (2022-06-29)

## 4.8.0 (2022-06-15)

## 4.7.0 (2022-06-01)

## 4.6.0 (2022-05-18)

## 4.5.0 (2022-05-04)

## 4.4.0 (2022-04-21)

## 4.3.0 (2022-04-08)

## 4.2.0 (2022-03-23)

## 4.1.0 (2022-03-11)

## 4.0.0 (2022-02-10)

### Breaking Changes

-   The `GUTENBERG_PHASE` environment variable has been renamed to `IS_GUTENBERG_PLUGIN` and is now a boolean ([#38202](https://github.com/WordPress/gutenberg/pull/38202)).

### Bug Fixes

-   Removed unused `@wordpress/a11y`, `@wordpress/server-side-render`, `rememo` and `uuid` dependencies ([#38388](https://github.com/WordPress/gutenberg/pull/38388)).

## 3.2.0 (2022-01-27)

## 3.1.0 (2021-11-07)

### Enhancements

-   Enable persistent List View in the widget editor [#35706](https://github.com/WordPress/gutenberg/pull/35706).

## 3.0.0 (2021-07-29)

### Breaking Changes

-   Upgraded React components to work with v17.0 ([#29118](https://github.com/WordPress/gutenberg/pull/29118)). There are no new features in React v17.0 as explained in the [blog post](https://reactjs.org/blog/2020/10/20/react-v17.html).

## 2.2.0 (2021-07-21)

## 2.1.0 (2021-05-20)

## 2.0.0 (2021-05-14)

### Breaking Changes

-   Drop support for Internet Explorer 11 ([#31110](https://github.com/WordPress/gutenberg/pull/31110)). Learn more at <https://make.wordpress.org/core/2021/04/22/ie-11-support-phase-out-plan/>.
-   Increase the minimum Node.js version to v12 matching Long Term Support releases ([#31270](https://github.com/WordPress/gutenberg/pull/31270)). Learn more at <https://nodejs.org/en/about/releases/>.

## 1.3.0 (2021-03-17)

## 0.1.0 (2019-03-06)

### New Features

-   Initial version of the package.
