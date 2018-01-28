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

```shell

## Perf test under load

$ npm run build // create production build
$ npm run production // run production with all views and components cached
$ autocannon -c 100 -d 1000 -l http://localhost:3000
Running 1000s test @ http://localhost:3000
100 connections

Stat         Avg     Stdev  Max     
Latency (ms) 37.82   5.27   105     
Req/Sec      2610.83 99.58  2741    
Bytes/Sec    3.43 MB 135 kB 3.67 MB 

Percentile      Latency (ms)      
50              37                
75              38                
90              42                
99              59                
99.9            67                
99.99           77                
99.999          94                

2610k requests in 1000s, 3.42 GB read

```
Results are excellent avg 2k requests in 1 sec :)

Enjoy Inferno Universal App!
