/* eslint-disable */
module.exports = {
	"03-12": [{
		fn: "gregorian",
		year: undefined,
		month: 3,
		day: 12
	}],
	"03-12T16": [{
		fn: "gregorian",
		year: undefined,
		month: 3,
		day: 12
	}, {
		rule: "time",
		hour: 16,
		minute: 0
	}],
	"2015-10-09": [{
		fn: "gregorian",
		year: 2015,
		month: 10,
		day: 9
	}],
	"#1111": [],
	"03-12 #22": [{
		fn: "gregorian",
		year: undefined,
		month: 3,
		day: 12
	}],
	August: [{
		fn: "gregorian",
		day: 1,
		month: 8,
		year: undefined
	}],
	November: [{
		fn: "gregorian",
		day: 1,
		month: 11,
		year: undefined
	}],
	"julian 2015-01-09": [{
		fn: "julian",
		year: 2015,
		month: 1,
		day: 9
	}],
	"easter -3": [{
		fn: "easter",
		type: "easter",
		offset: -3
	}],
	"orthodox 50": [{
		fn: "easter",
		type: "orthodox",
		offset: 50
	}],
	"10 Muharram": [{
		fn: "islamic",
		day: 10,
		month: 1,
		year: undefined
	}],
	"1 Safar": [{
		fn: "islamic",
		day: 1,
		month: 2,
		year: undefined
	}],
	"12 Rabi al-awwal": [{
		fn: "islamic",
		day: 12,
		month: 3,
		year: undefined
	}],
	"13 Rabi al-thani": [{
		fn: "islamic",
		day: 13,
		month: 4,
		year: undefined
	}],
	"14 Jumada al-awwal": [{
		fn: "islamic",
		day: 14,
		month: 5,
		year: undefined
	}],
	"25 Jumada al-thani": [{
		fn: "islamic",
		day: 25,
		month: 6,
		year: undefined
	}],
	"15 Rajab": [{
		fn: "islamic",
		day: 15,
		month: 7,
		year: undefined
	}],
	"1 Shaban": [{
		fn: "islamic",
		day: 1,
		month: 8,
		year: undefined
	}],
	"2 Ramadan": [{
		fn: "islamic",
		day: 2,
		month: 9,
		year: undefined
	}],
	"1 Shawwal P3D": [{
		fn: "islamic",
		day: 1,
		month: 10,
		year: undefined
	}, {
		rule: "duration",
		duration: 72
	}],
	"3 Shawwal": [{
		fn: "islamic",
		day: 3,
		month: 10,
		year: undefined
	}],
	"4 Dhu al-Qidah": [{
		fn: "islamic",
		day: 4,
		month: 11,
		year: undefined
	}],
	"5 Dhu al-Hijjah": [{
		fn: "islamic",
		day: 5,
		month: 12,
		year: undefined
	}],
	"15 Nisan": [{
		fn: "hebrew",
		day: 15,
		month: 1,
		year: undefined
	}],
	"2 Iyyar": [{
		fn: "hebrew",
		day: 2,
		month: 2,
		year: undefined
	}],
	"3 Sivan": [{
		fn: "hebrew",
		day: 3,
		month: 3,
		year: undefined
	}],
	"4 Tamuz": [{
		fn: "hebrew",
		day: 4,
		month: 4,
		year: undefined
	}],
	"5 Av": [{
		fn: "hebrew",
		day: 5,
		month: 5,
		year: undefined
	}],
	"6 Elul": [{
		fn: "hebrew",
		day: 6,
		month: 6,
		year: undefined
	}],
	"1 Tishrei": [{
		fn: "hebrew",
		day: 1,
		month: 7,
		year: undefined
	}],
	"10 Tishrei": [{
		fn: "hebrew",
		day: 10,
		month: 7,
		year: undefined
	}],
	"7 Cheshvan": [{
		fn: "hebrew",
		day: 7,
		month: 8,
		year: undefined
	}],
	"18 Kislev": [{
		fn: "hebrew",
		day: 18,
		month: 9,
		year: undefined
	}],
	"18 Tevet": [{
		fn: "hebrew",
		day: 18,
		month: 10,
		year: undefined
	}],
	"22 Shvat": [{
		fn: "hebrew",
		day: 22,
		month: 11,
		year: undefined
	}],
	"25 Adar": [{
		fn: "hebrew",
		day: 25,
		month: 12,
		year: undefined
	}],
	"chinese 01-0-01": [{
		fn: "chinese",
		day: 1,
		month: 1,
		leapMonth: false,
		year: undefined,
		cycle: undefined,
		timezone: undefined
	}],
	"chinese 8-1-15": [{
		fn: "chinese",
		day: 15,
		month: 8,
		leapMonth: true,
		year: undefined,
		cycle: undefined,
		timezone: undefined
	}],
	"chinese 8-1-15": [{
		fn: "chinese",
		day: 15,
		month: 8,
		leapMonth: true,
		year: undefined,
		cycle: undefined,
		timezone: undefined
	}],
	"chinese 8-15 solarterm": [{
		fn: "chinese",
		day: 15,
		solarterm: 8,
		year: undefined,
		cycle: undefined,
		timezone: undefined
	}],
	"chinese 78-32-8-15 solarterm": [{
		fn: "chinese",
		day: 15,
		solarterm: 8,
		year: 32,
		cycle: 78,
		timezone: undefined
	}],
	"korean 01-0-01": [{
		fn: "korean",
		day: 1,
		month: 1,
		leapMonth: false,
		year: undefined,
		cycle: undefined,
		timezone: undefined
	}],
	"1 day before vietnamese 01-0-01": [{
		fn: "vietnamese",
		day: 1,
		month: 1,
		leapMonth: false,
		year: undefined,
		cycle: undefined,
		timezone: undefined,
	}, {
    count: 1,
    direction: "before",
    rule: "dateDir",
    weekday: "day"
  }],
	"friday before chinese 78-32-8-15 solarterm": [{
		fn: "chinese",
		day: 15,
		solarterm: 8,
		year: 32,
		cycle: 78,
		timezone: undefined
	}, {
		rule: 'dateDir',
    count: 1,
    weekday: 'friday',
		direction: 'before'
	}],
	"march equinox": [{
		fn: "equinox",
		season: "march",
		timezone: "GMT"
	}],
	"4 days before march equinox in Europe/Vienna": [{
		fn: "equinox",
		season: "march",
		timezone: "Europe\u002FVienna"
	}, {
    count: 4,
    direction: "before",
    rule: "dateDir",
    weekday: "day"
  }],
	"march equinox in Asia/Tokyo": [{
		fn: "equinox",
		season: "march",
		timezone: "Asia\u002FTokyo"
	}],
	"march equinox in +09:00": [{
		fn: "equinox",
		season: "march",
		timezone: "+09:00"
	}],
	"march equinox in Asia/Tokyo if sunday then next monday": [{
		fn: "equinox",
		season: "march",
		timezone: "Asia\u002FTokyo"
	}, {
		rule: "dateIfThen",
		if: ["sunday"],
		direction: "next",
		then: "monday"
	}],
	"3 days after september equinox": [{
		fn: "equinox",
		season: "september",
		timezone: "GMT"
	}, {
    count: 3,
    direction: "after",
    rule: "dateDir",
    weekday: "day"
  }],
	"1 day before june solstice": [{
		fn: "equinox",
		season: "june",
		timezone: "GMT"
	}, {
    count: 1,
    direction: "before",
    rule: "dateDir",
    weekday: "day"
  }],
	"1 day after december solstice": [{
		fn: "equinox",
		season: "december",
		timezone: "GMT"
	}, {
    count: 1,
    direction: "after",
    rule: "dateDir",
    weekday: "day"
  }],
	"3rd monday before december solstice": [{
		fn: "equinox",
		season: "december",
		timezone: "GMT"
	}, {
		rule: "dateDir",
		count: 3,
		weekday: "monday",
		direction: "before"
	}],
	"01-01 14:00": [{
		fn: "gregorian",
		year: undefined,
		month: 1,
		day: 1
	}, {
		rule: "time",
		hour: 14,
		minute: 0
	}],
	"easter -3 14:00": [{
		fn: "easter",
		type: "easter",
		offset: -3
	}, {
		rule: "time",
		hour: 14,
		minute: 0
	}],
	"easter -6 P5D": [{
		fn: "easter",
		type: "easter",
		offset: -6
	}, {
		rule: "duration",
		duration: 120
	}],
	"09-04 08:00 PT14H": [{
		fn: "gregorian",
		year: undefined,
		month: 9,
		day: 4
	}, {
		rule: "time",
		hour: 8,
		minute: 0
	}, {
		rule: "duration",
		duration: 14
	}],
	"09-04 08:00 PT321H30M": [{
		fn: "gregorian",
		year: undefined,
		month: 9,
		day: 4
	}, {
		rule: "time",
		hour: 8,
		minute: 0
	}, {
		rule: "duration",
		duration: 321.5
	}],
	"easter -3 14:00 PT4H": [{
		fn: "easter",
		type: "easter",
		offset: -3
	}, {
		rule: "time",
		hour: 14,
		minute: 0
	}, {
		rule: "duration",
		duration: 4
	}],
	"easter -3 14:00 P3D": [{
		fn: "easter",
		type: "easter",
		offset: -3
	}, {
		rule: "time",
		hour: 14,
		minute: 0
	}, {
		rule: "duration",
		duration: 72
	}],
	"05-01 14:00 if sunday then 00:00": [{
		fn: "gregorian",
		year: undefined,
		month: 5,
		day: 1
	}, {
		rule: "time",
		hour: 14,
		minute: 0
	}, {
		rule: "dateIfThen",
		if: ["sunday"],
		direction: undefined,
		then: undefined,
		rules: [{
			rule: "time",
			hour: 0,
			minute: 0
		}]
	}],
	"05-01 14:00 if sunday then next sunday 00:00": [{
		fn: "gregorian",
		year: undefined,
		month: 5,
		day: 1
	}, {
		rule: "time",
		hour: 14,
		minute: 0
	}, {
		rule: "dateIfThen",
		if: ["sunday"],
		direction: "next",
		then: "sunday",
		rules: [{
			rule: "time",
			hour: 0,
			minute: 0
		}]
	}],
	"01-01 if sunday then next monday 14:10 if sunday then 01:59": [{
		fn: "gregorian",
		year: undefined,
		month: 1,
		day: 1
	}, {
		rule: "dateIfThen",
		if: ["sunday"],
		direction: "next",
		then: "monday",
		rules: [{
			rule: "time",
			hour: 14,
			minute: 10
		}]
	}, {
		rule: "dateIfThen",
		if: ["sunday"],
		direction: undefined,
		then: undefined,
		rules: [{
			rule: "time",
			hour: 1,
			minute: 59
		}]
	}],
	"12-31 14:00 if sunday then 00:00": [{
		fn: "gregorian",
		year: undefined,
		month: 12,
		day: 31
	}, {
		rule: "time",
		hour: 14,
		minute: 0
	}, {
		rule: "dateIfThen",
		if: ["sunday"],
		direction: undefined,
		then: undefined,
		rules: [{
			rule: "time",
			hour: 0,
			minute: 0
		}]
	}],
	"wednesday before 11-23": [{
		fn: "gregorian",
		year: undefined,
		month: 11,
		day: 23
	}, {
		rule: "dateDir",
		count: 1,
		weekday: "wednesday",
		direction: "before"
	}],
	"4 days before 11-23": [{
		fn: "gregorian",
		year: undefined,
		month: 11,
		day: 23
	}, {
		rule: "dateDir",
		count: 4,
		weekday: "day",
		direction: "before"
	}],
	"4 days after 11-27": [{
		fn: "gregorian",
		year: undefined,
		month: 11,
		day: 27
	}, {
		rule: "dateDir",
		count: 4,
		weekday: "day",
		direction: "after"
	}],
	"1st wednesday in October": [{
		fn: "gregorian",
		day: 1,
		month: 10,
		year: undefined
	}, {
		rule: "dateDir",
		count: 1,
		weekday: "wednesday",
		direction: "after"
	}],
	"2nd sunday after 11-01": [{
		fn: "gregorian",
		year: undefined,
		month: 11,
		day: 1
	}, {
		rule: "dateDir",
		count: 2,
		weekday: "sunday",
		direction: "after"
	}],
	"2nd sunday before 11-01": [{
		fn: "gregorian",
		year: undefined,
		month: 11,
		day: 1
	}, {
		rule: "dateDir",
		count: 2,
		weekday: "sunday",
		direction: "before"
	}],
	"tuesday before 4th thursday after 11-01": [{
		fn: "gregorian",
		year: undefined,
		month: 11,
		day: 1
	}, {
		rule: "dateDir",
		count: 4,
		weekday: "thursday",
		direction: "after"
	}, {
		rule: "dateDir",
		count: 1,
		weekday: "tuesday",
		direction: "before"
	}],
	"tuesday before 2nd tuesday after 11-01": [{
		fn: "gregorian",
		year: undefined,
		month: 11,
		day: 1
	}, {
		rule: "dateDir",
		count: 2,
		weekday: "tuesday",
		direction: "after"
	}, {
		rule: "dateDir",
		count: 1,
		weekday: "tuesday",
		direction: "before"
	}],
	"sunday after 4th thursday after 11-01": [{
		fn: "gregorian",
		year: undefined,
		month: 11,
		day: 1
	}, {
		rule: "dateDir",
		count: 4,
		weekday: "thursday",
		direction: "after"
	}, {
		rule: "dateDir",
		count: 1,
		weekday: "sunday",
		direction: "after"
	}],
	"2nd sunday after 05-01 if equal easter 49 then 3rd sunday after 05-01": [{
		fn: "gregorian",
		year: undefined,
		month: 5,
		day: 1
	}, {
		rule: "dateDir",
		count: 2,
		weekday: "sunday",
		direction: "after"
	}, {
		modifier: "if equal"
	}, {
		fn: "easter",
		type: "easter",
		offset: 49
	}, {
		modifier: "then"
	}, {
		fn: "gregorian",
		year: undefined,
		month: 5,
		day: 1
	}, {
		rule: "dateDir",
		count: 3,
		weekday: "sunday",
		direction: "after"
	}],
	"01-01 if monday then next monday": [{
		fn: "gregorian",
		year: undefined,
		month: 1,
		day: 1
	}, {
		rule: "dateIfThen",
		if: ["monday"],
		direction: "next",
		then: "monday"
	}],
	"01-01 if sunday then previous monday": [{
		fn: "gregorian",
		year: undefined,
		month: 1,
		day: 1
	}, {
		rule: "dateIfThen",
		if: ["sunday"],
		direction: "previous",
		then: "monday"
	}],
	"01-01 if sunday then next sunday": [{
		fn: "gregorian",
		year: undefined,
		month: 1,
		day: 1
	}, {
		rule: "dateIfThen",
		if: ["sunday"],
		direction: "next",
		then: "sunday"
	}],
	"01-01 if sunday then previous sunday": [{
		fn: "gregorian",
		year: undefined,
		month: 1,
		day: 1
	}, {
		rule: "dateIfThen",
		if: ["sunday"],
		direction: "previous",
		then: "sunday"
	}],
	"01-01 and if monday then next monday": [{
		fn: "gregorian",
		year: undefined,
		month: 1,
		day: 1
	}, {
		modifier: "and"
	}, {
		rule: "dateIfThen",
		if: ["monday"],
		direction: "next",
		then: "monday"
	}],
	"substitutes 01-01 if sunday then next tuesday": [{
		fn: "gregorian",
		year: undefined,
		month: 1,
		day: 1
	}, {
		modifier: "substitutes"
	}, {
		rule: "dateIfThen",
		if: ["sunday"],
		direction: "next",
		then: "tuesday"
	}],
	"substitutes 1 Shawwal if wednesday,saturday,sunday then next monday": [{
		fn: "islamic",
		day: 1,
		month: 10,
		year: undefined
	}, {
		modifier: "substitutes"
	}, {
		rule: "dateIfThen",
		if: ["wednesday", "saturday", "sunday"],
		direction: "next",
		then: "monday"
	}],
	"4 Shawwal and if saturday then next monday": [{
		fn: "islamic",
		day: 4,
		month: 10,
		year: undefined
	}, {
		modifier: "and"
	}, {
		rule: "dateIfThen",
		if: ["saturday"],
		direction: "next",
		then: "monday"
	}],
	"10-12 if tuesday,wednesday then previous monday if thursday,friday,saturday,sunday then next monday": [{
		fn: "gregorian",
		year: undefined,
		month: 10,
		day: 12
	}, {
		rule: "dateIfThen",
		if: ["tuesday", "wednesday"],
		direction: "previous",
		then: "monday"
	}, {
		rule: "dateIfThen",
		if: ["thursday", "friday", "saturday", "sunday"],
		direction: "next",
		then: "monday"
	}],
	"01-10 if saturday,sunday then next monday if tuesday then previous monday if wednesday,thursday then next friday": [{
		fn: "gregorian",
		year: undefined,
		month: 1,
		day: 10
	}, {
		rule: "dateIfThen",
		if: ["saturday", "sunday"],
		direction: "next",
		then: "monday"
	}, {
		rule: "dateIfThen",
		if: ["tuesday"],
		direction: "previous",
		then: "monday"
	}, {
		rule: "dateIfThen",
		if: ["wednesday", "thursday"],
		direction: "next",
		then: "friday"
	}],
	"11-01 in even years": [{
		fn: "gregorian",
		year: undefined,
		month: 11,
		day: 1
	}, {
		rule: "year",
		cardinality: "even",
		every: undefined,
		since: undefined
	}],
	"11-01 in odd years": [{
		fn: "gregorian",
		year: undefined,
		month: 11,
		day: 1
	}, {
		rule: "year",
		cardinality: "odd",
		every: undefined,
		since: undefined
	}],
	"11-01 in leap years": [{
		fn: "gregorian",
		year: undefined,
		month: 11,
		day: 1
	}, {
		rule: "year",
		cardinality: "leap",
		every: undefined,
		since: undefined
	}],
	"11-01 in non-leap years": [{
		fn: "gregorian",
		year: undefined,
		month: 11,
		day: 1
	}, {
		rule: "year",
		cardinality: "non-leap",
		every: undefined,
		since: undefined
	}],
	"tuesday after 1st monday after 11-01 in even years": [{
		fn: "gregorian",
		year: undefined,
		month: 11,
		day: 1
	}, {
		rule: "dateDir",
		count: 1,
		weekday: "monday",
		direction: "after"
	}, {
		rule: "dateDir",
		count: 1,
		weekday: "tuesday",
		direction: "after"
	}, {
		rule: "year",
		cardinality: "even",
		every: undefined,
		since: undefined
	}],
	"tuesday after 1st monday after 11-01 in odd years": [{
		fn: "gregorian",
		year: undefined,
		month: 11,
		day: 1
	}, {
		rule: "dateDir",
		count: 1,
		weekday: "monday",
		direction: "after"
	}, {
		rule: "dateDir",
		count: 1,
		weekday: "tuesday",
		direction: "after"
	}, {
		rule: "year",
		cardinality: "odd",
		every: undefined,
		since: undefined
	}],
	"12-01 every 6 years since 1934": [{
		fn: "gregorian",
		year: undefined,
		month: 12,
		day: 1
	}, {
		rule: "year",
		cardinality: undefined,
		every: 6,
		since: 1934
	}],
	"09-21": [{
		fn: "gregorian",
		year: undefined,
		month: 9,
		day: 21
	}],
	"09-23": [{
		fn: "gregorian",
		year: undefined,
		month: 9,
		day: 23
	}],
	"09-22 if 09-21 and 09-23 is public holiday": [{
		fn: "gregorian",
		year: undefined,
		month: 9,
		day: 22
	}, {
		modifier: "if"
	}, {
		fn: "gregorian",
		year: undefined,
		month: 9,
		day: 21
	}, {
		modifier: "and"
	}, {
		fn: "gregorian",
		year: undefined,
		month: 9,
		day: 23
	}, {
		rule: "bridge",
		type: "public"
	}],
	"09-22 if 09-21 is holiday": [{
		fn: "gregorian",
		year: undefined,
		month: 9,
		day: 22
	}, {
		modifier: "if"
	}, {
		fn: "gregorian",
		year: undefined,
		month: 9,
		day: 21
	}, {
		rule: "bridge",
		type: undefined
	}]
};
