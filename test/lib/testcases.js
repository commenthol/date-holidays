'use strict'

/**
 * shared testcases between parser and dateFn
 */

var testcases = {
  '03-12': {
    year: undefined,
    month: 3,
    day: 12,
    hour: undefined
  },
  '03-12T16': {
    year: undefined,
    month: 3,
    day: 12,
    hour: 16
  },
  '2015-10-09': {
    year: 2015,
    month: 10,
    day: 9,
    hour: undefined
  },
  'easter -3': {
    fn: 'easter',
    easter: 'easter',
    days: -3
  },
  'orthodox 50': {
    fn: 'easter',
    easter: 'orthodox',
    days: 50
  },
  '10 Muharram': {
    fn: 'islamic',
    day: 10,
    month: 0
  },
  '1 Safar': {
    fn: 'islamic',
    day: 1,
    month: 1
  },
  '12 Rabi al-awwal': {
    fn: 'islamic',
    day: 12,
    month: 2
  },
  '13 Rabi al-thani': {
    fn: 'islamic',
    day: 13,
    month: 3
  },
  '14 Jumada al-awwal': {
    fn: 'islamic',
    day: 14,
    month: 4
  },
  '25 Jumada al-thani': {
    fn: 'islamic',
    day: 25,
    month: 5
  },
  '15 Rajab': {
    fn: 'islamic',
    day: 15,
    month: 6
  },
  '1 Shaban': {
    fn: 'islamic',
    day: 1,
    month: 7
  },
  '2 Ramadan': {
    fn: 'islamic',
    day: 2,
    month: 8
  },
  '1 Shawwal +3d': {
    fn: 'islamic',
    day: 1,
    month: 9,
    duration: '3d'
  },
  '3 Shawwal': {
    fn: 'islamic',
    day: 3,
    month: 9
  },
  '4 Dhu al-Qidah': {
    fn: 'islamic',
    day: 4,
    month: 10
  },
  '5 Dhu al-Hijjah': {
    fn: 'islamic',
    day: 5,
    month: 11
  },
  '15 Nisan': {
    fn: 'jewish',
    day: 15,
    month: 0
  },
  '2 Iyyar': {
    fn: 'jewish',
    day: 2,
    month: 1
  },
  '3 Sivan': {
    fn: 'jewish',
    day: 3,
    month: 2
  },
  '4 Tamuz': {
    fn: 'jewish',
    day: 4,
    month: 3
  },
  '5 Av': {
    fn: 'jewish',
    day: 5,
    month: 4
  },
  '6 Elul': {
    fn: 'jewish',
    day: 6,
    month: 5
  },
  '1 Tishrei': {
    fn: 'jewish',
    day: 1,
    month: 6
  },
  '10 Tishrei': {
    fn: 'jewish',
    day: 10,
    month: 6
  },
  '7 Cheshvan': {
    fn: 'jewish',
    day: 7,
    month: 7
  },
  '18 Kislev': {
    fn: 'jewish',
    day: 18,
    month: 8
  },
  '18 Tevet': {
    fn: 'jewish',
    day: 18,
    month: 9
  },
  '22 Shvat': {
    fn: 'jewish',
    day: 22,
    month: 10
  },
  '25 Adar': {
    fn: 'jewish',
    day: 25,
    month: 11
  },
  'spring equinox': {
    fn: 'equinox',
    count: undefined,
    weekday: undefined,
    days: undefined,
    direction: undefined,
    season: 'spring',
    timezone: 'GMT'
  },
  'spring equinox in Asia/Tokyo': {
    fn: 'equinox',
    count: undefined,
    weekday: undefined,
    days: undefined,
    direction: undefined,
    season: 'spring',
    timezone: 'Asia/Tokyo'
  },
  '3 days after autumn equinox': {
    fn: 'equinox',
    count: undefined,
    weekday: undefined,
    days: 3,
    direction: 'after',
    season: 'autumn',
    timezone: 'GMT'
  },
  '1 day before summer solstice': {
    fn: 'equinox',
    count: undefined,
    weekday: undefined,
    days: 1,
    direction: 'before',
    season: 'summer',
    timezone: 'GMT'
  },
  '1 day after winter solstice': {
    fn: 'equinox',
    count: undefined,
    weekday: undefined,
    days: 1,
    direction: 'after',
    season: 'winter',
    timezone: 'GMT'
  },
  '3rd monday before winter solstice': {
    fn: 'equinox',
    count: 3,
    weekday: 'monday',
    days: undefined,
    direction: 'before',
    season: 'winter',
    timezone: 'GMT'
  },
  '01-01 14:00': {
    year: undefined,
    month: 1,
    day: 1,
    hour: 14,
    minute: 0,
    ifTime: undefined,
    thenHour: 0,
    thenMinute: 0
  },
  'easter -3 14:00': {
    fn: 'easter',
    easter: 'easter',
    days: -3,
    hour: 14,
    minute: 0,
    ifTime: undefined,
    thenHour: 0,
    thenMinute: 0
  },
  '09-04 08:00 +14h': {
    year: undefined,
    month: 9,
    day: 4,
    hour: 8,
    minute: 0,
    ifTime: undefined,
    thenHour: 0,
    thenMinute: 0,
    duration: '14h'
  },
  '09-04 08:00 +321h': {
    year: undefined,
    month: 9,
    day: 4,
    hour: 8,
    minute: 0,
    ifTime: undefined,
    thenHour: 0,
    thenMinute: 0,
    duration: '321h'
  },
  'easter -3 14:00 +4hours': {
    fn: 'easter',
    easter: 'easter',
    days: -3,
    hour: 14,
    minute: 0,
    ifTime: undefined,
    thenHour: 0,
    thenMinute: 0,
    duration: '4h'
  },
  'easter -3 14:00 +3days': {
    fn: 'easter',
    easter: 'easter',
    days: -3,
    hour: 14,
    minute: 0,
    ifTime: undefined,
    thenHour: 0,
    thenMinute: 0,
    duration: '3d'
  },
  '05-01 14:00 if sunday then 00:00': {
    year: undefined,
    month: 5,
    day: 1,
    hour: 14,
    minute: 0,
    ifTime: 'sunday',
    thenHour: 0,
    thenMinute: 0
  },
  '01-01 if sunday then next monday 14:10 if sunday then 01:59': {
    fn: 'dateIfThen',
    substitute: false,
    month: 1,
    day: 1,
    hour: 14,
    other: undefined,
    observeBoth: false,
    rules: [{
      if: [
        'sunday'
      ],
      direction: 'next',
      then: 'monday'
    }],
    minute: 10,
    ifTime: 'sunday',
    thenHour: 1,
    thenMinute: 59
  },
  '12-31 14:00 if sunday then 00:00': {
    year: undefined,
    month: 12,
    day: 31,
    hour: 14,
    minute: 0,
    ifTime: 'sunday',
    thenHour: 0,
    thenMinute: 0
  },
  'wednesday before 11-23': {
    fn: 'dateDir',
    weekday2: undefined,
    direction2: undefined,
    count: 1,
    weekday: 'wednesday',
    direction: 'before',
    month: 11,
    day: 23,
    hour: undefined
  },
  '2nd sunday after 11-01': {
    fn: 'dateDir',
    weekday2: undefined,
    direction2: undefined,
    count: 2,
    weekday: 'sunday',
    direction: 'after',
    month: 11,
    day: 1,
    hour: undefined
  },
  '2nd sunday before 11-01': {
    fn: 'dateDir',
    weekday2: undefined,
    direction2: undefined,
    count: 2,
    weekday: 'sunday',
    direction: 'before',
    month: 11,
    day: 1,
    hour: undefined
  },
  'tuesday before 4th thursday after 11-01': {
    fn: 'dateDir',
    weekday2: 'tuesday',
    direction2: 'before',
    count: 4,
    weekday: 'thursday',
    direction: 'after',
    month: 11,
    day: 1,
    hour: undefined
  },
  'tuesday before 2nd tuesday after 11-01': {
    fn: 'dateDir',
    weekday2: 'tuesday',
    direction2: 'before',
    count: 2,
    weekday: 'tuesday',
    direction: 'after',
    month: 11,
    day: 1,
    hour: undefined
  },
  'sunday after 4th thursday after 11-01': {
    fn: 'dateDir',
    weekday2: 'sunday',
    direction2: 'after',
    count: 4,
    weekday: 'thursday',
    direction: 'after',
    month: 11,
    day: 1,
    hour: undefined
  },
  '2nd sunday after 05-01 if equal easter 49 then 3rd sunday after 05-01': {
    fn: 'dateDir',
    weekday2: undefined,
    direction2: undefined,
    count: 2,
    weekday: 'sunday',
    direction: 'after',
    month: 5,
    day: 1,
    hour: undefined,
    ifDate: {
      fn: 'easter',
      easter: 'easter',
      days: 49
    },
    thenDate: {
      fn: 'dateDir',
      weekday2: undefined,
      direction2: undefined,
      count: 3,
      weekday: 'sunday',
      direction: 'after',
      month: 5,
      day: 1,
      hour: undefined
    }
  },
  '01-01 if monday then next monday': {
    fn: 'dateIfThen',
    substitute: false,
    month: 1,
    day: 1,
    hour: undefined,
    other: undefined,
    observeBoth: false,
    rules: [{
      if: [
        'monday'
      ],
      direction: 'next',
      then: 'monday'
    }]
  },
  '01-01 if sunday then previous monday': {
    fn: 'dateIfThen',
    substitute: false,
    month: 1,
    day: 1,
    hour: undefined,
    other: undefined,
    observeBoth: false,
    rules: [{
      if: [
        'sunday'
      ],
      direction: 'previous',
      then: 'monday'
    }]
  },
  '01-01 if sunday then next sunday': {
    fn: 'dateIfThen',
    substitute: false,
    month: 1,
    day: 1,
    hour: undefined,
    other: undefined,
    observeBoth: false,
    rules: [{
      if: [
        'sunday'
      ],
      direction: 'next',
      then: 'sunday'
    }]
  },
  '01-01 if sunday then previous sunday': {
    fn: 'dateIfThen',
    substitute: false,
    month: 1,
    day: 1,
    hour: undefined,
    other: undefined,
    observeBoth: false,
    rules: [{
      if: [
        'sunday'
      ],
      direction: 'previous',
      then: 'sunday'
    }]
  },
  '01-01 and if monday then next monday': {
    fn: 'dateIfThen',
    substitute: false,
    month: 1,
    day: 1,
    hour: undefined,
    other: undefined,
    observeBoth: true,
    rules: [{
      if: [
        'monday'
      ],
      direction: 'next',
      then: 'monday'
    }]
  },
  'substitutes 01-01 if sunday then next tuesday': {
    fn: 'dateIfThen',
    substitute: true,
    month: 1,
    day: 1,
    hour: undefined,
    other: undefined,
    observeBoth: false,
    rules: [{
      if: [
        'sunday'
      ],
      direction: 'next',
      then: 'tuesday'
    }]
  },
  'substitutes 1 Shawwal if wednesday,saturday,sunday then next monday': {
    fn: 'dateIfThen',
    substitute: true,
    month: undefined,
    day: undefined,
    hour: undefined,
    other: { fn: 'islamic', day: 1, month: 9 },
    observeBoth: false,
    rules: [{
      if: [
        'wednesday',
        'saturday',
        'sunday'
      ],
      direction: 'next',
      then: 'monday'
    }]
  },
  '4 Shawwal and if saturday then next monday': {
    fn: 'dateIfThen',
    substitute: false,
    month: undefined,
    day: undefined,
    hour: undefined,
    other: { fn: 'islamic', day: 4, month: 9 },
    observeBoth: true,
    rules: [{
      if: [
        'saturday'
      ],
      direction: 'next',
      then: 'monday'
    }]
  },
  '10-12 if tuesday,wednesday then previous monday if thursday,friday,saturday,sunday then next monday': {
    fn: 'dateIfThen',
    substitute: false,
    month: 10,
    day: 12,
    hour: undefined,
    other: undefined,
    observeBoth: false,
    rules: [
      {
        if: [
          'tuesday',
          'wednesday'
        ],
        direction: 'previous',
        then: 'monday'
      }, {
        if: [
          'thursday',
          'friday',
          'saturday',
          'sunday'
        ],
        direction: 'next',
        then: 'monday'
      }
    ]
  },
  '01-10 if saturday,sunday then next monday if tuesday then previous monday if wednesday,thursday then next friday': {
    fn: 'dateIfThen',
    substitute: false,
    day: 10,
    month: 1,
    hour: undefined,
    other: undefined,
    observeBoth: false,
    rules: [
      {
        if: [
          'saturday',
          'sunday'
        ],
        direction: 'next',
        then: 'monday'
      }, {
        if: [
          'tuesday'
        ],
        direction: 'previous',
        then: 'monday'
      }, {
        if: [
          'wednesday',
          'thursday'
        ],
        direction: 'next',
        then: 'friday'
      }
    ]
  },
  '11-01 in even years': {
    year: undefined,
    month: 11,
    day: 1,
    hour: undefined,
    yearRule: {
      cardinality: 'even',
      every: undefined,
      since: undefined
    }
  },
  '11-01 in odd years': {
    year: undefined,
    month: 11,
    day: 1,
    hour: undefined,
    yearRule: {
      cardinality: 'odd',
      every: undefined,
      since: undefined
    }
  },
  '11-01 in leap years': {
    year: undefined,
    month: 11,
    day: 1,
    hour: undefined,
    yearRule: {
      cardinality: 'leap',
      every: undefined,
      since: undefined
    }
  },
  '11-01 in non-leap years': {
    year: undefined,
    month: 11,
    day: 1,
    hour: undefined,
    yearRule: {
      cardinality: 'non-leap',
      every: undefined,
      since: undefined
    }
  },
  'tuesday after 1st monday after 11-01 in even years': {
    fn: 'dateDir',
    weekday2: 'tuesday',
    direction2: 'after',
    count: 1,
    weekday: 'monday',
    direction: 'after',
    month: 11,
    day: 1,
    hour: undefined,
    yearRule: {
      cardinality: 'even',
      every: undefined,
      since: undefined
    }
  },
  'tuesday after 1st monday after 11-01 in odd years': {
    fn: 'dateDir',
    weekday2: 'tuesday',
    direction2: 'after',
    count: 1,
    weekday: 'monday',
    direction: 'after',
    month: 11,
    day: 1,
    hour: undefined,
    yearRule: {
      cardinality: 'odd',
      every: undefined,
      since: undefined
    }
  },
  '12-01 every 6 years since 1934': {
    year: undefined,
    month: 12,
    day: 1,
    hour: undefined,
    yearRule: {
      cardinality: undefined,
      every: '6',
      since: '1934'
    }
  },
  '09-21': {
    year: undefined,
    month: 9,
    day: 21,
    hour: undefined
  },
  '09-23': {
    year: undefined,
    month: 9,
    day: 23,
    hour: undefined
  },
  '09-22 if 09-21 and 09-23 is public holiday': {
    fn: 'dateBridge',
    month: 9,
    day: 22,
    hour: undefined,
    isDates: [
      {
        month: 9,
        day: 21
      },
      {
        month: 9,
        day: 23
      }
    ],
    type: 'public'
  },
  '09-22 if 09-21 is holiday': {
    fn: 'dateBridge',
    month: 9,
    day: 22,
    hour: undefined,
    isDates: [
      {
        month: 9,
        day: 21
      }
    ],
    type: undefined
  }
}
module.exports = testcases

// tests only
// var tc = 'substitutes 1 Shawwal if tuesday,saturday,sunday then next monday'
// module.exports[tc] = testcases[tc]
