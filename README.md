# date-holidays

> world-wide holidays in gregorian calender

[![NPM version](https://badge.fury.io/js/date-holidays.svg)](https://www.npmjs.com/package/date-holidays/)
[![Build Status](https://secure.travis-ci.org/commenthol/date-holidays.svg?branch=master)](https://travis-ci.org/commenthol/date-holidays)

This module provides dates of holidays for various countries, states and regions by type while considering the applicable timezone.

The features are:

- calculation of public, bank and observance holidays for different countries, state, region
- consideration of timezones for holiday checks
- substitute days
- multi-language support for all holiday names
- setting of custom holidays
- uses own grammar for calculation of days
- support for islamic calendar from 1970 to 2080 (*islamic dates might not be correct as they are subject to the sighting of the moon)
- support for hebrew calendar from 1970 to 2100
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
* [Contribution and License Agreement](#contribution-and-license-agreement)
* [License](#license)
* [References](#references)

<!-- toc! -->

## Supported Countries, States, Regions

If you are missing holidays from your country, state, region please consider [contributing](#contribution).

<!-- !tree -->

```
Countries: 80
├── AD: Andorra
│   └── vella: Andorra la Vella
├── AO: Angola
├── AM: Հայաստան
├── AR: Argentina
├── AT: Österreich
│   ├── b: Burgenland
│   ├── k: Kärnten
│   ├── n: Niederösterreich
│   ├── o: Oberösterreich
│   ├── s: Land Salzburg
│   ├── st: Steiermark
│   ├── t: Tirol
│   ├── v: Vorarlberg
│   └── w: Wien
├── AU: Australia
│   ├── act: Australian Capital Territory
│   ├── nsw: New South Wales
│   ├── nt: Northern Territory
│   ├── qld: Queensland
│   ├── sa: South Australia
│   ├── tas: Tasmania
│   │   ├── h: Hobart
│   │   └── nh: Non-Hobart
│   ├── vic: Victoria
│   │   └── m: Melbourne
│   └── wa: Western Australia
├── BE: Belgique
│   ├── de: Deutschsprachige Gemeinschaft
│   ├── fr: Communauté française
│   │   └── br: Bruxelles
│   └── vl: Vlaamse Gemeenschap
├── BG: България
├── BO: Bolivia
├── BR: Brasil
├── BS: Bahamas
├── BW: Botswana
├── BZ: Belize
├── CA: Canada
├── CD: République démocratique du Congo
├── CH: Schweiz
│   ├── zh: Kanton Zürich
│   ├── be: Kanton Bern
│   ├── lu: Kanton Luzern
│   ├── ur: Kanton Uri
│   ├── sz: Kanton Schwyz
│   ├── ow: Kanton Obwalden
│   ├── nw: Kanton Nidwalden
│   ├── gl: Kanton Glarus
│   ├── zg: Kanton Zug
│   ├── fr: Kanton Freiburg
│   ├── so: Kanton Solothurn
│   ├── bs: Kanton Basel-Stadt
│   ├── bl: Kanton Basel-Landschaft
│   ├── sh: Kanton Schaffhausen
│   ├── ar: Kanton Appenzell Ausserrhoden
│   ├── ai: Kanton Appenzell Innerrhoden
│   ├── sg: Kanton St. Gallen
│   ├── gr: Kanton Graubünden
│   ├── ag: Kanton Aargau
│   ├── tg: Kanton Thurgau
│   ├── ti: Kanton Tessin
│   ├── vd: Kanton Waadt
│   ├── vs: Kanton Wallis
│   ├── ne: Kanton Neuenburg
│   ├── ge: Kanton Genf
│   └── ju: Kanton Jura
├── CL: Chile
│   ├── ar: Arica
│   ├── ch: Chillán y Chillán Viejo
│   ├── pa: Parinacota
│   └── ta: Tarapacá
├── CO: Colombia
├── CR: Costa Rica
├── CU: Cuba
├── CY: Κύπρος
├── CZ: Česká republika
├── DK: Danmark
├── DE: Deutschland
│   ├── bb: Brandenburg
│   ├── bw: Baden Würtemberg
│   ├── by: Bayern
│   │   └── a: Stadt Augsburg
│   ├── hb: Hansestadt Bremen
│   ├── he: Hessen
│   ├── hh: Hansestadt Hamburg
│   ├── mv: Mecklenburg Vorpommern
│   ├── ni: Niedersachsen
│   ├── nw: Nordrhein-Westfalen
│   ├── rp: Rheinland-Pfalz
│   ├── sh: Schleswig-Holstein
│   ├── sl: Saarland
│   ├── sn: Sachsen
│   ├── st: Sachsen-Anhalt
│   └── th: Thüringen
├── DO: República Dominicana
├── EC: Ecuador
│   └── qu: Quito
├── EE: Eesti
├── ES: España
│   └── madrid: Comunidad de Madrid
├── FI: Suomi
├── FR: France
│   ├── basrhin: Département Bas-Rhin
│   ├── hautrhin: Département Haut-Rhin
│   ├── moselle: Département Moselle
│   ├── mayotte: Département et région d'outre-mer Mayotte
│   ├── martinique: Département et région d'outre-mer Martinique
│   ├── guadeloupe: Département et région d'outre-mer Guadeloupe
│   ├── guyane: Département et région d'outre-mer Guyane
│   └── reunion: Département et région d'outre-mer La Réunion
├── GB: Britain
│   ├── al: Alderney
│   ├── en: England
│   ├── gu: Guernsey
│   ├── im: Isle of Man
│   ├── je: Jersey
│   ├── ni: Northern Ireland
│   ├── sc: Scottland
│   └── wa: Wales
├── GD: Grenada
├── GR: Ελλάδα
├── GT: Guatemala
├── GU: Guam
├── HN: Honduras
├── HR: Hrvatska
│   ├── split: Split
│   └── dubrovnik: Dubrovnik
├── HT: Haïti
├── HU: Magyarország
├── IE: Ireland
├── IT: Italia
│   └── suedtirol: Südtirol, Alto Adige
├── IS: Ísland
├── JM: Jamaica
├── JP: 日本
├── KE: KE
├── LI: Lichtenstein
├── LT: Lietuva
├── LU: Luxembourg
├── LV: Latvija
├── MC: Monaco
├── ME: Crna Gora
├── MG: Repoblikan'i Madagasikara
├── MX: México
├── MT: Malta
├── MZ: Moçambique
├── MW: Malawi
├── NA: Namibia
├── NI: Nicaragua
├── NL: Nederland
├── NO: Norge
├── NZ: New Zealand
│   ├── au: Auckland Province
│   ├── ca: Canterbury
│   ├── ch: Chatham Islands
│   ├── ha: Hawke's Bay
│   ├── ma: Marlborough
│   ├── ne: Nelson
│   ├── no: Northland
│   ├── ot: Otago Province
│   ├── sc: South Canterbury
│   ├── so: Southland
│   ├── ta: Taranaki
│   ├── we: Wellington Province
│   └── wd: Westland
├── PA: Panamá
├── PE: Perú
│   └── cu: Cuzco
├── PL: Polska
├── PT: Portugal
├── PY: Paraguay
├── RO: Romania
├── RU: Россия
├── RW: Repubulika y'u Rwanda
├── SE: Sverige
├── SV: El Salvador
│   └── san: San Salvador
├── TR: Türkiye
├── TZ: Tanzania
├── VE: Venezuela
│   ├── an: Anzoátegui
│   ├── ca: Carabobo
│   ├── la: Lara
│   │   └── ba: Barquisimeto
│   ├── mi: Miranda
│   ├── mo: Monagas
│   ├── ta: Táchira
│   └── zu: Zulia
├── UG: Uganda
├── US: United States of America
│   ├── al: Alabama
│   ├── ak: Alaska
│   ├── az: Arizona
│   ├── ar: Arkansas
│   ├── ca: California
│   ├── co: Colorado
│   ├── ct: Connecticut
│   ├── de: Delaware
│   ├── dc: District of Columbia
│   ├── fl: Florida
│   ├── ga: Georgia
│   ├── hi: Hawaii
│   ├── id: Idaho
│   ├── il: Illinois
│   ├── in: Indiana
│   ├── ia: Iowa
│   ├── ks: Kansas
│   ├── ky: Kentucky
│   ├── la: Louisiana
│   │   └── no: New Orleans
│   ├── me: Maine
│   ├── md: Maryland
│   ├── ma: Massachusetts
│   ├── mi: Michigan
│   ├── mn: Minnesota
│   ├── ms: Mississippi
│   ├── mo: Missouri
│   ├── mt: Montana
│   ├── ne: Nebraska
│   ├── nv: Nevada
│   ├── nh: New Hampshire
│   ├── nj: New Jersey
│   ├── nm: New Mexico
│   ├── ny: New York
│   ├── nc: North Carolina
│   ├── nd: North Dakota
│   ├── oh: Ohio
│   ├── ok: Oklahoma
│   ├── or: Oregon
│   ├── pa: Pennsylvania
│   ├── ri: Rhode Island
│   ├── sc: South Carolina
│   ├── sd: South Dakota
│   ├── tn: Tennessee
│   ├── tx: Texas
│   ├── ut: Utah
│   ├── vt: Vermont
│   ├── va: Virginia
│   ├── wa: Washington
│   ├── wv: West Virginia
│   ├── wi: Wisconsin
│   └── wy: Wyoming
├── UY: Uruguay
├── ZA: South Africa
├── ZM: Zambia
└── ZW: Zimbabwe
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
hd.getStates('US')
/*>
{ al: 'Alabama',
  ...
  wy: 'Wyoming' }
*/

// get supported regions e.g. for US, Lousiana
hd.getRegions('US', 'la')
/*>
{ no: 'New Orleans' }
*/

// initialize holidays for US, Lousiana, New Orleans
hd.init('US', 'la', 'no')
// or using a new instance
hd = new Holidays('US', 'la', 'no')

// get all holidays for the year 2016
hd.getHolidays(2016)
/*>
[ { date: '2016-01-01 00:00:00',
    start: Fri Jan 01 2016 00:00:00 GMT-0600 (CST),
    end: Sat Jan 02 2016 00:00:00 GMT-0600 (CST),
    name: 'New Year\'s Day',
    type: 'public' },
  ...
  { date: '2016-11-24 00:00:00',
    start: Thu Nov 24 2016 00:00:00 GMT-0600 (CST),
    end: Fri Nov 25 2016 00:00:00 GMT-0600 (CST),
    name: 'Thanksgiving Day',
    type: 'public' },
  ...
  { date: '2016-12-26 00:00:00',
    start: Mon Dec 26 2016 00:00:00 GMT-0600 (CST),
    end: Tue Dec 27 2016 00:00:00 GMT-0600 (CST),
    substitute: true,
    name: 'Christmas Day (substitute day)',
    type: 'public' } ]
*/

// check if date is a holiday while respecting timezones
hd.isHoliday(new Date('2016-02-09 00:00:00 GMT+0000'))
//> false
hd.isHoliday(new Date('2016-02-09 10:00:00 GMT-0600'))
/*>
{ date: '2016-02-09 00:00:00',
  start: Tue Feb 09 2016 00:00:00 GMT-0600 (CST),
  end: Wed Feb 10 2016 00:00:00 GMT-0600 (CST),
  name: 'Mardi Gras',
  type: 'public' }
*/
```

## Holiday object

`getHolidays()` as well as a matching `isHoliday()` call return either a list or a single holiday object which consists of:

* {String} date - ISO Date String of (start)-date in local format
* {Date} start - start date of holiday
* {Date} end - end date of holiday
* {String} name - name of holiday using `language` (if available)
* {String} type - type of holiday `public|bank|school|observance`
* {Boolean} substitute - (optional) if true holiday substitutes another holiday`

### Dates

The `date` String represents the start date of the holiday in ISO format without timezone.
This string it intented for information only.

`start` and `end` are the start/end date of the holiday within the selected timezone of the country, state, region.

### Name

The `name` names the holiday in the local language of the selected country, state, region. The applied language(s) can be requested using `getLanguages()`.

The language can be changed using the `setLanguages()` method. In case that not translation is available a fallback to the next given language will be made. E.g. local language is "fr", `setLanguages('nl')` was called. For all holidays where no dutch translation is available the french version will be used instead.

All holiday names should support an english translation.

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

All data for the holidays of the different countries is contained in [./data/holidays.yaml](./data/holidays.yaml). Any details on structure and available grammar for holiday attribution is described in [holidays.yaml specification][].

<a name="contribution"></a>

## Contribution and License Agreement

You like to contribute please read [CONTRIBUTING.md][].

If you contribute code to this project, you are implicitly allowing your
code to be distributed under the ISC license. You are also implicitly
verifying that all code is your original work or correctly attributed
with the source of its origin and licence.

## License

Copyright (c) 2016 commenthol ([ISC License](http://opensource.org/licenses/ISC))

The data contained in `holidays.yaml` is available under [CC BY-SA 3.0](http://creativecommons.org/licenses/by-sa/3.0/) as the majority of data obtained relies on wikipedia articles.
The required attribution can be found inside the file
[./data/holidays.yaml](./data/holidays.yaml).

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
[CONTRIBUTING.md]: ./CONTRIBUTING.md
[holidays.yaml specification]: ./docs/specification.md
[Holidays API]: ./docs/Holidays.md
[date-holidays-ical]: https://github.com/commenthol/date-holidays-ical

