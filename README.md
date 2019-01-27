# Oorlog

A tile based game. Conquer lands and expands you territory.

#### Requirements

- [node](https://nodejs.org/)
- [yarn](https://yarnpkg.com/en/)

#### Dependencies

Execute the following commands in the project directory.

```sh
yarn
```

#### Run development server

Run all commands in different terminals.

```sh
yarn server-dev # Hot compile and serve client files on a webserver
```

```sh
yarn client-dev # Hot compile server component
```

```sh
node './dist/server/server.js' # Run the server component
```

You'll have to restart the server component if you change any files.

#### Build production

```sh
yarn build
```

Place build `./dist/client` files on a webserver, these files should be served using http. Run the file `./dist/server/main_bundle.js` using nodejs.

#### License

Everything in [src/assets/field_elements](src/assets/field_elements) is [GPL 3](https://opensource.org/licenses/gpl-3.0.html). Anything not otherwise specified is [BSD 3](https://opensource.org/licenses/BSD-3-Clause).
