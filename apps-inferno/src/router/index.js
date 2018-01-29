import { render } from 'inferno';
import { BrowserRouter } from 'inferno-router';
import { App } from './RouterApp';

// This demo uses a HashRouter instead of BrowserRouter
// because there is no server to match URLs
render(
	<BrowserRouter basename="/router">
		<App />
	</BrowserRouter>,
	document.getElementById('router-app')
);
