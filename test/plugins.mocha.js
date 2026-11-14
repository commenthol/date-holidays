import assert from "assert";
import Holidays from "../src/index.js";
import { EasterCalendarPlugin } from "date-holidays-parser/plugins/EasterCalendarPlugin";

describe("#Calendar plugins", function () {
  it("uses built-ins by default and preserves explicit plugin selections", function () {
    const holidayOptions = () => ({
      type: "public",
      name: { en: "Test holiday" },
    });
    const defaultHolidays = new Holidays("US");
    assert.strictEqual(
      defaultHolidays.setHoliday("easter -3", holidayOptions()),
      true,
    );
    assert.strictEqual(
      defaultHolidays.setHoliday("julian 12-25", holidayOptions()),
      true,
    );

    const options = {
      plugins: [EasterCalendarPlugin],
      timezone: "UTC",
      languages: "en",
    };
    const selectedPluginHolidays = [
      new Holidays(options),
      new Holidays("US", options),
      new Holidays("US", "la", options),
      new Holidays("US", "la", "no", options),
    ];
    const previousError = console.error;
    try {
      console.error = () => {};
      for (const holidays of selectedPluginHolidays) {
        assert.strictEqual(
          holidays.setHoliday("easter -3", holidayOptions()),
          true,
        );
        assert.strictEqual(
          holidays.setHoliday("julian 12-25", holidayOptions()),
          false,
        );
      }

      const noPlugins = new Holidays("US", { plugins: [], timezone: "UTC" });
      assert.strictEqual(
        noPlugins.setHoliday("easter -3", holidayOptions()),
        false,
      );
    } finally {
      console.error = previousError;
    }
  });
});
