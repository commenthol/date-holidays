declare module 'date-holidays' {
  export namespace HolidaysTypes {
    export interface Country {
      /** IANA country code */
      country: string;
      /** short code of state (ISO 3166-2) */
      state?: string;
      /** short code of region */
      region?: string;
    }

    export type HolidayType = 'public' | 'bank' | 'optional' | 'school' | 'observance';

    export interface Options {
      /** languages using ISO 639-1 shortcodes */
      languages?: string | string[];
      /** timezone, e.g. America/New_York */
      timezone?: string;
      /**
       * holiday types; priority is in ascending order (low ... high)
       * default ['observance', 'optional', 'school', 'bank', 'public']
       */
      types?: HolidayType[];
    }

    export interface ActiveRange {
      /** active from date */
      from?: Date | string;
      /** active until date */
      to?: Date | string;
    }

    export interface HolidayOptions {
      /** holiday name or if object holiday names in different languages. key defines language */
      name: { [key: string]: string; } | string;
      /** holiday type */
      type?: HolidayType;
      /** disable rule in year, year+month or date */
      disabled?: string[];
      /** enable a different date; requires disabled date for given year */
      enabled?: string[];
      /** defines active ranges of rule */
      active?: ActiveRange[];
      /** substitute a holiday */
      substitute?: boolean;
      /** custom attributes */
      [key: string]: any;
    }

    export interface HolidayRule extends HolidayOptions {
      /** the holiday rule */
      rule: string;
    }

    export interface Holiday {
      /** datestring as "YYYY-MM-DD hh:mm:ss [-hh:ss]" */
      date: string;
      /** start date */
      start: Date;
      /** end date */
      end: Date;
      /** name of holiday in selected or fallback language */
      name: string;
      /** type of holiday */
      type: HolidayType;
      /** the holiday rule - use for references */
      rule: string;
      /** holiday is a substitute day */
      substitute?: boolean;
    }
  }

  export class HolidayRule {
    constructor(ruleObj: HolidaysTypes.HolidayRule);
    /**
     * disable rule in year (month)
     */
    disableIn(year: number, month?: number): void;
  }

  export default class Holidays {
    constructor(opts?: HolidaysTypes.Options);
    constructor(country: HolidaysTypes.Country | string, opts?: HolidaysTypes.Options);
    constructor(country: HolidaysTypes.Country | string, state: string, opts?: HolidaysTypes.Options);
    constructor(country: HolidaysTypes.Country | string, state: string, region: string, opts?: HolidaysTypes.Options);

    /**
     * initialize holidays for a country/state/region
     */
    init(country?: HolidaysTypes.Country | string, opts?: HolidaysTypes.Options): void;
    init(country?: string, state?: string, opts?: HolidaysTypes.Options): void;
    init(country?: string, state?: string, region?: string, opts?: HolidaysTypes.Options): void;

    /**
     * set (custom) holiday
     * @throws {TypeError}
     * @param rule - rule for holiday (check supported grammar) or date in ISO Format, e.g. 12-31 for 31th Dec
     * @param [opts] - holiday options, if String then opts is used as name
     * @param opts.name - translated holiday names e.g. `{ en: 'name', es: 'nombre', ... }`
     * @param opts.type - holiday type `public|bank|school|observance`
     * @returns `true` if holiday could be set returns `true`
     */
    setHoliday(rule: string, opts: HolidaysTypes.HolidayOptions | string): boolean;
    /**
     * get all holidays for `year` with names using preferred `language`
     * @param [year] - if omitted current year is chosen
     * @param [language] - ISO 639-1 code for language
     * @returns of found holidays in given year sorted by Date:
     */
    getHolidays(year?: string | number | Date, lang?: string): HolidaysTypes.Holiday[];
    /**
     * check whether `date` is a holiday or not
     * @returns of found holidays in given year sorted by Date:
     */
    isHoliday(date: Date|string): HolidaysTypes.Holiday[] | false;

    /**
     * set or update rule
     * @returns `true` if holiday could be set returns `true`
     */
    setRule(holidayRule: HolidayRule|object): boolean;
    /**
     * unset rule
     * @param rule - rule for holiday (check supported grammar) or date in ISO Format, e.g. 12-31 for 31th Dec
     * @returns `true` if holiday could be set returns `true`
     */
    unsetRule(rule: string): boolean;
    /**
     * get available rules for selected country, (state, region)
     */
    getRules(): HolidayRule[];
    /**
     * get rule for selected country, (state, region)
     * @param rule - rule for holiday (check supported grammar) or date in ISO Format, e.g. 12-31 for 31th Dec
     */
    getRule(rule: string): HolidayRule;

    /**
     * Query for available Countries, States, Regions
     * @param [country] - country code
     * @param [state] - state code
     * @param [lang] - ISO-639 language shortcode
     * @returns shortcode, name pairs of supported countries, states, regions
     */
    query(country?: string, state?: string, lang?: string): { [key: string]: string; };
    /**
     * get supported countries
     * @param [lang] - ISO-639 language shortcode
     * @returns shortcode, name pairs of supported countries
     * ```js
     * { AD: 'Andorra',
     *   US: 'United States' }
     * ```
     */
    getCountries(lang?: string): { [key: string]: string; };
    /**
     * get supported states for a given country
     * @param country - shortcode of country
     * @param [lang] - ISO-639 language shortcode
     * @returns shortcode, name pairs of supported states, regions
     * ```js
     * { al: 'Alabama', ...
     *   wy: 'Wyoming' }
     * ```
     */
    getStates(country: string, lang?: string): { [key: string]: string; };
    /**
     * get supported regions for a given country, state
     * @param country - shortcode of country
     * @param state - shortcode of state
     * @param [lang] - ISO-639 language shortcode
     * @returns shortcode, name pairs of supported regions
     * ```js
     * { no: 'New Orleans' }
     * ```
     */
    getRegions(country: string, state: string, lang?: string): { [key: string]: string; };

    /**
     * sets timezone
     * @param timezone - see `moment-timezone`
     * if `timezone` is `undefined` then all dates are considered local dates
     */
    setTimezone(timezone: string): void;
    /**
     * get timezones for country, state, region
     * @returns of {String}s containing the timezones
     */
    getTimezones(): string[];

    /**
     * set language(s) for holiday names
     * @returns set languages
     */
    setLanguages(language: string | string[]): string[];
    /**
     * get languages for selected country, state, region
     * @returns containing ISO 639-1 language shortcodes
     */
    getLanguages(): string[];

    /**
     * get default day off as weekday
     * @returns weekday of day off
     */
    getDayOff(): string;
  }
}
