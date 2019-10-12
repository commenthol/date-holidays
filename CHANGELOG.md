# CHANGELOG

v1.4.5

- e4443d4 fix(US): CA Labor Day

v1.4.4

- 3ad8d07 chore: bump deps

v1.4.3

- 96a7c99 Dates for Catalonia State of Spain

v1.4.2

- aaf326c chore: bump deps
- f0aad3d fix: Remembrance day in Netherlands
- a22dbcd Update NL.yaml
- 52104d7 Fix Vietnamese (naming convention)
- 2ca3138 Update VN.yaml

v1.4.1

- 8c43335 fix(ts): TypeScript fix for HolidaysConstructor
- b6c7953 fix(KE): Fix typo in Kenya
- b5aad5a fix(ts): TypeScript fixes for Holiday and HolidaysInterface

v1.4.0

- 2077ce0 feat(BD): new country Bangladesh
- d4f1310 feat: add support for bengali-revised calendar
- d34b6b8 fix(US): correct indigenous peoples day

v1.3.10

- 3792105 fix(doc): typo
- 9abbd26 fix(example): weekdays not shown for some dates
- 1b76a97 fix(JP): substitue days; dates; new days

v1.3.9

- 194cc3a fix(GU): fix Guam holidays
- 50f39a4 fix(US-CA): Update Hawaiian state holidays
- 720cb1c fix(US-CA): Update California state holidays
- b327792 fix(US-AK): Renaming Columbus Day to Indigenous Peoples Day
- 8832cdb feat(US): Veteran's Day Federal Offices closure
- c9dde21 fix(US-MA): fix timezone
- 1ddcf0e fix(CH): adding dayoff attribute
- 0595893 feat(DE-TH): New holiday Intl. Children's Day
- c3d0ab5 fix(US-MO): Add Lincoln's Birthday
- eca1216 fix(US-HI): Add Presidents' Day in Hawaii

v1.3.8

- bb38450 test(KR): failing test due to deltat update in astronomia
- 6b3c82d fix(example): use local date for weekday
- b361f0c fix(US): Different names for Washington's Birthday
- 9d290c6 feat(SG): New Country Singapore
- ece44e7 fix(NO): Frigjøringsdagen type observance

v1.3.7
- DE: Reformation Day for DE-HB DE-HH DE-NI DE-SH and International Women's Day for DE-BE
- new maintainer Ryan Gerry

v1.3.6
- RO: Add Unification Day and Orthodox Good Friday
- git: ignore compiled holidays.json

v1.3.5
- Typescript: Interface export
- DE: misspelling corrected "Baden Würtemberg" -> "Baden-Württemberg"

v1.3.4
- US: Modify New Year's Eve in the US to be an all day holiday.
- IE: Adding another banking source for IE.
- IE: adding Christmas time bank holidays.
- IE: adding a substitute bank holiday for St. Patrick's and two refinements

v1.3.3
- HR: Fix easter holidays
- PH: Adding optional and observed holidays
- AU-QLD: Fix holidays
- doc: Update spec with "Renaming holidays" section
- MX: Adding bank holidays
- PY: Update Hero's Day and 2017 holidays
- KR: Fix test

v1.3.2
- Add dist bundles for unpkg CDN

v1.3.1
- Fix attribution typo for Vatican City.
- Fix CH holiday names in default language
- Fix CH holidays in different cantons
- Fix CH All Swiss cantons with their names in en, de, fr, it

v1.3.0
- New weekday rule

v1.2.10
- Fix: Add Summer bank holiday to GB-NIR.

v1.2.9
- Update docs
- New Country Phillipines
- New country Brunei
- New country Bermuda
- New country Benin
- New country Bahrain
- New country Burkina Faso
- New country United Arab Emirates
- DE: Add Advent sundays
- New country Christmas Island
- New country Cape Verde
- Fix name "Assunção de Maria" for "pt"

v1.2.8
- Fix name "Assunção de Maria" for "pt"
- New country Cape Verde
- New country Christmas Island
- Add observed Advent Sundays to DE

v1.2.7
- Fix Norwegian holiday names
- New country St. Helena
- New country Lesotho
- New country Tonga

v1.2.6
- New holiday Turkey Democracy and National Unity Day

v1.2.5
- keep bundle sizes small

v1.2.4
v1.2.3
- removing module, jsnext:main exports
- bundle example with webpack

v1.2.2

- New states: Brasil
- fix BR-SP Revolução Constitucionalista to 9th July

v1.2.1
- New regions: Brasil

v1.2.0
- Parser is moved into new repo [date-holidays-parser](https://github.com/commenthol/date-holidays-parser)
- Minimizing data files and build requires `--min` on `holidays2json` script
- New Countries
  - Greenland
  - Domenica
  - Curacao
  - Vatikan City
  - Ukraine
  - Slovenia
  - Serbia
  - Moldavia
  - Slovakia
  - Svalbard & Jan Mayen
  - San Marino
  - Macedonia
  - Kosovo
  - Gibraltar
- Moving French oversee departments to own Country-Code
- Fix Bosnia and Herzegovina orthodox christmas and names

v1.1.1
- Adding ES Andalucía, Andalucía

v1.1.0
- fix DK: Danish lang code
- fix DE: adding Berlin as state See #27
- Adding new Countries: AL, GY, FO, BA, CC
- Adding attribution marker `@attrib`
- Add country files *.todo which require holiday data
- refactor `active` property for rules to en-/ disable rule in time periods

v1.0.0
- major refactoring
- Using ISO 8601 format for time spans
- Renaming divisions, subdivisions to match [CLDR](http://www.unicode.org/cldr/charts/30/supplemental/territory_subdivisions.html)
- Adding new countries: AG, AI, AS, AW, AX, AZ, BB, BL, BQ, BY, CN, GG, IM, JE, KR, SO, VN

v0.2.0
- split each country into a single yaml file
- DE: Correction of holidays in BY, SN, TH
  - DE-BB: fix easter, pentecoste to "public"
  - DE-BY: use 08-15 as public in favor of population majority
  - Set 10-31 to observance
  - Add missing "Fronleichnam" to regions to DE-SN and DE-TH
  - Fix DE-BY holiday „Mariä Himmelfahrt“
  - Add missing school DE-BW holidays
  - Add missing DE Holiday on 2017-10-31
  - Fix DE holiday „Buß- und Bettag“
- DE: Add Totensonntag, Volkstrauertag

v0.1.10
- fix for US New Years Eve
- fix for Labor Day spelling in en-us countries
- new rule for optional Christmas Eve in US

v0.1.9
- custom builds with holidays2json

v0.1.8
- missing holidays AT

v0.1.7
- new holidays for CA states/ provinces

v0.1.6
- fix AU.nsw bank holidays

v0.1.5
* Country Angola added
* Country Mozambique added
* Country Botswana added
* Country Namibia added
* Country South Africa added
* Country Bahamas added
* Country Dominican Republic added
* Country Haiti added
* Country Jamaica added

v0.1.4 (2016-01-31)
* New general query function used in `date-holidays-ical`

v0.1.3 (2016-01-09)
* Country New Zealand added
* Country Cuba added
* Guatemala: Día de las Fuerzas Armadas added
* Country Belize added
* Country Guatemala added
* Country El Salvador added
* Country Honduras added

v0.1.2 (2016-01-04)
* Country Nicaragua added
* Country Costa Rica added
* Country Panama added
* Country Grenada added

v0.1.1 (2016-01-03)
* Country Colombia added
* Country Venezuela added
* Country Uruguay added
* Country Ecuador added
* Country Peru added
* Country Paraguay added
* Country Bolivia added
* Country Chile added
