all: lint yaml attributions writetests docs

yaml: data/holidays.json

data/holidays.json: data/holidays.yaml data/names.yaml
	npm run yaml

test: v0.12 v4. v6. v7.

v%:
	n $@ && mocha test/*.mocha.js

docs: tree README.md
	markedpp --githubid -i docs/specification.md -o docs/specification.md
	markedpp --githubid -i README.md -o README.md
	jsdox -o docs lib/Holidays.js

lint:
	npm run lint

tree: yaml
	node build/addtree.js

writetests: yaml
	mocha test/all.mocha.js --writetests

attributions: LICENSE

LICENSE: data/holidays.yaml
	node build/attributions.js $< $@

.PHONY: all doc lint test tree writetests yaml
