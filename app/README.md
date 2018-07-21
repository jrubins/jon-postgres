# Jon Postgres

A PostgreSQL client.

## Development environment setup

#### Install Node.js and NPM

Node.js should be installed using [NVM](https://github.com/creationix/nvm). NVM is a Node.js version manager and allows you to easily install, switch between and uninstall different Node versions. The currently used version of Node.js can be found in our `package.json` file.

#### Install Yarn

[Yarn](https://yarnpkg.com/) is a much faster dependency manager than NPM created by Facebook.

**We don't recommend installing Yarn via Homebrew as it will also install Node.js if you don't yet have it and you may run into conflicts with what we install via NVM.**

Install Yarn using the following command:

```
npm -g install yarn
```

After installing Yarn, run the command:

```
which yarn
```

You should see output like the following:

```
/Users/{yourUser}/.nvm/versions/node/v8.6.0/bin/yarn
```

#### Starting the application

In order to start the application, we need to install our NPM dependencies, build our assets and start a local development server:

```
yarn start
```

This installs the dependencies from our `package.json` file, builds the app and starts a webpack-dev-server at [http://localhost:9999](http://localhost:9999). Our application uses hot-reloading so any changes made to the application files will be reloaded without a page reload.
