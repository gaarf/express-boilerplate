mongod:
	mongod run --config /usr/local/etc/mongod.conf

test:
	node_modules/.bin/mocha --reporter spec

server:
	node boot.js

.PHONY: mongod test server