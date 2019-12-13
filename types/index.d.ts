// TypeScript Version: 3.3

declare module 'date-holidays' {
    namespace Holidays {
        export interface Country {
            country: string;
            state?: string;
            region?: string;
        }

        export type HolidayType = 'public' | 'bank' | 'school' | 'observance';

        export interface Options {
            languages?: string | string[];
            timezone?: string;
            types?: HolidayType[];
        }

        export interface HolidayOptions {
            name: { [key: string]: string; };
            type: HolidayType;
        }

        export interface Holiday {
            date: string;
            start: Date;
            end: Date;
            name: string;
            type: HolidayType;
            substitute?: boolean;
        }

        export interface HolidaysInterface {
            init(country?: Country | string, opts?: Options): void;

            init(country?: string, state?: string, opts?: Options): void;

            init(country?: string, state?: string, region?: string, opts?: Options): void;

            setHoliday(rule: string, opts: HolidayOptions | string): boolean;

            getHolidays(year?: string | number | Date, lang?: string): Holiday[];

            isHoliday(date: Date): Holiday | false;

            query(country?: string, state?: string, lang?: string): { [key: string]: string; };

            getCountries(lang?: string): { [key: string]: string; };

            getStates(country: string, lang?: string): { [key: string]: string; };

            getRegions(country: string, state: string, lang?: string): { [key: string]: string; };

            getTimezones(): string[];

            setTimezone(timezone: string): void;

            getLanguages(): string[];

            setLanguages(language: string | string[]): string[];

            getDayOff(): string;
        }
    }

    class Holidays implements Holidays.HolidaysInterface {
        constructor(opts?: Holidays.Options);
        constructor(country: Holidays.Country | string, opts?: Holidays.Options);
        constructor(country: Holidays.Country | string, state: string, opts?: Holidays.Options);
        constructor(country: Holidays.Country | string, state: string, region: string, opts?: Holidays.Options);

        // HolidaysInterface:
        init(country?: Holidays.Country | string, opts?: Holidays.Options): void;
        init(country?: string, state?: string, opts?: Holidays.Options): void;
        init(country?: string, state?: string, region?: string, opts?: Holidays.Options): void;
        setHoliday(rule: string, opts: Holidays.HolidayOptions | string): boolean;
        getHolidays(year?: string | number | Date, lang?: string): Holidays.Holiday[];
        isHoliday(date: Date): Holidays.Holiday | false;
        query(country?: string, state?: string, lang?: string): { [key: string]: string; };
        getCountries(lang?: string): { [key: string]: string; };
        getStates(country: string, lang?: string): { [key: string]: string; };
        getRegions(country: string, state: string, lang?: string): { [key: string]: string; };
        getTimezones(): string[];
        setTimezone(timezone: string): void;
        getLanguages(): string[];
        setLanguages(language: string | string[]): string[];
        getDayOff(): string;
    }

    export = Holidays;
}
