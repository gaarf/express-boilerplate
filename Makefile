mongod:
	mongod run --config /usr/local/etc/mongod.conf

test:
	npm run-script test

server:
	node boot.js

.PHONY: mongod test server