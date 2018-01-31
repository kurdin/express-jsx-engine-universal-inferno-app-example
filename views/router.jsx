const Layout = require('./layouts/html');
const { RouterAppServer } = require('apps-inferno/src/router/RouterApp');
<Layout {...props}>
  <div id="router-app" >
  	<RouterAppServer url={props.url} context={props.context}/>
  </div>
</Layout>