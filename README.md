# express-boilerplate

A basic [Express](http://expressjs.com/) setup, hooked up with [mongoose-auth](https://github.com/bnoguchi/mongoose-auth/) and [Bootstrap](http://twitter.github.com/bootstrap/). Includes configuration files for deployment on [dotCloud](https://www.dotcloud.com/).

## to install:

### fetch dependencies
$ ```brew install mongodb```

$ ```npm i --link```

### rename (and maybe edit) secrets file
$ ```cp etc/example.secrets.js etc/secrets.js```

### re: mongoDB
Don't forget to run *mongod* before booting the app!


## to run the server:
$ ```node boot.js```


## to run tests:
$ ```make test```
