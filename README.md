# Express with JSX Engine and Universal Inferno App Example

## How to Run Example

`$ git clone https://github.com/kurdin/express-jsx-engine-universal-inferno-app-example`

`$ npm i`

Run in dev mode with webpack, goto http://localhost:8080 :

`$ npm run dev // or gulp`

You can edit any JSX view (SSR only) in `./views` reload page and see results
You can edit universal Counter app (SSR and Clinet) in `app-inferno/src/counter/Counter.jsx` reload page and see results.

Build all views and universal apps for production:

`$ npm run build`

Run server and application in production mode, goto http://localhost:3000 :

`$ npm run production`

**NOTE**: `master` branch uses Inferno `v3.10.1` to see same example with Inferno `4.x` use `inferno4` branch:

`$ git branch inferno4`

`$ rm -rf node_modules`

`$ npm i`

`$ npm run dev // or gulp`

Enjoy Inferno Universal App!
