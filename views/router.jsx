const Layout = require('./layouts/html');
const { AppServer } = require('apps-inferno/src/router/RouterApp');
<Layout {...props}>
  <div id="router-app" >
  	<AppServer url={props.url} context={props.context}/>
  </div>
</Layout>