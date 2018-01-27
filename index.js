const express = require('express');
const app = express();
const argv = require('optimist').argv;
const isDev = isDevEnv();

require('express-engine-inferno-jsx').attachTo(app, {
  cache: __dirname + '/views/cache',
  views: __dirname + '/views',
  viewCache: isDev ? false : true,
  serverRoot: __dirname,
  appRoot: __dirname + '/apps-inferno/src',
  appSrc: 'apps-inferno/src',
  doctype: '<!DOCTYPE html>'
});

app.use(express.static('public'));

app.use('/test', (req, res) => {
	let test = Math.random()
		.toString(36)
		.substring(7);
	res.json(test);
});

app.get('/', function (req, res) {
	console.time('render time');

	let scripts = ['https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js'];
	let styles = ['https://ajax.googleapis.com/ajax/libs/jquerymobile/1.4.5/jquery.mobile.min.css'];

  res.render('test/users', {
    layout: 'layout-one',
    bundleScript: 'js/bundles/counter.js',
    serverRender: true,
    shared: {
      appElementId: 'counter-app',
      initProps: {
        count: 10,
        randomArray: getRandomArray(),
        testHash: Math.random().toString(36).substring(7)
      }
    },
    scripts: scripts,
    styles: styles,
    users: [
      {name: 'Max'},
      {name: 'Sergey'},
      {name: 'Bob'}
    ]
  });
  console.timeEnd('render time'); 
});

app.listen(argv.port || 3000, () => {
  console.log(`Environment is ${isDev ? 'Development' : 'Production'}`);
	console.log(`Express Server Listening on Port ${argv.port || 3000}`);
});

function isDevEnv() {
	return (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'testing' && process.env.NODE_ENV !== 'staging') ? true : false;
}

function getRandomArray() {
  return [...new Array(getRandom(20))].map(() => getRandom(10));
}

function getRandom(max, str) {
  let n = Math.floor(Math.random() * Math.floor(max));
  return n;
}