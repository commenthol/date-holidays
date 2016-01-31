# Global





* * *

## Class: Holidays


### Holidays.init(country, state, region, opts, opts.languages, opts.timezone, opts.types) 

initialize holidays for a country/state/region

**Parameters**

**country**: `String | Object`, if object use `{ country: {String}, state: {String}, region: {String} }`

**state**: `String`, specifies state

**region**: `String`, specifies region

**opts**: `Object`, options

**opts.languages**: `Array | String`, set language(s) with ISO 639-1 shortcodes

**opts.timezone**: `String`, set timezone

**opts.types**: `Array`, holiday types to consider


### Holidays.setHoliday(rule, opts, opts.name, opts.type) 

set (custom) holiday

**Parameters**

**rule**: `String`, rule for holiday (check supported grammar) or date in ISO Format, e.g. 12-31 for 31th Dec

**opts**: `Object | String`, holiday options, if String then opts is used as name

**opts.name**: `Object`, translated holiday names e.g. `{ en: 'name', es: 'nombre', ... }`

**opts.type**: `String`, holiday type `public|bank|school|observance`

**Returns**: `Boolean`, if holiday could be set returns `true`

### Holidays.getHolidays(year, language) 

get all holidays for `year` with names using prefered `language`

**Parameters**

**year**: `String | Date`, if omitted current year is choosen

**language**: `String`, ISO 639-1 code for language

**Returns**: `Array`, of found holidays in given year sorted by Date:
```
{String} date - ISO Date String of (start)-date in local format
{Date} start - start date of holiday
{Date} end - end date of holiday
{String} name - name of holiday using `language` (if available)
{String} type - type of holiday `public|bank|school|observance`
```

### Holidays.isHoliday(date) 

check whether `date` is a holiday or not

**Parameters**

**date**: `Date`, check whether `date` is a holiday or not

**Returns**: `Object`, holiday:
```
{String} date - ISO Date String of (start)-date in local format
{Date} start - start date of holiday
{Date} end - end date of holiday
{String} name - name of holiday using `language` (if available)
{String} type - type of holiday `public|bank|school|observance`
```

### Holidays.moveToTimezone(date, timezone) 

move `date` into a different `timezone`

**Parameters**

**date**: `Date`, date to move

**timezone**: `String`, timezone from `moment-timezone`, if omitted initially set timezone is used

**Returns**: `Date`, moved date

### Holidays.query(country, state) 

Query for available Countries, States, Regions

**Parameters**

**country**: `String`, Query for available Countries, States, Regions

**state**: `String`, Query for available Countries, States, Regions

**Returns**: `Object`, shortcode, name pairs of supported countries, states, regions

### Holidays.getCountries() 

get supported countries

**Returns**: `Object`, shortcode, name pairs of supported countries
```js
{ AD: 'Andorra',
  US: 'United States' }
```

### Holidays.getStates(country) 

get supported states for a given country

**Parameters**

**country**: `String`, shortcode of country

**Returns**: `Object`, shortcode, name pairs of supported states, regions
```js
{ al: 'Alabama', ...
  wy: 'Wyoming' }
```

### Holidays.getRegions(country, state) 

get supported regions for a given country, state

**Parameters**

**country**: `String`, shortcode of country

**state**: `String`, shortcode of state

**Returns**: `Object`, shortcode, name pairs of supported regions
```js
{ no: 'New Orleans' }
```

### Holidays.getTimezones() 

get timezones for country, state, region

**Returns**: `Array`, of {String}s containing the timezones

### Holidays.setTimezone(timezone) 

sets timezone

**Parameters**

**timezone**: `String`, see `moment-timezone`
if `timezone` is `undefined` then all dates are considered local dates


### Holidays.getLanguages() 

get languages for selected country, state, region

**Returns**: `Array`, containing ISO 639-1 language shortcodes

### Holidays.setLanguages(language) 

set language(s) for holiday names

**Parameters**

**language**: `Array | String`, set language(s) for holiday names

**Returns**: `Array`, set languages

### Holidays.getDayOff() 

get default day off as weekday

**Returns**: `String`, weekday of day off



* * *










