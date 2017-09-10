# TODO

- [x] New Date: Kobe Bryant day for `US-CA-LA`
  - [x] add active option as holiday is active since 2016
  - [x] document in `specification.md`
- [x] New Feature: Calculus for Chinese Dates
  - [x] parsing rules, update specification
  - [x] new CalEvent based on results from `date-chinese`
  - [x] other timezone as Asia/Shanghai
- [x] New Feature: Change build process for `holidays.json`. Allow building for single countries
  - [X] document in `README.md`
- [x] Change Rule: Move from `spring equinox` to `march equinox` to avoid confusions between southern/ northern hemisphere
- [x] New Rule: Allow `dateIf` Rule on any date - see `JP.yaml`
  ```
  march equinox in Asia/Tokyo and if sunday then next monday:
    substitute: true
    name:
      en: Spring Equinox Day
      jp: 春分の日
  ```
- [x] document disabling rule in states/ regions
- [x] active feature introduced with Kobe Bryant Day (US-CA-LA)
  - document
  - write test case
- [ ] split project in source and data
- [ ] New Feature: Calculus for Diwali (KE, SU, IN)
