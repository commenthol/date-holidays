# Contributing

Any contribution to this project is very welcome, especially holidays from new countries or updates.

Welcome.

## Contributing changes

If you like to add or change data please take a look at [holidays.yaml specification].

1. Fork the project
2. Create a branch for your changes
3. Create Json file and build the project:
   ```
   npm run yaml && npm run build
   ```
4. Modify the yaml file for the country your changes apply in `./data/countries/<code>.yaml` for holiday data and/or `./data/names.yaml` for translations as appropriate
5. Generate the new Json file from the yaml files with
   ```
   npm run yaml
   ```
6. Run the samples file with the country containing your changes, e.g. here for "at.w" (Austria, Vienna)
   ```
   node test/sample.js "at.w" 2016
   ```
   To check translation, e.g. English
   ```
   node test/sample.js "at.w" 2016 --lang en
   ```
7. Run the tests with
   ```
   npm test
   ```
8. If a new country was added there might be failing tests in Step 7.
   Generate these with:
   ```
   npx mocha test/all.mocha.js --writetests
   # OR only the changed country (e.g. AD)
   npx mocha test/all.mocha.js --writetests --countries AD
   ```
   Now check any changes with `git diff test/fixtures`. Make sure that your changes did not affect other countries.
9. Push your branch to GitHub and submit a pull request
10. Monitor the pull request to make sure the Travis build succeeds.
   If it fails simply make the necessary changes to your branch and push it.
Travis will re-test the changes.

That's it. If you don't feel comfortable forking the project or modifying the YAML you can also submit an issue that includes the appropriate holiday data and required rules.

Please do not forget to name your source of information.

Thanks!

[holidays.yaml specification]: ./docs/specification.md
