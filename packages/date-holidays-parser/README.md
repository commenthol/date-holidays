# date-holidays-parser

> parser for world-wide holidays

[![NPM version](https://badge.fury.io/js/date-holidays-parser.svg)](https://www.npmjs.com/package/date-holidays-parser/)
[![Build Status](https://secure.travis-ci.org/commenthol/date-holidays-parser.svg?branch=master)](https://travis-ci.org/commenthol/date-holidays-parser)

This module provides a parser for calculation of holidays dates for
various countries, states and regions by type while considering the
applicable timezone.

The features are:

- calculation of public, bank and observance holidays for different
  countries, state, region, following ISO 3166-2
- consideration of timezones for holiday checks
- consideration of start and end time dependent on timezone
- substitute days
- multi-language support for all holiday names
- setting of custom holidays
- uses own grammar for calculation of days
- support for islamic calendar from 1970 to 2080 (*islamic dates might
  not be correct as they are subject to the sighting of the moon)
- support for hebrew calendar from 1970 to 2100
- support for chinese calendar

Happy holidays!

## Table of Contents

<!-- !toc (minlevel=2 omit="Table of Contents") -->

* [Usage](#usage)
* [Holiday object](#holiday-object)
  * [Dates](#dates)
  * [Name](#name)
  * [Types of holidays](#types-of-holidays)
* [API](#api)
* [Browser](#browser)
* [Data](#data)
* [Custom builds of `holidays.json`](#custom-builds-of-holidaysjson)
* [Contribution and License Agreement](#contribution-and-license-agreement)
* [License](#license)
* [References](#references)

<!-- toc! -->

## Usage

```js

```

## Holiday object

`getHolidays()` as well as a matching `isHoliday()` call return either
a list or a single holiday object which consists of:

* {String} date - ISO Date String of (start)-date in local format
* {Date} start - start date of holiday
* {Date} end - end date of holiday
* {String} name - name of holiday using `language` (if available)
* {String} type - type of holiday `public|bank|school|optional|observance`
* {Boolean} substitute - (optional) if true holiday substitutes another holiday`
* {String} note - (optional) note`

### Dates

The `date` String represents the start date of the holiday in ISO
format without timezone. This string it intended for information only.

`start` and `end` are the start/end date of the holiday within the
selected timezone of the country, state, region.

### Name

The `name` names the holiday in the local language of the selected
country, state, region. The applied language(s) can be requested using
`getLanguages()`.

The language can be changed using the `setLanguages()` method. In case
that not translation is available a fall-back to the next given
language will be made. E.g. local language is "fr",
`setLanguages('nl')` was called. For all holidays where no dutch
translation is available the French version will be used instead.

All holiday names should support an English translation.

### Types of holidays

Currently the following type with their meaning are supported

| type        | meaning                                    |
| ----------- | ------------------------------------------ |
| public      | public holiday                             |
| bank        | bank holiday, banks and offices are closed |
| school      | school holiday, schools are closed         |
| optional    | majority of people take a day off          |
| observance  | optional festivity, no paid day off        |

Additionally a `note` field is sometimes available for further
clarification.

## API

See [Holidays API][] for further information.

## Browser

This project also runs in all modern browsers. See `./examples/browser`

Browser | Version | Notes
---     | ---     | ---
Chrome  | >=45    |
Firefox | >=45    |
Safari  | >=10    |
Edge    | >=13    |
IE      | >=10    | needs polyfill `core-js/es6`

Please do not forget to set the correct charset!

```html
<html>
<head>
  <!-- set page-wide -->
  <meta charset="UTF-8">
  ...
</head>
<body>
  ...
  <!-- or per script -->
  <script src="your-bundle.js" charset="UTF-8"></script>
```

Testing is done with `zuul`. For local browser tests run `npm run zuul
-- --local 3000` and open <http://localhost:3000/__zuul>.

## Data

All data for the holidays of the different countries is contained in
[`./data/holidays.json`](./data/holidays.json). For changing holiday
data edit the appropriate country in `./data/countries`. Any details on
structure and available grammar for holiday attribution is described in
[holidays.yaml specification][].

## Contribution and License Agreement

If you contribute code to this project, you are implicitly allowing your
code to be distributed under the ISC license. You are also implicitly
verifying that all code is your original work or correctly attributed
with the source of its origin and license.

## License

Copyright (c) 2016- commenthol ([ISC License][])

See [LICENSE][] for more information.

## References

<!-- !ref -->

* [CONTRIBUTING.md][CONTRIBUTING.md]
* [date-holidays-ical][date-holidays-ical]
* [Holidays API][Holidays API]
* [holidays.yaml specification][holidays.yaml specification]
* [LICENSE][LICENSE]

<!-- ref! -->

[LICENSE]: ./LICENSE
[holidays.yaml specification]: https://github.com/commenthol/date-holidays/docs/specification.md
[Holidays API]: https://github.com/commenthol/date-holidays-parser/docs/Holidays.md
[date-holidays-ical]: https://github.com/commenthol/date-holidays-ical
[ISC License]: http://opensource.org/licenses/ISC
