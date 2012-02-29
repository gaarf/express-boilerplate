mongod:
	mongod run --config /usr/local/etc/mongod.conf

test:
	./node_modules/.bin/mocha --reporter spec

server:
	@@node server.js

.PHONY: mongod test server