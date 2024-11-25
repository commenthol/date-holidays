# date-holidays

> world-wide holidays in gregorian calender

[![NPM version](https://badge.fury.io/js/date-holidays.svg)](https://www.npmjs.com/package/date-holidays/)
[![Build Status](https://github.com/commenthol/date-holidays/workflows/CI/badge.svg?branch=master&event=push)](https://github.com/commenthol/date-holidays/actions/workflows/ci.yml?query=branch%3Amaster)

This module provides dates of holidays for various countries, states and regions
by type while considering the applicable timezone.

The features are:

- calculation of public, bank and observance holidays for different countries,
  state, region, following ISO 3166-2
- consideration of timezones for holiday checks
- consideration of start and end time dependent on timezone
- substitute days
- multi-language support for all holiday names
- setting of custom holidays
- uses own grammar for calculation of days
- support for islamic calendar from 1970 to 2080 (*islamic dates might not be
  correct as they are subject to the sighting of the moon*)
- support for hebrew calendar from 1970 to 2100
- support for chinese calendar
- for generation of iCal calendar check out [date-holidays-ical][]

Happy holidays!

## Table of Contents

<!-- !toc (minlevel=2 omit="Table of Contents") -->

* [Supported Countries, States, Regions](#supported-countries-states-regions)
* [Usage](#usage)
* [Holiday object](#holiday-object)
  * [Dates](#dates)
  * [Name](#name)
  * [Types of holidays](#types-of-holidays)
* [API](#api)
* [Data](#data)
* [Custom builds of `holidays.json`](#custom)
* [Bundling with webpack](#bundling-with-webpack)
* [Browser](#browser)
* [CDN](#cdn)
* [Contribution and License Agreement](#contribution)
* [License](#license)
* [References](#references)

<!-- toc! -->

## Supported Countries, States, Regions

If you are missing holidays from your country, state, region please consider
[contributing](#contribution).

<!-- !tree -->

```
Countries: 3
├── BE: Belgique
│   ├── BRU: Bruxelles
│   ├── DE: Deutschsprachige Gemeinschaft
│   ├── VLG: Vlaamse Gemeenschap
│   └── WAL: Communauté française
├── DE: Deutschland
│   ├── BB: Brandenburg
│   ├── BE: Berlin
│   ├── BW: Baden-Württemberg
│   ├── BY: Bayern
│   │   ├── A: Stadt Augsburg
│   │   └── EVANG: Überwiegend evangelische Gemeinden
│   ├── HB: Hansestadt Bremen
│   ├── HE: Hessen
│   ├── HH: Hansestadt Hamburg
│   ├── MV: Mecklenburg Vorpommern
│   ├── NI: Niedersachsen
│   ├── NW: Nordrhein-Westfalen
│   ├── RP: Rheinland-Pfalz
│   ├── SH: Schleswig-Holstein
│   ├── SL: Saarland
│   ├── SN: Sachsen
│   │   └── BZ: Landkreis Bautzen
│   ├── ST: Sachsen-Anhalt
│   └── TH: Thüringen
│       ├── EIC: Landkreis Eichfeld
│       ├── UH: Unstrut-Hainich-Kreis
│       └── WAK: Wartburgkreis
├── FR: France
│   ├── 57: Département Moselle
│   ├── 67: Département Bas-Rhin
│   ├── 68: Département Haut-Rhin
│   ├── YT: Département et région d'outre-mer Mayotte
│   ├── MQ: Département et région d'outre-mer Martinique
│   ├── GP: Département et région d'outre-mer Guadeloupe
│   ├── GF: Département et région d'outre-mer Guyane
│   ├── RE: Département et région d'outre-mer La Réunion
│   ├── MF: Département et région d'outre-mer Saint Martin
│── └── BL: Département et région d'outre-mer Saint Barthélemy
```
<!-- tree! -->

## Usage

```js
var Holidays = require('date-holidays')
var hd = new Holidays()

// get supported countries
hd.getCountries()
/*>
{ AD: 'Andorra',
  ...
  US: 'United States' }
*/

// get supported states e.g. for US
hd.getStates('DE')
/*>
{  BY: 'Bayern', 
  ...
  TH: 'Thüringen'
}
*/

// get supported regions e.g. for DE, Bayern
hd.getRegions('DE', 'by')
/*>
{ A: 'Stadt Augsburg',
  EVANG: 'Überwiegend evangelische Gemeinden' 
}
*/

// initialize holidays for DE, Bayern, Stadt Augsburg
hd.init('DE', 'by', 'a')
// or using a new instance
hd = new Holidays('DE', 'by', 'a')

// get all holidays for the year 2016
hd.getHolidays(2016)
/*>
[ {
      date: '2016-01-01 00:00:00',
      start: 2015-12-31T23:00:00.000Z,
      end: 2016-01-01T23:00:00.000Z,
      name: 'Neujahr',
      type: 'public',
      rule: '01-01'
    },
  ...
  {
      date: '2016-12-04 00:00:00',
      start: 2016-12-03T23:00:00.000Z,
      end: 2016-12-04T23:00:00.000Z,
      name: '2. Advent',
      type: 'observance',
      rule: '3th sunday before 12-25'
    },,
  ...
 {
      date: '2016-12-31 14:00:00',
      start: 2016-12-31T13:00:00.000Z,
      end: 2016-12-31T23:00:00.000Z,
      name: 'Silvester',
      type: 'bank',
      rule: '12-31 14:00 if sunday then 00:00'
    } ]
*/

// check if date is a holiday while respecting timezones
hd.isHoliday(new Date('2016-02-09 00:00:00 GMT+0000'))
//> false
hd.isHoliday(new Date('2016-02-09 10:00:00 GMT-0600'))
/*>
[{ date: '2016-02-09 00:00:00',
  start: Tue Feb 09 2016 00:00:00 GMT-0600 (CST),
  end: Wed Feb 10 2016 00:00:00 GMT-0600 (CST),
  name: 'Mardi Gras',
  rule: 'easter -47',
  type: 'public' }
]
*/
```

## Holiday object

`getHolidays()` as well as a matching `isHoliday()` call return either a list or
a single holiday object which consists of:

* {String} date - ISO Date String of (start)-date in local format
* {Date} start - start date of holiday
* {Date} end - end date of holiday
* {String} name - name of holiday using `language` (if available)
* {String} type - type of holiday `public|bank|school|optional|observance`
* {Boolean} substitute - (optional) if true holiday substitutes another holiday`
* {String} note - (optional) note`

### Dates

The `date` String represents the start date of the holiday in ISO format without
timezone. This string it intended for information only.

`start` and `end` are the start/end date of the holiday within the selected
timezone of the country, state, region.

### Name

The `name` names the holiday in the local language of the selected country,
state, region. The applied language(s) can be requested using `getLanguages()`.

The language can be changed using the `setLanguages()` method. In case that not
translation is available a fall-back to the next given language will be made.
E.g. local language is "fr", `setLanguages('nl')` was called. For all holidays
where no dutch translation is available the French version will be used instead.

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

Additionally a `note` field is sometimes available for further clarification.

## API

See [Holidays API][] for further information.

## Data

All data for the holidays of the different countries is contained in
[`./data/holidays.json`](./data/holidays.json). For changing holiday data edit the appropriate country in `./data/countries`.
Any details on structure and
available grammar for holiday attribution is described in
[holidays.yaml specification][].

<a name="custom"></a>

## Custom builds of `holidays.json`

If only selected countries are required in `data/holidays.json` you can add the
following script to your npm scripts section. E.g. for picking just US, Canada,
Mexico do the following:

```js
"scripts": {
  "build": "holidays2json --pick US,CA,MX --min"
},
```

The `--min` switch removes dependencies which are not required for the countries selected. You may not be able to use the full set of rules in case you want to add custom rules.

Alternatively you may use the `--omit` option.

Manually use

```bash
npx holidays2json --pick US,CA,MX
```

> **NOTE:** There are some countries which depend on data of others which
> might render the file useless. e.g. "GU" requires "US", so try
> to pick or omit both.

## Bundling with webpack

To minimize bundle sizes consider adding the following lines in your webpack config.
Please take a look at `./webpack.config.js`. To further reduce size consider custom builds by only selecting required countries.

```js
...
  plugins: [
    new webpack.IgnorePlugin({
      checkResource (resource, context) {
        // ---- do not bundle astronomia vsop planet data
        if (/\/astronomia\/data$/.test(context)) {
          return !['./deltat.js', './vsop87Bearth.js'].includes(resource)
        }
        // ---- do not bundle moment locales
        if (/\/moment\/locale$/.test(context)) {
          return true
        }
        return false
      }
    })
```

## Browser

This project also runs in all modern browsers. See `./examples/browser`

| Browser | Version | Notes                        |
| ------- | :-----: | ---------------------------- |
| Chrome  | >=45    |                              |
| Firefox | >=45    |                              |
| Safari  | >=10    |                              |
| Edge    | >=13    |                              |
| IE      | >=11    | needs polyfill `core-js/es6` |

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

## CDN

Minified distribution bundles are available via https://unpkg.com

> **NOTE:** dist-bundles are quite huge in size ~1.5MByte so use [custom](#custom) builds instead.

See https://unpkg.com/date-holidays/dist/

- `index.min.js`: commonjs2 bundle
- `umd.min.js`: umd bundle

<a name="contribution"></a>

## Contribution and License Agreement

You like to contribute please read [CONTRIBUTING.md][].

If you contribute code to this project, you are implicitly allowing your
code to be distributed under the ISC license. You are also implicitly
verifying that all code is your original work or correctly attributed
with the source of its origin and license.

## License

Copyright (c) 2016- commenthol ([ISC License](http://opensource.org/licenses/ISC))

The data contained in `holidays.json` and `./data/countries/*.yaml` is available under [CC BY-SA 3.0](http://creativecommons.org/licenses/by-sa/3.0/)
as the majority of data obtained relies on wikipedia articles. The required
attribution can be found inside the files `./data/countries/*.yaml`.

See [LICENSE][] for more information.

## References

<!-- !ref -->

* [CONTRIBUTING.md][CONTRIBUTING.md]
* [date-holidays-ical][date-holidays-ical]
* [date-holidays-parser][date-holidays-parser]
* [Holidays API][Holidays API]
* [holidays.yaml specification][holidays.yaml specification]
* [LICENSE][LICENSE]

<!-- ref! -->

[LICENSE]: ./LICENSE
[CONTRIBUTING.md]: ./CONTRIBUTING.md
[holidays.yaml specification]: https://github.com/commenthol/date-holidays/blob/master/docs/specification.md
[Holidays API]: https://github.com/commenthol/date-holidays-parser/blob/master/docs/Holidays.md
[date-holidays-parser]: https://github.com/commenthol/date-holidays-parser
[date-holidays-ical]: https://github.com/commenthol/date-holidays-ical
