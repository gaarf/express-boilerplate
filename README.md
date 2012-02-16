# express-boilerplate

A basic [Express](http://expressjs.com/) setup, hooked up with [mongoose-auth](https://github.com/bnoguchi/mongoose-auth/) and [Bootstrap](http://twitter.github.com/bootstrap/)

## to install:

### fetch dependencies
$ brew install mongodb && npm i --link

### rename (and maybe edit) secrets file
$ cp etc/example.secrets.js etc/secrets.js

## to run tests:
$ make test

## to run the server:
$ node boot.js

### mongoDB
Don't forget to run *mongod* before starting up the server! 
The database names are based on the pkg name.


