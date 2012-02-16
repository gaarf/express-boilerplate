mongod:
	mongod run --config /usr/local/etc/mongod.conf

test:
	mocha --reporter spec

server:
	node boot.js

routes:
	node console.js routes

.PHONY: mongod test server routes