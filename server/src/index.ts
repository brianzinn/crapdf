import * as path from 'path';

import bodyParser from 'body-parser';
import { config } from 'dotenv';
import express from 'express';
import cors from 'cors';
import puppeteer, { WaitForSelectorOptions, LaunchOptions } from 'puppeteer';

// loads .env file to process.env
const ENV_FILE = path.join(__dirname, '../..', '.env');
console.log('env file:', ENV_FILE);
config({ path: ENV_FILE });

function PromiseTimeout(delayms: number) {
  return new Promise((resolve, reject) => {
      setTimeout(resolve, delayms);
  });
}

function waitForNetworkIdle(page: puppeteer.Page, timeout: number, maxInflightRequests = 0) {
  function onRequestStarted() {
    ++inflight;
    if (inflight > maxInflightRequests) {
      clearTimeout(timeoutId);
    }
  }
  
  function onRequestFinished() {
    if (inflight === 0) {
      return;
    }
    --inflight;
    if (inflight === maxInflightRequests) {
      timeoutId = setTimeout(onTimeoutDone, timeout);
    }
  }
  
  function onTimeoutDone() {
    page.removeListener('request', onRequestStarted);
    page.removeListener('requestfinished', onRequestFinished);
    page.removeListener('requestfailed', onRequestFinished);
    fulfill();
  }

  page.on('request', onRequestStarted);
  page.on('requestfinished', onRequestFinished);
  page.on('requestfailed', onRequestFinished);

  let inflight = 0;
  let fulfill: () => void;
  const promise = new Promise(x => fulfill = x);
  let timeoutId = setTimeout(onTimeoutDone, timeout);
  return promise;
}

const server = express()
    .use(cors())
    .use(bodyParser.json())
    .get('/api/v1/health', (req: express.Request, res: express.Response) => {
      res.setHeader('Content-Type', 'application/json');

      // Get the case-insensitive request header key, and optionally provide a default value 
      const host = req.header('host') || 'no-host';

      // This is for the health/readiness k8s probe
      res.send({ errors: [], host, success: true });
    })
    /**
     * API calls are running in context of Node, so for data retrieval can access backend storage/caches
     */
    .get('/api/entity/:entityId', async (req: express.Request, res: express.Response) => {
        const entityId: number = Number(req.params.entityId);

        res.setHeader('Content-Type', 'application/json');
        try {
            // const entity = await entityLoader.load(entityId);
            const entity = {
                id: entityId,
                name: `name-${entityId}`
            };

            const seconds = 2;
            console.log(`sleeping for ${seconds} seconds.`);
            await PromiseTimeout(seconds * 1000);

            // we write here in the log.  A failing render does so in minified js, so output can be used
            // to generate failing tests.
            const apiResponse = JSON.stringify(entity);
            console.log('Entity API response:' + apiResponse);
            res.end(apiResponse);
        } catch (e) {
            if (e.message) {
                res.end(`{"error":"${e.message}"}`);
            } else if (typeof e === 'object') {
                res.end(`{"error":"${JSON.stringify(e)}}"`);
            } else {
                res.end(`{"error":"${String(e)}"}`);
            }
        }
    })
  /**
   * Any POST not starting with 'api' is forwarded to React website and rendered with react router.
   */
  .post(/^(?!\/api).+/, async (req: express.Request, res: express.Response) => {

      /**
       * Open URL with puppeteer and return generated PDF from webpage.
       *
       * @param url
       */
      const getBuffer = async (url: string, target: string): Promise<Buffer> => {

        console.log('calling puppeteer for url:', url);

        const puppeteerOpts: LaunchOptions = {
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
          dumpio: true // this creates additional logs, but is crucial for debugging issues
        };

        // NODE_ENV is empty in production
        const environment = (process.env.NODE_ENV || 'production');
        console.log('env:', environment);

        if (environment !== 'development') {
          (puppeteerOpts as any).executablePath = '/usr/bin/chromium-browser';
        }

        const browser = await puppeteer.launch(puppeteerOpts);
        const page = await browser.newPage();

        try {
          await page.goto(url, {
            waitUntil: ['domcontentloaded', 'load', 'networkidle0']
          });
          const selector = 'div.loaded';
          // Wait for page content to be retrieved.
          let selectorExists: boolean = false;

          try {
            await page.waitForSelector(selector, {
              timeout: 10 * 1000 // default is 30 seconds
            } as WaitForSelectorOptions);
            selectorExists = true;
            // if you are loading ie: images in your loaded content
            await waitForNetworkIdle(page, 500, 0); // equivalent to 'networkidle0'
          } catch (error) {
            console.log('waitForSelector Error:' + error.name);

            // waitForSelector(...) can throw (and early) when selector exists!!
            selectorExists = await page.evaluate(() =>
              Boolean(document.querySelector(selector))
            );
            console.log('exists: ' + selectorExists);
          }

          switch (target) {
            case 'png':
              // declare a variable with an ElementHandle
              // const element = await page.$('div.loaded');
              // element.screenshot(...)
              return await page.screenshot({
                clip: {
                  x: 0,
                  y: 0,
                  width: 180,
                  height: 80
                },
                type: 'png' // 'jpeg' also supported
              });
            default:
              // await page.emulateMedia('screen'); // actually we want to use @media print CSS
              // https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagepdfoptions
              return await page.pdf({
                format: 'A4',
                printBackground: true,
                margin: {
                  top: '48px',
                  bottom: '48px',
                  left: '42px',
                  right: '42px'
                }
              });
          }
        } finally {
          await browser.close();
        }
      };

      console.log('generate-attachment incoming url:', req.url);

      const puppeteerPort: number = Number(process.env.REACT_APP_PORT || process.env.SERVER_PORT || 5001);

      // You can add custom code here to attach querystring args or any additional parameters (ie: security)
      // REACT_APP_PORT uses static site served by ExpressJS or 3000 when testing HMR site:
      const websiteUrl = `http://localhost:${puppeteerPort}${req.url}`;

      // If you want to return other formats besides PDF (ie: screenshot, markdown, JSON, etc.) can be done here:
      const target = (req.body ? req.body.target : undefined) || 'pdf';
      const resultBuffer = await getBuffer(websiteUrl, target);

      const contentType = (target === 'pdf')
        ? 'application/pdf'
        : 'image/png';

      res.set({
        'Content-Length': String(resultBuffer.length),
        'Content-Type': contentType
      });
      res.send(resultBuffer);
})
/**
 * This is where the CRA3 website is deployed in production.  Server matching files (ie: resources)
 */
.use(express.static(path.join(__dirname, '../../../..', 'build')))
// Direct requests like /entity/1 to index (React router will handle rest)
.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../..', 'build/index.html'));
});

// this port is exposed from container.
const port: number = Number(process.env.SERVER_PORT || 5001);

server.listen(port, (err: Error) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(`> 'crapdf' server started on port ${port}`);
});