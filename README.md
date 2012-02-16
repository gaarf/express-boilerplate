# express-boilerplate

A basic [Express](http://expressjs.com/) setup, hooked up with [mongoose-auth](https://github.com/bnoguchi/mongoose-auth/) and [Bootstrap](http://twitter.github.com/bootstrap/)

## to install:

### fetch dependencies
$ npm i --link

### rename (and maybe edit) secrets file
$ cp etc/example.secrets.js etc/secrets.js

## to run tests:
$ make test

## to run the server:
!!! don't forget to configure &amp; run *mongod* before starting up the server !!!
$ node boot.js

