install:
	npm ci

publish:
	npm publish --dry-run

link:
	npm link

build:
	npm ci
	npm link	

lint:
	npx eslint .

test:
	npm test

test-coverage:
	npm test -- --coverage --coverageProvider=v8