test:
	mocha --reporter list

server:
	node boot.js

routes:
	node console.js routes

.PHONY: test routes