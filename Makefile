mongod:
	mongod run --config /usr/local/etc/mongod.conf

test:
	mocha --reporter spec

server:
	node boot.js

.PHONY: mongod test server