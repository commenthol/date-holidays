# date-holidays

> world-wide holidays in gregorian calender

[![NPM version](https://badge.fury.io/js/date-holidays.svg)](https://www.npmjs.com/package/date-holidays/)
[![Build Status](https://github.com/commenthol/date-holidays/actions/workflows/ci.yml/badge.svg)](https://github.com/commenthol/date-holidays/actions/workflows/ci.yml)

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
Countries: 199
├── AD: Andorra
│   └── 07: Andorra la Vella
├── AE: دولة الإمارات العربية المتحدة
├── AG: Antigua & Barbuda
│   └── 10: Barbuda
├── AI: Anguilla
├── AL: Shqipëri
├── AM: Հայաստան
├── AO: Angola
├── AR: Argentina
├── AS: American Samoa
├── AT: Österreich
│   ├── 1: Burgenland
│   ├── 2: Kärnten
│   ├── 3: Niederösterreich
│   ├── 4: Oberösterreich
│   ├── 5: Land Salzburg
│   ├── 6: Steiermark
│   ├── 7: Tirol
│   ├── 8: Vorarlberg
│   └── 9: Wien
├── AU: Australia
│   ├── ACT: Australian Capital Territory
│   ├── NSW: New South Wales
│   ├── NT: Northern Territory
│   ├── QLD: Queensland
│   ├── SA: South Australia
│   ├── TAS: Tasmania
│   ├── VIC: Victoria
│   └── WA: Western Australia
├── AW: Aruba
├── AX: Landskapet Åland
├── AZ: Azərbaycan Respublikası
├── BA: Bosna i Hercegovina
│   ├── BIH: Federation of Bosnia and Herzegovina
│   │   └── W: Western Herzegovina
│   ├── BRC: Brčko District
│   └── SRP: Republika Srpska
├── BB: Barbados
├── BD: গণপ্রজাতন্ত্রী বাংলাদেশ
├── BE: Belgique
│   ├── BRU: Bruxelles
│   ├── DE: Deutschsprachige Gemeinschaft
│   ├── VLG: Vlaamse Gemeenschap
│   └── WAL: Communauté française
├── BF: Burkina Faso
├── BG: България
├── BH: مملكة البحرين
├── BI: République du Burundi
├── BJ: République du Bénin
├── BL: St. Barthélemy
├── BM: Bermuda
├── BN: Negara Brunei Darussalam
├── BO: Bolivia
│   ├── B: Beni
│   ├── C: Cochabamba
│   ├── H: Chuquisaca
│   ├── L: La Paz
│   ├── N: Pando
│   ├── O: Oruro
│   ├── P: Potosí
│   ├── S: Santa Cruz
│   └── T: Tarija
├── BQ: Caribisch Nederland
│   ├── BO: Bonaire
│   ├── SA: Saba
│   └── SE: Sint Eustatius
├── BR: Brasil
│   ├── AC: Acre
│   ├── AL: Alagoas
│   ├── AM: Amazonas
│   ├── AP: Amapá
│   ├── BA: Bahia
│   ├── CE: Ceará
│   ├── DF: Distrito Federal
│   ├── MA: Maranhão
│   ├── MG: Minas Gerais
│   │   └── BH: Belo Horizonte
│   ├── MS: Mato Grosso do Sul
│   ├── MT: Mato Grosso
│   ├── PA: Pará
│   ├── PB: Paraíba
│   ├── PE: Pernambuco
│   │   └── RE: Recife
│   ├── PI: Piauí
│   ├── PR: Paraná
│   │   └── CU: Curitiba
│   ├── RJ: Rio de Janeiro
│   │   └── RJ: Rio de Janeiro
│   ├── RN: Rio Grande do Norte
│   ├── RO: Rondônia
│   ├── RR: Roraima
│   ├── RS: Rio Grande do Sul
│   ├── SC: Santa Catarina
│   ├── SE: Sergipe
│   ├── SP: São Paulo
│   │   └── SP: São Paulo
│   └── TO: Tocantins
├── BS: Bahamas
├── BW: Botswana
├── BY: Рэспубліка Беларусь
├── BZ: Belize
├── CA: Canada
│   ├── AB: Alberta
│   ├── BC: British Columbia
│   ├── MB: Manitoba
│   ├── NB: New Brunswick
│   ├── NL: Newfoundland and Labrador
│   ├── NS: Nova Scotia
│   ├── NT: Northwest Territories
│   ├── NU: Nunavut
│   ├── ON: Ontario
│   ├── PE: Prince Edward Island
│   ├── QC: Quebec
│   ├── SK: Saskatchewan
│   └── YT: Yukon
├── CC: Cocos (Keeling) Islands
├── CD: République démocratique du Congo
├── CF: République centrafricaine
├── CG: République du Congo
├── CH: Schweiz
│   ├── ZH: Kanton Zürich
│   ├── BE: Kanton Bern
│   ├── LU: Kanton Luzern
│   ├── UR: Kanton Uri
│   ├── SZ: Kanton Schwyz
│   ├── OW: Kanton Obwalden
│   ├── NW: Kanton Nidwalden
│   ├── GL: Kanton Glarus
│   ├── ZG: Kanton Zug
│   ├── FR: Canton de Fribourg
│   ├── SO: Kanton Solothurn
│   ├── BS: Kanton Basel-Stadt
│   ├── BL: Kanton Basel-Landschaft
│   ├── SH: Kanton Schaffhausen
│   ├── AR: Kanton Appenzell Ausserrhoden
│   ├── AI: Kanton Appenzell Innerrhoden
│   ├── SG: Kanton St. Gallen
│   ├── GR: Kanton Graubünden
│   ├── AG: Kanton Aargau
│   ├── TG: Kanton Thurgau
│   ├── TI: Canton Ticino
│   ├── VD: Canton de Vaud
│   ├── VS: Canton du Valais
│   ├── NE: Canton de Neuchâtel
│   ├── GE: Canton de Genève
│   └── JU: Canton du Jura
├── CI: République de Côte d'Ivoire
├── CK: Cook Islands
│   ├── Aitutaki: Aitutaki
│   ├── Atiu: Atiu
│   ├── Mangaia: Mangaia
│   ├── Manihiki: Manihiki
│   ├── Mitiaro: Mitiaro
│   ├── Palmerston: Palmerston
│   ├── Penrhyn: Penrhyn
│   ├── Pukapuka: Pukapuka
│   ├── Rakahanga: Rakahanga
│   └── Rarotonga: Rarotonga
├── CL: Chile
│   ├── AP: Arica y Parinacota
│   ├── BI: Biobío
│   │   └── CH: Chillán y Chillán Viejo
│   ├── NU: Ñuble
│   │   └── CH: Chillán y Chillán Viejo
│   └── TA: Tarapacá
├── CM: Cameroun
├── CN: 中华人民共和国
├── CO: Colombia
├── CR: Costa Rica
├── CU: Cuba
├── CV: República de Cabo Verde
│   └── S: Sotavento Islands
│       └── PR: Praia
├── CW: Curaçao
├── CX: Christmas Island
├── CY: Κύπρος
├── CZ: Česká republika
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
├── DJ: République de Djibouti
├── DK: Danmark
├── DM: Dominica
├── DO: República Dominicana
├── DZ: الجمهورية الجزائرية الديمقراطية الشعبية
├── EC: Ecuador
│   └── P: Pichincha
│       └── QU: Quito
├── EE: Eesti
├── EG: جمهورية مصر العربية
├── EH: الجمهورية العربية الصحراوية الديمقراطية
├── ER: Eritrea
├── ES: España
│   ├── AN: Andalucía
│   ├── AR: Aragón
│   ├── AS: Asturias
│   ├── CB: Cantabria
│   ├── CE: Ciudad de Ceuta
│   ├── CL: Castilla y León
│   ├── CM: Castile-La Mancha
│   ├── CN: Islas Canarias
│   │   ├── EH: El Hierro
│   │   ├── FU: Fuerteventura
│   │   ├── GC: Gran Canaria
│   │   ├── LG: La Gomera
│   │   ├── LP: La Palma
│   │   ├── LA: Lanzarote
│   │   └── TE: Tenerife
│   ├── CT: Cataluña
│   ├── EX: Extremadura
│   ├── GA: Galicia
│   ├── IB: Illes Balears
│   ├── MC: Murcia Region
│   ├── MD: Comunidad de Madrid
│   ├── ML: Ciudad de Melilla
│   ├── NC: Comunidad Foral de Navarra
│   ├── PV: País Vasco
│   ├── RI: La Rioja
│   └── VC: Comunitat Valenciana
├── ET: ኢትዮጵያ
├── FI: Suomi
├── FJ: Matanitu Tugalala o Viti
├── FO: Føroyar
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
│   └── BL: Département et région d'outre-mer Saint Barthélemy
├── GA: Gabon
├── GB: United Kingdom
│   ├── ALD: Alderney
│   ├── ENG: England
│   ├── NIR: Northern Ireland
│   ├── SCT: Scotland
│   └── WLS: Wales
├── GD: Grenada
├── GE: საქართველო
├── GF: Guyane
├── GG: Guernsey
├── GH: Ghana
├── GI: Gibraltar
├── GL: Kalaallit Nunaat
├── GM: The Gambia
├── GN: Guinée
├── GP: Guadeloupe
├── GQ: República de Guinea Ecuatorial
├── GR: Ελλάδα
├── GT: Guatemala
│   └── 1: Guatemala
│       ├── 101: Guatemala
│       ├── 102: Santa Catarina Pinula
│       ├── 103: San José Pinula
│       ├── 104: San José del Golfo
│       ├── 105: Palencia
│       ├── 106: Chinautla
│       ├── 107: San Pedro Ayampuc
│       ├── 108: Mixco
│       ├── 109: San Pedro Sacatepéquez
│       ├── 110: San Juan Sacatepéquez
│       ├── 111: San Raimundo
│       ├── 112: San Pedro y San Pablo
│       ├── 113: Fraijanes
│       ├── 114: Amatitlán
│       ├── 115: Villa Nueva
│       ├── 116: Villa Canales
│       └── 117: San Miguel Petapa
├── GU: Guam
├── GW: Guiné-Bissau
├── GY: Guyana
├── HK: 香港
├── HN: Honduras
├── HR: Hrvatska
│   ├── 17: Split-Dalmatia
│   └── 19: Dubrovnik-Neretva
├── HT: Haïti
├── HU: Magyarország
├── IC: Islas Canarias
│   ├── EH: El Hierro
│   ├── FU: Fuerteventura
│   ├── GC: Gran Canaria
│   ├── LG: La Gomera
│   ├── LP: La Palma
│   ├── LA: Lanzarote
│   └── TE: Tenerife
├── ID: Indonesia
├── IE: Ireland
├── IL: מְדִינַת יִשְׂרָאֵל
├── IM: Isle of Man
├── IN: India
│   ├── AN: Andaman and Nicobar Islands
│   ├── AP: Andhra Pradesh
│   ├── AR: Arunachal Pradesh
│   ├── AS: Assam
│   ├── BR: Bihar
│   ├── CH: Chandigarh
│   ├── CT: Chhattisgarh
│   ├── DD: Daman and Diu
│   ├── DL: Delhi
│   ├── DN: Dadra and Nagar Haveli
│   ├── GA: Goa
│   ├── GJ: Gujarat
│   ├── HP: Himachal Pradesh
│   ├── HR: Haryana
│   ├── JK: Jammu and Kashmir
│   ├── KA: Karnataka
│   ├── KL: Kerala
│   ├── LD: Lakshadweep
│   ├── MH: Maharashtra
│   ├── ML: Meghalaya
│   ├── MN: Manipur
│   ├── MP: Madhya Pradesh
│   ├── MZ: Mizoram
│   ├── NL: Nagaland
│   ├── OR: Odisha
│   ├── PB: Punjab
│   ├── PY: Puducherry
│   ├── RJ: Rajasthan
│   ├── SK: Sikkim
│   ├── TG: Telangana
│   ├── TN: Tamil Nadu
│   ├── TR: Tripura
│   ├── UP: Uttar Pradesh
│   ├── UT: Uttarakhand
│   └── WB: West Bengal
├── IR: جمهوری اسلامی ایران
├── IS: Ísland
├── IT: Italia
│   ├── 25: Lombardy
│   │   └── MI: Milan
│   ├── 32: Alto Adige
│   ├── 52: Toscana
│   │   └── FI: Firenze
│   └── 62: Lazio
│       └── RM: Roma
├── JE: Jersey
├── JM: Jamaica
├── JP: 日本
├── KE: Kenya
├── KM: Union des Comores
├── KN: St. Kitts & Nevis
├── KR: 대한민국
├── KY: Cayman Islands
├── LC: St. Lucia
├── LI: Liechtenstein
├── LR: Liberia
├── LS: \'Muso oa Lesotho
├── LT: Lietuva
├── LU: Luxembourg
├── LV: Latvija
├── LY: دولة ليبيا
├── MA: المملكة المغربية
├── MC: Monaco
├── MD: Republica Moldova
│   ├── CA: Cahul
│   └── CU: Chișinău
├── ME: Crna Gora
├── MF: Saint Martin
├── MG: Repoblikan'i Madagasikara
├── MK: Република Македонија
├── ML: République du Mali
├── MQ: Martinique
├── MR: الجمهورية الإسلامية الموريتانية
├── MS: Montserrat
├── MT: Malta
├── MW: Malawi
├── MX: México
├── MY: Malaysia
│   ├── 10: Selangor
│   ├── 11: Terengganu
│   ├── 12: Sabah
│   ├── 13: Sarawak
│   ├── 14: Kuala Lumpur
│   ├── 15: Labuan
│   ├── 16: Putrajaya
│   ├── 01: Johor
│   ├── 02: Kedah
│   ├── 03: Kelantan
│   ├── 04: Malacca
│   ├── 05: Negeri Sembilan
│   ├── 06: Pahang
│   ├── 07: Penang
│   ├── 08: Perak
│   └── 09: Perlis
├── MZ: Moçambique
├── NA: Namibia
├── NC: Nouvelle-Calédonie
├── NE: République du Niger
├── NG: Nigeria
├── NI: Nicaragua
├── NL: Nederland
│   ├── GR: Groningen
│   │   └── GRN: Groningen
│   ├── NH: Noord-Holland
│   │   └── ALK: Alkmaar
│   └── ZH: Zuid-Holland
│       ├── BRL: Brielle
│       └── LDN: Leiden
├── NO: Norge
├── NZ: New Zealand
│   ├── AUK: Auckland Province
│   ├── BOP: Bay of Plenty
│   ├── CAN: Canterbury
│   │   └── Timaru: Timaru District
│   ├── CIT: Chatham Islands
│   ├── GIS: Gisborne
│   ├── HKB: Hawke's Bay
│   ├── MBH: Marlborough
│   ├── MWT: Manawatu-Wanganui
│   ├── NSN: Nelson
│   ├── NTL: Northland
│   ├── OTA: Otago Province
│   ├── STL: Southland
│   ├── TAS: Tasman
│   ├── TKI: Taranaki
│   ├── WKO: Waikato
│   ├── WGN: Wellington Province
│   └── WTC: Westland
│       └── Buller: Buller district
├── PA: Panamá
├── PE: Perú
│   └── CUS: Cuzco
├── PH: Philippines
├── PL: Polska
├── PM: St. Pierre & Miquelon
├── PR: Puerto Rico
├── PT: Portugal
├── PY: Paraguay
├── RE: Réunion
├── RO: Romania
├── RS: Република Србија
├── RU: Россия
├── RW: Rwanda
├── SA: المملكة العربية السعودية
├── SC: Seychelles
├── SD: جمهورية السودان
├── SE: Sverige
├── SG: Singapore
├── SH: St. Helena
│   ├── AC: Ascension Island
│   ├── HL: Saint Helena
│   └── TA: Tristan da Cunha
├── SI: Republika Slovenija
├── SJ: Svalbard & Jan Mayen
├── SK: Slovenská republika
├── SL: Sierra Leone
├── SM: San Marino
├── SN: République du Sénégal
├── SO: Jamhuuriyadda Federaalka Soomaaliya
│   ├── AW: Awdal
│   ├── SA: Sanaag
│   ├── SO: Sool
│   ├── TO: Togdheer
│   └── WO: Woqooyi Galbeed
├── SR: Suriname
├── SS: South Sudan
├── ST: São Tomé & Príncipe
├── SV: El Salvador
│   └── SS: San Salvador
├── SX: Sint Maarten
├── SZ: Eswatini
├── TC: Turks & Caicos Islands
├── TD: جمهورية تشاد
├── TG: République togolaise
├── TH: Thailand
├── TN: الجمهورية التونسية
├── TO: Puleʻanga Fakatuʻi ʻo Tonga
├── TR: Türkiye
├── TT: Trinidad & Tobago
├── TW: 中華民國
├── TZ: Tanzania
├── UA: Україна
├── UG: Uganda
├── US: United States of America
│   ├── AL: Alabama
│   ├── AK: Alaska
│   ├── AZ: Arizona
│   ├── AR: Arkansas
│   ├── CA: California
│   │   └── LA: Los Angeles
│   ├── CO: Colorado
│   ├── CT: Connecticut
│   ├── DE: Delaware
│   ├── DC: District of Columbia
│   ├── FL: Florida
│   ├── GA: Georgia
│   ├── HI: Hawaii
│   ├── ID: Idaho
│   ├── IL: Illinois
│   ├── IN: Indiana
│   ├── IA: Iowa
│   ├── KS: Kansas
│   ├── KY: Kentucky
│   ├── LA: Louisiana
│   │   └── NO: New Orleans
│   ├── ME: Maine
│   ├── MD: Maryland
│   ├── MA: Massachusetts
│   ├── MI: Michigan
│   ├── MN: Minnesota
│   ├── MS: Mississippi
│   ├── MO: Missouri
│   ├── MT: Montana
│   ├── NE: Nebraska
│   ├── NV: Nevada
│   ├── NH: New Hampshire
│   ├── NJ: New Jersey
│   ├── NM: New Mexico
│   ├── NY: New York
│   ├── NC: North Carolina
│   ├── ND: North Dakota
│   ├── OH: Ohio
│   ├── OK: Oklahoma
│   ├── OR: Oregon
│   ├── PA: Pennsylvania
│   ├── RI: Rhode Island
│   ├── SC: South Carolina
│   ├── SD: South Dakota
│   ├── TN: Tennessee
│   ├── TX: Texas
│   ├── UT: Utah
│   ├── VT: Vermont
│   ├── VA: Virginia
│   ├── WA: Washington
│   ├── WV: West Virginia
│   ├── WI: Wisconsin
│   └── WY: Wyoming
├── UY: Uruguay
├── VA: Stato della Città del Vaticano
├── VC: St. Vincent & Grenadines
├── VE: Venezuela
│   ├── B: Anzoátegui
│   ├── G: Carabobo
│   ├── K: Lara
│   │   └── BA: Barquisimeto
│   ├── M: Miranda
│   ├── N: Monagas
│   ├── S: Táchira
│   └── V: Zulia
├── VG: British Virgin Islands
├── VI: U.S. Virgin Islands
├── VN: Cộng hòa Xã hội chủ nghĩa Việt Nam
├── VU: République de Vanuatu
├── XK: Republika e Kosovës
├── YT: Mayotte
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
    rule: '01-01 and if sunday then next monday if saturday then previous friday',
    type: 'public' },
  ...
  { date: '2016-11-24 00:00:00',
    start: Thu Nov 24 2016 00:00:00 GMT-0600 (CST),
    end: Fri Nov 25 2016 00:00:00 GMT-0600 (CST),
    name: 'Thanksgiving Day',
    rule: '4th thursday in November',
    type: 'public' },
  ...
  { date: '2016-12-26 00:00:00',
    start: Mon Dec 26 2016 00:00:00 GMT-0600 (CST),
    end: Tue Dec 27 2016 00:00:00 GMT-0600 (CST),
    substitute: true,
    name: 'Christmas Day (substitute day)',
    rule: '12-25 and if sunday then next monday if saturday then previous friday',
    type: 'public' } ]
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
./scripts/holidays2json --pick US,CA,MX
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
