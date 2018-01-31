import { render, version } from 'inferno';
import Counter from './Counter';

console.log('inferno version:', version);
console.time('rendered on client in');

if (process.env.NODE_ENV !== 'production') require('inferno-devtools');

let initProps = (window && window.appShared && window.appShared.initProps) || {};
let appElementId = (window && window.appShared && window.appShared.appElementId) || 'counter-app';

let el = document.getElementById(appElementId);

render(<Counter {...initProps} />, el);
console.timeEnd('rendered on client in');
