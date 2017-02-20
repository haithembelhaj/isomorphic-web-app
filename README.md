# Isomophic Web App

Hello friend and welcome to the holy grail of web development.
This boilerplate is the result of years of experience with Web Apps and an attempt to create the most performant, modular and secure App.
This project is based on these key technologies:
- [docker](https://www.docker.com/) and [docker-compose](https://docs.docker.com/compose/)
- [nodejs](https://nodejs.org/en/) with [expressjs](http://expressjs.com/)
- [react](https://facebook.github.io/react/) with isomorphic rendering
- [sass](http://sass-lang.com/) for the styling

So buckle up and hold on tight :)

## Getting started
First of all you have to install [Docker](https://docs.docker.com/) and [nodejs](https://nodejs.org/en/) on your maschine.

### Start the docker server
To start the server just run on the root `docker-compose build` and then `docker-compose up`.
This will start a development server with [browserSync](https://browsersync.io/) and file watching.
Navigate to http://localhost:3001 to see the result.

## Project Structure

### backend

Every node app has to start somewhere. This app starts with `index.js`.
The app is just standard [expressjs](http://expressjs.com/) with a custom view renderer that renders react components to strings.
The app loads a lot of helpful libraries from `/lib`:
- assets: compiles javascript and styles asset files using [webpack](https://webpack.github.io/) and [node-sass](https://github.com/sass/node-sass)
- auth: authentication middleware using [passports](http://passportjs.org/)
- routes: all the route definition
- storage: the storage layer using [nedb](https://github.com/louischatriot/nedb) so it could be replaced with mongodb if needed
- content: loads structured page content. (see `data/pages/en/index.js` for an example of page content) 
- templating: renders react views to strings
- debug: a thin wrapper over [debug](https://github.com/visionmedia/debug) for better logging.
- utils: some helpful utils

I added these middlewares for bullet proof security:
- [helmet](https://helmetjs.github.io/)
- [csrf](https://github.com/expressjs/csurf)

### Frontend
All the frontend files are located under `/app`. The most imnportant part is components so let's start with that.

#### Components
A component is composed of three files:
- `template.jsx`: This is the template component. It's should be a pure function that return v-dom given some props. This file will be loaded by the server so make sure to not include things that node can't run.
- `client.js`: This file represents the container component loaded by the browser. It's a component that represent an extended version of the template. This component will use the template to render and add some state management.
- `styles.scss`: The styles of the component. These will be loaded automatically on compilation.

As you can see `template.jsx` is used in the client and server to render the same component. That how the isomorphic rendering works. 
The separation of client code and server code is necessary to achieve isomorphic rendering without much headache. (see `app/componets/hello/`)

__Notice__:

Components are surely composable and one component can load another. This should only happen in the pure land of the template components. 
In other worlds if component A needs B, the template component of A should load the template component of B.
That way the server will render only the pure templates given the props. 
For the client, Webpack will automatically load all the container templates and pass them the same props.
This could be confusing at first but when you get the grip of it, you will surely enjoy :)

#### Views
Views are just Components that represent a specific view. The only difference is that the `client.js` should attach the component to a root node. (see `app/views/index/`)

#### Assets
All the static assets will be copied to the public. In addition to that images will be compressed using [imagemin](https://github.com/imagemin/imagemin).  

#### libs and styles
Those folder represent the globally needed scripts or styles.

### npm scripts

To ease the workflow, I wrote some useful scripts:
- test: start the tests using [mocha](https://mochajs.org/).
- lighthouse: starts a [google lighthouse](https://developers.google.com/web/tools/lighthouse/) performance test. 
- compile: compiles a production build of all the assets.
- dev: watches assets for changes and start [browserSync](https://browsersync.io/) 

For a better understanding take a look at `package.json` and the `scripts` folder.
