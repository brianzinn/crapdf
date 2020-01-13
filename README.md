# CRA-PDF Create React App - Portable Document Format
This is how you generate PDFs from React with less limitations.  Full access to SVG and custom React component renders and you don't need to build new components to render PDF.

The goals accomplished here are that we can use CRA and HMR to build our website as usual.  There is an Express server running in Node that creates and returns the PDF.

Tips:
1. Puppeteer versioning is tied to chrome versions (https://github.com/puppeteer/puppeteer/releases)
2. If you use docker, the alpine builds will change chromium versions.  You can otherwise stick to an 'edge' release.
3. Use the `dumpio` in `LaunchOptions` to log.  You may want to turn this off in prod, but is super helpful if you run into any rendering issues.


### Using Docker
```bash
$ docker build --rm -t crapdf .
...
Successfully built 0.......1
Successfully tagged crapdf:latest
```

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Without docker
You need to deploy a nodejs server.  To test start the /server in a separate window as HMR.
```bash
$ cd server
$ yarn build
$ yarn start
```

With postman or in another terminal, you can download the PDF from the `server`:
```bash
$ curl -X POST localhost:5001/entity/1 -o entity-1.pdf
$ curl -X POST localhost:5001/entity/2 -o entity-2.pdf
```

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


