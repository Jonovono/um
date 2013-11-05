TESTS = test/*.test.js
REPORTER = dot

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		$(TESTS)

init: 
	@echo "Creating the data repos"
	@echo "~um will store your projects that you source and create a nifty view."
	mkdir ~/um
	mkdir ~/une/um
	@echo "A data file will be created in the npm module directory to store the database."
	mkdir ./data

.PHONY: test init
