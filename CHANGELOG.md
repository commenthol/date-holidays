# CHANGELOG

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
