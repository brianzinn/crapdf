# CRA-PDF Create React App - Portable Document Format
Generate PDFs from React.  Full access to browser functionality including SVG while leveraging existing React components and libraries, so you don't need to create new components to generate PDFs.  ie: using the same code as your existing website (instead of adding new PDF specific components like `<View ...><Text ...></View`)

The goals accomplished here are that we can use CRA and HMR to build our website as usual.  There is an Express server running in Node that creates and returns the PDF using existing webpages.

Tips:
1. Puppeteer versioning is tied to chrome versions (https://github.com/puppeteer/puppeteer/releases)
2. If you use docker the alpine builds will change.  You can otherwise stick to versions for deterministic builds.
3. Use the `dumpio` in `LaunchOptions` to transfer browser logs to server logs.  You may want to turn this off in prod, but is super helpful if you run into any rendering issues.
4. Page breaks can be managed somewhat with CSS print media rules (https://www.w3schools.com/cssref/pr_print_pagebi.asp), so you can control page breaks after/before content, but also try to keep sections together (ie: `{page-break-inside: avoid;}`).

The server-side project runs on Node express server and renders your React pages as PDFs, so docker is just an optional container.

### Using Docker
```bash
$ docker build --rm -t crapdf .
...
Successfully built 0.......1
Successfully tagged crapdf:latest
```

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Without docker
You need to deploy a nodejs server.  To test start the /server in a separate window (can be set to use your development React server for PDF generationi).
```bash
$ cd server
$ yarn build
$ yarn start
```

With postman or in another terminal, you can download the PDF from the `server`:
```bash
$ curl -X POST localhost:5001/entity/1 -o entity-1.pdf
$ curl -X POST localhost:5001/entity/2 -o entity-2.pdf

curl -d '{"target":"png"}' -H "Content-Type: application/json" -X POST localhost:5001/stars/2 -o stars-2.png
```

You can also generate and have downloadable images of your webpage (or parts of webpage via CSS selectors).  These can be used for other PDF generation tools (ie: @react-pdf/renderer) or integrating your React site/graphs into programs like Slack (bot kit builder), MS Teams, etc.

Here we specify that we want a PNG image in our request, otherwise a PDF is generated.
```
$ curl -d '{"target":"png"}' -H "Content-Type: application/json" -X POST localhost:5001/stars/2 -o stars-4.png
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


