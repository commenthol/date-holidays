npmbin := $(shell npm bin)

all: lint lib yaml attributions docs
	npm test

yaml: data/holidays.json

data/holidays.json: data/countries/*.yaml data/names.yaml
	npm run yaml

lib: src/*
	npm run transpile

test: v4. v6. v8.

v%:
	n $@ && mocha

docs: tree README.md
	markedpp --githubid -i docs/specification.md -o docs/specification.md
	markedpp --githubid -i README.md -o README.md
	jsdox -o docs src/Holidays.js

lint:
	npm run lint

tree: yaml
	node scripts/addtree.js

writetests: yaml
	$(npmbin)/mocha test/all.mocha.js --writetests

attributions: LICENSE

LICENSE: data/countries/*.yaml
	node scripts/attributions.js

.PHONY: all doc lint test tree writetests yaml
