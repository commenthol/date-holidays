#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { load } from "js-yaml";
import lodash from "lodash";

const { pick: _pick, omit: _omit } = lodash;
const scriptFile = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(scriptFile);
const resolve = path.resolve;

const REGEX = /^([A-Z]+)\.yaml$/;

const CALENDAR_PLUGINS = {
  EasterCalendarPlugin: /\b(easter|orthodox)\b/,
  EquinoxCalendarPlugin: /\b(equinox|solstice)\b/,
  HebrewCalendarPlugin:
    /\b(Nisan|Iyyar|Sivan|Tamuz|Av|Elul|Tishrei|Cheshvan|Kislev|Tevet|Shvat|Adar)\b/,
  HijriCalendarPlugin:
    /\b(Muharram|Safar|Rabi al-awwal|Rabi al-thani|Jumada al-awwal|Jumada al-thani|Rajab|Shaban|Ramadan|Shawwal|Dhu al-Qidah|Dhu al-Hijjah)\b/,
  JulianCalendarPlugin: /\bjulian\b/,
  JalaaliCalendarPlugin:
    /\b(Farvardin|Ordibehesht|Khordad|Tir|Mordad|Shahrivar|Mehr|Aban|Azar|Dey|Bahman|Esfand)\b/,
  ChineseCalendarPlugin: /\b(chinese|vietnamese|korean)\b/,
  BengaliRevisedCalendarPlugin: /\bbengali-revised\b/,
  TibetanCalendarPlugin: /\b(tibetan|mongolian|bhutanese)\b/,
};

const config = {
  dirname: resolve(scriptDir, "..", "data"),
  countries: resolve(scriptDir, "..", "data", "countries"),
};

function Holidays2json(opts) {
  this.opts = opts || {};
  this.list = this.opts.list || [];
}
Holidays2json.prototype = {
  /**
   * get list of supported countries from directory
   */
  getList: function () {
    let list = fs.readdirSync(config.countries);
    list = list
      .map((file) => {
        if (REGEX.test(file)) {
          return file.replace(REGEX, "$1");
        } else {
          return undefined;
        }
      })
      .filter(function (file) {
        return file;
      })
      .sort();
    this.list = list;
    return this;
  },
  /**
   * load a single yaml file
   */
  load: function (cc, filename) {
    filename = filename || resolve(config.countries, cc + ".yaml");
    const data = fs.readFileSync(filename, "utf8");
    const obj = load(data);
    return obj;
  },
  /**
   * build `holidays.json file`
   */
  build: function () {
    const obj = this.load("0");
    obj.holidays = {};
    this.list.forEach(
      function (cc) {
        Object.assign(obj.holidays, this.load(cc).holidays);
      }.bind(this),
    );
    Object.assign(obj, this.load(null, resolve(config.dirname, "names.yaml")));

    if (this.opts.pick) {
      obj.holidays = _pick(obj.holidays, this.opts.pick);
    } else if (this.opts.omit) {
      obj.holidays = _omit(obj.holidays, this.opts.omit);
    }

    obj.version = new Date().toISOString().replace(/^(.*)T.*$/, "$1");
    this.holidays = obj;
    if (this.opts.min) {
      this.calendarPlugins = dive(obj)
    }

    return this;
  },
  /**
   * save holidays
   */
  save: function () {
    const json = JSON.stringify(this.holidays, null, 2) + "\n";
    fs.writeFileSync(resolve(config.dirname, "holidays.json"), json, "utf8");
    fs.writeFileSync(
      resolve(scriptDir, "..", "src", "data.js"),
      "export const data = " + json,
      "utf8",
    );

    const plugins = this.calendarPlugins;
    let source = "export { plugins } from 'date-holidays-parser/plugins'\n";
    if (plugins?.length) {
      const list = plugins.length ? `[\n  ${plugins.join(",\n  ")}\n]` : "[]";
      const imports = plugins.map(function (plugin) {
        return `import { ${plugin} } from 'date-holidays-parser/plugins/${plugin}'`;
      });
      source = [
        ...imports,
        ...(imports.length ? [""] : []),
        `/** @type {import('date-holidays-parser').CalendarPlugin<unknown>[]} */`,
        `export const plugins = ${list}`,
        "",
      ].join("\n");
    }
    fs.writeFileSync(
      resolve(scriptDir, "..", "src", "plugins.js"),
      source,
      "utf8",
    );

    if (fs.existsSync(resolve(scriptDir, "..", "lib"))) {
      fs.writeFileSync(
        resolve(scriptDir, "..", "lib", "data.cjs"),
        "exports.data = " + json,
        "utf8",
      );
      if (plugins?.length) {
        const plugins = this.calendarPlugins;
        const list = plugins.length ? `[\n  ${plugins.join(",\n  ")}\n]` : "[]";
        const requires = plugins.map(function (plugin) {
          return `const { ${plugin} } = require('date-holidays-parser/plugins/${plugin}')`;
        });
        const commonjs = [
          "'use strict'",
          "",
          ...requires,
          ...(requires.length ? [""] : []),
          `exports.plugins = ${list}`,
          "",
        ].join("\n");
        fs.writeFileSync(
          resolve(scriptDir, "..", "lib", "plugins.cjs"),
          commonjs,
          "utf8",
        );
      }
    }
  },
};
export default Holidays2json;

if (process.argv[1] && resolve(process.argv[1]) === scriptFile) {
  const args = process.argv.splice(2);

  const getOption = function (option) {
    const i = args.indexOf(option);
    if (i !== -1) {
      const list = (args[i + 1] || "").toUpperCase().split(",").sort();
      if (list && list.length) return list;
      return true;
    }
  };

  if (getOption("-h") || getOption("--help")) {
    console.log(
      [
        "",
        "holidays2json [options]",
        "",
        "translate holidays.yaml data to json",
        "",
        "-p|--pick   comma separated list of countries to pick",
        "            from holidays.json file",
        "-o|--omit   comma separated list of countries to omit",
        "            from holidays.json file",
        "-m|--min    minimize to calendar plugins used in data",
        "            without --pick/--omit, preserve the current src/plugins.js list",
        "",
        "NOTE: There are some countries which depend on data of others which",
        '      might render the file useless. e.g. "GU" requires "US", so try',
        "      to pick or omit both.",
        "",
        'Use in your build process in package.json "scripts" section.',
        '      "build" : "holidays2json -p US,CA,GU"',
        "and run then with `npm run build`",
        "",
      ].join("\n    "),
    );
    process.exit(0);
  }

  const opts = {
    pick: getOption("--pick") || getOption("-p"),
    omit: getOption("--omit") || getOption("-o"),
    min: getOption("--min") || getOption("-m"),
  };

  new Holidays2json(opts).getList().build().save();
}

/**
 * Find the CalendarPlugins required by the reduced data set.
 */
function dive(data) {
  const required = new Set();

  const visit = function (data) {
    switch (toString.call(data)) {
      case "[object Object]":
        Object.keys(data).forEach(function (key) {
          if (key === "days") {
            Object.keys(data[key]).forEach(function (rule) {
              Object.keys(CALENDAR_PLUGINS).forEach(function (plugin) {
                if (CALENDAR_PLUGINS[plugin].test(rule)) required.add(plugin);
              });
            });
          } else {
            visit(data[key]);
          }
        });
        break;
    }
  };

  visit(data);
  return Object.keys(CALENDAR_PLUGINS).filter(function (plugin) {
    return required.has(plugin);
  });
}
