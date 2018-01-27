import { render } from 'inferno';
import { Counter } from './Counter';

if (process.env.NODE_ENV !== 'production') require('inferno-devtools');

let initProps = (window && window.appShared && window.appShared.initProps) || {};
let appElementId = (window && window.appShared && window.appShared.appElementId) || 'counter-app';

let el = document.getElementById(appElementId);

// console.log('Counter', Counter);

setTimeout(() => {
	render(<Counter {...initProps} />, el);
	console.log('rendered ');
}, 3000);
