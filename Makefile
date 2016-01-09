all: lint yaml writetests docs

yaml: data/holidays.json

data/holidays.json: data/holidays.yaml data/names.yaml
	npm run yaml

test: v0.12 v4.2 v5.2

v%:
	n $@ && mocha test/*.mocha.js

docs: tree README.md
	markedpp --githubid -i docs/specification.md -o docs/specification.md
	markedpp --githubid -i README.md -o README.md
	jsdox -o docs lib/Holidays.js

lint:
	npm run lint

tree: yaml
	node make/addtree.js

writetests: yaml
	mocha test/all.mocha.js --writetests

.PHONY: all doc lint test tree writetests yaml
