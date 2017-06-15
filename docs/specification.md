# Specification for `holidays.yaml`

Version: 1.0.0

This document describes the data contained within the files `holidays.yaml` and
`names.yaml`.

## Table of Contents

<!-- !toc (minlevel=2 omit="Table of Contents") -->

* [structure of `names.yaml`](#structure-of-namesyaml)
* [structure of `holidays.yaml`](#structure-of-holidaysyaml)
* [Types of holidays](#types-of-holidays)
* [Grammar for day rules](#grammar-for-day-rules)
  * [Fixed Date](#fixed-date)
  * [Fixed Date at beginning of a Month](#fixed-date-at-beginning-of-a-month)
  * [Movable Date](#movable-date)
  * [Different start-time for Fixed Date other than midnight](#different-start-time-for-fixed-date-other-than-midnight)
  * [Different duration other than 24 hours](#different-duration-other-than-24-hours)
  * [Start-time of holiday changes per weekday](#start-time-of-holiday-changes-per-weekday)
  * [Changes to different weekday from a given fixed Date](#changes-to-different-weekday-from-a-given-fixed-date)
  * [Changes to different weekday from a given Month](#changes-to-different-weekday-from-a-given-month)
  * [Change to a different weekday from a changed fixed Date](#change-to-a-different-weekday-from-a-changed-fixed-date)
  * [Change to different weekday if date falls on a certain weekday](#change-to-different-weekday-if-date-falls-on-a-certain-weekday)
  * [Substitute a holiday if date falls on a certain weekday](#substitute-a-holiday-if-date-falls-on-a-certain-weekday)
  * [Observe the holiday as well as on a substitute day, if date falls on a certain weekday](#observe-the-holiday-as-well-as-on-a-substitute-day-if-date-falls-on-a-certain-weekday)
  * [Enable Date only for odd/ even numbered years](#enable-date-only-for-odd-even-numbered-years)
  * [Enable Date only for certain periods of years](#enable-date-only-for-certain-periods-of-years)
  * [Holiday based on other holidays (bridge days)](#holiday-based-on-other-holidays-bridge-days)
  * [Disabling a rule](#disabling-a-rule)
  * [Moving a date](#moving-a-date)
* [Generation of `holidays.json`](#generation-of-holidaysjson)

<!-- toc! -->

## structure of `names.yaml`

`names.yaml` contains translations of commonly used rules or days. These are
referenced using the `_name:` key from within `holidays.yaml`.

The basic structure looks as follows:

```yaml
names:
  <identifier>:
    <lang_1>: {String} # name in language 1
    <lang_2>: {String} # name in langzage 2
```

- The `<identifier>` can be referenced using `_name:`.
- `<lang_?>` represents the ISO 639-1 language code for the assigned language.

## structure of `holidays.yaml`

`holidays.yaml` contains the holiday data for all supported countries, states, regions

The basic structure look as follows:

```yaml
version: <versionNumber>

holidays:
  <country_code_1>:     # IANA country code
    names:              # name of country
    dayoff: {String}    # name of weekday which is a default day off (friday|saturday|sunday|...)
    days:               # see days structure
      ...
    states:             # (optional) specify special holidays per state
      <state_code_1>:   # short code of state (ISO 3166-2)
        names:          # name of state
        days:           # see days structure
          ...
        regions:        # (optional) specify special holidays per region
          <region_code_1>:  # short code of region (ISO 3166-2 if applicable)
            names:      # name of region in local language
            days:       # see days structure
              ...
    regions:            # (optional) specify special holidays per region (for small countries without states)
      <region_code_1>:  # short code of region
        names:          # name of region
        days:           # see days structure
          ...
  <country_code_2>:     # next country ...
    ...
```

- `<country_code_?>` is the IANA code of the country
- `<state_code_?>` is a short code representing the state (any ascii based string)
- `<region_code_?>` is a short code representing the region (any ascii based string)

For country codes check:  
<https://en.m.wikipedia.org/wiki/List_of_Internet_top-level_domains#Country_code_top-level_domains>

For country codes / divisions / subdivisions - ISO 3166-2:  
<http://www.unicode.org/cldr/charts/30/supplemental/territory_subdivisions.html>

For timezones:  
<https://github.com/moment/moment-timezone/blob/develop/data/meta/latest.json>

For language codes ISO 639-1:  
<http://www.unicode.org/cldr/charts/30/supplemental/language_territory_information.html>

To specify the rules to calculate the holidays per country, state, region is as follows:

```yaml
<country/state/region>:
  names:                   # name of country/state/region
    <lang_1>: {String}     # name in local language
    <lang_2>: {String}     # name in other language
  name: {String}           # name of country/state/region in local language of country (use only if `names` not present)
  langs:                   # (mandatory for country) list of language codes (ISO 639-1)
    - <lang_1>             # spoken in country, state, region
    - <lang_2>     
  zones:                   # (mandatory for country) list of timezone(s)
    - <timezone_1>     
    - <timezone_2>     
  _days:                   # (optional) reference days of other country, state, region
    - <country_code_x>
    - states
    - <state_code_x>
    - regions
    - <regions_code_x>
  days:
    <rule_1>:              # see grammar
      name:
        <lang_1>: {String} # name of day in language 1
        <lang_2>: {String} # name of day in language 2
      type: {String}       # type of holiday (public|bank|school|optional|observance)
      note: {String}       # (optional) note
      substitute: true     # (optional) if set to true then '(substitute day)' gets appended to name
      disable:             # (optional) disables a date
        - '<YYYY-MM-DD>'   # list of date stings in quotes declaring the dates to disable the rule
      enable:              # (optional) enables the days, such moving it to the given date. Only use with `disable`
        - '<YYYY-MM-DD>'   # list of date stings in quotes declaring the dates to enable the disabled rule
    <rule_2>:
      _name: <ref>    # reference of name translated within `names.yaml` file
```

- `<county/state/region>` is the shortcode to identify country, state or region
- `<lang_?>` represents the ISO 639-1 language code for the assigned language.
- `<timezone_?>` is a string representing the timezone. See file `data/meta/latest.json` of [moment-timezone][]
- `<rule_?>` is the rule for that holiday

## Types of holidays

Currently the following type with their meaning are supported

| type        | meaning                                    |
| ----------- | ------------------------------------------ |
| public      | public holiday                             |
| bank        | bank holiday, banks and offices are closed |
| school      | school holiday, schools are closed         |
| optional    | majority of people take a day off          |
| observance  | optional festivity, no paid day off        |

Additionally a `note` field is sometimes available for further clarification.

## Grammar for day rules

### Fixed Date

A fixed day in a year is attributed with `MM-DD` in ISO notation.

A fix day for a given year is attributed with `YYYY-MM-DD`.

**Examples**:

- `01-01` is January first
- `12-11` is December 11th
- `'2015-10-09'` is October 9th of 2015 (Enclose such date in quotes as otherwise it will be expanded to an ISO date by js-yaml)

### Fixed Date at beginning of a Month

Rule: `(January|February|March|April|May|June|July|August|September|October|November|December)`

**Examples**

- `February` equals to `02-01`

### Movable Date

#### Easter Dates

Easter and Orthodox Easter (using Julian Calendar) are supported as movable dates.

Rule: `(easter|orthodox) (+|-)?<number-of-days>`

**Examples**:

- `easter` is Easter Sunday
- `easter -2` is 2 days before Easter Sunday (Good Friday)
- `easter 49` is 49 days after Easter Sunday (Pentecost)
- `orthodox` is Easter Sunday using the Julian Calendar
- `orthodox -2` is 2 days before Easter Sunday (Good Friday) using the Julian calendar
- `orthodox 49` is 49 days after Easter Sunday (Pentecost) using the Julian calendar

#### Hijra Dates

> __Note__: Islamic days start at sunset which depends on latitude/ longitude.
> To avoid such calculations, the approximation of using 18:00 as hour of sunset
> is made.

Dates in the islamic calendar can be attributed using the following rule:

Rule: `<day-of-month> (Muharram|Safar|Rabi al-awwal|Rabi al-thani|Jumada al-awwal|Jumada al-thani|Rajab|Shaban|Ramadan|Shawwal|Dhu al-Qidah|Dhu al-Hijjah)`

**Examples**:

- `3 Shawwal` is 3rd day in month Shawwal

#### Dates in Hebrew calendar

> __Note__: Days in the Hebrew calendar start at sunset which depends on latitude/ longitude.
> To avoid such calculations, the approximation of using 18:00 as hour of sunset is made.

Dates in the islamic calendar can be attributed using the following rule:

Rule: `<day-of-month> (Nisan|Iyyar|Sivan|Tamuz|Av|Elul|Tishrei|Cheshvan|Kislev|Tevet|Shvat|Adar)`

**Examples**:

- `15 Nisan` is 15th day in month Nisan

#### Dates in Chinese calendar (lunar)

Dates in the chines calendar can be attributed using the following rule:

Rule: `chinese <cycle>-<year>-<month>-<leapmonth>-<day>`

Where:
- `<cycle>` (optional) Chinese cycle - current is 78
- `<year>` (optional) year in Chinese cycle (1 ... 60)
- `<month>` (mandatory) lunar month
- `<leapmonth>` (mandatory) `0|1` - `1` means month is leap month
- `<day>` (mandatory) day of lunar month

**Examples**:

- `chinese 01-0-01` is 1st day in the 1st lunar month (aka Chinese New Year)
- `chinese 78-32-08-0-15` is 15th day in the 8th non-leap lunar month in year 32 of 78th cycle

#### Dates in Chinese calendar (solar)

Rule: `chinese <cycle>-<year>-<count>-<day> solarterm`

Where:
- `<cycle>` (optional) Chinese cycle - current is 78
- `<year>` (optional) year in Chinese cycle (1 ... 60)
- `<count>` (mandatory) Number of solar term. (1 .. 24)
- `<day>` (mandatory) day of lunar month

**Examples**:

- `chinese 5-01 solarterm` is the 1st day in the 5th solarterm (aka Qingming Festival)
- `chinese 78-32-24-01 solarterm` is the 1st day in the 24th solarterm in year 32 of 78th cycle

#### Equinox, Solstice

To calculate a date from Spring, Autumn Equinox or Summer, Winter Solstice the following rule can be used:

Rule: `(<number-of-days>|<count>? <weekday>) (after|before) (march|september) equinox (in <timezone>)?`

Rule: `(<number-of-days> (d|days)?|<count>? <weekday>) (after|before) (june|december) solstice (in <timezone>)?`

If `in <timezone>` is missing then GMT is assumed.

**Examples**:

- `december solstice` is December solstice in timezone GMT
- `5 days before september equinox` is 5 days before September equinox using GMT timezone
- `march equinox in Asia/Tokyo` is march equinox in the timezone "Asia/Tokyo"
- `march equinox in +09:00` is march equinox in the timezone "+09:00"
- `3rd sunday after june solstice in Asia/Tokyo` is 3rd Sunday after June solstice in the timezone "Asia/Tokyo"

### Different start-time for Fixed Date other than midnight

A holiday might start in the afternoon of a given day ` HH:MM`

Rule: append ` HH:MM`

**Examples**:
- `12-31 14:00` holiday starts at 14h on December 31st

### Different duration other than 24 hours

A holiday last longer/less then the default of one day. For attribution the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601#Durations) format for durations is used.

Rule: append `P0DT0H0M`

- where `0` gets replaced by a number
- `D` = days
- `H` = hours
- `M` = minutes
- years, months and seconds are not supported

**Examples**:
- `12-31 14:00 PT5H` holiday starts at 14h on December 31st and ends at 21h as duration is 5 hours
- `easter P1DT12H` holiday starts on midnight Easter Sunday and ends at the following Tuesday at 12h

### Start-time of holiday changes per weekday

A holiday might start in the afternoon of a given day ` HH:MM` but on a different time for another weekday.

Rule: `MM-DD HH:MM if weekday then HH:MM`

**Examples**:
- `12-31 14:00 if sunday then 00:00` holiday starts at 14h on December 31st but if December 31st falls on a Sunday start date will be 00:00

### Changes to different weekday from a given fixed Date

A holiday may change to a weekday starting from a given fixed Date.

Rule: `<count> <weekday> (after|before) MM-DD`

"after" means the same day and after

"before" means all days before but not the same day

**Examples**:

- `monday after 02-01` is the Monday after February 1st or February 1st if this day is a Monday
- `monday before 02-01` is the Monday before February 1st but can never be February 1st
- `2nd sunday after 05-01` is the 2nd Sunday in May
- `4th thursday after 11-01` is the 4th Thursday in November
- `sunday before 10-01` is the last Sunday in September

### Changes to different weekday from a given Month

A holiday may change to a weekday starting from the first day of a month.

Rule: `<count> <weekday> (before|in) <month>`

"in" means the same day and after

"before" means all days before but not the same day

**Examples**:

- `1st monday in February` is the Monday after February 1st or February 1st if this day is a Monday
- `monday before February` is the Monday before February 1st but can never be February 1st
- `2nd sunday in May` is the 2nd Sunday in May
- `4th thursday in November` is the 4th Thursday in November
- `sunday before October` is the last Sunday in September

### Change to a different weekday from a changed fixed Date

Rule: `<weekday> (after|before) <count> <weekday> (after|before) MM-DD`

**Examples**:

- `friday after 4th thursday after 11-01` is the Friday after the 4th Thursday in November
- `saturday before 2nd sunday after 05-01` is the Saturday before the 2nd Sunday in May

### Change to different weekday if date falls on a certain weekday

Rule: `MM-DD if <weekday> then (next|previous) <weekday>`

**Examples**:

- `03-02 if sunday then next monday` if March 2nd is on a Sunday then holiday will be on next Monday
- `04-13 if friday then previous monday` if April 13th is on a Friday then holiday falls to previous Monday

### Substitute a holiday if date falls on a certain weekday

Rule: `substitute MM-DD if <weekday> then (next|previous) <weekday>`

If `substitute: true` is given then the translated string from `names.yaml/names/substitutes` will be appended to the name.
E.g. "Christmas" becomes "Christmas (substitute day)"

**Examples**:

- `substitute 03-02 if sunday then next monday` if March 2nd is on a Sunday then holiday will be on next Monday
- `substitute 04-13 if friday then previous monday` if Apri 13th is on a Friday then holiday falls to previous Monday

### Observe the holiday as well as on a substitute day, if date falls on a certain weekday

Rule: `MM-DD and if <weekday> then (next|previous) <weekday>`

This line generates two holidays. One for `MM-DD` plus the observed substitute day following the rule.

If `substitute: true` is given then the translated string from `names.yaml/names/substitutes` will be appended to the name.
E.g. "Christmas" becomes "Christmas (substitute day)"

**Examples**:

- `03-02 and if sunday then next monday` if March 2nd is on a Sunday then holiday will be on next Monday
- `04-13 and if friday then previous monday` if April 13th is on a Friday then holiday falls to previous Monday

### Enable Date only for odd/ even numbered years

Rule: `MM-DD in (even|odd|leap|non-leap) years`

**Examples**:

- `03-02 in even years` if year is even numbered (e.g. 2012) then March 2nd will be a holiday
- `04-03 in odd years` if year is odd numbered (e.g. 2011) then April 3rd will be a holiday
- `05-04 in leap years` if year is a leap year (e.g. 2012) then May 4th will be a holiday
- `06-05 in non-leap years` if year is not a leap year (e.g. 2011) then June 5th will be a holiday

### Enable Date only for certain periods of years

Rule: `MM-DD every <count> years since <year>`

**Examples**:

- `12-01 every 6 years since 1980` if year is within a 6 years period from 1980 on December 1st will be a holiday (e.g. for 1986, 1992, 1998, ...)

### Holiday based on other holidays (bridge days)

Rule: `<date> if MM-DD (and MM-DD)? is (<type>)? holiday`

**Examples**:

- `09-22 if 09-21 is holiday` is September 22nd is public holiday only if September 21st is also a holiday
- `09-22 if 09-21 and 09-23 is public holiday` is September 22nd is public holiday only if September 21st and September 23rd are public holidays

### Disabling a rule

On any rule it is possible to disable it for a given date. For every year an entry can be applied to the list.

E.g. in case that the 4th Monday in November is the 2015-11-23 then the day will not be a holiday.

```
days:
  4th monday after 11-01:
    disable:
      - '2015-11-23'
    name:
      en: Day of National Sovereignty
```

### Moving a date

In order to move a date for a rule use `disable` together with `enable`.

E.g. in case that the 4th Monday in November is the 2015-11-23 then the day gets moved to 2015-11-27.

```
days:
  4th monday in November:
    disable:
      - '2015-11-23'
    enable:
      - '2015-11-27'
    name:
      en: Day of National Sovereignty
```

## Generation of `holidays.json`

To generate the file `holidays.json` which is used by the module run:

```
npm run yaml
```

This concatenates the two files `holidays.yaml` and `names.yaml` and generates the JSON file.

# References

<!-- !ref -->

* [moment-timezone][moment-timezone]

<!-- ref! -->

[moment-timezone]: https://github.com/moment/moment-timezone

----
End of file
